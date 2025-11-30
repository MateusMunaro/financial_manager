'use client';

/**
 * Exemplo de uso dos componentes responsivos
 * 
 * Este arquivo demonstra como utilizar os componentes mobile
 * criados para o dashboard. NÃO é um componente de produção,
 * apenas documentação de uso.
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Settings, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Target,
} from 'lucide-react';

// Importação dos componentes responsivos
import {
  // Viewport hooks
  useIsMobile,
  useViewport,
  ShowOn,
  
  // Mobile components
  MobileBottomNav,
  QuickActionModal,
  
  // Shared components  
  MobileHeader,
  MetricCard,
  BudgetCard,
  TransactionList,
  
  // Types
  type NavItem,
  type Transaction,
} from '@/components/responsive';

// Configuração da navegação mobile
const navigationItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
  { id: 'wallet', icon: Wallet, label: 'Carteira' },
  { id: 'reports', icon: PieChart, label: 'Relatórios' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
];

// Mock de transações
const mockTransactions: Transaction[] = [
  { id: 1, title: 'Supermercado Silva', category: 'Alimentação', amount: -450.00, date: 'Hoje, 10:30', type: 'expense' },
  { id: 2, title: 'Freelance Projeto X', category: 'Renda Extra', amount: 2500.00, date: 'Ontem', type: 'income' },
  { id: 3, title: 'Netflix', category: 'Assinaturas', amount: -55.90, date: '28 Nov', type: 'expense' },
  { id: 4, title: 'Uber', category: 'Transporte', amount: -24.50, date: '28 Nov', type: 'expense' },
];

export default function ResponsiveExample() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hideValues, setHideValues] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Hook de viewport para lógica condicional
  const { isMobile, deviceType, breakpoint } = useViewport();

  return (
    <div className="min-h-screen bg-[#F0F8FF] dark:bg-[#021024]">
      {/* Header responsivo */}
      <MobileHeader
        userName="Gabriel"
        subtitle="Aqui está seu resumo financeiro de hoje."
        avatarInitials="GA"
        hideValues={hideValues}
        onToggleVisibility={() => setHideValues(!hideValues)}
        onNotificationsClick={() => console.log('Notificações')}
        onNewTransactionClick={() => setIsModalOpen(true)}
        unreadNotifications={3}
      />

      {/* Main Content */}
      <main className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
        
        {/* Debug info (remover em produção) */}
        <div className="text-xs text-[#5483B3]/50 dark:text-[#7DA0CA]/50">
          Device: {deviceType} | Breakpoint: {breakpoint} | Mobile: {isMobile ? 'Sim' : 'Não'}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Saldo Total" 
            value="R$ 12.450,00" 
            trend="up" 
            trendValue="+12%" 
            icon={Wallet} 
            iconColor="primary"
            isHidden={hideValues}
          />
          <MetricCard 
            title="Receitas (Mês)" 
            value="R$ 8.200,00" 
            trend="up" 
            trendValue="+4.5%" 
            icon={TrendingUp} 
            iconColor="positive"
            isHidden={hideValues}
          />
          <MetricCard 
            title="Despesas (Mês)" 
            value="R$ 3.840,00" 
            trend="down" 
            trendValue="-2.1%" 
            icon={TrendingDown} 
            iconColor="negative"
            isHidden={hideValues}
          />
          <BudgetCard
            current={3840}
            limit={5000}
            title="Orçamento Mensal"
            progressLabel="Gasto vs Limite"
            icon={Target}
          />
        </div>

        {/* Transactions List */}
        <TransactionList
          transactions={mockTransactions}
          hideValues={hideValues}
          onTransactionClick={(tx) => console.log('Clicked:', tx)}
          onViewAllClick={() => console.log('Ver todas')}
        />
      </main>

      {/* Mobile Bottom Navigation - só aparece em mobile */}
      <ShowOn mobile tablet>
        <MobileBottomNav
          items={navigationItems}
          activeId={activeTab}
          onItemClick={setActiveTab}
          onFabClick={() => setIsModalOpen(true)}
          showFab
        />
      </ShowOn>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIncomeClick={() => console.log('Nova receita')}
        onExpenseClick={() => console.log('Nova despesa')}
        onImageRecognitionClick={() => console.log('Reconhecimento de imagem')}
      />
    </div>
  );
}
