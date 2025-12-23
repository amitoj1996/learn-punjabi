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
                xpReward: 10,
                difficulty: 'beginner',
                unlockRequirements: ['gurmukhi-alphabet'],
                vocabulary: [
                    { gurmukhi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', transliteration: 'Sat Shri Akal', english: 'Hello (formal greeting)' },
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

**ਸਤ ਸ੍ਰੀ ਅਕਾਲ** (Sat Shri Akal)

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
                        question: 'What does "Sat Shri Akal" mean?',
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
                        options: ['Sat Shri Akal', 'Theek haan', 'Dhannvaad', 'Kidaan'],
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
                xpReward: 15,
                difficulty: 'beginner',
                unlockRequirements: ['basic-greetings'],
                vocabulary: [
                    { gurmukhi: '੧ - ਇੱਕ', transliteration: 'Ikk', english: 'One (1)', pronunciation: 'ਇੱਕ' },
                    { gurmukhi: '੨ - ਦੋ', transliteration: 'Do', english: 'Two (2)', pronunciation: 'ਦੋ' },
                    { gurmukhi: '੩ - ਤਿੰਨ', transliteration: 'Tinn', english: 'Three (3)', pronunciation: 'ਤਿੰਨ' },
                    { gurmukhi: '੪ - ਚਾਰ', transliteration: 'Chaar', english: 'Four (4)', pronunciation: 'ਚਾਰ' },
                    { gurmukhi: '੫ - ਪੰਜ', transliteration: 'Panj', english: 'Five (5)', pronunciation: 'ਪੰਜ' },
                    { gurmukhi: '੬ - ਛੇ', transliteration: 'Chhe', english: 'Six (6)', pronunciation: 'ਛੇ' },
                    { gurmukhi: '੭ - ਸੱਤ', transliteration: 'Satt', english: 'Seven (7)', pronunciation: 'ਸੱਤ' },
                    { gurmukhi: '੮ - ਅੱਠ', transliteration: 'Atth', english: 'Eight (8)', pronunciation: 'ਅੱਠ' },
                    { gurmukhi: '੯ - ਨੌਂ', transliteration: 'Naunh', english: 'Nine (9)', pronunciation: 'ਨੌਂ' },
                    { gurmukhi: '੧੦ - ਦਸ', transliteration: 'Das', english: 'Ten (10)', pronunciation: 'ਦਸ' },
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
                xpReward: 12,
                difficulty: 'beginner',
                unlockRequirements: ['numbers-1-10'],
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
                xpReward: 20,
                difficulty: 'intermediate',
                unlockRequirements: ['family-words'],
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
    },
    {
        id: 'daily-essentials',
        title: 'Daily Essentials',
        description: 'Everyday vocabulary for food, colors, time, and more',
        icon: '☀️',
        lessons: [
            {
                id: 'food-drink',
                moduleId: 'daily-essentials',
                title: 'Food & Drinks',
                description: 'Learn common food and beverage words',
                icon: '🍽️',
                duration: '12 min',
                xpReward: 20,
                difficulty: 'beginner',
                unlockRequirements: [],
                vocabulary: [
                    { gurmukhi: 'ਰੋਟੀ', transliteration: 'Roti', english: 'Bread/Chapati', pronunciation: 'ਰੋਟੀ' },
                    { gurmukhi: 'ਪਾਣੀ', transliteration: 'Paani', english: 'Water', pronunciation: 'ਪਾਣੀ' },
                    { gurmukhi: 'ਚਾਹ', transliteration: 'Chaa', english: 'Tea', pronunciation: 'ਚਾਹ' },
                    { gurmukhi: 'ਦੁੱਧ', transliteration: 'Duddh', english: 'Milk', pronunciation: 'ਦੁੱਧ' },
                    { gurmukhi: 'ਸਬਜ਼ੀ', transliteration: 'Sabzi', english: 'Vegetables', pronunciation: 'ਸਬਜ਼ੀ' },
                    { gurmukhi: 'ਫਲ', transliteration: 'Phal', english: 'Fruit', pronunciation: 'ਫਲ' },
                    { gurmukhi: 'ਚਾਵਲ', transliteration: 'Chaaval', english: 'Rice', pronunciation: 'ਚਾਵਲ' },
                    { gurmukhi: 'ਦਾਲ', transliteration: 'Daal', english: 'Lentils', pronunciation: 'ਦਾਲ' },
                ],
                content: `
# Food & Drinks in Punjabi

Punjab is known for its rich cuisine! Let's learn common food and drink words.

## Essential Words

| Punjabi | Pronunciation | Meaning |
|---------|---------------|---------|
| ਰੋਟੀ | Roti | Bread/Chapati |
| ਪਾਣੀ | Paani | Water |
| ਚਾਹ | Chaa | Tea |
| ਦੁੱਧ | Duddh | Milk |

## At a Restaurant

Useful phrases:
- **ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ** (Mainu bhukh laggi hai) - I'm hungry
- **ਮੈਨੂੰ ਪਿਆਸ ਲੱਗੀ ਹੈ** (Mainu pyaas laggi hai) - I'm thirsty

## Punjabi Specialties

Punjab is famous for:
- **ਮੱਕੀ ਦੀ ਰੋਟੀ** - Corn bread
- **ਸਰ੍ਹੋਂ ਦਾ ਸਾਗ** - Mustard greens
- **ਲੱਸੀ** - Yogurt drink
                `,
                quiz: [
                    {
                        question: 'What is "Paani" in English?',
                        options: ['Milk', 'Tea', 'Water', 'Bread'],
                        correctIndex: 2
                    },
                    {
                        question: 'How do you say "Tea" in Punjabi?',
                        options: ['ਚਾਵਲ', 'ਚਾਹ', 'ਦੁੱਧ', 'ਦਾਲ'],
                        correctIndex: 1
                    },
                    {
                        question: 'What does "ਰੋਟੀ" mean?',
                        options: ['Rice', 'Vegetables', 'Bread', 'Fruit'],
                        correctIndex: 2
                    },
                    {
                        question: 'Which drink is Punjab famous for?',
                        options: ['Coffee', 'Lassi', 'Soda', 'Juice'],
                        correctIndex: 1
                    },
                    {
                        question: 'What is "Sabzi"?',
                        options: ['Meat', 'Fruit', 'Vegetables', 'Spices'],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: 'colors',
                moduleId: 'daily-essentials',
                title: 'Colors',
                description: 'Learn the basic colors in Punjabi',
                icon: '🌈',
                duration: '10 min',
                xpReward: 15,
                difficulty: 'beginner',
                unlockRequirements: ['food-drink'],
                vocabulary: [
                    { gurmukhi: 'ਲਾਲ', transliteration: 'Laal', english: 'Red', pronunciation: 'ਲਾਲ', color: '#EF4444' },
                    { gurmukhi: 'ਨੀਲਾ', transliteration: 'Neela', english: 'Blue', pronunciation: 'ਨੀਲਾ', color: '#3B82F6' },
                    { gurmukhi: 'ਹਰਾ', transliteration: 'Hara', english: 'Green', pronunciation: 'ਹਰਾ', color: '#22C55E' },
                    { gurmukhi: 'ਪੀਲਾ', transliteration: 'Peela', english: 'Yellow', pronunciation: 'ਪੀਲਾ', color: '#EAB308' },
                    { gurmukhi: 'ਚਿੱਟਾ', transliteration: 'Chitta', english: 'White', pronunciation: 'ਚਿੱਟਾ', color: '#F8FAFC' },
                    { gurmukhi: 'ਕਾਲਾ', transliteration: 'Kaala', english: 'Black', pronunciation: 'ਕਾਲਾ', color: '#1F2937' },
                    { gurmukhi: 'ਸੰਤਰੀ', transliteration: 'Santri', english: 'Orange', pronunciation: 'ਸੰਤਰੀ', color: '#F97316' },
                    { gurmukhi: 'ਗੁਲਾਬੀ', transliteration: 'Gulaabi', english: 'Pink', pronunciation: 'ਗੁਲਾਬੀ', color: '#EC4899' },
                ],
                content: `
# Colors in Punjabi

Colors add beauty to our world! Let's learn how to say them in Punjabi.

## Primary Colors

| Punjabi | Pronunciation | Color |
|---------|---------------|-------|
| ਲਾਲ | Laal | Red |
| ਨੀਲਾ | Neela | Blue |
| ਪੀਲਾ | Peela | Yellow |
| ਹਰਾ | Hara | Green |

## More Colors

- **ਚਿੱਟਾ** (Chitta) - White
- **ਕਾਲਾ** (Kaala) - Black
- **ਸੰਤਰੀ** (Santri) - Orange
- **ਗੁਲਾਬੀ** (Gulaabi) - Pink

## Using Colors

To describe something's color:
- **ਲਾਲ ਫੁੱਲ** - Red flower
- **ਨੀਲਾ ਅਸਮਾਨ** - Blue sky
- **ਹਰਾ ਘਾਹ** - Green grass
                `,
                quiz: [
                    {
                        question: 'What color is "Laal"?',
                        options: ['Blue', 'Yellow', 'Red', 'Green'],
                        correctIndex: 2
                    },
                    {
                        question: 'How do you say "Green" in Punjabi?',
                        options: ['ਨੀਲਾ', 'ਪੀਲਾ', 'ਲਾਲ', 'ਹਰਾ'],
                        correctIndex: 3
                    },
                    {
                        question: 'What does "ਕਾਲਾ" mean?',
                        options: ['White', 'Black', 'Brown', 'Grey'],
                        correctIndex: 1
                    },
                    {
                        question: '"Neela" refers to which color?',
                        options: ['Red', 'Blue', 'Yellow', 'Pink'],
                        correctIndex: 1
                    },
                    {
                        question: 'How do you say "Pink" in Punjabi?',
                        options: ['ਸੰਤਰੀ', 'ਗੁਲਾਬੀ', 'ਚਿੱਟਾ', 'ਪੀਲਾ'],
                        correctIndex: 1
                    }
                ]
            },
            {
                id: 'days-week',
                moduleId: 'daily-essentials',
                title: 'Days of the Week',
                description: 'Learn the seven days in Punjabi',
                icon: '📅',
                duration: '10 min',
                xpReward: 15,
                difficulty: 'beginner',
                unlockRequirements: ['colors'],
                vocabulary: [
                    { gurmukhi: 'ਸੋਮਵਾਰ', transliteration: 'Somvaar', english: 'Monday', pronunciation: 'ਸੋਮਵਾਰ' },
                    { gurmukhi: 'ਮੰਗਲਵਾਰ', transliteration: 'Mangalvaar', english: 'Tuesday', pronunciation: 'ਮੰਗਲਵਾਰ' },
                    { gurmukhi: 'ਬੁੱਧਵਾਰ', transliteration: 'Budhvaar', english: 'Wednesday', pronunciation: 'ਬੁੱਧਵਾਰ' },
                    { gurmukhi: 'ਵੀਰਵਾਰ', transliteration: 'Veervaar', english: 'Thursday', pronunciation: 'ਵੀਰਵਾਰ' },
                    { gurmukhi: 'ਸ਼ੁੱਕਰਵਾਰ', transliteration: 'Shukarvaar', english: 'Friday', pronunciation: 'ਸ਼ੁੱਕਰਵਾਰ' },
                    { gurmukhi: 'ਸ਼ਨਿੱਚਰਵਾਰ', transliteration: 'Shanicharvaar', english: 'Saturday', pronunciation: 'ਸ਼ਨਿੱਚਰਵਾਰ' },
                    { gurmukhi: 'ਐਤਵਾਰ', transliteration: 'Aitvaar', english: 'Sunday', pronunciation: 'ਐਤਵਾਰ' },
                ],
                content: `
# Days of the Week

Learn how to talk about days in Punjabi!

## The Seven Days

| Punjabi | Pronunciation | English |
|---------|---------------|---------|
| ਸੋਮਵਾਰ | Somvaar | Monday |
| ਮੰਗਲਵਾਰ | Mangalvaar | Tuesday |
| ਬੁੱਧਵਾਰ | Budhvaar | Wednesday |
| ਵੀਰਵਾਰ | Veervaar | Thursday |
| ਸ਼ੁੱਕਰਵਾਰ | Shukarvaar | Friday |
| ਸ਼ਨਿੱਚਰਵਾਰ | Shanicharvaar | Saturday |
| ਐਤਵਾਰ | Aitvaar | Sunday |

## Time Expressions

- **ਅੱਜ** (Ajj) - Today
- **ਕੱਲ੍ਹ** (Kal) - Tomorrow / Yesterday
- **ਹਫ਼ਤਾ** (Hafta) - Week
                `,
                quiz: [
                    {
                        question: 'What day is "Somvaar"?',
                        options: ['Sunday', 'Monday', 'Saturday', 'Friday'],
                        correctIndex: 1
                    },
                    {
                        question: 'How do you say "Friday" in Punjabi?',
                        options: ['ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਐਤਵਾਰ', 'ਸੋਮਵਾਰ'],
                        correctIndex: 1
                    },
                    {
                        question: 'What day is "Aitvaar"?',
                        options: ['Monday', 'Wednesday', 'Sunday', 'Thursday'],
                        correctIndex: 2
                    },
                    {
                        question: 'What does "ਅੱਜ" mean?',
                        options: ['Tomorrow', 'Yesterday', 'Week', 'Today'],
                        correctIndex: 3
                    },
                    {
                        question: 'Which day comes after Mangalvaar?',
                        options: ['Somvaar', 'Veervaar', 'Budhvaar', 'Shukarvaar'],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: 'body-parts',
                moduleId: 'daily-essentials',
                title: 'Body Parts',
                description: 'Learn the parts of the body in Punjabi',
                icon: '🙋',
                duration: '12 min',
                xpReward: 18,
                difficulty: 'beginner',
                unlockRequirements: ['days-week'],
                vocabulary: [
                    { gurmukhi: 'ਸਿਰ', transliteration: 'Sir', english: 'Head', pronunciation: 'ਸਿਰ' },
                    { gurmukhi: 'ਅੱਖਾਂ', transliteration: 'Akkhaan', english: 'Eyes', pronunciation: 'ਅੱਖਾਂ' },
                    { gurmukhi: 'ਕੰਨ', transliteration: 'Kann', english: 'Ears', pronunciation: 'ਕੰਨ' },
                    { gurmukhi: 'ਨੱਕ', transliteration: 'Nakk', english: 'Nose', pronunciation: 'ਨੱਕ' },
                    { gurmukhi: 'ਮੂੰਹ', transliteration: 'Munh', english: 'Mouth', pronunciation: 'ਮੂੰਹ' },
                    { gurmukhi: 'ਹੱਥ', transliteration: 'Hatth', english: 'Hand', pronunciation: 'ਹੱਥ' },
                    { gurmukhi: 'ਪੈਰ', transliteration: 'Pair', english: 'Foot/Leg', pronunciation: 'ਪੈਰ' },
                    { gurmukhi: 'ਦਿਲ', transliteration: 'Dil', english: 'Heart', pronunciation: 'ਦਿਲ' },
                ],
                content: `
# Body Parts in Punjabi

Let's learn the names of body parts - useful for health and everyday conversation!

## Head & Face

| Punjabi | Pronunciation | English |
|---------|---------------|---------|
| ਸਿਰ | Sir | Head |
| ਅੱਖਾਂ | Akkhaan | Eyes |
| ਕੰਨ | Kann | Ears |
| ਨੱਕ | Nakk | Nose |
| ਮੂੰਹ | Munh | Mouth |

## Body

- **ਹੱਥ** (Hatth) - Hand
- **ਪੈਰ** (Pair) - Foot/Leg
- **ਦਿਲ** (Dil) - Heart

## Health Phrases

- **ਮੇਰਾ ਸਿਰ ਦੁਖਦਾ ਹੈ** - My head hurts
- **ਮੈਂ ਠੀਕ ਹਾਂ** - I am fine
                `,
                quiz: [
                    {
                        question: 'What is "Sir" in English?',
                        options: ['Hand', 'Foot', 'Head', 'Heart'],
                        correctIndex: 2
                    },
                    {
                        question: 'How do you say "Eyes" in Punjabi?',
                        options: ['ਕੰਨ', 'ਨੱਕ', 'ਅੱਖਾਂ', 'ਮੂੰਹ'],
                        correctIndex: 2
                    },
                    {
                        question: 'What does "ਦਿਲ" mean?',
                        options: ['Head', 'Heart', 'Hand', 'Foot'],
                        correctIndex: 1
                    },
                    {
                        question: '"Hatth" refers to which body part?',
                        options: ['Foot', 'Head', 'Hand', 'Ear'],
                        correctIndex: 2
                    },
                    {
                        question: 'How do you say "Nose" in Punjabi?',
                        options: ['ਕੰਨ', 'ਨੱਕ', 'ਮੂੰਹ', 'ਸਿਰ'],
                        correctIndex: 1
                    }
                ]
            },
            {
                id: 'common-verbs',
                moduleId: 'daily-essentials',
                title: 'Common Verbs',
                description: 'Essential action words for daily life',
                icon: '🏃',
                duration: '15 min',
                xpReward: 25,
                difficulty: 'intermediate',
                unlockRequirements: ['body-parts'],
                vocabulary: [
                    { gurmukhi: 'ਖਾਣਾ', transliteration: 'Khaana', english: 'To eat', pronunciation: 'ਖਾਣਾ' },
                    { gurmukhi: 'ਪੀਣਾ', transliteration: 'Peena', english: 'To drink', pronunciation: 'ਪੀਣਾ' },
                    { gurmukhi: 'ਸੌਣਾ', transliteration: 'Sauna', english: 'To sleep', pronunciation: 'ਸੌਣਾ' },
                    { gurmukhi: 'ਜਾਣਾ', transliteration: 'Jaana', english: 'To go', pronunciation: 'ਜਾਣਾ' },
                    { gurmukhi: 'ਆਉਣਾ', transliteration: 'Aauna', english: 'To come', pronunciation: 'ਆਉਣਾ' },
                    { gurmukhi: 'ਬੋਲਣਾ', transliteration: 'Bolna', english: 'To speak', pronunciation: 'ਬੋਲਣਾ' },
                    { gurmukhi: 'ਸੁਣਨਾ', transliteration: 'Sunna', english: 'To listen', pronunciation: 'ਸੁਣਨਾ' },
                    { gurmukhi: 'ਦੇਖਣਾ', transliteration: 'Dekhna', english: 'To see/watch', pronunciation: 'ਦੇਖਣਾ' },
                ],
                content: `
# Common Verbs in Punjabi

Verbs are action words - they're essential for making sentences!

## Basic Actions

| Punjabi | Pronunciation | Meaning |
|---------|---------------|---------|
| ਖਾਣਾ | Khaana | To eat |
| ਪੀਣਾ | Peena | To drink |
| ਸੌਣਾ | Sauna | To sleep |
| ਜਾਣਾ | Jaana | To go |
| ਆਉਣਾ | Aauna | To come |

## Communication Verbs

- **ਬੋਲਣਾ** (Bolna) - To speak
- **ਸੁਣਨਾ** (Sunna) - To listen
- **ਦੇਖਣਾ** (Dekhna) - To see/watch

## Example Sentences

- **ਮੈਂ ਖਾਣਾ ਖਾਂਦਾ ਹਾਂ** - I eat food (male)
- **ਮੈਂ ਖਾਣਾ ਖਾਂਦੀ ਹਾਂ** - I eat food (female)
- **ਤੁਸੀਂ ਕਿੱਥੇ ਜਾਂਦੇ ਹੋ?** - Where do you go?
                `,
                quiz: [
                    {
                        question: 'What does "Khaana" mean?',
                        options: ['To drink', 'To eat', 'To sleep', 'To go'],
                        correctIndex: 1
                    },
                    {
                        question: 'How do you say "To go" in Punjabi?',
                        options: ['ਆਉਣਾ', 'ਜਾਣਾ', 'ਖਾਣਾ', 'ਸੌਣਾ'],
                        correctIndex: 1
                    },
                    {
                        question: 'What is "Bolna"?',
                        options: ['To listen', 'To see', 'To speak', 'To come'],
                        correctIndex: 2
                    },
                    {
                        question: '"ਸੌਣਾ" means:',
                        options: ['To eat', 'To drink', 'To go', 'To sleep'],
                        correctIndex: 3
                    },
                    {
                        question: 'How do you say "To listen" in Punjabi?',
                        options: ['ਦੇਖਣਾ', 'ਬੋਲਣਾ', 'ਸੁਣਨਾ', 'ਆਉਣਾ'],
                        correctIndex: 2
                    }
                ]
            }
        ]
    },
    {
        id: 'building-sentences',
        title: 'Building Sentences',
        description: 'Learn grammar and start making your own sentences',
        icon: '📝',
        lessons: [
            {
                id: 'pronouns',
                moduleId: 'building-sentences',
                title: 'Personal Pronouns',
                description: 'I, you, he, she, we, they in Punjabi',
                icon: '👤',
                duration: '12 min',
                xpReward: 20,
                difficulty: 'beginner',
                unlockRequirements: [],
                vocabulary: [
                    { gurmukhi: 'ਮੈਂ', transliteration: 'Main', english: 'I', pronunciation: 'ਮੈਂ' },
                    { gurmukhi: 'ਤੂੰ', transliteration: 'Toon', english: 'You (informal)', pronunciation: 'ਤੂੰ' },
                    { gurmukhi: 'ਤੁਸੀਂ', transliteration: 'Tuseen', english: 'You (formal/plural)', pronunciation: 'ਤੁਸੀਂ' },
                    { gurmukhi: 'ਉਹ', transliteration: 'Oh', english: 'He/She/That', pronunciation: 'ਉਹ' },
                    { gurmukhi: 'ਅਸੀਂ', transliteration: 'Aseen', english: 'We', pronunciation: 'ਅਸੀਂ' },
                    { gurmukhi: 'ਇਹ', transliteration: 'Eh', english: 'This', pronunciation: 'ਇਹ' },
                ],
                content: `
# Personal Pronouns in Punjabi

Pronouns replace nouns in sentences. Punjabi has formal and informal forms!

## Basic Pronouns

| Punjabi | Pronunciation | English |
|---------|---------------|---------|
| ਮੈਂ | Main | I |
| ਤੂੰ | Toon | You (informal) |
| ਤੁਸੀਂ | Tuseen | You (formal) |
| ਉਹ | Oh | He/She/That |
| ਅਸੀਂ | Aseen | We |

## Formal vs Informal

Use **ਤੂੰ** (Toon) with close friends and younger people.
Use **ਤੁਸੀਂ** (Tuseen) with elders and in formal situations.

## Example Sentences

- **ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ** - I am learning Punjabi
- **ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?** - How are you? (formal)
                `,
                quiz: [
                    {
                        question: 'How do you say "I" in Punjabi?',
                        options: ['ਤੂੰ', 'ਮੈਂ', 'ਉਹ', 'ਅਸੀਂ'],
                        correctIndex: 1
                    },
                    {
                        question: 'Which is the formal "You"?',
                        options: ['ਤੂੰ', 'ਮੈਂ', 'ਤੁਸੀਂ', 'ਉਹ'],
                        correctIndex: 2
                    },
                    {
                        question: 'What does "ਅਸੀਂ" mean?',
                        options: ['I', 'You', 'They', 'We'],
                        correctIndex: 3
                    }
                ]
            },
            {
                id: 'simple-sentences',
                moduleId: 'building-sentences',
                title: 'Simple Sentences',
                description: 'Build basic subject-verb sentences',
                icon: '💬',
                duration: '15 min',
                xpReward: 25,
                difficulty: 'intermediate',
                unlockRequirements: ['pronouns'],
                vocabulary: [
                    { gurmukhi: 'ਹੈ', transliteration: 'Hai', english: 'Is (singular)', pronunciation: 'ਹੈ' },
                    { gurmukhi: 'ਹਾਂ', transliteration: 'Haan', english: 'Am (for I)', pronunciation: 'ਹਾਂ' },
                    { gurmukhi: 'ਹੋ', transliteration: 'Ho', english: 'Are (for you)', pronunciation: 'ਹੋ' },
                    { gurmukhi: 'ਹਨ', transliteration: 'Han', english: 'Are (plural)', pronunciation: 'ਹਨ' },
                    { gurmukhi: 'ਚੰਗਾ', transliteration: 'Changa', english: 'Good (masc)', pronunciation: 'ਚੰਗਾ' },
                    { gurmukhi: 'ਚੰਗੀ', transliteration: 'Changi', english: 'Good (fem)', pronunciation: 'ਚੰਗੀ' },
                ],
                content: `
# Simple Sentences

Learn how to form basic sentences in Punjabi!

## Sentence Structure

Punjabi follows Subject-Object-Verb (SOV) order:
- English: I am good
- Punjabi: ਮੈਂ ਚੰਗਾ ਹਾਂ (I good am)

## The Verb "To Be"

| Pronoun | Verb | Example |
|---------|------|---------|
| ਮੈਂ | ਹਾਂ | ਮੈਂ ਚੰਗਾ ਹਾਂ (I am good) |
| ਤੂੰ | ਹੈਂ | ਤੂੰ ਚੰਗਾ ਹੈਂ |
| ਤੁਸੀਂ | ਹੋ | ਤੁਸੀਂ ਚੰਗੇ ਹੋ |
| ਉਹ | ਹੈ | ਉਹ ਚੰਗਾ ਹੈ |

## Gender in Adjectives

- **ਚੰਗਾ** (Changa) - Good (masculine)
- **ਚੰਗੀ** (Changi) - Good (feminine)
                `,
                quiz: [
                    {
                        question: 'What verb form goes with "ਮੈਂ"?',
                        options: ['ਹੈ', 'ਹਾਂ', 'ਹੋ', 'ਹਨ'],
                        correctIndex: 1
                    },
                    {
                        question: 'Punjabi sentence order is:',
                        options: ['Subject-Verb-Object', 'Subject-Object-Verb', 'Verb-Subject-Object', 'Object-Subject-Verb'],
                        correctIndex: 1
                    },
                    {
                        question: '"ਚੰਗੀ" is used for:',
                        options: ['Masculine', 'Feminine', 'Plural', 'Children'],
                        correctIndex: 1
                    }
                ]
            },
            {
                id: 'questions',
                moduleId: 'building-sentences',
                title: 'Asking Questions',
                description: 'Learn question words - what, where, who, why',
                icon: '❓',
                duration: '12 min',
                xpReward: 20,
                difficulty: 'intermediate',
                unlockRequirements: ['simple-sentences'],
                vocabulary: [
                    { gurmukhi: 'ਕੀ', transliteration: 'Ki', english: 'What', pronunciation: 'ਕੀ' },
                    { gurmukhi: 'ਕਿੱਥੇ', transliteration: 'Kitthe', english: 'Where', pronunciation: 'ਕਿੱਥੇ' },
                    { gurmukhi: 'ਕੌਣ', transliteration: 'Kaun', english: 'Who', pronunciation: 'ਕੌਣ' },
                    { gurmukhi: 'ਕਿਉਂ', transliteration: 'Kiyon', english: 'Why', pronunciation: 'ਕਿਉਂ' },
                    { gurmukhi: 'ਕਦੋਂ', transliteration: 'Kadon', english: 'When', pronunciation: 'ਕਦੋਂ' },
                    { gurmukhi: 'ਕਿਵੇਂ', transliteration: 'Kiven', english: 'How', pronunciation: 'ਕਿਵੇਂ' },
                ],
                content: `
# Question Words in Punjabi

Learn to ask questions like a native speaker!

## Question Words

| Punjabi | Pronunciation | English |
|---------|---------------|---------|
| ਕੀ | Ki | What |
| ਕਿੱਥੇ | Kitthe | Where |
| ਕੌਣ | Kaun | Who |
| ਕਿਉਂ | Kiyon | Why |
| ਕਦੋਂ | Kadon | When |
| ਕਿਵੇਂ | Kiven | How |

## Example Questions

- **ਤੁਹਾਡਾ ਨਾਂ ਕੀ ਹੈ?** - What is your name?
- **ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?** - Where do you live?
- **ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?** - How are you?
                `,
                quiz: [
                    {
                        question: 'How do you say "What" in Punjabi?',
                        options: ['ਕਿੱਥੇ', 'ਕੀ', 'ਕੌਣ', 'ਕਦੋਂ'],
                        correctIndex: 1
                    },
                    {
                        question: '"ਕਿੱਥੇ" means:',
                        options: ['What', 'When', 'Where', 'Why'],
                        correctIndex: 2
                    },
                    {
                        question: 'Which word means "Why"?',
                        options: ['ਕਿਵੇਂ', 'ਕਦੋਂ', 'ਕੌਣ', 'ਕਿਉਂ'],
                        correctIndex: 3
                    }
                ]
            },
            {
                id: 'family-words',
                moduleId: 'building-sentences',
                title: 'Family Words',
                description: 'Learn family relationship words',
                icon: '👨‍👩‍👧‍👦',
                duration: '12 min',
                xpReward: 18,
                difficulty: 'beginner',
                unlockRequirements: ['questions'],
                vocabulary: [
                    { gurmukhi: 'ਮਾਂ', transliteration: 'Maa', english: 'Mother', pronunciation: 'ਮਾਂ' },
                    { gurmukhi: 'ਪਿਓ', transliteration: 'Pio', english: 'Father', pronunciation: 'ਪਿਓ' },
                    { gurmukhi: 'ਭਰਾ', transliteration: 'Bhra', english: 'Brother', pronunciation: 'ਭਰਾ' },
                    { gurmukhi: 'ਭੈਣ', transliteration: 'Bhain', english: 'Sister', pronunciation: 'ਭੈਣ' },
                    { gurmukhi: 'ਦਾਦਾ', transliteration: 'Daada', english: 'Grandfather (paternal)', pronunciation: 'ਦਾਦਾ' },
                    { gurmukhi: 'ਦਾਦੀ', transliteration: 'Daadi', english: 'Grandmother (paternal)', pronunciation: 'ਦਾਦੀ' },
                    { gurmukhi: 'ਪੁੱਤਰ', transliteration: 'Puttar', english: 'Son', pronunciation: 'ਪੁੱਤਰ' },
                    { gurmukhi: 'ਧੀ', transliteration: 'Dhee', english: 'Daughter', pronunciation: 'ਧੀ' },
                ],
                content: `
# Family Words in Punjabi

Family is central to Punjabi culture! Learn these essential words.

## Immediate Family

| Punjabi | Pronunciation | Relation |
|---------|---------------|----------|
| ਮਾਂ | Maa | Mother |
| ਪਿਓ | Pio | Father |
| ਭਰਾ | Bhra | Brother |
| ਭੈਣ | Bhain | Sister |
| ਪੁੱਤਰ | Puttar | Son |
| ਧੀ | Dhee | Daughter |

## Grandparents

- **ਦਾਦਾ** (Daada) - Grandfather (father's side)
- **ਦਾਦੀ** (Daadi) - Grandmother (father's side)
- **ਨਾਨਾ** (Naana) - Grandfather (mother's side)
- **ਨਾਨੀ** (Naani) - Grandmother (mother's side)

## Talking About Family

- **ਮੇਰੀ ਮਾਂ** - My mother
- **ਮੇਰਾ ਪਿਓ** - My father
                `,
                quiz: [
                    {
                        question: 'How do you say "Mother" in Punjabi?',
                        options: ['ਭੈਣ', 'ਮਾਂ', 'ਦਾਦੀ', 'ਧੀ'],
                        correctIndex: 1
                    },
                    {
                        question: '"ਭਰਾ" means:',
                        options: ['Sister', 'Father', 'Brother', 'Son'],
                        correctIndex: 2
                    },
                    {
                        question: 'What is "Daada"?',
                        options: ['Father', 'Uncle', 'Grandfather', 'Brother'],
                        correctIndex: 2
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
