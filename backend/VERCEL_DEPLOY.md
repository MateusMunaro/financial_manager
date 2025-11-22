# 🚀 Guia de Deploy do Backend na Vercel

## ⚠️ Problema Atual

Erro 500 ao acessar: https://backend-seven-azure-75.vercel.app/

## 🔧 Soluções Implementadas

### 1. ✅ Mangum Adapter
- Adicionado `mangum` para adaptar FastAPI para serverless (ASGI → WSGI)
- Atualizado `api/index.py` com handler correto

### 2. ✅ Configurações de Produção
- DEBUG desabilitado em produção
- Valores padrão para variáveis de ambiente
- CORS configurado para múltiplas origens

### 3. ✅ SQLite não funciona na Vercel
**Problema**: Vercel é serverless e não tem filesystem persistente.

**Soluções**:

#### Opção A: PostgreSQL (Recomendado) 🎯
Use um banco de dados externo como:
- **Neon** (https://neon.tech) - PostgreSQL serverless GRATUITO
- **Supabase** (https://supabase.com) - PostgreSQL gratuito
- **Railway** (https://railway.app) - PostgreSQL gratuito

#### Opção B: SQLite temporário (Apenas para testes)
- Os dados serão perdidos a cada deploy
- Útil apenas para testar se a API está funcionando

## 📋 Passos para Configurar

### 1. Configurar Variáveis de Ambiente na Vercel

Acesse: https://vercel.com/mateusmunaros-projects/backend/settings/environment-variables

Adicione estas variáveis:

```env
SECRET_KEY=seu-secret-key-super-secreto-aqui-minimo-32-caracteres
DATABASE_URL=sqlite:///./financial_manager.db
VERCEL=1
```

**Importante**: Gere uma SECRET_KEY segura:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Configurar PostgreSQL (Recomendado)

#### Usando Neon (GRATUITO):

1. Acesse: https://neon.tech
2. Crie uma conta
3. Crie um novo projeto
4. Copie a Connection String
5. Na Vercel, atualize a variável `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

#### Instalar dependência do PostgreSQL:

Adicione ao `requirements.txt`:
```
psycopg2-binary==2.9.9
```

### 3. Re-deploy

Após configurar as variáveis:

```bash
git add .
git commit -m "Configure backend for Vercel production"
git push
```

Ou manualmente na Vercel:
- Settings → Deployments → Redeploy

## 🧪 Testar

### Verificar saúde da API:
```bash
curl https://backend-seven-azure-75.vercel.app/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "version": "v1"
}
```

### Verificar docs:
```
https://backend-seven-azure-75.vercel.app/docs
```

## 🐛 Debugging

### Ver logs na Vercel:
1. Acesse: https://vercel.com/mateusmunaros-projects/backend
2. Clique no último deployment
3. Vá em "Functions" → Clique na função → Ver logs

### Erros comuns:

#### Erro: "SECRET_KEY not found"
- Configure a variável `SECRET_KEY` na Vercel

#### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurada
- Para PostgreSQL, instale `psycopg2-binary`

#### Erro 500 genérico
- Veja os logs na Vercel
- Verifique se todas as dependências estão em `requirements.txt`

## 📝 Checklist

- [x] Mangum instalado e configurado
- [x] DEBUG = False em produção
- [x] CORS configurado
- [ ] SECRET_KEY configurada na Vercel
- [ ] DATABASE_URL configurada na Vercel
- [ ] Banco de dados externo (PostgreSQL) configurado
- [ ] Re-deploy realizado

## 🎯 Próximos Passos

1. **Configure as variáveis de ambiente na Vercel**
2. **Configure um banco PostgreSQL (Neon recomendado)**
3. **Faça re-deploy**
4. **Teste os endpoints**

## 📚 Recursos

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon PostgreSQL](https://neon.tech/docs/introduction)
- [Mangum Documentation](https://mangum.io/)
