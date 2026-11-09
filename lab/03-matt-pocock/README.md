# 03 — Matt Pocock Skills: a entrevista que decide

> Último experimento do estudo comparativo de Spec-Driven Development. Mesmo prompt, método diferente: **skills composáveis** de engenharia — uma entrevista gera glossário e spec, a spec vira tickets, e cada ticket é implementado com TDD e code-review. Nenhum framework no meio: markdown, conversa e engenharia clássica.

## Sessão

| | |
|---|---|
| **Prompt** | "Crie uma função que receba um carrinho e um código de cupom e aplique o desconto no valor total." — colado **junto com** os constraints de estudo (TypeScript strict, Vitest, código pequeno e legível, funções puras, sem dependências externas) na abertura da entrevista |
| **Método** | `@setup-matt-pocock-skills` → `@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement` ×3 (cada um dirige `@tdd` no seam e fecha com `@code-review`) → `@retro` — **skills** (instaladas em `.agents/skills/`) |
| **Setup** | Tracker de issues em **markdown local** (`.scratch/<feature>/`) — o setup também aceita GitHub, GitLab, Jira etc.; criou o vocabulário de **labels de triagem** (5 papéis), `AGENTS.md` e `docs/agents/` (issue-tracker, triage-labels, domain) |
| **Agente** | OpenCode v2.2.5 |
| **Modelo** | GLM-5.3-Flash |
| **Perguntas antes de codar** | **14, em 2 rodadas** (9 + 5) — cobriram 6 das 8 ambiguidades de negócio por completo e 1 parcialmente (inexistente ✅, expirado ✅→fora do escopo, **inativo: nunca perguntado**; **valor mínimo: nunca perguntado**). Todas respondidas com o operador aceitando a recomendação |
| **Postura do operador** | responder o que for perguntado **aceitando a recomendação proposta** — nunca oferecer regras de negócio não solicitadas (vale para todos os experimentos) |
| **Stack: onde foi decidida** | Na **origem**, dentro do prompt da entrevista — não há fase nem comando dedicado a stack |
| **Data** | 09/11/2026 |
| **Gravação** | [record.mp4](./record.mp4) |

## Como o método tratou a ambiguidade (as mesmas 8 perguntas)

| # | Ambiguidade | O que o método fez |
|---|---|---|
| 1 | Percentual ou valor fixo? | Perguntado (Q5, rodada 1): os dois, como **união discriminada** |
| 2 | Inexistente ≠ expirado ≠ inativo? | Inexistente perguntado (Q7): **erro de domínio** em união de resultado; validade perguntada (Q9): "fora do escopo na v1"; **inativo: nunca perguntado** — e não está no Out of Scope |
| 3 | Valor mínimo do carrinho? | **Nunca perguntado** — mínimo não aparece nem no Out of Scope da spec |
| 4 | Cupons cumulativos? | Perguntado (Q3, rodada 2): decisão explícita — **"substitui, o último ganha"**, sempre recalculado do Subtotal |
| 5 | Total pode ficar negativo? | Perguntado (Q8): limitar em 0 — *"desconto não gera crédito"* — válido até para percentual acima de 100% |
| 6 | Erro estruturado? | Perguntado (Q7): união de resultado sem exceções — "cupom inválido é resultado de domínio, não exceção" |
| 7 | Arredondamento? | Perguntado (Q1, rodada 2): `Math.round` — neutro, "é o que as pessoas esperam" |
| 8 | Efeito colateral? | Perguntado (Q4): devolve um **novo carrinho imutável** com o cupom, o desconto e o total registrados — entrada intacta |

A entrevista ainda produziu um acerto de vocabulário que nenhum outro método fez: o "valor total" ambíguo do prompt virou a dupla **Subtotal** (antes do cupom) / **Total** (depois), com registro no glossário.

## A cerimônia (o que o método gerou)

- **`GLOSSARY.md`** — 9 termos com definição e lista de *Avoid* (o que não chamar); o `Avoid:` vale como padrão de nomenclatura para revisão.
- **ADR: dispensados** — "neste estágio nenhuma decisão é difícil de reverter" (anotado na própria spec).
- **Spec** (`.scratch/aplicar-cupom/spec.md`, status `ready-for-agent`): problem statement, solução, **20 user stories**, decisões de implementação, decisões de teste (uma **seam única**: todos os testes passam só pela função exportada), Out of Scope.
- **3 tickets tracer-bullet** (`.scratch/aplicar-cupom/issues/`): 01 Tracer percentual (scaffold + função ponta a ponta), 02 valor fixo, 03 endurecer bordas — com dependências explícitas (`Blocked by: 01`) e critérios de aceite por checkbox.
- **3 execuções de `@implement`** — cada uma dirigindo `@tdd` no seam acordado (red-green-refactor) e fechando com `@code-review` antes do commit.
- **`@retro`** — melhorou o ambiente ao sair: criou **`.githooks/pre-commit`** (`typecheck` + `test` antes de cada commit).
- Código: **módulo único** (43 linhas, decisão Q5 da rodada 2), todo no vocabulário do glossário — **11 testes em Vitest, todos verdes**.

## Placar contra os critérios de aceitação

Critérios definidos **antes** da geração — o gabarito do comportamento que uma implementação completa do validador deveria atender.

| # | Cenário | Resultado |
|---|---|---|
| 1 | Percentual válido | ✅ passa — percentual sobre o Subtotal derivado (10% de 1999 → desconto 200) |
| 2 | Valor fixo válido | ✅ passa — tipo `valorFixo` (ticket 02) |
| 3 | Fixo maior que o total | ✅ passa — user story 3 + 4: limite vale para fixo **e** percentual acima de 100% |
| 4 | Cupom inexistente | ✅ passa na essência — rejeição **estruturada** `{ ok: false, erro: "codigo-invalido" }`, sem exceção (código próprio) |
| 5 | Cupom expirado | ❌ perguntado (Q9) e decidido: fora do escopo na v1 |
| 6 | Cupom inativo | ❌ **nunca perguntado** — o conceito não existe e não está documentado |
| 7 | Abaixo do mínimo | ❌ **nunca perguntado** — mínimo não aparece nem no Out of Scope |
| 8 | Exatamente no mínimo | ❌ o conceito de mínimo não existe |
| 9 | Segundo cupom | ❌ pela regra de referência — mas **perguntado e decidido** (Q3): substitui ("o último ganha"), com teste |
| 10 | Válido no próprio dia | ⚠️ **intestável** — validade ficou para a v2 |

**Placar: 4/10 — o quarto método, o mesmo placar.** E o padrão finalmente tem dono: o operador. Quatorze perguntas não mudaram o placar porque as respostas fecharam as branches — *"fora do escopo na v1"* encerrou a linha das regras comerciais antes de mínimo e status serem explorados. O grilling pergunta o que a conversa deixa em aberto.

## O que este experimento mostra

- **A entrevista transforma cada resposta em requisito testável** — 14 perguntas → 20 user stories com critérios; nenhuma decisão ficou implícita no código.
- **O vocabulário nasceu antes do código** — o glossário resolveu o "valor total" ambíguo (a baseline resolvia em silêncio, recalculando) na dupla Subtotal/Total; nomes e revisões passam a seguir o `GLOSSARY.md`.
- **Resultado que carrega contexto** — o único método cuja saída é um **novo carrinho** com o cupom, o desconto e o total registrados; os outros devolvem números ou unions numéricas.
- **Tracer bullets com dependências explícitas** — o ticket 01 atravessa todas as camadas (projeto, função, erro) antes de qualquer especialização; vertical, não horizontal.
- **Seam acordada antes do primeiro teste** — a spec decide que todos os testes passam pela função exportada; o TDD depois só executa o que foi combinado.
- **O método melhora o ambiente** — o `/retro` materializou um pre-commit hook: o processo termina melhor do que começou.
- **O preço do método** — zero artefatos de framework: spec, tickets e glossário são markdown no tracker. A cerimônia é a conversa; o resto é engenharia clássica (TDD, code-review, commit).

> Conclusão: quarto método, mesmo placar (4/10) — o gargalo nunca foi o método, foi quem decide. A execução com 14 perguntas e a sem método nenhum acertaram os mesmos 4, porque as regras que faltavam (mínimo, status, expiração) existiam apenas na cabeça de quem especifica. **Spec-Driven Development não extrai o que você não diz — ele mostra, pergunta a pergunta, exatamente o que faltou dizer.**
