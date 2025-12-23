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
    // Detailed fields
    family: GuruFamily;
    gurgaddi: string; // Date/Place of Guruship
    teachings: string[]; // Core principles
    baani?: string[]; // Major compositions
    battles?: string[]; // Major battles (for 6th and 10th Guru)
    legacy: string; // Long-term impact
    // NEW: Extended profile fields
    birthDate?: string; // Specific birth date
    jotiJotDate?: string; // Date of passing (Joti Jot)
    biography?: string; // Detailed life story (multiple paragraphs)
    notableStories?: string[]; // Famous sakhis/stories
    miracles?: string[]; // Notable miracles/divine events
    historicalContext?: string; // What was happening in the world at that time
    sahibzade?: string[]; // For Guru Gobind Singh Ji - four sons
    martyrdom?: string; // For martyred Gurus
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
        birthDate: 'April 15, 1469 (Vaisakh Sudhi 3)',
        jotiJotDate: 'September 22, 1539',
        birthPlace: 'Talwandi (now Nankana Sahib, Pakistan)',
        contribution: 'Founder of Sikhism. Emphasized equality, honest living, and devotion to one God.',
        famousQuote: 'ਇਕੁ ਓਅੰਕਾਰ ਸਤਿ ਨਾਮੁ',
        famousQuoteEnglish: 'There is One God, His Name is True',
        keyEvents: ['Traveled extensively (Udasis) to spread message', 'Established Kartarpur community', 'Rejected caste system'],
        color: '#F59E0B',
        image: '/images/history/guru_nanak_dev_ji.png',
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
        legacy: 'Founded the Sikh faith, rejected empty rituals, and established the institution of Langar.',
        biography: `Guru Nanak Dev Ji was born on April 15, 1469, in the village of Rai Bhoi di Talwandi (now Nankana Sahib, Pakistan) to Mehta Kalu, a revenue official, and Mata Tripta. From an early age, Guru Nanak Ji displayed extraordinary spiritual wisdom, often questioning rituals and challenging the caste-based society.

At age 7, when he was to be invested with the sacred thread (janeu), young Nanak refused, saying the true thread should be one of compassion and contentment that doesn't wear out. At age 9, he began his formal education with Pandit Gopal Das and later learned Persian and Arabic, becoming proficient in multiple languages.

In 1487, Guru Nanak Ji married Mata Sulakhni Ji and had two sons: Sri Chand (1494) and Lakhmi Das (1497). At age 28, he worked as a storekeeper in Sultanpur Lodhi for Nawab Daulat Khan Lodi, earning a reputation for honesty and generosity.

The pivotal moment came in 1499 when Guru Nanak Ji, while bathing in the Bein river, disappeared for three days. He returned with divine revelation, declaring "There is no Hindu, there is no Muslim" - emphasizing the oneness of God and humanity. This marked the beginning of his mission.

Over the next 24 years, Guru Nanak Ji undertook four major journeys (Udasis), traveling over 28,000 kilometers by foot across India, Tibet, Sri Lanka, Afghanistan, Persia, Arabia (Mecca/Medina), and the Middle East. He engaged with scholars, saints, and common people, sharing his message of love, equality, and devotion to the One God.

In 1521, he established Kartarpur, the first Sikh community, where he lived his final 18 years farming and teaching. Here he institutionalized Sangat (congregation) and Langar (community kitchen), revolutionary concepts that broke down barriers of caste and class. Before passing, he appointed his devoted disciple Bhai Lehna as his successor, renaming him Guru Angad (meaning "part of me").`,
        notableStories: [
            'The Sachi Sakhi (True Trade): Young Nanak was given 20 rupees by his father to do business. Instead, he fed hungry saints, calling it the truest trade.',
            'Sleeping with feet toward Kaaba: In Mecca, when questioned for sleeping with feet toward the holy Kaaba, Guru Ji said "Please turn my feet where God does not exist."',
            'The Cobra Shadow: While Guru Ji slept in a field, a cobra spread its hood to shade him from the sun, witnessed by the local ruler.',
            'Sajjan Thug: Reformed the notorious robber Sajjan, who became a devoted Sikh and built a dharamsala.',
            'Meeting with Babar: Guru Ji witnessed Babar\'s invasion and wrote Babar Vani, lamenting the suffering of innocent people.'
        ],
        miracles: [
            'Disappeared in the Bein river for three days and returned with divine message',
            'A dried-up spring began flowing at his touch near Kartarpur',
            'Fed thousands with a small amount of food during his travels'
        ],
        historicalContext: 'Guru Nanak Dev Ji lived during a transformative period in South Asian history. The Lodhi Sultanate ruled Delhi, and the Mughal Empire was founded by Babar in 1526. The region experienced religious tension between Hindus and Muslims, rigid caste systems, and superstitious practices. Guru Ji\'s message of equality and one God was revolutionary.'
    },
    {
        id: 2,
        name: 'Guru Angad Dev Ji',
        gurmukhiName: 'ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ',
        years: '1504 - 1552',
        birthDate: 'March 31, 1504',
        jotiJotDate: 'March 29, 1552',
        birthPlace: 'Matte Di Sarai, Muktsar',
        contribution: 'Standardized Gurmukhi script. Started tradition of Mall Akhara (wrestling).',
        famousQuote: 'ਜੇ ਸਉ ਚੰਦਾ ਉਗਵਹਿ ਸੂਰਜ ਚੜਹਿ ਹਜਾਰ',
        famousQuoteEnglish: 'Even if a hundred moons and a thousand suns were to rise',
        keyEvents: ['Developed Gurmukhi script', 'Collected Guru Nanak\'s hymns', 'Promoted physical fitness'],
        color: '#10B981',
        image: '/images/history/guru_angad_dev_ji.png',
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
        legacy: 'Formalized Gurmukhi script which preserved Gurbani, and prioritized physical well-being (Mall Akhara).',
        biography: `Guru Angad Dev Ji, born Lehna on March 31, 1504, in the village of Matte Di Sarai near Muktsar, was the second Sikh Guru. His father Baba Pheru Mal was a small trader, and his mother Mata Ramo (also known as Daya Kaur) raised him with deep religious values.

Before meeting Guru Nanak Dev Ji, Lehna was a devoted worshipper of the Hindu goddess Durga and led annual pilgrimages to the Jwalamukhi temple in the Himalayas. His life transformed in 1532 when he heard the divine shabads of Guru Nanak Ji recited by Bhai Jodha. Deeply moved, he traveled to Kartarpur to meet Guru Nanak Ji.

Upon meeting the first Guru, Lehna was so captivated that he gave up his old life and stayed to serve. His devotion was legendary - he would carry mud on his head for construction, wash the Sangat's clothes, and perform any task without hesitation. Guru Nanak Ji tested him many times, and each time Lehna proved his humility and dedication.

In 1539, after putting Lehna through numerous tests (including the famous test where Guru Ji asked his sons and Lehna to retrieve a body from muddy water), Guru Nanak Ji declared Lehna as his successor, giving him the name "Angad" meaning "my own limb" - signifying that Lehna was like a part of his own body.

As Guru, Guru Angad Dev Ji made monumental contributions. He standardized and popularized the Gurmukhi script, making it the official script for Sikh scripture. This was crucial for preserving Gurbani and making it accessible to common people rather than just Sanskrit-learned Brahmins. He also established the tradition of Mall Akhara (wrestling arenas) to promote physical fitness alongside spiritual development.

Guru Angad Dev Ji spent 13 years as Guru, expanding the Langar institution and collecting the hymns of Guru Nanak Dev Ji. He established his seat at Khadur Sahib. Before merging with the divine, he appointed Guru Amar Das Ji as his successor.`,
        notableStories: [
            'The Test of the Corpse: When Guru Nanak Ji asked who would retrieve a body from muddy water, his sons refused but Lehna immediately obeyed, finding sweets instead of a corpse.',
            'Carrying Mud: Lehna carried mud baskets on his head for construction. When his fine clothes got dirty, Guru Ji praised his selfless service.',
            'Emperor Humayun\'s Visit: The defeated Mughal Emperor Humayun came seeking help. Guru Ji advised him that God helps those who help themselves.',
            'Refusing His Sons: When his sons Dasu and Datu demanded the Guruship, Guru Ji explained that spiritual succession is based on merit, not birth.'
        ],
        miracles: [
            'When he first met Guru Nanak Ji, the Guru looked into his eyes and saw the light of divinity',
            'His complete surrender transformed him from a goddess-worshipper to the embodiment of Sikh principles'
        ],
        historicalContext: 'Guru Angad Dev Ji lived during the early Mughal period. Babur had established the Mughal Empire in 1526, and after his death in 1530, Humayun faced constant challenges. The political instability meant the Sikhs needed to develop independent organizational structures, which Guru Angad Dev Ji provided through the Gurmukhi script and physical training centers.'
    },
    {
        id: 3,
        name: 'Guru Amar Das Ji',
        gurmukhiName: 'ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ',
        years: '1479 - 1574',
        birthDate: 'May 5, 1479',
        jotiJotDate: 'September 1, 1574',
        birthPlace: 'Basarke, Punjab',
        contribution: 'Established Langar (community kitchen) as institution. Fought against caste discrimination.',
        famousQuote: 'ਪਹਿਲਾ ਪੰਗਤ ਪਾਛੈ ਸੰਗਤ',
        famousQuoteEnglish: 'First the Pangat (Langar), then the Sangat',
        keyEvents: ['Built Baoli at Goindwal', 'Appointed Manji system', 'Advocated for women\'s rights'],
        color: '#3B82F6',
        image: '/images/history/guru_amar_das_ji.png',
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
        legacy: 'Institutionalized Langar and Manji system for preaching. Championed women\'s rights.',
        biography: `Guru Amar Das Ji was born on May 5, 1479, in the village of Basarke near Amritsar. For the first 62 years of his life, he followed Hindu traditions, making 20 pilgrimages to Haridwar. Everything changed when he heard his nephew's wife, Bibi Amro (daughter of Guru Angad Dev Ji), reciting Gurbani while churning butter.

Deeply moved by the divine poetry, Amar Das traveled to Khadur Sahib to meet Guru Angad Dev Ji. Despite being older than the Guru in age, he became his most devoted disciple. For 11 years, he served the Guru with complete humility, waking before dawn to fetch water from the Beas river - reportedly making this journey 2,190 times.

One stormy night, while carrying water, Amar Das Ji stumbled into a weaver's pit. The weaver, annoyed at being awakened, called him "nirhala" (homeless one). When Guru Angad Dev Ji heard of his devotion, he declared that Amar Das was indeed the true heir to the throne of Guru Nanak.

As Guru from 1552 to 1574, Guru Amar Das Ji made revolutionary contributions. He strengthened the Langar institution, famously declaring "Pehle Pangat Fir Sangat" - first everyone would sit and eat together as equals, then join in worship. This directly challenged the caste system where different castes could not eat together.

He established the Manji (preaching) and Piri (administrative) systems, appointing 22 Manjis and 52 Piris to spread Sikh teachings across different regions. Among the Piri heads, 52 of them were women - revolutionary for that era. He openly opposed Sati (widow burning) and Purdah (veiling of women), and encouraged widow remarriage.

At Goindwal, he constructed the famous Baoli Sahib with 84 steps, declaring that those who recited Japji Sahib on each step with devotion would be liberated. Guru Amar Das Ji composed the Anand Sahib, recited at all Sikh ceremonies. Before his passing, he appointed his son-in-law Jetha (later Guru Ram Das Ji) as his successor.`,
        notableStories: [
            'Fetching Water 2,190 Times: For 11 years, he walked 5 miles daily to fetch water for Guru Angad Dev Ji, regardless of weather.',
            'Falling in the Weaver\'s Pit: On a stormy night, he stumbled but never dropped the water pitcher. The weaver\'s insult led to Guru Angad Ji recognizing his devotion.',
            'Emperor Akbar\'s Visit: When Mughal Emperor Akbar visited, Guru Ji made him sit in Pangat and eat Langar before granting an audience.',
            'Bibi Bhani\'s Devotion: His daughter sat under the Guru\'s broken cot all night, using her hand to support it so his meditation wouldn\'t be disturbed.'
        ],
        miracles: [
            'The Baoli at Goindwal was said to have healing properties, with devotees reporting cures after bathing while reciting Japji Sahib',
            'His blessing transformed the young orphan Jetha into the future Guru Ram Das Ji'
        ],
        historicalContext: 'Guru Amar Das Ji lived during the reign of Emperor Akbar, who was known for his relatively tolerant religious policies. This provided some space for the Sikh faith to grow. However, the caste system and practices like Sati were deeply entrenched in society, making Guru Ji\'s social reforms truly revolutionary.'
    },
    {
        id: 4,
        name: 'Guru Ram Das Ji',
        gurmukhiName: 'ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ',
        years: '1534 - 1581',
        birthDate: 'September 24, 1534',
        jotiJotDate: 'September 1, 1581',
        birthPlace: 'Lahore, Pakistan',
        contribution: 'Founded the city of Amritsar. Composed Laavan (wedding hymns).',
        famousQuote: 'ਮੇਰਾ ਮਨੁ ਲੋਚੈ ਗੁਰ ਦਰਸਨ ਤਾਈ',
        famousQuoteEnglish: 'My mind longs for the Guru\'s Darshan',
        keyEvents: ['Founded Amritsar', 'Started construction of Sarovar', 'Composed Laavan for Anand Karaj'],
        color: '#8B5CF6',
        image: '/images/history/guru_ram_das_ji.png',
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
        legacy: 'Founded Amritsar, the central religious place for Sikhs. Defined the Sikh marriage ceremony.',
        biography: `Guru Ram Das Ji was born as Bhai Jetha on September 24, 1534, in Lahore in a humble Sodhi Khatri family. Orphaned at a young age (losing his parents at age 7), he was raised by his maternal grandmother in the village of Basarke. As a young boy, he sold boiled gram and worked odd jobs to support himself.

His life changed when he traveled with his grandmother to Goindwal Sahib, where Guru Amar Das Ji had established his seat. The young Jetha was deeply moved by the spiritual atmosphere and decided to stay. He threw himself into seva (selfless service), working tirelessly without any expectation. His devotion caught the attention of Guru Amar Das Ji.

Bibi Bhani, the youngest daughter of Guru Amar Das Ji, was known for her own extraordinary devotion. When it came time for her marriage, Guru Amar Das Ji asked what kind of husband she wanted. She replied that she wanted someone exactly like her father. Impressed by Jetha's humility and service, Guru Ji arranged their marriage.

When Guru Amar Das Ji was deciding on his successor, he tested both his sons-in-law by asking them to build platforms for him. Rama's platform looked better, but Guru Ji repeatedly rejected it. Jetha, however, demolished and rebuilt his platform every time the Guru asked - showing complete surrender to the Guru's will. This earned him the Guruship and the name "Ram Das" (servant of God).

As the fourth Guru, Guru Ram Das Ji founded the city of Ramdaspur, now known as Amritsar (Pool of Nectar). He invited merchants and craftsmen from 52 trades to settle there. He began excavation of the sacred pool (Sarovar) that would eventually house the Harmandir Sahib (Golden Temple).

His greatest contribution to Sikh ceremonies was the Laavan - the four stanzas that form the core of the Sikh wedding ceremony (Anand Karaj). The Laavan describes the soul's journey toward union with the Divine through different stages. Before his passing, he appointed his youngest son Arjan Dev Ji as the fifth Guru.`,
        notableStories: [
            'The Platform Test: When asked to build a platform, Guru Ram Das Ji demolished and rebuilt it seven times without complaint, demonstrating complete surrender.',
            'Selling Gram: As an orphan, young Jetha sold boiled gram in the streets of Basarke to survive, showing humility that would define his life.',
            'The City of Ramdaspur: He personally supervised the excavation of the sacred pool, working alongside laborers and inspiring future generations.',
            'The Holy Pool: He invited the Sufi saint Mian Mir to lay the foundation stone of Harmandir Sahib, showing interfaith harmony.'
        ],
        miracles: [
            'The land where Amritsar was built was said to have been blessed by Guru Nanak Dev Ji centuries earlier during his travels',
            'The sacred pool was believed to have healing properties, with many reporting cures after bathing in it'
        ],
        historicalContext: 'Guru Ram Das Ji lived during the reign of Emperor Akbar, a relatively peaceful period for the Sikhs. Akbar\'s policy of religious tolerance allowed the Sikh faith to establish permanent institutions like the city of Amritsar. This was a crucial period of consolidation for the Sikh Panth.'
    },
    {
        id: 5,
        name: 'Guru Arjan Dev Ji',
        gurmukhiName: 'ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ',
        years: '1563 - 1606',
        birthDate: 'April 15, 1563',
        jotiJotDate: 'May 30, 1606',
        birthPlace: 'Goindwal, Punjab',
        contribution: 'Compiled Adi Granth. Completed Harmandir Sahib. First Sikh martyr.',
        famousQuote: 'ਤੇਰਾ ਭਾਣਾ ਮੀਠਾ ਲਾਗੈ',
        famousQuoteEnglish: 'Your Will seems sweet to me',
        keyEvents: ['Compiled Adi Granth', 'Completed Harmandir Sahib', 'Martyred on hot plate (first Sikh martyr)'],
        color: '#EF4444',
        image: '/images/history/guru_arjan_dev_ji.png',
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
        legacy: 'Constructed Harmandir Sahib (Golden Temple) and compiled Adi Granth. First Sikh Martyr.',
        biography: `Guru Arjan Dev Ji was born on April 15, 1563, at Goindwal Sahib, as the youngest son of Guru Ram Das Ji and Mata Bhani Ji. From childhood, he showed extraordinary spiritual inclination. When his father asked his three sons to each build a platform, young Arjan Dev rebuilt his seven times without a single complaint, demonstrating the surrender that would define his life.

At age 18, Guru Arjan Dev Ji was appointed the fifth Guru over his elder brothers. His eldest brother Prithi Chand became jealous and tried many times to harm the young Guru, even attempting to poison the Guru\'s son Hargobind. Despite these challenges, Guru Arjan Dev Ji continued his mission with love and forgiveness.

His greatest achievement was the compilation of the Adi Granth (later to become Guru Granth Sahib). He collected the writings of all four previous Gurus, added his own 2,218 hymns (the largest contribution), and included verses from Hindu and Muslim saints regardless of caste - revolutionary for its time. Bhai Gurdas Ji served as his scribe. The Granth was installed at Harmandir Sahib in 1604.

Guru Arjan Dev Ji completed the construction of Harmandir Sahib (Golden Temple), with its foundation stone laid by the Sufi saint Mian Mir. Uniquely, the temple has four entrances symbolizing openness to all four castes and all directions. He also built the cities of Tarn Taran and Kartarpur (Jalandhar).

When Emperor Akbar died in 1605 and Jahangir took the throne, the political climate changed. Jahangir was prejudiced against the Sikhs. When Prince Khusrau rebelled against his father and sought refuge with the Guru, Guru Arjan Dev Ji blessed him with money and moral support - a decision that would cost him his life.

Jahangir summoned Guru Ji to Lahore, demanding he convert to Islam, remove verses of Hindu and Muslim saints from the Granth, and pay a heavy fine. Guru Ji refused all demands. From May 24-30, 1606, he was subjected to horrific torture - made to sit on a burning hot plate while hot sand was poured on his body. Through it all, he recited "Tera Bhana Meetha Laage" (Sweet is Your Will). He was then taken to the Ravi river where he attained martyrdom, becoming the first Sikh martyr.`,
        notableStories: [
            'The Compilation of Adi Granth: Guru Ji collected hymns for 3 years and included writings from Hindus, Muslims, and people of all castes.',
            'Mian Mir\'s Foundation Stone: The Sufi saint laid the foundation of Harmandir Sahib at Guru Ji\'s invitation, symbolizing interfaith harmony.',
            'Sukhmani Sahib: He composed this masterpiece of 24 sections on the banks of Ramsar Sarovar.',
            'The Four Doors: Harmandir Sahib was built with four entrances, open to all four castes and all directions.'
        ],
        miracles: [
            'During his torture, his face remained calm and peaceful, with witnesses reporting a divine glow around him',
            'When offered a drink by Mian Mir during his torture, he refused, saying that God\'s will was sweet to him'
        ],
        martyrdom: 'From May 24-30, 1606, Guru Arjan Dev Ji was tortured in Lahore by order of Emperor Jahangir. He was made to sit on a burning hot plate, had hot sand poured over his body, and was finally taken to the Ravi river where he attained martyrdom. His sacrifice established the tradition of martyrdom in the Sikh faith.',
        historicalContext: 'The transition from Akbar (relatively tolerant) to Jahangir (hostile to Sikhs) marked a turning point. Jahangir wrote in his autobiography that he wanted to "close the shop" of Sikh teachings. This hostility would continue through multiple Mughal emperors, leading to more martyrdoms and eventually the creation of the Khalsa.'
    },
    {
        id: 6,
        name: 'Guru Hargobind Sahib Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ',
        years: '1595 - 1644',
        birthDate: 'June 19, 1595',
        jotiJotDate: 'March 3, 1644',
        birthPlace: 'Wadali, Amritsar',
        contribution: 'Introduced Miri-Piri (spiritual and temporal authority). Built Akal Takht.',
        famousQuote: 'ਮੀਰੀ ਪੀਰੀ',
        famousQuoteEnglish: 'Miri (temporal) and Piri (spiritual) - two swords of power',
        keyEvents: ['Wore two swords (Miri-Piri)', 'Built Akal Takht', 'Freed 52 Hindu kings from Gwalior Fort'],
        color: '#F97316',
        image: '/images/history/guru_har_gobind_ji.png',
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
        legacy: 'Transformed Sikhs into a martial community. Built Akal Takht (Throne of Timeless One).',
        biography: `Guru Hargobind Sahib Ji was born on June 19, 1595, at village Wadali near Amritsar. He was the only child of Guru Arjan Dev Ji and Mata Ganga Ji. His birth came after years of waiting, and Baba Buddha Ji blessed his mother and prophesied that the child would be a great warrior.

When Guru Arjan Dev Ji was martyred in 1606, the 11-year-old Hargobind was installed as the sixth Guru. Following his father's dying instructions, the young Guru appeared at his installation wearing two swords - one representing spiritual authority (Piri) and one representing temporal/political authority (Miri). This was the birth of the "Sant-Sipahi" (Saint-Soldier) concept.

He built the Akal Takht (Throne of the Timeless One) directly facing Harmandir Sahib, symbolizing the balance between spiritual and worldly responsibilities. He maintained a royal court, kept horses and hunting hawks, and built an army - a dramatic transformation of Sikh practice.

Emperor Jahangir, suspicious of the growing Sikh power, imprisoned Guru Hargobind Sahib Ji in Gwalior Fort for approximately 2 years along with 52 Hindu kings. When released, Guru Ji refused to leave unless all 52 kings were also freed. The emperor agreed to release whoever could hold onto the Guru's cloak. Guru Ji had a special cloak made with 52 tassels, and led all the kings to freedom. This day is celebrated as Bandi Chhor Divas.

Guru Hargobind Sahib Ji fought and won four battles against Mughal forces - at Amritsar, Hargobindpur, Gurusar, and Kartarpur. He established Kiratpur Sahib as his base in his later years. He had six children, and before passing, designated his grandson Har Rai Ji (through Baba Gurditta) as the seventh Guru.`,
        notableStories: [
            'Bandi Chhor Divas: He freed 52 Hindu kings from Gwalior Fort by having them hold his special 52-tassel cloak.',
            'Two Swords at Installation: At age 11, he wore two swords representing Miri (temporal) and Piri (spiritual) authority.',
            'Hawk and Horses: He maintained a royal court with horses, hawks, and an army - transforming Sikh identity.',
            'Akal Takht: He built the Throne of the Timeless One with his own hands, laying bricks alongside laborers.'
        ],
        miracles: [
            'Baba Buddha Ji blessed him at birth, predicting he would shake empires and fight for righteousness',
            'Despite being vastly outnumbered in battles, his forces were always victorious'
        ],
        historicalContext: 'Guru Hargobind Sahib Ji transformed the Sikh Panth from a peaceful religious community into a martial brotherhood. This was a necessary response to Mughal persecution that began with his father\'s martyrdom. The conflicts with Jahangir and Shah Jahan would continue through successive Gurus.'
    },
    {
        id: 7,
        name: 'Guru Har Rai Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿ ਰਾਇ ਜੀ',
        years: '1630 - 1661',
        birthDate: 'January 16, 1630',
        jotiJotDate: 'October 6, 1661',
        birthPlace: 'Kiratpur Sahib, Punjab',
        contribution: 'Known for compassion and maintaining Sikh army. Promoted herbal medicine.',
        famousQuote: 'ਦਯਾ ਅਤੇ ਧਰਮ',
        famousQuoteEnglish: 'Compassion and Righteousness',
        keyEvents: ['Maintained army of 2,200 soldiers', 'Promoted herbal medicine', 'Protected followers during Mughal conflicts'],
        color: '#22C55E',
        image: '/images/history/guru_har_rai_ji.png',
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
        legacy: 'Maintained a strong army but never fought a battle. Established Ayurvedic hospitals.',
        biography: `Guru Har Rai Ji was born on January 16, 1630, at Kiratpur Sahib. He was the grandson of Guru Hargobind Sahib Ji through his father Baba Gurditta Ji. Known for his gentle and compassionate nature, even as a child he was deeply sensitive to all forms of life.

At age 14, he became the seventh Sikh Guru after the passing of Guru Hargobind Sahib Ji. Despite maintaining an army of 2,200 cavalry soldiers (as established by his grandfather), Guru Har Rai Ji was known as a man of peace and never engaged in battle during his 17 years as Guru.

He was deeply interested in nature and herbal medicine. At Kiratpur Sahib, he established a hospital and a research center for Ayurvedic treatment, with a garden of rare medicinal plants. His compassion extended to all living beings - once, when his robe brushed against flowers and broke them, he was deeply pained and thereafter always held his garments while walking through gardens.

During the Mughal succession conflict between Dara Shikoh (the liberal prince) and Aurangzeb, Guru Har Rai Ji helped Dara Shikoh - providing him refuge and healing when he was ill. When Aurangzeb became emperor and summoned the Guru, Guru Har Rai Ji sent his elder son Ram Rai instead. When Ram Rai changed a word of Gurbani to please the emperor, the Guru disowned him and declared his younger son Har Krishan as his successor.`,
        notableStories: [
            'The Broken Flowers: As a child, when his robe accidentally broke some flowers, he felt such sorrow that he forever after held his garments while walking through gardens.',
            'Medicine for Dara Shikoh: He provided healing herbs to the Mughal prince, showing compassion even to those in conflict.',
            'Disowning Ram Rai: When his son changed a word of Gurbani to please Aurangzeb, Guru Ji disowned him, showing that truth cannot be compromised.',
            'The 2,200 Soldiers: He maintained his grandfather\'s army but never used it for attack, only defense of the innocent.'
        ],
        miracles: [
            'His touch was said to have healing properties, and many came to him for cures',
            'His medicinal garden contained rare herbs that were said to cure diseases others could not'
        ],
        historicalContext: 'Guru Har Rai Ji lived during Aurangzeb\'s ascent to power - a particularly intolerant period for non-Muslims. By supporting Dara Shikoh (who was tolerant of other faiths) against Aurangzeb, the Guru made a political statement while maintaining the Sikh tradition of supporting righteousness over tyranny.'
    },
    {
        id: 8,
        name: 'Guru Har Krishan Ji',
        gurmukhiName: 'ਗੁਰੂ ਹਰਿ ਕ੍ਰਿਸ਼ਨ ਜੀ',
        years: '1656 - 1664',
        birthDate: 'July 7, 1656',
        jotiJotDate: 'March 30, 1664',
        birthPlace: 'Kiratpur Sahib, Punjab',
        contribution: 'Youngest Guru (became Guru at age 5). Helped smallpox victims in Delhi.',
        famousQuote: 'ਬਾਲਾ ਪੀਰ',
        famousQuoteEnglish: 'The Child Guru',
        keyEvents: ['Became Guru at age 5', 'Healed smallpox victims in Delhi', 'Said "Baba Bakale" before passing (pointing to 9th Guru)'],
        color: '#06B6D4',
        image: '/images/history/guru_har_krishan_ji.png',
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
        legacy: 'Sacrificed life serving smallpox patients in Delhi. Symbol of purity and divinity in childhood.',
        biography: `Guru Har Krishan Ji, the eighth Sikh Guru, was born on July 7, 1656, at Kiratpur Sahib. He became Guru at the tender age of 5 after his father Guru Har Rai Ji passed away in 1661, making him the youngest Guru in Sikh history.

Emperor Aurangzeb, skeptical of such a young child being a spiritual leader, summoned Guru Har Krishan Ji to Delhi. Raja Jai Singh sponsored the Guru's visit, and the young Guru stayed at his bungalow (now Gurdwara Bangla Sahib). Aurangzeb tried to test the young Guru's knowledge - famously, a scholar disguised as a low-caste water carrier was sent to him, but the Guru immediately recognized and honored him.

During his time in Delhi, a devastating smallpox and cholera epidemic swept through the city. Without concern for his own safety, the young Guru Ji personally went into affected areas, distributing medicine, providing food and water, and serving the sick regardless of their religion or caste. The waters from the well at Raja Jai Singh's residence (now the Sarovar at Bangla Sahib) were said to have healing properties.

Tragically, while serving the sick, the young Guru contracted smallpox himself. As his condition worsened, devotees asked who would be the next Guru. He simply said "Baba Bakale" - indicating the next Guru would be found in the village of Bakala. He attained Joti Jot on March 30, 1664, at the age of only 8 years. His sacrifice in serving others, even unto death, made him a symbol of selfless service.`,
        notableStories: [
            'Baba Bakale: On his deathbed, when asked who would succeed him, he simply said "Baba Bakale," pointing to where the next Guru (Tegh Bahadur) was meditating.',
            'The Illiterate Who Recited Gita: When tested, he touched an illiterate water carrier who then recited complex scriptures perfectly.',
            'Healing Waters: The waters from the well where he stayed are still believed to have healing properties today.',
            'Serving the Sick: Despite his young age and royal status, he personally served smallpox patients, showing that seva knows no hierarchy.'
        ],
        miracles: [
            'He blessed an illiterate man named Chhajju who then explained complex philosophical concepts',
            'The water from the well at his residence (now Bangla Sahib Sarovar) was said to cure diseases'
        ],
        historicalContext: 'Guru Har Krishan Ji\'s short life occurred during Aurangzeb\'s oppressive reign. The emperor\'s attempt to summon and test the young Guru was part of broader Mughal attempts to control or discredit Sikh leadership. The Guru\'s death while serving the sick became a powerful example of Sikh values.'
    },
    {
        id: 9,
        name: 'Guru Tegh Bahadur Ji',
        gurmukhiName: 'ਗੁਰੂ ਤੇਗ਼ ਬਹਾਦਰ ਜੀ',
        years: '1621 - 1675',
        birthDate: 'April 1, 1621',
        jotiJotDate: 'November 11, 1675',
        birthPlace: 'Amritsar, Punjab',
        contribution: 'Sacrificed life for religious freedom. Protected Kashmiri Pandits. "Hind di Chadar".',
        famousQuote: 'ਸੀਸੁ ਦੀਆ ਪਰ ਸਿਰਰੁ ਨ ਦੀਆ',
        famousQuoteEnglish: 'He gave his head but not his faith',
        keyEvents: ['Martyred in Delhi (Chandni Chowk)', 'Protected Kashmiri Pandits', 'Called "Hind di Chadar" (Shield of India)'],
        color: '#DC2626',
        image: '/images/history/guru_teg_bahadur_ji.png',
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
        legacy: 'Supreme sacrifice for the protection of another religion (Hindus), establishing universal religious freedom.',
        biography: `Guru Tegh Bahadur Ji was born on April 1, 1621, in Amritsar, as the youngest son of Guru Hargobind Sahib Ji. Originally named Tyag Mal, he earned the name "Tegh Bahadur" (Brave Warrior of the Sword) after displaying exceptional courage in the Battle of Kartarpur at age 13.

After his father's passing, he lived a life of deep meditation for 26 years - first at Bakala and later in Assam. When Guru Har Krishan Ji said "Baba Bakale" before his death, a search began at Bakala. Many imposters claimed the Guruship. Bhai Makhan Shah Lubana, who had prayed to the Guru during a storm and promised 500 gold coins, tested each claimant by offering only 2 coins. Only when Tegh Bahadur Ji recognized the full pledge did Makhan Shah proclaim from the rooftop: "Guru Ladho Re!" (I have found the Guru!).

As the ninth Guru, he traveled extensively, visiting Dhaka, Assam, and finally founding the city of Anandpur Sahib in 1665. His compositions in the Guru Granth Sahib are profound meditations on detachment, the illusion of worldly life, and fearlessness.

In 1675, Kashmiri Pandits led by Pandit Kirpa Ram came to Guru Tegh Bahadur Ji seeking protection from Aurangzeb's forced conversions. The young Gobind Rai (future Guru Gobind Singh Ji) asked why they were crying and, upon learning the situation, suggested his father could protect them. Guru Ji sent a message to the emperor: "If you can convert me, then have these Pandits convert."

Aurangzeb summoned the Guru to Delhi. Guru Tegh Bahadur Ji was arrested along with three devoted Sikhs - Bhai Mati Das, Bhai Sati Das, and Bhai Dayala. These three were martyred first in front of the Guru to break his resolve. When asked to perform a miracle or convert, Guru Ji refused. On November 11, 1675, he was beheaded at Chandni Chowk, Delhi. His sacrifice, for a faith not his own, earned him the title "Hind di Chadar" (Shield of India).`,
        notableStories: [
            'Guru Ladho Re: Bhai Makhan Shah Lubana found the true Guru by testing claimants with a 2-coin offering - only Guru Ji knew the full 500-coin pledge.',
            'The Kashmiri Pandits: When Pandits sought protection from forced conversion, his 9-year-old son suggested the Guru could save them.',
            'The Three Martyrs: Bhai Mati Das (sawed in half), Bhai Dayala (boiled alive), and Bhai Sati Das (wrapped in cotton and burned) were martyred before him.',
            'Final Message: His last words were "This is the time to sacrifice for righteousness - giving one\'s head without crying."'
        ],
        miracles: [
            'A piece of paper found on his body after martyrdom contained a prophecy about the future',
            'Despite torture, his face remained calm and peaceful, inspiring even his executioners'
        ],
        martyrdom: 'On November 11, 1675, Guru Tegh Bahadur Ji was publicly beheaded at Chandni Chowk, Delhi, by order of Emperor Aurangzeb. His three companions were first martyred before him: Bhai Mati Das was sawed in half, Bhai Dayala was boiled in a cauldron, and Bhai Sati Das was burned alive. The Guru accepted death rather than convert to Islam, sacrificing his life to protect the religious freedom of Kashmiri Hindus. Gurdwara Sis Ganj Sahib marks the site of his martyrdom.',
        historicalContext: 'Aurangzeb had reversed his predecessors\' relatively tolerant policies, imposing the jizya tax on non-Muslims and ordering mass conversions. The Kashmiri Pandits represented the threatened Hindu minority. Guru Tegh Bahadur Ji\'s sacrifice was unprecedented - a leader of one faith dying to protect followers of another - establishing the Sikh principle of religious freedom for all.'
    },
    {
        id: 10,
        name: 'Guru Gobind Singh Ji',
        gurmukhiName: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ',
        years: '1666 - 1708',
        birthDate: 'December 22, 1666',
        jotiJotDate: 'October 7, 1708',
        birthPlace: 'Patna, Bihar',
        contribution: 'Created Khalsa. Gave 5 Ks. Declared Guru Granth Sahib as eternal Guru.',
        famousQuote: 'ਸਵਾ ਲਾਖ ਸੇ ਏਕ ਲੜਾਊਂ',
        famousQuoteEnglish: 'I shall make one fight against 125,000',
        keyEvents: ['Created Khalsa in 1699', 'Gave the 5 Ks', 'Sacrifice of four Sahibzade', 'Declared Guru Granth Sahib as eternal Guru'],
        color: '#7C3AED',
        image: '/images/history/guru_gobind_singh_ji.png',
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
        legacy: 'Created the Khalsa Panth (Brotherhood of Pure Ones), ending the lineage of human Gurus and bestowing Guruship to the Scripture.',
        biography: `Guru Gobind Singh Ji was born on December 22, 1666, at Patna, Bihar, as Gobind Rai. His father Guru Tegh Bahadur Ji was martyred when Gobind Rai was only 9 years old, and the young boy was installed as the tenth Guru at Anandpur Sahib.

From childhood, he was trained in martial arts, weaponry, and multiple languages including Sanskrit, Persian, Braj Bhasha, and Punjabi. He was also a poet and scholar, composing profound spiritual literature. He transformed Anandpur Sahib into a center of learning and martial training.

His defining moment came on Vaisakhi 1699 when he created the Khalsa. Before a gathering of thousands, he asked for volunteers who would give their heads for the faith. Five brave Sikhs, later known as the Panj Pyare (Five Beloved Ones), stepped forward from different castes and regions. Guru Ji initiated them with Amrit (sweetened water stirred with a double-edged sword), gave them the name "Singh" (lion), established the 5 Ks, and then in a revolutionary act, asked them to initiate HIM - declaring that the Khalsa and Guru are one.

His life was marked by tremendous sacrifice. He fought fourteen battles against Mughal and Hill Raja forces. After the Siege of Anandpur (1704), he lost everything - his mother Mata Gujri Ji, and all four sons (the Char Sahibzade). Sahibzada Ajit Singh (18) and Jujhar Singh (14) died fighting at Chamkaur, while Zorawar Singh (9) and Fateh Singh (6) were bricked alive at Sirhind for refusing to convert.

Despite these unimaginable losses, he wrote the Zafarnama (Epistle of Victory) to Aurangzeb - a powerful letter questioning the emperor\'s morality and broken promises. After Aurangzeb\'s death, Guru Ji met the new Emperor Bahadur Shah. In October 1708, at Nanded, before his passing, he declared Guru Granth Sahib as the eternal Guru - ending the line of human Gurus forever.`,
        notableStories: [
            'Creation of Khalsa: On Vaisakhi 1699, he asked for heads and five brave Sikhs volunteered, becoming the Panj Pyare.',
            'Chamkaur Sahib: His two elder sons died fighting against thousands, and he approved their going to battle saying "All four sons shall be martyred."',
            'Brick Martyrdom: His younger sons (ages 9 and 6) refused to convert and were bricked alive at Sirhind.',
            'Zafarnama: Even after losing everything, he wrote a defiant letter to Aurangzeb, declaring moral victory.',
            'Final Declaration: Before passing, he bowed before Guru Granth Sahib, declaring it the eternal Guru.'
        ],
        miracles: [
            'At Chamkaur, his small force of 40 held off an army of thousands',
            'The Amrit prepared by him was said to transform ordinary men into fearless warriors',
            'Despite losing all four sons, he never wavered in his mission or faith'
        ],
        sahibzade: ['Sahibzada Ajit Singh (18) - Martyred at Chamkaur Sahib', 'Sahibzada Jujhar Singh (14) - Martyred at Chamkaur Sahib', 'Sahibzada Zorawar Singh (9) - Bricked alive at Sirhind', 'Sahibzada Fateh Singh (6) - Bricked alive at Sirhind'],
        historicalContext: 'Guru Gobind Singh Ji lived through the most oppressive period of Mughal rule under Aurangzeb. The creation of the Khalsa was a direct response to centuries of persecution - transforming persecuted people into fearless warriors who would stand for justice. His declaration of Guru Granth Sahib as the eternal Guru ensured Sikh guidance would never be dependent on any single human leader again.'
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
