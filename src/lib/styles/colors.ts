/**
 * Sistema de Cores - Oceanic Depth Design
 * Inspirado em uma paleta monocromática de azuis profundos e claros.
 *
 * Este arquivo define cores para cada componente da aplicação,
 * organizadas por contexto (light/dark) seguindo a estética Oceanic Depth:
 * - Superfícies com gradientes de azul
 * - Estilo corporativo, elegante e focado
 * - Sistema de profundidade com transparências
 * - Foco em alto contraste e legibilidade
 */

export type ThemeMode = 'light' | 'dark';

/**
 * Definição de cores para cada componente/contexto
 */
export interface ColorDefinition {
  light: string;
  dark: string;
}

// Paleta de cores base extraída da imagem
const oceanicDepthPalette = {
  darkest: '#021024',
  dark: '#052659',
  mid: '#5483B3',
  light: '#7DA0CA',
  lightest: '#C1E8FF',
};


/**
 * Cores do Sistema - Oceanic Depth Base
 */
export const colors = {
  // ===== BRAND COLORS - Oceanic Depth =====
  brand: {
    primary: {
      light: oceanicDepthPalette.mid, // #5483B3
      dark: oceanicDepthPalette.light, // #7DA0CA
    },
    secondary: {
      light: oceanicDepthPalette.dark, // #052659
      dark: oceanicDepthPalette.mid, // #5483B3
    },
    accent: {
      light: oceanicDepthPalette.light, // #7DA0CA
      dark: oceanicDepthPalette.lightest, // #C1E8FF
    },
  },

  // ===== BACKGROUNDS - Frosted Glass Effect =====
  background: {
    default: {
      light: '#F0F8FF', // AliceBlue, um branco azulado muito claro
      dark: oceanicDepthPalette.darkest,   // #021024
    },
    paper: {
      light: 'rgba(255, 255, 255, 0.85)',
      dark: 'rgba(5, 38, 89, 0.85)', // #052659 with alpha
    },
    elevated: {
      light: 'rgba(255, 255, 255, 0.95)',
      dark: 'rgba(5, 38, 89, 0.92)', // #052659 with alpha
    },
    overlay: {
      light: 'rgba(2, 16, 36, 0.4)',  // #021024 with alpha
      dark: 'rgba(2, 16, 36, 0.75)',
    },
    blur: {
      light: 'rgba(240, 248, 255, 0.7)',
      dark: 'rgba(5, 38, 89, 0.75)',   // #052659 with alpha
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.75)', // Mais transparência e branco puro
      dark: 'rgba(5, 38, 89, 0.85)', // Mais opaco para melhor leitura no dark
    },
  },

  // ===== TEXT - Enhanced Contrast =====
  text: {
    primary: {
      light: oceanicDepthPalette.darkest, // #021024
      dark: oceanicDepthPalette.lightest, // #C1E8FF
    },
    secondary: {
      light: oceanicDepthPalette.dark, // #052659
      dark: oceanicDepthPalette.light, // #7DA0CA
    },
    tertiary: {
      light: oceanicDepthPalette.mid, // #5483B3
      dark: 'rgba(125, 160, 202, 0.7)', // #7DA0CA with alpha
    },
    disabled: {
      light: 'rgba(84, 131, 179, 0.5)',
      dark: 'rgba(125, 160, 202, 0.4)',
    },
    inverse: {
      light: '#FFFFFF',
      dark: oceanicDepthPalette.darkest,
    },
    hint: {
      light: oceanicDepthPalette.mid,
      dark: oceanicDepthPalette.dark,
    },
    onGlass: {
      light: 'rgba(2, 16, 36, 0.9)',
      dark: 'rgba(193, 232, 255, 0.95)',
    },
  },

  // ===== SEMANTIC COLORS - Mantendo a clareza funcional =====
  semantic: {
    positive: {
      light: '#28a745', // Verde
      dark: '#28a745',
    },
    negative: {
      light: '#dc3545', // Vermelho
      dark: '#dc3545',
    },
    neutral: {
      light: oceanicDepthPalette.mid,
      dark: oceanicDepthPalette.light,
    },
    info: {
      light: '#17a2b8', // Ciano/Azul claro
      dark: '#17a2b8',
    },
    warning: {
      light: '#ffc107', // Amarelo
      dark: '#ffc107',
    },
  },

  // ===== BUTTONS - Glass Morphism =====
  button: {
    primary: {
      background: {
        light: oceanicDepthPalette.mid,
        dark: oceanicDepthPalette.light,
      },
      text: {
        light: '#FFFFFF',
        dark: oceanicDepthPalette.darkest,
      },
      hover: {
        light: oceanicDepthPalette.dark,
        dark: oceanicDepthPalette.lightest,
      },
      active: {
        light: oceanicDepthPalette.darkest,
        dark: 'rgba(193, 232, 255, 0.9)',
      },
      disabled: {
        light: 'rgba(84, 131, 179, 0.3)',
        dark: 'rgba(125, 160, 202, 0.3)',
      },
    },
    secondary: {
      background: {
        light: 'rgba(84, 131, 179, 0.12)',
        dark: 'rgba(125, 160, 202, 0.24)',
      },
      text: {
        light: oceanicDepthPalette.dark,
        dark: oceanicDepthPalette.light,
      },
      hover: {
        light: 'rgba(84, 131, 179, 0.18)',
        dark: 'rgba(125, 160, 202, 0.32)',
      },
    },
    outline: {
        border: {
            light: oceanicDepthPalette.mid,
            dark: oceanicDepthPalette.light,
        },
        text: {
            light: oceanicDepthPalette.mid,
            dark: oceanicDepthPalette.light,
        },
        hover: {
            light: 'rgba(84, 131, 179, 0.08)',
            dark: 'rgba(125, 160, 202, 0.12)',
        },
    }
  },

  // ===== INPUTS - Glass Style =====
  input: {
    background: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(5, 38, 89, 0.75)',
    },
    border: {
      light: 'rgba(84, 131, 179, 0.4)',
      dark: 'rgba(125, 160, 202, 0.4)',
    },
    borderFocus: {
      light: oceanicDepthPalette.mid,
      dark: oceanicDepthPalette.light,
    },
    placeholder: {
      light: 'rgba(84, 131, 179, 0.7)',
      dark: 'rgba(125, 160, 202, 0.6)',
    },
  },

  // ===== CARDS - Frosted Glass =====
  card: {
    background: {
      light: 'rgba(255, 255, 255, 0.85)',
      dark: 'rgba(5, 38, 89, 0.88)', // #052659 with alpha
    },
    border: {
      light: 'rgba(193, 232, 255, 0.8)',
      dark: 'rgba(84, 131, 179, 0.2)',
    },
    shadow: {
      light: 'rgba(2, 16, 36, 0.08)',
      dark: 'rgba(0, 0, 0, 0.4)',
    },
  },

  // ===== BORDERS & DIVIDERS - Subtle Glass =====
  border: {
    default: {
      light: 'rgba(84, 131, 179, 0.2)',
      dark: 'rgba(125, 160, 202, 0.25)',
    },
    strong: {
      light: 'rgba(84, 131, 179, 0.4)',
      dark: 'rgba(125, 160, 202, 0.4)',
    },
  },

  // ===== SHADOWS - Liquid Depth =====
  shadow: {
    sm: {
      light: '0 1px 3px rgba(2, 16, 36, 0.08)',
      dark: '0 1px 3px rgba(0, 0, 0, 0.3)',
    },
    md: {
      light: '0 4px 12px rgba(2, 16, 36, 0.1)',
      dark: '0 4px 12px rgba(0, 0, 0, 0.5)',
    },
    lg: {
      light: '0 12px 24px rgba(2, 16, 36, 0.12)',
      dark: '0 12px 24px rgba(0, 0, 0, 0.6)',
    },
    glow: {
      light: `0 0 20px rgba(125, 160, 202, 0.3)`,
      dark: `0 0 20px rgba(193, 232, 255, 0.2)`,
    },
  },
  
  // ===== GRADIENTS - Oceanic Depth Effects =====
  gradient: {
    glass: {
      light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(193, 232, 255, 0.6) 100%)',
      dark: `linear-gradient(135deg, ${oceanicDepthPalette.dark} 0%, ${oceanicDepthPalette.darkest} 100%)`,
    },
    primary: {
      light: `linear-gradient(135deg, ${oceanicDepthPalette.light} 0%, ${oceanicDepthPalette.dark} 100%)`,
      dark: `linear-gradient(135deg, ${oceanicDepthPalette.mid} 0%, ${oceanicDepthPalette.light} 100%)`,
    },
  },

  // ===== BLUR - Para o Efeito Glass =====
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

