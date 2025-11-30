'use client';

import React from 'react';
import { LucideIcon, Target } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface BudgetCardProps {
  /** Valor atual gasto */
  current: number;
  /** Limite do orçamento */
  limit: number;
  /** Título do card */
  title?: string;
  /** Label da barra de progresso */
  progressLabel?: string;
  /** Ícone do card */
  icon?: LucideIcon;
  /** Classe adicional */
  className?: string;
  /** Callback ao clicar */
  onClick?: () => void;
}

/**
 * Card de orçamento com barra de progresso
 * 
 * Exibe o progresso do orçamento mensal com indicadores visuais
 * de alerta baseados na porcentagem utilizada.
 * 
 * @example
 * ```tsx
 * <BudgetCard
 *   current={3840}
 *   limit={5000}
 *   title="Orçamento Mensal"
 *   progressLabel="Gasto vs Limite"
 * />
 * ```
 */
export function BudgetCard({
  current,
  limit,
  title = 'Orçamento Mensal',
  progressLabel = 'Gasto vs Limite',
  icon: Icon = Target,
  className = '',
  onClick,
}: BudgetCardProps) {
  const Component = onClick ? 'button' : 'div';
  const percentage = Math.min((current / limit) * 100, 100);
  
  // Determina o status baseado na porcentagem
  const getStatusLabel = () => {
    if (percentage > 90) return 'Crítico';
    if (percentage > 70) return 'Atenção';
    return 'Meta';
  };

  const getStatusColor = () => {
    if (percentage > 90) return 'text-[#dc3545] bg-[#dc3545]/10';
    if (percentage > 70) return 'text-[#ffc107] bg-[#ffc107]/10';
    return 'text-[#5483B3] dark:text-[#7DA0CA] bg-[#5483B3]/10 dark:bg-[#7DA0CA]/10';
  };

  return (
    <Component
      onClick={onClick}
      className={`
        w-full text-left
        bg-gradient-to-br from-white/90 to-white/70
        dark:from-[#052659]/60 dark:to-[#021024]/40
        backdrop-blur-sm
        p-5 rounded-2xl 
        border border-[#5483B3]/20 dark:border-[#7DA0CA]/20
        ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg bg-[#5483B3]/10 dark:bg-[#7DA0CA]/10 text-[#5483B3] dark:text-[#7DA0CA]">
          <Icon size={20} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-[#5483B3]/80 dark:text-[#7DA0CA]/80 text-sm font-medium">
        {title}
      </h3>

      {/* Progress Bar */}
      <div className="mt-4">
        <ProgressBar
          current={current}
          max={limit}
          label={progressLabel}
          variant="auto"
        />
      </div>
    </Component>
  );
}

export default BudgetCard;
