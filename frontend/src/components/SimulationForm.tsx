import React, { useState } from 'react';
import { SimulationRequest } from '../types/simulation';
import { Calculator, ArrowRight, Settings2 } from 'lucide-react';

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
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 md:p-8 text-slate-100">
      {/* Header do Formulário */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-sky-500/10 border border-sky-500/20 p-2.5 rounded-xl text-sky-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Parâmetros da Compra</h2>
            <p className="text-xs text-slate-400">Insira os dados para simular o comparativo</p>
          </div>
        </div>

        {/* Badge do Mercado Pago */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-sky-950/70 border border-sky-800/60 text-sky-300 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>105% do CDI (Mercado Pago)</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Valor Total */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              Valor Total da Compra (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-semibold text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.valorTotal || ''}
                onChange={(e) => handleChange('valorTotal', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition font-semibold text-white placeholder-slate-500"
                placeholder="1.200,00"
              />
            </div>
          </div>

          {/* Desconto à Vista (%) */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Desconto à Vista (%)</span>
              <span className="text-xs font-normal text-slate-400">
                {formData.valorTotal && formData.descontoAVistaPercentual
                  ? `= R$ ${(
                      formData.valorTotal *
                      (1 - (formData.descontoAVistaPercentual || 0) / 100)
                    ).toFixed(2)}`
                  : ''}
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="99"
                value={formData.descontoAVistaPercentual ?? ''}
                onChange={(e) =>
                  handleChange('descontoAVistaPercentual', parseFloat(e.target.value) || 0)
                }
                className="w-full pl-4 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition font-semibold text-white placeholder-slate-500"
                placeholder="Ex: 5"
              />
              <span className="absolute right-3.5 top-3 text-slate-400 font-semibold text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quantidade de Parcelas */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              Quantidade de Parcelas
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="36"
                value={formData.quantidadeParcelas}
                onChange={(e) => handleChange('quantidadeParcelas', parseInt(e.target.value) || 1)}
                className="flex-1 accent-sky-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <span className="w-16 text-center py-2 px-2 bg-slate-800 border border-slate-700 rounded-xl font-bold text-sky-400 text-sm">
                {formData.quantidadeParcelas}x
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Parcela estimada: R${' '}
              {formData.valorTotal && formData.quantidadeParcelas
                ? (formData.valorTotal / formData.quantidadeParcelas).toFixed(2)
                : '0,00'}{' '}
              / mês
            </p>
          </div>

          {/* Toggle Parcelamento com Juros */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl">
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Parcelamento com Juros?</span>
                <span className="text-xs text-slate-400">Juros cobrados no cartão ou maquininha</span>
              </div>
              <input
                type="checkbox"
                checked={formData.comJuros || false}
                onChange={(e) => handleChange('comJuros', e.target.checked)}
                className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Campo de juros caso ativo */}
        {formData.comJuros && (
          <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl animate-fadeIn">
            <label className="block text-sm font-semibold text-amber-200 mb-1">
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
                className="w-full pl-4 pr-12 py-2 bg-slate-900 border border-amber-600/70 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Ex: 2.5"
              />
              <span className="absolute right-3.5 top-2.5 text-amber-400 font-medium text-xs">% a.m.</span>
            </div>
          </div>
        )}

        {/* Configurações Avançadas de Investimento (CDI e IR) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1.5 transition"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Ocultar configurações da Taxa CDI e IR' : 'Configurar Taxa Selic/CDI e Imposto de Renda'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-800/50 border border-slate-700/80 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                    className="w-full pl-3 pr-8 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg font-semibold text-white"
                  />
                  <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-bold">%</span>
                </div>
                <span className="text-[11px] text-slate-400">Mercado Pago: 105%</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Taxa Selic/CDI Anual (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={formData.taxaCdiAnual ?? 13.75}
                    onChange={(e) =>
                      handleChange('taxaCdiAnual', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-3 pr-10 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg font-semibold text-white"
                  />
                  <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-bold">% a.a.</span>
                </div>
                <span className="text-[11px] text-slate-400">Selic atual: 13,75%</span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center space-x-2.5 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={formData.considerarIrRegressivo ?? true}
                    onChange={(e) => handleChange('considerarIrRegressivo', e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Descontar IR Regressivo (22,5% a 15%)
                  </span>
                </label>
                <span className="text-[11px] text-slate-400 pl-6">
                  Cálculo do valor líquido real
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-sky-600/40 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Calcular e Comparar Economicidade</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
