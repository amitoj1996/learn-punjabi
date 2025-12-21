import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CreditCard, Lock } from 'lucide-react';

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

// Get short timezone abbreviation (e.g., 'PST', 'IST')
const getTimezoneAbbr = (): string => {
    const date = new Date();
    const timeString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' });
    const parts = timeString.split(' ');
    return parts[parts.length - 1]; // e.g., 'PST'
};

// Convert UTC time (e.g., '14:00') to local time for display on a specific date
const convertUtcToLocal = (utcTime: string, dateStr: string): string => {
    // Create a date object with the UTC time
    const [hours, minutes] = utcTime.split(':').map(Number);
    const date = new Date(dateStr + 'T00:00:00Z');
    date.setUTCHours(hours, minutes, 0, 0);

    // Format to local time
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const BookingModal: React.FC<BookingModalProps> = ({ tutor, onClose, onSuccess: _onSuccess }) => {
    const [step, setStep] = useState<'select' | 'confirm' | 'processing'>('select');
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
        setStep('confirm');
    };

    const handleConfirmAndPay = async () => {
        setStep('processing');
        setError(null);

        try {
            // Step 1: Create the booking (without payment)
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tutorId: tutor.id,
                    date: selectedDate,
                    time: selectedTime,
                    duration: 60,
                    paymentStatus: 'pending',
                    paymentAmount: tutor.hourlyRate
                })
            });

            if (!bookingResponse.ok) {
                const data = await bookingResponse.json();
                throw new Error(data.error || 'Failed to create booking');
            }

            const bookingData = await bookingResponse.json();
            const bookingId = bookingData.booking?.id;

            if (!bookingId) {
                throw new Error('Booking created but no ID returned');
            }

            // Step 2: Create Stripe checkout session
            const checkoutResponse = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId })
            });

            if (!checkoutResponse.ok) {
                const data = await checkoutResponse.json();
                throw new Error(data.error || 'Failed to create payment session');
            }

            const checkoutData = await checkoutResponse.json();

            // Step 3: Redirect to Stripe Checkout
            if (checkoutData.url) {
                window.location.href = checkoutData.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            setError((err as Error).message);
            setStep('confirm');
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
                        {step === 'confirm' && 'Confirm & Pay'}
                        {step === 'processing' && 'Redirecting...'}
                    </h2>
                    {step !== 'processing' && (
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
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Select a Time</label>
                                        <p className="text-xs text-secondary-500 mb-2">🌍 Times shown in your timezone ({getTimezoneAbbr()})</p>
                                        {availableSlots.length === 0 ? (
                                            <p className="text-secondary-500 text-sm">No slots available</p>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {availableSlots.map(time => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`p-2 rounded-lg text-sm transition-all ${selectedTime === time
                                                            ? 'bg-primary-500 text-white'
                                                            : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                            }`}
                                                    >
                                                        {convertUtcToLocal(time, selectedDate)}
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

                {/* Step: Confirm & Pay */}
                {step === 'confirm' && (
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

                        {/* Stripe Notice */}
                        <div className="border border-secondary-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard size={20} className="text-primary-600" />
                                <span className="font-medium text-secondary-900">Secure Payment with Stripe</span>
                            </div>
                            <p className="text-sm text-secondary-600 flex items-center gap-1">
                                <Lock size={14} /> You'll be redirected to Stripe's secure checkout page
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('select')} className="flex-1">Back</Button>
                            <Button onClick={handleConfirmAndPay} className="flex-1 bg-green-600 hover:bg-green-700">
                                Pay ${tutor.hourlyRate}
                            </Button>
                        </div>
                    </>
                )}

                {/* Step: Processing/Redirecting */}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-secondary-600">Redirecting to secure payment...</p>
                        <p className="text-sm text-secondary-400 mt-2">Please wait, do not close this window</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
