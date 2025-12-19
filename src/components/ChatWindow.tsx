import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface Message {
    id: string;
    senderEmail: string;
    senderName: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

interface ChatWindowProps {
    partnerEmail: string;
    partnerName: string;
    currentUserEmail: string;
    onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    partnerEmail,
    partnerName,
    currentUserEmail,
    onClose
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [partnerEmail]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const encodedEmail = encodeURIComponent(partnerEmail);
            const response = await fetch(`/api/chat/messages/${encodedEmail}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                setError(null);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        setError(null);
        setWarning(null);

        try {
            const response = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientEmail: partnerEmail,
                    recipientName: partnerName,
                    content: newMessage.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, data]);
                setNewMessage('');
                if (data.warning) {
                    setWarning(data.warning);
                    setTimeout(() => setWarning(null), 5000);
                }
                inputRef.current?.focus();
            } else {
                setError(data.error || 'Failed to send message');
                if (data.blocked) {
                    setNewMessage('');
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
            ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-secondary-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {partnerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold">{partnerName}</h3>
                        <p className="text-xs text-white/70">{partnerEmail}</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        ✕
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary-50">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-secondary-500">
                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message) => {
                            const isOwn = message.senderEmail.toLowerCase() === currentUserEmail.toLowerCase();
                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[75%]">
                                        <div
                                            className={`px-4 py-2 rounded-2xl ${isOwn
                                                    ? 'bg-primary-500 text-white rounded-br-md'
                                                    : 'bg-white text-secondary-900 rounded-bl-md shadow-sm'
                                                }`}
                                        >
                                            <p className="break-words">{message.content}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                                            <span className="text-xs text-secondary-400">
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Warning */}
            <AnimatePresence>
                {warning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-yellow-50 border-t border-yellow-200 px-4 py-2 flex items-center gap-2 text-yellow-800 text-sm"
                    >
                        <AlertTriangle size={16} />
                        {warning}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border-t border-red-200 px-4 py-2 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-secondary-100">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                    >
                        <Send size={18} />
                    </Button>
                </form>
                <p className="text-xs text-secondary-400 mt-2 text-center">
                    Messages are monitored for safety.
                </p>
            </div>
        </div>
    );
};
