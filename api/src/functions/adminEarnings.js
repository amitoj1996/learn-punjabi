const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Get teacher earnings report
app.http('getEarningsReport', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/earnings',
    handler: async (request, context) => {
        try {
            // Just require login (skip admin check for debugging)
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            // Get date range from query params
            const url = new URL(request.url);
            const startDate = url.searchParams.get('startDate') || getDefaultStartDate();
            const endDate = url.searchParams.get('endDate') || getDefaultEndDate();

            context.log(`Fetching earnings from ${startDate} to ${endDate}`);

            // Get all paid bookings in date range
            const bookingsContainer = await getContainer("bookings");
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: `SELECT * FROM c WHERE c.paymentStatus = 'paid' 
                            AND c.date >= @startDate AND c.date <= @endDate`,
                    parameters: [
                        { name: "@startDate", value: startDate },
                        { name: "@endDate", value: endDate }
                    ]
                })
                .fetchAll();

            context.log(`Found ${bookings.length} paid bookings`);

            // Group bookings by teacher
            const teacherEarnings = {};
            for (const booking of bookings) {
                const email = booking.tutorEmail;
                if (!teacherEarnings[email]) {
                    teacherEarnings[email] = {
                        teacherEmail: email,
                        teacherName: booking.tutorName || 'Unknown',
                        sessions: 0,
                        totalEarnings: 0,
                        bookingIds: []
                    };
                }
                teacherEarnings[email].sessions += 1;
                // Calculate earnings: hourlyRate * (duration in hours), default duration to 60 min
                const hours = (booking.duration || 60) / 60;
                teacherEarnings[email].totalEarnings += (booking.hourlyRate || 0) * hours;
                teacherEarnings[email].bookingIds.push(booking.id);
            }

            // Convert to array and add payout status
            const results = Object.values(teacherEarnings).map(teacher => ({
                ...teacher,
                payoutStatus: 'pending', // Simplified - mark all as pending for now
                paidAt: null
            }));

            return {
                status: 200,
                jsonBody: {
                    startDate,
                    endDate,
                    totalEarnings: results.reduce((sum, t) => sum + t.totalEarnings, 0),
                    totalSessions: results.reduce((sum, t) => sum + t.sessions, 0),
                    teachers: results.sort((a, b) => b.totalEarnings - a.totalEarnings),
                    debug: {
                        rawBookingsCount: bookings.length,
                        sampleBooking: bookings[0] ? {
                            id: bookings[0].id,
                            date: bookings[0].date,
                            paymentStatus: bookings[0].paymentStatus,
                            hourlyRate: bookings[0].hourlyRate,
                            duration: bookings[0].duration
                        } : null
                    }
                }
            };
        } catch (error) {
            context.log.error("Error fetching earnings:", error);
            return { status: 500, jsonBody: { error: error.message, stack: error.stack } };
        }
    }
});

// Mark teacher as paid (simplified)
app.http('markTeacherPaid', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/payouts',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const body = await request.json();
            const { teacherEmail, teacherName, startDate, endDate, amount } = body;

            if (!teacherEmail || !startDate || !endDate || amount === undefined) {
                return { status: 400, jsonBody: { error: "Missing required fields" } };
            }

            const payoutsContainer = await getContainer("payouts");

            const payout = {
                id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                teacherEmail,
                teacherName,
                startDate,
                endDate,
                amount,
                paidAt: new Date().toISOString()
            };

            await payoutsContainer.items.create(payout);

            return {
                status: 200,
                jsonBody: { message: "Marked as paid", payout }
            };
        } catch (error) {
            context.log.error("Error marking payout:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
}
