import React, { useEffect, useState, useRef } from 'react';
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
    const prevUnreadCountRef = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isFirstLoadRef = useRef(true);

    // Initialize audio on mount
    useEffect(() => {
        // Create audio element with a cleaner notification sound
        // This is a higher quality "ding" sound
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.volume = 0.4;

        // Initialize prev count from sessionStorage to prevent sound on page refresh
        const storedCount = sessionStorage.getItem('lastUnreadCount');
        if (storedCount) {
            prevUnreadCountRef.current = parseInt(storedCount, 10);
        }
    }, []);

    // Play notification sound with cooldown
    const playNotificationSound = () => {
        // Check cooldown - don't play if played in last 10 seconds
        const lastPlayed = sessionStorage.getItem('lastSoundPlayed');
        const now = Date.now();
        if (lastPlayed && now - parseInt(lastPlayed, 10) < 10000) {
            return; // Skip - played recently
        }

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => {
                // Browser might block autoplay, that's okay
                console.log('Could not play notification sound:', e);
            });
            sessionStorage.setItem('lastSoundPlayed', now.toString());
        }
    };

    // Fetch unread message count
    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const response = await fetch('/api/messages/unread-count');
            if (response.ok) {
                const data = await response.json();
                const newCount = data.count || 0;

                // Play sound if count increased (new message received), but not on first load
                if (!isFirstLoadRef.current && newCount > prevUnreadCountRef.current) {
                    playNotificationSound();
                }

                isFirstLoadRef.current = false;
                prevUnreadCountRef.current = newCount;
                sessionStorage.setItem('lastUnreadCount', newCount.toString());
                setUnreadCount(newCount);
            }
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchUnreadCount();
        // Poll every 5 seconds for new messages (more responsive)
        const interval = setInterval(fetchUnreadCount, 5000);

        // Listen for custom event when messages are read
        const handleMessagesRead = () => {
            fetchUnreadCount();
        };
        window.addEventListener('messagesRead', handleMessagesRead);

        return () => {
            clearInterval(interval);
            window.removeEventListener('messagesRead', handleMessagesRead);
        };
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
                        <Link to="/learn" className="text-sm font-medium text-secondary-600 hover:text-primary-600">
                            Learn Free
                        </Link>
                        <Link to="/history" className="text-sm font-medium text-secondary-600 hover:text-primary-600">
                            History
                        </Link>
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
