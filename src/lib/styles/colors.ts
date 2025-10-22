/**
 * Sistema de Cores por Contexto
 * 
 * Este arquivo define cores para cada componente da aplicação,
 * organizadas por contexto (light/dark).
 * 
 * O themeContext carrega as cores apropriadas baseado no tema ativo.
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
 * Cores do Sistema - Base
 */
export const colors = {
  // ===== BRAND COLORS =====
  brand: {
    primary: {
      light: '#007BFF',
      dark: '#0A84FF',
    },
    secondary: {
      light: '#6C757D',
      dark: '#8A939B',
    },
    accent: {
      light: '#FF6B6B',
      dark: '#FF8787',
    },
  },

  // ===== BACKGROUNDS =====
  background: {
    default: {
      light: '#F8F9FA',
      dark: '#121212',
    },
    paper: {
      light: '#FFFFFF',
      dark: '#1E1E1E',
    },
    elevated: {
      light: '#FFFFFF',
      dark: '#2C2C2C',
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.7)',
    },
  },

  // ===== TEXT =====
  text: {
    primary: {
      light: '#212529',
      dark: '#E9ECEF',
    },
    secondary: {
      light: '#6C757D',
      dark: '#ADB5BD',
    },
    disabled: {
      light: '#CED4DA',
      dark: '#495057',
    },
    inverse: {
      light: '#FFFFFF',
      dark: '#FFFFFF',
    },
    hint: {
      light: '#868E96',
      dark: '#868E96',
    },
  },

  // ===== SEMANTIC COLORS (FINANÇAS) =====
  semantic: {
    positive: {
      light: '#28A745',
      dark: '#34D058',
    },
    negative: {
      light: '#DC3545',
      dark: '#F85149',
    },
    neutral: {
      light: '#FFC107',
      dark: '#FFD54F',
    },
    info: {
      light: '#17A2B8',
      dark: '#58A6FF',
    },
    warning: {
      light: '#FD7E14',
      dark: '#FF9F40',
    },
  },

  // ===== BUTTONS =====
  button: {
    primary: {
      background: {
        light: '#007BFF',
        dark: '#0A84FF',
      },
      text: {
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
      hover: {
        light: '#0056B3',
        dark: '#0B6FD5',
      },
      active: {
        light: '#004085',
        dark: '#095CB8',
      },
      disabled: {
        light: '#CED4DA',
        dark: '#343A40',
      },
    },
    secondary: {
      background: {
        light: '#6C757D',
        dark: '#8A939B',
      },
      text: {
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
      hover: {
        light: '#5A6268',
        dark: '#6C747A',
      },
      active: {
        light: '#545B62',
        dark: '#5A6268',
      },
    },
    outline: {
      border: {
        light: '#007BFF',
        dark: '#0A84FF',
      },
      text: {
        light: '#007BFF',
        dark: '#0A84FF',
      },
      hover: {
        light: '#0056B3',
        dark: '#0B6FD5',
      },
    },
    ghost: {
      text: {
        light: '#007BFF',
        dark: '#0A84FF',
      },
      hover: {
        light: 'rgba(0, 123, 255, 0.1)',
        dark: 'rgba(10, 132, 255, 0.1)',
      },
    },
  },

  // ===== INPUTS =====
  input: {
    background: {
      light: '#FFFFFF',
      dark: '#1E1E1E',
    },
    border: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
    borderFocus: {
      light: '#007BFF',
      dark: '#0A84FF',
    },
    placeholder: {
      light: '#868E96',
      dark: '#6C757D',
    },
    disabled: {
      light: '#E9ECEF',
      dark: '#2C2C2C',
    },
    error: {
      light: '#DC3545',
      dark: '#F85149',
    },
  },

  // ===== CARDS =====
  card: {
    background: {
      light: '#FFFFFF',
      dark: '#1E1E1E',
    },
    border: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(0, 0, 0, 0.3)',
    },
    hover: {
      light: '#F8F9FA',
      dark: '#2C2C2C',
    },
  },

  // ===== NAVIGATION =====
  navigation: {
    background: {
      light: '#FFFFFF',
      dark: '#1E1E1E',
    },
    item: {
      light: '#212529',
      dark: '#E9ECEF',
    },
    itemActive: {
      light: '#007BFF',
      dark: '#0A84FF',
    },
    itemHover: {
      light: '#F8F9FA',
      dark: '#2C2C2C',
    },
    border: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
  },

  // ===== MODALS =====
  modal: {
    background: {
      light: '#FFFFFF',
      dark: '#1E1E1E',
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.7)',
    },
    border: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
  },

  // ===== TABLES =====
  table: {
    header: {
      light: '#F8F9FA',
      dark: '#2C2C2C',
    },
    row: {
      light: '#FFFFFF',
      dark: '#1E1E1E',
    },
    rowHover: {
      light: '#F8F9FA',
      dark: '#2C2C2C',
    },
    rowAlternate: {
      light: '#F8F9FA',
      dark: '#252525',
    },
    border: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
  },

  // ===== CHARTS =====
  chart: {
    primary: {
      light: '#007BFF',
      dark: '#0A84FF',
    },
    secondary: {
      light: '#6C757D',
      dark: '#8A939B',
    },
    success: {
      light: '#28A745',
      dark: '#34D058',
    },
    danger: {
      light: '#DC3545',
      dark: '#F85149',
    },
    warning: {
      light: '#FFC107',
      dark: '#FFD54F',
    },
    info: {
      light: '#17A2B8',
      dark: '#58A6FF',
    },
    grid: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
  },

  // ===== BADGES =====
  badge: {
    primary: {
      background: {
        light: '#007BFF',
        dark: '#0A84FF',
      },
      text: {
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
    },
    success: {
      background: {
        light: '#28A745',
        dark: '#34D058',
      },
      text: {
        light: '#FFFFFF',
        dark: '#000000',
      },
    },
    danger: {
      background: {
        light: '#DC3545',
        dark: '#F85149',
      },
      text: {
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
    },
    warning: {
      background: {
        light: '#FFC107',
        dark: '#FFD54F',
      },
      text: {
        light: '#000000',
        dark: '#000000',
      },
    },
    info: {
      background: {
        light: '#17A2B8',
        dark: '#58A6FF',
      },
      text: {
        light: '#FFFFFF',
        dark: '#000000',
      },
    },
  },

  // ===== BORDERS & DIVIDERS =====
  border: {
    default: {
      light: '#DEE2E6',
      dark: '#343A40',
    },
    light: {
      light: '#E9ECEF',
      dark: '#2C2C2C',
    },
    strong: {
      light: '#ADB5BD',
      dark: '#495057',
    },
  },

  // ===== SHADOWS =====
  shadow: {
    sm: {
      light: '0 1px 2px rgba(0, 0, 0, 0.05)',
      dark: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    md: {
      light: '0 4px 6px rgba(0, 0, 0, 0.1)',
      dark: '0 4px 6px rgba(0, 0, 0, 0.4)',
    },
    lg: {
      light: '0 10px 15px rgba(0, 0, 0, 0.1)',
      dark: '0 10px 15px rgba(0, 0, 0, 0.5)',
    },
    xl: {
      light: '0 20px 25px rgba(0, 0, 0, 0.15)',
      dark: '0 20px 25px rgba(0, 0, 0, 0.6)',
    },
  },

  // ===== STATUS =====
  status: {
    online: {
      light: '#28A745',
      dark: '#34D058',
    },
    offline: {
      light: '#6C757D',
      dark: '#8A939B',
    },
    away: {
      light: '#FFC107',
      dark: '#FFD54F',
    },
    busy: {
      light: '#DC3545',
      dark: '#F85149',
    },
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