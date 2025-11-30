'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useViewport } from '@/context/ViewportContext';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings,
  TrendingUp,
} from 'lucide-react';
import { 
  MobileBottomNav, 
  QuickActionModal,
  type NavItem 
} from '@/components/responsive';

// Navegação mobile - centralizada aqui
const mobileNavItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
  { id: 'expenses', icon: Wallet, label: 'Despesas' },
  { id: 'investments', icon: TrendingUp, label: 'Investir' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
];

// Mapeamento de rotas
const routeMap: Record<string, string> = {
  'dashboard': '/dashboard',
  'expenses': '/expenses',
  'investments': '/investments',
  'reports': '/expenses/overview',
  'settings': '/settings',
};

// Mapeamento inverso para detectar a tab ativa
const getActiveTabFromPath = (pathname: string): string => {
  if (pathname.includes('/dashboard')) return 'dashboard';
  if (pathname.includes('/expenses')) return 'expenses';
  if (pathname.includes('/investments')) return 'investments';
  if (pathname.includes('/settings')) return 'settings';
  return 'dashboard';
};

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const { getThemeColor } = useTheme();
  const { isMobile } = useViewport();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeTab = getActiveTabFromPath(pathname);

  const handleNavClick = (id: string) => {
    const route = routeMap[id];
    if (route) {
      router.push(route);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        {/* Sidebar - apenas desktop */}
        {!isMobile && <Sidebar />}
        
        <main
          className="min-h-screen transition-all duration-300"
          style={{
            backgroundColor: getThemeColor(colors.background.default),
            paddingLeft: '0',
          }}
        >
          {/* Desktop: espaço reservado para sidebar colapsada */}
          <div 
            className={isMobile ? '' : 'lg:pl-28'}
            style={{
              minHeight: '100vh',
            }}
          >
            <div className={`container mx-auto ${isMobile ? 'p-0' : 'p-6 lg:p-8'}`}>
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <MobileBottomNav
            items={mobileNavItems}
            activeId={activeTab}
            onItemClick={handleNavClick}
            onFabClick={() => setIsModalOpen(true)}
            showFab
          />
        )}

        {/* Quick Action Modal - Global para mobile */}
        {isMobile && (
          <QuickActionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onIncomeClick={() => {
              setIsModalOpen(false);
              router.push('/expenses?type=income');
            }}
            onExpenseClick={() => {
              setIsModalOpen(false);
              router.push('/expenses?type=expense');
            }}
            onImageRecognitionClick={() => {
              setIsModalOpen(false);
              console.log('Reconhecimento de imagem');
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayoutContent>{children}</AuthLayoutContent>;
}
