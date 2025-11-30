'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type TrendDirection = 'up' | 'down' | 'neutral';

interface MetricCardProps {
  /** Título do card */
  title: string;
  /** Valor a ser exibido */
  value: string;
  /** Direção da tendência */
  trend?: TrendDirection;
  /** Valor da tendência (ex: "+12%") */
  trendValue?: string;
  /** Ícone do card */
  icon: LucideIcon;
  /** Cor do ícone - use cores semânticas */
  iconColor?: 'primary' | 'positive' | 'negative' | 'warning' | 'info';
  /** Ocultar o valor (mostra ••••••) */
  isHidden?: boolean;
  /** Callback ao clicar no card */
  onClick?: () => void;
  /** Classe adicional */
  className?: string;
}

const iconColorClasses = {
  primary: 'bg-[#5483B3]/10 text-[#5483B3] dark:bg-[#7DA0CA]/10 dark:text-[#7DA0CA]',
  positive: 'bg-[#28a745]/10 text-[#28a745]',
  negative: 'bg-[#dc3545]/10 text-[#dc3545]',
  warning: 'bg-[#ffc107]/10 text-[#ffc107]',
  info: 'bg-[#17a2b8]/10 text-[#17a2b8]',
};

const trendClasses = {
  up: 'text-[#28a745] bg-[#28a745]/10',
  down: 'text-[#dc3545] bg-[#dc3545]/10',
  neutral: 'text-[#5483B3] bg-[#5483B3]/10 dark:text-[#7DA0CA] dark:bg-[#7DA0CA]/10',
};

/**
 * Card de métrica para dashboard
 * 
 * Exibe uma métrica com ícone, tendência e valor formatado.
 * Suporta ocultação de valor para privacidade.
 * 
 * @example
 * ```tsx
 * <MetricCard 
 *   title="Saldo Total" 
 *   value="R$ 12.450,00" 
 *   trend="up" 
 *   trendValue="+12%" 
 *   icon={Wallet} 
 *   iconColor="primary"
 *   isHidden={hideValues}
 * />
 * ```
 */
export function MetricCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  iconColor = 'primary',
  isHidden = false,
  onClick,
  className = '',
}: MetricCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        w-full text-left
        bg-white/80 dark:bg-[#052659]/50
        backdrop-blur-sm 
        p-5 rounded-2xl 
        border border-[#5483B3]/20 dark:border-[#7DA0CA]/20
        hover:border-[#5483B3]/40 dark:hover:border-[#7DA0CA]/40
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {/* Header com ícone e tendência */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${iconColorClasses[iconColor]}`}>
          <Icon size={22} />
        </div>
        
        {trend && trendValue && (
          <span 
            className={`
              flex items-center text-xs font-semibold 
              px-2 py-1 rounded-full
              ${trendClasses[trend]}
            `}
          >
            {trend === 'up' && <ArrowUpRight size={14} className="mr-1" />}
            {trend === 'down' && <ArrowDownRight size={14} className="mr-1" />}
            {trendValue}
          </span>
        )}
      </div>

      {/* Título */}
      <h3 className="text-[#5483B3] dark:text-[#7DA0CA] text-sm font-medium mb-1">
        {title}
      </h3>

      {/* Valor */}
      <p className="text-2xl font-bold text-[#021024] dark:text-[#C1E8FF] tracking-tight">
        {isHidden ? '••••••' : value}
      </p>
    </Component>
  );
}

export default MetricCard;
