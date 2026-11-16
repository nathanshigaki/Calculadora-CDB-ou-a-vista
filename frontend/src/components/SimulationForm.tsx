import React, { useState } from 'react';
import { SimulationRequest } from '../types/simulation';
import { Calculator, ArrowRight, Settings2, Sliders } from 'lucide-react';

interface SimulationFormProps {
  initialValues: SimulationRequest;
  onSimulate: (values: SimulationRequest) => void;
  isLoading: boolean;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({
  initialValues,
  onSimulate,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SimulationRequest>(initialValues);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field: keyof SimulationRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(formData);
  };

  return (
    <div className="bg-[#0e0e13]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800/80 p-6 md:p-8 text-zinc-100 transition-all duration-300 hover:border-zinc-700/80">
      {/* Header do Formulário */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3.5">
          <div className="bg-red-500/10 border border-red-500/25 p-2.5 rounded-2xl text-red-500 shadow-inner">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Parâmetros da Compra</h2>
            <p className="text-xs text-zinc-400">Configure os valores para simulação em tempo real</p>
          </div>
        </div>

        {/* Badge Mercado Pago */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-red-950/40 border border-red-800/40 text-red-400 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>105% do CDI</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Valor Total */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Valor Total da Compra (R$)
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-3 text-zinc-500 font-bold text-sm group-focus-within:text-red-400 transition-colors">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.valorTotal || ''}
                onChange={(e) => handleChange('valorTotal', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#14141a] border border-zinc-800 rounded-2xl focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 font-semibold text-white placeholder-zinc-600 text-sm"
                placeholder="1.200,00"
              />
            </div>
          </div>

          {/* Desconto à Vista (%) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center justify-between">
              <span>Desconto à Vista (%)</span>
              <span className="text-[11px] font-normal text-zinc-400 lowercase">
                {formData.valorTotal && formData.descontoAVistaPercentual
                  ? `= R$ ${(
                      formData.valorTotal *
                      (1 - (formData.descontoAVistaPercentual || 0) / 100)
                    ).toFixed(2)}`
                  : ''}
              </span>
            </label>
            <div className="relative group">
              <input
                type="number"
                step="0.1"
                min="0"
                max="99"
                value={formData.descontoAVistaPercentual ?? ''}
                onChange={(e) =>
                  handleChange('descontoAVistaPercentual', parseFloat(e.target.value) || 0)
                }
                className="w-full pl-4 pr-10 py-2.5 bg-[#14141a] border border-zinc-800 rounded-2xl focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 font-semibold text-white placeholder-zinc-600 text-sm"
                placeholder="Ex: 5"
              />
              <span className="absolute right-3.5 top-3 text-zinc-500 font-bold text-sm group-focus-within:text-red-400 transition-colors">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quantidade de Parcelas */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Quantidade de Parcelas
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="36"
                value={formData.quantidadeParcelas}
                onChange={(e) => handleChange('quantidadeParcelas', parseInt(e.target.value) || 1)}
                className="flex-1 accent-red-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <span className="w-16 text-center py-2 px-2 bg-[#14141a] border border-zinc-800 rounded-xl font-bold text-red-400 text-sm shadow-inner">
                {formData.quantidadeParcelas}x
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Parcela estimada: R${' '}
              {formData.valorTotal && formData.quantidadeParcelas
                ? (formData.valorTotal / formData.quantidadeParcelas).toFixed(2)
                : '0,00'}{' '}
              / mês
            </p>
          </div>

          {/* Toggle Parcelamento com Juros */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between p-3.5 bg-[#14141a] border border-zinc-800 rounded-2xl hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200 block">
                  Parcelado com Juros?
                </span>
                <span className="text-[11px] text-zinc-400">Juros de cartão ou maquininha</span>
              </div>
              <input
                type="checkbox"
                checked={formData.comJuros || false}
                onChange={(e) => handleChange('comJuros', e.target.checked)}
                className="w-5 h-5 accent-red-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Campo de juros caso ativo */}
        {formData.comJuros && (
          <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-2xl animate-fade-up">
            <label className="block text-xs font-semibold uppercase tracking-wider text-red-300 mb-1">
              Taxa de Juros Mensal do Parcelamento (%)
            </label>
            <div className="relative w-full md:w-1/2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.taxaJurosParcelamento || ''}
                onChange={(e) =>
                  handleChange('taxaJurosParcelamento', parseFloat(e.target.value) || 0)
                }
                className="w-full pl-4 pr-14 py-2 bg-[#121217] border border-red-700/60 rounded-xl font-semibold text-white focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="Ex: 2.5"
              />
              <span className="absolute right-3.5 top-2 text-red-400 font-medium text-xs">% a.m.</span>
            </div>
          </div>
        )}

        {/* Configurações Avançadas de Investimento (CDI e IR) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center space-x-1.5 transition py-1"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Ocultar configurações avançadas' : 'Configurar Selic e Imposto de Renda'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-[#14141a]/90 border border-zinc-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Remuneração CDB (% CDI)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={formData.percentualCdi ?? 105}
                    onChange={(e) =>
                      handleChange('percentualCdi', parseFloat(e.target.value) || 100)
                    }
                    className="w-full pl-3 pr-8 py-2 text-sm bg-[#0e0e13] border border-zinc-800 rounded-xl font-semibold text-white focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2.5 text-zinc-500 text-xs font-bold">%</span>
                </div>
                <span className="text-[10px] text-zinc-500">Mercado Pago: 105%</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Taxa Selic Anual (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={formData.taxaCdiAnual ?? 13.75}
                    onChange={(e) =>
                      handleChange('taxaCdiAnual', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-3 pr-10 py-2 text-sm bg-[#0e0e13] border border-zinc-800 rounded-xl font-semibold text-white focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2.5 text-zinc-500 text-xs font-bold">% a.a.</span>
                </div>
                <span className="text-[10px] text-zinc-500">Selic atual: 13,75%</span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center space-x-2.5 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={formData.considerarIrRegressivo ?? true}
                    onChange={(e) => handleChange('considerarIrRegressivo', e.target.checked)}
                    className="w-4 h-4 accent-red-500 rounded"
                  />
                  <span className="text-xs font-semibold text-zinc-300">
                    Descontar IR Regressivo (22,5% a 15%)
                  </span>
                </label>
                <span className="text-[10px] text-zinc-500 pl-6.5">
                  Cálculo do valor líquido real
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Envio (Nexora Vibrant Red Button) */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center space-x-2.5 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="tracking-wide">Calcular e Comparar Economicidade</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
