const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Basic keyword filter for inappropriate content
const BLOCKED_KEYWORDS = [
    // Add inappropriate words/phrases here
    'inappropriate1', 'inappropriate2'
];

const WARNING_KEYWORDS = [
    'phone', 'number', 'email', 'address', 'meet outside', 'personal'
];

function moderateContent(text) {
    const lowerText = text.toLowerCase();

    // Check for blocked content
    for (const keyword of BLOCKED_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            return { passed: false, reason: 'Message contains inappropriate content' };
        }
    }

    // Check for warnings (allowed but flagged)
    const warnings = [];
    for (const keyword of WARNING_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            warnings.push(keyword);
        }
    }

    return {
        passed: true,
        warnings: warnings.length > 0 ? warnings : null,
        warningMessage: warnings.length > 0 ? 'Please be careful about sharing personal information' : null
    };
}

// Get conversations for a user
app.http('getConversations', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'conversations',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userId = principal.userId;

            const container = await getContainer('messages');

            // Get unique conversations for this user
            const { resources: messages } = await container.items
                .query({
                    query: 'SELECT DISTINCT c.conversationId, c.recipientId, c.senderId, c.senderName FROM c WHERE c.senderId = @userId OR c.recipientId = @userId ORDER BY c.timestamp DESC',
                    parameters: [{ name: '@userId', value: userId }]
                })
                .fetchAll();

            // Group by conversation and get last message
            const conversationMap = new Map();
            for (const msg of messages) {
                if (!conversationMap.has(msg.conversationId)) {
                    conversationMap.set(msg.conversationId, msg);
                }
            }

            return { jsonBody: Array.from(conversationMap.values()) };
        } catch (error) {
            context.error('Error getting conversations:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Get messages for a conversation
app.http('getMessages', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages/{conversationId}',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userId = principal.userId;
            const conversationId = request.params.conversationId;

            const container = await getContainer('messages');

            // Get messages for this conversation
            const { resources: messages } = await container.items
                .query({
                    query: 'SELECT * FROM c WHERE c.conversationId = @conversationId ORDER BY c.timestamp ASC',
                    parameters: [{ name: '@conversationId', value: conversationId }]
                })
                .fetchAll();

            // Verify user is part of this conversation
            if (messages.length > 0) {
                const firstMsg = messages[0];
                if (firstMsg.senderId !== userId && firstMsg.recipientId !== userId) {
                    return { status: 403, jsonBody: { error: 'Not authorized to view this conversation' } };
                }
            }

            // Mark messages as read
            for (const msg of messages) {
                if (msg.recipientId === userId && !msg.isRead) {
                    msg.isRead = true;
                    await container.item(msg.id, msg.conversationId).replace(msg);
                }
            }

            return { jsonBody: messages };
        } catch (error) {
            context.error('Error getting messages:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Send a message
app.http('sendMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'messages',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userId = principal.userId;
            const userEmail = principal.userDetails;

            const body = await request.json();
            const { recipientId, recipientName, content, bookingId } = body;

            if (!recipientId || !content) {
                return { status: 400, jsonBody: { error: 'Recipient and content are required' } };
            }

            // Content moderation
            const moderation = moderateContent(content);
            if (!moderation.passed) {
                return { status: 400, jsonBody: { error: moderation.reason, blocked: true } };
            }

            // Verify they have a booking together (security check)
            // Check by both userId AND email since tutorId in booking != userId from auth
            const bookingsContainer = await getContainer('bookings');
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: `SELECT * FROM c WHERE 
                        (c.studentId = @user1 AND c.tutorId = @user2) OR 
                        (c.studentId = @user2 AND c.tutorId = @user1) OR
                        (c.studentEmail = @email1 AND c.tutorEmail = @email2) OR
                        (c.studentEmail = @email2 AND c.tutorEmail = @email1) OR
                        (c.studentId = @user1 AND c.tutorEmail = @email2) OR
                        (c.studentEmail = @email1 AND c.tutorId = @user2) OR
                        (c.tutorEmail = @email1) OR
                        (c.studentEmail = @email1)`,
                    parameters: [
                        { name: '@user1', value: userId },
                        { name: '@user2', value: recipientId },
                        { name: '@email1', value: userEmail },
                        { name: '@email2', value: recipientId }
                    ]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 403, jsonBody: { error: 'You can only message users you have bookings with' } };
            }

            // Get sender name from users container
            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userId = @userId',
                    parameters: [{ name: '@userId', value: userId }]
                })
                .fetchAll();

            const senderName = users.length > 0 ? users[0].name : userEmail;

            // Create conversation ID (consistent ordering)
            const ids = [userId, recipientId].sort();
            const conversationId = `conv_${ids[0]}_${ids[1]}`;

            const messagesContainer = await getContainer('messages');

            const message = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                conversationId,
                senderId: userId,
                senderEmail: userEmail,
                senderName,
                recipientId,
                recipientName: recipientName || 'Unknown',
                content,
                timestamp: new Date().toISOString(),
                isRead: false,
                bookingId: bookingId || null,
                moderation: {
                    passed: true,
                    warnings: moderation.warnings
                }
            };

            await messagesContainer.items.create(message);

            return {
                jsonBody: {
                    ...message,
                    warning: moderation.warningMessage
                }
            };
        } catch (error) {
            context.error('Error sending message:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Report a message
app.http('reportMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'messages/{messageId}/report',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userId = principal.userId;
            const messageId = request.params.messageId;
            const body = await request.json();
            const { reason } = body;

            // Store the report (you could create a separate reports container)
            const container = await getContainer('messages');

            // Find the message
            const { resources: messages } = await container.items
                .query({
                    query: 'SELECT * FROM c WHERE c.id = @messageId',
                    parameters: [{ name: '@messageId', value: messageId }]
                })
                .fetchAll();

            if (messages.length === 0) {
                return { status: 404, jsonBody: { error: 'Message not found' } };
            }

            const message = messages[0];

            // Add report to message
            message.reports = message.reports || [];
            message.reports.push({
                reportedBy: userId,
                reason,
                timestamp: new Date().toISOString()
            });

            await container.item(message.id, message.conversationId).replace(message);

            return { jsonBody: { success: true, message: 'Report submitted. Our team will review it.' } };
        } catch (error) {
            context.error('Error reporting message:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Get unread message count
app.http('getUnreadCount', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages/unread/count',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userId = principal.userId;

            const container = await getContainer('messages');

            const { resources } = await container.items
                .query({
                    query: 'SELECT VALUE COUNT(1) FROM c WHERE c.recipientId = @userId AND c.isRead = false',
                    parameters: [{ name: '@userId', value: userId }]
                })
                .fetchAll();

            return { jsonBody: { unreadCount: resources[0] || 0 } };
        } catch (error) {
            context.error('Error getting unread count:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
