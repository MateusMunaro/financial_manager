'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { ExpenseStats } from '../_components/ExpenseStats';
import { CategoryBreakdown } from '../_components/CategoryBreakdown';
import { PeriodSelector } from '../_components/PeriodSelector';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useExpenses } from '@/hooks/api/useExpenses';
import { useRecurringExpenses } from '@/hooks/api/useRecurringExpenses';
import type { Period } from '@/lib/schemas/expense.schema';

export default function ExpensesOverviewPage() {
  const { getThemeColor } = useTheme();
  const [period, setPeriod] = useState<Period>('month');
  
  // Calculate date range based on period
  const getDateRange = (period: Period) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate = '';
    
    switch (period) {
      case 'day':
        startDate = endDate;
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case 'year':
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        startDate = yearAgo.toISOString().split('T')[0];
        break;
    }
    
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange(period);
  
  // Fetch expenses from API
  const { expenses, loading } = useExpenses({ startDate, endDate });
  const { recurringExpenses, loading: recurringLoading } = useRecurringExpenses();

  // Calculate upcoming bills from recurring expenses
  const upcomingBills = recurringExpenses
    .filter(re => re.isActive)
    .slice(0, 2);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate comparison with previous period
  const currentTotal = expenses.reduce((sum, exp) => sum + exp.value, 0);
  const previousTotal = 1120; // This would come from another API call with different period
  const savings = previousTotal - currentTotal;
  const savingsPercentage = previousTotal > 0 ? ((savings / previousTotal) * 100) : 0;

  if (loading || recurringLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: getThemeColor(colors.brand.primary) }}
          />
          <p style={{ color: getThemeColor(colors.text.secondary) }}>
            Carregando dados...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/expenses"
          className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: getThemeColor(colors.background.paper),
            border: `1px solid ${getThemeColor(colors.border.default)}`,
          }}
        >
          <ArrowLeftIcon
            className="h-5 w-5"
            style={{ color: getThemeColor(colors.text.primary) }}
          />
        </Link>
        
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Visão Geral
          </h1>
          <p
            className="text-lg"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Dashboard completo dos seus gastos
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <PeriodSelector period={period} onPeriodChange={setPeriod} />

      {/* Stats */}
      <ExpenseStats expenses={expenses} />

      {/* Category Breakdown */}
      <CategoryBreakdown expenses={expenses} period={period} />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevated>
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Comparação com Período Anterior
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="text-sm"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Total atual
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: getThemeColor(colors.semantic.negative) }}
              >
                {formatCurrency(currentTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Período anterior
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                {formatCurrency(previousTotal)}
              </span>
            </div>
            <div
              className="pt-4 border-t"
              style={{ borderColor: getThemeColor(colors.border.default) }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  {savings >= 0 ? 'Economia' : 'Aumento'}
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ 
                    color: savings >= 0 
                      ? getThemeColor(colors.semantic.positive) 
                      : getThemeColor(colors.semantic.negative) 
                  }}
                >
                  {savings >= 0 ? '' : '+'}{Math.abs(savingsPercentage).toFixed(1)}% {savings >= 0 ? '↓' : '↑'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card elevated>
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Próximos Vencimentos
          </h3>
          <div className="space-y-3">
            {upcomingBills.length === 0 ? (
              <p style={{ color: getThemeColor(colors.text.secondary) }}>
                Nenhuma despesa recorrente ativa
              </p>
            ) : (
              upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: getThemeColor(colors.text.primary) }}
                      >
                        {bill.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: getThemeColor(colors.text.secondary) }}
                      >
                        {bill.frequency === 'monthly' && bill.dayOfMonth && `Dia ${bill.dayOfMonth}`}
                        {bill.frequency === 'yearly' && 'Anual'}
                        {bill.frequency === 'weekly' && 'Semanal'}
                      </p>
                    </div>
                    <p
                      className="font-bold"
                      style={{ color: getThemeColor(colors.semantic.negative) }}
                    >
                      {formatCurrency(bill.value)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
