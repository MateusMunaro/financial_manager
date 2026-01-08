/**
 * Dashboard Data Manager
 * 
 * Responsável por gerenciar todas as operações de dados do dashboard.
 * Separação de responsabilidades entre hooks (estado/ciclo de vida) e 
 * data manager (lógica de negócio/transformação de dados).
 */

import { dashboardApi } from '@/lib/api/dashboard.api';
import {
  DashboardData,
  FinancialSummary,
  RecentTransaction,
  CategorySpending,
  MonthlyTrend,
} from '@/lib/schemas/dashboard.schema';
import { Period } from '@/lib/schemas/expense.schema';

export interface DashboardFilters {
  period?: Period;
  limit?: number;
  months?: number;
}

export interface DashboardDataManagerResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Data Manager para o Dashboard
 * Encapsula toda a lógica de busca e transformação de dados
 */
class DashboardDataManager {
  /**
   * Busca todos os dados do dashboard de uma vez
   */
  async fetchDashboardData(
    period: Period = 'month'
  ): Promise<DashboardDataManagerResponse<DashboardData | null>> {
    try {
      const data = await dashboardApi.getAll(period);
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: this.handleError(error, 'Erro ao carregar dados do dashboard'),
      };
    }
  }

  /**
   * Busca o resumo financeiro
   */
  async fetchFinancialSummary(
    period: Period = 'month'
  ): Promise<DashboardDataManagerResponse<FinancialSummary | null>> {
    try {
      const data = await dashboardApi.getSummary(period);
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: this.handleError(error, 'Erro ao carregar resumo financeiro'),
      };
    }
  }

  /**
   * Busca transações recentes
   */
  async fetchRecentTransactions(
    limit: number = 10
  ): Promise<DashboardDataManagerResponse<RecentTransaction[]>> {
    try {
      const data = await dashboardApi.getRecentTransactions(limit);
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: this.handleError(error, 'Erro ao carregar transações recentes'),
      };
    }
  }

  /**
   * Busca gastos por categoria
   */
  async fetchCategorySpending(
    period: Period = 'month'
  ): Promise<DashboardDataManagerResponse<CategorySpending[]>> {
    try {
      const data = await dashboardApi.getCategorySpending(period);
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: this.handleError(error, 'Erro ao carregar gastos por categoria'),
      };
    }
  }

  /**
   * Busca tendência mensal
   */
  async fetchMonthlyTrend(
    months: number = 6
  ): Promise<DashboardDataManagerResponse<MonthlyTrend[]>> {
    try {
      const data = await dashboardApi.getMonthlyTrend(months);
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: this.handleError(error, 'Erro ao carregar tendência mensal'),
      };
    }
  }

  /**
   * Busca múltiplos dados em paralelo para otimização
   */
  async fetchDashboardParallel(filters: DashboardFilters = {}): Promise<{
    summary: DashboardDataManagerResponse<FinancialSummary | null>;
    transactions: DashboardDataManagerResponse<RecentTransaction[]>;
    spending: DashboardDataManagerResponse<CategorySpending[]>;
    trend: DashboardDataManagerResponse<MonthlyTrend[]>;
  }> {
    const { period = 'month', limit = 10, months = 6 } = filters;

    const [summary, transactions, spending, trend] = await Promise.all([
      this.fetchFinancialSummary(period),
      this.fetchRecentTransactions(limit),
      this.fetchCategorySpending(period),
      this.fetchMonthlyTrend(months),
    ]);

    return {
      summary,
      transactions,
      spending,
      trend,
    };
  }

  /**
   * Transforma transações para formato de exibição mobile
   */
  transformTransactionsForMobile(
    transactions: RecentTransaction[]
  ): Array<{
    id: string | number;
    title: string;
    category: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
  }> {
    return transactions.map((tx, index) => ({
      id: tx.id || index,
      title: tx.name,
      category: tx.category,
      amount: tx.type === 'income' ? tx.value : -tx.value,
      date: tx.date,
      type: tx.type,
    }));
  }

  /**
   * Calcula métricas derivadas do resumo financeiro
   */
  calculateDerivedMetrics(summary: FinancialSummary): {
    savingsRate: number;
    expenseToIncomeRatio: number;
    netWorth: number;
    isHealthy: boolean;
  } {
    const savingsRate =
      summary.totalIncome > 0
        ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100
        : 0;

    const expenseToIncomeRatio =
      summary.totalIncome > 0
        ? (summary.totalExpenses / summary.totalIncome) * 100
        : 0;

    const netWorth = summary.totalBalance + summary.totalInvestments;

    // Considera saudável se taxa de poupança >= 20%
    const isHealthy = savingsRate >= 20;

    return {
      savingsRate,
      expenseToIncomeRatio,
      netWorth,
      isHealthy,
    };
  }

  /**
   * Agrupa gastos por categoria com totais
   */
  aggregateCategorySpending(spending: CategorySpending[]): {
    categories: CategorySpending[];
    total: number;
    topCategory: CategorySpending | null;
  } {
    const total = spending.reduce((sum, cat) => sum + cat.value, 0);
    const sorted = [...spending].sort((a, b) => b.value - a.value);

    return {
      categories: sorted,
      total,
      topCategory: sorted[0] || null,
    };
  }

  /**
   * Formata valor para moeda brasileira
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  /**
   * Formata percentual com sinal
   */
  formatPercentage(value: number, showSign: boolean = true): string {
    const sign = showSign && value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  }

  /**
   * Trata erros de forma padronizada
   */
  private handleError(error: unknown, defaultMessage: string): string {
    if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  }
}

// Exporta instância única (singleton)
export const dashboardDataManager = new DashboardDataManager();

// Exporta a classe para testes
export { DashboardDataManager };
