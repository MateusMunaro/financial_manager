# 🚀 Pipelines CI/CD - Gerenciador Financeiro

Este projeto utiliza pipelines híbridos para deploy automatizado em diferentes ambientes.

## 📋 Estrutura de Pipelines

### 🐳 Branch `main` → DockerHub (Produção)
- **Workflow**: `.github/workflows/deploy-dockerhub.yml`
- **Trigger**: Push na branch `main`
- **Objetivo**: Build e push de imagens Docker para o DockerHub
- **Imagens geradas**:
  - `{username}/gerenciador-financeiro-backend:latest`
  - `{username}/gerenciador-financeiro-frontend:latest`

### ▲ Branch `dev` → Vercel (Desenvolvimento)
- **Workflow**: `.github/workflows/deploy-vercel.yml`
- **Trigger**: Push na branch `dev`
- **Objetivo**: Deploy automático para Vercel em projetos separados
- **Ambientes**:
  - Backend: Vercel Serverless Functions
  - Frontend: Vercel Static/SSR

---

## 🔐 Configuração de Secrets

### Para DockerHub (Branch `main`)

No GitHub, vá em: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Descrição | Como obter |
|--------|-----------|------------|
| `DOCKERHUB_USERNAME` | Seu username do DockerHub | Login do hub.docker.com |
| `DOCKERHUB_TOKEN` | Access token do DockerHub | [Criar token](https://hub.docker.com/settings/security) |

**Passos para criar o token do DockerHub:**
1. Acesse: https://hub.docker.com/settings/security
2. Clique em "New Access Token"
3. Dê um nome descritivo (ex: "github-actions")
4. Permissões: Read, Write, Delete
5. Copie o token gerado (só aparece uma vez!)

### Para Vercel (Branch `dev`)

No GitHub, adicione os seguintes secrets:

| Secret | Descrição | Como obter |
|--------|-----------|------------|
| `VERCEL_TOKEN` | Token de autenticação da Vercel | [Criar token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | ID da sua organização/conta | Ver abaixo |
| `VERCEL_PROJECT_ID_BACKEND` | ID do projeto backend na Vercel | Ver abaixo |
| `VERCEL_PROJECT_ID_FRONTEND` | ID do projeto frontend na Vercel | Ver abaixo |

**Passos para obter os IDs da Vercel:**

1. **Criar o token:**
   - Acesse: https://vercel.com/account/tokens
   - Clique em "Create Token"
   - Dê um nome (ex: "github-actions-dev")
   - Copie o token

2. **Obter ORG_ID e PROJECT_IDs:**
   ```powershell
   # Instalar Vercel CLI
   npm install -g vercel

   # Login
   vercel login

   # No diretório do backend
   cd backend
   vercel link
   # Siga as instruções para criar/linkar o projeto

   # No diretório do frontend
   cd ../frontend
   vercel link
   # Siga as instruções para criar/linkar o projeto
   ```

3. **Após executar `vercel link`, os IDs estarão em:**
   - Backend: `backend/.vercel/project.json`
   - Frontend: `frontend/.vercel/project.json`

   Estrutura do arquivo:
   ```json
   {
     "orgId": "seu_org_id_aqui",
     "projectId": "seu_project_id_aqui"
   }
   ```

---

## 🛠️ Configuração Inicial

### 1. Criar repositórios no DockerHub

```powershell
# Acesse hub.docker.com e crie dois repositórios:
# 1. gerenciador-financeiro-backend
# 2. gerenciador-financeiro-frontend
```

### 2. Criar projetos na Vercel

```powershell
# No diretório backend
cd backend
vercel

# No diretório frontend
cd ../frontend
vercel
```

**Configurações importantes na Vercel:**
- **Backend**: 
  - Framework Preset: Other
  - Build Command: (deixe vazio ou configure conforme necessário)
  - Output Directory: (deixe vazio)
  - Install Command: `pip install -r requirements.txt`

- **Frontend**:
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### 3. Adicionar variáveis de ambiente na Vercel

**Backend (se necessário):**
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- Outras variáveis do `.env`

**Frontend:**
- `NEXT_PUBLIC_API_URL` (URL do backend na Vercel)
- Outras variáveis públicas necessárias

---

## 🚦 Como Usar

### Deploy para Produção (DockerHub)

```bash
# Criar e fazer push para a branch main
git checkout main
git merge dev  # ou suas mudanças
git push origin main

# O pipeline será executado automaticamente
# Verifique em: Actions → Deploy to DockerHub (Production)
```

**Resultado:**
- Imagens disponíveis no DockerHub
- Prontas para deploy em qualquer cloud (AWS, Azure, GCP, DigitalOcean, etc.)

### Deploy para Desenvolvimento (Vercel)

```bash
# Fazer push para a branch dev
git checkout dev
git add .
git commit -m "feat: nova funcionalidade"
git push origin dev

# O pipeline será executado automaticamente
# Verifique em: Actions → Deploy to Vercel (Development)
```

**Resultado:**
- Backend e Frontend deployados em URLs separadas da Vercel
- URLs disponíveis nos logs do workflow

---

## 📦 Estrutura dos Dockerfiles

### Backend (`backend/Dockerfile`)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (`frontend/Dockerfile`)
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🔍 Verificação de Status

### DockerHub
```powershell
# Ver imagens publicadas
docker pull {seu-username}/gerenciador-financeiro-backend:latest
docker pull {seu-username}/gerenciador-financeiro-frontend:latest

# Executar localmente
docker run -p 8000:8000 {seu-username}/gerenciador-financeiro-backend:latest
docker run -p 3000:3000 {seu-username}/gerenciador-financeiro-frontend:latest
```

### Vercel
```powershell
# Listar deployments
vercel ls

# Ver logs do último deploy
vercel logs {deployment-url}
```

---

## 🐛 Troubleshooting

### Erro: "Docker login failed"
- Verifique se `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` estão corretos
- Recrie o token no DockerHub se necessário

### Erro: "Vercel deployment failed"
- Verifique se os project IDs estão corretos
- Confirme se o token tem permissões adequadas
- Verifique os logs no dashboard da Vercel

### Erro: "Build failed"
- Verifique se os Dockerfiles estão corretos
- Confirme se todas as dependências estão no `requirements.txt` (backend) ou `package.json` (frontend)
- Veja os logs detalhados na aba Actions do GitHub

---

## 📊 Workflows Disponíveis

| Workflow | Branch | Trigger | Destino |
|----------|--------|---------|---------|
| `deploy-dockerhub.yml` | `main` | Push/Manual | DockerHub |
| `deploy-vercel.yml` | `dev` | Push/Manual | Vercel |

**Execução Manual:**
- Vá em: Actions → Selecione o workflow → Run workflow

---

## 🌟 Próximos Passos

1. **Produção completa:**
   - Configurar Kubernetes/Docker Swarm
   - Usar as imagens do DockerHub
   - Configurar Load Balancer e CDN

2. **Melhorias nos pipelines:**
   - Adicionar testes automatizados
   - Scan de vulnerabilidades
   - Notificações (Slack, Discord, Email)

3. **Monitoramento:**
   - Integrar Sentry para errors
   - Configurar logs centralizados
   - Métricas de performance

---

## 📝 Notas Importantes

- ✅ Os pipelines rodam em paralelo (backend e frontend independentes)
- ✅ Cache de Docker é habilitado para builds mais rápidos
- ✅ Versionamento automático por SHA do commit
- ✅ `.dockerignore` configurado para otimizar tamanho das imagens
- ✅ Suporte a execução manual via `workflow_dispatch`

---

## 🤝 Contribuindo

Para adicionar novos ambientes ou modificar pipelines:
1. Crie um novo arquivo em `.github/workflows/`
2. Configure os secrets necessários
3. Teste com `workflow_dispatch` antes de ativar triggers automáticos

---

**Criado com ❤️ para o Gerenciador Financeiro**
