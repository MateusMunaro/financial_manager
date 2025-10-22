/**
 * Sistema de Cores - Liquid Glass Design
 * Inspirado no design moderno da Apple com efeitos de vidro líquido
 * 
 * Este arquivo define cores para cada componente da aplicação,
 * organizadas por contexto (light/dark) seguindo a estética Liquid Glass:
 * - Superfícies translúcidas e vidradas
 * - Cores vibrantes mas suaves
 * - Sistema de profundidade com transparências
 * - Efeitos de difusão de luz
 */

export type ThemeMode = 'light' | 'dark';

/**
 * Definição de cores para cada componente/contexto
 */
export interface ColorDefinition {
  light: string;
  dark: string;
}

/**
 * Cores do Sistema - Liquid Glass Base
 */
export const colors = {
  // ===== BRAND COLORS - Liquid Glass =====
  brand: {
    primary: {
      light: '#007AFF', // Apple Blue
      dark: '#0A84FF',  // Brighter Apple Blue
    },
    secondary: {
      light: '#8E8E93', // Apple Gray
      dark: '#98989D',
    },
    accent: {
      light: '#FF375F', // Apple Pink/Red
      dark: '#FF453A',
    },
    purple: {
      light: '#AF52DE', // Apple Purple
      dark: '#BF5AF2',
    },
    teal: {
      light: '#5AC8FA', // Apple Teal
      dark: '#64D2FF',
    },
  },

  // ===== BACKGROUNDS - Frosted Glass Effect =====
  background: {
    default: {
      light: '#F2F2F7', // Apple System Gray 6
      dark: '#000000',  // Pure black for OLED
    },
    paper: {
      light: 'rgba(255, 255, 255, 0.8)', // Translucent white
      dark: 'rgba(28, 28, 30, 0.85)',    // Translucent dark
    },
    elevated: {
      light: 'rgba(255, 255, 255, 0.95)', // More opaque
      dark: 'rgba(44, 44, 46, 0.92)',     // More opaque dark
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.4)',
      dark: 'rgba(0, 0, 0, 0.75)',
    },
    blur: {
      light: 'rgba(255, 255, 255, 0.7)',  // For backdrop-blur
      dark: 'rgba(18, 18, 18, 0.75)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.6)',  // Glass effect
      dark: 'rgba(30, 30, 30, 0.7)',
    },
  },

  // ===== TEXT - Enhanced Contrast =====
  text: {
    primary: {
      light: '#1C1C1E', // Apple Label
      dark: '#FFFFFF',  // Pure white for dark mode
    },
    secondary: {
      light: '#3A3A3C', // Apple Secondary Label
      dark: '#EBEBF5',  // 60% opacity white equivalent
    },
    tertiary: {
      light: '#48484A', // Apple Tertiary Label
      dark: '#EBEBF5',  // 30% opacity white equivalent
    },
    disabled: {
      light: '#C7C7CC', // Apple Quaternary Label
      dark: '#48484A',
    },
    inverse: {
      light: '#FFFFFF',
      dark: '#1C1C1E',
    },
    hint: {
      light: '#8E8E93',
      dark: '#8E8E93',
    },
    onGlass: {
      light: 'rgba(0, 0, 0, 0.85)',
      dark: 'rgba(255, 255, 255, 0.95)',
    },
  },

  // ===== SEMANTIC COLORS (FINANÇAS) - Liquid Vibrant =====
  semantic: {
    positive: {
      light: '#34C759', // Apple Green
      dark: '#30D158',
    },
    negative: {
      light: '#FF3B30', // Apple Red
      dark: '#FF453A',
    },
    neutral: {
      light: '#FF9500', // Apple Orange
      dark: '#FF9F0A',
    },
    info: {
      light: '#007AFF', // Apple Blue
      dark: '#0A84FF',
    },
    warning: {
      light: '#FFCC00', // Apple Yellow
      dark: '#FFD60A',
    },
    purple: {
      light: '#AF52DE',
      dark: '#BF5AF2',
    },
    pink: {
      light: '#FF2D55',
      dark: '#FF375F',
    },
    teal: {
      light: '#5AC8FA',
      dark: '#64D2FF',
    },
    indigo: {
      light: '#5856D6',
      dark: '#5E5CE6',
    },
  },

  // ===== BUTTONS - Glass Morphism =====
  button: {
    primary: {
      background: {
        light: '#007AFF',
        dark: '#0A84FF',
      },
      text: {
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
      hover: {
        light: '#0051D5',
        dark: '#409CFF',
      },
      active: {
        light: '#003D99',
        dark: '#0071E3',
      },
      disabled: {
        light: 'rgba(0, 122, 255, 0.3)',
        dark: 'rgba(10, 132, 255, 0.3)',
      },
      glass: {
        light: 'rgba(0, 122, 255, 0.15)',
        dark: 'rgba(10, 132, 255, 0.2)',
      },
    },
    secondary: {
      background: {
        light: 'rgba(142, 142, 147, 0.12)',
        dark: 'rgba(142, 142, 147, 0.24)',
      },
      text: {
        light: '#007AFF',
        dark: '#0A84FF',
      },
      hover: {
        light: 'rgba(142, 142, 147, 0.18)',
        dark: 'rgba(142, 142, 147, 0.32)',
      },
      active: {
        light: 'rgba(142, 142, 147, 0.24)',
        dark: 'rgba(142, 142, 147, 0.4)',
      },
    },
    outline: {
      border: {
        light: 'rgba(0, 122, 255, 0.5)',
        dark: 'rgba(10, 132, 255, 0.6)',
      },
      text: {
        light: '#007AFF',
        dark: '#0A84FF',
      },
      hover: {
        light: 'rgba(0, 122, 255, 0.08)',
        dark: 'rgba(10, 132, 255, 0.12)',
      },
    },
    ghost: {
      text: {
        light: '#007AFF',
        dark: '#0A84FF',
      },
      hover: {
        light: 'rgba(0, 122, 255, 0.08)',
        dark: 'rgba(10, 132, 255, 0.12)',
      },
    },
  },

  // ===== INPUTS - Glass Style =====
  input: {
    background: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(44, 44, 46, 0.75)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.15)',
    },
    borderFocus: {
      light: '#007AFF',
      dark: '#0A84FF',
    },
    placeholder: {
      light: 'rgba(60, 60, 67, 0.6)',
      dark: 'rgba(235, 235, 245, 0.6)',
    },
    disabled: {
      light: 'rgba(120, 120, 128, 0.16)',
      dark: 'rgba(120, 120, 128, 0.32)',
    },
    error: {
      light: '#FF3B30',
      dark: '#FF453A',
    },
  },

  // ===== CARDS - Frosted Glass =====
  card: {
    background: {
      light: 'rgba(255, 255, 255, 0.85)',
      dark: 'rgba(28, 28, 30, 0.88)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.06)',
      dark: 'rgba(0, 0, 0, 0.4)',
    },
    hover: {
      light: 'rgba(255, 255, 255, 0.95)',
      dark: 'rgba(44, 44, 46, 0.92)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.65)',
      dark: 'rgba(30, 30, 30, 0.75)',
    },
  },

  // ===== NAVIGATION - Translucent =====
  navigation: {
    background: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(28, 28, 30, 0.85)',
    },
    item: {
      light: '#1C1C1E',
      dark: '#FFFFFF',
    },
    itemActive: {
      light: '#007AFF',
      dark: '#0A84FF',
    },
    itemHover: {
      light: 'rgba(0, 122, 255, 0.08)',
      dark: 'rgba(10, 132, 255, 0.12)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
  },

  // ===== MODALS - Ultra Glass =====
  modal: {
    background: {
      light: 'rgba(255, 255, 255, 0.95)',
      dark: 'rgba(28, 28, 30, 0.95)',
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.4)',
      dark: 'rgba(0, 0, 0, 0.75)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.15)',
    },
  },

  // ===== TABLES - Refined =====
  table: {
    header: {
      light: 'rgba(242, 242, 247, 0.9)',
      dark: 'rgba(44, 44, 46, 0.9)',
    },
    row: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(28, 28, 30, 0.8)',
    },
    rowHover: {
      light: 'rgba(0, 122, 255, 0.05)',
      dark: 'rgba(10, 132, 255, 0.08)',
    },
    rowAlternate: {
      light: 'rgba(242, 242, 247, 0.6)',
      dark: 'rgba(44, 44, 46, 0.6)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
  },

  // ===== CHARTS - Vibrant Apple Colors =====
  chart: {
    primary: {
      light: '#007AFF',
      dark: '#0A84FF',
    },
    secondary: {
      light: '#5856D6',
      dark: '#5E5CE6',
    },
    success: {
      light: '#34C759',
      dark: '#30D158',
    },
    danger: {
      light: '#FF3B30',
      dark: '#FF453A',
    },
    warning: {
      light: '#FFCC00',
      dark: '#FFD60A',
    },
    info: {
      light: '#5AC8FA',
      dark: '#64D2FF',
    },
    purple: {
      light: '#AF52DE',
      dark: '#BF5AF2',
    },
    pink: {
      light: '#FF2D55',
      dark: '#FF375F',
    },
    orange: {
      light: '#FF9500',
      dark: '#FF9F0A',
    },
    grid: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
  },

  // ===== BADGES - Glass Pills =====
  badge: {
    primary: {
      background: {
        light: 'rgba(0, 122, 255, 0.15)',
        dark: 'rgba(10, 132, 255, 0.25)',
      },
      text: {
        light: '#007AFF',
        dark: '#0A84FF',
      },
    },
    success: {
      background: {
        light: 'rgba(52, 199, 89, 0.15)',
        dark: 'rgba(48, 209, 88, 0.25)',
      },
      text: {
        light: '#248A3D',
        dark: '#30D158',
      },
    },
    danger: {
      background: {
        light: 'rgba(255, 59, 48, 0.15)',
        dark: 'rgba(255, 69, 58, 0.25)',
      },
      text: {
        light: '#C7281E',
        dark: '#FF453A',
      },
    },
    warning: {
      background: {
        light: 'rgba(255, 204, 0, 0.15)',
        dark: 'rgba(255, 214, 10, 0.25)',
      },
      text: {
        light: '#B18B00',
        dark: '#FFD60A',
      },
    },
    info: {
      background: {
        light: 'rgba(90, 200, 250, 0.15)',
        dark: 'rgba(100, 210, 255, 0.25)',
      },
      text: {
        light: '#0D7EC1',
        dark: '#64D2FF',
      },
    },
    purple: {
      background: {
        light: 'rgba(175, 82, 222, 0.15)',
        dark: 'rgba(191, 90, 242, 0.25)',
      },
      text: {
        light: '#8944AB',
        dark: '#BF5AF2',
      },
    },
  },

  // ===== BORDERS & DIVIDERS - Subtle Glass =====
  border: {
    default: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
    light: {
      light: 'rgba(0, 0, 0, 0.04)',
      dark: 'rgba(255, 255, 255, 0.06)',
    },
    strong: {
      light: 'rgba(0, 0, 0, 0.15)',
      dark: 'rgba(255, 255, 255, 0.2)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.5)',
      dark: 'rgba(255, 255, 255, 0.1)',
    },
  },

  // ===== SHADOWS - Liquid Depth =====
  shadow: {
    sm: {
      light: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
      dark: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    },
    md: {
      light: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
      dark: '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)',
    },
    lg: {
      light: '0 12px 24px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.05)',
      dark: '0 12px 24px rgba(0, 0, 0, 0.6), 0 6px 12px rgba(0, 0, 0, 0.4)',
    },
    xl: {
      light: '0 24px 48px rgba(0, 0, 0, 0.12), 0 12px 24px rgba(0, 0, 0, 0.08)',
      dark: '0 24px 48px rgba(0, 0, 0, 0.7), 0 12px 24px rgba(0, 0, 0, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(0, 0, 0, 0.08)',
      dark: '0 8px 32px rgba(0, 0, 0, 0.6)',
    },
    glow: {
      light: '0 0 20px rgba(0, 122, 255, 0.15)',
      dark: '0 0 20px rgba(10, 132, 255, 0.25)',
    },
  },

  // ===== STATUS - Apple System Colors =====
  status: {
    online: {
      light: '#34C759',
      dark: '#30D158',
    },
    offline: {
      light: '#8E8E93',
      dark: '#98989D',
    },
    away: {
      light: '#FFCC00',
      dark: '#FFD60A',
    },
    busy: {
      light: '#FF3B30',
      dark: '#FF453A',
    },
  },

  // ===== GRADIENTS - Liquid Glass Effects =====
  gradient: {
    glass: {
      light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
      dark: 'linear-gradient(135deg, rgba(44, 44, 46, 0.9) 0%, rgba(28, 28, 30, 0.6) 100%)',
    },
    primary: {
      light: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
      dark: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
    },
    success: {
      light: 'linear-gradient(135deg, #34C759 0%, #5AC8FA 100%)',
      dark: 'linear-gradient(135deg, #30D158 0%, #64D2FF 100%)',
    },
    danger: {
      light: 'linear-gradient(135deg, #FF3B30 0%, #FF2D55 100%)',
      dark: 'linear-gradient(135deg, #FF453A 0%, #FF375F 100%)',
    },
    sunset: {
      light: 'linear-gradient(135deg, #FF9500 0%, #FF2D55 50%, #AF52DE 100%)',
      dark: 'linear-gradient(135deg, #FF9F0A 0%, #FF375F 50%, #BF5AF2 100%)',
    },
    ocean: {
      light: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
      dark: 'linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%)',
    },
  },

  // ===== BACKDROP BLUR - For Glass Effect =====
  blur: {
    none: 'blur(0px)',
    sm: 'blur(4px)',
    md: 'blur(12px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },
} as const;

/**
 * Helper function para obter cor baseada no tema
 * Uso: getColor(colors.brand.primary, theme)
 */
export function getColor(colorDef: ColorDefinition, theme: ThemeMode): string {
  return colorDef[theme];
}

/**
 * Helper type para extrair todas as cores de um contexto específico
 */
export type ColorPalette = typeof colors;

/**
 * Exportação para compatibilidade com código legado
 * @deprecated Use o objeto `colors` diretamente
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  positive: string;
  negative: string;
  neutral: string;
  border: string;
  disabled: string;
}

/**
 * @deprecated Use o objeto `colors` diretamente
 */
export const lightColors: ThemeColors = {
  primary: colors.brand.primary.light,
  secondary: colors.brand.secondary.light,
  background: colors.background.default.light,
  surface: colors.background.paper.light,
  textPrimary: colors.text.primary.light,
  textSecondary: colors.text.secondary.light,
  textOnPrimary: colors.text.inverse.light,
  positive: colors.semantic.positive.light,
  negative: colors.semantic.negative.light,
  neutral: colors.semantic.neutral.light,
  border: colors.border.default.light,
  disabled: colors.text.disabled.light,
};

/**
 * @deprecated Use o objeto `colors` diretamente
 */
export const darkColors: ThemeColors = {
  primary: colors.brand.primary.dark,
  secondary: colors.brand.secondary.dark,
  background: colors.background.default.dark,
  surface: colors.background.paper.dark,
  textPrimary: colors.text.primary.dark,
  textSecondary: colors.text.secondary.dark,
  textOnPrimary: colors.text.inverse.dark,
  positive: colors.semantic.positive.dark,
  negative: colors.semantic.negative.dark,
  neutral: colors.semantic.neutral.dark,
  border: colors.border.default.dark,
  disabled: colors.text.disabled.dark,
};