import React from 'react';
import { motion } from 'framer-motion';
import { ShieldX, Mail, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface SuspendedPageProps {
    reason?: string;
    suspendedAt?: string;
}

export const SuspendedPage: React.FC<SuspendedPageProps> = ({ reason, suspendedAt }) => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-secondary-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldX className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                    Account Suspended
                </h1>

                <p className="text-secondary-600 mb-6">
                    Your account has been suspended and you cannot access the platform at this time.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm text-red-800">
                        <strong>Reason:</strong> {reason || 'Violation of platform policies'}
                    </p>
                    {suspendedAt && (
                        <p className="text-sm text-red-600 mt-2">
                            <strong>Suspended on:</strong> {new Date(suspendedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    )}
                    {user?.userDetails && (
                        <p className="text-sm text-red-600 mt-2">
                            <strong>Account:</strong> {user.userDetails}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-secondary-50 rounded-xl p-4">
                        <h3 className="font-semibold text-secondary-800 mb-2 flex items-center justify-center gap-2">
                            <Mail size={18} />
                            Need Help?
                        </h3>
                        <p className="text-sm text-secondary-600">
                            If you believe this was a mistake or would like to appeal, please contact our support team at:
                        </p>
                        <a
                            href="mailto:support@learnpunjabi.com"
                            className="text-primary-600 font-medium hover:underline mt-2 block"
                        >
                            support@learnpunjabi.com
                        </a>
                    </div>

                    <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
