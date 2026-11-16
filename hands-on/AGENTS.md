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
- [ ] Item 1 — scaffold `hands-on/game-copilot/` (TS strict + Vitest, sem deps no core)
- [ ] Item 1b — `@setup-matt-pocock-skills` na subpasta (tracker local markdown `.scratch/<feature>/`, mesmos triage labels, single-context: `GLOSSARY.md` + `docs/adr/`)
- [ ] Item 2 — eventos + interface `EventBus` + `InMemoryEventBus`
- [ ] Item 3 — `openwiki/` de Super Mario World (OKF v0.2) + `knowledge-loader`
- [ ] Item 4 — `PlayerProfiler` (casual/completionist/speedrunner) + `ProgressionAdvisor`
- [ ] Item 5 — 3 playthroughs + `npm run demo` + testes → branch `feature/00-core` → merge → tag `v0.1-core`
- [ ] Item 6 — spec + tickets do homework em `.scratch/knowledge-expansion/` (status `ready-for-agent`)
- Itens 7–8 (gravação das features 01/02 e deck `dio-slides`) são do Thiago, não de agente.

## Fluxo de trabalho por etapa

1. Trabalhe em **uma etapa por vez**, na ordem do checklist acima. Cada etapa = branch própria conforme a convenção: `feature/00-core`, `feature/01-event-broker`, `feature/02-world-advisor-agent`, `feature/03-knowledge-expansion` — commits atômicos que contam a história (spec → tickets → código), branches **preservadas após merge**, tags `v0.1-core`, `v0.2-broker`, `v0.3-agent`, `v0.4-expansion`. `main` sempre com o conteúdo final.
2. **Features 01 e 02 são gravadas ao vivo**: ao executá-las em sessão de desenvolvimento, siga o ciclo completo das Skills do Matt Pocock na subpasta — `@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement` (dirigindo `@tdd`, fechando com `@code-review`) → `@retro`. O Thiago **responde as perguntas com decisões reais** (postura da aula 2 — diferente da aula 1, em que aceitava recomendações).
3. A Feature 1 (broker) e a Feature 2 (agente) só existem como *gravação* — se estiver trabalhando nelas fora de gravação, pare no preparo dos artefatos e confirme com o Thiago.

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
