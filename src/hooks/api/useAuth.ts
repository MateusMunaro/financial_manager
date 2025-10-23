import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth.api';
import {
  User,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@/lib/schemas/auth.schema';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const hasToken = authApi.isAuthenticated();
    console.log('🔍 CheckAuth - hasToken:', hasToken);
    
    if (!hasToken) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 CheckAuth - Buscando dados do usuário...');
      const userData = await authApi.me();
      console.log('✅ CheckAuth - Usuário encontrado:', userData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('❌ CheckAuth - Erro:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginInput): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔐 Iniciando login...');
      const response = await authApi.login(credentials);
      console.log('✅ Login bem-sucedido, resposta:', response);
      setUser(response.user);
      setIsAuthenticated(true);
      console.log('✅ Estado atualizado - isAuthenticated:', true, 'user:', response.user);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      console.error('❌ Erro no login:', err);
      console.error('❌ Mensagem de erro:', errorMessage);
      return false;
    } finally {
      setLoading(false);
      console.log('🔄 Loading finalizado');
    }
  };

  const register = async (data: RegisterInput): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      const response = await authApi.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      console.error('Error registering:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (data: UpdateProfileInput): Promise<boolean> => {
    try {
      setError(null);
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const changePassword = async (data: ChangePasswordInput): Promise<boolean> => {
    try {
      setError(null);
      await authApi.changePassword(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
      console.error('Error changing password:', err);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refetch: checkAuth,
  };
}
