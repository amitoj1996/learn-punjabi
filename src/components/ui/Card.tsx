import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid';
}

export const Card: React.FC<CardProps> = ({
    className,
    variant = 'glass',
    children,
    ...props
}) => {
    const baseStyles = 'rounded-2xl p-6 transition-all';

    const variants = {
        glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl',
        solid: 'bg-white shadow-lg border border-secondary-100',
    };

    return (
        <div className={cn(baseStyles, variants[variant], className)} {...props}>
            {children}
        </div>
    );
};
