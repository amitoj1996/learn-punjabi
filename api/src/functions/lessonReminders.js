const { app } = require('@azure/functions');
const { getContainer } = require('./config/cosmos');
const { sendLessonReminder } = require('./config/email');

/**
 * Timer trigger that runs every hour to send lesson reminders
 * Sends reminders at 24 hours and 1 hour before lessons
 */
app.timer('lessonReminders', {
    schedule: '0 0 * * * *', // Run every hour at minute 0
    handler: async (myTimer, context) => {
        context.log('Lesson reminder timer triggered at:', new Date().toISOString());

        try {
            const bookingsContainer = await getContainer('bookings');
            const now = new Date();

            // Get all confirmed bookings in the next 25 hours
            const tomorrow = new Date(now.getTime() + 25 * 60 * 60 * 1000);
            const todayStr = now.toISOString().split('T')[0];
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const { resources: upcomingBookings } = await bookingsContainer.items
                .query({
                    query: `SELECT * FROM c WHERE c.status = 'confirmed' 
                            AND c.paymentStatus = 'paid'
                            AND (c.date = @today OR c.date = @tomorrow)`,
                    parameters: [
                        { name: '@today', value: todayStr },
                        { name: '@tomorrow', value: tomorrowStr }
                    ]
                })
                .fetchAll();

            context.log(`Found ${upcomingBookings.length} upcoming bookings to check`);

            let reminders24hrSent = 0;
            let reminders1hrSent = 0;

            for (const booking of upcomingBookings) {
                try {
                    // Parse the booking datetime
                    const [hours, minutes] = booking.time.split(':').map(Number);
                    const bookingDate = new Date(booking.date + 'T00:00:00');
                    bookingDate.setHours(hours, minutes, 0, 0);

                    const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

                    // Check if we should send a reminder (and haven't already)
                    if (hoursUntil > 23 && hoursUntil <= 25 && !booking.reminder24hrSent) {
                        // 24-hour reminder
                        await sendLessonReminder(booking.studentEmail, {
                            tutorName: booking.tutorName,
                            date: booking.date,
                            time: booking.time,
                            meetingLink: booking.meetingLink
                        }, 24);

                        // Also remind the teacher
                        if (booking.tutorEmail) {
                            await sendLessonReminder(booking.tutorEmail, {
                                tutorName: `Student (${booking.studentEmail})`,
                                date: booking.date,
                                time: booking.time,
                                meetingLink: booking.meetingLink
                            }, 24);
                        }

                        // Mark as sent
                        booking.reminder24hrSent = true;
                        booking.reminder24hrSentAt = new Date().toISOString();
                        await bookingsContainer.item(booking.id, booking.id).replace(booking);
                        reminders24hrSent++;
                        context.log(`24hr reminder sent for booking ${booking.id}`);

                    } else if (hoursUntil > 0.5 && hoursUntil <= 1.5 && !booking.reminder1hrSent) {
                        // 1-hour reminder
                        await sendLessonReminder(booking.studentEmail, {
                            tutorName: booking.tutorName,
                            date: booking.date,
                            time: booking.time,
                            meetingLink: booking.meetingLink
                        }, 1);

                        // Also remind the teacher
                        if (booking.tutorEmail) {
                            await sendLessonReminder(booking.tutorEmail, {
                                tutorName: `Student (${booking.studentEmail})`,
                                date: booking.date,
                                time: booking.time,
                                meetingLink: booking.meetingLink
                            }, 1);
                        }

                        // Mark as sent
                        booking.reminder1hrSent = true;
                        booking.reminder1hrSentAt = new Date().toISOString();
                        await bookingsContainer.item(booking.id, booking.id).replace(booking);
                        reminders1hrSent++;
                        context.log(`1hr reminder sent for booking ${booking.id}`);
                    }

                } catch (bookingError) {
                    context.log.error(`Error processing booking ${booking.id}:`, bookingError.message);
                }
            }

            context.log(`Reminder job complete. 24hr: ${reminders24hrSent}, 1hr: ${reminders1hrSent}`);

        } catch (error) {
            context.log.error('Lesson reminder job failed:', error);
        }
    }
});
