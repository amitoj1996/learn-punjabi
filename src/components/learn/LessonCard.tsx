import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Crown } from 'lucide-react';
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
                relative group flex flex-col items-center
                ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!isLocked ? { scale: 1.08 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
        >
            {/* Connector line to previous node */}
            {index > 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-secondary-200 to-secondary-300 rounded-full" />
            )}

            {/* Main circle */}
            <motion.div
                className={`
                    relative w-20 h-20 rounded-full flex items-center justify-center text-3xl
                    shadow-lg transition-shadow duration-300
                    ${isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-200'
                        : isLocked
                            ? 'bg-gradient-to-br from-gray-200 to-gray-300 shadow-gray-100'
                            : 'bg-gradient-to-br from-primary-400 via-purple-500 to-indigo-500 shadow-purple-200'
                    }
                    ${!isLocked && 'group-hover:shadow-xl'}
                `}
            >
                {isLocked ? (
                    <Lock className="w-8 h-8 text-gray-500" />
                ) : isCompleted ? (
                    <CheckCircle className="w-10 h-10 text-white" />
                ) : (
                    <span className="drop-shadow-md">{lesson.icon}</span>
                )}

                {/* Crown for mastered lessons */}
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                    >
                        <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    </motion.div>
                )}

                {/* XP Badge */}
                {!isLocked && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className={`
                            px-2 py-0.5 rounded-full text-xs font-bold
                            ${isCompleted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }
                        `}>
                            +{lesson.xpReward} XP
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Label */}
            <div className="mt-4 text-center max-w-[120px]">
                <p className={`
                    text-sm font-semibold leading-tight
                    ${isLocked ? 'text-gray-400' : 'text-secondary-800'}
                `}>
                    {lesson.title}
                </p>
                <p className="text-xs text-secondary-400 mt-0.5">{lesson.duration}</p>
            </div>

            {/* Hover tooltip */}
            {!isLocked && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                               bg-secondary-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg
                               whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    {lesson.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                    w-2 h-2 bg-secondary-800 rotate-45" />
                </motion.div>
            )}
        </motion.button>
    );
};
