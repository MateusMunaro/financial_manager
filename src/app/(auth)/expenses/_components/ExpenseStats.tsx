'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { ActivityChartCard } from '@/components/ActivityChartCard';
import {
  ChartPieIcon,
} from '@heroicons/react/24/outline';
import type { Expense } from './types';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  // Prepare data for weekly chart
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ptBR });
  const weekEnd = endOfWeek(today, { locale: ptBR });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = weekDays.map(day => {
    const dayExpenses = expenses.filter(exp => 
      isSameDay(parseISO(exp.date), day)
    );
    const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.value, 0);
    
    return {
      day: format(day, 'EEE', { locale: ptBR }),
      value: dayTotal,
    };
  });

  // Calculate trend (comparing this month vs last month)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const lastMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
  });

  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const trendPercentage = lastMonthTotal > 0 
    ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : '0';
  const isPositiveTrend = monthlyTotal < lastMonthTotal; // Positive = less expenses

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Chart Card - Replaces 2 cards */}
      <div className="lg:col-span-2">
        <ActivityChartCard
          title="Gastos da Semana"
          subtitle={`Total de ${expenses.length} transações este mês`}
          totalValue={formatCurrency(monthlyTotal)}
          data={weeklyData}
          trend={{
            value: `${trendPercentage}%`,
            isPositive: isPositiveTrend,
          }}
        />
      </div>

      {/* Top Category Card */}
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
