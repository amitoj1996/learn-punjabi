const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getManagerApps', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/applications',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing manager/applications.');

        // 1. Verify Admin/Manager Role
        const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
        if (!clientPrincipalHeader) {
            return { status: 401, body: "Unauthorized" };
        }
        const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));

        try {
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: clientPrincipal.userId }]
                })
                .fetchAll();

            if (!users[0] || users[0].role !== 'admin') {
                return { status: 403, body: "Forbidden: Manager Access Required" };
            }

            // 2. Fetch Pending Applications
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
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
