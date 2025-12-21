const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Helper to check if user is admin (checks database, not Azure roles)
async function isAdmin(userEmail) {
    try {
        const usersContainer = await getContainer('users');
        const { resources: users } = await usersContainer.items
            .query({
                query: 'SELECT * FROM c WHERE c.userDetails = @email',
                parameters: [{ name: '@email', value: userEmail }]
            })
            .fetchAll();

        return users.length > 0 && users[0].role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Get teacher earnings report for admin
app.http('getEarningsReport', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'manager/earnings',
    handler: async (request, context) => {
        try {
            // Get user email from auth
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            // Check if user is admin in database
            if (!await isAdmin(userEmail)) {
                return { status: 403, jsonBody: { error: "Admin access required" } };
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

            // Get payouts to check what's already been paid
            const payoutsContainer = await getContainer("payouts");
            const { resources: payouts } = await payoutsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.startDate <= @endDate AND c.endDate >= @startDate",
                    parameters: [
                        { name: "@startDate", value: startDate },
                        { name: "@endDate", value: endDate }
                    ]
                })
                .fetchAll();

            // Group bookings by teacher
            const teacherEarnings = {};
            for (const booking of bookings) {
                const email = booking.tutorEmail;
                if (!teacherEarnings[email]) {
                    teacherEarnings[email] = {
                        teacherEmail: email,
                        teacherName: booking.tutorName,
                        sessions: 0,
                        totalEarnings: 0,
                        bookingIds: []
                    };
                }
                teacherEarnings[email].sessions += 1;
                teacherEarnings[email].totalEarnings += booking.hourlyRate * (booking.duration / 60);
                teacherEarnings[email].bookingIds.push(booking.id);
            }

            // Check payout status for each teacher
            const results = Object.values(teacherEarnings).map(teacher => {
                const teacherPayouts = payouts.filter(p =>
                    p.teacherEmail === teacher.teacherEmail &&
                    p.startDate === startDate &&
                    p.endDate === endDate
                );
                return {
                    ...teacher,
                    payoutStatus: teacherPayouts.length > 0 ? 'paid' : 'pending',
                    paidAt: teacherPayouts[0]?.paidAt || null
                };
            });

            return {
                status: 200,
                jsonBody: {
                    startDate,
                    endDate,
                    totalEarnings: results.reduce((sum, t) => sum + t.totalEarnings, 0),
                    totalSessions: results.reduce((sum, t) => sum + t.sessions, 0),
                    teachers: results.sort((a, b) => b.totalEarnings - a.totalEarnings)
                }
            };
        } catch (error) {
            context.log.error("Error fetching earnings:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Mark teacher as paid for date range
app.http('markTeacherPaid', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'manager/payouts',
    handler: async (request, context) => {
        try {
            // Get user email from auth
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            // Check if user is admin in database
            if (!await isAdmin(userEmail)) {
                return { status: 403, jsonBody: { error: "Admin access required" } };
            }

            const body = await request.json();
            const { teacherEmail, teacherName, startDate, endDate, amount } = body;

            if (!teacherEmail || !startDate || !endDate || amount === undefined) {
                return { status: 400, jsonBody: { error: "Missing required fields" } };
            }

            const payoutsContainer = await getContainer("payouts");

            // Check if already marked as paid
            const { resources: existing } = await payoutsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.teacherEmail = @email AND c.startDate = @start AND c.endDate = @end",
                    parameters: [
                        { name: "@email", value: teacherEmail },
                        { name: "@start", value: startDate },
                        { name: "@end", value: endDate }
                    ]
                })
                .fetchAll();

            if (existing.length > 0) {
                return { status: 400, jsonBody: { error: "Already marked as paid" } };
            }

            // Create payout record
            const payout = {
                id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                teacherEmail,
                teacherName,
                startDate,
                endDate,
                amount,
                paidAt: new Date().toISOString(),
                paidBy: userEmail
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
    date.setDate(date.getDate() - 30); // Last 30 days
    return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Next 30 days (for future bookings)
    return date.toISOString().split('T')[0];
}
