'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  const { getThemeColor } = useTheme();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
        style={{
          backgroundColor: getThemeColor(colors.background.default),
          color: getThemeColor(colors.text.primary),
          border: `1px solid ${
            error
              ? getThemeColor(colors.semantic.negative)
              : getThemeColor(colors.border.default)
          }`,
        }}
        {...props}
      />
      {error && (
        <p
          className="text-xs mt-1"
          style={{ color: getThemeColor(colors.semantic.negative) }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
