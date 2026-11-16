package com.calculadora.model;

import java.math.BigDecimal;
import java.util.List;

public class AiAnalysisResponse {

    private String veredicto;
    private BigDecimal economiaEstimada;
    private BigDecimal descontoMinimoEquilibrio;
    private String pontoDeEquilibrioExplicado;
    private String analiseDetalhada;
    private List<String> recomendacoesEstrategicas;

    public AiAnalysisResponse() {
    }

    public AiAnalysisResponse(String veredicto, BigDecimal economiaEstimada,
                              BigDecimal descontoMinimoEquilibrio, String pontoDeEquilibrioExplicado,
                              String analiseDetalhada, List<String> recomendacoesEstrategicas) {
        this.veredicto = veredicto;
        this.economiaEstimada = economiaEstimada;
        this.descontoMinimoEquilibrio = descontoMinimoEquilibrio;
        this.pontoDeEquilibrioExplicado = pontoDeEquilibrioExplicado;
        this.analiseDetalhada = analiseDetalhada;
        this.recomendacoesEstrategicas = recomendacoesEstrategicas;
    }

    public String getVeredicto() {
        return veredicto;
    }

    public void setVeredicto(String veredicto) {
        this.veredicto = veredicto;
    }

    public BigDecimal getEconomiaEstimada() {
        return economiaEstimada;
    }

    public void setEconomiaEstimada(BigDecimal economiaEstimada) {
        this.economiaEstimada = economiaEstimada;
    }

    public BigDecimal getDescontoMinimoEquilibrio() {
        return descontoMinimoEquilibrio;
    }

    public void setDescontoMinimoEquilibrio(BigDecimal descontoMinimoEquilibrio) {
        this.descontoMinimoEquilibrio = descontoMinimoEquilibrio;
    }

    public String getPontoDeEquilibrioExplicado() {
        return pontoDeEquilibrioExplicado;
    }

    public void setPontoDeEquilibrioExplicado(String pontoDeEquilibrioExplicado) {
        this.pontoDeEquilibrioExplicado = pontoDeEquilibrioExplicado;
    }

    public String getAnaliseDetalhada() {
        return analiseDetalhada;
    }

    public void setAnaliseDetalhada(String analiseDetalhada) {
        this.analiseDetalhada = analiseDetalhada;
    }

    public List<String> getRecomendacoesEstrategicas() {
        return recomendacoesEstrategicas;
    }

    public void setRecomendacoesEstrategicas(List<String> recomendacoesEstrategicas) {
        this.recomendacoesEstrategicas = recomendacoesEstrategicas;
    }
}
