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
    <div className="bg-[#0e0e13]/90 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800/80 p-5 md:p-6 text-zinc-100 transition-all duration-300 hover:border-zinc-700/80 flex flex-col justify-between">
      {/* Header do Formulário */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500/10 border border-red-500/25 p-2 rounded-xl text-red-500 shadow-inner">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Parâmetros da Compra</h2>
            <p className="text-[11px] text-zinc-400">Ajuste os valores para simulação em tempo real</p>
          </div>
        </div>

        {/* Badge Mercado Pago */}
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-red-950/40 border border-red-800/40 text-red-400 rounded-full text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>105% CDI</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Valor Total & Desconto à Vista */}
        <div className="grid grid-cols-2 gap-3">
          {/* Valor Total */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Valor Total (R$)
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-2.5 text-zinc-500 font-bold text-xs group-focus-within:text-red-400 transition-colors">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.valorTotal || ''}
                onChange={(e) => handleChange('valorTotal', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 bg-[#14141a] border border-zinc-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 font-semibold text-white placeholder-zinc-600 text-xs"
                placeholder="1.200,00"
              />
            </div>
          </div>

          {/* Desconto à Vista (%) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Desc. à Vista (%)</span>
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
                className="w-full pl-3 pr-7 py-2 bg-[#14141a] border border-zinc-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 font-semibold text-white placeholder-zinc-600 text-xs"
                placeholder="Ex: 5"
              />
              <span className="absolute right-2.5 top-2 text-zinc-500 font-bold text-xs group-focus-within:text-red-400 transition-colors">
                %
              </span>
            </div>
            {formData.valorTotal && formData.descontoAVistaPercentual ? (
              <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">
                = R${' '}
                {(
                  formData.valorTotal *
                  (1 - (formData.descontoAVistaPercentual || 0) / 100)
                ).toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Quantidade de Parcelas */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Parcelas no Cartão
            </label>
            <span className="px-2 py-0.5 bg-[#14141a] border border-zinc-800 rounded-md font-bold text-red-400 text-xs">
              {formData.quantidadeParcelas}x
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="36"
            value={formData.quantidadeParcelas}
            onChange={(e) => handleChange('quantidadeParcelas', parseInt(e.target.value) || 1)}
            className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>1x à vista</span>
            <span>
              Parcela:{' '}
              <strong className="text-zinc-300">
                R${' '}
                {formData.valorTotal && formData.quantidadeParcelas
                  ? (formData.valorTotal / formData.quantidadeParcelas).toFixed(2)
                  : '0,00'}
              </strong>
              /mês
            </span>
            <span>36x</span>
          </div>
        </div>

        {/* Toggle Parcelamento com Juros */}
        <div className="flex items-center justify-between p-2.5 bg-[#14141a] border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
          <div>
            <span className="text-xs font-semibold text-zinc-200 block">
              Parcelado com Juros?
            </span>
            <span className="text-[10px] text-zinc-500">Juros de cartão ou maquininha</span>
          </div>
          <input
            type="checkbox"
            checked={formData.comJuros || false}
            onChange={(e) => handleChange('comJuros', e.target.checked)}
            className="w-4 h-4 accent-red-500 rounded cursor-pointer"
          />
        </div>

        {/* Campo de juros caso ativo */}
        {formData.comJuros && (
          <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-xl animate-fade-up">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-red-300 mb-1">
              Juros Mensais do Cartão (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.taxaJurosParcelamento || ''}
                onChange={(e) =>
                  handleChange('taxaJurosParcelamento', parseFloat(e.target.value) || 0)
                }
                className="w-full pl-3 pr-12 py-1.5 bg-[#121217] border border-red-700/60 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                placeholder="Ex: 2.5"
              />
              <span className="absolute right-2.5 top-1.5 text-red-400 font-medium text-[11px]">% a.m.</span>
            </div>
          </div>
        )}

        {/* Configurações Avançadas de Investimento (CDI e IR) */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center space-x-1.5 transition py-1"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Ocultar configs avançadas' : 'Configurar Selic e IR'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-2 p-3 bg-[#14141a]/95 border border-zinc-800 rounded-xl space-y-2.5 animate-fade-up text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                    Remuneração CDB
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={formData.percentualCdi ?? 105}
                      onChange={(e) =>
                        handleChange('percentualCdi', parseFloat(e.target.value) || 100)
                      }
                      className="w-full pl-2.5 pr-6 py-1.5 text-xs bg-[#0e0e13] border border-zinc-800 rounded-lg font-semibold text-white focus:border-red-500 focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-zinc-500 text-[10px] font-bold">% CDI</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                    Taxa Selic Anual
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      value={formData.taxaCdiAnual ?? 13.75}
                      onChange={(e) =>
                        handleChange('taxaCdiAnual', parseFloat(e.target.value) || 0)
                      }
                      className="w-full pl-2.5 pr-8 py-1.5 text-xs bg-[#0e0e13] border border-zinc-800 rounded-lg font-semibold text-white focus:border-red-500 focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-zinc-500 text-[10px] font-bold">% a.a.</span>
                  </div>
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.considerarIrRegressivo ?? true}
                  onChange={(e) => handleChange('considerarIrRegressivo', e.target.checked)}
                  className="w-3.5 h-3.5 accent-red-500 rounded"
                />
                <span className="text-[11px] font-medium text-zinc-300">
                  Descontar IR Regressivo (22,5% a 15%)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Botão de Envio (Nexora Vibrant Red Button) */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="tracking-wide">Calcular Economicidade</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
