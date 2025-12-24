import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { BookingModal } from '../components/BookingModal';
import {
    Star, MessageCircle, Search, Clock, Users,
    Filter, X, Globe, Sparkles, BookOpen,
    GraduationCap, Heart, Play
} from 'lucide-react';
import type { Tutor } from '../types';

// Specialization label mapping for better display
const SPECIALIZATION_LABELS: Record<string, string> = {
    'conversational': '💬 Conversational',
    'reading': '📖 Reading',
    'writing': '✍️ Writing',
    'gurbani': '🙏 Gurbani',
    'grammar': '📝 Grammar',
    'heritage': '🏠 Heritage Learners',
    'kids': '👶 Kids Lessons',
    'business': '💼 Business',
};

// Age group icons
const AGE_ICONS: Record<string, string> = {
    'kids': '👶',
    'teenagers': '🧒',
    'adults': '👨',
    'seniors': '👴',
};

export const TutorSearch: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredTutor, setHoveredTutor] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTutors() {
            try {
                const response = await fetch('/api/tutors');
                if (!response.ok) {
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

    useEffect(() => {
        let result = tutors;
        if (searchTerm) {
            result = result.filter(tutor =>
                tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.bio?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (maxPrice !== '') {
            result = result.filter(tutor => tutor.hourlyRate <= maxPrice);
        }
        if (selectedSpecialization) {
            result = result.filter(tutor =>
                tutor.specializations?.includes(selectedSpecialization)
            );
        }
        setFilteredTutors(result);
    }, [searchTerm, maxPrice, selectedSpecialization, tutors]);

    const handleBook = (tutor: Tutor) => {
        setSelectedTutor(tutor);
    };

    const handleBookingSuccess = () => {
        setSelectedTutor(null);
        alert('🎉 Booking confirmed! Check your dashboard for details.');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setMaxPrice('');
        setSelectedSpecialization('');
    };

    const hasActiveFilters = searchTerm || maxPrice !== '' || selectedSpecialization;

    // Get unique specializations from all tutors
    const allSpecializations = [...new Set(tutors.flatMap(t => t.specializations || []))];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-primary-50/50 via-white to-white">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                                <Sparkles size={16} className="text-amber-300" />
                                <span>Learn from native Punjabi speakers</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                                Find Your Perfect <span className="text-amber-300">Punjabi Tutor</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 mb-8">
                                Connect with passionate teachers who'll help you master the language,
                                understand the culture, and achieve your learning goals.
                            </p>

                            {/* Search Bar */}
                            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search tutors by name or specialty..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-transparent text-secondary-900 placeholder-secondary-400 focus:outline-none text-lg"
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    className="px-8 rounded-xl"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter size={18} className="mr-2" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="ml-2 w-5 h-5 bg-amber-400 rounded-full text-xs flex items-center justify-center text-primary-900 font-bold">
                                            {[searchTerm, maxPrice !== '' ? 1 : 0, selectedSpecialization].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Filters Dropdown */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white border-b border-secondary-100 shadow-sm"
                        >
                            <div className="container mx-auto px-4 py-6">
                                <div className="flex flex-wrap gap-6 items-end">
                                    {/* Max Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">Max Price/Hour</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary-500">$</span>
                                            <input
                                                type="number"
                                                placeholder="Any"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                                                className="w-24 px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                min={0}
                                            />
                                        </div>
                                    </div>

                                    {/* Specialization */}
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">Specialization</label>
                                        <select
                                            value={selectedSpecialization}
                                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                                            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">All Specializations</option>
                                            {allSpecializations.map(spec => (
                                                <option key={spec} value={spec}>{SPECIALIZATION_LABELS[spec] || spec}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Clear Filters */}
                                    {hasActiveFilters && (
                                        <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                                            <X size={16} />
                                            Clear All
                                        </Button>
                                    )}

                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="ml-auto text-secondary-500 hover:text-secondary-700 text-sm"
                                    >
                                        Close filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Section */}
                <div className="container mx-auto px-4 py-10">
                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-secondary-600">
                                {loading ? 'Loading...' : (
                                    <>
                                        <span className="font-bold text-secondary-900">{filteredTutors.length}</span> tutors available
                                        {hasActiveFilters && (
                                            <span className="text-secondary-400"> (filtered from {tutors.length})</span>
                                        )}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 animate-pulse border border-secondary-100">
                                    <div className="flex gap-4 mb-6">
                                        <div className="w-20 h-20 bg-secondary-200 rounded-2xl"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-secondary-200 rounded w-32 mb-2"></div>
                                            <div className="h-4 bg-secondary-100 rounded w-24"></div>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-secondary-100 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-secondary-100 rounded w-3/4 mb-4"></div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 bg-secondary-100 rounded-full w-20"></div>
                                        <div className="h-6 bg-secondary-100 rounded-full w-16"></div>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-secondary-100">
                                        <div className="h-8 bg-secondary-200 rounded w-16"></div>
                                        <div className="h-10 bg-secondary-200 rounded-xl w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tutors.length === 0 ? (
                        /* Empty State - No Tutors */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 max-w-md mx-auto"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <GraduationCap size={40} className="text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 mb-3">No Tutors Available Yet</h2>
                            <p className="text-secondary-600 mb-8">
                                We're building our community of passionate Punjabi teachers. Check back soon or become our first tutor!
                            </p>
                            <a href="/become-a-teacher">
                                <Button size="lg" className="px-8">
                                    <Heart size={18} className="mr-2" />
                                    Become a Tutor
                                </Button>
                            </a>
                        </motion.div>
                    ) : filteredTutors.length === 0 ? (
                        /* Empty State - No Matches */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 max-w-md mx-auto"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-secondary-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 mb-3">No Matches Found</h2>
                            <p className="text-secondary-600 mb-8">
                                Try adjusting your filters or search terms to find more tutors.
                            </p>
                            <Button variant="outline" onClick={clearFilters} size="lg">
                                <X size={18} className="mr-2" />
                                Clear All Filters
                            </Button>
                        </motion.div>
                    ) : (
                        /* Tutor Cards Grid */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTutors.map((tutor, index) => (
                                <motion.div
                                    key={tutor.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onMouseEnter={() => setHoveredTutor(tutor.id)}
                                    onMouseLeave={() => setHoveredTutor(null)}
                                    className="group"
                                >
                                    <div className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 ${hoveredTutor === tutor.id ? 'border-primary-300 shadow-2xl shadow-primary-100 -translate-y-2' : 'border-secondary-100 shadow-sm hover:shadow-lg'}`}>
                                        {/* Card Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex gap-4">
                                                {/* Avatar */}
                                                <div className="relative">
                                                    {tutor.photoUrl ? (
                                                        <img src={tutor.photoUrl} alt={tutor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
                                                    ) : tutor.avatarUrl ? (
                                                        <img src={tutor.avatarUrl} alt={tutor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                                            {tutor.name?.charAt(0) || 'T'}
                                                        </div>
                                                    )}
                                                    {/* Video badge */}
                                                    {tutor.videoIntro && (
                                                        <button
                                                            onClick={() => window.open(tutor.videoIntro, '_blank')}
                                                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                                                            title="Watch intro video"
                                                        >
                                                            <Play size={14} fill="white" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Name & Meta */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-xl text-secondary-900 mb-1">{tutor.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-secondary-500 mb-2">
                                                        {tutor.timezone && (
                                                            <span className="flex items-center gap-1">
                                                                <Globe size={14} />
                                                                {tutor.timezone.split('/')[1]?.replace('_', ' ') || tutor.timezone}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Rating */}
                                                    <div className="flex items-center gap-1">
                                                        <Star size={16} className="text-amber-400 fill-amber-400" />
                                                        <span className="font-semibold text-secondary-900">{tutor.rating || 'New'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div className="px-6 pb-4">
                                            <p className="text-secondary-600 text-sm line-clamp-2 leading-relaxed">
                                                {tutor.bio || 'Passionate Punjabi teacher ready to help you on your language journey.'}
                                            </p>
                                        </div>

                                        {/* Specializations */}
                                        {tutor.specializations && tutor.specializations.length > 0 && (
                                            <div className="px-6 pb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {tutor.specializations.slice(0, 3).map((spec: string) => (
                                                        <span key={spec} className="text-xs font-medium bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full">
                                                            {SPECIALIZATION_LABELS[spec] || spec}
                                                        </span>
                                                    ))}
                                                    {tutor.specializations.length > 3 && (
                                                        <span className="text-xs text-secondary-400 px-2 py-1.5">
                                                            +{tutor.specializations.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick Info Row */}
                                        <div className="px-6 pb-4">
                                            <div className="flex items-center gap-4 text-sm text-secondary-500">
                                                {tutor.targetAgeGroups && tutor.targetAgeGroups.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Users size={14} />
                                                        {tutor.targetAgeGroups.map(age => AGE_ICONS[age] || '').join(' ')}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    60 min sessions
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 py-4 bg-secondary-50/50 border-t border-secondary-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-secondary-900">${tutor.hourlyRate}</span>
                                                <span className="text-secondary-500 text-sm">/hour</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" className="px-3 text-secondary-600 hover:text-primary-600" title="Message">
                                                    <MessageCircle size={18} />
                                                </Button>
                                                <Button size="sm" onClick={() => handleBook(tutor)} className="px-6 rounded-xl font-semibold">
                                                    <BookOpen size={16} className="mr-2" />
                                                    Book Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Why Choose Section */}
                    {!loading && tutors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-20 text-center"
                        >
                            <h2 className="text-2xl font-bold text-secondary-900 mb-10">Why Learn With Our Tutors?</h2>
                            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                                <div className="p-6">
                                    <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <GraduationCap size={28} className="text-primary-600" />
                                    </div>
                                    <h3 className="font-bold text-secondary-900 mb-2">Verified Teachers</h3>
                                    <p className="text-secondary-600 text-sm">All tutors are vetted for their teaching ability and language proficiency.</p>
                                </div>
                                <div className="p-6">
                                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Globe size={28} className="text-amber-600" />
                                    </div>
                                    <h3 className="font-bold text-secondary-900 mb-2">Flexible Scheduling</h3>
                                    <p className="text-secondary-600 text-sm">Book lessons that fit your timezone and schedule.</p>
                                </div>
                                <div className="p-6">
                                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Heart size={28} className="text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-secondary-900 mb-2">Cultural Connection</h3>
                                    <p className="text-secondary-600 text-sm">Learn language through culture, history, and real conversations.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {selectedTutor && (
                <BookingModal
                    tutor={selectedTutor}
                    onClose={() => setSelectedTutor(null)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </Layout>
    );
};
