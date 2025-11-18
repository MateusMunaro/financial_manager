'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import type { PaymentMethod, PaymentMethodType } from './types';

interface PaymentMethodFormProps {
  onSubmit: (method: Omit<PaymentMethod, 'id'>) => void;
  onCancel: () => void;
}

export function PaymentMethodForm({ onSubmit, onCancel }: PaymentMethodFormProps) {
  const { getThemeColor } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    type: '' as PaymentMethodType | '',
    lastDigits: '',
    limit: '',
    isDefault: false,
  });

  const paymentTypes: { value: PaymentMethodType; label: string }[] = [
    { value: 'credit-card', label: 'Cartão de Crédito' },
    { value: 'debit-card', label: 'Cartão de Débito' },
    { value: 'pix', label: 'PIX' },
    { value: 'bank-slip', label: 'Boleto' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'other', label: 'Outro' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      name: formData.name,
      type: formData.type as PaymentMethodType,
      lastDigits: formData.lastDigits || undefined,
      limit: formData.limit ? parseFloat(formData.limit) : undefined,
      usedLimit: 0,
      isDefault: formData.isDefault,
    });
  };

  const showCardFields = formData.type === 'credit-card' || formData.type === 'debit-card';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome *"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Nubank, PIX"
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
            onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethodType })}
            required
            className="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: getThemeColor(colors.background.default),
              color: getThemeColor(colors.text.primary),
              border: `1px solid ${getThemeColor(colors.border.default)}`,
            }}
          >
            <option value="">Selecione um tipo</option>
            {paymentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {showCardFields && (
          <>
            <Input
              label="Últimos 4 dígitos"
              type="text"
              maxLength={4}
              value={formData.lastDigits}
              onChange={(e) => setFormData({ ...formData, lastDigits: e.target.value.replace(/\D/g, '') })}
              placeholder="1234"
              fullWidth
            />

            {formData.type === 'credit-card' && (
              <Input
                label="Limite do Cartão"
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                placeholder="5000.00"
                fullWidth
              />
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="w-4 h-4 rounded"
          style={{
            accentColor: getThemeColor(colors.brand.primary),
          }}
        />
        <label
          htmlFor="isDefault"
          className="text-sm font-medium cursor-pointer"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Definir como método padrão
        </label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="neutral" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Adicionar Método
        </Button>
      </div>
    </form>
  );
}
