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
    <div className="bg-[#0e0e13]/90 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800/80 overflow-hidden text-zinc-100 transition-all duration-300 hover:border-zinc-700/80 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/10 border border-red-500/25 text-red-500 rounded-xl">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
              Evolução Mensal do Investimento
            </h3>
            <p className="text-[11px] text-zinc-400">
              Saldo investido, rendimento líquido e débito de parcelas mês a mês
            </p>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-zinc-300 bg-[#14141c] px-3 py-1 rounded-lg border border-zinc-800">
          Aporte: <strong className="text-red-400">{formatBRL(valorTotalOriginal)}</strong>
        </div>
      </div>

      {/* Tabela com rolagem interna suave e cabeçalho fixo */}
      <div className="overflow-x-auto max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-[#13131a] z-10 shadow-sm">
            <tr className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-800">
              <th className="py-2.5 px-3">Mês</th>
              <th className="py-2.5 px-3 text-right">Saldo Inicial</th>
              <th className="py-2.5 px-3 text-right">Rend. Bruto</th>
              <th className="py-2.5 px-3 text-right">IR Retido</th>
              <th className="py-2.5 px-3 text-right text-red-400">Rend. Líquido</th>
              <th className="py-2.5 px-3 text-right text-zinc-400">Parcela</th>
              <th className="py-2.5 px-3 text-right">Saldo Final</th>
              <th className="py-2.5 px-3 text-right text-rose-400">Ganho Acum.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
            {entries.map((entry) => (
              <tr
                key={entry.mes}
                className="hover:bg-zinc-800/40 transition-colors duration-150 odd:bg-[#0e0e13] even:bg-[#111116]"
              >
                <td className="py-2 px-3 font-bold text-white whitespace-nowrap flex items-center space-x-1.5">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>Mês {entry.mes}</span>
                </td>
                <td className="py-2 px-3 text-right font-semibold text-zinc-200 whitespace-nowrap">
                  {formatBRL(entry.saldoInicial)}
                </td>
                <td className="py-2 px-3 text-right text-zinc-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoBruto)}
                </td>
                <td className="py-2 px-3 text-right text-amber-400/90 whitespace-nowrap text-[11px]">
                  -{formatBRL(entry.irRetido)}{' '}
                  <span className="opacity-60 text-[9px]">({formatPercent(entry.aliquotaIr, 0)})</span>
                </td>
                <td className="py-2 px-3 text-right font-bold text-red-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoLiquido)}
                </td>
                <td className="py-2 px-3 text-right font-medium text-zinc-400 whitespace-nowrap">
                  -{formatBRL(entry.parcelaPaga)}
                </td>
                <td className="py-2 px-3 text-right font-bold text-white whitespace-nowrap">
                  {formatBRL(entry.saldoFinal)}
                </td>
                <td className="py-2 px-3 text-right font-extrabold text-rose-400 whitespace-nowrap">
                  +{formatBRL(entry.rendimentoAcumulado)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 bg-[#13131c] z-10 border-t-2 border-zinc-700 font-bold text-zinc-200">
            <tr>
              <td className="py-2.5 px-3 text-[10px] uppercase tracking-wider text-white">Total</td>
              <td className="py-2.5 px-3 text-right text-zinc-500">-</td>
              <td className="py-2.5 px-3 text-right text-zinc-300 font-bold">
                +{formatBRL(totalRendimentoBruto)}
              </td>
              <td className="py-2.5 px-3 text-right text-amber-400 font-bold">
                -{formatBRL(totalIr)}
              </td>
              <td className="py-2.5 px-3 text-right text-red-400 font-extrabold text-xs">
                +{formatBRL(totalRendimentoLiquido)}
              </td>
              <td className="py-2.5 px-3 text-right text-zinc-400 font-bold">
                -{formatBRL(totalParcelasPagas)}
              </td>
              <td className="py-2.5 px-3 text-right text-white font-extrabold text-xs">
                {formatBRL(saldoFinalFinal)}
              </td>
              <td className="py-2.5 px-3 text-right text-rose-400 font-black text-xs">
                +{formatBRL(totalRendimentoLiquido)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
