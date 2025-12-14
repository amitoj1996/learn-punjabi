import React from 'react';
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

// Validation Schema
const teacherSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    hourlyRate: z.number().min(1, "Rate must be at least $1"),
    experienceLevel: z.string().min(1, "Please select an experience level"),
    bio: z.string().min(50, "Please provide a more detailed bio (at least 50 characters)"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export const TeacherOnboarding: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema)
    });

    const onSubmit = async (data: TeacherFormData) => {
        try {
            const response = await fetch('/api/teachers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("Application submitted successfully!");
            } else {
                console.error(await response.text());
                alert("There was an error submitting your application. (Check if backend is running)");
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">Become a Teacher</h1>
                        <p className="text-secondary-600 text-lg">Join our community and help kids connect with their culture.</p>
                    </div>

                    <Card variant="glass" className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    placeholder="e.g. Amit Singh"
                                    {...register('fullName')}
                                    error={errors.fullName?.message}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="e.g. amit@example.com"
                                    {...register('email')}
                                    error={errors.email?.message}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Hourly Rate ($ USD)"
                                    type="number"
                                    placeholder="20"
                                    {...register('hourlyRate', { valueAsNumber: true })}
                                    error={errors.hourlyRate?.message}
                                />
                                <Select
                                    label="Experience Level"
                                    options={[
                                        { label: 'Select Level', value: '' },
                                        { label: 'Professional Teacher', value: 'professional' },
                                        { label: 'Community Tutor', value: 'community' },
                                    ]}
                                    {...register('experienceLevel')}
                                    error={errors.experienceLevel?.message}
                                />
                            </div>

                            <Textarea
                                label="About You"
                                placeholder="Tell students about your teaching style and experience..."
                                rows={5}
                                {...register('bio')}
                                error={errors.bio?.message}
                            />

                            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                                Submit Application
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    );
};
