import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from '../pages/StudentDashboard';
import { TeacherDashboard } from '../pages/TeacherDashboard';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const DashboardRouter: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-12 text-center">Loading dashboard...</div>;
    }

    if (!user) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl font-bold mb-4">Please Log In</h2>
                <Link to="/login"><Button>Log In</Button></Link>
            </div>
        );
    }

    // Role-based Switching
    if (user.role === 'teacher') {
        return <TeacherDashboard />;
    }

    if (user.role === 'admin') {
        return <div className="p-12">Admin Dashboard (Coming Soon)</div>;
    }

    // Default to Student
    return <StudentDashboard />;
};
