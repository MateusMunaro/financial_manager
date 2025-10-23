'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import type { CreateInvestmentInput, InvestmentType } from '@/lib/schemas/investment.schema';

interface InvestmentFormProps {
  onSubmit: (investment: CreateInvestmentInput) => void;
  onCancel: () => void;
}

export function InvestmentForm({ onSubmit, onCancel }: InvestmentFormProps) {
  const { getThemeColor } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    type: '' as InvestmentType | '',
    value: '',
    currentValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: '',
    ticker: '',
    description: '',
  });

  const types: InvestmentType[] = [
    'Ações',
    'FII',
    'ETF',
    'Renda Fixa',
    'Criptomoedas',
    'Fundos',
    'Outros',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value || !formData.currentValue || !formData.type) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      name: formData.name,
      type: formData.type as InvestmentType,
      value: parseFloat(formData.value),
      currentValue: parseFloat(formData.currentValue),
      purchaseDate: formData.purchaseDate,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      ticker: formData.ticker || undefined,
      description: formData.description || undefined,
    });

    setFormData({
      name: '',
      type: '',
      value: '',
      currentValue: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity: '',
      ticker: '',
      description: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Investimento *"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: ITUB4"
          required
          fullWidth
        />

        <div className="w-full">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Tipo *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: getThemeColor(colors.background.default),
              color: getThemeColor(colors.text.primary),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            <option value="">Selecione um tipo</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Valor Investido *"
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="0,00"
          required
          fullWidth
        />

        <Input
          label="Valor Atual *"
          type="number"
          step="0.01"
          value={formData.currentValue}
          onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
          placeholder="0,00"
          required
          fullWidth
        />

        <Input
          label="Data da Compra *"
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          required
          fullWidth
        />

        <Input
          label="Quantidade (opcional)"
          type="number"
          step="0.01"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="Número de cotas/ações"
          fullWidth
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="neutral" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="positive">
          Adicionar Investimento
        </Button>
      </div>
    </form>
  );
}
