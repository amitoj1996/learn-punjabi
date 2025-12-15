const { app } = require('@azure/functions');
if (!global.crypto) {
    global.crypto = require('crypto');
}
const { getContainer } = require('./config/cosmos');

app.http('getTutors', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'tutors',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing request for tutors.');

        try {
            const container = await getContainer('tutors');

            // Fetch all tutors (careful with large datasets in production, add pagination later)
            const { resources: tutors } = await container.items
                .query("SELECT * from c")
                .fetchAll();

            return { body: JSON.stringify(tutors) };
        } catch (error) {
            context.log('Error fetching tutors:', error);

            // Graceful degradation for when DB isn't set up yet
            if (error.message.includes("COSMOS_DB")) {
                return {
                    status: 503,
                    body: JSON.stringify({ error: "Database connection not configured." })
                };
            }

            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    details: error.message,
                    stack: error.stack
                })
            };
        }
    }
});
