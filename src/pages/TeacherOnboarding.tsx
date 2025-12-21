import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { CheckCircle, AlertCircle, BookOpen, Video, Clock, Award } from 'lucide-react';

// Validation Schema with enhanced requirements
const teacherSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    hourlyRate: z.number().min(5, "Rate must be at least $5").max(200, "Rate cannot exceed $200"),
    experienceLevel: z.string().min(1, "Please select an experience level"),
    proficiencyLevel: z.string().min(1, "Please select your proficiency level"),
    yearsExperience: z.string().min(1, "Please select your teaching experience"),
    bio: z.string().min(100, "Please provide a more detailed bio (at least 100 characters)"),
    teachingPhilosophy: z.string().min(50, "Please describe your teaching approach (at least 50 characters)"),
    videoIntro: z.string().url("Please provide a valid URL").optional().or(z.literal('')),
    weeklyAvailability: z.string().min(1, "Please select your availability"),
    agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export const TeacherOnboarding: React.FC = () => {
    const [step, setStep] = useState(1);
    const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, watch } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema),
        defaultValues: { agreedToTerms: false }
    });

    const watchedFields = watch();

    const onSubmit = async (data: TeacherFormData) => {
        try {
            const response = await fetch('/api/teachers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStep(4); // Success step
            } else {
                const result = await response.json();
                alert(result.error || "There was an error submitting your application.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error. Please try again.");
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof TeacherFormData)[] = [];
        if (step === 1) {
            fieldsToValidate = ['fullName', 'email', 'proficiencyLevel', 'yearsExperience'];
        } else if (step === 2) {
            fieldsToValidate = ['bio', 'teachingPhilosophy', 'experienceLevel'];
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep(step + 1);
    };

    const requirements = [
        { icon: CheckCircle, text: 'Native or fluent Punjabi speaker', met: watchedFields.proficiencyLevel === 'native' || watchedFields.proficiencyLevel === 'fluent' },
        { icon: BookOpen, text: 'Teaching experience or credentials', met: watchedFields.experienceLevel && watchedFields.experienceLevel !== '' },
        { icon: Clock, text: 'Minimum 3 hours/week availability', met: watchedFields.weeklyAvailability && parseInt(watchedFields.weeklyAvailability) >= 3 },
        { icon: Video, text: 'Reliable internet for video calls', met: true },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Header */}
                        <div className="text-center mb-10">
                            <Award className="w-16 h-16 text-accent-500 mx-auto mb-4" />
                            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">Become a Teacher</h1>
                            <p className="text-secondary-600 text-lg">Join our community of educators helping kids connect with their Punjabi heritage.</p>
                        </div>

                        {/* Progress Steps */}
                        {step < 4 && (
                            <div className="flex items-center justify-center gap-4 mb-8">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > s ? 'bg-green-500 text-white' :
                                                step === s ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-500'
                                            }`}>
                                            {step > s ? <CheckCircle size={20} /> : s}
                                        </div>
                                        <span className={`hidden sm:block text-sm ${step >= s ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                            {s === 1 ? 'Basic Info' : s === 2 ? 'Experience' : 'Availability'}
                                        </span>
                                        {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-green-500' : 'bg-secondary-200'}`} />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Requirements Card */}
                        {step === 1 && (
                            <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-l-4 border-accent-500">
                                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-accent-500" />
                                    Requirements for Teachers
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {requirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <req.icon size={16} className={req.met ? 'text-green-500' : 'text-secondary-400'} />
                                            <span className={req.met ? 'text-secondary-900' : 'text-secondary-500'}>{req.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card variant="glass" className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Step 1: Basic Info */}
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Basic Information</h2>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                label="Full Name *"
                                                placeholder="e.g. Amit Singh"
                                                {...register('fullName')}
                                                error={errors.fullName?.message}
                                            />
                                            <Input
                                                label="Email Address *"
                                                type="email"
                                                placeholder="e.g. amit@example.com"
                                                {...register('email')}
                                                error={errors.email?.message}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Select
                                                label="Punjabi Proficiency Level *"
                                                options={[
                                                    { label: 'Select Level', value: '' },
                                                    { label: 'Native Speaker', value: 'native' },
                                                    { label: 'Fluent (Like Native)', value: 'fluent' },
                                                    { label: 'Advanced', value: 'advanced' },
                                                    { label: 'Intermediate', value: 'intermediate' },
                                                ]}
                                                {...register('proficiencyLevel')}
                                                error={errors.proficiencyLevel?.message}
                                            />
                                            <Select
                                                label="Teaching Experience *"
                                                options={[
                                                    { label: 'Select Experience', value: '' },
                                                    { label: 'No formal experience', value: '0' },
                                                    { label: '1-2 years', value: '1-2' },
                                                    { label: '3-5 years', value: '3-5' },
                                                    { label: '5-10 years', value: '5-10' },
                                                    { label: '10+ years', value: '10+' },
                                                ]}
                                                {...register('yearsExperience')}
                                                error={errors.yearsExperience?.message}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="button" size="lg" onClick={nextStep}>
                                                Continue
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Experience & Philosophy */}
                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Your Teaching Profile</h2>

                                        <Select
                                            label="Teacher Type *"
                                            options={[
                                                { label: 'Select Type', value: '' },
                                                { label: 'Professional Teacher (Certified/Degree)', value: 'professional' },
                                                { label: 'Community Tutor (Informal Experience)', value: 'community' },
                                            ]}
                                            {...register('experienceLevel')}
                                            error={errors.experienceLevel?.message}
                                        />

                                        <Textarea
                                            label="About You (Bio) *"
                                            placeholder="Tell students about yourself, your background, and why you teach Punjabi. This will be visible on your profile. (Min 100 characters)"
                                            rows={4}
                                            {...register('bio')}
                                            error={errors.bio?.message}
                                        />

                                        <Textarea
                                            label="Teaching Philosophy *"
                                            placeholder="Describe your teaching approach. How do you make lessons engaging? What methods do you use for different age groups? (Min 50 characters)"
                                            rows={3}
                                            {...register('teachingPhilosophy')}
                                            error={errors.teachingPhilosophy?.message}
                                        />

                                        <Input
                                            label="Introduction Video URL (Optional)"
                                            placeholder="e.g. https://youtube.com/watch?v=... or https://loom.com/..."
                                            {...register('videoIntro')}
                                            error={errors.videoIntro?.message}
                                        />
                                        <p className="text-xs text-secondary-500 -mt-4">Upload a 1-2 min video introducing yourself. This greatly increases your approval chances!</p>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                                Back
                                            </Button>
                                            <Button type="button" size="lg" onClick={nextStep}>
                                                Continue
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Availability & Submit */}
                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Availability & Rates</h2>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Select
                                                label="Weekly Availability *"
                                                options={[
                                                    { label: 'Select Availability', value: '' },
                                                    { label: '1-2 hours/week', value: '2' },
                                                    { label: '3-5 hours/week', value: '4' },
                                                    { label: '5-10 hours/week', value: '7' },
                                                    { label: '10-20 hours/week', value: '15' },
                                                    { label: '20+ hours/week (Full-time)', value: '25' },
                                                ]}
                                                {...register('weeklyAvailability')}
                                                error={errors.weeklyAvailability?.message}
                                            />
                                            <Input
                                                label="Hourly Rate ($ USD) *"
                                                type="number"
                                                placeholder="20"
                                                {...register('hourlyRate', { valueAsNumber: true })}
                                                error={errors.hourlyRate?.message}
                                            />
                                        </div>

                                        <Card className="p-4 bg-secondary-50 space-y-3">
                                            <h3 className="font-semibold text-secondary-900">Before You Submit</h3>
                                            <div className="space-y-2 text-sm text-secondary-600">
                                                <p>✅ Applications are reviewed within 48-72 hours</p>
                                                <p>✅ You'll receive an email with the decision</p>
                                                <p>✅ Approved teachers can set their own schedules</p>
                                                <p>✅ We collect a 15% platform fee on each lesson</p>
                                            </div>
                                        </Card>

                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                {...register('agreedToTerms')}
                                                className="mt-1 h-5 w-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-secondary-600">
                                                I agree to the <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Teacher Guidelines</a>. I confirm that the information provided is accurate.
                                            </span>
                                        </label>
                                        {errors.agreedToTerms && (
                                            <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>
                                        )}

                                        <div className="flex justify-between pt-4">
                                            <Button type="button" variant="outline" onClick={() => setStep(2)}>
                                                Back
                                            </Button>
                                            <Button type="submit" size="lg" isLoading={isSubmitting}>
                                                Submit Application
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Success */}
                                {step === 4 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-secondary-900 mb-4">Application Submitted!</h2>
                                        <p className="text-secondary-600 mb-8 max-w-md mx-auto">
                                            Thank you for applying! We'll review your application and get back to you within 48-72 hours at the email address you provided.
                                        </p>
                                        <Button onClick={() => window.location.href = '/'}>
                                            Return to Home
                                        </Button>
                                    </motion.div>
                                )}
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};
