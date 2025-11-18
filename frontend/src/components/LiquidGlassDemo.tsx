'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors, getColor } from '@/lib/styles/colors';

/**
 * Componente de demonstração do design Liquid Glass
 * Mostra os efeitos de vidro líquido inspirados na Apple
 */
export default function LiquidGlassDemo() {
  const { theme } = useTheme();

  const getThemeColor = (colorDef: any) => getColor(colorDef, theme);

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: getThemeColor(colors.background.default),
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            color: getThemeColor(colors.text.primary),
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
          }}
        >
          Liquid Glass Design System
        </h1>
        <p
          style={{
            color: getThemeColor(colors.text.secondary),
            fontSize: '1.1rem',
            marginBottom: '3rem',
          }}
        >
          Inspirado no design moderno da Apple com efeitos de vidro líquido
        </p>

        {/* Glass Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Primary Card */}
          <div
            style={{
              background: getThemeColor(colors.card.background),
              border: `1px solid ${getThemeColor(colors.card.border)}`,
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(12px)',
              boxShadow: getThemeColor(colors.shadow.md),
            }}
          >
            <h3
              style={{
                color: getThemeColor(colors.brand.primary),
                marginBottom: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
              }}
            >
              Primary Color
            </h3>
            <p style={{ color: getThemeColor(colors.text.secondary) }}>
              Apple Blue - O azul icônico da Apple
            </p>
            <div
              style={{
                marginTop: '1rem',
                height: '60px',
                borderRadius: '12px',
                background: getThemeColor(colors.brand.primary),
              }}
            />
          </div>

          {/* Accent Card */}
          <div
            style={{
              background: getThemeColor(colors.card.background),
              border: `1px solid ${getThemeColor(colors.card.border)}`,
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(12px)',
              boxShadow: getThemeColor(colors.shadow.md),
            }}
          >
            <h3
              style={{
                color: getThemeColor(colors.brand.accent),
                marginBottom: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
              }}
            >
              Accent Color
            </h3>
            <p style={{ color: getThemeColor(colors.text.secondary) }}>
              Apple Pink - Para destaques importantes
            </p>
            <div
              style={{
                marginTop: '1rem',
                height: '60px',
                borderRadius: '12px',
                background: getThemeColor(colors.brand.accent),
              }}
            />
          </div>

          {/* Purple Card */}
          <div
            style={{
              background: getThemeColor(colors.card.background),
              border: `1px solid ${getThemeColor(colors.card.border)}`,
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(12px)',
              boxShadow: getThemeColor(colors.shadow.md),
            }}
          >
            <h3
              style={{
                color: getThemeColor(colors.brand.secondary),
                marginBottom: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
              }}
            >
              Secondary Color
            </h3>
            <p style={{ color: getThemeColor(colors.text.secondary) }}>
              Oceanic Depth - Elegância e criatividade
            </p>
            <div
              style={{
                marginTop: '1rem',
                height: '60px',
                borderRadius: '12px',
                background: getThemeColor(colors.brand.secondary),
              }}
            />
          </div>
        </div>

        {/* Semantic Colors */}
        <h2
          style={{
            color: getThemeColor(colors.text.primary),
            fontSize: '1.75rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          Cores Semânticas
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          {[
            { name: 'Positive', color: colors.semantic.positive, label: 'Sucesso' },
            { name: 'Negative', color: colors.semantic.negative, label: 'Erro' },
            { name: 'Warning', color: colors.semantic.warning, label: 'Aviso' },
            { name: 'Info', color: colors.semantic.info, label: 'Info' },
            { name: 'Neutral', color: colors.semantic.neutral, label: 'Neutral' },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                background: getThemeColor(colors.background.glass),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
                borderRadius: '12px',
                padding: '1rem',
                backdropFilter: 'blur(8px)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  background: getThemeColor(item.color),
                  marginBottom: '0.5rem',
                }}
              />
              <p
                style={{
                  color: getThemeColor(colors.text.primary),
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons Demo */}
        <h2
          style={{
            color: getThemeColor(colors.text.primary),
            fontSize: '1.75rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          Botões Glass
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          {/* Primary Button */}
          <button
            style={{
              background: getThemeColor(colors.button.primary.background),
              color: getThemeColor(colors.button.primary.text),
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = getThemeColor(colors.button.primary.hover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = getThemeColor(colors.button.primary.background);
            }}
          >
            Primary Button
          </button>

          {/* Secondary Button */}
          <button
            style={{
              background: getThemeColor(colors.button.secondary.background),
              color: getThemeColor(colors.button.secondary.text),
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = getThemeColor(colors.button.secondary.hover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = getThemeColor(colors.button.secondary.background);
            }}
          >
            Secondary Button
          </button>

          {/* Outline Button */}
          <button
            style={{
              background: 'transparent',
              color: getThemeColor(colors.button.outline.text),
              border: `2px solid ${getThemeColor(colors.button.outline.border)}`,
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = getThemeColor(colors.button.outline.hover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Outline Button
          </button>
        </div>

        {/* Gradients Demo */}
        <h2
          style={{
            color: getThemeColor(colors.text.primary),
            fontSize: '1.75rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          Gradientes Líquidos
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { name: 'Primary', gradient: colors.gradient.primary },
            { name: 'Glass', gradient: colors.gradient.glass },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                height: '100px',
                borderRadius: '16px',
                background: getThemeColor(item.gradient),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.125rem',
                boxShadow: getThemeColor(colors.shadow.md),
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
