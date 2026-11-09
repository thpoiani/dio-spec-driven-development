# 02 — OpenSpec: a spec que sobrevive ao código

> Terceiro experimento do estudo comparativo de Spec-Driven Development. Mesmo prompt, método diferente: o OpenSpec organiza o trabalho em **pastas de change** — proposta, delta de spec, design e tarefas — e, ao arquivar, funde a especificação numa fonte de verdade permanente do sistema.

## Sessão

| | |
|---|---|
| **Prompt** | "Crie uma função que receba um carrinho e um código de cupom e aplique o desconto no valor total." — colado **junto com** os constraints de estudo ("Projeto de estudo: TypeScript em strict mode, Vitest como test runner, código pequeno e legível, funções puras, sem dependências externas") no primeiro comando |
| **Método** | OpenSpec — `/opsx-explore` → `/opsx-propose apply-cart-coupon-discount` → `/opsx-apply` → `/opsx-sync` → `/opsx-archive` |
| **Agente** | OpenCode v2.2.5 |
| **Modelo** | GLM-5.3-Flash |
| **Perguntas antes de codar** | **3**, todas de modelagem: (1) o que é um carrinho (estrutura); (2) o que é um cupom (os tipos: percentual, valorFixo); (3) de onde vêm os cupons — recebidos na assinatura ou buscados de outro lugar (→ catálogo injetado, decisão D7). Nenhuma das 8 ambiguidades de negócio foi perguntada — viraram **Non-Goals explícitos** no design |
| **Postura do operador** | responder o que for perguntado **aceitando a recomendação proposta** — nunca oferecer regras de negócio não solicitadas (vale para todos os experimentos) |
| **Stack: onde foi decidida** | Na **origem** — o método não tem fase dedicada a stack nem comando de constituição; o operador teceu os constraints no primeiro comando, e eles ancoraram o `proposal.md` e o `Context` do design |
| **Data** | 09/11/2026 (data do archive) |
| **Gravação** | [record.mp4](./record.mp4) |

## Como o método tratou a ambiguidade (as mesmas 8 perguntas)

| # | Ambiguidade | O que o método fez |
|---|---|---|
| 1 | Percentual ou valor fixo? | Os dois — cupom como union com **exatamente dois variantes** (decisão D4), sem campos opcionais de "tipo de desconto" |
| 2 | Inexistente ≠ expirado ≠ inativo? | Desconhecido reportado no tipo (`Resultado`, decisão D5); **expiração e status: Non-Goals explícitos** |
| 3 | Valor mínimo do carrinho? | **Non-Goal listado no design** ("Cupons com valor mínimo de compra, frete grátis, expiração, limites de uso") |
| 4 | Cupons cumulativos? | **Non-Goal listado no design** ("Múltiplos cupons empilhados") |
| 5 | Total pode ficar negativo? | **Requisito com cenários dedicados** — para desconto fixo *e* percentual (clamp), com testes |
| 6 | Erro estruturado? | `Resultado` como discriminated union (D5) — sem exceção, sem `null` — e **teste que força o consumidor a tratar os dois caminhos** |
| 7 | Arredondamento? | Requisito: **um único `Math.round`, no final** (decisão D2) — com o trade-off do `.5` exato registrado em Risks |
| 8 | Efeito colateral? | Requisito de imutabilidade com teste de `Object.freeze`; subtotal/total são **derivados, nunca armazenados** (decisão D3) |

E o design registrou até decisões que os outros experimentos nem tocaram: validação de entrada como Non-Goal ("tipos garantem forma, não valores") e o domínio em **português integral**, com o trade-off de vocabulário misto anotado em Risks.

## A cerimônia (o que o método gerou)

- **proposal.md** — o "porquê" e o "o quê": capacidades novas (`cart-coupon`), impacto no projeto, zero API externa.
- **specs/cart-coupon/spec.md** (delta) — 8 requisitos em notação SHALL, cada um com cenários WHEN/THEN, inclusive percentual 0%, arredondamento fracionário e clamp percentual.
- **design.md** — Goals/**Non-Goals**, 7 decisões com alternativas descartadas, Risks/Trade-offs, Open Questions ("nenhum que bloqueie").
- **tasks.md** — 15 tarefas em 5 fases, cada uma com critério de verificação embutido (ex.: *"verificar que `tsc --noEmit` falha se o branch de erro for removido"*).
- Código: 4 módulos pequenos em `src/domains/cart/` (types, subtotal, total, cupom) — **15 testes em Vitest, todos verdes**.
- **O diferencial**: após o archive, os requisitos foram fundidos em `openspec/specs/cart-coupon/spec.md` — o sistema continua documentado **depois** que a change termina.

## Placar contra os critérios de aceitação

Critérios definidos **antes** da geração — o gabarito do comportamento que uma implementação completa do validador deveria atender.

| # | Cenário | Resultado |
|---|---|---|
| 1 | Percentual válido | ✅ passa — 10% sobre 2000 → 1800 (catálogo fornecido pelo chamador, injetado) |
| 2 | Valor fixo válido | ✅ passa — tipo `valorFixo` subtrai do subtotal |
| 3 | Fixo maior que o total | ✅ passa — requisito com teste dedicado (fixo *e* percentual) |
| 4 | Cupom inexistente | ✅ passa na essência — rejeição **estruturada** `{ ok: false, erro: "cupomDesconhecido" }`, sem exceção, sem `null` (código próprio) |
| 5 | Cupom expirado | ❌ Non-Goal documentado no design |
| 6 | Cupom inativo | ❌ o conceito não existe — regras comerciais fora do escopo |
| 7 | Abaixo do mínimo | ❌ Non-Goal documentado no design |
| 8 | Exatamente no mínimo | ❌ o conceito de mínimo não existe |
| 9 | Segundo cupom | ❌ Non-Goal documentado ("múltiplos cupons empilhados") |
| 10 | Válido no próprio dia | ⚠️ **intestável** — validade não existe (e está declarado) |

**Placar: 4/10 — o terceiro método, o mesmo placar.** A explicação agora é evidente: nos três experimentos o operador forneceu apenas princípios de engenharia, nunca as regras comerciais. Quem não dá as regras, recebe uma função sem elas — o que distingue os métodos é como cada um trata essa ausência.

## O que este experimento mostra

- **Non-Goals como seção de primeira classe** — o que não será feito tem lista própria no design, antes das decisões: o consumidor sabe exatamente o que não esperar.
- **As 3 perguntas foram de modelagem, não de negócio** — estrutura do carrinho, tipos de cupom e origem do catálogo; foi a pergunta sobre a origem que produziu o catálogo injetado (D7). As 8 de comportamento continuaram sem resposta.
- **A fonte da verdade sobrevive ao código** — `openspec/specs/cart-coupon/spec.md` existe depois do archive; os requisitos do sistema ficam documentados para a próxima change. Os outros métodos produzem artefatos de um evento; este produz documentação viva.
- **Pureza levada ao pé da letra** — o catálogo de cupons é **injetado por parâmetro** (D7): nenhum cupom específico mora no domínio. A baseline e o Spec Kit embutiram o catálogo no módulo.
- **Composição em vez de função única** (D6) — localizar o cupom, calcular o total e compor o resultado são três funções pequenas, testáveis isoladamente.
- **Teste do sistema de tipos** — a suíte verifica que o compilador rejeita o consumidor que ignora o caminho de erro (tarefa 4.3): um meta-teste que os outros experimentos não produziram.
- **Linguagem ubíqua de verdade** — o domínio inteiro em português (`Carrinho`, `Cupom`, `Resultado`, `calcularTotal`), com o trade-off do vocabulário misto registrado; a baseline misturava `Cart`/`itens` sem registro.
- **O preço do método** — 4 artefatos de change + spec sincronizada, tarefas com verificação embutida. Mais enxuto que o Spec Kit (sem constitution, research ou checklists), com o custo concentrado no design.

> Conclusão: terceiro método, mesmo placar (4/10) — porque a ausência das regras comerciais é do operador, não do método. O que o OpenSpec adicionou: ausências viraram **Non-Goals com lista própria**, o catálogo saiu do código (injetado) e a especificação **sobreviveu ao código** em `openspec/specs/` — documentação viva, não artefato de um evento.
