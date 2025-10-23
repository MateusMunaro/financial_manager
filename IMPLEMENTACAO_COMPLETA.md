# 🚀 Sistema de API e Hooks - Gerenciador Financeiro

Estrutura completa de comunicação com back-end implementada com sucesso!

## ✅ O que foi criado

### 📦 Dependências Instaladas
- **Zod** - Validação de schemas e tipos
- **Axios** - Cliente HTTP para requisições

### 🗂️ Estrutura de Pastas

```
src/
├── lib/
│   ├── api/              # 8 arquivos criados
│   │   ├── client.ts     # Cliente HTTP configurado
│   │   ├── auth.api.ts   # API de autenticação
│   │   ├── dashboard.api.ts
│   │   ├── expenses.api.ts
│   │   ├── investments.api.ts
│   │   ├── payment-methods.api.ts
│   │   ├── recurring-expenses.api.ts
│   │   └── index.ts
│   └── schemas/          # 4 arquivos criados
│       ├── auth.schema.ts
│       ├── dashboard.schema.ts
│       ├── expense.schema.ts
│       └── investment.schema.ts
└── hooks/
    └── api/              # 7 arquivos criados
        ├── useAuth.ts
        ├── useDashboard.ts
        ├── useExpenses.ts
        ├── useInvestments.ts
        ├── usePaymentMethods.ts
        ├── useRecurringExpenses.ts
        └── index.ts
```

## 🎯 Funcionalidades Implementadas

### 1. **Cliente HTTP (Axios)**
- ✅ Configuração base com URL da API
- ✅ Interceptores de autenticação
- ✅ Tratamento automático de erros
- ✅ Timeout configurável
- ✅ Refresh token automático

### 2. **Schemas de Validação (Zod)**
- ✅ Validação de despesas
- ✅ Validação de métodos de pagamento
- ✅ Validação de despesas recorrentes
- ✅ Validação de investimentos
- ✅ Validação de autenticação
- ✅ Validação de dashboard
- ✅ Tipos TypeScript inferidos automaticamente

### 3. **APIs Organizadas**
- ✅ **Auth API**: Login, registro, perfil, logout
- ✅ **Expenses API**: CRUD completo + estatísticas
- ✅ **Payment Methods API**: CRUD + método padrão
- ✅ **Recurring Expenses API**: CRUD + ativar/desativar
- ✅ **Investments API**: CRUD + histórico + estatísticas
- ✅ **Dashboard API**: Resumo financeiro completo

### 4. **Hooks Customizados**
Cada hook retorna:
- ✅ Dados carregados
- ✅ Estado de loading
- ✅ Mensagens de erro
- ✅ Funções CRUD
- ✅ Função refetch

**Hooks disponíveis:**
- `useAuth()` - Autenticação e usuário
- `useExpenses()` - Gestão de despesas
- `useExpenseStats()` - Estatísticas de despesas
- `useExpense(id)` - Despesa individual
- `usePaymentMethods()` - Métodos de pagamento
- `useRecurringExpenses()` - Despesas recorrentes
- `useInvestments()` - Gestão de investimentos
- `useInvestmentStats()` - Estatísticas de investimentos
- `useInvestmentHistory(id)` - Histórico de investimento
- `useDashboard()` - Dados completos do dashboard
- `useFinancialSummary()` - Resumo financeiro

## 📝 Como Usar

### 1. Configure o ambiente

Copie `.env.local.example` para `.env.local`:
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com a URL do seu back-end:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Importe os hooks

```typescript
import { useExpenses, useAuth, useInvestments } from '@/hooks/api';
```

### 3. Use nos componentes

```typescript
function MyComponent() {
  const { expenses, loading, createExpense } = useExpenses();
  
  if (loading) return <p>Carregando...</p>;
  
  return (
    <div>
      {expenses.map(expense => (
        <div key={expense.id}>{expense.name}</div>
      ))}
    </div>
  );
}
```

## 🔐 Sistema de Autenticação

- JWT armazenado no localStorage
- Token adicionado automaticamente em todas requisições
- Redirecionamento automático para login se não autenticado
- Suporte a refresh token

## 🛡️ Validação de Dados

Todos os dados são validados antes de serem enviados/recebidos:

```typescript
import { createExpenseSchema } from '@/lib/schemas/expense.schema';

// Validar dados
const validatedData = createExpenseSchema.parse(formData);
```

## 📊 Tipos Disponíveis

Todos os tipos são exportados e podem ser importados:

```typescript
import type {
  Expense,
  PaymentMethod,
  RecurringExpense,
  Investment,
  User,
} from '@/lib/schemas/...';
```

## 🎨 Exemplos de Uso

Veja o arquivo `EXAMPLES.tsx` para exemplos detalhados de:
- Login e registro
- CRUD de despesas
- Filtros e estatísticas
- Métodos de pagamento
- Despesas recorrentes
- Investimentos
- Dashboard
- Validação de formulários
- Tratamento de erros

## 📚 Documentação Adicional

Consulte `API_README.md` para documentação completa sobre:
- Estrutura de pastas
- Configuração
- Uso detalhado de cada hook
- Boas práticas
- Exemplos avançados

## 🚀 Próximos Passos

1. Configure o arquivo `.env.local` com a URL do seu back-end
2. Implemente o back-end seguindo os contratos das APIs
3. Substitua os dados mockados nas páginas pelos hooks reais
4. Adicione tratamento de erros com toasts/notificações
5. Implemente loading states nas interfaces

## ⚠️ Importante

- **Sempre use os hooks**, não chame as APIs diretamente
- **Valide formulários** usando os schemas do Zod
- **Trate erros** verificando o estado `error` dos hooks
- **Mostre feedback** usando o estado `loading`
- **Refetch dados** quando necessário após mutações

## 📞 Estrutura de Rotas do Back-end

O back-end deve implementar estas rotas:

**Auth:**
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/logout`
- GET `/auth/me`
- PUT `/auth/profile`
- POST `/auth/change-password`

**Expenses:**
- GET `/expenses`
- GET `/expenses/:id`
- POST `/expenses`
- PUT `/expenses/:id`
- DELETE `/expenses/:id`
- GET `/expenses/stats`

**Payment Methods:**
- GET `/payment-methods`
- POST `/payment-methods`
- PUT `/payment-methods/:id`
- DELETE `/payment-methods/:id`
- PATCH `/payment-methods/:id/set-default`

**Recurring Expenses:**
- GET `/recurring-expenses`
- POST `/recurring-expenses`
- PUT `/recurring-expenses/:id`
- DELETE `/recurring-expenses/:id`
- PATCH `/recurring-expenses/:id/toggle-active`
- POST `/recurring-expenses/:id/generate`

**Investments:**
- GET `/investments`
- POST `/investments`
- PUT `/investments/:id`
- DELETE `/investments/:id`
- GET `/investments/stats`
- GET `/investments/:id/history`
- PATCH `/investments/:id/update-value`

**Dashboard:**
- GET `/dashboard`
- GET `/dashboard/summary`
- GET `/dashboard/recent-transactions`
- GET `/dashboard/category-spending`
- GET `/dashboard/monthly-trend`

---

✨ **Sistema completo de API e Hooks implementado com sucesso!** ✨
