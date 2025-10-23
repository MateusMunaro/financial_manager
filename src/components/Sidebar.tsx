'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Gastos', href: '/expenses', icon: CreditCardIcon },
  { name: 'Investimentos', href: '/investments', icon: ChartBarIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
];

export function Sidebar() {
  const { getThemeColor, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isExpanded, setIsExpanded] = useState(true); // Desktop collapse state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{
          backgroundColor: getThemeColor(colors.background.paper),
          color: getThemeColor(colors.text.primary),
        }}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-20'}
          lg:m-4 lg:h-[calc(100vh-2rem)] lg:rounded-3xl
        `}
        style={{
          backgroundColor: getThemeColor(colors.background.glass),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${getThemeColor(colors.border.default)}`,
          boxShadow: getThemeColor(colors.shadow.lg),
        }}
      >
        {/* Logo/Header */}
        <div
          className="p-6 border-b relative"
          style={{
            borderColor: getThemeColor(colors.border.default),
          }}
        >
          {isExpanded ? (
            <>
              <h1
                className="text-2xl font-bold transition-opacity duration-300"
                style={{ color: getThemeColor(colors.brand.primary) }}
              >
                FinanceApp
              </h1>
              <p
                className="text-sm mt-1 transition-opacity duration-300"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                Controle Financeiro
              </p>
            </>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto transition-all duration-300"
              style={{
                backgroundColor: getThemeColor(colors.brand.primary),
                color: '#FFFFFF',
              }}
            >
              F
            </div>
          )}
          
          {/* Toggle button for desktop */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: getThemeColor(colors.brand.primary),
              color: '#FFFFFF',
            }}
          >
            <svg
              className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition-all duration-200 hover:scale-105
                  ${!isExpanded ? 'justify-center' : ''}
                  group relative
                `}
                style={{
                  backgroundColor: active
                    ? getThemeColor(colors.brand.primary)
                    : 'transparent',
                  color: active
                    ? '#FFFFFF'
                    : getThemeColor(colors.text.primary),
                }}
                title={!isExpanded ? item.name : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span className="font-medium">{item.name}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div
                    className="absolute left-full ml-2 px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg"
                    style={{
                      backgroundColor: getThemeColor(colors.background.elevated),
                      color: getThemeColor(colors.text.primary),
                      border: `1px solid ${getThemeColor(colors.border.default)}`,
                    }}
                  >
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section & logout */}
        <div
          className="p-4 border-t"
          style={{
            borderColor: getThemeColor(colors.border.default),
          }}
        >
          {isExpanded ? (
            <>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2"
                style={{
                  backgroundColor: getThemeColor(colors.background.elevated),
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: getThemeColor(colors.brand.primary),
                    color: '#FFFFFF',
                  }}
                >
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: getThemeColor(colors.text.primary) }}
                  >
                    {user?.name || 'Usuário'}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                  >
                    {user?.email || 'usuario@email.com'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: getThemeColor(colors.semantic.negative),
                  color: '#FFFFFF',
                }}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">
                  {isLoggingOut ? 'Saindo...' : 'Sair'}
                </span>
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold mx-auto"
                style={{
                  backgroundColor: getThemeColor(colors.brand.primary),
                  color: '#FFFFFF',
                }}
              >
                {getUserInitials()}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center p-3 rounded-lg w-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: getThemeColor(colors.semantic.negative),
                  color: '#FFFFFF',
                }}
                title={isLoggingOut ? 'Saindo...' : 'Sair'}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
