# Spec: Aplicar cupom de desconto

Status: ready-for-agent

## Problem Statement

Num carrinho de compras, calcular na mão o valor final após um cupom de desconto é propenso a erros silenciosos: aritmética de ponto flutuante que gera centavos quebrados, descontos que estouram o valor do carrinho, códigos de cupom inexistentes tratados como exceção em tempo de execução. Não existe hoje uma função única, determinística e testável que receba um Carrinho e um Código de cupom e produza o resultado correto — ou um erro de domínio explícito.

## Solution

Uma função pura **Aplicar cupom**: recebe um Carrinho, um Código de cupom e o Catálogo, e devolve um resultado explícito — ou o **Carrinho com desconto** (com o Cupom aplicado, o Desconto e o Total registrados) ou o erro de domínio "código inválido". A entrada nunca é mutada; todos os valores são derivados dos itens (única fonte de verdade); o Desconto nunca gera crédito. Sem dependências externas, TypeScript strict, testes com vitest.

## User Stories

1. Como desenvolvedora consumindo o módulo, quero aplicar um cupom percentual a um carrinho, para que o Total saia com a porcentagem correta de desconto.
2. Como desenvolvedora consumindo o módulo, quero aplicar um cupom de valor fixo a um carrinho, para que o Total desconte o valor exato do cupom.
3. Como desenvolvedora consumindo o módulo, quero que um Desconto de valor fixo maior que o Subtotal seja limitado ao Subtotal, para que o Total nunca fique negativo e o desconto nunca gere crédito.
4. Como desenvolvedora consumindo o módulo, quero que um cupom percentual acima de 100% também seja limitado ao Subtotal, para que o mesmo limite proteja todos os tipos de cupom.
5. Como desenvolvedora consumindo o módulo, quero que o desconto percentual seja arredondado para o centavo mais próximo, para que o resultado seja um valor inteiro em centavos, determinístico e previsível.
6. Como desenvolvedora consumindo o módulo, quero receber um erro de domínio explícito ("código inválido") quando o Código de cupom não existe no Catálogo, para que eu trate o caso sem depender de exceções.
7. Como desenvolvedora consumindo o módulo, quero que a correspondência do código seja exata, para que códigos parecidos ("menos10" vs "MENOS10") nunca apliquem um cupom por engano.
8. Como desenvolvedora consumindo o módulo, quero que um carrinho vazio com cupom válido simplesmente resulte em Total 0, para que não exista um caso especial a mais para lembrar.
9. Como desenvolvedora consumindo o módulo, quero que aplicar outro cupom sobre um Carrinho com desconto substitua o desconto anterior ("o último ganha"), para que o desconto seja sempre recalculado do Subtotal dos itens de forma previsível.
10. Como desenvolvedora consumindo o módulo, quero que a entrada jamais seja mutada, para que eu possa reutilizar o carrinho original com segurança depois da chamada.
11. Como desenvolvedora consumindo o módulo, quero que o Catálogo seja um argumento da função, para que eu teste com catálogos próprios sem estado escondido nem mock de módulo.
12. Como desenvolvedora consumindo o módulo, quero que o Subtotal seja sempre derivado dos itens, para que nunca exista um total armazenado dessincronizado com o carrinho.
13. Como desenvolvedora consumindo o módulo, quero que o resultado de erro seja uma união discriminada que o TypeScript me obriga a tratar, para que o caso "código inválido" não passe despercebido.
14. Como desenvolvedora consumindo o módulo, quero que os valores monetários sejam inteiros em centavos, para que a aritmética não sofra com imprecisão de ponto flutuante.
15. Como estudante de TypeScript, quero ver cupons modelados como união discriminada, para que eu pratique modelagem de tipos em strict mode.
16. Como estudante de TypeScript, quero ver o resultado de erro modelado como união sem exceções, para que eu pratique tratamento de erro idiomático e exaustivo.
17. Como estudante de TypeScript, quero que todo o comportamento seja exercitado por testes com vitest, para que eu veja uma suíte pequena cobrindo os casos de borda do domínio.
18. Como mantenedora do Catálogo, quero que os códigos canônicos sejam definidos por mim no Catálogo, para que nenhuma normalização escondida altere o que eu cadastrei.
19. Como revisora do código, quero um módulo único, pequeno e legível, para que eu consiga auditar toda a lógica de desconto numa leitura só.
20. Como revisora do código, quero que o código use o vocabulário do glossário (Carrinho, Item, Subtotal, Cupom, Desconto, Total), para que a linguagem do código e a do domínio coincidam.

## Implementation Decisions

- **TypeScript em strict mode**; `typescript` e `vitest` como únicas devDeps; **zero dependências de runtime**.
- **Módulo único** com a função e os tipos; teste colocado ao lado do módulo.
- **Identificadores em português**, alinhados ao glossário (`aplicarCupom`, `Carrinho`, `Item`, `Cupom`, `Catalogo`).
- **Dinheiro em centavos inteiros** em todo o domínio.
- O **Carrinho** contém apenas itens; o **Subtotal** é sempre derivado (`precoUnitario × quantidade` somado).
- O **Item** tem preço unitário (centavos) e quantidade inteira.
- O **Cupom** é uma união discriminada: percentual (inteiro) ou valor fixo (centavos). Sem validação de faixa do percentual — o Catálogo é autorado.
- O **Catálogo** é passado como argumento (mapa de código → cupom), mantendo a função pura e sem estado escondido.
- O resultado é uma união discriminada sem exceções; o único erro de domínio é "código inválido". O contrato (esboçado na sessão de design, destilado ao essencial):
  ```ts
  type Resultado<Ok, Erro> =
    | { ok: true; valor: Ok }
    | { ok: false; erro: Erro }

  // aplicarCupom(carrinho, codigo, catalogo) => Resultado<CarrinhoComDesconto, "codigo-invalido">
  ```
- **Desconto sempre limitado ao Subtotal**, valendo para valor fixo e para percentual acima de 100%.
- Desconto percentual arredondado para o **centavo mais próximo** (`round`).
- **Correspondência exata** de código; **carrinho vazio sem caso especial**; **reaplicação substitui** o desconto anterior ("o último ganha").
- **Imutabilidade**: a função devolve um novo Carrinho com desconto; a entrada permanece intacta.
- **Sem ADRs**: neste estágio nenhuma decisão é difícil de reverter.

## Testing Decisions

- **Bom teste = comportamento externo**: cada teste descreve um cenário de domínio e afirma sobre o resultado da função (Total, Desconto, erro), nunca sobre estruturas internas ou helpers.
- **Um único seam**: todos os testes passam exclusivamente pela função exportada. Helpers internos (Subtotal, arredondamento, lookup no Catálogo) não são exportados nem testados diretamente.
- **Módulo testado**: o módulo único de aplicar cupom, em todos os cenários das user stories: percentual, valor fixo, cap no Subtotal, arredondamento, código inválido, código com case diferente, carrinho vazio, reaplicação e imutabilidade da entrada.
- **Prior art**: não existe — é o primeiro módulo do projeto; a suíte fundará o padrão de testes (vitest, `describe`/`it` em português, cenários nomeados com o vocabulário do glossário).

## Out of Scope

- Expiração/validade de cupom (exigiria um "hoje" explícito; fica para uma v2).
- Cupons de uso único, rastreamento de uso ou limites por cliente.
- Empilhar/combinar múltiplos cupons numa única aplicação.
- Persistência ou fonte externa do Catálogo (arquivo, banco, API).
- Interface de usuário, CLI ou HTTP.
- Multi-moeda e formatação de valores.
- Validação de faixa do percentual ou quantidades negativas (o Catálogo e os carrinhos são autorados nos testes).

## Further Notes

- O vocabulário canônico está em `GLOSSARY.md`: o par **Subtotal** (antes do cupom) / **Total** (depois) substitui a expressão ambígua "valor total". O glossário deve continuar sendo a fonte da nomenclatura do código.
- O projeto é de estudo: código pequeno e legível tem precedência sobre generalidade. Separar o módulo em arquivos por conceito só quando o tamanho justificar.
