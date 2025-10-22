# Gerenciador Financeiro

Um sistema completo de gerenciamento financeiro pessoal construído com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React 18** - Biblioteca UI

## 📁 Estrutura do Projeto

```
gerenciador_financeiro/
├── src/
│   └── app/
│       ├── (auth)/              # Route group para autenticação
│       │   ├── login/           # Página de login
│       │   ├── register/        # Página de cadastro
│       │   └── layout.tsx       # Layout para páginas de auth
│       │
│       ├── (public)/            # Route group para páginas públicas
│       │   ├── about/           # Página sobre
│       │   ├── contact/         # Página de contato
│       │   └── layout.tsx       # Layout para páginas públicas
│       │
│       ├── layout.tsx           # Layout raiz
│       ├── page.tsx             # Página inicial
│       └── globals.css          # Estilos globais
│
├── public/                      # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── postcss.config.js
```

## 🎯 Route Groups

Este projeto utiliza **Route Groups** do Next.js 14 para organizar as rotas:

### (auth)
Páginas de autenticação com layout específico:
- `/login` - Página de login
- `/register` - Página de cadastro

### (public)
Páginas públicas com navegação:
- `/about` - Sobre o sistema
- `/contact` - Página de contato

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🎨 Páginas Implementadas

### Página Inicial (/)
- Landing page com informações sobre o sistema

### Autenticação
- **Login** (`/login`) - Formulário de autenticação
- **Cadastro** (`/register`) - Formulário de registro

### Páginas Públicas
- **Sobre** (`/about`) - Informações sobre o sistema e funcionalidades
- **Contato** (`/contact`) - Formulário de contato

## 🔧 Configurações

### TypeScript
Configurado com strict mode e path aliases (`@/*`)

### Tailwind CSS
Configurado com sistema de design personalizado e suporte a dark mode

### ESLint
Configurado com as regras recomendadas do Next.js

## 📦 Próximos Passos

- [ ] Implementar autenticação real
- [ ] Criar dashboard de transações
- [ ] Adicionar gráficos e relatórios
- [ ] Implementar CRUD de transações
- [ ] Adicionar categorias
- [ ] Sistema de metas financeiras
- [ ] Integração com banco de dados

## 📄 Licença

Este projeto é de código aberto.
