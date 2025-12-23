import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { gurus, historicalEvents, sikhValues, fiveKs, type Guru, type HistoricalEvent } from '../data/sikhHistory';
import { ChevronLeft, ChevronRight, BookOpen, Sword, Calendar, MapPin, X, Users, Scroll, Heart, ArrowDown } from 'lucide-react';

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8 }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true }
};

// ============================================
// HERO SECTION - GRADIENT MESH
// ============================================
const HeroSection: React.FC = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/30 via-transparent to-transparent" />

            {/* Subtle animated orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
                <img
                    src="/images/history/khanda.png"
                    alt="Khanda - Sikh Symbol"
                    className="w-32 h-40 md:w-40 md:h-48 mx-auto drop-shadow-[0_0_60px_rgba(251,191,36,0.5)]"
                />
            </motion.div>

            <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold mt-8 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                    The Sikh Legacy
                </span>
            </motion.h1>

            <motion.p
                className="text-2xl md:text-3xl text-amber-500/80 font-serif mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                ਸਿੱਖ ਇਤਿਹਾਸ
            </motion.p>

            <motion.p
                className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                A journey through 550 years of faith, courage, and unwavering devotion to truth.
            </motion.p>

            <motion.div
                className="mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2 text-slate-500"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs uppercase tracking-[0.3em]">Scroll to explore</span>
                    <ArrowDown size={20} />
                </motion.div>
            </motion.div>
        </div>
    </section>
);

// ============================================
// CORE VALUES - GLASSMORPHISM CARDS
// ============================================
const ValuesSection: React.FC = () => (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-900/10 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
            <motion.div className="text-center mb-20" {...fadeInUp}>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">The Foundation</h2>
                <p className="text-2xl text-amber-500/80 font-serif">ਮੁੱਖ ਕਦਰਾਂ-ਕੀਮਤਾਂ</p>
            </motion.div>

            {/* Three Pillars - Glassmorphism */}
            <motion.div
                className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24"
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
            >
                {sikhValues.map((value, index) => (
                    <motion.div
                        key={value.name}
                        className="relative group"
                        variants={{
                            initial: { opacity: 0, y: 50 },
                            whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.15 } }
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all duration-500 h-full">
                            <div className="text-6xl mb-6">{value.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-2">{value.name}</h3>
                            <p className="text-amber-400 font-serif text-lg mb-4">{value.gurmukhi}</p>
                            <p className="text-slate-400 leading-relaxed">{value.meaning}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Five Ks */}
            <motion.div {...fadeInUp}>
                <h3 className="text-3xl font-bold text-white text-center mb-12">The Five Ks <span className="text-amber-500/80 font-serif">ਪੰਜ ਕਕਾਰ</span></h3>
                <div className="flex flex-wrap justify-center gap-6">
                    {fiveKs.map((k, index) => (
                        <motion.div
                            key={k.name}
                            className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-44 text-center hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="text-4xl mb-3">{k.icon}</div>
                            <h4 className="text-white font-bold text-lg">{k.name}</h4>
                            <p className="text-amber-400 font-serif text-sm">{k.gurmukhi}</p>
                            <p className="text-slate-500 text-xs mt-3">{k.meaning}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

// ============================================
// GURUS SECTION - ALTERNATING LAYOUT
// ============================================
const GuruCard: React.FC<{ guru: Guru; index: number; onReadMore: () => void }> = ({ guru, index, onReadMore }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center py-20 border-b border-slate-800/50 last:border-b-0`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            {/* Image */}
            <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
                    <img
                        src={guru.image || '/images/history/placeholder.jpg'}
                        alt={guru.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 text-center md:text-left">
                <motion.p
                    className="text-amber-500 font-serif text-xl mb-2"
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {guru.gurmukhiName}
                </motion.p>
                <motion.h3
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    {guru.name}
                </motion.h3>
                <motion.p
                    className="text-slate-500 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    {guru.years} • {guru.birthPlace}
                </motion.p>

                {/* Quote Card - Glassmorphism */}
                <motion.div
                    className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-amber-400 font-serif text-xl italic mb-2">"{guru.famousQuote}"</p>
                    <p className="text-slate-400 text-sm">{guru.famousQuoteEnglish}</p>
                </motion.div>

                <motion.p
                    className="text-slate-300 leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    {guru.contribution}
                </motion.p>

                <motion.button
                    onClick={onReadMore}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 rounded-full font-semibold hover:bg-amber-400 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Read Full Profile <ChevronRight size={18} />
                </motion.button>
            </div>
        </motion.div>
    );
};

const GurusSection: React.FC = () => {
    const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);

    return (
        <section className="py-32 bg-slate-950">
            <div className="container mx-auto px-6">
                <motion.div className="text-center mb-20" {...fadeInUp}>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">The Ten Gurus</h2>
                    <p className="text-2xl text-amber-500/80 font-serif">ਦਸ ਪਾਤਸ਼ਾਹੀਆਂ</p>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    {gurus.map((guru, index) => (
                        <GuruCard
                            key={guru.id}
                            guru={guru}
                            index={index}
                            onReadMore={() => setSelectedGuru(guru)}
                        />
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

// ============================================
// GURU DETAIL MODAL (kept from original)
// ============================================
const GuruDetailModal: React.FC<{ guru: Guru; onClose: () => void }> = ({ guru, onClose }) => {
    const [activeTab, setActiveTab] = useState<'bio' | 'family' | 'teachings'>('bio');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-48 bg-slate-800 overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
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
                            <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-900 bg-amber-500 shadow-lg">
                                Guru {guru.id}
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
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabModal"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-900/50">
                    <AnimatePresence mode="wait">
                        {activeTab === 'bio' && (
                            <motion.div
                                key="bio"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                        <Heart size={18} /> Contribution
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">{guru.contribution}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <h3 className="text-amber-400 font-bold mb-3">Key Events</h3>
                                    <ul className="space-y-2">
                                        {guru.keyEvents.map((event, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                                                {event}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'family' && (
                            <motion.div
                                key="family"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid md:grid-cols-2 gap-6"
                            >
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-2">Father</h4>
                                    <p className="text-white text-lg">{guru.family.father}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-2">Mother</h4>
                                    <p className="text-white text-lg">{guru.family.mother}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 md:col-span-2">
                                    <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-2">Spouse</h4>
                                    <p className="text-white text-lg">{guru.family.spouse}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 md:col-span-2">
                                    <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-4">Children</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {guru.family.children.map((child, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-sm">
                                                {child}
                                            </span>
                                        ))}
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
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-white font-bold mb-4">Core Teachings</h3>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {guru.teachings.map((teaching, i) => (
                                            <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                                <div className="text-amber-500 mt-0.5">✦</div>
                                                <p className="text-slate-300">{teaching}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {guru.baani && (
                                    <div>
                                        <h3 className="text-white font-bold mb-4">Sacred Compositions (Baani)</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {guru.baani.map((b, i) => (
                                                <span key={i} className="px-4 py-2 bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 rounded-full text-sm">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20">
                                    <h3 className="text-amber-400 font-bold mb-3">Legacy</h3>
                                    <p className="text-slate-300 leading-relaxed">{guru.legacy}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ============================================
// TIMELINE SECTION
// ============================================
const TimelineEvent: React.FC<{ event: HistoricalEvent; index: number }> = ({ event, index }) => {
    const getCategoryColor = () => {
        switch (event.category) {
            case 'guru': return 'bg-amber-500';
            case 'battle': return 'bg-red-500';
            case 'milestone': return 'bg-blue-500';
            default: return 'bg-green-500';
        }
    };

    const getCategoryIcon = () => {
        switch (event.category) {
            case 'guru': return <BookOpen className="w-4 h-4" />;
            case 'battle': return <Sword className="w-4 h-4" />;
            case 'milestone': return <Calendar className="w-4 h-4" />;
            default: return <MapPin className="w-4 h-4" />;
        }
    };

    return (
        <motion.div
            className="flex-shrink-0 w-80 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <div className="relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${getCategoryColor()} text-white shadow-lg`}>
                        {getCategoryIcon()}
                    </div>
                    <span className="text-amber-400 font-bold text-2xl ml-auto">{event.year}</span>
                </div>

                <h4 className="text-white font-bold text-lg mb-2 leading-snug group-hover:text-amber-400 transition-colors">
                    {event.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                    {event.description}
                </p>
            </div>
        </motion.div>
    );
};

const TimelineSection: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'guru' | 'battle' | 'milestone'>('all');

    const filteredEvents = filter === 'all'
        ? historicalEvents
        : historicalEvents.filter(e => e.category === filter);

    return (
        <section className="py-32 bg-slate-950 border-t border-slate-800/50">
            <div className="container mx-auto px-6">
                <motion.div className="text-center mb-16" {...fadeInUp}>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Historical Timeline</h2>
                    <p className="text-2xl text-amber-500/80 font-serif mb-8">ਇਤਿਹਾਸਕ ਸਮਾਂ-ਰੇਖਾ</p>

                    {/* Filters */}
                    <div className="flex justify-center flex-wrap gap-3">
                        {[
                            { id: 'all', label: 'All Events' },
                            { id: 'guru', label: 'Gurus' },
                            { id: 'battle', label: 'Battles' },
                            { id: 'milestone', label: 'Milestones' }
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as any)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${filter === f.id
                                    ? 'bg-amber-500 text-slate-900 border-amber-500'
                                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Timeline */}
                <div className="overflow-x-auto pb-8 -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
                    <div className="flex gap-6 min-w-max">
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((event, index) => (
                                <TimelineEvent key={event.id} event={event} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6 flex items-center justify-center gap-2">
                    <ChevronLeft size={14} /> Scroll to explore <ChevronRight size={14} />
                </p>
            </div>
        </section>
    );
};

// ============================================
// FOOTER QUOTE
// ============================================
const FooterQuote: React.FC = () => (
    <section className="py-40 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        <motion.div
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
            {...fadeInUp}
        >
            <p className="text-3xl md:text-5xl font-serif text-amber-500/80 italic leading-relaxed mb-8">
                "Recognize the human race as one."
            </p>
            <p className="text-slate-500 uppercase tracking-[0.2em] text-sm">
                — Guru Gobind Singh Ji
            </p>
        </motion.div>
    </section>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export const SikhHistoryPage: React.FC = () => {
    return (
        <Layout>
            <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-amber-500/30 selection:text-white">
                <HeroSection />
                <ValuesSection />
                <GurusSection />
                <TimelineSection />
                <FooterQuote />
            </div>
        </Layout>
    );
};

export default SikhHistoryPage;
