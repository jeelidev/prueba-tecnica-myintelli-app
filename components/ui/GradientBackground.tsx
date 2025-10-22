import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';

export const GradientBackground = ({ children, className }: { className?: string, children: ReactNode }) => {
    return (
        <LinearGradient
            colors={['rgba(232, 232, 232, 1)', 'rgba(255, 255, 255, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={className}
        >
            {children}
        </LinearGradient>
    );
};