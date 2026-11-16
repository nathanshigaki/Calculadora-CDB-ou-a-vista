package com.calculadora.service;

import com.calculadora.model.MonthlyEntry;
import com.calculadora.model.SimulationRequest;
import com.calculadora.model.SimulationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinancialCalculatorService {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);
    private static final int SCALE_MONEY = 2;
    private static final int SCALE_RATE = 4;

    public SimulationResult calculate(SimulationRequest request) {
        BigDecimal valorTotal = request.getValorTotal().setScale(SCALE_MONEY, RoundingMode.HALF_UP);
        int parcelas = request.getQuantidadeParcelas();

        // 1. Calcular Valor à Vista e % de Desconto
        BigDecimal valorAVista;
        BigDecimal descontoPercentual;

        if (request.getValorAVistaManual() != null && request.getValorAVistaManual().compareTo(BigDecimal.ZERO) > 0) {
            valorAVista = request.getValorAVistaManual().setScale(SCALE_MONEY, RoundingMode.HALF_UP);
            if (valorTotal.compareTo(BigDecimal.ZERO) > 0) {
                descontoPercentual = valorTotal.subtract(valorAVista)
                        .divide(valorTotal, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP);
            } else {
                descontoPercentual = BigDecimal.ZERO;
            }
        } else {
            descontoPercentual = request.getDescontoAVistaPercentual() != null
                    ? request.getDescontoAVistaPercentual()
                    : BigDecimal.ZERO;
            BigDecimal fatorDesconto = BigDecimal.ONE.subtract(
                    descontoPercentual.divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP)
            );
            valorAVista = valorTotal.multiply(fatorDesconto).setScale(SCALE_MONEY, RoundingMode.HALF_UP);
        }

        // 2. Calcular Parcela e Total Parcelado (com ou sem juros)
        BigDecimal valorParcela;
        BigDecimal valorTotalParcelado;

        if (Boolean.TRUE.equals(request.getComJuros())
                && request.getTaxaJurosParcelamento() != null
                && request.getTaxaJurosParcelamento().compareTo(BigDecimal.ZERO) > 0) {
            // Tabela Price: P = V * [ j / (1 - (1+j)^(-n)) ]
            double taxaJurosMensal = request.getTaxaJurosParcelamento().doubleValue() / 100.0;
            double p = valorTotal.doubleValue() * (taxaJurosMensal / (1.0 - Math.pow(1.0 + taxaJurosMensal, -parcelas)));
            valorParcela = BigDecimal.valueOf(p).setScale(SCALE_MONEY, RoundingMode.HALF_UP);
            valorTotalParcelado = valorParcela.multiply(BigDecimal.valueOf(parcelas)).setScale(SCALE_MONEY, RoundingMode.HALF_UP);
        } else {
            valorParcela = valorTotal.divide(BigDecimal.valueOf(parcelas), SCALE_MONEY, RoundingMode.HALF_UP);
            valorTotalParcelado = valorParcela.multiply(BigDecimal.valueOf(parcelas)).setScale(SCALE_MONEY, RoundingMode.HALF_UP);
        }

        // 3. Calcular Taxa Efetiva Mensal do CDB
        BigDecimal taxaCdiAnual = request.getTaxaCdiAnual();
        BigDecimal percentualCdi = request.getPercentualCdi();

        double taxaAnualDecimal = (taxaCdiAnual.doubleValue() / 100.0) * (percentualCdi.doubleValue() / 100.0);
        double taxaMensalDecimal = Math.pow(1.0 + taxaAnualDecimal, 1.0 / 12.0) - 1.0;
        BigDecimal taxaMensalEfetiva = BigDecimal.valueOf(taxaMensalDecimal * 100.0).setScale(SCALE_RATE, RoundingMode.HALF_UP);

        // 4. Simulação Mês a Mês
        List<MonthlyEntry> meses = new ArrayList<>();
        BigDecimal saldoAtual = valorTotal;
        BigDecimal rendimentoBrutoTotal = BigDecimal.ZERO;
        BigDecimal irTotalRetido = BigDecimal.ZERO;
        BigDecimal rendimentoLiquidoTotal = BigDecimal.ZERO;
        BigDecimal rendimentoAcumulado = BigDecimal.ZERO;

        boolean considerarIr = Boolean.TRUE.equals(request.getConsiderarIrRegressivo());

        for (int mes = 1; mes <= parcelas; mes++) {
            BigDecimal saldoInicial = saldoAtual;

            // Rendimento do mês sobre o saldo que ficou aplicado
            BigDecimal rendimentoBruto = saldoInicial.multiply(BigDecimal.valueOf(taxaMensalDecimal), MC)
                    .setScale(SCALE_MONEY, RoundingMode.HALF_UP);

            // Tabela Regressiva de IR
            BigDecimal aliquotaIr = BigDecimal.ZERO;
            if (considerarIr) {
                if (mes <= 6) {
                    aliquotaIr = new BigDecimal("22.5");
                } else if (mes <= 12) {
                    aliquotaIr = new BigDecimal("20.0");
                } else if (mes <= 24) {
                    aliquotaIr = new BigDecimal("17.5");
                } else {
                    aliquotaIr = new BigDecimal("15.0");
                }
            }

            BigDecimal irRetido = rendimentoBruto.multiply(aliquotaIr.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                    .setScale(SCALE_MONEY, RoundingMode.HALF_UP);
            BigDecimal rendimentoLiquido = rendimentoBruto.subtract(irRetido);

            // Ajuste na última parcela para evitar resíduo por arredondamento
            BigDecimal parcelaDoMes = (mes == parcelas)
                    ? valorTotalParcelado.subtract(valorParcela.multiply(BigDecimal.valueOf(parcelas - 1)))
                    : valorParcela;

            // Saldo final: saldo anterior + rendimento líquido - parcela
            BigDecimal saldoFinal = saldoInicial.add(rendimentoLiquido).subtract(parcelaDoMes);
            if (saldoFinal.compareTo(BigDecimal.ZERO) < 0) {
                saldoFinal = BigDecimal.ZERO;
            }

            rendimentoAcumulado = rendimentoAcumulado.add(rendimentoLiquido);
            rendimentoBrutoTotal = rendimentoBrutoTotal.add(rendimentoBruto);
            irTotalRetido = irTotalRetido.add(irRetido);
            rendimentoLiquidoTotal = rendimentoLiquidoTotal.add(rendimentoLiquido);

            meses.add(new MonthlyEntry(
                    mes,
                    saldoInicial,
                    rendimentoBruto,
                    aliquotaIr,
                    irRetido,
                    rendimentoLiquido,
                    parcelaDoMes,
                    saldoFinal,
                    rendimentoAcumulado
            ));

            saldoAtual = saldoFinal;
        }

        // 5. Comparativo de Economicidade
        // Custo efetivo de parcelar = Total pago - Rendimentos líquidos acumulados
        BigDecimal custoEfetivoParcelado = valorTotalParcelado.subtract(rendimentoLiquidoTotal).setScale(SCALE_MONEY, RoundingMode.HALF_UP);
        BigDecimal diferenca = valorAVista.subtract(custoEfetivoParcelado).abs().setScale(SCALE_MONEY, RoundingMode.HALF_UP);

        String melhorOpcao;
        String tituloVeredicto;
        String motivoVeredicto;
        BigDecimal percentualEconomia;

        if (valorAVista.compareTo(custoEfetivoParcelado) < 0) {
            melhorOpcao = "A_VISTA";
            tituloVeredicto = "Pagar À Vista é mais vantajoso!";
            percentualEconomia = diferenca.divide(custoEfetivoParcelado, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
            motivoVeredicto = String.format(
                    "O desconto oferecido à vista (R$ %s ou %s%%) supera o rendimento líquido gerado pelo CDB no período (R$ %s). Você economiza R$ %s.",
                    valorTotal.subtract(valorAVista),
                    descontoPercentual,
                    rendimentoLiquidoTotal,
                    diferenca
            );
        } else if (valorAVista.compareTo(custoEfetivoParcelado) > 0) {
            melhorOpcao = "PARCELADO_CDB";
            tituloVeredicto = "Parcelar e investir no CDB é mais vantajoso!";
            percentualEconomia = diferenca.divide(valorAVista, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
            motivoVeredicto = String.format(
                    "O rendimento líquido do CDB Mercado Pago (R$ %s) supera a economia do desconto à vista (R$ %s). Mantendo o dinheiro investido e pagando as parcelas, você ganha R$ %s adicionais.",
                    rendimentoLiquidoTotal,
                    valorTotal.subtract(valorAVista),
                    diferenca
            );
        } else {
            melhorOpcao = "INDIFERENTE";
            tituloVeredicto = "Ambas as opções são financeiramente equivalentes!";
            percentualEconomia = BigDecimal.ZERO;
            motivoVeredicto = "O rendimento gerado pelo CDB é exatamente igual ao desconto concedido à vista.";
        }

        // 6. Ponto de Equilíbrio (Break-Even Discount %)
        BigDecimal jurosAdicionais = valorTotalParcelado.subtract(valorTotal);
        BigDecimal beneficioParceladoTotal = rendimentoLiquidoTotal.subtract(jurosAdicionais);
        BigDecimal descontoMinimoEquilibrio = beneficioParceladoTotal.divide(valorTotal, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);

        if (descontoMinimoEquilibrio.compareTo(BigDecimal.ZERO) < 0) {
            descontoMinimoEquilibrio = BigDecimal.ZERO;
        }

        // Montar e retornar resultado
        SimulationResult result = new SimulationResult();
        result.setMelhorOpcao(melhorOpcao);
        result.setTituloVeredicto(tituloVeredicto);
        result.setMotivoVeredicto(motivoVeredicto);
        result.setValorTotalOriginal(valorTotal);
        result.setValorAVista(valorAVista);
        result.setDescontoAVistaPercentual(descontoPercentual);
        result.setValorTotalParcelado(valorTotalParcelado);
        result.setValorParcelaMensal(valorParcela);
        result.setQuantidadeParcelas(parcelas);
        result.setTaxaCdiAnual(taxaCdiAnual);
        result.setPercentualCdi(percentualCdi);
        result.setTaxaMensalEfetivaCdi(taxaMensalEfetiva);
        result.setRendimentoBrutoTotal(rendimentoBrutoTotal);
        result.setIrTotalRetido(irTotalRetido);
        result.setRendimentoLiquidoTotal(rendimentoLiquidoTotal);
        result.setSaldoFinalAposQuitacao(saldoAtual);
        result.setCustoEfetivoParcelado(custoEfetivoParcelado);
        result.setDiferencaEconomia(diferenca);
        result.setPercentualEconomia(percentualEconomia);
        result.setDescontoMinimoEquilibrio(descontoMinimoEquilibrio);
        result.setMesesEvolucao(meses);

        return result;
    }
}
