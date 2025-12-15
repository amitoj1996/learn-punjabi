import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Mock Data for Applications
const MOCK_APPLICATIONS = [
    {
        id: '1',
        name: 'Harpreet Singh',
        email: 'harpreet@example.com',
        bio: 'Experienced Punjabi teacher with 5 years of experience teaching kids.',
        hourlyRate: 25,
        status: 'pending',
        submittedAt: '2025-10-14T10:00:00Z'
    },
    {
        id: '2',
        name: 'Simran Kaur',
        email: 'simran@example.com',
        bio: 'Native Punjabi speaker and university student offering conversational practice.',
        hourlyRate: 15,
        status: 'pending',
        submittedAt: '2025-10-15T09:30:00Z'
    }
];

export const AdminDashboard: React.FC = () => {
    const [applications, setApplications] = useState(MOCK_APPLICATIONS);

    const handleApprove = (id: string) => {
        alert(`Approved application ${id}`);
        // In real app: API call to approve
        setApplications(prev => prev.filter(app => app.id !== id));
    };

    const handleReject = (id: string) => {
        if (confirm('Are you sure you want to reject this application?')) {
            alert(`Rejected application ${id}`);
            // In real app: API call to reject
            setApplications(prev => prev.filter(app => app.id !== id));
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Admin Dashboard
                </h1>
                <p className="text-secondary-600 mt-2">Oversee platform activity and review teacher applications.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Applications List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                        Pending Applications
                        <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">{applications.length}</span>
                    </h2>

                    {applications.length === 0 ? (
                        <Card className="p-8 text-center text-secondary-500 bg-secondary-50">
                            <p>No pending applications. All caught up! 🎉</p>
                        </Card>
                    ) : (
                        applications.map((app) => (
                            <Card key={app.id} className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-secondary-900">{app.name}</h3>
                                        <p className="text-sm text-secondary-500">{app.email}</p>
                                    </div>
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                        Pending Review
                                    </span>
                                </div>
                                <div className="mb-6 space-y-2 text-sm text-secondary-600">
                                    <p><span className="font-semibold text-secondary-900">Bio:</span> {app.bio}</p>
                                    <p><span className="font-semibold text-secondary-900">Rate:</span> ${app.hourlyRate}/hr</p>
                                    <p className="text-xs text-secondary-400">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button variant="outline" size="sm" onClick={() => handleReject(app.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                        Reject
                                    </Button>
                                    <Button size="sm" onClick={() => handleApprove(app.id)}>
                                        Approve Teacher
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Sidebar: Platform Stats */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-4">Platform Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                <span className="text-secondary-600">Total Students</span>
                                <span className="font-bold text-secondary-900">142</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                                <span className="text-secondary-600">Active Tutors</span>
                                <span className="font-bold text-secondary-900">18</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-600">Lessons This Week</span>
                                <span className="font-bold text-primary-600">56</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
