import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { ReviewModal } from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    MessageCircle, BookOpen, Star, DollarSign, Clock,
    Calendar, MoreVertical, Video, X, ChevronLeft, ChevronRight,
    Search, GraduationCap
} from 'lucide-react';

interface Booking {
    id: string;
    tutorId: string;
    tutorName: string;
    tutorEmail?: string;
    date: string;
    time: string;
    duration: number;
    hourlyRate: number;
    status: string;
    reviewed?: boolean;
    meetingLink?: string;
}

type TabType = 'upcoming' | 'completed' | 'cancelled';

// Action Dropdown Component
const ActionDropdown: React.FC<{
    booking: Booking;
    onCancel: () => void;
    onReview: () => void;
    onChat: () => void;
}> = ({ booking, onCancel, onReview, onChat }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isPast = new Date(booking.date) < new Date();
    const canJoin = !isPast && booking.status === 'confirmed' && booking.meetingLink;
    const canReview = isPast && booking.status !== 'cancelled' && !booking.reviewed;
    const canCancel = !isPast && booking.status !== 'cancelled';

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                <MoreVertical size={18} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
                        {canJoin && (
                            <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer"
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 text-primary-700 flex items-center gap-2">
                                <Video size={16} /> Join Meeting
                            </a>
                        )}
                        <button onClick={() => { onChat(); setIsOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary-50 text-secondary-700 flex items-center gap-2">
                            <MessageCircle size={16} /> Message Tutor
                        </button>
                        {canReview && (
                            <button onClick={() => { onReview(); setIsOpen(false); }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-50 text-yellow-700 flex items-center gap-2">
                                <Star size={16} /> Leave Review
                            </button>
                        )}
                        {canCancel && (
                            <button onClick={() => { onCancel(); setIsOpen(false); }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 border-t">
                                <X size={16} /> Cancel Booking
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const displayName = user?.userDetails?.split('@')[0] || 'Student';

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings/student');
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (err) {
            console.error('Failed to load bookings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this lesson?')) return;
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
            if (response.ok) {
                setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
            } else {
                alert('Failed to cancel booking');
            }
        } catch (err) {
            console.error('Cancel error:', err);
        }
    };

    // Filter bookings by tab
    const now = new Date();
    const filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        const matchesSearch = b.tutorName?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        switch (activeTab) {
            case 'upcoming':
                return bookingDate >= now && b.status !== 'cancelled';
            case 'completed':
                return bookingDate < now && b.status !== 'cancelled';
            case 'cancelled':
                return b.status === 'cancelled';
            default:
                return true;
        }
    });

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Stats
    const upcomingCount = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled').length;
    const completedCount = bookings.filter(b => new Date(b.date) < now && b.status !== 'cancelled').length;
    const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.hourlyRate * b.duration / 60), 0);
    const nextLesson = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const stats = [
        { label: 'Total Lessons', value: completedCount, icon: BookOpen, color: 'bg-primary-500' },
        { label: 'Upcoming', value: upcomingCount, icon: Calendar, color: 'bg-green-500' },
        { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}`, icon: DollarSign, color: 'bg-purple-500' },
        { label: 'Next Lesson', value: nextLesson ? new Date(nextLesson.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None', icon: Clock, color: 'bg-orange-500' }
    ];

    const tabs = [
        { id: 'upcoming' as TabType, label: 'Upcoming', count: upcomingCount },
        { id: 'completed' as TabType, label: 'Completed', count: completedCount },
        { id: 'cancelled' as TabType, label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
    ];

    // Pending reviews
    const pendingReviews = bookings.filter(b => new Date(b.date) < now && b.status !== 'cancelled' && !b.reviewed);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-secondary-900">
                                    Welcome back, <span className="text-primary-600">{displayName}</span>! 👋
                                </h1>
                                <p className="text-secondary-600 mt-1">Ready to learn some Punjabi today?</p>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/messages">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <MessageCircle size={18} /> Messages
                                    </Button>
                                </Link>
                                <Link to="/tutors">
                                    <Button className="flex items-center gap-2">
                                        <GraduationCap size={18} /> Find a Tutor
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.header>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {stats.map((stat, i) => (
                            <Card key={i} className="p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                                        <stat.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                                        <p className="text-xs text-secondary-500">{stat.label}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Pending Reviews Alert */}
                    {pendingReviews.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6"
                        >
                            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <Star size={20} className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-secondary-900">{pendingReviews.length} lesson{pendingReviews.length > 1 ? 's' : ''} waiting for your review</p>
                                            <p className="text-sm text-secondary-600">Help your tutors by leaving feedback!</p>
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={() => setReviewBooking(pendingReviews[0])}>
                                        Review Now
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Tabs & Filters */}
                    <Card className="p-4 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex gap-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id
                                                ? 'bg-primary-600 text-white'
                                                : 'text-secondary-600 hover:bg-secondary-100'
                                            }`}
                                    >
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-secondary-200'
                                                }`}>{tab.count}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search tutor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-2 border border-secondary-200 rounded-lg text-sm w-48 focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                                >
                                    <option value={10}>10 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Bookings Table */}
                    {isLoading ? (
                        <Card className="p-12 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                        </Card>
                    ) : filteredBookings.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar size={32} className="text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">
                                {activeTab === 'upcoming' ? 'No upcoming lessons' : activeTab === 'completed' ? 'No completed lessons yet' : 'No cancelled lessons'}
                            </h3>
                            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                                {activeTab === 'upcoming' ? 'Book your first lesson with a native Punjabi speaker!' : 'Your lesson history will appear here.'}
                            </p>
                            {activeTab === 'upcoming' && (
                                <Link to="/tutors"><Button>Find a Tutor</Button></Link>
                            )}
                        </Card>
                    ) : (
                        <>
                            <Card className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Tutor</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Date & Time</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Duration</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Price</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Status</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary-100">
                                            {paginatedBookings.map(booking => (
                                                <tr key={booking.id} className="hover:bg-secondary-50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                                {booking.tutorName?.charAt(0) || 'T'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-secondary-900">{booking.tutorName}</p>
                                                                <p className="text-xs text-secondary-500">{booking.tutorEmail || ''}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="text-secondary-900">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                                        <p className="text-sm text-secondary-500">{booking.time}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-secondary-700">{booking.duration} min</td>
                                                    <td className="px-4 py-4 font-medium text-secondary-900">${(booking.hourlyRate * booking.duration / 60).toFixed(0)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <ActionDropdown
                                                            booking={booking}
                                                            onCancel={() => handleCancelBooking(booking.id)}
                                                            onReview={() => setReviewBooking(booking)}
                                                            onChat={() => window.location.href = `/messages?to=${booking.tutorEmail || ''}`}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-2">
                                    <p className="text-sm text-secondary-500">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <span className="px-3 py-1 text-sm text-secondary-600">Page {currentPage} of {totalPages}</span>
                                        <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => window.location.href = '/tutors'}>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-100 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary-900">Find a Tutor</p>
                                    <p className="text-sm text-secondary-500">Browse available teachers</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => window.location.href = '/messages'}>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <MessageCircle size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary-900">Messages</p>
                                    <p className="text-sm text-secondary-500">Chat with your tutors</p>
                                </div>
                            </div>
                        </Card>
                        <Link to="/teach" className="sm:col-span-2 lg:col-span-1">
                            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-r from-accent-50 to-orange-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent-100 rounded-xl text-accent-600 group-hover:bg-accent-600 group-hover:text-white transition-colors">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-secondary-900">Become a Teacher</p>
                                        <p className="text-sm text-secondary-500">Share your knowledge</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewBooking && (
                    <ReviewModal
                        booking={reviewBooking}
                        onClose={() => setReviewBooking(null)}
                        onSuccess={() => {
                            setReviewBooking(null);
                            setBookings(prev => prev.map(b => b.id === reviewBooking.id ? { ...b, reviewed: true } : b));
                        }}
                    />
                )}
            </AnimatePresence>
        </Layout>
    );
};
