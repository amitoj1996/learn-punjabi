import React from 'react';
import { motion } from 'framer-motion';
import { LessonCard } from './LessonCard';
import type { Lesson } from '../../data/lessons';

interface SkillTreeProps {
    lessons: Lesson[];
    completedLessons: string[];
    onLessonSelect: (lesson: Lesson) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
    lessons,
    completedLessons,
    onLessonSelect
}) => {
    const getLessonStatus = (lesson: Lesson): 'locked' | 'available' | 'completed' => {
        if (completedLessons.includes(lesson.id)) return 'completed';

        // Check if all required lessons are completed
        if (lesson.unlockRequirements.length === 0) return 'available';
        const allRequirementsMet = lesson.unlockRequirements.every(
            req => completedLessons.includes(req)
        );
        return allRequirementsMet ? 'available' : 'locked';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            {/* Responsive grid layout - wraps on mobile, spreads on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="relative">
                        {/* Connector arrow to next (only show on larger screens) */}
                        {index < lessons.length - 1 && (
                            <div className="hidden md:block absolute top-12 -right-4 transform -translate-y-1/2">
                                <svg width="16" height="16" viewBox="0 0 16 16" className="text-secondary-300">
                                    <path d="M4 8H12M12 8L8 4M12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            </div>
                        )}
                        <LessonCard
                            lesson={lesson}
                            status={getLessonStatus(lesson)}
                            onClick={() => onLessonSelect(lesson)}
                            index={index}
                        />
                    </div>
                ))}
            </div>

            {/* "More coming soon" indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-10"
            >
                <div className="px-6 py-3 bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200 rounded-full">
                    <span className="text-sm font-medium text-secondary-600">
                        🚀 Module 2 coming soon!
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};
