import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
// import { useAuth } from '../context/AuthContext';

export const TeacherDashboard: React.FC = () => {
    // const { user } = useAuth();

    // Mock Status for visualization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status: any = 'pending'; // 'pending' | 'approved' | 'rejected'

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Teacher Dashboard
                </h1>
                <p className="text-secondary-600 mt-2">Manage your profile and classes.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Application Status Card */}
                    <Card className="p-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900">Application Status</h2>
                                <p className="text-secondary-600">tutor application #1234</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'approved' ? 'bg-green-100 text-green-700' :
                                    status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </div>

                        {status === 'pending' && (
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
                                ℹ️ Your application is currently under review by our admin team. This usually takes 24-48 hours.
                            </div>
                        )}

                        {status === 'approved' && (
                            <div className="space-y-4">
                                <p className="text-green-700 font-medium">🎉 You have been approved!</p>
                                <Button>Edit Public Profile</Button>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-secondary-900 text-white">
                        <h3 className="font-bold text-lg mb-2">Earnings</h3>
                        <p className="text-3xl font-bold text-primary-400">$0.00</p>
                        <p className="text-sm text-secondary-400">Paid out weekly</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
