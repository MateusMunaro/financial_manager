'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { useDashboard, useRecentTransactions, useCategorySpending } from '@/hooks/api/useDashboard';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  isPositive?: boolean;
}

function StatCard({ title, value, change, icon: Icon, isPositive = true }: StatCardProps) {
  const { getThemeColor } = useTheme();

  return (
    <Card elevated>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            {title}
          </p>
          <p
            className="text-2xl font-bold mb-2"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            {value}
          </p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: getThemeColor(colors.brand.primary) + '20' }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { getThemeColor } = useTheme();
  const { data: dashboardData, loading: dashboardLoading } = useDashboard('month');
  const { transactions, loading: transactionsLoading } = useRecentTransactions(4);
  const { spending, loading: spendingLoading } = useCategorySpending('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Loading state
  if (dashboardLoading || transactionsLoading || spendingLoading) {
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
          Dashboard
        </h1>
        <p
          className="text-lg"
          style={{ color: getThemeColor(colors.text.secondary) }}
        >
          Visão geral das suas finanças
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Total"
          value={formatCurrency(dashboardData?.summary.totalBalance || 0)}
          change={formatPercentage(dashboardData?.summary.changePercentage.balance || 0)}
          icon={WalletIcon}
          isPositive={(dashboardData?.summary.changePercentage.balance || 0) >= 0}
        />
        <StatCard
          title="Receitas"
          value={formatCurrency(dashboardData?.summary.totalIncome || 0)}
          change={formatPercentage(dashboardData?.summary.changePercentage.income || 0)}
          icon={ArrowTrendingUpIcon}
          isPositive={(dashboardData?.summary.changePercentage.income || 0) >= 0}
        />
        <StatCard
          title="Despesas"
          value={formatCurrency(dashboardData?.summary.totalExpenses || 0)}
          change={formatPercentage(dashboardData?.summary.changePercentage.expenses || 0)}
          icon={ArrowTrendingDownIcon}
          isPositive={(dashboardData?.summary.changePercentage.expenses || 0) <= 0}
        />
        <StatCard
          title="Investimentos"
          value={formatCurrency(dashboardData?.summary.totalInvestments || 0)}
          change={formatPercentage(dashboardData?.summary.changePercentage.investments || 0)}
          icon={BanknotesIcon}
          isPositive={(dashboardData?.summary.changePercentage.investments || 0) >= 0}
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <Card elevated>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Transações Recentes
          </h2>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p style={{ color: getThemeColor(colors.text.secondary) }}>
                Nenhuma transação recente
              </p>
            ) : (
              transactions.map((transaction, index) => (
                <div
                  key={transaction.id || index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                  }}
                >
                  <div className="flex-1">
                    <p
                      className="font-medium"
                      style={{ color: getThemeColor(colors.text.primary) }}
                    >
                      {transaction.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: getThemeColor(colors.text.secondary) }}
                    >
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p
                    className="font-bold"
                    style={{ 
                      color: transaction.type === 'income' 
                        ? getThemeColor(colors.semantic.positive) 
                        : getThemeColor(colors.semantic.negative) 
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.value))}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Monthly Summary */}
        <Card elevated>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Gastos por Categoria
          </h2>
          <div className="space-y-4">
            {spending.length === 0 ? (
              <p style={{ color: getThemeColor(colors.text.secondary) }}>
                Nenhum gasto registrado
              </p>
            ) : (
              spending.slice(0, 4).map((item, index) => {
                const percentage = item.limit ? (item.value / item.limit) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: getThemeColor(colors.text.primary) }}
                      >
                        {item.category}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: getThemeColor(colors.text.secondary) }}
                      >
                        {formatCurrency(item.value)}
                        {item.limit && ` / ${formatCurrency(item.limit)}`}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: getThemeColor(colors.background.elevated) }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.limit ? Math.min(percentage, 100) : item.percentage}%`,
                          backgroundColor: item.color || getThemeColor(colors.brand.primary),
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
