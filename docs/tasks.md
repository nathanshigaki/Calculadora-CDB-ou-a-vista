# Backlog de Tarefas: Calculadora CDB vs À Vista

Este documento rastreia todas as tarefas do projeto, permitindo histórico rastreável com commits atômicos por tarefa.

---

## 📌 Convenção de Commits
Seguiremos o padrão [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `test`: Adição ou modificação de testes
- `docs`: Modificações na documentação
- `chore`: Tarefas de build, docker e configurações

---

## 🚀 Épico 1: Documentação & Setup Inicial
- [x] **Task 1.1**: Inicializar Repositório Git & .gitignore
  - **Commit**: `chore: inicializar repositorio git e configurar .gitignore`
  - **Critério**: Branch `main` ativa e `.gitignore` cobrindo Java/Node/Docker.
- [x] **Task 1.2**: Estruturar Diretório `/docs`
  - **Commit**: `docs: adicionar plano de implementacao, tasks e arquitetura`
  - **Critério**: Criar `docs/plano_implementacao.md`, `docs/tasks.md` e `docs/arquitetura.md`.

---

## ☕ Épico 2: Backend (Spring Boot 3.4 & Motor Financeiro)
- [x] **Task 2.1**: Configuração de Dependências & Propriedades
  - **Commit**: `chore(backend): configurar pom.xml com spring boot, spring ai e application.properties`
  - **Critério**: Maven com `spring-boot-starter-web`, `spring-boot-starter-validation`, `spring-ai-openai`, Lombok e configurações em `application.properties`.
- [x] **Task 2.2**: Modelos e DTOs de Domínio
  - **Commit**: `feat(backend): criar DTOs de requisicao, resposta e evolucao mensal`
  - **Critério**: `SimulationRequest`, `SimulationResult`, `MonthlyEntry`, `AiAnalysisResponse`, `DefaultRatesResponse`.
- [x] **Task 2.3**: Motor Financeiro Determinístico
  - **Commit**: `feat(backend): implementar servico de calculo financeiro com decaimento e break-even`
  - **Critério**: `FinancialCalculatorService` com taxa efetiva diária/mensal, dedução de parcelas mês a mês, alíquotas regressivas de IR (22,5% a 15%) e cálculo do desconto mínimo de equilíbrio.
- [x] **Task 2.4**: Testes Unitários do Motor Financeiro
  - **Commit**: `test(backend): adicionar testes unitarios do servico financeiro`
  - **Critério**: Testes cobrindo compra à vista com desconto superior, compra parcelada com CDB superior, tabela Price com juros e tabela regressiva de IR.
- [x] **Task 2.5**: Integração Spring AI com Google Gemini
  - **Commit**: `feat(backend): implementar servico consultor com Gemini AI e fallback resiliente`
  - **Critério**: `GeminiAdvisorService` gerando parecer estruturado sobre break-even e recomendações.
- [x] **Task 2.6**: Controladores REST & CORS
  - **Commit**: `feat(backend): implementar controller de simulacao e configuracao de CORS`
  - **Critério**: Endpoints `POST /api/simulation/calculate`, `POST /api/simulation/ai-analysis` e `GET /api/simulation/defaults`.

---

## ⚛️ Épico 3: Frontend (React 19 + TypeScript + Tailwind + shadcn/ui)
- [x] **Task 3.1**: Setup do Frontend Vite + TypeScript + Tailwind
  - **Commit**: `chore(frontend): inicializar projeto vite react typescript e tailwind css`
  - **Critério**: Vite rodando com TypeScript, Tailwind CSS, Lucide Icons e Recharts instalados.
- [x] **Task 3.2**: Camada de Serviços e Tipos TypeScript
  - **Commit**: `feat(frontend): criar tipos sincronizados e servico de api`
  - **Critério**: `types.ts` e `simulationService.ts` integrando com o backend.
- [x] **Task 3.3**: Formulário de Simulação com Presets Rápidos
  - **Commit**: `feat(frontend): implementar formulario de simulacao com formatacao BRL e presets`
  - **Critério**: Inputs com máscaras monetárias, seletores de parcelas, juros, CDI e botões de atalho rápido.
- [x] **Task 3.4**: Card de Veredito & Indicadores de Economia
  - **Commit**: `feat(frontend): criar card de veredito com indicacao visual clara da melhor opcao`
  - **Critério**: Card com destaque em verde/azul indicando "Pague À Vista" ou "Parcelado no CDB" e valor economizado.
- [x] **Task 3.5**: Tabela Dinâmica Mês a Mês
  - **Commit**: `feat(frontend): implementar tabela de evolucao patrimonial e decaimento mensal`
  - **Critério**: Tabela responsiva com saldo investido, rendimento bruto/líquido, IR e parcelas pagas mês a mês.
- [x] **Task 3.6**: Gráfico Interativo de Evolução
  - **Commit**: `feat(frontend): implementar graficos recharts de saldo e rendimento acumulado`
  - **Critério**: Visualização gráfica comparando a trajetória do saldo investido ao longo das parcelas.
- [x] **Task 3.7**: Painel do Consultor IA (Gemini)
  - **Commit**: `feat(frontend): criar componente do consultor financeiro com gemini ai`
  - **Critério**: Exibição da análise analítica da IA com cálculo do ponto de equilíbrio (*break-even*).

---

## 🐳 Épico 4: Docker & Orquestração
- [x] **Task 4.1**: Dockerfile Multi-stage do Backend
  - **Commit**: `chore(docker): criar dockerfile multi-stage para backend spring boot`
  - **Critério**: Build Maven e execução em OpenJDK 21 slim.
- [x] **Task 4.2**: Dockerfile Multi-stage do Frontend & Nginx
  - **Commit**: `chore(docker): criar dockerfile frontend com nginx e reverse proxy`
  - **Critério**: Build Vite servido por Nginx com proxy para `/api`.
- [x] **Task 4.3**: Docker Compose
  - **Commit**: `chore(docker): configurar docker-compose para orquestracao dos servicos`
  - **Critério**: `docker-compose.yml` subindo frontend e backend integrados.
- [ ] **Task 4.4**: README.md Completo
  - **Commit**: `docs: adicionar readme com instrucoes de execucao local e docker`
  - **Critério**: Guia passo a passo com exemplos e screenshots/tabelas.

---

## 🧪 Épico 5: Verificação & Entrega
- [ ] **Task 5.1**: Execução e Validação dos Testes Automatizados
  - **Commit**: `test: validar build e suite de testes do monorepo`
  - **Critério**: `mvn test` com 100% de sucesso e `npm run build` sem erros de tipo.
- [ ] **Task 5.2**: Walkthrough Final do Projeto
  - **Commit**: `docs: registrar walkthrough e validacao de cenarios`
  - **Critério**: Documento de entrega final com validação de cenários reais.
