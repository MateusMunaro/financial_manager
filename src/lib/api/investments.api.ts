import { apiClient } from './client';
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
  // Listar todos os investimentos
  getAll: async (filters?: InvestmentFilters): Promise<Investment[]> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENTS, {
      params: filters,
    });
    return response.data.map((item: unknown) => investmentSchema.parse(item));
  },

  // Buscar investimento por ID
  getById: async (id: string): Promise<Investment> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENT_BY_ID(id));
    return investmentSchema.parse(response.data);
  },

  // Criar novo investimento
  create: async (data: CreateInvestmentInput): Promise<Investment> => {
    const response = await apiClient.post(ENDPOINTS.INVESTMENTS, data);
    return investmentSchema.parse(response.data);
  },

  // Atualizar investimento
  update: async (id: string, data: UpdateInvestmentInput): Promise<Investment> => {
    const response = await apiClient.put(ENDPOINTS.INVESTMENT_BY_ID(id), data);
    return investmentSchema.parse(response.data);
  },

  // Deletar investimento
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.INVESTMENT_BY_ID(id));
  },

  // Obter estatísticas de investimentos
  getStats: async (): Promise<InvestmentStats> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENT_STATS);
    return investmentStatsSchema.parse(response.data);
  },

  // Buscar histórico de valores
  getHistory: async (id: string): Promise<InvestmentHistory[]> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENT_HISTORY(id));
    return response.data.map((item: unknown) => investmentHistorySchema.parse(item));
  },

  // Atualizar valor atual do investimento
  updateCurrentValue: async (id: string, currentValue: number): Promise<Investment> => {
    const response = await apiClient.patch(ENDPOINTS.UPDATE_VALUE(id), {
      currentValue,
    });
    return investmentSchema.parse(response.data);
  },

  // Buscar investimentos por tipo
  getByType: async (type: string): Promise<Investment[]> => {
    const response = await apiClient.get(ENDPOINTS.INVESTMENTS, {
      params: { type },
    });
    return response.data.map((item: unknown) => investmentSchema.parse(item));
  },
};
