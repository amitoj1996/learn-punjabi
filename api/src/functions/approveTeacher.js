const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

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

            // 3. Create Tutor Profile
            const tutorsContainer = await getContainer("tutors");
            const newTutor = {
                id: application.id,
                name: application.fullName || application.name || "New Tutor",
                email: application.email,
                bio: application.bio,
                hourlyRate: application.hourlyRate || 15,
                languages: ["Punjabi"],
                rating: 0,
                reviewCount: 0,
                createdAt: new Date().toISOString()
            };
            await tutorsContainer.items.create(newTutor);

            // 4. Update Application Status
            application.status = 'approved';
            await appsContainer.item(application.id, application.id).replace(application);

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
