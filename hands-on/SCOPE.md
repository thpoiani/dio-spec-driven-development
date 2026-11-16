# SCOPE · Aula 2 — Hands-on SDD: Game Copilot

> Documento de escopo da segunda aula. Decisões registradas em sessão de planejamento (nov/2026).
> Detalhes de arquitetura em [ARCHITECTURE.md](./ARCHITECTURE.md) · roteiro de gravação em [PRESENTATION.md](./PRESENTATION.md).

## 1. Contexto e tese

A aula 1 provou, com o experimento dos 4 placares (4/10 em todos os métodos), que **o gargalo do SDD é quem especifica, não o método**. A aula 2 é o contraponto prático: **o mesmo ciclo das Skills do Matt Pocock** (`@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement`/`@tdd`/`@code-review` → `@retro`) aplicado a um sistema real, com arquitetura, eventos, evolução de infraestrutura e agentes LLM.

**Tese da aula**: features em sistema existente são onde o SDD brilha de verdade — e a postura do operador muda: na aula 1 eu *aceitava as recomendações* (e o placar mostrou o gargalo); na aula 2 **eu respondo de verdade**, com decisões de negócio próprias, e o método transforma cada resposta em requisito testável.

## 2. Gancho de mercado

- **Grand Theft Auto VI** lançado em **19/11/2026** (PlayStation 5 / Xbox Series X|S) — o vídeo é gravado antes do release e publicado depois. Lançamento com audiência massiva: o jogador busca estratégia sem sair do jogo.
- Tendência associada: **sistemas operacionais para TV** que removem ads e telemetria e melhoram performance (ex.: [cleanyour.tv](https://cleanyour.tv/)) — a TV como plataforma computacional aberta.
- **Problem statement** (do briefing da aula):

> **Oportunidade**: lançamentos de jogos com audiência massiva.
> **Problema**: jogadores enfrentam sobrecarga de informações ao buscar estratégias sem tempo real para jogos complexos, necessitando de pausas constantes.
> **Impacto**: interrupção da imersão e redução do engajamento.
> **Solução**: análise de contexto de gameplay em tempo real, entregando dicas e estratégias personalizadas ao jogador.

## 3. O sistema: Game Copilot

Um assistente de jogador que consome a **telemetria de gameplay** (eventos publicados num broker), infere o **perfil do jogador**, cruza com uma **base de conhecimento do mundo do jogo** (wiki) e publica **recomendações human-readable** — tanto por um motor de regras determinístico quanto por um agente LLM.

Para a aula, o jogo é **Super Mario World** (reconhecimento imediato da plateia, pré-requisitos reais e legíveis). A captura/análise de screenshot fica fora do escopo: a aula **começa nos eventos**, que são mockados por "playthroughs" (fitas de eventos que simulam sessões reais de jogo). A mensagem explícita na aula: *"amanhã você pluga o jogo que quiser na mesma interface"*.

## 4. Decisões registradas

| # | Decisão | Escolha | Motivo |
|---|---|---|---|
| 1 | Tese da aula | Mercado como gancho + SDD como método | Fecha o arco com a aula 1 |
| 2 | Divisão offline vs. gravação | Core pronto offline; gravação = 2 features via ciclo SDD completo | A gravação ensina o ciclo, não a digitação |
| 3 | Jogo da base de conhecimento | Super Mario World | Plateia conhece; gating por Switch Palaces/saídas secretas é didático; Sonic tem pré-requisito fraco |
| 4 | Camada de conhecimento | **Uma só**: wiki em formato OKF v0.2 (langchain-ai/openwiki), commitada no repo | Sem `graph.ts` paralelo: frontmatter = dado estruturado do motor; prosa = texto do agente; sem drift entre camadas |
| 5 | Autoria da wiki | OpenWiki + OpenCode (integração nativa) a partir de um detonado | Mesmo agente do curso; OKF portável; visualizador de grafo para slide |
| 6 | Broker de eventos | MQTT (Mosquitto em docker-compose) | Tema TV/IoT; 1 container; tópicos por tipo de evento; habilita o agente como consumidor |
| 7 | Perfis de jogador | `completionist`, `speedrunner`, `casual` | Vocabulário Mario; inferíveis a partir dos eventos (com timestamps) |
| 8 | Onde o LLM entra | **Só no WorldAdvisor** (agente LangChain) | Profiler/ProgressionAdvisor determinísticos e testáveis; demo rápida e estável |
| 9 | Vocabulário | Eventos e componentes no domínio Mario (`level_started`, `boss_engaged`, power-ups) | Glossário registra; Avoid: "quest", "batalha" |
| 10 | Postura do operador | Responder de verdade na entrevista | Contraponto do protocolo da aula 1 |
| 11 | Terminal na gravação | Gravado separado, acelerado na edição | A entrevista ao vivo é o conteúdo; o terminal fica dinâmico |
| 12 | Branches | Numeradas, preservadas após merge, `main` sempre final | Alunos navegam a evolução; GitHub Pages não muda |
| 13 | Dependências externas | Liberadas nesta aula (mqtt.js, LangChain, Mosquitto) | Diferente da aula 1 ("sem deps") por ser um sistema integrado |

## 5. Non-goals (explícitos na aula e nas specs)

- ❌ Captura e análise de screenshot real (OCR/vision) — a aula começa nos eventos mockados.
- ❌ LLM no caminho determinístico — `PlayerProfiler` e `ProgressionAdvisor` são regras puras.
- ❌ UI/overlay — o sistema termina nas recomendações textuais no console.
- ❌ Broker Kafka/RabbitMQ — overkill; Mosquitto de uma linha.
- ❌ O agente reagir a **cada** evento — só a eventos relevantes (`area_entered`, `boss_engaged`, `profile_changed`), com throttle.

## 6. Features e branches

| Branch | Conteúdo | Quando | Tag |
|---|---|---|---|
| `feature/00-core` | Scaffold TS strict + Vitest; eventos + interface `EventBus` + `InMemoryEventBus`; wiki OpenWiki de SMW + loader; `PlayerProfiler` + `ProgressionAdvisor`; 3 playthroughs + `npm run demo`; testes | Offline (pré-gravação) | `v0.1-core` |
| `feature/01-event-broker` | Migração do fluxo de eventos para MQTT/Mosquitto guiada por SDD; `InMemoryEventBus` permanece para testes | Gravada ao vivo | `v0.2-broker` |
| `feature/02-world-advisor-agent` | `WorldAdvisor`: agente LangChain consumindo o broker e consultando a wiki (SDD para agentes) | Gravada ao vivo | `v0.3-agent` |
| `feature/03-knowledge-expansion` | Expansão do mundo na wiki (Star Road / Special World) com spec + tickets pré-produzidos em `.scratch/` | **Homework** dos alunos | `v0.4-expansion` |

Regras de repositório:

- Projeto em `hands-on/game-copilot/` deste repo; branches **preservadas após o merge** para os alunos navegarem o histórico; `main` sempre com o conteúdo final (deploy do GitHub Pages não muda).
- `@setup-matt-pocock-skills` na subpasta **antes da gravação**: issue tracker local markdown (`.scratch/<feature>/`), mesmos triage labels, single-context (`GLOSSARY.md` + `docs/adr/`).
- O professor grava as duas features passando pelo ciclo completo; a entrevista (`@grill`) é ao vivo e o terminal é acelerado na edição.

## 7. Roteiro da gravação (resumo)

| Bloco | Tempo | Conteúdo |
|---|---|---|
| Abertura | 15' | Gancho GTA VI (19/11) + tendência TV + use case + non-goals |
| Tour do core | 10' | Arquitetura, base de conhecimento, demo dos 3 playthroughs |
| Feature 1 | ~15' | `01-event-broker` — SDD para infraestrutura |
| Feature 2 | ~20' | `02-world-advisor-agent` — SDD para agentes |
| Encerramento | 5' | Recap, homework (`feature/03`), convite |

Detalhe completo (falas, telas, cortes): [PRESENTATION.md](./PRESENTATION.md).

## 8. Checklist de execução

0. ✅ `hands-on/SCOPE.md` (este documento) + documentação de arquitetura e apresentação
1. Scaffold `hands-on/game-copilot/` (TS strict, Vitest, sem deps no core) + `@setup-matt-pocock-skills`
2. Tipos de evento + interface `EventBus` + `InMemoryEventBus`
3. Base de conhecimento: `openwiki/` de Super Mario World (OKF v0.2, curada a partir de detonado) + loader de frontmatter
4. `PlayerProfiler` (3 perfis) + `ProgressionAdvisor` (regras) + payload de recomendação
5. 3 playthroughs (`casual`, `completionist`, `speedrunner`) + `npm run demo` + testes por componente → merge `feature/00-core` → tag `v0.1-core`
6. Spec + tickets pré-produzidos do homework em `.scratch/knowledge-expansion/`
7. Gravação das features 01 e 02 (ciclo completo das skills)
8. Outline + deck com a skill `dio-slides`

## 9. Referências

- [Matt Pocock Skills](https://github.com/mattpocock/skills) · [OpenCode](https://opencode.ai/docs) (agente do curso)
- [langchain-ai/openwiki](https://github.com/langchain-ai/openwiki) · [Open Knowledge Format (OKF) v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Eclipse Mosquitto](https://mosquitto.org/) · [MQTT.org](https://mqtt.org/) · [mqtt.js](https://github.com/mqttjs/MQTT.js) · [LangChain.js](https://js.langchain.com/)
- [cleanyour.tv](https://cleanyour.tv/) · [Rockstar — GTA VI 19/11/2026](https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026)
- Aula 1: [README do curso](../README.md) · [slides](../slides/outline.md)
