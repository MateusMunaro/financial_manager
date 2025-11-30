'use client';

import React from 'react';

type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  /** Valor atual */
  current: number;
  /** Valor máximo */
  max: number;
  /** Label descritivo */
  label?: string;
  /** Mostrar porcentagem */
  showPercentage?: boolean;
  /** Variante de cor (auto calcula baseado na porcentagem se não definido) */
  variant?: ProgressVariant | 'auto';
  /** Tamanho da barra */
  size?: 'sm' | 'md' | 'lg';
  /** Classe adicional */
  className?: string;
  /** Formato customizado para o valor */
  formatValue?: (current: number, max: number) => string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'bg-[#5483B3] dark:bg-[#7DA0CA]',
  success: 'bg-[#28a745]',
  warning: 'bg-[#ffc107]',
  danger: 'bg-[#dc3545]',
};

/**
 * Determina a variante baseada na porcentagem
 */
function getAutoVariant(percentage: number): ProgressVariant {
  if (percentage > 90) return 'danger';
  if (percentage > 70) return 'warning';
  return 'default';
}

/**
 * Barra de progresso com suporte a temas e variantes automáticas
 * 
 * @example
 * ```tsx
 * // Variante automática baseada na porcentagem
 * <ProgressBar current={3840} max={5000} label="Gasto vs Limite" />
 * 
 * // Variante fixa
 * <ProgressBar current={75} max={100} variant="success" />
 * 
 * // Com formato customizado
 * <ProgressBar 
 *   current={3840} 
 *   max={5000} 
 *   formatValue={(c, m) => `R$ ${c} de R$ ${m}`}
 * />
 * ```
 */
export function ProgressBar({
  current,
  max,
  label,
  showPercentage = true,
  variant = 'auto',
  size = 'md',
  className = '',
  formatValue,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const resolvedVariant = variant === 'auto' ? getAutoVariant(percentage) : variant;

  return (
    <div className={`w-full ${className}`}>
      {/* Header com label e porcentagem/valor */}
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs mb-1.5">
          {label && (
            <span className="text-[#052659] dark:text-[#C1E8FF] font-medium">
              {label}
            </span>
          )}
          <span className="text-[#5483B3]/70 dark:text-[#7DA0CA]/70">
            {formatValue 
              ? formatValue(current, max)
              : `${percentage.toFixed(0)}%`
            }
          </span>
        </div>
      )}
      
      {/* Barra de progresso */}
      <div 
        className={`
          w-full rounded-full overflow-hidden
          bg-[#5483B3]/20 dark:bg-[#7DA0CA]/20
          ${sizeClasses[size]}
        `}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div 
          className={`
            h-full rounded-full 
            transition-all duration-500 ease-out
            ${variantClasses[resolvedVariant]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
