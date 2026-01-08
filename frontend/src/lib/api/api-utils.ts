/**
 * API Utilities
 * 
 * Funções utilitárias para manipulação de dados da API,
 * incluindo conversão de formatos e validação de respostas.
 */

import { z } from 'zod';

// ============================================
// CONVERSÃO DE CASE
// ============================================

/**
 * Converte uma string de camelCase para snake_case
 */
export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converte uma string de snake_case para camelCase
 */
export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converte todas as chaves de um objeto de camelCase para snake_case (recursivo)
 */
export function convertKeysToSnakeCase<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToSnakeCase(item)) as T;
    }

    if (obj instanceof Date) {
        return obj.toISOString() as unknown as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const value = (obj as Record<string, unknown>)[key];

            // Pular valores undefined
            if (value === undefined) return acc;

            const snakeKey = toSnakeCase(key);

            // Não converter valores primitivos (podem ser enums em kebab-case)
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
                (acc as Record<string, unknown>)[snakeKey] = value;
            } else {
                (acc as Record<string, unknown>)[snakeKey] = convertKeysToSnakeCase(value);
            }

            return acc;
        }, {} as Record<string, unknown>) as T;
    }

    return obj;
}

/**
 * Converte todas as chaves de um objeto de snake_case para camelCase (recursivo)
 */
export function convertKeysToCamelCase<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToCamelCase(item)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = toCamelCase(key);
            const value = (obj as Record<string, unknown>)[key];

            // Não converter valores primitivos
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
                (acc as Record<string, unknown>)[camelKey] = value;
            } else {
                (acc as Record<string, unknown>)[camelKey] = convertKeysToCamelCase(value);
            }

            return acc;
        }, {} as Record<string, unknown>) as T;
    }

    return obj;
}

// ============================================
// VALIDAÇÃO COM ZOD
// ============================================

/**
 * Opções para validação segura
 */
interface SafeParseOptions {
    /** Se true, loga erros no console */
    logErrors?: boolean;
    /** Contexto para mensagens de erro */
    context?: string;
}

/**
 * Valida dados com Zod de forma segura, retornando os dados originais em caso de erro
 * 
 * @param schema Schema Zod para validação
 * @param data Dados a serem validados
 * @param options Opções de validação
 * @returns Dados validados ou dados originais em caso de erro
 */
export function safeParseWithFallback<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    options: SafeParseOptions = {}
): T {
    const { logErrors = true, context = 'API Response' } = options;

    const result = schema.safeParse(data);

    if (result.success) {
        return result.data;
    }

    if (logErrors) {
        console.warn(`⚠️ [${context}] Validation failed, using raw data:`, {
            errors: result.error.errors,
            data,
        });
    }

    // Retorna os dados originais como fallback
    return data as T;
}

/**
 * Valida um array de dados com Zod de forma segura
 */
export function safeParseArrayWithFallback<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    options: SafeParseOptions = {}
): T[] {
    // Garante que data é um array
    const arrayData = Array.isArray(data) ? data : [];

    return arrayData.map((item, index) =>
        safeParseWithFallback(schema, item, {
            ...options,
            context: `${options.context || 'API Response'}[${index}]`,
        })
    );
}

// ============================================
// TRATAMENTO DE ERROS
// ============================================

/**
 * Interface para resposta de erro da API
 */
export interface ApiError {
    message: string;
    status: number;
    detail?: string;
}

/**
 * Extrai mensagem de erro de uma resposta da API
 */
export function extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        // Verificar se é erro do Axios
        const axiosError = error as { response?: { data?: { detail?: string; message?: string }; status?: number } };

        if (axiosError.response?.data?.detail) {
            return axiosError.response.data.detail;
        }

        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }

        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Erro desconhecido';
}

/**
 * Formata erro para log
 */
export function formatErrorForLog(error: unknown, context: string): object {
    const axiosError = error as {
        response?: {
            data?: unknown;
            status?: number;
            statusText?: string;
        };
        config?: {
            url?: string;
            method?: string;
        };
    };

    return {
        context,
        message: extractErrorMessage(error),
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        responseData: axiosError.response?.data,
    };
}
