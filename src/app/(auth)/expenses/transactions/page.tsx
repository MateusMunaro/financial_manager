'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { GlassCalendar } from '@/components/GlassCalendar';
import { useState } from 'react';
import { ExpenseForm } from '../_components/ExpenseForm';
import { ExpenseList } from '../_components/ExpenseList';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format, isSameDay, parseISO } from 'date-fns';
import Link from 'next/link';
import { useExpenses } from '@/hooks/api/useExpenses';
import type { CreateExpenseInput } from '@/lib/schemas/expense.schema';

export default function TransactionsPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Fetch expenses from API
  const { expenses, loading, createExpense, deleteExpense } = useExpenses();

  const handleAddExpense = async (expenseData: CreateExpenseInput) => {
    const success = await createExpense(expenseData);
    if (success) {
      setShowForm(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddExpenseFromCalendar = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  // Filter expenses by selected date
  const filteredExpenses = expenses.filter(expense => 
    isSameDay(parseISO(expense.date), selectedDate)
  );

  // Total for selected date
  const totalForSelectedDate = filteredExpenses.reduce((acc, exp) => acc + exp.value, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: getThemeColor(colors.brand.primary) }}
          />
          <p style={{ color: getThemeColor(colors.text.secondary) }}>
            Carregando transações...
          </p>
        </div>
      </div>
    );
  }

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
              Transações
            </h1>
            <p
              className="text-lg"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Gerencie todos os seus gastos
            </p>
          </div>
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

      {/* Modal Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Adicionar Nova Transação"
        size="lg"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowForm(false)}
          defaultDate={format(selectedDate, 'yyyy-MM-dd')}
        />
      </Modal>

      {/* Two Column Layout: Calendar + Expense List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="order-2 lg:order-1">
          <GlassCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onAddExpense={handleAddExpenseFromCalendar}
          />
          
          {/* Info card for selected date */}
          <div
            className="mt-4 p-4 rounded-2xl"
            style={{
              backgroundColor: getThemeColor(colors.background.paper),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            <p
              className="text-sm font-medium mb-2"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Total do dia selecionado
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: getThemeColor(colors.brand.primary) }}
            >
              R$ {totalForSelectedDate.toFixed(2)}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: getThemeColor(colors.text.tertiary) }}
            >
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'gasto' : 'gastos'} neste dia
            </p>
          </div>
        </div>

        {/* List Section */}
        <div className="order-1 lg:order-2">
          <div className="mb-4">
            <h2
              className="text-xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              Gastos de {format(selectedDate, "dd/MM/yyyy")}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {filteredExpenses.length === 0 
                ? 'Nenhum gasto neste dia' 
                : `Mostrando ${filteredExpenses.length} ${filteredExpenses.length === 1 ? 'gasto' : 'gastos'}`
              }
            </p>
          </div>
          <ExpenseList
            expenses={filteredExpenses}
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}
