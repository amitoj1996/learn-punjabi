import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
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
                    // 2. Hydrate with DB Profile (Mock for now, will implement API next)
                    // const dbProfile = await fetch('/api/users/me').then(res => res.json());

                    setUser({
                        id: 'temp-id',
                        userId: clientPrincipal.userId,
                        userDetails: clientPrincipal.userDetails,
                        identityProvider: clientPrincipal.identityProvider,
                        userRoles: clientPrincipal.userRoles,
                        role: 'student', // Default
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

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
