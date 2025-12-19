const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Basic keyword filter for inappropriate content
const BLOCKED_KEYWORDS = ['inappropriate1', 'inappropriate2'];
const WARNING_KEYWORDS = ['phone', 'number', 'address', 'meet outside'];

function moderateContent(text) {
    const lowerText = text.toLowerCase();
    for (const keyword of BLOCKED_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            return { passed: false, reason: 'Message contains inappropriate content' };
        }
    }
    const warnings = WARNING_KEYWORDS.filter(kw => lowerText.includes(kw.toLowerCase()));
    return {
        passed: true,
        warnings: warnings.length > 0 ? warnings : null,
        warningMessage: warnings.length > 0 ? 'Please be careful about sharing personal information' : null
    };
}

// Helper to create consistent conversation ID from two emails
function makeConversationId(email1, email2) {
    const emails = [email1.toLowerCase(), email2.toLowerCase()].sort();
    // Create a simple, clean conversation ID
    return `chat_${emails.join('_').replace(/[^a-z0-9_]/g, '')}`;
}

// Get all messages for a user (by their email - works for both students and teachers)
app.http('getChatMessages', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'chat/messages/{partnerEmail}',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userEmail = principal.userDetails;
            const partnerEmail = decodeURIComponent(request.params.partnerEmail);

            const conversationId = makeConversationId(userEmail, partnerEmail);
            context.log('Getting messages for conversation:', conversationId);

            const container = await getContainer('messages');
            const { resources: messages } = await container.items
                .query({
                    query: 'SELECT * FROM c WHERE c.conversationId = @convId ORDER BY c.timestamp ASC',
                    parameters: [{ name: '@convId', value: conversationId }]
                })
                .fetchAll();

            context.log('Found messages:', messages.length);
            return { jsonBody: messages };
        } catch (error) {
            context.error('Error getting messages:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Send a message
app.http('sendChatMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'chat/send',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const senderEmail = principal.userDetails;

            const body = await request.json();
            const { recipientEmail, recipientName, content } = body;

            context.log('Sending message from', senderEmail, 'to', recipientEmail);

            if (!recipientEmail || !content) {
                return { status: 400, jsonBody: { error: 'Recipient email and content are required' } };
            }

            // Content moderation
            const moderation = moderateContent(content);
            if (!moderation.passed) {
                return { status: 400, jsonBody: { error: moderation.reason, blocked: true } };
            }

            // Verify they have a booking together
            const bookingsContainer = await getContainer('bookings');
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: `SELECT * FROM c WHERE 
                        (c.studentEmail = @email1 AND c.tutorEmail = @email2) OR
                        (c.studentEmail = @email2 AND c.tutorEmail = @email1)`,
                    parameters: [
                        { name: '@email1', value: senderEmail },
                        { name: '@email2', value: recipientEmail }
                    ]
                })
                .fetchAll();

            if (bookings.length === 0) {
                context.log('No booking found between', senderEmail, 'and', recipientEmail);
                return { status: 403, jsonBody: { error: 'You can only message users you have bookings with' } };
            }

            // Get sender name from tutors or use email
            let senderName = senderEmail.split('@')[0];
            try {
                const tutorsContainer = await getContainer('tutors');
                const { resources: tutors } = await tutorsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: senderEmail }]
                    })
                    .fetchAll();
                if (tutors.length > 0) {
                    senderName = tutors[0].name;
                }
            } catch (e) {
                // Ignore, use email username
            }

            const conversationId = makeConversationId(senderEmail, recipientEmail);
            context.log('Creating message with conversationId:', conversationId);

            const messagesContainer = await getContainer('messages');
            const message = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                conversationId,
                senderEmail,
                senderName,
                recipientEmail,
                recipientName: recipientName || recipientEmail.split('@')[0],
                content,
                timestamp: new Date().toISOString(),
                isRead: false
            };

            await messagesContainer.items.create(message);
            context.log('Message created successfully:', message.id);

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

// Get chat partners (people user can chat with based on bookings)
app.http('getChatPartners', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'chat/partners',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userEmail = principal.userDetails;

            context.log('Getting chat partners for:', userEmail);

            const bookingsContainer = await getContainer('bookings');
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.studentEmail = @email OR c.tutorEmail = @email',
                    parameters: [{ name: '@email', value: userEmail }]
                })
                .fetchAll();

            // Extract unique chat partners
            const partnersMap = new Map();
            for (const booking of bookings) {
                if (booking.studentEmail === userEmail) {
                    // User is student, partner is tutor
                    if (!partnersMap.has(booking.tutorEmail)) {
                        partnersMap.set(booking.tutorEmail, {
                            email: booking.tutorEmail,
                            name: booking.tutorName || booking.tutorEmail.split('@')[0]
                        });
                    }
                } else if (booking.tutorEmail === userEmail) {
                    // User is tutor, partner is student
                    if (!partnersMap.has(booking.studentEmail)) {
                        partnersMap.set(booking.studentEmail, {
                            email: booking.studentEmail,
                            name: booking.studentEmail.split('@')[0]
                        });
                    }
                }
            }

            const partners = Array.from(partnersMap.values());
            context.log('Found partners:', partners.length);
            return { jsonBody: partners };
        } catch (error) {
            context.error('Error getting chat partners:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
