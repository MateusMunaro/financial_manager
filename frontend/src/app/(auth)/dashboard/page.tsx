'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target,
} from 'lucide-react';
import { 
  useDashboard, 
  useRecentTransactions, 
  useCategorySpending,
  useMonthlyTrend,
  dashboardUtils 
} from '@/hooks/api/useDashboard';
import { useAuthContext } from '@/context/AuthContext';

// Responsive components
import {
  useViewport,
  MobileHeader,
  MetricCard,
  BudgetCard,
  TransactionList,
  ProgressBar,
  type Transaction,
} from '@/components/responsive';

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
  const { isMobile } = useViewport();
  const { user } = useAuthContext();
  const { data: dashboardData, loading: dashboardLoading } = useDashboard('month');
  const { transactions, mobileTransactions, loading: transactionsLoading } = useRecentTransactions(4);
  const { spending, aggregated, loading: spendingLoading } = useCategorySpending('month');
  const { trend, loading: trendLoading } = useMonthlyTrend(6);

  // Estados para mobile
  const [hideValues, setHideValues] = useState(false);

  const formatCurrency = (value: number) => {
    return dashboardUtils.formatCurrency(value);
  };

  const formatPercentage = (value: number) => {
    return dashboardUtils.formatPercentage(value);
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

  // ============================================
  // MOBILE LAYOUT
  // ============================================
  if (isMobile) {
    return (
      <div className="min-h-screen">
        {/* Mobile Header */}
        <MobileHeader
          userName={user?.name?.split(' ')[0] || 'Usuário'}
          subtitle="Aqui está seu resumo financeiro de hoje."
          avatarInitials={user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
          hideValues={hideValues}
          onToggleVisibility={() => setHideValues(!hideValues)}
          onNotificationsClick={() => console.log('Notificações')}
          unreadNotifications={0}
          showNewTransaction={false}
        />

        {/* Mobile Content */}
        <div className="p-4 pb-24 space-y-4">
          {/* Metrics Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Saldo Total"
              value={formatCurrency(dashboardData?.summary.totalBalance || 0)}
              trend={(dashboardData?.summary.changePercentage.balance || 0) >= 0 ? 'up' : 'down'}
              trendValue={formatPercentage(dashboardData?.summary.changePercentage.balance || 0)}
              icon={Wallet}
              iconColor="primary"
              isHidden={hideValues}
            />
            <MetricCard
              title="Receitas"
              value={formatCurrency(dashboardData?.summary.totalIncome || 0)}
              trend={(dashboardData?.summary.changePercentage.income || 0) >= 0 ? 'up' : 'down'}
              trendValue={formatPercentage(dashboardData?.summary.changePercentage.income || 0)}
              icon={TrendingUp}
              iconColor="positive"
              isHidden={hideValues}
            />
            <MetricCard
              title="Despesas"
              value={formatCurrency(dashboardData?.summary.totalExpenses || 0)}
              trend={(dashboardData?.summary.changePercentage.expenses || 0) <= 0 ? 'up' : 'down'}
              trendValue={formatPercentage(dashboardData?.summary.changePercentage.expenses || 0)}
              icon={TrendingDown}
              iconColor="negative"
              isHidden={hideValues}
            />
            <BudgetCard
              current={dashboardData?.summary.totalExpenses || 0}
              limit={dashboardData?.summary.totalIncome || 1}
              title="Orçamento"
              progressLabel="Gasto vs Receita"
              icon={Target}
            />
          </div>

          {/* Gastos por Categoria - Mobile */}
          <div className="bg-white/80 dark:bg-[#052659]/50 backdrop-blur-sm rounded-2xl border border-[#5483B3]/20 dark:border-[#7DA0CA]/20 p-4">
            <h2 className="text-lg font-bold text-[#021024] dark:text-[#C1E8FF] mb-4">
              Gastos por Categoria
            </h2>
            <div className="space-y-3">
              {spending.length === 0 ? (
                <p className="text-center text-[#5483B3]/60 dark:text-[#7DA0CA]/60 py-4">
                  Nenhum gasto registrado
                </p>
              ) : (
                spending.slice(0, 4).map((item, index) => (
                  <ProgressBar
                    key={index}
                    current={item.value}
                    max={item.limit || item.value}
                    label={item.category}
                    showPercentage
                    variant="auto"
                    formatValue={(c, m) => formatCurrency(c)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Transações Recentes - Mobile */}
          <TransactionList
            transactions={mobileTransactions}
            hideValues={hideValues}
            onTransactionClick={(tx) => console.log('Transaction clicked:', tx)}
            onViewAllClick={() => console.log('Ver todas')}
            title="Últimas Transações"
            maxItems={4}
          />
        </div>
      </div>
    );
  }

  // ============================================
  // DESKTOP LAYOUT (Original)
  // ============================================
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
