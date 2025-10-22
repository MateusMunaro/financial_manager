'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import type { Expense } from '../page';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  defaultDate?: string;
}

export function ExpenseForm({ onSubmit, onCancel, defaultDate }: ExpenseFormProps) {
  const { getThemeColor } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
    date: defaultDate || new Date().toISOString().split('T')[0],
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
      date: formData.date,
      description: formData.description,
    });

    setFormData({
      name: '',
      value: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
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
          placeholder="Ex: Supermercado"
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

        <Input
          label="Data *"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
          Adicionar Gasto
        </Button>
      </div>
    </form>
  );
}
