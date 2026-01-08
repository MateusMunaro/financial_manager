/**
 * Auth API
 * 
 * Funções para comunicação com os endpoints de autenticação.
 */

import { apiClient } from './client';
import { safeParseWithFallback } from './api-utils';
import {
  RegisterInput,
  LoginInput,
  User,
  AuthResponse,
  UpdateProfileInput,
  ChangePasswordInput,
  userSchema,
  authResponseSchema,
} from '../schemas/auth.schema';

const ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  REFRESH_TOKEN: '/auth/refresh',
};

/**
 * Salva tokens de autenticação no localStorage
 */
function saveAuthTokens(authData: AuthResponse): void {
  localStorage.setItem('auth_token', authData.token);
  if (authData.refreshToken) {
    localStorage.setItem('refresh_token', authData.refreshToken);
  }
}

/**
 * Remove tokens de autenticação do localStorage
 */
function clearAuthTokens(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
}

export const authApi = {
  /**
   * Registrar novo usuário
   */
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.REGISTER, {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    const authData = safeParseWithFallback(authResponseSchema, response.data, {
      context: 'authApi.register',
    });

    saveAuthTokens(authData);
    return authData;
  },

  /**
   * Fazer login
   */
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.LOGIN, data);
    const authData = safeParseWithFallback(authResponseSchema, response.data, {
      context: 'authApi.login',
    });

    saveAuthTokens(authData);
    return authData;
  },

  /**
   * Fazer logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.LOGOUT);
    } finally {
      clearAuthTokens();
    }
  },

  /**
   * Buscar dados do usuário atual
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get(ENDPOINTS.ME);
    return safeParseWithFallback(userSchema, response.data, {
      context: 'authApi.me',
    });
  },

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: async (data: UpdateProfileInput): Promise<User> => {
    const response = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, data);
    return safeParseWithFallback(userSchema, response.data, {
      context: 'authApi.updateProfile',
    });
  },

  /**
   * Alterar senha
   */
  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  },

  /**
   * Renovar token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post(ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    const authData = safeParseWithFallback(authResponseSchema, response.data, {
      context: 'authApi.refreshToken',
    });

    saveAuthTokens(authData);
    return authData;
  },

  /**
   * Verificar se está autenticado
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },
};
