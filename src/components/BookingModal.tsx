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
    const [step, setStep] = useState<'select' | 'payment' | 'processing' | 'success'>('select');
    const [availability, setAvailability] = useState<Availability>({});
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleProceedToPayment = () => {
        if (!selectedDate || !selectedTime) {
            setError('Please select a date and time');
            return;
        }
        setStep('payment');
    };

    const handleConfirmPayment = async () => {
        setStep('processing');
        setError(null);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tutorId: tutor.id,
                    date: selectedDate,
                    time: selectedTime,
                    duration: 60,
                    paymentStatus: 'paid',
                    paymentAmount: tutor.hourlyRate
                })
            });

            if (response.ok) {
                setStep('success');
                setTimeout(() => onSuccess(), 2000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to book');
                setStep('payment');
            }
        } catch (err) {
            setError((err as Error).message);
            setStep('payment');
        }
    };

    const selectedDayName = selectedDate ? DAYS_OF_WEEK[new Date(selectedDate + 'T12:00:00').getDay()] : '';
    const availableSlots = selectedDayName ? getAvailableSlots(selectedDayName) : [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-md p-6 bg-white" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-secondary-900">
                        {step === 'select' && `Book with ${tutor.name}`}
                        {step === 'payment' && 'Confirm Payment'}
                        {step === 'processing' && 'Processing...'}
                        {step === 'success' && 'Booking Confirmed!'}
                    </h2>
                    {step !== 'processing' && step !== 'success' && (
                        <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 text-2xl">&times;</button>
                    )}
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                {/* Step: Select Date/Time */}
                {step === 'select' && (
                    <>
                        {isLoading ? (
                            <div className="text-center py-8 text-secondary-500">Loading availability...</div>
                        ) : (
                            <>
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

                                {selectedDate && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">Select a Time</label>
                                        {availableSlots.length === 0 ? (
                                            <p className="text-secondary-500 text-sm">No slots available</p>
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

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                                    <Button onClick={handleProceedToPayment} disabled={!selectedDate || !selectedTime} className="flex-1">
                                        Continue to Payment
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Step: Payment */}
                {step === 'payment' && (
                    <>
                        <div className="bg-primary-50 rounded-xl p-4 mb-6">
                            <h3 className="font-bold text-primary-900 mb-3">Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Tutor</span>
                                    <span className="font-medium text-primary-900">{tutor.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Date</span>
                                    <span className="font-medium text-primary-900">
                                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Time</span>
                                    <span className="font-medium text-primary-900">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Duration</span>
                                    <span className="font-medium text-primary-900">1 hour</span>
                                </div>
                                <div className="border-t border-primary-200 pt-2 mt-2 flex justify-between">
                                    <span className="font-bold text-primary-900">Total</span>
                                    <span className="font-bold text-primary-900 text-lg">${tutor.hourlyRate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Payment Form */}
                        <div className="border border-secondary-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">💳</span>
                                <span className="font-medium text-secondary-900">Payment Method</span>
                            </div>
                            <div className="bg-secondary-50 rounded-lg p-3 text-sm text-secondary-600">
                                <p className="font-medium text-secondary-900 mb-1">Demo Mode</p>
                                <p>In production, this would connect to Stripe for secure payment processing.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('select')} className="flex-1">Back</Button>
                            <Button onClick={handleConfirmPayment} className="flex-1 bg-green-600 hover:bg-green-700">
                                💳 Pay ${tutor.hourlyRate}
                            </Button>
                        </div>
                    </>
                )}

                {/* Step: Processing */}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-secondary-600">Processing your payment...</p>
                    </div>
                )}

                {/* Step: Success */}
                {step === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✓</div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-2">Booking Confirmed!</h3>
                        <p className="text-secondary-600 mb-4">Your lesson has been scheduled.</p>
                        <p className="text-sm text-secondary-500">Check your dashboard for details.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
