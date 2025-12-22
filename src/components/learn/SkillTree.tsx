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

    // Check if segment between two lessons should be "completed" (both lessons done)
    const isSegmentCompleted = (index: number): boolean => {
        if (index >= lessons.length - 1) return false;
        const current = completedLessons.includes(lessons[index].id);
        const next = completedLessons.includes(lessons[index + 1].id);
        return current && next;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            {/* Responsive grid layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="relative">
                        {/* Connector line to next - spans the gap between cards */}
                        {index < lessons.length - 1 && (
                            <div
                                className={`
                                    hidden md:block absolute top-12 left-full w-6 h-1 rounded-full
                                    transform -translate-y-1/2
                                    ${isSegmentCompleted(index)
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                        : 'bg-secondary-200'
                                    }
                                `}
                            />
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
