/**
 * Dashboard API
 * 
 * Funções para comunicação com os endpoints do dashboard.
 */

import { apiClient } from './client';
import { safeParseWithFallback, safeParseArrayWithFallback } from './api-utils';
import { z } from 'zod';
import {
  DashboardData,
  FinancialSummary,
  RecentTransaction,
  CategorySpending,
  MonthlyTrend,
  dashboardDataSchema,
  financialSummarySchema,
  recentTransactionSchema,
  categorySpendingSchema,
  monthlyTrendSchema,
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
  /**
   * Buscar todos os dados do dashboard
   */
  getAll: async (period?: Period): Promise<DashboardData> => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD, {
      params: period ? { period } : undefined,
    });
    return safeParseWithFallback(dashboardDataSchema, response.data, {
      context: 'dashboardApi.getAll',
    });
  },

  /**
   * Buscar resumo financeiro
   */
  getSummary: async (period?: Period): Promise<FinancialSummary> => {
    const response = await apiClient.get(ENDPOINTS.SUMMARY, {
      params: period ? { period } : undefined,
    });
    return safeParseWithFallback(financialSummarySchema, response.data, {
      context: 'dashboardApi.getSummary',
    });
  },

  /**
   * Buscar transações recentes
   */
  getRecentTransactions: async (limit: number = 10): Promise<RecentTransaction[]> => {
    const response = await apiClient.get(ENDPOINTS.RECENT_TRANSACTIONS, {
      params: { limit },
    });
    return safeParseArrayWithFallback(recentTransactionSchema, response.data, {
      context: 'dashboardApi.getRecentTransactions',
    });
  },

  /**
   * Buscar gastos por categoria
   */
  getCategorySpending: async (period?: Period): Promise<CategorySpending[]> => {
    const response = await apiClient.get(ENDPOINTS.CATEGORY_SPENDING, {
      params: period ? { period } : undefined,
    });
    return safeParseArrayWithFallback(categorySpendingSchema, response.data, {
      context: 'dashboardApi.getCategorySpending',
    });
  },

  /**
   * Buscar tendência mensal
   */
  getMonthlyTrend: async (months: number = 6): Promise<MonthlyTrend[]> => {
    const response = await apiClient.get(ENDPOINTS.MONTHLY_TREND, {
      params: { months },
    });
    return safeParseArrayWithFallback(monthlyTrendSchema, response.data, {
      context: 'dashboardApi.getMonthlyTrend',
    });
  },
};
