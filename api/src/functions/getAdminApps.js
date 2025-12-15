const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("punjabilearn");
const container = database.container("applications");

module.exports = async function (context, req) {
    // 1. Verify Admin Role
    const clientPrincipalHeader = req.headers["x-ms-client-principal"];
    if (!clientPrincipalHeader) {
        context.res = { status: 401, body: "Unauthorized" };
        return;
    }
    const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));

    if (!clientPrincipal.userRoles.includes('admin') && clientPrincipal.userId !== 'admin_override_id') {
        // Note: Real admin check should ideally query the DB user role, 
        // but for SWA we can also check the SWA role if managed there. 
        // For now, we rely on the DB role which getUserProfile syncs, 
        // essentially we trust the request if the FE sends the right signals? 
        // NO, we must Query the DB to be sure this user is an admin.
    }

    // Better Security: Fetch user from DB to verify role
    const usersContainer = database.container("users");
    const { resources: users } = await usersContainer.items
        .query({
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [{ name: "@userId", value: clientPrincipal.userId }]
        })
        .fetchAll();

    if (!users[0] || users[0].role !== 'admin') {
        context.res = { status: 403, body: "Forbidden: Admin Access Required" };
        return;
    }

    try {
        // 2. Fetch Pending Applications
        const { resources: applications } = await container.items
            .query("SELECT * FROM c WHERE c.status = 'pending'")
            .fetchAll();

        context.res = {
            status: 200,
            body: applications
        };
    } catch (error) {
        context.log.error("Error in getAdminApps:", error);
        context.res = { status: 500, body: "Internal Server Error" };
    }
};
