import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height
}) => {
    const baseClasses = 'animate-pulse bg-secondary-200';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

// Pre-built skeleton patterns
export const CardSkeleton: React.FC = () => (
    <div className="p-6 bg-white rounded-xl border border-secondary-100">
        <div className="flex items-center gap-4 mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
                <Skeleton variant="text" className="w-1/2 mb-2" />
                <Skeleton variant="text" className="w-1/3" height={12} />
            </div>
        </div>
        <Skeleton variant="text" className="w-full mb-2" />
        <Skeleton variant="text" className="w-3/4 mb-4" />
        <div className="flex gap-2">
            <Skeleton variant="rectangular" className="w-20 h-8" />
            <Skeleton variant="rectangular" className="w-20 h-8" />
        </div>
    </div>
);

export const TutorCardSkeleton: React.FC = () => (
    <div className="p-6 bg-white rounded-2xl border border-secondary-100">
        <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
                <Skeleton variant="circular" width={64} height={64} />
                <div>
                    <Skeleton variant="text" className="w-32 mb-2" height={20} />
                    <Skeleton variant="text" className="w-24" height={14} />
                </div>
            </div>
            <Skeleton variant="rectangular" className="w-16 h-6 rounded-lg" />
        </div>
        <Skeleton variant="text" className="w-full mb-2" />
        <Skeleton variant="text" className="w-full mb-2" />
        <Skeleton variant="text" className="w-2/3 mb-4" />
        <div className="flex gap-2 mb-4">
            <Skeleton variant="rectangular" className="w-16 h-6 rounded-md" />
            <Skeleton variant="rectangular" className="w-16 h-6 rounded-md" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
            <Skeleton variant="text" className="w-20" height={24} />
            <div className="flex gap-2">
                <Skeleton variant="rectangular" className="w-10 h-8 rounded-lg" />
                <Skeleton variant="rectangular" className="w-20 h-8 rounded-lg" />
            </div>
        </div>
    </div>
);

export const BookingCardSkeleton: React.FC = () => (
    <div className="p-4 bg-white rounded-xl border border-secondary-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div>
                    <Skeleton variant="text" className="w-32 mb-2" />
                    <Skeleton variant="text" className="w-40" height={12} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton variant="rectangular" className="w-16 h-6 rounded-full" />
                <Skeleton variant="rectangular" className="w-8 h-8 rounded-lg" />
            </div>
        </div>
    </div>
);
