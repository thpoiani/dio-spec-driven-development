# Tasks: Desconto de Cupom no Carrinho

**Input**: Design documents from `/specs/001-cart-coupon-discount/`

**Prerequisites**: plan.md (required), spec.md (required for user stories),
research.md, data-model.md, contracts/

**Tests**: Incluídos e OBRIGATÓRIOS — o Princípio II da constituição exige
testes Vitest para todo comportamento não trivial, e o plano define
`vitest run` verde como portão de qualidade.

**Organization**: Tasks agrupadas por user story para permitir implementação
e teste independentes de cada story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/` e `tests/` na raiz do repositório (ver plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto de estudo

- [X] T001 [P] Create `package.json` na raiz com `"dependencies": {}` (vazio
      — Princípio V), `devDependencies` contendo apenas `typescript` e
      `vitest`, e scripts `"test": "vitest run"` e `"typecheck": "tsc --noEmit"`
- [X] T002 [P] Create `tsconfig.json` na raiz com `"strict": true` e flags
      rígidas correlatas ativadas (sem `any`, sem `@ts-ignore` — Princípio I,
      decisão D4 do research.md)
- [X] T003 Run `npm install` para instalar as devDependencies do
      `package.json` (depende de T001)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos de domínio compartilhados por TODAS as user stories

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase

- [X] T004 [P] Create type `Carrinho` in `src/carrinho.ts` com campo
      `totalCents: number` (inteiro ≥ 0, **autoritativo** — base do desconto,
      FR-001 e Clarification Q1) e campo opcional `itens?: Item[]`
      (**apenas informativa** — nunca recalculada, Clarification Q1);
      exportar o tipo `Item` mínimo necessário
- [X] T005 [P] Create type `Cupom` in `src/cupom.ts` com campos `codigo:
      string` (identificador único, comparação **exata** — sem trim, sem
      case-insensitive), `tipo: "percentual" | "fixo"` e `magnitudeCents:
      number` (inteiro > 0; percentual ex.: 10 = 10%, fixo em centavos);
      incluir catálogo fixo constante `Record<string, Cupom>` com
      `PROMO10` → `{ tipo: "percentual", magnitudeCents: 10 }` e `MENOS15` →
      `{ tipo: "fixo", magnitudeCents: 1500 }` (decisão D3)

**Checkpoint**: Tipos de domínio prontos — implementação das user stories
pode começar

---

## Phase 3: User Story 1 - Aplicar cupom percentual (Priority: P1) 🎯 MVP

**Goal**: Função pura `aplicarCupom` que, dado um carrinho e o código
`PROMO10`, retorna o novo total com 10% de desconto (e rejeita códigos
desconhecidos — a união discriminada do contrato já nasce aqui, decisão D2).

**Independent Test**: Aplicar `PROMO10` a um carrinho com
`totalCents: 20000` retorna `{ ok: true, novoTotalCents: 18000 }` sem
alterar a entrada.

### Tests for User Story 1 ⚠️

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [X] T006 [US1] Write failing acceptance tests in
      `tests/aplicar-cupom.test.ts` cobrindo: cenário 1 (20000 + `PROMO10` →
      `{ ok: true, novoTotalCents: 18000 }`), cenário 2 (9990 + `PROMO10` →
      `{ ok: true, novoTotalCents: 8991 }`, half-up), edge case do carrinho
      vazio (0 + `PROMO10` → `{ ok: true, novoTotalCents: 0 }`) e
      Clarification Q1 (carrinho com `itens` preenchidos + `PROMO10` →
      `novoTotalCents: 9000` e itens intactos, sem recálculo)

### Implementation for User Story 1

- [X] T007 [US1] Implement `aplicarCupom(carrinho: Carrinho, codigoCupom:
      string): ResultadoAplicacao` in `src/aplicar-cupom.ts` conforme
      `contracts/aplicar-cupom.md`: exportar a união discriminada
      `ResultadoAplicacao = { ok: true; novoTotalCents: number } |
      { ok: false; motivo: "codigo-desconhecido" }`; fazer lookup **exato**
      do código no catálogo fixo e retornar
      `{ ok: false, motivo: "codigo-desconhecido" }` se ausente (FR-004);
      para cupom percentual calcular
      `desconto = Math.round(totalCents × magnitudeCents ÷ 100)` (half-up,
      FR-008) e retornar `novoTotalCents = totalCents − desconto`; função
      pura — sem mutar `carrinho`, sem I/O (FR-006, FR-007)

**Checkpoint**: MVP funcional — US1 testável independentemente
(`npx vitest run` verde para os cenários percentuais)

---

## Phase 4: User Story 2 - Aplicar cupom de valor fixo (Priority: P2)

**Goal**: Suporte a cupons de valor fixo em centavos (ex.: `MENOS15`
subtrai 1500 centavos), limitado a zero.

**Independent Test**: Aplicar `MENOS15` a um carrinho com `totalCents:
1200` retorna `{ ok: true, novoTotalCents: 0 }` — nunca negativo.

### Tests for User Story 2 ⚠️

- [X] T008 [US2] Write failing tests in `tests/aplicar-cupom.test.ts`
      cobrindo: cenário 3 (10000 + `MENOS15` → `{ ok: true,
      novoTotalCents: 8500 }`) e cenário 4 (1200 + `MENOS15` →
      `{ ok: true, novoTotalCents: 0 }`, FR-005)

### Implementation for User Story 2

- [X] T009 [US2] Implement the fixed-coupon branch in
      `src/aplicar-cupom.ts`: para `tipo: "fixo"`, retornar
      `novoTotalCents = max(0, totalCents − magnitudeCents)` (FR-003,
      FR-005) — mantendo a pureza e sem alterar o comportamento percentual
      da US1

**Checkpoint**: Stories 1 e 2 funcionam independentemente (`npx vitest run`)

---

## Phase 5: User Story 3 - Rejeitar cupom inválido (Priority: P3)

**Goal**: Cobertura formal da rejeição inequívoca (FR-004) — o comportamento
já é garantido pela implementação da US1 (decisão D2: lookup exato que
rejeita); esta fase trava os cenários em testes para evitar regressão.

**Independent Test**: Aplicar `INEXISTENTE` (ou `promo10` em caixa
diferente) a um carrinho retorna `{ ok: false, motivo:
"codigo-desconhecido" }` e o total permanece o mesmo.

### Tests for User Story 3 ⚠️

- [X] T010 [US3] Write tests in `tests/aplicar-cupom.test.ts` cobrindo:
      cenário 5 (10000 + `INEXISTENTE` → `{ ok: false, motivo:
      "codigo-desconhecido" }`, total inalterado) e cenário 6 (10000 +
      `promo10` → rejeição, comparação exata — sem case-insensitive, sem
      trim, conforme Assumptions da spec)

**Checkpoint**: Todas as user stories com cobertura independente
(`npx vitest run` cobre P1, P2 e P3)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Garantias transversais (FR-006, FR-007) e portões de qualidade

- [X] T011 Write immutability test in `tests/aplicar-cupom.test.ts` (FR-006):
      snapshot/deep-equal do objeto `Carrinho` (incluindo `itens`) antes e
      depois de chamar `aplicarCupom` em um cenário de sucesso e um de
      rejeição
- [X] T012 Write determinism test in `tests/aplicar-cupom.test.ts` (FR-007):
      duas chamadas com as mesmas entradas produzem resultados deep-equal
- [X] T013 Run the quality gates from `specs/001-cart-coupon-discount/quickstart.md`:
      `npx tsc --noEmit` sem erros, `npx vitest run` verde, e
      `npm ls --depth=0` confirmando `dependencies` vazio e devDependencies
      apenas `typescript` + `vitest` (SC-001 a SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — T001 e T002 em paralelo; T003
  depende de T001
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories
- **US1 (Phase 3)**: depende da Foundational — primeiro incremento de valor
- **US2 (Phase 4)**: depende da US1 (a função e a união já existem)
- **US3 (Phase 5)**: depende da US1 (a rejeição da D2 já existe)
- **Polish (Phase 6)**: depende de todas as stories concluídas

### User Story Dependencies

- **US1 (P1)**: inicia após Foundational — sem dependência de outras stories
- **US2 (P2)**: estende `src/aplicar-cupom.ts` da US1 (mesmo arquivo →
  sequencial)
- **US3 (P3)**: testa o comportamento de rejeição introduzido pela US1
  (mesmo arquivo de testes → sequencial)

### Within Each User Story

- Testes escritos primeiro, devem FALHAR antes da implementação
- Implementação mínima que torna os testes verdes
- Story completa antes da próxima prioridade

### Parallel Opportunities

- Setup: T001 ∥ T002 (arquivos diferentes)
- Foundational: T004 ∥ T005 (arquivos diferentes)
- As stories US2/US3 NÃO são paralelas entre si neste projeto: todas editam
  `src/aplicar-cupom.ts` e `tests/aplicar-cupom.test.ts` (regra [P] =
  arquivos diferentes). Execução sequencial P1 → P2 → P3.

---

## Parallel Example: Setup + Foundational

```bash
# Fase 1 (T001 ∥ T002):
Task: "Create package.json na raiz (deps vazias, devDeps typescript+vitest)"
Task: "Create tsconfig.json com strict: true"

# Fase 2 (T004 ∥ T005):
Task: "Create type Carrinho in src/carrinho.ts"
Task: "Create type Cupom + catálogo fixo in src/cupom.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005) — bloqueia as stories
3. Complete Phase 3: User Story 1 (T006–T007)
4. **STOP and VALIDATE**: `npx vitest run` verde para os cenários
   percentuais; `npx tsc --noEmit` limpo
5. MVP pronto: percentual + rejeição já entregam a função completa do
   contrato

### Incremental Delivery

1. Setup + Foundational → fundação pronta
2. US1 → validar (MVP!)
3. US2 → validar (desconto fixo + limite a zero)
4. US3 → validar (rejeição travada em testes)
5. Polish → garantias FR-006/FR-007 + portões de qualidade (T013)

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia a task para a user story (rastreabilidade)
- Cada story é independentemente completável e testável
- Verificar que os testes FALHAM antes de implementar
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar a story independentemente
- Evitar: tasks vagas, conflito de mesmos arquivos, dependências
  entre stories que quebrem a independência
