# Spec: Base de conhecimento do mundo (Super Mario World → OpenWiki/OKF)

Status: ready-for-human

Etapa 01 do hands-on (`feature/01-knowledge-base`). Execução manual (Thiago) com apoio do agente — por isso `ready-for-human`: o setup da ferramenta e as decisões de curadoria são suas; a conversão e validação de páginas têm tickets com apoio do agente.

## Problem Statement

O Game Copilot recomenda a partir do conhecimento do mundo do jogo — e esse conhecimento ainda não existe em forma consumível. Um detonado é prosa linear para humanos: não dá para perguntar "o que desbloqueia a saída da Forest of Illusion?" ou "qual power-up levar para este castelo?" sem um humano relendo tudo. Sem uma base estruturada, o motor de regras não tem grafo de pré-requisitos para consultar, o agente não tem fonte para citar, e qualquer recomendação fica não verificável. Pior: sem provenance, não há como saber se uma dica veio do jogo ou foi inventada.

## Solution

Uma wiki versionada no repositório, no formato **OKF v0.2** (Open Knowledge Format), construída com o **OpenWiki** a partir de um detonado de Super Mario World: cada página tem **frontmatter estruturado** (o que o `knowledge-loader` consome para montar o índice do motor de regras) e **prosa com evidência da fonte** (o que o agente WorldAdvisor lê e cita). O schema da wiki — tipos de página e campos obrigatórios — **é a spec da base**: o loader e o agente só conhecem a wiki por ele. Setup da ferramenta manual (Thiago), ingestão e curadoria com apoio do agente, validação canônica do gating contra a Super Mario Wiki.

## User Stories

1. Como professora da aula, quero rodar o setup do OpenWiki manualmente no projeto, para que a base de conhecimento nasça com a mesma ferramenta que a aula apresenta.
2. Como professora, quero escolher o detonado fonte e registrar a escolha, para que a provenance da base seja explícita desde a primeira página.
3. Como agente curador, quero converter cada trecho do detonado em páginas OKF com frontmatter completo, para que o conteúdo humano vire dado estruturado sem perda de evidência.
4. Como `knowledge-loader`, quero que toda página declare `type`, `id`, `name` e os campos do seu tipo, para que o índice em memória seja montado sem ambiguidade (e páginas inválidas falhem rápido).
5. Como `ProgressionAdvisor`, quero que cada nível declare `exits` (normal/secret/keyhole) e `prerequisites`, para que o gating — como a Forest of Illusion, cuja saída normal não progride — seja detectável por regras.
6. Como `PlayerProfiler`, quero que power-ups e segredos sejam páginas com identidade própria, para que os sinais de perfil (coleta, exploração) tenham o que contar.
7. Como `WorldAdvisor`, quero prosa em cada página com a evidência do detonado, para que minhas recomendações citam fonte e nunca inventam segredo.
8. Como professora, quero cobertura mínima garantida por checklist (6 áreas, caminho principal, segredos de gating, 2 Switch Palaces, power-ups, bosses), para que a demo mostre comportamento diferente por perfil sem a etapa virar projeto.
9. Como mantenedora da base, quero validar o gating contra a Super Mario Wiki (canônica), para que o mundo não dependa de um único detonado.
10. Como professora, quero o grafo da wiki renderizado (`openwiki visualize`), para que a aula mostre visualmente como a base se organiza.
11. Como estudante, quero páginas em português com identificadores canônicos em inglês, para que eu leia a base no idioma da aula e veja o código consumindo-a sem tradução.
12. Como mantenedora do homework (`feature/10-knowledge-expansion`), quero que a Special Zone fique fora desta etapa, para que a expansão do mundo seja o exercício dos alunos com a estrutura já estável.
13. Como revisora da base, quero que nenhuma página fique órfã no grafo (exceto a fronteira do homework), para que o índice não tenha conhecimento inacessível.
14. Como agente, quero que o schema declare os campos obrigatórios **por tipo de página**, para que um `level` sem `exits` seja um erro de schema, não uma surpresa em runtime.
15. Como professora, quero que a provenance (detonado + Super Mario Wiki) fique registrada em cada página, para que o modelo "human curates, LLM maintains" do OpenWiki tenha dono claro.

## Implementation Decisions

- **Fonte primária**: detonado **PC do Paulo** (PT-BR, texto completo — saídas secretas, Switch Palaces e Star World detalhados). **Validação canônica**: **Super Mario Wiki** (páginas *Secret exit* e de níveis — as 24 secret exits e o gating exato).
- **Formato**: OKF v0.2 — markdown + frontmatter YAML. **Prosa em português; identificadores canônicos em inglês kebab-case** (`forest-of-illusion-4`, `cape-feather`).
- Tipos de página e campos obrigatórios:
  - `area`: `type`, `id`, `name`, `order` (posição no caminho), `unlocks` (o que o boss da área libera).
  - `level`: `type`, `id`, `name`, `area`, `kind` (`main` | `side`), `exits` (lista de `{ kind: normal | secret | keyhole, goes-to, requirement? }`), `prerequisites`, `rewards`, `boss` (boolean).
  - `switch-palace`: `type`, `id`, `name`, `unlocks` (blocos "!"/caminhos).
  - `power-up`: `type`, `id`, `name`, `effect`, `recommended-for` (contextos, ex.: castelos → Cape Feather).
  - `boss`: `type`, `id`, `name`, `castle`, `defeated-unlocks`.
- Toda página carrega **provenance** (`sources`: detonado e/ou Super Mario Wiki) — o rastreamento do OpenWiki fica versionado junto.
- Cobertura mínima: **6 áreas** (Yoshi's Island, Donut Plains, Forest of Illusion, Chocolate Island, Valley of Bowser, Star Road) · níveis do **caminho principal** + os **secret exits de gating** (incl. Forest of Illusion 4 → Forest Secret Area, Donut Secret House → Star World 1, Valley Ghost House → Larry's Castle) · **2 Switch Palaces** (Green, Forest) · **3 power-ups** (Cape Feather, Fire Flower, Yoshi) · **bosses** (Iggy, Ludwig, Roy, Wendy, Larry).
- **Setup do OpenWiki é manual** (Thiago roda e configura): o caminho de ingestão (personal mode com connector de repositório local, ou curadoria direta com OpenCode sobre o template OKF) é decisão do setup — o entregável é o formato e a provenance, não a ferramenta em si.
- O schema (tipos + campos obrigatórios) vive com a wiki e **é a spec da base**: mudança de campo implica revisão do `knowledge-loader` (etapa 03).

## Testing Decisions

- **Bom teste aqui = verificação de conteúdo**: checklist de cobertura (§ Implementation Decisions) ticked página a página; validação cruzada do gating contra a Super Mario Wiki (a saída normal da Forest of Illusion 4 **não progride**; `Donut Secret House → Star World 1`; `Valley Ghost House → Larry's Castle`).
- **Critério estrutural**: 100% das páginas com os campos obrigatórios do seu tipo — a leitura de prova é o futuro `knowledge-loader` (fail fast); nesta etapa a validação é manual/script de apoio.
- **Grafo**: `openwiki visualize` sem páginas órfãs (exceto a fronteira do homework — Special Zone).
- **Prior art**: nenhum — esta é a primeira base do projeto; o padrão de página fundado aqui vale para o homework.

## Out of Scope

- **Special Zone** completa (é o homework `feature/10-knowledge-expansion`).
- Enriquecimento além do necessário para a demo (mapas, imagens, história, segredos sem papel no gating/perfil).
- Automação do pipeline de ingestão (detonado → wiki é manual/assistido, não CI).
- Qualquer código TypeScript — a etapa entrega **conteúdo + schema**; o loader é a etapa 03.

## Further Notes

- O **momento da demo** mora nesta base: o jogador casual entra em loop na Forest of Illusion porque a saída normal não progride — é o frontmatter (`exits` + `prerequisites`) que torna isso detectável por regra.
- Provenance dupla (detonado PT-BR + wiki canônica EN) é o exemplo do curso de "fonte da verdade com evidência": dica sem página que a sustente não é publicada.
