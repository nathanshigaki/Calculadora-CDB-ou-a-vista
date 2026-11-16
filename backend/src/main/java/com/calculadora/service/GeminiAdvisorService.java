package com.calculadora.service;

import com.calculadora.model.AiAnalysisResponse;
import com.calculadora.model.SimulationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GeminiAdvisorService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAdvisorService.class);

    private final ObjectProvider<ChatModel> chatModelProvider;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    public GeminiAdvisorService(ObjectProvider<ChatModel> chatModelProvider, ObjectMapper objectMapper) {
        this.chatModelProvider = chatModelProvider;
        this.objectMapper = objectMapper;
    }

    public AiAnalysisResponse analyze(SimulationResult result) {
        // Se a chave não estiver configurada ou for o placeholder padrão, usa o fallback inteligente
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("placeholder")) {
            log.info("Chave GEMINI_API_KEY não configurada ou em modo placeholder. Utilizando consultor analítico local.");
            return generateFallbackAnalysis(result);
        }

        try {
            ChatModel chatModel = chatModelProvider != null ? chatModelProvider.getIfAvailable() : null;
            if (chatModel == null) {
                return generateFallbackAnalysis(result);
            }

            String systemPrompt = """
                    Você é um especialista em Finanças Pessoais e Matemática Financeira no Brasil.
                    Sua missão é analisar compras comparando: Pagamento À Vista com Desconto versus Parcelamento mantendo o dinheiro no CDB diário (ex: Mercado Pago / Mercado Livre).
                    
                    Você deve responder estritamente em formato JSON válido, sem blocos de markdown adicionais, com as seguintes chaves:
                    {
                      "veredicto": "PAGAR_A_VISTA" ou "PARCELADO_CDB" ou "INDIFERENTE",
                      "pontoDeEquilibrioExplicado": "Explicação didática e clara sobre a taxa/desconto de break-even e o momento onde o investimento começa a compensar",
                      "analiseDetalhada": "Parágrafo aprofundado explicando os números, economia real e comportamento financeiro",
                      "recomendacoesEstrategicas": ["dica 1", "dica 2", "dica 3"]
                    }
                    """;

            String userPrompt = String.format("""
                    Analise os seguintes dados financeiros:
                    - Valor Total Original: R$ %s
                    - Valor À Vista com Desconto: R$ %s (Desconto de %s%%)
                    - Quantidade de Parcelas: %d vezes de R$ %s
                    - Total Pago no Parcelamento: R$ %s
                    - Taxa Selic/CDI Anual: %s%% (Remuneração CDB: %s%% do CDI)
                    - Rendimento Líquido Acumulado do CDB: R$ %s
                    - Custo Efetivo Parcelado (Total - Rendimento): R$ %s
                    - Diferença de Economia Real: R$ %s
                    - Ponto de Equilíbrio Calculado (Desconto Mínimo de Indiferença): %s%%
                    - Veredicto Determinístico do Motor: %s
                    
                    Gere o JSON com a explicação do ponto de equilíbrio e as recomendações práticas (disciplina de manter o dinheiro aplicado, limite de cartão, liquidez para emergências).
                    """,
                    result.getValorTotalOriginal(),
                    result.getValorAVista(),
                    result.getDescontoAVistaPercentual(),
                    result.getQuantidadeParcelas(),
                    result.getValorParcelaMensal(),
                    result.getValorTotalParcelado(),
                    result.getTaxaCdiAnual(),
                    result.getPercentualCdi(),
                    result.getRendimentoLiquidoTotal(),
                    result.getCustoEfetivoParcelado(),
                    result.getDiferencaEconomia(),
                    result.getDescontoMinimoEquilibrio(),
                    result.getMelhorOpcao()
            );

            Prompt prompt = new Prompt(List.of(
                    new SystemMessage(systemPrompt),
                    new UserMessage(userPrompt)
            ));

            String responseContent = chatModel.call(prompt).getResult().getOutput().getContent();
            return parseAiResponse(responseContent, result);

        } catch (Exception e) {
            log.warn("Erro ao consultar a API do Gemini via Spring AI. Acionando análise financeira de fallback: {}", e.getMessage());
            return generateFallbackAnalysis(result);
        }
    }

    private AiAnalysisResponse parseAiResponse(String rawJson, SimulationResult result) {
        try {
            // Limpa possíveis delimitadores de markdown ```json ... ```
            String cleanJson = rawJson.trim();
            if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.replaceAll("^```json", "").replaceAll("^```", "").replaceAll("```$", "").trim();
            }

            JsonNode node = objectMapper.readTree(cleanJson);
            String veredicto = node.has("veredicto") ? node.get("veredicto").asText() : result.getMelhorOpcao();
            String pontoEq = node.has("pontoDeEquilibrioExplicado") ? node.get("pontoDeEquilibrioExplicado").asText() : "";
            String analise = node.has("analiseDetalhada") ? node.get("analiseDetalhada").asText() : "";

            List<String> recomendacoes = new ArrayList<>();
            if (node.has("recomendacoesEstrategicas") && node.get("recomendacoesEstrategicas").isArray()) {
                for (JsonNode rec : node.get("recomendacoesEstrategicas")) {
                    recomendacoes.add(rec.asText());
                }
            }

            return new AiAnalysisResponse(
                    veredicto,
                    result.getDiferencaEconomia(),
                    result.getDescontoMinimoEquilibrio(),
                    pontoEq,
                    analise,
                    recomendacoes.isEmpty() ? generateDefaultRecommendations(result) : recomendacoes
            );
        } catch (Exception e) {
            log.warn("Falha no parse do JSON do Gemini: {}. Usando análise estruturada de fallback.", e.getMessage());
            return generateFallbackAnalysis(result);
        }
    }

    public AiAnalysisResponse generateFallbackAnalysis(SimulationResult result) {
        BigDecimal breakEven = result.getDescontoMinimoEquilibrio();
        BigDecimal descontoAtual = result.getDescontoAVistaPercentual();

        String pontoDeEquilibrioExplicado = String.format(
                "O ponto de equilíbrio (break-even) é de %s%% de desconto à vista. " +
                "Como o desconto oferecido é de %s%%, %s",
                breakEven,
                descontoAtual,
                descontoAtual.compareTo(breakEven) > 0
                        ? "o desconto à vista supera o rendimento gerado pelo CDB no período, tornando a compra à vista superior."
                        : "manter o capital investido a " + result.getPercentualCdi() + "% do CDI rende mais do que o desconto concedido, favorecendo o parcelamento."
        );

        String analiseDetalhada;
        if ("A_VISTA".equals(result.getMelhorOpcao())) {
            analiseDetalhada = String.format(
                    "Pagar à vista garante uma economia líquida imediata de R$ %s. " +
                    "Mesmo aplicando o valor total no CDB do Mercado Pago rendendo %s%% do CDI ao longo das %d parcelas (já descontado o IR), " +
                    "o rendimento obtido (R$ %s) não compensa o desconto de R$ %s oferecido pela loja.",
                    result.getDiferencaEconomia(),
                    result.getPercentualCdi(),
                    result.getQuantidadeParcelas(),
                    result.getRendimentoLiquidoTotal(),
                    result.getValorTotalOriginal().subtract(result.getValorAVista())
            );
        } else {
            analiseDetalhada = String.format(
                    "Parcelar em %dx de R$ %s e deixar o saldo rendendo no CDB diário do Mercado Pago gera um ganho adicional líquido de R$ %s. " +
                    "Como o rendimento líquido total alcança R$ %s contra apenas R$ %s de desconto à vista, " +
                    "o custo efetivo final da compra parcelada cai para R$ %s.",
                    result.getQuantidadeParcelas(),
                    result.getValorParcelaMensal(),
                    result.getDiferencaEconomia(),
                    result.getRendimentoLiquidoTotal(),
                    result.getValorTotalOriginal().subtract(result.getValorAVista()),
                    result.getCustoEfetivoParcelado()
            );
        }

        return new AiAnalysisResponse(
                result.getMelhorOpcao(),
                result.getDiferencaEconomia(),
                breakEven,
                pontoDeEquilibrioExplicado,
                analiseDetalhada,
                generateDefaultRecommendations(result)
        );
    }

    private List<String> generateDefaultRecommendations(SimulationResult result) {
        return Arrays.asList(
                "Disciplina Financeira: Se optar por parcelar, mantenha o dinheiro estritamente investido na conta com rendimento diário e debite apenas no dia do vencimento da fatura.",
                "Liquidez e Limite: Considere que o parcelamento compromete o limite do seu cartão de crédito até a quitação gradual das parcelas.",
                "Fator Imposto de Renda: Rendimentos de CDB sofrem retenção na fonte (22,5% nos primeiros 6 meses e 20% até 12 meses); nosso cálculo já considera o valor líquido real."
        );
    }
}
