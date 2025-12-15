const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("punjabilearn");
const appsContainer = database.container("applications");
const tutorsContainer = database.container("tutors");
const usersContainer = database.container("users");

module.exports = async function (context, req) {
    // 1. Verify Admin Role (Reuse logic or keep simple for MVP)
    const clientPrincipalHeader = req.headers["x-ms-client-principal"];
    if (!clientPrincipalHeader) {
        context.res = { status: 401, body: "Unauthorized" };
        return;
    }
    const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));

    const { resources: users } = await usersContainer.items
        .query({
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [{ name: "@userId", value: clientPrincipal.userId }]
        })
        .fetchAll();

    if (!users[0] || users[0].role !== 'admin') {
        context.res = { status: 403, body: "Forbidden" };
        return;
    }

    const { applicationId } = req.body;
    if (!applicationId) {
        context.res = { status: 400, body: "Missing Application ID" };
        return;
    }

    try {
        // 2. Get the Application
        console.log(`Searching for application: ${applicationId}`);
        // Note: We need the partition key. Assuming 'id' is partition key or similar. 
        // Queries are safer if we don't know partition key.
        const { resources: appResults } = await appsContainer.items
            .query({
                query: "SELECT * FROM c WHERE c.id = @id",
                parameters: [{ name: "@id", value: applicationId }]
            })
            .fetchAll();

        const application = appResults[0];

        if (!application) {
            context.res = { status: 404, body: "Application not found" };
            return;
        }

        // 3. Create Tutor Profile
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
        // Need to fetch user doc first to allow update/replace
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

        context.res = { status: 200, body: "Teacher Approved Successfully" };

    } catch (error) {
        context.log.error("Error approving teacher:", error);
        context.res = { status: 500, body: "Internal Server Error" };
    }
};
