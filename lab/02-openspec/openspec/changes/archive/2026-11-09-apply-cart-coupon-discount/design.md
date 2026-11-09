# Design

## Context

Projeto de estudo inicializado a partir do zero (nenhum código-fonte existente). Constraints deliberadas do exercício: TypeScript em strict mode, vitest como test runner, código pequeno e legível, funções puras, nenhum código com dependências externas em runtime (apenas devDependencies de build/teste). Ver `proposal.md` para motivação.

## Goals / Non-Goals

**Goals:**
- Domínio expresso inteiramente em tipos + funções puras, sem classes, sem estado.
- Aritmética monetária livre de erros de float, com uma única regra de arredondamento.
- Erro esperado (cupom desconhecido) representado no sistema de tipos, não em exceções.
- Composição em funções pequenas; todas testáveis isoladamente.

**Non-Goals:**
- Cupons com valor mínimo de compra, frete grátis, expiração, limites de uso.
- Múltiplos cupons empilhados.
- Persistência, busca de cupons em fonte externa, interface de qualquer tipo.
- Validações de entrada (estruturas de dados assumidas válidas conforme os tipos).

## Decisions

1. **Dinheiro em centavos integrais (`number` inteiro).**
   - *Por quê*: elimina `99.9 * 0.9 = 89.91000000000001` e torna cada valor o que de fato representa.
   - *Alternativas descartadas*: `number` em reais com arredondamento espalhado (float vaza em cada operação); BigInt (peso desnecessário para o estudo); objeto `Dinheiro` (over-modeling para o escopo).

2. **Arredondamento único, no final, para o centavo mais próximo.**
   - *Por quê*: só o desconto percentual pode gerar valor fracionário (`subtotal * percentual / 100`); um único `Math.round` no único ponto onde fração pode nascer mantém toda a aritmética em inteiros depois disso.
   - *Alternativa descartada*: arredondar por item ou por operação intermediária (complica sem ganho no escopo).

3. **Subtotal, desconto e total derivados — nunca armazenados no carrinho.**
   - *Por quê*: se `subtotal` fosse campo do tipo, seria possível construir um carrinho com subtotal mentiroso, e strict mode não impede dados incoerentes. Nada no domínio tem estado.
   - *Alternativa descartada*: carrinho com `subtotal` e função retorna "carrinho atualizado" (duplica fonte de verdade).

4. **Cupom como discriminated union com exatamente dois variantes.**
   - *Por quê*: percentual e valor fixo forçam o uso real de unions e exaustividade; o modelo representa o domínio sem lotear embalagem de "tipo de desconto" em campos opcionais.
   - *Alternativa descartada*: cupom com campos `tipo: string` + `valor` de significado dependente do tipo (menos seguro; o compilador nada garante).

5. **`Resultado` como discriminated union na borda do caso de uso.**
   - *Por quê*: cupom desconhecido é falha esperada, não exceção; o union obriga o chamador a tratar os dois caminhos em compilação, que é exatamente a habilidade que o estudo mineria.
   - *Alternativas descartadas*: lançar exceção (esconde a falha do sistema de tipos); retornar `null` (colapsa os significados de "desconhecido" e deixa o erro sem nome).

6. **Composição em vez de função única.**
   - `encontraCupom(codigo, indicador) -> Cupom | undefined` — localização pura, sem apontar para fonte externa (injeção por parâmetro).
   - `calculaTotal(carrinho, cupom) -> { desconto, total }` — assume cupom válido; clamp em zero aqui.
   - `aplicaCupomPorCodigo(carrinho, codigo, indicador) -> Resultado` — compõe as duas, única função que fala de erro.
   - *Por quê*: duas peças pequenas testáveis separadamente; a função de alto nível ficaria mais densa e menos legível em uma etapa só.
   - *Alternativa descartada*: uma função que recebe também o `Record<string, Cupom>` e faz tudo (um degrau lógico a mais por função).

7. **Lookup de cupons injetado por parâmetro.**
   - *Por quê*: função pura não consulta banco nem API; chamador fornece o `Cupom`. Mantém toda a cadeia pura e trivialmente testável.

## Risks / Trade-offs

- [Percentual como inteiro limita descontos tipo 12,5%] → Mitigação: fora do escopo; se aparecer, o variant cresce para basis points sem mudar callers.
- [`Math.round` arredonda para cima em .5 exato (regra bancária seria diferente)] → Mitigação: registrado como comportamento explícito, coberto por teste; regra bancária é refinamento futuro.
- [Sem validação de entrada: tipos garantem forma, não valores (quantidade negativa, percentual negativo)] → Mitigação: acordado como Non-Goal; estruturas vêm de fontes confiáveis no estudo.
- [Nomes e mensagens em português] → Mitigação: decidido manter o domínio em português (consistente com o enunciado); aceito o trade-off de vocabulário misto com inglês em tooling.

## Open Questions

Nenhum que bloqueie a implementação.
