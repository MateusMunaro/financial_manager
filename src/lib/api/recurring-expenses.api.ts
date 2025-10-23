import { apiClient } from './client';
import {
  RecurringExpense,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
  recurringExpenseSchema,
} from '../schemas/expense.schema';

const ENDPOINTS = {
  RECURRING_EXPENSES: '/recurring-expenses',
  RECURRING_EXPENSE_BY_ID: (id: string) => `/recurring-expenses/${id}`,
  TOGGLE_ACTIVE: (id: string) => `/recurring-expenses/${id}/toggle-active`,
  GENERATE_EXPENSES: (id: string) => `/recurring-expenses/${id}/generate`,
};

export const recurringExpensesApi = {
  // Listar todas as despesas recorrentes
  getAll: async (activeOnly?: boolean): Promise<RecurringExpense[]> => {
    const response = await apiClient.get(ENDPOINTS.RECURRING_EXPENSES, {
      params: activeOnly !== undefined ? { isActive: activeOnly } : undefined,
    });
    return response.data.map((item: unknown) => recurringExpenseSchema.parse(item));
  },

  // Buscar despesa recorrente por ID
  getById: async (id: string): Promise<RecurringExpense> => {
    const response = await apiClient.get(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id));
    return recurringExpenseSchema.parse(response.data);
  },

  // Criar nova despesa recorrente
  create: async (data: CreateRecurringExpenseInput): Promise<RecurringExpense> => {
    const response = await apiClient.post(ENDPOINTS.RECURRING_EXPENSES, data);
    return recurringExpenseSchema.parse(response.data);
  },

  // Atualizar despesa recorrente
  update: async (id: string, data: UpdateRecurringExpenseInput): Promise<RecurringExpense> => {
    const response = await apiClient.put(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id), data);
    return recurringExpenseSchema.parse(response.data);
  },

  // Deletar despesa recorrente
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id));
  },

  // Ativar/desativar despesa recorrente
  toggleActive: async (id: string): Promise<RecurringExpense> => {
    const response = await apiClient.patch(ENDPOINTS.TOGGLE_ACTIVE(id));
    return recurringExpenseSchema.parse(response.data);
  },

  // Gerar despesas a partir da recorrência
  generateExpenses: async (id: string, startDate?: string, endDate?: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.GENERATE_EXPENSES(id), {
      startDate,
      endDate,
    });
  },

  // Buscar despesas ativas
  getActive: async (): Promise<RecurringExpense[]> => {
    return recurringExpensesApi.getAll(true);
  },
};
