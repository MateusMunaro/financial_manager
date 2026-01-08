/**
 * API Module Exports
 * 
 * Re-exporta todas as APIs e utilitários para uso consistente.
 */

// Cliente HTTP
export { apiClient, apiGet, apiPost, apiPut, apiPatch, apiDelete } from './client';

// APIs de recursos
export { expensesApi } from './expenses.api';
export { paymentMethodsApi } from './payment-methods.api';
export { recurringExpensesApi } from './recurring-expenses.api';
export { investmentsApi } from './investments.api';
export { authApi } from './auth.api';
export { dashboardApi } from './dashboard.api';

// Utilitários
export {
    toSnakeCase,
    toCamelCase,
    convertKeysToSnakeCase,
    convertKeysToCamelCase,
    safeParseWithFallback,
    safeParseArrayWithFallback,
    extractErrorMessage,
    formatErrorForLog,
    type ApiError,
} from './api-utils';
