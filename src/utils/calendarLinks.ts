// Calendar link generator utilities
// Generates URLs to add events to Google Calendar, Outlook, and .ics files

export interface LessonDetails {
    tutorName: string;
    date: string;      // YYYY-MM-DD format
    time: string;      // HH:mm format (UTC)
    duration: number;  // in minutes
}

/**
 * Convert UTC time to a Date object for a specific date
 */
const getEventDateTime = (date: string, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(date + 'T00:00:00Z');
    eventDate.setUTCHours(hours, minutes, 0, 0);
    return eventDate;
};

/**
 * Format date for Google Calendar URL (YYYYMMDDTHHmmssZ)
 */
const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

/**
 * Format date for Outlook URL (YYYY-MM-DDTHH:mm:ss)
 */
const formatOutlookDate = (date: Date): string => {
    return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
};

/**
 * Generate Google Calendar URL
 */
export const generateGoogleCalendarUrl = (lesson: LessonDetails): string => {
    const startDate = getEventDateTime(lesson.date, lesson.time);
    const endDate = new Date(startDate.getTime() + lesson.duration * 60000);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Punjabi Lesson with ${lesson.tutorName}`,
        dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
        details: `Your ${lesson.duration}-minute Punjabi lesson with ${lesson.tutorName}.\n\nJoin your lesson at: https://punjabilearn.com/dashboard`,
        location: 'Online (PunjabiLearn.com)',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate Outlook Calendar URL
 */
export const generateOutlookCalendarUrl = (lesson: LessonDetails): string => {
    const startDate = getEventDateTime(lesson.date, lesson.time);
    const endDate = new Date(startDate.getTime() + lesson.duration * 60000);

    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: `Punjabi Lesson with ${lesson.tutorName}`,
        startdt: formatOutlookDate(startDate),
        enddt: formatOutlookDate(endDate),
        body: `Your ${lesson.duration}-minute Punjabi lesson with ${lesson.tutorName}. Join at: https://punjabilearn.com/dashboard`,
        location: 'Online (PunjabiLearn.com)',
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Generate .ics file content and trigger download
 */
export const downloadIcsFile = (lesson: LessonDetails): void => {
    const startDate = getEventDateTime(lesson.date, lesson.time);
    const endDate = new Date(startDate.getTime() + lesson.duration * 60000);

    const formatIcsDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//PunjabiLearn//Lesson Booking//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatIcsDate(startDate)}`,
        `DTEND:${formatIcsDate(endDate)}`,
        `SUMMARY:Punjabi Lesson with ${lesson.tutorName}`,
        `DESCRIPTION:Your ${lesson.duration}-minute Punjabi lesson with ${lesson.tutorName}. Join at: https://punjabilearn.com/dashboard`,
        'LOCATION:Online (PunjabiLearn.com)',
        'STATUS:CONFIRMED',
        `UID:${Date.now()}@punjabilearn.com`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `punjabi-lesson-${lesson.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
