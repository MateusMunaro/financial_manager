/**
 * Recurring Expenses API
 * 
 * Funções para comunicação com os endpoints de despesas recorrentes.
 */

import { apiClient } from './client';
import { safeParseWithFallback, safeParseArrayWithFallback } from './api-utils';
import {
  RecurringExpense,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
  GenerateExpensesResponse,
  recurringExpenseSchema,
  generateExpensesResponseSchema,
} from '../schemas/recurring-expense.schema';

const ENDPOINTS = {
  RECURRING_EXPENSES: '/recurring-expenses',
  RECURRING_EXPENSE_BY_ID: (id: string) => `/recurring-expenses/${id}`,
  TOGGLE_ACTIVE: (id: string) => `/recurring-expenses/${id}/toggle-active`,
  GENERATE_EXPENSES: (id: string) => `/recurring-expenses/${id}/generate`,
};

export const recurringExpensesApi = {
  /**
   * Listar todas as despesas recorrentes
   */
  getAll: async (activeOnly?: boolean): Promise<RecurringExpense[]> => {
    const response = await apiClient.get(ENDPOINTS.RECURRING_EXPENSES, {
      params: activeOnly !== undefined ? { isActive: activeOnly } : undefined,
    });
    return safeParseArrayWithFallback(recurringExpenseSchema, response.data, {
      context: 'recurringExpensesApi.getAll',
    });
  },

  /**
   * Buscar despesa recorrente por ID
   */
  getById: async (id: string): Promise<RecurringExpense> => {
    const response = await apiClient.get(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id));
    return safeParseWithFallback(recurringExpenseSchema, response.data, {
      context: 'recurringExpensesApi.getById',
    });
  },

  /**
   * Criar nova despesa recorrente
   */
  create: async (data: CreateRecurringExpenseInput): Promise<RecurringExpense> => {
    const response = await apiClient.post(ENDPOINTS.RECURRING_EXPENSES, data);
    return safeParseWithFallback(recurringExpenseSchema, response.data, {
      context: 'recurringExpensesApi.create',
    });
  },

  /**
   * Atualizar despesa recorrente
   */
  update: async (id: string, data: UpdateRecurringExpenseInput): Promise<RecurringExpense> => {
    const response = await apiClient.put(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id), data);
    return safeParseWithFallback(recurringExpenseSchema, response.data, {
      context: 'recurringExpensesApi.update',
    });
  },

  /**
   * Deletar despesa recorrente
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id));
  },

  /**
   * Ativar/desativar despesa recorrente
   */
  toggleActive: async (id: string): Promise<RecurringExpense> => {
    const response = await apiClient.patch(ENDPOINTS.TOGGLE_ACTIVE(id));
    return safeParseWithFallback(recurringExpenseSchema, response.data, {
      context: 'recurringExpensesApi.toggleActive',
    });
  },

  /**
   * Gerar despesas a partir da recorrência
   */
  generateExpenses: async (
    id: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<GenerateExpensesResponse> => {
    const response = await apiClient.post(ENDPOINTS.GENERATE_EXPENSES(id), params || {});
    return safeParseWithFallback(generateExpensesResponseSchema, response.data, {
      context: 'recurringExpensesApi.generateExpenses',
    });
  },

  /**
   * Buscar despesas ativas
   */
  getActive: async (): Promise<RecurringExpense[]> => {
    return recurringExpensesApi.getAll(true);
  },
};
