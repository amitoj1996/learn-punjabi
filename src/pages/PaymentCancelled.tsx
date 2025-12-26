import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const PaymentCancelled: React.FC = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');

    // Cleanup unpaid booking when user lands on cancel page
    useEffect(() => {
        const cleanupUnpaidBooking = async () => {
            if (!bookingId) return;

            try {
                await fetch('/api/checkout/cancel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId })
                });
                console.log('Cleaned up unpaid booking:', bookingId);
            } catch (err) {
                console.log('Could not cleanup booking:', err);
            }
        };

        cleanupUnpaidBooking();
    }, [bookingId]);

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full mx-4"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <XCircle size={48} className="text-orange-600" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Payment Cancelled</h1>
                        <p className="text-secondary-600 mb-6">
                            Your payment was not completed. Don't worry – you can try again anytime!
                        </p>

                        <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-green-800">
                                ✓ No charges were made to your card<br />
                                ✓ Your time slot has been released<br />
                                ✓ You can book again whenever you're ready
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link to="/tutors" className="flex-1">
                                <Button className="w-full">Book Again</Button>
                            </Link>
                            <Link to="/dashboard" className="flex-1">
                                <Button variant="outline" className="w-full">Dashboard</Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};
