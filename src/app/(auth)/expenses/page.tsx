'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useState } from 'react';
import { ExpenseForm } from './_components/ExpenseForm';
import { ExpenseList } from './_components/ExpenseList';
import { ExpenseStats } from './_components/ExpenseStats';
import { PlusIcon } from '@heroicons/react/24/outline';

export interface Expense {
  id: string;
  name: string;
  value: number;
  category: string;
  date: string;
  description?: string;
}

export default function ExpensesPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      name: 'Supermercado',
      value: 450.00,
      category: 'Alimentação',
      date: '2025-10-20',
      description: 'Compras do mês',
    },
    {
      id: '2',
      name: 'Netflix',
      value: 39.90,
      category: 'Entretenimento',
      date: '2025-10-19',
    },
    {
      id: '3',
      name: 'Combustível',
      value: 250.00,
      category: 'Transporte',
      date: '2025-10-18',
    },
    {
      id: '4',
      name: 'Restaurante',
      value: 120.00,
      category: 'Alimentação',
      date: '2025-10-17',
    },
  ]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([newExpense, ...expenses]);
    setShowForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Gastos
          </h1>
          <p
            className="text-lg"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Gerencie suas despesas
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Gasto
        </Button>
      </div>

      {/* Stats */}
      <ExpenseStats expenses={expenses} />

      {/* Modal Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Adicionar Novo Gasto"
        size="lg"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* List */}
      <ExpenseList
        expenses={expenses}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
}
