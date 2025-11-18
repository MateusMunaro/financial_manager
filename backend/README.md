# FastAPI Backend - Gerenciador Financeiro

Backend desenvolvido com FastAPI e SQLite para o sistema de gerenciamento financeiro.

## 🚀 Instalação

1. Criar ambiente virtual:
```bash
python -m venv venv
```

2. Ativar ambiente virtual:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

3. Instalar dependências:
```bash
pip install -r requirements.txt
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Aplicação
APP_NAME=Financial Manager API
DEBUG=True
API_VERSION=v1

# Segurança
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Banco de Dados
DATABASE_URL=sqlite:///./financial_manager.db

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

## 🏃 Executar

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Documentação

Após iniciar o servidor, acesse:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🗂️ Estrutura do Projeto

```
fast-api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicação principal
│   ├── config.py               # Configurações
│   ├── database.py             # Conexão com banco
│   ├── dependencies.py         # Dependências comuns
│   ├── models/                 # Modelos SQLAlchemy
│   ├── schemas/                # Schemas Pydantic
│   ├── api/
│   │   └── v1/                 # API versão 1
│   │       ├── __init__.py
│   │       ├── router.py       # Router principal
│   │       └── endpoints/      # Endpoints organizados
│   ├── core/                   # Funcionalidades core
│   │   ├── security.py         # Autenticação e segurança
│   │   └── utils.py            # Utilitários
│   └── services/               # Lógica de negócio
├── alembic/                    # Migrações de banco
├── tests/                      # Testes
├── .env                        # Variáveis de ambiente
├── requirements.txt            # Dependências
└── README.md
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação.

**Headers necessários:**
```
Authorization: Bearer <token>
```

## 📋 Endpoints Principais

### Auth
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Dados do usuário
- `PUT /api/v1/auth/profile` - Atualizar perfil
- `POST /api/v1/auth/change-password` - Alterar senha

### Expenses
- `GET /api/v1/expenses` - Listar despesas
- `POST /api/v1/expenses` - Criar despesa
- `GET /api/v1/expenses/{id}` - Buscar despesa
- `PUT /api/v1/expenses/{id}` - Atualizar despesa
- `DELETE /api/v1/expenses/{id}` - Deletar despesa
- `GET /api/v1/expenses/stats` - Estatísticas

### Payment Methods
- `GET /api/v1/payment-methods` - Listar métodos
- `POST /api/v1/payment-methods` - Criar método
- `PUT /api/v1/payment-methods/{id}` - Atualizar método
- `DELETE /api/v1/payment-methods/{id}` - Deletar método
- `PATCH /api/v1/payment-methods/{id}/set-default` - Definir padrão

### Recurring Expenses
- `GET /api/v1/recurring-expenses` - Listar recorrentes
- `POST /api/v1/recurring-expenses` - Criar recorrente
- `PUT /api/v1/recurring-expenses/{id}` - Atualizar
- `DELETE /api/v1/recurring-expenses/{id}` - Deletar
- `PATCH /api/v1/recurring-expenses/{id}/toggle-active` - Ativar/Desativar
- `POST /api/v1/recurring-expenses/{id}/generate` - Gerar despesas

### Investments
- `GET /api/v1/investments` - Listar investimentos
- `POST /api/v1/investments` - Criar investimento
- `GET /api/v1/investments/{id}` - Buscar investimento
- `PUT /api/v1/investments/{id}` - Atualizar investimento
- `DELETE /api/v1/investments/{id}` - Deletar investimento
- `GET /api/v1/investments/stats` - Estatísticas
- `GET /api/v1/investments/{id}/history` - Histórico
- `PATCH /api/v1/investments/{id}/update-value` - Atualizar valor

### Dashboard
- `GET /api/v1/dashboard` - Dados completos
- `GET /api/v1/dashboard/summary` - Resumo financeiro
- `GET /api/v1/dashboard/recent-transactions` - Transações recentes
- `GET /api/v1/dashboard/category-spending` - Gastos por categoria
- `GET /api/v1/dashboard/monthly-trend` - Tendência mensal

## 🛠️ Desenvolvimento

### Criar migração
```bash
alembic revision --autogenerate -m "description"
```

### Aplicar migrações
```bash
alembic upgrade head
```

### Reverter migração
```bash
alembic downgrade -1
```

## 🧪 Testes

```bash
pytest
```

## 📝 Licença

Projeto privado - Todos os direitos reservados
