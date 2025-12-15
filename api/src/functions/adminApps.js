const { app } = require('@azure/functions');

app.http('adminAppsProbe', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'admin-test',
    handler: async (request, context) => {
        return { body: "Admin File Loaded Successfully" };
    }
});
