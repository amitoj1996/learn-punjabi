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
import { CheckCircle, AlertCircle, BookOpen, Video, Clock, Award, Camera, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// Validation Schema with enhanced requirements
const teacherSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    photoUrl: z.string().min(1, "Please upload a profile photo"),
    timezone: z.string().min(1, "Please select your timezone"),
    languagesSpoken: z.array(z.string()).min(1, "Select at least one language"),
    hourlyRate: z.number().min(5, "Rate must be at least $5").max(200, "Rate cannot exceed $200"),
    experienceLevel: z.string().min(1, "Please select an experience level"),
    proficiencyLevel: z.string().min(1, "Please select your proficiency level"),
    yearsExperience: z.string().min(1, "Please select your teaching experience"),
    bio: z.string().min(100, "Please provide a more detailed bio (at least 100 characters)"),
    teachingPhilosophy: z.string().min(50, "Please describe your teaching approach (at least 50 characters)"),
    targetAgeGroups: z.array(z.string()).min(1, "Select at least one age group"),
    specializations: z.array(z.string()).min(1, "Select at least one specialization"),
    videoIntro: z.string().url("Please provide a valid URL").optional().or(z.literal('')),
    weeklyAvailability: z.string().min(1, "Please select your availability"),
    sessionLengths: z.array(z.string()).min(1, "Select at least one session length"),
    credentials: z.array(z.object({
        blobName: z.string(),
        docType: z.string(),
        fileName: z.string(),
    })).default([]),
    agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type TeacherFormData = z.input<typeof teacherSchema>;

// Credential type for uploaded documents
interface UploadedCredential {
    blobName: string;
    docType: string;
    fileName: string;
}

// Timezone options
const TIMEZONE_OPTIONS = [
    { label: 'Select Timezone', value: '' },
    { label: 'India (IST, UTC+5:30)', value: 'Asia/Kolkata' },
    { label: 'US Pacific (PST/PDT)', value: 'America/Los_Angeles' },
    { label: 'US Eastern (EST/EDT)', value: 'America/New_York' },
    { label: 'US Central (CST/CDT)', value: 'America/Chicago' },
    { label: 'UK (GMT/BST)', value: 'Europe/London' },
    { label: 'Canada Toronto (EST)', value: 'America/Toronto' },
    { label: 'Canada Vancouver (PST)', value: 'America/Vancouver' },
    { label: 'Australia Sydney (AEST)', value: 'Australia/Sydney' },
    { label: 'UAE (GST)', value: 'Asia/Dubai' },
    { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
];

// Languages
const LANGUAGES = ['Punjabi', 'English', 'Hindi', 'Urdu', 'Spanish', 'French', 'Other'];

// Age groups
const AGE_GROUPS = [
    { value: 'kids', label: 'Kids (5-12 years)' },
    { value: 'teens', label: 'Teenagers (13-17)' },
    { value: 'adults', label: 'Adults (18+)' },
    { value: 'seniors', label: 'Seniors (60+)' },
];

// Specializations
const SPECIALIZATIONS = [
    { value: 'conversational', label: 'Conversational Punjabi' },
    { value: 'reading', label: 'Reading Gurmukhi' },
    { value: 'writing', label: 'Writing Gurmukhi' },
    { value: 'gurbani', label: 'Gurbani & Religious Texts' },
    { value: 'grammar', label: 'Grammar & Structure' },
    { value: 'heritage', label: 'Heritage Learners' },
    { value: 'kids', label: 'Kids Lessons (Songs, Games)' },
    { value: 'business', label: 'Business Punjabi' },
];

// Session lengths
const SESSION_LENGTHS = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
];

export const TeacherOnboarding: React.FC = () => {
    const [step, setStep] = useState(1);
    const [photoUrl, setPhotoUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [credentials, setCredentials] = useState<UploadedCredential[]>([]);
    const [uploadingCredential, setUploadingCredential] = useState(false);

    const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            agreedToTerms: false,
            languagesSpoken: [],
            targetAgeGroups: [],
            specializations: [],
            sessionLengths: ['60'],
            credentials: [],
        }
    });

    const watchedFields = watch();

    // Credential upload handler
    const handleCredentialUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF or image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File must be under 5MB');
            return;
        }

        setUploadingCredential(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('docType', docType);

            const res = await fetch('/api/upload/credential', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const result = await res.json();
            const newCredential: UploadedCredential = {
                blobName: result.blobName,
                docType: result.docType,
                fileName: result.fileName || file.name,
            };

            const updatedCredentials = [...credentials, newCredential];
            setCredentials(updatedCredentials);
            setValue('credentials', updatedCredentials);
        } catch (err) {
            console.error('Credential upload error:', err);
            alert('Failed to upload credential. Please try again.');
        } finally {
            setUploadingCredential(false);
        }
    };

    // Remove a credential
    const removeCredential = (index: number) => {
        const updated = credentials.filter((_, i) => i !== index);
        setCredentials(updated);
        setValue('credentials', updated);
    };

    // Photo upload handler with compression
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);

        try {
            // Compress image before upload
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 400,
                useWebWorker: true,
                fileType: 'image/jpeg',
            });

            console.log(`Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB`);

            // Upload to Azure Blob Storage
            const formData = new FormData();
            formData.append('photo', compressedFile);

            const res = await fetch('/api/upload/photo', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const { url } = await res.json();
            setPhotoUrl(url);
            setValue('photoUrl', url);
        } catch (err) {
            console.error('Photo upload error:', err);
            alert('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: TeacherFormData) => {
        if (submitting) return; // Prevent double-click
        setSubmitting(true);

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
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof TeacherFormData)[] = [];
        if (step === 1) {
            fieldsToValidate = ['fullName', 'email', 'photoUrl', 'timezone', 'languagesSpoken', 'proficiencyLevel', 'yearsExperience'];
        } else if (step === 2) {
            fieldsToValidate = ['bio', 'teachingPhilosophy', 'experienceLevel', 'targetAgeGroups', 'specializations'];
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
                                            {s === 1 ? 'About You' : s === 2 ? 'Teaching Profile' : 'Availability'}
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
                                        <h2 className="text-xl font-bold text-secondary-900 mb-4">About You</h2>

                                        {/* Profile Photo Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                                Profile Photo *
                                            </label>
                                            <div className="flex items-center gap-4">
                                                {photoUrl ? (
                                                    <img src={photoUrl} className="w-20 h-20 rounded-full object-cover border-2 border-primary-200" alt="Profile" />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center border-2 border-dashed border-secondary-300">
                                                        <Camera size={28} className="text-secondary-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoUpload}
                                                        className="hidden"
                                                        id="photo-upload"
                                                    />
                                                    <label htmlFor="photo-upload">
                                                        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => document.getElementById('photo-upload')?.click()}>
                                                            {uploading ? (
                                                                <>
                                                                    <Upload size={16} className="mr-2 animate-spin" />
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload size={16} className="mr-2" />
                                                                    {photoUrl ? 'Change Photo' : 'Upload Photo'}
                                                                </>
                                                            )}
                                                        </Button>
                                                    </label>
                                                    <p className="text-xs text-secondary-500 mt-1">Auto-compressed. Students see this on your profile.</p>
                                                </div>
                                            </div>
                                            {errors.photoUrl && <p className="text-red-500 text-sm mt-2">{errors.photoUrl.message}</p>}
                                        </div>

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
                                                label="Your Timezone *"
                                                options={TIMEZONE_OPTIONS}
                                                {...register('timezone')}
                                                error={errors.timezone?.message}
                                            />
                                            <Select
                                                label="Punjabi Proficiency *"
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
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
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
                                            <div />
                                        </div>

                                        {/* Languages Spoken */}
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Languages You Speak *</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {LANGUAGES.map(lang => (
                                                    <label key={lang} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-secondary-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            value={lang}
                                                            {...register('languagesSpoken')}
                                                            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        {lang}
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.languagesSpoken && <p className="text-red-500 text-sm mt-1">{errors.languagesSpoken.message}</p>}
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

                                        {/* Target Age Groups */}
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Who do you want to teach? *</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {AGE_GROUPS.map(opt => (
                                                    <label key={opt.value} className="flex items-center gap-2 text-sm p-3 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            value={opt.value}
                                                            {...register('targetAgeGroups')}
                                                            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        {opt.label}
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.targetAgeGroups && <p className="text-red-500 text-sm mt-1">{errors.targetAgeGroups.message}</p>}
                                        </div>

                                        {/* Specializations */}
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">What can you teach? *</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {SPECIALIZATIONS.map(opt => (
                                                    <label key={opt.value} className="flex items-center gap-2 text-sm p-3 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            value={opt.value}
                                                            {...register('specializations')}
                                                            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        {opt.label}
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations.message}</p>}
                                        </div>

                                        {/* Credentials Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                                Teaching Credentials (Optional)
                                            </label>
                                            <p className="text-xs text-secondary-500 mb-3">
                                                Upload certificates, degrees, or qualifications. These help validate your profile and increase booking rates.
                                            </p>

                                            {/* Uploaded credentials list */}
                                            {credentials.length > 0 && (
                                                <div className="mb-3 space-y-2">
                                                    {credentials.map((cred, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle size={16} className="text-green-600" />
                                                                <span className="text-secondary-700">{cred.fileName}</span>
                                                                <span className="text-xs text-secondary-400">({cred.docType})</span>
                                                            </div>
                                                            <button type="button" onClick={() => removeCredential(index)} className="text-red-500 hover:text-red-700 text-xs">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) => handleCredentialUpload(e, 'certificate')}
                                                        className="hidden"
                                                        id="cert-upload"
                                                        disabled={uploadingCredential}
                                                    />
                                                    <label htmlFor="cert-upload">
                                                        <Button type="button" variant="outline" size="sm" disabled={uploadingCredential} onClick={() => document.getElementById('cert-upload')?.click()}>
                                                            {uploadingCredential ? 'Uploading...' : '+ Certificate'}
                                                        </Button>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) => handleCredentialUpload(e, 'degree')}
                                                        className="hidden"
                                                        id="degree-upload"
                                                        disabled={uploadingCredential}
                                                    />
                                                    <label htmlFor="degree-upload">
                                                        <Button type="button" variant="outline" size="sm" disabled={uploadingCredential} onClick={() => document.getElementById('degree-upload')?.click()}>
                                                            {uploadingCredential ? 'Uploading...' : '+ Degree'}
                                                        </Button>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) => handleCredentialUpload(e, 'other')}
                                                        className="hidden"
                                                        id="other-upload"
                                                        disabled={uploadingCredential}
                                                    />
                                                    <label htmlFor="other-upload">
                                                        <Button type="button" variant="outline" size="sm" disabled={uploadingCredential} onClick={() => document.getElementById('other-upload')?.click()}>
                                                            {uploadingCredential ? 'Uploading...' : '+ Other'}
                                                        </Button>
                                                    </label>
                                                </div>
                                            </div>
                                            <p className="text-xs text-secondary-400 mt-2">PDF or images, max 5MB each</p>
                                        </div>

                                        <Input
                                            label="Introduction Video URL (Optional)"
                                            placeholder="e.g. https://youtube.com/watch?v=... or https://vimeo.com/..."
                                            {...register('videoIntro')}
                                            error={errors.videoIntro?.message}
                                        />
                                        <p className="text-xs text-secondary-500 -mt-4">Record a 1-2 min intro on YouTube (can be unlisted). Greatly increases booking rates!</p>

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

                                        {/* Session Lengths */}
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Session Lengths You Offer *</label>
                                            <div className="flex flex-wrap gap-3">
                                                {SESSION_LENGTHS.map(opt => (
                                                    <label key={opt.value} className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            value={opt.value}
                                                            {...register('sessionLengths')}
                                                            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        {opt.label}
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.sessionLengths && <p className="text-red-500 text-sm mt-1">{errors.sessionLengths.message}</p>}
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
                                            <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={submitting}>
                                                Back
                                            </Button>
                                            <Button type="submit" size="lg" isLoading={submitting} disabled={submitting}>
                                                {submitting ? 'Submitting...' : 'Submit Application'}
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
