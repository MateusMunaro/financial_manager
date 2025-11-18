'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { PaymentMethodForm } from '../_components/PaymentMethodForm';
import { PaymentMethodCard } from '../_components/PaymentMethodCard';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { PaymentMethod } from '../_components/types';

export default function PaymentMethodsPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Nubank',
      type: 'credit-card',
      lastDigits: '4321',
      isDefault: true,
      limit: 5000,
      usedLimit: 1250.50,
    },
    {
      id: '2',
      name: 'Banco Inter',
      type: 'debit-card',
      lastDigits: '8765',
      isDefault: false,
    },
    {
      id: '3',
      name: 'PIX',
      type: 'pix',
      isDefault: false,
    },
  ]);

  const handleAddPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowForm(false);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const creditCards = paymentMethods.filter(m => m.type === 'credit-card');
  const debitCards = paymentMethods.filter(m => m.type === 'debit-card');
  const others = paymentMethods.filter(m => m.type !== 'credit-card' && m.type !== 'debit-card');

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
              Métodos de Pagamento
            </h1>
            <p
              className="text-lg"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Gerencie seus cartões e formas de pagamento
            </p>
          </div>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Método
        </Button>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Adicionar Método de Pagamento"
        size="lg"
      >
        <PaymentMethodForm
          onSubmit={handleAddPaymentMethod}
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
            Total de Métodos
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            {paymentMethods.length}
          </p>
        </Card>

        <Card elevated>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Limite Total
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: getThemeColor(colors.semantic.positive) }}
          >
            R$ {creditCards.reduce((sum, card) => sum + (card.limit || 0), 0).toFixed(2)}
          </p>
        </Card>

        <Card elevated>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Limite Usado
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: getThemeColor(colors.semantic.negative) }}
          >
            R$ {creditCards.reduce((sum, card) => sum + (card.usedLimit || 0), 0).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Credit Cards Section */}
      {creditCards.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Cartões de Crédito
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditCards.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onDelete={handleDeletePaymentMethod}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        </div>
      )}

      {/* Debit Cards Section */}
      {debitCards.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Cartões de Débito
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debitCards.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onDelete={handleDeletePaymentMethod}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Methods Section */}
      {others.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Outros Métodos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onDelete={handleDeletePaymentMethod}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <Card elevated>
          <div className="text-center py-12">
            <p
              className="text-lg mb-4"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Nenhum método de pagamento cadastrado ainda.
            </p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Adicionar Primeiro Método
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
