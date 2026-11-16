import React, { useState } from 'react';
import { SimulationRequest } from '../types/simulation';
import { Calculator, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

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

  const handleApplyPreset = (preset: Partial<SimulationRequest>) => {
    const updated = { ...formData, ...preset };
    setFormData(updated);
    onSimulate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Parâmetros da Compra</h2>
            <p className="text-sm text-slate-500">Informe os valores para simular e comparar</p>
          </div>
        </div>

        {/* Badge do Mercado Pago */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>CDB Mercado Pago (105% CDI)</span>
        </div>
      </div>

      {/* Presets Rápidos */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Simulações Rápidas Populares:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                valorTotal: 1500,
                descontoAVistaPercentual: 0,
                quantidadeParcelas: 10,
                comJuros: false,
                percentualCdi: 105,
              })
            }
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition"
          >
            📦 <strong>10x sem juros</strong>
            <span className="block text-slate-500 text-[11px]">R$ 1.500 (sem desc.)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                valorTotal: 3000,
                descontoAVistaPercentual: 5,
                quantidadeParcelas: 12,
                comJuros: false,
                percentualCdi: 105,
              })
            }
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition"
          >
            📱 <strong>Celular em 12x</strong>
            <span className="block text-slate-500 text-[11px]">R$ 3.000 (5% à vista)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                valorTotal: 5000,
                descontoAVistaPercentual: 10,
                quantidadeParcelas: 12,
                comJuros: false,
                percentualCdi: 105,
              })
            }
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition"
          >
            💻 <strong>Notebook em 12x</strong>
            <span className="block text-slate-500 text-[11px]">R$ 5.000 (10% à vista)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                valorTotal: 2000,
                descontoAVistaPercentual: 5,
                quantidadeParcelas: 6,
                comJuros: true,
                taxaJurosParcelamento: 2.5,
                percentualCdi: 105,
              })
            }
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition"
          >
            💳 <strong>Com Juros (2.5% a.m.)</strong>
            <span className="block text-slate-500 text-[11px]">R$ 2.000 (6x com juros)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Valor Total */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Valor Total da Compra (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-medium text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.valorTotal || ''}
                onChange={(e) => handleChange('valorTotal', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition font-semibold text-slate-800"
                placeholder="1.200,00"
              />
            </div>
          </div>

          {/* Desconto à Vista (%) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Desconto à Vista (%)</span>
              <span className="text-xs font-normal text-slate-500">
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
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition font-semibold text-slate-800"
                placeholder="Ex: 5"
              />
              <span className="absolute right-3.5 top-3 text-slate-400 font-semibold text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quantidade de Parcelas */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Quantidade de Parcelas
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="36"
                value={formData.quantidadeParcelas}
                onChange={(e) => handleChange('quantidadeParcelas', parseInt(e.target.value) || 1)}
                className="flex-1 accent-sky-600 cursor-pointer"
              />
              <span className="w-16 text-center py-1.5 px-2 bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-800 text-sm">
                {formData.quantidadeParcelas}x
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Parcela de aprox. R${' '}
              {formData.valorTotal && formData.quantidadeParcelas
                ? (formData.valorTotal / formData.quantidadeParcelas).toFixed(2)
                : '0,00'}{' '}
              / mês
            </p>
          </div>

          {/* Toggle Parcelamento com Juros */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Parcelamento com Juros?</span>
                <span className="text-xs text-slate-500">Cobrança de juros na maquininha ou cartão</span>
              </div>
              <input
                type="checkbox"
                checked={formData.comJuros || false}
                onChange={(e) => handleChange('comJuros', e.target.checked)}
                className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Campo de juros caso ativo */}
        {formData.comJuros && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl animate-fadeIn">
            <label className="block text-sm font-semibold text-amber-900 mb-1">
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
                className="w-full pl-4 pr-12 py-2 bg-white border border-amber-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: 2.5"
              />
              <span className="absolute right-3.5 top-2.5 text-amber-700 font-medium text-xs">% a.m.</span>
            </div>
          </div>
        )}

        {/* Configurações Avançadas de Investimento (CDI e IR) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center space-x-1"
          >
            <span>{showAdvanced ? '▼ Ocultar' : '▶ Configurar'} Taxa CDI e Imposto de Renda</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Remuneração do CDB (% do CDI)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={formData.percentualCdi ?? 105}
                    onChange={(e) =>
                      handleChange('percentualCdi', parseFloat(e.target.value) || 100)
                    }
                    className="w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
                  />
                  <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs font-bold">%</span>
                </div>
                <span className="text-[11px] text-slate-500">Mercado Pago rende 105%</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Taxa CDI Base Anual (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={formData.taxaCdiAnual ?? 11.25}
                    onChange={(e) =>
                      handleChange('taxaCdiAnual', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-3 pr-10 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
                  />
                  <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs font-bold">% a.a.</span>
                </div>
                <span className="text-[11px] text-slate-500">Taxa Selic/CDI atual</span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center space-x-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={formData.considerarIrRegressivo ?? true}
                    onChange={(e) => handleChange('considerarIrRegressivo', e.target.checked)}
                    className="w-4 h-4 accent-sky-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Descontar IR Regressivo (22,5% a 15%)
                  </span>
                </label>
                <span className="text-[11px] text-slate-500 pl-6">
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
          className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
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
