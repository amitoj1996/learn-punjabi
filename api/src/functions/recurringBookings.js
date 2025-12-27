const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// Calculate discount based on total lessons (LAUNCH PRICING)
function calculateDiscount(totalLessons, isTrial) {
    if (isTrial && totalLessons === 1) return 75;  // First lesson discount
    if (totalLessons >= 16) return 35;  // 🔥 Max savings
    if (totalLessons >= 8) return 30;   // ⭐ Best value
    if (totalLessons >= 4) return 20;   // Popular
    if (totalLessons >= 2) return 10;   // Save 10%
    return 0;
}

// Get day name from date
const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// POST - Create recurring bookings (multiple slots per week, repeated over weeks)
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
            const { tutorId, slots, weeks, duration, isTrial } = body;

            // Support both old format (startDate+time) and new format (slots array)
            let processedSlots = slots;
            if (!slots && body.startDate && body.time) {
                // Legacy format - convert to new format
                const startDateObj = new Date(body.startDate + 'T12:00:00Z');
                const dayOfWeek = DAYS_OF_WEEK[startDateObj.getDay()];
                processedSlots = [{ dayOfWeek, time: body.time }];
            }

            if (!tutorId || !processedSlots || !weeks) {
                return { status: 400, jsonBody: { error: "Missing required fields (tutorId, slots, weeks)" } };
            }

            // Validate weeks (1, 2, 4, or 8)
            if (![1, 2, 4, 8].includes(weeks)) {
                return { status: 400, jsonBody: { error: "Weeks must be 1, 2, 4, or 8" } };
            }

            // Validate slots (at least 1)
            if (processedSlots.length < 1) {
                return { status: 400, jsonBody: { error: "Must select at least one time slot" } };
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

            // Calculate all booking dates for each slot over all weeks
            const allBookings = [];
            const today = new Date();

            for (const slot of processedSlots) {
                // Find the next occurrence of this day of week
                let nextDate = new Date(today);
                nextDate.setDate(nextDate.getDate() + 1); // Start from tomorrow

                while (DAYS_OF_WEEK[nextDate.getDay()] !== slot.dayOfWeek) {
                    nextDate.setDate(nextDate.getDate() + 1);
                }

                // Create bookings for each week
                for (let weekNum = 0; weekNum < weeks; weekNum++) {
                    const bookingDate = new Date(nextDate);
                    bookingDate.setDate(bookingDate.getDate() + (weekNum * 7));
                    const dateStr = bookingDate.toISOString().split('T')[0];

                    allBookings.push({
                        date: dateStr,
                        time: slot.time,
                        dayOfWeek: slot.dayOfWeek,
                        weekNumber: weekNum + 1
                    });
                }
            }

            // Check for conflicts on all dates (only PAID bookings count as conflicts)
            // Unpaid/pending bookings from abandoned checkouts should NOT block new bookings
            const conflicts = [];
            for (const booking of allBookings) {
                const { resources: existingBookings } = await bookingsContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.tutorId = @tutorId AND c.date = @date AND c.time = @time AND c.status != 'cancelled' AND c.paymentStatus = 'paid'",
                        parameters: [
                            { name: "@tutorId", value: tutorId },
                            { name: "@date", value: booking.date },
                            { name: "@time", value: booking.time }
                        ]
                    })
                    .fetchAll();

                if (existingBookings.length > 0) {
                    conflicts.push(`${booking.date} ${booking.time}`);
                }
            }

            if (conflicts.length > 0) {
                return {
                    status: 409,
                    jsonBody: {
                        error: `Some slots are not available: ${conflicts.slice(0, 3).join(', ')}${conflicts.length > 3 ? ' and more...' : ''}`,
                        conflicts
                    }
                };
            }

            // Check trial eligibility (scan all records for safety)
            const hasUsedTrial = users.some(u => u.hasUsedTrial === true);
            const isTrialBooking = isTrial && allBookings.length === 1 && !hasUsedTrial;

            // Calculate pricing with tiered discounts
            const totalLessons = allBookings.length;
            const discountPercent = calculateDiscount(totalLessons, isTrialBooking);
            const regularPrice = tutor.hourlyRate * totalLessons;
            const discountedTotal = regularPrice * (1 - discountPercent / 100);
            const pricePerLesson = discountedTotal / totalLessons;

            // Create all bookings
            const createdBookings = [];
            for (let i = 0; i < allBookings.length; i++) {
                const bookingData = allBookings[i];
                const booking = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
                    tutorId: tutor.id,
                    tutorName: tutor.name,
                    tutorEmail: tutor.email,
                    studentId: studentId,
                    studentEmail: studentEmail,
                    date: bookingData.date,
                    time: bookingData.time,
                    duration: duration || 60,
                    hourlyRate: tutor.hourlyRate,
                    status: 'confirmed',
                    paymentStatus: 'pending',
                    paymentAmount: pricePerLesson,
                    meetingLink: null,
                    // Recurring fields
                    recurringId: recurringId,
                    recurringIndex: i + 1,
                    recurringTotal: totalLessons,
                    isRecurring: totalLessons > 1,
                    isTrial: isTrialBooking && i === 0,
                    createdAt: new Date().toISOString()
                };

                await bookingsContainer.items.create(booking);
                createdBookings.push(booking);
            }

            // Mark trial as used if applicable - REMOVED
            // Trial usage should only be marked AFTER payment is confirmed via webhook
            // if (isTrialBooking && user) {
            //     user.hasUsedTrial = true;
            //     user.trialUsedAt = new Date().toISOString();
            //     await usersContainer.item(user.id, user.userId).replace(user);
            // }

            context.log(`Created ${totalLessons} bookings with recurringId: ${recurringId}`);

            return {
                status: 201,
                jsonBody: {
                    message: `Successfully created ${totalLessons} lesson${totalLessons > 1 ? 's' : ''}!`,
                    recurringId: recurringId,
                    bookings: createdBookings,
                    pricing: {
                        regularPrice: regularPrice,
                        discountPercent: discountPercent,
                        discountedTotal: discountedTotal,
                        savings: regularPrice - discountedTotal,
                        isTrial: isTrialBooking
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
                return { status: 403, jsonBody: { error: "Not authorized" } };
            }

            return {
                status: 200,
                jsonBody: {
                    recurringId,
                    totalLessons: bookings.length,
                    bookings
                }
            };
        } catch (error) {
            context.log.error("Error getting recurring series:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// DELETE - Cancel entire recurring series
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
                    query: "SELECT * FROM c WHERE c.recurringId = @recurringId",
                    parameters: [{ name: "@recurringId", value: recurringId }]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 404, jsonBody: { error: "Recurring series not found" } };
            }

            // Verify user owns these bookings
            if (bookings[0].studentEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "Only the student can cancel bookings" } };
            }

            // Cancel all bookings in the series
            let cancelledCount = 0;
            for (const booking of bookings) {
                if (booking.status !== 'cancelled') {
                    booking.status = 'cancelled';
                    booking.cancelledAt = new Date().toISOString();
                    await bookingsContainer.item(booking.id, booking.id).replace(booking);
                    cancelledCount++;
                }
            }

            return {
                status: 200,
                jsonBody: {
                    message: `Cancelled ${cancelledCount} lessons in the series`,
                    cancelledCount
                }
            };
        } catch (error) {
            context.log.error("Error cancelling recurring series:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
