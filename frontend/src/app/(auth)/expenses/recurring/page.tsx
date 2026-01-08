'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { GlassCalendar } from '@/components/GlassCalendar';
import { RecurringExpenseCard } from '../_components/RecurringExpenseCard';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XMarkIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { useRecurringExpenses } from '@/hooks/api/useRecurringExpenses';
import type { 
  CreateRecurringExpenseInput,
  RecurringFrequency,
  PaymentMethodType,
} from '@/lib/schemas/expense.schema';
import { format, getDate, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Utilitários de Formatação ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function RecurringExpensesPage() {
  const { getThemeColor } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
    frequency: 'monthly' as RecurringFrequency,
    dayOfMonth: '1',
    dayOfWeek: '',
    paymentMethod: 'bank-slip' as PaymentMethodType,
    startDate: new Date().toISOString().split('T')[0],
    description: '',
  });
  
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

  // Form options
  const categories = [
    'Alimentação', 'Transporte', 'Saúde', 'Educação',
    'Entretenimento', 'Moradia', 'Vestuário', 'Assinaturas', 'Outros',
  ];

  const frequencies: { value: RecurringFrequency; label: string }[] = [
    { value: 'monthly', label: 'Mensal' },
    { value: 'yearly', label: 'Anual' },
    { value: 'weekly', label: 'Semanal' },
  ];

  const paymentMethods: { value: PaymentMethodType; label: string }[] = [
    { value: 'credit-card', label: 'Crédito' },
    { value: 'debit-card', label: 'Débito' },
    { value: 'pix', label: 'PIX' },
    { value: 'bank-slip', label: 'Boleto' },
  ];

  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' },
  ];

  // Filtrar despesas pelo dia selecionado
  const filteredExpensesByDate = useMemo(() => {
    const selectedDay = getDate(selectedDate);
    const selectedDayOfWeek = selectedDate.getDay();
    
    return recurringExpenses.filter(expense => {
      if (expense.frequency === 'monthly' && expense.dayOfMonth === selectedDay) return true;
      if (expense.frequency === 'weekly' && expense.dayOfWeek === selectedDayOfWeek) return true;
      if (expense.frequency === 'yearly') {
        const startDate = new Date(expense.startDate);
        return startDate.getDate() === selectedDay && 
               startDate.getMonth() === selectedDate.getMonth();
      }
      return false;
    });
  }, [recurringExpenses, selectedDate]);

  // Filtrar por tab e busca
  const displayedExpenses = useMemo(() => {
    let filtered = filteredExpensesByDate;
    
    if (activeTab === 'active') {
      filtered = filtered.filter(e => e.isActive);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(e => !e.isActive);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(query) || 
        e.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [filteredExpensesByDate, activeTab, searchQuery]);

  // Totais do dia
  const dailyTotal = filteredExpensesByDate.reduce((acc, curr) => acc + curr.value, 0);
  const dailyActiveCount = filteredExpensesByDate.filter(e => e.isActive).length;

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      category: '',
      frequency: 'monthly',
      dayOfMonth: String(getDate(selectedDate)),
      dayOfWeek: '',
      paymentMethod: 'bank-slip',
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      description: '',
    });
  };

  const handleOpenDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleAddRecurringExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const startDateISO = new Date(formData.startDate + 'T00:00:00').toISOString();

    const expenseData: CreateRecurringExpenseInput = {
      name: formData.name,
      value: parseFloat(formData.value),
      category: formData.category,
      frequency: formData.frequency,
      dayOfMonth: formData.frequency === 'monthly' || formData.frequency === 'yearly' 
        ? parseInt(formData.dayOfMonth) 
        : undefined,
      dayOfWeek: formData.frequency === 'weekly' && formData.dayOfWeek
        ? parseInt(formData.dayOfWeek)
        : undefined,
      paymentMethod: formData.paymentMethod || undefined,
      startDate: startDateISO,
      isActive: true,
      description: formData.description || undefined,
    };

    const result = await createRecurringExpense(expenseData);
    if (result) {
      setIsDrawerOpen(false);
      resetForm();
    } else {
      alert('Erro ao criar despesa recorrente. Verifique os dados e tente novamente.');
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddExpenseFromCalendar = (date: Date) => {
    setSelectedDate(date);
    handleOpenDrawer();
  };

  // Loading State
  if (loading && recurringExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: getThemeColor(colors.brand.primary) }}
          />
          <p style={{ color: getThemeColor(colors.text.secondary) }}>
            Carregando gastos recorrentes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <header 
        className="sticky top-0 z-10 px-4 lg:px-8 py-4 backdrop-blur-md"
        style={{
          backgroundColor: getThemeColor(colors.background.blur),
          borderBottom: `1px solid ${getThemeColor(colors.border.default)}`,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/expenses"
              className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: getThemeColor(colors.background.elevated),
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
                className="text-xl lg:text-2xl font-bold"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                Gastos Recorrentes
              </h1>
              <p
                className="text-xs lg:text-sm"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Configure despesas fixas e assinaturas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div 
              className="hidden md:flex items-center rounded-xl px-3 py-2 transition-all"
              style={{
                backgroundColor: getThemeColor(colors.background.elevated),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
              }}
            >
              <MagnifyingGlassIcon 
                className="h-4 w-4 mr-2" 
                style={{ color: getThemeColor(colors.text.tertiary) }}
              />
              <input 
                type="text" 
                placeholder="Buscar gasto..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-48"
                style={{ color: getThemeColor(colors.text.primary) }}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleOpenDrawer}
              className="flex items-center gap-2 shadow-lg"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Adicionar Gasto</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="px-4 lg:px-8 py-4 max-w-7xl mx-auto">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: getThemeColor(colors.semantic.negative) + '20',
              border: `1px solid ${getThemeColor(colors.semantic.negative)}`,
            }}
          >
            <p style={{ color: getThemeColor(colors.semantic.negative) }}>{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna Esquerda: Calendário e Resumo (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Calendar */}
            <GlassCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onAddExpense={handleAddExpenseFromCalendar}
            />

            {/* Resumo do Dia */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: getThemeColor(colors.gradient.glass),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
                boxShadow: getThemeColor(colors.shadow.lg),
              }}
            >
              <h4 
                className="text-sm font-medium mb-4 flex items-center gap-2"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                <CalendarIcon className="h-4 w-4" />
                Resumo de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <span 
                    className="text-xs uppercase tracking-wider"
                    style={{ color: getThemeColor(colors.text.tertiary) }}
                  >
                    Gastos Previstos
                  </span>
                  <div 
                    className="text-2xl font-bold mt-1"
                    style={{ color: getThemeColor(colors.semantic.negative) }}
                  >
                    {formatCurrency(dailyTotal)}
                  </div>
                </div>
                
                <div 
                  className="grid grid-cols-2 gap-4 pt-4"
                  style={{ borderTop: `1px solid ${getThemeColor(colors.border.default)}` }}
                >
                  <div>
                    <div 
                      className="flex items-center gap-1 text-xs mb-1"
                      style={{ color: getThemeColor(colors.semantic.positive) }}
                    >
                      <ArrowTrendingUpIcon className="h-3 w-3" />
                      Ativos
                    </div>
                    <span 
                      className="font-semibold"
                      style={{ color: getThemeColor(colors.text.primary) }}
                    >
                      {dailyActiveCount}
                    </span>
                  </div>
                  <div>
                    <div 
                      className="flex items-center gap-1 text-xs mb-1"
                      style={{ color: getThemeColor(colors.semantic.negative) }}
                    >
                      <ArrowTrendingDownIcon className="h-3 w-3" />
                      Total
                    </div>
                    <span 
                      className="font-semibold"
                      style={{ color: getThemeColor(colors.text.primary) }}
                    >
                      {filteredExpensesByDate.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards de Totais Gerais */}
            <div className="grid grid-cols-2 gap-4">
              <Card elevated padding="md">
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Total Mensal
                </p>
                <p
                  className="text-lg lg:text-xl font-bold"
                  style={{ color: getThemeColor(colors.semantic.negative) }}
                >
                  {formatCurrency(totalMonthly)}
                </p>
              </Card>

              <Card elevated padding="md">
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Total Anual
                </p>
                <p
                  className="text-lg lg:text-xl font-bold"
                  style={{ color: getThemeColor(colors.text.primary) }}
                >
                  {formatCurrency(totalYearly)}
                </p>
              </Card>
            </div>
          </div>

          {/* Coluna Direita: Lista de Despesas (8 colunas) */}
          <div className="lg:col-span-8">
            <div 
              className="rounded-2xl min-h-[600px] flex flex-col overflow-hidden"
              style={{
                backgroundColor: getThemeColor(colors.background.paper),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
                boxShadow: getThemeColor(colors.shadow.lg),
              }}
            >
              {/* Header da Lista */}
              <div 
                className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                style={{ borderBottom: `1px solid ${getThemeColor(colors.border.default)}` }}
              >
                <div>
                  <h2 
                    className="text-lg font-semibold"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    Movimentações
                  </h2>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    {displayedExpenses.length} {displayedExpenses.length === 1 ? 'registro' : 'registros'} em {format(selectedDate, 'dd/MM/yyyy')}
                  </p>
                </div>
                
                {/* Tabs */}
                <div 
                  className="flex rounded-xl p-1"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                  }}
                >
                  {[
                    { key: 'all', label: 'Todos' },
                    { key: 'active', label: 'Ativos' },
                    { key: 'inactive', label: 'Inativos' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                      style={{
                        backgroundColor: activeTab === tab.key 
                          ? getThemeColor(colors.brand.primary) 
                          : 'transparent',
                        color: activeTab === tab.key 
                          ? '#FFFFFF' 
                          : getThemeColor(colors.text.secondary),
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista */}
              <div className="flex-1 p-4 overflow-y-auto">
                {displayedExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {displayedExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="group flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer hover:scale-[1.01]"
                        style={{
                          backgroundColor: getThemeColor(colors.background.elevated),
                          border: `1px solid transparent`,
                          opacity: expense.isActive ? 1 : 0.6,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = getThemeColor(colors.border.strong);
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="h-12 w-12 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: expense.isActive 
                                ? getThemeColor(colors.brand.primary) + '20' 
                                : getThemeColor(colors.semantic.neutral) + '20',
                            }}
                          >
                            <ArrowPathIcon 
                              className="h-5 w-5"
                              style={{ 
                                color: expense.isActive 
                                  ? getThemeColor(colors.brand.primary) 
                                  : getThemeColor(colors.semantic.neutral) 
                              }}
                            />
                          </div>
                          <div>
                            <h4 
                              className="font-medium"
                              style={{ color: getThemeColor(colors.text.primary) }}
                            >
                              {expense.name}
                            </h4>
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                              style={{
                                backgroundColor: getThemeColor(colors.background.paper),
                                color: getThemeColor(colors.text.tertiary),
                                border: `1px solid ${getThemeColor(colors.border.default)}`,
                              }}
                            >
                              {expense.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <span 
                              className="block font-semibold"
                              style={{ color: getThemeColor(colors.semantic.negative) }}
                            >
                              {formatCurrency(expense.value)}
                            </span>
                            <span 
                              className="text-xs"
                              style={{ color: getThemeColor(colors.text.tertiary) }}
                            >
                              {expense.frequency === 'monthly' && 'Mensal'}
                              {expense.frequency === 'weekly' && 'Semanal'}
                              {expense.frequency === 'yearly' && 'Anual'}
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActive(expense.id);
                              }}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{
                                backgroundColor: expense.isActive 
                                  ? getThemeColor(colors.semantic.neutral) + '20'
                                  : getThemeColor(colors.semantic.positive) + '20',
                                color: expense.isActive 
                                  ? getThemeColor(colors.semantic.neutral)
                                  : getThemeColor(colors.semantic.positive),
                              }}
                              title={expense.isActive ? 'Pausar' : 'Ativar'}
                            >
                              {expense.isActive ? (
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                </svg>
                              ) : (
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRecurringExpense(expense.id);
                              }}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{
                                backgroundColor: getThemeColor(colors.semantic.negative) + '20',
                                color: getThemeColor(colors.semantic.negative),
                              }}
                              title="Excluir"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12">
                    <div 
                      className="p-6 rounded-full mb-4"
                      style={{ backgroundColor: getThemeColor(colors.background.elevated) }}
                    >
                      <WalletIcon 
                        className="h-12 w-12"
                        style={{ color: getThemeColor(colors.text.tertiary) }}
                      />
                    </div>
                    <p style={{ color: getThemeColor(colors.text.secondary) }}>
                      Nenhum gasto recorrente neste dia
                    </p>
                    <button 
                      onClick={handleOpenDrawer}
                      className="mt-2 text-sm hover:underline"
                      style={{ color: getThemeColor(colors.brand.primary) }}
                    >
                      Adicionar primeiro gasto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-40 transition-opacity"
          style={{ backgroundColor: getThemeColor(colors.background.overlay) }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: getThemeColor(colors.background.paper),
          borderLeft: `1px solid ${getThemeColor(colors.border.default)}`,
          boxShadow: getThemeColor(colors.shadow.lg),
        }}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div 
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${getThemeColor(colors.border.default)}` }}
          >
            <h2 
              className="text-lg font-semibold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              Novo Gasto Recorrente
            </h2>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: getThemeColor(colors.text.secondary),
                backgroundColor: getThemeColor(colors.background.elevated),
              }}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleAddRecurringExpense} className="space-y-6">
              {/* Valor */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Valor
                </label>
                <div className="relative">
                  <span 
                    className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    R$
                  </span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    autoFocus
                    className="w-full rounded-xl py-4 pl-12 pr-4 text-2xl font-bold focus:outline-none transition-all"
                    style={{
                      backgroundColor: getThemeColor(colors.background.elevated),
                      color: getThemeColor(colors.text.primary),
                      border: `1px solid ${getThemeColor(colors.border.default)}`,
                    }}
                    required
                  />
                </div>
              </div>

              {/* Nome */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Nome
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Netflix, Aluguel..." 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg p-3 focus:outline-none transition-all"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                    color: getThemeColor(colors.text.primary),
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                  }}
                  required
                />
              </div>

              {/* Categoria e Frequência */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg p-3 focus:outline-none appearance-none"
                    style={{
                      backgroundColor: getThemeColor(colors.background.elevated),
                      color: getThemeColor(colors.text.primary),
                      border: `1px solid ${getThemeColor(colors.border.default)}`,
                    }}
                    required
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    Frequência
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringFrequency })}
                    className="w-full rounded-lg p-3 focus:outline-none appearance-none"
                    style={{
                      backgroundColor: getThemeColor(colors.background.elevated),
                      color: getThemeColor(colors.text.primary),
                      border: `1px solid ${getThemeColor(colors.border.default)}`,
                    }}
                    required
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dia do vencimento */}
              {(formData.frequency === 'monthly' || formData.frequency === 'yearly') && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    Dia do Vencimento
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="31"
                    placeholder="1-31" 
                    value={formData.dayOfMonth}
                    onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
                    className="w-full rounded-lg p-3 focus:outline-none transition-all"
                    style={{
                      backgroundColor: getThemeColor(colors.background.elevated),
                      color: getThemeColor(colors.text.primary),
                      border: `1px solid ${getThemeColor(colors.border.default)}`,
                    }}
                    required
                  />
                </div>
              )}

              {formData.frequency === 'weekly' && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    Dia da Semana
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="w-full rounded-lg p-3 focus:outline-none appearance-none"
                    style={{
                      backgroundColor: getThemeColor(colors.background.elevated),
                      color: getThemeColor(colors.text.primary),
                      border: `1px solid ${getThemeColor(colors.border.default)}`,
                    }}
                    required
                  >
                    <option value="">Selecione um dia</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tipo de Pagamento */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Tipo de Pagamento
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {paymentMethods.map((method) => (
                    <button 
                      key={method.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                      className="py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{
                        backgroundColor: formData.paymentMethod === method.value 
                          ? getThemeColor(colors.brand.primary) 
                          : getThemeColor(colors.background.elevated),
                        color: formData.paymentMethod === method.value 
                          ? '#FFFFFF' 
                          : getThemeColor(colors.text.secondary),
                        border: `1px solid ${formData.paymentMethod === method.value 
                          ? getThemeColor(colors.brand.primary) 
                          : getThemeColor(colors.border.default)}`,
                      }}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data de Início */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Data de Início
                </label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg p-3 focus:outline-none transition-all"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                    color: getThemeColor(colors.text.primary),
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                  }}
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Adicione mais detalhes..."
                  rows={3}
                  className="w-full rounded-lg p-3 focus:outline-none transition-all resize-none"
                  style={{
                    backgroundColor: getThemeColor(colors.background.elevated),
                    color: getThemeColor(colors.text.primary),
                    border: `1px solid ${getThemeColor(colors.border.default)}`,
                  }}
                />
              </div>
              
              {/* Info */}
              <div 
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: getThemeColor(colors.brand.primary) + '20',
                  border: `1px solid ${getThemeColor(colors.brand.primary)}50`,
                  color: getThemeColor(colors.brand.primary),
                }}
              >
                <div 
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: getThemeColor(colors.brand.primary) }}
                />
                <span>Esta despesa será cobrada {formData.frequency === 'monthly' ? 'mensalmente' : formData.frequency === 'weekly' ? 'semanalmente' : 'anualmente'}.</span>
              </div>
            </form>
          </div>

          {/* Drawer Footer */}
          <div 
            className="p-6"
            style={{ 
              borderTop: `1px solid ${getThemeColor(colors.border.default)}`,
              backgroundColor: getThemeColor(colors.background.paper),
            }}
          >
            <button 
              onClick={handleAddRecurringExpense}
              className="w-full py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: getThemeColor(colors.brand.primary),
                color: '#FFFFFF',
                boxShadow: getThemeColor(colors.shadow.md),
              }}
            >
              Confirmar Gasto Recorrente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
