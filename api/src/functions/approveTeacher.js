const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');
const { sendTeacherApproved, sendTeacherRejected } = require('./config/email');

app.http('approveTeacher', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/approve',  // Changed from 'admin/approve' to avoid reserved word
    handler: async (request, context) => {
        context.log('HTTP trigger function processing approveTeacher.');

        try {
            // 1. Verify Admin Role
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Unauthorized" }) };
            }
            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));

            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: clientPrincipal.userId }]
                })
                .fetchAll();

            if (!users[0] || users[0].role !== 'admin') {
                return { status: 403, body: JSON.stringify({ error: "Forbidden: Admin access required" }) };
            }

            const body = await request.json();
            const { applicationId } = body;

            if (!applicationId) {
                return { status: 400, body: JSON.stringify({ error: "Missing Application ID" }) };
            }

            const appsContainer = await getContainer("applications");

            // 2. Get the Application
            const { resources: appResults } = await appsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: applicationId }]
                })
                .fetchAll();

            const application = appResults[0];

            if (!application) {
                return { status: 404, body: JSON.stringify({ error: "Application not found" }) };
            }

            // 3. Create Tutor Profile with all fields from application
            const tutorsContainer = await getContainer("tutors");
            const newTutor = {
                id: application.id,
                name: application.fullName || application.name || "New Tutor",
                email: application.email,
                bio: application.bio,
                hourlyRate: application.hourlyRate || 15,
                // New fields from enhanced onboarding
                photoUrl: application.photoUrl || null,
                timezone: application.timezone || 'UTC',
                languagesSpoken: application.languagesSpoken || ["Punjabi"],
                targetAgeGroups: application.targetAgeGroups || [],
                specializations: application.specializations || [],
                sessionLengths: application.sessionLengths || ['60'],
                videoIntro: application.videoIntro || null,
                teachingPhilosophy: application.teachingPhilosophy || '',
                proficiencyLevel: application.proficiencyLevel || 'native',
                yearsExperience: application.yearsExperience || '0',
                experienceLevel: application.experienceLevel || 'community',
                // Legacy field for backwards compatibility
                languages: ["Punjabi"],
                rating: 0,
                reviewCount: 0,
                isSuspended: false,
                createdAt: new Date().toISOString()
            };
            await tutorsContainer.items.create(newTutor);

            // 4. Update Application Status
            application.status = 'approved';
            await appsContainer.item(application.id, application.id).replace(application);

            // 5. Send approval email
            try {
                await sendTeacherApproved(application.email, newTutor.name);
                context.log('Approval email sent to:', application.email);
            } catch (emailError) {
                context.log.error('Failed to send approval email:', emailError.message);
            }

            return { status: 200, body: JSON.stringify({ message: "Teacher Approved Successfully" }) };

        } catch (error) {
            context.log.error("Error approving teacher:", error);
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    message: error.message
                })
            };
        }
    }
});

// Reject teacher application
app.http('rejectTeacher', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/reject',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing rejectTeacher.');

        try {
            // 1. Verify Admin Role
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Unauthorized" }) };
            }
            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));

            const usersContainer = await getContainer("users");
            const { resources: users } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: clientPrincipal.userId }]
                })
                .fetchAll();

            if (!users[0] || users[0].role !== 'admin') {
                return { status: 403, body: JSON.stringify({ error: "Forbidden: Admin access required" }) };
            }

            const body = await request.json();
            const { applicationId } = body;

            if (!applicationId) {
                return { status: 400, body: JSON.stringify({ error: "Missing Application ID" }) };
            }

            const appsContainer = await getContainer("applications");

            // Get the Application
            const { resources: appResults } = await appsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: applicationId }]
                })
                .fetchAll();

            const application = appResults[0];

            if (!application) {
                return { status: 404, body: JSON.stringify({ error: "Application not found" }) };
            }

            // Update Application Status
            application.status = 'rejected';
            application.rejectedAt = new Date().toISOString();
            await appsContainer.item(application.id, application.id).replace(application);

            // Send rejection email
            try {
                const teacherName = application.fullName || application.name || 'Applicant';
                await sendTeacherRejected(application.email, teacherName);
                context.log('Rejection email sent to:', application.email);
            } catch (emailError) {
                context.log.error('Failed to send rejection email:', emailError.message);
            }

            return { status: 200, body: JSON.stringify({ message: "Application rejected" }) };

        } catch (error) {
            context.log.error("Error rejecting teacher:", error);
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    message: error.message
                })
            };
        }
    }
});
