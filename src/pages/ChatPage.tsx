import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { ChatWindow } from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Users, ArrowLeft, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

interface ChatPartner {
    email: string;
    name: string;
}

export const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [partners, setPartners] = useState<ChatPartner[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (user) {
            fetchPartners();
        }
    }, [user]);

    // Handle ?to= query param for direct messaging
    useEffect(() => {
        const toEmail = searchParams.get('to');
        if (toEmail && partners.length > 0) {
            const existingPartner = partners.find(p => p.email === toEmail);
            if (existingPartner) {
                setSelectedPartner(existingPartner);
            } else {
                // Create new partner entry for direct messaging
                setSelectedPartner({ email: toEmail, name: toEmail.split('@')[0] });
            }
        }
    }, [searchParams, partners]);

    const fetchPartners = async () => {
        try {
            const response = await fetch('/api/chat/partners');
            if (response.ok) {
                const data = await response.json();
                setPartners(data);
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter partners by search
    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-secondary-50 to-white">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircle size={40} className="text-secondary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-secondary-900 mb-2">Sign in to view messages</h2>
                        <p className="text-secondary-600">You need to be logged in to access your conversations.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm mb-3">
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">Messages</h1>
                    </motion.div>

                    {/* Chat Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-xl border border-secondary-100 overflow-hidden"
                        style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}
                    >
                        <div className="flex h-full">
                            {/* Partners Sidebar */}
                            <div className={`${isMobileView && selectedPartner ? 'hidden' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-secondary-100`}>
                                {/* Sidebar Header */}
                                <div className="p-4 border-b border-secondary-100 bg-gradient-to-r from-secondary-50 to-white">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users size={18} className="text-primary-600" />
                                        <h2 className="font-semibold text-secondary-900">Conversations</h2>
                                        {partners.length > 0 && (
                                            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">{partners.length}</span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                {/* Partners List */}
                                <div className="flex-1 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
                                            <p className="text-sm text-secondary-500">Loading conversations...</p>
                                        </div>
                                    ) : filteredPartners.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                                                <MessageCircle size={28} className="text-secondary-400" />
                                            </div>
                                            {searchTerm ? (
                                                <>
                                                    <p className="font-medium text-secondary-900">No results found</p>
                                                    <p className="text-sm text-secondary-500 mt-1">Try a different search term</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-secondary-900">No conversations yet</p>
                                                    <p className="text-sm text-secondary-500 mt-1">Book a lesson to start chatting!</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-secondary-50">
                                            {filteredPartners.map((partner) => (
                                                <motion.button
                                                    key={partner.email}
                                                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.04)' }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedPartner(partner)}
                                                    className={`w-full p-4 flex items-center gap-3 transition-all ${selectedPartner?.email === partner.email
                                                        ? 'bg-primary-50 border-l-4 border-l-primary-500'
                                                        : 'border-l-4 border-l-transparent hover:border-l-primary-200'
                                                        }`}
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                        {partner.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <h3 className="font-medium text-secondary-900 truncate">{partner.name}</h3>
                                                        <p className="text-sm text-secondary-500 truncate">{partner.email}</p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Chat Window Area */}
                            <div className={`${isMobileView && !selectedPartner ? 'hidden' : 'flex'} flex-1 flex-col`}>
                                {selectedPartner ? (
                                    <ChatWindow
                                        partnerEmail={selectedPartner.email}
                                        partnerName={selectedPartner.name}
                                        currentUserEmail={user.userDetails || ''}
                                        onClose={isMobileView ? () => setSelectedPartner(null) : undefined}
                                        onDeleted={() => {
                                            setSelectedPartner(null);
                                            fetchPartners();
                                        }}
                                    />
                                ) : (
                                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-secondary-50 to-white">
                                        <div className="text-center px-6">
                                            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <MessageCircle size={48} className="text-primary-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Select a conversation</h3>
                                            <p className="text-secondary-500 max-w-xs">Choose a conversation from the sidebar to start messaging.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};
