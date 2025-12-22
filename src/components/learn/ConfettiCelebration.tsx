import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
}

interface ConfettiCelebrationProps {
    show: boolean;
    onComplete?: () => void;
}

const colors = ['#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#EF4444'];

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ show, onComplete }) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (show) {
            // Generate confetti pieces
            const newPieces: ConfettiPiece[] = [];
            for (let i = 0; i < 50; i++) {
                newPieces.push({
                    id: i,
                    x: Math.random() * 100,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    delay: Math.random() * 0.5,
                    size: Math.random() * 8 + 4,
                });
            }
            setPieces(newPieces);

            // Clear after animation
            const timer = setTimeout(() => {
                setPieces([]);
                onComplete?.();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {pieces.length > 0 && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {pieces.map((piece) => (
                        <motion.div
                            key={piece.id}
                            className="absolute rounded-sm"
                            style={{
                                left: `${piece.x}%`,
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                            }}
                            initial={{ top: -20, rotate: 0, opacity: 1 }}
                            animate={{
                                top: '110%',
                                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                                opacity: [1, 1, 0],
                            }}
                            transition={{
                                duration: 2.5,
                                delay: piece.delay,
                                ease: 'easeIn',
                            }}
                        />
                    ))}

                    {/* Celebration message */}
                    <motion.div
                        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 text-center">
                            <div className="text-5xl mb-2">🎉</div>
                            <h2 className="text-2xl font-bold text-secondary-800">Daily Goal Reached!</h2>
                            <p className="text-secondary-500 mt-1">Keep up the amazing work!</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
