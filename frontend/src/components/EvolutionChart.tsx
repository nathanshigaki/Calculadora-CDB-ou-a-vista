import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlyEntry } from '../types/simulation';
import { formatBRL } from '../lib/formatters';
import { BarChart3 } from 'lucide-react';

interface EvolutionChartProps {
  entries: MonthlyEntry[];
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ entries }) => {
  const chartData = entries.map((e) => ({
    name: `Mês ${e.mes}`,
    saldoInicial: e.saldoInicial,
    saldoFinal: e.saldoFinal,
    rendimentoLiquido: e.rendimentoLiquido,
    rendimentoAcumulado: e.rendimentoAcumulado,
    parcelaPaga: e.parcelaPaga,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121218]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-zinc-700/80 text-xs space-y-1.5 text-zinc-100 z-50">
          <p className="font-bold text-white border-b border-zinc-800 pb-1 mb-1">{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-400">{item.name}:</span>
              </span>
              <span className="font-bold text-white">{formatBRL(item.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0e0e13]/90 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800/80 p-4 md:p-5 text-zinc-100 transition-all duration-300 hover:border-zinc-700/80">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/10 border border-red-500/25 text-red-500 rounded-xl">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
              Curva de Decaimento & Rendimento Acumulado
            </h3>
            <p className="text-[11px] text-zinc-400">
              Amortização do capital investido contra a curva de ganho líquido do CDB
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-semibold text-zinc-400 bg-[#14141c] px-3 py-1 rounded-full border border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>Projeção Mensal</span>
        </div>
      </div>

      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 15, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="colorSaldoNexora" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
            <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
            <YAxis
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              tickFormatter={(v) => `R$ ${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />

            <Area
              type="monotone"
              dataKey="saldoInicial"
              name="Saldo Investido Inicial"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSaldoNexora)"
            />

            <Line
              type="monotone"
              dataKey="rendimentoAcumulado"
              name="Ganho Líquido Acumulado"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
