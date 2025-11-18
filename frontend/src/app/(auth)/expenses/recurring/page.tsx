'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { RecurringExpenseForm } from '../_components/RecurringExpenseForm';
import { RecurringExpenseCard } from '../_components/RecurringExpenseCard';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRecurringExpenses } from '@/hooks/api/useRecurringExpenses';
import type { CreateRecurringExpenseInput } from '@/lib/schemas/expense.schema';

export default function RecurringExpensesPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  
  const {
    recurringExpenses,
    activeExpenses,
    inactiveExpenses,
    totalMonthly,
    totalYearly,
    loading,
    error,
    createRecurringExpense,
    deleteRecurringExpense,
    toggleActive,
  } = useRecurringExpenses();

  const handleAddRecurringExpense = async (expense: CreateRecurringExpenseInput) => {
    console.log('📝 Dados do formulário:', expense);
    const result = await createRecurringExpense(expense);
    if (result) {
      console.log('✅ Despesa criada com sucesso!', result);
      setShowForm(false);
    } else {
      console.error('❌ Falha ao criar despesa');
      alert('Erro ao criar despesa recorrente. Verifique os dados e tente novamente.');
    }
  };

  const handleDeleteRecurringExpense = async (id: string) => {
    await deleteRecurringExpense(id);
  };

  const handleToggleActive = async (id: string) => {
    await toggleActive(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/expenses"
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: getThemeColor(colors.background.paper),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            <ArrowLeftIcon
              className="h-5 w-5"
              style={{ color: getThemeColor(colors.text.primary) }}
            />
          </Link>
          
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              Gastos Recorrentes
            </h1>
            <p
              className="text-lg"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Configure despesas fixas e assinaturas
            </p>
          </div>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Gasto Fixo
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card elevated>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: getThemeColor(colors.semantic.negative) + '20',
              border: `1px solid ${getThemeColor(colors.semantic.negative)}`,
            }}
          >
            <p style={{ color: getThemeColor(colors.semantic.negative) }}>{error}</p>
          </div>
        </Card>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Adicionar Gasto Recorrente"
        size="lg"
      >
        <RecurringExpenseForm
          onSubmit={handleAddRecurringExpense}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Loading State */}
      {loading && recurringExpenses.length === 0 ? (
        <Card elevated>
          <div className="text-center py-12">
            <p
              className="text-lg"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Carregando...
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card elevated>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Total Mensal
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: getThemeColor(colors.semantic.negative) }}
              >
                R$ {totalMonthly.toFixed(2)}
              </p>
            </Card>

            <Card elevated>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Gastos Ativos
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                {activeExpenses.length}
              </p>
            </Card>

            <Card elevated>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Total Anual
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                R$ {totalYearly.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Active Expenses */}
          {activeExpenses.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                Despesas Ativas ({activeExpenses.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeExpenses.map((expense) => (
                  <RecurringExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={handleDeleteRecurringExpense}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Expenses */}
          {inactiveExpenses.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Despesas Inativas ({inactiveExpenses.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {inactiveExpenses.map((expense) => (
                  <RecurringExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={handleDeleteRecurringExpense}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recurringExpenses.length === 0 && !loading && (
            <Card elevated>
              <div className="text-center py-12">
                <p
                  className="text-lg mb-4"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Nenhum gasto recorrente cadastrado ainda.
                </p>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Adicionar Primeiro Gasto Fixo
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
