const { app } = require('@azure/functions');
if (!global.crypto) {
    global.crypto = require('crypto');
}
const { getContainer } = require('./config/cosmos');

app.http('createTeacherApplication', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'teachers/apply',
    handler: async (request, context) => {
        context.log('HTTP trigger function processing teacher application.');

        try {
            const applicationData = await request.json();

            // Validate required fields
            const requiredFields = [
                'email', 'fullName', 'proficiencyLevel', 'bio', 'hourlyRate',
                'weeklyAvailability', 'photoUrl', 'timezone'
            ];
            for (const field of requiredFields) {
                if (!applicationData[field]) {
                    return { status: 400, jsonBody: { error: `Missing required field: ${field}` } };
                }
            }

            // Validate array fields
            if (!Array.isArray(applicationData.languagesSpoken) || applicationData.languagesSpoken.length === 0) {
                return { status: 400, jsonBody: { error: 'Please select at least one language' } };
            }
            if (!Array.isArray(applicationData.targetAgeGroups) || applicationData.targetAgeGroups.length === 0) {
                return { status: 400, jsonBody: { error: 'Please select at least one target age group' } };
            }
            if (!Array.isArray(applicationData.specializations) || applicationData.specializations.length === 0) {
                return { status: 400, jsonBody: { error: 'Please select at least one specialization' } };
            }
            if (!Array.isArray(applicationData.sessionLengths) || applicationData.sessionLengths.length === 0) {
                return { status: 400, jsonBody: { error: 'Please select at least one session length' } };
            }

            // Validate proficiency level
            const validProficiency = ['native', 'fluent', 'advanced', 'intermediate'];
            if (!validProficiency.includes(applicationData.proficiencyLevel)) {
                return { status: 400, jsonBody: { error: 'Invalid proficiency level' } };
            }

            // Validate hourly rate
            if (applicationData.hourlyRate < 5 || applicationData.hourlyRate > 200) {
                return { status: 400, jsonBody: { error: 'Hourly rate must be between $5 and $200' } };
            }

            // Check for existing application with same email
            const container = await getContainer('applications');
            const { resources: existing } = await container.items
                .query({
                    query: 'SELECT * FROM c WHERE c.email = @email AND c.status = "pending"',
                    parameters: [{ name: '@email', value: applicationData.email }]
                })
                .fetchAll();

            if (existing.length > 0) {
                return { status: 400, jsonBody: { error: 'You already have a pending application' } };
            }

            // Add metadata
            const newApplication = {
                id: new Date().getTime().toString(),
                ...applicationData,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            const { resource: createdItem } = await container.items.create(newApplication);

            return { status: 201, body: JSON.stringify(createdItem) };

        } catch (error) {
            context.log('Error processing application:', error);
            if (error.message.includes("COSMOS_DB")) {
                return {
                    status: 503,
                    body: JSON.stringify({ error: "Database connection not configured." })
                };
            }
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    details: error.message,
                    stack: error.stack
                })
            };
        }
    }
});
