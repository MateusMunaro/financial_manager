'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import {
  BanknotesIcon,
  ChartPieIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import type { Expense } from '../page';

interface ExpenseStatsProps {
  expenses: Expense[];
}

export function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const { getThemeColor } = useTheme();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.value, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.value;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Total de Gastos
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {formatCurrency(totalExpenses)}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {expenses.length} transações
            </p>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: getThemeColor(colors.semantic.negative) + '20' }}
          >
            <BanknotesIcon
              className="h-8 w-8"
              style={{ color: getThemeColor(colors.semantic.negative) }}
            />
          </div>
        </div>
      </Card>

      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Gastos deste Mês
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {formatCurrency(monthlyTotal)}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {monthlyExpenses.length} transações
            </p>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: getThemeColor(colors.brand.primary) + '20' }}
          >
            <CalendarIcon
              className="h-8 w-8"
              style={{ color: getThemeColor(colors.brand.primary) }}
            />
          </div>
        </div>
      </Card>

      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Maior Categoria
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {topCategory ? topCategory[0] : 'N/A'}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {topCategory ? formatCurrency(topCategory[1]) : 'Sem dados'}
            </p>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: getThemeColor(colors.brand.accent) + '20' }}
          >
            <ChartPieIcon
              className="h-8 w-8"
              style={{ color: getThemeColor(colors.brand.accent) }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
