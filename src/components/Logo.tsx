import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
    const sizeClasses = {
        sm: { icon: 'w-8 h-8 text-lg', text: 'text-lg' },
        md: { icon: 'w-10 h-10 text-xl', text: 'text-xl' },
        lg: { icon: 'w-14 h-14 text-3xl', text: 'text-3xl' }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Icon - Gurmukhi ਪ with gradient background */}
            <div className={`${sizeClasses[size].icon} rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 transform hover:scale-105 transition-transform`}>
                <span className="text-white font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
                    ਪ
                </span>
            </div>

            {/* Text */}
            {showText && (
                <div className={`${sizeClasses[size].text} font-display font-bold`}>
                    <span className="text-secondary-900">Punjabi</span>
                    <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Learn</span>
                </div>
            )}
        </div>
    );
};
