/**
 * API Client
 * 
 * Cliente HTTP configurado com axios para comunicação com o backend.
 * Inclui interceptors para autenticação e conversão automática de case.
 */

import axios from 'axios';
import { convertKeysToCamelCase, convertKeysToSnakeCase } from './api-utils';

// Configuração do cliente HTTP
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos
});

// Interceptor para adicionar token de autenticação e converter request body
apiClient.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Converter body de camelCase para snake_case
    if (config.data && typeof config.data === 'object') {
      config.data = convertKeysToSnakeCase(config.data);
    }

    // Converter params de camelCase para snake_case
    if (config.params && typeof config.params === 'object') {
      config.params = convertKeysToSnakeCase(config.params);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros e conversão de snake_case para camelCase
apiClient.interceptors.response.use(
  (response) => {
    // Converter as chaves da resposta de snake_case para camelCase
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      // Só redireciona se não estiver já na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Wrapper para requisições GET com tipagem
 */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
}

/**
 * Wrapper para requisições POST com tipagem
 */
export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, data);
  return response.data;
}

/**
 * Wrapper para requisições PUT com tipagem
 */
export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<T>(url, data);
  return response.data;
}

/**
 * Wrapper para requisições PATCH com tipagem
 */
export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
}

/**
 * Wrapper para requisições DELETE com tipagem
 */
export async function apiDelete<T = void>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}
