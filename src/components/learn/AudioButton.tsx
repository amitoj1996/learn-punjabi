import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { speakPunjabi, stopSpeaking, isSpeechSupported } from '../../utils/textToSpeech';

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
        e.stopPropagation(); // Prevent flip card from flipping

        if (!isSpeechSupported()) {
            alert('Text-to-speech is not supported in your browser');
            return;
        }

        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            speakPunjabi(text, () => setIsPlaying(false));
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            className={`
                ${sizeClasses[size]}
                rounded-full bg-white/20 backdrop-blur-sm
                flex items-center justify-center
                hover:bg-white/30 transition-colors
                border border-white/20
                ${className}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Stop' : 'Play pronunciation'}
        >
            {isPlaying ? (
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                >
                    <VolumeX size={iconSizes[size]} className="text-white" />
                </motion.div>
            ) : (
                <Volume2 size={iconSizes[size]} className="text-white" />
            )}
        </motion.button>
    );
};
