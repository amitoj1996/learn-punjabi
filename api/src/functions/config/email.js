const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

// Email configuration from environment variables
const TENANT_ID = process.env.EMAIL_TENANT_ID;
const CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET;
const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "support@punjabilearn.com";

let graphClient = null;

/**
 * Initialize the Microsoft Graph client
 */
function getGraphClient() {
    if (!graphClient) {
        if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Email configuration missing. Please set EMAIL_TENANT_ID, EMAIL_CLIENT_ID, and EMAIL_CLIENT_SECRET.");
        }

        const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
            scopes: ["https://graph.microsoft.com/.default"]
        });

        graphClient = Client.initWithMiddleware({ authProvider });
    }
    return graphClient;
}

/**
 * Send an email using Microsoft Graph API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML content of the email
 * @param {string} textBody - Plain text fallback (optional)
 */
async function sendEmail(to, subject, htmlBody, textBody = "") {
    const client = getGraphClient();

    const message = {
        message: {
            subject: subject,
            body: {
                contentType: "HTML",
                content: htmlBody
            },
            from: {
                emailAddress: {
                    address: "noreply@punjabilearn.com",
                    name: "PunjabiLearn"
                }
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to
                    }
                }
            ]
        },
        saveToSentItems: false
    };

    // Send from the support email address
    await client.api(`/users/${FROM_EMAIL}/sendMail`).post(message);
}

/**
 * Send a booking confirmation email
 */
async function sendBookingConfirmation(studentEmail, bookingDetails) {
    const { tutorName, date, time, duration } = bookingDetails;

    const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const subject = `Lesson Confirmed with ${tutorName}! 📚`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1E293B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF9933 0%, #E67E00 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
        .details-box { background: #F8FAFC; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E2E8F0; }
        .detail-row:last-child { border-bottom: none; }
        .label { color: #64748B; }
        .value { font-weight: 600; }
        .cta-button { display: inline-block; background: #FF9933; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Lesson Confirmed!</h1>
        </div>
        <div class="content">
            <p>Great news! Your Punjabi lesson has been confirmed.</p>
            
            <div class="details-box">
                <div class="detail-row">
                    <span class="label">Teacher</span>
                    <span class="value">${tutorName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date</span>
                    <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Time</span>
                    <span class="value">${time}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Duration</span>
                    <span class="value">${duration} minutes</span>
                </div>
            </div>
            
            <p>Your teacher will add a video call link before the lesson. You can view it in your dashboard.</p>
            
            <a href="https://punjabilearn.com/dashboard" class="cta-button">View My Lessons</a>
        </div>
        <div class="footer">
            <p>PunjabiLearn - Connecting roots to future</p>
        </div>
    </div>
</body>
</html>
    `;

    await sendEmail(studentEmail, subject, htmlBody);
}

/**
 * Send a lesson reminder email
 */
async function sendLessonReminder(email, bookingDetails, hoursUntil) {
    const { tutorName, date, time, meetingLink } = bookingDetails;

    const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const timeText = hoursUntil === 24 ? "tomorrow" : "in 1 hour";
    const subject = `Reminder: Your Punjabi lesson is ${timeText}! ⏰`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1E293B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
        .details-box { background: #F8FAFC; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .cta-button { display: inline-block; background: #22C55E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Lesson Reminder</h1>
        </div>
        <div class="content">
            <p>Your Punjabi lesson with <strong>${tutorName}</strong> is ${timeText}!</p>
            
            <div class="details-box">
                <p><strong>📅 ${formattedDate}</strong></p>
                <p><strong>🕐 ${time}</strong></p>
            </div>
            
            ${meetingLink ? `<a href="${meetingLink}" class="cta-button">Join Video Call</a>` : '<p>Your teacher will add the video call link soon. Check your dashboard.</p>'}
        </div>
        <div class="footer">
            <p>PunjabiLearn - Connecting roots to future</p>
        </div>
    </div>
</body>
</html>
    `;

    await sendEmail(email, subject, htmlBody);
}

/**
 * Send teacher approval notification
 */
async function sendTeacherApproved(teacherEmail, teacherName) {
    const subject = `Welcome to PunjabiLearn, ${teacherName}! 🎉`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1E293B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
        .cta-button { display: inline-block; background: #FF9933; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 You're Approved!</h1>
        </div>
        <div class="content">
            <p>Congratulations, ${teacherName}!</p>
            <p>Your application to teach on PunjabiLearn has been <strong>approved</strong>. You can now:</p>
            <ul>
                <li>Set your availability in your dashboard</li>
                <li>Start receiving booking requests from students</li>
                <li>Connect with NRI families worldwide</li>
            </ul>
            
            <a href="https://punjabilearn.com/dashboard" class="cta-button">Go to Dashboard</a>
            
            <p style="margin-top: 30px;">We're excited to have you on board. Welcome to the PunjabiLearn family! 🙏</p>
        </div>
        <div class="footer">
            <p>PunjabiLearn - Connecting roots to future</p>
        </div>
    </div>
</body>
</html>
    `;

    await sendEmail(teacherEmail, subject, htmlBody);
}

/**
 * Send teacher rejection notification
 */
async function sendTeacherRejected(teacherEmail, teacherName) {
    const subject = `Update on Your PunjabiLearn Application`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1E293B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #64748B; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
        .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Application Update</h1>
        </div>
        <div class="content">
            <p>Dear ${teacherName},</p>
            <p>Thank you for your interest in teaching on PunjabiLearn. After careful review, we're unable to approve your application at this time.</p>
            <p>This decision may be due to various factors, and we encourage you to reapply in the future with an updated profile.</p>
            <p>If you have questions, please reply to this email.</p>
        </div>
        <div class="footer">
            <p>PunjabiLearn - Connecting roots to future</p>
        </div>
    </div>
</body>
</html>
    `;

    await sendEmail(teacherEmail, subject, htmlBody);
}

/**
 * Send new message notification email
 */
async function sendNewMessageNotification(recipientEmail, senderName, messagePreview) {
    const subject = `New message from ${senderName} 💬`;

    // Truncate message preview
    const preview = messagePreview.length > 100
        ? messagePreview.substring(0, 100) + '...'
        : messagePreview;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1E293B; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
        .message-box { background: #F8FAFC; border-left: 4px solid #8B5CF6; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .sender { font-weight: 600; color: #8B5CF6; margin-bottom: 5px; }
        .cta-button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 New Message</h1>
        </div>
        <div class="content">
            <p>You have a new message on PunjabiLearn!</p>
            
            <div class="message-box">
                <div class="sender">${senderName}</div>
                <p style="margin: 0; color: #64748B;">"${preview}"</p>
            </div>
            
            <a href="https://punjabilearn.com/messages" class="cta-button">View Message</a>
        </div>
        <div class="footer">
            <p>PunjabiLearn - Connecting roots to future</p>
        </div>
    </div>
</body>
</html>
    `;

    await sendEmail(recipientEmail, subject, htmlBody);
}

module.exports = {
    sendEmail,
    sendBookingConfirmation,
    sendLessonReminder,
    sendTeacherApproved,
    sendTeacherRejected,
    sendNewMessageNotification
};
