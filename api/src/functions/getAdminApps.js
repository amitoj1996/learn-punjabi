const { getContainer } = require('./config/cosmos');

module.exports = async function (context, req) {
    // 1. Verify Admin Role
    const clientPrincipalHeader = req.headers["x-ms-client-principal"];
    if (!clientPrincipalHeader) {
        context.res = { status: 401, body: "Unauthorized" };
        return;
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
            context.res = { status: 403, body: "Forbidden: Admin Access Required" };
            return;
        }

        // 2. Fetch Pending Applications
        const appsContainer = await getContainer("applications");
        const { resources: applications } = await appsContainer.items
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
