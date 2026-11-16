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
        <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 text-slate-100">
          <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-400">{item.name}:</span>
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
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 text-slate-100">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Curva de Decaimento do Saldo & Rendimento
            </h3>
            <p className="text-xs text-slate-400">
              Visualização da amortização do capital investido e crescimento do rendimento
            </p>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `R$ ${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            <Area
              type="monotone"
              dataKey="saldoInicial"
              name="Saldo Investido Inicial"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSaldo)"
            />

            <Line
              type="monotone"
              dataKey="rendimentoAcumulado"
              name="Ganho Líquido Acumulado"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 4, fill: '#34d399' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
