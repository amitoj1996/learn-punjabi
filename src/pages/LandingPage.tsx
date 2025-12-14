import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Star, Globe, Users } from 'lucide-react';
import { Layout } from '../components/Layout';

export const LandingPage: React.FC = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-bold text-secondary-900 mb-6"
                    >
                        Connect with your <span className="text-primary-500">Roots</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-secondary-600 max-w-2xl mx-auto mb-10"
                    >
                        The modern way for NRI kids to learn Punjabi. Book 1-on-1 lessons with expert teachers and start speaking confidently.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/tutors">
                            <Button size="lg" className="w-full sm:w-auto">Find a Tutor</Button>
                        </Link>
                        <Link to="/teach">
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto">Become a Teacher</Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="hover:-translate-y-2 transition-transform">
                            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Expert Tutors</h3>
                            <p className="text-secondary-600">Verified native speakers who understand how to teach kids effectively.</p>
                        </Card>
                        <Card className="hover:-translate-y-2 transition-transform">
                            <div className="h-12 w-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-4">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Learn Anywhere</h3>
                            <p className="text-secondary-600">Connect from home or on the go. Flexible scheduling that fits your lifestyle.</p>
                        </Card>
                        <Card className="hover:-translate-y-2 transition-transform">
                            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                <Star size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Personalized Approach</h3>
                            <p className="text-secondary-600">Lessons tailored to your child's level, interests, and learning style.</p>
                        </Card>
                    </div>
                </div>
            </section>
        </Layout>
    );
};
