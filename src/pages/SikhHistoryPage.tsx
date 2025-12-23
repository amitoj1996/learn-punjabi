import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { gurus, historicalEvents, sikhValues, fiveKs, type Guru, type HistoricalEvent } from '../data/sikhHistory';
import { ChevronLeft, ChevronRight, BookOpen, Sword, Calendar, MapPin, X, Users, Scroll, Heart, Info, Target, History } from 'lucide-react';

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

// Detail Modal Component
const GuruDetailModal: React.FC<{ guru: Guru; onClose: () => void }> = ({ guru, onClose }) => {
    const [activeTab, setActiveTab] = useState<'bio' | 'family' | 'teachings'>('bio');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-48 bg-slate-800 overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent z-10" />
                    <div className="absolute inset-0 opacity-30" style={{ backgroundColor: guru.color }} />
                    {guru.image && <img src={guru.image} alt={guru.name} className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-50" />}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute bottom-6 left-8 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-900 bg-white shadow-lg">
                                #{guru.id}
                            </span>
                            <span className="text-amber-400 font-serif text-xl">{guru.gurmukhiName}</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-1">{guru.name}</h2>
                        <p className="text-slate-300">{guru.years} • {guru.birthPlace}</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-700 bg-slate-800/50 flex-shrink-0 overflow-x-auto">
                    {[
                        { id: 'bio', label: 'Biography', icon: BookOpen },
                        { id: 'family', label: 'Family Tree', icon: Users },
                        { id: 'teachings', label: 'Teachings & Legacy', icon: Scroll }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/50">
                    <AnimatePresence mode="wait">
                        {activeTab === 'bio' && (
                            <motion.div
                                key="bio"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                            <Heart size={18} /> Gurgaddi (Guruship)
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">{guru.gurgaddi}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                            <Calendar size={18} /> Key Contribution
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">{guru.contribution}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white font-bold text-xl mb-4">Major Events</h3>
                                    <div className="space-y-3">
                                        {guru.keyEvents.map((event, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: guru.color }} />
                                                <p className="text-slate-300">{event}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'family' && (
                            <motion.div
                                key="family"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parents</span>
                                            <div className="mt-2 text-white font-medium text-lg">
                                                <p>Father: <span className="text-slate-300">{guru.family.father}</span></p>
                                                <p>Mother: <span className="text-slate-300">{guru.family.mother}</span></p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spouse</span>
                                            <p className="mt-2 text-white font-medium text-lg">{guru.family.spouse}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Children</span>
                                        <ul className="mt-4 space-y-3">
                                            {guru.family.children.map((child, i) => (
                                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                                    <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full" />
                                                    {child}
                                                </li>
                                            ))}
                                            {guru.family.children.length === 1 && guru.family.children[0] === 'N/A' && (
                                                <li className="text-slate-500 italic">No historical record of children</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'teachings' && (
                            <motion.div
                                key="teachings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Core Principles</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {guru.teachings.map((teaching, i) => (
                                            <div key={i} className="flex gap-3 p-3 bg-slate-800/30 rounded-lg">
                                                <div className="text-amber-500 mt-1">✦</div>
                                                <p className="text-slate-300">{teaching}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {guru.baani && (
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-4">Sacred Baani (Compositions)</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {guru.baani.map((baani, i) => (
                                                <span key={i} className="px-4 py-2 bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 rounded-full text-sm">
                                                    {baani}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3">Legacy</h3>
                                    <p className="text-slate-300 leading-relaxed text-lg">{guru.legacy}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Event Detail Modal Component
const EventDetailModal: React.FC<{ event: HistoricalEvent; onClose: () => void }> = ({ event, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-40 bg-slate-800 overflow-hidden flex-shrink-0 flex items-end p-8">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />
                    <div className={`absolute inset-0 opacity-20 ${event.category === 'battle' ? 'bg-red-900' :
                            event.category === 'guru' ? 'bg-amber-900' :
                                event.category === 'milestone' ? 'bg-blue-900' : 'bg-green-900'
                        }`} />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${event.category === 'battle' ? 'bg-red-500' :
                                    event.category === 'guru' ? 'bg-amber-500' :
                                        event.category === 'milestone' ? 'bg-blue-500' : 'bg-green-500'
                                }`}>
                                {event.year}
                            </span>
                            <span className="text-slate-300 font-serif uppercase tracking-wider text-sm">{event.category}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">{event.title}</h2>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-900">
                    <div className="space-y-8">
                        <div>
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                {event.longDescription || event.description}
                            </p>
                        </div>

                        {event.context && (
                            <div className="bg-slate-800/30 p-5 rounded-xl border-l-4 border-slate-600">
                                <h4 className="text-white font-bold flex items-center gap-2 mb-2">
                                    <History size={18} className="text-slate-400" /> Historical Context
                                </h4>
                                <p className="text-slate-400 italic">"{event.context}"</p>
                            </div>
                        )}

                        {event.significance && (
                            <div className="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
                                <h4 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                                    <Target size={18} /> Significance
                                </h4>
                                <p className="text-slate-300">{event.significance}</p>
                            </div>
                        )}

                        {event.details && event.details.length > 0 && (
                            <div>
                                <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                                    <Info size={18} className="text-blue-400" /> Key Details
                                </h4>
                                <ul className="space-y-3">
                                    {event.details.map((detail, i) => (
                                        <li key={i} className="flex gap-3 text-slate-300">
                                            <div className="mt-2 w-1.5 h-1.5 bg-slate-500 rounded-full flex-shrink-0" />
                                            <span className="leading-relaxed">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

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
const GuruCard: React.FC<{
    guru: typeof gurus[0];
    index: number;
    isActive: boolean;
    onClick: () => void;
    onReadMore: () => void;
}> = ({
    guru, index: _index, isActive, onClick, onReadMore
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

                {/* Guru Image or Placeholder */}
                {guru.image ? (
                    <div
                        className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white overflow-hidden shadow-lg"
                        style={{ borderColor: guru.color }}
                    >
                        <img
                            src={guru.image}
                            alt={guru.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div
                        className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl bg-slate-800"
                        style={{
                            backgroundColor: `${guru.color}20`,
                            border: `2px solid ${guru.color}`,
                            boxShadow: `0 0 20px ${guru.color}40`
                        }}
                    >
                        🙏
                    </div>
                )}

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
                                    {guru.keyEvents.slice(0, 2).map((event, i) => (
                                        <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                                            <span style={{ color: guru.color }}>•</span>
                                            {event}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReadMore();
                                }}
                                className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                Read Full Profile <ChevronRight size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );

// Gurus Section with Carousel
const GurusSection: React.FC = () => {
    const [activeGuru, setActiveGuru] = useState(0);
    const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);

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
                        onReadMore={() => setSelectedGuru(gurus[activeGuru])}
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

            <AnimatePresence>
                {selectedGuru && (
                    <GuruDetailModal
                        guru={selectedGuru}
                        onClose={() => setSelectedGuru(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

// Timeline Event Component
const TimelineEvent: React.FC<{
    event: HistoricalEvent;
    index: number;
    onClick: () => void;
}> = ({ event, index, onClick }) => {
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
            className="flex-shrink-0 w-80 group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
        >
            <div className="relative p-6 bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${getCategoryColor()} text-white shadow-lg`}>
                        {getCategoryIcon()}
                    </div>
                    <span className="text-3xl font-bold text-slate-700/20 absolute right-6 top-6 transition-colors group-hover:text-white/10">{event.year}</span>
                    <span className="text-amber-400 font-bold text-xl">{event.year}</span>
                </div>

                <h4 className="text-white font-bold text-lg mb-2 leading-snug group-hover:text-amber-400 transition-colors">{event.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">{event.description}</p>

                <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-500 transition-colors mt-auto">
                    Read More <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Timeline connector visual */}
            <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-800 -z-10 group-hover:bg-amber-500/20 transition-colors hidden md:block" />
        </motion.div>
    );
};

// Timeline Section with Filters
const TimelineSection: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'guru' | 'battle' | 'milestone'>('all');
    const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

    const filteredEvents = filter === 'all'
        ? historicalEvents
        : historicalEvents.filter(e => e.category === filter);

    return (
        <section className="py-24 bg-slate-900 border-t border-slate-800/50">
            <div className="container mx-auto px-6">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Historical Timeline</h2>
                    <p className="text-2xl text-amber-400 font-serif mt-2">ਇਤਿਹਾਸਕ ਸਮਾਂ-ਰੇਖਾ</p>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                        Explore major events that shaped the Sikh faith. Select a category to filter the timeline.
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex justify-center flex-wrap gap-4 mb-12">
                    {[
                        { id: 'all', label: 'All Events' },
                        { id: 'guru', label: 'Gurus' },
                        { id: 'battle', label: 'Battles' },
                        { id: 'milestone', label: 'Milestones' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${filter === f.id
                                ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Horizontal continuous timeline */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 -translate-y-1/2 hidden md:block" />

                    <div className="overflow-x-auto pb-12 pt-4 -mx-6 px-6 custom-scrollbar">
                        <div className="flex gap-8 min-w-max px-4">
                            <AnimatePresence mode='popLayout'>
                                {filteredEvents.map((event, index) => (
                                    <TimelineEvent
                                        key={event.id}
                                        event={event}
                                        index={index}
                                        onClick={() => setSelectedEvent(event)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-4 italic flex items-center justify-center gap-2">
                    <ChevronLeft size={14} /> Scroll or swipe to explore <ChevronRight size={14} />
                </p>
            </div>

            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

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
