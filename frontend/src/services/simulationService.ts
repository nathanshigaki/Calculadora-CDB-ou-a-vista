import { SimulationRequest, SimulationResult, AiAnalysisResponse, DefaultRatesResponse } from '../types/simulation';

const API_BASE = '/api/simulation';

export const simulationService = {
  async calculate(request: SimulationRequest): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Falha no cálculo: ${errorText || res.statusText}`);
    }

    return res.json();
  },

  async getAiAnalysis(result: SimulationResult): Promise<AiAnalysisResponse> {
    const res = await fetch(`${API_BASE}/ai-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Falha na análise da IA: ${errorText || res.statusText}`);
    }

    return res.json();
  },

  async getDefaultRates(): Promise<DefaultRatesResponse> {
    const res = await fetch(`${API_BASE}/defaults`);
    if (!res.ok) {
      // Fallback padrão se endpoint offline
      return {
        taxaCdiAnualPadrao: 11.25,
        percentualCdiMercadoPago: 105.0,
      };
    }
    return res.json();
  },
};
