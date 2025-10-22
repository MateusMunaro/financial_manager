'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import type { Expense, Period } from './types';

interface CategoryBreakdownProps {
  expenses: Expense[];
  period: Period;
}

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  const { getThemeColor } = useTheme();

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.value;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const categoryColors = [
    colors.brand.primary,
    colors.brand.accent,
    colors.semantic.positive,
    colors.semantic.negative,
    colors.semantic.neutral,
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card elevated>
      <h3
        className="text-xl font-bold mb-6"
        style={{ color: getThemeColor(colors.text.primary) }}
      >
        Gastos por Categoria
      </h3>

      <div className="space-y-4">
        {sortedCategories.map(([category, value], index) => {
          const percentage = (value / total) * 100;
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: getThemeColor(colors.text.primary) }}
                >
                  {category}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    {formatCurrency(value)}
                  </span>
                </div>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: getThemeColor(colors.background.elevated) }}
              >
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getThemeColor(categoryColors[index % categoryColors.length]),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {sortedCategories.length === 0 && (
        <p
          className="text-center py-8"
          style={{ color: getThemeColor(colors.text.secondary) }}
        >
          Nenhum dado disponível
        </p>
      )}
    </Card>
  );
}
