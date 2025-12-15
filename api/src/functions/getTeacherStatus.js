const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

app.http('getTeacherStatus', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'teacher/status',
    handler: async (request, context) => {
        context.log('Get Teacher Status Handler');

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
            context.log('Looking up status for:', userEmail);

            // 2. Check for application by email
            const appsContainer = await getContainer("applications");
            const { resources: applications } = await appsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.email = @email ORDER BY c.submittedAt DESC",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            if (applications.length === 0) {
                // No application found
                return {
                    status: 200,
                    body: JSON.stringify({
                        hasApplication: false,
                        status: 'none',
                        application: null,
                        tutorProfile: null
                    })
                };
            }

            const application = applications[0];

            // 3. If approved, get tutor profile
            let tutorProfile = null;
            if (application.status === 'approved') {
                const tutorsContainer = await getContainer("tutors");
                const { resources: tutors } = await tutorsContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.email = @email",
                        parameters: [{ name: "@email", value: userEmail }]
                    })
                    .fetchAll();

                tutorProfile = tutors[0] || null;
            }

            return {
                status: 200,
                body: JSON.stringify({
                    hasApplication: true,
                    status: application.status,
                    application: {
                        id: application.id,
                        fullName: application.fullName || application.name,
                        email: application.email,
                        submittedAt: application.submittedAt
                    },
                    tutorProfile: tutorProfile
                })
            };

        } catch (error) {
            context.log.error("Error in getTeacherStatus:", error);
            return {
                status: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }
});
