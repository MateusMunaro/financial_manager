'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { colors, getColor, type ThemeMode, type ColorDefinition } from '@/lib/styles/colors';

/**
 * Interface do ThemeContext
 */
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  getThemeColor: (colorDef: ColorDefinition) => string;
  colors: typeof colors;
  isDark: boolean;
  isLight: boolean;
}

/**
 * Cria o contexto do tema
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props do ThemeProvider
 */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

/**
 * Provider do ThemeContext
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'app-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Carregar tema do localStorage e aplicar ao documento
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem(storageKey) as ThemeMode | null;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(savedTheme);
        applyThemeToDocument(savedTheme);
      } else {
        // Se não houver tema salvo, detectar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme: ThemeMode = prefersDark ? 'dark' : 'light';
        setThemeState(systemTheme);
        applyThemeToDocument(systemTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      applyThemeToDocument(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Aplicar tema ao documento (classes e CSS variables)
  const applyThemeToDocument = (newTheme: ThemeMode) => {
    const root = document.documentElement;
    
    // Adicionar classe ao HTML para usar com Tailwind dark mode
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Aplicar CSS variables para uso direto no CSS
    root.style.setProperty('--color-brand-primary', getColor(colors.brand.primary, newTheme));
    root.style.setProperty('--color-brand-secondary', getColor(colors.brand.secondary, newTheme));
    root.style.setProperty('--color-brand-accent', getColor(colors.brand.accent, newTheme));
    
    root.style.setProperty('--color-bg-default', getColor(colors.background.default, newTheme));
    root.style.setProperty('--color-bg-paper', getColor(colors.background.paper, newTheme));
    root.style.setProperty('--color-bg-elevated', getColor(colors.background.elevated, newTheme));
    
    root.style.setProperty('--color-text-primary', getColor(colors.text.primary, newTheme));
    root.style.setProperty('--color-text-secondary', getColor(colors.text.secondary, newTheme));
    root.style.setProperty('--color-text-disabled', getColor(colors.text.disabled, newTheme));
    
    root.style.setProperty('--color-positive', getColor(colors.semantic.positive, newTheme));
    root.style.setProperty('--color-negative', getColor(colors.semantic.negative, newTheme));
    root.style.setProperty('--color-neutral', getColor(colors.semantic.neutral, newTheme));
    
    root.style.setProperty('--color-border-default', getColor(colors.border.default, newTheme));
    root.style.setProperty('--shadow-sm', getColor(colors.shadow.sm, newTheme));
    root.style.setProperty('--shadow-md', getColor(colors.shadow.md, newTheme));
    root.style.setProperty('--shadow-lg', getColor(colors.shadow.lg, newTheme));
  };

  /**
   * Alterna entre tema claro e escuro
   */
  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  /**
   * Define o tema manualmente
   */
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(storageKey, newTheme);
      applyThemeToDocument(newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  /**
   * Obtém a cor apropriada para o tema atual
   */
  const getThemeColor = (colorDef: ColorDefinition): string => {
    return getColor(colorDef, theme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    getThemeColor,
    colors,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  // Prevenir flash de conteúdo sem estilo (FOUC)
  // Renderiza children apenas após montar e carregar o tema
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para usar o ThemeContext
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme, getThemeColor } = useTheme();
 * 
 *   return (
 *     <div style={{ backgroundColor: getThemeColor(colors.background.default) }}>
 *       <button onClick={toggleTheme}>
 *         Tema atual: {theme}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
}

/**
 * Hook para obter uma cor específica do tema atual
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const bgColor = useThemeColor(colors.background.paper);
 *   const textColor = useThemeColor(colors.text.primary);
 * 
 *   return <div style={{ backgroundColor: bgColor, color: textColor }}>Hello</div>;
 * }
 * ```
 */
export function useThemeColor(colorDef: ColorDefinition): string {
  const { getThemeColor } = useTheme();
  return getThemeColor(colorDef);
}
