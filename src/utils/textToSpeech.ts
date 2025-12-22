/**
 * Text-to-Speech utility for Punjabi pronunciation
 * Uses Google Translate TTS for reliable Punjabi audio
 */

// Create an audio element for playback
let audioElement: HTMLAudioElement | null = null;

// Get Google Translate TTS URL for Punjabi
const getTTSUrl = (text: string): string => {
    const encodedText = encodeURIComponent(text);
    // Google Translate TTS endpoint - supports Punjabi (pa)
    return `https://translate.google.com/translate_tts?ie=UTF-8&tl=pa&client=tw-ob&q=${encodedText}`;
};

// Check if audio is supported
export const isSpeechSupported = (): boolean => {
    return typeof window !== 'undefined' && typeof Audio !== 'undefined';
};

// Speak text in Punjabi using Google Translate TTS
export const speakPunjabi = (text: string, onEnd?: () => void): void => {
    if (!isSpeechSupported()) {
        console.warn('Audio not supported');
        onEnd?.();
        return;
    }

    // Stop any currently playing audio
    stopSpeaking();

    try {
        const url = getTTSUrl(text);
        audioElement = new Audio(url);

        audioElement.onended = () => {
            onEnd?.();
        };

        audioElement.onerror = (e) => {
            console.error('Audio playback error:', e);
            // Fallback to Web Speech API
            fallbackToWebSpeech(text, onEnd);
        };

        audioElement.play().catch((e) => {
            console.error('Play error:', e);
            // Fallback to Web Speech API
            fallbackToWebSpeech(text, onEnd);
        });
    } catch (e) {
        console.error('TTS error:', e);
        fallbackToWebSpeech(text, onEnd);
    }
};

// Fallback to Web Speech API if Google TTS fails
const fallbackToWebSpeech = (text: string, onEnd?: () => void): void => {
    if (!('speechSynthesis' in window)) {
        console.warn('No TTS available');
        onEnd?.();
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Hindi as fallback
    utterance.rate = 0.8;

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
};

// Stop speaking
export const stopSpeaking = (): void => {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};

// Initialize (no-op, kept for compatibility)
export const initVoices = (): Promise<void> => {
    return Promise.resolve();
};
