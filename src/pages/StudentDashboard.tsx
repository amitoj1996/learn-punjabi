import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Welcome back, <span className="text-primary-600">{user?.userDetails}</span>! 👋
                </h1>
                <p className="text-secondary-600 mt-2">Ready to learn some new Punjabi words today?</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-secondary-900">Upcoming Lessons</h2>
                            <Link to="/tutors">
                                <Button size="sm" variant="outline">Find a Tutor</Button>
                            </Link>
                        </div>

                        {/* Empty State */}
                        <Card className="p-12 text-center border-dashed border-2 border-secondary-200 bg-secondary-50/50">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                📅
                            </div>
                            <h3 className="text-lg font-bold text-secondary-900 mb-2">No lessons scheduled</h3>
                            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                                You haven't booked any lessons yet. Find a tutor that matches your style and start learning!
                            </p>
                            <Link to="/tutors">
                                <Button>Book a Lesson</Button>
                            </Link>
                        </Card>
                    </section>
                </div>

                <div className="space-y-6">
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
                </div>
            </div>
        </div>
    );
};
