'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { Expense } from '../page';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
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

  if (expenses.length === 0) {
    return (
      <Card elevated>
        <div className="text-center py-12">
          <p
            className="text-lg"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Nenhum gasto registrado ainda.
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
        Histórico de Gastos
      </h2>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: getThemeColor(colors.background.elevated),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getThemeColor(colors.brand.primary) }}
                />
                <div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    {expense.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    {expense.category} • {formatDate(expense.date)}
                  </p>
                  {expense.description && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: getThemeColor(colors.text.secondary) }}
                    >
                      {expense.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p
                className="text-xl font-bold"
                style={{ color: getThemeColor(colors.semantic.negative) }}
              >
                {formatCurrency(expense.value)}
              </p>
              <Button
                variant="negative"
                size="sm"
                onClick={() => onDelete(expense.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
