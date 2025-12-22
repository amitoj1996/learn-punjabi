import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    CheckCircle, ChevronRight,
    Award, Clock, X, Check, RotateCcw
} from 'lucide-react';
import { modules } from '../data/lessons';
import type { Lesson } from '../data/lessons';
import ReactMarkdown from 'react-markdown';

interface UserProgress {
    lessonId: string;
    completed: boolean;
    quizScore?: number;
    completedAt?: string;
}

export const LearnPage: React.FC = () => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [currentView, setCurrentView] = useState<'content' | 'vocabulary' | 'quiz'>('content');
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    // Fetch user progress on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchProgress();
        }
    }, [isAuthenticated]);

    const fetchProgress = async () => {
        try {
            const response = await fetch('/api/learn/progress');
            if (response.ok) {
                const data = await response.json();
                setProgress(data.progress || []);
            }
        } catch (err) {
            console.error('Failed to fetch progress:', err);
        }
    };

    const markLessonComplete = async (lessonId: string, quizScore?: number) => {
        const newProgress: UserProgress = {
            lessonId,
            completed: true,
            quizScore,
            completedAt: new Date().toISOString()
        };

        // Optimistic update
        setProgress(prev => {
            const existing = prev.findIndex(p => p.lessonId === lessonId);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = newProgress;
                return updated;
            }
            return [...prev, newProgress];
        });

        // Save to server if authenticated
        if (isAuthenticated) {
            try {
                await fetch('/api/learn/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProgress)
                });
            } catch (err) {
                console.error('Failed to save progress:', err);
            }
        }
    };

    const isLessonCompleted = (lessonId: string) => {
        return progress.some(p => p.lessonId === lessonId && p.completed);
    };

    const getModuleProgress = (moduleId: string) => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return { completed: 0, total: 0, percentage: 0 };
        const completed = module.lessons.filter(l => isLessonCompleted(l.id)).length;
        const total = module.lessons.length;
        return { completed, total, percentage: Math.round((completed / total) * 100) };
    };

    const openLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setCurrentView('content');
        setQuizAnswers([]);
        setQuizSubmitted(false);
    };

    const closeLesson = () => {
        setSelectedLesson(null);
    };

    const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
        if (quizSubmitted) return;
        const newAnswers = [...quizAnswers];
        newAnswers[questionIndex] = answerIndex;
        setQuizAnswers(newAnswers);
    };

    const submitQuiz = () => {
        if (!selectedLesson) return;
        setQuizSubmitted(true);
        const correct = selectedLesson.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length;
        const score = Math.round((correct / selectedLesson.quiz.length) * 100);
        markLessonComplete(selectedLesson.id, score);
    };

    const retakeQuiz = () => {
        setQuizAnswers([]);
        setQuizSubmitted(false);
    };

    const getQuizScore = () => {
        if (!selectedLesson || !quizSubmitted) return null;
        const correct = selectedLesson.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length;
        return { correct, total: selectedLesson.quiz.length, percentage: Math.round((correct / selectedLesson.quiz.length) * 100) };
    };

    const totalCompleted = progress.filter(p => p.completed).length;
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
                            Learn Punjabi <span className="text-primary-600">Free</span>
                        </h1>
                        <p className="text-secondary-600 mt-2">
                            Self-paced lessons to start your Punjabi journey
                        </p>

                        {/* Overall Progress */}
                        {totalCompleted > 0 && (
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                                    <Award size={18} />
                                    <span className="font-medium">{totalCompleted}/{totalLessons} lessons completed</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Modules */}
                    <div className="space-y-8">
                        {modules.map((module, moduleIndex) => {
                            const moduleProgress = getModuleProgress(module.id);
                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: moduleIndex * 0.1 }}
                                >
                                    <Card className="p-6 overflow-hidden">
                                        {/* Module Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                                                    {module.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-secondary-900">{module.title}</h2>
                                                    <p className="text-secondary-500 text-sm">{module.description}</p>
                                                </div>
                                            </div>
                                            {moduleProgress.completed > 0 && (
                                                <div className="hidden md:flex items-center gap-3">
                                                    <div className="w-32 h-2 bg-secondary-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${moduleProgress.percentage}%` }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-secondary-500 font-medium">
                                                        {moduleProgress.completed}/{moduleProgress.total}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Lessons Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {module.lessons.map((lesson) => {
                                                const completed = isLessonCompleted(lesson.id);
                                                return (
                                                    <motion.button
                                                        key={lesson.id}
                                                        onClick={() => openLesson(lesson)}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all ${completed
                                                            ? 'border-green-200 bg-green-50 hover:bg-green-100'
                                                            : 'border-secondary-100 bg-white hover:border-primary-200 hover:bg-primary-50'
                                                            }`}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${completed ? 'bg-green-200' : 'bg-primary-100'
                                                                }`}>
                                                                {completed ? <CheckCircle size={20} className="text-green-600" /> : lesson.icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-secondary-900 truncate">{lesson.title}</h3>
                                                                <p className="text-xs text-secondary-500 mt-0.5">{lesson.description}</p>
                                                                <div className="flex items-center gap-2 mt-2 text-xs text-secondary-400">
                                                                    <Clock size={12} />
                                                                    <span>{lesson.duration}</span>
                                                                    {lesson.vocabulary.length > 0 && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span>{lesson.vocabulary.length} words</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={18} className="text-secondary-300 flex-shrink-0" />
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA for booking */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <Card className="p-8 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-center">
                            <h2 className="text-2xl font-bold mb-2">Ready for Live Lessons?</h2>
                            <p className="text-primary-100 mb-6">Book a 1-on-1 lesson with a native Punjabi tutor</p>
                            <Link to="/tutors">
                                <Button className="bg-white text-primary-600 hover:bg-primary-50">
                                    Find a Tutor
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                </div>

                {/* Lesson Viewer Modal */}
                <AnimatePresence>
                    {selectedLesson && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            onClick={closeLesson}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{selectedLesson.icon}</span>
                                            <div>
                                                <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
                                                <p className="text-primary-100 text-sm">{selectedLesson.duration}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeLesson}
                                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex gap-2 mt-4">
                                        {['content', 'vocabulary', 'quiz'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setCurrentView(tab as 'content' | 'vocabulary' | 'quiz')}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === tab
                                                    ? 'bg-white text-primary-600'
                                                    : 'bg-white/20 text-white hover:bg-white/30'
                                                    }`}
                                            >
                                                {tab === 'content' && '📖 Lesson'}
                                                {tab === 'vocabulary' && `🔤 Words (${selectedLesson.vocabulary.length})`}
                                                {tab === 'quiz' && `✅ Quiz (${selectedLesson.quiz.length})`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 overflow-y-auto max-h-[60vh]">
                                    {currentView === 'content' && (
                                        <div className="prose prose-secondary max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ children }) => <h1 className="text-2xl font-bold text-secondary-900 mb-4 pb-2 border-b border-secondary-200">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-xl font-semibold text-secondary-800 mt-6 mb-3">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-lg font-semibold text-secondary-700 mt-4 mb-2">{children}</h3>,
                                                    p: ({ children }) => <p className="text-secondary-600 mb-4 leading-relaxed">{children}</p>,
                                                    strong: ({ children }) => <strong className="text-secondary-800 font-semibold">{children}</strong>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-secondary-600">{children}</ul>,
                                                    li: ({ children }) => <li className="text-secondary-600">{children}</li>,
                                                    table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="min-w-full border-collapse">{children}</table></div>,
                                                    thead: ({ children }) => <thead className="bg-primary-50">{children}</thead>,
                                                    th: ({ children }) => <th className="border border-secondary-200 px-4 py-2 text-left font-semibold text-secondary-800">{children}</th>,
                                                    td: ({ children }) => <td className="border border-secondary-200 px-4 py-2 text-secondary-700">{children}</td>,
                                                }}
                                            >
                                                {selectedLesson.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {currentView === 'vocabulary' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedLesson.vocabulary.map((word, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="p-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-100"
                                                >
                                                    <div className="text-3xl font-bold text-primary-700 mb-1">{word.gurmukhi}</div>
                                                    <div className="text-lg text-secondary-700 font-medium">{word.transliteration}</div>
                                                    <div className="text-sm text-secondary-500">{word.english}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {currentView === 'quiz' && (
                                        <div className="space-y-6">
                                            {quizSubmitted && (
                                                <div className={`p-4 rounded-xl text-center ${getQuizScore()!.percentage >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    <p className="text-2xl font-bold">{getQuizScore()!.percentage}%</p>
                                                    <p>{getQuizScore()!.correct} out of {getQuizScore()!.total} correct</p>
                                                    {getQuizScore()!.percentage >= 80 ? (
                                                        <p className="mt-1">🎉 Great job! Lesson completed!</p>
                                                    ) : (
                                                        <button
                                                            onClick={retakeQuiz}
                                                            className="mt-2 flex items-center gap-2 mx-auto text-sm font-medium hover:underline"
                                                        >
                                                            <RotateCcw size={14} /> Try again
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            {selectedLesson.quiz.map((question, qIndex) => (
                                                <div key={qIndex} className="p-4 bg-secondary-50 rounded-xl">
                                                    <p className="font-medium text-secondary-900 mb-3">
                                                        {qIndex + 1}. {question.question}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {question.options.map((option, oIndex) => {
                                                            const isSelected = quizAnswers[qIndex] === oIndex;
                                                            const isCorrect = quizSubmitted && oIndex === question.correctIndex;
                                                            const isWrong = quizSubmitted && isSelected && oIndex !== question.correctIndex;
                                                            return (
                                                                <button
                                                                    key={oIndex}
                                                                    onClick={() => handleQuizAnswer(qIndex, oIndex)}
                                                                    disabled={quizSubmitted}
                                                                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${isCorrect ? 'bg-green-100 border-2 border-green-400' :
                                                                        isWrong ? 'bg-red-100 border-2 border-red-400' :
                                                                            isSelected ? 'bg-primary-100 border-2 border-primary-400' :
                                                                                'bg-white border-2 border-secondary-200 hover:border-primary-300'
                                                                        }`}
                                                                >
                                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${isCorrect ? 'bg-green-500 text-white' :
                                                                        isWrong ? 'bg-red-500 text-white' :
                                                                            isSelected ? 'bg-primary-500 text-white' :
                                                                                'bg-secondary-200 text-secondary-600'
                                                                        }`}>
                                                                        {isCorrect ? <Check size={14} /> : isWrong ? <X size={14} /> : String.fromCharCode(65 + oIndex)}
                                                                    </span>
                                                                    <span className="text-secondary-800">{option}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}

                                            {!quizSubmitted && (
                                                <Button
                                                    onClick={submitQuiz}
                                                    disabled={quizAnswers.length < selectedLesson.quiz.length}
                                                    className="w-full"
                                                >
                                                    Submit Quiz
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};
