# 🧪 Teste de Despesa Recorrente

## Dados de Teste (Frontend)

Quando você preencher o formulário com:

```javascript
{
  name: "Faculdade",
  value: 850,
  category: "Estudos",
  frequency: "monthly",
  dayOfMonth: 1,
  paymentMethod: "pix",
  startDate: "2025-11-01",
  isActive: true,
  description: "Assinatura mensal do Netflix"
}
```

## Payload Enviado (após conversão)

O sistema irá converter para:

```json
{
  "name": "Faculdade",
  "value": 850,
  "category": "Estudos",
  "frequency": "monthly",
  "day_of_month": 1,
  "payment_method": "pix",
  "start_date": "2025-11-01T00:00:00.000Z",
  "is_active": true,
  "description": "Assinatura mensal do Netflix"
}
```

## ✅ Verificações

1. **Formato de data**: Convertido para ISO completo com `T00:00:00`
2. **snake_case**: Todos os campos convertidos (day_of_month, payment_method, etc)
3. **Enums**: Mantidos como estão (monthly, pix)
4. **Valores opcionais**: day_of_week será undefined para frequency="monthly"

## 🔍 Como Debugar

Abra o Console do Navegador (F12) e procure por:

- `📤 Enviando dados para o backend:` - Mostra o payload exato
- `📥 Resposta do backend:` - Mostra o que voltou
- `❌ Erro ao criar despesa recorrente:` - Se houver erro

## 🐛 Problemas Comuns

### 1. Campo `day_of_month` faltando
**Causa**: Despesa mensal sem o dia especificado
**Solução**: Garantir que dayOfMonth é preenchido no formulário

### 2. Formato de data incorreto
**Causa**: Data sem horário (2025-11-01)
**Solução**: Agora converte automaticamente para 2025-11-01T00:00:00.000Z

### 3. Enum inválido
**Causa**: payment_method ou frequency com valor errado
**Solução**: Valores permitidos:
- **frequency**: monthly, yearly, weekly
- **payment_method**: credit-card, debit-card, pix, bank-slip, cash, other

## 🧪 Teste Rápido via Console

Abra o console e cole:

```javascript
// Teste direto da API
const testData = {
  name: "Teste Console",
  value: 100,
  category: "Teste",
  frequency: "monthly",
  dayOfMonth: 15,
  paymentMethod: "pix",
  startDate: new Date("2025-11-15").toISOString(),
  isActive: true,
  description: "Teste via console"
};

// Não execute isso - apenas para referência de estrutura
console.log('Dados de teste:', testData);
```
