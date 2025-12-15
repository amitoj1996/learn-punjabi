const { app } = require('@azure/functions');

app.http('newAdminProbe', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'admin-debug',
    handler: async (request, context) => {
        return { body: "New Admin File Works!" };
    }
});
