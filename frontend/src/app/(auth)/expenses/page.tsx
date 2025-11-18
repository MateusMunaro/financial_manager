'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import Link from 'next/link';
import {
  ChartBarIcon,
  CreditCardIcon,
  ArrowPathIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useExpenseStats } from '@/hooks/api/useExpenses';
import { useRecurringExpenses } from '@/hooks/api/useRecurringExpenses';
import { usePaymentMethods } from '@/hooks/api/usePaymentMethods';

export default function ExpensesPage() {
  const { getThemeColor } = useTheme();
  
  // Fetch data from API
  const { stats, loading: statsLoading } = useExpenseStats();
  const { recurringExpenses, loading: recurringLoading } = useRecurringExpenses();
  const { paymentMethods, loading: paymentMethodsLoading } = usePaymentMethods();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const activeRecurringCount = recurringExpenses.filter(re => re.isActive).length;

  const sections = [
    {
      title: 'Visão Geral',
      description: 'Dashboard com estatísticas e insights dos seus gastos',
      href: '/expenses/overview',
      icon: ChartBarIcon,
      color: colors.brand.primary,
    },
    {
      title: 'Transações',
      description: 'Registre e visualize todos os seus gastos',
      href: '/expenses/transactions',
      icon: PlusCircleIcon,
      color: colors.brand.accent,
    },
    {
      title: 'Métodos de Pagamento',
      description: 'Gerencie cartões, PIX e outros métodos',
      href: '/expenses/payment-methods',
      icon: CreditCardIcon,
      color: colors.semantic.positive,
    },
    {
      title: 'Gastos Recorrentes',
      description: 'Configure boletos, assinaturas e despesas fixas',
      href: '/expenses/recurring',
      icon: ArrowPathIcon,
      color: colors.semantic.negative,
    },
  ];

  if (statsLoading || recurringLoading || paymentMethodsLoading) {
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
      <div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Gestão de Gastos
        </h1>
        <p
          className="text-lg"
          style={{ color: getThemeColor(colors.text.secondary) }}
        >
          Organize e controle todas as suas despesas
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card 
                elevated 
                className="h-full transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-4 rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: getThemeColor(section.color) + '20',
                    }}
                  >
                    <Icon
                      className="h-8 w-8"
                      style={{ color: getThemeColor(section.color) }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: getThemeColor(colors.text.primary) }}
                    >
                      {section.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: getThemeColor(colors.text.secondary) }}
                    >
                      {section.description}
                    </p>
                  </div>

                  <div
                    className="text-2xl transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: getThemeColor(colors.text.tertiary) }}
                  >
                    →
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card elevated>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Total do Período
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: getThemeColor(colors.semantic.negative) }}
          >
            {formatCurrency(stats?.total || 0)}
          </p>
        </Card>

        <Card elevated>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Gastos Recorrentes
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            {activeRecurringCount} {activeRecurringCount === 1 ? 'ativo' : 'ativos'}
          </p>
        </Card>

        <Card elevated>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Métodos Cadastrados
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            {paymentMethods.length}
          </p>
        </Card>
      </div>
    </div>
  );
}
