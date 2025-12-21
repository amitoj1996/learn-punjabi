const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Debug endpoint to check booking payment statuses
app.http('debugBookings', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'debug/bookings',
    handler: async (request, context) => {
        try {
            // Just require login, no admin check for debugging
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const bookingsContainer = await getContainer("bookings");
            const { resources: allBookings } = await bookingsContainer.items
                .query({
                    query: "SELECT c.id, c.date, c.tutorEmail, c.tutorName, c.studentEmail, c.paymentStatus, c.stripeSessionId, c.paidAt, c.hourlyRate FROM c ORDER BY c.createdAt DESC"
                })
                .fetchAll();

            const summary = {
                total: allBookings.length,
                paid: allBookings.filter(b => b.paymentStatus === 'paid').length,
                pending: allBookings.filter(b => b.paymentStatus === 'pending').length,
                noStatus: allBookings.filter(b => !b.paymentStatus).length
            };

            return {
                status: 200,
                jsonBody: { summary, bookings: allBookings.slice(0, 20) }
            };
        } catch (error) {
            context.log.error("Error:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
