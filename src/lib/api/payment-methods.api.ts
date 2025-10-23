import { apiClient } from './client';
import {
  PaymentMethod,
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
  paymentMethodSchema,
} from '../schemas/expense.schema';

const ENDPOINTS = {
  PAYMENT_METHODS: '/payment-methods',
  PAYMENT_METHOD_BY_ID: (id: string) => `/payment-methods/${id}`,
  SET_DEFAULT: (id: string) => `/payment-methods/${id}/set-default`,
};

export const paymentMethodsApi = {
  // Listar todos os métodos de pagamento
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT_METHODS);
    return response.data.map((item: unknown) => paymentMethodSchema.parse(item));
  },

  // Buscar método de pagamento por ID
  getById: async (id: string): Promise<PaymentMethod> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT_METHOD_BY_ID(id));
    return paymentMethodSchema.parse(response.data);
  },

  // Criar novo método de pagamento
  create: async (data: CreatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await apiClient.post(ENDPOINTS.PAYMENT_METHODS, data);
    return paymentMethodSchema.parse(response.data);
  },

  // Atualizar método de pagamento
  update: async (id: string, data: UpdatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await apiClient.put(ENDPOINTS.PAYMENT_METHOD_BY_ID(id), data);
    return paymentMethodSchema.parse(response.data);
  },

  // Deletar método de pagamento
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PAYMENT_METHOD_BY_ID(id));
  },

  // Definir como método padrão
  setDefault: async (id: string): Promise<PaymentMethod> => {
    const response = await apiClient.patch(ENDPOINTS.SET_DEFAULT(id));
    return paymentMethodSchema.parse(response.data);
  },

  // Buscar método padrão
  getDefault: async (): Promise<PaymentMethod | null> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT_METHODS, {
      params: { isDefault: true },
    });
    const methods = response.data.map((item: unknown) => paymentMethodSchema.parse(item));
    return methods.length > 0 ? methods[0] : null;
  },
};
