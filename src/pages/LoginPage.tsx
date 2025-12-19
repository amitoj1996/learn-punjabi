import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Logo } from '../components/Logo';

interface AuthProvider {
    name: string;
    icon: React.ReactNode;
    url: string;
    color: string;
    bgColor: string;
}

const providers: AuthProvider[] = [
    {
        name: 'Microsoft',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
        ),
        url: '/login/microsoft',
        color: 'text-gray-700',
        bgColor: 'bg-white hover:bg-gray-50 border border-gray-300'
    }
];

export const LoginPage: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <Logo size="lg" showText={false} />
                            </div>
                            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Welcome to PunjabiLearn</h1>
                            <p className="text-secondary-500">Sign in to start your language journey</p>
                        </div>

                        {/* Provider Buttons */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-3"
                        >
                            {providers.map((provider) => (
                                <motion.a
                                    key={provider.name}
                                    href={provider.url}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-medium transition-all ${provider.bgColor} ${provider.color}`}
                                >
                                    {provider.icon}
                                    <span>Continue with {provider.name}</span>
                                </motion.a>
                            ))}
                        </motion.div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-secondary-200" />
                            <span className="text-sm text-secondary-400">or</span>
                            <div className="flex-1 h-px bg-secondary-200" />
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-secondary-400 text-center">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-secondary-500 text-sm mt-6">
                        New here? Signing in will create your account automatically.
                    </p>
                </motion.div>
            </div>
        </Layout>
    );
};
