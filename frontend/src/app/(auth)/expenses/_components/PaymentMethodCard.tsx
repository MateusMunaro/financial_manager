'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  CreditCardIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { PaymentMethod } from './types';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function PaymentMethodCard({ method, onDelete, onSetDefault }: PaymentMethodCardProps) {
  const { getThemeColor } = useTheme();

  const getMethodTypeLabel = () => {
    const labels = {
      'credit-card': 'Crédito',
      'debit-card': 'Débito',
      'pix': 'PIX',
      'bank-slip': 'Boleto',
      'cash': 'Dinheiro',
      'other': 'Outro',
    };
    return labels[method.type] || method.type;
  };

  const limitPercentage = method.limit && method.usedLimit 
    ? (method.usedLimit / method.limit) * 100 
    : 0;

  return (
    <Card elevated className="relative">
      {method.isDefault && (
        <div
          className="absolute top-3 right-3"
          style={{ color: getThemeColor(colors.brand.accent) }}
        >
          <StarIconSolid className="h-5 w-5" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: getThemeColor(colors.brand.primary) + '20' }}
          >
            <CreditCardIcon
              className="h-6 w-6"
              style={{ color: getThemeColor(colors.brand.primary) }}
            />
          </div>

          <div className="flex-1">
            <h4
              className="text-lg font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {method.name}
            </h4>
            <p
              className="text-sm"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {getMethodTypeLabel()}
              {method.lastDigits && ` •••• ${method.lastDigits}`}
            </p>
          </div>
        </div>

        {method.type === 'credit-card' && method.limit && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-medium"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Limite Usado
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                R$ {method.usedLimit?.toFixed(2)} / R$ {method.limit.toFixed(2)}
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: getThemeColor(colors.background.elevated) }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${limitPercentage}%`,
                  backgroundColor: limitPercentage > 80 
                    ? getThemeColor(colors.semantic.negative)
                    : getThemeColor(colors.brand.primary),
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!method.isDefault && (
            <Button
              variant="neutral"
              size="sm"
              onClick={() => onSetDefault(method.id)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <StarIcon className="h-4 w-4" />
              Tornar Padrão
            </Button>
          )}
          <Button
            variant="negative"
            size="sm"
            onClick={() => onDelete(method.id)}
            className="flex items-center justify-center"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
