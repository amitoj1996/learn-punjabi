import { useState, useEffect, useCallback } from 'react';

interface GamificationState {
    totalXP: number;
    currentStreak: number;
    lastActivityDate: string | null;
    dailyXP: number;
    dailyGoal: number;
    completedLessons: string[];
}

const STORAGE_KEY = 'punjabi_learn_gamification';
const DEFAULT_DAILY_GOAL = 50;

const getInitialState = (): GamificationState => {
    if (typeof window === 'undefined') {
        return {
            totalXP: 0,
            currentStreak: 0,
            lastActivityDate: null,
            dailyXP: 0,
            dailyGoal: DEFAULT_DAILY_GOAL,
            completedLessons: [],
        };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // Invalid data, reset
        }
    }

    return {
        totalXP: 0,
        currentStreak: 0,
        lastActivityDate: null,
        dailyXP: 0,
        dailyGoal: DEFAULT_DAILY_GOAL,
        completedLessons: [],
    };
};

const isSameDay = (date1: string, date2: string): boolean => {
    return date1.split('T')[0] === date2.split('T')[0];
};

const isYesterday = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
};

export const useGamification = () => {
    const [state, setState] = useState<GamificationState>(getInitialState);
    const [showXPNotification, setShowXPNotification] = useState<number | null>(null);

    // Persist state to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Check and update streak on mount
    useEffect(() => {
        const today = new Date().toISOString();

        if (state.lastActivityDate) {
            if (isSameDay(state.lastActivityDate, today)) {
                // Same day, keep everything
                return;
            } else if (isYesterday(state.lastActivityDate)) {
                // Yesterday, streak continues but reset daily XP
                setState(prev => ({
                    ...prev,
                    dailyXP: 0,
                }));
            } else {
                // More than a day ago, reset streak and daily XP
                setState(prev => ({
                    ...prev,
                    currentStreak: 0,
                    dailyXP: 0,
                }));
            }
        }
    }, []);

    const addXP = useCallback((amount: number, lessonId?: string) => {
        const today = new Date().toISOString();

        setState(prev => {
            const isNewDay = !prev.lastActivityDate || !isSameDay(prev.lastActivityDate, today);
            const isStreakContinued = prev.lastActivityDate &&
                (isSameDay(prev.lastActivityDate, today) || isYesterday(prev.lastActivityDate));

            return {
                ...prev,
                totalXP: prev.totalXP + amount,
                dailyXP: isNewDay ? amount : prev.dailyXP + amount,
                currentStreak: isNewDay
                    ? (isStreakContinued ? prev.currentStreak + 1 : 1)
                    : prev.currentStreak,
                lastActivityDate: today,
                completedLessons: lessonId && !prev.completedLessons.includes(lessonId)
                    ? [...prev.completedLessons, lessonId]
                    : prev.completedLessons,
            };
        });

        // Trigger XP notification
        setShowXPNotification(amount);
        setTimeout(() => setShowXPNotification(null), 2000);
    }, []);

    const isLessonUnlocked = useCallback((_lessonId: string, requiredLessons: string[] = []): boolean => {
        if (requiredLessons.length === 0) return true;
        return requiredLessons.every(req => state.completedLessons.includes(req));
    }, [state.completedLessons]);

    const getLessonStatus = useCallback((lessonId: string): 'locked' | 'available' | 'completed' => {
        if (state.completedLessons.includes(lessonId)) return 'completed';
        return 'available'; // Unlock logic handled separately
    }, [state.completedLessons]);

    const dailyProgress = Math.min((state.dailyXP / state.dailyGoal) * 100, 100);
    const isDailyGoalMet = state.dailyXP >= state.dailyGoal;

    return {
        totalXP: state.totalXP,
        currentStreak: state.currentStreak,
        dailyXP: state.dailyXP,
        dailyGoal: state.dailyGoal,
        dailyProgress,
        isDailyGoalMet,
        completedLessons: state.completedLessons,
        addXP,
        isLessonUnlocked,
        getLessonStatus,
        showXPNotification,
    };
};
