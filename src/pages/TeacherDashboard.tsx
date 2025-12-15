import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

interface Application {
    id: string;
    fullName: string;
    email: string;
    submittedAt: string;
}

interface TutorProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    hourlyRate: number;
    languages: string[];
    rating: number;
    reviewCount: number;
}

interface TeacherStatus {
    hasApplication: boolean;
    status: 'none' | 'pending' | 'approved' | 'rejected';
    application: Application | null;
    tutorProfile: TutorProfile | null;
}

export const TeacherDashboard: React.FC = () => {
    const [data, setData] = useState<TeacherStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/teacher/status');
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                const errorBody = await response.text();
                setError(`Failed to load: ${errorBody}`);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center">Loading your dashboard...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    // No application yet
    if (!data?.hasApplication) {
        return (
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">
                        Become a Teacher
                    </h1>
                    <p className="text-secondary-600 mt-2">Share your knowledge of Punjabi with students worldwide.</p>
                </header>
                <Card className="p-8 max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Ready to teach?</h2>
                    <p className="text-secondary-600 mb-6">
                        Apply to become a Punjabi teacher on our platform. Share your culture for others to learn.
                    </p>
                    <Link to="/become-a-teacher">
                        <Button>Apply Now</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    // Pending application
    if (data.status === 'pending') {
        return (
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">
                        Teacher Dashboard
                    </h1>
                    <p className="text-secondary-600 mt-2">Your application is being reviewed.</p>
                </header>
                <Card className="p-8 max-w-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary-900">Application Under Review</h2>
                            <p className="text-sm text-secondary-500">
                                Submitted on {new Date(data.application?.submittedAt || '').toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                        ℹ️ Our admin team is reviewing your application. This usually takes 24-48 hours.
                        We'll notify you once a decision is made.
                    </div>
                </Card>
            </div>
        );
    }

    // Rejected application
    if (data.status === 'rejected') {
        return (
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">
                        Teacher Dashboard
                    </h1>
                </header>
                <Card className="p-8 max-w-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">❌</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary-900">Application Not Approved</h2>
                        </div>
                    </div>
                    <p className="text-secondary-600 mb-4">
                        Unfortunately, your application was not approved at this time.
                        You can apply again with updated information.
                    </p>
                    <Link to="/become-a-teacher">
                        <Button variant="outline">Apply Again</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    // APPROVED - Full Dashboard
    const profile = data.tutorProfile;

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Teacher Dashboard
                </h1>
                <p className="text-secondary-600 mt-2">Welcome back, {profile?.name || 'Teacher'}! 🎉</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Summary */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-xl font-bold text-secondary-900">Your Profile</h2>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-secondary-500">Hourly Rate</p>
                                <p className="text-lg font-bold text-secondary-900">${profile?.hourlyRate || 0}/hr</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Languages</p>
                                <p className="text-lg font-bold text-secondary-900">{profile?.languages?.join(', ') || 'Punjabi'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Rating</p>
                                <p className="text-lg font-bold text-secondary-900">
                                    {profile?.rating ? `⭐ ${profile.rating.toFixed(1)}` : 'No reviews yet'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Reviews</p>
                                <p className="text-lg font-bold text-secondary-900">{profile?.reviewCount || 0} reviews</p>
                            </div>
                        </div>
                        <p className="text-secondary-600 text-sm mb-4">{profile?.bio}</p>
                        <Button variant="outline">Edit Profile</Button>
                    </Card>

                    {/* Upcoming Sessions */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Upcoming Sessions</h2>
                        <div className="bg-secondary-50 rounded-lg p-8 text-center text-secondary-500">
                            <p className="text-4xl mb-2">📅</p>
                            <p>No upcoming sessions</p>
                            <p className="text-sm">Sessions will appear here when students book with you.</p>
                        </div>
                    </Card>

                    {/* Availability */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-secondary-900">Availability</h2>
                            <Button variant="outline" size="sm">Set Availability</Button>
                        </div>
                        <p className="text-secondary-500 text-sm">
                            Set your weekly availability so students know when they can book sessions with you.
                        </p>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Earnings */}
                    <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                        <h3 className="font-bold text-lg mb-2 opacity-90">Total Earnings</h3>
                        <p className="text-4xl font-bold mb-1">$0.00</p>
                        <p className="text-sm opacity-75">Paid out weekly</p>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                <span className="text-secondary-600">Total Sessions</span>
                                <span className="font-bold text-secondary-900">0</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                <span className="text-secondary-600">Students Taught</span>
                                <span className="font-bold text-secondary-900">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-600">Hours Taught</span>
                                <span className="font-bold text-primary-600">0</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
