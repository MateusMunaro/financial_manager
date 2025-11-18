import { useState, useEffect, useCallback } from 'react';
import { investmentsApi } from '@/lib/api/investments.api';
import {
  Investment,
  CreateInvestmentInput,
  UpdateInvestmentInput,
  InvestmentFilters,
  InvestmentStats,
  InvestmentHistory,
} from '@/lib/schemas/investment.schema';

export function useInvestments(filters?: InvestmentFilters) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await investmentsApi.getAll(filters);
      setInvestments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar investimentos');
      console.error('Error fetching investments:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const createInvestment = async (
    data: CreateInvestmentInput
  ): Promise<Investment | null> => {
    try {
      setError(null);
      const newInvestment = await investmentsApi.create(data);
      setInvestments((prev) => [newInvestment, ...prev]);
      return newInvestment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar investimento');
      console.error('Error creating investment:', err);
      return null;
    }
  };

  const updateInvestment = async (
    id: string,
    data: UpdateInvestmentInput
  ): Promise<Investment | null> => {
    try {
      setError(null);
      const updatedInvestment = await investmentsApi.update(id, data);
      setInvestments((prev) =>
        prev.map((investment) => (investment.id === id ? updatedInvestment : investment))
      );
      return updatedInvestment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar investimento');
      console.error('Error updating investment:', err);
      return null;
    }
  };

  const deleteInvestment = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await investmentsApi.delete(id);
      setInvestments((prev) => prev.filter((investment) => investment.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar investimento');
      console.error('Error deleting investment:', err);
      return false;
    }
  };

  const updateCurrentValue = async (id: string, currentValue: number): Promise<boolean> => {
    try {
      setError(null);
      const updatedInvestment = await investmentsApi.updateCurrentValue(id, currentValue);
      setInvestments((prev) =>
        prev.map((investment) => (investment.id === id ? updatedInvestment : investment))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar valor');
      console.error('Error updating current value:', err);
      return false;
    }
  };

  return {
    investments,
    loading,
    error,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    updateCurrentValue,
    refetch: fetchInvestments,
  };
}

export function useInvestmentStats() {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await investmentsApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      console.error('Error fetching investment stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useInvestment(id: string) {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestment = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await investmentsApi.getById(id);
      setInvestment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar investimento');
      console.error('Error fetching investment:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvestment();
  }, [fetchInvestment]);

  return {
    investment,
    loading,
    error,
    refetch: fetchInvestment,
  };
}

export function useInvestmentHistory(id: string) {
  const [history, setHistory] = useState<InvestmentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await investmentsApi.getHistory(id);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      console.error('Error fetching investment history:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
}
