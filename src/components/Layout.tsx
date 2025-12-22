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

    // Initialize audio on mount
    useEffect(() => {
        // Create audio element for notification sound
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp2ZkYd8d3yCi5OXlpCIgHp3e4KKkJKQioN9eXp9g4mNjo2Ig3t3d3p/hoyPj42Hf3l2d3p/hYqNjYuGgHp2dnh8goeLi4mFf3p2dnh7gIWIiYeFgHt3dnd6foOGiIeFgX14dnd5fIGEhoaEgX14dnZ4e3+ChYWEgX54dXV3eX1/goODgX54dXR2eHt+gIGBf3x4dXR1d3p8fn9/fnx4dXR1dnl7fX5+fXt4dXR0dnh6fH19fHp3dXR0dXd5e3x8e3p3dXN0dXd5ent7enl2dHN0dXd4ent7enh2dHN0dHZ4ent7eXh1dHN0dHZ3eXp6eXh2dHNzdHV3eHp6eXd2dHNzdHV2eHl5eHd1dHJzdHV2eHh4d3Z0dHJzdHV2d3h4d3Z0c3JydHV2d3d3dnV0c3JydHV2dnZ2dXR0cnJzdHV2dnZ1dHRzcnJzdHV1dXV1dHNzcnJydHR1dXV0dHNycnJydHR0dHR0c3NycnJyc3R0dHRzc3JycnJyc3Nzc3Nzc3JycXJyc3Nzc3NycnJxcXJyc3Nzc3JycnFxcXJyc3NzcnJycXFxcXJyc3NycnJxcXFxcnJycnJycXFxcXFxcnJycnJxcXFxcXFxcnJycXFxcXFxcXFxcXJxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXE=');
        audioRef.current.volume = 0.5;
    }, []);

    // Play notification sound
    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => {
                // Browser might block autoplay, that's okay
                console.log('Could not play notification sound:', e);
            });
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

                // Play sound if count increased (new message received)
                if (newCount > prevUnreadCountRef.current && prevUnreadCountRef.current >= 0) {
                    playNotificationSound();
                }

                prevUnreadCountRef.current = newCount;
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
