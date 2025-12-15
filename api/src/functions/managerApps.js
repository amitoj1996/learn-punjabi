const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getManagerApps', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/applications',
    handler: async (request, context) => {
        context.log('Manager Apps Handler Started');

        try {
            // 1. Verify Admin/Manager Role
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                context.log('Missing client principal header');
                return {
                    status: 401,
                    body: JSON.stringify({ error: "Unauthorized: Please log in" })
                };
            }

            let clientPrincipal;
            try {
                clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
                context.log('Client Principal User ID:', clientPrincipal.userId);
            } catch (e) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: `Failed to parse credentials: ${e.message}` })
                };
            }

            // 2. Security Check - Verify Admin Role
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: clientPrincipal.userId }]
                })
                .fetchAll();

            context.log('User lookup result:', users.length > 0 ? users[0].role : 'not found');

            if (!users[0] || users[0].role !== 'admin') {
                return {
                    status: 403,
                    body: JSON.stringify({
                        error: "Forbidden",
                        message: "Admin access required",
                        yourRole: users[0] ? users[0].role : "user not found"
                    })
                };
            }

            // 3. Fetch Pending Applications from Database
            const appsContainer = await getContainer("applications");
            const { resources: pendingItems } = await appsContainer.items
                .query("SELECT * FROM c WHERE c.status = 'pending'")
                .fetchAll();

            context.log('Found pending applications:', pendingItems.length);

            return {
                status: 200,
                body: JSON.stringify(pendingItems)
            };

        } catch (error) {
            context.log.error("Error in getManagerApps:", error);
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    message: error.message,
                    hint: "Check database connection and container names"
                })
            };
        }
    }
});
