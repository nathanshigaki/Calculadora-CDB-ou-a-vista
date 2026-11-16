import React, { useState, useEffect } from 'react';
import { SimulationRequest, SimulationResult, AiAnalysisResponse } from './types/simulation';
import { simulationService } from './services/simulationService';
import { SimulationForm } from './components/SimulationForm';
import { VerdictCard } from './components/VerdictCard';
import { EvolutionTable } from './components/EvolutionTable';
import { EvolutionChart } from './components/EvolutionChart';
import { GeminiAdvisorCard } from './components/GeminiAdvisorCard';
import { Wallet, Sparkles, HelpCircle, Layers } from 'lucide-react';

const DEFAULT_SIMULATION: SimulationRequest = {
  valorTotal: 1200,
  descontoAVistaPercentual: 5,
  quantidadeParcelas: 10,
  comJuros: false,
  taxaJurosParcelamento: 0,
  percentualCdi: 105,
  taxaCdiAnual: 11.25,
  considerarIrRegressivo: true,
};

export default function App() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (request: SimulationRequest) => {
    setIsLoading(true);
    setIsAiLoading(true);
    setError(null);

    try {
      // 1. Cálculo determinístico (instantâneo)
      const res = await simulationService.calculate(request);
      setResult(res);
      setIsLoading(false);

      // 2. Análise do Gemini
      try {
        const aiRes = await simulationService.getAiAnalysis(res);
        setAiAnalysis(aiRes);
      } catch (aiErr: any) {
        console.warn('Erro ao obter análise do Gemini:', aiErr);
      } finally {
        setIsAiLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro inesperado ao calcular a simulação.');
      setIsLoading(false);
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(DEFAULT_SIMULATION);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Navbar Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-800">
                Calculadora de Economicidade
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                À Vista com Desconto vs. CDB Mercado Pago
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Spring Boot + Spring AI + Gemini</span>
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Formulário de Simulação */}
          <div className="lg:col-span-5 space-y-6">
            <SimulationForm
              initialValues={DEFAULT_SIMULATION}
              onSimulate={runSimulation}
              isLoading={isLoading}
            />

            {/* Dica Informativa */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-5 text-xs text-sky-900 space-y-2">
              <h4 className="font-bold flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Como funciona o cálculo?</span>
              </h4>
              <p className="leading-relaxed text-sky-800">
                Consideramos que o comprador possui o montante total da compra aplicado no CDB diário (ex: 105% do CDI Mercado Pago).
                A cada mês, o saldo rende juros líquidos (já deduzido o IR regressivo de 22,5% a 15%) e deduz-se o valor da parcela.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Resultados, Gráficos e IA */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* 1. Card de Veredito */}
                <VerdictCard result={result} />

                {/* 2. Análise da IA Gemini */}
                <GeminiAdvisorCard
                  analysis={aiAnalysis}
                  isLoading={isAiLoading}
                  onRefresh={() => runSimulation(DEFAULT_SIMULATION)}
                />

                {/* 3. Gráfico Interativo */}
                <EvolutionChart entries={result.mesesEvolucao} />

                {/* 4. Tabela Mês a Mês */}
                <EvolutionTable
                  entries={result.mesesEvolucao}
                  valorTotalOriginal={result.valorTotalOriginal}
                />
              </>
            ) : (
              <div className="py-20 text-center text-slate-400">
                Carregando simulação financeira...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
