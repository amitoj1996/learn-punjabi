import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Layout } from '../components/Layout';
import { gurus, type Guru } from '../data/sikhHistory';
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
                    src="/images/history/khanda.webp"
                    alt="Khanda - Sikh Symbol"
                    className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain drop-shadow-[0_0_60px_rgba(251,191,36,0.5)]"
                    loading="eager"
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
// CORE VALUES - FOUNDATION SECTION (WITH IMAGES)
// ============================================
const ValuesSection: React.FC = () => {
    const pillarsData = [
        {
            name: "Naam Japna",
            gurmukhi: "ਨਾਮ ਜਪਣਾ",
            meaning: "Meditating on God's Name",
            image: "/images/history/foundation/naam_japna.webp",
            color: "from-amber-500 to-orange-600",
            description: "The practice of keeping the Divine in your consciousness at all times. Through meditation, prayer, and recitation of Gurbani, a Sikh remains connected to Waheguru. It is the foundation of spiritual life - remembering the One who created all.",
            practices: ["Daily recitation of Japji Sahib", "Simran (repetition of Waheguru)", "Listening to Kirtan", "Studying Gurbani"]
        },
        {
            name: "Kirat Karni",
            gurmukhi: "ਕਿਰਤ ਕਰਨੀ",
            meaning: "Earning an honest living",
            image: "/images/history/foundation/kirat_karni.webp",
            color: "from-blue-500 to-indigo-600",
            description: "To live by the sweat of one's brow - earning through honest, ethical means without exploitation or fraud. A Sikh does not beg, steal, or take advantage of others. Work is worship, and every occupation is honored when done with integrity.",
            practices: ["Honest labor regardless of profession", "No cheating or exploitation", "Fair treatment of workers", "Giving back through Dasvandh (10%)"]
        },
        {
            name: "Vand Chakna",
            gurmukhi: "ਵੰਡ ਛਕਣਾ",
            meaning: "Sharing with others",
            image: "/images/history/foundation/vand_chakna.webp",
            color: "from-emerald-500 to-teal-600",
            description: "Sharing what you have with those in need - be it food, wealth, time, or skills. The institution of Langar (free community kitchen) is the living embodiment of this principle, where millions are fed daily regardless of background.",
            practices: ["Serving in Langar (community kitchen)", "Dasvandh (donating 10% of income)", "Helping those in need", "Seva (selfless service)"]
        }
    ];

    const fiveKsData = [
        {
            name: "Kesh",
            gurmukhi: "ਕੇਸ",
            meaning: "Uncut Hair",
            image: "/images/history/fiveks/kesh.webp",
            color: "from-purple-500 to-violet-600",
            description: "Keeping hair in its natural, uncut form as God intended. Covered with a turban (Dastar), it represents spirituality, devotion, and acceptance of God's will. It is a crown of sovereignty and self-respect.",
            symbolism: "Spirituality, acceptance of God's will, and identity",
            verse: "ਸਾਬਤ ਸੂਰਤ ਰੱਬ ਦੀ, ਭੰਨੇ ਬੇਈਮਾਨ"
        },
        {
            name: "Kangha",
            gurmukhi: "ਕੰਘਾ",
            meaning: "Wooden Comb",
            image: "/images/history/fiveks/kangha.webp",
            color: "from-amber-500 to-yellow-600",
            description: "A small wooden comb traditionally tucked in the hair. It represents cleanliness, discipline, and order. Just as one combs the hair twice daily, one must also comb the mind - removing tangles of ego and negativity.",
            symbolism: "Cleanliness, discipline, and ordered spiritual life",
            verse: "ਕੰਘਾ ਦੋਨੋਂ ਵਕਤ ਕਰ, ਪਾਗ ਚੁੰਨੇ ਕਰ ਬਾਂਧਈ"
        },
        {
            name: "Kara",
            gurmukhi: "ਕੜਾ",
            meaning: "Steel Bracelet",
            image: "/images/history/fiveks/kara.webp",
            color: "from-slate-400 to-slate-600",
            description: "A simple steel bracelet worn on the wrist. Its circular shape represents the eternal nature of God - no beginning, no end. Steel symbolizes strength. It serves as a constant reminder of one's commitment to righteousness.",
            symbolism: "Eternal bond with God, restraint from wrong actions",
            verse: "ਕੜਾ ਕਰ ਕਾਰਣ ਆਪਣੇ, ਹੱਥ ਕੂ ਬੰਧਾਵੈ"
        },
        {
            name: "Kachera",
            gurmukhi: "ਕਛਹਿਰਾ",
            meaning: "Cotton Undergarment",
            image: "/images/history/fiveks/kachera.webp",
            color: "from-sky-500 to-cyan-600",
            description: "A specially designed cotton undergarment representing modesty, self-control, and moral character. It symbolizes the commitment to marital fidelity and chastity - treating all with respect and dignity.",
            symbolism: "Self-control, modesty, and moral restraint",
            verse: "ਕਛ ਪਹਿਨੀਏ ਧਰਮ ਪੁੱਤ, ਧਰਮ ਪਾਲਨ ਹੇਤ"
        },
        {
            name: "Kirpan",
            gurmukhi: "ਕਿਰਪਾਨ",
            meaning: "Ceremonial Sword",
            image: "/images/history/fiveks/kirpan.webp",
            color: "from-red-500 to-rose-600",
            description: "A sword representing courage, self-defense, and protection of the weak. The word comes from 'Kirpa' (mercy) and 'Aan' (honor). A Sikh is a Sant-Sipahi (Saint-Soldier) - peaceful but ready to defend justice.",
            symbolism: "Courage, honor, and protection of the oppressed",
            verse: "ਕਿਰਪਾਨ ਅਰ ਆਨ ਕੋ ਮੇਲ ਕੇ ਕਿਰਪਾਨ"
        }
    ];

    const [selectedK, setSelectedK] = useState<typeof fiveKsData[0] | null>(null);

    return (
        <section className="py-32 bg-slate-950 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-900/15 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-t from-indigo-900/10 to-transparent rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">The Foundation</h2>
                    <p className="text-2xl md:text-3xl text-amber-500/80 font-serif mb-6">ਸਿੱਖੀ ਦੀ ਨੀਂਹ</p>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Guru Nanak Dev Ji gave humanity three golden principles for living a meaningful life.
                        These form the foundation upon which all Sikh practice is built.
                    </p>
                </motion.div>

                {/* Three Pillars - With Images */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
                    {pillarsData.map((pillar, index) => (
                        <motion.div
                            key={pillar.name}
                            className="relative group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 h-full overflow-hidden">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-20`} />
                                    <img
                                        src={pillar.image}
                                        alt={pillar.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                                </div>

                                <div className="p-8 -mt-12 relative">
                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-white mb-1">{pillar.name}</h3>
                                    <p className="text-amber-400 font-serif text-lg mb-4">{pillar.gurmukhi}</p>

                                    {/* Description */}
                                    <p className="text-slate-300 leading-relaxed mb-6 text-sm">{pillar.description}</p>

                                    {/* Practices */}
                                    <div className="space-y-2">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Daily Practices</p>
                                        {pillar.practices.map((practice, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                {practice}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-4 mb-20">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-500/50" />
                    <div className="w-3 h-3 rotate-45 border-2 border-amber-500/50" />
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-500/50" />
                </div>

                {/* Five Ks Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        The Five Ks
                    </h3>
                    <p className="text-2xl text-amber-500/80 font-serif mb-4">ਪੰਜ ਕਕਾਰ</p>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Bestowed by Guru Gobind Singh Ji upon the Khalsa in 1699, these five articles of faith
                        are worn by every initiated Sikh as a uniform of spiritual commitment and readiness.
                    </p>
                </motion.div>

                {/* Five Ks - Elegant Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
                    {fiveKsData.map((k, index) => (
                        <motion.button
                            key={k.name}
                            className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-500"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedK(k)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${k.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />

                            {/* Image */}
                            <img
                                src={k.image}
                                alt={k.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{k.name}</h4>
                                <p className="text-amber-400/80 font-serif text-sm">{k.gurmukhi}</p>
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={16} className="text-white" />
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Five K Detail Modal */}
                <AnimatePresence>
                    {selectedK && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedK(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header with Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${selectedK.color} opacity-30`} />
                                    <img
                                        src={selectedK.image}
                                        alt={selectedK.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                                    {/* Close button */}
                                    <button
                                        onClick={() => setSelectedK(null)}
                                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>

                                    {/* Title overlay */}
                                    <div className="absolute bottom-6 left-8">
                                        <p className="text-amber-400 font-serif text-2xl mb-1">{selectedK.gurmukhi}</p>
                                        <h2 className="text-4xl font-bold text-white">{selectedK.name}</h2>
                                        <p className="text-slate-400 mt-1">{selectedK.meaning}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <p className="text-slate-300 leading-relaxed mb-6">
                                        {selectedK.description}
                                    </p>

                                    {/* Symbolism */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Symbolism</p>
                                        <p className="text-amber-400">{selectedK.symbolism}</p>
                                    </div>

                                    {/* Related Verse */}
                                    <div className="border-l-2 border-amber-500/50 pl-4">
                                        <p className="text-amber-500/80 font-serif text-lg italic">{selectedK.verse}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Quote */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto italic">
                        "ਰਹਿਤ ਪਿਆਰੀ ਮੁਝ ਕੋ ਸਿੱਖ ਪਿਆਰਾ ਨਾਹਿ"
                    </p>
                    <p className="text-slate-500 mt-2 text-sm">
                        "The discipline is dear to me, not the Sikh without it" — Guru Gobind Singh Ji
                    </p>
                </motion.div>
            </div>
        </section>
    );
};


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
// SRI GURU GRANTH SAHIB JI SECTION
// ============================================
const GuruGranthSahibSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const granthSahibData = {
        compositions: [
            { author: "Guru Nanak Dev Ji", shabads: 974 },
            { author: "Guru Angad Dev Ji", shabads: 62 },
            { author: "Guru Amar Das Ji", shabads: 907 },
            { author: "Guru Ram Das Ji", shabads: 679 },
            { author: "Guru Arjan Dev Ji", shabads: 2218 },
            { author: "Guru Tegh Bahadur Ji", shabads: 116 },
            { author: "Bhagats (Saints)", shabads: 937 }
        ],
        bhagats: [
            "Bhagat Kabir Ji", "Bhagat Ravidas Ji", "Bhagat Namdev Ji",
            "Bhagat Farid Ji", "Bhagat Trilochan Ji", "Bhagat Dhanna Ji",
            "Bhagat Pipa Ji", "Bhagat Sain Ji", "Bhagat Bhikhan Ji",
            "Bhagat Parmanand Ji", "Bhagat Sadhna Ji", "Bhagat Beni Ji",
            "Bhagat Ramanand Ji", "Bhagat Jaidev Ji", "Bhagat Surdas Ji"
        ],
        raags: 31,
        totalShabads: 5894,
        totalPages: 1430,
        languages: ["Punjabi", "Hindi", "Sanskrit", "Persian", "Marathi", "Sindhi"]
    };

    return (
        <section ref={containerRef} className="relative py-32 bg-slate-950 overflow-hidden">
            {/* Animated Background */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-slate-950 to-slate-950" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
            </motion.div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Scroll className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                        Sri Guru Granth Sahib Ji
                    </h2>
                    <p className="text-2xl md:text-3xl text-amber-500 font-serif mb-6">
                        ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ
                    </p>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        The Eternal Living Guru - A unique scripture where the Word itself is revered as the Guru.
                        It contains the divine wisdom of six Gurus and 15 Bhagats (saints) from different religions and castes.
                    </p>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    className="relative max-w-4xl mx-auto mb-20 rounded-3xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                    <img
                        src="/images/history/guru_granth_sahib.webp"
                        alt="Sri Guru Granth Sahib Ji - The Eternal Living Guru"
                        className="w-full h-auto object-cover rounded-3xl shadow-2xl shadow-amber-500/10"
                        loading="lazy"
                        onError={(e) => {
                            // Hide if image not found yet
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center">
                        <p className="text-amber-400 font-serif text-lg italic">
                            "ਸਭ ਸਿਖਨ ਕੋ ਹੁਕਮ ਹੈ ਗੁਰੂ ਮਾਨਿਓ ਗ੍ਰੰਥ"
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            "All Sikhs are commanded to accept the Granth as their Guru"
                        </p>
                    </div>
                </motion.div>
                {/* Key Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {[
                        { number: "1430", label: "Angs (Pages)", icon: "📜" },
                        { number: "5894", label: "Shabads (Hymns)", icon: "🎵" },
                        { number: "31", label: "Raags (Musical Modes)", icon: "🎶" },
                        { number: "36", label: "Contributors", icon: "✍️" }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-amber-500/30 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className="text-4xl mb-2 block">{stat.icon}</span>
                            <p className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">{stat.number}</p>
                            <p className="text-slate-400 text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    {/* About Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-amber-500" />
                            The Living Guru
                        </h3>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                Guru Granth Sahib Ji is not merely a holy book - it is the <span className="text-amber-400 font-semibold">eternal, living Guru</span> of the Sikhs.
                                In 1708, Guru Gobind Singh Ji bestowed Guruship upon the scripture, declaring:
                            </p>
                            <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5 rounded-r-lg italic">
                                "ਸੱਭ ਸਿੱਖਨ ਕੋ ਹੁਕਮ ਹੈ ਗੁਰੂ ਮਾਨਿਓ ਗ੍ਰੰਥ"
                                <br />
                                <span className="text-sm text-slate-400 not-italic">"All Sikhs are commanded to accept the Granth as their Guru"</span>
                            </blockquote>
                            <p>
                                The scripture is treated with the same reverence as a living king. It is ceremonially placed on a throne,
                                fanned with a chaur sahib, and has its own bedroom where it "rests" at night.
                            </p>
                        </div>
                    </motion.div>

                    {/* Compilation History */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Heart className="w-6 h-6 text-amber-500" />
                            Compilation History
                        </h3>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                <span className="text-amber-400 font-semibold">1604 - Adi Granth:</span> Guru Arjan Dev Ji compiled the first version
                                at Ramsar Sarovar, Amritsar. Bhai Gurdas Ji served as the scribe.
                            </p>
                            <p>
                                <span className="text-amber-400 font-semibold">1708 - Final Form:</span> Guru Gobind Singh Ji added the compositions
                                of Guru Tegh Bahadur Ji at Damdama Sahib, completing the scripture.
                            </p>
                            <p>
                                <span className="text-amber-400 font-semibold">Unique Feature:</span> It is written entirely in poetry, organized by
                                31 raags (musical modes), and includes writings from Hindu and Muslim saints -
                                a revolutionary statement of religious unity.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Contributors Section */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                        <Users className="w-6 h-6 text-amber-500" />
                        Divine Contributors
                    </h3>

                    {/* Gurus' Contributions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                        {granthSahibData.compositions.map((item, index) => (
                            <motion.div
                                key={item.author}
                                className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 text-center border border-white/10 hover:border-amber-500/30 transition-all duration-300"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <p className="text-2xl font-bold text-amber-400 mb-1">{item.shabads}</p>
                                <p className="text-xs text-slate-400 leading-tight">{item.author}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bhagats */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h4 className="text-lg font-semibold text-amber-400 mb-4">15 Bhagats (Saints from Different Traditions)</h4>
                        <div className="flex flex-wrap gap-2">
                            {granthSahibData.bhagats.map((bhagat, index) => (
                                <motion.span
                                    key={bhagat}
                                    className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    {bhagat}
                                </motion.span>
                            ))}
                        </div>
                        <p className="text-slate-500 text-sm mt-4">
                            Including saints from Hindu, Muslim, and various caste backgrounds - emphasizing the universal nature of divine truth.
                        </p>
                    </div>
                </motion.div>

                {/* Core Teachings */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Core Teachings</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Ik Onkar",
                                gurmukhi: "ੴ",
                                description: "There is One Universal Creator - the fundamental truth that opens the scripture."
                            },
                            {
                                title: "Equality of All",
                                gurmukhi: "ਮਾਨਸ ਕੀ ਜਾਤ ਸਬੈ ਏਕੈ ਪਹਿਚਾਨਬੋ",
                                description: "Recognize all of humanity as one race - breaking barriers of caste, gender, and religion."
                            },
                            {
                                title: "Nam Simran",
                                gurmukhi: "ਨਾਮ ਸਿਮਰਨ",
                                description: "Meditation on the Divine Name - the path to union with the Creator."
                            }
                        ].map((teaching, index) => (
                            <motion.div
                                key={teaching.title}
                                className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl p-6 border border-amber-500/20 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="text-4xl md:text-5xl text-amber-400 font-serif mb-3">{teaching.gurmukhi}</p>
                                <h4 className="text-xl font-bold text-white mb-2">{teaching.title}</h4>
                                <p className="text-slate-400 text-sm">{teaching.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Closing Quote */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-2xl md:text-3xl text-amber-500/80 font-serif italic max-w-3xl mx-auto">
                        "ਸ਼ਬਦ ਗੁਰੂ ਸੁਰਤਿ ਧੁਨਿ ਚੇਲਾ"
                    </p>
                    <p className="text-slate-400 mt-2">
                        "The Word is the Guru, and the consciousness attuned to it is the disciple"
                    </p>
                    <p className="text-slate-500 text-sm mt-1">— Guru Nanak Dev Ji</p>
                </motion.div>
            </div>
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
                <GuruGranthSahibSection />
                <TimelineSection />
                <FooterQuote />
            </div>
        </Layout>
    );
};

export default SikhHistoryPage;
