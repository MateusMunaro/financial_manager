'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const { getThemeColor } = useTheme();

  useEffect(() => {
    console.log('🔒 ProtectedRoute - Estado:', { isAuthenticated, loading });
    if (!loading && !isAuthenticated) {
      console.log('❌ Não autenticado, redirecionando para login...');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: getThemeColor(colors.brand.primary) }}
          />
          <p style={{ color: getThemeColor(colors.text.secondary) }}>
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
