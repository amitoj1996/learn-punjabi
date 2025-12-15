const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getAdminApps', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'admin/applications',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing getAdminApps.');

        // 1. Verify Admin Role
        const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
        if (!clientPrincipalHeader) {
            return { status: 401, body: "Unauthorized" };
        }
        const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));

        // Better Security: Fetch user from DB to verify role
        try {
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: clientPrincipal.userId }]
                })
                .fetchAll();

            if (!users[0] || users[0].role !== 'admin') {
                return { status: 403, body: "Forbidden: Admin Access Required" };
            }

            // 2. Fetch Pending Applications
            const appsContainer = await getContainer("applications");

            // DEBUG: Query ALL items first to see if connection works
            const { resources: allItems } = await appsContainer.items
                .query("SELECT * FROM c")
                .fetchAll();

            const { resources: pendingItems } = await appsContainer.items
                .query("SELECT * FROM c WHERE c.status = 'pending'")
                .fetchAll();

            return {
                status: 200,
                body: JSON.stringify({
                    data: pendingItems,
                    debug: {
                        databaseId: appsContainer.database.id,
                        containerId: appsContainer.id,
                        totalItemsInContainer: allItems.length,
                        connectionStringPresent: !!process.env.COSMOS_DB_CONNECTION_STRING
                    }
                })
            };
        } catch (error) {
            context.log.error("Error in getAdminApps:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
