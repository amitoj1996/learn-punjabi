import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const PaymentCancelled: React.FC = () => {

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
                            Your payment was not completed. Your booking is still pending and will be cancelled if not paid.
                        </p>

                        <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-orange-800">
                                Don't worry – no charges were made to your card. You can retry the payment or book a different time slot.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link to="/dashboard" className="flex-1">
                                <Button className="w-full">Go to Dashboard</Button>
                            </Link>
                            <Link to="/tutors" className="flex-1">
                                <Button variant="outline" className="w-full">Find Tutors</Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};
