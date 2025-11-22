// ============================================
// EXEMPLOS DE USO - API e Hooks
// ============================================

import { useEffect } from 'react';

// ============================================
// 1. AUTENTICAÇÃO
// ============================================

// Login de usuário
import { useAuth } from '@/hooks/api';

function LoginExample() {
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      email: 'usuario@exemplo.com',
      password: 'senha123',
    });

    if (success) {
      console.log('Login bem-sucedido!');
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

// Registro de novo usuário
function RegisterExample() {
  const { register, loading, error } = useAuth();

  const handleRegister = async () => {
    const success = await register({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    if (success) {
      console.log('Conta criada com sucesso!');
    }
  };
}

// ============================================
// 2. DESPESAS
// ============================================

// Listar todas as despesas
import { useExpenses } from '@/hooks/api';

function ExpensesListExample() {
  const { expenses, loading, error, deleteExpense } = useExpenses();

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          {expense.name} - R$ {expense.value}
          <button onClick={() => deleteExpense(expense.id)}>Deletar</button>
        </li>
      ))}
    </ul>
  );
}

// Criar nova despesa
function CreateExpenseExample() {
  const { createExpense, loading } = useExpenses();

  const handleCreate = async () => {
    const newExpense = await createExpense({
      name: 'Supermercado',
      value: 250.50,
      category: 'Alimentação',
      date: '2025-10-22',
      description: 'Compras da semana',
      paymentMethod: 'credit-card',
    });

    if (newExpense) {
      console.log('Despesa criada:', newExpense);
    }
  };
}

// Filtrar despesas
function FilteredExpensesExample() {
  const { expenses, loading } = useExpenses({
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    category: 'Alimentação',
    minValue: 50,
    maxValue: 500,
  });
}

// Estatísticas de despesas
import { useExpenseStats } from '@/hooks/api';

function ExpenseStatsExample() {
  const { stats, loading } = useExpenseStats();

  if (loading || !stats) return <p>Carregando...</p>;

  return (
    <div>
      <p>Total: R$ {stats.total}</p>
      <p>Média: R$ {stats.average}</p>
      <p>Quantidade: {stats.count}</p>
      
      <h3>Por Categoria:</h3>
      <ul>
        {Object.entries(stats.byCategory).map(([category, value]) => (
          <li key={category}>{category}: R$ {value}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// 3. MÉTODOS DE PAGAMENTO
// ============================================

import { usePaymentMethods } from '@/hooks/api';

function PaymentMethodsExample() {
  const {
    paymentMethods,
    createPaymentMethod,
    setDefaultPaymentMethod,
    loading,
  } = usePaymentMethods();

  const handleCreate = async () => {
    const newMethod = await createPaymentMethod({
      name: 'Cartão Nubank',
      type: 'credit-card',
      lastDigits: '1234',
      limit: 5000,
      isDefault: false,
    });
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultPaymentMethod(id);
  };

  return (
    <div>
      {paymentMethods.map((method) => (
        <div key={method.id}>
          <h4>{method.name}</h4>
          <p>Tipo: {method.type}</p>
          {method.isDefault && <span>Padrão</span>}
          <button onClick={() => handleSetDefault(method.id)}>
            Definir como padrão
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 4. DESPESAS RECORRENTES
// ============================================

import { useRecurringExpenses } from '@/hooks/api';

function RecurringExpensesExample() {
  const {
    recurringExpenses,
    createRecurringExpense,
    toggleActive,
    generateExpenses,
  } = useRecurringExpenses(true); // true = apenas ativos

  const handleCreate = async () => {
    const newRecurring = await createRecurringExpense({
      name: 'Netflix',
      value: 39.90,
      category: 'Entretenimento',
      frequency: 'monthly',
      dayOfMonth: 15,
      paymentMethod: 'credit-card',
      isActive: true,
      startDate: '2025-01-01',
    });
  };

  const handleToggle = async (id: string) => {
    await toggleActive(id);
  };

  const handleGenerateNext3Months = async (id: string) => {
    // Gerar despesas dos próximos 3 meses
    const startDate = new Date().toISOString();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);
    
    await generateExpenses(id, {
      startDate,
      endDate: endDate.toISOString()
    });
  };
}

// ============================================
// 5. INVESTIMENTOS
// ============================================

import { useInvestments, useInvestmentStats } from '@/hooks/api';

function InvestmentsExample() {
  const { investments, createInvestment, updateCurrentValue } = useInvestments();
  const { stats } = useInvestmentStats();

  const handleCreate = async () => {
    const newInvestment = await createInvestment({
      name: 'Tesouro Selic 2029',
      type: 'Renda Fixa',
      value: 10000,
      currentValue: 10000,
      purchaseDate: '2025-10-22',
      ticker: 'SELIC2029',
    });
  };

  const handleUpdateValue = async (id: string) => {
    await updateCurrentValue(id, 10850);
  };

  return (
    <div>
      <h2>Estatísticas</h2>
      {stats && (
        <>
          <p>Total Investido: R$ {stats.totalInvested}</p>
          <p>Valor Atual: R$ {stats.currentTotal}</p>
          <p>Lucro: R$ {stats.totalProfit}</p>
          <p>Rentabilidade: {stats.profitPercentage.toFixed(2)}%</p>
        </>
      )}

      <h2>Investimentos</h2>
      {investments.map((inv) => (
        <div key={inv.id}>
          <h3>{inv.name}</h3>
          <p>Tipo: {inv.type}</p>
          <p>Investido: R$ {inv.value}</p>
          <p>Valor Atual: R$ {inv.currentValue}</p>
          <p>Lucro: R$ {inv.currentValue - inv.value}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 6. DASHBOARD
// ============================================

import { useDashboard, useFinancialSummary } from '@/hooks/api';

function DashboardExample() {
  const { data, loading } = useDashboard('month');
  const { summary } = useFinancialSummary('month');

  if (loading || !data || !summary) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Resumo Financeiro</h2>
      <div>
        <p>Saldo Total: R$ {summary.totalBalance}</p>
        <p>Receitas: R$ {summary.totalIncome}</p>
        <p>Despesas: R$ {summary.totalExpenses}</p>
        <p>Investimentos: R$ {summary.totalInvestments}</p>
      </div>

      <h2>Transações Recentes</h2>
      {data.recentTransactions.map((transaction) => (
        <div key={transaction.id}>
          <p>{transaction.name} - R$ {transaction.value}</p>
          <small>{transaction.date}</small>
        </div>
      ))}

      <h2>Gastos por Categoria</h2>
      {data.categorySpending.map((category) => (
        <div key={category.category}>
          <p>{category.category}: R$ {category.value}</p>
          <p>({category.percentage}%)</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 7. VALIDAÇÃO COM ZOD
// ============================================

import { createExpenseSchema } from '@/lib/schemas/expense.schema';
import { z } from 'zod';

function ValidationExample() {
  const handleSubmit = (formData: any) => {
    try {
      // Validar dados do formulário
      const validatedData = createExpenseSchema.parse(formData);
      
      // Se chegou aqui, os dados são válidos
      console.log('Dados válidos:', validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Tratar erros de validação
        error.issues.forEach((err) => {
          console.log(`${err.path}: ${err.message}`);
        });
      }
    }
  };
}

// ============================================
// 8. CHAMADAS DIRETAS À API (não recomendado)
// ============================================

import { expensesApi } from '@/lib/api';

async function DirectApiExample() {
  try {
    // Buscar todas as despesas
    const expenses = await expensesApi.getAll();
    
    // Buscar uma despesa específica
    const expense = await expensesApi.getById('expense-id');
    
    // Criar despesa
    const newExpense = await expensesApi.create({
      name: 'Teste',
      value: 100,
      category: 'Teste',
      date: new Date().toISOString(),
    });
    
    // Atualizar despesa
    const updated = await expensesApi.update('expense-id', {
      value: 150,
    });
    
    // Deletar despesa
    await expensesApi.delete('expense-id');
  } catch (error) {
    console.error('Erro na API:', error);
  }
}

// ============================================
// 9. TRATAMENTO DE ERROS AVANÇADO
// ============================================

function ErrorHandlingExample() {
  const { expenses, loading, error, refetch } = useExpenses();

  useEffect(() => {
    if (error) {
      // Mostrar toast/notificação
      console.error('Erro ao carregar despesas:', error);
      
      // Tentar novamente após 5 segundos
      const timeout = setTimeout(() => {
        refetch();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [error, refetch]);

  if (loading) return null; // return <LoadingSpinner />;
  if (error) return null; // return <ErrorMessage message={error} onRetry={refetch} />;

  return null; // return <ExpensesList expenses={expenses} />;
}

// ============================================
// 10. COMBINANDO MÚLTIPLOS HOOKS
// ============================================

function CombinedExample() {
  const { expenses } = useExpenses();
  const { paymentMethods } = usePaymentMethods();
  const { recurringExpenses } = useRecurringExpenses();
  const { investments } = useInvestments();

  // Calcular totais
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

  return (
    <div>
      <h2>Visão Geral Completa</h2>
      <p>Total em Despesas: R$ {totalExpenses}</p>
      <p>Total em Investimentos: R$ {totalInvestments}</p>
      <p>Métodos de Pagamento: {paymentMethods.length}</p>
      <p>Gastos Recorrentes: {recurringExpenses.length}</p>
    </div>
  );
}

export {
  LoginExample,
  RegisterExample,
  ExpensesListExample,
  CreateExpenseExample,
  FilteredExpensesExample,
  ExpenseStatsExample,
  PaymentMethodsExample,
  RecurringExpensesExample,
  InvestmentsExample,
  DashboardExample,
  ValidationExample,
  DirectApiExample,
  ErrorHandlingExample,
  CombinedExample,
};
