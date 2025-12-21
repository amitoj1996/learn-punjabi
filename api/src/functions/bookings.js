const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');

// GET - Get a specific tutor's availability (public, for students)
app.http('getTutorAvailability', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'tutors/{tutorId}/availability',
    handler: async (request, context) => {
        try {
            const tutorId = request.params.tutorId;

            const tutorsContainer = await getContainer("tutors");
            const { resources: tutors } = await tutorsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: tutorId }]
                })
                .fetchAll();

            if (tutors.length === 0) {
                return { status: 404, body: JSON.stringify({ error: "Tutor not found" }) };
            }

            const tutor = tutors[0];
            return {
                status: 200,
                body: JSON.stringify({
                    tutorId: tutor.id,
                    tutorName: tutor.name,
                    hourlyRate: tutor.hourlyRate,
                    availability: tutor.availability || {},
                    timezone: tutor.timezone || 'America/New_York'
                })
            };
        } catch (error) {
            context.log.error("Error getting tutor availability:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// POST - Create a booking
app.http('createBooking', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'bookings',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
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
                    body: JSON.stringify({
                        error: 'Your account has been suspended. You cannot make bookings.',
                        suspended: true
                    })
                };
            }

            const body = await request.json();
            const { tutorId, date, time, duration } = body;

            if (!tutorId || !date || !time) {
                return { status: 400, body: JSON.stringify({ error: "Missing required fields" }) };
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
                return { status: 404, body: JSON.stringify({ error: "Tutor not found" }) };
            }

            const tutor = tutors[0];

            // Create booking
            let bookingsContainer;
            try {
                bookingsContainer = await getContainer("bookings");
            } catch (containerError) {
                context.log.error("Bookings container not found:", containerError);
                return {
                    status: 500,
                    body: JSON.stringify({ error: "Bookings container not configured. Please create 'bookings' container in Cosmos DB with partition key '/id'." })
                };
            }

            const booking = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                tutorId: tutor.id,
                tutorName: tutor.name,
                tutorEmail: tutor.email,
                studentId: studentId,
                studentEmail: studentEmail,
                date: date,
                time: time,
                duration: duration || 60,
                hourlyRate: tutor.hourlyRate,
                status: 'confirmed',
                paymentStatus: body.paymentStatus || 'pending',
                paymentAmount: body.paymentAmount || tutor.hourlyRate,
                meetingLink: null, // Teacher will add their own meeting link
                createdAt: new Date().toISOString()
            };

            await bookingsContainer.items.create(booking);

            return {
                status: 201,
                body: JSON.stringify({
                    message: "Booking created successfully!",
                    booking: booking
                })
            };
        } catch (error) {
            context.log.error("Error creating booking:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// GET - Get student's bookings
app.http('getStudentBookings', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'bookings/student',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const studentEmail = clientPrincipal.userDetails;

            const bookingsContainer = await getContainer("bookings");
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.studentEmail = @email ORDER BY c.date DESC",
                    parameters: [{ name: "@email", value: studentEmail }]
                })
                .fetchAll();

            return { status: 200, body: JSON.stringify(bookings) };
        } catch (error) {
            context.log.error("Error getting student bookings:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// GET - Get teacher's bookings
app.http('getTeacherBookings', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'bookings/teacher',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const teacherEmail = clientPrincipal.userDetails;

            const bookingsContainer = await getContainer("bookings");
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.tutorEmail = @email ORDER BY c.date DESC",
                    parameters: [{ name: "@email", value: teacherEmail }]
                })
                .fetchAll();

            return { status: 200, body: JSON.stringify(bookings) };
        } catch (error) {
            context.log.error("Error getting teacher bookings:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// DELETE - Cancel a booking
app.http('cancelBooking', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'bookings/{bookingId}',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, body: JSON.stringify({ error: "Please log in" }) };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const bookingId = request.params.bookingId;

            const bookingsContainer = await getContainer("bookings");

            // Find the booking
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: bookingId }]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 404, body: JSON.stringify({ error: "Booking not found" }) };
            }

            const booking = bookings[0];

            // Verify user owns this booking (student or teacher)
            if (booking.studentEmail !== userEmail && booking.tutorEmail !== userEmail) {
                return { status: 403, body: JSON.stringify({ error: "You cannot cancel this booking" }) };
            }

            // Update booking status to cancelled
            booking.status = 'cancelled';
            booking.cancelledAt = new Date().toISOString();
            booking.cancelledBy = userEmail;

            await bookingsContainer.item(booking.id, booking.id).replace(booking);

            return {
                status: 200,
                body: JSON.stringify({ message: "Booking cancelled successfully" })
            };
        } catch (error) {
            context.log.error("Error cancelling booking:", error);
            return { status: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
});

// PATCH - Update meeting link (Teacher only)
app.http('updateMeetingLink', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'bookings/{bookingId}/meeting-link',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const bookingId = request.params.bookingId;
            const body = await request.json();
            const { meetingLink } = body;

            if (!meetingLink) {
                return { status: 400, jsonBody: { error: "Meeting link is required" } };
            }

            // Basic URL validation
            try {
                new URL(meetingLink);
            } catch {
                return { status: 400, jsonBody: { error: "Please provide a valid URL" } };
            }

            const bookingsContainer = await getContainer("bookings");

            // Find the booking
            const { resources: bookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.id = @id",
                    parameters: [{ name: "@id", value: bookingId }]
                })
                .fetchAll();

            if (bookings.length === 0) {
                return { status: 404, jsonBody: { error: "Booking not found" } };
            }

            const booking = bookings[0];

            // Only the teacher can add meeting link
            if (booking.tutorEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "Only the teacher can add a meeting link" } };
            }

            // Update the meeting link
            booking.meetingLink = meetingLink;
            booking.meetingLinkAddedAt = new Date().toISOString();

            await bookingsContainer.item(booking.id, booking.id).replace(booking);

            return {
                status: 200,
                jsonBody: { message: "Meeting link updated successfully", meetingLink }
            };
        } catch (error) {
            context.log.error("Error updating meeting link:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
