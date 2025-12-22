// Free Punjabi Lessons - Content Data
// Module 1: Getting Started

export interface VocabularyWord {
    gurmukhi: string;
    transliteration: string;
    english: string;
    audio?: string; // Optional audio file path
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
                icon: '🔤',
                duration: '15 min',
                vocabulary: [
                    { gurmukhi: 'ੳ', transliteration: 'Ura', english: 'First letter (vowel carrier)' },
                    { gurmukhi: 'ਅ', transliteration: 'Aira', english: 'Second letter (vowel carrier)' },
                    { gurmukhi: 'ੲ', transliteration: 'Eeri', english: 'Third letter (vowel carrier)' },
                    { gurmukhi: 'ਸ', transliteration: 'Sussa', english: 'S sound' },
                    { gurmukhi: 'ਹ', transliteration: 'Haaha', english: 'H sound' },
                    { gurmukhi: 'ਕ', transliteration: 'Kakka', english: 'K sound' },
                    { gurmukhi: 'ਖ', transliteration: 'Khakha', english: 'Kh sound' },
                    { gurmukhi: 'ਗ', transliteration: 'Gagga', english: 'G sound' },
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
                        options: ['Devanagari', 'Gurmukhi', 'Arabic', 'Tamil'],
                        correctIndex: 1
                    },
                    {
                        question: 'How many letters are in the Gurmukhi alphabet?',
                        options: ['26', '35', '42', '28'],
                        correctIndex: 1
                    },
                    {
                        question: 'Which direction is Punjabi written?',
                        options: ['Right to left', 'Top to bottom', 'Left to right', 'Bottom to top'],
                        correctIndex: 2
                    },
                    {
                        question: 'What does "Gurmukhi" mean?',
                        options: ['Holy script', 'From the mouth of the Guru', 'Ancient writing', 'Sacred letters'],
                        correctIndex: 1
                    },
                    {
                        question: 'Which letter is "ਸ"?',
                        options: ['Haaha', 'Kakka', 'Sussa', 'Gagga'],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: 'basic-greetings',
                moduleId: 'getting-started',
                title: 'Common Greetings',
                description: 'Say hello and goodbye in Punjabi',
                icon: '👋',
                duration: '10 min',
                vocabulary: [
                    { gurmukhi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', transliteration: 'Sat Sri Akal', english: 'Hello (formal greeting)' },
                    { gurmukhi: 'ਕਿਦਾਂ?', transliteration: 'Kidaan?', english: 'How are you? (informal)' },
                    { gurmukhi: 'ਠੀਕ ਹਾਂ', transliteration: 'Theek haan', english: 'I am fine' },
                    { gurmukhi: 'ਧੰਨਵਾਦ', transliteration: 'Dhannvaad', english: 'Thank you' },
                    { gurmukhi: 'ਜੀ ਆਇਆਂ ਨੂੰ', transliteration: 'Ji aayaan nu', english: 'Welcome' },
                    { gurmukhi: 'ਅਲਵਿਦਾ', transliteration: 'Alvida', english: 'Goodbye' },
                    { gurmukhi: 'ਫਿਰ ਮਿਲਾਂਗੇ', transliteration: 'Phir milaange', english: 'See you again' },
                ],
                content: `
# Common Greetings in Punjabi

Greetings are an important part of Punjabi culture. Let's learn the most common ones!

## The Most Important Greeting

**ਸਤ ਸ੍ਰੀ ਅਕਾਲ** (Sat Sri Akal)

This is the traditional Sikh greeting meaning "God is the ultimate truth." It's used by Punjabis of all backgrounds and is appropriate in any situation.

## Casual Greetings

When meeting friends, you can use:
- **ਕਿਦਾਂ?** (Kidaan?) - "How's it going?"
- **ਕੀ ਹਾਲ ਹੈ?** (Ki haal hai?) - "How are you?"

## Responding

- **ਠੀਕ ਹਾਂ** (Theek haan) - "I'm fine"
- **ਬਹੁਤ ਵਧੀਆ** (Bahut vadhiya) - "Very good"

## Saying Thank You

**ਧੰਨਵਾਦ** (Dhannvaad) means "Thank you" and is always appreciated!
                `,
                quiz: [
                    {
                        question: 'What does "Sat Sri Akal" mean?',
                        options: ['Good morning', 'God is the ultimate truth', 'How are you', 'Goodbye'],
                        correctIndex: 1
                    },
                    {
                        question: 'How do you say "Thank you" in Punjabi?',
                        options: ['Kidaan', 'Alvida', 'Dhannvaad', 'Theek haan'],
                        correctIndex: 2
                    },
                    {
                        question: 'What is "Kidaan?" in English?',
                        options: ['Goodbye', 'How are you?', 'Welcome', 'Thank you'],
                        correctIndex: 1
                    },
                    {
                        question: 'How do you say "I am fine"?',
                        options: ['Sat Sri Akal', 'Theek haan', 'Dhannvaad', 'Kidaan'],
                        correctIndex: 1
                    },
                    {
                        question: 'What does "Phir milaange" mean?',
                        options: ['Hello', 'Thank you', 'See you again', 'Welcome'],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: 'numbers-1-10',
                moduleId: 'getting-started',
                title: 'Numbers 1-10',
                description: 'Count from one to ten in Punjabi',
                icon: '🔢',
                duration: '10 min',
                vocabulary: [
                    { gurmukhi: '੧ - ਇੱਕ', transliteration: 'Ikk', english: 'One (1)' },
                    { gurmukhi: '੨ - ਦੋ', transliteration: 'Do', english: 'Two (2)' },
                    { gurmukhi: '੩ - ਤਿੰਨ', transliteration: 'Tinn', english: 'Three (3)' },
                    { gurmukhi: '੪ - ਚਾਰ', transliteration: 'Chaar', english: 'Four (4)' },
                    { gurmukhi: '੫ - ਪੰਜ', transliteration: 'Panj', english: 'Five (5)' },
                    { gurmukhi: '੬ - ਛੇ', transliteration: 'Chhe', english: 'Six (6)' },
                    { gurmukhi: '੭ - ਸੱਤ', transliteration: 'Satt', english: 'Seven (7)' },
                    { gurmukhi: '੮ - ਅੱਠ', transliteration: 'Atth', english: 'Eight (8)' },
                    { gurmukhi: '੯ - ਨੌਂ', transliteration: 'Naunh', english: 'Nine (9)' },
                    { gurmukhi: '੧੦ - ਦਸ', transliteration: 'Das', english: 'Ten (10)' },
                ],
                content: `
# Numbers 1-10 in Punjabi

Learning numbers is essential! Punjabi has its own numerals, but we'll also learn the words.

## The Numbers

| Numeral | Word | Transliteration | English |
|---------|------|-----------------|---------|
| ੧ | ਇੱਕ | Ikk | One |
| ੨ | ਦੋ | Do | Two |
| ੩ | ਤਿੰਨ | Tinn | Three |
| ੪ | ਚਾਰ | Chaar | Four |
| ੫ | ਪੰਜ | Panj | Five |
| ੬ | ਛੇ | Chhe | Six |
| ੭ | ਸੱਤ | Satt | Seven |
| ੮ | ਅੱਠ | Atth | Eight |
| ੯ | ਨੌਂ | Naunh | Nine |
| ੧੦ | ਦਸ | Das | Ten |

## Fun Fact
The word **ਪੰਜ** (Panj) means "five" - and this is where "Punjab" gets its name! Punjab means "Land of Five Rivers."

## Practice
Try counting objects around you in Punjabi!
                `,
                quiz: [
                    {
                        question: 'How do you say "five" in Punjabi?',
                        options: ['Chaar', 'Panj', 'Chhe', 'Satt'],
                        correctIndex: 1
                    },
                    {
                        question: 'What number is "ਤਿੰਨ" (Tinn)?',
                        options: ['Two', 'Three', 'Four', 'Five'],
                        correctIndex: 1
                    },
                    {
                        question: 'What does "Das" mean?',
                        options: ['Eight', 'Nine', 'Ten', 'Seven'],
                        correctIndex: 2
                    },
                    {
                        question: 'Punjab means "Land of ___ Rivers"',
                        options: ['Three', 'Four', 'Five', 'Seven'],
                        correctIndex: 2
                    },
                    {
                        question: 'What is "ਅੱਠ" (Atth) in English?',
                        options: ['Six', 'Seven', 'Eight', 'Nine'],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: 'family-words',
                moduleId: 'getting-started',
                title: 'Family Words',
                description: 'Learn words for family members',
                icon: '👨‍👩‍👧‍👦',
                duration: '10 min',
                vocabulary: [
                    { gurmukhi: 'ਮਾਂ', transliteration: 'Maan', english: 'Mother' },
                    { gurmukhi: 'ਪਿਤਾ / ਬਾਪੂ', transliteration: 'Pita / Baapu', english: 'Father' },
                    { gurmukhi: 'ਭਰਾ', transliteration: 'Bhra', english: 'Brother' },
                    { gurmukhi: 'ਭੈਣ', transliteration: 'Bhain', english: 'Sister' },
                    { gurmukhi: 'ਦਾਦਾ', transliteration: 'Daada', english: 'Grandfather (paternal)' },
                    { gurmukhi: 'ਦਾਦੀ', transliteration: 'Daadi', english: 'Grandmother (paternal)' },
                    { gurmukhi: 'ਨਾਨਾ', transliteration: 'Naana', english: 'Grandfather (maternal)' },
                    { gurmukhi: 'ਨਾਨੀ', transliteration: 'Naani', english: 'Grandmother (maternal)' },
                    { gurmukhi: 'ਪੁੱਤਰ', transliteration: 'Puttar', english: 'Son' },
                    { gurmukhi: 'ਧੀ', transliteration: 'Dhee', english: 'Daughter' },
                ],
                content: `
# Family Words in Punjabi

Family is central to Punjabi culture. Let's learn how to talk about family members!

## Immediate Family

| Punjabi | Transliteration | English |
|---------|-----------------|---------|
| ਮਾਂ | Maan | Mother |
| ਪਿਤਾ / ਬਾਪੂ | Pita / Baapu | Father |
| ਭਰਾ | Bhra | Brother |
| ਭੈਣ | Bhain | Sister |

## Grandparents

Punjabi has different words for grandparents depending on which side of the family:

**Father's side (Paternal):**
- ਦਾਦਾ (Daada) - Grandfather
- ਦਾਦੀ (Daadi) - Grandmother

**Mother's side (Maternal):**
- ਨਾਨਾ (Naana) - Grandfather
- ਨਾਨੀ (Naani) - Grandmother

## Children

- ਪੁੱਤਰ (Puttar) - Son
- ਧੀ (Dhee) - Daughter

## Cultural Note
In Punjabi families, it's common to use respectful terms even for siblings. Older siblings are often called "Veer ji" (brother) or "Bhain ji" (sister) with the honorific "ji."
                `,
                quiz: [
                    {
                        question: 'How do you say "mother" in Punjabi?',
                        options: ['Bhain', 'Maan', 'Daadi', 'Dhee'],
                        correctIndex: 1
                    },
                    {
                        question: 'What is "Daada"?',
                        options: ['Father', 'Maternal grandfather', 'Paternal grandfather', 'Uncle'],
                        correctIndex: 2
                    },
                    {
                        question: 'How do you say "sister"?',
                        options: ['Bhain', 'Bhra', 'Dhee', 'Maan'],
                        correctIndex: 0
                    },
                    {
                        question: 'What is "Naani"?',
                        options: ['Paternal grandmother', 'Maternal grandmother', 'Aunt', 'Mother'],
                        correctIndex: 1
                    },
                    {
                        question: '"Puttar" means:',
                        options: ['Daughter', 'Brother', 'Son', 'Father'],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: 'basic-vowels',
                moduleId: 'getting-started',
                title: 'Vowel Sounds',
                description: 'Learn Punjabi vowel marks (lagaan matra)',
                icon: '🗣️',
                duration: '12 min',
                vocabulary: [
                    { gurmukhi: 'ਾ', transliteration: 'aa (kanna)', english: 'Long "aa" sound' },
                    { gurmukhi: 'ਿ', transliteration: 'i (sihari)', english: 'Short "i" sound' },
                    { gurmukhi: 'ੀ', transliteration: 'ee (bihari)', english: 'Long "ee" sound' },
                    { gurmukhi: 'ੁ', transliteration: 'u (aunkar)', english: 'Short "u" sound' },
                    { gurmukhi: 'ੂ', transliteration: 'oo (dulainkar)', english: 'Long "oo" sound' },
                    { gurmukhi: 'ੇ', transliteration: 'e (lavan)', english: '"e" sound' },
                    { gurmukhi: 'ੈ', transliteration: 'ai (dulavan)', english: '"ai" sound' },
                    { gurmukhi: 'ੋ', transliteration: 'o (hora)', english: '"o" sound' },
                    { gurmukhi: 'ੌ', transliteration: 'au (kanauda)', english: '"au" sound' },
                ],
                content: `
# Vowel Sounds in Punjabi

In Gurmukhi, vowel sounds are shown using special marks called **lagaan matra** (ਲਗਾਂ ਮਾਤਰਾ).

## How It Works

Each consonant in Gurmukhi has a built-in short 'a' sound. To change the vowel, we add marks:

**Example with ਕ (ka):**
| With Mark | Sound |
|-----------|-------|
| ਕ | ka |
| ਕਾ | kaa |
| ਕਿ | ki |
| ਕੀ | kee |
| ਕੁ | ku |
| ਕੂ | koo |

## The Main Vowel Marks

| Mark | Name | Sound | Example |
|------|------|-------|---------|
| ਾ | Kanna | aa | ਮਾਂ (Maan - mother) |
| ਿ | Sihari | i | ਦਿਨ (Din - day) |
| ੀ | Bihari | ee | ਦੀ (Dee - of) |
| ੁ | Aunkar | u | ਪੁੱਤਰ (Puttar - son) |
| ੂ | Dulainkar | oo | ਧੂਪ (Dhoop - sunlight) |

## Practice
Try reading: ਕਾ, ਕੀ, ਕੂ, ਕੇ, ਕੋ
                `,
                quiz: [
                    {
                        question: 'What is the name for vowel marks in Punjabi?',
                        options: ['Gurmukhi', 'Lagaan matra', 'Painti', 'Bindi'],
                        correctIndex: 1
                    },
                    {
                        question: 'Which mark is "kanna" (ਾ)?',
                        options: ['Short i sound', 'Long aa sound', 'Short u sound', 'Long ee sound'],
                        correctIndex: 1
                    },
                    {
                        question: 'What sound does ਕੀ make?',
                        options: ['ka', 'ki', 'kee', 'ku'],
                        correctIndex: 2
                    },
                    {
                        question: 'Each consonant has a built-in _____ sound.',
                        options: ['long aa', 'short a', 'short i', 'long ee'],
                        correctIndex: 1
                    },
                    {
                        question: 'Which mark makes the "oo" sound?',
                        options: ['Sihari', 'Bihari', 'Aunkar', 'Dulainkar'],
                        correctIndex: 3
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
