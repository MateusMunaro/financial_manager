import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '@/lib/api/dashboard.api';
import {
  DashboardData,
  FinancialSummary,
} from '@/lib/schemas/dashboard.schema';
import { Period } from '@/lib/schemas/expense.schema';

export function useDashboard(period?: Period) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardApi.getAll(period);
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
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

export function useFinancialSummary(period?: Period) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getSummary(period);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar resumo financeiro');
      console.error('Error fetching financial summary:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
}

export function useRecentTransactions(limit: number = 10) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getRecentTransactions(limit);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
}

export function useCategorySpending(period?: Period) {
  const [spending, setSpending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getCategorySpending(period);
      setSpending(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar gastos por categoria');
      console.error('Error fetching category spending:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSpending();
  }, [fetchSpending]);

  return {
    spending,
    loading,
    error,
    refetch: fetchSpending,
  };
}

export function useMonthlyTrend(months: number = 6) {
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getMonthlyTrend(months);
      setTrend(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tendência mensal');
      console.error('Error fetching monthly trend:', err);
    } finally {
      setLoading(false);
    }
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
