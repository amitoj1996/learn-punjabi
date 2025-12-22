import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { Clock, X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { modules } from '../data/lessons';
import type { Lesson, VocabularyWord } from '../data/lessons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGamification } from '../hooks/useGamification';
import { ProgressHeader } from '../components/learn/ProgressHeader';
import { SkillTree } from '../components/learn/SkillTree';
import { XPNotification } from '../components/learn/XPNotification';
import { ConfettiCelebration } from '../components/learn/ConfettiCelebration';
import { AudioButton } from '../components/learn/AudioButton';

// Interactive Flip Card Component
const FlipCard: React.FC<{ word: VocabularyWord; delay: number }> = ({ word, delay }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            className="perspective-1000 h-40 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="relative w-full h-full text-center"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front - Gurmukhi */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg shadow-purple-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl font-bold">{word.gurmukhi}</span>
                        <AudioButton text={word.pronunciation || word.gurmukhi} size="sm" />
                    </div>
                    <span className="text-white/70 text-sm">Tap to reveal • 🔊 for audio</span>
                </div>
                {/* Back - English */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-200"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold">{word.transliteration}</span>
                        <AudioButton text={word.pronunciation || word.gurmukhi} size="sm" />
                    </div>
                    <span className="text-white/90">{word.english}</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const LearnPage: React.FC = () => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [currentView, setCurrentView] = useState<'content' | 'vocabulary' | 'quiz'>('content');
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [hasShownGoalCelebration, setHasShownGoalCelebration] = useState(false);

    // Gamification hook
    const {
        totalXP,
        currentStreak,
        dailyXP,
        dailyGoal,
        completedLessons,
        addXP,
        showXPNotification,
        isDailyGoalMet,
    } = useGamification();

    // Show confetti when daily goal is first reached
    React.useEffect(() => {
        if (isDailyGoalMet && !hasShownGoalCelebration) {
            setShowConfetti(true);
            setHasShownGoalCelebration(true);
        }
    }, [isDailyGoalMet, hasShownGoalCelebration]);

    // Get all lessons flattened
    const allLessons = modules.flatMap(m => m.lessons);

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
        const percentage = Math.round((correct / selectedLesson.quiz.length) * 100);

        // Award XP if passed (≥60%)
        if (percentage >= 60) {
            addXP(selectedLesson.xpReward, selectedLesson.id);
        }
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

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
                            Learn Punjabi <span className="text-primary-600">Free</span>
                        </h1>
                        <p className="text-secondary-600 mt-2">
                            Complete lessons to earn XP and build your streak! 🔥
                        </p>
                    </motion.div>

                    {/* Gamification Progress Header */}
                    <ProgressHeader
                        streak={currentStreak}
                        totalXP={totalXP}
                        dailyXP={dailyXP}
                        dailyGoal={dailyGoal}
                    />

                    {/* Skill Tree */}
                    <Card className="p-8 bg-white/60 backdrop-blur-sm">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-secondary-800 flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary-500" />
                                Module 1: Getting Started
                            </h2>
                            <p className="text-secondary-500 text-sm mt-1">
                                Master the basics of Punjabi language
                            </p>
                        </div>

                        <SkillTree
                            lessons={allLessons}
                            completedLessons={completedLessons}
                            onLessonSelect={openLesson}
                        />
                    </Card>

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

                {/* XP Notification Toast */}
                <XPNotification amount={showXPNotification} />

                {/* Confetti Celebration */}
                <ConfettiCelebration
                    show={showConfetti}
                    onComplete={() => setShowConfetti(false)}
                />

                {/* Lesson Viewer Modal */}
                <AnimatePresence>
                    {selectedLesson && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gradient-to-br from-black/60 to-purple-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={closeLesson}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/20"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 text-white p-8 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                                    <div className="relative flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            >
                                                <span className={selectedLesson.icon.length > 2 ? 'text-lg font-bold' : 'text-4xl'}>
                                                    {selectedLesson.icon}
                                                </span>
                                            </motion.div>
                                            <div>
                                                <h2 className="text-2xl font-bold tracking-tight">{selectedLesson.title}</h2>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-white/80 text-sm">
                                                        <Clock size={14} />
                                                        {selectedLesson.duration}
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                                    <span className="text-white/80 text-sm">{selectedLesson.vocabulary.length} words</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                                                        +{selectedLesson.xpReward} XP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={closeLesson}
                                            className="p-3 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X size={24} />
                                        </motion.button>
                                    </div>

                                    {/* Tabs */}
                                    <div className="relative flex gap-2 mt-6">
                                        {[
                                            { id: 'content', label: '📖 Learn' },
                                            { id: 'vocabulary', label: '🔤 Practice' },
                                            { id: 'quiz', label: '✨ Quiz' }
                                        ].map((tab) => (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => setCurrentView(tab.id as 'content' | 'vocabulary' | 'quiz')}
                                                className={`relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${currentView === tab.id
                                                    ? 'bg-white text-primary-600 shadow-lg shadow-white/20'
                                                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                                    }`}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                {tab.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 overflow-y-auto max-h-[55vh] bg-gradient-to-b from-secondary-50/50 to-white">
                                    <AnimatePresence mode="wait">
                                        {currentView === 'content' && (
                                            <motion.div
                                                key="content"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="prose prose-secondary max-w-none"
                                            >
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({ children }) => (
                                                            <h1 className="text-2xl font-bold text-secondary-900 mb-6 pb-3 border-b-2 border-primary-100 flex items-center gap-3">
                                                                <span className="w-2 h-8 bg-gradient-to-b from-primary-500 to-purple-500 rounded-full" />
                                                                {children}
                                                            </h1>
                                                        ),
                                                        h2: ({ children }) => (
                                                            <h2 className="text-xl font-bold text-secondary-800 mt-8 mb-4 flex items-center gap-2">
                                                                <span className="text-primary-500">✦</span>
                                                                {children}
                                                            </h2>
                                                        ),
                                                        h3: ({ children }) => <h3 className="text-lg font-semibold text-secondary-700 mt-5 mb-3">{children}</h3>,
                                                        p: ({ children }) => <p className="text-secondary-600 mb-4 leading-relaxed text-base">{children}</p>,
                                                        strong: ({ children }) => <strong className="text-primary-700 font-bold">{children}</strong>,
                                                        ul: ({ children }) => <ul className="space-y-2 mb-5">{children}</ul>,
                                                        li: ({ children }) => (
                                                            <li className="flex items-start gap-2 text-secondary-600">
                                                                <span className="text-primary-400 mt-1">▸</span>
                                                                <span>{children}</span>
                                                            </li>
                                                        ),
                                                        table: ({ children }) => (
                                                            <div className="overflow-x-auto mb-6 rounded-xl border border-secondary-200 shadow-sm">
                                                                <table className="min-w-full">{children}</table>
                                                            </div>
                                                        ),
                                                        thead: ({ children }) => <thead className="bg-gradient-to-r from-primary-50 to-purple-50">{children}</thead>,
                                                        th: ({ children }) => <th className="px-5 py-3 text-left font-bold text-secondary-800 border-b border-secondary-200">{children}</th>,
                                                        td: ({ children }) => <td className="px-5 py-3 text-secondary-700 border-b border-secondary-100">{children}</td>,
                                                    }}
                                                >
                                                    {selectedLesson.content}
                                                </ReactMarkdown>

                                                <motion.div
                                                    className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <p className="text-secondary-700 font-medium flex items-center gap-2">
                                                        <span className="text-2xl">👆</span>
                                                        Ready to practice? Click <strong className="text-primary-600">"🔤 Practice"</strong> to learn the vocabulary!
                                                    </p>
                                                </motion.div>
                                            </motion.div>
                                        )}

                                        {currentView === 'vocabulary' && (
                                            <motion.div
                                                key="vocabulary"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                            >
                                                <div className="text-center mb-6">
                                                    <h3 className="text-xl font-bold text-secondary-800">Tap cards to flip!</h3>
                                                    <p className="text-secondary-500">Learn each word, then test yourself with the quiz</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedLesson.vocabulary.map((word, i) => (
                                                        <FlipCard key={i} word={word} delay={i * 0.05} />
                                                    ))}
                                                </div>

                                                <motion.div
                                                    className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <p className="text-secondary-700 font-medium flex items-center gap-2">
                                                        <span className="text-2xl">🎯</span>
                                                        Ready to test yourself? Click <strong className="text-green-600">"✨ Quiz"</strong> to earn {selectedLesson.xpReward} XP!
                                                    </p>
                                                </motion.div>
                                            </motion.div>
                                        )}

                                        {currentView === 'quiz' && (
                                            <motion.div
                                                key="quiz"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-6"
                                            >
                                                {quizSubmitted && (
                                                    <motion.div
                                                        className={`p-8 rounded-2xl text-center ${getQuizScore()!.percentage >= 60
                                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200'
                                                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-200'
                                                            }`}
                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                    >
                                                        <motion.div
                                                            className="text-6xl mb-3"
                                                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {getQuizScore()!.percentage >= 60 ? '🎉' : '💪'}
                                                        </motion.div>
                                                        <p className="text-4xl font-bold text-secondary-800">{getQuizScore()!.percentage}%</p>
                                                        <p className="text-secondary-600 mt-1">{getQuizScore()!.correct} out of {getQuizScore()!.total} correct</p>
                                                        {getQuizScore()!.percentage >= 60 ? (
                                                            <p className="mt-3 text-green-700 font-semibold">+{selectedLesson.xpReward} XP earned! 🎊</p>
                                                        ) : (
                                                            <Button onClick={retakeQuiz} variant="outline" className="mt-4">
                                                                <RotateCcw size={16} className="mr-2" /> Try Again
                                                            </Button>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {selectedLesson.quiz.map((question, qIndex) => (
                                                    <motion.div
                                                        key={qIndex}
                                                        className="p-6 bg-white rounded-2xl border border-secondary-200 shadow-sm"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: qIndex * 0.1 }}
                                                    >
                                                        <p className="font-bold text-secondary-900 text-lg mb-4 flex items-center gap-3">
                                                            <span className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                                                {qIndex + 1}
                                                            </span>
                                                            {question.question}
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {question.options.map((option, oIndex) => {
                                                                const isSelected = quizAnswers[qIndex] === oIndex;
                                                                const isCorrect = quizSubmitted && oIndex === question.correctIndex;
                                                                const isWrong = quizSubmitted && isSelected && oIndex !== question.correctIndex;
                                                                return (
                                                                    <motion.button
                                                                        key={oIndex}
                                                                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                                                                        disabled={quizSubmitted}
                                                                        className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${isCorrect ? 'bg-green-100 border-2 border-green-400 shadow-lg shadow-green-100' :
                                                                            isWrong ? 'bg-red-100 border-2 border-red-400' :
                                                                                isSelected ? 'bg-primary-100 border-2 border-primary-400 shadow-lg shadow-primary-100' :
                                                                                    'bg-secondary-50 border-2 border-transparent hover:border-primary-200 hover:bg-primary-50'
                                                                            }`}
                                                                        whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                                        whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                                    >
                                                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-500 text-white' :
                                                                            isWrong ? 'bg-red-500 text-white' :
                                                                                isSelected ? 'bg-primary-500 text-white' :
                                                                                    'bg-secondary-200 text-secondary-600'
                                                                            }`}>
                                                                            {isCorrect ? <Check size={16} /> : isWrong ? <X size={16} /> : String.fromCharCode(65 + oIndex)}
                                                                        </span>
                                                                        <span className="text-secondary-800 font-medium">{option}</span>
                                                                    </motion.button>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {!quizSubmitted && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        <Button
                                                            onClick={submitQuiz}
                                                            disabled={quizAnswers.filter(a => a !== undefined).length < selectedLesson.quiz.length}
                                                            className="w-full py-4 text-lg bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600"
                                                        >
                                                            ✨ Submit Quiz
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};
