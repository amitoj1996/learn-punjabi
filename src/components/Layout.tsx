import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { MessageCircle, Menu, X, Home, BookOpen, History as HistoryIcon, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, login, logout, isLoading } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const prevUnreadCountRef = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isFirstLoadRef = useRef(true);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

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

    const SidebarLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    }`}
            >
                <Icon size={20} className={isActive ? 'text-primary-600' : 'text-secondary-400'} />
                {label}
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-secondary-900">
            {/* Sidebar Overlay & Panel */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 border-r border-secondary-100 flex flex-col"
                        >
                            <div className="p-4 border-b border-secondary-100 flex items-center justify-between">
                                <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                                    <Logo size="sm" />
                                </Link>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-secondary-500" />
                                </button>
                            </div>

                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                <SidebarLink to="/" icon={Home} label="Home" />
                                <SidebarLink to="/learn" icon={BookOpen} label="Learn Free" />
                                <SidebarLink to="/history" icon={HistoryIcon} label="Sikh History" />

                                {user && (
                                    <>
                                        <div className="my-4 border-t border-secondary-100 pt-4 px-4 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                                            My Account
                                        </div>
                                        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                        <SidebarLink to="/messages" icon={MessageCircle} label="Messages" />
                                    </>
                                )}
                            </nav>

                            {user && (
                                <div className="p-4 border-t border-secondary-100 bg-secondary-50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                            {user.userDetails?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-secondary-900 truncate">
                                                {user.userDetails?.split('@')[0]}
                                            </p>
                                            <p className="text-xs text-secondary-500 truncate">
                                                {user.userDetails}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-secondary-100 z-40 transition-all duration-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 hover:bg-secondary-100 rounded-full text-secondary-600 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                        <Link to="/">
                            <Logo size="sm" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <span className="text-sm text-secondary-400">Loading...</span>
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm hidden md:block">
                                    Hi, {user.userDetails?.split('@')[0]}
                                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'teacher' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </span>
                                <Link to="/dashboard" className="hidden sm:block text-sm font-medium text-primary-600 hover:text-primary-700">
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
                                <div className="hidden sm:block">
                                    <Button variant="ghost" size="sm" onClick={logout}>Log Out</Button>
                                </div>
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
