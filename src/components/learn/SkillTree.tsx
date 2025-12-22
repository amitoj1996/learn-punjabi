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
            className="relative py-8"
        >
            {/* Background path decoration */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-primary-100 via-purple-100 to-indigo-100 rounded-full transform -translate-x-1/2 -z-10" />

            {/* Lesson nodes */}
            <div className="flex flex-col items-center gap-12">
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
                className="flex flex-col items-center mt-12"
            >
                <div className="w-1 h-8 bg-gradient-to-b from-secondary-200 to-transparent rounded-full" />
                <div className="mt-4 px-6 py-3 bg-secondary-100 rounded-full">
                    <span className="text-sm font-medium text-secondary-500">
                        🚀 More lessons coming soon!
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};
