const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// GET - Get user's lesson progress
app.http('getLessonProgress', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'learn/progress',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 200, jsonBody: { progress: [] } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            const container = await getContainer("lessonProgress");
            const { resources } = await container.items
                .query({
                    query: "SELECT * FROM c WHERE c.userEmail = @email",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            return {
                status: 200,
                jsonBody: { progress: resources }
            };
        } catch (error) {
            context.log.error("Error getting lesson progress:", error);
            // Return empty progress if container doesn't exist yet
            if (error.code === 404) {
                return { status: 200, jsonBody: { progress: [] } };
            }
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// POST - Save lesson progress
app.http('saveLessonProgress', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'learn/progress',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in to save progress" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const userId = clientPrincipal.userId;

            const body = await request.json();
            const { lessonId, completed, quizScore, completedAt } = body;

            if (!lessonId) {
                return { status: 400, jsonBody: { error: "Missing lessonId" } };
            }

            const container = await getContainer("lessonProgress");

            // Check if progress exists
            const { resources: existing } = await container.items
                .query({
                    query: "SELECT * FROM c WHERE c.userEmail = @email AND c.lessonId = @lessonId",
                    parameters: [
                        { name: "@email", value: userEmail },
                        { name: "@lessonId", value: lessonId }
                    ]
                })
                .fetchAll();

            if (existing.length > 0) {
                // Update existing progress
                const doc = existing[0];
                doc.completed = completed;
                doc.quizScore = quizScore;
                doc.completedAt = completedAt;
                doc.updatedAt = new Date().toISOString();
                await container.item(doc.id, doc.id).replace(doc);
            } else {
                // Create new progress
                const progressDoc = {
                    id: `${userId}-${lessonId}`,
                    userEmail,
                    userId,
                    lessonId,
                    completed,
                    quizScore,
                    completedAt,
                    createdAt: new Date().toISOString()
                };
                await container.items.create(progressDoc);
            }

            return {
                status: 200,
                jsonBody: { success: true }
            };
        } catch (error) {
            context.log.error("Error saving lesson progress:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
