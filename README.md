# Spec-Driven Development: Pare de Escrever Prompts, Comece a Escrever Specs

> Material do curso de mesmo nome, publicado na [DIO](https://www.dio.me) — um estudo comparativo de Spec-Driven Development (SDD) executado na prática, do prompt vago ao código verificado.

## O que é este repositório

Este repositório guarda o **estudo comparativo** que sustenta a comparação feita no curso: o mesmo prompt vago, entregue a quatro condições — sem método nenhum (baseline) e a três abordagens de SDD, com os resultados analisados, medidos e gravados.

## O experimento

- **O prompt (verbatim, idêntico em todas as execuções):**

  > "Crie uma função que receba um carrinho e um código de cupom e aplique o desconto no valor total."

- **Postura do operador (uniforme):** responder apenas o que a ferramenta perguntar, aceitando a recomendação proposta — nunca oferecer regras de negócio não solicitadas.
- **O juiz:** 10 critérios de aceitação definidos antes das execuções (cupom expirado rejeitado com erro próprio, total nunca negativo, um cupom por carrinho, retorno estruturado sem exceções...). Cada implementação é confrontada com o mesmo gabarito.

## As quatro execuções

| Pasta | O que é | Perguntas antes de codar | O que fez com o que não sabia | Placar |
|---|---|---|---|---|
| [`lab/00-baseline`](lab/00-baseline/) | O prompt sem método nenhum | 1 (tecnologia) | Inventou em silêncio | 4/10 |
| [`lab/01-spec-kit`](lab/01-spec-kit/) | Spec Kit (GitHub) | 2 (mecânica) | Declarou em Assumptions | 4/10 |
| [`lab/02-openspec`](lab/02-openspec/) | OpenSpec (Fission AI) | 3 (modelagem) | Non-Goals com lista própria | 4/10 |
| [`lab/03-matt-pocock`](lab/03-matt-pocock/) | Skills do Matt Pocock | 14, em 2 rodadas | Out of Scope + glossário | 4/10 |

Cada pasta é **autocontida**: README com a análise completa (as 8 ambiguidades que o prompt esconde, como o método as tratou, a cerimônia gerada e o placar contra os critérios), os artefatos de especificação, o código gerado e a gravação da execução.

## O que o estudo mostra

- **O placar não mudou — e esse é o achado central.** Em nenhuma execução o operador forneceu as regras de negócio; nenhum método pode extrair o que não lhe disseram. O gargalo é quem especifica, não o método.
- **O que muda é a honestidade do processo.** A baseline erra em silêncio (um cupom expirado funciona para sempre; erros viram exceções genéricas). Os métodos de SDD declaram exatamente o que não fazem — em Assumptions, Non-Goals ou Out of Scope — e transformam cada resposta em requisito testável.
- **Quanto mais pergunta, menos silêncio** — e as perguntas mudam o design: foi a pergunta sobre a origem dos cupons que produziu catálogo injetado em vez de catálogo embutido no código.

## Reproduzir

1. Escolha a abordagem: [Spec Kit](https://github.com/github/spec-kit), [OpenSpec](https://openspec.dev) ou [Matt Pocock Skills](https://github.com/mattpocock/skills) — ou nenhuma, para reproduzir a baseline.
2. Copie o prompt acima **verbatim** numa sessão nova do seu agente de código.
3. Responda o que for perguntado aceitando as recomendações.
4. Confronte o resultado com o gabarito de critérios documentado no README da baseline.

**Instalação — documentação oficial de cada ferramenta:** [Spec Kit: installation](https://github.com/github/spec-kit/blob/main/docs/installation.md) · [quickstart](https://github.com/github/spec-kit/blob/main/docs/quickstart.md) — [OpenSpec: installation](https://openspec.dev/docs/installation) · [getting started](https://openspec.dev/docs/getting-started) — [Matt Pocock Skills: installation](https://github.com/mattpocock/skills#installation) — [BMAD: install](https://docs.bmad-method.org/start/install-bmad/) — [Kiro: downloads](https://kiro.dev/downloads/) · [installation](https://kiro.dev/docs/getting-started/installation/) — agente usado no curso: [OpenCode](https://opencode.ai/docs).

## Curso

A apresentação completa — o que é SDD, o panorama das ferramentas (Spec Kit, OpenSpec, BMAD, Kiro, Matt Pocock Skills) e a comparação passo a passo — está no curso de mesmo nome na [DIO](https://www.dio.me).
