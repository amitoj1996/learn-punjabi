// Sikh History Section - Data and Content

export interface Guru {
    id: number;
    name: string;
    gurmukhiName: string;
    years: string;
    birthPlace: string;
    contribution: string;
    famousQuote: string;
    famousQuoteEnglish: string;
    keyEvents: string[];
    color: string; // accent color for card
}

export interface HistoricalEvent {
    id: string;
    year: number;
    title: string;
    description: string;
    category: 'guru' | 'battle' | 'milestone' | 'modern';
    guruId?: number;
}

export interface HistoricGurdwara {
    id: string;
    name: string;
    gurmukhiName: string;
    location: string;
    significance: string;
    associatedGuru?: number;
}

// The 10 Sikh Gurus
export const gurus: Guru[] = [
    {
        id: 1,
        name: 'Guru Nanak Dev Ji',
        gurmukhiName: 'ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
        years: '1469 - 1539',
        birthPlace: 'Talwandi (now Nankana Sahib, Pakistan)',
        contribution: 'Founder of Sikhism. Emphasized equality, honest living, and devotion to one God.',
        famousQuote: 'ਇਕੁ ਓਅੰਕਾਰ ਸਤਿ ਨਾਮੁ',
        famousQuoteEnglish: 'There is One God, His Name is True',
        keyEvents: ['Traveled extensively (Udasis) to spread message', 'Established Kartarpur community', 'Rejected caste system'],
        color: '#F59E0B' // Saffron
    },
    {
        id: 2,
        name: 'Guru Angad Dev Ji',
        gurmukhiName: 'ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ',
        years: '1504 - 1552',
        birthPlace: 'Harike, Punjab',
        contribution: 'Standardized Gurmukhi script. Started tradition of Mall Akhara (wrestling).',
        famousQuote: 'ਜੇ ਸਉ ਚੰਦਾ ਉਗਵਹਿ ਸੂਰਜ ਚੜਹਿ ਹਜਾਰ',
        famousQuoteEnglish: 'Even if a hundred moons and a thousand suns were to rise',
        keyEvents: ['Developed Gurmukhi script', 'Collected Guru Nanak\'s hymns', 'Promoted physical fitness'],
        color: '#10B981' // Emerald
    },
    {
        id: 3,
        name: 'Guru Amar Das Ji',
        gurmukhiName: 'ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ',
        years: '1479 - 1574',
        birthPlace: 'Basarke, Punjab',
        contribution: 'Established Langar (community kitchen) as institution. Fought against caste discrimination.',
        famousQuote: 'ਪਹਿਲਾ ਪੰਗਤ ਪਾਛੈ ਸੰਗਤ',
        famousQuoteEnglish: 'First the Pangat (Langar), then the Sangat',
        keyEvents: ['Built Baoli at Goindwal', 'Appointed Manji system', 'Advocated for women\'s rights'],
        color: '#3B82F6' // Blue
    },
    {
        id: 4,
        name: 'Guru Ram Das Ji',
        gurmukhiName: 'ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ',
        years: '1534 - 1581',
        birthPlace: 'Lahore, Pakistan',
        contribution: 'Founded the city of Amritsar. Composed Laavan (wedding hymns).',
        famousQuote: 'ਮੇਰਾ ਮਨੁ ਲੋਚੈ ਗੁਰ ਦਰਸਨ ਤਾਈ',
        famousQuoteEnglish: 'My mind longs for the Guru\'s Darshan',
        keyEvents: ['Founded Amritsar', 'Started construction of Sarovar', 'Composed Laavan for Anand Karaj'],
        color: '#8B5CF6' // Purple
    },
    {
        id: 5,
        name: 'Guru Arjan Dev Ji',
        gurmukhiName: 'ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ',
        years: '1563 - 1606',
        birthPlace: 'Goindwal, Punjab',
        contribution: 'Compiled Adi Granth. Completed Harmandir Sahib. First Sikh martyr.',
        famousQuote: 'ਤੇਰਾ ਭਾਣਾ ਮੀਠਾ ਲਾਗੈ',
        famousQuoteEnglish: 'Your Will seems sweet to me',
        keyEvents: ['Compiled Adi Granth', 'Completed Harmandir Sahib', 'Martyred on hot plate (first Sikh martyr)'],
        color: '#EF4444' // Red (martyrdom)
    },
    {
        id: 6,
        name: 'Guru Hargobind Sahib Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ',
        years: '1595 - 1644',
        birthPlace: 'Amritsar, Punjab',
        contribution: 'Introduced Miri-Piri (spiritual and temporal authority). Built Akal Takht.',
        famousQuote: 'ਮੀਰੀ ਪੀਰੀ',
        famousQuoteEnglish: 'Miri (temporal) and Piri (spiritual) - two swords of power',
        keyEvents: ['Wore two swords (Miri-Piri)', 'Built Akal Takht', 'Freed 52 Hindu kings from Gwalior Fort'],
        color: '#F97316' // Orange
    },
    {
        id: 7,
        name: 'Guru Har Rai Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿ ਰਾਇ ਜੀ',
        years: '1630 - 1661',
        birthPlace: 'Kiratpur Sahib, Punjab',
        contribution: 'Known for compassion and maintaining Sikh army. Promoted herbal medicine.',
        famousQuote: 'ਦਯਾ ਅਤੇ ਧਰਮ',
        famousQuoteEnglish: 'Compassion and Righteousness',
        keyEvents: ['Maintained army of 2,200 soldiers', 'Promoted herbal medicine', 'Protected followers during Mughal conflicts'],
        color: '#22C55E' // Green (nature/medicine)
    },
    {
        id: 8,
        name: 'Guru Har Krishan Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿ ਕ੍ਰਿਸ਼ਨ ਜੀ',
        years: '1656 - 1664',
        birthPlace: 'Kiratpur Sahib, Punjab',
        contribution: 'Youngest Guru (became Guru at age 5). Helped smallpox victims in Delhi.',
        famousQuote: 'ਬਾਲਾ ਪੀਰ',
        famousQuoteEnglish: 'The Child Guru',
        keyEvents: ['Became Guru at age 5', 'Healed smallpox victims in Delhi', 'Said "Baba Bakale" before passing (pointing to 9th Guru)'],
        color: '#06B6D4' // Cyan
    },
    {
        id: 9,
        name: 'Guru Tegh Bahadur Ji',
        gurmukhiName: 'ਗੁਰੂ ਤੇਗ਼ ਬਹਾਦਰ ਜੀ',
        years: '1621 - 1675',
        birthPlace: 'Amritsar, Punjab',
        contribution: 'Sacrificed life for religious freedom. Protected Kashmiri Pandits. "Hind di Chadar".',
        famousQuote: 'ਸੀਸੁ ਦੀਆ ਪਰ ਸਿਰਰੁ ਨ ਦੀਆ',
        famousQuoteEnglish: 'He gave his head but not his faith',
        keyEvents: ['Martyred in Delhi (Chandni Chowk)', 'Protected Kashmiri Pandits', 'Called "Hind di Chadar" (Shield of India)'],
        color: '#DC2626' // Deep red (martyrdom)
    },
    {
        id: 10,
        name: 'Guru Gobind Singh Ji',
        gurmukhiName: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ',
        years: '1666 - 1708',
        birthPlace: 'Patna, Bihar',
        contribution: 'Created Khalsa. Gave 5 Ks. Declared Guru Granth Sahib as eternal Guru.',
        famousQuote: 'ਸਵਾ ਲਾਖ ਸੇ ਏਕ ਲੜਾਊਂ',
        famousQuoteEnglish: 'I shall make one fight against 125,000',
        keyEvents: ['Created Khalsa in 1699', 'Gave the 5 Ks', 'Sacrifice of four Sahibzade', 'Declared Guru Granth Sahib as eternal Guru'],
        color: '#7C3AED' // Royal purple
    }
];

// Major Historical Events
export const historicalEvents: HistoricalEvent[] = [
    { id: 'birth-nanak', year: 1469, title: 'Birth of Guru Nanak', description: 'Founder of Sikhism born in Talwandi', category: 'guru', guruId: 1 },
    { id: 'kartarpur', year: 1521, title: 'Kartarpur Established', description: 'First Sikh community founded', category: 'milestone' },
    { id: 'gurmukhi', year: 1541, title: 'Gurmukhi Standardized', description: 'Guru Angad Dev Ji standardizes Gurmukhi script', category: 'milestone', guruId: 2 },
    { id: 'langar', year: 1552, title: 'Langar Institution', description: 'Community kitchen becomes central institution', category: 'milestone', guruId: 3 },
    { id: 'amritsar', year: 1577, title: 'Amritsar Founded', description: 'Guru Ram Das Ji founds holy city', category: 'milestone', guruId: 4 },
    { id: 'adi-granth', year: 1604, title: 'Adi Granth Compiled', description: 'First compilation of Sikh scriptures', category: 'milestone', guruId: 5 },
    { id: 'guru-arjan-martyrdom', year: 1606, title: 'First Sikh Martyrdom', description: 'Guru Arjan Dev Ji martyred', category: 'guru', guruId: 5 },
    { id: 'akal-takht', year: 1609, title: 'Akal Takht Built', description: 'Throne of the Timeless One established', category: 'milestone', guruId: 6 },
    { id: 'guru-tegh-martyrdom', year: 1675, title: 'Guru Tegh Bahadur Martyrdom', description: 'Sacrificed for religious freedom', category: 'guru', guruId: 9 },
    { id: 'khalsa', year: 1699, title: 'Creation of Khalsa', description: 'Guru Gobind Singh Ji creates Khalsa at Anandpur', category: 'milestone', guruId: 10 },
    { id: 'chamkaur', year: 1704, title: 'Battle of Chamkaur', description: 'Legendary battle with 40 Sikhs against Mughal army', category: 'battle', guruId: 10 },
    { id: 'sahibzade', year: 1704, title: 'Sacrifice of Sahibzade', description: 'Younger Sahibzade martyred at Sirhind', category: 'guru', guruId: 10 },
    { id: 'guru-granth', year: 1708, title: 'Guru Granth Sahib Eternal Guru', description: 'Guru Gobind Singh Ji declares Sri Guru Granth Sahib as eternal Guru', category: 'milestone', guruId: 10 },
    { id: 'banda-singh', year: 1710, title: 'Banda Singh Bahadur\'s Victory', description: 'Sikh rule established in Punjab', category: 'milestone' },
    { id: 'ranjit-singh', year: 1801, title: 'Sikh Empire Founded', description: 'Maharaja Ranjit Singh unifies Sikh territories', category: 'milestone' },
    { id: 'anglo-sikh', year: 1849, title: 'Anglo-Sikh Wars End', description: 'Punjab annexed by British', category: 'battle' },
    { id: 'jallianwala', year: 1919, title: 'Jallianwala Bagh Massacre', description: 'Hundreds killed on Baisakhi day', category: 'milestone' },
    { id: 'india-independence', year: 1947, title: 'Indian Independence & Partition', description: 'Punjab divided, mass migrations', category: 'milestone' },
    { id: 'sgpc', year: 1925, title: 'SGPC Formed', description: 'Shiromani Gurdwara Parbandhak Committee established', category: 'milestone' },
];

// Historic Gurdwaras
export const historicGurdwaras: HistoricGurdwara[] = [
    { id: 'harmandir', name: 'Harmandir Sahib (Golden Temple)', gurmukhiName: 'ਹਰਿਮੰਦਰ ਸਾਹਿਬ', location: 'Amritsar, Punjab', significance: 'Holiest shrine in Sikhism. Built by Guru Arjan Dev Ji.', associatedGuru: 5 },
    { id: 'akal-takht', name: 'Akal Takht', gurmukhiName: 'ਅਕਾਲ ਤਖ਼ਤ', location: 'Amritsar, Punjab', significance: 'Throne of the Timeless One. Highest temporal authority.', associatedGuru: 6 },
    { id: 'nankana', name: 'Gurdwara Janam Asthan', gurmukhiName: 'ਗੁਰਦੁਆਰਾ ਜਨਮ ਅਸਥਾਨ', location: 'Nankana Sahib, Pakistan', significance: 'Birthplace of Guru Nanak Dev Ji.', associatedGuru: 1 },
    { id: 'anandpur', name: 'Takht Sri Kesgarh Sahib', gurmukhiName: 'ਤਖ਼ਤ ਸ੍ਰੀ ਕੇਸਗੜ੍ਹ ਸਾਹਿਬ', location: 'Anandpur Sahib, Punjab', significance: 'Where Khalsa was created in 1699.', associatedGuru: 10 },
    { id: 'patna', name: 'Takht Sri Patna Sahib', gurmukhiName: 'ਤਖ਼ਤ ਸ੍ਰੀ ਪਟਨਾ ਸਾਹਿਬ', location: 'Patna, Bihar', significance: 'Birthplace of Guru Gobind Singh Ji.', associatedGuru: 10 },
    { id: 'hazur', name: 'Takht Sachkhand Sri Hazur Sahib', gurmukhiName: 'ਤਖ਼ਤ ਸਚਖੰਡ ਸ੍ਰੀ ਹਜ਼ੂਰ ਸਾਹਿਬ', location: 'Nanded, Maharashtra', significance: 'Where Guru Gobind Singh Ji left for heavenly abode.', associatedGuru: 10 },
];

// Core Sikh Values
export const sikhValues = [
    { name: 'Naam Japna', gurmukhi: 'ਨਾਮ ਜਪਣਾ', meaning: 'Meditating on God\'s Name', icon: '🙏' },
    { name: 'Kirat Karni', gurmukhi: 'ਕਿਰਤ ਕਰਨੀ', meaning: 'Earning an honest living', icon: '💼' },
    { name: 'Vand Chakna', gurmukhi: 'ਵੰਡ ਛਕਣਾ', meaning: 'Sharing with others', icon: '🤝' },
];

// Five Ks
export const fiveKs = [
    { name: 'Kesh', gurmukhi: 'ਕੇਸ', meaning: 'Uncut hair - spirituality and devotion', icon: '💇' },
    { name: 'Kangha', gurmukhi: 'ਕੰਘਾ', meaning: 'Wooden comb - cleanliness and discipline', icon: '🪥' },
    { name: 'Kara', gurmukhi: 'ਕੜਾ', meaning: 'Steel bracelet - eternal bond with God', icon: '⭕' },
    { name: 'Kachera', gurmukhi: 'ਕਛਹਿਰਾ', meaning: 'Cotton undergarment - self-control', icon: '👖' },
    { name: 'Kirpan', gurmukhi: 'ਕਿਰਪਾਨ', meaning: 'Ceremonial sword - courage to defend the weak', icon: '⚔️' },
];
