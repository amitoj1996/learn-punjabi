const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('approveTeacher', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'admin/approve',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing approveTeacher.');

        // 1. Verify Admin Role
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
                return { status: 403, body: "Forbidden" };
            }

            const body = await request.json();
            const { applicationId } = body;

            if (!applicationId) {
                return { status: 400, body: "Missing Application ID" };
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
                return { status: 404, body: "Application not found" };
            }

            // 3. Create Tutor Profile
            const tutorsContainer = await getContainer("tutors");
            const newTutor = {
                id: application.userId, // Use userId as Tutor ID
                userId: application.userId,
                name: application.name || "New Tutor",
                email: application.email,
                bio: application.bio,
                hourlyRate: application.hourlyRate || 15,
                languages: ["Punjabi"],
                rating: 0,
                reviewCount: 0,
                createdAt: new Date().toISOString()
            };
            await tutorsContainer.items.create(newTutor);

            // 4. Update User Role to 'teacher'
            const { resources: applicantUsers } = await usersContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.userId = @userId",
                    parameters: [{ name: "@userId", value: application.userId }]
                })
                .fetchAll();

            if (applicantUsers[0]) {
                const applicant = applicantUsers[0];
                applicant.role = 'teacher';
                await usersContainer.item(applicant.id).replace(applicant);
            }

            // 5. Update Application Status
            application.status = 'approved';
            await appsContainer.item(application.id).replace(application);

            return { status: 200, body: "Teacher Approved Successfully" };

        } catch (error) {
            context.log.error("Error approving teacher:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
