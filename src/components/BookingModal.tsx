import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CreditCard, Lock, Calendar, X, Gift } from 'lucide-react';

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
}

interface SelectedSlot {
    dayName: string;
    time: string;
    displayDay: string;
}

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS: Record<string, string> = {
    sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
    thursday: 'Thu', friday: 'Fri', saturday: 'Sat'
};

const getTimezoneAbbr = (): string => {
    const date = new Date();
    const timeString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' });
    const parts = timeString.split(' ');
    return parts[parts.length - 1];
};

const convertUtcToLocal = (utcTime: string, dateStr: string): string => {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const date = new Date(dateStr + 'T00:00:00Z');
    date.setUTCHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Calculate discount based on total lessons (LAUNCH PRICING)
const calculateDiscount = (totalLessons: number): number => {
    if (totalLessons >= 16) return 35;
    if (totalLessons >= 8) return 30;
    if (totalLessons >= 4) return 20;
    if (totalLessons >= 2) return 10;
    return 0;
};

const WEEKS_OPTIONS = [
    { weeks: 1, label: '1 week' },
    { weeks: 2, label: '2 weeks' },
    { weeks: 4, label: '4 weeks' },
    { weeks: 8, label: '8 weeks' },
];

export const BookingModal: React.FC<BookingModalProps> = ({ tutor, onClose, onSuccess: _onSuccess }) => {
    const [step, setStep] = useState<'select' | 'confirm' | 'processing'>('select');
    const [availability, setAvailability] = useState<Availability>({});
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
    const [weeks, setWeeks] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
    const [activeDay, setActiveDay] = useState<string | null>(null);

    // For trial mode: single date/time selection
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Determine if we're in trial mode
    const isTrialMode = trialStatus?.eligible === true;

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

    // For regular mode - multi-slot selection
    const isSlotSelected = (dayName: string, time: string): boolean => {
        return selectedSlots.some(s => s.dayName === dayName && s.time === time);
    };

    const toggleSlot = (dayName: string, time: string, displayDay: string) => {
        if (isSlotSelected(dayName, time)) {
            setSelectedSlots(selectedSlots.filter(s => !(s.dayName === dayName && s.time === time)));
        } else {
            setSelectedSlots([...selectedSlots, { dayName, time, displayDay }]);
        }
    };

    const removeSlot = (index: number) => {
        setSelectedSlots(selectedSlots.filter((_, i) => i !== index));
    };

    // Pricing calculations
    const trialPrice = Math.round(tutor.hourlyRate * 0.25); // 75% off
    const totalLessons = isTrialMode ? 1 : selectedSlots.length * weeks;
    const discountPercent = isTrialMode ? 75 : calculateDiscount(totalLessons);
    const regularTotal = tutor.hourlyRate * totalLessons;
    const discountAmount = regularTotal * (discountPercent / 100);
    const finalPrice = isTrialMode ? trialPrice : regularTotal - discountAmount;

    const handleProceedToPayment = () => {
        if (isTrialMode) {
            if (!selectedDate || !selectedTime) {
                setError('Please select a date and time');
                return;
            }
        } else {
            if (selectedSlots.length === 0) {
                setError('Please select at least one time slot');
                return;
            }
        }
        setStep('confirm');
    };

    const handleConfirmAndPay = async () => {
        setStep('processing');
        setError(null);

        try {
            let bookingData;

            if (isTrialMode) {
                // Trial booking - simple single slot
                const selectedDayData = nextDays.find(d => d.date === selectedDate);
                bookingData = {
                    tutorId: tutor.id,
                    slots: [{
                        dayOfWeek: selectedDayData?.dayName,
                        time: selectedTime
                    }],
                    weeks: 1,
                    duration: 60,
                    isTrial: true
                };
            } else {
                // Regular booking - multi-slot + weeks
                bookingData = {
                    tutorId: tutor.id,
                    slots: selectedSlots.map(s => ({
                        dayOfWeek: s.dayName,
                        time: s.time
                    })),
                    weeks: weeks,
                    duration: 60,
                    isTrial: false
                };
            }

            const response = await fetch('/api/bookings/recurring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create bookings');
            }

            const data = await response.json();

            // Create Stripe checkout session
            const checkoutResponse = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: data.bookings[0].id,
                    recurringId: data.recurringId,
                    totalLessons: totalLessons,
                    isTrial: isTrialMode
                })
            });

            if (!checkoutResponse.ok) {
                const checkoutData = await checkoutResponse.json();
                throw new Error(checkoutData.error || 'Failed to create payment session');
            }

            const checkoutData = await checkoutResponse.json();
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-lg p-6 bg-white max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-secondary-900">
                        {step === 'select' && (isTrialMode ? `Try ${tutor.name}` : `Book with ${tutor.name}`)}
                        {step === 'confirm' && 'Confirm & Pay'}
                        {step === 'processing' && 'Redirecting...'}
                    </h2>
                    {step !== 'processing' && (
                        <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 text-2xl">&times;</button>
                    )}
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                {/* Step: Select */}
                {step === 'select' && (
                    <>
                        {isLoading ? (
                            <div className="text-center py-8 text-secondary-500">Loading availability...</div>
                        ) : isTrialMode ? (
                            /* ========== TRIAL MODE - Simple single slot selection ========== */
                            <>
                                {/* Trial Banner */}
                                <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-400 text-white p-2 rounded-full">
                                            <Gift size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-amber-900 text-lg">Your First Lesson is 75% Off! 🎉</p>
                                            <p className="text-amber-700 text-sm">Try a lesson with {tutor.name} for just <span className="font-bold">${trialPrice}</span> <span className="line-through opacity-60">${tutor.hourlyRate}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Select a Day
                                    </label>
                                    <div className="grid grid-cols-7 gap-1">
                                        {nextDays.map(day => {
                                            const hasSlots = getAvailableSlots(day.dayName).length > 0;
                                            const isSelected = selectedDate === day.date;
                                            return (
                                                <button
                                                    key={day.date}
                                                    disabled={!hasSlots}
                                                    onClick={() => {
                                                        setSelectedDate(day.date);
                                                        setSelectedTime('');
                                                    }}
                                                    className={`p-2 rounded-lg text-xs text-center transition-all ${isSelected
                                                        ? 'bg-amber-500 text-white'
                                                        : hasSlots
                                                            ? 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                            : 'bg-secondary-50 text-secondary-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <div className="font-medium">{DAY_LABELS[day.dayName]}</div>
                                                    <div className="text-[10px] opacity-70">{day.display.split(' ')[1]} {day.display.split(' ')[2]}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Selection (only if date selected) */}
                                {selectedDate && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                                            Select a Time
                                        </label>
                                        <p className="text-xs text-secondary-500 mb-2">🌍 Times in your timezone ({getTimezoneAbbr()})</p>
                                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                            {getAvailableSlots(nextDays.find(d => d.date === selectedDate)?.dayName || '').map(time => {
                                                const isSelected = selectedTime === time;
                                                return (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`p-2 rounded-lg text-sm transition-all ${isSelected
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                            }`}
                                                    >
                                                        {convertUtcToLocal(time, selectedDate)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Trial Summary */}
                                {selectedDate && selectedTime && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-secondary-900">Your Trial Lesson</p>
                                                <p className="text-sm text-secondary-600">
                                                    {nextDays.find(d => d.date === selectedDate)?.display} at {convertUtcToLocal(selectedTime, selectedDate)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-secondary-400 line-through text-sm">${tutor.hourlyRate}</p>
                                                <p className="text-2xl font-bold text-amber-600">${trialPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                                    <Button
                                        onClick={handleProceedToPayment}
                                        disabled={!selectedDate || !selectedTime}
                                        className="flex-1 bg-amber-500 hover:bg-amber-600"
                                    >
                                        Book Trial - ${trialPrice}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            /* ========== REGULAR MODE - Multi-slot + weekly selection ========== */
                            <>
                                {/* Selected Slots Display */}
                                {selectedSlots.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Your Schedule ({selectedSlots.length} slots)
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSlots.map((slot, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-sm"
                                                >
                                                    <Calendar size={14} />
                                                    <span>{DAY_LABELS[slot.dayName]} {convertUtcToLocal(slot.time, nextDays.find(d => d.dayName === slot.dayName)?.date || '')}</span>
                                                    <button
                                                        onClick={() => removeSlot(idx)}
                                                        className="hover:text-red-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Day Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Add Time Slots
                                    </label>
                                    <div className="grid grid-cols-7 gap-1">
                                        {nextDays.map(day => {
                                            const hasSlots = getAvailableSlots(day.dayName).length > 0;
                                            const isActive = activeDay === day.dayName;
                                            const hasSelected = selectedSlots.some(s => s.dayName === day.dayName);
                                            return (
                                                <button
                                                    key={day.date}
                                                    disabled={!hasSlots}
                                                    onClick={() => setActiveDay(isActive ? null : day.dayName)}
                                                    className={`p-2 rounded-lg text-xs text-center transition-all ${isActive
                                                        ? 'bg-primary-500 text-white'
                                                        : hasSelected
                                                            ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                                                            : hasSlots
                                                                ? 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                                : 'bg-secondary-50 text-secondary-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <div className="font-medium">{DAY_LABELS[day.dayName]}</div>
                                                    <div className="text-[10px] opacity-70">{day.display.split(' ')[1]} {day.display.split(' ')[2]}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Slots for Selected Day */}
                                {activeDay && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                                            Available times on {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}
                                        </label>
                                        <p className="text-xs text-secondary-500 mb-2">🌍 Times in your timezone ({getTimezoneAbbr()})</p>
                                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                            {getAvailableSlots(activeDay).map(time => {
                                                const dayData = nextDays.find(d => d.dayName === activeDay);
                                                const isSelected = isSlotSelected(activeDay, time);
                                                return (
                                                    <button
                                                        key={time}
                                                        onClick={() => toggleSlot(activeDay, time, dayData?.display || '')}
                                                        className={`p-2 rounded-lg text-sm transition-all ${isSelected
                                                            ? 'bg-primary-500 text-white'
                                                            : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                                                            }`}
                                                    >
                                                        {dayData ? convertUtcToLocal(time, dayData.date) : time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Weeks Selection */}
                                {selectedSlots.length > 0 && (
                                    <div className="mb-4 p-4 bg-secondary-50 rounded-xl">
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Repeat for how many weeks?
                                        </label>
                                        <div className="flex gap-2">
                                            {WEEKS_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.weeks}
                                                    onClick={() => setWeeks(opt.weeks)}
                                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${weeks === opt.weeks
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-white text-secondary-700 hover:bg-secondary-100 border border-secondary-200'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Summary */}
                                        <div className="mt-4 pt-4 border-t border-secondary-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-secondary-600">
                                                    {selectedSlots.length} lesson{selectedSlots.length > 1 ? 's' : ''}/week × {weeks} week{weeks > 1 ? 's' : ''}
                                                </span>
                                                <span className="font-bold text-secondary-900">{totalLessons} lessons</span>
                                            </div>
                                            {discountPercent > 0 && (
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-green-600 font-medium">
                                                        Save {discountPercent}%
                                                    </span>
                                                    <span className="text-green-600 font-bold">-${discountAmount.toFixed(0)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-secondary-200">
                                                <span className="font-bold text-secondary-900">Total</span>
                                                <div>
                                                    {discountPercent > 0 && (
                                                        <span className="text-secondary-400 line-through mr-2">${regularTotal}</span>
                                                    )}
                                                    <span className="font-bold text-lg text-primary-600">${finalPrice.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                                    <Button
                                        onClick={handleProceedToPayment}
                                        disabled={selectedSlots.length === 0}
                                        className="flex-1"
                                    >
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
                        {/* Banner */}
                        {isTrialMode ? (
                            <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                                <Gift className="text-amber-500" size={24} />
                                <div>
                                    <p className="font-bold text-amber-800">🎉 First Lesson - 75% Off!</p>
                                    <p className="text-sm text-amber-700">Your trial lesson discount is applied</p>
                                </div>
                            </div>
                        ) : discountPercent > 0 && (
                            <div className="bg-gradient-to-r from-green-100 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                                <p className="font-bold text-green-800">🎊 Launch Discount: {discountPercent}% Off!</p>
                                <p className="text-sm text-green-700">You're saving ${discountAmount.toFixed(0)} on {totalLessons} lessons</p>
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
                                    <span className="text-primary-700">{isTrialMode ? 'Lesson Time' : 'Schedule'}</span>
                                    <span className="font-medium text-primary-900">
                                        {isTrialMode
                                            ? `${nextDays.find(d => d.date === selectedDate)?.display} at ${convertUtcToLocal(selectedTime, selectedDate)}`
                                            : `${selectedSlots.map(s => DAY_LABELS[s.dayName]).join(', ')} for ${weeks} week${weeks > 1 ? 's' : ''}`
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-700">Total Lessons</span>
                                    <span className="font-medium text-primary-900">{totalLessons}</span>
                                </div>
                                <div className="border-t border-primary-200 pt-2 mt-2 flex justify-between items-center">
                                    <span className="font-bold text-primary-900">Total</span>
                                    <div className="flex items-center gap-2">
                                        {discountPercent > 0 && (
                                            <span className="text-secondary-400 line-through">${regularTotal}</span>
                                        )}
                                        <span className={`font-bold text-lg ${isTrialMode ? 'text-amber-600' : 'text-green-600'}`}>
                                            ${isTrialMode ? trialPrice : finalPrice.toFixed(0)}
                                        </span>
                                    </div>
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
                            <Button
                                onClick={handleConfirmAndPay}
                                className={`flex-1 ${isTrialMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                Pay ${isTrialMode ? trialPrice : finalPrice.toFixed(0)}
                            </Button>
                        </div>
                    </>
                )}

                {/* Step: Processing */}
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
