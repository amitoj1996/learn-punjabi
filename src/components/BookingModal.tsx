import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CreditCard, Lock, Sparkles, Calendar, X } from 'lucide-react';

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

// Get short timezone abbreviation (e.g., 'PST', 'IST')
const getTimezoneAbbr = (): string => {
    const date = new Date();
    const timeString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' });
    const parts = timeString.split(' ');
    return parts[parts.length - 1];
};

// Convert UTC time to local time for display
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
    if (totalLessons >= 16) return 35;  // 🔥 Max savings
    if (totalLessons >= 8) return 30;   // ⭐ Best value
    if (totalLessons >= 4) return 20;   // Popular
    if (totalLessons >= 2) return 10;   // Save 10%
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

    // Calculate dates for next 7 days
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

    const isSlotSelected = (dayName: string, time: string): boolean => {
        return selectedSlots.some(s => s.dayName === dayName && s.time === time);
    };

    const toggleSlot = (dayName: string, time: string, displayDay: string) => {
        if (isSlotSelected(dayName, time)) {
            setSelectedSlots(selectedSlots.filter(s => !(s.dayName === dayName && s.time === time)));
        } else if (selectedSlots.length < 5) {
            setSelectedSlots([...selectedSlots, { dayName, time, displayDay }]);
        }
    };

    const removeSlot = (index: number) => {
        setSelectedSlots(selectedSlots.filter((_, i) => i !== index));
    };

    // Calculate pricing
    const totalLessons = selectedSlots.length * weeks;
    const isTrialEligible = trialStatus?.eligible && totalLessons === 1;
    const discountPercent = isTrialEligible ? 75 : calculateDiscount(totalLessons);
    const regularTotal = tutor.hourlyRate * totalLessons;
    const discountAmount = regularTotal * (discountPercent / 100);
    const finalPrice = regularTotal - discountAmount;

    const handleProceedToPayment = () => {
        if (selectedSlots.length === 0) {
            setError('Please select at least one time slot');
            return;
        }
        setStep('confirm');
    };

    const handleConfirmAndPay = async () => {
        setStep('processing');
        setError(null);

        try {
            // Create booking(s) via API
            const response = await fetch('/api/bookings/recurring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tutorId: tutor.id,
                    slots: selectedSlots.map(s => ({
                        dayOfWeek: s.dayName,
                        time: s.time
                    })),
                    weeks: weeks,
                    duration: 60,
                    isTrial: isTrialEligible
                })
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
                    isTrial: isTrialEligible
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
                        {step === 'select' && `Book with ${tutor.name}`}
                        {step === 'confirm' && 'Confirm & Pay'}
                        {step === 'processing' && 'Redirecting...'}
                    </h2>
                    {step !== 'processing' && (
                        <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 text-2xl">&times;</button>
                    )}
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                {/* Step: Select Slots */}
                {step === 'select' && (
                    <>
                        {isLoading ? (
                            <div className="text-center py-8 text-secondary-500">Loading availability...</div>
                        ) : (
                            <>
                                {/* Trial Banner */}
                                {trialStatus?.eligible && selectedSlots.length === 0 && (
                                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                                        <Sparkles className="text-amber-500" size={24} />
                                        <div>
                                            <p className="font-bold text-amber-800">🎉 First Lesson: 75% Off!</p>
                                            <p className="text-sm text-amber-700">Try your first lesson for only ${Math.round(tutor.hourlyRate * 0.25)}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Selected Slots Display */}
                                {selectedSlots.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Your Schedule ({selectedSlots.length}/5 slots)
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
                                        {selectedSlots.length < 5 ? 'Add Time Slots' : 'Maximum 5 slots reached'}
                                    </label>
                                    <div className="grid grid-cols-7 gap-1">
                                        {nextDays.map(day => {
                                            const hasSlots = getAvailableSlots(day.dayName).length > 0;
                                            const isActive = activeDay === day.dayName;
                                            const hasSelected = selectedSlots.some(s => s.dayName === day.dayName);
                                            return (
                                                <button
                                                    key={day.date}
                                                    disabled={!hasSlots || selectedSlots.length >= 5}
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
                                                        disabled={!isSelected && selectedSlots.length >= 5}
                                                        className={`p-2 rounded-lg text-sm transition-all ${isSelected
                                                            ? 'bg-primary-500 text-white'
                                                            : selectedSlots.length >= 5
                                                                ? 'bg-secondary-50 text-secondary-300 cursor-not-allowed'
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
                                                        {isTrialEligible ? '🎉 First Lesson Discount' : `Save ${discountPercent}%`}
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
                        {/* Trial Banner */}
                        {isTrialEligible && (
                            <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                                <Sparkles className="text-amber-500" size={24} />
                                <div>
                                    <p className="font-bold text-amber-800">🎉 First Lesson - 75% Off!</p>
                                    <p className="text-sm text-amber-700">Your trial lesson discount is applied</p>
                                </div>
                            </div>
                        )}

                        {/* Discount Banner */}
                        {!isTrialEligible && discountPercent > 0 && (
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
                                    <span className="text-primary-700">Schedule</span>
                                    <span className="font-medium text-primary-900">
                                        {selectedSlots.map(s => DAY_LABELS[s.dayName]).join(', ')} for {weeks} week{weeks > 1 ? 's' : ''}
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
                                        <span className="font-bold text-green-600 text-lg">${finalPrice.toFixed(0)}</span>
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
                            <Button onClick={handleConfirmAndPay} className="flex-1 bg-green-600 hover:bg-green-700">
                                Pay ${finalPrice.toFixed(0)}
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
