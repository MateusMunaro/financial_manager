'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import type { RecurringExpense, RecurringFrequency, PaymentMethodType } from './types';

interface RecurringExpenseFormProps {
  onSubmit: (expense: Omit<RecurringExpense, 'id'>) => void;
  onCancel: () => void;
}

export function RecurringExpenseForm({ onSubmit, onCancel }: RecurringExpenseFormProps) {
  const { getThemeColor } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
    frequency: 'monthly' as RecurringFrequency,
    dayOfMonth: '1',
    paymentMethod: 'bank-slip' as PaymentMethodType,
    startDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const categories = [
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Entretenimento',
    'Moradia',
    'Vestuário',
    'Outros',
  ];

  const frequencies: { value: RecurringFrequency; label: string }[] = [
    { value: 'monthly', label: 'Mensal' },
    { value: 'yearly', label: 'Anual' },
  ];

  const paymentMethods: { value: PaymentMethodType; label: string }[] = [
    { value: 'bank-slip', label: 'Boleto' },
    { value: 'credit-card', label: 'Cartão de Crédito' },
    { value: 'debit-card', label: 'Cartão de Débito' },
    { value: 'pix', label: 'PIX' },
    { value: 'other', label: 'Outro' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      name: formData.name,
      value: parseFloat(formData.value),
      category: formData.category,
      frequency: formData.frequency,
      dayOfMonth: formData.frequency === 'monthly' ? parseInt(formData.dayOfMonth) : undefined,
      paymentMethod: formData.paymentMethod,
      startDate: formData.startDate,
      isActive: true,
      description: formData.description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Gasto *"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Netflix, Faculdade"
          required
          fullWidth
        />

        <Input
          label="Valor *"
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="0,00"
          required
          fullWidth
        />

        <div className="w-full">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: getThemeColor(colors.background.default),
              color: getThemeColor(colors.text.primary),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Frequência *
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringFrequency })}
            required
            className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: getThemeColor(colors.background.default),
              color: getThemeColor(colors.text.primary),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        {formData.frequency === 'monthly' && (
          <Input
            label="Dia do Vencimento *"
            type="number"
            min="1"
            max="31"
            value={formData.dayOfMonth}
            onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
            placeholder="1-31"
            required
            fullWidth
          />
        )}

        <div className="w-full">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Método de Pagamento
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethodType })}
            className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: getThemeColor(colors.background.default),
              color: getThemeColor(colors.text.primary),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Data de Início *"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
          fullWidth
        />
      </div>

      <div className="w-full">
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Descrição (opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Adicione mais detalhes..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: getThemeColor(colors.background.default),
            color: getThemeColor(colors.text.primary),
            border: `1px solid ${getThemeColor(colors.border.default)}`,
          }}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="neutral" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Adicionar Gasto Recorrente
        </Button>
      </div>
    </form>
  );
}
