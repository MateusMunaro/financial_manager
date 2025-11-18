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
      console.log('🔄 Criando despesa recorrente:', data);
      const newExpense = await recurringExpensesApi.create(data);
      console.log('✅ Despesa criada com sucesso:', newExpense);
      setRecurringExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail 
        || err.message 
        || 'Erro ao criar despesa recorrente';
      console.error('❌ Erro no hook:', errorMessage, err);
      setError(errorMessage);
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
    params?: { startDate?: string; endDate?: string }
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);
      const result = await recurringExpensesApi.generateExpenses(id, params);
      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar despesas';
      setError(errorMessage);
      console.error('Error generating expenses:', err);
      return { success: false, message: errorMessage };
    }
  };

  // Computed values
  const activeExpenses = recurringExpenses.filter((exp) => exp.isActive);
  const inactiveExpenses = recurringExpenses.filter((exp) => !exp.isActive);

  const totalMonthly = activeExpenses.reduce((sum, exp) => {
    if (exp.frequency === 'monthly') return sum + exp.value;
    if (exp.frequency === 'yearly') return sum + exp.value / 12;
    if (exp.frequency === 'weekly') return sum + (exp.value * 52) / 12;
    return sum;
  }, 0);

  const totalYearly = activeExpenses.reduce((sum, exp) => {
    if (exp.frequency === 'monthly') return sum + exp.value * 12;
    if (exp.frequency === 'yearly') return sum + exp.value;
    if (exp.frequency === 'weekly') return sum + exp.value * 52;
    return sum;
  }, 0);

  return {
    recurringExpenses,
    activeExpenses,
    inactiveExpenses,
    totalMonthly,
    totalYearly,
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
