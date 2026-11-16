# 💰 Calculadora de Economicidade: À Vista com Desconto vs. CDB Mercado Pago

Aplicação monorepo completa para análise comparativa de compras: **Pagar à vista com desconto** versus **Pagar parcelado mantendo o dinheiro rendendo no CDB diário do Mercado Pago / Mercado Livre**.

A plataforma simula a evolução patrimonial mês a mês debitando as parcelas do saldo aplicado, calcula o rendimento líquido real (com opção de Imposto de Renda Regressivo) e utiliza a inteligência do **Google Gemini (via Spring AI)** para determinar o ponto de equilíbrio (*break-even point*) e fornecer recomendações estratégicas.

---

## 🛠️ Tecnologias Utilizadas

- **Backend**:
  - Java 21 / 25 LTS
  - Spring Boot 3.4.1 (Web, Validation, Test)
  - Spring AI (OpenAI-compatible client configurado para Google Gemini v1beta)
  - Maven
- **Frontend**:
  - React 18 / 19 + TypeScript
  - Vite
  - Tailwind CSS + shadcn/ui components
  - Recharts (Gráficos interativos)
  - Lucide React (Ícones modernos)
- **Containerização & Deploy**:
  - Docker & Docker Compose
  - Nginx Alpine (Reverse Proxy & SPA Routing)

---

## 📁 Estrutura do Monorepo

```
calculadora-cdb-ou-avista/
├── docs/                     # Documentação de arquitetura, tarefas e especificações
│   ├── plano_implementacao.md
│   ├── tasks.md              # Backlog de tarefas e convenções de commit
│   └── arquitetura.md        # Diagramas e fórmulas financeiras
├── backend/                  # API Spring Boot
│   ├── src/main/java/com/calculadora/
│   │   ├── config/          # CORS e configurações
│   │   ├── controller/      # Endpoints REST
│   │   ├── model/           # DTOs de Request/Response e Entidades
│   │   └── service/         # Motor de cálculo financeiro e Gemini Advisor
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                 # Interface React + Vite + Tailwind
│   ├── src/
│   │   ├── components/      # Form, Veredito, Tabela Mês a Mês, Gráficos, Card IA
│   │   ├── lib/             # Formatadores monetários em BRL
│   │   ├── services/        # Cliente HTTP de integração
│   │   └── types/           # Tipos TypeScript
│   ├── package.json
│   ├── nginx.conf           # Configuração de reverse proxy do container
│   └── Dockerfile
├── docker-compose.yml        # Orquestração do monorepo
└── README.md
```

---

## 🧠 Lógica Financeira

### 1. Simulação Mês a Mês
- O capital total da compra é alocado em um CDB com liquidez diária (ex: 105% do CDI, padrão Mercado Pago).
- A cada mês $m$, o saldo rende juros compostos baseados na taxa CDI anual.
- Aplica-se a **tabela regressiva de IR de Renda Fixa**:
  - 1º ao 6º mês ($\le 180$ dias): **22,5%**
  - 7º ao 12º mês (181 a 360 dias): **20,0%**
  - 13º ao 24º mês (361 a 720 dias): **17,5%**
  - Acima de 24 meses (> 720 dias): **15,0%**
- O valor da parcela é debitado do saldo ao final de cada mês.
- O saldo remanescente continua rendendo até a quitação da última parcela.

### 2. Ponto de Equilíbrio (*Break-Even Point*)
Calcula o desconto mínimo percentual à vista necessário para que pagar à vista empate com os rendimentos do CDB:
$$\text{Desconto Mínimo de Equilíbrio (\%)} = \frac{\text{Rendimento Líquido Total}}{V_{\text{total}}} \times 100$$
Se o desconto à vista oferecido pela loja for **maior** que esse índice, **pagar à vista** preserva mais capital. Se for **menor**, **parcelar mantendo investido** gera mais dinheiro.

---

## 🚀 Como Executar

### Opção 1: Via Docker Compose (Recomendado)

1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd "Calculadora CDB ou a vista"
   ```

2. (Opcional) Configure a sua chave de API do Gemini:
   ```bash
   # Windows PowerShell
   $env:GEMINI_API_KEY="sua_chave_aqui"

   # Linux/macOS
   export GEMINI_API_KEY="sua_chave_aqui"
   ```
   *(Caso não informe a chave, o sistema aciona automaticamente o consultor financeiro determinístico inteligente como fallback).*

3. Suba os containers:
   ```bash
   docker compose up --build
   ```

4. Acesse no navegador:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080/api/simulation/health](http://localhost:8080/api/simulation/health)

---

### Opção 2: Execução Local em Desenvolvimento

#### 1. Backend (Spring Boot)
Requisitos: JDK 21+ e Maven instalado.
```bash
cd backend
mvn spring-boot:run
```
O servidor iniciará na porta `8080`.

#### 2. Frontend (React + Vite)
Requisitos: Node.js 18+.
```bash
cd frontend
npm install
npm run dev
```
Acesse a aplicação em [http://localhost:3000](http://localhost:3000). As requisições de `/api` serão automaticamente redirecionadas para o backend via proxy do Vite.

---

## 🧪 Testes Automatizados

Para executar os testes unitários do backend:
```bash
cd backend
mvn test
```

Para validar a integridade de tipos e compilação do frontend:
```bash
cd frontend
npm run build
```

---

## 📑 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/simulation/calculate` | Realiza a simulação financeira mês a mês |
| `POST` | `/api/simulation/ai-analysis` | Consulta o Gemini AI para análise de break-even e recomendações |
| `GET` | `/api/simulation/defaults` | Retorna taxas padrão do mercado brasileiro |
| `GET` | `/api/simulation/health` | Healthcheck do serviço |
