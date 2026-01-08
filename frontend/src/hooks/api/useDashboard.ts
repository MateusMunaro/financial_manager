/**
 * Dashboard Hooks
 * 
 * Hooks React para consumir os endpoints do dashboard.
 * Utiliza o DashboardDataManager para separar a lógica de dados.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardDataManager } from '@/lib/data-managers/dashboard.data-manager';
import {
  DashboardData,
  FinancialSummary,
  RecentTransaction,
  CategorySpending,
  MonthlyTrend,
} from '@/lib/schemas/dashboard.schema';
import { Period } from '@/lib/schemas/expense.schema';

// ============================================
// TIPOS
// ============================================

export interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseFinancialSummaryResult {
  summary: FinancialSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  derivedMetrics: {
    savingsRate: number;
    expenseToIncomeRatio: number;
    netWorth: number;
    isHealthy: boolean;
  } | null;
}

export interface UseRecentTransactionsResult {
  transactions: RecentTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mobileTransactions: Array<{
    id: string | number;
    title: string;
    category: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
  }>;
}

export interface UseCategorySpendingResult {
  spending: CategorySpending[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  aggregated: {
    categories: CategorySpending[];
    total: number;
    topCategory: CategorySpending | null;
  };
}

export interface UseMonthlyTrendResult {
  trend: MonthlyTrend[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================
// HOOKS
// ============================================

/**
 * Hook para buscar todos os dados do dashboard
 */
export function useDashboard(period: Period = 'month'): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await dashboardDataManager.fetchDashboardData(period);

    if (response.success) {
      setData(response.data);
    } else {
      setError(response.error || 'Erro desconhecido');
    }

    setLoading(false);
  }, [period]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

/**
 * Hook para buscar resumo financeiro
 */
export function useFinancialSummary(period: Period = 'month'): UseFinancialSummaryResult {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await dashboardDataManager.fetchFinancialSummary(period);

    if (response.success) {
      setSummary(response.data);
    } else {
      setError(response.error || 'Erro desconhecido');
    }

    setLoading(false);
  }, [period]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Calcula métricas derivadas
  const derivedMetrics = useMemo(() => {
    if (!summary) return null;
    return dashboardDataManager.calculateDerivedMetrics(summary);
  }, [summary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
    derivedMetrics,
  };
}

/**
 * Hook para buscar transações recentes
 */
export function useRecentTransactions(limit: number = 10): UseRecentTransactionsResult {
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await dashboardDataManager.fetchRecentTransactions(limit);

    if (response.success) {
      setTransactions(response.data);
    } else {
      setError(response.error || 'Erro desconhecido');
    }

    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Transforma para formato mobile
  const mobileTransactions = useMemo(() => {
    return dashboardDataManager.transformTransactionsForMobile(transactions);
  }, [transactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    mobileTransactions,
  };
}

/**
 * Hook para buscar gastos por categoria
 */
export function useCategorySpending(period: Period = 'month'): UseCategorySpendingResult {
  const [spending, setSpending] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpending = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await dashboardDataManager.fetchCategorySpending(period);

    if (response.success) {
      setSpending(response.data);
    } else {
      setError(response.error || 'Erro desconhecido');
    }

    setLoading(false);
  }, [period]);

  useEffect(() => {
    fetchSpending();
  }, [fetchSpending]);

  // Agrega dados de categoria
  const aggregated = useMemo(() => {
    return dashboardDataManager.aggregateCategorySpending(spending);
  }, [spending]);

  return {
    spending,
    loading,
    error,
    refetch: fetchSpending,
    aggregated,
  };
}

/**
 * Hook para buscar tendência mensal
 */
export function useMonthlyTrend(months: number = 6): UseMonthlyTrendResult {
  const [trend, setTrend] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await dashboardDataManager.fetchMonthlyTrend(months);

    if (response.success) {
      setTrend(response.data);
    } else {
      setError(response.error || 'Erro desconhecido');
    }

    setLoading(false);
  }, [months]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return {
    trend,
    loading,
    error,
    refetch: fetchTrend,
  };
}

/**
 * Hook para buscar múltiplos dados em paralelo (otimizado)
 */
export function useDashboardParallel(options: {
  period?: Period;
  transactionLimit?: number;
  trendMonths?: number;
} = {}) {
  const { period = 'month', transactionLimit = 10, trendMonths = 6 } = options;

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [spending, setSpending] = useState<CategorySpending[]>([]);
  const [trend, setTrend] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{
    summary?: string;
    transactions?: string;
    spending?: string;
    trend?: string;
  }>({});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setErrors({});

    const response = await dashboardDataManager.fetchDashboardParallel({
      period,
      limit: transactionLimit,
      months: trendMonths,
    });

    // Processa resultados
    const newErrors: typeof errors = {};

    if (response.summary.success) {
      setSummary(response.summary.data);
    } else {
      newErrors.summary = response.summary.error;
    }

    if (response.transactions.success) {
      setTransactions(response.transactions.data);
    } else {
      newErrors.transactions = response.transactions.error;
    }

    if (response.spending.success) {
      setSpending(response.spending.data);
    } else {
      newErrors.spending = response.spending.error;
    }

    if (response.trend.success) {
      setTrend(response.trend.data);
    } else {
      newErrors.trend = response.trend.error;
    }

    setErrors(newErrors);
    setLoading(false);
  }, [period, transactionLimit, trendMonths]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Dados derivados
  const derivedMetrics = useMemo(() => {
    if (!summary) return null;
    return dashboardDataManager.calculateDerivedMetrics(summary);
  }, [summary]);

  const mobileTransactions = useMemo(() => {
    return dashboardDataManager.transformTransactionsForMobile(transactions);
  }, [transactions]);

  const aggregatedSpending = useMemo(() => {
    return dashboardDataManager.aggregateCategorySpending(spending);
  }, [spending]);

  return {
    summary,
    transactions,
    spending,
    trend,
    loading,
    errors,
    hasErrors: Object.keys(errors).length > 0,
    refetch: fetchAll,
    // Dados derivados
    derivedMetrics,
    mobileTransactions,
    aggregatedSpending,
  };
}

// ============================================
// UTILITÁRIOS EXPORTADOS
// ============================================

export const dashboardUtils = {
  formatCurrency: dashboardDataManager.formatCurrency.bind(dashboardDataManager),
  formatPercentage: dashboardDataManager.formatPercentage.bind(dashboardDataManager),
};
