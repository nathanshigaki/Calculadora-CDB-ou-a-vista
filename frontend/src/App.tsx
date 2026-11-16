import React, { useState, useEffect } from 'react';
import { SimulationRequest, SimulationResult, AiAnalysisResponse } from './types/simulation';
import { simulationService } from './services/simulationService';
import { SimulationForm } from './components/SimulationForm';
import { VerdictCard } from './components/VerdictCard';
import { EvolutionTable } from './components/EvolutionTable';
import { EvolutionChart } from './components/EvolutionChart';
import { GeminiAdvisorCard } from './components/GeminiAdvisorCard';
import { Wallet, Sparkles, HelpCircle, AlertTriangle, Table2, Bot, Columns } from 'lucide-react';

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

type ViewMode = 'table' | 'ai' | 'both';

export default function App() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewMode>('both');
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#050507] text-zinc-100 pb-12 selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Red Glow sutil de topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none animate-ambient-glow"></div>

      {/* Header Executivo Compacto (60px) */}
      <header className="bg-[#08080c]/85 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-gradient-to-tr from-red-600 to-rose-600 text-white rounded-xl shadow-md shadow-red-600/30">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white flex items-center space-x-1.5">
                <span>Calculadora de Economicidade</span>
              </span>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                À Vista com Desconto vs. CDB 105% Mercado Pago
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[11px] font-semibold text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Selic 13,75% a.a.</span>
            </div>

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-950/40 border border-red-800/40 text-red-300 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>Gemini AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 relative z-10">
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-200 rounded-xl text-xs font-medium flex items-center space-x-2.5 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. LINHA SUPERIOR: Veredito & 3 KPIs (Tudo visível no topo sem rolagem) */}
        {result && (
          <div className="animate-fade-up">
            <VerdictCard result={result} />
          </div>
        )}

        {/* 2. GRID PRINCIPAL (4 Colunas Form | 8 Colunas Gráfico + Tabela/IA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Coluna Esquerda (4 cols): Formulário de Parâmetros */}
          <div className="lg:col-span-4 space-y-3 animate-fade-up-1">
            <SimulationForm
              initialValues={DEFAULT_SIMULATION}
              onSimulate={runSimulation}
              isLoading={isLoading}
            />

            {/* Metodologia Compacta / Sanfona */}
            <div className="bg-[#0e0e13]/80 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-400 shadow-md">
              <button
                type="button"
                onClick={() => setShowMethodology(!showMethodology)}
                className="w-full flex items-center justify-between text-left font-bold text-red-400 hover:text-red-300 text-[11px] uppercase tracking-wider"
              >
                <span className="flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Metodologia & Premissas</span>
                </span>
                <span className="text-zinc-500 font-normal">{showMethodology ? '▲' : '▼'}</span>
              </button>

              {showMethodology && (
                <p className="mt-2 text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2 animate-fade-up">
                  O valor total fica aplicado no CDB diário (105% do CDI, Selic 13,75% a.a.). A cada mês, o saldo rende juros líquidos reais (descontado IR regressivo de 22,5% a 15%) e debita-se a parcela mensal.
                </p>
              )}
            </div>
          </div>

          {/* Coluna Direita (8 cols): Gráfico de Evolução + Tabs (Tabela / Consultor IA) */}
          <div className="lg:col-span-8 space-y-4 animate-fade-up-2">
            {result ? (
              <>
                {/* Gráfico de Evolução */}
                <EvolutionChart entries={result.mesesEvolucao} />

                {/* Controles de Visualização: Abas Tabela / IA / Ambos */}
                <div className="flex items-center justify-between pt-1">
                  <div className="inline-flex p-1 bg-[#121218] border border-zinc-800 rounded-xl space-x-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('both')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                        activeTab === 'both'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Lado a Lado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('ai')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                        activeTab === 'ai'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Consultor Gemini AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('table')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                        activeTab === 'table'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Table2 className="w-3.5 h-3.5" />
                      <span>Tabela Mês a Mês</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-zinc-500 hidden sm:inline">
                    {result.quantidadeParcelas} parcelas calculadas
                  </span>
                </div>

                {/* Exibição dos Componentes Conforme a Aba Selecionada */}
                {activeTab === 'both' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    <GeminiAdvisorCard
                      analysis={aiAnalysis}
                      isLoading={isAiLoading}
                      onRefresh={() => runSimulation(DEFAULT_SIMULATION)}
                    />
                    <EvolutionTable
                      entries={result.mesesEvolucao}
                      valorTotalOriginal={result.valorTotalOriginal}
                    />
                  </div>
                ) : activeTab === 'ai' ? (
                  <GeminiAdvisorCard
                    analysis={aiAnalysis}
                    isLoading={isAiLoading}
                    onRefresh={() => runSimulation(DEFAULT_SIMULATION)}
                  />
                ) : (
                  <EvolutionTable
                    entries={result.mesesEvolucao}
                    valorTotalOriginal={result.valorTotalOriginal}
                  />
                )}
              </>
            ) : (
              <div className="py-20 text-center text-zinc-500 text-xs">
                Carregando simulação...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
