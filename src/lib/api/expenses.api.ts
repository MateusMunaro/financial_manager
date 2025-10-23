import { apiClient } from './client';
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
  // Listar todas as despesas
  getAll: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSES, {
      params: filters,
    });
    return response.data.map((item: unknown) => expenseSchema.parse(item));
  },

  // Buscar despesa por ID
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSE_BY_ID(id));
    return expenseSchema.parse(response.data);
  },

  // Criar nova despesa
  create: async (data: CreateExpenseInput): Promise<Expense> => {
    const response = await apiClient.post(ENDPOINTS.EXPENSES, data);
    return expenseSchema.parse(response.data);
  },

  // Atualizar despesa
  update: async (id: string, data: UpdateExpenseInput): Promise<Expense> => {
    const response = await apiClient.put(ENDPOINTS.EXPENSE_BY_ID(id), data);
    return expenseSchema.parse(response.data);
  },

  // Deletar despesa
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.EXPENSE_BY_ID(id));
  },

  // Obter estatísticas de despesas
  getStats: async (filters?: ExpenseFilters): Promise<ExpenseStats> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSE_STATS, {
      params: filters,
    });
    return expenseStatsSchema.parse(response.data);
  },

  // Buscar despesas por categoria
  getByCategory: async (category: string): Promise<Expense[]> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSES, {
      params: { category },
    });
    return response.data.map((item: unknown) => expenseSchema.parse(item));
  },

  // Buscar despesas por período
  getByPeriod: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSES, {
      params: { startDate, endDate },
    });
    return response.data.map((item: unknown) => expenseSchema.parse(item));
  },
};
