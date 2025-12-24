import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
    X, Star, Globe, Clock, Users, BookOpen,
    MessageCircle, Play, GraduationCap, Languages,
    Calendar, Award
} from 'lucide-react';
import type { Tutor } from '../types';

interface TutorProfileModalProps {
    tutor: Tutor;
    onClose: () => void;
    onBook: () => void;
}

// Specialization labels for display
const SPECIALIZATION_LABELS: Record<string, string> = {
    'conversational': '💬 Conversational Punjabi',
    'reading': '📖 Reading Gurmukhi',
    'writing': '✍️ Writing Gurmukhi',
    'gurbani': '🙏 Gurbani & Religious Texts',
    'grammar': '📝 Grammar & Structure',
    'heritage': '🏠 Heritage Learners',
    'kids': '👶 Kids Lessons (Songs, Games)',
    'business': '💼 Business Punjabi',
};

// Age group labels
const AGE_GROUP_LABELS: Record<string, string> = {
    'kids': 'Kids (5-12)',
    'teens': 'Teens (13-17)',
    'adults': 'Adults (18+)',
    'seniors': 'Seniors (60+)',
};

export const TutorProfileModal: React.FC<TutorProfileModalProps> = ({ tutor, onClose, onBook }) => {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <Card className="bg-white rounded-3xl overflow-hidden">
                        {/* Header with photo */}
                        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 pb-24">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="text-white/80 text-sm font-medium">Tutor Profile</div>
                        </div>

                        {/* Profile content */}
                        <div className="px-6 pb-6">
                            {/* Avatar - overlapping header */}
                            <div className="flex items-end gap-4 -mt-16 mb-4">
                                {tutor.photoUrl ? (
                                    <img
                                        src={tutor.photoUrl}
                                        alt={tutor.name}
                                        className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                                    />
                                ) : tutor.avatarUrl ? (
                                    <img
                                        src={tutor.avatarUrl}
                                        alt={tutor.name}
                                        className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg">
                                        {tutor.name?.charAt(0) || 'T'}
                                    </div>
                                )}
                                <div className="pb-2">
                                    <h2 className="text-2xl font-bold text-secondary-900">{tutor.name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Star size={16} className="text-amber-400 fill-amber-400" />
                                            <span className="font-semibold text-secondary-700">{tutor.rating || 'New'}</span>
                                        </div>
                                        {tutor.timezone && (
                                            <span className="flex items-center gap-1 text-secondary-500 text-sm">
                                                <Globe size={14} />
                                                {tutor.timezone.split('/')[1]?.replace('_', ' ') || tutor.timezone}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Video intro button */}
                            {tutor.videoIntro && (
                                <button
                                    onClick={() => window.open(tutor.videoIntro, '_blank')}
                                    className="w-full mb-6 py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center gap-2 text-red-600 font-medium transition-colors"
                                >
                                    <Play size={18} fill="currentColor" />
                                    Watch Introduction Video
                                </button>
                            )}

                            {/* Price & Book */}
                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl mb-6">
                                <div>
                                    <span className="text-3xl font-bold text-primary-900">${tutor.hourlyRate}</span>
                                    <span className="text-primary-600 ml-1">/hour</span>
                                    <p className="text-sm text-primary-600 mt-1 flex items-center gap-1">
                                        <Clock size={14} />
                                        60 minute sessions
                                    </p>
                                </div>
                                <Button onClick={onBook} className="px-8 py-3 rounded-xl font-semibold text-lg">
                                    <BookOpen size={20} className="mr-2" />
                                    Book Lesson
                                </Button>
                            </div>

                            {/* About */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                                    <GraduationCap size={20} className="text-primary-600" />
                                    About Me
                                </h3>
                                <p className="text-secondary-600 leading-relaxed">
                                    {tutor.bio || 'Passionate Punjabi teacher ready to help you on your language journey.'}
                                </p>
                            </div>

                            {/* Teaching Philosophy */}
                            {tutor.teachingPhilosophy && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                                        <Award size={20} className="text-amber-500" />
                                        Teaching Philosophy
                                    </h3>
                                    <p className="text-secondary-600 leading-relaxed">
                                        {tutor.teachingPhilosophy}
                                    </p>
                                </div>
                            )}

                            {/* Specializations */}
                            {tutor.specializations && tutor.specializations.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                                        <BookOpen size={20} className="text-green-600" />
                                        I Can Teach
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.specializations.map((spec: string) => (
                                            <span
                                                key={spec}
                                                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                                            >
                                                {SPECIALIZATION_LABELS[spec] || spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Target Age Groups */}
                            {tutor.targetAgeGroups && tutor.targetAgeGroups.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                                        <Users size={20} className="text-blue-600" />
                                        I Teach
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.targetAgeGroups.map((age: string) => (
                                            <span
                                                key={age}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                            >
                                                {AGE_GROUP_LABELS[age] || age}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {tutor.languagesSpoken && tutor.languagesSpoken.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                                        <Languages size={20} className="text-purple-600" />
                                        Languages I Speak
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.languagesSpoken.map((lang: string) => (
                                            <span
                                                key={lang}
                                                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {tutor.yearsExperience && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                                        <Calendar size={20} className="text-orange-600" />
                                        Experience
                                    </h3>
                                    <p className="text-secondary-600">{tutor.yearsExperience} of teaching experience</p>
                                </div>
                            )}

                            {/* Bottom actions */}
                            <div className="flex gap-3 pt-4 border-t border-secondary-100">
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    Close
                                </Button>
                                <Button onClick={onBook} className="flex-1 bg-primary-600 hover:bg-primary-700">
                                    <MessageCircle size={18} className="mr-2" />
                                    Book a Lesson
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
