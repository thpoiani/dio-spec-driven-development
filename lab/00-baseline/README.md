# 00 — Baseline: o prompt vago, sem método

> Este experimento é a **baseline** de um estudo comparativo de abordagens de Spec-Driven Development (SDD) — os demais experimentos, em `lab/`, partem do mesmo prompt. Aqui, o prompt foi entregue a um agente de código **sem método nenhum**: sem spec, sem processo, colado sozinho numa sessão nova. É o ponto de partida contra o qual todos os outros são comparados.

## Sessão

| | |
|---|---|
| **Prompt** | "Crie uma função que receba um carrinho e um código de cupom e aplique o desconto no valor total." |
| **Agente** | OpenCode v2.2.5 |
| **Modelo** | GLM-5.3-Flash |
| **Perguntas antes de codar** | **Uma**: a escolha da linguagem (resposta: TypeScript) — nenhuma sobre comportamento |
| **Postura do operador** | responder o que for perguntado **aceitando a recomendação proposta** — nunca oferecer regras de negócio não solicitadas (vale para todos os experimentos) |
| **Código** | `carrinho.ts` — preservado exatamente como gerado, sem ajustes |
| **Gravação** | [record.mp4](./record.mp4) |

## O que o código revela (as 8 ambiguidades que a frase esconde)

| # | Ambiguidade | O que o agente fez |
|---|---|---|
| 1 | Percentual ou valor fixo? | Decidiu sozinho: os dois (`"percentual" \| "valor_fixo"`) — ninguém perguntou |
| 2 | Inexistente ≠ expirado ≠ inativo? | **Ignorou por completo** — sem data de validade nem status no modelo; cupom inexistente vira exceção "inválido" |
| 3 | Valor mínimo do carrinho? | Implementou — mas decidiu sozinho que é **opcional** (`minimo?`), uma decisão de política comercial |
| 4 | Cupons cumulativos? | **Nem considerou** — nada impede aplicar outro cupom em seguida |
| 5 | Total pode ficar negativo? | Acertou por sorte (`Math.min(desconto, total)`) — decisão correta, porém não documentada |
| 6 | Erro estruturado? | **Violação central**: exceções genéricas com mensagem em string — o consumidor (humano ou agente) não distingue as falhas |
| 7 | Arredondamento? | `toFixed(2)` no final, sobre floats — critério implícito e não testado |
| 8 | Efeito colateral? | Pura **por acaso** — retorna valores, não muta o carrinho |

## Placar contra os critérios de aceitação

Critérios definidos **antes** da geração — o gabarito do comportamento que uma implementação completa do validador deveria atender.

| # | Cenário | Resultado |
|---|---|---|
| 1 | Percentual válido | ✅ passa — mas com **catálogo inventado** (`BEMVINDO10` em vez de `DIO10`) |
| 2 | Valor fixo válido | ✅ passa — por coincidência: o agente escolheu `MENOS50` com o mesmo valor e o mesmo mínimo |
| 3 | Fixo maior que o total | ✅ passa — total 0, nunca negativo |
| 4 | Cupom inexistente | ❌ erro genérico, não `CUPOM_INEXISTENTE` |
| 5 | Cupom expirado | ❌ o conceito **não existe** — cupom expirado funciona para sempre |
| 6 | Cupom inativo | ❌ o conceito não existe |
| 7 | Abaixo do mínimo | ❌ erro genérico, não `VALOR_MINIMO_NAO_ATINGIDO` |
| 8 | Exatamente no mínimo | ✅ passa — comparação inclusiva (`total < minimo`) |
| 9 | Segundo cupom | ❌ aplica de novo sem reclamar |
| 10 | Válido no próprio dia | ⚠️ **intestável** — validade não existe no modelo gerado |

**Placar: 4/10** — e os quatro que passam, passam por sorte ou com dados que o agente inventou.

## O que este experimento mostra

- **A única pergunta foi sobre tecnologia** — o agente perguntou a linguagem e partiu para o código; as 8 ambiguidades de comportamento ficaram todas sem resposta.
- **Shape completo do carrinho inventado** — `id`, `nome`, `quantidade`: nada disso estava no prompt.
- **Sem linguagem ubíqua**: interfaces em inglês (`Cart`, `CartItem`, `Coupon`) com campos em português (`itens`, `nome`, `preco`, `codigo`) — cada nome decidido na hora.
- **Política comercial decidida sem ninguém perguntar**: mínimo opcional por cupom.
- **Regra inventada do nada**: carrinho vazio vira exceção.
- **Catálogo de cupons hardcoded** no módulo — a origem e persistência dos cupons, decidida por acaso.
- **Semântica sobrecarregada**: `valor: 10` significa 10% *ou* R$10, dependendo de `tipo` — contrato implícito que só quem lê o código descobre.
- **Erro como exceção genérica** — a decisão mais crítica para quem consome a função foi tomada por acaso.

> Conclusão: o problema não foi o modelo — foi o prompt. **O que não foi dito foi inventado.**
