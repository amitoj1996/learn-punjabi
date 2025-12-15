const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// POST - Create a review
app.http('createReview', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'reviews',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const studentEmail = clientPrincipal.userDetails;

            const body = await request.json();
            const { bookingId, tutorId, rating, comment } = body;

            if (!tutorId || !rating) {
                return { status: 400, body: JSON.stringify({ error: "Missing required fields" }) };
            }

            if (rating < 1 || rating > 5) {
                return { status: 400, body: JSON.stringify({ error: "Rating must be 1-5" }) };
            }

            // Create review
            const reviewsContainer = await getContainer("reviews");
            const review = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                bookingId: bookingId || null,
                tutorId,
                studentEmail,
                rating: Number(rating),
                comment: comment || '',
                createdAt: new Date().toISOString()
            };

            await reviewsContainer.items.create(review);

            // Update tutor's average rating
            const tutorsContainer = await getContainer("tutors");
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: tutorId }]
                })
                .fetchAll();

            if (tutors.length > 0) {
                const tutor = tutors[0];
                const currentRating = tutor.rating || 0;
                const currentCount = tutor.reviewCount || 0;

                // Calculate new average
                const newCount = currentCount + 1;
                const newRating = ((currentRating * currentCount) + rating) / newCount;

                tutor.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
                tutor.reviewCount = newCount;
                tutor.updatedAt = new Date().toISOString();

                await tutorsContainer.item(tutor.id, tutor.id).replace(tutor);
            }

            return {
                status: 201,
                body: JSON.stringify({ message: "Review submitted!", review })
            };
        } catch (error) {
            context.log.error("Error creating review:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// GET - Get reviews for a tutor
app.http('getTutorReviews', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'tutors/{tutorId}/reviews',
    handler: async (request, context) => {
        try {
            const tutorId = request.params.tutorId;

            const reviewsContainer = await getContainer("reviews");
            const { resources: reviews } = await reviewsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.tutorId = @tutorId ORDER BY c.createdAt DESC",
                    parameters: [{ name: "@tutorId", value: tutorId }]
                })
                .fetchAll();

            return { status: 200, body: JSON.stringify(reviews) };
        } catch (error) {
            context.log.error("Error getting reviews:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});
