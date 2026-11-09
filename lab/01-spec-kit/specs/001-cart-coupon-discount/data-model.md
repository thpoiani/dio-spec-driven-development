# Data Model: Desconto de Cupom no Carrinho

**Feature**: 001-cart-coupon-discount | **Date**: 2026-11-06

Entidades extraídas de *Key Entities* na spec e refinadas pelas decisões
D1–D3 de [research.md](./research.md). Sem transições de estado — todas as
estruturas são tratadas como imutáveis (FR-006).

## Carrinho

Representa uma compra em andamento. Fonte: Key Entities + Clarification Q1.

| Campo | Tipo | Regras |
|-------|------|--------|
| `totalCents` | inteiro ≥ 0 | **Autoritativo** — base do desconto (FR-001, Clarification Q1); duas casas decimais representadas em centavos (D1) |
| `itens` (opcional) | lista de itens | **Apenas informativa** — nunca recalculada (Clarification Q1); não participa do cálculo |

Validações: `totalCents` não negativo (pré-condição do domínio). Carrinho
vazio ⇒ `totalCents = 0` (edge case da spec).

Relações: 1 Carrinho — N itens informativos. Nenhum vínculo estrutural com
Cupom — a associação acontece apenas no momento da aplicação.

## Cupom

Representa um desconto disponível. Fonte: Key Entities + Assumptions.

| Campo | Tipo | Regras |
|-------|------|--------|
| `codigo` | string | Identificador único; comparação exata — sem trim, sem case-insensitive (FR-004, Assumptions) |
| `tipo` | `"percentual"` \| `"fixo"` | Forma de cálculo (FR-002 / FR-003) |
| `magnitudeCents` | inteiro > 0 | Percentual (ex.: 10 = 10%) ou valor fixo em centavos (ex.: 1500 = 15,00) |

Catálogo fixo (D3): `PROMO10` → percentual 10; `MENOS15` → fixo 1500.
Sem expiração, valor mínimo, uso único ou acumulação (fora de escopo).

## Resultado da aplicação

Fonte: Key Entities + Clarification Q2 + decisão D2. União discriminada:

| Variante | Campos | Significado |
|----------|--------|-------------|
| sucesso | `ok: true`, `novoTotalCents: inteiro ≥ 0` | Desconto aplicado; apenas o novo total é retornado (Clarification Q2) |
| rejeição | `ok: false`, `motivo: "codigo-desconhecido"` | Código não corresponde a cupom conhecido; total permanece o mesmo (FR-004) |

O valor do desconto **não é retornado** — é derivável por quem consome:
total fornecido − novo total (Clarification Q2).

## Regras de cálculo

- Percentual: `desconto = Math.round(totalCents × magnitude ÷ 100)`
  (half-up, valores não negativos — D1); `novoTotal = totalCents − desconto`.
- Fixo: `novoTotal = max(0, totalCents − magnitudeCents)` (FR-005).
- Determinismo: mesmas entradas ⇒ mesmo resultado (FR-007).

## Invariantes

1. `novoTotalCents ≥ 0` em toda variante de sucesso (FR-005).
2. As entradas nunca são mutadas (FR-006).
3. Rejeição nunca altera o total (FR-004).
4. Sem dependência de relógio, aleatoriedade ou I/O (FR-007; constituição IV).
