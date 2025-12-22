/**
 * Text-to-Speech utility for Punjabi pronunciation
 * Uses Web Speech API with Punjabi language support
 */

// Check if speech synthesis is available
export const isSpeechSupported = (): boolean => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Store voices once loaded
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

// Initialize voices (call this early in the app)
export const initVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
        if (!isSpeechSupported()) {
            resolve([]);
            return;
        }

        const loadVoices = () => {
            cachedVoices = window.speechSynthesis.getVoices();
            voicesLoaded = true;
            resolve(cachedVoices);
        };

        // Try to get voices immediately
        cachedVoices = window.speechSynthesis.getVoices();

        if (cachedVoices.length > 0) {
            voicesLoaded = true;
            resolve(cachedVoices);
        } else {
            // Wait for voices to load (Chrome loads them async)
            window.speechSynthesis.onvoiceschanged = loadVoices;

            // Fallback timeout - some browsers don't fire the event
            setTimeout(() => {
                if (!voicesLoaded) {
                    loadVoices();
                }
            }, 1000);
        }
    });
};

// Get the best available voice for Punjabi
const getBestVoice = (): SpeechSynthesisVoice | undefined => {
    if (cachedVoices.length === 0) {
        cachedVoices = window.speechSynthesis.getVoices();
    }

    // Priority order: Punjabi > Hindi > any available
    const punjabiVoice = cachedVoices.find(v => v.lang.startsWith('pa'));
    if (punjabiVoice) return punjabiVoice;

    const hindiVoice = cachedVoices.find(v => v.lang.startsWith('hi'));
    if (hindiVoice) return hindiVoice;

    // Fallback to first available voice
    return cachedVoices[0];
};

// Speak text in Punjabi
export const speakPunjabi = (text: string, onEnd?: () => void): void => {
    if (!isSpeechSupported()) {
        console.warn('Speech synthesis not supported');
        onEnd?.();
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Get the best available voice
    const voice = getBestVoice();
    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    } else {
        // Default to Hindi language tag even without a specific voice
        utterance.lang = 'hi-IN';
    }

    utterance.rate = 0.85; // Slightly slower for learning
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
        console.error('Speech error:', e);
        onEnd?.();
    };

    // Chrome bug: need to call resume sometimes
    window.speechSynthesis.resume();

    window.speechSynthesis.speak(utterance);

    // Chrome bug workaround: speech stops after ~15 seconds of no activity
    // Keep-alive by pausing/resuming
    const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
            clearInterval(keepAlive);
        } else {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }
    }, 10000);
};

// Stop speaking
export const stopSpeaking = (): void => {
    if (isSpeechSupported()) {
        window.speechSynthesis.cancel();
    }
};

// Debug: get all available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
    if (!isSpeechSupported()) return [];
    return window.speechSynthesis.getVoices();
};

// Initialize on module load
if (typeof window !== 'undefined') {
    initVoices();
}
