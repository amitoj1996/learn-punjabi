const { app } = require('@azure/functions');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getContainer } = require('./config/cosmos');

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
            const { bookingId } = body;

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

            // Verify user owns this booking
            if (booking.studentEmail !== userEmail) {
                return { status: 403, jsonBody: { error: "You cannot pay for this booking" } };
            }

            // Check if already paid
            if (booking.paymentStatus === 'paid') {
                return { status: 400, jsonBody: { error: "This booking is already paid" } };
            }

            // Calculate amount in cents
            const amount = Math.round((booking.hourlyRate * booking.duration / 60) * 100);

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
                            name: `Punjabi Lesson with ${booking.tutorName}`,
                            description: `${booking.duration} minute session on ${booking.date} at ${booking.time}`
                        },
                        unit_amount: amount
                    },
                    quantity: 1
                }],
                metadata: {
                    bookingId: booking.id,
                    studentEmail: userEmail,
                    tutorEmail: booking.tutorEmail
                },
                success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
                cancel_url: `${origin}/payment/cancelled?booking_id=${bookingId}`
            });

            // Update booking with pending payment info
            booking.stripeSessionId = session.id;
            booking.paymentStatus = 'pending';
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

                if (bookingId) {
                    const { resources: bookings } = await bookingsContainer.items
                        .query({
                            query: "SELECT * FROM c WHERE c.id = @id",
                            parameters: [{ name: "@id", value: bookingId }]
                        })
                        .fetchAll();

                    if (bookings.length > 0) {
                        const booking = bookings[0];
                        booking.paymentStatus = 'paid';
                        booking.paidAt = new Date().toISOString();
                        booking.stripePaymentIntentId = session.payment_intent;
                        await bookingsContainer.item(booking.id, booking.id).replace(booking);
                        context.log('Booking updated to paid:', bookingId);
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
                    paidAt: booking.paidAt
                }
            };
        } catch (error) {
            context.log.error("Error getting payment status:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
