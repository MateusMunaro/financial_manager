import { z } from 'zod';
import { periodSchema } from './expense.schema';

// Schema para resumo financeiro
export const financialSummarySchema = z.object({
  totalBalance: z.number(),
  totalIncome: z.number(),
  totalExpenses: z.number(),
  totalInvestments: z.number(),
  period: periodSchema,
  changePercentage: z.object({
    balance: z.number(),
    income: z.number(),
    expenses: z.number(),
    investments: z.number(),
  }),
});

// Schema para transação recente
export const recentTransactionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  value: z.number(),
  date: z.string(),
  category: z.string(),
  type: z.enum(['income', 'expense']),
});

// Schema para categoria de gastos
export const categorySpendingSchema = z.object({
  category: z.string(),
  value: z.number(),
  percentage: z.number(),
  limit: z.number().optional(),
  color: z.string(),
});

// Schema para tendência mensal
export const monthlyTrendSchema = z.object({
  month: z.string(),
  income: z.number(),
  expenses: z.number(),
});

// Schema para dados do dashboard
export const dashboardDataSchema = z.object({
  summary: financialSummarySchema,
  recentTransactions: z.array(recentTransactionSchema),
  categorySpending: z.array(categorySpendingSchema),
  monthlyTrend: z.array(monthlyTrendSchema),
});

// Tipos TypeScript inferidos dos schemas
export type FinancialSummary = z.infer<typeof financialSummarySchema>;
export type RecentTransaction = z.infer<typeof recentTransactionSchema>;
export type CategorySpending = z.infer<typeof categorySpendingSchema>;
export type MonthlyTrend = z.infer<typeof monthlyTrendSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
