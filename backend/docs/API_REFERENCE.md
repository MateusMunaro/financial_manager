# API Reference

## Visão Geral

Base URL: `https://your-domain.com/api/v1`

Todas as requisições autenticadas devem incluir o header:
```
Authorization: Bearer <token>
```

---

## Autenticação

### POST /auth/register
Registrar novo usuário.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123456"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "avatar": null,
    "created_at": "2026-01-05T10:00:00Z",
    "updated_at": "2026-01-05T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": null
}
```

---

### POST /auth/login
Fazer login.

**Request Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123456"
}
```

**Response:** `200 OK`
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": null
}
```

**Errors:**
- `401 Unauthorized`: Email ou senha incorretos

---

### POST /auth/logout
Fazer logout. 🔒 Requer autenticação.

**Response:** `200 OK`
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### GET /auth/me
Obter dados do usuário atual. 🔒 Requer autenticação.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "avatar": null,
  "created_at": "2026-01-05T10:00:00Z",
  "updated_at": "2026-01-05T10:00:00Z"
}
```

---

### PUT /auth/profile
Atualizar perfil. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "name": "João da Silva",
  "email": "joao.silva@email.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK` - User object

---

### POST /auth/change-password
Alterar senha. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "current_password": "senha123456",
  "new_password": "novaSenha123",
  "confirm_new_password": "novaSenha123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## Despesas (Expenses)

### GET /expenses
Listar despesas. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| start_date | datetime | Data inicial |
| end_date | datetime | Data final |
| category | string | Filtrar por categoria |
| payment_method | enum | credit-card, debit-card, pix, bank-slip, cash, other |
| min_value | float | Valor mínimo |
| max_value | float | Valor máximo |
| is_recurring | boolean | Apenas recorrentes |
| search | string | Busca por nome/descrição |

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Almoço",
    "value": 35.50,
    "category": "Alimentação",
    "date": "2026-01-05T12:00:00Z",
    "description": "Restaurante X",
    "payment_method": "credit-card",
    "is_recurring": false,
    "user_id": "uuid",
    "created_at": "2026-01-05T10:00:00Z",
    "updated_at": "2026-01-05T10:00:00Z"
  }
]
```

---

### GET /expenses/{expense_id}
Buscar despesa por ID. 🔒 Requer autenticação.

**Response:** `200 OK` - Expense object

**Errors:**
- `404 Not Found`: Despesa não encontrada

---

### POST /expenses
Criar despesa. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "name": "Almoço",
  "value": 35.50,
  "category": "Alimentação",
  "date": "2026-01-05T12:00:00Z",
  "description": "Restaurante X",
  "payment_method": "credit-card",
  "is_recurring": false
}
```

**Response:** `201 Created` - Expense object

---

### PUT /expenses/{expense_id}
Atualizar despesa. 🔒 Requer autenticação.

**Request Body:** (campos opcionais)
```json
{
  "name": "Almoço atualizado",
  "value": 40.00
}
```

**Response:** `200 OK` - Expense object

---

### DELETE /expenses/{expense_id}
Deletar despesa. 🔒 Requer autenticação.

**Response:** `204 No Content`

---

### GET /expenses/stats
Estatísticas de despesas. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| period | enum | month | day, week, month, year |
| start_date | datetime | - | Data inicial |
| end_date | datetime | - | Data final |

**Response:** `200 OK`
```json
{
  "total": 1500.00,
  "count": 25,
  "average": 60.00,
  "by_category": {
    "Alimentação": 500.00,
    "Transporte": 300.00
  },
  "by_payment_method": {
    "credit-card": 800.00,
    "pix": 700.00
  },
  "period": "month"
}
```

---

## Métodos de Pagamento (Payment Methods)

### GET /payment-methods
Listar métodos de pagamento. 🔒 Requer autenticação.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Nubank",
    "type": "credit-card",
    "last_digits": "1234",
    "is_default": true,
    "limit": 5000.00,
    "used_limit": 1500.00,
    "user_id": "uuid",
    "created_at": "2026-01-05T10:00:00Z",
    "updated_at": "2026-01-05T10:00:00Z"
  }
]
```

---

### POST /payment-methods
Criar método de pagamento. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "name": "Nubank",
  "type": "credit-card",
  "last_digits": "1234",
  "is_default": true,
  "limit": 5000.00,
  "used_limit": 0
}
```

**Response:** `201 Created` - PaymentMethod object

---

### PUT /payment-methods/{method_id}
Atualizar método de pagamento. 🔒 Requer autenticação.

**Response:** `200 OK` - PaymentMethod object

---

### DELETE /payment-methods/{method_id}
Deletar método de pagamento. 🔒 Requer autenticação.

**Response:** `204 No Content`

---

### PATCH /payment-methods/{method_id}/set-default
Definir como método padrão. 🔒 Requer autenticação.

**Response:** `200 OK` - PaymentMethod object

---

## Despesas Recorrentes (Recurring Expenses)

### GET /recurring-expenses
Listar despesas recorrentes. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| is_active | boolean | Filtrar por status ativo |

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Netflix",
    "value": 55.90,
    "category": "Assinaturas",
    "frequency": "monthly",
    "day_of_month": 15,
    "day_of_week": null,
    "payment_method": "credit-card",
    "is_active": true,
    "start_date": "2026-01-01T00:00:00Z",
    "end_date": null,
    "description": "Assinatura mensal",
    "user_id": "uuid",
    "created_at": "2026-01-05T10:00:00Z",
    "updated_at": "2026-01-05T10:00:00Z"
  }
]
```

---

### POST /recurring-expenses
Criar despesa recorrente. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "name": "Netflix",
  "value": 55.90,
  "category": "Assinaturas",
  "frequency": "monthly",
  "day_of_month": 15,
  "payment_method": "credit-card",
  "is_active": true,
  "start_date": "2026-01-01T00:00:00Z",
  "description": "Assinatura mensal"
}
```

**Response:** `201 Created` - RecurringExpense object

---

### PUT /recurring-expenses/{expense_id}
Atualizar despesa recorrente. 🔒 Requer autenticação.

**Response:** `200 OK` - RecurringExpense object

---

### DELETE /recurring-expenses/{expense_id}
Deletar despesa recorrente. 🔒 Requer autenticação.

**Response:** `204 No Content`

---

### PATCH /recurring-expenses/{expense_id}/toggle-active
Ativar/desativar despesa recorrente. 🔒 Requer autenticação.

**Response:** `200 OK` - RecurringExpense object (com is_active invertido)

---

### POST /recurring-expenses/{expense_id}/generate
Gerar despesas a partir da recorrência. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "start_date": "2026-01-01T00:00:00Z",
  "end_date": "2026-03-31T23:59:59Z"
}
```

**Response:** `200 OK`
```json
{
  "message": "3 despesas geradas com sucesso"
}
```

---

## Investimentos (Investments)

### GET /investments
Listar investimentos. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| type | enum | Renda Fixa, Ações, FII, ETF, Criptomoedas, Fundos, Outros |
| min_value | float | Valor mínimo |
| max_value | float | Valor máximo |
| search | string | Busca por nome/ticker |

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Tesouro Selic 2029",
    "type": "Renda Fixa",
    "value": 1000.00,
    "purchase_date": "2026-01-01T00:00:00Z",
    "current_value": 1050.00,
    "quantity": null,
    "ticker": null,
    "description": "Tesouro direto",
    "user_id": "uuid",
    "created_at": "2026-01-05T10:00:00Z",
    "updated_at": "2026-01-05T10:00:00Z"
  }
]
```

---

### POST /investments
Criar investimento. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "name": "Tesouro Selic 2029",
  "type": "Renda Fixa",
  "value": 1000.00,
  "purchase_date": "2026-01-01T00:00:00Z",
  "current_value": 1000.00,
  "description": "Tesouro direto"
}
```

**Response:** `201 Created` - Investment object

---

### GET /investments/stats
Estatísticas de investimentos. 🔒 Requer autenticação.

**Response:** `200 OK`
```json
{
  "total_invested": 10000.00,
  "current_total": 11500.00,
  "total_profit": 1500.00,
  "profit_percentage": 15.0,
  "count": 5,
  "by_type": {
    "Renda Fixa": {
      "invested": 5000.00,
      "current": 5500.00,
      "count": 2
    },
    "Ações": {
      "invested": 5000.00,
      "current": 6000.00,
      "count": 3
    }
  }
}
```

---

### GET /investments/{investment_id}/history
Histórico de valores. 🔒 Requer autenticação.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "investment_id": "uuid",
    "value": 1050.00,
    "date": "2026-01-05T10:00:00Z"
  },
  {
    "id": "uuid",
    "investment_id": "uuid",
    "value": 1000.00,
    "date": "2026-01-01T10:00:00Z"
  }
]
```

---

### PATCH /investments/{investment_id}/update-value
Atualizar valor atual. 🔒 Requer autenticação.

**Request Body:**
```json
{
  "current_value": 1100.00
}
```

**Response:** `200 OK` - Investment object (atualizado)

---

## Dashboard

### GET /dashboard
Dados completos do dashboard. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| period | enum | month | day, week, month, year |

**Response:** `200 OK`
```json
{
  "summary": {
    "total_balance": 5000.00,
    "total_income": 8000.00,
    "total_expenses": 3000.00,
    "total_investments": 10000.00,
    "period": "month",
    "change_percentage": {
      "balance": 5.2,
      "income": 8.1,
      "expenses": -3.4,
      "investments": 12.7
    }
  },
  "recent_transactions": [...],
  "category_spending": [...],
  "monthly_trend": [...]
}
```

---

### GET /dashboard/summary
Resumo financeiro. 🔒 Requer autenticação.

---

### GET /dashboard/recent-transactions
Transações recentes. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| limit | int | 10 | Número de transações (1-50) |

---

### GET /dashboard/category-spending
Gastos por categoria. 🔒 Requer autenticação.

---

### GET /dashboard/monthly-trend
Tendência mensal. 🔒 Requer autenticação.

**Query Parameters:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| months | int | 6 | Número de meses (1-24) |

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Validação falhou |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro interno |

**Formato de Erro:**
```json
{
  "detail": "Mensagem de erro descritiva"
}
```
