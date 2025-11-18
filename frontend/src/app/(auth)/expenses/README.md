# Estrutura de Gastos - Gerenciador Financeiro

## 📋 Visão Geral

A seção de gastos foi reorganizada em sub-páginas especializadas para melhor organização e responsividade. Cada funcionalidade tem sua própria página dedicada.

## 🗂️ Estrutura de Páginas

### 1. **Página Principal** (`/expenses`)
- **Função**: Hub de navegação central
- **Características**:
  - Cards navegáveis para cada sub-página
  - Estatísticas rápidas (Total do Mês, Gastos Recorrentes, Métodos Cadastrados)
  - Design responsivo com grid adaptativo
  - Efeitos de hover e transições suaves

### 2. **Visão Geral** (`/expenses/overview`)
- **Função**: Dashboard com estatísticas e insights
- **Características**:
  - Seletor de período (Dia, Semana, Mês, Ano)
  - Estatísticas gerais de gastos
  - Breakdown de gastos por categoria com barras de progresso
  - Comparação com mês anterior
  - Próximos vencimentos de gastos recorrentes
  - Gráficos e visualizações

### 3. **Transações** (`/expenses/transactions`)
- **Função**: Gerenciar transações diárias
- **Características**:
  - Calendário interativo para seleção de data
  - Lista de gastos filtrada por data selecionada
  - Formulário modal para adicionar novos gastos
  - Informações do total do dia selecionado
  - Layout responsivo: calendário + lista lado a lado (desktop) / empilhados (mobile)

### 4. **Métodos de Pagamento** (`/expenses/payment-methods`)
- **Função**: Gerenciar formas de pagamento
- **Características**:
  - Cards visuais para cada método
  - Suporte para: Cartão de Crédito, Débito, PIX, Boleto, Dinheiro
  - Indicador de limite usado (cartões de crédito)
  - Definição de método padrão
  - Estatísticas: Total de Métodos, Limite Total, Limite Usado
  - Grid responsivo (3 colunas desktop / 1 coluna mobile)

### 5. **Gastos Recorrentes** (`/expenses/recurring`)
- **Função**: Gerenciar despesas fixas e assinaturas
- **Características**:
  - Lista de gastos recorrentes ativos e inativos
  - Configuração de frequência (Mensal, Anual)
  - Definição de dia de vencimento
  - Vinculação com método de pagamento
  - Ativar/Pausar gastos
  - Estatísticas: Total Mensal, Gastos Ativos, Total Anual
  - Indicadores visuais de status

## 🎨 Componentes Criados

### Core Components
- **`types.ts`**: Definições de tipos TypeScript
  - `Expense`: Transação individual
  - `PaymentMethod`: Método de pagamento
  - `RecurringExpense`: Gasto recorrente
  - `Period`: Período de tempo

### Form Components
- **`ExpenseForm.tsx`**: Formulário para adicionar gastos
- **`PaymentMethodForm.tsx`**: Formulário para métodos de pagamento
- **`RecurringExpenseForm.tsx`**: Formulário para gastos recorrentes

### Display Components
- **`ExpenseList.tsx`**: Lista de transações
- **`ExpenseStats.tsx`**: Estatísticas gerais
- **`PaymentMethodCard.tsx`**: Card de método de pagamento
- **`RecurringExpenseCard.tsx`**: Card de gasto recorrente
- **`CategoryBreakdown.tsx`**: Breakdown por categoria
- **`PeriodSelector.tsx`**: Seletor de período

## 🎯 Funcionalidades por Tela

### Transações
✅ Visualizar gastos por data  
✅ Adicionar nova transação  
✅ Deletar transação  
✅ Calendário interativo  
✅ Filtro por data  
✅ Total diário  

### Métodos de Pagamento
✅ Adicionar método de pagamento  
✅ Visualizar limite de crédito  
✅ Definir método padrão  
✅ Deletar método  
✅ Categorização por tipo  

### Gastos Recorrentes
✅ Adicionar gasto fixo  
✅ Configurar frequência  
✅ Definir vencimento  
✅ Pausar/Reativar  
✅ Deletar gasto recorrente  
✅ Visualizar total mensal/anual  

## 📱 Responsividade

Todas as páginas foram desenvolvidas com design responsivo:

- **Mobile** (< 640px): Layout em coluna única, componentes empilhados
- **Tablet** (640px - 1024px): Grid de 2 colunas quando apropriado
- **Desktop** (> 1024px): Layout completo com múltiplas colunas

## 🎨 Design System

### Cores e Temas
- Totalmente integrado com `ThemeContext`
- Suporte a tema claro e escuro
- Uso consistente de `getThemeColor()`
- Paleta de cores do `colors.ts`

### Componentes Base
- `Card`: Container com elevação
- `Button`: Botões com variantes (primary, neutral, positive, negative)
- `Input`: Campos de entrada padronizados
- `Modal`: Diálogos modais

### Animações
- Transições suaves (duration-200, duration-300)
- Hover effects (scale, translate)
- Loading states preparados

## 🔄 Fluxo de Navegação

```
/expenses (Hub Principal)
├── /overview (Estatísticas)
├── /transactions (Transações Diárias)
├── /payment-methods (Métodos de Pagamento)
└── /recurring (Gastos Fixos)
```

Cada sub-página possui:
- Botão de voltar para o hub
- Header com título e descrição
- Botão de ação principal
- Conteúdo específico da funcionalidade

## 🚀 Próximos Passos Sugeridos

1. **Integração com API**
   - Conectar com backend
   - Estado global com Context/Redux
   - Cache e sincronização

2. **Funcionalidades Adicionais**
   - Edição de transações
   - Exportação de relatórios
   - Notificações de vencimento
   - Metas de gastos

3. **Melhorias de UX**
   - Filtros avançados
   - Busca de transações
   - Gráficos interativos
   - Comparações temporais

4. **Otimizações**
   - Lazy loading de componentes
   - Paginação de listas
   - Cache de dados
   - Otimização de imagens/ícones

## 📝 Notas de Desenvolvimento

- Todos os componentes usam TypeScript com tipagem forte
- Separação clara de responsabilidades
- Componentes reutilizáveis e modulares
- Código limpo e bem documentado
- Seguindo padrões Next.js App Router
