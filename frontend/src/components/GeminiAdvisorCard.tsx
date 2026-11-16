import React from 'react';
import { AiAnalysisResponse } from '../types/simulation';
import { Sparkles, Bot, CheckCircle, RefreshCw } from 'lucide-react';

interface GeminiAdvisorCardProps {
  analysis: AiAnalysisResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const GeminiAdvisorCard: React.FC<GeminiAdvisorCardProps> = ({
  analysis,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="bg-[#0e0e13]/90 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800/80 p-4 md:p-5 text-zinc-100 relative overflow-hidden transition-all duration-300 hover:border-zinc-700/80 flex flex-col h-full">
      {/* Glow de fundo */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-red-600 to-rose-600 text-white rounded-xl shadow-lg shadow-red-600/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm md:text-base font-bold tracking-tight text-white">
                Consultor Inteligente Gemini
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-red-950/60 text-red-400 border border-red-800/50 rounded-full">
                Google AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Cálculo do ponto de equilíbrio (Break-Even) e recomendações financeiras
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Recalcular análise com IA"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition duration-200 disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-2.5 flex-1">
          <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-zinc-400 font-medium">Consultando IA do Gemini...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
          {/* Card de Ponto de Equilíbrio (Break-Even) */}
          <div className="bg-[#14141c]/90 border border-red-500/20 rounded-xl p-3 shadow-inner">
            <div className="flex items-center space-x-2 text-red-400 mb-1">
              <Bot className="w-3.5 h-3.5" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">
                Ponto de Equilíbrio (Break-Even Point)
              </h4>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed font-normal">
              {analysis.pontoDeEquilibrioExplicado}
            </p>
          </div>

          {/* Análise Detalhada */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Parecer Analítico
            </h4>
            <div className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-zinc-800/80">
              {analysis.analiseDetalhada}
            </div>
          </div>

          {/* Recomendações Práticas */}
          {analysis.recomendacoesEstrategicas && analysis.recomendacoesEstrategicas.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Recomendações Estratégicas
              </h4>
              <div className="space-y-1.5">
                {analysis.recomendacoesEstrategicas.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 text-xs text-zinc-300 bg-[#14141c]/70 p-2.5 rounded-xl border border-zinc-800/60"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-zinc-500 text-xs flex-1 flex items-center justify-center">
          Preencha os campos e simule para obter a recomendação da IA.
        </div>
      )}
    </div>
  );
};
