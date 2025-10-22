'use client';

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/styles/colors';
import { Card } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SettingsPage() {
  const { getThemeColor, theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Configurações
        </h1>
        <p
          className="text-lg"
          style={{ color: getThemeColor(colors.text.secondary) }}
        >
          Personalize sua experiência
        </p>
      </div>

      {/* Appearance */}
      <Card elevated>
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Aparência
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p
              className="font-medium"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              Tema
            </p>
            <p
              className="text-sm"
              style={{ color: getThemeColor(colors.text.secondary) }}
            >
              Escolha entre o tema claro ou escuro
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Profile */}
      <Card elevated>
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Perfil
        </h2>
        
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              Nome
            </label>
            <input
              type="text"
              defaultValue="Usuário"
              className="w-full px-4 py-2 rounded-lg"
              style={{
                backgroundColor: getThemeColor(colors.background.default),
                color: getThemeColor(colors.text.primary),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: getThemeColor(colors.text.primary) }}
            >
              E-mail
            </label>
            <input
              type="email"
              defaultValue="usuario@email.com"
              className="w-full px-4 py-2 rounded-lg"
              style={{
                backgroundColor: getThemeColor(colors.background.default),
                color: getThemeColor(colors.text.primary),
                border: `1px solid ${getThemeColor(colors.border.default)}`,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card elevated>
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Notificações
        </h2>
        
        <div className="space-y-3">
          {[
            { label: 'Alertas de gastos', description: 'Receber alertas quando ultrapassar o orçamento' },
            { label: 'Relatórios mensais', description: 'Receber resumo mensal das finanças' },
            { label: 'Dicas de investimento', description: 'Receber sugestões personalizadas' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                backgroundColor: getThemeColor(colors.background.elevated),
              }}
            >
              <div>
                <p
                  className="font-medium"
                  style={{ color: getThemeColor(colors.text.primary) }}
                >
                  {item.label}
                </p>
                <p
                  className="text-sm"
                  style={{ color: getThemeColor(colors.text.secondary) }}
                >
                  {item.description}
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded"
                style={{
                  accentColor: getThemeColor(colors.brand.primary),
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* About */}
      <Card elevated>
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: getThemeColor(colors.text.primary) }}
        >
          Sobre
        </h2>
        
        <div className="space-y-2">
          <p
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            <span className="font-medium" style={{ color: getThemeColor(colors.text.primary) }}>
              Versão:
            </span>{' '}
            1.0.0
          </p>
          <p
            style={{ color: getThemeColor(colors.text.secondary) }}
          >
            <span className="font-medium" style={{ color: getThemeColor(colors.text.primary) }}>
              Desenvolvido por:
            </span>{' '}
            FinanceApp Team
          </p>
        </div>
      </Card>
    </div>
  );
}
