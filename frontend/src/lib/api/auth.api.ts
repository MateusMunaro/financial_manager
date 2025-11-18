import { apiClient } from './client';
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

export const authApi = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.REGISTER, data);
    const authData = authResponseSchema.parse(response.data);
    
    // Salvar token no localStorage
    localStorage.setItem('auth_token', authData.token);
    if (authData.refreshToken) {
      localStorage.setItem('refresh_token', authData.refreshToken);
    }
    
    return authData;
  },

  // Fazer login
  login: async (data: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(ENDPOINTS.LOGIN, data);
      const authData = authResponseSchema.parse(response.data);
      
      // Salvar token no localStorage
      localStorage.setItem('auth_token', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }
      
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      throw error;
    }
  },

  // Fazer logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.LOGOUT);
    } finally {
      // Sempre remover tokens, mesmo se a requisição falhar
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Buscar dados do usuário atual
  me: async (): Promise<User> => {
    const response = await apiClient.get(ENDPOINTS.ME);
    return userSchema.parse(response.data);
  },

  // Atualizar perfil do usuário
  updateProfile: async (data: UpdateProfileInput): Promise<User> => {
    const response = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, data);
    return userSchema.parse(response.data);
  },

  // Alterar senha
  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, data);
  },

  // Renovar token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post(ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    const authData = authResponseSchema.parse(response.data);
    
    // Atualizar tokens
    localStorage.setItem('auth_token', authData.token);
    if (authData.refreshToken) {
      localStorage.setItem('refresh_token', authData.refreshToken);
    }
    
    return authData;
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};
