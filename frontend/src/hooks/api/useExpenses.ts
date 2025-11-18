import { useState, useEffect, useCallback } from 'react';
import { expensesApi } from '@/lib/api/expenses.api';
import {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilters,
  ExpenseStats,
} from '@/lib/schemas/expense.schema';

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesApi.getAll(filters);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (data: CreateExpenseInput): Promise<Expense | null> => {
    try {
      setError(null);
      const newExpense = await expensesApi.create(data);
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar despesa');
      console.error('Error creating expense:', err);
      return null;
    }
  };

  const updateExpense = async (id: string, data: UpdateExpenseInput): Promise<Expense | null> => {
    try {
      setError(null);
      const updatedExpense = await expensesApi.update(id, data);
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
      return updatedExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar despesa');
      console.error('Error updating expense:', err);
      return null;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await expensesApi.delete(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar despesa');
      console.error('Error deleting expense:', err);
      return false;
    }
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}

export function useExpenseStats(filters?: ExpenseFilters) {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesApi.getStats(filters);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      console.error('Error fetching expense stats:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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

export function useExpense(id: string) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpense = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await expensesApi.getById(id);
      setExpense(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesa');
      console.error('Error fetching expense:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  return {
    expense,
    loading,
    error,
    refetch: fetchExpense,
  };
}
