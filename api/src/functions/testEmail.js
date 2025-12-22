const { app } = require('@azure/functions');
const { sendEmail, sendBookingConfirmation } = require('./config/email');

// Test endpoint to verify email is working
app.http('testEmail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'test-email',
    handler: async (request, context) => {
        try {
            // Check for admin authentication
            const clientPrincipalHeader = request.headers.get("x-ms-client-principal");
            if (!clientPrincipalHeader) {
                return { status: 401, jsonBody: { error: "Please log in" } };
            }

            const body = await request.json();
            const { to, type } = body;

            if (!to) {
                return { status: 400, jsonBody: { error: "Recipient email required" } };
            }

            if (type === 'booking') {
                // Test booking confirmation
                await sendBookingConfirmation(to, {
                    tutorName: 'Test Teacher',
                    date: new Date().toISOString().split('T')[0],
                    time: '10:00 AM',
                    duration: 60
                });
            } else {
                // Simple test email
                await sendEmail(
                    to,
                    'Test Email from PunjabiLearn 🧪',
                    `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1 style="color: #FF9933;">It works! 🎉</h1>
                        <p>This is a test email from the PunjabiLearn platform.</p>
                        <p>Sent at: ${new Date().toISOString()}</p>
                    </div>
                    `
                );
            }

            context.log(`Test email sent to ${to}`);

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    message: `Test email sent to ${to}`
                }
            };
        } catch (error) {
            context.log.error("Email test failed:", error);
            return {
                status: 500,
                jsonBody: {
                    error: error.message,
                    details: "Check that EMAIL_TENANT_ID, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, and EMAIL_FROM_ADDRESS are set correctly."
                }
            };
        }
    }
});
