# Quickstart: Desconto de Cupom no Carrinho

**Feature**: 001-cart-coupon-discount

Guia de validação ponta a ponta após a implementação. Referências:
[contrato público](contracts/aplicar-cupom.md) ·
[modelo de dados](data-model.md) · [decisões](research.md).

## Pré-requisitos

- Node.js LTS.
- Dependências de dev instaladas: `typescript` e `vitest` — **apenas essas**
  (Princípio V da constituição).

## Portões de qualidade (constituição)

1. **Tipos**: `npx tsc --noEmit` → termina sem erros (strict mode, Princípio I).
2. **Testes**: `npx vitest run` → todos verdes, cobrindo os cenários abaixo
   (Princípio II).
3. **Dependências**: `npm ls --depth=0` → `dependencies` vazio; dev com
   apenas `typescript` e `vitest` (Princípio V).

## Cenários de validação (da spec — valores em centavos)

Cada linha é um teste Vitest esperado no módulo `tests/aplicar-cupom.test.ts`:

| # | Carrinho (`totalCents`) | Código | Resultado esperado | Origem |
|---|--------------------------|--------|--------------------|--------|
| 1 | 20000 | `PROMO10` | `{ ok: true, novoTotalCents: 18000 }` | Story P1 |
| 2 | 9990 | `PROMO10` | `{ ok: true, novoTotalCents: 8991 }` (half-up) | Story P1 |
| 3 | 10000 | `MENOS15` | `{ ok: true, novoTotalCents: 8500 }` | Story P2 |
| 4 | 1200 | `MENOS15` | `{ ok: true, novoTotalCents: 0 }` (nunca negativo) | Story P2 |
| 5 | 10000 | `INEXISTENTE` | `{ ok: false, motivo: "codigo-desconhecido" }` | Story P3 |
| 6 | 10000 | `promo10` | `{ ok: false, motivo: "codigo-desconhecido" }` (comparação exata) | Story P3 |
| 7 | 0 | `PROMO10` | `{ ok: true, novoTotalCents: 0 }` (carrinho vazio) | Edge case |
| 8 | 10000, com `itens` | `PROMO10` | `{ ok: true, novoTotalCents: 9000 }` — itens não recalculados | Clarification Q1 |

## Uso manual (opcional)

```ts
import { aplicarCupom } from "./src/aplicar-cupom";

const resultado = aplicarCupom({ totalCents: 20000 }, "PROMO10");
// → { ok: true, novoTotalCents: 18000 }
```

## Critério de sucesso

- `tsc --noEmit` limpo + `vitest run` verde ⇒ feature validada
  (SC-001 a SC-004).
- Qualquer execução individual abaixo de 1 segundo (SC-005).
