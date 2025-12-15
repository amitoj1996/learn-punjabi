const { app } = require('@azure/functions');

app.http('pingTwo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'ping-two',
    handler: async (request, context) => {
        return { body: "Pong Two" };
    }
});
