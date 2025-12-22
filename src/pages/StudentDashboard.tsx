import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { ReviewModal } from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    MessageCircle, BookOpen, Star, DollarSign,
    Calendar, Video, X, ChevronLeft, ChevronRight,
    Search, GraduationCap, AlertTriangle, RefreshCw
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

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
    const [disputeBooking, setDisputeBooking] = useState<Booking | null>(null);
    const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
    const [disputeReason, setDisputeReason] = useState('');
    const [rescheduleAvailability, setRescheduleAvailability] = useState<{ [day: string]: string[] }>({});
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
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

    const handleDispute = async () => {
        if (!disputeBooking || !disputeReason.trim()) return;
        try {
            const response = await fetch(`/api/bookings/${disputeBooking.id}/dispute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: disputeReason })
            });
            if (response.ok) {
                setBookings(prev => prev.map(b => b.id === disputeBooking.id ? { ...b, status: 'disputed' } : b));
                setDisputeBooking(null);
                setDisputeReason('');
                alert('Dispute submitted. Admin will review.');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to submit dispute');
            }
        } catch (err) {
            console.error('Dispute error:', err);
        }
    };

    const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Timezone helpers
    const getTimezoneAbbr = (): string => {
        const date = new Date();
        const timeString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' });
        const parts = timeString.split(' ');
        return parts[parts.length - 1]; // e.g., 'PST'
    };

    // Convert UTC time (e.g., '14:00') to local time for display on a specific date
    const convertUtcToLocal = (utcTime: string, dateStr: string): string => {
        const [hours, minutes] = utcTime.split(':').map(Number);
        const date = new Date(dateStr + 'T00:00:00Z');
        date.setUTCHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const openRescheduleModal = async (booking: Booking) => {
        setRescheduleBooking(booking);
        setRescheduleLoading(true);
        setRescheduleDate('');
        setRescheduleTime('');
        try {
            const response = await fetch(`/api/tutors/${booking.tutorId}/availability`);
            if (response.ok) {
                const data = await response.json();
                setRescheduleAvailability(data.availability || {});
            }
        } catch (err) {
            console.error('Failed to fetch availability:', err);
        } finally {
            setRescheduleLoading(false);
        }
    };

    const getNextDays = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({
                date: date.toISOString().split('T')[0],
                dayName: DAYS_OF_WEEK[date.getDay()],
                display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            });
        }
        return days;
    };

    const handleReschedule = async () => {
        if (!rescheduleBooking || !rescheduleDate || !rescheduleTime) return;
        try {
            const response = await fetch(`/api/bookings/${rescheduleBooking.id}/reschedule`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newDate: rescheduleDate, newTime: rescheduleTime })
            });
            if (response.ok) {
                setBookings(prev => prev.map(b => b.id === rescheduleBooking.id
                    ? { ...b, date: rescheduleDate, time: rescheduleTime } : b));
                setRescheduleBooking(null);
                setRescheduleDate('');
                setRescheduleTime('');
                alert('Session rescheduled successfully!');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to reschedule');
            }
        } catch (err) {
            console.error('Reschedule error:', err);
        }
    };

    // Filter bookings
    const now = new Date();

    // Get next upcoming lesson first (needed for filter below)
    const upcomingLessons = bookings
        .filter(b => new Date(b.date) >= now && b.status !== 'cancelled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const nextLesson = upcomingLessons[0] || null;

    const filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        const matchesSearch = b.tutorName?.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        switch (activeTab) {
            case 'upcoming':
                // Exclude the next lesson since it's shown in the hero card
                if (nextLesson && b.id === nextLesson.id) return false;
                return bookingDate >= now && b.status !== 'cancelled';
            case 'completed': return bookingDate < now && b.status !== 'cancelled';
            case 'cancelled': return b.status === 'cancelled';
            default: return true;
        }
    });

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Stats
    const upcomingCount = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled').length;
    const upcomingListCount = nextLesson ? upcomingCount - 1 : upcomingCount; // Exclude next lesson from tab count
    const completedCount = bookings.filter(b => new Date(b.date) < now && b.status !== 'cancelled').length;
    const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.hourlyRate * b.duration / 60), 0);
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

    const stats = [
        { label: 'Total Lessons', value: completedCount, icon: BookOpen, color: 'bg-primary-500' },
        { label: 'Upcoming', value: upcomingCount, icon: Calendar, color: 'bg-green-500' },
        { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}`, icon: DollarSign, color: 'bg-purple-500' },
    ];

    const tabs = [
        { id: 'upcoming' as TabType, label: 'Upcoming', count: upcomingListCount },
        { id: 'completed' as TabType, label: 'Completed', count: completedCount },
        { id: 'cancelled' as TabType, label: 'Cancelled', count: cancelledCount }
    ];

    // Pending reviews
    const pendingReviews = bookings.filter(b => new Date(b.date) < now && b.status !== 'cancelled' && !b.reviewed);
    const isPast = (booking: Booking) => new Date(booking.date) < new Date();

    // Calculate time until next lesson
    const getTimeUntil = (dateStr: string, timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const lessonDate = new Date(dateStr + 'T00:00:00');
        lessonDate.setHours(hours, minutes, 0, 0);
        const diff = lessonDate.getTime() - now.getTime();
        if (diff < 0) return 'Starting soon';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
        if (hrs > 0) return `in ${hrs} hour${hrs > 1 ? 's' : ''}`;
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `in ${mins} min`;
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-secondary-900">
                                    Welcome back, <span className="text-primary-600">{displayName}</span>! 👋
                                </h1>
                                <p className="text-secondary-600 mt-1">Ready to learn some Punjabi today?</p>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/tutors">
                                    <Button className="flex items-center gap-2">
                                        <GraduationCap size={18} /> Find a Tutor
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.header>

                    {/* Hero Section: Next Lesson + Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Next Lesson Hero Card */}
                        <div className="lg:col-span-2 flex">
                            {nextLesson ? (
                                <Card className="flex-1 p-5 border-l-4 border-l-primary-500 bg-white">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-2 text-secondary-500 text-sm mb-3">
                                            <Calendar size={16} className="text-primary-500" />
                                            <span className="font-medium text-secondary-700">Your Next Lesson</span>
                                            <span className="ml-auto bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {getTimeUntil(nextLesson.date, nextLesson.time)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-lg font-bold text-primary-600">
                                                {nextLesson.tutorName?.charAt(0) || 'T'}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-lg font-bold text-secondary-900">{nextLesson.tutorName}</h2>
                                                <p className="text-secondary-500 text-sm">
                                                    {new Date(nextLesson.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {convertUtcToLocal(nextLesson.time, nextLesson.date)} {getTimezoneAbbr()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-secondary-100">
                                            {nextLesson.meetingLink && (
                                                <a href={nextLesson.meetingLink} target="_blank" rel="noopener noreferrer">
                                                    <Button size="sm" className="flex items-center gap-2">
                                                        <Video size={16} /> Join Lesson
                                                    </Button>
                                                </a>
                                            )}
                                            <Link to={`/messages?to=${nextLesson.tutorEmail}`}>
                                                <Button size="sm" variant="outline" className="flex items-center gap-2">
                                                    <MessageCircle size={16} /> Message
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => openRescheduleModal(nextLesson)}>
                                                <RefreshCw size={16} /> Reschedule
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCancelBooking(nextLesson.id)}>
                                                <X size={16} /> Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-8 bg-gradient-to-br from-secondary-50 to-white border-dashed border-2 border-secondary-200 text-center">
                                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <GraduationCap size={32} className="text-primary-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-secondary-900 mb-2">No Upcoming Lessons</h2>
                                    <p className="text-secondary-500 mb-4">Ready to learn some Punjabi? Book your first lesson!</p>
                                    <Link to="/tutors">
                                        <Button className="flex items-center gap-2 mx-auto">
                                            <Search size={16} /> Find a Tutor
                                        </Button>
                                    </Link>
                                </Card>
                            )}
                        </div>

                        {/* Stats Sidebar */}
                        <div className="space-y-4">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                {stats.map((stat, i) => (
                                    <Card key={i} className="p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${stat.color} text-white`}>
                                                <stat.icon size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-secondary-900">{stat.value}</p>
                                                <p className="text-xs text-secondary-500">{stat.label}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pending Reviews */}
                            {pendingReviews.length > 0 && (
                                <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Star size={18} className="text-yellow-600" />
                                        <p className="font-medium text-secondary-900 text-sm">{pendingReviews.length} lesson{pendingReviews.length > 1 ? 's' : ''} to review</p>
                                    </div>
                                    <Button size="sm" className="w-full" onClick={() => setReviewBooking(pendingReviews[0])}>
                                        <Star size={14} className="mr-2" /> Review Now
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </motion.div>

                    {/* UNIFIED: Tabs + Bookings List in One Card */}
                    <Card className="overflow-hidden">
                        {/* Header with Tabs and Search */}
                        <div className="p-4 border-b border-secondary-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex gap-1">
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
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-secondary-200'
                                            }`}>{tab.count}</span>
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
                                        className="pl-9 pr-4 py-2 border border-secondary-200 rounded-lg text-sm w-40 focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                        {/* Bookings List - Inside Same Card */}
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar size={28} className="text-primary-600" />
                                </div>
                                <h3 className="text-lg font-bold text-secondary-900 mb-2">
                                    {activeTab === 'upcoming' ? 'No upcoming lessons' : activeTab === 'completed' ? 'No completed lessons yet' : 'No cancelled lessons'}
                                </h3>
                                <p className="text-secondary-500 mb-4">
                                    {activeTab === 'upcoming' ? 'Book your first lesson to get started!' : 'Your lesson history will appear here.'}
                                </p>
                                {activeTab === 'upcoming' && (
                                    <Link to="/tutors"><Button size="sm">Find a Tutor</Button></Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-secondary-100">
                                    {paginatedBookings.map(booking => (
                                        <div key={booking.id} className="p-4 hover:bg-secondary-50 transition-colors flex items-center justify-between gap-4">
                                            {/* Tutor Info */}
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                                                    {booking.tutorName?.charAt(0) || 'T'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-secondary-900 truncate">{booking.tutorName}</p>
                                                    <p className="text-sm text-secondary-500">
                                                        {new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {convertUtcToLocal(booking.time, booking.date)} {getTimezoneAbbr()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Details - Hidden on small screens */}
                                            <div className="hidden md:flex items-center gap-8 text-sm">
                                                <div className="text-center w-16">
                                                    <p className="text-secondary-400 text-xs">Duration</p>
                                                    <p className="font-medium text-secondary-800">{booking.duration} min</p>
                                                </div>
                                                <div className="text-center w-16">
                                                    <p className="text-secondary-400 text-xs">Price</p>
                                                    <p className="font-medium text-secondary-800">${(booking.hourlyRate * booking.duration / 60).toFixed(0)}</p>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {!isPast(booking) && booking.status !== 'cancelled' && booking.meetingLink && (
                                                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                                                            <Video size={14} /> Join
                                                        </Button>
                                                    </a>
                                                )}
                                                <Link to={`/messages?to=${booking.tutorEmail || ''}`}>
                                                    <Button size="sm" variant="outline"><MessageCircle size={14} /></Button>
                                                </Link>
                                                {isPast(booking) && booking.status !== 'cancelled' && !booking.reviewed && (
                                                    <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300" onClick={() => setReviewBooking(booking)}>
                                                        <Star size={14} />
                                                    </Button>
                                                )}
                                                {/* Dispute button - for past sessions */}
                                                {isPast(booking) && booking.status !== 'cancelled' && booking.status !== 'disputed' && (
                                                    <Button size="sm" variant="outline" className="text-orange-500 border-orange-200 hover:bg-orange-50" onClick={() => setDisputeBooking(booking)} title="Dispute - Teacher didn't show">
                                                        <AlertTriangle size={14} />
                                                    </Button>
                                                )}
                                                {/* Reschedule button - for upcoming sessions */}
                                                {!isPast(booking) && booking.status !== 'cancelled' && (
                                                    <Button size="sm" variant="outline" className="text-blue-500 border-blue-200 hover:bg-blue-50" onClick={() => openRescheduleModal(booking)} title="Reschedule">
                                                        <RefreshCw size={14} />
                                                    </Button>
                                                )}
                                                {!isPast(booking) && booking.status !== 'cancelled' && (
                                                    <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleCancelBooking(booking.id)}>
                                                        <X size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination - Inside Card */}
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
                                        <p className="text-sm text-secondary-500">
                                            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                                <ChevronLeft size={16} />
                                            </Button>
                                            <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                                <ChevronRight size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>

                    {/* Single CTA - Apply as Teacher */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6">
                        <Link to="/teach">
                            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-accent-50 to-orange-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent-100 rounded-xl text-accent-600">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-secondary-900">Want to teach?</p>
                                        <p className="text-sm text-secondary-500">Apply to become a Punjabi teacher</p>
                                    </div>
                                </div>
                                <Button variant="outline">Apply Now</Button>
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

            {/* Dispute Modal */}
            <AnimatePresence>
                {disputeBooking && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDisputeBooking(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="w-full max-w-md p-6 bg-white" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-orange-500" size={24} />
                                    Dispute Session
                                </h2>
                                <p className="text-secondary-600 mb-4">
                                    If your teacher didn't show up or there was an issue, please describe what happened:
                                </p>
                                <textarea
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    placeholder="Describe the issue..."
                                    className="w-full p-3 border border-secondary-200 rounded-lg mb-4 h-24 resize-none"
                                />
                                <p className="text-sm text-secondary-500 mb-4">
                                    Session: {disputeBooking.tutorName} on {disputeBooking.date} at {disputeBooking.time}
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => { setDisputeBooking(null); setDisputeReason(''); }} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleDispute} disabled={!disputeReason.trim()} className="flex-1 bg-orange-500 hover:bg-orange-600">
                                        Submit Dispute
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reschedule Modal */}
            <AnimatePresence>
                {rescheduleBooking && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRescheduleBooking(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="w-full max-w-lg p-6 bg-white" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                    <RefreshCw className="text-blue-500" size={24} />
                                    Reschedule Session
                                </h2>
                                <p className="text-sm text-secondary-500 mb-4">
                                    Current: <strong>{rescheduleBooking.tutorName}</strong> on {rescheduleBooking.date} at {rescheduleBooking.time}
                                </p>

                                {rescheduleLoading ? (
                                    <div className="py-8 text-center text-secondary-500">Loading availability...</div>
                                ) : (
                                    <>
                                        {/* Date Selection */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Select New Date</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {getNextDays().map(day => {
                                                    const hasSlots = (rescheduleAvailability[day.dayName] || []).length > 0;
                                                    return (
                                                        <button
                                                            key={day.date}
                                                            disabled={!hasSlots}
                                                            onClick={() => { setRescheduleDate(day.date); setRescheduleTime(''); }}
                                                            className={`p-2 rounded-lg text-xs transition-all ${rescheduleDate === day.date
                                                                ? 'bg-blue-500 text-white'
                                                                : hasSlots
                                                                    ? 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                                    : 'bg-secondary-50 text-secondary-300 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {day.display}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Time Selection */}
                                        {rescheduleDate && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Select New Time</label>
                                                <p className="text-xs text-secondary-500 mb-2">🌍 Times shown in your timezone ({getTimezoneAbbr()})</p>
                                                {(() => {
                                                    const dayName = DAYS_OF_WEEK[new Date(rescheduleDate + 'T12:00:00').getDay()];
                                                    const slots = rescheduleAvailability[dayName] || [];
                                                    return slots.length === 0 ? (
                                                        <p className="text-secondary-500 text-sm">No slots available</p>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {slots.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setRescheduleTime(time)}
                                                                    className={`p-2 rounded-lg text-sm transition-all ${rescheduleTime === time
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                                        }`}
                                                                >
                                                                    {convertUtcToLocal(time, rescheduleDate)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <Button variant="outline" onClick={() => { setRescheduleBooking(null); setRescheduleDate(''); setRescheduleTime(''); }} className="flex-1">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime} className="flex-1">
                                                Confirm Reschedule
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};
