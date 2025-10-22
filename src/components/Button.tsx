'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors, ColorDefinition } from '@/lib/styles/colors';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'positive' | 'negative' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const { getThemeColor } = useTheme();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const getVariantColor = (): ColorDefinition => {
    switch (variant) {
      case 'primary':
        return colors.brand.primary;
      case 'secondary':
        return colors.brand.secondary;
      case 'positive':
        return colors.semantic.positive;
      case 'negative':
        return colors.semantic.negative;
      case 'neutral':
        return colors.semantic.neutral;
      default:
        return colors.brand.primary;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-lg
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      style={{
        backgroundColor: disabled
          ? getThemeColor(colors.text.disabled)
          : getThemeColor(getVariantColor()),
        color: '#FFFFFF',
      }}
    >
      {children}
    </button>
  );
}
