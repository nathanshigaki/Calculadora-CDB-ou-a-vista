package com.calculadora.service;

import com.calculadora.model.SimulationRequest;
import com.calculadora.model.SimulationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class FinancialCalculatorServiceTest {

    private FinancialCalculatorService calculatorService;

    @BeforeEach
    void setUp() {
        calculatorService = new FinancialCalculatorService();
    }

    @Test
    @DisplayName("Deve indicar À VISTA como mais vantajoso quando o desconto for expressivo (15%)")
    void testDescontoExpressivoFavoreceAVista() {
        SimulationRequest request = new SimulationRequest();
        request.setValorTotal(new BigDecimal("1200.00"));
        request.setDescontoAVistaPercentual(new BigDecimal("15.0"));
        request.setQuantidadeParcelas(10);
        request.setComJuros(false);
        request.setPercentualCdi(new BigDecimal("105.0"));
        request.setTaxaCdiAnual(new BigDecimal("11.25"));
        request.setConsiderarIrRegressivo(true);

        SimulationResult result = calculatorService.calculate(request);

        assertNotNull(result);
        assertEquals("A_VISTA", result.getMelhorOpcao());
        assertEquals(new BigDecimal("1020.00"), result.getValorAVista());
        assertEquals(10, result.getMesesEvolucao().size());
        assertTrue(result.getDiferencaEconomia().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(result.getDescontoMinimoEquilibrio().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(result.getDescontoMinimoEquilibrio().compareTo(new BigDecimal("15.0")) < 0);
    }

    @Test
    @DisplayName("Deve indicar PARCELADO no CDB como mais vantajoso com desconto baixo (2%) e 12x")
    void testDescontoBaixoFavoreceParceladoComCdb() {
        SimulationRequest request = new SimulationRequest();
        request.setValorTotal(new BigDecimal("2400.00"));
        request.setDescontoAVistaPercentual(new BigDecimal("2.0"));
        request.setQuantidadeParcelas(12);
        request.setComJuros(false);
        request.setPercentualCdi(new BigDecimal("105.0"));
        request.setTaxaCdiAnual(new BigDecimal("11.25"));
        request.setConsiderarIrRegressivo(true);

        SimulationResult result = calculatorService.calculate(request);

        assertNotNull(result);
        assertEquals("PARCELADO_CDB", result.getMelhorOpcao());
        assertEquals(12, result.getMesesEvolucao().size());
        assertTrue(result.getRendimentoLiquidoTotal().compareTo(new BigDecimal("48.00")) > 0);
        assertTrue(result.getDiferencaEconomia().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Deve respeitar as alíquotas regressivas de IR ao longo dos meses")
    void testAliquotaRegressivaIrAoLongoDoTempo() {
        SimulationRequest request = new SimulationRequest();
        request.setValorTotal(new BigDecimal("1200.00"));
        request.setDescontoAVistaPercentual(new BigDecimal("5.0"));
        request.setQuantidadeParcelas(12);
        request.setComJuros(false);
        request.setPercentualCdi(new BigDecimal("100.0"));
        request.setTaxaCdiAnual(new BigDecimal("10.0"));
        request.setConsiderarIrRegressivo(true);

        SimulationResult result = calculatorService.calculate(request);

        assertEquals(12, result.getMesesEvolucao().size());
        // Meses 1 a 6 devem ter alíquota 22.5%
        for (int i = 0; i < 6; i++) {
            assertEquals(new BigDecimal("22.5"), result.getMesesEvolucao().get(i).getAliquotaIr());
        }
        // Meses 7 a 12 devem ter alíquota 20.0%
        for (int i = 6; i < 12; i++) {
            assertEquals(new BigDecimal("20.0"), result.getMesesEvolucao().get(i).getAliquotaIr());
        }
    }

    @Test
    @DisplayName("Deve calcular corretamente quando houver juros de parcelamento")
    void testParcelamentoComJuros() {
        SimulationRequest request = new SimulationRequest();
        request.setValorTotal(new BigDecimal("1000.00"));
        request.setDescontoAVistaPercentual(new BigDecimal("5.0"));
        request.setQuantidadeParcelas(5);
        request.setComJuros(true);
        request.setTaxaJurosParcelamento(new BigDecimal("2.5")); // 2.5% ao mês
        request.setPercentualCdi(new BigDecimal("105.0"));
        request.setTaxaCdiAnual(new BigDecimal("11.25"));

        SimulationResult result = calculatorService.calculate(request);

        assertNotNull(result);
        assertTrue(result.getValorTotalParcelado().compareTo(new BigDecimal("1000.00")) > 0);
        assertEquals(5, result.getMesesEvolucao().size());
    }
}
