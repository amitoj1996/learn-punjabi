import React from 'react';
import { motion } from 'framer-motion';
import { gurus, type Guru } from '../../data/sikhHistory';
import { Eye, BookOpen, User } from 'lucide-react';

const GuruCard: React.FC<{ guru: Guru; index: number }> = ({ guru, index }) => {


    // When this card is in view, we want to trigger global state or just let the sticky container handle it.
    // For simplicity in this "Apple-style" flow, we'll make each Guru a full-screen-ish section.

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center py-20 gap-10 md:gap-20 sticky top-0 bg-slate-950 border-t border-slate-900/50">
            {/* Visual Side (Left/Top) */}
            <motion.div
                className="w-full md:w-1/2 flex items-center justify-center relative p-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="relative aspect-[3/4] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-amber-900/20 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                    <img
                        src={guru.image}
                        alt={guru.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                        <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">Guru {index + 1}</span>
                    </div>
                </div>
            </motion.div>

            {/* Narrative Side (Right/Bottom) */}
            <motion.div
                className="w-full md:w-1/2 px-6 md:pr-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">{guru.name}</h2>
                <div className="flex items-center gap-4 text-amber-500/80 font-serif text-xl mb-8">
                    <span>{guru.years}</span>
                    <span className="w-16 h-[1px] bg-amber-500/50" />
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <User size={16} /> The Prophet
                        </h3>
                        <p className="text-xl text-slate-300 leading-relaxed font-light">
                            {guru.contribution}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                            <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                                <BookOpen size={16} /> Key Teachings
                            </h4>
                            <ul className="space-y-2">
                                {guru.teachings.slice(0, 2).map((t, i) => (
                                    <li key={i} className="text-sm text-slate-400 leading-relaxed">• {t}</li>
                                ))}
                            </ul>
                        </div>

                        {guru.baani && (
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                                    <Eye size={16} /> Legacy
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {guru.legacy}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const GuruTheatrics: React.FC = () => {
    return (
        <section className="bg-slate-950 relative z-10">
            {gurus.map((guru, index) => (
                <GuruCard key={guru.id} guru={guru} index={index} />
            ))}
        </section>
    );
};
