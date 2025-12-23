import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { historicalEvents } from '../../data/sikhHistory';
import { ChevronRight } from 'lucide-react';

export const ParallaxTimeline: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // We can map scroll to horizontal movement. 
    // We assume the horizontal content is wider than the viewport.
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-slate-950">
            {/* Sticky Container */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Background Decor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

                <h2 className="absolute top-20 left-20 text-9xl font-bold text-white/5 opacity-20 pointer-events-none whitespace-nowrap">
                    The Timeline
                </h2>

                {/* Horizontal Moving Content */}
                <motion.div style={{ x }} className="flex gap-20 pl-20 pr-40">

                    {/* Intro Card */}
                    <div className="w-[500px] flex-shrink-0 flex flex-col justify-center">
                        <h2 className="text-6xl font-bold text-white mb-6">The Journey</h2>
                        <p className="text-xl text-slate-400">
                            Scroll down to travel through time. <br />
                            From 1469 to the modern era.
                        </p>
                    </div>

                    {/* Timeline Events */}
                    {historicalEvents.map((event) => (
                        <div
                            key={event.id}
                            className="relative w-[400px] h-[500px] flex-shrink-0 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur flex flex-col justify-between group hover:border-amber-500/50 transition-colors duration-500"
                        >
                            {/* Year - Huge Background */}
                            <span className="absolute -top-10 -right-4 text-[12rem] font-bold text-white/5 pointer-events-none group-hover:text-amber-500/5 transition-colors">
                                {event.year}
                            </span>

                            <div className="relative z-10">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4
                                    ${event.category === 'battle' ? 'bg-red-500/20 text-red-400' :
                                        event.category === 'guru' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {event.category}
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-4">{event.title}</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            <div className="relative z-10 pt-8 border-t border-white/5 flex items-center text-amber-500 text-sm font-bold uppercase tracking-widest cursor-pointer hover:underline">
                                Read Story <ChevronRight className="ml-2 w-4 h-4" />
                            </div>
                        </div>
                    ))}

                    {/* End Card */}
                    <div className="w-[400px] flex-shrink-0 flex flex-col justify-center items-center text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">And the story continues...</h2>
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white">
                            <ChevronRight />
                        </div>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    className="absolute bottom-10 left-0 h-1 bg-amber-500"
                    style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                />
            </div>
        </section>
    );
};
