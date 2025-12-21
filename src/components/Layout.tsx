import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { MessageCircle } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, login, logout, isLoading } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread message count
    useEffect(() => {
        if (!user) return;

        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('/api/messages/unread-count');
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.count || 0);
                }
            } catch (err) {
                console.error('Failed to fetch unread count:', err);
            }
        };

        fetchUnreadCount();
        // Poll every 30 seconds for new messages
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col font-sans text-secondary-900">
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-secondary-100 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/">
                        <Logo size="sm" />
                    </Link>
                    <div className="flex-grow"></div>
                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <span className="text-sm text-secondary-400">Loading...</span>
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm hidden sm:block">
                                    Hi, {user.userDetails?.split('@')[0]}
                                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'teacher' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </span>
                                <Link to="/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                    Dashboard
                                </Link>
                                {/* Messages Icon with Badge */}
                                <Link to="/messages" className="relative">
                                    <MessageCircle size={22} className="text-secondary-600 hover:text-primary-600 transition-colors" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Button variant="ghost" size="sm" onClick={logout}>Log Out</Button>
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={login}>Log In</Button>
                                <Button size="sm" onClick={login}>Get Started</Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-grow pt-16">
                {children}
            </main>
            <footer className="bg-white border-t border-secondary-100 py-12">
                <div className="container mx-auto px-4 text-center text-secondary-500">
                    <p>© 2025 PunjabiLearn. Connecting roots to future.</p>
                </div>
            </footer>
        </div>
    );
};
