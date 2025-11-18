'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

export default function LoginPage() {
    const { getThemeColor } = useTheme();
    const router = useRouter();
    const { login, isAuthenticated, loading, error } = useAuthContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    // Redirecionar se já estiver autenticado
    useEffect(() => {
        console.log('🔄 Login Page - useEffect executado', { isAuthenticated, loading });
        if (isAuthenticated && !loading) {
            console.log('✅ Usuário autenticado, redirecionando para dashboard...');
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        
        console.log('📝 Formulário submetido', { email: formData.email });
        
        if (!formData.email || !formData.password) {
            setLoginError('Por favor, preencha todos os campos');
            return;
        }

        setIsSubmitting(true);
        
        try {
            console.log('🔐 Chamando função login...');
            const success = await login({
                email: formData.email,
                password: formData.password,
            });

            console.log('🎯 Resultado do login:', success);

            if (success) {
                console.log('✅ Login bem-sucedido! Redirecionando...');
                router.push('/dashboard');
            } else {
                console.log('❌ Login falhou');
                setLoginError(error || 'Erro ao fazer login. Verifique suas credenciais.');
            }
        } catch (err) {
            console.error('❌ Exceção ao fazer login:', err);
            setLoginError('Erro ao fazer login. Tente novamente.');
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
                        Bem-vindo!
                    </h2>
                    <p
                        className="text-lg"
                        style={{ color: getThemeColor(colors.text.secondary) }}
                    >
                        Entre para gerenciar suas finanças
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {loginError && (
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
                                {loginError}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
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
                            placeholder="Sua senha"
                            required
                            fullWidth
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded"
                                style={{
                                    accentColor: getThemeColor(colors.brand.primary),
                                }}
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 text-sm"
                                style={{ color: getThemeColor(colors.text.secondary) }}
                            >
                                Lembrar-me
                            </label>
                        </div>

                        <Link
                            href="#"
                            className="text-sm font-medium hover:underline"
                            style={{ color: getThemeColor(colors.brand.primary) }}
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <div className="text-center">
                        <span
                            className="text-sm"
                            style={{ color: getThemeColor(colors.text.secondary) }}
                        >
                            Não tem uma conta?{' '}
                            <Link
                                href="/register"
                                className="font-medium hover:underline"
                                style={{ color: getThemeColor(colors.brand.primary) }}
                            >
                                Registre-se
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
