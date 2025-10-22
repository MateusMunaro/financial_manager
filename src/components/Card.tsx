'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  elevated = false,
  padding = 'md' 
}: CardProps) {
  const { getThemeColor } = useTheme();

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-lg ${paddingClasses[padding]} ${className}`}
      style={{
        backgroundColor: elevated
          ? getThemeColor(colors.background.elevated)
          : getThemeColor(colors.background.paper),
        border: `1px solid ${getThemeColor(colors.border.default)}`,
        boxShadow: elevated ? getThemeColor(colors.shadow.md) : 'none',
      }}
    >
      {children}
    </div>
  );
}
