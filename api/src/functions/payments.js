const { app } = require('@azure/functions');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getContainer } = require('./config/cosmos');
const { sendBookingConfirmation } = require('./config/email');

// Create Stripe checkout session for booking payment
app.http('createCheckoutSession', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'checkout/create-session',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const body = await request.json();
            const { bookingId, recurringId, totalLessons, isTrial } = body;

            // Debug: Log what we received from frontend
            context.log('=== CREATE CHECKOUT SESSION ===');
            context.log('User:', userEmail);
            context.log('Received from frontend:', JSON.stringify({ bookingId, recurringId, totalLessons, isTrial }));
            context.log('isTrial value:', isTrial, 'Type:', typeof isTrial);

            if (!bookingId) {
                return { status: 400, jsonBody: { error: "Booking ID is required" } };
            }

            // Get booking details
            const bookingsContainer = await getContainer("bookings");
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
            const hourlyRate = booking.hourlyRate;

            // Verify user owns this booking
            if (booking.studentEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "You cannot pay for this booking" } };
            }

            // Check if already paid
            if (booking.paymentStatus === 'paid') {
                return { status: 400, jsonBody: { error: "This booking is already paid" } };
            }

            // Calculate total amount based on trial vs regular
            let amount;
            let applyTrial = false;
            let discountPercent = 0;
            const lessonCount = totalLessons || 1;

            if (String(isTrial) === 'true' || isTrial === true) {
                context.log('Trial mode requested for:', userEmail);

                // Check trial eligibility using EMAIL (not userId which varies by provider)
                const usersContainer = await getContainer("users");
                const { resources: users } = await usersContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.userDetails = @email",
                        parameters: [{ name: "@email", value: userEmail }]
                    })
                    .fetchAll();

                context.log('Found', users.length, 'user records for', userEmail);

                // Check if ANY record indicates the trial has been used
                const hasUsedTrial = users.some(u => u.hasUsedTrial === true);

                if (!hasUsedTrial) {
                    applyTrial = true;
                    discountPercent = 75;  // 75% trial discount
                    // Trial = 75% off the hourly rate (25% of original)
                    amount = Math.round(hourlyRate * 0.25 * 100);  // Convert to cents
                } else {
                    amount = Math.round(hourlyRate * 100);
                }
            } else {
                context.log('Not trial mode - totalLessons:', lessonCount);
                // Regular booking - calculate discount based on total lessons
                if (lessonCount >= 16) discountPercent = 35;
                else if (lessonCount >= 8) discountPercent = 30;
                else if (lessonCount >= 4) discountPercent = 20;
                else if (lessonCount >= 2) discountPercent = 10;

                const regularTotal = hourlyRate * lessonCount;
                const discountedTotal = regularTotal * (1 - discountPercent / 100);
                amount = Math.round(discountedTotal * 100);  // Convert to cents
                context.log(`Regular booking: ${lessonCount} lessons, ${discountPercent}% off, Total: $${discountedTotal}`);
            }

            // Get base URL from request
            const origin = request.headers.get('origin') || 'https://learn-punjabi.azurestaticapps.net';

            // Create Stripe checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: userEmail,
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: applyTrial
                                ? `🎉 Trial Lesson with ${booking.tutorName}`
                                : lessonCount > 1
                                    ? `${lessonCount} Punjabi Lessons with ${booking.tutorName}`
                                    : `Punjabi Lesson with ${booking.tutorName}`,
                            description: applyTrial
                                ? `First lesson special! 75% off - ${booking.duration} min session`
                                : lessonCount > 1
                                    ? `${lessonCount} lessons (${discountPercent}% launch discount applied)`
                                    : `${booking.duration} minute session on ${booking.date} at ${booking.time}`
                        },
                        unit_amount: amount
                    },
                    quantity: 1
                }],
                metadata: {
                    bookingId: booking.id,
                    recurringId: recurringId || booking.recurringId || null,
                    totalLessons: lessonCount.toString(),
                    studentEmail: userEmail,
                    tutorEmail: booking.tutorEmail,
                    isTrial: applyTrial ? 'true' : 'false'
                },
                success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
                cancel_url: `${origin}/payment/cancelled?booking_id=${bookingId}`
            });

            // Update booking with pending payment info
            booking.stripeSessionId = session.id;
            booking.paymentStatus = 'pending';
            booking.isTrial = applyTrial;  // Store trial status on booking
            await bookingsContainer.item(booking.id, booking.id).replace(booking);

            return {
                status: 200,
                jsonBody: {
                    sessionId: session.id,
                    url: session.url
                }
            };
        } catch (error) {
            context.log.error("Error creating checkout session:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Stripe webhook handler for payment confirmation
app.http('stripeWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'webhook/stripe',
    handler: async (request, context) => {
        const sig = request.headers.get('stripe-signature');
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;
        try {
            const rawBody = await request.text();

            if (webhookSecret && sig) {
                event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
            } else {
                // For testing without webhook secret
                event = JSON.parse(rawBody);
            }
        } catch (err) {
            context.log.error('Webhook signature verification failed:', err.message);
            return { status: 400, body: `Webhook Error: ${err.message}` };
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            context.log('Payment successful for session:', session.id);

            try {
                const bookingsContainer = await getContainer("bookings");
                const bookingId = session.metadata?.bookingId;
                const recurringId = session.metadata?.recurringId;
                const totalLessons = parseInt(session.metadata?.totalLessons || '1');

                // If this is a recurring booking, update ALL bookings in the series
                let bookingsToUpdate = [];
                if (recurringId && recurringId !== 'null' && totalLessons > 1) {
                    const { resources: recurringBookings } = await bookingsContainer.items
                        .query({
                            query: "SELECT * FROM c WHERE c.recurringId = @recurringId",
                            parameters: [{ name: "@recurringId", value: recurringId }]
                        })
                        .fetchAll();
                    bookingsToUpdate = recurringBookings;
                    context.log(`Found ${recurringBookings.length} bookings in recurring series: ${recurringId}`);
                } else if (bookingId) {
                    // Single booking - find by ID
                    const { resources: bookings } = await bookingsContainer.items
                        .query({
                            query: "SELECT * FROM c WHERE c.id = @id",
                            parameters: [{ name: "@id", value: bookingId }]
                        })
                        .fetchAll();
                    bookingsToUpdate = bookings;
                }

                if (bookingsToUpdate.length > 0) {
                    const paidAt = new Date().toISOString();
                    const pricePerLesson = session.amount_total ? (session.amount_total / 100) / bookingsToUpdate.length : null;

                    // Update all bookings in the series
                    for (const booking of bookingsToUpdate) {
                        booking.paymentStatus = 'paid';
                        booking.paidAt = paidAt;
                        booking.stripePaymentIntentId = session.payment_intent;
                        if (pricePerLesson) {
                            booking.paymentAmount = pricePerLesson;
                        }
                        await bookingsContainer.item(booking.id, booking.id).replace(booking);
                    }
                    context.log(`Updated ${bookingsToUpdate.length} bookings to paid`);

                    // Send booking confirmation email (using first booking for details)
                    const firstBooking = bookingsToUpdate[0];
                    try {
                        await sendBookingConfirmation(firstBooking.studentEmail, {
                            tutorName: firstBooking.tutorName,
                            date: firstBooking.date,
                            time: firstBooking.time,
                            duration: firstBooking.duration
                        });
                        context.log('Booking confirmation email sent to:', firstBooking.studentEmail);
                    } catch (emailError) {
                        // Log but don't fail the webhook
                        context.log.error('Failed to send confirmation email:', emailError.message);
                    }

                    // Mark trial as used if this was a trial booking
                    if (session.metadata?.isTrial === 'true' && session.metadata?.studentEmail) {
                        try {
                            const usersContainer = await getContainer("users");
                            const { resources: users } = await usersContainer.items
                                .query({
                                    query: "SELECT * FROM c WHERE c.userDetails = @email",
                                    parameters: [{ name: "@email", value: session.metadata.studentEmail }]
                                })
                                .fetchAll();

                            if (users.length > 0) {
                                const user = users[0];
                                user.hasUsedTrial = true;
                                user.trialUsedAt = new Date().toISOString();
                                await usersContainer.item(user.id, user.id).replace(user);
                                context.log('Marked trial as used for:', session.metadata.studentEmail);
                            }
                        } catch (trialError) {
                            context.log.error('Failed to mark trial as used:', trialError.message);
                        }
                    }
                }
            } catch (dbError) {
                context.log.error('Error updating booking:', dbError);
            }
        }

        return { status: 200, body: JSON.stringify({ received: true }) };
    }
});

// Get payment status for a booking
app.http('getPaymentStatus', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'checkout/status/{bookingId}',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const bookingId = request.params.bookingId;

            const bookingsContainer = await getContainer("bookings");
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

            // Verify user has access
            if (booking.studentEmail !== userEmail && booking.tutorEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "Access denied" } };
            }

            return {
                status: 200,
                jsonBody: {
                    paymentStatus: booking.paymentStatus || 'pending',
                    paidAt: booking.paidAt,
                    // Include booking details for calendar integration
                    tutorName: booking.tutorName,
                    date: booking.date,
                    time: booking.time,
                    duration: booking.duration || 60
                }
            };
        } catch (error) {
            context.log.error("Error getting payment status:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Cancel/cleanup unpaid bookings (called when user abandons Stripe checkout)
app.http('cancelUnpaidBooking', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'checkout/cancel',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;
            const body = await request.json();
            const { bookingId, recurringId } = body;

            const bookingsContainer = await getContainer("bookings");

            // If recurringId provided, delete all unpaid bookings in that series
            if (recurringId) {
                const { resources: bookings } = await bookingsContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.recurringId = @recurringId AND c.studentEmail = @email AND c.paymentStatus != 'paid'",
                        parameters: [
                            { name: "@recurringId", value: recurringId },
                            { name: "@email", value: userEmail }
                        ]
                    })
                    .fetchAll();

                let deleted = 0;
                for (const booking of bookings) {
                    await bookingsContainer.item(booking.id, booking.id).delete();
                    deleted++;
                }

                context.log(`Deleted ${deleted} unpaid bookings for cancelled checkout (recurringId: ${recurringId})`);
                return {
                    status: 200,
                    jsonBody: { message: `Cancelled ${deleted} unpaid bookings`, deleted }
                };
            }

            // Single booking cancellation
            if (bookingId) {
                const { resources: bookings } = await bookingsContainer.items
                    .query({
                        query: "SELECT * FROM c WHERE c.id = @id AND c.studentEmail = @email",
                        parameters: [
                            { name: "@id", value: bookingId },
                            { name: "@email", value: userEmail }
                        ]
                    })
                    .fetchAll();

                if (bookings.length > 0 && bookings[0].paymentStatus !== 'paid') {
                    await bookingsContainer.item(bookings[0].id, bookings[0].id).delete();
                    context.log(`Deleted unpaid booking: ${bookingId}`);
                    return { status: 200, jsonBody: { message: 'Unpaid booking cancelled', deleted: 1 } };
                }
            }

            return { status: 200, jsonBody: { message: 'No unpaid bookings to cancel', deleted: 0 } };
        } catch (error) {
            context.log.error("Error cancelling unpaid bookings:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});

// Cleanup ALL unpaid bookings for current user (admin utility)
app.http('cleanupAllUnpaidBookings', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'checkout/cleanup-all',
    handler: async (request, context) => {
        try {
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, "base64").toString("ascii"));
            const userEmail = clientPrincipal.userDetails;

            const bookingsContainer = await getContainer("bookings");

            // Find all unpaid bookings for this user
            const { resources: unpaidBookings } = await bookingsContainer.items
                .query({
                    query: "SELECT * FROM c WHERE c.studentEmail = @email AND c.paymentStatus != 'paid'",
                    parameters: [{ name: "@email", value: userEmail }]
                })
                .fetchAll();

            let deleted = 0;
            for (const booking of unpaidBookings) {
                await bookingsContainer.item(booking.id, booking.id).delete();
                deleted++;
            }

            context.log(`Cleaned up ${deleted} unpaid bookings for user: ${userEmail}`);
            return {
                status: 200,
                jsonBody: {
                    message: `Cleaned up ${deleted} unpaid bookings`,
                    deleted,
                    userEmail
                }
            };
        } catch (error) {
            context.log.error("Error cleaning up unpaid bookings:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
