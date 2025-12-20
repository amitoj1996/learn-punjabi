import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import {
    Users, CheckCircle, Clock, XCircle, Search, TrendingUp,
    Flag, UserX, UserCheck
} from 'lucide-react';

interface Application {
    id: string;
    userId: string;
    name: string;
    fullName: string;
    email: string;
    bio: string;
    hourlyRate: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    submittedAt: string;
}

interface Teacher {
    id: string;
    email: string;
    name: string;
    bio: string;
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    status?: string;
    isActive?: boolean;
    createdAt: string;
}

interface Report {
    id: string;
    type: string;
    messageId: string;
    messageContent: string;
    senderEmail: string;
    reporterEmail: string;
    reason: string;
    status: string;
    createdAt: string;
}

interface PlatformStats {
    totalStudents: number;
    totalTutors: number;
    totalBookings: number;
    pendingApplications: number;
    pendingReports: number;
}

interface User {
    id: string;
    userId: string;
    userDetails: string; // email
    role: 'student' | 'teacher' | 'admin';
    suspended?: boolean;
    suspendedAt?: string;
    suspendReason?: string;
    createdAt: string;
}

type TabType = 'applications' | 'teachers' | 'users' | 'reports';

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
    const [activeTab, setActiveTab] = useState<TabType>('applications');
    const [applications, setApplications] = useState<Application[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_error, _setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_stats, _setStats] = useState<PlatformStats>({
        totalStudents: 0, totalTutors: 0, totalBookings: 0, pendingApplications: 0, pendingReports: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject' | 'suspend' | 'reinstate' | 'dismiss';
        id: string;
        email?: string
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch applications
        try {
            const appResponse = await fetch('/api/manager/applications');
            if (appResponse.ok) {
                const data = await appResponse.json();
                setApplications(data);
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
        }

        // Fetch teachers
        try {
            const teacherResponse = await fetch('/api/manager/teachers');
            if (teacherResponse.ok) {
                const data = await teacherResponse.json();
                setTeachers(data);
            }
        } catch (err) {
            console.error('Error fetching teachers:', err);
        }

        // Fetch reports
        try {
            const reportsResponse = await fetch('/api/manager/reports');
            if (reportsResponse.ok) {
                const data = await reportsResponse.json();
                setReports(data);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
        }

        // Fetch all users
        try {
            const usersResponse = await fetch('/api/manager/users');
            if (usersResponse.ok) {
                const data = await usersResponse.json();
                setUsers(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }

        setIsLoading(false);
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
                fetchData();
            } else {
                setToast({ message: 'Failed to approve teacher', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleReject = async (id: string) => {
        setIsProcessing(true);
        try {
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: 'rejected' as const } : app
            ));
            setToast({ message: 'Application rejected', type: 'success' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleSuspend = async (email: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/teachers/suspend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherEmail: email, action: 'suspend', reason: 'Admin action' })
            });
            if (response.ok) {
                setToast({ message: 'Teacher suspended', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to suspend teacher', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    // Suspend any user (teacher or student) - used for reported messages
    const handleSuspendUser = async (email: string, reportId?: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/users/suspend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: email, reason: 'Reported for inappropriate behavior', reportId })
            });
            if (response.ok) {
                const data = await response.json();
                setToast({ message: data.message || 'User suspended', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to suspend user', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    // Dismiss a report without taking action
    const handleDismiss = async (reportId: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/reports/dismiss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId })
            });
            if (response.ok) {
                setToast({ message: 'Report dismissed', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to dismiss report', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleReinstate = async (email: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/teachers/reinstate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherEmail: email })
            });
            if (response.ok) {
                setToast({ message: 'Teacher reinstated', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to reinstate teacher', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    // Reinstate any user (works for both teachers and students)
    const handleReinstateUser = async (email: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/users/reinstate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: email })
            });
            if (response.ok) {
                setToast({ message: 'User reinstated successfully', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to reinstate user', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const tabs = [
        { id: 'applications' as TabType, label: 'Applications', icon: Clock, count: applications.filter(a => a.status === 'pending').length },
        { id: 'teachers' as TabType, label: 'Teachers', icon: Users, count: teachers.length },
        { id: 'users' as TabType, label: 'All Users', icon: Users, count: users.filter(u => u.suspended).length },
        { id: 'reports' as TabType, label: 'Reports', icon: Flag, count: reports.filter(r => r.status === 'pending').length }
    ];

    const statCards = [
        { label: 'Applications', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'yellow' },
        { label: 'Active Users', value: users.filter(u => !u.suspended).length, icon: Users, color: 'green' },
        { label: 'Suspended', value: users.filter(u => u.suspended).length, icon: UserX, color: 'red' },
        { label: 'Open Reports', value: reports.filter(r => r.status === 'pending').length, icon: Flag, color: 'orange' }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-secondary-900">Admin Dashboard</h1>
                                <p className="text-secondary-600 mt-1">Manage teachers, applications, and reports</p>
                            </div>
                            <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
                                <TrendingUp size={18} />
                                Refresh
                            </Button>
                        </div>
                    </motion.header>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((stat, i) => (
                            <Card key={i} className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
                                        <div className="text-sm text-secondary-500">{stat.label}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-secondary-200 pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'text-secondary-600 hover:bg-secondary-100'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-secondary-200'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-secondary-600">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Applications Tab */}
                            {activeTab === 'applications' && (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {applications
                                        .filter(app => (app.fullName || app.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(app => (
                                            <Card key={app.id} className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-3 items-center">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                                                            {(app.fullName || app.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-secondary-900">{app.fullName || app.name}</h3>
                                                            <p className="text-sm text-secondary-500">{app.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <p className="text-secondary-600 text-sm mb-4 line-clamp-2">{app.bio || 'No bio'}</p>
                                                <div className="flex justify-between items-center text-sm mb-4">
                                                    <span className="text-primary-600 font-semibold">${app.hourlyRate}/hr</span>
                                                    <span className="text-secondary-400">{new Date(app.submittedAt).toLocaleDateString()}</span>
                                                </div>
                                                {app.status === 'pending' && (
                                                    <div className="flex gap-2 pt-4 border-t border-secondary-100">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-red-600"
                                                            onClick={() => setConfirmModal({ isOpen: true, type: 'reject', id: app.id })}
                                                        >
                                                            <XCircle size={16} className="mr-1" /> Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => setConfirmModal({ isOpen: true, type: 'approve', id: app.id })}
                                                        >
                                                            <CheckCircle size={16} className="mr-1" /> Approve
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    {applications.length === 0 && (
                                        <Card className="col-span-full p-12 text-center">
                                            <Clock size={48} className="mx-auto mb-4 text-secondary-300" />
                                            <p className="text-secondary-500">No applications</p>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Teachers Tab */}
                            {activeTab === 'teachers' && (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {teachers
                                        .filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || t.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(teacher => (
                                            <Card key={teacher.id} className={`p-6 ${teacher.status === 'suspended' ? 'border-red-200 bg-red-50/50' : ''}`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-3 items-center">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${teacher.status === 'suspended' ? 'bg-red-400' : 'bg-gradient-to-br from-green-400 to-green-600'
                                                            }`}>
                                                            {(teacher.name || 'T').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-secondary-900">{teacher.name}</h3>
                                                            <p className="text-sm text-secondary-500">{teacher.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${teacher.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {teacher.status === 'suspended' ? 'Suspended' : 'Active'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm mb-4">
                                                    <span className="text-primary-600 font-semibold">${teacher.hourlyRate}/hr</span>
                                                    <span className="text-secondary-400">⭐ {teacher.rating || 'N/A'} ({teacher.reviewCount || 0})</span>
                                                </div>
                                                <div className="flex gap-2 pt-4 border-t border-secondary-100">
                                                    {teacher.status === 'suspended' ? (
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                                            onClick={() => setConfirmModal({ isOpen: true, type: 'reinstate', id: teacher.id, email: teacher.email })}
                                                        >
                                                            <UserCheck size={16} className="mr-1" /> Reinstate
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-red-600"
                                                            onClick={() => setConfirmModal({ isOpen: true, type: 'suspend', id: teacher.id, email: teacher.email })}
                                                        >
                                                            <UserX size={16} className="mr-1" /> Suspend
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    {teachers.length === 0 && (
                                        <Card className="col-span-full p-12 text-center">
                                            <Users size={48} className="mx-auto mb-4 text-secondary-300" />
                                            <p className="text-secondary-500">No teachers</p>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {users
                                        .filter(u => u.userDetails?.toLowerCase().includes(searchTerm.toLowerCase()) || u.role?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(user => (
                                            <Card key={user.id} className={`p-6 ${user.suspended ? 'border-red-200 bg-red-50/50' : ''}`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-3 items-center">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${user.suspended ? 'bg-red-400' :
                                                                user.role === 'admin' ? 'bg-purple-500' :
                                                                    user.role === 'teacher' ? 'bg-green-500' : 'bg-blue-500'
                                                            }`}>
                                                            {(user.userDetails || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-secondary-900">{user.userDetails}</h3>
                                                            <p className="text-sm text-secondary-500 capitalize">{user.role}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.suspended ? 'Suspended' : 'Active'}
                                                    </span>
                                                </div>
                                                {user.suspended && (
                                                    <div className="bg-red-100 rounded-lg p-3 mb-4 text-sm">
                                                        <p className="text-red-700"><strong>Reason:</strong> {user.suspendReason || 'Not specified'}</p>
                                                        <p className="text-red-600 text-xs mt-1">
                                                            Suspended: {user.suspendedAt ? new Date(user.suspendedAt).toLocaleString() : 'Unknown'}
                                                        </p>
                                                    </div>
                                                )}
                                                {user.suspended && user.role !== 'admin' && (
                                                    <div className="flex gap-2 pt-4 border-t border-secondary-100">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleReinstateUser(user.userDetails)}
                                                        >
                                                            <UserCheck size={16} className="mr-1" /> Reinstate
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    {users.length === 0 && (
                                        <Card className="col-span-full p-12 text-center">
                                            <Users size={48} className="mx-auto mb-4 text-secondary-300" />
                                            <p className="text-secondary-500">No users found</p>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Reports Tab */}
                            {activeTab === 'reports' && (
                                <div className="space-y-4">
                                    {reports
                                        .filter(r => r.messageContent?.toLowerCase().includes(searchTerm.toLowerCase()) || r.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(report => (
                                            <Card key={report.id} className={`p-6 ${report.status === 'pending' ? 'border-orange-200' : ''}`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                                            <Flag size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-secondary-900">{report.reason}</h3>
                                                            <p className="text-sm text-secondary-500">
                                                                Reported by: {report.reporterEmail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${report.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-secondary-600 mb-2">
                                                        <strong>From:</strong> {report.senderEmail}
                                                    </p>
                                                    <p className="text-secondary-800 italic">"{report.messageContent}"</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-secondary-400">
                                                        {new Date(report.createdAt).toLocaleString()}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        {report.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setConfirmModal({ isOpen: true, type: 'suspend', id: report.id, email: report.senderEmail })}
                                                                >
                                                                    <UserX size={16} className="mr-1" /> Suspend User
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setConfirmModal({ isOpen: true, type: 'dismiss', id: report.id })}
                                                                >
                                                                    Dismiss
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    {reports.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
                                            <p className="text-secondary-500">No reports - All clear!</p>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            {confirmModal && (
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    title={
                        confirmModal.type === 'approve' ? 'Approve Teacher' :
                            confirmModal.type === 'reject' ? 'Reject Application' :
                                confirmModal.type === 'suspend' ? 'Suspend User' :
                                    confirmModal.type === 'reinstate' ? 'Reinstate Teacher' :
                                        'Dismiss Report'
                    }
                    message={
                        confirmModal.type === 'approve' ? 'This will grant teacher privileges.' :
                            confirmModal.type === 'reject' ? 'This will reject the application.' :
                                confirmModal.type === 'suspend' ? `This will suspend ${confirmModal.email}. They will not be able to use the platform until reinstated. Their data is preserved.` :
                                    confirmModal.type === 'reinstate' ? `This will reinstate ${confirmModal.email} as an active user.` :
                                        'This will dismiss the report.'
                    }
                    confirmText={
                        confirmModal.type === 'approve' ? 'Approve' :
                            confirmModal.type === 'reject' ? 'Reject' :
                                confirmModal.type === 'suspend' ? 'Suspend' :
                                    confirmModal.type === 'reinstate' ? 'Reinstate' :
                                        'Dismiss'
                    }
                    confirmVariant={confirmModal.type === 'reinstate' || confirmModal.type === 'approve' ? 'primary' : 'danger'}
                    onConfirm={() => {
                        if (confirmModal.type === 'approve') handleApprove(confirmModal.id);
                        else if (confirmModal.type === 'reject') handleReject(confirmModal.id);
                        else if (confirmModal.type === 'suspend' && confirmModal.email) {
                            // If there's an id, it's from Reports (id = reportId), use handleSuspendUser
                            // Otherwise it's from Teachers tab, use handleSuspend
                            if (confirmModal.id && confirmModal.id.startsWith('report_')) {
                                handleSuspendUser(confirmModal.email, confirmModal.id);
                            } else {
                                handleSuspend(confirmModal.email);
                            }
                        }
                        else if (confirmModal.type === 'reinstate' && confirmModal.email) handleReinstate(confirmModal.email);
                        else if (confirmModal.type === 'dismiss') handleDismiss(confirmModal.id);
                        else setConfirmModal(null);
                    }}
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
