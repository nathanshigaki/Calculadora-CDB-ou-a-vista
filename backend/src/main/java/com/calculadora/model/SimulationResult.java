package com.calculadora.model;

import java.math.BigDecimal;
import java.util.List;

public class SimulationResult {

    private String melhorOpcao; // "A_VISTA" ou "PARCELADO_CDB"
    private String tituloVeredicto;
    private String motivoVeredicto;

    private BigDecimal valorTotalOriginal;
    private BigDecimal valorAVista;
    private BigDecimal descontoAVistaPercentual;

    private BigDecimal valorTotalParcelado;
    private BigDecimal valorParcelaMensal;
    private int quantidadeParcelas;

    private BigDecimal taxaCdiAnual;
    private BigDecimal percentualCdi;
    private BigDecimal taxaMensalEfetivaCdi;

    private BigDecimal rendimentoBrutoTotal;
    private BigDecimal irTotalRetido;
    private BigDecimal rendimentoLiquidoTotal;

    private BigDecimal saldoFinalAposQuitacao;
    private BigDecimal custoEfetivoParcelado; // Total pago parcelado - rendimentos líquidos
    private BigDecimal diferencaEconomia;     // Economia absoluta em R$
    private BigDecimal percentualEconomia;    // Economia percentual

    private BigDecimal descontoMinimoEquilibrio; // % de desconto à vista que empata com o rendimento

    private List<MonthlyEntry> mesesEvolucao;

    public SimulationResult() {
    }

    public String getMelhorOpcao() {
        return melhorOpcao;
    }

    public void setMelhorOpcao(String melhorOpcao) {
        this.melhorOpcao = melhorOpcao;
    }

    public String getTituloVeredicto() {
        return tituloVeredicto;
    }

    public void setTituloVeredicto(String tituloVeredicto) {
        this.tituloVeredicto = tituloVeredicto;
    }

    public String getMotivoVeredicto() {
        return motivoVeredicto;
    }

    public void setMotivoVeredicto(String motivoVeredicto) {
        this.motivoVeredicto = motivoVeredicto;
    }

    public BigDecimal getValorTotalOriginal() {
        return valorTotalOriginal;
    }

    public void setValorTotalOriginal(BigDecimal valorTotalOriginal) {
        this.valorTotalOriginal = valorTotalOriginal;
    }

    public BigDecimal getValorAVista() {
        return valorAVista;
    }

    public void setValorAVista(BigDecimal valorAVista) {
        this.valorAVista = valorAVista;
    }

    public BigDecimal getDescontoAVistaPercentual() {
        return descontoAVistaPercentual;
    }

    public void setDescontoAVistaPercentual(BigDecimal descontoAVistaPercentual) {
        this.descontoAVistaPercentual = descontoAVistaPercentual;
    }

    public BigDecimal getValorTotalParcelado() {
        return valorTotalParcelado;
    }

    public void setValorTotalParcelado(BigDecimal valorTotalParcelado) {
        this.valorTotalParcelado = valorTotalParcelado;
    }

    public BigDecimal getValorParcelaMensal() {
        return valorParcelaMensal;
    }

    public void setValorParcelaMensal(BigDecimal valorParcelaMensal) {
        this.valorParcelaMensal = valorParcelaMensal;
    }

    public int getQuantidadeParcelas() {
        return quantidadeParcelas;
    }

    public void setQuantidadeParcelas(int quantidadeParcelas) {
        this.quantidadeParcelas = quantidadeParcelas;
    }

    public BigDecimal getTaxaCdiAnual() {
        return taxaCdiAnual;
    }

    public void setTaxaCdiAnual(BigDecimal taxaCdiAnual) {
        this.taxaCdiAnual = taxaCdiAnual;
    }

    public BigDecimal getPercentualCdi() {
        return percentualCdi;
    }

    public void setPercentualCdi(BigDecimal percentualCdi) {
        this.percentualCdi = percentualCdi;
    }

    public BigDecimal getTaxaMensalEfetivaCdi() {
        return taxaMensalEfetivaCdi;
    }

    public void setTaxaMensalEfetivaCdi(BigDecimal taxaMensalEfetivaCdi) {
        this.taxaMensalEfetivaCdi = taxaMensalEfetivaCdi;
    }

    public BigDecimal getRendimentoBrutoTotal() {
        return rendimentoBrutoTotal;
    }

    public void setRendimentoBrutoTotal(BigDecimal rendimentoBrutoTotal) {
        this.rendimentoBrutoTotal = rendimentoBrutoTotal;
    }

    public BigDecimal getIrTotalRetido() {
        return irTotalRetido;
    }

    public void setIrTotalRetido(BigDecimal irTotalRetido) {
        this.irTotalRetido = irTotalRetido;
    }

    public BigDecimal getRendimentoLiquidoTotal() {
        return rendimentoLiquidoTotal;
    }

    public void setRendimentoLiquidoTotal(BigDecimal rendimentoLiquidoTotal) {
        this.rendimentoLiquidoTotal = rendimentoLiquidoTotal;
    }

    public BigDecimal getSaldoFinalAposQuitacao() {
        return saldoFinalAposQuitacao;
    }

    public void setSaldoFinalAposQuitacao(BigDecimal saldoFinalAposQuitacao) {
        this.saldoFinalAposQuitacao = saldoFinalAposQuitacao;
    }

    public BigDecimal getCustoEfetivoParcelado() {
        return custoEfetivoParcelado;
    }

    public void setCustoEfetivoParcelado(BigDecimal custoEfetivoParcelado) {
        this.custoEfetivoParcelado = custoEfetivoParcelado;
    }

    public BigDecimal getDiferencaEconomia() {
        return diferencaEconomia;
    }

    public void setDiferencaEconomia(BigDecimal diferencaEconomia) {
        this.diferencaEconomia = diferencaEconomia;
    }

    public BigDecimal getPercentualEconomia() {
        return percentualEconomia;
    }

    public void setPercentualEconomia(BigDecimal percentualEconomia) {
        this.percentualEconomia = percentualEconomia;
    }

    public BigDecimal getDescontoMinimoEquilibrio() {
        return descontoMinimoEquilibrio;
    }

    public void setDescontoMinimoEquilibrio(BigDecimal descontoMinimoEquilibrio) {
        this.descontoMinimoEquilibrio = descontoMinimoEquilibrio;
    }

    public List<MonthlyEntry> getMesesEvolucao() {
        return mesesEvolucao;
    }

    public void setMesesEvolucao(List<MonthlyEntry> mesesEvolucao) {
        this.mesesEvolucao = mesesEvolucao;
    }
}
