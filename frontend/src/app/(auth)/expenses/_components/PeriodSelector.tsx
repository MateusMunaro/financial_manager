'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Button } from '@/components/Button';
import type { Period } from './types';

interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

export function PeriodSelector({ period, onPeriodChange }: PeriodSelectorProps) {
  const { getThemeColor } = useTheme();

  const periods: { value: Period; label: string }[] = [
    { value: 'day', label: 'Dia' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'year', label: 'Ano' },
  ];

  return (
    <div
      className="flex gap-2 p-2 rounded-xl inline-flex"
      style={{
        backgroundColor: getThemeColor(colors.background.paper),
        border: `1px solid ${getThemeColor(colors.border.default)}`,
      }}
    >
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onPeriodChange(p.value)}
          className="px-4 py-2 rounded-lg transition-all duration-200 font-medium"
          style={{
            backgroundColor: period === p.value 
              ? getThemeColor(colors.brand.primary)
              : 'transparent',
            color: period === p.value 
              ? '#FFFFFF'
              : getThemeColor(colors.text.secondary),
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
