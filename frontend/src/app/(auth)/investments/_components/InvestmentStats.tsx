'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import type { Investment } from '@/lib/schemas/investment.schema';

interface InvestmentStatsProps {
  investments: Investment[];
}

export function InvestmentStats({ investments }: InvestmentStatsProps) {
  const { getThemeColor } = useTheme();

  const totalInvested = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;
  const profitPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : '0';

  const typeDistribution = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const topType = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Total Investido
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {formatCurrency(totalInvested)}
            </p>
          </div>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: getThemeColor(colors.brand.primary) + '20' }}
          >
            <svg className="w-6 h-6" style={{ color: getThemeColor(colors.brand.primary) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Card>

      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Valor Atual
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {formatCurrency(totalCurrent)}
            </p>
          </div>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: getThemeColor(colors.brand.secondary) + '20' }}
          >
            <svg className="w-6 h-6" style={{ color: getThemeColor(colors.brand.secondary) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </Card>

      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Rentabilidade
            </p>
            <p
              className="text-2xl font-bold"
              style={{ 
                color: totalProfit >= 0 
                  ? getThemeColor(colors.semantic.positive) 
                  : getThemeColor(colors.semantic.negative) 
              }}
            >
              {formatCurrency(totalProfit)}
            </p>
            <p
              className="text-sm font-semibold mt-1"
              style={{ 
                color: totalProfit >= 0 
                  ? getThemeColor(colors.semantic.positive) 
                  : getThemeColor(colors.semantic.negative) 
              }}
            >
              {totalProfit >= 0 ? '+' : ''}{profitPercentage}%
            </p>
          </div>
          <div
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: totalProfit >= 0 
                ? getThemeColor(colors.semantic.positive) + '20' 
                : getThemeColor(colors.semantic.negative) + '20'
            }}
          >
            <svg 
              className="w-6 h-6" 
              style={{ 
                color: totalProfit >= 0 
                  ? getThemeColor(colors.semantic.positive) 
                  : getThemeColor(colors.semantic.negative) 
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={totalProfit >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
            </svg>
          </div>
        </div>
      </Card>

      <Card elevated>
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Maior Posição
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              {topType ? topType[0] : 'N/A'}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              {topType ? formatCurrency(topType[1]) : 'Sem dados'}
            </p>
          </div>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: getThemeColor(colors.brand.accent) + '20' }}
          >
            <svg className="w-6 h-6" style={{ color: getThemeColor(colors.brand.accent) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}
