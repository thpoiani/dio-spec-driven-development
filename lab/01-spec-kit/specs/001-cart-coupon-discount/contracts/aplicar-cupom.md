# Contract: aplicar-cupom

**Feature**: 001-cart-coupon-discount | **Date**: 2026-11-06

Contrato público do módulo `src/aplicar-cupom.ts` — a única interface que o
projeto expõe. Os tipos vivem em `src/carrinho.ts` e `src/cupom.ts`; detalhes
de campos e regras em [data-model.md](../data-model.md).

## Assinatura

```ts
aplicarCupom(carrinho: Carrinho, codigoCupom: string): ResultadoAplicacao

type Carrinho = { totalCents: number; itens?: Item[] };
type Cupom = { codigo: string; tipo: "percentual" | "fixo"; magnitudeCents: number };
type ResultadoAplicacao =
  | { ok: true; novoTotalCents: number }
  | { ok: false; motivo: "codigo-desconhecido" };
```

**Pré-condição**: `carrinho.totalCents` é um inteiro ≥ 0. Comportamento com
pré-condição violada não é definido nesta versão (fora do escopo da spec).

## Comportamento

| Entrada | Saída | Regra |
|---------|-------|-------|
| Código no catálogo, tipo percentual | `{ ok: true, novoTotalCents }` | `desconto = round(totalCents × magnitude ÷ 100)`, half-up (FR-002, FR-008) |
| Código no catálogo, tipo fixo | `{ ok: true, novoTotalCents }` | `novoTotal = max(0, totalCents − magnitudeCents)` (FR-003, FR-005) |
| Código fora do catálogo ou grafia diferente | `{ ok: false, motivo: "codigo-desconhecido" }` | comparação exata, sem normalização (FR-004, Assumptions) |
| Total 0 + cupom válido | `{ ok: true, novoTotalCents: 0 }` | edge case do carrinho vazio |

## Garantias

- **Pureza e determinismo** (FR-006, FR-007): `carrinho` nunca é mutado; sem
  I/O, relógio ou aleatoriedade.
- **Não negatividade**: `novoTotalCents ≥ 0` em toda variante de sucesso
  (FR-005).
- **Rejeição sem exceção**: código desconhecido retorna a variante
  `ok: false` — nunca lança (decisão D2).
- **Resultado mínimo**: retorna apenas o novo total; o valor do desconto é
  derivável (Clarification Q2).

## Exemplos

| Carrinho (`totalCents`) | Código | Resultado |
|--------------------------|--------|-----------|
| 20000 (200,00) | `PROMO10` | `{ ok: true, novoTotalCents: 18000 }` |
| 9990 (99,90) | `PROMO10` | `{ ok: true, novoTotalCents: 8991 }` |
| 10000 (100,00) | `MENOS15` | `{ ok: true, novoTotalCents: 8500 }` |
| 1200 (12,00) | `MENOS15` | `{ ok: true, novoTotalCents: 0 }` |
| 10000 (100,00) | `INEXISTENTE` | `{ ok: false, motivo: "codigo-desconhecido" }` |
| 10000 (100,00) | `promo10` | `{ ok: false, motivo: "codigo-desconhecido" }` |
