import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Star, Globe, Users, CheckCircle, Play, ArrowRight, Sparkles, BookOpen, Video, Award } from 'lucide-react';
import { Layout } from '../components/Layout';

// Animated counter component
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

// Floating shapes component
const FloatingShapes: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
            animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-primary-400/30 to-primary-600/20 rounded-full blur-3xl"
        />
        <motion.div
            animate={{
                x: [0, -80, 0],
                y: [0, 100, 0],
                scale: [1, 0.8, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-[5%] w-96 h-96 bg-gradient-to-br from-accent-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
            animate={{
                x: [0, 60, 0],
                y: [0, -80, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-[30%] w-80 h-80 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl"
        />

        {/* Floating icons */}
        <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 left-[15%] text-4xl"
        >
            ਪ
        </motion.div>
        <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-48 right-[20%] text-3xl opacity-60"
        >
            ੳ
        </motion.div>
        <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 right-[25%] text-4xl opacity-50"
        >
            ੴ
        </motion.div>
    </div>
);

export const LandingPage: React.FC = () => {
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <FloatingShapes />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
                        >
                            <Sparkles size={16} className="animate-pulse" />
                            <span>Connect with your heritage</span>
                        </motion.div>

                        {/* Main Heading with gradient */}
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight"
                        >
                            <span className="text-secondary-900">Learn </span>
                            <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 bg-clip-text text-transparent">
                                Punjabi
                            </span>
                            <br />
                            <span className="text-secondary-900">the </span>
                            <motion.span
                                className="relative inline-block"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="bg-gradient-to-r from-accent-500 to-orange-500 bg-clip-text text-transparent">
                                    Modern
                                </span>
                                <motion.span
                                    className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                />
                            </motion.span>
                            <span className="text-secondary-900"> Way</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-xl md:text-2xl text-secondary-600 max-w-3xl mx-auto mb-12 leading-relaxed"
                        >
                            Connect NRI kids with their cultural roots through
                            <span className="text-primary-600 font-semibold"> 1-on-1 video lessons </span>
                            with expert native speakers.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/tutors">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="group px-8 py-4 text-lg shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow">
                                        Start Learning Free
                                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 text-secondary-700 hover:text-primary-600 transition-colors group"
                            >
                                <span className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                    <Play size={20} className="ml-1 text-primary-600" />
                                </span>
                                <span className="font-medium">Watch how it works</span>
                            </motion.button>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-secondary-500 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>No subscription required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Flexible scheduling</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Money-back guarantee</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { value: 500, suffix: '+', label: 'Active Students' },
                            { value: 50, suffix: '+', label: 'Expert Tutors' },
                            { value: 10000, suffix: '+', label: 'Lessons Completed' },
                            { value: 4.9, suffix: '', label: 'Average Rating' }
                        ].map((stat, i) => (
                            <motion.div key={i} variants={itemVariants} className="text-center text-white">
                                <div className="text-4xl md:text-5xl font-bold mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-primary-100 text-sm md:text-base">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
                            Why Choose <span className="text-primary-500">PunjabiLearn</span>?
                        </h2>
                        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                            Everything you need for an effective and enjoyable learning experience
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Users,
                                color: 'primary',
                                title: 'Expert Native Tutors',
                                description: 'Verified teachers who understand Western kids and can make lessons fun and engaging.'
                            },
                            {
                                icon: Video,
                                color: 'accent',
                                title: '1-on-1 Video Lessons',
                                description: 'Personal attention in HD video calls. Learn at your own pace with real-time feedback.'
                            },
                            {
                                icon: BookOpen,
                                color: 'green',
                                title: 'Cultural Immersion',
                                description: 'It\'s not just language—learn about traditions, festivals, music, and more.'
                            }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden relative">
                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                    <div className="relative z-10">
                                        <motion.div
                                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                            className={`h-16 w-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:shadow-lg transition-shadow`}
                                        >
                                            <feature.icon size={28} />
                                        </motion.div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                                        <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-b from-secondary-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
                            How It <span className="text-primary-500">Works</span>
                        </h2>
                        <p className="text-xl text-secondary-600">Get started in just 3 simple steps</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-3 gap-12 relative"
                    >
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

                        {[
                            { step: 1, title: 'Find Your Tutor', desc: 'Browse profiles, watch intro videos, and pick the perfect match for your child.' },
                            { step: 2, title: 'Book a Lesson', desc: 'Choose a time that works for you. Pay per lesson—no subscriptions needed.' },
                            { step: 3, title: 'Start Learning', desc: 'Join the video call and watch your child connect with their heritage!' }
                        ].map((item, i) => (
                            <motion.div key={i} variants={itemVariants} className="text-center relative">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30"
                                >
                                    {item.step}
                                </motion.div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-secondary-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
                            Loved by <span className="text-primary-500">Families</span>
                        </h2>
                        <p className="text-xl text-secondary-600">See what parents are saying</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            { name: 'Priya S.', location: 'California, USA', text: 'My kids finally understand what their grandparents are saying! The tutors are patient and make it fun.', avatar: '👩' },
                            { name: 'Raj M.', location: 'Toronto, Canada', text: 'Unlike other apps, this feels personal. Our tutor remembers details about our kids and tailors lessons.', avatar: '👨' },
                            { name: 'Simran K.', location: 'London, UK', text: 'The flexible scheduling is a lifesaver. We book lessons around our busy lives.', avatar: '👩' }
                        ].map((testimonial, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="h-full hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 text-8xl text-primary-100 -mr-4 -mt-4 opacity-50">"</div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                            {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                                        </div>
                                        <p className="text-secondary-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-secondary-900">{testimonial.name}</div>
                                                <div className="text-sm text-secondary-500">{testimonial.location}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
                <FloatingShapes />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Award size={48} className="text-primary-200 mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                            Ready to Start the Journey?
                        </h2>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
                            Join thousands of families connecting their children with their Punjabi heritage.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/tutors">
                                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 px-10 py-4 text-lg shadow-2xl">
                                    Find Your Tutor
                                    <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};
