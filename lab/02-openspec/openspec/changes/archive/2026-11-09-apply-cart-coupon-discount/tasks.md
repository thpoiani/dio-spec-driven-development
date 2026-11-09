# Tasks

## 1. Setup do projeto

- [x] 1.1 Criar `package.json` com scripts `test` (vitest) e `typecheck` (tsc --noEmit), instalar apenas devDependencies (typescript, vitest) e verificar que `npm test` roda suíte vazia sem falhar
- [x] 1.2 Criar `tsconfig.json` com `strict: true` e flags de rigor (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) e verificar que `npm run typecheck` passa sem erros

## 2. Domínio: tipos e cálculo de subtotal

- [x] 2.1 Criar `src/domains/cart/types.ts` com `ItemCarrinho`, `Carrinho`, `Cupom` (union percentual/valorFixo) e `Resultado` (union ok/erro) e verificar que `tsc --noEmit` aceita os tipos
- [x] 2.2 Implementar `calcularSubtotal(carrinho)` em centavos e testar carrinho com múltiplos itens (10,00 × 2 + 5,50 = 25,50) e carrinho vazio → 0

## 3. Domínio: desconto e total

- [x] 3.1 Implementar `calcularTotal(carrinho, cupom)` com case percentual (Math.round único no final do cálculo percentual) e case valorFixo, com clamp total ≥ 0, e testar: 10% sobre 9990 → desconto 999/total 8991; percentual 0% → total = subtotal; percentual com resultado fracionário arredondado ao centavo mais próximo; valorFixo 5000 sobre subtotal 3000 → total 0; percentual excedente → total 0; verificar que nomes/estrutura seguem `design.md`
- [x] 3.2 Testar dinheiro em centavos: item de R$ 19,87 (1987) com quantidade 3 → subtotal 5961 e verificar que nenhum valor intermediário sai fracionário
- [x] 3.3 Testar imutabilidade: congelar carrinho e cupom de entrada (Object.freeze) antes de chamar `calcularTotal` e `calcularSubtotal` e verificar que a execução não lança nem altera entradas
- [x] 3.4 Testar exaustividade do switch sobre `Cupom` com todos os variantes compilando sem retorno implícito (typecheck)

## 4. Caso de uso: localizar cadeia por código e compor

- [x] 4.1 Implementar `encontraCupom(codigo, indice: Readonly<Record<string, Cupom>>)` e testar: cadastrado → cupom; não cadastrado → undefined; verificar que a função aceita registro somente-leitura (pure)
- [x] 4.2 Implementar `aplicaCupomPorCodigo(carrinho, codigo, indice) -> Resultado` compondo 4.1 e 3.1 e testar: código cadastrado → `{ ok: true, valor }`; código não cadastrado → `{ ok: false, erro: "cupomDesconhecido" }`; verificar que não há exceção nem retorno nulo em nenhum caminho
- [x] 4.3 Testar o tratamento obrigatório do `Resultado`: escrever um consumidor de exemplo no teste que usa discriminated union (if `r.ok` … else …) e verificar que `tsc --noEmit` falha se o branch de erro for removido

## 5. Verificação final

- [x] 5.1 Rodar `npm test` e `npm run typecheck` completos e verificar que todos os cenários da spec (`specs/cart-coupon/spec.md`) estão cobertos por testes mapeáveis um a um
- [x] 5.2 Revisar código final contra os critérios do design (funções pequenas, sem classes) e verificar com grep que `src/` não importa nenhum módulo externo
