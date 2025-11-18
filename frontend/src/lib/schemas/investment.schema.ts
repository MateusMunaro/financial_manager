import { z } from 'zod';

// Schema para tipo de investimento
export const investmentTypeSchema = z.enum([
  'Renda Fixa',
  'Ações',
  'FII',
  'ETF',
  'Criptomoedas',
  'Fundos',
  'Outros',
]);

// Schema para Investment
export const investmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  type: investmentTypeSchema,
  value: z.number().positive('Valor inicial deve ser positivo'),
  purchaseDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  currentValue: z.number().nonnegative('Valor atual não pode ser negativo'),
  quantity: z.number().positive().optional(),
  ticker: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Schema para criação de investimento
export const createInvestmentSchema = investmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para atualização de investimento
export const updateInvestmentSchema = createInvestmentSchema.partial();

// Schema para filtros de busca de investimentos
export const investmentFiltersSchema = z.object({
  type: investmentTypeSchema.optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  search: z.string().optional(),
});

// Schema para estatísticas de investimentos
export const investmentStatsSchema = z.object({
  totalInvested: z.number(),
  currentTotal: z.number(),
  totalProfit: z.number(),
  profitPercentage: z.number(),
  count: z.number(),
  byType: z.record(z.string(), z.object({
    invested: z.number(),
    current: z.number(),
    count: z.number(),
  })),
});

// Schema para histórico de valores
export const investmentHistorySchema = z.object({
  id: z.string().uuid(),
  investmentId: z.string().uuid(),
  value: z.number().positive(),
  date: z.string().datetime(),
});

// Tipos TypeScript inferidos dos schemas
export type Investment = z.infer<typeof investmentSchema>;
export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
export type UpdateInvestmentInput = z.infer<typeof updateInvestmentSchema>;
export type InvestmentFilters = z.infer<typeof investmentFiltersSchema>;
export type InvestmentStats = z.infer<typeof investmentStatsSchema>;
export type InvestmentHistory = z.infer<typeof investmentHistorySchema>;
export type InvestmentType = z.infer<typeof investmentTypeSchema>;
