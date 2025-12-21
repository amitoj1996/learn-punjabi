import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface SuspensionInfo {
    reason: string;
    suspendedAt: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isSuspended: boolean;
    suspensionInfo: SuspensionInfo | null;
    login: () => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isSuspended: false,
    suspensionInfo: null,
    login: () => { },
    logout: () => { },
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSuspended, setIsSuspended] = useState(false);
    const [suspensionInfo, setSuspensionInfo] = useState<SuspensionInfo | null>(null);

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

                    // 3. Check if user is suspended
                    try {
                        const suspensionRes = await fetch('/api/users/check-suspension');
                        if (suspensionRes.ok) {
                            const suspensionData = await suspensionRes.json();
                            if (suspensionData.suspended) {
                                setIsSuspended(true);
                                setSuspensionInfo({
                                    reason: suspensionData.reason || 'Account suspended',
                                    suspendedAt: suspensionData.suspendedAt || ''
                                });
                            }
                        }
                    } catch (err) {
                        console.error("Failed to check suspension", err);
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
        window.location.href = '/login';
    };

    const logout = () => {
        window.location.href = '/logout';
    };

    const refreshUser = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/.auth/me');
            const payload = await response.json();
            const { clientPrincipal } = payload;

            if (clientPrincipal) {
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

                // Check suspension on refresh too
                try {
                    const suspensionRes = await fetch('/api/users/check-suspension');
                    if (suspensionRes.ok) {
                        const suspensionData = await suspensionRes.json();
                        if (suspensionData.suspended) {
                            setIsSuspended(true);
                            setSuspensionInfo({
                                reason: suspensionData.reason || 'Account suspended',
                                suspendedAt: suspensionData.suspendedAt || ''
                            });
                        } else {
                            setIsSuspended(false);
                            setSuspensionInfo(null);
                        }
                    }
                } catch (err) {
                    console.error("Failed to check suspension", err);
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
            }
        } catch (error) {
            console.error("Failed to refresh user", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isSuspended, suspensionInfo, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
