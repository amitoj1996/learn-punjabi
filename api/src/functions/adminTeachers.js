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

// Admin: Suspend/Remove a teacher
app.http('suspendTeacher', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/teachers/suspend',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            // Check if user is admin using role from database
            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const body = await request.json();
            const { teacherEmail, action, reason } = body;

            if (!teacherEmail || !action) {
                return { status: 400, jsonBody: { error: 'Teacher email and action are required' } };
            }

            context.log('Admin action:', action, 'on teacher:', teacherEmail, 'by:', adminEmail);

            // Update teacher application status
            const appsContainer = await getContainer('teacherApplications');
            const { resources: applications } = await appsContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.email = @email',
                    parameters: [{ name: '@email', value: teacherEmail }]
                })
                .fetchAll();

            if (applications.length > 0) {
                const application = applications[0];
                application.status = action === 'suspend' ? 'suspended' : 'removed';
                application.suspendedAt = new Date().toISOString();
                application.suspendedBy = adminEmail;
                application.suspendReason = reason || '';
                await appsContainer.item(application.id, application.id).replace(application);
            }

            // Also update tutor profile if exists
            const tutorsContainer = await getContainer('tutors');
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.email = @email',
                    parameters: [{ name: '@email', value: teacherEmail }]
                })
                .fetchAll();

            if (tutors.length > 0) {
                const tutor = tutors[0];
                tutor.status = action === 'suspend' ? 'suspended' : 'removed';
                tutor.isActive = false;
                tutor.suspendedAt = new Date().toISOString();
                tutor.suspendedBy = adminEmail;
                tutor.suspendReason = reason || '';
                await tutorsContainer.item(tutor.id, tutor.id).replace(tutor);
            }

            return {
                jsonBody: {
                    success: true,
                    message: `Teacher ${action === 'suspend' ? 'suspended' : 'removed'} successfully`
                }
            };
        } catch (error) {
            context.error('Error suspending teacher:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Admin: Get all teachers (for management)
app.http('getAllTeachers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/teachers',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            // Check if user is admin using role from database
            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const tutorsContainer = await getContainer('tutors');
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: 'SELECT * FROM c ORDER BY c.createdAt DESC'
                })
                .fetchAll();

            return { jsonBody: tutors };
        } catch (error) {
            context.error('Error getting teachers:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Admin: Reinstate a suspended teacher
app.http('reinstateTeacher', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/teachers/reinstate',
    handler: async (request, context) => {
        try {
            const clientPrincipal = request.headers.get('x-ms-client-principal');
            if (!clientPrincipal) {
                return { status: 401, jsonBody: { error: 'Not authenticated' } };
            }

            const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
            const adminEmail = principal.userDetails;

            // Check if user is admin using role from database
            if (!await isAdmin(adminEmail)) {
                return { status: 403, jsonBody: { error: 'Admin access required' } };
            }

            const body = await request.json();
            const { teacherEmail } = body;

            if (!teacherEmail) {
                return { status: 400, jsonBody: { error: 'Teacher email is required' } };
            }

            // Reinstate tutor profile
            const tutorsContainer = await getContainer('tutors');
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.email = @email',
                    parameters: [{ name: '@email', value: teacherEmail }]
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

            // Also update application status
            const appsContainer = await getContainer('teacherApplications');
            const { resources: applications } = await appsContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.email = @email',
                    parameters: [{ name: '@email', value: teacherEmail }]
                })
                .fetchAll();

            if (applications.length > 0) {
                const application = applications[0];
                application.status = 'approved';
                await appsContainer.item(application.id, application.id).replace(application);
            }

            return {
                jsonBody: {
                    success: true,
                    message: 'Teacher reinstated successfully'
                }
            };
        } catch (error) {
            context.error('Error reinstating teacher:', error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
