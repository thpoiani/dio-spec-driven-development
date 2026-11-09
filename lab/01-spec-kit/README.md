# 01 — Spec Kit: a spec por fases, com quality gates

> Segundo experimento do estudo comparativo de Spec-Driven Development. Mesmo prompt, método diferente: o fluxo de fases do Spec Kit (GitHub), em que a especificação passa por portões de qualidade antes de virar código.

## Sessão

| | |
|---|---|
| **Prompt** | "Crie uma função que receba um carrinho e um código de cupom e aplique o desconto no valor total." |
| **Método** | Spec Kit — `/speckit.constitution` → `specify` → `clarify` → `plan`  → `tasks` → `implement` |
| **Constituição** | "Projeto de estudo: TypeScript em strict mode, Vitest como test runner, código pequeno e legível, funções puras, sem dependências externas." — o único input do operador além do prompt; sem nenhuma regra de negócio do domínio |
| **Agente** | OpenCode v2.2.5 |
| **Modelo** | GLM-5.3-Flash |
| **Perguntas antes de codar** | **2**, no `clarify` — ambas de mecânica (base do desconto; forma do resultado); nenhuma das 8 ambiguidades de negócio foi perguntada. A stack foi **declarada** durante `/speckit.constitution` |
| **Postura do operador** | responder o que for perguntado **aceitando a recomendação proposta** — nunca oferecer regras de negócio não solicitadas (vale para todos os experimentos) |
| **Artefatos** | `specs/001-cart-coupon-discount/` — spec, plan, research, data-model, contracts, quickstart, tasks, checklist (8 arquivos) |
| **Gravação** | [record.mp4](./record.mp4) |

## Como o método tratou a ambiguidade (as mesmas 8 perguntas)

| # | Ambiguidade | O que o método fez |
|---|---|---|
| 1 | Percentual ou valor fixo? | Os dois, sem perguntar — viraram requisitos (FR-002, FR-003) |
| 2 | Inexistente ≠ expirado ≠ inativo? | Inexistente virou requisito de rejeição inequívoca (FR-004); **expirado e inativo: fora do escopo, documentado em Assumptions** |
| 3 | Valor mínimo do carrinho? | Fora do escopo, documentado em Assumptions |
| 4 | Cupons cumulativos? | Fora do escopo, documentado ("cada aplicação é independente… sem controle de uso único") |
| 5 | Total pode ficar negativo? | **Requisito explícito** (FR-005) com teste dedicado — não sorte |
| 6 | Erro estruturado? | **União discriminada, sem exceções** (decisão D2 do research.md) — o compilador obriga a tratar a rejeição |
| 7 | Arredondamento? | Requisito (FR-008): half-up, calculado em **centavos inteiros** (decisão D1) — exato por construção |
| 8 | Efeito colateral? | Princípios da constituição viraram FR-006 (entrada inalterada) e FR-007 (determinismo), com testes transversais |

E o `clarify` ainda trouxe **2 perguntas que nem estavam nas 8**: qual valor é a base do desconto (decisão: o total fornecido é autoritativo; a lista de itens é só informativa e nunca recalculada) e o que o resultado carrega (decisão: só o novo total — o valor do desconto é derivável).

## A cerimônia (o que o método gerou para 3 módulos pequenos)

- **Constituição** (`.specify/memory/`): 5 princípios de engenharia — que reaparecem como FR-006/FR-007 e como gate no plano.
- **spec.md**: perguntas do clarify, 3 user stories priorizadas (P1–P3) com cenários Given/When/Then, edge cases, 8 requisitos funcionais, success criteria mensuráveis e Assumptions.
- **plan.md**: contexto técnico + gate "Constitution Check" com evidência por princípio.
- **research.md**: decisões D1–D4 com alternativas rejeitadas e justificativa.
- **data-model.md**, **contracts/aplicar-cupom.md** (contrato público com pré-condições, garantias e exemplos), **quickstart.md**.
- **tasks.md**: tarefas por user story, testes obrigatórios, com marcação de paralelismo.
- **checklists/requirements.md**: checklist de qualidade da spec — todos os itens ✅.
- Código: 3 módulos pequenos em `src/`; **10 testes** em Vitest, todos verdes.

## Placar contra os critérios de aceitação

Critérios definidos **antes** da geração — o gabarito do comportamento que uma implementação completa do validador deveria atender.

| # | Cenário | Resultado |
|---|---|---|
| 1 | Percentual válido | ✅ passa — com **catálogo próprio** (`PROMO10`): 10% de 200 → 180 |
| 2 | Valor fixo válido | ✅ passa — com catálogo próprio (`MENOS15`): o tipo fixo funciona |
| 3 | Fixo maior que o total | ✅ passa — FR-005 + teste dedicado (não é sorte) |
| 4 | Cupom inexistente | ✅ passa na essência — rejeição **estruturada** `{ ok: false, motivo: "codigo-desconhecido" }`, sem exceção (código próprio em vez de `CUPOM_INEXISTENTE`) |
| 5 | Cupom expirado | ❌ fora do escopo — documentado em Assumptions |
| 6 | Cupom inativo | ❌ fora do escopo — documentado em Assumptions |
| 7 | Abaixo do mínimo | ❌ fora do escopo — documentado em Assumptions |
| 8 | Exatamente no mínimo | ❌ fora do escopo — o conceito de mínimo não existe |
| 9 | Segundo cupom | ❌ fora do escopo — "cada aplicação é independente" |
| 10 | Válido no próprio dia | ⚠️ **intestável** — validade não existe (e o contrato declara isso) |

**Placar: 4/10 — o mesmo da baseline.** A diferença não está no placar: está em de onde vêm os acertos (decisões documentadas e testadas, não sorte) e em como os erros são comunicados (declarados em Assumptions, não inventados em silêncio).

## O que este experimento mostra

- **O que ficou fora do escopo não desapareceu** — virou linha explícita em Assumptions: quem consome sabe exatamente o que não pode esperar. Zero invenção silenciosa.
- **O método desenterrou ambiguidades que nem estavam no mapa**: a base do desconto (a baseline recalculava o total a partir dos itens sem avisar; aqui o total fornecido é autoritativo, por decisão registrada) e a forma do resultado (sem o valor do desconto — derivável).
- **Erro estruturado por design** (D2): a rejeição é um valor do sistema de tipos, não um fluxo de exceção.
- **Dinheiro em centavos inteiros** (D1): o erro de ponto flutuante morre na origem — a baseline arredondava `float` com `toFixed` no final.
- **Decisões divergentes da baseline, agora documentadas e testadas**: comparação exata de código (sem trim, sem case-insensitive) e carrinho vazio que retorna 0 em vez de lançar exceção.
- **A constituição atravessou o pipeline**: princípios de pureza e determinismo viraram requisitos funcionais com testes, e o plano tem um gate que verifica conformidade.
- **O preço do método**: 8 artefatos de especificação + 10 testes para uma função de domínio pequena. Cerimônia é custo — a aposta do Spec Kit é que o custo se paga quando o escopo cresce e a ambiguidade custa caro.

> Conclusão: placar igual ao da baseline (4/10), mas com a verdade documentada — o método não fez a função acertar mais; fez o sistema **nunca errar em silêncio**.
