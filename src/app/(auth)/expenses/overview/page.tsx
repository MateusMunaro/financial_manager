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
import type { Expense } from '../_components/types';

export default function ExpensesOverviewPage() {
  const { getThemeColor } = useTheme();
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Mock data - substituir por dados reais da API
  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      name: 'Supermercado',
      value: 450.00,
      category: 'Alimentação',
      date: '2025-10-20',
      description: 'Compras do mês',
      paymentMethod: 'credit-card',
    },
    {
      id: '2',
      name: 'Netflix',
      value: 39.90,
      category: 'Entretenimento',
      date: '2025-10-19',
      paymentMethod: 'credit-card',
      isRecurring: true,
    },
    {
      id: '3',
      name: 'Combustível',
      value: 250.00,
      category: 'Transporte',
      date: '2025-10-18',
      paymentMethod: 'debit-card',
    },
    {
      id: '4',
      name: 'Restaurante',
      value: 120.00,
      category: 'Alimentação',
      date: '2025-10-17',
      paymentMethod: 'pix',
    },
    {
      id: '5',
      name: 'Farmácia',
      value: 85.50,
      category: 'Saúde',
      date: '2025-10-16',
      paymentMethod: 'debit-card',
    },
  ]);

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
            Comparação com Mês Anterior
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
                R$ 945,40
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Mês anterior
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                R$ 1.120,00
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
                  Economia
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: getThemeColor(colors.semantic.positive) }}
                >
                  -15.6% ↓
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
            <div
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
                    Netflix
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    25/10/2025
                  </p>
                </div>
                <p
                  className="font-bold"
                  style={{ color: getThemeColor(colors.semantic.negative) }}
                >
                  R$ 39,90
                </p>
              </div>
            </div>
            <div
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
                    Internet
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    28/10/2025
                  </p>
                </div>
                <p
                  className="font-bold"
                  style={{ color: getThemeColor(colors.semantic.negative) }}
                >
                  R$ 99,90
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
