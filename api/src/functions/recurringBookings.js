const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// POST - Create recurring bookings (multiple lessons at same time each week)
app.http('createRecurringBookings', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'bookings/recurring',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const studentEmail = clientPrincipal.userDetails;
            const studentId = clientPrincipal.userId;

            // Check if student is suspended
            const usersContainer = await getContainer('users');
            const { resources: users } = await usersContainer.items
                .query({
                    query: 'SELECT * FROM c WHERE c.userDetails = @email',
                    parameters: [{ name: '@email', value: studentEmail }]
                })
                .fetchAll();

            if (users.length > 0 && users[0].suspended === true) {
                return {
                    status: 403,
                    jsonBody: {
                        error: 'Your account has been suspended. You cannot make bookings.',
                        suspended: true
                    }
                };
            }

            const body = await request.json();
            const { tutorId, startDate, time, weeks, duration } = body;

            if (!tutorId || !startDate || !time || !weeks) {
                return { status: 400, jsonBody: { error: "Missing required fields (tutorId, startDate, time, weeks)" } };
            }

            // Validate weeks (1, 2, 4, or 8)
            if (![1, 2, 4, 8].includes(weeks)) {
                return { status: 400, jsonBody: { error: "Weeks must be 1, 2, 4, or 8" } };
            }

            // Get tutor info
            const tutorsContainer = await getContainer("tutors");
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: tutorId }]
                })
                .fetchAll();

            if (tutors.length === 0) {
                return { status: 404, jsonBody: { error: "Tutor not found" } };
            }

            const tutor = tutors[0];
            const bookingsContainer = await getContainer("bookings");

            // Generate recurring ID to link all bookings
            const recurringId = `rec_${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Calculate dates for each week
            const bookingDates = [];
            const startDateObj = new Date(startDate + 'T12:00:00Z');

            for (let i = 0; i < weeks; i++) {
                const date = new Date(startDateObj);
                date.setDate(date.getDate() + (i * 7)); // Add weeks
                bookingDates.push(date.toISOString().split('T')[0]);
            }

            // Check for conflicts on all dates
            const conflicts = [];
            for (const date of bookingDates) {
                const { resources: existingBookings } = await bookingsContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.tutorId = @tutorId AND c.date = @date AND c.time = @time AND c.status != 'cancelled'",
                        parameters: [
                            { name: "@tutorId", value: tutorId },
                            { name: "@date", value: date },
                            { name: "@time", value: time }
                        ]
                    })
                    .fetchAll();

                if (existingBookings.length > 0) {
                    conflicts.push(date);
                }
            }

            if (conflicts.length > 0) {
                return {
                    status: 409,
                    jsonBody: {
                        error: `Some slots are not available: ${conflicts.join(', ')}`,
                        conflicts
                    }
                };
            }

            // Calculate pricing with tiered discounts (1wk=5%, 2wk=5%, 4wk=10%, 8wk=15%)
            const regularPrice = tutor.hourlyRate * weeks;
            let discountPercent = 5; // Default 5% for 1-2 weeks
            if (weeks >= 8) {
                discountPercent = 15;
            } else if (weeks >= 4) {
                discountPercent = 10;
            }
            const discountedTotal = regularPrice * (1 - discountPercent / 100);
            const pricePerLesson = discountedTotal / weeks;

            // Create all bookings
            const bookings = [];
            for (let i = 0; i < weeks; i++) {
                const booking = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
                    tutorId: tutor.id,
                    tutorName: tutor.name,
                    tutorEmail: tutor.email,
                    studentId: studentId,
                    studentEmail: studentEmail,
                    date: bookingDates[i],
                    time: time,
                    duration: duration || 60,
                    hourlyRate: tutor.hourlyRate,
                    status: 'confirmed',
                    paymentStatus: 'pending',
                    paymentAmount: pricePerLesson,
                    meetingLink: null,
                    // Recurring fields
                    recurringId: recurringId,
                    recurringIndex: i + 1,
                    recurringTotal: weeks,
                    isRecurring: true,
                    createdAt: new Date().toISOString()
                };

                await bookingsContainer.items.create(booking);
                bookings.push(booking);
            }

            context.log(`Created ${weeks} recurring bookings with ID: ${recurringId}`);

            return {
                status: 201,
                jsonBody: {
                    message: `Successfully created ${weeks} weekly lessons!`,
                    recurringId: recurringId,
                    bookings: bookings,
                    pricing: {
                        regularPrice: regularPrice,
                        discountPercent: discountPercent,
                        discountedTotal: discountedTotal,
                        savings: regularPrice - discountedTotal
                    }
                }
            };
        } catch (error) {
            context.log.error("Error creating recurring bookings:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// GET - Get all bookings in a recurring series
app.http('getRecurringSeries', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'bookings/recurring/{recurringId}',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const recurringId = request.params.recurringId;

            const bookingsContainer = await getContainer("bookings");
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.recurringId = @recurringId ORDER BY c.date ASC",
                    parameters: [{ name: "@recurringId", value: recurringId }]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 404, jsonBody: { error: "Recurring series not found" } };
            }

            // Verify user owns these bookings
            if (bookings[0].studentEmail !== userEmail && bookings[0].tutorEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "Access denied" } };
            }

            // Calculate stats
            const completed = bookings.filter(b => b.status === 'completed').length;
            const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date()).length;
            const cancelled = bookings.filter(b => b.status === 'cancelled').length;

            return {
                status: 200,
                jsonBody: {
                    recurringId,
                    bookings,
                    stats: {
                        total: bookings.length,
                        completed,
                        upcoming,
                        cancelled
                    }
                }
            };
        } catch (error) {
            context.log.error("Error getting recurring series:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// DELETE - Cancel remaining bookings in a recurring series
app.http('cancelRecurringSeries', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'bookings/recurring/{recurringId}',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const recurringId = request.params.recurringId;

            const bookingsContainer = await getContainer("bookings");
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.recurringId = @recurringId AND c.status = 'confirmed' AND c.date >= @today",
                    parameters: [
                        { name: "@recurringId", value: recurringId },
                        { name: "@today", value: new Date().toISOString().split('T')[0] }
                    ]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 404, jsonBody: { error: "No upcoming bookings found in this series" } };
            }

            // Verify user owns these bookings
            if (bookings[0].studentEmail !== userEmail && bookings[0].tutorEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "You cannot cancel this series" } };
            }

            // Cancel all future bookings
            let cancelledCount = 0;
            for (const booking of bookings) {
                booking.status = 'cancelled';
                booking.cancelledAt = new Date().toISOString();
                booking.cancelledBy = userEmail;
                await bookingsContainer.item(booking.id, booking.id).replace(booking);
                cancelledCount++;
            }

            context.log(`Cancelled ${cancelledCount} recurring bookings in series ${recurringId}`);

            return {
                status: 200,
                jsonBody: {
                    message: `Cancelled ${cancelledCount} upcoming lessons`,
                    cancelledCount
                }
            };
        } catch (error) {
            context.log.error("Error cancelling recurring series:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
