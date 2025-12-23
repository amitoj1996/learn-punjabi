import React from 'react';
import { Layout } from '../components/Layout';
import { ImmersiveHero } from '../components/history/ImmersiveHero';
import { ValuesGrid } from '../components/history/ValuesGrid';
import { GuruTheatrics } from '../components/history/GuruTheatrics';
import { ParallaxTimeline } from '../components/history/ParallaxTimeline';

// Main Page Component
export const SikhHistoryPage: React.FC = () => {
    return (
        <Layout>
            <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-amber-500/30">
                {/* 1. The Opening - Cinematic Intro */}
                <ImmersiveHero />

                {/* 2. The Foundation - Core Values (Bento Grid) */}
                <ValuesGrid />

                {/* 3. The Prophets - Sticky Scrolling Narrative */}
                <GuruTheatrics />

                {/* 4. The Eras - Horizontal Timeline Journey */}
                <ParallaxTimeline />

                {/* Footer Quote or Closing */}
                <section className="py-40 text-center bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950 to-slate-950" />
                    <div className="relative z-10 px-6">
                        <h2 className="text-3xl md:text-5xl font-serif text-amber-500/80 italic mb-6">
                            "Recognize the human race as one."
                        </h2>
                        <p className="text-slate-500 uppercase tracking-widest text-sm">
                            — Guru Gobind Singh Ji
                        </p>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default SikhHistoryPage;
