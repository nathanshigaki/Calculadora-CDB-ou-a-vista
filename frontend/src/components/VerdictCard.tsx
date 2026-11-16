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
    <div className="space-y-6">
      {/* Banner Principal do Veredito */}
      <div
        className={`rounded-2xl p-6 md:p-8 text-white shadow-lg transition-all ${
          isAVista
            ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 shadow-emerald-900/20'
            : isParcelado
            ? 'bg-gradient-to-br from-blue-600 via-indigo-700 to-sky-900 shadow-blue-900/20'
            : 'bg-gradient-to-br from-amber-600 to-orange-800'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl">
              {isAVista ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-200" />
              ) : isParcelado ? (
                <TrendingUp className="w-8 h-8 text-sky-200" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-200" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase opacity-85">
                Veredito Financeiro
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {result.tituloVeredicto}
              </h3>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 text-right self-stretch md:self-auto">
            <span className="text-xs uppercase tracking-wider block opacity-85 font-medium">
              Economia Real
            </span>
            <div className="text-2xl md:text-3xl font-black flex items-baseline justify-end space-x-1.5">
              <span>{formatBRL(result.diferencaEconomia)}</span>
              <span className="text-sm font-semibold opacity-90">
                ({formatPercent(result.percentualEconomia)})
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm md:text-base text-white/90 leading-relaxed font-normal bg-black/10 p-4 rounded-xl border border-white/10">
          {result.motivoVeredicto}
        </p>
      </div>

      {/* Grid de 3 Indicadores Estratégicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Comparativo de Desembolso */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Custo Efetivo Final</span>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">À Vista:</span>
                <span className="font-bold text-slate-800">{formatBRL(result.valorAVista)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Parcelado (Líquido):</span>
                <span className="font-bold text-slate-800">
                  {formatBRL(result.custoEfetivoParcelado)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Valor Original Tabela:</span>
            <span className="font-semibold text-slate-700">
              {formatBRL(result.valorTotalOriginal)}
            </span>
          </div>
        </div>

        {/* Card 2: Rendimento do CDB */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Rendimento CDB Líquido</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">
              +{formatBRL(result.rendimentoLiquidoTotal)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rendimento bruto: {formatBRL(result.rendimentoBrutoTotal)} (IR: -
              {formatBRL(result.irTotalRetido)})
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Taxa efetiva mensal:</span>
            <span className="font-semibold text-slate-700">
              {formatPercent(result.taxaMensalEfetivaCdi, 3)} a.m.
            </span>
          </div>
        </div>

        {/* Card 3: Ponto de Equilíbrio (Break-Even) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Desconto Break-Even</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-indigo-600">
              {formatPercent(result.descontoMinimoEquilibrio)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {result.descontoAVistaPercentual >= result.descontoMinimoEquilibrio
                ? `O desconto dado (${formatPercent(result.descontoAVistaPercentual)}) superou o equilíbrio.`
                : `O desconto dado (${formatPercent(result.descontoAVistaPercentual)}) ficou abaixo do equilíbrio.`}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Desconto mínimo para à vista valer a pena</span>
          </div>
        </div>
      </div>
    </div>
  );
};
