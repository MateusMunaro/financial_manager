'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const { getThemeColor } = useTheme();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
                    <div className="space-y-4">
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
                    >
                        Entrar
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
