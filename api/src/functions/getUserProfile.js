const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getUserProfile', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'users/me',
    handler: async (request, context) => {
        // 1. Get User Identity from SWA Header
        const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
        if (!clientPrincipalHeader) {
            return { status: 401, body: "Unauthorized" };
        }
        const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
        const userId = clientPrincipal.userId;
        const userEmail = clientPrincipal.userDetails;

        try {
            const usersContainer = await getContainer("users");

            // 2. Check if user exists in Cosmos DB
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: userId }]
                })
                .fetchAll();

            let user = users[0];

            // 3. Check if user is an approved teacher (has tutor profile)
            let isApprovedTeacher = false;
            try {
                const tutorsContainer = await getContainer("tutors");
                const { resources: tutors } = await tutorsContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.email = @email",
                        parameters: [{ name: "@email", value: userEmail }]
                    })
                    .fetchAll();
                isApprovedTeacher = tutors.length > 0;
            } catch (e) {
                context.log('Could not check tutors container:', e.message);
            }

            // 4. Determine role (priority: admin > teacher > student)
            let role = 'student';
            if (userEmail === 'amitojsingh9896@gmail.com') {
                role = 'admin';
            } else if (isApprovedTeacher) {
                role = 'teacher';
            }

            // 5. If user doesn't exist, create them
            if (!user) {
                const newUser = {
                    id: userId,
                    userId: userId,
                    userDetails: userEmail,
                    identityProvider: clientPrincipal.identityProvider,
                    role: role,
                    hasUsedTrial: false,  // New users are eligible for trial
                    createdAt: new Date().toISOString()
                };
                const { resource: createdUser } = await usersContainer.items.create(newUser);
                user = createdUser;
            } else {
                // 6. Update role if changed (e.g., just became approved teacher)
                if (user.role !== role && role !== 'student') {
                    user.role = role;
                    user.updatedAt = new Date().toISOString();
                    await usersContainer.item(user.id, user.userId).replace(user);
                }
            }

            // Include trial eligibility in response
            const response = {
                ...user,
                trialEligible: user.hasUsedTrial !== true  // Eligible if hasn't used trial
            };

            return {
                status: 200,
                body: JSON.stringify(response)
            };
        } catch (error) {
            context.log.error("Error in getUserProfile:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

// Get trial eligibility status for current user
app.http('getTrialStatus', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'users/trial-status',
    handler: async (request, context) => {
        const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
        if (!clientPrincipalHeader) {
            return { status: 401, jsonBody: { error: "Please log in" } };
        }

        const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
        const userId = clientPrincipal.userId;

        try {
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: userId }]
                })
                .fetchAll();

            const user = users[0];
            const hasUsedTrial = user?.hasUsedTrial === true;

            return {
                status: 200,
                jsonBody: {
                    eligible: !hasUsedTrial,
                    hasUsedTrial: hasUsedTrial,
                    trialPrice: 5  // Flat $5 trial price
                }
            };
        } catch (error) {
            context.log.error("Error checking trial status:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
