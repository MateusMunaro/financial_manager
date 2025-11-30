'use client';

import React, { ReactNode } from 'react';
import { Plus, LucideIcon } from 'lucide-react';
import { MobileNavItem } from './MobileNavItem';

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface MobileBottomNavProps {
  /** Items de navegação (máximo 4 recomendado, excluindo FAB) */
  items: NavItem[];
  /** ID do item ativo */
  activeId: string;
  /** Callback quando um item é clicado */
  onItemClick: (id: string) => void;
  /** Callback quando o FAB é clicado */
  onFabClick?: () => void;
  /** Mostrar FAB central */
  showFab?: boolean;
  /** Ícone customizado para o FAB */
  fabIcon?: LucideIcon;
  /** Label para acessibilidade do FAB */
  fabLabel?: string;
  /** Classe adicional para o container */
  className?: string;
  /** Conteúdo customizado no lugar do FAB */
  customFab?: ReactNode;
}

/**
 * Navegação inferior para dispositivos móveis com FAB central opcional
 * 
 * Segue o padrão de design Oceanic Depth com suporte a tema claro/escuro.
 * 
 * @example
 * ```tsx
 * const navItems = [
 *   { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
 *   { id: 'wallet', icon: Wallet, label: 'Carteira' },
 *   { id: 'reports', icon: PieChart, label: 'Relatórios' },
 *   { id: 'settings', icon: Settings, label: 'Ajustes' },
 * ];
 * 
 * <MobileBottomNav
 *   items={navItems}
 *   activeId={activeTab}
 *   onItemClick={setActiveTab}
 *   onFabClick={() => setIsModalOpen(true)}
 *   showFab
 * />
 * ```
 */
export function MobileBottomNav({
  items,
  activeId,
  onItemClick,
  onFabClick,
  showFab = true,
  fabIcon = Plus,
  fabLabel = 'Nova transação',
  className = '',
  customFab,
}: MobileBottomNavProps) {
  // Divide os items em duas metades para colocar o FAB no meio
  const midPoint = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midPoint);
  const rightItems = items.slice(midPoint);

  return (
    <div 
      className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white/95 dark:bg-[#052659]/95
        backdrop-blur-md
        border-t border-[#5483B3]/20 dark:border-[#7DA0CA]/20
        pb-safe
        ${className}
      `}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex justify-around items-end px-4 pb-4 pt-2">
        {/* Items da esquerda */}
        {leftItems.map((item) => (
          <MobileNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeId === item.id}
            onClick={() => onItemClick(item.id)}
          />
        ))}

        {/* FAB Central */}
        {showFab && (
          customFab || (
            <MobileNavItem
              icon={fabIcon}
              label={fabLabel}
              isFab
              onClick={onFabClick}
            />
          )
        )}

        {/* Items da direita */}
        {rightItems.map((item) => (
          <MobileNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeId === item.id}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MobileBottomNav;
