import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CreditCard, Lock, Sparkles, RefreshCw } from 'lucide-react';

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

interface TrialStatus {
    eligible: boolean;
    hasUsedTrial: boolean;
    trialPrice: number;
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

const RECURRING_OPTIONS = [
    { weeks: 1, label: '1 week', discount: 0 },
    { weeks: 2, label: '2 weeks', discount: 5 },
    { weeks: 4, label: '4 weeks', discount: 10 },
    { weeks: 8, label: '8 weeks', discount: 10 },
];

export const BookingModal: React.FC<BookingModalProps> = ({ tutor, onClose, onSuccess: _onSuccess }) => {
    const [step, setStep] = useState<'select' | 'confirm' | 'processing'>('select');
    const [availability, setAvailability] = useState<Availability>({});
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
    const [useTrial, setUseTrial] = useState(false);

    // Recurring state
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringWeeks, setRecurringWeeks] = useState(4);

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
        fetchTrialStatus();
    }, [tutor.id]);

    const fetchTrialStatus = async () => {
        try {
            const response = await fetch('/api/users/trial-status');
            if (response.ok) {
                const data = await response.json();
                setTrialStatus(data);
                // Auto-select trial if eligible
                if (data.eligible) {
                    setUseTrial(true);
                }
            }
        } catch (err) {
            console.log('Could not fetch trial status:', err);
        }
    };

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

    // Calculate pricing
    const calculatePrice = () => {
        if (!isRecurring) {
            if (useTrial && trialStatus?.eligible) {
                return trialStatus.trialPrice;
            }
            return tutor.hourlyRate;
        }

        // Recurring pricing with tiered discounts (1wk=0%, 2wk=5%, 4-8wk=10%)
        const regularTotal = tutor.hourlyRate * recurringWeeks;
        let discountPercent = 0;
        if (recurringWeeks >= 4) {
            discountPercent = 10;
        } else if (recurringWeeks >= 2) {
            discountPercent = 5;
        }
        const discount = regularTotal * (discountPercent / 100);
        return regularTotal - discount;
    };

    const handleConfirmAndPay = async () => {
        setStep('processing');
        setError(null);

        try {
            let bookingId: string;
            let recurringId: string | null = null;

            if (isRecurring) {
                // Create recurring bookings
                const response = await fetch('/api/bookings/recurring', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tutorId: tutor.id,
                        startDate: selectedDate,
                        time: selectedTime,
                        weeks: recurringWeeks,
                        duration: 60
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to create recurring bookings');
                }

                const data = await response.json();
                recurringId = data.recurringId;
                // Use first booking ID for payment
                bookingId = data.bookings[0].id;
            } else {
                // Create single booking
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
                bookingId = bookingData.booking?.id;

                if (!bookingId) {
                    throw new Error('Booking created but no ID returned');
                }
            }

            // Create Stripe checkout session
            const checkoutResponse = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    recurringId, // Pass recurring ID if applicable
                    isRecurring,
                    recurringWeeks: isRecurring ? recurringWeeks : null,
                    isTrial: !isRecurring && useTrial && trialStatus?.eligible
                })
            });

            if (!checkoutResponse.ok) {
                const data = await checkoutResponse.json();
                throw new Error(data.error || 'Failed to create payment session');
            }

            const checkoutData = await checkoutResponse.json();

            // Redirect to Stripe Checkout
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
    const totalPrice = calculatePrice();
    const regularPrice = isRecurring ? tutor.hourlyRate * recurringWeeks : tutor.hourlyRate;
    const savings = isRecurring ? regularPrice - totalPrice : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-md p-6 bg-white max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

                                {/* Recurring Option */}
                                {selectedDate && selectedTime && (
                                    <div className="mb-6 border border-primary-200 rounded-xl p-4 bg-primary-50">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isRecurring}
                                                onChange={(e) => {
                                                    setIsRecurring(e.target.checked);
                                                    if (e.target.checked) {
                                                        setUseTrial(false); // Can't use trial with recurring
                                                    }
                                                }}
                                                className="h-5 w-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <div className="flex items-center gap-2">
                                                <RefreshCw size={18} className="text-primary-600" />
                                                <span className="font-medium text-primary-900">Make this weekly</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 10%</span>
                                            </div>
                                        </label>

                                        {isRecurring && (
                                            <div className="mt-4">
                                                <p className="text-sm text-primary-700 mb-2">Same time every {selectedDayName.charAt(0).toUpperCase() + selectedDayName.slice(1)} for:</p>
                                                <div className="flex gap-2">
                                                    {RECURRING_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.weeks}
                                                            onClick={() => setRecurringWeeks(opt.weeks)}
                                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${recurringWeeks === opt.weeks
                                                                ? 'bg-primary-500 text-white'
                                                                : 'bg-white text-primary-700 hover:bg-primary-100 border border-primary-200'
                                                                }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-primary-600 mt-2">
                                                    💰 {recurringWeeks} lessons × ${tutor.hourlyRate} = <span className="line-through">${tutor.hourlyRate * recurringWeeks}</span> → <span className="font-bold text-green-600">${(tutor.hourlyRate * recurringWeeks * 0.9).toFixed(0)}</span>
                                                </p>
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
                        {/* Trial Banner (only for single bookings) */}
                        {!isRecurring && useTrial && trialStatus?.eligible && (
                            <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                                <Sparkles className="text-amber-500" size={24} />
                                <div>
                                    <p className="font-bold text-amber-800">🎉 First Lesson Special!</p>
                                    <p className="text-sm text-amber-700">Try your first lesson for only $5</p>
                                </div>
                            </div>
                        )}

                        {/* Recurring Banner */}
                        {isRecurring && (
                            <div className="bg-gradient-to-r from-green-100 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                                <RefreshCw className="text-green-600" size={24} />
                                <div>
                                    <p className="font-bold text-green-800">📅 Weekly Lessons Booked!</p>
                                    <p className="text-sm text-green-700">{recurringWeeks} lessons, same time every week • Save 10%</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-primary-50 rounded-xl p-4 mb-6">
                            <h3 className="font-bold text-primary-900 mb-3">Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Tutor</span>
                                    <span className="font-medium text-primary-900">{tutor.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-700">{isRecurring ? 'Starting' : 'Date'}</span>
                                    <span className="font-medium text-primary-900">
                                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Time</span>
                                    <span className="font-medium text-primary-900">{selectedTime}</span>
                                </div>
                                {isRecurring && (
                                    <div className="flex justify-between">
                                        <span className="text-primary-700">Frequency</span>
                                        <span className="font-medium text-primary-900">Weekly for {recurringWeeks} weeks</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-primary-700">{isRecurring ? 'Total Lessons' : 'Duration'}</span>
                                    <span className="font-medium text-primary-900">{isRecurring ? `${recurringWeeks} lessons` : '1 hour'}</span>
                                </div>
                                <div className="border-t border-primary-200 pt-2 mt-2 flex justify-between items-center">
                                    <span className="font-bold text-primary-900">Total</span>
                                    {isRecurring ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary-400 line-through">${regularPrice}</span>
                                            <span className="font-bold text-green-600 text-lg">${totalPrice.toFixed(0)}</span>
                                            <span className="text-xs text-green-600">(-${savings.toFixed(0)})</span>
                                        </div>
                                    ) : useTrial && trialStatus?.eligible ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary-400 line-through">${tutor.hourlyRate}</span>
                                            <span className="font-bold text-green-600 text-lg">${trialStatus.trialPrice}</span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-primary-900 text-lg">${tutor.hourlyRate}</span>
                                    )}
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
                                Pay ${totalPrice.toFixed(0)}
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
