import React from 'react';
import { SimulationResult } from '../types/simulation';
import { formatBRL, formatPercent } from '../lib/formatters';
import { CheckCircle2, TrendingUp, AlertCircle, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';

interface VerdictCardProps {
  result: SimulationResult;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  const isAVista = result.melhorOpcao === 'A_VISTA';
  const isParcelado = result.melhorOpcao === 'PARCELADO_CDB';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Banner Principal do Veredito (Compacto & de Alto Impacto) */}
      <div
        className={`lg:col-span-6 rounded-2xl p-4 md:p-5 text-white shadow-xl transition-all duration-300 border relative overflow-hidden flex flex-col justify-between ${
          isAVista
            ? 'bg-gradient-to-br from-[#1a080c] via-[#0f0e13] to-[#08080a] border-red-500/40 shadow-red-950/20'
            : isParcelado
            ? 'bg-gradient-to-br from-[#1a0a0f] via-[#0f0e13] to-[#08080a] border-rose-500/40 shadow-rose-950/20'
            : 'bg-gradient-to-br from-[#1a140a] via-[#0f0e13] to-[#08080a] border-amber-500/40'
        }`}
      >
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 shadow-inner flex-shrink-0">
                {isAVista ? (
                  <CheckCircle2 className="w-5 h-5 text-red-400" />
                ) : isParcelado ? (
                  <TrendingUp className="w-5 h-5 text-rose-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Veredito de Decisão</span>
                </span>
                <h3 className="text-lg md:text-xl font-black tracking-tight text-white mt-0.5 leading-snug">
                  {result.tituloVeredicto}
                </h3>
              </div>
            </div>

            <div className="bg-[#14141c]/90 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-right flex-shrink-0 shadow-inner">
              <span className="text-[9px] uppercase tracking-wider block text-zinc-400 font-bold">
                Economia Real
              </span>
              <div className="text-base md:text-lg font-black text-white flex items-baseline justify-end space-x-1">
                <span className="text-red-400">{formatBRL(result.diferencaEconomia)}</span>
                <span className="text-[10px] font-semibold text-zinc-400">
                  ({formatPercent(result.percentualEconomia)})
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-normal bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
            {result.motivoVeredicto}
          </p>
        </div>
      </div>

      {/* Grid de 3 Cards de Indicadores Lado a Lado */}
      <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Comparativo de Desembolso */}
        <div className="bg-[#0e0e13]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Custo Efetivo
              </span>
              <div className="p-1 bg-zinc-800/60 rounded-md text-zinc-400 group-hover:text-red-400 transition-colors">
                <DollarSign className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">À Vista:</span>
                <span className="font-bold text-white">{formatBRL(result.valorAVista)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Parcelado:</span>
                <span className="font-bold text-red-400">
                  {formatBRL(result.custoEfetivoParcelado)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
            <span className="text-zinc-500">Tabela:</span>
            <span className="font-medium text-zinc-300">
              {formatBRL(result.valorTotalOriginal)}
            </span>
          </div>
        </div>

        {/* Card 2: Rendimento do CDB */}
        <div className="bg-[#0e0e13]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Rendimento CDB
              </span>
              <div className="p-1 bg-red-500/10 rounded-md text-red-400">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="text-lg font-black text-white group-hover:text-red-400 transition-colors">
              +{formatBRL(result.rendimentoLiquidoTotal)}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              <span className="text-red-400 font-semibold">105% CDI</span> • IR -{formatBRL(result.irTotalRetido)}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Efetivo a.m.:</span>
            <span className="font-semibold text-zinc-200">
              {formatPercent(result.taxaMensalEfetivaCdi, 2)}
            </span>
          </div>
        </div>

        {/* Card 3: Ponto de Equilíbrio (Break-Even) */}
        <div className="bg-[#0e0e13]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Break-Even
              </span>
              <div className="p-1 bg-zinc-800/60 rounded-md text-zinc-400 group-hover:text-red-400 transition-colors">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>
            <div className="text-lg font-black text-red-500">
              {formatPercent(result.descontoMinimoEquilibrio)}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
              Desc. mínimo p/ à vista
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex justify-between">
            <span>Atual:</span>
            <span className="font-bold text-zinc-300">{formatPercent(result.descontoAVistaPercentual)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
