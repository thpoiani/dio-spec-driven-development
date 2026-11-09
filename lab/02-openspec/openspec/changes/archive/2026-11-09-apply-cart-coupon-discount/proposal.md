# Proposal

## Why

Este é um estudo de TypeScript em strict mode com foco em funções puras e modelagem de domínio. Uma função que aplica o desconto de um cupom ao total de um carrinho é um exercício pequeno em código, mas rico em decisões de domínio (representação de dinheiro, erros esperados, arredondamento, imutabilidade) — exatamente o conjunto de habilidades que o projeto pretende minerar.

## What Changes

- Introduz um domínio mínimo de carrinho: itens, subtotal e total calculados como funções puras derivadas (nunca armazenados).
- Introduz representação de dinheiro em centavos integrais (inteiros), eliminando aritmética de float.
- Introduz cupons como union type com dois variantes: desconto percentual e desconto de valor fixo.
- Introduz `Resultado` (discriminated union) como única forma de reportar erro de cupom desconhecido na borda do caso de uso.
- Composição em duas funções pequenas: localizar cupom por código + aplicar desconto, em vez de uma função que faz tudo.
- Configuração do projeto: TypeScript strict, vitest como test runner, zero dependências externas de código (apenas devDependencies de build/teste).
- Todos os valores exportados pelo domínio são imutáveis na prática: funções retornam novos valores, nunca mutam entrada.

## Capabilities

### New Capabilities

- `cart-coupon`: Aplicação de cupons de desconto ao cálculo do total de um carrinho — tipos de domínio (carrinho, item, cupom, resultado), cálculo de subtotal/desconto/total em centavos, comportamento para cupom desconhecido e clamp de total não negativo.

### Modified Capabilities

<!-- Nenhuma: projeto novo, sem specs existentes. -->

## Impact

- Projeto nasce a partir deste change: criação de `package.json`, `tsconfig.json` (strict), config do vitest e arquivos-fonte em `src/` com testes em `src/` ou `test/`.
- Nenhuma API externa, nenhum serviço, nenhuma dependência de runtime externa.
- Testes exercitam todas as decisões de domínio: percentual, valor fixo, cupom desconhecido, desconto maior que o subtotal, arredondamento, imutabilidade da entrada.
