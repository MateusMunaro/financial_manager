'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

export default function RegisterPage() {
  const { getThemeColor } = useTheme();
  const router = useRouter();
  const { register, isAuthenticated, loading, error } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    
    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setRegisterError('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setRegisterError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setRegisterError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!acceptedTerms) {
      setRegisterError('Você deve aceitar os termos de uso');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (success) {
        router.push('/dashboard');
      } else {
        setRegisterError(error || 'Erro ao criar conta. Tente novamente.');
      }
    } catch (err) {
      setRegisterError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: getThemeColor(colors.brand.primary) }}
          />
          <p style={{ color: getThemeColor(colors.text.secondary) }}>
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        className="max-w-md w-full space-y-8 p-8 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: getThemeColor(colors.background.paper),
          border: `1px solid ${getThemeColor(colors.border.default)}`,
        }}
      >
        <div className="text-center">
          <h2
            className="text-4xl font-bold mb-2"
            style={{ color: getThemeColor(colors.text.primary) }}
          >
            Criar Conta
          </h2>
          <p
            className="text-lg"
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            Registre-se para começar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {registerError && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: getThemeColor(colors.semantic.negative) + '20',
                border: `1px solid ${getThemeColor(colors.semantic.negative)}`,
              }}
            >
              <p
                className="text-sm"
                style={{ color: getThemeColor(colors.semantic.negative) }}
              >
                {registerError}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome"
              required
              fullWidth
              disabled={isSubmitting}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              required
              fullWidth
              disabled={isSubmitting}
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Sua senha (mínimo 6 caracteres)"
              required
              fullWidth
              disabled={isSubmitting}
            />

            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirme sua senha"
              required
              fullWidth
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 rounded mt-1"
              style={{
                accentColor: getThemeColor(colors.brand.primary),
              }}
              disabled={isSubmitting}
            />
            <label
              htmlFor="terms"
              className="ml-2 text-sm"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Eu aceito os{' '}
              <Link
                href="#"
                className="font-medium hover:underline"
                style={{ color: getThemeColor(colors.brand.primary) }}
              >
                termos de uso
              </Link>
              {' '}e a{' '}
              <Link
                href="#"
                className="font-medium hover:underline"
                style={{ color: getThemeColor(colors.brand.primary) }}
              >
                política de privacidade
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <div className="text-center">
            <span
              className="text-sm"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="font-medium hover:underline"
                style={{ color: getThemeColor(colors.brand.primary) }}
              >
                Entrar
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
