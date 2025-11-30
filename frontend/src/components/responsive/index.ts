/**
 * Responsive Components Module
 * 
 * Este módulo contém componentes que possuem variantes significativamente
 * diferentes entre mobile e desktop.
 * 
 * IMPORTANTE: Só crie variantes separadas quando a UX for RADICALMENTE diferente.
 * Para ajustes simples de layout, use Tailwind CSS responsivo diretamente.
 * 
 * Estrutura:
 * - mobile/     → Componentes específicos para mobile
 * - desktop/    → Componentes específicos para desktop
 * - shared/     → Componentes adaptativos que funcionam em ambos
 * 
 * Uso recomendado:
 * 
 * ```tsx
 * // Opção 1: Importar componentes mobile específicos
 * import { MobileBottomNav, QuickActionModal } from '@/components/responsive/mobile';
 * 
 * // Opção 2: Importar componentes compartilhados
 * import { MetricCard, TransactionList } from '@/components/responsive/shared';
 * 
 * // Opção 3: Usar hooks de viewport para lógica condicional
 * import { useIsMobile } from '@/components/responsive';
 * const isMobile = useIsMobile();
 * 
 * // Opção 4: Renderização condicional declarativa
 * import { ShowOn, Responsive } from '@/components/responsive';
 * <ShowOn mobile><MobileBottomNav /></ShowOn>
 * ```
 */

// ===== Viewport Context & Utilities =====
export {
  useViewport,
  useIsMobile,
  useIsDesktop,
  useDeviceType,
  ShowOn,
  Responsive,
  ViewportProvider,
  BREAKPOINTS,
} from '@/context/ViewportContext';

export type {
  DeviceType,
  BreakpointKey,
  ViewportContextType,
} from '@/context/ViewportContext';

// ===== Mobile Components =====
export {
  MobileNavItem,
  MobileBottomNav,
  QuickActionModal,
} from './mobile';

export type { NavItem } from './mobile';

// ===== Shared Components =====
export {
  MetricCard,
  ProgressBar,
  TransactionList,
  BudgetCard,
  MobileHeader,
} from './shared';

export type { Transaction, TransactionType } from './shared';

// ===== Desktop Components =====
// Export desktop components here as they are created
// export { DesktopSidebar } from './desktop';

