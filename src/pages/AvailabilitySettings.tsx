import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

interface Availability {
    [day: string]: string[];
}

export const AvailabilitySettings: React.FC = () => {
    const navigate = useNavigate();
    const [availability, setAvailability] = useState<Availability>({
        monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: [], sunday: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const response = await fetch('/api/tutor/availability');
            if (response.ok) {
                const data = await response.json();
                setAvailability(data.availability);
            } else if (response.status === 404) {
                setError('You must be an approved teacher to set availability.');
            } else {
                setError('Failed to load availability');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSlot = (day: string, time: string) => {
        setAvailability(prev => {
            const daySlots = prev[day] || [];
            if (daySlots.includes(time)) {
                return { ...prev, [day]: daySlots.filter(t => t !== time) };
            } else {
                return { ...prev, [day]: [...daySlots, time].sort() };
            }
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/tutor/availability', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availability })
            });

            if (response.ok) {
                setSuccess('Availability saved successfully!');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Layout><div className="p-12 text-center">Loading availability...</div></Layout>;
    }

    if (error && !Object.keys(availability).some(d => availability[d].length > 0)) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <Card className="p-8 max-w-xl mx-auto text-center">
                        <div className="text-4xl mb-4">🔒</div>
                        <h2 className="text-xl font-bold text-secondary-900 mb-2">Access Denied</h2>
                        <p className="text-secondary-600 mb-4">{error}</p>
                        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">Set Your Availability</h1>
                    <p className="text-secondary-600 mt-2">Click on time slots when you're available to teach.</p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 font-medium">🌍 All times are in UTC (Coordinated Universal Time)</p>
                        <p className="text-blue-600 text-sm mt-1">
                            Current UTC time: {new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} UTC
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                            Students will see these times converted to their local timezone.
                        </p>
                    </div>
                </header>

                {success && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">✅ {success}</div>}
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">❌ {error}</div>}

                <Card className="p-6 overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr>
                                <th className="text-left p-2 text-secondary-600 text-sm font-medium">Time</th>
                                {DAYS.map(day => (
                                    <th key={day} className="p-2 text-secondary-900 text-sm font-medium capitalize">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIME_SLOTS.map(time => (
                                <tr key={time} className="border-t border-secondary-100">
                                    <td className="p-2 text-secondary-600 text-sm">{time}</td>
                                    {DAYS.map(day => {
                                        const isSelected = availability[day]?.includes(time);
                                        return (
                                            <td key={`${day}-${time}`} className="p-1">
                                                <button
                                                    onClick={() => toggleSlot(day, time)}
                                                    className={`w-full h-10 rounded-lg transition-all text-sm ${isSelected
                                                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                                                        : 'bg-secondary-100 text-secondary-400 hover:bg-secondary-200'
                                                        }`}
                                                >
                                                    {isSelected ? '✓' : ''}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <div className="flex gap-4 mt-6">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Availability'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
                </div>

                <p className="text-sm text-secondary-500 mt-4">
                    💡 Tip: If you're in India (IST = UTC+5:30), selecting 14:00 UTC means 7:30 PM IST.
                </p>
            </div>
        </Layout>
    );
};
