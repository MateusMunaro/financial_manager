# API Integration Guide

## Visão Geral

Este documento detalha como a integração com o backend é feita no frontend, incluindo schemas de validação, hooks de consumo, e padrões de uso.

## Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────┐
│                      COMPONENTE                              │
│  const { expenses, createExpense } = useExpenses()          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        HOOK                                  │
│  hooks/api/useExpenses.ts                                    │
│  - Gerencia estado (loading, error, data)                    │
│  - Expõe operações CRUD                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API CLIENT                              │
│  lib/api/expenses.api.ts                                     │
│  - Faz requisições HTTP                                      │
│  - Valida respostas com Zod                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     HTTP CLIENT                              │
│  lib/api/client.ts                                           │
│  - Converte snake_case ↔ camelCase                          │
│  - Adiciona token de autenticação                            │
│  - Trata erros globais                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         BACKEND
```

## Schemas Zod

### Localização

```
lib/schemas/
├── auth.schema.ts           # Autenticação e usuário
├── expense.schema.ts        # Despesas (re-exporta payment e recurring)
├── payment-method.schema.ts # Métodos de pagamento
├── recurring-expense.schema.ts # Despesas recorrentes
├── investment.schema.ts     # Investimentos
└── dashboard.schema.ts      # Dashboard
```

### Estrutura de um Schema

```typescript
import { z } from 'zod';

// 1. Definir enums se necessário
export const paymentMethodTypeSchema = z.enum([
  'credit-card',
  'debit-card',
  'pix',
  'bank-slip',
  'cash',
  'other',
]);

// 2. Schema principal (resposta da API)
export const expenseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  value: z.number().positive(),
  category: z.string(),
  date: z.string(),
  description: z.string().nullable().optional(),
  paymentMethod: paymentMethodTypeSchema.nullable().optional(),
  isRecurring: z.boolean().optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// 3. Schema de criação (sem campos automáticos)
export const createExpenseSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.number().positive(),
  category: z.string(),
  date: z.string(),
  description: z.string().nullable().optional(),
  paymentMethod: paymentMethodTypeSchema.nullable().optional(),
  isRecurring: z.boolean().optional(),
});

// 4. Schema de atualização (todos opcionais)
export const updateExpenseSchema = createExpenseSchema.partial();

// 5. Tipos TypeScript inferidos
export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
```

### Validação Segura

Usamos `safeParseWithFallback` para validar sem quebrar a aplicação:

```typescript
import { safeParseWithFallback } from './api-utils';

// Valida e retorna dados tipados
// Se falhar, retorna dados originais e loga warning
const expense = safeParseWithFallback(expenseSchema, response.data, {
  context: 'expensesApi.getById',
});
```

## API Clients

### Localização

```
lib/api/
├── client.ts           # Cliente HTTP configurado
├── api-utils.ts        # Utilitários de conversão e validação
├── auth.api.ts         # Endpoints de autenticação
├── expenses.api.ts     # Endpoints de despesas
├── payment-methods.api.ts
├── recurring-expenses.api.ts
├── investments.api.ts
└── dashboard.api.ts
```

### Exemplo de API Client

```typescript
// expenses.api.ts
import { apiClient } from './client';
import { safeParseWithFallback, safeParseArrayWithFallback } from './api-utils';
import { Expense, CreateExpenseInput, expenseSchema } from '../schemas/expense.schema';

const ENDPOINTS = {
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id: string) => `/expenses/${id}`,
};

export const expensesApi = {
  // Listar
  getAll: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSES, { params: filters });
    return safeParseArrayWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.getAll',
    });
  },

  // Buscar por ID
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(ENDPOINTS.EXPENSE_BY_ID(id));
    return safeParseWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.getById',
    });
  },

  // Criar
  create: async (data: CreateExpenseInput): Promise<Expense> => {
    const response = await apiClient.post(ENDPOINTS.EXPENSES, data);
    return safeParseWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.create',
    });
  },

  // Atualizar
  update: async (id: string, data: UpdateExpenseInput): Promise<Expense> => {
    const response = await apiClient.put(ENDPOINTS.EXPENSE_BY_ID(id), data);
    return safeParseWithFallback(expenseSchema, response.data, {
      context: 'expensesApi.update',
    });
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.EXPENSE_BY_ID(id));
  },
};
```

## Conversão de Case

O cliente HTTP converte automaticamente:

### Request (camelCase → snake_case)

```typescript
// Você escreve:
await apiClient.post('/expenses', {
  paymentMethod: 'credit-card',
  isRecurring: true,
});

// É enviado como:
// { "payment_method": "credit-card", "is_recurring": true }
```

### Response (snake_case → camelCase)

```typescript
// Backend retorna:
// { "payment_method": "credit-card", "is_recurring": true }

// Você recebe:
const expense = response.data;
console.log(expense.paymentMethod); // "credit-card"
console.log(expense.isRecurring);   // true
```

## Hooks de API

### Localização

```
hooks/api/
├── index.ts
├── useAuth.ts
├── useExpenses.ts
├── usePaymentMethods.ts
├── useRecurringExpenses.ts
├── useInvestments.ts
└── useDashboard.ts
```

### Estrutura de um Hook

```typescript
// useExpenses.ts
import { useState, useEffect, useCallback } from 'react';
import { expensesApi } from '@/lib/api/expenses.api';
import { Expense, CreateExpenseInput, UpdateExpenseInput } from '@/lib/schemas/expense.schema';

export function useExpenses(filters?: ExpenseFilters) {
  // Estado
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesApi.getAll(filters);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Operações CRUD
  const createExpense = async (data: CreateExpenseInput): Promise<Expense | null> => {
    try {
      setError(null);
      const newExpense = await expensesApi.create(data);
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar');
      return null;
    }
  };

  const updateExpense = async (id: string, data: UpdateExpenseInput): Promise<Expense | null> => {
    try {
      setError(null);
      const updated = await expensesApi.update(id, data);
      setExpenses(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
      return null;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await expensesApi.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar');
      return false;
    }
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}
```

### Uso em Componentes

```tsx
'use client';

import { useExpenses } from '@/hooks/api/useExpenses';

export default function ExpensesPage() {
  const { 
    expenses, 
    loading, 
    error, 
    createExpense, 
    deleteExpense,
    refetch 
  } = useExpenses();

  const handleCreate = async () => {
    const result = await createExpense({
      name: 'Nova despesa',
      value: 100,
      category: 'Outros',
      date: new Date().toISOString(),
    });
    
    if (result) {
      console.log('Despesa criada:', result);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <button onClick={handleCreate}>Nova Despesa</button>
      <button onClick={refetch}>Atualizar</button>
      
      {expenses.map(expense => (
        <div key={expense.id}>
          {expense.name} - R$ {expense.value}
          <button onClick={() => deleteExpense(expense.id)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}
```

## Hooks Disponíveis

### useAuth

```typescript
const { 
  user,
  loading,
  error,
  isAuthenticated,
  login,
  register,
  logout,
  updateProfile,
  changePassword,
} = useAuth();
```

### useExpenses

```typescript
const {
  expenses,
  loading,
  error,
  createExpense,
  updateExpense,
  deleteExpense,
  refetch,
} = useExpenses(filters?);
```

### usePaymentMethods

```typescript
const {
  paymentMethods,
  loading,
  error,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  refetch,
} = usePaymentMethods();
```

### useRecurringExpenses

```typescript
const {
  recurringExpenses,
  activeExpenses,
  inactiveExpenses,
  totalMonthly,
  totalYearly,
  loading,
  error,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  toggleActive,
  generateExpenses,
  refetch,
} = useRecurringExpenses(activeOnly?);
```

### useInvestments

```typescript
const {
  investments,
  loading,
  error,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  updateCurrentValue,
  refetch,
} = useInvestments(filters?);
```

### useDashboard

```typescript
const {
  data,
  loading,
  error,
  refetch,
} = useDashboard(period);
```

## Tratamento de Erros

### No Hook

```typescript
const createExpense = async (data: CreateExpenseInput) => {
  try {
    setError(null);
    const result = await expensesApi.create(data);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(message);
    console.error('Erro ao criar despesa:', err);
    return null;
  }
};
```

### No Componente

```tsx
const handleCreate = async () => {
  const result = await createExpense(data);
  
  if (result) {
    // Sucesso
    toast.success('Despesa criada!');
    closeModal();
  } else {
    // Erro já está em `error`
    toast.error(error || 'Erro ao criar despesa');
  }
};
```

## Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
```

## Boas Práticas

### 1. Sempre Use Hooks
Não chame APIs diretamente em componentes.

### 2. Valide Inputs
Use Zod para validar dados antes de enviar.

### 3. Trate Loading States
Sempre mostre feedback visual.

### 4. Trate Erros
Mostre mensagens amigáveis ao usuário.

### 5. Use TypeScript
Aproveite a inferência de tipos dos schemas.
