import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Tutor {
    id: string;
    name: string;
    hourlyRate: number;
    rating: number;
    bio: string;
}

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [featuredTutors, setFeaturedTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedTutors();
    }, []);

    const fetchFeaturedTutors = async () => {
        try {
            const response = await fetch('/api/tutors');
            if (response.ok) {
                const tutors = await response.json();
                setFeaturedTutors(tutors.slice(0, 3)); // Show top 3
            }
        } catch (err) {
            console.error('Failed to load tutors:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Extract first name or email username
    const displayName = user?.userDetails?.split('@')[0] || 'Student';

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Welcome back, <span className="text-primary-600">{displayName}</span>! 👋
                </h1>
                <p className="text-secondary-600 mt-2">Ready to learn some Punjabi today?</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Lessons Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-secondary-900">Upcoming Lessons</h2>
                            <Link to="/tutors">
                                <Button size="sm" variant="outline">Find a Tutor</Button>
                            </Link>
                        </div>

                        {/* Empty State */}
                        <Card className="p-8 text-center border-dashed border-2 border-secondary-200 bg-secondary-50/50">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                📅
                            </div>
                            <h3 className="text-lg font-bold text-secondary-900 mb-2">No lessons scheduled</h3>
                            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                                Book your first lesson with a native Punjabi speaker!
                            </p>
                            <Link to="/tutors">
                                <Button>Book a Lesson</Button>
                            </Link>
                        </Card>
                    </section>

                    {/* Featured Tutors */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-secondary-900">Featured Tutors</h2>
                            <Link to="/tutors" className="text-primary-600 hover:underline text-sm font-medium">
                                View all →
                            </Link>
                        </div>

                        {isLoading ? (
                            <p className="text-secondary-500">Loading tutors...</p>
                        ) : featuredTutors.length === 0 ? (
                            <Card className="p-6 text-center text-secondary-500">
                                No tutors available yet. Check back soon!
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-3 gap-4">
                                {featuredTutors.map((tutor) => (
                                    <Card key={tutor.id} className="p-4 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                                            {tutor.name?.charAt(0) || 'T'}
                                        </div>
                                        <h3 className="font-bold text-secondary-900">{tutor.name}</h3>
                                        <p className="text-sm text-secondary-500 mb-2">
                                            ${tutor.hourlyRate}/hr • ⭐ {tutor.rating || 'New'}
                                        </p>
                                        <p className="text-xs text-secondary-600 line-clamp-2 mb-3">{tutor.bio}</p>
                                        <Link to="/tutors">
                                            <Button size="sm" variant="outline" className="w-full">View Profile</Button>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Quick Links */}
                    <section>
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Quick Start</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="text-3xl mb-3">📚</div>
                                <h3 className="font-bold text-secondary-900 group-hover:text-primary-600">Learn Basics</h3>
                                <p className="text-sm text-secondary-500">Start with common phrases</p>
                            </Card>
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="text-3xl mb-3">🎯</div>
                                <h3 className="font-bold text-secondary-900 group-hover:text-primary-600">Practice</h3>
                                <p className="text-sm text-secondary-500">Quiz yourself on vocabulary</p>
                            </Card>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Weekly Goal */}
                    <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                        <h3 className="font-bold text-lg mb-2">Weekly Goal 🎯</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold">0</span>
                            <span className="text-primary-100 mb-1">/ 3 lessons</span>
                        </div>
                        <div className="w-full bg-primary-900/30 rounded-full h-2">
                            <div className="bg-white rounded-full h-2 w-0"></div>
                        </div>
                    </Card>

                    {/* Learning Stats */}
                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-4">Your Progress</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                <span className="text-secondary-600">Total Lessons</span>
                                <span className="font-bold text-secondary-900">0</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                <span className="text-secondary-600">Hours Learned</span>
                                <span className="font-bold text-secondary-900">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-600">Current Streak</span>
                                <span className="font-bold text-primary-600">🔥 0 days</span>
                            </div>
                        </div>
                    </Card>

                    {/* Want to Teach? */}
                    <Card className="p-6 bg-secondary-50">
                        <h3 className="font-bold text-secondary-900 mb-2">Want to teach?</h3>
                        <p className="text-sm text-secondary-600 mb-4">
                            Share your knowledge of Punjabi with learners worldwide.
                        </p>
                        <Link to="/become-a-teacher">
                            <Button variant="outline" size="sm" className="w-full">Apply as Tutor</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
};
