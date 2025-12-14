const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('createTeacherApplication', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'teachers/apply',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing teacher application.');

        try {
            const applicationData = await request.json();

            // Basic validation
            if (!applicationData.email || !applicationData.fullName) {
                return { status: 400, body: JSON.stringify({ error: "Missing required fields" }) };
            }

            const container = await getContainer('applications');

            // Add metadata
            const newApplication = {
                id: new Date().getTime().toString(), // Simple ID generation
                ...applicationData,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            const { resource: createdItem } = await container.items.create(newApplication);

            return { status: 201, body: JSON.stringify(createdItem) };

        } catch (error) {
            context.log('Error processing application:', error);
            if (error.message.includes("COSMOS_DB")) {
                return {
                    status: 503,
                    body: JSON.stringify({ error: "Database connection not configured." })
                };
            }
            return { status: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
        }
    }
});
