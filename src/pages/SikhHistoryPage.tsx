import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { gurus, historicalEvents, sikhValues, fiveKs } from '../data/sikhHistory';
import { ChevronLeft, ChevronRight, BookOpen, Sword, Calendar, MapPin } from 'lucide-react';

// Khanda SVG Component
const KhandaSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 5 L52 45 L55 45 C60 35, 75 30, 85 35 C75 32, 65 38, 60 50 C65 62, 75 68, 85 65 C75 70, 60 65, 55 55 L52 55 L50 95 L48 55 L45 55 C40 65, 25 70, 15 65 C25 68, 35 62, 40 50 C35 38, 25 32, 15 35 C25 30, 40 35, 45 45 L48 45 L50 5 Z" />
        <circle cx="50" cy="50" r="8" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M30 20 Q50 5, 70 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 80 Q50 95, 70 80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// Hero Section Component
const HeroSection: React.FC = () => (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0.2
                    }}
                    animate={{
                        y: [null, -100, null],
                        opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <KhandaSVG className="w-32 h-32 mx-auto text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]" />
            </motion.div>

            <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                Sikh History
            </motion.h1>

            <motion.p
                className="text-2xl md:text-3xl text-amber-400 font-serif mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                ਸਿੱਖ ਇਤਿਹਾਸ
            </motion.p>

            <motion.p
                className="text-lg text-slate-300 mt-6 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                Explore 550+ years of rich heritage, from Guru Nanak Dev Ji to the present day
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center">
                    <div className="w-1.5 h-3 bg-amber-400/50 rounded-full mt-2" />
                </div>
            </motion.div>
        </div>
    </section>
);

// Guru Card Component
const GuruCard: React.FC<{ guru: typeof gurus[0]; index: number; isActive: boolean; onClick: () => void }> = ({
    guru, index: _index, isActive, onClick
}) => (
    <motion.div
        className={`relative cursor-pointer transition-all duration-500 ${isActive ? 'scale-105 z-20' : 'scale-95 opacity-70'
            }`}
        onClick={onClick}
        whileHover={{ scale: isActive ? 1.05 : 1 }}
        layout
    >
        <div
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 overflow-hidden min-h-[450px]"
            style={{
                boxShadow: isActive ? `0 0 60px ${guru.color}30` : 'none'
            }}
        >
            {/* Accent color bar */}
            <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: guru.color }}
            />

            {/* Guru number badge */}
            <div
                className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: guru.color }}
            >
                {guru.id}
            </div>

            {/* Guru icon placeholder */}
            <div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${guru.color}20`, border: `2px solid ${guru.color}` }}
            >
                🙏
            </div>

            <h3 className="text-2xl font-bold text-white text-center">{guru.name}</h3>
            <p className="text-xl text-amber-400 text-center font-serif mt-1">{guru.gurmukhiName}</p>
            <p className="text-slate-400 text-center mt-2">{guru.years}</p>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6"
                    >
                        <p className="text-slate-300 text-sm leading-relaxed">{guru.contribution}</p>

                        <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <p className="text-amber-400 text-lg font-serif italic">"{guru.famousQuote}"</p>
                            <p className="text-slate-400 text-sm mt-2">{guru.famousQuoteEnglish}</p>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-white text-sm font-semibold mb-2">Key Events:</h4>
                            <ul className="space-y-1">
                                {guru.keyEvents.map((event, i) => (
                                    <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                                        <span style={{ color: guru.color }}>•</span>
                                        {event}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);

// Gurus Section with Carousel
const GurusSection: React.FC = () => {
    const [activeGuru, setActiveGuru] = useState(0);

    const nextGuru = () => setActiveGuru((prev) => (prev + 1) % gurus.length);
    const prevGuru = () => setActiveGuru((prev) => (prev - 1 + gurus.length) % gurus.length);

    return (
        <section className="py-20 bg-gradient-to-b from-slate-900 to-indigo-950">
            <div className="container mx-auto px-6">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white">The 10 Sikh Gurus</h2>
                    <p className="text-2xl text-amber-400 font-serif mt-2">ਦਸ ਸਿੱਖ ਗੁਰੂ</p>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                        From Guru Nanak Dev Ji (1469) to Guru Gobind Singh Ji (1708), each Guru contributed uniquely to Sikh philosophy and community
                    </p>
                </motion.div>

                {/* Carousel navigation */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                        onClick={prevGuru}
                        className="p-3 rounded-full bg-slate-800 text-white hover:bg-amber-500 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex gap-2">
                        {gurus.map((guru, index) => (
                            <button
                                key={guru.id}
                                onClick={() => setActiveGuru(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === activeGuru
                                    ? 'w-8 bg-amber-400'
                                    : 'bg-slate-600 hover:bg-slate-500'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextGuru}
                        className="p-3 rounded-full bg-slate-800 text-white hover:bg-amber-500 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Guru cards */}
                <div className="max-w-lg mx-auto">
                    <GuruCard
                        guru={gurus[activeGuru]}
                        index={activeGuru}
                        isActive={true}
                        onClick={() => { }}
                    />
                </div>

                {/* Quick navigation thumbnails */}
                <div className="flex justify-center gap-2 mt-8 flex-wrap">
                    {gurus.map((guru, index) => (
                        <button
                            key={guru.id}
                            onClick={() => setActiveGuru(index)}
                            className={`px-3 py-2 rounded-lg text-sm transition-all ${index === activeGuru
                                ? 'bg-amber-500 text-slate-900 font-semibold'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Guru {guru.id}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Timeline Event Component
const TimelineEvent: React.FC<{ event: typeof historicalEvents[0]; index: number }> = ({ event, index }) => {
    const getCategoryIcon = () => {
        switch (event.category) {
            case 'guru': return <BookOpen className="w-4 h-4" />;
            case 'battle': return <Sword className="w-4 h-4" />;
            case 'milestone': return <Calendar className="w-4 h-4" />;
            default: return <MapPin className="w-4 h-4" />;
        }
    };

    const getCategoryColor = () => {
        switch (event.category) {
            case 'guru': return 'bg-amber-500';
            case 'battle': return 'bg-red-500';
            case 'milestone': return 'bg-blue-500';
            default: return 'bg-green-500';
        }
    };

    return (
        <motion.div
            className="flex-shrink-0 w-72 p-6 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${getCategoryColor()} text-white`}>
                    {getCategoryIcon()}
                </div>
                <span className="text-amber-400 font-bold text-xl">{event.year}</span>
            </div>
            <h4 className="text-white font-semibold text-lg">{event.title}</h4>
            <p className="text-slate-400 text-sm mt-2">{event.description}</p>
        </motion.div>
    );
};

// Timeline Section
const TimelineSection: React.FC = () => (
    <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white">Historical Timeline</h2>
                <p className="text-2xl text-amber-400 font-serif mt-2">ਇਤਿਹਾਸਕ ਸਮਾਂ-ਰੇਖਾ</p>
                <p className="text-slate-400 mt-4">Scroll through 550+ years of Sikh history</p>
            </motion.div>

            {/* Horizontal scrolling timeline */}
            <div className="overflow-x-auto pb-6 -mx-6 px-6">
                <div className="flex gap-6 min-w-max">
                    {historicalEvents.map((event, index) => (
                        <TimelineEvent key={event.id} event={event} index={index} />
                    ))}
                </div>
            </div>

            {/* Timeline legend */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-slate-400 text-sm">Gurus</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-slate-400 text-sm">Battles</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-400 text-sm">Milestones</span>
                </div>
            </div>
        </div>
    </section>
);

// Core Values Section
const ValuesSection: React.FC = () => (
    <section className="py-20 bg-gradient-to-b from-indigo-950 to-slate-900">
        <div className="container mx-auto px-6">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white">Core Values</h2>
                <p className="text-2xl text-amber-400 font-serif mt-2">ਮੁੱਖ ਕਦਰਾਂ-ਕੀਮਤਾਂ</p>
            </motion.div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {sikhValues.map((value, index) => (
                    <motion.div
                        key={value.name}
                        className="text-center p-8 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(251,191,36,0.1)' }}
                    >
                        <div className="text-5xl mb-4">{value.icon}</div>
                        <h3 className="text-xl font-bold text-white">{value.name}</h3>
                        <p className="text-amber-400 font-serif text-lg mt-1">{value.gurmukhi}</p>
                        <p className="text-slate-400 mt-3">{value.meaning}</p>
                    </motion.div>
                ))}
            </div>

            {/* Five Ks */}
            <motion.div
                className="mt-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h3 className="text-3xl font-bold text-white text-center mb-8">The Five Ks (ਪੰਜ ਕਕਾਰ)</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {fiveKs.map((k, index) => (
                        <motion.div
                            key={k.name}
                            className="p-6 bg-slate-800 rounded-xl border border-amber-500/30 w-48 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, borderColor: 'rgb(251 191 36)' }}
                        >
                            <div className="text-3xl mb-2">{k.icon}</div>
                            <h4 className="text-white font-bold">{k.name}</h4>
                            <p className="text-amber-400 font-serif">{k.gurmukhi}</p>
                            <p className="text-slate-400 text-xs mt-2">{k.meaning}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

// Main Page Component
export const SikhHistoryPage: React.FC = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-slate-900">
                <HeroSection />
                <GurusSection />
                <TimelineSection />
                <ValuesSection />
            </div>
        </Layout>
    );
};

export default SikhHistoryPage;
