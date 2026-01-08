/**
 * Investments API
 * 
 * Funções para comunicação com os endpoints de investimentos.
 */

import { apiClient } from './client';
import { safeParseWithFallback, safeParseArrayWithFallback } from './api-utils';
import {
  Investment,
  CreateInvestmentInput,
  UpdateInvestmentInput,
  InvestmentFilters,
  InvestmentStats,
  InvestmentHistory,
  investmentSchema,
  investmentStatsSchema,
  investmentHistorySchema,
} from '../schemas/investment.schema';

const ENDPOINTS = {
  INVESTMENTS: '/investments',
  INVESTMENT_BY_ID: (id: string) => `/investments/${id}`,
  INVESTMENT_STATS: '/investments/stats',
  INVESTMENT_HISTORY: (id: string) => `/investments/${id}/history`,
  UPDATE_VALUE: (id: string) => `/investments/${id}/update-value`,
};

export const investmentsApi = {
  /**
   * Listar todos os investimentos
   */
  getAll: async (filters?: InvestmentFilters): Promise<Investment[]> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENTS, {
      params: filters,
    });
    return safeParseArrayWithFallback(investmentSchema, response.data, {
      context: 'investmentsApi.getAll',
    });
  },

  /**
   * Buscar investimento por ID
   */
  getById: async (id: string): Promise<Investment> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENT_BY_ID(id));
    return safeParseWithFallback(investmentSchema, response.data, {
      context: 'investmentsApi.getById',
    });
  },

  /**
   * Criar novo investimento
   */
  create: async (data: CreateInvestmentInput): Promise<Investment> => {
    const response = await apiClient.post(ENDPOINTS.INVESTMENTS, data);
    return safeParseWithFallback(investmentSchema, response.data, {
      context: 'investmentsApi.create',
    });
  },

  /**
   * Atualizar investimento
   */
  update: async (id: string, data: UpdateInvestmentInput): Promise<Investment> => {
    const response = await apiClient.put(ENDPOINTS.INVESTMENT_BY_ID(id), data);
    return safeParseWithFallback(investmentSchema, response.data, {
      context: 'investmentsApi.update',
    });
  },

  /**
   * Deletar investimento
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.INVESTMENT_BY_ID(id));
  },

  /**
   * Obter estatísticas de investimentos
   */
  getStats: async (): Promise<InvestmentStats> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENT_STATS);
    return safeParseWithFallback(investmentStatsSchema, response.data, {
      context: 'investmentsApi.getStats',
    });
  },

  /**
   * Buscar histórico de valores
   */
  getHistory: async (id: string): Promise<InvestmentHistory[]> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENT_HISTORY(id));
    return safeParseArrayWithFallback(investmentHistorySchema, response.data, {
      context: 'investmentsApi.getHistory',
    });
  },

  /**
   * Atualizar valor atual do investimento
   */
  updateCurrentValue: async (id: string, currentValue: number): Promise<Investment> => {
    const response = await apiClient.patch(ENDPOINTS.UPDATE_VALUE(id), {
      currentValue,
    });
    return safeParseWithFallback(investmentSchema, response.data, {
      context: 'investmentsApi.updateCurrentValue',
    });
  },

  /**
   * Buscar investimentos por tipo
   */
  getByType: async (type: string): Promise<Investment[]> => {
    return investmentsApi.getAll({ type: type as Investment['type'] });
  },
};
