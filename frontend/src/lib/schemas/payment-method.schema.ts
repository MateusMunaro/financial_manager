/**
 * Payment Method Schema
 * 
 * Schemas Zod para validação de métodos de pagamento.
 */

import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

/**
 * Tipos de método de pagamento disponíveis
 */
export const paymentMethodTypeSchema = z.enum([
    'credit-card',
    'debit-card',
    'pix',
    'bank-slip',
    'cash',
    'other',
]);

// ============================================
// SCHEMAS
// ============================================

/**
 * Schema completo para método de pagamento
 */
export const paymentMethodSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Nome é obrigatório').max(50),
    type: paymentMethodTypeSchema,
    lastDigits: z.string().length(4).nullable().optional(),
    isDefault: z.boolean().default(false),
    limit: z.number().positive().nullable().optional(),
    usedLimit: z.number().nonnegative().nullable().optional(),
    userId: z.string().uuid().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

/**
 * Schema para criação de método de pagamento
 */
export const createPaymentMethodSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').max(50),
    type: paymentMethodTypeSchema,
    lastDigits: z.string().length(4).nullable().optional(),
    isDefault: z.boolean().default(false),
    limit: z.number().positive().nullable().optional(),
    usedLimit: z.number().nonnegative().nullable().optional(),
});

/**
 * Schema para atualização de método de pagamento
 */
export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export type PaymentMethodType = z.infer<typeof paymentMethodTypeSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;

// ============================================
// CONSTANTES
// ============================================

/**
 * Labels legíveis para tipos de método de pagamento
 */
export const PAYMENT_METHOD_TYPE_LABELS: Record<PaymentMethodType, string> = {
    'credit-card': 'Cartão de Crédito',
    'debit-card': 'Cartão de Débito',
    'pix': 'PIX',
    'bank-slip': 'Boleto',
    'cash': 'Dinheiro',
    'other': 'Outro',
};

/**
 * Ícones sugeridos para tipos de método de pagamento
 */
export const PAYMENT_METHOD_TYPE_ICONS: Record<PaymentMethodType, string> = {
    'credit-card': '💳',
    'debit-card': '💳',
    'pix': '📱',
    'bank-slip': '📄',
    'cash': '💵',
    'other': '💰',
};
