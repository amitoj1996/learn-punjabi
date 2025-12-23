// Free Punjabi Lessons - Content Data
// Module 1: Getting Started

export interface VocabularyWord {
    gurmukhi: string; // Punjabi script
    transliteration: string; // Romanized version
    english: string; // English meaning
    pronunciation?: string; // Optional: text for TTS (defaults to gurmukhi)
    audio?: string; // Optional audio file path
    color?: string; // Optional: CSS color for card background (used in color lessons)
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Lesson {
    id: string;
    moduleId: string;
    title: string;
    description: string;
    icon: string; // emoji
    duration: string; // e.g., "10 min"
    xpReward: number; // XP earned for completing this lesson
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    unlockRequirements: string[]; // lesson IDs that must be completed first
    vocabulary: VocabularyWord[];
    content: string; // markdown content
    quiz: QuizQuestion[];
}

export interface Module {
    id: string;
    title: string;
    description: string;
    icon: string;
    lessons: Lesson[];
}

export const modules: Module[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Learn the basics of Punjabi - alphabet, greetings, and numbers',
        icon: '🌱',
        lessons: [
            {
                id: 'gurmukhi-alphabet',
                moduleId: 'getting-started',
                title: 'The Gurmukhi Alphabet',
                description: 'Introduction to the Punjabi script',
                icon: 'ੳਅੲ',
                duration: '15 min',
                xpReward: 15,
                difficulty: 'beginner',
                unlockRequirements: [],
                vocabulary: [
                    { gurmukhi: 'ੳ', transliteration: 'Ura', english: 'First letter (vowel carrier)', pronunciation: 'ਊੜਾ' },
                    { gurmukhi: 'ਅ', transliteration: 'Aira', english: 'Second letter (vowel carrier)', pronunciation: 'ਐੜਾ' },
                    { gurmukhi: 'ੲ', transliteration: 'Eeri', english: 'Third letter (vowel carrier)', pronunciation: 'ਈੜੀ' },
                    { gurmukhi: 'ਸ', transliteration: 'Sussa', english: 'S sound', pronunciation: 'ਸੱਸਾ' },
                    { gurmukhi: 'ਹ', transliteration: 'Haaha', english: 'H sound', pronunciation: 'ਹਾਹਾ' },
                    { gurmukhi: 'ਕ', transliteration: 'Kakka', english: 'K sound', pronunciation: 'ਕੱਕਾ' },
                    { gurmukhi: 'ਖ', transliteration: 'Khakha', english: 'Kh sound', pronunciation: 'ਖੱਖਾ' },
                    { gurmukhi: 'ਗ', transliteration: 'Gagga', english: 'G sound', pronunciation: 'ਗੱਗਾ' },
                ],
                content: `
# The Gurmukhi Alphabet

Gurmukhi (ਗੁਰਮੁਖੀ) is the script used to write Punjabi. The name means "from the mouth of the Guru."

## Key Facts
- **35 letters** in the alphabet
- Written **left to right**
- Each letter represents a **consonant** with an inherent 'a' vowel
- Vowel sounds are shown using **diacritical marks**

## The First Three Letters

These three letters are special - they are "vowel carriers" used to write standalone vowel sounds:

| Letter | Name | Purpose |
|--------|------|---------|
| ੳ | Ura | Carries 'u' vowels |
| ਅ | Aira | Carries 'a' vowels |
| ੲ | Eeri | Carries 'i' and 'e' vowels |

## Practice
Try tracing these letters with your finger. Notice how each has a distinct shape!
                `,
                quiz: [
                    {
                        question: 'What is the name of the Punjabi script?',
                        options: ['Be happy', 'Do not worry', 'I am tired', 'Come here'],
                        correctIndex: 1
                    }
                ]
            }
        ]
    }
];

// Helper to get all lessons
export const getAllLessons = (): Lesson[] => {
    return modules.flatMap(m => m.lessons);
};

// Helper to get lesson by ID
export const getLessonById = (id: string): Lesson | undefined => {
    return getAllLessons().find(l => l.id === id);
};

// Helper to get module by ID
export const getModuleById = (id: string): Module | undefined => {
    return modules.find(m => m.id === id);
};
