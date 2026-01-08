/**
 * Expenses API
 * 
 * Funções para comunicação com os endpoints de despesas.
 */

import { apiClient } from './client';
import { safeParseWithFallback, safeParseArrayWithFallback } from './api-utils';
import {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilters,
  ExpenseStats,
  expenseSchema,
  expenseStatsSchema,
} from '../schemas/expense.schema';

const ENDPOINTS = {
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id: string) => `/expenses/${id}`,
  EXPENSE_STATS: '/expenses/stats',
};

export const expensesApi = {
  /**
   * Listar todas as despesas
   */
  getAll: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSES, {
      params: filters,
    });
    return safeParseArrayWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.getAll',
    });
  },

  /**
   * Buscar despesa por ID
   */
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSE_BY_ID(id));
    return safeParseWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.getById',
    });
  },

  /**
   * Criar nova despesa
   */
  create: async (data: CreateExpenseInput): Promise<Expense> => {
    const response = await apiClient.post(ENDPOINTS.EXPENSES, data);
    return safeParseWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.create',
    });
  },

  /**
   * Atualizar despesa
   */
  update: async (id: string, data: UpdateExpenseInput): Promise<Expense> => {
    const response = await apiClient.put(ENDPOINTS.EXPENSE_BY_ID(id), data);
    return safeParseWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.update',
    });
  },

  /**
   * Deletar despesa
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.EXPENSE_BY_ID(id));
  },

  /**
   * Obter estatísticas de despesas
   */
  getStats: async (filters?: ExpenseFilters): Promise<ExpenseStats> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSE_STATS, {
      params: filters,
    });
    return safeParseWithFallback(expenseStatsSchema, response.data, {
      context: 'expensesApi.getStats',
    });
  },

  /**
   * Buscar despesas por categoria
   */
  getByCategory: async (category: string): Promise<Expense[]> => {
    return expensesApi.getAll({ category });
  },

  /**
   * Buscar despesas por período
   */
  getByPeriod: async (startDate: string, endDate: string): Promise<Expense[]> => {
    return expensesApi.getAll({ startDate, endDate });
  },
};
