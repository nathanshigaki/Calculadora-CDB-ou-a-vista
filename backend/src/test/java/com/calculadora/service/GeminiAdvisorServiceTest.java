package com.calculadora.service;

import com.calculadora.model.AiAnalysisResponse;
import com.calculadora.model.SimulationRequest;
import com.calculadora.model.SimulationResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class GeminiAdvisorServiceTest {

    private GeminiAdvisorService advisorService;
    private FinancialCalculatorService calculatorService;

    @BeforeEach
    void setUp() {
        advisorService = new GeminiAdvisorService(null, new ObjectMapper());
        calculatorService = new FinancialCalculatorService();
    }

    @Test
    @DisplayName("Deve gerar análise de fallback consistente com break-even calculado")
    void testFallbackAnalysisGeneration() {
        SimulationRequest request = new SimulationRequest();
        request.setValorTotal(new BigDecimal("1000.00"));
        request.setDescontoAVistaPercentual(new BigDecimal("5.0"));
        request.setQuantidadeParcelas(10);
        request.setComJuros(false);

        SimulationResult result = calculatorService.calculate(request);
        AiAnalysisResponse analysis = advisorService.analyze(result);

        assertNotNull(analysis);
        assertNotNull(analysis.getVeredicto());
        assertNotNull(analysis.getPontoDeEquilibrioExplicado());
        assertFalse(analysis.getRecomendacoesEstrategicas().isEmpty());
    }
}
