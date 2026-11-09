# Implementation Plan: Desconto de Cupom no Carrinho

**Branch**: `001-cart-coupon-discount` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-cart-coupon-discount/spec.md`

## Summary

Implementar uma função pura que recebe um carrinho (cujo total fornecido é
autoritativo) e um código de cupom, aplica o desconto do catálogo fixo de
domínio (percentual ou valor fixo, com arredondamento half-up) e retorna
exclusivamente o novo total com indicação inequívoca de sucesso ou rejeição.
Abordagem técnica: módulos TypeScript estritos sem dependências de runtime,
valores monetários em centavos inteiros, rejeição via união discriminada e
testes de aceitação em Vitest.

## Technical Context

**Language/Version**: TypeScript 5.x com `strict: true`, executado em Node.js
LTS

**Primary Dependencies**: Nenhuma de runtime; dev: apenas `typescript` e
`vitest` (Princípio V da constituição)

**Storage**: N/A (função pura em memória, sem persistência)

**Testing**: Vitest (único runner — Princípio II da constituição)

**Target Platform**: Node.js LTS (macOS/Linux)

**Project Type**: library (domínio puro, sem I/O)

**Performance Goals**: cada aplicação de desconto retorna em menos de 1
segundo (SC-005) — trivialmente atendido por cálculo em memória

**Constraints**: zero dependências de runtime; sem `any`/`@ts-ignore`;
funções puras determinísticas (FR-006/FR-007); valores monetários exatos em
duas casas decimais com arredondamento half-up (FR-008)

**Scale/Scope**: 1 função de domínio + catálogo fixo com 2 cupons de exemplo;
escopo mínimo de estudo — sem UI, sem API, sem persistência

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência no plano |
|-----------|--------|--------------------|
| I. TypeScript Estrito | ✅ PASS | `tsconfig.json` com `strict: true`; sem `any`, sem contornos (decisão D4) |
| II. Testes com Vitest | ✅ PASS | único runner; testes determinísticos em `tests/` |
| III. Código Pequeno e Legível | ✅ PASS | 3 módulos pequenos com nomes do domínio; função única |
| IV. Funções Puras | ✅ PASS | sem I/O, sem estado; entradas imutáveis (FR-006/007) |
| V. Zero Dependências Externas | ✅ PASS | `dependencies` vazio; dev: `typescript` + `vitest` |

**Re-check pós-design (após Phase 1)**: ✅ ainda PASS — o design não
introduz dependências, efeitos colaterais nem complexidade adicional
(decisões D1–D4 em [research.md](./research.md)).

## Project Structure

### Documentation (this feature)

```text
specs/001-cart-coupon-discount/
├── plan.md              # Este arquivo (/speckit.plan)
├── research.md          # Saída da Phase 0
├── data-model.md        # Saída da Phase 1
├── quickstart.md        # Saída da Phase 1
├── contracts/
│   └── aplicar-cupom.md # Contrato público da função
└── tasks.md             # Phase 2 (/speckit.tasks) — NÃO criado aqui
```

### Source Code (repository root)

```text
src/
├── carrinho.ts          # tipo Carrinho (totalCents autoritativo)
├── cupom.ts             # tipo Cupom + catálogo fixo (PROMO10, MENOS15)
└── aplicar-cupom.ts     # função pura: aplica o desconto e retorna o resultado
tests/
└── aplicar-cupom.test.ts  # cenários de aceitação + edge cases (Vitest)
```

**Structure Decision**: Projeto único e plano, sem camadas. Três módulos
pequenos com nomes do domínio em português, espelhando a terminologia da
spec (Carrinho, Cupom, aplicação). Pastas genéricas (`models/`, `services/`)
foram removidas por serem excesso de estrutura para uma função — Princípio
III (código pequeno e legível).

## Complexity Tracking

> Sem violações de constituição — nenhuma justificativa de complexidade
> necessária.
