import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useNavigate } from 'react-router-dom';

interface TutorProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    hourlyRate: number;
    languages: string[];
}

export const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<TutorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [languages, setLanguages] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/teacher/status');
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'approved' && data.tutorProfile) {
                    const p = data.tutorProfile;
                    setProfile(p);
                    setName(p.name || '');
                    setBio(p.bio || '');
                    setHourlyRate(p.hourlyRate || 0);
                    setLanguages((p.languages || []).join(', '));
                } else {
                    setError('You must be an approved teacher to edit your profile.');
                }
            } else {
                setError('Failed to load profile');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/tutor/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    bio,
                    hourlyRate: Number(hourlyRate),
                    languages: languages.split(',').map(l => l.trim()).filter(Boolean)
                })
            });

            if (response.ok) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center">Loading your profile...</div>;
    }

    if (error && !profile) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="p-8 max-w-xl mx-auto text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-secondary-900 mb-2">Access Denied</h2>
                    <p className="text-secondary-600 mb-4">{error}</p>
                    <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-bold text-secondary-900">Edit Your Profile</h1>
                <p className="text-secondary-600 mt-2">Update your tutor profile information.</p>
            </header>

            <Card className="p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                            ✅ {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                            ❌ {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Display Name
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Bio
                        </label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell students about yourself, your teaching style, and experience..."
                            rows={5}
                        />
                        <p className="text-xs text-secondary-500 mt-1">This appears on your public profile.</p>
                    </div>

                    {/* Hourly Rate */}
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Hourly Rate ($)
                        </label>
                        <Input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            min={5}
                            max={200}
                            placeholder="25"
                            required
                        />
                        <p className="text-xs text-secondary-500 mt-1">Recommended: $15-50/hour for beginners.</p>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Languages (comma-separated)
                        </label>
                        <Input
                            type="text"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                            placeholder="Punjabi, English, Hindi"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
