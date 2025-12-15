import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Tutor {
    id: string;
    name: string;
    hourlyRate: number;
    rating: number;
    bio: string;
}

interface Booking {
    id: string;
    tutorName: string;
    date: string;
    time: string;
    duration: number;
    hourlyRate: number;
    status: string;
}

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [featuredTutors, setFeaturedTutors] = useState<Tutor[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchFeaturedTutors(), fetchBookings()]).finally(() => setIsLoading(false));
    }, []);

    const fetchFeaturedTutors = async () => {
        try {
            const response = await fetch('/api/tutors');
            if (response.ok) {
                const tutors = await response.json();
                setFeaturedTutors(tutors.slice(0, 3));
            }
        } catch (err) {
            console.error('Failed to load tutors:', err);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings/student');
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (err) {
            console.error('Failed to load bookings:', err);
        }
    };

    const displayName = user?.userDetails?.split('@')[0] || 'Student';
    const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date());

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">
                        Welcome back, <span className="text-primary-600">{displayName}</span>! 👋
                    </h1>
                    <p className="text-secondary-600 mt-2">Ready to learn some Punjabi today?</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upcoming Lessons */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-secondary-900">Upcoming Lessons</h2>
                                <Link to="/tutors"><Button size="sm" variant="outline">Find a Tutor</Button></Link>
                            </div>

                            {upcomingBookings.length === 0 ? (
                                <Card className="p-8 text-center border-dashed border-2 border-secondary-200 bg-secondary-50/50">
                                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📅</div>
                                    <h3 className="text-lg font-bold text-secondary-900 mb-2">No lessons scheduled</h3>
                                    <p className="text-secondary-600 mb-6 max-w-md mx-auto">Book your first lesson with a native Punjabi speaker!</p>
                                    <Link to="/tutors"><Button>Book a Lesson</Button></Link>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.slice(0, 3).map(booking => (
                                        <Card key={booking.id} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                    {booking.tutorName?.charAt(0) || 'T'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-secondary-900">{booking.tutorName}</h3>
                                                    <p className="text-sm text-secondary-500">
                                                        {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{booking.status}</span>
                                                <p className="text-sm text-secondary-500 mt-1">${booking.hourlyRate}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Featured Tutors */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-secondary-900">Featured Tutors</h2>
                                <Link to="/tutors" className="text-primary-600 hover:underline text-sm font-medium">View all →</Link>
                            </div>
                            {isLoading ? (
                                <p className="text-secondary-500">Loading tutors...</p>
                            ) : featuredTutors.length === 0 ? (
                                <Card className="p-6 text-center text-secondary-500">No tutors available yet.</Card>
                            ) : (
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {featuredTutors.map((tutor) => (
                                        <Card key={tutor.id} className="p-4 hover:shadow-lg transition-shadow">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">{tutor.name?.charAt(0) || 'T'}</div>
                                            <h3 className="font-bold text-secondary-900">{tutor.name}</h3>
                                            <p className="text-sm text-secondary-500 mb-2">${tutor.hourlyRate}/hr • ⭐ {tutor.rating || 'New'}</p>
                                            <Link to="/tutors"><Button size="sm" variant="outline" className="w-full">View Profile</Button></Link>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                            <h3 className="font-bold text-lg mb-2">Weekly Goal 🎯</h3>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-4xl font-bold">{upcomingBookings.length}</span>
                                <span className="text-primary-100 mb-1">/ 3 lessons</span>
                            </div>
                            <div className="w-full bg-primary-900/30 rounded-full h-2">
                                <div className="bg-white rounded-full h-2" style={{ width: `${Math.min(upcomingBookings.length / 3 * 100, 100)}%` }}></div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4">Your Progress</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                    <span className="text-secondary-600">Total Lessons</span>
                                    <span className="font-bold text-secondary-900">{bookings.length}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                    <span className="text-secondary-600">Hours Learned</span>
                                    <span className="font-bold text-secondary-900">{bookings.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary-600">Upcoming</span>
                                    <span className="font-bold text-primary-600">{upcomingBookings.length}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-secondary-50">
                            <h3 className="font-bold text-secondary-900 mb-2">Want to teach?</h3>
                            <p className="text-sm text-secondary-600 mb-4">Share your knowledge of Punjabi with learners worldwide.</p>
                            <Link to="/teach"><Button variant="outline" size="sm" className="w-full">Apply as Tutor</Button></Link>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
