import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { ViewportProvider } from '@/context/ViewportContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gerenciador Financeiro',
  description: 'Sistema de gerenciamento financeiro pessoal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="gerenciador-financeiro-theme">
          <ViewportProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ViewportProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
