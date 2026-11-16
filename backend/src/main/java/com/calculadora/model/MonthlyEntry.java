package com.calculadora.model;

import java.math.BigDecimal;

public class MonthlyEntry {
    private int mes;
    private BigDecimal saldoInicial;
    private BigDecimal rendimentoBruto;
    private BigDecimal aliquotaIr;
    private BigDecimal irRetido;
    private BigDecimal rendimentoLiquido;
    private BigDecimal parcelaPaga;
    private BigDecimal saldoFinal;
    private BigDecimal rendimentoAcumulado;

    public MonthlyEntry() {
    }

    public MonthlyEntry(int mes, BigDecimal saldoInicial, BigDecimal rendimentoBruto,
                        BigDecimal aliquotaIr, BigDecimal irRetido, BigDecimal rendimentoLiquido,
                        BigDecimal parcelaPaga, BigDecimal saldoFinal, BigDecimal rendimentoAcumulado) {
        this.mes = mes;
        this.saldoInicial = saldoInicial;
        this.rendimentoBruto = rendimentoBruto;
        this.aliquotaIr = aliquotaIr;
        this.irRetido = irRetido;
        this.rendimentoLiquido = rendimentoLiquido;
        this.parcelaPaga = parcelaPaga;
        this.saldoFinal = saldoFinal;
        this.rendimentoAcumulado = rendimentoAcumulado;
    }

    public int getMes() {
        return mes;
    }

    public void setMes(int mes) {
        this.mes = mes;
    }

    public BigDecimal getSaldoInicial() {
        return saldoInicial;
    }

    public void setSaldoInicial(BigDecimal saldoInicial) {
        this.saldoInicial = saldoInicial;
    }

    public BigDecimal getRendimentoBruto() {
        return rendimentoBruto;
    }

    public void setRendimentoBruto(BigDecimal rendimentoBruto) {
        this.rendimentoBruto = rendimentoBruto;
    }

    public BigDecimal getAliquotaIr() {
        return aliquotaIr;
    }

    public void setAliquotaIr(BigDecimal aliquotaIr) {
        this.aliquotaIr = aliquotaIr;
    }

    public BigDecimal getIrRetido() {
        return irRetido;
    }

    public void setIrRetido(BigDecimal irRetido) {
        this.irRetido = irRetido;
    }

    public BigDecimal getRendimentoLiquido() {
        return rendimentoLiquido;
    }

    public void setRendimentoLiquido(BigDecimal rendimentoLiquido) {
        this.rendimentoLiquido = rendimentoLiquido;
    }

    public BigDecimal getParcelaPaga() {
        return parcelaPaga;
    }

    public void setParcelaPaga(BigDecimal parcelaPaga) {
        this.parcelaPaga = parcelaPaga;
    }

    public BigDecimal getSaldoFinal() {
        return saldoFinal;
    }

    public void setSaldoFinal(BigDecimal saldoFinal) {
        this.saldoFinal = saldoFinal;
    }

    public BigDecimal getRendimentoAcumulado() {
        return rendimentoAcumulado;
    }

    public void setRendimentoAcumulado(BigDecimal rendimentoAcumulado) {
        this.rendimentoAcumulado = rendimentoAcumulado;
    }
}
