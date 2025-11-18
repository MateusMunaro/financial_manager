'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * Componente de demonstração do sistema de temas
 * Mostra como usar as cores em diferentes componentes
 */
export function ThemeDemo() {
  const { theme, getThemeColor } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: getThemeColor(colors.background.default),
        color: getThemeColor(colors.text.primary),
        padding: '40px 20px',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: getThemeColor(colors.brand.primary) }}>
            Gerenciador Financeiro
          </h1>
          <ThemeToggle />
        </header>

        {/* Cards de Demonstração */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Card de Saldo */}
          <div
            style={{
              backgroundColor: getThemeColor(colors.card.background),
              border: `1px solid ${getThemeColor(colors.card.border)}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: getThemeColor(colors.shadow.md),
              transition: 'all 0.2s ease',
            }}
          >
            <h3 style={{ fontSize: '14px', color: getThemeColor(colors.text.secondary), marginBottom: '8px' }}>
              Saldo Total
            </h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: getThemeColor(colors.brand.primary) }}>
              € 5.420,50
            </p>
          </div>

          {/* Card de Receitas */}
          <div
            style={{
              backgroundColor: getThemeColor(colors.card.background),
              border: `1px solid ${getThemeColor(colors.card.border)}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: getThemeColor(colors.shadow.md),
              transition: 'all 0.2s ease',
            }}
          >
            <h3 style={{ fontSize: '14px', color: getThemeColor(colors.text.secondary), marginBottom: '8px' }}>
              Receitas
            </h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: getThemeColor(colors.semantic.positive) }}>
              + € 8.250,00
            </p>
          </div>

          {/* Card de Despesas */}
          <div
            style={{
              backgroundColor: getThemeColor(colors.card.background),
              border: `1px solid ${getThemeColor(colors.card.border)}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: getThemeColor(colors.shadow.md),
              transition: 'all 0.2s ease',
            }}
          >
            <h3 style={{ fontSize: '14px', color: getThemeColor(colors.text.secondary), marginBottom: '8px' }}>
              Despesas
            </h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: getThemeColor(colors.semantic.negative) }}>
              - € 2.829,50
            </p>
          </div>
        </div>

        {/* Seção de Transações */}
        <div
          style={{
            backgroundColor: getThemeColor(colors.card.background),
            border: `1px solid ${getThemeColor(colors.card.border)}`,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: getThemeColor(colors.shadow.md),
            marginBottom: '40px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            Últimas Transações
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { desc: 'Salário', value: 3500, type: 'positive' },
              { desc: 'Supermercado', value: -245.50, type: 'negative' },
              { desc: 'Freelance', value: 850, type: 'positive' },
              { desc: 'Conta de Luz', value: -89.90, type: 'negative' },
              { desc: 'Transferência', value: 0, type: 'neutral' },
            ].map((transaction, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: getThemeColor(colors.background.default),
                  border: `1px solid ${getThemeColor(colors.border.default)}`,
                }}
              >
                <span style={{ color: getThemeColor(colors.text.primary) }}>
                  {transaction.desc}
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: getThemeColor(
                      transaction.type === 'positive'
                        ? colors.semantic.positive
                        : transaction.type === 'negative'
                        ? colors.semantic.negative
                        : colors.semantic.neutral
                    ),
                  }}
                >
                  {transaction.value > 0 ? '+' : ''} € {Math.abs(transaction.value).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            Status e Badges
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Pago', type: 'success' },
              { label: 'Pendente', type: 'warning' },
              { label: 'Atrasado', type: 'danger' },
              { label: 'Em análise', type: 'info' },
              { label: 'Categoria', type: 'primary' },
            ].map((badge, index) => (
              <span
                key={index}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: getThemeColor(
                    badge.type === 'success'
                      ? colors.semantic.positive
                      : badge.type === 'warning'
                      ? colors.semantic.warning
                      : badge.type === 'danger'
                      ? colors.semantic.negative
                      : badge.type === 'info'
                      ? colors.semantic.info
                      : colors.brand.primary
                  ) + '20',
                  color: getThemeColor(
                    badge.type === 'success'
                      ? colors.semantic.positive
                      : badge.type === 'warning'
                      ? colors.semantic.warning
                      : badge.type === 'danger'
                      ? colors.semantic.negative
                      : badge.type === 'info'
                      ? colors.semantic.info
                      : colors.brand.primary
                  ),
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Informações */}
        <div
          style={{
            backgroundColor: getThemeColor(colors.card.background),
            border: `1px solid ${getThemeColor(colors.card.border)}`,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: getThemeColor(colors.shadow.sm),
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            Sistema de Temas
          </h3>
          <p style={{ color: getThemeColor(colors.text.secondary), marginBottom: '8px' }}>
            Tema atual: <strong style={{ color: getThemeColor(colors.brand.primary) }}>{theme}</strong>
          </p>
          <p style={{ color: getThemeColor(colors.text.secondary), fontSize: '14px' }}>
            As cores são carregadas dinamicamente do arquivo colors.ts baseado no contexto atual.
            Experimente clicar no botão de toggle para ver a transição suave entre os temas!
          </p>
        </div>
      </div>
    </div>
  );
}
