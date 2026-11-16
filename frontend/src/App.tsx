import React, { useState, useEffect } from 'react';
import { SimulationRequest, SimulationResult, AiAnalysisResponse } from './types/simulation';
import { simulationService } from './services/simulationService';
import { SimulationForm } from './components/SimulationForm';
import { VerdictCard } from './components/VerdictCard';
import { EvolutionTable } from './components/EvolutionTable';
import { EvolutionChart } from './components/EvolutionChart';
import { GeminiAdvisorCard } from './components/GeminiAdvisorCard';
import { Wallet, Sparkles, HelpCircle, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';

const DEFAULT_SIMULATION: SimulationRequest = {
  valorTotal: 1200,
  descontoAVistaPercentual: 5,
  quantidadeParcelas: 10,
  comJuros: false,
  taxaJurosParcelamento: 0,
  percentualCdi: 105,
  taxaCdiAnual: 13.75, // Selic atual
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
        msg = 'O servidor backend ainda está iniciando. Aguarde alguns instantes e tente novamente.';
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
    <div className="min-h-screen bg-[#050507] text-zinc-100 pb-20 selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Red Glow no topo (inspirado no layout Nexora) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/12 blur-[140px] rounded-full pointer-events-none animate-ambient-glow"></div>

      {/* Navbar Superior Minimalista */}
      <header className="bg-[#08080c]/80 border-b border-zinc-800/60 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-red-600 to-rose-600 text-white rounded-xl shadow-lg shadow-red-600/25">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center space-x-2">
                <span>Calculadora de Economicidade</span>
              </span>
              <p className="text-[10px] font-medium text-zinc-400">
                À Vista com Desconto vs. CDB Mercado Pago
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-semibold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Selic 13,75% a.a.</span>
            </div>

            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-950/40 border border-red-800/40 text-red-300 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Google Gemini AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section (Formato Nexora com Tipografia de Alto Impacto) */}
      <section className="pt-10 pb-8 px-4 text-center max-w-4xl mx-auto space-y-4 relative z-10 animate-fade-up">
        {/* Pill de Destaque */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#13131a] border border-red-500/30 rounded-full text-xs font-medium text-zinc-300 shadow-inner">
          <span className="text-red-400">⚡ Nova Simulação</span>
          <span className="text-zinc-600">•</span>
          <span>Selic a 13,75% ao ano</span>
          <ArrowRight className="w-3 h-3 text-red-400" />
        </div>

        {/* Título com Destaque Vermelho */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          A Decisão Financeira Feita com <span className="text-red-500 underline decoration-red-500/30">Velocidade</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Compare instantaneamente o desconto à vista contra o rendimento diário de 105% do CDI no Mercado Pago e descubra o ponto de equilíbrio (*break-even*).
        </p>
      </section>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800/80 text-red-200 rounded-2xl text-xs sm:text-sm font-medium flex items-center space-x-3 shadow-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Formulário de Simulação */}
          <div className="lg:col-span-5 space-y-6 animate-fade-up-1">
            <SimulationForm
              initialValues={DEFAULT_SIMULATION}
              onSimulate={runSimulation}
              isLoading={isLoading}
            />

            {/* Dica Informativa com Visual Nexora */}
            <div className="bg-[#0e0e13]/80 border border-zinc-800/80 rounded-3xl p-5 text-xs text-zinc-300 space-y-2 shadow-lg backdrop-blur-md">
              <h4 className="font-bold text-red-400 flex items-center space-x-2 text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-red-400" />
                <span>Metodologia de Comparação</span>
              </h4>
              <p className="leading-relaxed text-zinc-400 text-xs">
                O comprador possui o montante total aplicado no CDB diário (105% do CDI com Selic base de 13,75% a.a.).
                A cada mês, o saldo rende juros líquidos reais (já descontado o IR regressivo de 22,5% a 15%) e debita-se a parcela.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Resultados, Gráficos e IA */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* 1. Card de Veredito */}
                <div className="animate-fade-up-1">
                  <VerdictCard result={result} />
                </div>

                {/* 2. Análise da IA Gemini */}
                <div className="animate-fade-up-2">
                  <GeminiAdvisorCard
                    analysis={aiAnalysis}
                    isLoading={isAiLoading}
                    onRefresh={() => runSimulation(DEFAULT_SIMULATION)}
                  />
                </div>

                {/* 3. Gráfico Interativo */}
                <div className="animate-fade-up-3">
                  <EvolutionChart entries={result.mesesEvolucao} />
                </div>

                {/* 4. Tabela Mês a Mês */}
                <div className="animate-fade-up-4">
                  <EvolutionTable
                    entries={result.mesesEvolucao}
                    valorTotalOriginal={result.valorTotalOriginal}
                  />
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-zinc-500 text-sm">
                Carregando simulação financeira...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
