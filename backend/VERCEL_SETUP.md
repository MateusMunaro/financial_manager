# 🚀 Setup do Backend na Vercel

## ⚠️ Problemas Corrigidos

### 1. Erro: `TypeError: issubclass() arg 1 must be a class`
**Causa:** Uso incorreto do `Mangum` - Vercel já tem handler ASGI nativo para FastAPI.  
**Solução:** Removido `Mangum` e exportado `app` diretamente em `api/index.py`.

### 2. Erro: `sqlite3.OperationalError: unable to open database file`
**Causa:** Vercel usa filesystem **read-only** - SQLite não funciona.  
**Solução:** Migrado para PostgreSQL (obrigatório na Vercel).

---

## 📋 Passos para Deploy

### 1. Criar Banco de Dados PostgreSQL

Você tem 3 opções (escolha uma):

#### Opção A: Vercel Postgres (Recomendado)
1. Acesse seu projeto na Vercel Dashboard
2. Vá em **Storage** → **Create Database** → **Postgres**
3. Siga o wizard e conecte ao seu projeto
4. A Vercel criará automaticamente a variável `POSTGRES_URL`

#### Opção B: Neon (Gratuito)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta e um novo projeto
3. Copie a connection string (formato: `postgresql://user:pass@host/db`)

#### Opção C: Supabase (Gratuito)
1. Acesse [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em **Settings** → **Database** → copie a connection string

---

### 2. Configurar Variáveis de Ambiente na Vercel

No seu projeto na Vercel, vá em **Settings** → **Environment Variables** e adicione:

```bash
# Banco de Dados (OBRIGATÓRIO)
POSTGRES_URL=postgresql://user:password@host:port/database
# ou
DATABASE_URL=postgresql://user:password@host:port/database

# Segurança (OBRIGATÓRIO)
SECRET_KEY=sua-chave-super-secreta-aqui-minimo-32-caracteres

# Opcional (já tem defaults)
DEBUG=False
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**⚠️ IMPORTANTE:** 
- Adicione as variáveis para **Production**, **Preview** e **Development**
- Use uma `SECRET_KEY` forte (mínimo 32 caracteres aleatórios)
- Nunca comite credenciais no código

---

### 3. Deploy

Depois de configurar as variáveis:

```bash
# Se estiver usando Vercel CLI
vercel --prod

# Ou faça push para o repositório conectado
git add .
git commit -m "fix: configurar backend para Vercel com PostgreSQL"
git push origin main
```

---

## 🔍 Verificar se Funcionou

Após o deploy, teste:

1. **Health Check:**  
   `https://seu-backend.vercel.app/health`  
   → Deve retornar: `{"status": "healthy", "version": "v1"}`

2. **Docs:**  
   `https://seu-backend.vercel.app/docs`  
   → Deve abrir o Swagger UI

3. **API:**  
   `https://seu-backend.vercel.app/api/v1/...`

---

## 🗄️ Migração do Banco de Dados

Se você já tem dados em SQLite local e quer migrar:

### Opção 1: Usar Alembic (Recomendado)

```bash
# 1. Configure DATABASE_URL localmente para PostgreSQL
export DATABASE_URL="postgresql://..."  # Linux/Mac
$env:DATABASE_URL="postgresql://..."    # Windows PowerShell

# 2. Crie as tabelas
cd backend
alembic upgrade head

# 3. (Opcional) Exporte dados do SQLite e importe no PostgreSQL
```

### Opção 2: Deixar o FastAPI criar as tabelas automaticamente

O código em `app/main.py` já tem:
```python
Base.metadata.create_all(bind=engine)
```

Isso criará as tabelas automaticamente na primeira execução.

---

## 🔧 Troubleshooting

### Erro: "No module named 'psycopg2'"
- Certifique-se que `psycopg2-binary==2.9.9` está em `requirements.txt`
- Faça redeploy na Vercel

### Erro: "could not connect to database"
- Verifique se `POSTGRES_URL` ou `DATABASE_URL` está configurada corretamente
- Teste a connection string localmente:
  ```bash
  pip install psycopg2-binary
  python -c "import psycopg2; conn = psycopg2.connect('sua-connection-string'); print('✓ Conectado!')"
  ```

### Erro 500 na Vercel
- Vá em **Deployments** → clique no deployment → **View Function Logs**
- Procure por erros específicos nos logs

### CORS Errors
- Adicione seu domínio frontend em `app/config.py`:
  ```python
  CORS_ORIGINS: List[str] = [
      "https://seu-frontend.vercel.app",
      "http://localhost:3000",
  ]
  ```

---

## 📚 Recursos

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/vercel/)
- [SQLAlchemy PostgreSQL](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html)

---

## ✅ Checklist Final

- [ ] Banco PostgreSQL criado
- [ ] `POSTGRES_URL` ou `DATABASE_URL` configurada na Vercel
- [ ] `SECRET_KEY` configurada na Vercel
- [ ] Deploy realizado com sucesso
- [ ] `/health` retorna status 200
- [ ] `/docs` acessível
- [ ] Frontend configurado com URL do backend

---

**🎉 Pronto! Seu backend FastAPI está rodando na Vercel!**
