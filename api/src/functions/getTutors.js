const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getTutors', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'tutors',
    handler: async (request, context) => {
        try {
            const container = await getContainer("tutors");
            // Only return active (non-suspended) tutors
            const { resources: tutors } = await container.items
                .query("SELECT * FROM c WHERE (c.status != 'suspended' OR NOT IS_DEFINED(c.status)) AND (c.isActive = true OR NOT IS_DEFINED(c.isActive))")
                .fetchAll();

            return {
                status: 200,
                body: JSON.stringify(tutors)
            };
        } catch (error) {
            context.log.error("Error fetching tutors:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
