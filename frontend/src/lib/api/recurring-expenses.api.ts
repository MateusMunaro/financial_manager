import { apiClient } from './client';
import {
  RecurringExpense,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
} from '../schemas/expense.schema';

const ENDPOINTS = {
  RECURRING_EXPENSES: '/recurring-expenses',
  RECURRING_EXPENSE_BY_ID: (id: string) => `/recurring-expenses/${id}`,
  TOGGLE_ACTIVE: (id: string) => `/recurring-expenses/${id}/toggle-active`,
  GENERATE_EXPENSES: (id: string) => `/recurring-expenses/${id}/generate`,
};

// Helper para converter camelCase para snake_case
const toSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    
    // Pular campos undefined
    if (value === undefined) return acc;
    
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Não converter valores que já estão em kebab-case (enums) ou valores primitivos
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      acc[snakeKey] = value;
    } else {
      acc[snakeKey] = toSnakeCase(value);
    }
    
    return acc;
  }, {} as any);
};

// Helper para converter snake_case para camelCase
const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    
    // Não converter valores primitivos que são enums ou strings simples
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      acc[camelKey] = value;
    } else {
      acc[camelKey] = toCamelCase(value);
    }
    
    return acc;
  }, {} as any);
};

export const recurringExpensesApi = {
  // Listar todas as despesas recorrentes
  getAll: async (activeOnly?: boolean): Promise<RecurringExpense[]> => {
    const response = await apiClient.get(ENDPOINTS.RECURRING_EXPENSES, {
      params: activeOnly !== undefined ? { is_active: activeOnly } : undefined,
    });
    const converted = toCamelCase(response.data);
    return converted as RecurringExpense[];
  },

  // Buscar despesa recorrente por ID
  getById: async (id: string): Promise<RecurringExpense> => {
    const response = await apiClient.get(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id));
    const converted = toCamelCase(response.data);
    return converted as RecurringExpense;
  },

  // Criar nova despesa recorrente
  create: async (data: CreateRecurringExpenseInput): Promise<RecurringExpense> => {
    try {
      const snakeData = toSnakeCase(data);
      console.log('📤 Enviando dados para o backend:', snakeData);
      
      const response = await apiClient.post(ENDPOINTS.RECURRING_EXPENSES, snakeData);
      console.log('📥 Resposta do backend:', response.data);
      
      const converted = toCamelCase(response.data);
      console.log('🔄 Dados convertidos:', converted);
      
      // Retornar direto sem validação Zod para evitar problemas de formato
      return converted as RecurringExpense;
    } catch (error: any) {
      console.error('❌ Erro ao criar despesa recorrente:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  // Atualizar despesa recorrente
  update: async (id: string, data: UpdateRecurringExpenseInput): Promise<RecurringExpense> => {
    const snakeData = toSnakeCase(data);
    const response = await apiClient.put(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id), snakeData);
    const converted = toCamelCase(response.data);
    return converted as RecurringExpense;
  },

  // Deletar despesa recorrente
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.RECURRING_EXPENSE_BY_ID(id));
  },

  // Ativar/desativar despesa recorrente
  toggleActive: async (id: string): Promise<RecurringExpense> => {
    const response = await apiClient.patch(ENDPOINTS.TOGGLE_ACTIVE(id));
    const converted = toCamelCase(response.data);
    return converted as RecurringExpense;
  },

  // Gerar despesas a partir da recorrência
  generateExpenses: async (
    id: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<{ message: string }> => {
    const snakeData = toSnakeCase(params || {});
    const response = await apiClient.post(ENDPOINTS.GENERATE_EXPENSES(id), snakeData);
    return response.data;
  },

  // Buscar despesas ativas
  getActive: async (): Promise<RecurringExpense[]> => {
    return recurringExpensesApi.getAll(true);
  },
};
