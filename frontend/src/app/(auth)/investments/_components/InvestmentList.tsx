'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import type { Investment } from '@/lib/schemas/investment.schema';

interface InvestmentListProps {
  investments: Investment[];
  onDelete: (id: string) => void;
}

export function InvestmentList({ investments, onDelete }: InvestmentListProps) {
  const { getThemeColor } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateProfit = (investment: Investment) => {
    const profit = investment.currentValue - investment.value;
    const percentage = ((profit / investment.value) * 100).toFixed(2);
    return { profit, percentage };
  };

  if (investments.length === 0) {
    return (
      <Card elevated>
        <div className="text-center py-12">
          <p
            className="text-lg"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Nenhum investimento registrado ainda.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card elevated>
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: getThemeColor(colors.text.primary) }}
      >
        Minha Carteira
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investments.map((investment) => {
          const { profit, percentage } = calculateProfit(investment);
          const isPositive = profit >= 0;

          return (
            <div
              key={investment.id}
              className="p-5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: getThemeColor(colors.background.elevated),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3
                    className="font-bold text-lg"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    {investment.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    {investment.type}
                    {investment.quantity && ` • ${investment.quantity} cotas`}
                  </p>
                </div>
                <Button
                  variant="negative"
                  size="sm"
                  onClick={() => onDelete(investment.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>

              {/* Values */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    Valor Investido:
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    {formatCurrency(investment.value)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    Valor Atual:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    {formatCurrency(investment.currentValue)}
                  </span>
                </div>
              </div>

              {/* Profit/Loss */}
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: isPositive
                    ? getThemeColor(colors.semantic.positive) + '15'
                    : getThemeColor(colors.semantic.negative) + '15',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isPositive
                        ? getThemeColor(colors.semantic.positive)
                        : getThemeColor(colors.semantic.negative),
                    }}
                  >
                    {isPositive ? 'Lucro' : 'Prejuízo'}
                  </span>
                  <div className="text-right">
                    <p
                      className="font-bold"
                      style={{
                        color: isPositive
                          ? getThemeColor(colors.semantic.positive)
                          : getThemeColor(colors.semantic.negative),
                      }}
                    >
                      {formatCurrency(Math.abs(profit))}
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: isPositive
                          ? getThemeColor(colors.semantic.positive)
                          : getThemeColor(colors.semantic.negative),
                      }}
                    >
                      {isPositive ? '+' : '-'}{Math.abs(parseFloat(percentage))}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: getThemeColor(colors.border.default) }}>
                <p
                  className="text-xs"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Comprado em {formatDate(investment.purchaseDate)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
