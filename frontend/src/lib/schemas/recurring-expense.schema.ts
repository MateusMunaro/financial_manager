/**
 * Recurring Expense Schema
 * 
 * Schemas Zod para validação de despesas recorrentes.
 */

import { z } from 'zod';
import { paymentMethodTypeSchema } from './payment-method.schema';

// ============================================
// ENUMS
// ============================================

/**
 * Frequências disponíveis para despesas recorrentes
 */
export const recurringFrequencySchema = z.enum([
    'monthly',
    'yearly',
    'weekly',
]);

// ============================================
// SCHEMAS
// ============================================

/**
 * Schema completo para despesa recorrente
 */
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

/**
 * Schema para criação de despesa recorrente
 */
export const createRecurringExpenseSchema = z.object({
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
});

/**
 * Schema para atualização de despesa recorrente
 */
export const updateRecurringExpenseSchema = createRecurringExpenseSchema.partial();

/**
 * Schema para requisição de geração de despesas
 */
export const generateExpensesRequestSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

/**
 * Schema para resposta de geração de despesas
 */
export const generateExpensesResponseSchema = z.object({
    message: z.string(),
    success: z.boolean().optional(),
});

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export type RecurringFrequency = z.infer<typeof recurringFrequencySchema>;
export type RecurringExpense = z.infer<typeof recurringExpenseSchema>;
export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>;
export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>;
export type GenerateExpensesRequest = z.infer<typeof generateExpensesRequestSchema>;
export type GenerateExpensesResponse = z.infer<typeof generateExpensesResponseSchema>;

// ============================================
// CONSTANTES
// ============================================

/**
 * Labels legíveis para frequências
 */
export const RECURRING_FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
    monthly: 'Mensal',
    yearly: 'Anual',
    weekly: 'Semanal',
};

/**
 * Dias da semana (0 = Domingo)
 */
export const DAYS_OF_WEEK = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
];
