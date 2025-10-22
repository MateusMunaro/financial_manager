'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';

/**
 * Componente de toggle de tema
 * Permite alternar entre tema claro e escuro
 */
export function ThemeToggle() {
  const { theme, toggleTheme, getThemeColor } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema"
      title={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      style={{
        backgroundColor: getThemeColor(colors.button.primary.background),
        color: getThemeColor(colors.button.primary.text),
        border: 'none',
        borderRadius: '8px',
        padding: '10px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        boxShadow: getThemeColor(colors.shadow.sm),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = getThemeColor(colors.button.primary.hover);
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = getThemeColor(colors.shadow.md);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = getThemeColor(colors.button.primary.background);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = getThemeColor(colors.shadow.sm);
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.backgroundColor = getThemeColor(colors.button.primary.active);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.backgroundColor = getThemeColor(colors.button.primary.hover);
      }}
    >
      {theme === 'light' ? (
        <>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          Tema Escuro
        </>
      ) : (
        <>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          Tema Claro
        </>
      )}
    </button>
  );
}
