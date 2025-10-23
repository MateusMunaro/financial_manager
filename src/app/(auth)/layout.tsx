'use client';

import { Sidebar } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const { getThemeColor } = useTheme();

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <Sidebar />
        <main
          className="min-h-screen transition-all duration-300"
          style={{
            backgroundColor: getThemeColor(colors.background.default),
            paddingLeft: '0', // Mobile: sem padding
          }}
        >
          {/* Desktop: espaço reservado para sidebar colapsada (80px + 32px de margem) */}
          <div 
            className="lg:pl-28"
            style={{
              minHeight: '100vh',
            }}
          >
            <div className="container mx-auto p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
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
