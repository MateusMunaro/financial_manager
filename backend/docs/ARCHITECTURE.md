# Backend Architecture

## Visão Geral

O backend do Gerenciador Financeiro é construído com **FastAPI**, um framework Python moderno e de alta performance para construção de APIs. A aplicação segue uma arquitetura em camadas bem definida.

## Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Python | 3.11+ | Linguagem principal |
| FastAPI | 0.100+ | Framework web |
| Pydantic | 2.0+ | Validação de dados e schemas |
| SQLAlchemy | 2.0+ | ORM para banco de dados |
| PostgreSQL | 14+ | Banco de dados relacional |
| JWT | - | Autenticação |
| Uvicorn | - | Servidor ASGI |

## Estrutura de Pastas

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Ponto de entrada da aplicação
│   ├── config.py            # Configurações e variáveis de ambiente
│   ├── database.py          # Configuração do banco de dados
│   ├── dependencies.py      # Dependências injetáveis (auth, etc)
│   │
│   ├── api/                  # Camada de API
│   │   └── v1/
│   │       ├── router.py     # Router principal
│   │       └── endpoints/    # Endpoints organizados por recurso
│   │           ├── auth.py
│   │           ├── expenses.py
│   │           ├── payment_methods.py
│   │           ├── recurring_expenses.py
│   │           ├── investments.py
│   │           └── dashboard.py
│   │
│   ├── core/                 # Lógica central
│   │   ├── security.py       # Funções de autenticação
│   │   ├── apple_auth.py     # Integração Apple Sign In
│   │   └── utils.py          # Utilitários
│   │
│   ├── models/               # Modelos SQLAlchemy (ORM)
│   │   ├── user.py
│   │   ├── expense.py
│   │   ├── payment_method.py
│   │   ├── recurring_expense.py
│   │   └── investment.py
│   │
│   └── schemas/              # Schemas Pydantic (validação)
│       ├── __init__.py       # Exporta todos os schemas
│       ├── auth.py
│       ├── expense.py
│       ├── payment_method.py
│       ├── recurring_expense.py
│       ├── investment.py
│       └── dashboard.py
│
├── migrations/               # Migrações de banco (Alembic)
├── docs/                     # Documentação
├── requirements.txt          # Dependências Python
├── Dockerfile               # Container Docker
└── vercel.json              # Deploy Vercel
```

## Camadas da Arquitetura

### 1. Camada de API (Endpoints)

Localização: `app/api/v1/endpoints/`

Responsabilidades:
- Receber requisições HTTP
- Validar dados de entrada usando schemas Pydantic
- Chamar lógica de negócio
- Retornar respostas formatadas

```python
@router.post("", response_model=ExpenseResponse)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Lógica do endpoint
```

### 2. Camada de Schemas (Validação)

Localização: `app/schemas/`

Responsabilidades:
- Definir estrutura de dados de entrada (Create, Update)
- Definir estrutura de dados de saída (Response)
- Validação automática com Pydantic

```python
class ExpenseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    value: float = Field(..., gt=0)
    category: str
    date: datetime
```

### 3. Camada de Models (ORM)

Localização: `app/models/`

Responsabilidades:
- Definir estrutura das tabelas
- Mapear para objetos Python
- Relacionamentos entre tabelas

```python
class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
```

### 4. Camada de Core (Lógica Central)

Localização: `app/core/`

Responsabilidades:
- Autenticação e segurança
- Utilitários compartilhados
- Integrações externas

## Fluxo de Dados

```mermaid
sequenceDiagram
    participant Client
    participant Endpoint
    participant Schema
    participant Model
    participant Database

    Client->>Endpoint: HTTP Request (JSON)
    Endpoint->>Schema: Validar entrada
    Schema-->>Endpoint: Dados validados
    Endpoint->>Model: Operação CRUD
    Model->>Database: Query SQL
    Database-->>Model: Resultado
    Model-->>Endpoint: Objeto Python
    Endpoint->>Schema: Serializar resposta
    Schema-->>Endpoint: JSON
    Endpoint-->>Client: HTTP Response
```

## Padrões Utilizados

### Repository Pattern (Implícito)
Cada endpoint encapsula operações de banco de dados usando SQLAlchemy.

### Dependency Injection
FastAPI injeta dependências automaticamente:
- `get_db`: Sessão do banco de dados
- `get_current_user`: Usuário autenticado

### Response Model Validation
Cada endpoint define `response_model` para validação automática de saída.

## Autenticação

### JWT (JSON Web Tokens)

1. **Login**: Usuário envia credenciais
2. **Token**: Sistema retorna JWT com `sub` (user_id)
3. **Requisições**: Cliente envia token no header `Authorization: Bearer <token>`
4. **Validação**: `get_current_user` decodifica e valida o token

```python
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # Decodifica JWT e busca usuário
```

## Tratamento de Erros

### HTTPException
Erros são lançados com códigos HTTP apropriados:

```python
raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Recurso não encontrado"
)
```

### Códigos de Status Comuns

| Código | Descrição | Uso |
|--------|-----------|-----|
| 200 | OK | Sucesso em GET, PUT |
| 201 | Created | Sucesso em POST |
| 204 | No Content | Sucesso em DELETE |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token inválido/expirado |
| 404 | Not Found | Recurso não existe |
| 422 | Unprocessable | Validação falhou |

## Configuração

### Variáveis de Ambiente

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:3000"]
```

### config.py

```python
class Settings(BaseSettings):
    APP_NAME: str = "Financial Manager API"
    API_VERSION: str = "v1"
    DATABASE_URL: str
    SECRET_KEY: str
    CORS_ORIGINS: list[str]
```

## Deploy

### Vercel (Serverless)
Configurado via `vercel.json` para deploy automático.

### Docker
Dockerfile disponível para containerização.

## Comandos Úteis

```bash
# Desenvolvimento
uvicorn app.main:app --reload

# Produção
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Documentação interativa
# Acesse: http://localhost:8000/docs
```
