/**
 * Text-to-Speech utility for Punjabi pronunciation
 * Uses Web Speech API with Punjabi language support
 */

// Check if speech synthesis is available
export const isSpeechSupported = (): boolean => {
    return 'speechSynthesis' in window;
};

// Get available Punjabi voices
export const getPunjabiVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    // Try to find a Punjabi voice (pa-IN or pa-PK)
    const punjabiVoice = voices.find(
        voice => voice.lang.startsWith('pa') || voice.lang.includes('Punjabi')
    );

    // Fallback to Hindi voice which can pronounce Gurmukhi reasonably well
    if (!punjabiVoice) {
        return voices.find(voice => voice.lang.startsWith('hi')) || null;
    }

    return punjabiVoice;
};

// Speak text in Punjabi
export const speakPunjabi = (text: string, onEnd?: () => void): void => {
    if (!isSpeechSupported()) {
        console.warn('Speech synthesis not supported');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Try to get Punjabi/Hindi voice
    const voice = getPunjabiVoice();
    if (voice) {
        utterance.voice = voice;
    }

    // Set language to Punjabi
    utterance.lang = 'pa-IN';
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1;
    utterance.volume = 1;

    if (onEnd) {
        utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
};

// Stop speaking
export const stopSpeaking = (): void => {
    if (isSpeechSupported()) {
        window.speechSynthesis.cancel();
    }
};
