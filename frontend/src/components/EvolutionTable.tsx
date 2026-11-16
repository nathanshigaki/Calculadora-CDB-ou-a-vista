import React from 'react';
import { MonthlyEntry } from '../types/simulation';
import { formatBRL, formatPercent } from '../lib/formatters';
import { Calendar, Coins } from 'lucide-react';

interface EvolutionTableProps {
  entries: MonthlyEntry[];
  valorTotalOriginal: number;
}

export const EvolutionTable: React.FC<EvolutionTableProps> = ({ entries, valorTotalOriginal }) => {
  const totalRendimentoBruto = entries.reduce((acc, curr) => acc + curr.rendimentoBruto, 0);
  const totalIr = entries.reduce((acc, curr) => acc + curr.irRetido, 0);
  const totalRendimentoLiquido = entries.reduce((acc, curr) => acc + curr.rendimentoLiquido, 0);
  const totalParcelasPagas = entries.reduce((acc, curr) => acc + curr.parcelaPaga, 0);
  const saldoFinalFinal = entries.length > 0 ? entries[entries.length - 1].saldoFinal : 0;

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden text-slate-100">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Evolução Mensal do Investimento</h3>
            <p className="text-xs text-slate-400">
              Acompanhamento mês a mês do saldo investido, rendimentos e débito das parcelas
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          Aporte Inicial: <strong className="text-sky-400">{formatBRL(valorTotalOriginal)}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-800/90 text-slate-300 text-xs font-bold uppercase tracking-wider border-b border-slate-700">
              <th className="py-3.5 px-4">Mês</th>
              <th className="py-3.5 px-4 text-right">Saldo Inicial</th>
              <th className="py-3.5 px-4 text-right">Rend. Bruto</th>
              <th className="py-3.5 px-4 text-right">IR Retido</th>
              <th className="py-3.5 px-4 text-right text-emerald-400">Rend. Líquido</th>
              <th className="py-3.5 px-4 text-right text-rose-400">Parcela Débito</th>
              <th className="py-3.5 px-4 text-right">Saldo Final</th>
              <th className="py-3.5 px-4 text-right text-indigo-400">Ganho Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
            {entries.map((entry) => (
              <tr
                key={entry.mes}
                className="hover:bg-slate-800/60 transition-colors duration-150 odd:bg-slate-900 even:bg-slate-900/60"
              >
                <td className="py-3 px-4 font-bold text-white whitespace-nowrap flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mês {entry.mes}</span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-slate-200 whitespace-nowrap">
                  {formatBRL(entry.saldoInicial)}
                </td>
                <td className="py-3 px-4 text-right text-slate-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoBruto)}
                </td>
                <td className="py-3 px-4 text-right text-amber-400 whitespace-nowrap text-xs">
                  -{formatBRL(entry.irRetido)}{' '}
                  <span className="opacity-70">({formatPercent(entry.aliquotaIr, 1)})</span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-emerald-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoLiquido)}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-rose-400 whitespace-nowrap">
                  -{formatBRL(entry.parcelaPaga)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-white whitespace-nowrap">
                  {formatBRL(entry.saldoFinal)}
                </td>
                <td className="py-3 px-4 text-right font-extrabold text-indigo-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoAcumulado)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-800/90 font-bold text-slate-200 border-t-2 border-slate-700">
              <td className="py-3.5 px-4 text-xs uppercase tracking-wider text-white">Total Consolidado</td>
              <td className="py-3.5 px-4 text-right text-slate-500">-</td>
              <td className="py-3.5 px-4 text-right text-slate-300 font-bold">
                +{formatBRL(totalRendimentoBruto)}
              </td>
              <td className="py-3.5 px-4 text-right text-amber-400 font-bold">
                -{formatBRL(totalIr)}
              </td>
              <td className="py-3.5 px-4 text-right text-emerald-400 font-extrabold text-base">
                +{formatBRL(totalRendimentoLiquido)}
              </td>
              <td className="py-3.5 px-4 text-right text-rose-400 font-bold">
                -{formatBRL(totalParcelasPagas)}
              </td>
              <td className="py-3.5 px-4 text-right text-white font-extrabold text-base">
                {formatBRL(saldoFinalFinal)}
              </td>
              <td className="py-3.5 px-4 text-right text-indigo-400 font-black text-base">
                +{formatBRL(totalRendimentoLiquido)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
