import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    debugToggleRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
    debugToggleRole: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                // 1. Get SWA Identity
                const response = await fetch('/.auth/me');
                const payload = await response.json();
                const { clientPrincipal } = payload;

                if (clientPrincipal) {
                    // 2. Hydrate with DB Profile
                    let dbRole = 'student';
                    let dbId = 'temp-id';

                    try {
                        const dbProfileRes = await fetch('/api/users/me');
                        if (dbProfileRes.ok) {
                            const dbProfile = await dbProfileRes.json();
                            dbRole = dbProfile.role;
                            dbId = dbProfile.id;
                        }
                    } catch (err) {
                        console.error("Failed to fetch DB profile", err);
                    }

                    setUser({
                        id: dbId,
                        userId: clientPrincipal.userId,
                        userDetails: clientPrincipal.userDetails,
                        identityProvider: clientPrincipal.identityProvider,
                        userRoles: clientPrincipal.userRoles,
                        role: dbRole as 'student' | 'teacher' | 'admin',
                        createdAt: new Date().toISOString()
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    const login = () => {
        window.location.href = '/login'; // Redirects to Microsoft login
    };

    const logout = () => {
        window.location.href = '/logout';
    };

    const debugToggleRole = () => {
        if (!user) return;
        const roles: ('student' | 'teacher' | 'admin')[] = ['student', 'teacher', 'admin'];
        const currentIndex = roles.indexOf(user.role);
        const nextRole = roles[(currentIndex + 1) % roles.length];
        setUser({ ...user, role: nextRole });
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, debugToggleRole }}>
            {children}
        </AuthContext.Provider>
    );
};
