'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MobileNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isFab?: boolean;
  fabIcon?: LucideIcon;
}

/**
 * Item de navegação para o MobileBottomNav
 * 
 * @example
 * ```tsx
 * <MobileNavItem 
 *   icon={LayoutDashboard} 
 *   label="Início" 
 *   active={activeTab === 'dashboard'} 
 *   onClick={() => setActiveTab('dashboard')} 
 * />
 * ```
 */
export function MobileNavItem({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  isFab = false,
  fabIcon: FabIcon,
}: MobileNavItemProps) {
  // FAB (Floating Action Button) central
  if (isFab) {
    const IconComponent = FabIcon || Icon;
    return (
      <div className="relative -top-6">
        <button 
          onClick={onClick}
          className="
            bg-[#5483B3] p-4 rounded-full text-white 
            shadow-lg shadow-[#5483B3]/40 
            hover:scale-105 hover:bg-[#7DA0CA]
            active:scale-95
            transition-all duration-200
            border-4 border-[#021024]
            dark:bg-[#7DA0CA] dark:border-[#021024]
            dark:shadow-[#7DA0CA]/40
            dark:hover:bg-[#C1E8FF] dark:hover:text-[#021024]
          "
          aria-label={label || 'Ação rápida'}
        >
          <IconComponent size={28} strokeWidth={3} />
        </button>
      </div>
    );
  }

  // Item de navegação padrão
  return (
    <button 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center w-full py-2 gap-1
        transition-colors duration-200
        ${active 
          ? 'text-[#5483B3] dark:text-[#7DA0CA]' 
          : 'text-[#5483B3]/50 dark:text-[#7DA0CA]/50 hover:text-[#5483B3]/80 dark:hover:text-[#7DA0CA]/80'
        }
      `}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default MobileNavItem;
