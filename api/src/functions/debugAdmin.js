const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Debug endpoint to check admin status and email matching
app.http('debugAdmin', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'debug/admin',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const userRoles = clientPrincipal.userRoles || [];

            // Query users table for admin status
            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.role = @role',
                    parameters: [{ name: '@role', value: 'admin' }]
                })
                .fetchAll();

            // Also try to find this specific user
            const { resources: currentUser } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userDetails = @email',
                    parameters: [{ name: '@email', value: userEmail }]
                })
                .fetchAll();

            return {
                status: 200,
                jsonBody: {
                    authInfo: {
                        userEmail,
                        userRoles,
                        fullPrincipal: clientPrincipal
                    },
                    currentUserInDb: currentUser[0] || null,
                    allAdmins: users.map(u => ({
                        userDetails: u.userDetails,
                        role: u.role,
                        userId: u.userId
                    }))
                }
            };
        } catch (error) {
            context.log.error("Debug error:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
