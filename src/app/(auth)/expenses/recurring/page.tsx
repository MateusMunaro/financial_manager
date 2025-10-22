'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { RecurringExpenseForm } from '../_components/RecurringExpenseForm';
import { RecurringExpenseCard } from '../_components/RecurringExpenseCard';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { RecurringExpense } from '../_components/types';

export default function RecurringExpensesPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    {
      id: '1',
      name: 'Netflix',
      value: 39.90,
      category: 'Entretenimento',
      frequency: 'monthly',
      dayOfMonth: 25,
      paymentMethod: 'credit-card',
      isActive: true,
      startDate: '2024-01-25',
    },
    {
      id: '2',
      name: 'Internet',
      value: 99.90,
      category: 'Moradia',
      frequency: 'monthly',
      dayOfMonth: 28,
      paymentMethod: 'bank-slip',
      isActive: true,
      startDate: '2024-01-28',
    },
    {
      id: '3',
      name: 'Faculdade',
      value: 1200.00,
      category: 'Educação',
      frequency: 'monthly',
      dayOfMonth: 10,
      paymentMethod: 'bank-slip',
      isActive: true,
      startDate: '2024-03-10',
    },
    {
      id: '4',
      name: 'Spotify',
      value: 19.90,
      category: 'Entretenimento',
      frequency: 'monthly',
      dayOfMonth: 15,
      paymentMethod: 'credit-card',
      isActive: false,
      startDate: '2024-01-15',
      endDate: '2025-09-15',
    },
  ]);

  const handleAddRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
    const newExpense: RecurringExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setRecurringExpenses([...recurringExpenses, newExpense]);
    setShowForm(false);
  };

  const handleDeleteRecurringExpense = (id: string) => {
    setRecurringExpenses(recurringExpenses.filter(exp => exp.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setRecurringExpenses(recurringExpenses.map(exp => 
      exp.id === id 
        ? { ...exp, isActive: !exp.isActive, endDate: !exp.isActive ? undefined : new Date().toISOString().split('T')[0] }
        : exp
    ));
  };

  const activeExpenses = recurringExpenses.filter(exp => exp.isActive);
  const inactiveExpenses = recurringExpenses.filter(exp => !exp.isActive);
  const totalMonthly = activeExpenses.reduce((sum, exp) => {
    if (exp.frequency === 'monthly') return sum + exp.value;
    if (exp.frequency === 'yearly') return sum + (exp.value / 12);
    return sum;
  }, 0);

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
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Gasto Fixo
        </Button>
      </div>

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
            R$ {(totalMonthly * 12).toFixed(2)}
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
      {recurringExpenses.length === 0 && (
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
    </div>
  );
}
