const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Helper to check if user is admin
async function isAdmin(userEmail) {
    try {
        const usersContainer = await getContainer('users');
        const { resources: users } = await usersContainer.items
            .query({
                query: 'SELECT * FROM c WHERE c.userDetails = @email',
                parameters: [{ name: '@email', value: userEmail }]
            })
            .fetchAll();

        return users.length > 0 && users[0].role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Admin: Suspend any user (teacher or student)
app.http('suspendUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/users/suspend',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const body = await request.json();
            const { userEmail, reason, reportId } = body;

            if (!userEmail) {
                return { status: 400, jsonBody: { error: 'User email is required' } };
            }

            context.log('Admin suspending user:', userEmail, 'by:', adminEmail);

            // Update user record in users container
            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userDetails = @email',
                    parameters: [{ name: '@email', value: userEmail }]
                })
                .fetchAll();

            let userRole = 'unknown';
            if (users.length > 0) {
                const user = users[0];
                userRole = user.role;
                user.suspended = true;
                user.suspendedAt = new Date().toISOString();
                user.suspendedBy = adminEmail;
                user.suspendReason = reason || 'Inappropriate behavior';
                await usersContainer.item(user.id, user.userId).replace(user);
            }

            // If user is a teacher, also update their tutor profile
            if (userRole === 'teacher') {
                const tutorsContainer = await getContainer('tutors');
                const { resources: tutors } = await tutorsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: userEmail }]
                    })
                    .fetchAll();

                if (tutors.length > 0) {
                    const tutor = tutors[0];
                    tutor.status = 'suspended';
                    tutor.isActive = false;
                    tutor.suspendedAt = new Date().toISOString();
                    tutor.suspendedBy = adminEmail;
                    await tutorsContainer.item(tutor.id, tutor.id).replace(tutor);
                }

                // Also update teacher application
                const appsContainer = await getContainer('teacherApplications');
                const { resources: applications } = await appsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: userEmail }]
                    })
                    .fetchAll();

                if (applications.length > 0) {
                    const application = applications[0];
                    application.status = 'suspended';
                    await appsContainer.item(application.id, application.id).replace(application);
                }
            }

            // If there's a reportId, mark the report as resolved
            if (reportId) {
                try {
                    const reportsContainer = await getContainer('reports');
                    const { resources: reports } = await reportsContainer.items
                        .query({
                            query: 'SELECT * FROM c WHERE c.id = @id',
                            parameters: [{ name: '@id', value: reportId }]
                        })
                        .fetchAll();

                    if (reports.length > 0) {
                        const report = reports[0];
                        report.status = 'resolved';
                        report.resolvedAt = new Date().toISOString();
                        report.resolvedBy = adminEmail;
                        report.action = 'suspended';
                        await reportsContainer.item(report.id, report.id).replace(report);
                    }
                } catch (err) {
                    context.log('Could not update report:', err.message);
                }
            }

            return {
                jsonBody: {
                    success: true,
                    message: `${userRole === 'teacher' ? 'Teacher' : 'User'} suspended successfully`,
                    userRole
                }
            };
        } catch (error) {
            context.error('Error suspending user:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Admin: Dismiss a report (no action taken)
app.http('dismissReport', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/reports/dismiss',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const body = await request.json();
            const { reportId } = body;

            if (!reportId) {
                return { status: 400, jsonBody: { error: 'Report ID is required' } };
            }

            const reportsContainer = await getContainer('reports');
            const { resources: reports } = await reportsContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.id = @id',
                    parameters: [{ name: '@id', value: reportId }]
                })
                .fetchAll();

            if (reports.length > 0) {
                const report = reports[0];
                report.status = 'dismissed';
                report.resolvedAt = new Date().toISOString();
                report.resolvedBy = adminEmail;
                report.action = 'dismissed';
                await reportsContainer.item(report.id, report.id).replace(report);
            }

            return {
                jsonBody: { success: true, message: 'Report dismissed' }
            };
        } catch (error) {
            context.error('Error dismissing report:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Admin: Get all users
app.http('getAllUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/users',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const usersContainer = await getContainer('users');
            // Exclude deleted users
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE (c.deleted != true OR NOT IS_DEFINED(c.deleted)) ORDER BY c.createdAt DESC'
                })
                .fetchAll();

            return { jsonBody: users };
        } catch (error) {
            context.error('Error getting users:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Admin: Reinstate a suspended user
app.http('reinstateUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/users/reinstate',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const body = await request.json();
            const { userEmail } = body;

            if (!userEmail) {
                return { status: 400, jsonBody: { error: 'User email is required' } };
            }

            context.log('Admin reinstating user:', userEmail, 'by:', adminEmail);

            // Update user record
            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userDetails = @email',
                    parameters: [{ name: '@email', value: userEmail }]
                })
                .fetchAll();

            let userRole = 'unknown';
            if (users.length > 0) {
                const user = users[0];
                userRole = user.role;
                user.suspended = false;
                user.reinstatedAt = new Date().toISOString();
                user.reinstatedBy = adminEmail;
                await usersContainer.item(user.id, user.userId).replace(user);
            }

            // If user is a teacher, also reinstate their tutor profile
            if (userRole === 'teacher') {
                const tutorsContainer = await getContainer('tutors');
                const { resources: tutors } = await tutorsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: userEmail }]
                    })
                    .fetchAll();

                if (tutors.length > 0) {
                    const tutor = tutors[0];
                    tutor.status = 'active';
                    tutor.isActive = true;
                    tutor.reinstatedAt = new Date().toISOString();
                    tutor.reinstatedBy = adminEmail;
                    await tutorsContainer.item(tutor.id, tutor.id).replace(tutor);
                }

                // Also update teacher application
                const appsContainer = await getContainer('teacherApplications');
                const { resources: applications } = await appsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: userEmail }]
                    })
                    .fetchAll();

                if (applications.length > 0) {
                    const application = applications[0];
                    application.status = 'approved';
                    await appsContainer.item(application.id, application.id).replace(application);
                }
            }

            return {
                jsonBody: {
                    success: true,
                    message: `User reinstated successfully`,
                    userRole
                }
            };
        } catch (error) {
            context.error('Error reinstating user:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Check if current user is suspended (for frontend blocking)
app.http('checkSuspension', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'users/check-suspension',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const userEmail = principal.userDetails;

            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userDetails = @email',
                    parameters: [{ name: '@email', value: userEmail }]
                })
                .fetchAll();

            if (users.length > 0 && users[0].suspended === true) {
                return {
                    jsonBody: {
                        suspended: true,
                        reason: users[0].suspendReason || 'Account suspended',
                        suspendedAt: users[0].suspendedAt
                    }
                };
            }

            return { jsonBody: { suspended: false } };
        } catch (error) {
            context.error('Error checking suspension:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Admin: Delete a user (soft delete - marks as deleted but preserves data)
app.http('deleteUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/users/delete',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const body = await request.json();
            const { userEmail, confirmEmail } = body;

            if (!userEmail) {
                return { status: 400, jsonBody: { error: 'User email is required' } };
            }

            // Require typing the email to confirm deletion
            if (userEmail !== confirmEmail) {
                return { status: 400, jsonBody: { error: 'Email confirmation does not match' } };
            }

            context.log('Admin deleting user:', userEmail, 'by:', adminEmail);

            // Soft delete user record
            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userDetails = @email',
                    parameters: [{ name: '@email', value: userEmail }]
                })
                .fetchAll();

            let userRole = 'unknown';
            if (users.length > 0) {
                const user = users[0];
                userRole = user.role;

                // Cannot delete admin users
                if (user.role === 'admin') {
                    return { status: 403, jsonBody: { error: 'Cannot delete admin users' } };
                }

                user.deleted = true;
                user.deletedAt = new Date().toISOString();
                user.deletedBy = adminEmail;
                await usersContainer.item(user.id, user.userId).replace(user);
            } else {
                return { status: 404, jsonBody: { error: 'User not found' } };
            }

            // If user is a teacher, also mark their tutor profile as deleted
            if (userRole === 'teacher') {
                const tutorsContainer = await getContainer('tutors');
                const { resources: tutors } = await tutorsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: userEmail }]
                    })
                    .fetchAll();

                if (tutors.length > 0) {
                    const tutor = tutors[0];
                    tutor.deleted = true;
                    tutor.isActive = false;
                    tutor.deletedAt = new Date().toISOString();
                    tutor.deletedBy = adminEmail;
                    await tutorsContainer.item(tutor.id, tutor.id).replace(tutor);
                }

                // Also mark teacher application as deleted
                const appsContainer = await getContainer('teacherApplications');
                const { resources: applications } = await appsContainer.items
                    .query({
                        query: 'SELECT * FROM c WHERE c.email = @email',
                        parameters: [{ name: '@email', value: userEmail }]
                    })
                    .fetchAll();

                if (applications.length > 0) {
                    const application = applications[0];
                    application.deleted = true;
                    application.status = 'deleted';
                    await appsContainer.item(application.id, application.id).replace(application);
                }
            }

            return {
                jsonBody: {
                    success: true,
                    message: `User ${userEmail} has been deleted`,
                    userRole
                }
            };
        } catch (error) {
            context.error('Error deleting user:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
