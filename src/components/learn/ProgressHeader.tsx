import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Target } from 'lucide-react';

interface ProgressHeaderProps {
    streak: number;
    totalXP: number;
    dailyXP: number;
    dailyGoal: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    streak,
    totalXP,
    dailyXP,
    dailyGoal,
}) => {
    const progress = Math.min((dailyXP / dailyGoal) * 100, 100);
    const isGoalMet = dailyXP >= dailyGoal;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-purple-100/50 p-4 mb-8 border border-white/50"
        >
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Streak */}
                <motion.div
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                >
                    <motion.div
                        animate={streak > 0 ? {
                            scale: [1, 1.2, 1],
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Flame
                            className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`}
                        />
                    </motion.div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{streak}</div>
                        <div className="text-xs text-orange-600/70 font-medium">Day Streak</div>
                    </div>
                </motion.div>

                {/* XP Counter */}
                <motion.div
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                >
                    <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />
                    <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{totalXP.toLocaleString()}</div>
                        <div className="text-xs text-purple-600/70 font-medium">Total XP</div>
                    </div>
                </motion.div>

                {/* Daily Goal Progress */}
                <div className="flex-1 min-w-[200px] max-w-[300px]">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-secondary-600">
                            <Target className="w-4 h-4" />
                            Daily Goal
                        </div>
                        <span className={`text-sm font-bold ${isGoalMet ? 'text-green-600' : 'text-secondary-600'}`}>
                            {dailyXP}/{dailyGoal} XP
                        </span>
                    </div>
                    <div className="h-3 bg-secondary-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${isGoalMet
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-primary-400 to-purple-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
