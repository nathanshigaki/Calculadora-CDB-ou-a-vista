package com.calculadora.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class SimulationRequest {

    @NotNull(message = "O valor total da compra é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor total deve ser maior que zero.")
    private BigDecimal valorTotal;

    @DecimalMin(value = "0.0", message = "O desconto à vista não pode ser negativo.")
    private BigDecimal descontoAVistaPercentual;

    private BigDecimal valorAVistaManual;

    @NotNull(message = "A quantidade de parcelas é obrigatória.")
    @Min(value = 1, message = "A quantidade mínima de parcelas é 1.")
    private Integer quantidadeParcelas;

    private Boolean comJuros = false;

    private BigDecimal taxaJurosParcelamento = BigDecimal.ZERO;

    @NotNull(message = "O percentual do CDI é obrigatório.")
    @DecimalMin(value = "1.0", message = "O percentual do CDI deve ser positivo.")
    private BigDecimal percentualCdi = new BigDecimal("105.0");

    @NotNull(message = "A taxa anual do CDI é obrigatória.")
    @DecimalMin(value = "0.1", message = "A taxa anual do CDI deve ser maior que zero.")
    private BigDecimal taxaCdiAnual = new BigDecimal("11.25");

    private Boolean considerarIrRegressivo = true;

    public SimulationRequest() {
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public BigDecimal getDescontoAVistaPercentual() {
        return descontoAVistaPercentual;
    }

    public void setDescontoAVistaPercentual(BigDecimal descontoAVistaPercentual) {
        this.descontoAVistaPercentual = descontoAVistaPercentual;
    }

    public BigDecimal getValorAVistaManual() {
        return valorAVistaManual;
    }

    public void setValorAVistaManual(BigDecimal valorAVistaManual) {
        this.valorAVistaManual = valorAVistaManual;
    }

    public Integer getQuantidadeParcelas() {
        return quantidadeParcelas;
    }

    public void setQuantidadeParcelas(Integer quantidadeParcelas) {
        this.quantidadeParcelas = quantidadeParcelas;
    }

    public Boolean getComJuros() {
        return comJuros != null ? comJuros : false;
    }

    public void setComJuros(Boolean comJuros) {
        this.comJuros = comJuros;
    }

    public BigDecimal getTaxaJurosParcelamento() {
        return taxaJurosParcelamento != null ? taxaJurosParcelamento : BigDecimal.ZERO;
    }

    public void setTaxaJurosParcelamento(BigDecimal taxaJurosParcelamento) {
        this.taxaJurosParcelamento = taxaJurosParcelamento;
    }

    public BigDecimal getPercentualCdi() {
        return percentualCdi != null ? percentualCdi : new BigDecimal("105.0");
    }

    public void setPercentualCdi(BigDecimal percentualCdi) {
        this.percentualCdi = percentualCdi;
    }

    public BigDecimal getTaxaCdiAnual() {
        return taxaCdiAnual != null ? taxaCdiAnual : new BigDecimal("11.25");
    }

    public void setTaxaCdiAnual(BigDecimal taxaCdiAnual) {
        this.taxaCdiAnual = taxaCdiAnual;
    }

    public Boolean getConsiderarIrRegressivo() {
        return considerarIrRegressivo != null ? considerarIrRegressivo : true;
    }

    public void setConsiderarIrRegressivo(Boolean considerarIrRegressivo) {
        this.considerarIrRegressivo = considerarIrRegressivo;
    }
}
