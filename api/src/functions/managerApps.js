const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getManagerApps', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/applications',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing manager/applications.');

        try {
            // 1. Verify Admin/Manager Role
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Unauthorized: Missing Client Principal" }) };
            }

            let clientPrincipal;
            try {
                clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            } catch (e) {
                throw new Error(`Failed to parse client principal: ${e.message}`);
            }

            // 2. Security Check
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: clientPrincipal.userId }]
                })
                .fetchAll();

            if (!users[0] || users[0].role !== 'admin') {
                return {
                    status: 403,
                    body: JSON.stringify({
                        error: "Forbidden",
                        message: "Manager/Admin Access Required",
                        userRole: users[0] ? users[0].role : "unknown"
                    })
                };
            }

            // 3. Fetch Pending Applications
            const appsContainer = await getContainer("applications");
            const { resources: pendingItems } = await appsContainer.items
                .query("SELECT * FROM c WHERE c.status = 'pending'")
                .fetchAll();

            return {
                status: 200,
                body: JSON.stringify(pendingItems)
            };

        } catch (error) {
            context.log.error("Error in getManagerApps:", error);
            // DEBUG: Return error details to client
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    message: error.message,
                    stack: error.stack
                })
            };
        }
    }
});
