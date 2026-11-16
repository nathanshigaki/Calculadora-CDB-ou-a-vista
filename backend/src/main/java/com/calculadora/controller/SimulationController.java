package com.calculadora.controller;

import com.calculadora.model.AiAnalysisResponse;
import com.calculadora.model.DefaultRatesResponse;
import com.calculadora.model.SimulationRequest;
import com.calculadora.model.SimulationResult;
import com.calculadora.service.FinancialCalculatorService;
import com.calculadora.service.GeminiAdvisorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final FinancialCalculatorService calculatorService;
    private final GeminiAdvisorService advisorService;

    @Value("${app.financial.default-selic:11.25}")
    private BigDecimal defaultSelic;

    @Value("${app.financial.default-cdb-percent:105.0}")
    private BigDecimal defaultCdbPercent;

    public SimulationController(FinancialCalculatorService calculatorService, GeminiAdvisorService advisorService) {
        this.calculatorService = calculatorService;
        this.advisorService = advisorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<SimulationResult> calculate(@Valid @RequestBody SimulationRequest request) {
        SimulationResult result = calculatorService.calculate(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ai-analysis")
    public ResponseEntity<AiAnalysisResponse> getAiAnalysis(@RequestBody SimulationResult result) {
        AiAnalysisResponse analysis = advisorService.analyze(result);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/defaults")
    public ResponseEntity<DefaultRatesResponse> getDefaultRates() {
        return ResponseEntity.ok(new DefaultRatesResponse(defaultSelic, defaultCdbPercent));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Calculadora CDB vs À Vista API"
        ));
    }
}
