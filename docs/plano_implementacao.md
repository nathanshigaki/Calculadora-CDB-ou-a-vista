# Plano de Implementação: Calculadora de Economicidade (À Vista vs. Parcelado no CDB)

Este projeto tem como objetivo construir uma aplicação completa (monorepo) para comparar a economicidade de compras: **Pagar à vista com desconto** versus **Pagar parcelado mantendo o dinheiro rendendo no CDB com liquidez diária do Mercado Pago / Mercado Livre**.

A solução calculará a evolução patrimonial mês a mês debitando as parcelas do saldo investido, apurando o rendimento líquido real e integrando o **Google Gemini (via Spring AI)** para determinar o ponto de equilíbrio (*break-even*) e fornecer análises e recomendações financeiras contextualizadas.

---

## 1. Visão Geral da Arquitetura & Tecnologias

A aplicação é estruturada como um **Monorepo** moderno, conteinerizado com Docker:

```
calculadora-cdb-ou-avista/
├── docs/                     # Documentação de arquitetura, tarefas e especificações
│   ├── plano_implementacao.md
│   ├── tasks.md
│   └── arquitetura.md
├── backend/                  # Java 21 / Spring Boot 3.4
│   ├── src/main/java/com/calculadora/
│   │   ├── controller/      # Endpoints REST (Simulação & Análise IA)
│   │   ├── service/         # Motor de cálculo financeiro & Integração Gemini
│   │   ├── model/           # DTOs de Request/Response e Entidades de domínio
│   │   └── config/          # Configuração de CORS, Spring AI e Beans
│   ├── pom.xml              # Maven dependencies (Spring Boot, Spring AI, Validation)
│   └── Dockerfile           # Multi-stage build com OpenJDK
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
│   ├── src/
│   │   ├── components/      # Formulário, Tabela de Evolução, Gráfico, Card de Veredito
│   │   ├── services/        # Cliente HTTP (Axios / Fetch)
│   │   ├── types/           # Interfaces TypeScript sincronizadas com o backend
│   │   └── lib/             # Utilitários de formatação (Moeda BRL, Porcentagem)
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile           # Multi-stage build com Nginx
├── docker-compose.yml        # Orquestração de frontend + backend
└── README.md                 # Guia de execução rápida e documentação da API
```

---

## 2. Modelagem e Regras do Motor Financeiro

### 2.1 Fluxo de Caixa Mês a Mês (Decaimento com Rendimento)
1. **Aporte Inicial**: O comprador possui o montante do valor total disponível para pagamento no instante $t_0$, alocado em um CDB diário (ex: 105% do CDI).
2. **Cálculo da Taxa Diária / Mensal Efetiva**:
   - Taxa Selic / CDI base anual: $i_{ano}$ (ex: 11,25% a.a.)
   - Multiplicador do CDB: $k$ (ex: 105% do CDI) $\rightarrow i_{efetiva\_ano} = i_{ano} \times k$
   - Taxa mensal equivalente aproximada para dias úteis (252 dias/ano ou convenção 30/360):
     $$i_{mes} = (1 + i_{efetiva\_ano})^{1/12} - 1$$
3. **Evolução Mensal ($m = 1 \dots N$)**:
   - $\text{Saldo Inicial}_m = \text{Saldo Final}_{m-1}$ (para $m=1$, $\text{Saldo Inicial}_1 = \text{Valor Total}$)
   - $\text{Rendimento Bruto}_m = \text{Saldo Inicial}_m \times i_{mes}$
   - $\text{Imposto de Renda (IR Regressivo)}^*$:
     - Até 180 dias (1 a 6 meses): 22,5%
     - 181 a 360 dias (7 a 12 meses): 20,0%
     - 361 a 720 dias (13 a 24 meses): 17,5%
     - Acima de 720 dias (> 24 meses): 15,0%
   - $\text{Rendimento Líquido}_m = \text{Rendimento Bruto}_m \times (1 - \text{Alíquota IR})$
   - $\text{Débito da Parcela}: P$
   - $\text{Saldo Final}_m = \text{Saldo Inicial}_m + \text{Rendimento Líquido}_m - P$
4. **Comparativo Final**:
   - **Cenário À Vista**: Desembolso imediato de $V_{\text{à vista}} = V_{\text{total}} \times (1 - \text{desconto})$.
   - **Cenário Parcelado**: Custo efetivo igual a $V_{\text{parcelado total}} - \text{Rendimento Líquido Total}$.
   - **Economia Líquida**: Diferença financeira exata entre os dois cenários, indicando qual gerou maior preservação de capital.
   - **Ponto de Equilíbrio (Break-Even)**: Percentual de desconto à vista que iguala os custos dos dois cenários.
