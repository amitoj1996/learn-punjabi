import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Star, MessageCircle, Video, Search, } from 'lucide-react';
import type { Tutor } from '../types';


export const TutorSearch: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');

    useEffect(() => {
        async function fetchTutors() {
            try {
                const response = await fetch('/api/tutors');
                if (!response.ok) {
                    console.warn("API failed, no tutors available");
                    setTutors([]);
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setTutors(data);
                setFilteredTutors(data);
            } catch (err) {
                console.error(err);
                setTutors([]);
            } finally {
                setLoading(false);
            }
        }

        fetchTutors();
    }, []);

    // Filter tutors when search/filter changes
    useEffect(() => {
        let result = tutors;

        // Search by name
        if (searchTerm) {
            result = result.filter(tutor =>
                tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.bio?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by max price
        if (maxPrice !== '') {
            result = result.filter(tutor => tutor.hourlyRate <= maxPrice);
        }

        setFilteredTutors(result);
    }, [searchTerm, maxPrice, tutors]);

    const handleBook = (tutorId: string) => {
        alert(`Booking initiated for Tutor ID: ${tutorId}\n\n(This would open a calendar/payment modal in the full version)`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setMaxPrice('');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-secondary-600">Loading tutors...</span>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">Find Your Perfect Tutor</h1>
                    <p className="text-secondary-600 text-lg">Browse our verified teachers and start your journey today.</p>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                            <Input
                                type="text"
                                placeholder="Search by name or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Max Price Filter */}
                        <div className="w-full md:w-48">
                            <Input
                                type="number"
                                placeholder="Max price/hr"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                                min={0}
                            />
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || maxPrice !== '') && (
                            <Button variant="outline" onClick={clearFilters}>
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-secondary-500 mt-3">
                        Showing {filteredTutors.length} of {tutors.length} tutors
                    </p>
                </div>

                {/* Empty State */}
                {tutors.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                            🎓
                        </div>
                        <h2 className="text-2xl font-bold text-secondary-900 mb-2">No Tutors Yet</h2>
                        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                            We're building our community of Punjabi teachers. Check back soon or apply to become a tutor!
                        </p>
                        <a href="/become-a-teacher">
                            <Button>Become a Tutor</Button>
                        </a>
                    </Card>
                ) : filteredTutors.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                            🔍
                        </div>
                        <h2 className="text-2xl font-bold text-secondary-900 mb-2">No Matches Found</h2>
                        <p className="text-secondary-600 mb-6">
                            Try adjusting your search or filters.
                        </p>
                        <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                    </Card>
                ) : (
                    /* Tutor Grid */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTutors.map((tutor) => (
                            <motion.div
                                key={tutor.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card variant="solid" className="h-full flex flex-col p-6 hover:shadow-xl transition-shadow bg-white rounded-2xl overflow-hidden border border-slate-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-4">
                                            {/* Avatar or Initial */}
                                            {tutor.avatarUrl ? (
                                                <img
                                                    src={tutor.avatarUrl}
                                                    alt={tutor.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                                    {tutor.name?.charAt(0) || 'T'}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-lg text-secondary-900">{tutor.name}</h3>
                                                <p className="text-secondary-500 text-sm">{tutor.role || 'Punjabi Tutor'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg">
                                            <Star size={16} className="text-primary-500 fill-primary-500" />
                                            <span className="font-bold text-primary-900 text-sm">{tutor.rating || 'New'}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex-grow">
                                        <p className="text-secondary-600 text-sm line-clamp-3 leading-relaxed mb-4">{tutor.bio}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(tutor.languages || ['Punjabi']).map((lang) => (
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
                )}
            </div>
        </Layout>
    );
};
