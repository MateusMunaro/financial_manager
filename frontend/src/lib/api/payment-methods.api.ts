/**
 * Payment Methods API
 * 
 * Funções para comunicação com os endpoints de métodos de pagamento.
 */

import { apiClient } from './client';
import { safeParseWithFallback, safeParseArrayWithFallback } from './api-utils';
import {
  PaymentMethod,
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
  paymentMethodSchema,
} from '../schemas/payment-method.schema';

const ENDPOINTS = {
  PAYMENT_METHODS: '/payment-methods',
  PAYMENT_METHOD_BY_ID: (id: string) => `/payment-methods/${id}`,
  SET_DEFAULT: (id: string) => `/payment-methods/${id}/set-default`,
};

export const paymentMethodsApi = {
  /**
   * Listar todos os métodos de pagamento
   */
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT_METHODS);
    return safeParseArrayWithFallback(paymentMethodSchema, response.data, {
      context: 'paymentMethodsApi.getAll',
    });
  },

  /**
   * Buscar método de pagamento por ID
   */
  getById: async (id: string): Promise<PaymentMethod> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT_METHOD_BY_ID(id));
    return safeParseWithFallback(paymentMethodSchema, response.data, {
      context: 'paymentMethodsApi.getById',
    });
  },

  /**
   * Criar novo método de pagamento
   */
  create: async (data: CreatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await apiClient.post(ENDPOINTS.PAYMENT_METHODS, data);
    return safeParseWithFallback(paymentMethodSchema, response.data, {
      context: 'paymentMethodsApi.create',
    });
  },

  /**
   * Atualizar método de pagamento
   */
  update: async (id: string, data: UpdatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await apiClient.put(ENDPOINTS.PAYMENT_METHOD_BY_ID(id), data);
    return safeParseWithFallback(paymentMethodSchema, response.data, {
      context: 'paymentMethodsApi.update',
    });
  },

  /**
   * Deletar método de pagamento
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PAYMENT_METHOD_BY_ID(id));
  },

  /**
   * Definir como método padrão
   */
  setDefault: async (id: string): Promise<PaymentMethod> => {
    const response = await apiClient.patch(ENDPOINTS.SET_DEFAULT(id));
    return safeParseWithFallback(paymentMethodSchema, response.data, {
      context: 'paymentMethodsApi.setDefault',
    });
  },

  /**
   * Buscar método padrão
   */
  getDefault: async (): Promise<PaymentMethod | null> => {
    const methods = await paymentMethodsApi.getAll();
    return methods.find((m) => m.isDefault) || null;
  },
};
