import { useState, useEffect, useCallback } from 'react';
import { paymentMethodsApi } from '@/lib/api/payment-methods.api';
import {
  PaymentMethod,
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from '@/lib/schemas/expense.schema';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentMethodsApi.getAll();
      setPaymentMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar métodos de pagamento');
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const createPaymentMethod = async (
    data: CreatePaymentMethodInput
  ): Promise<PaymentMethod | null> => {
    try {
      setError(null);
      const newMethod = await paymentMethodsApi.create(data);
      setPaymentMethods((prev) => [newMethod, ...prev]);
      return newMethod;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar método de pagamento');
      console.error('Error creating payment method:', err);
      return null;
    }
  };

  const updatePaymentMethod = async (
    id: string,
    data: UpdatePaymentMethodInput
  ): Promise<PaymentMethod | null> => {
    try {
      setError(null);
      const updatedMethod = await paymentMethodsApi.update(id, data);
      setPaymentMethods((prev) =>
        prev.map((method) => (method.id === id ? updatedMethod : method))
      );
      return updatedMethod;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar método de pagamento');
      console.error('Error updating payment method:', err);
      return null;
    }
  };

  const deletePaymentMethod = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await paymentMethodsApi.delete(id);
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar método de pagamento');
      console.error('Error deleting payment method:', err);
      return false;
    }
  };

  const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const updatedMethod = await paymentMethodsApi.setDefault(id);
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao definir método padrão');
      console.error('Error setting default payment method:', err);
      return false;
    }
  };

  return {
    paymentMethods,
    loading,
    error,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    refetch: fetchPaymentMethods,
  };
}

export function usePaymentMethod(id: string) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethod = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await paymentMethodsApi.getById(id);
      setPaymentMethod(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar método de pagamento');
      console.error('Error fetching payment method:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPaymentMethod();
  }, [fetchPaymentMethod]);

  return {
    paymentMethod,
    loading,
    error,
    refetch: fetchPaymentMethod,
  };
}
