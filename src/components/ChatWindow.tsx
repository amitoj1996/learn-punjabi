import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, MessageCircle, Trash2, Flag, ArrowLeft, MoreVertical, X } from 'lucide-react';
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
    onDeleted?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    partnerEmail,
    partnerName,
    currentUserEmail,
    onClose,
    onDeleted
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reportingMessage, setReportingMessage] = useState<Message | null>(null);
    const [isReporting, setIsReporting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevMessagesLengthRef = useRef(0);
    const isInitialLoadRef = useRef(true);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [partnerEmail]);

    useEffect(() => {
        // Only scroll to bottom on initial load or when new messages arrive
        if (isInitialLoadRef.current || messages.length > prevMessagesLengthRef.current) {
            scrollToBottom();
            isInitialLoadRef.current = false;
        }
        prevMessagesLengthRef.current = messages.length;
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
                if (data.blocked) setNewMessage('');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/chat/delete/${encodeURIComponent(partnerEmail)}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setShowDeleteConfirm(false);
                setMessages([]);
                if (onDeleted) onDeleted();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete conversation');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReport = async (reason: string) => {
        if (!reportingMessage) return;
        setIsReporting(true);
        try {
            const response = await fetch('/api/chat/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: reportingMessage.id,
                    reason,
                    messageContent: reportingMessage.content,
                    senderEmail: reportingMessage.senderEmail,
                    partnerEmail
                })
            });
            if (response.ok) {
                setReportingMessage(null);
                setWarning('Report submitted. Our team will review it.');
                setTimeout(() => setWarning(null), 5000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to submit report');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsReporting(false);
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
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-secondary-100">
                <div className="flex items-center gap-3">
                    {onClose && (
                        <button onClick={onClose} className="p-2 -ml-2 hover:bg-secondary-100 rounded-lg transition-colors md:hidden">
                            <ArrowLeft size={20} className="text-secondary-600" />
                        </button>
                    )}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                        {partnerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-secondary-900">{partnerName}</h3>
                        <p className="text-xs text-secondary-500">{partnerEmail}</p>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                        <MoreVertical size={20} className="text-secondary-600" />
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
                                <button
                                    onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete Chat
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-secondary-50/50 to-white">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
                        <p className="text-sm text-secondary-500">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={28} className="text-primary-300" />
                        </div>
                        <p className="font-medium text-secondary-900">No messages yet</p>
                        <p className="text-sm text-secondary-500 mt-1">Say hi to start the conversation!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message, index) => {
                            const isOwn = message.senderEmail.toLowerCase() === currentUserEmail.toLowerCase();
                            const showDate = index === 0 ||
                                new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();

                            return (
                                <React.Fragment key={message.id}>
                                    {showDate && (
                                        <div className="flex justify-center py-2">
                                            <span className="text-xs text-secondary-400 bg-white px-3 py-1 rounded-full shadow-sm">
                                                {new Date(message.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="group max-w-[80%]">
                                            <div
                                                className={`px-4 py-2.5 shadow-sm ${isOwn
                                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-md'
                                                    : 'bg-white text-secondary-900 rounded-2xl rounded-bl-md border border-secondary-100'
                                                    }`}
                                            >
                                                <p className="break-words text-[15px] leading-relaxed">{message.content}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 mt-1 px-1 ${isOwn ? 'justify-end' : ''}`}>
                                                <span className="text-[11px] text-secondary-400">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                                {!isOwn && (
                                                    <button
                                                        onClick={() => setReportingMessage(message)}
                                                        className="opacity-0 group-hover:opacity-100 text-secondary-400 hover:text-red-500 transition-all p-0.5"
                                                        title="Report"
                                                    >
                                                        <Flag size={11} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </React.Fragment>
                            );
                        })}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Warning Banner */}
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

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border-t border-red-200 px-4 py-2 flex items-center justify-between text-red-600 text-sm"
                    >
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="hover:bg-red-100 p-1 rounded">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-secondary-100">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-[15px]"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="rounded-xl w-11 h-11 p-0 flex items-center justify-center"
                    >
                        <Send size={18} className={isSending ? 'animate-pulse' : ''} />
                    </Button>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-secondary-900">Delete Conversation?</h3>
                                    <p className="text-sm text-secondary-500">This cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-secondary-600 mb-6 text-sm">
                                This will hide all messages from your view. Messages are preserved for safety.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                                    Cancel
                                </Button>
                                <Button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700">
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Report Modal */}
            <AnimatePresence>
                {reportingMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Flag className="text-orange-600" size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-secondary-900">Report Message</h3>
                                    <p className="text-sm text-secondary-500">Select a reason</p>
                                </div>
                            </div>
                            <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                                <p className="text-secondary-700 text-sm line-clamp-2">"{reportingMessage.content}"</p>
                            </div>
                            <div className="space-y-2 mb-4">
                                {['Inappropriate content', 'Harassment', 'Spam', 'Scam or fraud', 'Other'].map(reason => (
                                    <button
                                        key={reason}
                                        onClick={() => handleReport(reason)}
                                        disabled={isReporting}
                                        className="w-full px-4 py-2.5 text-left border border-secondary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors disabled:opacity-50 text-sm font-medium"
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setReportingMessage(null)}
                                className="w-full px-4 py-2.5 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors text-sm font-medium"
                                disabled={isReporting}
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
