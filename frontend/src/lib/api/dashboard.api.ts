import { apiClient } from './client';
import {
  DashboardData,
  FinancialSummary,
  dashboardDataSchema,
  financialSummarySchema,
} from '../schemas/dashboard.schema';
import { Period } from '../schemas/expense.schema';

const ENDPOINTS = {
  DASHBOARD: '/dashboard',
  SUMMARY: '/dashboard/summary',
  RECENT_TRANSACTIONS: '/dashboard/recent-transactions',
  CATEGORY_SPENDING: '/dashboard/category-spending',
  MONTHLY_TREND: '/dashboard/monthly-trend',
};

export const dashboardApi = {
  // Buscar todos os dados do dashboard
  getAll: async (period?: Period): Promise<DashboardData> => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD, {
      params: period ? { period } : undefined,
    });
    return dashboardDataSchema.parse(response.data);
  },

  // Buscar resumo financeiro
  getSummary: async (period?: Period): Promise<FinancialSummary> => {
    const response = await apiClient.get(ENDPOINTS.SUMMARY, {
      params: period ? { period } : undefined,
    });
    return financialSummarySchema.parse(response.data);
  },

  // Buscar transações recentes
  getRecentTransactions: async (limit: number = 10) => {
    const response = await apiClient.get(ENDPOINTS.RECENT_TRANSACTIONS, {
      params: { limit },
    });
    return response.data;
  },

  // Buscar gastos por categoria
  getCategorySpending: async (period?: Period) => {
    const response = await apiClient.get(ENDPOINTS.CATEGORY_SPENDING, {
      params: period ? { period } : undefined,
    });
    return response.data;
  },

  // Buscar tendência mensal
  getMonthlyTrend: async (months: number = 6) => {
    const response = await apiClient.get(ENDPOINTS.MONTHLY_TREND, {
      params: { months },
    });
    return response.data;
  },
};
