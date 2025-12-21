import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Star, Users, CheckCircle, ArrowRight, Sparkles, BookOpen, Video, Award } from 'lucide-react';
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

// Cursor-following glow component
const CursorGlow: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            animate={{ x: mousePosition.x - 150, y: mousePosition.y - 150 }}
            transition={{ type: "spring", damping: 50, stiffness: 400, mass: 0.5 }}
            className="fixed w-[300px] h-[300px] bg-gradient-to-br from-orange-300/20 via-accent-400/15 to-yellow-300/10 rounded-full blur-3xl pointer-events-none z-0"
            style={{ top: 0, left: 0 }}
        />
    );
};

// Floating shapes component (static background only)
const FloatingShapes: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Single primary gradient orb - subtle background */}
        <motion.div
            animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-primary-400/20 to-primary-600/10 rounded-full blur-3xl"
        />

        {/* Floating Gurmukhi Letters - All 35 consonants */}
        {[
            { char: 'ੳ', top: '10%', left: '5%', size: 'text-3xl', opacity: 0.4, delay: 0 },
            { char: 'ਅ', top: '15%', left: '12%', size: 'text-2xl', opacity: 0.3, delay: 0.2 },
            { char: 'ੲ', top: '8%', left: '25%', size: 'text-4xl', opacity: 0.5, delay: 0.4 },
            { char: 'ਸ', top: '20%', left: '8%', size: 'text-2xl', opacity: 0.35, delay: 0.6 },
            { char: 'ਹ', top: '12%', right: '10%', size: 'text-3xl', opacity: 0.45, delay: 0.3 },
            { char: 'ਕ', top: '25%', right: '5%', size: 'text-2xl', opacity: 0.3, delay: 0.5 },
            { char: 'ਖ', top: '18%', right: '20%', size: 'text-4xl', opacity: 0.4, delay: 0.1 },
            { char: 'ਗ', top: '30%', left: '3%', size: 'text-3xl', opacity: 0.35, delay: 0.7 },
            { char: 'ਘ', top: '35%', right: '8%', size: 'text-2xl', opacity: 0.3, delay: 0.9 },
            { char: 'ਙ', bottom: '35%', left: '10%', size: 'text-3xl', opacity: 0.4, delay: 0.4 },
            { char: 'ਚ', bottom: '40%', right: '12%', size: 'text-2xl', opacity: 0.35, delay: 0.2 },
            { char: 'ਛ', bottom: '30%', left: '18%', size: 'text-4xl', opacity: 0.5, delay: 0.8 },
            { char: 'ਜ', bottom: '25%', right: '5%', size: 'text-3xl', opacity: 0.4, delay: 0.6 },
            { char: 'ਝ', bottom: '20%', left: '5%', size: 'text-2xl', opacity: 0.3, delay: 1 },
            { char: 'ਞ', bottom: '15%', right: '15%', size: 'text-3xl', opacity: 0.35, delay: 0.3 },
            { char: 'ਟ', top: '40%', left: '2%', size: 'text-2xl', opacity: 0.3, delay: 0.5 },
            { char: 'ਠ', top: '45%', right: '3%', size: 'text-3xl', opacity: 0.4, delay: 0.7 },
            { char: 'ਡ', bottom: '45%', left: '15%', size: 'text-2xl', opacity: 0.35, delay: 0.9 },
            { char: 'ਢ', bottom: '50%', right: '10%', size: 'text-4xl', opacity: 0.45, delay: 0.1 },
            { char: 'ਣ', top: '50%', left: '8%', size: 'text-3xl', opacity: 0.4, delay: 0.4 },
            { char: 'ਤ', top: '5%', right: '30%', size: 'text-2xl', opacity: 0.3, delay: 0.6 },
            { char: 'ਥ', bottom: '10%', left: '25%', size: 'text-3xl', opacity: 0.35, delay: 0.2 },
            { char: 'ਦ', top: '22%', left: '20%', size: 'text-4xl', opacity: 0.5, delay: 0.8 },
            { char: 'ਧ', bottom: '18%', right: '22%', size: 'text-2xl', opacity: 0.3, delay: 1.1 },
            { char: 'ਨ', top: '55%', right: '6%', size: 'text-3xl', opacity: 0.4, delay: 0.3 },
            { char: 'ਪ', top: '28%', left: '15%', size: 'text-4xl', opacity: 0.5, delay: 0.5 },
            { char: 'ਫ', bottom: '28%', right: '18%', size: 'text-2xl', opacity: 0.35, delay: 0.7 },
            { char: 'ਬ', top: '60%', left: '4%', size: 'text-3xl', opacity: 0.4, delay: 0.9 },
            { char: 'ਭ', bottom: '55%', right: '4%', size: 'text-2xl', opacity: 0.3, delay: 0.1 },
            { char: 'ਮ', top: '8%', left: '35%', size: 'text-3xl', opacity: 0.45, delay: 0.4 },
            { char: 'ਯ', bottom: '8%', right: '28%', size: 'text-2xl', opacity: 0.3, delay: 0.6 },
            { char: 'ਰ', top: '15%', right: '35%', size: 'text-4xl', opacity: 0.5, delay: 0.2 },
            { char: 'ਲ', bottom: '12%', left: '8%', size: 'text-3xl', opacity: 0.4, delay: 0.8 },
            { char: 'ਵ', bottom: '35%', right: '25%', size: 'text-2xl', opacity: 0.35, delay: 0.5 }
        ].map((letter, i) => (
            <motion.div
                key={i}
                animate={{
                    y: [0, Math.random() > 0.5 ? -20 : 20, 0],
                    rotate: [0, Math.random() > 0.5 ? 15 : -15, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: letter.delay
                }}
                className={`absolute ${letter.size} text-primary-600`}
                style={{
                    top: letter.top,
                    bottom: letter.bottom,
                    left: letter.left,
                    right: letter.right,
                    opacity: letter.opacity
                }}
            >
                {letter.char}
            </motion.div>
        ))}
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
    };

    return (
        <Layout>
            {/* Cursor-following glow - only on larger screens */}
            <div className="hidden md:block">
                <CursorGlow />
            </div>

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
                                        Start Learning
                                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link to="/teach">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-accent-500 text-accent-600 hover:bg-accent-50">
                                        Become a Teacher
                                    </Button>
                                </motion.div>
                            </Link>
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

            {/* Become a Teacher Section */}
            <section className="py-24 bg-gradient-to-br from-accent-50 to-orange-50 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                    <Award size={16} />
                                    <span>Join Our Teaching Community</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
                                    Are You a Native Punjabi Speaker?
                                </h2>
                                <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                                    Share your language and culture with the next generation. Help NRI kids connect with their heritage while earning on your own schedule.
                                </p>
                                <div className="space-y-4 mb-8">
                                    {[
                                        'Set your own hours and rates',
                                        'Teach from anywhere in the world',
                                        'Make a meaningful cultural impact',
                                        'Join a supportive teaching community'
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center">
                                                <CheckCircle size={14} />
                                            </div>
                                            <span className="text-secondary-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/teach">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" className="bg-accent-500 hover:bg-accent-600 px-8 py-4 text-lg shadow-xl">
                                            Apply to Teach
                                            <ArrowRight size={20} className="ml-2" />
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-2xl">
                                    <h3 className="text-2xl font-bold text-secondary-900 mb-6">What We're Looking For</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-secondary-900">Native Punjabi Speakers</h4>
                                                <p className="text-secondary-600 text-sm">Fluent in spoken and written Punjabi</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center flex-shrink-0">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-secondary-900">Teaching Experience</h4>
                                                <p className="text-secondary-600 text-sm">Prior teaching or tutoring preferred</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                                <Video size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-secondary-900">Reliable Internet</h4>
                                                <p className="text-secondary-600 text-sm">For quality video lessons</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
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
