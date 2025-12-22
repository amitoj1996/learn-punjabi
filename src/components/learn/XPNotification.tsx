import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPNotificationProps {
    amount: number | null;
}

export const XPNotification: React.FC<XPNotificationProps> = ({ amount }) => {
    return (
        <AnimatePresence>
            {amount !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <motion.div
                        className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl shadow-purple-500/30"
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Zap className="w-8 h-8 fill-yellow-300 text-yellow-300" />
                        </motion.div>
                        <div>
                            <div className="text-2xl font-bold">+{amount} XP</div>
                            <div className="text-sm text-white/80">Great work!</div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
