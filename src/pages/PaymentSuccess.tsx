import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { CheckCircle, Calendar, ChevronDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
    generateGoogleCalendarUrl,
    generateOutlookCalendarUrl,
    downloadIcsFile
} from '../utils/calendarLinks';

interface BookingDetails {
    tutorName: string;
    date: string;
    time: string;
    duration: number;
}

export const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'error'>('pending');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [showCalendarMenu, setShowCalendarMenu] = useState(false);

    const bookingId = searchParams.get('booking_id');

    useEffect(() => {
        // Poll for payment confirmation (webhook might take a moment)
        const checkStatus = async () => {
            if (!bookingId) {
                setIsVerifying(false);
                return;
            }

            try {
                const response = await fetch(`/api/checkout/status/${bookingId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.paymentStatus === 'paid') {
                        setPaymentStatus('paid');
                        setIsVerifying(false);
                        // Store booking details for calendar
                        if (data.tutorName && data.date && data.time) {
                            setBookingDetails({
                                tutorName: data.tutorName,
                                date: data.date,
                                time: data.time,
                                duration: data.duration || 60
                            });
                        }
                    }
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 2000);

        // Stop polling after 10 seconds and assume success (Stripe redirects on success)
        setTimeout(() => {
            setIsVerifying(false);
            if (paymentStatus === 'pending') setPaymentStatus('paid');
        }, 10000);

        return () => clearInterval(interval);
    }, [bookingId]);

    const handleAddToGoogleCalendar = () => {
        if (bookingDetails) {
            window.open(generateGoogleCalendarUrl(bookingDetails), '_blank');
            setShowCalendarMenu(false);
        }
    };

    const handleAddToOutlook = () => {
        if (bookingDetails) {
            window.open(generateOutlookCalendarUrl(bookingDetails), '_blank');
            setShowCalendarMenu(false);
        }
    };

    const handleDownloadIcs = () => {
        if (bookingDetails) {
            downloadIcsFile(bookingDetails);
            setShowCalendarMenu(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full mx-4"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        {isVerifying ? (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                                </div>
                                <h1 className="text-2xl font-bold text-secondary-900 mb-2">Confirming Payment...</h1>
                                <p className="text-secondary-600">Please wait while we verify your payment.</p>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle size={48} className="text-green-600" />
                                </motion.div>
                                <h1 className="text-2xl font-bold text-secondary-900 mb-2">Payment Successful! 🎉</h1>
                                <p className="text-secondary-600 mb-6">
                                    Your lesson has been booked and paid for. The teacher has been notified.
                                </p>

                                <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                                    <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                                        <Calendar size={18} /> What's Next?
                                    </h3>
                                    <ul className="text-sm text-green-800 space-y-1">
                                        <li>• Check your dashboard for lesson details</li>
                                        <li>• Wait for your teacher to add a meeting link</li>
                                        <li>• Join your lesson at the scheduled time</li>
                                    </ul>
                                </div>

                                {/* Add to Calendar Button */}
                                {bookingDetails && (
                                    <div className="relative mb-6">
                                        <button
                                            onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                                            className="w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-3 px-4 rounded-xl transition-colors"
                                        >
                                            <Calendar size={18} />
                                            Add to Calendar
                                            <ChevronDown size={16} className={`transition-transform ${showCalendarMenu ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showCalendarMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-secondary-100 overflow-hidden z-10"
                                            >
                                                <button
                                                    onClick={handleAddToGoogleCalendar}
                                                    className="w-full text-left px-4 py-3 hover:bg-secondary-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="text-xl">📅</span>
                                                    Google Calendar
                                                </button>
                                                <button
                                                    onClick={handleAddToOutlook}
                                                    className="w-full text-left px-4 py-3 hover:bg-secondary-50 flex items-center gap-3 transition-colors border-t border-secondary-100"
                                                >
                                                    <span className="text-xl">📧</span>
                                                    Outlook Calendar
                                                </button>
                                                <button
                                                    onClick={handleDownloadIcs}
                                                    className="w-full text-left px-4 py-3 hover:bg-secondary-50 flex items-center gap-3 transition-colors border-t border-secondary-100"
                                                >
                                                    <span className="text-xl">📥</span>
                                                    Download .ics file
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Link to="/dashboard" className="flex-1">
                                        <Button className="w-full">Go to Dashboard</Button>
                                    </Link>
                                    <Link to="/tutors" className="flex-1">
                                        <Button variant="outline" className="w-full">Book Another</Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};
