import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { ChatWindow } from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Conversation {
    recipientId: string;
    recipientEmail: string;
    recipientName: string;
    lastMessage?: string;
    unreadCount?: number;
}

interface Booking {
    id: string;
    tutorId: string;
    tutorName: string;
    tutorEmail: string;
    studentId: string;
    studentEmail: string;
    date: string;
    status: string;
}

export const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        try {
            // Get bookings to find people user can chat with
            const bookingsResponse = await fetch('/api/bookings/student');
            const teacherBookingsResponse = await fetch('/api/bookings/teacher');

            const conversationMap = new Map<string, Conversation>();

            if (bookingsResponse.ok) {
                const studentBookings: Booking[] = await bookingsResponse.json();
                studentBookings.forEach(booking => {
                    const key = booking.tutorEmail?.toLowerCase() || booking.tutorId;
                    if (!conversationMap.has(key)) {
                        conversationMap.set(key, {
                            recipientId: booking.tutorId,
                            recipientEmail: booking.tutorEmail || '',
                            recipientName: booking.tutorName
                        });
                    }
                });
            }

            if (teacherBookingsResponse.ok) {
                const teacherBookings: Booking[] = await teacherBookingsResponse.json();
                teacherBookings.forEach(booking => {
                    const key = booking.studentEmail?.toLowerCase() || booking.studentId;
                    if (!conversationMap.has(key)) {
                        conversationMap.set(key, {
                            recipientId: booking.studentId,
                            recipientEmail: booking.studentEmail,
                            recipientName: booking.studentEmail.split('@')[0]
                        });
                    }
                });
            }

            setConversations(Array.from(conversationMap.values()));
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <MessageCircle size={48} className="mx-auto mb-4 text-secondary-300" />
                        <p className="text-secondary-600">Please log in to view messages</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4">
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">Messages</h1>
                    <p className="text-secondary-600 mt-1">Chat with your tutors and students</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-secondary-100 overflow-hidden" style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}>
                    <div className="flex h-full">
                        {/* Conversations List */}
                        <div className={`${isMobileView && selectedConversation ? 'hidden' : 'block'} w-full md:w-80 border-r border-secondary-100 bg-secondary-50`}>
                            <div className="p-4 border-b border-secondary-100 bg-white">
                                <h2 className="font-semibold text-secondary-900 flex items-center gap-2">
                                    <Users size={18} />
                                    Conversations
                                </h2>
                            </div>

                            <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <div className="text-center py-12 text-secondary-500 px-4">
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="font-medium">No conversations yet</p>
                                        <p className="text-sm mt-2">Book a lesson to start chatting with a tutor!</p>
                                    </div>
                                ) : (
                                    conversations.map((conv) => (
                                        <motion.button
                                            key={conv.recipientId}
                                            whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`w-full p-4 flex items-center gap-3 border-b border-secondary-100 transition-colors ${selectedConversation?.recipientId === conv.recipientId ? 'bg-primary-50' : ''
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                                                {conv.recipientName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className="font-medium text-secondary-900">{conv.recipientName}</h3>
                                                <p className="text-sm text-secondary-500 truncate">
                                                    {conv.lastMessage || 'Start a conversation'}
                                                </p>
                                            </div>
                                            {conv.unreadCount && conv.unreadCount > 0 && (
                                                <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className={`${isMobileView && !selectedConversation ? 'hidden' : 'block'} flex-1`}>
                            {selectedConversation ? (
                                <ChatWindow
                                    recipientId={selectedConversation.recipientId}
                                    recipientEmail={selectedConversation.recipientEmail}
                                    recipientName={selectedConversation.recipientName}
                                    currentUserId={user.userId}
                                    currentUserEmail={user.userDetails || ''}
                                    onClose={isMobileView ? () => setSelectedConversation(null) : undefined}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-secondary-500">
                                    <div className="text-center">
                                        <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
                                        <p className="text-lg">Select a conversation to start chatting</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
