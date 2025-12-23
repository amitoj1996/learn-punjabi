// Sikh History Section - Data and Content

export interface GuruFamily {
    father: string;
    mother: string;
    spouse: string;
    children: string[];
}

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
    image?: string; // path to image file
    // New detailed fields
    family: GuruFamily;
    gurgaddi: string; // Date/Place of Guruship
    teachings: string[]; // Core principles
    baani?: string[]; // Major compositions
    battles?: string[]; // Major battles (for 6th and 10th Guru)
    legacy: string; // Long-term impact
}

export interface HistoricalEvent {
    id: string;
    year: number;
    title: string;
    description: string;
    category: 'guru' | 'battle' | 'milestone' | 'modern';
    guruId?: number;
    // New detailed fields
    longDescription?: string;
    significance?: string;
    context?: string;
    details?: string[];
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
        color: '#F59E0B', // Saffron
        image: '/images/history/guru nanak dev ji.png',
        family: {
            father: 'Mehta Kalu Ji',
            mother: 'Mata Tripta Ji',
            spouse: 'Mata Sulakhni Ji',
            children: ['Baba Sri Chand', 'Baba Lakhmi Das']
        },
        gurgaddi: 'Direct divine revelation from Akal Purakh (God)',
        teachings: [
            'Simran (Meditation on God)',
            'Kirat Karo (Earn honest living)',
            'Vand Chakko (Share with others)',
            'Equality of all humans regardless of caste/gender'
        ],
        baani: ['Japji Sahib', 'Asa Di Vaar', 'Sidh Gosht', 'Bara Maha'],
        legacy: 'Founded the Sikh faith, rejected empty rituals, and established the institution of Langar.'
    },
    {
        id: 2,
        name: 'Guru Angad Dev Ji',
        gurmukhiName: 'ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ',
        years: '1504 - 1552',
        birthPlace: 'Matte Di Sarai, Muktsar',
        contribution: 'Standardized Gurmukhi script. Started tradition of Mall Akhara (wrestling).',
        famousQuote: 'ਜੇ ਸਉ ਚੰਦਾ ਉਗਵਹਿ ਸੂਰਜ ਚੜਹਿ ਹਜਾਰ',
        famousQuoteEnglish: 'Even if a hundred moons and a thousand suns were to rise',
        keyEvents: ['Developed Gurmukhi script', 'Collected Guru Nanak\'s hymns', 'Promoted physical fitness'],
        color: '#10B981', // Emerald
        image: '/images/history/guru angad dev ji.png',
        family: {
            father: 'Baba Pheru Mal Ji',
            mother: 'Mata Ramo Ji',
            spouse: 'Mata Khivi Ji',
            children: ['Baba Dasu', 'Baba Datu', 'Bibi Amro', 'Bibi Anokhi']
        },
        gurgaddi: '1539 at Kartarpur (conferred by Guru Nanak Dev Ji)',
        teachings: [
            'Submission to the Will of the Master (Hukam)',
            'Physical fitness alongside spiritual health',
            'Importance of education and literacy'
        ],
        baani: ['63 Saloks in Guru Granth Sahib'],
        legacy: 'Formalized Gurmukhi script which preserved Gurbani, and prioritized physical well-being (Mall Akhara).'
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
        color: '#3B82F6', // Blue
        image: '/images/history/guru amar das ji.png',
        family: {
            father: 'Baba Tej Bhan Ji',
            mother: 'Mata Sulakhni Ji',
            spouse: 'Mata Mansa Devi Ji',
            children: ['Baba Mohan', 'Baba Mohri', 'Bibi Dani', 'Bibi Bhani']
        },
        gurgaddi: '1552 at Khadur Sahib',
        teachings: [
            'Equality in Langar (free kitchen)',
            'Rejection of Sati and Purdah systems',
            'Humility and service (Seva)'
        ],
        baani: ['Anand Sahib', 'Allocated Raags to Bani'],
        legacy: 'Institutionalized Langar and Manji system for preaching. Championed women\'s rights.'
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
        color: '#8B5CF6', // Purple
        image: '/images/history/guru ram das ji.png',
        family: {
            father: 'Baba Hari Das Ji',
            mother: 'Mata Anup Kaur Ji',
            spouse: 'Mata Bhani Ji',
            children: ['Prithi Chand', 'Mahadev', 'Guru Arjan Dev Ji']
        },
        gurgaddi: '1574 at Goindwal Sahib',
        teachings: [
            'Devotion and love for the Divine',
            'Selfless service (building of Amritsar)',
            'Ideal householder life'
        ],
        baani: ['Laavan (Wedding Hymns)', 'Ghorian'],
        legacy: 'Founded Amritsar, the central religious place for Sikhs. Defined the Sikh marriage ceremony.'
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
        color: '#EF4444', // Red (martyrdom)
        image: '/images/history/guru arjan dev ji.png',
        family: {
            father: 'Guru Ram Das Ji',
            mother: 'Mata Bhani Ji',
            spouse: 'Mata Ganga Ji',
            children: ['Guru Hargobind Sahib Ji']
        },
        gurgaddi: '1581 at Goindwal Sahib',
        teachings: [
            'Acceptance of God\'s Will (Bhana)',
            'Integration of scriptures (Adi Granth)',
            'Sacrifice for righteousness'
        ],
        baani: ['Sukhmani Sahib', 'Major contributor to Guru Granth Sahib'],
        legacy: 'Constructed Harmandir Sahib (Golden Temple) and compiled Adi Granth. First Sikh Martyr.'
    },
    {
        id: 6,
        name: 'Guru Hargobind Sahib Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ',
        years: '1595 - 1644',
        birthPlace: 'Wadali, Amritsar',
        contribution: 'Introduced Miri-Piri (spiritual and temporal authority). Built Akal Takht.',
        famousQuote: 'ਮੀਰੀ ਪੀਰੀ',
        famousQuoteEnglish: 'Miri (temporal) and Piri (spiritual) - two swords of power',
        keyEvents: ['Wore two swords (Miri-Piri)', 'Built Akal Takht', 'Freed 52 Hindu kings from Gwalior Fort'],
        color: '#F97316', // Orange
        image: '/images/history/guru har gobind ji.png',
        family: {
            father: 'Guru Arjan Dev Ji',
            mother: 'Mata Ganga Ji',
            spouse: 'Mata Damodari Ji, Mata Nanaki Ji, Mata Mahadevi Ji',
            children: ['Baba Gurditta', 'Baba Ani Rai', 'Baba Atal Rai', 'Guru Tegh Bahadur Ji', 'Baba Suraj Mal', 'Bibi Viro']
        },
        gurgaddi: '1606 at Amritsar',
        teachings: [
            'Saint-Soldier concept (Sant Sipahi)',
            'Protection of the oppressed',
            'Justice along with spirituality'
        ],
        battles: ['Battle of Amritsar', 'Battle of Hargobindpur', 'Battle of Lahira'],
        legacy: 'Transformed Sikhs into a martial community. Built Akal Takht (Throne of Timeless One).'
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
        color: '#22C55E', // Green (nature/medicine)
        image: '/images/history/guru har rai ji.png',
        family: {
            father: 'Baba Gurditta Ji',
            mother: 'Mata Nihal Kaur Ji',
            spouse: 'Mata Kishan Kaur Ji',
            children: ['Baba Ram Rai', 'Guru Har Krishan Ji']
        },
        gurgaddi: '1644 at Kiratpur Sahib',
        teachings: [
            'Compassion for all living beings',
            'Environment and nature preservation',
            'Self-discipline'
        ],
        legacy: 'Maintained a strong army but never fought a battle. Established Ayurvedic hospitals.'
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
        color: '#06B6D4', // Cyan
        image: '/images/history/guru har krishan ji.png',
        family: {
            father: 'Guru Har Rai Ji',
            mother: 'Mata Kishan Kaur Ji',
            spouse: 'N/A',
            children: ['N/A']
        },
        gurgaddi: '1661 at Kiratpur Sahib',
        teachings: [
            'Service to humanity without fear',
            'Purity of heart',
            'Humility'
        ],
        legacy: 'Sacrificed life serving smallpox patients in Delhi. Symbol of purity and divinity in childhood.'
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
        color: '#DC2626', // Deep red (martyrdom)
        image: '/images/history/guru teg bahadur ji.png',
        family: {
            father: 'Guru Hargobind Sahib Ji',
            mother: 'Mata Nanaki Ji',
            spouse: 'Mata Gujri Ji',
            children: ['Guru Gobind Singh Ji']
        },
        gurgaddi: '1664 at Baba Bakala',
        teachings: [
            'Defense of human rights and religious freedom',
            'Fearlessness ("Fear no one, frighten no one")',
            'Detachment from worldly Maya'
        ],
        baani: ['59 Shabad and 57 Saloks in Guru Granth Sahib'],
        legacy: 'Supreme sacrifice for the protection of another religion (Hindus), establishing universal religious freedom.'
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
        color: '#7C3AED', // Royal purple
        image: '/images/history/guru gobind singh ji.png',
        family: {
            father: 'Guru Tegh Bahadur Ji',
            mother: 'Mata Gujri Ji',
            spouse: 'Mata Jito Ji, Mata Sundari Ji, Mata Sahib Kaur Ji',
            children: ['Sahibzada Ajit Singh', 'Sahibzada Jujhar Singh', 'Sahibzada Zorawar Singh', 'Sahibzada Fateh Singh']
        },
        gurgaddi: '1675 at Anandpur Sahib',
        teachings: [
            'Saint-Soldier (Khalsa)',
            'Equality of all human race ("Manas ki jaat sabhai ekai pehchanbo")',
            'Bravery and high moral character'
        ],
        baani: ['Jaap Sahib', 'Tav-Prasad Savaiye', 'Chaupai Sahib', 'Zafarnama'],
        battles: ['Battle of Bhangani', 'Battle of Anandpur', 'Battle of Chamkaur', 'Battle of Muktsar'],
        legacy: 'Created the Khalsa Panth (Brotherhood of Pure Ones), ending the lineage of human Gurus and bestowing Guruship to the Scripture.'
    }
];

// Major Historical Events
export const historicalEvents: HistoricalEvent[] = [
    {
        id: 'birth-nanak',
        year: 1469,
        title: 'Birth of Guru Nanak',
        description: 'Founder of Sikhism born in Talwandi',
        category: 'guru',
        guruId: 1,
        longDescription: 'Guru Nanak Dev Ji was born in Rai Bhoi Ki Talwandi (now Nankana Sahib, Pakistan). From a young age, he showed a deeply spiritual nature and questioned empty rituals and social inequalities.',
        significance: 'Marked the dawn of the Sikh faith, challenging the status quo of caste, gender inequality, and religious intolerance.',
        context: '15th century India was divided by caste hierarchy and religious conflict between Hindus and Muslims.',
        details: [
            'Born on Puranmashi (Full Moon) of Kattak/Kartik month.',
            'Refused to wear the Janeu (sacred thread) at age 9, arguing for inner virtues over outer symbols.',
            'Disappeared into the Kali Bein river for 3 days and returned with the message: "Na koi Hindu, na koi Musalman" (There is no Hindu, there is no Muslim - all are one).'
        ]
    },
    {
        id: 'kartarpur',
        year: 1521,
        title: 'Kartarpur Established',
        description: 'First Sikh community founded',
        category: 'milestone',
        longDescription: 'After his extensive travels (Udasis), Guru Nanak Dev Ji settled in Kartarpur on the banks of the Ravi River. Here, he established a community based on his teachings.',
        significance: 'The first practical demonstration of the Sikh way of life: Nam Japo, Kirat Karo, Vand Chako.',
        context: 'Guru Nanak Dev Ji wanted to show that spirituality could be practiced while living a householder\'s life, not just by ascetics.',
        details: [
            'Guru Ji worked in the fields himself.',
            'Langar (free community kitchen) was established where everyone ate together regardless of caste.',
            'Bhai Lehna (later Guru Angad Dev Ji) met Guru Nanak Dev Ji here.'
        ]
    },
    {
        id: 'gurmukhi',
        year: 1541,
        title: 'Gurmukhi Standardized',
        description: 'Guru Angad Dev Ji standardizes Gurmukhi script',
        category: 'milestone',
        guruId: 2,
        longDescription: 'Guru Angad Dev Ji refined and standardized the Gurmukhi script from existing scripts of the time. This made the hymns of Guru Nanak Dev Ji accessible to the common people.',
        significance: 'Gave Sikhs their own written language, distinct from Sanskrit (used by Brahmins) and Persian (used by Mughals), democratizing education.',
        context: 'Religious knowledge was previously restricted to the elite who knew Sanskrit or Persian.',
        details: [
            'Added vowels and standardized the alphabet structure.',
            'Used it to write the first biography of Guru Nanak Dev Ji (Bhai Bala Janamsakhi).',
            'Ensured that Gurbani would be preserved in its original form.'
        ]
    },
    {
        id: 'langar',
        year: 1552,
        title: 'Langar Institution',
        description: 'Community kitchen becomes central institution',
        category: 'milestone',
        guruId: 3,
        longDescription: 'Guru Amar Das Ji formalized the institution of Langar. He made it mandatory for anyone wishing to see him to first eat in the Langar ("Pehle Pangat, Phir Sangat").',
        significance: 'A powerful tool for social equality, breaking the taboo of caste by forcing kings and paupers to sit and eat together.',
        context: 'The caste system strictly prohibited high and low castes from eating together.',
        details: [
            'Emperor Akbar visited and ate in the Langar sitting on the floor.',
            'Funded by community contributions (Dasvandh/Seva).',
            'Served vegetarian food to ensure universality.'
        ]
    },
    {
        id: 'amritsar',
        year: 1577,
        title: 'Amritsar Founded',
        description: 'Guru Ram Das Ji founds holy city',
        category: 'milestone',
        guruId: 4,
        longDescription: 'Guru Ram Das Ji founded the city of Amritsar (originally called Ramdaspur) and started the excavation of the holy tank (Sarovar).',
        significance: 'Gave Sikhs a central place of worship and trade, creating a distinct socio-economic hub.',
        context: 'The community was growing and needed a central headquarters.',
        details: [
            'Land was purchased from the owners of village Tung.',
            'Designed as a commercial center, inviting traders from 52 different professions.',
            'Became the spiritual capital of Sikhs.'
        ]
    },
    {
        id: 'adi-granth',
        year: 1604,
        title: 'Adi Granth Compiled',
        description: 'First compilation of Sikh scriptures',
        category: 'milestone',
        guruId: 5,
        longDescription: 'Guru Arjan Dev Ji compiled the hymns of the first four Gurus, his own, and those of saints from other backgrounds (Hindu and Muslim) into the Adi Granth.',
        significance: 'Established the authentic scripture of the Sikhs, preventing alterations and creating a unified spiritual guide.',
        context: 'Fake hymns were being circulated in the name of the Gurus.',
        details: [
            'Bhai Gurdas Ji was the scribe.',
            'Installed in Harmandir Sahib in 1604.',
            'Baba Buddha Ji was the first Granthi (head priest).'
        ]
    },
    {
        id: 'guru-arjan-martyrdom',
        year: 1606,
        title: 'First Sikh Martyrdom',
        description: 'Guru Arjan Dev Ji martyred',
        category: 'guru',
        guruId: 5,
        longDescription: 'Guru Arjan Dev Ji was arrested by Mughal Emperor Jahangir and tortured to death for refusing to convert to Islam or alter the Adi Granth.',
        significance: 'The turning point in Sikh history, leading to the militarization of the Sikh community.',
        context: 'Jahangir was threatened by the growing popularity of the Guru among both Hindus and Muslims.',
        details: [
            'Made to sit on a burning hot plate while hot sand was poured on him.',
            'Remained calm and accepting of God\'s Will ("Tera Bhana Meetha Lage").',
            'Set the precedent of non-violent resistance and supreme sacrifice.'
        ]
    },
    {
        id: 'akal-takht',
        year: 1609,
        title: 'Akal Takht Built',
        description: 'Throne of the Timeless One established',
        category: 'milestone',
        guruId: 6,
        longDescription: 'Guru Hargobind Sahib Ji built the Akal Takht (Throne of the Timeless) opposite Harmandir Sahib.',
        significance: 'Represented supreme temporal authority (Miri), balancing the spiritual authority (Piri) of Harmandir Sahib.',
        context: 'Following his father\'s martyrdom, Guru Hargobind Sahib Ji declared that Sikhs must learn to defend themselves.',
        details: [
            'Built higher than the Mughal throne in Delhi.',
            'Place for discussing political and community affairs.',
            'Guru Ji held court here and received envoys.'
        ]
    },
    {
        id: 'guru-tegh-martyrdom',
        year: 1675,
        title: 'Guru Tegh Bahadur Martyrdom',
        description: 'Sacrificed for religious freedom',
        category: 'guru',
        guruId: 9,
        longDescription: 'Guru Tegh Bahadur Ji was behaded in Delhi (Chandni Chowk) for championing the rights of Kashmiri Brahmins to practice their faith.',
        significance: 'A unique martyrdom in history where a leader sacrificed his life to protect the rights of another religion.',
        context: 'Emperor Aurangzeb was forcibly converting Hindus in Kashmir to Islam.',
        details: [
            'Bhai Mati Das, Bhai Sati Das, and Bhai Dayala were martyred along with him.',
            'His head was carried to Anandpur Sahib by Bhai Jaita Ji.',
            'His body was cremated in Delhi by Lakhi Shah Vanjara (forcing him to burn his own house to conceal it).'
        ]
    },
    {
        id: 'khalsa',
        year: 1699,
        title: 'Creation of Khalsa',
        description: 'Guru Gobind Singh Ji creates Khalsa at Anandpur',
        category: 'milestone',
        guruId: 10,
        longDescription: 'On Vaisakhi day, Guru Gobind Singh Ji created the Khalsa Panth (Order of the Pure) by initiating the Panj Pyare (Five Beloved Ones).',
        significance: 'Formalized the Sikh identity, gave them the 5 Ks, and the names Singh (Lion) and Kaur (Princess/Lioness), abolishing caste distinctions.',
        context: 'To create a fearless society capable of defending righteousness and opposing tyranny.',
        details: [
            'The Guru asked for 5 heads; 5 volunteers offered themselves.',
            'Amrit (nectar) was prepared/stirred with a Khanda (double-edged sword).',
            'The Guru then himself took Amrit from the Panj Pyare ("Waho Waho Gobind Singh Aape Gur Chela").'
        ]
    },
    {
        id: 'chamkaur',
        year: 1704,
        title: 'Battle of Chamkaur',
        description: 'Legendary battle with 40 Sikhs against Mughal army',
        category: 'battle',
        guruId: 10,
        longDescription: 'Guru Gobind Singh Ji, his two elder sons, and 40 Sikhs defended a mud fortress against a massive Mughal army.',
        significance: 'An unparalleled example of bravery against impossible odds.',
        context: 'The Guru had just evacuated Anandpur Sahib after a long siege and was pursued by the Mughal forces.',
        details: [
            'Sahibzada Ajit Singh and Sahibzada Jujhar Singh were martyred fighting.',
            'Guru Gobind Singh Ji wrote "Zafarnama" (Epistle of Victory) to Aurangzeb after this, declaring moral victory.',
            'The 40 Sikhs fought to the last man to allow the Guru to escape and continue the mission.'
        ]
    },
    {
        id: 'sahibzade',
        year: 1704,
        title: 'Sacrifice of Sahibzade',
        description: 'Younger Sahibzade martyred at Sirhind',
        category: 'guru',
        guruId: 10,
        longDescription: 'The younger sons of Guru Gobind Singh Ji, Sahibzada Zorawar Singh (9) and Sahibzada Fateh Singh (7), were bricked alive by Wazir Khan for refusing to convert to Islam.',
        significance: 'Considered one of the cruelest acts in history and the supreme example of steadfastness in faith by children.',
        context: 'They were separated from their father and betrayed by a servant.',
        details: [
            'Mata Gujri Ji (grandmother) attained martyrdom in the Thanda Burj (Cold Tower) hearing the news.',
            'They remained fearless and defiant until the end.',
            'Remembered in the daily Ardas of every Sikh.'
        ]
    },
    {
        id: 'guru-granth',
        year: 1708,
        title: 'Guru Granth Sahib Eternal Guru',
        description: 'Guru Gobind Singh Ji declares Sri Guru Granth Sahib as eternal Guru',
        category: 'milestone',
        guruId: 10,
        longDescription: 'Before passing away at Nanded, Guru Gobind Singh Ji ended the line of human Gurus and vested the Guruship in the Granth Sahib.',
        significance: 'Sikhs now look to the Scripture as their living Guide, not a human leader.',
        context: 'To prevent succession disputes and establish the Word (Shabad) as supreme.',
        details: [
            'Commanded: "Sab Sikhan ko hukam hai Guru Manyo Granth" (All Sikhs are commanded to accept the Granth as Guru).',
            'The final version included the hymns of Guru Tegh Bahadur Ji.',
            'It is treated with the same respect as a living King.'
        ]
    },
    {
        id: 'banda-singh',
        year: 1710,
        title: 'Banda Singh Bahadur\'s Victory',
        description: 'Sikh rule established in Punjab',
        category: 'milestone',
        longDescription: 'Banda Singh Bahadur, appointed by Guru Gobind Singh Ji, captured Sirhind and executed Wazir Khan (the murderer of the Sahibzade).',
        significance: 'Established the first Sikh sovereign rule and minted the first Sikh coinage.',
        context: 'He carried the mission to punish the tyrants and empower the peasantry.',
        details: [
            'Abolished the Zamindari system, giving land rights to tillers.',
            'Established capital at Lohgarh.',
            'Later captured and martyred in Delhi with 700 Sikhs.'
        ]
    },
    {
        id: 'ranjit-singh',
        year: 1801,
        title: 'Sikh Empire Founded',
        description: 'Maharaja Ranjit Singh unifies Sikh territories',
        category: 'milestone',
        longDescription: 'Maharaja Ranjit Singh captured Lahore and unified the warring Sikh Misls (confederacies) into a powerful empire.',
        significance: 'Created a secular, powerful kingdom in North India known for its modernization and religious tolerance.',
        context: 'Punjab was fragmented and facing invasions from Afghans.',
        details: [
            'Ruled in the name of the Khalsa (Sarkar-i-Khalsa).',
            'Modernized the army with European officers.',
            'Gifted gold for the beautification of Harmandir Sahib (hence "Golden Temple").'
        ]
    },
    {
        id: 'anglo-sikh',
        year: 1849,
        title: 'Anglo-Sikh Wars End',
        description: 'Punjab annexed by British',
        category: 'battle',
        longDescription: 'After two hard-fought wars, the British East India Company defeated the Sikh Empire and annexed Punjab.',
        significance: 'The fall of the last independent kingdom in India.',
        context: 'Internal treachery after Ranjit Singh\'s death weakened the state.',
        details: [
            'Sikh soldiers fought bravely ("History will say the Sikhs surrendered, not the Khalsa Army").',
            'Maharaja Duleep Singh (child king) was exiled to England.',
            'The Koh-i-Noor diamond was taken by the British.'
        ]
    },
    {
        id: 'jallianwala',
        year: 1919,
        title: 'Jallianwala Bagh Massacre',
        description: 'Hundreds killed on Baisakhi day',
        category: 'milestone',
        longDescription: 'British General Dyer ordered troops to fire on a peaceful gathering of unarmed Indians (mostly Sikhs) at Jallianwala Bagh, Amritsar.',
        significance: 'A turning point in the Indian Independence movement, deepening hatred for British rule.',
        context: 'People had gathered for Baisakhi and to protest the arrest of leaders.',
        details: [
            'Over 1000 people were killed/injured.',
            'Udham Singh later assassinated Michael O\'Dwyer in London to avenge this.',
            'Bhagat Singh visited the site as a child and collected the blood-soaked earth.'
        ]
    },
    {
        id: 'sgpc',
        year: 1925,
        title: 'SGPC Formed',
        description: 'Shiromani Gurdwara Parbandhak Committee established',
        category: 'milestone',
        longDescription: 'After the prolonged Gurdwara Reform Movement (Akali Movement) to liberate Gurdwaras from corrupt Mahants, the SGPC was legally recognized.',
        significance: 'Gave Sikhs democratic control over their historical shrines.',
        context: 'Mahants supported by the British were mismanaging Gurdwaras.',
        details: [
            'Result of peaceful agitations (Morchas) like Nankana Sahib, Guru Ka Bagh, Jaito.',
            'Known as the "Parliament of Sikhs".',
            'Manages historic Gurdwaras in Punjab, Haryana, Himachal, and Chandigarh.'
        ]
    },
    {
        id: 'india-independence',
        year: 1947,
        title: 'Indian Independence & Partition',
        description: 'Punjab divided, mass migrations',
        category: 'milestone',
        longDescription: 'India gained independence, but Punjab was partitioned between India and Pakistan.',
        significance: 'The most traumatic event in modern Punjab history, resulting in mass migration and communal violence.',
        context: 'Radcliffe Line divided the homeland of Sikhs.',
        details: [
            'Many historic Gurdwaras (Nankana Sahib, Kartarpur Sahib) were left in Pakistan.',
            'Millions of Punjabis were displaced.',
            'Sikhs played a disproportionately large role in the freedom struggle.'
        ]
    }
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
    { name: 'Kangha', gurmukhi: 'ਕੰਘਾ', meaning: 'Wooden comb - cleanliness and discipline', icon: '🪮' },
    { name: 'Kara', gurmukhi: 'ਕੜਾ', meaning: 'Steel bracelet - eternal bond with God', icon: '⭕' },
    { name: 'Kachera', gurmukhi: 'ਕਛਹਿਰਾ', meaning: 'Cotton undergarment - self-control', icon: '👖' },
    { name: 'Kirpan', gurmukhi: 'ਕਿਰਪਾਨ', meaning: 'Ceremonial sword - courage to defend the weak', icon: '⚔️' },
];
