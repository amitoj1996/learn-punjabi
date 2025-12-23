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

        if (lesson.unlockRequirements.length === 0) return 'available';
        const allRequirementsMet = lesson.unlockRequirements.every(
            req => completedLessons.includes(req)
        );
        return allRequirementsMet ? 'available' : 'locked';
    };

    // Calculate how many lessons are completed for the progress line
    const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
    // Progress goes from first circle center to last circle center
    // When all lessons done, show 100% (capped)
    const progressPercent = lessons.length > 1
        ? Math.min((completedCount / lessons.length) * 100, 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            {/* Continuous connecting line - runs behind all circles */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 mx-auto" style={{ width: 'calc(100% - 120px)', marginLeft: '60px' }}>
                {/* Background line (gray) */}
                <div className="absolute inset-0 bg-secondary-200 rounded-full" />
                {/* Progress line (green) - grows based on completion */}
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Lesson cards in grid */}
            <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
                {lessons.map((lesson, index) => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        status={getLessonStatus(lesson)}
                        onClick={() => onLessonSelect(lesson)}
                        index={index}
                    />
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
                        🚀 More modules coming soon!
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};
