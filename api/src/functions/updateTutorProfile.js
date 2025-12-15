const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('updateTutorProfile', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'tutor/profile',
    handler: async (request, context) => {
        context.log('Update Tutor Profile Handler');

        try {
            // 1. Verify user is logged in
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return {
                    status: 401,
                    body: JSON.stringify({ error: "Please log in" })
                };
            }

            let clientPrincipal;
            try {
                clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            } catch (e) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Invalid credentials" })
                };
            }

            const userEmail = clientPrincipal.userDetails;
            context.log('Updating profile for:', userEmail);

            // 2. Find tutor profile by email
            const tutorsContainer = await getContainer("tutors");
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.email = @email",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            if (tutors.length === 0) {
                return {
                    status: 404,
                    body: JSON.stringify({ error: "Tutor profile not found. You must be an approved teacher." })
                };
            }

            const tutorProfile = tutors[0];

            // 3. Get update data from request
            const updates = await request.json();

            // Allowed fields to update
            const allowedUpdates = ['name', 'bio', 'hourlyRate', 'languages'];

            // Apply updates
            for (const field of allowedUpdates) {
                if (updates[field] !== undefined) {
                    tutorProfile[field] = updates[field];
                }
            }

            tutorProfile.updatedAt = new Date().toISOString();

            // 4. Save updated profile
            await tutorsContainer.item(tutorProfile.id, tutorProfile.id).replace(tutorProfile);

            return {
                status: 200,
                body: JSON.stringify({
                    message: "Profile updated successfully",
                    profile: tutorProfile
                })
            };

        } catch (error) {
            context.log.error("Error updating tutor profile:", error);
            return {
                status: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }
});
