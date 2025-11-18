import { z } from 'zod';

// Schema para tipo de método de pagamento
export const paymentMethodTypeSchema = z.enum([
  'credit-card',
  'debit-card',
  'pix',
  'bank-slip',
  'cash',
  'other',
]);

// Schema para frequência de despesas recorrentes
export const recurringFrequencySchema = z.enum([
  'monthly',
  'yearly',
  'weekly',
]);

// Schema para período
export const periodSchema = z.enum([
  'day',
  'week',
  'month',
  'year',
]);

// Schema para Expense
export const expenseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  value: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  description: z.string().max(500).optional(),
  paymentMethod: paymentMethodTypeSchema.optional(),
  isRecurring: z.boolean().optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Schema para criação de despesa (sem id)
export const createExpenseSchema = expenseSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para atualização de despesa (campos opcionais)
export const updateExpenseSchema = createExpenseSchema.partial();

// Schema para método de pagamento
export const paymentMethodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(50),
  type: paymentMethodTypeSchema,
  lastDigits: z.string().length(4).optional(),
  isDefault: z.boolean().default(false),
  limit: z.number().positive().optional(),
  usedLimit: z.number().nonnegative().optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Schema para criação de método de pagamento
export const createPaymentMethodSchema = paymentMethodSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para atualização de método de pagamento
export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

// Schema para despesa recorrente
export const recurringExpenseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  value: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  frequency: recurringFrequencySchema,
  dayOfMonth: z.number().min(1).max(31).nullable().optional(),
  dayOfWeek: z.number().min(0).max(6).nullable().optional(),
  paymentMethod: paymentMethodTypeSchema.nullable().optional(),
  isActive: z.boolean().default(true),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Schema para criação de despesa recorrente
export const createRecurringExpenseSchema = recurringExpenseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para atualização de despesa recorrente
export const updateRecurringExpenseSchema = createRecurringExpenseSchema.partial();

// Schema para filtros de busca de despesas
export const expenseFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  paymentMethod: paymentMethodTypeSchema.optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  isRecurring: z.boolean().optional(),
  search: z.string().optional(),
});

// Schema para estatísticas de despesas
export const expenseStatsSchema = z.object({
  total: z.number(),
  count: z.number(),
  average: z.number(),
  byCategory: z.record(z.string(), z.number()),
  byPaymentMethod: z.record(z.string(), z.number()),
  period: periodSchema,
});

// Tipos TypeScript inferidos dos schemas
export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;

export type RecurringExpense = z.infer<typeof recurringExpenseSchema>;
export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>;
export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>;

export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;
export type ExpenseStats = z.infer<typeof expenseStatsSchema>;

export type PaymentMethodType = z.infer<typeof paymentMethodTypeSchema>;
export type RecurringFrequency = z.infer<typeof recurringFrequencySchema>;
export type Period = z.infer<typeof periodSchema>;
