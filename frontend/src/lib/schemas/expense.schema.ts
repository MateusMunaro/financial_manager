/**
 * Expense Schema
 * 
 * Schemas Zod para validação de despesas.
 * Este arquivo também re-exporta tipos relacionados para manter retrocompatibilidade.
 */

import { z } from 'zod';

// Re-exportar de outros módulos para retrocompatibilidade
export {
  paymentMethodTypeSchema,
  paymentMethodSchema,
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  type PaymentMethodType,
  type PaymentMethod,
  type CreatePaymentMethodInput,
  type UpdatePaymentMethodInput,
  PAYMENT_METHOD_TYPE_LABELS,
} from './payment-method.schema';

export {
  recurringFrequencySchema,
  recurringExpenseSchema,
  createRecurringExpenseSchema,
  updateRecurringExpenseSchema,
  type RecurringFrequency,
  type RecurringExpense,
  type CreateRecurringExpenseInput,
  type UpdateRecurringExpenseInput,
  RECURRING_FREQUENCY_LABELS,
} from './recurring-expense.schema';

// ============================================
// ENUMS
// ============================================

/**
 * Períodos para análise
 */
export const periodSchema = z.enum([
  'day',
  'week',
  'month',
  'year',
]);

// ============================================
// SCHEMAS
// ============================================

/**
 * Schema completo para despesa
 */
export const expenseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  value: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string(),
  description: z.string().max(500).nullable().optional(),
  paymentMethod: z.enum(['credit-card', 'debit-card', 'pix', 'bank-slip', 'cash', 'other']).nullable().optional(),
  isRecurring: z.boolean().optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Schema para criação de despesa
 */
export const createExpenseSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  value: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string(),
  description: z.string().max(500).nullable().optional(),
  paymentMethod: z.enum(['credit-card', 'debit-card', 'pix', 'bank-slip', 'cash', 'other']).nullable().optional(),
  isRecurring: z.boolean().optional(),
});

/**
 * Schema para atualização de despesa
 */
export const updateExpenseSchema = createExpenseSchema.partial();

/**
 * Schema para filtros de busca de despesas
 */
export const expenseFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  paymentMethod: z.enum(['credit-card', 'debit-card', 'pix', 'bank-slip', 'cash', 'other']).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  isRecurring: z.boolean().optional(),
  search: z.string().optional(),
});

/**
 * Schema para estatísticas de despesas
 */
export const expenseStatsSchema = z.object({
  total: z.number(),
  count: z.number(),
  average: z.number(),
  byCategory: z.record(z.string(), z.number()),
  byPaymentMethod: z.record(z.string(), z.number()),
  period: periodSchema,
});

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export type Period = z.infer<typeof periodSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;
export type ExpenseStats = z.infer<typeof expenseStatsSchema>;

// ============================================
// CONSTANTES
// ============================================

/**
 * Labels legíveis para períodos
 */
export const PERIOD_LABELS: Record<Period, string> = {
  day: 'Dia',
  week: 'Semana',
  month: 'Mês',
  year: 'Ano',
};

/**
 * Categorias de despesa padrão
 */
export const DEFAULT_EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Serviços',
  'Assinaturas',
  'Outros',
];
