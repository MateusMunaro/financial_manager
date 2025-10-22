'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { getThemeColor } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto, redireciona direto para o dashboard sem validação
    router.push('/dashboard');
  };

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
          <div className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome"
              fullWidth
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              fullWidth
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Sua senha"
              fullWidth
            />

            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirme sua senha"
              fullWidth
            />
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 rounded mt-1"
              style={{
                accentColor: getThemeColor(colors.brand.primary),
              }}
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
          >
            Criar conta
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
