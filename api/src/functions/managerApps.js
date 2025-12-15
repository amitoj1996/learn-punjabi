const { app } = require('@azure/functions');

app.http('getManagerApps', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/applications',
    handler: async (request, context) => {
        context.log('Manager Apps Handler Started');

        // Return mock data to verify the function loads
        return {
            status: 200,
            body: JSON.stringify([
                {
                    id: "mock-test-1",
                    userId: "test-user",
                    name: "Test Teacher",
                    email: "test@example.com",
                    bio: "This is a mock teacher application for testing.",
                    hourlyRate: 50,
                    status: "pending",
                    submittedAt: new Date().toISOString()
                }
            ])
        };
    }
});
