import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface BookingModalProps {
    tutor: {
        id: string;
        name: string;
        hourlyRate: number;
    };
    onClose: () => void;
    onSuccess: () => void;
}

interface Availability {
    [day: string]: string[];
}

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const BookingModal: React.FC<BookingModalProps> = ({ tutor, onClose, onSuccess }) => {
    const [availability, setAvailability] = useState<Availability>({});
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate next 7 days
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

    const nextDays = getNextDays();

    useEffect(() => {
        fetchAvailability();
    }, [tutor.id]);

    const fetchAvailability = async () => {
        try {
            const response = await fetch(`/api/tutors/${tutor.id}/availability`);
            if (response.ok) {
                const data = await response.json();
                setAvailability(data.availability || {});
            } else {
                setError('Could not load availability');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const getAvailableSlots = (dayName: string): string[] => {
        return availability[dayName] || [];
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            setError('Please select a date and time');
            return;
        }

        setIsBooking(true);
        setError(null);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tutorId: tutor.id,
                    date: selectedDate,
                    time: selectedTime,
                    duration: 60
                })
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to book');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsBooking(false);
        }
    };

    const selectedDayName = selectedDate
        ? DAYS_OF_WEEK[new Date(selectedDate + 'T12:00:00').getDay()]
        : '';
    const availableSlots = selectedDayName ? getAvailableSlots(selectedDayName) : [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-md p-6 bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-secondary-900">Book with {tutor.name}</h2>
                    <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 text-2xl">&times;</button>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                {isLoading ? (
                    <div className="text-center py-8 text-secondary-500">Loading availability...</div>
                ) : (
                    <>
                        {/* Date Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary-700 mb-2">Select a Date</label>
                            <div className="grid grid-cols-4 gap-2">
                                {nextDays.map(day => {
                                    const hasSlots = getAvailableSlots(day.dayName).length > 0;
                                    return (
                                        <button
                                            key={day.date}
                                            disabled={!hasSlots}
                                            onClick={() => { setSelectedDate(day.date); setSelectedTime(''); }}
                                            className={`p-2 rounded-lg text-sm transition-all ${selectedDate === day.date
                                                    ? 'bg-primary-500 text-white'
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
                        {selectedDate && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Select a Time</label>
                                {availableSlots.length === 0 ? (
                                    <p className="text-secondary-500 text-sm">No slots available for this day</p>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`p-2 rounded-lg text-sm transition-all ${selectedTime === time
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Summary */}
                        {selectedDate && selectedTime && (
                            <div className="bg-primary-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-primary-800">
                                    <strong>Booking:</strong> {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                                </p>
                                <p className="text-sm text-primary-800"><strong>Duration:</strong> 1 hour</p>
                                <p className="text-sm text-primary-800"><strong>Price:</strong> ${tutor.hourlyRate}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                            <Button
                                onClick={handleBook}
                                disabled={!selectedDate || !selectedTime || isBooking}
                                className="flex-1"
                            >
                                {isBooking ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};
