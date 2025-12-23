import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Layout } from '../components/Layout';
import { gurus, sikhValues, fiveKs, type Guru } from '../data/sikhHistory';
import { ChevronRight, BookOpen, X, Users, Scroll, Heart, ArrowDown, ChevronDown } from 'lucide-react';

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
                                {/* Dates */}
                                {(guru.birthDate || guru.jotiJotDate) && (
                                    <div className="flex flex-wrap gap-4">
                                        {guru.birthDate && (
                                            <div className="bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-500/30">
                                                <span className="text-amber-400 text-xs uppercase tracking-wider">Birth</span>
                                                <p className="text-white font-medium">{guru.birthDate}</p>
                                            </div>
                                        )}
                                        {guru.jotiJotDate && (
                                            <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                                                <span className="text-slate-400 text-xs uppercase tracking-wider">Joti Jot</span>
                                                <p className="text-white font-medium">{guru.jotiJotDate}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Full Biography */}
                                {guru.biography ? (
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                                            <BookOpen size={18} /> Life Story
                                        </h3>
                                        <div className="text-slate-300 leading-relaxed space-y-4">
                                            {guru.biography.split('\n\n').map((para, i) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                            <Heart size={18} /> Contribution
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">{guru.contribution}</p>
                                    </div>
                                )}

                                {/* Notable Sakhis/Stories */}
                                {guru.notableStories && guru.notableStories.length > 0 && (
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-amber-400 font-bold mb-4">Notable Sakhis (Stories)</h3>
                                        <div className="space-y-4">
                                            {guru.notableStories.map((story, i) => (
                                                <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl">
                                                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-slate-300">{story}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Miracles */}
                                {guru.miracles && guru.miracles.length > 0 && (
                                    <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30">
                                        <h3 className="text-indigo-400 font-bold mb-4">Divine Manifestations</h3>
                                        <ul className="space-y-2">
                                            {guru.miracles.map((miracle, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                                    <span className="text-indigo-400">✦</span>
                                                    {miracle}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Historical Context */}
                                {guru.historicalContext && (
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-amber-400 font-bold mb-3">Historical Context</h3>
                                        <p className="text-slate-300 leading-relaxed">{guru.historicalContext}</p>
                                    </div>
                                )}

                                {/* Key Events fallback */}
                                {!guru.biography && (
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
                                )}
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
// APPLE-STYLE TIMELINE DATA
// ============================================
const timelineData = [
    {
        id: 1,
        year: 1469,
        title: "Birth of Guru Nanak Dev Ji",
        subtitle: "ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ ਦਾ ਜਨਮ",
        description: "In the village of Talwandi (now Nankana Sahib, Pakistan), a child was born who would change the spiritual landscape of South Asia forever. Guru Nanak Dev Ji, the founder of Sikhism, brought a message of equality, devotion to one God, and honest living.",
        image: "/images/history/timeline/event_1.webp",
        category: "birth"
    },
    {
        id: 2,
        year: 1521,
        title: "Kartarpur Established",
        subtitle: "ਕਰਤਾਰਪੁਰ ਦੀ ਸਥਾਪਨਾ",
        description: "After decades of traveling across India, Tibet, Arabia, and beyond, Guru Nanak Dev Ji settled on the banks of the Ravi River. Here, he established Kartarpur - the first Sikh community - where people lived together as equals, working the land and sharing meals regardless of caste.",
        image: "/images/history/timeline/event_2.webp",
        category: "milestone"
    },
    {
        id: 3,
        year: 1541,
        title: "Gurmukhi Script Standardized",
        subtitle: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
        description: "Guru Angad Dev Ji refined and standardized the Gurmukhi script, creating a writing system that would preserve Gurbani for eternity. This democratized spiritual knowledge - no longer was it locked in Sanskrit known only to Brahmins.",
        image: "/images/history/timeline/event_3.webp",
        category: "milestone"
    },
    {
        id: 4,
        year: 1552,
        title: "Langar Institution Formalized",
        subtitle: "ਲੰਗਰ ਦੀ ਸੰਸਥਾ",
        description: "\"Pehle Pangat, Phir Sangat\" - First eat together, then worship together. Guru Amar Das Ji made the community kitchen mandatory for all visitors, including Emperor Akbar. Kings and beggars sat as equals, destroying centuries of caste discrimination.",
        image: "/images/history/timeline/event_4.webp",
        category: "milestone"
    },
    {
        id: 5,
        year: 1577,
        title: "Amritsar Founded",
        subtitle: "ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਸਥਾਪਨਾ",
        description: "Guru Ram Das Ji began excavating the sacred pool that would become the heart of Sikhism. He invited artisans from 52 trades to settle there, creating both a spiritual center and a thriving commercial hub - the city of Ramdaspur, now known as Amritsar.",
        image: "/images/history/timeline/event_5.webp",
        category: "milestone"
    },
    {
        id: 6,
        year: 1604,
        title: "Adi Granth Compiled",
        subtitle: "ਆਦਿ ਗ੍ਰੰਥ ਦਾ ਸੰਕਲਨ",
        description: "Guru Arjan Dev Ji compiled the sacred scriptures of the Sikhs, including writings from Hindu and Muslim saints alongside the Gurus - revolutionary for its time. Bhai Gurdas served as scribe, and the Adi Granth was installed in the newly completed Harmandir Sahib.",
        image: "/images/history/timeline/event_6.webp",
        category: "milestone"
    },
    {
        id: 7,
        year: 1606,
        title: "First Sikh Martyrdom",
        subtitle: "ਪਹਿਲੀ ਸ਼ਹੀਦੀ",
        description: "Guru Arjan Dev Ji became the first Sikh martyr, tortured for five days by Mughal Emperor Jahangir. Made to sit on a burning hot plate with hot sand poured on him, he remained in divine peace, reciting \"Tera Bhana Meetha Laage\" - Sweet is Your Will, O Lord.",
        image: "/images/history/timeline/event_7.webp",
        category: "martyrdom"
    },
    {
        id: 8,
        year: 1609,
        title: "Akal Takht Established",
        subtitle: "ਅਕਾਲ ਤਖ਼ਤ ਦੀ ਸਥਾਪਨਾ",
        description: "Guru Hargobind Sahib Ji, just 11 years old, donned two swords representing Miri (temporal power) and Piri (spiritual power). He built the Akal Takht - Throne of the Timeless One - transforming Sikhs into Saint-Soldiers prepared to defend the oppressed.",
        image: "/images/history/timeline/event_8.webp",
        category: "milestone"
    },
    {
        id: 9,
        year: 1675,
        title: "Hind di Chadar",
        subtitle: "ਹਿੰਦ ਦੀ ਚਾਦਰ",
        description: "When Kashmiri Pandits begged for protection from forced conversion, Guru Tegh Bahadur Ji offered his own head. \"Protect them by converting me first,\" he told Aurangzeb. Martyred at Chandni Chowk, Delhi, he became the Shield of India - a leader of one faith dying for another.",
        image: "/images/history/timeline/event_9.webp",
        category: "martyrdom"
    },
    {
        id: 10,
        year: 1699,
        title: "Birth of the Khalsa",
        subtitle: "ਖ਼ਾਲਸਾ ਪੰਥ ਦੀ ਸਾਜਨਾ",
        description: "On Vaisakhi, before thousands, Guru Gobind Singh Ji asked for heads. Five brave men stepped forward from five different castes - becoming the Panj Pyare. The Khalsa was born: a brotherhood of equals, bound by the Five Ks, ready to fight tyranny anywhere.",
        image: "/images/history/timeline/event_10.webp",
        category: "milestone"
    },
    {
        id: 11,
        year: 1704,
        title: "Battle of Chamkaur",
        subtitle: "ਚਮਕੌਰ ਦੀ ਜੰਗ",
        description: "Forty Sikhs against ten thousand. In a small mud fortress, Guru Gobind Singh Ji's elder sons - Sahibzada Ajit Singh and Jujhar Singh - fought to their last breath. This legendary last stand exemplifies courage against impossible odds.",
        image: "/images/history/timeline/event_11.webp",
        category: "battle"
    },
    {
        id: 12,
        year: 1704,
        title: "Martyrdom of the Sahibzade",
        subtitle: "ਛੋਟੇ ਸਾਹਿਬਜ਼ਾਦਿਆਂ ਦੀ ਸ਼ਹੀਦੀ",
        description: "At Sirhind, the youngest sons of Guru Gobind Singh Ji - Sahibzada Zorawar Singh (9) and Fateh Singh (6) - refused to convert to Islam. They were bricked alive inside a wall. Their grandmother Mata Gujri Ji died upon hearing the news.",
        image: "/images/history/timeline/event_12.webp",
        category: "martyrdom"
    },
    {
        id: 13,
        year: 1708,
        title: "Guru Granth Sahib Eternal",
        subtitle: "ਸ਼ਬਦ ਗੁਰੂ",
        description: "At Nanded, Guru Gobind Singh Ji bowed before the Guru Granth Sahib, declaring: \"All Sikhs are commanded to accept the Granth as their Guru.\" The line of human Gurus ended. The eternal Word became the everlasting guide.",
        image: "/images/history/timeline/event_13.webp",
        category: "milestone"
    },
    {
        id: 14,
        year: 1799,
        title: "Rise of the Sikh Empire",
        subtitle: "ਸਿੱਖ ਰਾਜ",
        description: "Maharaja Ranjit Singh unified the Sikh confederacies and established the powerful Sikh Empire. From the Khyber Pass to the Himalayas, the Khalsa Raj brought peace, religious tolerance, and prosperity to Punjab for half a century.",
        image: "/images/history/timeline/event_14.webp",
        category: "milestone"
    }
];

// ============================================
// PARALLAX TIMELINE EVENT (Apple-style)
// ============================================
const AppleTimelineEvent: React.FC<{
    event: typeof timelineData[0];
    index: number;
    isReversed: boolean;
}> = ({ event, index, isReversed }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);

    const getCategoryColor = () => {
        switch (event.category) {
            case 'birth': return 'from-amber-500/30 to-amber-900/50';
            case 'martyrdom': return 'from-red-500/30 to-red-900/50';
            case 'battle': return 'from-orange-500/30 to-orange-900/50';
            case 'milestone': return 'from-blue-500/30 to-blue-900/50';
            case 'remembrance': return 'from-slate-500/30 to-slate-900/50';
            case 'celebration': return 'from-emerald-500/30 to-emerald-900/50';
            default: return 'from-indigo-500/30 to-indigo-900/50';
        }
    };

    return (
        <motion.div
            ref={containerRef}
            className="relative min-h-screen flex items-center py-20"
            style={{ opacity }}
        >
            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: imageY, scale }}
            >
                <div className={`absolute inset-0 bg-gradient-to-b ${getCategoryColor()} z-10`} />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
                <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to gradient if image not found
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </motion.div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-20">
                <div className={`flex flex-col ${isReversed ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} max-w-3xl ${isReversed ? 'md:ml-auto' : ''}`}>

                    {/* Year - Large Display */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-8xl md:text-[12rem] font-bold text-white/10 leading-none block">
                            {event.year}
                        </span>
                    </motion.div>

                    {/* Subtitle in Gurmukhi */}
                    <motion.p
                        className="text-amber-400 font-serif text-xl md:text-2xl mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {event.subtitle}
                    </motion.p>

                    {/* Title */}
                    <motion.h3
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {event.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                        className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {event.description}
                    </motion.p>

                    {/* Event Number Indicator */}
                    <motion.div
                        className="mt-8 flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="w-12 h-1 bg-amber-500/50 rounded-full" />
                        <span className="text-slate-500 text-sm font-medium">
                            {String(index + 1).padStart(2, '0')} / {String(timelineData.length).padStart(2, '0')}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator (only on first event) */}
            {index === 0 && (
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <span className="text-slate-500 text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

// ============================================
// APPLE-STYLE TIMELINE SECTION
// ============================================
const TimelineSection: React.FC = () => {
    return (
        <section className="bg-slate-950 border-t border-slate-800/50">
            {/* Section Header */}
            <div className="py-32 text-center">
                <motion.div {...fadeInUp}>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                        Through the Ages
                    </h2>
                    <p className="text-2xl md:text-3xl text-amber-500/80 font-serif mb-6">
                        ਇਤਿਹਾਸਕ ਸਫ਼ਰ
                    </p>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto px-6">
                        550 years of faith, sacrifice, and unwavering devotion to truth.
                        Scroll to journey through the defining moments of Sikh history.
                    </p>
                </motion.div>
            </div>

            {/* Timeline Events */}
            {timelineData.map((event, index) => (
                <AppleTimelineEvent
                    key={event.id}
                    event={event}
                    index={index}
                    isReversed={index % 2 === 1}
                />
            ))}

            {/* Closing Statement */}
            <motion.div
                className="py-32 text-center px-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
                    The journey continues. Every Sikh carries this legacy forward,
                    living the values of <span className="text-amber-400">equality</span>,
                    <span className="text-amber-400"> service</span>, and
                    <span className="text-amber-400"> devotion</span> in the modern world.
                </p>
            </motion.div>
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
