# Outline · Spec-Driven Development: Pare de Escrever Prompts, Comece a Escrever Specs

> Rascunho para aprovação. **Não gere o `index.html` antes do ok.**
> Uma linha por slide. O título aqui é o título que vai para o slide.

## Metadados

Estes valores vão direto para o bloco `DECK` do template.

| Campo | Valor |
|---|---|
| `title` | Spec-Driven Development: pare de escrever prompts, comece a escrever specs |
| `subtitle` | Do prompt vago ao contrato que agentes de IA executam com zero ambiguidade |
| `event` | Spec-Driven Development (título do curso — o cabeçalho mostra título + data) |
| `date` | novembro de 2026 |
| `instructor.name` | Thiago Poiani |
| `instructor.role` | Principal Software Engineer, Skip |
| `theme` | dark |
| Duração | ~50 minutos |
| `links` | github.com/github/spec-kit · openspec.dev · github.com/mattpocock/skills · opencode.ai |

## Roteiro

```text
00:00  Parte 01 · o prompt vago e o que ele revela    (slides 05–07 · 5 min)
00:05  Parte 02 · o que é SDD                         (slides 09–13 · 15 min)
00:20  Parte 03 · frameworks e agentes                (slides 15–17 · 15 min)
00:35  Parte 04 · a mesma spec, resultados diferentes (slides 19–26 · 10 min)
00:45  Parte 05 · encerramento                        (slides 28–30 · 5 min)
```

> Ancorado nos marcadores visíveis: o contador do rodapé (`NN / 30`) e os números das Partes nos divisores (slides 04, 08, 14, 18 e 27).

Mapeamento para gravação (pelo contador do rodapé): Parte 01 = 05–07 · Parte 02 = 09–13 · Parte 03 = 15–17 · Parte 04 = 19–26 · Parte 05 = 28–30.

## Slides

### 01 · capa
**Título:** Spec-Driven Development: pare de escrever prompts, comece a escrever specs
**Mensagem:** do prompt vago ao contrato que agentes de IA executam com zero ambiguidade
**Nota:** abra com a promessa do curso em uma frase — a navegação por número serve de roteiro de gravação

### 02 · bio
**Título:** Thiago Poiani
**Mensagem:** Principal Software Engineer @ Skip · @thpoiani no LinkedIn e redes — foto via github.com/thpoiani.png (link externo)
**Nota:** duas linhas bastam; o estudo público no repositório fala por si

### 03 · agenda
**Título:** O que vamos discutir
**Mensagem:** os cinco blocos do roteiro: o prompt vago e o que ele revela · o que é SDD (três níveis) · frameworks e agentes · a mesma spec, resultados diferentes · encerramento e onde continuar
**Nota:** marque o tempo de cada bloco

### 04 · divisor
**Título:** O prompt que todo dev já vibecodou
**Mensagem:** parte 01 — o que ele gera sem spec, e o que muda quando a spec existe (sem subtítulo no slide)
**Nota:** vamos começar pelo fracasso

### 05 · citacao
**Título:** Crie uma função que receba um carrinho e um código de cupom e aplique o desconto no valor total.
**Mensagem:** — acompanhado dos constraints do estudo: "Projeto de estudo: TypeScript em strict mode, Vitest como test runner, código pequeno e legível, funções puras, sem dependências externas"
**Nota:** deixe a plateia ler o prompt inteiro — a parte vaga é idêntica nas quatro execuções; os constraints entraram na forma de cada método

### 06 · figura (vídeo)
**Título:** A execução: o prompt vago, sem método
**Mensagem:** gravação da sessão real (`../lab/00-baseline/record.mp4`) com a estrutura do lab ao lado — repare: zero perguntas de negócio · inventados: carrinho e catálogo sem confirmação, exceções genéricas, "expirado" que nunca expira · apenas uma pergunta sobre stack
**Nota:** dê o play e narre por cima; pause antes de avançar — "pair programmers literalistas" (GitHub Blog)

### 07 · tabela
**Título:** Um prompt tão vago esconde expectativas
**Mensagem:** tabela expectativa × resultado na baseline — 4 ✓, 5 ✗, 1 ⚠; essas expectativas viram os critérios de aceitação para julgar os métodos
**Nota:** o gabarito completo com valores está no README da baseline — e volta na parte 04 como juiz dos três métodos

### 08 · divisor
**Título:** Spec primeiro, código depois
**Mensagem:** parte 02 — o que é SDD: a definição, o ciclo e os três níveis
**Nota:** abre o bloco da definição

### 09 · duas-colunas
**Título:** Spec é contrato, não documento
**Mensagem:** "um contrato de como o código deve se comportar e a fonte da verdade que ferramentas e agentes usam para gerar, testar e validar código" (GitHub Blog); cards: o que entra numa spec — requisitos e critérios de aceitação · constraints e edge cases · a linguagem do domínio (Microsoft)
**Nota:** enfatize "fonte da verdade": quando código e spec divergem, a spec vence

### 10 · codigo
**Título:** O que uma spec diz que um prompt não diz
**Mensagem:** trecho real do spec.md do experimento (Spec Kit): requisito + cenário de aceitação, sem ambiguidade
**Nota:** leia o trecho em voz alta — é pequeno e vale a leitura

### 11 · diagrama
**Título:** O ciclo que substitui o chute
**Mensagem:** prompt vago → perguntas → spec estruturada → plano/tarefas → código → verificação — e de volta à spec quando algo muda
**Nota:** o ciclo se repete por mudança, não por projeto

### 12 · duas-colunas
**Título:** SDD não é uma coisa só: três níveis
**Mensagem:** spec-first (a spec nasce antes do código) → spec-anchored (a spec sobrevive à feature) → spec-as-source (só a spec é editada) — Fowler/Böckeler
**Nota:** na parte 04 classificamos os métodos por esses níveis

### 13 · citacao
**Título:** IA acelera cada etapa — mas não corrige a ambiguidade que nunca foi resolvida
**Mensagem:** — Microsoft Dev Blog · a tese falada por cima: "Spec quality = output quality"
**Nota:** citação é o slide inteiro; a frase-tese vai falada, não escrita

### 14 · divisor
**Título:** Quem manda no processo — e quem executa
**Mensagem:** parte 03 — cinco ferramentas, um agente, um mercado que já aderiu
**Nota:** framework ≠ agente

### 15 · duas-colunas
**Título:** Framework define processo; Agent executa
**Mensagem:** o curso roda com OpenCode (open source, agnóstico de modelo, integração nativa com as cinco ferramentas)
**Nota:** o aluno pode usar qualquer agente — a spec não depende disso

### 16 · figura
**Título:** Ecossistema maduro
**Mensagem:** 5 cards com logos + onde cada método decide a stack + estrelas do GitHub (★ 149k spec-kit · ★ 74k openspec · ★ 55k bmad · ★ 319k skills · ★ 4,5k kiro) + selo "→ VAMOS RODAR NA PARTE 04" nos três escolhidos; Kiro isolado como AGENT (spec nativa no IDE)
**Nota:** não existe a melhor ferramenta — existe a cerimônia certa para o tamanho do problema

### 17 · terminal
**Título:** Instalação de GitHub Spec Kit, OpenSpec e Matt Pocock's Skills
**Mensagem:** 4 linhas: uv + specify init · npm + openspec init · npx skills add · opencode + @setup-matt-pocock-skills (uma vez por repo)
**Nota:** no curso já estão instaladas; o aluno pode pausar e acompanhar

### 18 · divisor
**Título:** A mesma spec, resultados diferentes
**Mensagem:** parte 04 — o mesmo prompt, quatro execuções, um juiz
**Nota:** a comparação é o coração do curso

### 19 · terminal + bullets
**Título:** O protocolo do experimento
**Mensagem:** à esquerda, o insumo em estilo terminal: prompt verbatim + agent (OpenCode v2.2.5) e modelo (GLM-5.3-Flash); à direita, as regras: prompt idêntico · operador apenas aceita recomendações · critérios previamente definidos · execuções preservadas
**Nota:** a postura do operador é o que torna a comparação justa

### 20 · figura (vídeo)
**Título:** GitHub Spec Kit
**Mensagem:** gravação (`../lab/01-spec-kit/record.mp4`) com a árvore do dossiê ao lado — repare: o clarify pergunta; a stack só entra no plan
**Nota:** pause nos artefatos gerados; a constituição reaparece dentro do plan

### 21 · figura (vídeo)
**Título:** OpenSpec
**Mensagem:** gravação (`../lab/02-openspec/record.mp4`) com a árvore do openspec/ ao lado — repare no final: o archive funde a spec em openspec/specs/
**Nota:** o sync/archive é o momento que diferencia o método

### 22 · figura (vídeo)
**Título:** Matt Pocock's Skills
**Mensagem:** gravação (`../lab/03-matt-pocock/record.mp4`) com a árvore do tracker ao lado — repare: 14 perguntas antes da primeira linha de código
**Nota:** o operador só aceita recomendações — e ainda assim a entrevista decide tudo

### 23 · numeros
**Título:** Perguntas podem melhorar o Spec
**Mensagem:** 1 pergunta na baseline (só a linguagem) · 2+3 no Spec Kit e OpenSpec (mecânica e modelagem) · 14 no grilling, em rodadas
**Nota:** fonte: READMEs dos labs — a pergunta do OpenSpec sobre a origem dos cupons virou decisão de arquitetura: catálogo injetado

### 24 · bullets
**Título:** A ausência de regras não tem o mesmo peso
**Mensagem:** baseline: invenção silênciosa · Spec Kit: Assumptions · OpenSpec: Non-Goals · skills: Out of Scope + glossário — classificados pelos três níveis
**Nota:** OpenSpec é o único spec-anchored de fato: a spec sobrevive em openspec/specs/

### 25 · tabela
**Título:** Os três métodos, critério a critério
**Mensagem:** matriz das 10 expectativas × 3 métodos — 4 ✓ em todos (as diferenças moram nos detalhes: o nome do erro estruturado na linha 04 e a decisão explícita "substitui" na linha 09); 4/10 nas três colunas
**Nota:** o gabarito vem do slide 07; o gargalo é quem especifica, não o método

### 26 · grade de cards
**Título:** O que muda quando existe spec
**Mensagem:** grade de 7 cards: ✗ só o prompt (inventa, erra em silêncio, não deixa nada) + 5 ✓ (menos retrabalho · alinhamento total · entrega previsível · menos surpresas · validação de graça) + card final em largura total: o artefato sobrevive à sessão (outra sessão, outro agente ou operador continuam do contrato)
**Nota:** destilado do Microsoft Dev Blog e GitHub Blog + o achado do estudo: o processo nunca erra em silêncio; caso real: onboarding brownfield caiu de 2–3 semanas para dias

### 27 · divisor
**Título:** Leve o estudo para o seu próximo prompt
**Mensagem:** parte 05 — recap, fontes e o convite
**Nota:** abre o encerramento

### 28 · recap
**Título:** Recapitulando
**Mensagem:** spec é contrato e fonte da verdade · o que você não diz, o Agent inventa (a importância de harness: coding standards, constraints e guardrails) · a spec orienta gerar, testar e validar · quanto melhor a qualidade do Spec, mais eficiente o processo
**Nota:** a versão que a pessoa repete no elevador

### 29 · referencias
**Título:** As fontes do curso
**Mensagem:** GitHub Blog (spec-driven development) · Microsoft Dev Blog (spec-first, AI-native) · Martin Fowler/Böckeler (SDD: três ferramentas) · sddobservatory.com
**Nota:** deixa no ar no encerramento

### 30 · encerramento
**Título:** Comece pela próxima spec
**Mensagem:** convite: escolha uma ferramenta no sddobservatory e transforme o próximo prompt vago em spec — links das ferramentas no closing (DECK.links)
**Nota:** convite concreto; nunca terminar com "era isso, obrigado"

---

## Antes de mandar para aprovação

- [x] Todo título é uma afirmação, com no máximo ~60 caracteres (exceções: capa, o prompt-hero e citações).
- [x] Nenhum slide tem duas ideias.
- [x] Nenhum layout aparece duas vezes seguidas (os três de vídeo nunca são adjacentes).
- [x] Existe um divisor a cada bloco (5 no total — um por parte).
- [x] Tem agenda, recap e encerramento com convite (exercício dispensado: conteúdo gravado, a prática vive nos repositórios do estudo).
- [x] O tempo do roteiro fecha com a duração da aula (50 min).
- [x] Vídeos: 4 slides `figura` com `<video controls src="../lab/*/record.mp4">` — uma única cópia dos vídeos no git; os dos métodos com a árvore do lab ao lado.
- [x] O prompt verbatim tem slide próprio (05) e volta no protocolo (19).
- [x] Imagens (avatar e logos) carregadas por link externo — nenhuma no git.
