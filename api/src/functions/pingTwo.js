const { app } = require('@azure/functions');

const { getContainer } = require('./config/cosmos');

app.http('pingTwo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'ping-two',
    handler: async (request, context) => {
        try {
            // Test 1: Env Var Check
            const connString = process.env.COSMOS_DB_CONNECTION_STRING;
            if (!connString) {
                return { status: 200, body: "Error: COSMOS_DB_CONNECTION_STRING is missing." };
            }

            // Test 2: Import & Container Check
            // context.log("Attempting DB Connect"); // Commented out to reduce crash surface
            const container = await getContainer("users");

            return { body: `Pong Two - Database Connected! Container ID: ${container.id}` };
        } catch (err) {
            return {
                status: 200, // Return 200 so we can see the body even if app thinks it failed
                body: `Error Caught: ${err.message}`
            };
        }
    }
});
