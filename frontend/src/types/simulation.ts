export interface SimulationRequest {
  valorTotal: number;
  descontoAVistaPercentual?: number;
  valorAVistaManual?: number;
  quantidadeParcelas: number;
  comJuros?: boolean;
  taxaJurosParcelamento?: number;
  percentualCdi?: number;
  taxaCdiAnual?: number;
  considerarIrRegressivo?: boolean;
}

export interface MonthlyEntry {
  mes: number;
  saldoInicial: number;
  rendimentoBruto: number;
  aliquotaIr: number;
  irRetido: number;
  rendimentoLiquido: number;
  parcelaPaga: number;
  saldoFinal: number;
  rendimentoAcumulado: number;
}

export interface SimulationResult {
  melhorOpcao: 'A_VISTA' | 'PARCELADO_CDB' | 'INDIFERENTE';
  tituloVeredicto: string;
  motivoVeredicto: string;
  valorTotalOriginal: number;
  valorAVista: number;
  descontoAVistaPercentual: number;
  valorTotalParcelado: number;
  valorParcelaMensal: number;
  quantidadeParcelas: number;
  taxaCdiAnual: number;
  percentualCdi: number;
  taxaMensalEfetivaCdi: number;
  rendimentoBrutoTotal: number;
  irTotalRetido: number;
  rendimentoLiquidoTotal: number;
  saldoFinalAposQuitacao: number;
  custoEfetivoParcelado: number;
  diferencaEconomia: number;
  percentualEconomia: number;
  descontoMinimoEquilibrio: number;
  mesesEvolucao: MonthlyEntry[];
}

export interface AiAnalysisResponse {
  veredicto: string;
  economiaEstimada: number;
  descontoMinimoEquilibrio: number;
  pontoDeEquilibrioExplicado: string;
  analiseDetalhada: string;
  recomendacoesEstrategicas: string[];
}

export interface DefaultRatesResponse {
  taxaCdiAnualPadrao: number;
  percentualCdiMercadoPago: number;
}
