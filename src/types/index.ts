export interface Tutor {
    id: string;
    name: string;
    avatarUrl: string;
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    languages: string[];
    role: string;
    bio: string;
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
