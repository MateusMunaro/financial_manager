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
import { useInvestments } from '@/hooks/api/useInvestments';
import type { CreateInvestmentInput } from '@/lib/schemas/investment.schema';

export default function InvestmentsPage() {
  const { getThemeColor } = useTheme();
  const [showForm, setShowForm] = useState(false);
  
  // Fetch investments from API
  const { 
    investments, 
    loading, 
    createInvestment, 
    deleteInvestment 
  } = useInvestments();

  const handleAddInvestment = async (investmentData: CreateInvestmentInput) => {
    const success = await createInvestment(investmentData);
    if (success) {
      setShowForm(false);
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    await deleteInvestment(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: getThemeColor(colors.brand.primary) }}
          />
          <p style={{ color: getThemeColor(colors.text.secondary) }}>
            Carregando investimentos...
          </p>
        </div>
      </div>
    );
  }

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
