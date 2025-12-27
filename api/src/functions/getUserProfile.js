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
        const identityProvider = clientPrincipal.identityProvider;

        try {
            const usersContainer = await getContainer("users");

            // 2. Check if user exists by EMAIL (not userId) to prevent duplicates
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userDetails = @email",
                    parameters: [{ name: "@email", value: userEmail }]
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
                    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId: userId,  // Current session userId
                    userDetails: userEmail,
                    identityProvider: identityProvider,
                    identityProviders: [identityProvider],  // Track all providers used
                    role: role,
                    hasUsedTrial: false,
                    createdAt: new Date().toISOString()
                };
                const { resource: createdUser } = await usersContainer.items.create(newUser);
                user = createdUser;
            } else {
                // 6. Update user if needed
                let needsUpdate = false;

                // Update role if changed to a higher role
                if (user.role !== role && role !== 'student') {
                    user.role = role;
                    needsUpdate = true;
                }

                // Track this identity provider if not already tracked
                if (!user.identityProviders) {
                    user.identityProviders = [user.identityProvider || identityProvider];
                }
                if (!user.identityProviders.includes(identityProvider)) {
                    user.identityProviders.push(identityProvider);
                    needsUpdate = true;
                }

                // Update current session userId (may be different each login)
                user.lastUserId = userId;
                user.lastIdentityProvider = identityProvider;
                user.lastLoginAt = new Date().toISOString();

                if (needsUpdate) {
                    user.updatedAt = new Date().toISOString();
                }

                await usersContainer.item(user.id, user.id).replace(user);
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
        const userEmail = clientPrincipal.userDetails;

        try {
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userDetails = @email",
                    parameters: [{ name: "@email", value: userEmail }]
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

// Reset trial status (admin utility - for when trial failed before payment)
app.http('resetTrialStatus', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'users/reset-trial',
    handler: async (request, context) => {
        const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
        if (!clientPrincipalHeader) {
            return { status: 401, jsonBody: { error: "Please log in" } };
        }

        const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
        const userEmail = clientPrincipal.userDetails;

        try {
            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userDetails = @email",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            if (users.length === 0) {
                return { status: 404, jsonBody: { error: "User not found" } };
            }

            // SECURITY: Only allow admins to reset trials
            const isAdmin = users.some(u => u.role === 'admin');

            if (!isAdmin) {
                context.log.warn(`Unauthorized trial reset attempt by ${userEmail}`);
                return { status: 403, jsonBody: { error: "Unauthorized. Admin privileges required." } };
            }

            // CHECK FOR TARGET EMAIL (Admin can reset others)
            let targetEmail = userEmail;
            let targetUsers = users;
            let forceReset = false;

            try {
                const body = await request.json();
                if (body) {
                    if (body.email) {
                        targetEmail = body.email;
                        context.log(`Admin ${userEmail} requesting trial reset for ${targetEmail}`);
                    }
                    if (body.force) {
                        forceReset = true;
                    }
                }
            } catch (e) {
                // No body provided, use defaults
            }

            // If target is different, fetch target user records
            if (targetEmail !== userEmail) {
                const { resources: fetchedTargetUsers } = await usersContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.userDetails = @email",
                        parameters: [{ name: "@email", value: targetEmail }]
                    })
                    .fetchAll();

                if (fetchedTargetUsers.length === 0) {
                    return { status: 404, jsonBody: { error: `Target user ${targetEmail} not found` } };
                }
                targetUsers = fetchedTargetUsers;
            }

            context.log(`Found ${targetUsers.length} user records for ${targetEmail}`);

            // Check if user ever actually PAID for a trial
            const bookingsContainer = await getContainer("bookings");
            const { resources: paidTrials } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.studentEmail = @email AND c.isTrial = true AND c.paymentStatus = 'paid'",
                    parameters: [{ name: "@email", value: targetEmail }]
                })
                .fetchAll();

            // forceReset is already determined above

            if (paidTrials.length > 0) {
                if (!forceReset) {
                    return {
                        status: 400,
                        jsonBody: {
                            error: "Target user has a paid trial booking, cannot reset. Use { force: true } to override.",
                            paidTrialCount: paidTrials.length
                        }
                    };
                } else {
                    // FORCE RESET: Delete the paid trial bookings too
                    context.log(`FORCE RESET: Deleting ${paidTrials.length} paid trial bookings for ${targetEmail}`);
                    for (const booking of paidTrials) {
                        await bookingsContainer.item(booking.id, booking.id).delete();
                    }
                }
            }

            // Safe to reset - no paid trials found

            // 1. DELETE ANY UNPAID BOOKINGS (Cleanup abandoned attempts)
            const { resources: unpaidBookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.studentEmail = @email AND c.paymentStatus != 'paid'",
                    parameters: [{ name: "@email", value: targetEmail }]
                })
                .fetchAll();

            let deletedBookings = 0;
            for (const booking of unpaidBookings) {
                await bookingsContainer.item(booking.id, booking.id).delete();
                deletedBookings++;
            }
            context.log(`Deleted ${deletedBookings} unpaid bookings for user: ${targetEmail}`);

            // 2. RESET USER TRIAL STATUS (on all records)
            let resetCount = 0;
            for (const user of targetUsers) {
                if (user.hasUsedTrial === true) {
                    user.hasUsedTrial = false;
                    user.trialResetAt = new Date().toISOString();
                    delete user.trialUsedAt;
                    // Note: partition key for users container is usually 'userId' or 'id' depending on config.
                    // Assuming 'userId' based on previous code usage
                    await usersContainer.item(user.id, user.userId).replace(user);
                    resetCount++;
                    context.log(`Reset trial for user record: ${user.id}`);
                }
            }

            context.log(`Reset trial on ${resetCount}/${targetUsers.length} user records for: ${targetEmail}`);
            return {
                status: 200,
                jsonBody: {
                    message: `Trial status reset on ${resetCount} records for ${targetEmail}. Deleted ${deletedBookings} unpaid bookings.`,
                    totalRecords: targetUsers.length,
                    resetCount,
                    deletedBookings,
                    eligible: true,
                    targetEmail
                }
            };
        } catch (error) {
            context.log.error("Error resetting trial status:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
