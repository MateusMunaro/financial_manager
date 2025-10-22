'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

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
          fixed lg:sticky top-0 left-0 h-screen z-40
          w-64 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundColor: getThemeColor(colors.background.paper),
          borderRight: `1px solid ${getThemeColor(colors.border.default)}`,
        }}
      >
        {/* Logo/Header */}
        <div
          className="p-6 border-b"
          style={{
            borderColor: getThemeColor(colors.border.default),
          }}
        >
          <h1
            className="text-2xl font-bold"
            style={{ color: getThemeColor(colors.brand.primary) }}
          >
            FinanceApp
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Controle Financeiro
          </p>
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: active
                    ? getThemeColor(colors.brand.primary)
                    : 'transparent',
                  color: active
                    ? '#FFFFFF'
                    : getThemeColor(colors.text.primary),
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
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
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2"
            style={{
              backgroundColor: getThemeColor(colors.background.elevated),
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              style={{
                backgroundColor: getThemeColor(colors.brand.primary),
                color: '#FFFFFF',
              }}
            >
              U
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: getThemeColor(colors.text.primary) }}
              >
                Usuário
              </p>
              <p
                className="text-xs"
                style={{ color: getThemeColor(colors.text.secondary) }}
              >
                usuario@email.com
              </p>
            </div>
          </div>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: getThemeColor(colors.semantic.negative),
              color: '#FFFFFF',
            }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
