'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, CreditCard } from 'lucide-react';

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string | number;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
  icon?: LucideIcon;
}

interface TransactionListProps {
  /** Lista de transações */
  transactions: Transaction[];
  /** Ocultar valores */
  hideValues?: boolean;
  /** Callback ao clicar em uma transação */
  onTransactionClick?: (transaction: Transaction) => void;
  /** Callback para ver todas */
  onViewAllClick?: () => void;
  /** Título da seção */
  title?: string;
  /** Mostrar botão "Ver todas" */
  showViewAll?: boolean;
  /** Número máximo de transações a exibir */
  maxItems?: number;
  /** Classe adicional */
  className?: string;
}

interface TransactionItemProps {
  transaction: Transaction;
  hideValues?: boolean;
  onClick?: () => void;
}

/**
 * Item individual de transação
 */
function TransactionItem({ transaction, hideValues, onClick }: TransactionItemProps) {
  const { title, category, amount, date, type, icon } = transaction;
  const Icon = icon || (type === 'income' ? ArrowUpRight : CreditCard);
  
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(amount));

  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-between w-full p-3 
        hover:bg-[#5483B3]/5 dark:hover:bg-[#7DA0CA]/10
        rounded-xl transition-colors cursor-pointer group
        text-left
      "
    >
      <div className="flex items-center gap-4">
        {/* Ícone */}
        <div 
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${type === 'income' 
              ? 'bg-[#28a745]/10 text-[#28a745]' 
              : 'bg-[#dc3545]/10 text-[#dc3545]'
            }
          `}
        >
          <Icon size={20} />
        </div>
        
        {/* Info */}
        <div>
          <p className="
            font-medium text-[#021024] dark:text-[#C1E8FF]
            group-hover:text-[#5483B3] dark:group-hover:text-[#7DA0CA]
            transition-colors
          ">
            {title}
          </p>
          <p className="text-xs text-[#5483B3]/60 dark:text-[#7DA0CA]/60">
            {category} • {date}
          </p>
        </div>
      </div>

      {/* Valor */}
      <span 
        className={`
          font-bold
          ${type === 'income' 
            ? 'text-[#28a745]' 
            : 'text-[#021024] dark:text-[#C1E8FF]'
          }
        `}
      >
        {type === 'income' ? '+' : ''} {hideValues ? '••••' : formattedAmount}
      </span>
    </button>
  );
}

/**
 * Lista de transações recentes
 * 
 * @example
 * ```tsx
 * <TransactionList
 *   transactions={recentTransactions}
 *   hideValues={hideValues}
 *   onTransactionClick={(tx) => router.push(`/expenses/${tx.id}`)}
 *   onViewAllClick={() => router.push('/expenses')}
 * />
 * ```
 */
export function TransactionList({
  transactions,
  hideValues = false,
  onTransactionClick,
  onViewAllClick,
  title = 'Últimas Transações',
  showViewAll = true,
  maxItems = 5,
  className = '',
}: TransactionListProps) {
  const displayedTransactions = transactions.slice(0, maxItems);

  return (
    <div 
      className={`
        bg-white/80 dark:bg-[#052659]/50
        backdrop-blur-sm
        rounded-2xl 
        border border-[#5483B3]/20 dark:border-[#7DA0CA]/20
        p-6
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#021024] dark:text-[#C1E8FF]">
          {title}
        </h2>
        {showViewAll && onViewAllClick && (
          <button 
            onClick={onViewAllClick}
            className="
              text-[#5483B3] dark:text-[#7DA0CA] 
              text-sm font-medium 
              hover:text-[#052659] dark:hover:text-[#C1E8FF]
              transition-colors
            "
          >
            Ver todas
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {displayedTransactions.length === 0 ? (
          <p className="text-center text-[#5483B3]/60 dark:text-[#7DA0CA]/60 py-8">
            Nenhuma transação encontrada
          </p>
        ) : (
          displayedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              hideValues={hideValues}
              onClick={() => onTransactionClick?.(transaction)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;
export type { Transaction, TransactionType };
