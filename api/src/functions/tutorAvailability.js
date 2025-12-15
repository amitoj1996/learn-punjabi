const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// GET - Retrieve availability
app.http('getAvailability', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'tutor/availability',
    handler: async (request, context) => {
        context.log('Get Availability Handler');

        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            // Get tutor profile to find their ID
            const tutorsContainer = await getContainer("tutors");
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.email = @email",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            if (tutors.length === 0) {
                return { status: 404, body: JSON.stringify({ error: "Tutor profile not found" }) };
            }

            const tutor = tutors[0];

            // Return availability (stored in tutor document)
            return {
                status: 200,
                body: JSON.stringify({
                    availability: tutor.availability || {
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                        sunday: []
                    },
                    timezone: tutor.timezone || 'America/New_York'
                })
            };

        } catch (error) {
            context.log.error("Error getting availability:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// PUT - Update availability
app.http('updateAvailability', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'tutor/availability',
    handler: async (request, context) => {
        context.log('Update Availability Handler');

        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            // Get tutor profile
            const tutorsContainer = await getContainer("tutors");
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.email = @email",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            if (tutors.length === 0) {
                return { status: 404, body: JSON.stringify({ error: "Tutor profile not found" }) };
            }

            const tutor = tutors[0];
            const body = await request.json();

            // Update availability
            tutor.availability = body.availability;
            tutor.timezone = body.timezone || tutor.timezone;
            tutor.updatedAt = new Date().toISOString();

            await tutorsContainer.item(tutor.id, tutor.id).replace(tutor);

            return {
                status: 200,
                body: JSON.stringify({ message: "Availability updated successfully" })
            };

        } catch (error) {
            context.log.error("Error updating availability:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});
