const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// TEST ONLY: Force complete all paid bookings for testing
app.http('forceCompleteAll', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    route: 'jobs/force-complete-all',
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
            const now = new Date();

            // Find all paid sessions with status 'confirmed'
            const { resources: sessionsToComplete } = await bookingsContainer.items
                .query({
                    query: `SELECT * FROM c WHERE c.paymentStatus = 'paid' 
                            AND (c.status = 'confirmed' OR NOT IS_DEFINED(c.status))`
                })
                .fetchAll();

            context.log(`Found ${sessionsToComplete.length} sessions to force-complete`);

            // Update each session to 'completed'
            let completedCount = 0;
            for (const session of sessionsToComplete) {
                try {
                    session.status = 'completed';
                    session.completedAt = now.toISOString();
                    session.completedBy = 'test-force';

                    await bookingsContainer.items.upsert(session);
                    completedCount++;
                } catch (err) {
                    context.log.error(`Failed to complete session ${session.id}:`, err);
                }
            }

            return {
                status: 200,
                jsonBody: {
                    message: `Force-completed ${completedCount} sessions for testing`,
                    sessionsProcessed: sessionsToComplete.length,
                    sessionsCompleted: completedCount
                }
            };
        } catch (error) {
            context.log.error("Error in force-complete:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
