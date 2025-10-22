'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { Sidebar } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const { getThemeColor } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{
          backgroundColor: getThemeColor(colors.background.default),
        }}
      >
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </ThemeProvider>
  );
}
