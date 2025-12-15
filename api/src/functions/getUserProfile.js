const { getContainer } = require('./config/cosmos');

module.exports = async function (context, req) {
    // 1. Get User Identity from SWA Header
    const clientPrincipalHeader = req.headers["x-ms-client-principal"];
    if (!clientPrincipalHeader) {
        context.res = { status: 401, body: "Unauthorized" };
        return;
    }
    const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
    const userId = clientPrincipal.userId;

    try {
        const container = await getContainer("users");

        // 2. Check if user exists in Cosmos DB
        const { resources: users } = await container.items
            .query({
                query: "SELECT * FROM c WHERE c.userId = @userId",
                parameters: [{ name: "@userId", value: userId }]
            })
            .fetchAll();

        let user = users[0];

        // 3. If not, create them (Default Role: Student)
        if (!user) {
            const newUser = {
                id: userId, // Use SWA userId as Doc ID
                userId: userId,
                userDetails: clientPrincipal.userDetails,
                identityProvider: clientPrincipal.identityProvider,
                role: clientPrincipal.userDetails === 'amitojsingh9896@gmail.com' ? 'admin' : "student",
                createdAt: new Date().toISOString()
            };
            const { resource: createdUser } = await container.items.create(newUser);
            user = createdUser;
        } else {
            // Auto-promote if existing user matches admin email (Self-healing for existing doc)
            if (clientPrincipal.userDetails === 'amitojsingh9896@gmail.com' && user.role !== 'admin') {
                user.role = 'admin';
                await container.item(user.id).replace(user);
            }
        }

        context.res = {
            status: 200,
            body: user
        };
    } catch (error) {
        context.log.error("Error in getUserProfile:", error);
        context.res = { status: 500, body: "Internal Server Error" };
    }
};
