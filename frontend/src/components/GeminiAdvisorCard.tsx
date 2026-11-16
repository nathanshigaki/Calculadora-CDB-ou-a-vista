import React from 'react';
import { AiAnalysisResponse } from '../types/simulation';
import { formatBRL, formatPercent } from '../lib/formatters';
import { Sparkles, Bot, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-800/40 relative overflow-hidden">
      {/* Elemento de iluminação decorativa de fundo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-6 border-b border-indigo-900/60 mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-tr from-sky-400 to-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold tracking-tight text-white">Consultor Inteligente Gemini</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full">
                Google AI
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Análise com raciocínio financeiro e determinação do ponto de equilíbrio (Break-Even)
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Recalcular análise com IA"
          className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-xl transition disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-indigo-200">Consultando inteligência do Gemini...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Card de Ponto de Equilíbrio (Break-Even) */}
          <div className="bg-white/5 border border-indigo-500/20 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-sky-400 mb-2">
              <Bot className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Ponto de Equilíbrio (Break-Even Point)
              </h4>
            </div>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              {analysis.pontoDeEquilibrioExplicado}
            </p>
          </div>

          {/* Análise Detalhada */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
              Parecer Analítico
            </h4>
            <div className="text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
              {analysis.analiseDetalhada}
            </div>
          </div>

          {/* Recomendações Práticas */}
          {analysis.recomendacoesEstrategicas && analysis.recomendacoesEstrategicas.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3">
                Dicas & Cuidados Estratégicos
              </h4>
              <div className="space-y-2.5">
                {analysis.recomendacoesEstrategicas.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 text-xs md:text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-indigo-200/70 text-sm">
          Clique no botão de simulação para gerar a análise com IA.
        </div>
      )}
    </div>
  );
};
