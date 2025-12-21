const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Auto-complete sessions that are past their scheduled time
// This endpoint can be called manually or by a scheduled trigger
app.http('autoCompleteSessions', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    route: 'jobs/auto-complete',
    handler: async (request, context) => {
        try {
            // Require secret key to prevent unauthorized access
            const secretKey = request.headers.get('x-autocomplete-secret') ||
                new URL(request.url).searchParams.get('secret');
            const expectedSecret = process.env.AUTOCOMPLETE_SECRET || 'punjabi-learn-2024';

            if (secretKey !== expectedSecret) {
                return { status: 403, jsonBody: { error: "Invalid or missing secret key" } };
            }

            const bookingsContainer = await getContainer("bookings");

            // Get current time and calculate cutoff (24 hours ago)
            const now = new Date();
            const cutoffDate = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
            const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

            context.log(`Auto-completing sessions before ${cutoffDateStr}`);

            // Find sessions that should be auto-completed:
            // - paymentStatus = 'paid'
            // - status = 'confirmed' (not already completed, cancelled, or disputed)
            // - date < 24 hours ago
            const { resources: sessionsToComplete } = await bookingsContainer.items
                .query({
                    query: `SELECT * FROM c WHERE c.paymentStatus = 'paid' 
                            AND c.status = 'confirmed' 
                            AND c.date < @cutoffDate`,
                    parameters: [
                        { name: "@cutoffDate", value: cutoffDateStr }
                    ]
                })
                .fetchAll();

            context.log(`Found ${sessionsToComplete.length} sessions to auto-complete`);

            // Update each session to 'completed'
            let completedCount = 0;
            for (const session of sessionsToComplete) {
                try {
                    session.status = 'completed';
                    session.completedAt = now.toISOString();
                    session.completedBy = 'auto';

                    await bookingsContainer.items.upsert(session);
                    completedCount++;
                } catch (err) {
                    context.log.error(`Failed to complete session ${session.id}:`, err);
                }
            }

            return {
                status: 200,
                jsonBody: {
                    message: `Auto-completed ${completedCount} sessions`,
                    cutoffDate: cutoffDateStr,
                    sessionsProcessed: sessionsToComplete.length,
                    sessionsCompleted: completedCount
                }
            };
        } catch (error) {
            context.log.error("Error in auto-complete:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Student can dispute a session (teacher didn't show up)
app.http('disputeSession', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'bookings/{bookingId}/dispute',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            const bookingId = request.params.bookingId;
            const body = await request.json();
            const { reason } = body;

            if (!reason) {
                return { status: 400, jsonBody: { error: "Please provide a reason for the dispute" } };
            }

            const bookingsContainer = await getContainer("bookings");

            // Find the booking
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: bookingId }]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 404, jsonBody: { error: "Booking not found" } };
            }

            const booking = bookings[0];

            // Verify the user is the student who booked
            if (booking.studentEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "Only the student can dispute this session" } };
            }

            // Check if session is eligible for dispute (paid and not already disputed)
            if (booking.paymentStatus !== 'paid') {
                return { status: 400, jsonBody: { error: "Cannot dispute an unpaid session" } };
            }

            if (booking.status === 'disputed') {
                return { status: 400, jsonBody: { error: "Session already disputed" } };
            }

            if (booking.status === 'cancelled') {
                return { status: 400, jsonBody: { error: "Cannot dispute a cancelled session" } };
            }

            // Mark as disputed
            booking.status = 'disputed';
            booking.disputedAt = new Date().toISOString();
            booking.disputeReason = reason;
            booking.disputedBy = userEmail;

            await bookingsContainer.items.upsert(booking);

            return {
                status: 200,
                jsonBody: {
                    message: "Session disputed successfully. Admin will review.",
                    booking: {
                        id: booking.id,
                        status: booking.status,
                        disputeReason: booking.disputeReason
                    }
                }
            };
        } catch (error) {
            context.log.error("Error disputing session:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
