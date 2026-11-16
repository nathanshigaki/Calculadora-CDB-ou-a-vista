import React from 'react';
import { SimulationResult } from '../types/simulation';
import { formatBRL, formatPercent } from '../lib/formatters';
import { CheckCircle2, TrendingUp, AlertCircle, ArrowUpRight, ShieldCheck, DollarSign, Activity } from 'lucide-react';

interface VerdictCardProps {
  result: SimulationResult;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  const isAVista = result.melhorOpcao === 'A_VISTA';
  const isParcelado = result.melhorOpcao === 'PARCELADO_CDB';

  return (
    <div className="space-y-6">
      {/* Banner Principal do Veredito (Estilo Nexora Hero Card) */}
      <div
        className={`rounded-3xl p-6 md:p-8 text-white shadow-2xl transition-all duration-500 border relative overflow-hidden ${
          isAVista
            ? 'bg-gradient-to-br from-[#1a080c] via-[#0f0e13] to-[#08080a] border-red-500/40 shadow-red-950/30'
            : isParcelado
            ? 'bg-gradient-to-br from-[#1a0a0f] via-[#0f0e13] to-[#08080a] border-rose-500/40 shadow-rose-950/30'
            : 'bg-gradient-to-br from-[#1a140a] via-[#0f0e13] to-[#08080a] border-amber-500/40'
        }`}
      >
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 shadow-inner">
                {isAVista ? (
                  <CheckCircle2 className="w-8 h-8 text-red-400" />
                ) : isParcelado ? (
                  <TrendingUp className="w-8 h-8 text-rose-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-red-400/90 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Veredito de Decisão</span>
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                  {result.tituloVeredicto}
                </h3>
              </div>
            </div>

            <div className="bg-[#14141c]/90 border border-zinc-800 px-5 py-3.5 rounded-2xl text-right self-stretch md:self-auto shadow-inner">
              <span className="text-[10px] uppercase tracking-wider block text-zinc-400 font-bold">
                Economia Líquida Real
              </span>
              <div className="text-2xl md:text-3xl font-black text-white flex items-baseline justify-end space-x-2 mt-0.5">
                <span className="text-red-400">{formatBRL(result.diferencaEconomia)}</span>
                <span className="text-xs font-semibold text-zinc-400">
                  ({formatPercent(result.percentualEconomia)})
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs md:text-sm text-zinc-300 leading-relaxed font-normal bg-black/40 p-4 rounded-2xl border border-zinc-800/80">
            {result.motivoVeredicto}
          </p>
        </div>
      </div>

      {/* Grid de 3 Cards de Indicadores (Estilo Nexora Stats Cards: "Data Ingested", "Queries Run", "Event Volume") */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Comparativo de Desembolso */}
        <div className="bg-[#0e0e13]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Custo Efetivo Final
              </span>
              <div className="p-1.5 bg-zinc-800/60 rounded-lg text-zinc-400 group-hover:text-red-400 transition-colors">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">À Vista:</span>
                <span className="font-bold text-white text-sm">{formatBRL(result.valorAVista)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Parcelado (Líquido):</span>
                <span className="font-bold text-red-400 text-sm">
                  {formatBRL(result.custoEfetivoParcelado)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Valor de Tabela:</span>
            <span className="font-semibold text-zinc-300">
              {formatBRL(result.valorTotalOriginal)}
            </span>
          </div>
        </div>

        {/* Card 2: Rendimento do CDB */}
        <div className="bg-[#0e0e13]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Rendimento CDB Líquido
              </span>
              <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white group-hover:text-red-400 transition-colors">
              +{formatBRL(result.rendimentoLiquidoTotal)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center space-x-1">
              <span className="text-red-400 font-semibold">105% CDI</span>
              <span>• IR: -{formatBRL(result.irTotalRetido)}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Taxa efetiva mensal:</span>
            <span className="font-semibold text-zinc-200">
              {formatPercent(result.taxaMensalEfetivaCdi, 3)} a.m.
            </span>
          </div>
        </div>

        {/* Card 3: Ponto de Equilíbrio (Break-Even) */}
        <div className="bg-[#0e0e13]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Desconto Break-Even
              </span>
              <div className="p-1.5 bg-zinc-800/60 rounded-lg text-zinc-400 group-hover:text-red-400 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-500">
              {formatPercent(result.descontoMinimoEquilibrio)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-tight">
              {result.descontoAVistaPercentual >= result.descontoMinimoEquilibrio
                ? `Desconto de ${formatPercent(result.descontoAVistaPercentual)} supera o equilíbrio.`
                : `Desconto de ${formatPercent(result.descontoAVistaPercentual)} está abaixo do equilíbrio.`}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-500">
            <span>Desconto mínimo para à vista valer a pena</span>
          </div>
        </div>
      </div>
    </div>
  );
};
