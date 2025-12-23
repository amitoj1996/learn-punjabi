export interface Tutor {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    photoUrl?: string;
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    languages: string[];
    role?: string;
    bio: string;
    // New enhanced profile fields
    timezone?: string;
    languagesSpoken?: string[];
    targetAgeGroups?: string[];
    specializations?: string[];
    sessionLengths?: string[];
    videoIntro?: string;
    teachingPhilosophy?: string;
    proficiencyLevel?: string;
    yearsExperience?: string;
    experienceLevel?: string;
    isSuspended?: boolean;
    createdAt?: string;
}

export interface User {
    id: string;
    userId: string;
    userDetails: string;
    identityProvider: string;
    userRoles: string[];
    role: 'student' | 'teacher' | 'admin';
    createdAt: string;
}
