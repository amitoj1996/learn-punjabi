const { app } = require('@azure/functions');

// TEMPORARY DEBUG: Removed DB dependency to see if function loads
app.http('adminAppsV2', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'admin/apps-v2',
    handler: async (request, context) => {
        context.log('Using Mock Admin Handler for Debugging');

        return {
            status: 200,
            body: JSON.stringify({
                data: [
                    {
                        id: "mock-1",
                        userId: "mock-user",
                        fullName: "Debug Candidate",
                        email: "debug@example.com",
                        hourlyRate: 50,
                        experienceLevel: "professional",
                        bio: "This is a mock application to test connectivity.",
                        status: "pending",
                        submittedAt: new Date().toISOString()
                    }
                ],
                debug: {
                    message: "If you see this, the API Route is WORKING. The DB connection was the problem."
                }
            })
        };
    }
});
