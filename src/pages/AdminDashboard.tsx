import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { Users, BookOpen, CheckCircle, Clock, XCircle, Search, Filter, TrendingUp } from 'lucide-react';

interface Application {
    id: string;
    userId: string;
    name: string;
    fullName: string;
    email: string;
    bio: string;
    hourlyRate: number;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

interface PlatformStats {
    totalStudents: number;
    totalTutors: number;
    totalBookings: number;
    pendingApplications: number;
}

// Animated counter for stats
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1.5 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = value / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

// Skeleton loader for cards
const ApplicationSkeleton: React.FC = () => (
    <div className="p-6 bg-white rounded-xl border border-secondary-100 animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-secondary-200 rounded-full" />
                <div>
                    <div className="h-5 bg-secondary-200 rounded w-32 mb-2" />
                    <div className="h-4 bg-secondary-100 rounded w-40" />
                </div>
            </div>
            <div className="h-6 bg-yellow-100 rounded-full w-16" />
        </div>
        <div className="h-4 bg-secondary-100 rounded w-full mb-2" />
        <div className="h-4 bg-secondary-100 rounded w-3/4 mb-4" />
        <div className="flex gap-3 justify-end">
            <div className="h-8 bg-secondary-100 rounded w-20" />
            <div className="h-8 bg-secondary-200 rounded w-28" />
        </div>
    </div>
);

// Confirmation Modal
const ConfirmModal: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}> = ({ isOpen, title, message, confirmText, confirmVariant, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{title}</h3>
                <p className="text-secondary-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

// Toast notification
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}
        >
            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-medium">{message}</span>
        </motion.div>
    );
};

export const AdminDashboard: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<PlatformStats>({ totalStudents: 0, totalTutors: 0, totalBookings: 0, pendingApplications: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'approve' | 'reject'; appId: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchApplications();
        fetchStats();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/manager/applications');
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
                setError(null);
            } else {
                const errorBody = await response.text();
                setError(`Failed (${response.status}): ${errorBody || response.statusText}`);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        // Simulated stats - in production, fetch from API
        setStats({
            totalStudents: 142,
            totalTutors: 18,
            totalBookings: 567,
            pendingApplications: applications.filter(a => a.status === 'pending').length
        });
    };

    const handleApprove = async (id: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: id })
            });
            if (response.ok) {
                setApplications(prev => prev.map(app =>
                    app.id === id ? { ...app, status: 'approved' as const } : app
                ));
                setToast({ message: 'Teacher approved successfully! 🎉', type: 'success' });
            } else {
                setToast({ message: 'Failed to approve teacher', type: 'error' });
            }
        } catch (err) {
            console.error("Error approving teacher:", err);
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleReject = async (id: string) => {
        setIsProcessing(true);
        try {
            // In production, make API call to reject
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: 'rejected' as const } : app
            ));
            setToast({ message: 'Application rejected', type: 'success' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = (app.fullName || app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const statCards = [
        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'primary', trend: '+12%' },
        { label: 'Active Tutors', value: stats.totalTutors, icon: BookOpen, color: 'green', trend: '+5%' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: CheckCircle, color: 'accent', trend: '+23%' },
        { label: 'Pending Review', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'yellow', trend: '' }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">Admin Dashboard</h1>
                                <p className="text-secondary-600 mt-1">Manage the platform and review applications</p>
                            </div>
                            <Button onClick={fetchApplications} variant="outline" className="flex items-center gap-2">
                                <TrendingUp size={18} />
                                Refresh Data
                            </Button>
                        </div>
                    </motion.header>

                    {/* Stats Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10"
                    >
                        {statCards.map((stat, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow group">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-2 md:p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={20} />
                                        </div>
                                        {stat.trend && (
                                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                {stat.trend}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-2xl md:text-3xl font-bold text-secondary-900">
                                            <AnimatedNumber value={stat.value} />
                                        </div>
                                        <div className="text-sm text-secondary-500 mt-1">{stat.label}</div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Applications Section */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                            {/* Filters */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row gap-4 mb-6"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${statusFilter === status
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                                                }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Error State */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 flex items-center gap-3"
                                >
                                    <XCircle size={20} />
                                    <span><strong>Error:</strong> {error}</span>
                                </motion.div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => <ApplicationSkeleton key={i} />)}
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && !error && filteredApplications.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Card className="p-12 text-center">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-secondary-900 mb-2">All caught up!</h3>
                                        <p className="text-secondary-500">No {statusFilter !== 'all' ? statusFilter : ''} applications to review.</p>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Applications Grid */}
                            {!isLoading && !error && filteredApplications.length > 0 && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                                >
                                    <AnimatePresence>
                                        {filteredApplications.map((app) => (
                                            <motion.div
                                                key={app.id}
                                                variants={itemVariants}
                                                layout
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                                                                {(app.fullName || app.name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-secondary-900">{app.fullName || app.name}</h3>
                                                                <p className="text-sm text-secondary-500 truncate max-w-[150px]">{app.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 space-y-2 text-sm mb-4">
                                                        <p className="text-secondary-600 line-clamp-2">{app.bio || 'No bio provided'}</p>
                                                        <div className="flex items-center gap-4 text-secondary-500">
                                                            <span className="font-semibold text-primary-600">${app.hourlyRate}/hr</span>
                                                            <span className="text-xs">Applied {new Date(app.submittedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>

                                                    {app.status === 'pending' && (
                                                        <div className="flex gap-2 pt-4 border-t border-secondary-100">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 text-red-600 hover:bg-red-50 hover:border-red-300"
                                                                onClick={() => setConfirmModal({ isOpen: true, type: 'reject', appId: app.id })}
                                                            >
                                                                Reject
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => setConfirmModal({ isOpen: true, type: 'approve', appId: app.id })}
                                                            >
                                                                Approve
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            {confirmModal && (
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    title={confirmModal.type === 'approve' ? 'Approve Teacher' : 'Reject Application'}
                    message={confirmModal.type === 'approve'
                        ? 'This will grant the applicant teacher privileges and add them to the tutor pool.'
                        : 'This will reject the application. The applicant will need to reapply.'
                    }
                    confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Reject'}
                    confirmVariant={confirmModal.type === 'approve' ? 'primary' : 'danger'}
                    onConfirm={() => confirmModal.type === 'approve' ? handleApprove(confirmModal.appId) : handleReject(confirmModal.appId)}
                    onCancel={() => setConfirmModal(null)}
                    isLoading={isProcessing}
                />
            )}

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </Layout>
    );
};
