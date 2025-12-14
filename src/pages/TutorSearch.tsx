import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Star, MessageCircle, Video } from 'lucide-react';
import type { Tutor } from '../types';


// Mock Data (Fallback)
const MOCK_FALLBACK_DATA: Tutor[] = [
    {
        id: '1',
        name: "Simran Kaur (Mock)",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        hourlyRate: 25,
        rating: 4.9,
        reviewCount: 124,
        languages: ["English", "Punjabi"],
        role: "Professional Teacher",
        bio: "Certified Punjabi teacher with 5+ years of experience. (Data loaded from fallback)",
    }
];

export const TutorSearch: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchTutors() {
            try {
                const response = await fetch('/api/tutors');
                if (!response.ok) {
                    // Fallback to mock data if API fails (e.g. no DB conn)
                    console.warn("API failed, using fallback mock data");
                    setTutors(MOCK_FALLBACK_DATA);
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setTutors(data);
            } catch (err) {
                console.error(err);
                setTutors(MOCK_FALLBACK_DATA);
            } finally {
                setLoading(false);
            }
        }

        fetchTutors();
    }, []);

    const handleBook = (tutorId: string) => {
        alert(`Booking initiated for Tutor ID: ${tutorId}\n\n(This would open a calendar/payment modal in the full version)`);
    };

    if (loading) return <Layout><div className="flex justify-center p-20">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">Find Your Perfect Tutor</h1>
                    <p className="text-secondary-600 text-lg">Browse our verified teachers and start your journey today.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map((tutor) => (
                        <motion.div
                            key={tutor.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card variant="solid" className="h-full flex flex-col p-6 hover:shadow-xl transition-shadow bg-white rounded-3xl overflow-hidden border border-slate-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <img
                                            src={tutor.avatarUrl}
                                            alt={tutor.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg text-secondary-900">{tutor.name}</h3>
                                            <p className="text-secondary-500 text-sm">{tutor.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg">
                                        <Star size={16} className="text-primary-500 fill-primary-500" />
                                        <span className="font-bold text-primary-900 text-sm">{tutor.rating}</span>
                                    </div>
                                </div>

                                <div className="mb-4 flex-grow">
                                    <p className="text-secondary-600 text-sm line-clamp-3 leading-relaxed mb-4">{tutor.bio}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.languages.map((lang) => (
                                            <span key={lang} className="text-xs font-medium bg-secondary-100 text-secondary-600 px-2 py-1 rounded-md">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-secondary-100 flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="text-xl font-bold text-secondary-900">${tutor.hourlyRate}</span>
                                        <span className="text-secondary-500 text-sm">/hr</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="px-3" title="Message">
                                            <MessageCircle size={20} />
                                        </Button>
                                        <Button size="sm" onClick={() => handleBook(tutor.id)} className="flex items-center gap-2">
                                            <Video size={16} />
                                            Book
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};
