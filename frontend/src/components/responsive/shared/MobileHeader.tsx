'use client';

import React from 'react';
import Image from 'next/image';
import { Bell, Eye, EyeOff, Plus } from 'lucide-react';

interface MobileHeaderProps {
  /** Nome do usuário */
  userName?: string;
  /** Subtítulo/descrição */
  subtitle?: string;
  /** Iniciais do avatar */
  avatarInitials?: string;
  /** URL da imagem do avatar */
  avatarUrl?: string;
  /** Estado de visibilidade dos valores */
  hideValues?: boolean;
  /** Callback para toggle de visibilidade */
  onToggleVisibility?: () => void;
  /** Callback para notificações */
  onNotificationsClick?: () => void;
  /** Callback para nova transação (desktop) */
  onNewTransactionClick?: () => void;
  /** Número de notificações não lidas */
  unreadNotifications?: number;
  /** Mostrar botão de nova transação (apenas desktop) */
  showNewTransaction?: boolean;
  /** Classe adicional */
  className?: string;
}

/**
 * Header responsivo para dashboard
 * 
 * Adapta-se automaticamente entre mobile e desktop.
 * No mobile, mostra elementos compactos. No desktop, inclui botão de nova transação.
 * 
 * @example
 * ```tsx
 * <MobileHeader
 *   userName="Gabriel"
 *   subtitle="Aqui está seu resumo financeiro de hoje."
 *   avatarInitials="GA"
 *   hideValues={hideValues}
 *   onToggleVisibility={() => setHideValues(!hideValues)}
 *   onNotificationsClick={() => router.push('/notifications')}
 *   onNewTransactionClick={() => setIsModalOpen(true)}
 *   unreadNotifications={3}
 * />
 * ```
 */
export function MobileHeader({
  userName = 'Usuário',
  subtitle = 'Aqui está seu resumo financeiro de hoje.',
  avatarInitials,
  avatarUrl,
  hideValues = false,
  onToggleVisibility,
  onNotificationsClick,
  onNewTransactionClick,
  unreadNotifications = 0,
  showNewTransaction = true,
  className = '',
}: MobileHeaderProps) {
  // Gera iniciais do nome se não fornecidas
  const initials = avatarInitials || userName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header 
      className={`
        sticky top-0 z-10 
        bg-white/80 dark:bg-[#021024]/80 
        backdrop-blur-md 
        border-b border-[#5483B3]/10 dark:border-[#7DA0CA]/10
        px-4 md:px-8 py-4 
        flex justify-between items-center
        ${className}
      `}
    >
      {/* Saudação */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#021024] dark:text-[#C1E8FF]">
          Olá, {userName} <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-xs md:text-sm text-[#5483B3]/70 dark:text-[#7DA0CA]/70">
          {subtitle}
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Toggle Visibility */}
        {onToggleVisibility && (
          <button 
            onClick={onToggleVisibility}
            className="
              p-2 rounded-lg
              text-[#5483B3]/70 dark:text-[#7DA0CA]/70
              hover:text-[#5483B3] dark:hover:text-[#7DA0CA]
              hover:bg-[#5483B3]/10 dark:hover:bg-[#7DA0CA]/10
              transition-colors
            "
            aria-label={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
          >
            {hideValues ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {/* Notifications */}
        {onNotificationsClick && (
          <button 
            onClick={onNotificationsClick}
            className="
              p-2 rounded-lg relative
              text-[#5483B3]/70 dark:text-[#7DA0CA]/70
              hover:text-[#5483B3] dark:hover:text-[#7DA0CA]
              hover:bg-[#5483B3]/10 dark:hover:bg-[#7DA0CA]/10
              transition-colors
            "
            aria-label={`Notificações${unreadNotifications > 0 ? ` (${unreadNotifications} não lidas)` : ''}`}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="
                absolute top-1.5 right-1.5 
                w-2 h-2 
                bg-[#dc3545] 
                rounded-full 
                border-2 border-white dark:border-[#021024]
              " />
            )}
          </button>
        )}

        {/* New Transaction Button (Desktop only) */}
        {showNewTransaction && onNewTransactionClick && (
          <button 
            onClick={onNewTransactionClick}
            className="
              hidden md:flex items-center gap-2 
              bg-[#5483B3] dark:bg-[#7DA0CA]
              hover:bg-[#052659] dark:hover:bg-[#C1E8FF]
              text-white dark:text-[#021024]
              px-4 py-2 rounded-lg font-medium 
              shadow-lg shadow-[#5483B3]/20 dark:shadow-[#7DA0CA]/20
              transition-all duration-200
              hover:translate-y-[-1px]
              active:translate-y-0
            "
          >
            <Plus size={18} />
            <span>Nova Transação</span>
          </button>
        )}

        {/* Avatar */}
        <div 
          className="
            w-8 h-8 md:w-10 md:h-10 
            rounded-full 
            bg-[#5483B3]/10 dark:bg-[#7DA0CA]/10
            border border-[#5483B3]/20 dark:border-[#7DA0CA]/20
            flex items-center justify-center 
            text-sm font-bold 
            text-[#5483B3] dark:text-[#7DA0CA]
            overflow-hidden
            relative
          "
        >
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={userName} 
              fill
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;
