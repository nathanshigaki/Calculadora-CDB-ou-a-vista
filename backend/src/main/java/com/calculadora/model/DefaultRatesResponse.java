package com.calculadora.model;

import java.math.BigDecimal;

public class DefaultRatesResponse {

    private BigDecimal taxaCdiAnualPadrao;
    private BigDecimal percentualCdiMercadoPago;

    public DefaultRatesResponse() {
    }

    public DefaultRatesResponse(BigDecimal taxaCdiAnualPadrao, BigDecimal percentualCdiMercadoPago) {
        this.taxaCdiAnualPadrao = taxaCdiAnualPadrao;
        this.percentualCdiMercadoPago = percentualCdiMercadoPago;
    }

    public BigDecimal getTaxaCdiAnualPadrao() {
        return taxaCdiAnualPadrao;
    }

    public void setTaxaCdiAnualPadrao(BigDecimal taxaCdiAnualPadrao) {
        this.taxaCdiAnualPadrao = taxaCdiAnualPadrao;
    }

    public BigDecimal getPercentualCdiMercadoPago() {
        return percentualCdiMercadoPago;
    }

    public void setPercentualCdiMercadoPago(BigDecimal percentualCdiMercadoPago) {
        this.percentualCdiMercadoPago = percentualCdiMercadoPago;
    }
}
