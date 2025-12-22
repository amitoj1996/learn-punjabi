import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star } from 'lucide-react';
import type { Lesson } from '../../data/lessons';

interface LessonCardProps {
    lesson: Lesson;
    status: 'locked' | 'available' | 'completed';
    onClick: () => void;
    index: number;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, status, onClick, index }) => {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';

    return (
        <motion.button
            onClick={isLocked ? undefined : onClick}
            disabled={isLocked}
            className={`
                relative group flex flex-col items-center w-full max-w-[140px]
                ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={!isLocked ? { y: -4 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
        >
            {/* Main circle */}
            <motion.div
                className={`
                    relative w-24 h-24 rounded-full flex items-center justify-center text-4xl
                    border-4 transition-all duration-300
                    ${isCompleted
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-300 shadow-lg shadow-emerald-200/50'
                        : isLocked
                            ? 'bg-secondary-100 border-secondary-200'
                            : 'bg-gradient-to-br from-primary-400 to-primary-600 border-primary-300 shadow-lg shadow-primary-200/50'
                    }
                    ${!isLocked && 'group-hover:shadow-xl group-hover:scale-105'}
                `}
            >
                {isLocked ? (
                    <Lock className="w-10 h-10 text-secondary-400" />
                ) : isCompleted ? (
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-md" />
                ) : (
                    <span className="drop-shadow-md">{lesson.icon}</span>
                )}

                {/* Star badge for completed */}
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-md"
                    >
                        <Star className="w-4 h-4 text-white fill-white" />
                    </motion.div>
                )}
            </motion.div>

            {/* Label & XP */}
            <div className="mt-3 text-center">
                <p className={`
                    text-sm font-semibold leading-tight mb-1
                    ${isLocked ? 'text-secondary-400' : 'text-secondary-800'}
                `}>
                    {lesson.title}
                </p>
                <div className="flex items-center justify-center gap-1">
                    <span className={`
                        text-xs font-bold px-2 py-0.5 rounded-full
                        ${isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : isLocked
                                ? 'bg-secondary-100 text-secondary-400'
                                : 'bg-primary-100 text-primary-700'
                        }
                    `}>
                        {isCompleted ? '✓' : '⚡'} {lesson.xpReward} XP
                    </span>
                </div>
            </div>

            {/* Hover glow effect */}
            {!isLocked && (
                <div className={`
                    absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10
                    ${isCompleted
                        ? 'bg-gradient-to-br from-emerald-200/30 to-green-200/30 blur-xl'
                        : 'bg-gradient-to-br from-primary-200/30 to-orange-200/30 blur-xl'
                    }
                `} />
            )}
        </motion.button>
    );
};
