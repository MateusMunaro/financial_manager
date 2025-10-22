'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useState } from 'react';
import { InvestmentForm } from './_components/InvestmentForm';
import { InvestmentList } from './_components/InvestmentList';
import { InvestmentStats } from './_components/InvestmentStats';
import { PlusIcon } from '@heroicons/react/24/outline';

export interface Investment {
  id: string;
  name: string;
  type: string;
  value: number;
  purchaseDate: string;
  currentValue: number;
  quantity?: number;
}

export default function InvestmentsPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Tesouro Selic 2029',
      type: 'Renda Fixa',
      value: 10000,
      currentValue: 10850,
      purchaseDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'ITUB4',
      type: 'Ações',
      value: 5000,
      currentValue: 6200,
      purchaseDate: '2024-03-10',
      quantity: 200,
    },
    {
      id: '3',
      name: 'HASH11',
      type: 'FII',
      value: 8000,
      currentValue: 8640,
      purchaseDate: '2024-05-20',
      quantity: 80,
    },
    {
      id: '4',
      name: 'BOVA11',
      type: 'ETF',
      value: 15000,
      currentValue: 17250,
      purchaseDate: '2024-02-01',
      quantity: 150,
    },
  ]);

  const handleAddInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
    };
    setInvestments([newInvestment, ...investments]);
    setShowForm(false);
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
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
            Investimentos
          </h1>
          <p
            className="text-lg"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Gerencie sua carteira de investimentos
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Investimento
        </Button>
      </div>

      {/* Stats */}
      <InvestmentStats investments={investments} />

      {/* Modal Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Adicionar Novo Investimento"
        size="lg"
      >
        <InvestmentForm
          onSubmit={handleAddInvestment}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* List */}
      <InvestmentList
        investments={investments}
        onDelete={handleDeleteInvestment}
      />
    </div>
  );
}
