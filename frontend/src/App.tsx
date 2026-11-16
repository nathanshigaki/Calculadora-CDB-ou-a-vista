import React, { useState, useEffect } from 'react';
import { SimulationRequest, SimulationResult, AiAnalysisResponse } from './types/simulation';
import { simulationService } from './services/simulationService';
import { SimulationForm } from './components/SimulationForm';
import { VerdictCard } from './components/VerdictCard';
import { EvolutionTable } from './components/EvolutionTable';
import { EvolutionChart } from './components/EvolutionChart';
import { GeminiAdvisorCard } from './components/GeminiAdvisorCard';
import { Wallet, Sparkles, HelpCircle, AlertTriangle } from 'lucide-react';

const DEFAULT_SIMULATION: SimulationRequest = {
  valorTotal: 1200,
  descontoAVistaPercentual: 5,
  quantidadeParcelas: 10,
  comJuros: false,
  taxaJurosParcelamento: 0,
  percentualCdi: 105,
  taxaCdiAnual: 13.75, // Atualizado para Selic atual
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
      let msg = err.message || 'Erro inesperado ao calcular a simulação.';
      if (msg.includes('<!DOCTYPE') || msg.includes('502') || msg.includes('unavailable')) {
        msg = 'O servidor backend ainda está iniciando ou indisponível. Aguarde alguns segundos e tente novamente.';
      }
      setError(msg);
      setIsLoading(false);
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(DEFAULT_SIMULATION);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-sky-500 selection:text-white">
      {/* Navbar Superior */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-sky-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Calculadora de Economicidade</span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 text-sky-400 font-semibold rounded-md">
                  Selic 13,75% a.a.
                </span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                À Vista com Desconto vs. CDB Diário Mercado Pago (105% do CDI)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 rounded-lg text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Spring Boot + Spring AI + Gemini</span>
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-2xl text-sm font-medium flex items-center space-x-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2 shadow-sm">
              <h4 className="font-bold text-sky-400 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>Como funciona o cálculo?</span>
              </h4>
              <p className="leading-relaxed text-slate-400">
                Consideramos que o comprador possui o montante total da compra aplicado no CDB diário (105% do CDI Mercado Pago, com Selic base de 13,75% a.a.).
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
              <div className="py-20 text-center text-slate-500">
                Carregando simulação financeira...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
