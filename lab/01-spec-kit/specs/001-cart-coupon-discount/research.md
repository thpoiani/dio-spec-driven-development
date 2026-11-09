# Research: Desconto de Cupom no Carrinho

**Feature**: 001-cart-coupon-discount | **Date**: 2026-11-06

NEEDS CLARIFICATION pendentes: **nenhuma**. O Technical Context do plano não
deixou lacunas (a stack é ditada pela constituição). As decisões abaixo
resolvem os pontos de design que a spec deixou em nível de implementação —
todos dentro das restrições constitucionais.

## D1 — Representação de valores monetários

**Decision**: todos os valores monetários são inteiros de centavos
(`totalCents`, `magnitudeCents`). O desconto percentual é calculado em
centavos com arredondamento half-up: `Math.round(cents × magnitude ÷ 100)` —
equivalente a half-up porque todos os valores são não negativos.

**Rationale**: elimina erros de ponto flutuante na origem (0,1 + 0,2 não é
exatamente 0,3 em binário) e torna a exigência de duas casas decimais
(FR-008) exata por construção, sem helpers de arredondamento espalhados pelo
código — alinhado ao Princípio III.

**Alternatives considered**:
- `number` decimal com `Math.round(x × 100) ÷ 100` a cada operação —
  funciona, mas exige arredondar após cada passo e esconde a precisão real
  do valor.
- Strings decimais ou biblioteca de decimal arbitrário — verboso ou
  dependência externa (proibida pelo Princípio V).

## D2 — Sinalização de rejeição de cupom

**Decision**: união discriminada como resultado
(`{ ok: true; novoTotalCents } | { ok: false; motivo: "codigo-desconhecido" }`),
sem exceções para rejeição de cupom.

**Rationale**: o compilador obriga quem consome a tratar a rejeição —
atendendo ao "inequívoco" de FR-004 — e a função permanece pura e total,
sem fluxo de controle por exceção (Princípio IV).

**Alternatives considered**:
- `throw` para código desconhecido — a rejeição fica invisível na assinatura
  e o chamador pode esquecer de tratar.
- Retornar `null` ou tupla — menos legível e ambíguo com valores falsy.

## D3 — Catálogo fixo de cupons

**Decision**: `Record<string, Cupom>` constante no módulo `cupom.ts`, com
`PROMO10` (percentual 10) e `MENOS15` (fixo 1500 centavos); lookup puro por
chave exata.

**Rationale**: a spec define catálogo fixo como parte do domínio
(Assumptions); um registro constante mantém a função pura (mesmas entradas ⇒
mesmo resultado, FR-007) e a comparação exata de código sai de graça
(Assumptions: sem trim, sem case-insensitive).

**Alternatives considered**:
- Catálogo injetado como parâmetro — mudaria a assinatura pedida
  (carrinho + código) sem ganho neste escopo.
- Busca dinâmica/persistida — fora de escopo (sem I/O, sem storage).

## D4 — Configuração de tooling

**Decision**: `tsconfig.json` com `strict: true` (e flags rígidas
correlatas ativadas); Vitest sem plugins; verificação de tipos via
`tsc --noEmit` como portão de qualidade.

**Rationale**: atende diretamente aos Princípios I e II e aos portões de
qualidade da constituição (tipo-check limpo + testes verdes) sem
configuração adicional — projeto de estudo, zero cerimônia.

**Alternatives considered**:
- Configuração mais permissiva (ex.: apenas `noImplicitAny`) — rejeitada
  por violar o Princípio I (strict mode completo).
