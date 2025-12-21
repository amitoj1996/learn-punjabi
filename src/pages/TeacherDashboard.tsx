import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import {
    MessageCircle, DollarSign, Star, Clock, Users, Calendar,
    Video, X, ChevronLeft, ChevronRight, Search, Settings,
    MoreVertical, BookOpen, CheckCircle, AlertCircle
} from 'lucide-react';

interface Application {
    id: string;
    fullName: string;
    email: string;
    submittedAt: string;
}

interface TutorProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    hourlyRate: number;
    languages: string[];
    rating: number;
    reviewCount: number;
}

interface Booking {
    id: string;
    studentEmail: string;
    date: string;
    time: string;
    duration: number;
    hourlyRate: number;
    status: string;
    meetingLink?: string;
}

interface TeacherStatus {
    hasApplication: boolean;
    status: 'none' | 'pending' | 'approved' | 'rejected';
    application: Application | null;
    tutorProfile: TutorProfile | null;
}

type TabType = 'upcoming' | 'completed' | 'cancelled';

// Action Dropdown Component
const ActionDropdown: React.FC<{
    booking: Booking;
    onCancel: () => void;
    onChat: () => void;
}> = ({ booking, onCancel, onChat }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isPast = new Date(booking.date) < new Date();
    const canJoin = !isPast && booking.status !== 'cancelled' && booking.meetingLink;
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
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 text-green-700 flex items-center gap-2">
                                <Video size={16} /> Join Meeting
                            </a>
                        )}
                        <button onClick={() => { onChat(); setIsOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary-50 text-secondary-700 flex items-center gap-2">
                            <MessageCircle size={16} /> Message Student
                        </button>
                        {canCancel && (
                            <button onClick={() => { onCancel(); setIsOpen(false); }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 border-t">
                                <X size={16} /> Cancel Session
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export const TeacherDashboard: React.FC = () => {
    const [data, setData] = useState<TeacherStatus | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/teacher/status');
            if (response.ok) {
                const result = await response.json();
                setData(result);
                if (result.status === 'approved') {
                    fetchBookings();
                }
            } else {
                setError(`Failed to load: ${await response.text()}`);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings/teacher');
            if (response.ok) {
                setBookings(await response.json());
            }
        } catch (err) {
            console.error('Failed to load bookings:', err);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this session?')) return;
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

    // Loading State
    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </Layout>
        );
    }

    // Error State
    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <Card className="p-8 bg-red-50 border-red-200 max-w-2xl mx-auto text-center">
                        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
                        <p className="text-red-600">{error}</p>
                    </Card>
                </div>
            </Layout>
        );
    }

    // No Application State
    if (!data?.hasApplication) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
                        <Card className="p-8 text-center">
                            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen size={40} className="text-accent-600" />
                            </div>
                            <h1 className="text-2xl font-display font-bold text-secondary-900 mb-4">Become a Teacher</h1>
                            <p className="text-secondary-600 mb-8">Share your knowledge of Punjabi with students worldwide and earn on your own schedule.</p>
                            <Link to="/teach">
                                <Button size="lg" className="w-full">Apply Now</Button>
                            </Link>
                        </Card>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    // Pending State
    if (data.status === 'pending') {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
                        <Card className="p-8 text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock size={40} className="text-yellow-600" />
                            </div>
                            <h1 className="text-2xl font-display font-bold text-secondary-900 mb-2">Application Under Review</h1>
                            <p className="text-sm text-secondary-500 mb-6">Submitted {new Date(data.application?.submittedAt || '').toLocaleDateString()}</p>
                            <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
                                <p className="text-blue-800 text-sm flex items-center gap-2 justify-center">
                                    <AlertCircle size={16} /> Our team reviews applications within 24-48 hours.
                                </p>
                            </Card>
                            <p className="text-secondary-500 text-sm">We'll email you at <strong>{data.application?.email}</strong> once reviewed.</p>
                        </Card>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    // Rejected State
    if (data.status === 'rejected') {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
                        <Card className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <X size={40} className="text-red-600" />
                            </div>
                            <h1 className="text-2xl font-display font-bold text-secondary-900 mb-2">Application Not Approved</h1>
                            <p className="text-secondary-600 mb-6">Unfortunately, your application was not approved at this time. You're welcome to apply again with additional details.</p>
                            <Link to="/teach">
                                <Button variant="outline" size="lg">Apply Again</Button>
                            </Link>
                        </Card>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    // APPROVED - Full Dashboard
    const profile = data.tutorProfile;
    const now = new Date();

    // Filter bookings
    const filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        const matchesSearch = b.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        switch (activeTab) {
            case 'upcoming': return bookingDate >= now && b.status !== 'cancelled';
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
    const completedCount = bookings.filter(b => new Date(b.date) < now && b.status !== 'cancelled').length;
    const totalEarnings = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.hourlyRate * b.duration / 60), 0);
    const uniqueStudents = new Set(bookings.map(b => b.studentEmail)).size;

    const stats = [
        { label: 'Total Sessions', value: completedCount, icon: BookOpen, color: 'bg-primary-500' },
        { label: 'Total Earned', value: `$${totalEarnings.toFixed(0)}`, icon: DollarSign, color: 'bg-green-500' },
        { label: 'Rating', value: profile?.rating ? `${profile.rating.toFixed(1)} ⭐` : 'New', icon: Star, color: 'bg-yellow-500' },
        { label: 'Students', value: uniqueStudents, icon: Users, color: 'bg-purple-500' }
    ];

    const tabs = [
        { id: 'upcoming' as TabType, label: 'Upcoming', count: upcomingCount },
        { id: 'completed' as TabType, label: 'Completed', count: completedCount },
        { id: 'cancelled' as TabType, label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-secondary-900">
                                    Welcome back, <span className="text-primary-600">{profile?.name || 'Teacher'}</span>! 🎉
                                </h1>
                                <p className="text-secondary-600 mt-1">Manage your sessions and grow your teaching practice.</p>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/messages">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <MessageCircle size={18} /> Messages
                                    </Button>
                                </Link>
                                <Link to="/edit-profile">
                                    <Button className="flex items-center gap-2">
                                        <Settings size={18} /> Edit Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.header>

                    {/* Stats Cards */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

                    {/* Profile Summary */}
                    <Card className="p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl">
                                    {profile?.name?.charAt(0) || 'T'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-secondary-900">{profile?.name}</h2>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                                            <CheckCircle size={12} /> Active
                                        </span>
                                    </div>
                                    <p className="text-secondary-500">${profile?.hourlyRate}/hr • {profile?.languages?.join(', ') || 'Punjabi'}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/availability">
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Calendar size={16} /> Set Availability
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>

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
                                        placeholder="Search student..."
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
                    {filteredBookings.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar size={32} className="text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">
                                {activeTab === 'upcoming' ? 'No upcoming sessions' : activeTab === 'completed' ? 'No completed sessions yet' : 'No cancelled sessions'}
                            </h3>
                            <p className="text-secondary-600 max-w-md mx-auto">
                                {activeTab === 'upcoming' ? 'When students book lessons with you, they will appear here.' : 'Your session history will appear here.'}
                            </p>
                        </Card>
                    ) : (
                        <>
                            <Card className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Student</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Date & Time</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Duration</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Earnings</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Status</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary-100">
                                            {paginatedBookings.map(booking => (
                                                <tr key={booking.id} className="hover:bg-secondary-50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 font-bold">
                                                                {booking.studentEmail?.charAt(0).toUpperCase() || 'S'}
                                                            </div>
                                                            <p className="font-medium text-secondary-900">{booking.studentEmail?.split('@')[0]}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="text-secondary-900">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                                        <p className="text-sm text-secondary-500">{booking.time}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-secondary-700">{booking.duration} min</td>
                                                    <td className="px-4 py-4 font-medium text-green-600">${(booking.hourlyRate * booking.duration / 60).toFixed(0)}</td>
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
                                                            onChat={() => window.location.href = `/messages?to=${booking.studentEmail}`}
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 grid sm:grid-cols-3 gap-4">
                        <Link to="/availability">
                            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary-100 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-secondary-900">Set Availability</p>
                                        <p className="text-sm text-secondary-500">Manage your schedule</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        <Link to="/edit-profile">
                            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <Settings size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-secondary-900">Edit Profile</p>
                                        <p className="text-sm text-secondary-500">Update bio & rates</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        <Link to="/messages">
                            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-secondary-900">Messages</p>
                                        <p className="text-sm text-secondary-500">Chat with students</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};
