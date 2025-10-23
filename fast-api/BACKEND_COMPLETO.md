# 🚀 Back-end FastAPI - Gerenciador Financeiro

## ✅ O que foi implementado

### 📦 Estrutura Completa
```
fast-api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicação principal FastAPI
│   ├── config.py               # Configurações (Pydantic Settings)
│   ├── database.py             # Conexão SQLAlchemy + SQLite
│   ├── dependencies.py         # Dependências (autenticação)
│   │
│   ├── core/                   # Funcionalidades core
│   │   ├── security.py         # JWT, hash de senhas
│   │   └── utils.py            # Utilitários
│   │
│   ├── models/                 # Modelos SQLAlchemy (6 arquivos)
│   │   ├── user.py
│   │   ├── expense.py
│   │   ├── payment_method.py
│   │   ├── recurring_expense.py
│   │   ├── investment.py
│   │   └── __init__.py
│   │
│   ├── schemas/                # Schemas Pydantic (7 arquivos)
│   │   ├── auth.py
│   │   ├── expense.py
│   │   ├── payment_method.py
│   │   ├── recurring_expense.py
│   │   ├── investment.py
│   │   ├── dashboard.py
│   │   └── __init__.py
│   │
│   └── api/
│       └── v1/                 # API versão 1
│           ├── router.py       # Router principal
│           └── endpoints/      # Endpoints (6 arquivos)
│               ├── auth.py
│               ├── expenses.py
│               ├── payment_methods.py
│               ├── recurring_expenses.py
│               ├── investments.py
│               └── dashboard.py
│
├── .env                        # Variáveis de ambiente
├── .env.example                # Template de configuração
├── .gitignore
├── requirements.txt            # Dependências Python
├── start.bat                   # Script Windows
├── start.sh                    # Script Linux/Mac
└── README.md
```

### 🗄️ Banco de Dados SQLite

**6 Tabelas criadas:**
- ✅ `users` - Usuários
- ✅ `expenses` - Despesas
- ✅ `payment_methods` - Métodos de pagamento
- ✅ `recurring_expenses` - Despesas recorrentes
- ✅ `investments` - Investimentos
- ✅ `investment_history` - Histórico de investimentos

### 🔐 Autenticação e Segurança

- ✅ JWT (JSON Web Tokens)
- ✅ Hash de senhas com bcrypt
- ✅ Middleware de autenticação
- ✅ Proteção de rotas
- ✅ CORS configurado

### 📡 API REST Completa

**Auth (7 endpoints):**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/profile`
- `POST /api/v1/auth/change-password`

**Expenses (6 endpoints):**
- `GET /api/v1/expenses` (com filtros)
- `GET /api/v1/expenses/stats`
- `GET /api/v1/expenses/{id}`
- `POST /api/v1/expenses`
- `PUT /api/v1/expenses/{id}`
- `DELETE /api/v1/expenses/{id}`

**Payment Methods (6 endpoints):**
- `GET /api/v1/payment-methods`
- `GET /api/v1/payment-methods/{id}`
- `POST /api/v1/payment-methods`
- `PUT /api/v1/payment-methods/{id}`
- `DELETE /api/v1/payment-methods/{id}`
- `PATCH /api/v1/payment-methods/{id}/set-default`

**Recurring Expenses (7 endpoints):**
- `GET /api/v1/recurring-expenses`
- `GET /api/v1/recurring-expenses/{id}`
- `POST /api/v1/recurring-expenses`
- `PUT /api/v1/recurring-expenses/{id}`
- `DELETE /api/v1/recurring-expenses/{id}`
- `PATCH /api/v1/recurring-expenses/{id}/toggle-active`
- `POST /api/v1/recurring-expenses/{id}/generate`

**Investments (8 endpoints):**
- `GET /api/v1/investments` (com filtros)
- `GET /api/v1/investments/stats`
- `GET /api/v1/investments/{id}`
- `GET /api/v1/investments/{id}/history`
- `POST /api/v1/investments`
- `PUT /api/v1/investments/{id}`
- `DELETE /api/v1/investments/{id}`
- `PATCH /api/v1/investments/{id}/update-value`

**Dashboard (5 endpoints):**
- `GET /api/v1/dashboard`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/recent-transactions`
- `GET /api/v1/dashboard/category-spending`
- `GET /api/v1/dashboard/monthly-trend`

**Total: 45 endpoints** 🎉

## 🚀 Como Executar

### Opção 1: Scripts Automáticos

**Windows:**
```bash
cd fast-api
start.bat
```

**Linux/Mac:**
```bash
cd fast-api
chmod +x start.sh
./start.sh
```

### Opção 2: Manual

1. **Ativar ambiente virtual:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

3. **Iniciar servidor:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Documentação

Após iniciar o servidor:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **API Root:** http://localhost:8000
- **Health Check:** http://localhost:8000/health

## 🔧 Configuração

Edite o arquivo `.env`:

```env
# Aplicação
APP_NAME=Financial Manager API
DEBUG=True
API_VERSION=v1

# Segurança (TROQUE EM PRODUÇÃO!)
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Banco de Dados
DATABASE_URL=sqlite:///./financial_manager.db

# CORS (adicione seu front-end)
CORS_ORIGINS=["http://localhost:3000"]
```

## 🧪 Testando a API

### 1. Registrar usuário
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 3. Criar despesa (use o token retornado)
```bash
curl -X POST http://localhost:8000/api/v1/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Supermercado",
    "value": 250.50,
    "category": "Alimentação",
    "date": "2025-10-22T10:00:00"
  }'
```

## 📊 Banco de Dados

O banco SQLite é criado automaticamente em `financial_manager.db`.

Para visualizar:
- Use [DB Browser for SQLite](https://sqlitebrowser.org/)
- Ou extensão do VS Code: SQLite Viewer

## ⚠️ Importante

1. **Troque o SECRET_KEY em produção!**
2. O banco SQLite é apenas para desenvolvimento
3. Para produção, use PostgreSQL ou MySQL
4. Configure CORS corretamente para seu domínio

## 🎯 Próximos Passos

1. ✅ Back-end completo funcionando
2. ✅ Front-end Next.js já preparado
3. 🔄 Integrar front-end com back-end
4. 🔄 Testar todos os endpoints
5. 🔄 Deploy (Vercel + Railway/Render)

---

✨ **Back-end FastAPI completo e pronto para uso!** ✨
