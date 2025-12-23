import React from 'react';
import { motion } from 'framer-motion';
import { sikhValues, fiveKs } from '../../data/sikhHistory';

export const ValuesGrid: React.FC = () => {
    return (
        <section className="py-32 bg-slate-950 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Foundation</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        The spiritual and physical pillars that define the Sikh way of life.
                    </p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">

                    {/* Core Values - Spanning columns */}
                    {sikhValues.map((val, i) => (
                        <motion.div
                            key={val.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm flex flex-col justify-between group overflow-hidden relative ${i === 0 ? 'md:col-span-2 bg-gradient-to-br from-indigo-950/50 to-slate-900/50' : ''
                                }`}
                        >
                            <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors" />

                            <div>
                                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300 origin-left">{val.icon}</span>
                                <h3 className="text-2xl font-bold text-white mb-1">{val.name}</h3>
                                <p className="text-amber-500 font-serif text-lg">{val.gurmukhi}</p>
                            </div>

                            <p className="text-slate-400 mt-4 leading-relaxed max-w-sm">
                                {val.meaning}
                            </p>
                        </motion.div>
                    ))}

                    {/* 5Ks - Compact Cards */}
                    {fiveKs.map((k, i) => (
                        <motion.div
                            key={k.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + (i * 0.05) }}
                            whileHover={{ y: -5 }}
                            className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center text-center justify-center hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="text-3xl mb-3">{k.icon}</div>
                            <h4 className="text-white font-bold text-lg">{k.name}</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{k.gurmukhi}</p>
                            <p className="text-slate-400 text-sm mt-3">{k.meaning}</p>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
};
