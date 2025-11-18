'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  ArrowPathIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import type { RecurringExpense } from '@/lib/schemas/expense.schema';

interface RecurringExpenseCardProps {
  expense: RecurringExpense;
  onDelete: (id: string) => void | Promise<void>;
  onToggleActive: (id: string) => void | Promise<void>;
}

export function RecurringExpenseCard({ expense, onDelete, onToggleActive }: RecurringExpenseCardProps) {
  const { getThemeColor } = useTheme();

  const getFrequencyLabel = () => {
    const labels = {
      'monthly': 'Mensal',
      'yearly': 'Anual',
      'weekly': 'Semanal',
    };
    return labels[expense.frequency] || expense.frequency;
  };

  const getPaymentMethodLabel = () => {
    const labels = {
      'credit-card': 'Cartão de Crédito',
      'debit-card': 'Cartão de Débito',
      'pix': 'PIX',
      'bank-slip': 'Boleto',
      'cash': 'Dinheiro',
      'other': 'Outro',
    };
    return expense.paymentMethod ? labels[expense.paymentMethod] || expense.paymentMethod : 'Não definido';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div 
      className="relative"
      style={{
        opacity: expense.isActive ? 1 : 0.6,
      }}
    >
      <Card elevated>
        {!expense.isActive && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold"
            style={{
              backgroundColor: getThemeColor(colors.semantic.neutral) + '20',
              color: getThemeColor(colors.semantic.neutral),
            }}
          >
            Inativo
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ 
              backgroundColor: expense.isActive 
                ? getThemeColor(colors.brand.primary) + '20'
                : getThemeColor(colors.semantic.neutral) + '20'
            }}
          >
            <ArrowPathIcon
              className="h-6 w-6"
              style={{ 
                color: expense.isActive 
                  ? getThemeColor(colors.brand.primary)
                  : getThemeColor(colors.semantic.neutral)
              }}
            />
          </div>

          <div className="flex-1">
            <h4
              className="text-lg font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {expense.name}
            </h4>
            <p
              className="text-sm"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {expense.category} • {getFrequencyLabel()}
            </p>
            {expense.description && (
              <p
                className="text-xs mt-1"
                style={{ color: getThemeColor(colors.text.tertiary) }}
              >
                {expense.description}
              </p>
            )}
          </div>

          <div className="text-right">
            <p
              className="text-2xl font-bold"
              style={{ color: getThemeColor(colors.semantic.negative) }}
            >
              {formatCurrency(expense.value)}
            </p>
          </div>
        </div>

        <div
          className="pt-4 border-t space-y-2"
          style={{ borderColor: getThemeColor(colors.border.default) }}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon
              className="h-4 w-4"
              style={{ color: getThemeColor(colors.text.tertiary) }}
            />
            <span
              className="text-xs"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {expense.frequency === 'monthly' && expense.dayOfMonth && `Dia ${expense.dayOfMonth} de cada mês`}
              {expense.frequency === 'yearly' && expense.dayOfMonth && `Dia ${expense.dayOfMonth} de cada ano`}
              {expense.frequency === 'weekly' && expense.dayOfWeek !== undefined && (() => {
                const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                return `Toda ${days[expense.dayOfWeek]}`;
              })()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: getThemeColor(colors.text.tertiary) }}
            >
              {getPaymentMethodLabel()}
            </span>
            <span
              className="text-xs"
              style={{ color: getThemeColor(colors.text.tertiary) }}
            >
              Início: {formatDate(expense.startDate)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant={expense.isActive ? 'neutral' : 'positive'}
            size="sm"
            onClick={() => onToggleActive(expense.id)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {expense.isActive ? (
              <>
                <PauseIcon className="h-4 w-4" />
                Pausar
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" />
                Reativar
              </>
            )}
          </Button>
          <Button
            variant="negative"
            size="sm"
            onClick={() => onDelete(expense.id)}
            className="flex items-center justify-center"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </Card>
    </div>
  );
}
