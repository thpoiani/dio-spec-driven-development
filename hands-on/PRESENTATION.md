# PRESENTATION · Roteiro da Aula 2 — Hands-on SDD: Game Copilot

> Roteiro de gravação da segunda aula do curso DIO. Escopo em [SCOPE.md](./SCOPE.md) · arquitetura em [ARCHITECTURE.md](./ARCHITECTURE.md).
> Formato: vídeo gravado (mesmo padrão da aula 1), ~50 minutos, publicado **após o release do GTA VI (19/11/2026)**.
> Slides finais gerados com a skill `dio-slides` — o esqueleto está na §5.

## 1. Arcos narrativos que a aula costura

1. **Arco da aula 1 → 2**: na aula 1, o operador *aceitava as recomendações* e o placar (4/10) provou que o gargalo é quem especifica. Na aula 2, o operador **responde de verdade** — e o método transforma cada decisão em requisito testável. Narrar essa troca de protocolo explicitamente.
2. **Arco de maturidade do SDD**: feature nova (broker = arquitetura) → agente LLM (comportamento não-determinístico) — o ciclo é o mesmo, o que muda é o que a spec precisa fixar.
3. **Arco de tendência**: GTA VI lançado agora → sobrecarga de estratégia → sistemas operacionais para TV (cleanyour.tv) → o Game Copilot como solução comum a ambos.

## 2. Protocolo de gravação

| Regra | Detalhe |
|---|---|
| Entrevista ao vivo | O `@grill-with-docs` é gravado ao vivo: Thiago **responde com decisões de negócio reais** (contraponto da aula 1) |
| Terminal acelerado | `@implement`/`@tdd`/`@code-review` gravados separadamente e **acelerados na edição**; a narração entra por cima |
| Demos rodam de verdade | Mosquitto + `npm run demo` em tempo real; se falhar, cortar para a fita acelerada |
| Pontos de corte | Se a Feature 1 passar de ~15', a Feature 2 vira demo acelerada; o homework nunca é gravado |
| Postura | Nunca oferecer regras que não foram perguntadas — responder o que foi perguntado, com decisão própria |
| Setup | `@setup-matt-pocock-skills` já rodado na subpasta (1 slide menciona, como o slide 17 da aula 1) |

## 3. Roteiro por bloco

### Bloco A · Abertura: a semana em que o jogo lançou (15')

**Objetivo**: estabelecer o problema de mercado e apresentar o use case.
**Tela**: slides.

- GTA VI: lançado em 19/11/2026 — "na semana em que esta aula sai, o jogo mais esperado da década está nas mãos de milhões de jogadores" — e nenhum detonado cobre tudo.
- Sobrecarga: pausar o jogo para buscar estratégia **quebra a imersão** (problem statement do briefing).
- Tendência: a TV virou plataforma computacional — sistemas que removem ads/telemetria e otimizam performance (cleanyour.tv). Se a TV é aberta, um assistente de gameplay é produto, não hack.
- O use case completo (screenshot → análise → eventos → perfil → dicas) e **o corte didático**: sem OCR/vision; começamos na telemetria de gameplay, mockada por playthroughs. "Amanhã você pluga o jogo que quiser — Super Mario World na demo, GTA VI no futuro."
- Non-goals como slide: LLM só no WorldAdvisor; regras puras no motor; sem UI.

### Bloco B · Tour do core + demo (10')

**Objetivo**: mostrar o sistema rodando ANTES de qualquer feature gravada (o "brownfield" da aula).
**Tela**: slides da arquitetura → terminal com `npm run demo`.

- Arquitetura em uma tela: telemetria → broker MQTT → 3 consumidores (profiler, progression advisor, agente) → recomendações no console.
- A base de conhecimento: wiki OpenWiki/OKF gerada a partir de um detonado de Super Mario World; **o frontmatter é o contrato que o motor consome, a prosa é o que o agente lê, o schema é a spec da base** (frase-tese do bloco).
- Demo (tempo real): `npm run demo` — as três fitas (`casual`, `completionist`, `speedrunner`) e o momento mágico: o casual entra em **loop na Forest of Illusion** e o ProgressionAdvisor aponta a saída secreta.
- Fechar: "o sistema já recomenda. Agora vamos evoluir ele — com spec, não com chute."

### Bloco C · Feature 1: `01-event-broker` — SDD para infraestrutura (~15')

**Objetivo**: mostrar que SDD não é só para feature nova — é para evolução de arquitetura.
**Tela**: grill ao vivo → artefatos na tela → implementação acelerada → demo.

- A iniciativa (vaga de propósito): *"quero que os eventos do jogo passem por um broker de verdade, não por uma fila em memória"*.
- O grill pergunta o que importa para **infra**: qual broker e por quê (MQTT — o protocolo dos dispositivos; a TV é um dispositivo), o que acontece sem broker (testes!), o que preservar da API atual, como migrar sem quebrar os consumidores, o que fica de fora (ex.: persistência, QoS).
- Decisão que a entrevista traz à tona: a **interface `EventBus` é a seam** — `InMemoryEventBus` fica para os testes, `MqttEventBus` vai para a demo. Nenhum consumidor muda.
- Artefatos na tela: spec (com o non-goal "sem persistência"), tickets com dependências, glossário recebendo "broker", "tópico", "telemetria de gameplay".
- Implementação acelerada (TDD + code-review) → demo real: `docker compose up` + `npm run demo` com o Mosquitto logando os tópicos — "a mesma demo de antes, agora fluindo por um broker de verdade."

### Bloco D · Feature 2: `02-world-advisor-agent` — SDD para agentes (~20')

**Objetivo**: o mesmo ciclo para um comportamento não-determinístico — SDD para agentes.
**Tela**: grill ao vivo (o mais rico da aula) → artefatos → implementação acelerada → demo lado a lado.

- A iniciativa: *"quero dicas do mundo geradas por um agente LLM, não só por regras"*.
- O grill agora precisa fixar **o que um agente exige da spec**:
  - **Quando reage**: `area_entered`, `boss_engaged`, `profile_changed` — e o non-goal "não reagir a cada evento" (throttle).
  - **Contrato de saída**: schema da recomendação — mesma estrutura do `game/recommendations`, com `evidence` citando a página da wiki.
  - **Guardrails**: *"não invente segredo que não está na wiki"* — a dica sem evidência não é publicada.
  - **Fonte de conhecimento**: as ferramentas de busca/leitura da wiki (openwiki) — o agente não tem o mundo na cabeça.
  - **Evals**: os casos que provam que o agente respeita o contrato (fora do caminho crítico).
  - **Provider**: modelo via endpoint OpenAI-compatible — decisão de spec, não de código.
- Implementação acelerada (LangChain.js, TDD nos pontos determinísticos — parse, validação do contrato, throttle) → code-review → demo final:
- **A demo que fecha a aula**: o console mostra, para o MESMO evento, duas recomendações — a do ProgressionAdvisor (regras) e a do WorldAdvisor (agente, citando a wiki). *"Dois consumidores, um contrato — a spec definiu o evento, e regras e agente coexistem."*

### Bloco E · Encerramento (5')

**Objetivo**: recap, homework e convite.
**Tela**: slides.

- Recap (a versão "elevador"): a spec é o contrato que sobrevive à sessão; o que você não diz, o agente inventa; SDD serve para feature nova, arquitetura e agente; a base de conhecimento também tem spec (o schema da wiki).
- **Homework para os alunos**: `feature/03-knowledge-expansion` — a spec + tickets já estão em `.scratch/knowledge-expansion/` no repo; o desafio é expandir o mundo (Star Road / Special Zone) na wiki e rodar o ciclo completo sozinho.
- Convite: escolha a ferramenta que preferir (Spec Kit, OpenSpec, Skills) e transforme o próximo prompt vago em spec. Links no closing.

## 4. Esqueleto de slides (~24, template dio-slides)

```text
Parte 01 · a semana em que o jogo lançou
 05 capa           SDD na prática: construindo um Game Copilot
 06 gancho         GTA VI — 19/11/2026: o lançamento e o jogador que não pode pausar
 07 tendência      SOs para TV (cleanyour.tv) e copilots de jogo
 08 use case       telemetria de gameplay → broker → consumidores → recomendações
 09 non-goals      sem OCR/vision · LLM só no WorldAdvisor · eventos mockados
Parte 02 · o sistema: game-copilot
 11 arquitetura    broker no centro, três consumidores, um contrato
 12 conhecimento   OpenWiki/OKF: a wiki nasceu de um detonado (grafo visual)
 13 tese da base   frontmatter = motor · prosa = agente · schema = spec
 14 demo           3 playthroughs — casual travado na Forest of Illusion
Parte 03 · feature 01: SDD para infraestrutura
 16 iniciativa     "eventos em um broker de verdade" (vaga de propósito)
 17 grill          as perguntas que a infra exige (seam, sem broker nos testes, non-goals)
 18 artefatos      spec + tickets + glossário recebendo "broker"/"tópico"
 19 demo           Mosquitto logando tópicos · mesma demo, fluxo real
Parte 04 · feature 02: SDD para agentes
 21 iniciativa     "dicas do mundo geradas por um agente"
 22 grill          quando reage · contrato de saída · guardrails · evals · provider
 23 demo           mesmo evento, dois consumidores: regras + agente citando a wiki
Parte 05 · encerramento
 25 recap          spec é contrato · não disse = inventou · infra e agente no mesmo ciclo
 26 homework       feature/03-knowledge-expansion com spec pronta no repo
 27 referências    OpenWiki · OKF · Skills · Mosquitto · cleanyour.tv
 28 convite        transforme o próximo prompt vago em spec
```

(Numeração do template ajusta na geração com `dio-slides`; divisores por parte como na aula 1.)

## 5. Checklist pré-gravação

- [ ] `feature/00-core` mergeada e taggeada (`v0.1-core`) — demo dos 3 playthroughs estável
- [ ] `@setup-matt-pocock-skills` rodado em `hands-on/game-copilot/` (tracker local, single-context)
- [ ] Wiki OpenWiki completa e `openwiki visualize` exportado para o slide
- [ ] Spec + tickets do homework em `.scratch/knowledge-expansion/` (status `ready-for-agent`)
- [ ] Mosquitto + `npm run demo` testados na máquina de gravação
- [ ] Chave do provider LLM do agente configurada e testada
- [ ] Deck gerado com `dio-slides` e revisado contra este roteiro
