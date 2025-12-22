import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { speakPunjabi, stopSpeaking, isSpeechSupported, initVoices } from '../../utils/textToSpeech';

interface AudioButtonProps {
    text: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
    text,
    className = '',
    size = 'md'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize voices on mount
    useEffect(() => {
        initVoices().then(() => setIsReady(true));

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isSpeechSupported()) {
            alert('Text-to-speech is not supported in your browser');
            return;
        }

        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        } else {
            setIsPlaying(true);

            // Fallback timeout - reset spinner after 5 seconds max
            timeoutRef.current = setTimeout(() => {
                setIsPlaying(false);
            }, 5000);

            speakPunjabi(text, () => {
                setIsPlaying(false);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            });
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            className={`
                ${sizeClasses[size]}
                rounded-full bg-white/20 backdrop-blur-sm
                flex items-center justify-center
                hover:bg-white/30 active:bg-white/40 transition-colors
                border border-white/20
                ${className}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isPlaying ? 'Speaking...' : 'Play pronunciation'}
            aria-label={`Play pronunciation of ${text}`}
        >
            {isPlaying ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 size={iconSizes[size]} className="text-white" />
                </motion.div>
            ) : (
                <motion.div
                    animate={isReady ? {} : { opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <Volume2 size={iconSizes[size]} className="text-white" />
                </motion.div>
            )}
        </motion.button>
    );
};
