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
    <div className="bg-[#0e0e13]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800/80 overflow-hidden text-zinc-100 transition-all duration-300 hover:border-zinc-700/80">
      <div className="p-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-red-500/10 border border-red-500/25 text-red-500 rounded-2xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Evolução Mensal do Investimento</h3>
            <p className="text-xs text-zinc-400">
              Acompanhamento detalhado do capital aplicado, rendimentos líquidos e parcelas
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-zinc-300 bg-[#14141c] px-3.5 py-1.5 rounded-xl border border-zinc-800">
          Aporte Inicial: <strong className="text-red-400">{formatBRL(valorTotalOriginal)}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-[#13131a] text-zinc-400 text-[11px] font-bold uppercase tracking-wider border-b border-zinc-800">
              <th className="py-3.5 px-4">Mês</th>
              <th className="py-3.5 px-4 text-right">Saldo Inicial</th>
              <th className="py-3.5 px-4 text-right">Rend. Bruto</th>
              <th className="py-3.5 px-4 text-right">IR Retido</th>
              <th className="py-3.5 px-4 text-right text-red-400">Rend. Líquido</th>
              <th className="py-3.5 px-4 text-right text-zinc-400">Parcela Débito</th>
              <th className="py-3.5 px-4 text-right">Saldo Final</th>
              <th className="py-3.5 px-4 text-right text-rose-400">Ganho Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
            {entries.map((entry) => (
              <tr
                key={entry.mes}
                className="hover:bg-zinc-800/40 transition-colors duration-150 odd:bg-[#0e0e13] even:bg-[#111116]"
              >
                <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Mês {entry.mes}</span>
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-zinc-200 whitespace-nowrap">
                  {formatBRL(entry.saldoInicial)}
                </td>
                <td className="py-3.5 px-4 text-right text-zinc-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoBruto)}
                </td>
                <td className="py-3.5 px-4 text-right text-amber-400/90 whitespace-nowrap text-xs">
                  -{formatBRL(entry.irRetido)}{' '}
                  <span className="opacity-60 text-[10px]">({formatPercent(entry.aliquotaIr, 1)})</span>
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-red-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoLiquido)}
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-zinc-400 whitespace-nowrap">
                  -{formatBRL(entry.parcelaPaga)}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-white whitespace-nowrap">
                  {formatBRL(entry.saldoFinal)}
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-rose-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoAcumulado)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#13131c] font-bold text-zinc-200 border-t-2 border-zinc-700">
              <td className="py-4 px-4 text-xs uppercase tracking-wider text-white">Total Consolidado</td>
              <td className="py-4 px-4 text-right text-zinc-500">-</td>
              <td className="py-4 px-4 text-right text-zinc-300 font-bold">
                +{formatBRL(totalRendimentoBruto)}
              </td>
              <td className="py-4 px-4 text-right text-amber-400 font-bold">
                -{formatBRL(totalIr)}
              </td>
              <td className="py-4 px-4 text-right text-red-400 font-extrabold text-base">
                +{formatBRL(totalRendimentoLiquido)}
              </td>
              <td className="py-4 px-4 text-right text-zinc-400 font-bold">
                -{formatBRL(totalParcelasPagas)}
              </td>
              <td className="py-4 px-4 text-right text-white font-extrabold text-base">
                {formatBRL(saldoFinalFinal)}
              </td>
              <td className="py-4 px-4 text-right text-rose-400 font-black text-base">
                +{formatBRL(totalRendimentoLiquido)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
