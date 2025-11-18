# API e Hooks - Gerenciador Financeiro

Este diretório contém toda a infraestrutura de comunicação com o back-end da aplicação.

## 📁 Estrutura

```
src/
├── lib/
│   ├── api/           # Camada de comunicação com API
│   │   ├── client.ts  # Cliente HTTP configurado (Axios)
│   │   ├── auth.api.ts
│   │   ├── dashboard.api.ts
│   │   ├── expenses.api.ts
│   │   ├── investments.api.ts
│   │   ├── payment-methods.api.ts
│   │   ├── recurring-expenses.api.ts
│   │   └── index.ts
│   └── schemas/       # Validação com Zod
│       ├── auth.schema.ts
│       ├── dashboard.schema.ts
│       ├── expense.schema.ts
│       └── investment.schema.ts
└── hooks/
    └── api/           # React Hooks customizados
        ├── useAuth.ts
        ├── useDashboard.ts
        ├── useExpenses.ts
        ├── useInvestments.ts
        ├── usePaymentMethods.ts
        ├── useRecurringExpenses.ts
        └── index.ts
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📖 Uso dos Hooks

### Autenticação

```typescript
import { useAuth } from '@/hooks/api';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const success = await login({ email, password });
    if (success) {
      // Redirecionar para dashboard
    }
  };
}
```

### Despesas

```typescript
import { useExpenses, useExpenseStats } from '@/hooks/api';

function ExpensesPage() {
  const { 
    expenses, 
    loading, 
    createExpense, 
    updateExpense, 
    deleteExpense 
  } = useExpenses();

  const { stats } = useExpenseStats();
}
```

### Investimentos

```typescript
import { useInvestments, useInvestmentStats } from '@/hooks/api';

function InvestmentsPage() {
  const { 
    investments, 
    loading, 
    createInvestment 
  } = useInvestments();

  const { stats } = useInvestmentStats();
}
```

### Métodos de Pagamento

```typescript
import { usePaymentMethods } from '@/hooks/api';

function PaymentMethodsPage() {
  const { 
    paymentMethods, 
    createPaymentMethod,
    setDefaultPaymentMethod 
  } = usePaymentMethods();
}
```

### Despesas Recorrentes

```typescript
import { useRecurringExpenses } from '@/hooks/api';

function RecurringExpensesPage() {
  const { 
    recurringExpenses, 
    createRecurringExpense,
    toggleActive 
  } = useRecurringExpenses();
}
```

### Dashboard

```typescript
import { useDashboard, useFinancialSummary } from '@/hooks/api';

function DashboardPage() {
  const { data, loading } = useDashboard('month');
  const { summary } = useFinancialSummary('month');
}
```

## 🛡️ Validação com Zod

Todos os dados são validados usando Zod schemas antes de serem enviados ou recebidos:

```typescript
import { createExpenseSchema } from '@/lib/schemas/expense.schema';

// Validar dados antes de enviar
const validatedData = createExpenseSchema.parse(formData);
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens):

- Token armazenado no `localStorage`
- Interceptor automático adiciona token nas requisições
- Refresh token automático quando expira
- Redirecionamento para login em caso de erro 401

## 📡 Cliente HTTP

O cliente HTTP (`apiClient`) está configurado com:

- Base URL configurável via env
- Timeout de 10 segundos
- Interceptores para autenticação
- Tratamento automático de erros
- Headers padronizados

## 🔄 Estados dos Hooks

Todos os hooks retornam:

- `loading`: Estado de carregamento
- `error`: Mensagem de erro (se houver)
- `refetch`: Função para recarregar dados
- Funções CRUD específicas de cada recurso

## 📝 Tipos TypeScript

Todos os tipos são inferidos automaticamente dos schemas Zod:

```typescript
import type { 
  Expense, 
  CreateExpenseInput, 
  UpdateExpenseInput 
} from '@/lib/schemas/expense.schema';
```

## 🚀 Boas Práticas

1. **Sempre use os hooks**: Não chame as APIs diretamente
2. **Validação**: Use os schemas para validar formulários
3. **Tratamento de erros**: Verifique sempre o estado `error`
4. **Loading states**: Use o estado `loading` para feedback visual
5. **Refetch**: Use `refetch()` após mutações quando necessário

## 🧪 Exemplo Completo

```typescript
'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/api';
import { CreateExpenseInput } from '@/lib/schemas/expense.schema';

export default function ExpenseForm() {
  const { createExpense, loading, error } = useExpenses();
  const [formData, setFormData] = useState<CreateExpenseInput>({
    name: '',
    value: 0,
    category: '',
    date: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expense = await createExpense(formData);
    if (expense) {
      // Sucesso!
      console.log('Despesa criada:', expense);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```
