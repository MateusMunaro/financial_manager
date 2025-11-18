export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Sobre o Gerenciador Financeiro
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Uma solução completa para gerenciar suas finanças pessoais
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-indigo-600 text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Controle Total
          </h3>
          <p className="text-gray-600">
            Acompanhe todas as suas receitas e despesas em um só lugar
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-indigo-600 text-3xl mb-4">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Relatórios Detalhados
          </h3>
          <p className="text-gray-600">
            Visualize gráficos e relatórios para entender seus gastos
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-indigo-600 text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Metas Financeiras
          </h3>
          <p className="text-gray-600">
            Defina e acompanhe suas metas de economia e investimento
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Por que usar nosso sistema?
        </h2>
        <div className="prose prose-indigo">
          <p className="text-gray-600">
            O Gerenciador Financeiro foi desenvolvido para ajudar você a ter 
            controle total sobre suas finanças pessoais. Com uma interface 
            intuitiva e recursos poderosos, você pode:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>✓ Registrar todas as suas transações financeiras</li>
            <li>✓ Categorizar despesas e receitas</li>
            <li>✓ Visualizar relatórios e gráficos detalhados</li>
            <li>✓ Definir orçamentos por categoria</li>
            <li>✓ Acompanhar o progresso de suas metas financeiras</li>
            <li>✓ Exportar seus dados para análise</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
