import { useState, useEffect, useCallback } from 'react';
import { recurringExpensesApi } from '@/lib/api/recurring-expenses.api';
import {
  RecurringExpense,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
} from '@/lib/schemas/expense.schema';

export function useRecurringExpenses(activeOnly?: boolean) {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recurringExpensesApi.getAll(activeOnly);
      setRecurringExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas recorrentes');
      console.error('Error fetching recurring expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchRecurringExpenses();
  }, [fetchRecurringExpenses]);

  const createRecurringExpense = async (
    data: CreateRecurringExpenseInput
  ): Promise<RecurringExpense | null> => {
    try {
      setError(null);
      const newExpense = await recurringExpensesApi.create(data);
      setRecurringExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar despesa recorrente');
      console.error('Error creating recurring expense:', err);
      return null;
    }
  };

  const updateRecurringExpense = async (
    id: string,
    data: UpdateRecurringExpenseInput
  ): Promise<RecurringExpense | null> => {
    try {
      setError(null);
      const updatedExpense = await recurringExpensesApi.update(id, data);
      setRecurringExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
      return updatedExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar despesa recorrente');
      console.error('Error updating recurring expense:', err);
      return null;
    }
  };

  const deleteRecurringExpense = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await recurringExpensesApi.delete(id);
      setRecurringExpenses((prev) => prev.filter((expense) => expense.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar despesa recorrente');
      console.error('Error deleting recurring expense:', err);
      return false;
    }
  };

  const toggleActive = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const updatedExpense = await recurringExpensesApi.toggleActive(id);
      setRecurringExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
      console.error('Error toggling active status:', err);
      return false;
    }
  };

  const generateExpenses = async (
    id: string,
    startDate?: string,
    endDate?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      await recurringExpensesApi.generateExpenses(id, startDate, endDate);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar despesas');
      console.error('Error generating expenses:', err);
      return false;
    }
  };

  return {
    recurringExpenses,
    loading,
    error,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    toggleActive,
    generateExpenses,
    refetch: fetchRecurringExpenses,
  };
}

export function useRecurringExpense(id: string) {
  const [recurringExpense, setRecurringExpense] = useState<RecurringExpense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringExpense = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await recurringExpensesApi.getById(id);
      setRecurringExpense(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesa recorrente');
      console.error('Error fetching recurring expense:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecurringExpense();
  }, [fetchRecurringExpense]);

  return {
    recurringExpense,
    loading,
    error,
    refetch: fetchRecurringExpense,
  };
}
