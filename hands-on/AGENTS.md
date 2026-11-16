# AGENTS.md · hands-on (Aula 2 — Game Copilot)

Guia para sessões de agente trabalhando na **aula 2 (hands-on)** do curso DIO de Spec-Driven Development. A aula 1 (estudo comparativo dos 4 métodos) está em `../README.md` e `../slides/`.

## Fontes de verdade (leia antes de qualquer trabalho)

| Documento | O que define |
|---|---|
| [SCOPE.md](./SCOPE.md) | Escopo, tese da aula, as 13 decisões registradas, non-goals, features/branches/tags, checklist de execução |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Componentes, contratos (eventos, tópicos MQTT, perfis), wiki OpenWiki/OKF, fitas de demo, testes, árvore de pastas |
| [PRESENTATION.md](./PRESENTATION.md) | Roteiro de gravação, protocolo (o que é ao vivo vs. acelerado), esqueleto de slides, checklist pré-gravação |

Em conflito entre código e documentos, **os documentos vencem** — e devem ser atualizados se uma decisão mudar (decisões são do Thiago; registre na tabela do SCOPE.md §4).

## Estado atual (atualize esta seção a cada etapa concluída)

- [x] Documentação (SCOPE, ARCHITECTURE, PRESENTATION, este AGENTS.md)
- [x] Item 1 — scaffold `hands-on/game-copilot/` (TS strict + Vitest, sem deps no core)
- [x] Item 1b — `@setup-matt-pocock-skills` na subpasta (tracker **GitHub Issues** + labels de triagem, single-context: `GLOSSARY.md` + `docs/adr/`)
- [~] **Etapa 01 — em andamento**: spec publicada como **Issue #1** (`ready-for-human`); tickets #2–#7 como sub-issues com dependências nativas. Pendente: setup manual do OpenWiki + ingestão do detonado (PC do Paulo) + validação contra a Super Mario Wiki
- [ ] Etapa 02 — eventos + interface `EventBus` + `InMemoryEventBus`
- [ ] Etapa 03 — `knowledge-loader`: OKF → `KnowledgeIndex` (fail fast)
- [ ] Etapa 04 — `PlayerProfiler` (casual/completionist/speedrunner) + `ProgressionAdvisor`
- [ ] Etapa 05 — `game/recommendations` + playthroughs + `npm run demo` + testes
- [ ] Etapa 06/07 — observabilidade (OTel + OpenObserve, traces por sessionId)
- Itens 08–10: 08/09 são **gravação** (ver fluxo abaixo) e 10 é o homework — spec + tickets pré-produzidos por agente quando o resto estiver estável.

## Fluxo de trabalho por etapa

1. **Uma etapa por vez, na ordem dos estágios 01→10** (tabela no `SCOPE.md` §6). Cada estágio = uma branch numerada, **empilhada sobre a anterior** (nasce da branch do estágio anterior), com **spec própria como Issue no GitHub** (issue-pai + tickets como sub-issues com dependências nativas) e commits atômicos que contam a história (spec → tickets → código). **Nenhuma branch é deletada e nada vai para a `main` até o cenário final** — o merge final é feito pelo Thiago. PRs de cada etapa ficam abertos (base = branch anterior) para os alunos analisarem. Tags `v0.1` … `v1.0` por estágio.
2. **Features 01 e 02 são gravadas ao vivo**: ao executá-las em sessão de desenvolvimento, siga o ciclo completo das Skills do Matt Pocock na subpasta — `@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement` (dirigindo `@tdd`, fechando com `@code-review`) → `@retro`. O Thiago **responde as perguntas com decisões reais** (postura da aula 2 — diferente da aula 1, em que aceitava recomendações).
3. Os **estágios 08 (broker) e 09 (agente)** só existem como *gravação* — se estiver trabalhando neles fora de gravação, pare no preparo dos artefatos e confirme com o Thiago.

## Decisões que vinculam (não reabrir sem o Thiago)

- **Jogo**: Super Mario World. Vocabulário Mario em código, wiki e glossário — *Avoid*: "quest", "batalha" (são `level`, `boss_engaged`, power-ups).
- **Camada de conhecimento única**: `openwiki/` no formato OKF v0.2, commitada. O motor de regras consome o **frontmatter** (via knowledge-loader); o agente consome a **prosa**. Não criar `graph.ts` paralelo.
- **Broker**: Mosquitto (MQTT) em docker-compose; `InMemoryEventBus` permanece para testes — a interface `EventBus` é a seam.
- **LLM só no WorldAdvisor**: `PlayerProfiler` e `ProgressionAdvisor` são regras puras, determinísticos e testáveis. Non-goal: agente reagir a cada evento.
- **Zero deps no core** (`00-core`); dependências externas (`mqtt.js`, LangChain, Mosquitto) entram a partir das features 01/02.
- **Perfis**: `casual`, `completionist`, `speedrunner` — inferidos por agregação de eventos (com timestamps), publicados como `game/profile_changed`.

## Contratos e detalhes

- Formato dos eventos, tópicos MQTT, payload de recomendação, estrutura das páginas OKF e das fitas de demo: ver **ARCHITECTURE.md** §4–§6 — implemente exatamente esses contratos.
- Non-goals da aula (não implementar): captura/OCR de screenshot, LLM no caminho determinístico, UI, Kafka/RabbitMQ, agente reagindo a cada evento.

## Observações de ambiente

- Este `hands-on/AGENTS.md` é o guia de **projeto**. Após o scaffold, o `@setup-matt-pocock-skills` criará um `AGENTS.md` **dentro de `game-copilot/`** (config das skills: tracker, labels, domain docs) — os dois coexistem; o da subpasta governa as skills, o daqui governa o escopo da aula.
- Vídeos e demais artefatos da aula 1 vivem em `../lab/` e `../slides/` — não modificar ao trabalhar na aula 2.
