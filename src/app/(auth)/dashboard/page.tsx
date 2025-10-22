'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    WalletIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ComponentType<{ className?: string }>;
    isPositive?: boolean;
}

function StatCard({ title, value, change, icon: Icon, isPositive = true }: StatCardProps) {
    const { getThemeColor } = useTheme();

    return (
        <Card elevated>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p
                        className="text-sm font-medium mb-1"
                        style={{ color: getThemeColor(colors.text.secondary) }}
                    >
                        {title}
                    </p>
                    <p
                        className="text-3xl font-bold mb-2"
                        style={{ color: getThemeColor(colors.text.primary) }}
                    >
                        {value}
                    </p>
                    <div className="flex items-center gap-1">
                        {isPositive ? (
                            <ArrowTrendingUpIcon
                                className="h-4 w-4"
                                style={{ color: getThemeColor(colors.semantic.positive) }}
                            />
                        ) : (
                            <ArrowTrendingDownIcon
                                className="h-4 w-4"
                                style={{ color: getThemeColor(colors.semantic.negative) }}
                            />
                        )}
                        <span
                            className="text-sm font-medium"
                            style={{
                                color: isPositive
                                    ? getThemeColor(colors.semantic.positive)
                                    : getThemeColor(colors.semantic.negative),
                            }}
                        >
                            {change}
                        </span>
                        <span
                            className="text-sm"
                            style={{ color: getThemeColor(colors.text.secondary) }}
                        >
                            vs mês anterior
                        </span>
                    </div>
                </div>
                <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: getThemeColor(colors.brand.primary) + '20' }}
                >
                    <Icon
                        className="h-8 w-8"
                        style={{ color: getThemeColor(colors.brand.primary) }}
                    />
                </div>
            </div>
        </Card>
    );
}

export default function DashboardPage() {
    const { getThemeColor } = useTheme();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1
                    className="text-3xl font-bold mb-2"
                    style={{ color: getThemeColor(colors.text.primary) }}
                >
                    Dashboard
                </h1>
                <p
                    className="text-lg"
                    style={{ color: getThemeColor(colors.text.secondary) }}
                >
                    Visão geral das suas finanças
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Saldo Total"
                    value="R$ 12.450,00"
                    change="+15,3%"
                    icon={WalletIcon}
                    isPositive={true}
                />
                <StatCard
                    title="Receitas"
                    value="R$ 8.500,00"
                    change="+8,2%"
                    icon={ArrowTrendingUpIcon}
                    isPositive={true}
                />
                <StatCard
                    title="Despesas"
                    value="R$ 3.250,00"
                    change="-5,4%"
                    icon={ArrowTrendingDownIcon}
                    isPositive={true}
                />
                <StatCard
                    title="Investimentos"
                    value="R$ 45.200,00"
                    change="+12,7%"
                    icon={BanknotesIcon}
                    isPositive={true}
                />
            </div>

            {/* Charts and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Expenses */}
                <Card elevated>
                    <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: getThemeColor(colors.text.primary) }}
                    >
                        Gastos Recentes
                    </h2>
                    <div className="space-y-3">
                        {[
                            { name: 'Supermercado', value: 'R$ 450,00', date: '20/10/2025', category: 'Alimentação' },
                            { name: 'Netflix', value: 'R$ 39,90', date: '19/10/2025', category: 'Entretenimento' },
                            { name: 'Combustível', value: 'R$ 250,00', date: '18/10/2025', category: 'Transporte' },
                            { name: 'Restaurante', value: 'R$ 120,00', date: '17/10/2025', category: 'Alimentação' },
                        ].map((expense, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg"
                                style={{
                                    backgroundColor: getThemeColor(colors.background.elevated),
                                }}
                            >
                                <div className="flex-1">
                                    <p
                                        className="font-medium"
                                        style={{ color: getThemeColor(colors.text.primary) }}
                                    >
                                        {expense.name}
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: getThemeColor(colors.text.secondary) }}
                                    >
                                        {expense.category} • {expense.date}
                                    </p>
                                </div>
                                <p
                                    className="font-bold"
                                    style={{ color: getThemeColor(colors.semantic.negative) }}
                                >
                                    {expense.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Monthly Summary */}
                <Card elevated>
                    <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: getThemeColor(colors.text.primary) }}
                    >
                        Resumo Mensal
                    </h2>
                    <div className="space-y-4">
                        {[
                            { category: 'Alimentação', value: 1250, max: 2000, color: colors.brand.primary },
                            { category: 'Transporte', value: 800, max: 1000, color: colors.brand.secondary },
                            { category: 'Entretenimento', value: 450, max: 600, color: colors.brand.accent },
                            { category: 'Saúde', value: 320, max: 500, color: colors.semantic.positive },
                        ].map((item, index) => {
                            const percentage = (item.value / item.max) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: getThemeColor(colors.text.primary) }}
                                        >
                                            {item.category}
                                        </span>
                                        <span
                                            className="text-sm"
                                            style={{ color: getThemeColor(colors.text.secondary) }}
                                        >
                                            R$ {item.value} / R$ {item.max}
                                        </span>
                                    </div>
                                    <div
                                        className="h-2 rounded-full overflow-hidden"
                                        style={{ backgroundColor: getThemeColor(colors.background.elevated) }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: getThemeColor(item.color),
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
