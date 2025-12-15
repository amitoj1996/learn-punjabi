import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from '../pages/StudentDashboard';
import { TeacherDashboard } from '../pages/TeacherDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';

export const DashboardRouter: React.FC = () => {
    const { user, isLoading, login } = useAuth();

    if (isLoading) {
        return (
            <Layout>
                <div className="p-12 text-center">Loading dashboard...</div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="p-12 text-center">
                    <h2 className="text-xl font-bold mb-4">Please Log In</h2>
                    <Button onClick={login}>Log In</Button>
                </div>
            </Layout>
        );
    }

    // Role-based Switching (dashboards now have their own Layout)
    if (user.role === 'teacher') {
        return <TeacherDashboard />;
    }

    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    // Default to Student
    return <StudentDashboard />;
};
