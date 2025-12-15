import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
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

interface Booking {
    id: string;
    studentEmail: string;
    date: string;
    time: string;
    duration: number;
    hourlyRate: number;
    status: string;
}

interface TeacherStatus {
    hasApplication: boolean;
    status: 'none' | 'pending' | 'approved' | 'rejected';
    application: Application | null;
    tutorProfile: TutorProfile | null;
}

export const TeacherDashboard: React.FC = () => {
    const [data, setData] = useState<TeacherStatus | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
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
                if (result.status === 'approved') {
                    fetchBookings();
                }
            } else {
                setError(`Failed to load: ${await response.text()}`);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings/teacher');
            if (response.ok) {
                setBookings(await response.json());
            }
        } catch (err) {
            console.error('Failed to load bookings:', err);
        }
    };

    if (isLoading) return <Layout><div className="p-12 text-center">Loading...</div></Layout>;
    if (error) return <Layout><div className="container mx-auto px-4 py-12"><div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div></div></Layout>;
    if (!data?.hasApplication) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <header className="mb-12">
                        <h1 className="text-3xl font-display font-bold text-secondary-900">Become a Teacher</h1>
                        <p className="text-secondary-600 mt-2">Share your knowledge of Punjabi with students worldwide.</p>
                    </header>
                    <Card className="p-8 max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">Ready to teach?</h2>
                        <p className="text-secondary-600 mb-6">Apply to become a Punjabi teacher on our platform.</p>
                        <Link to="/teach"><Button>Apply Now</Button></Link>
                    </Card>
                </div>
            </Layout>
        );
    }
    if (data.status === 'pending') {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <header className="mb-12"><h1 className="text-3xl font-display font-bold text-secondary-900">Teacher Dashboard</h1></header>
                    <Card className="p-8 max-w-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">⏳</div>
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900">Application Under Review</h2>
                                <p className="text-sm text-secondary-500">Submitted {new Date(data.application?.submittedAt || '').toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">ℹ️ Our team is reviewing your application. This usually takes 24-48 hours.</div>
                    </Card>
                </div>
            </Layout>
        );
    }
    if (data.status === 'rejected') {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <header className="mb-12"><h1 className="text-3xl font-display font-bold text-secondary-900">Teacher Dashboard</h1></header>
                    <Card className="p-8 max-w-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">❌</div>
                            <h2 className="text-xl font-bold text-secondary-900">Application Not Approved</h2>
                        </div>
                        <p className="text-secondary-600 mb-4">Unfortunately, your application was not approved. You can apply again.</p>
                        <Link to="/teach"><Button variant="outline">Apply Again</Button></Link>
                    </Card>
                </div>
            </Layout>
        );
    }

    // APPROVED - Full Dashboard
    const profile = data.tutorProfile;
    const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date());
    const totalEarnings = bookings.reduce((sum, b) => sum + b.hourlyRate, 0);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">Teacher Dashboard</h1>
                    <p className="text-secondary-600 mt-2">Welcome back, {profile?.name || 'Teacher'}! 🎉</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Summary */}
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-bold text-secondary-900">Your Profile</h2>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div><p className="text-sm text-secondary-500">Hourly Rate</p><p className="text-lg font-bold text-secondary-900">${profile?.hourlyRate || 0}/hr</p></div>
                                <div><p className="text-sm text-secondary-500">Languages</p><p className="text-lg font-bold text-secondary-900">{profile?.languages?.join(', ') || 'Punjabi'}</p></div>
                                <div><p className="text-sm text-secondary-500">Rating</p><p className="text-lg font-bold text-secondary-900">{profile?.rating ? `⭐ ${profile.rating.toFixed(1)}` : 'No reviews yet'}</p></div>
                                <div><p className="text-sm text-secondary-500">Reviews</p><p className="text-lg font-bold text-secondary-900">{profile?.reviewCount || 0} reviews</p></div>
                            </div>
                            <p className="text-secondary-600 text-sm mb-4">{profile?.bio}</p>
                            <Link to="/edit-profile"><Button variant="outline">Edit Profile</Button></Link>
                        </Card>

                        {/* Upcoming Sessions */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-secondary-900 mb-4">Upcoming Sessions</h2>
                            {upcomingBookings.length === 0 ? (
                                <div className="bg-secondary-50 rounded-lg p-8 text-center text-secondary-500">
                                    <p className="text-4xl mb-2">📅</p>
                                    <p>No upcoming sessions</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.slice(0, 5).map(booking => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-secondary-900">{booking.studentEmail.split('@')[0]}</p>
                                                <p className="text-sm text-secondary-500">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.time}</p>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{booking.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Availability */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-secondary-900">Availability</h2>
                                <Link to="/availability"><Button variant="outline" size="sm">Set Availability</Button></Link>
                            </div>
                            <p className="text-secondary-500 text-sm">Set your weekly availability so students know when to book.</p>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                            <h3 className="font-bold text-lg mb-2 opacity-90">Total Earnings</h3>
                            <p className="text-4xl font-bold mb-1">${totalEarnings.toFixed(2)}</p>
                            <p className="text-sm opacity-75">Paid out weekly</p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                    <span className="text-secondary-600">Total Sessions</span>
                                    <span className="font-bold text-secondary-900">{bookings.length}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                    <span className="text-secondary-600">Upcoming</span>
                                    <span className="font-bold text-secondary-900">{upcomingBookings.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary-600">Hours Taught</span>
                                    <span className="font-bold text-primary-600">{bookings.length}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
