import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import {
    Users, CheckCircle, Clock, XCircle, Search, TrendingUp,
    Flag, UserX, UserCheck, Trash2, ChevronLeft, ChevronRight,
    MoreVertical, Filter, DollarSign, Calendar
} from 'lucide-react';

interface Application {
    id: string;
    userId: string;
    name: string;
    fullName: string;
    email: string;
    bio: string;
    hourlyRate: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'deleted';
    submittedAt: string;
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

interface User {
    id: string;
    userId: string;
    userDetails: string;
    role: 'student' | 'teacher' | 'admin';
    suspended?: boolean;
    suspendedAt?: string;
    suspendReason?: string;
    createdAt: string;
}

interface TeacherEarning {
    teacherEmail: string;
    teacherName: string;
    sessions: number;
    totalEarnings: number;
    payoutStatus: 'pending' | 'paid';
    paidAt?: string;
}

type TabType = 'applications' | 'users' | 'reports' | 'earnings';

// Confirmation Modal with Delete Input
const ConfirmModal: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    requireInput?: string;
}> = ({ isOpen, title, message, confirmText, confirmVariant, onConfirm, onCancel, isLoading, requireInput }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const canConfirm = requireInput ? inputValue === requireInput : true;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{title}</h3>
                <p className="text-secondary-600 mb-4">{message}</p>
                {requireInput && (
                    <div className="mb-4">
                        <p className="text-sm text-red-600 font-medium mb-2">
                            Type <span className="font-mono bg-red-50 px-1">{requireInput}</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="Type email to confirm"
                        />
                    </div>
                )}
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => { setInputValue(''); onCancel(); }} disabled={isLoading}>Cancel</Button>
                    <Button
                        onClick={() => { setInputValue(''); onConfirm(); }}
                        disabled={isLoading || !canConfirm}
                        className={confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50' : ''}
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
            className={`fixed bottom-6 left-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-medium">{message}</span>
        </motion.div>
    );
};

// Action Dropdown
const ActionDropdown: React.FC<{
    onSuspend?: () => void;
    onReinstate?: () => void;
    onDelete?: () => void;
    isSuspended?: boolean;
    isAdmin?: boolean;
}> = ({ onSuspend, onReinstate, onDelete, isSuspended, isAdmin }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (isAdmin) return <span className="text-xs text-purple-600">Admin</span>;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
                <MoreVertical size={18} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-xl shadow-xl z-50 min-w-[150px] overflow-hidden">
                        {isSuspended ? (
                            <button
                                onClick={() => { onReinstate?.(); setIsOpen(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-green-700 flex items-center gap-2"
                            >
                                <UserCheck size={16} /> Reinstate
                            </button>
                        ) : (
                            <button
                                onClick={() => { onSuspend?.(); setIsOpen(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 text-orange-700 flex items-center gap-2"
                            >
                                <UserX size={16} /> Suspend
                            </button>
                        )}
                        <button
                            onClick={() => { onDelete?.(); setIsOpen(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-700 flex items-center gap-2 border-t"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('applications');
    const [applications, setApplications] = useState<Application[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject' | 'suspend' | 'reinstate' | 'dismiss' | 'delete';
        id: string;
        email?: string;
    } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filters
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
    const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Earnings state
    const [earnings, setEarnings] = useState<TeacherEarning[]>([]);
    const [earningsLoading, setEarningsLoading] = useState(false);
    const [earningsDateRange, setEarningsDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    const [earningsTotals, setEarningsTotals] = useState({ totalEarnings: 0, totalSessions: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    // Reset page when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter, statusFilter, reportStatusFilter, activeTab]);

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch applications
        try {
            const appResponse = await fetch('/api/manager/applications');
            if (appResponse.ok) {
                const data = await appResponse.json();
                setApplications(data.filter((a: Application) => a.status !== 'deleted'));
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
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

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.userDetails?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'suspended' && user.suspended) ||
            (statusFilter === 'active' && !user.suspended);
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Filter reports
    const filteredReports = reports.filter(report => {
        const matchesSearch = report.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.messageContent?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = reportStatusFilter === 'all' || report.status === reportStatusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination calculations
    const getPaginatedData = <T,>(data: T[]): T[] => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

    const totalPages = (dataLength: number) => Math.ceil(dataLength / itemsPerPage);

    // Handlers
    const handleApprove = async (id: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: id })
            });
            if (response.ok) {
                setToast({ message: 'Teacher approved!', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Approval failed', type: 'error' });
            }
        } catch {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleReject = async (id: string) => {
        setIsProcessing(true);
        try {
            setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));
            setToast({ message: 'Application rejected', type: 'success' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleSuspendUser = async (email: string, reportId?: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/users/suspend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: email, reason: 'Admin action' })
            });
            if (response.ok) {
                // If suspension came from a report, auto-dismiss it
                if (reportId) {
                    await fetch('/api/manager/reports/dismiss', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reportId, resolution: 'user_suspended' })
                    });
                }
                setToast({ message: 'User suspended', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to suspend user', type: 'error' });
            }
        } catch {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleReinstateUser = async (email: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/users/reinstate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: email })
            });
            if (response.ok) {
                setToast({ message: 'User reinstated', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to reinstate user', type: 'error' });
            }
        } catch {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleDeleteUser = async (email: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/manager/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: email, confirmEmail: email })
            });
            if (response.ok) {
                setToast({ message: 'User deleted permanently', type: 'success' });
                fetchData();
            } else {
                const data = await response.json();
                setToast({ message: data.error || 'Failed to delete user', type: 'error' });
            }
        } catch {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const handleDismissReport = async (reportId: string) => {
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
        } catch {
            setToast({ message: 'An error occurred', type: 'error' });
        } finally {
            setIsProcessing(false);
            setConfirmModal(null);
        }
    };

    const tabs = [
        { id: 'applications' as TabType, label: 'Applications', icon: Clock, count: applications.filter(a => a.status === 'pending').length },
        { id: 'users' as TabType, label: 'Users', icon: Users, count: users.length },
        { id: 'reports' as TabType, label: 'Reports', icon: Flag, count: reports.filter(r => r.status === 'pending').length },
        { id: 'earnings' as TabType, label: 'Earnings', icon: DollarSign, count: 0 }
    ];

    const statCards = [
        { label: 'Pending Apps', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'bg-yellow-500' },
        { label: 'Active Users', value: users.filter(u => !u.suspended).length, icon: Users, color: 'bg-green-500' },
        { label: 'Suspended', value: users.filter(u => u.suspended).length, icon: UserX, color: 'bg-red-500' },
        { label: 'Open Reports', value: reports.filter(r => r.status === 'pending').length, icon: Flag, color: 'bg-orange-500' }
    ];

    const paginatedUsers = getPaginatedData(filteredUsers);
    const paginatedReports = getPaginatedData(filteredReports);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-secondary-900">Admin Dashboard</h1>
                                <p className="text-secondary-600 mt-1">Manage users, applications, and reports</p>
                            </div>
                            <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
                                <TrendingUp size={18} />
                                Refresh
                            </Button>
                        </div>
                    </motion.header>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {statCards.map((stat, i) => (
                            <Card key={i} className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                                        <p className="text-xs text-secondary-500">{stat.label}</p>
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
                                className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white'
                                    : 'text-secondary-600 hover:bg-secondary-100'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-secondary-200'
                                        }`}>{tab.count}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Filters & Search */}
                    <Card className="p-4 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {activeTab === 'users' && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Filter size={16} className="text-secondary-400" />
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="student">Students</option>
                                            <option value="teacher">Teachers</option>
                                            <option value="admin">Admins</option>
                                        </select>
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                        className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </>
                            )}

                            {activeTab === 'reports' && (
                                <select
                                    value={reportStatusFilter}
                                    onChange={(e) => setReportStatusFilter(e.target.value as typeof reportStatusFilter)}
                                    className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                                >
                                    <option value="all">All Reports</option>
                                    <option value="pending">Pending</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>
                            )}

                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                            >
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                        </div>
                    </Card>

                    {/* Content */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            {/* Applications Tab */}
                            {activeTab === 'applications' && (
                                <Card className="overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-secondary-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Name</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Email</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Rate</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Status</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Date</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary-100">
                                            {applications.filter(a => a.status === 'pending').map(app => (
                                                <tr key={app.id} className="hover:bg-secondary-50">
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-secondary-900">{app.name || app.fullName}</div>
                                                        <div className="text-xs text-secondary-500 truncate max-w-[200px]">{app.bio}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-secondary-600">{app.email}</td>
                                                    <td className="px-4 py-3 text-sm font-medium">${app.hourlyRate}/hr</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-secondary-500">
                                                        {new Date(app.submittedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button size="sm" onClick={() => handleApprove(app.id)} disabled={isProcessing}>
                                                                <CheckCircle size={14} className="mr-1" /> Approve
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleReject(app.id)}>
                                                                <XCircle size={14} className="mr-1" /> Reject
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {applications.filter(a => a.status === 'pending').length === 0 && (
                                        <div className="text-center py-12 text-secondary-500">
                                            <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
                                            No pending applications
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <>
                                    <Card className="overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-secondary-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Email</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Role</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Status</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Joined</th>
                                                    <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-secondary-100">
                                                {paginatedUsers.map(user => (
                                                    <tr key={user.id} className={`hover:bg-secondary-50 ${user.suspended ? 'bg-red-50/50' : ''}`}>
                                                        <td className="px-4 py-3 font-medium text-secondary-900">{user.userDetails}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                                user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-secondary-100 text-secondary-800'
                                                                }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {user.suspended ? 'Suspended' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-secondary-500">
                                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <ActionDropdown
                                                                isSuspended={user.suspended}
                                                                isAdmin={user.role === 'admin'}
                                                                onSuspend={() => setConfirmModal({ isOpen: true, type: 'suspend', id: user.id, email: user.userDetails })}
                                                                onReinstate={() => setConfirmModal({ isOpen: true, type: 'reinstate', id: user.id, email: user.userDetails })}
                                                                onDelete={() => setConfirmModal({ isOpen: true, type: 'delete', id: user.id, email: user.userDetails })}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredUsers.length === 0 && (
                                            <div className="text-center py-12 text-secondary-500">
                                                <Users size={48} className="mx-auto mb-4 text-secondary-300" />
                                                No users found
                                            </div>
                                        )}
                                    </Card>

                                    {/* Pagination */}
                                    {filteredUsers.length > itemsPerPage && (
                                        <div className="flex items-center justify-between mt-4 px-2">
                                            <p className="text-sm text-secondary-500">
                                                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(p => p - 1)}
                                                >
                                                    <ChevronLeft size={16} />
                                                </Button>
                                                <span className="px-3 py-1 text-sm text-secondary-600">
                                                    Page {currentPage} of {totalPages(filteredUsers.length)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={currentPage >= totalPages(filteredUsers.length)}
                                                    onClick={() => setCurrentPage(p => p + 1)}
                                                >
                                                    <ChevronRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Reports Tab */}
                            {activeTab === 'reports' && (
                                <>
                                    <Card className="overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-secondary-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Reporter</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Sender</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Reason</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Message</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Status</th>
                                                    <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-secondary-100">
                                                {paginatedReports.map(report => (
                                                    <tr key={report.id} className={`hover:bg-secondary-50 ${report.status === 'pending' ? 'bg-orange-50/50' : ''}`}>
                                                        <td className="px-4 py-3 text-sm text-secondary-600">{report.reporterEmail}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-secondary-900">{report.senderEmail}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">{report.reason}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-secondary-600 max-w-[200px] truncate">{report.messageContent}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                                    'bg-secondary-100 text-secondary-800'
                                                                }`}>{report.status}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {report.status === 'pending' && (
                                                                <div className="flex gap-2 justify-end">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-red-600"
                                                                        onClick={() => setConfirmModal({ isOpen: true, type: 'suspend', id: report.id, email: report.senderEmail })}
                                                                    >
                                                                        <UserX size={14} className="mr-1" /> Suspend
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleDismissReport(report.id)}
                                                                    >
                                                                        Dismiss
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredReports.length === 0 && (
                                            <div className="text-center py-12 text-secondary-500">
                                                <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
                                                No reports found
                                            </div>
                                        )}
                                    </Card>

                                    {/* Pagination */}
                                    {filteredReports.length > itemsPerPage && (
                                        <div className="flex items-center justify-between mt-4 px-2">
                                            <p className="text-sm text-secondary-500">
                                                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(p => p - 1)}
                                                >
                                                    <ChevronLeft size={16} />
                                                </Button>
                                                <span className="px-3 py-1 text-sm text-secondary-600">
                                                    Page {currentPage} of {totalPages(filteredReports.length)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={currentPage >= totalPages(filteredReports.length)}
                                                    onClick={() => setCurrentPage(p => p + 1)}
                                                >
                                                    <ChevronRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* Earnings Tab */}
                    {activeTab === 'earnings' && (
                        <>
                            <Card className="p-4 mb-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-secondary-500" />
                                        <span className="text-sm font-medium text-secondary-700">Date Range:</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="date"
                                            value={earningsDateRange.startDate}
                                            onChange={(e) => setEarningsDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                                        />
                                        <span className="text-secondary-400">to</span>
                                        <input
                                            type="date"
                                            value={earningsDateRange.endDate}
                                            onChange={(e) => setEarningsDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={async () => {
                                                setEarningsLoading(true);
                                                try {
                                                    const response = await fetch(`/api/manager/earnings?startDate=${earningsDateRange.startDate}&endDate=${earningsDateRange.endDate}`);
                                                    const data = await response.json();
                                                    console.log('Earnings API response:', response.status, data);
                                                    if (response.ok) {
                                                        setEarnings(data.teachers || []);
                                                        setEarningsTotals({ totalEarnings: data.totalEarnings || 0, totalSessions: data.totalSessions || 0 });
                                                    } else {
                                                        console.error('Earnings API error:', data);
                                                        setToast({ message: data.error || 'Failed to load earnings', type: 'error' });
                                                    }
                                                } catch (err) {
                                                    console.error('Error fetching earnings:', err);
                                                    setToast({ message: 'Failed to load earnings report', type: 'error' });
                                                } finally {
                                                    setEarningsLoading(false);
                                                }
                                            }}
                                        >
                                            Load Report
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <Card className="p-4">
                                    <p className="text-sm text-secondary-500">Total Earnings</p>
                                    <p className="text-2xl font-bold text-green-600">${earningsTotals.totalEarnings.toFixed(2)}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-secondary-500">Total Sessions</p>
                                    <p className="text-2xl font-bold text-primary-600">{earningsTotals.totalSessions}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-secondary-500">Teachers</p>
                                    <p className="text-2xl font-bold text-secondary-900">{earnings.length}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-secondary-500">Pending Payouts</p>
                                    <p className="text-2xl font-bold text-orange-600">{earnings.filter(e => e.payoutStatus === 'pending').length}</p>
                                </Card>
                            </div>

                            {/* Teachers Table */}
                            <Card className="overflow-hidden">
                                {earningsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                        <p className="text-secondary-500 mt-2">Loading...</p>
                                    </div>
                                ) : earnings.length === 0 ? (
                                    <div className="text-center py-12 text-secondary-500">
                                        <DollarSign size={48} className="mx-auto mb-4 text-secondary-300" />
                                        <p>No earnings data. Select a date range and click "Load Report".</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-secondary-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Teacher</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Sessions</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Earnings</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Status</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary-100">
                                            {earnings.map((teacher) => (
                                                <tr key={teacher.teacherEmail} className="hover:bg-secondary-50">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-secondary-900">{teacher.teacherName}</p>
                                                        <p className="text-sm text-secondary-500">{teacher.teacherEmail}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-secondary-700">{teacher.sessions}</td>
                                                    <td className="px-4 py-3 font-semibold text-green-600">${teacher.totalEarnings.toFixed(2)}</td>
                                                    <td className="px-4 py-3">
                                                        {teacher.payoutStatus === 'paid' ? (
                                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Paid</span>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Pending</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {teacher.payoutStatus === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={async () => {
                                                                    try {
                                                                        const response = await fetch('/api/manager/payouts', {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({
                                                                                teacherEmail: teacher.teacherEmail,
                                                                                teacherName: teacher.teacherName,
                                                                                startDate: earningsDateRange.startDate,
                                                                                endDate: earningsDateRange.endDate,
                                                                                amount: teacher.totalEarnings
                                                                            })
                                                                        });
                                                                        if (response.ok) {
                                                                            setEarnings(prev => prev.map(e =>
                                                                                e.teacherEmail === teacher.teacherEmail
                                                                                    ? { ...e, payoutStatus: 'paid' }
                                                                                    : e
                                                                            ));
                                                                            setToast({ message: `Marked ${teacher.teacherName} as paid`, type: 'success' });
                                                                        }
                                                                    } catch (err) {
                                                                        setToast({ message: 'Failed to mark as paid', type: 'error' });
                                                                    }
                                                                }}
                                                            >
                                                                <CheckCircle size={14} className="mr-1" /> Mark Paid
                                                            </Button>
                                                        )}
                                                        {teacher.payoutStatus === 'paid' && (
                                                            <span className="text-sm text-secondary-400">✓ Complete</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </Card>
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
                                    confirmModal.type === 'reinstate' ? 'Reinstate User' :
                                        confirmModal.type === 'delete' ? 'Delete User Permanently' :
                                            'Dismiss Report'
                    }
                    message={
                        confirmModal.type === 'approve' ? 'This will grant teacher privileges.' :
                            confirmModal.type === 'reject' ? 'This will reject the application.' :
                                confirmModal.type === 'suspend' ? `This will suspend ${confirmModal.email}. They cannot use the platform until reinstated.` :
                                    confirmModal.type === 'reinstate' ? `This will reinstate ${confirmModal.email} as an active user.` :
                                        confirmModal.type === 'delete' ? `This will permanently delete ${confirmModal.email}. This action cannot be undone.` :
                                            'This will dismiss the report.'
                    }
                    confirmText={
                        confirmModal.type === 'approve' ? 'Approve' :
                            confirmModal.type === 'reject' ? 'Reject' :
                                confirmModal.type === 'suspend' ? 'Suspend' :
                                    confirmModal.type === 'reinstate' ? 'Reinstate' :
                                        confirmModal.type === 'delete' ? 'Delete Permanently' :
                                            'Dismiss'
                    }
                    confirmVariant={confirmModal.type === 'reinstate' || confirmModal.type === 'approve' ? 'primary' : 'danger'}
                    requireInput={confirmModal.type === 'delete' ? confirmModal.email : undefined}
                    onConfirm={() => {
                        if (confirmModal.type === 'approve') handleApprove(confirmModal.id);
                        else if (confirmModal.type === 'reject') handleReject(confirmModal.id);
                        else if (confirmModal.type === 'suspend' && confirmModal.email) handleSuspendUser(confirmModal.email, confirmModal.id);
                        else if (confirmModal.type === 'reinstate' && confirmModal.email) handleReinstateUser(confirmModal.email);
                        else if (confirmModal.type === 'delete' && confirmModal.email) handleDeleteUser(confirmModal.email);
                        else if (confirmModal.type === 'dismiss') handleDismissReport(confirmModal.id);
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
