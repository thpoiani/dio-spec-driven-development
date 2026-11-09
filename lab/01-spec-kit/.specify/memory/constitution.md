<!--
SYNC IMPACT REPORT (material temporário de revisão — remover antes do commit)
Versão: scaffold não preenchido → 1.0.0 (ratificação inicial)
Princípios adicionados (substituem placeholders do template):
  [PRINCIPLE_1_NAME] → I. TypeScript Estrito
  [PRINCIPLE_2_NAME] → II. Testes com Vitest
  [PRINCIPLE_3_NAME] → III. Código Pequeno e Legível
  [PRINCIPLE_4_NAME] → IV. Funções Puras
  [PRINCIPLE_5_NAME] → V. Zero Dependências Externas
Seções adicionadas: Restrições de Tecnologia; Fluxo de Trabalho e Portões de Qualidade; Governance preenchida
Seções removidas: nenhuma
Itens adiados (TODO): nenhum
Datas: ratificação = 2026-11-06 (adoção inicial = hoje)
-->

# Constituição do Projeto de Estudo

## Core Principles

### I. TypeScript Estrito

Todo código fonte DEVE compilar com TypeScript em `strict: true` (todas as
verificações de strict mode habilitadas no `tsconfig.json`). O uso de `any`
explícito, `@ts-ignore` e asserções (`as`) que contornem a verificação de tipos
é PROIBIDO. Quando um contorno for inevitável, DEVE usar `@ts-expect-error`
acompanhado de comentário com a justificativa.

**Racional**: erros de tipo são a categoria de bug mais barata de eliminar na
origem; o strict mode transfere essa verificação para o compilador.

### II. Testes com Vitest

Vitest é o único test runner do projeto. Toda unidade de comportamento não
trivial DEVE ter testes automatizados executáveis via Vitest. Os testes DEVEM
ser determinísticos: sem I/O, sem dependência de ordem de execução e sem estado
global compartilhado. Novos runners ou frameworks de asserção adicionais são
PROIBIDOS.

**Racional**: um único runner reduz atrito, tempo de configuração e superfície
de manutenção — adequado ao escopo de um projeto de estudo.

### III. Código Pequeno e Legível

Funções e módulos DEVEM ser pequenos: uma função resolve uma tarefa. Se um
trecho exigir mais de uma leitura rápida para ser compreendido, ele DEVE ser
dividido ou renomeado. Nomes DEVEM declarar intenção, não implementação.
Complexidade adicional DEVE ser justificada em revisão; sem justificativa, é
rejeitada.

**Racional**: em um projeto de estudo, o valor principal é aprender e reler o
próprio código depois; pequeno e legível maximiza os dois.

### IV. Funções Puras

A lógica de domínio DEVE ser implementada como funções puras: mesmas entradas
produzem as mesmas saídas, sem efeitos colaterais observáveis. Efeitos (I/O,
console, relógio, aleatoriedade, estado mutável) DEVEM ficar isolados nas
bordas do programa, parametrizados de forma a permitir teste determinístico.

**Racional**: funções puras são triviais de testar com Vitest e fáceis de
compor; é o que torna os princípios II e III práticos no dia a dia.

### V. Zero Dependências Externas

O código produzido DEVE funcionar sem dependências externas de runtime:
`dependencies` no `package.json` DEVE permanecer vazio. As únicas dependências
de desenvolvimento permitidas são `typescript` e `vitest`. Qualquer nova
dependência — mesmo de dev — exige emenda desta constituição.

**Racional**: sem dependências não há atualizações de segurança para gerenciar
nem superfície de quebra de terceiros; o foco permanece no aprendizado da
linguagem.

## Restrições de Tecnologia

- Linguagem: TypeScript com `strict: true` (Princípio I), executado em Node.js.
- Testes: Vitest como único runner e framework de asserção (Princípio II).
- Dependências de runtime: PROIBIDAS; `dependencies` em `package.json` vazio
  (Princípio V).
- Dependências de dev permitidas: apenas `typescript` e `vitest`.
- Build: `tsc` apenas; sem bundlers, transpilers ou ferramentas extras.

## Fluxo de Trabalho e Portões de Qualidade

Toda mudança de código, antes de ser considerada completa, DEVE passar pelos
seguintes portões:

1. Verificação de tipos: `tsc --noEmit` sem erros, com strict mode ativo.
2. Testes: `vitest run` verde (todos os testes passam).
3. Dependências: zero mudanças em `dependencies`; novas devDependencies só via
   emenda constitucional.
4. Revisão de estilo: funções pequenas, nomes claros e lógica pura
   (Princípios III e IV).

Violações devem ser corrigidas antes do merge ou registradas como exceção
documentada na seção Governance.

## Governance

- Esta constituição supera qualquer outra prática, preferência ou convenção
  não documentada do projeto; em conflito, ela prevalece.
- Emendas: qualquer alteração DEVE ser proposta descrevendo a mudança, o
  racional e o impacto nos artefatos existentes, e só entra em vigor após
  revisão e atualização do número de versão.
- Versionamento: MAJOR para remoção ou redefinição incompatível de princípios;
  MINOR para novos princípios, seções ou expansão material de orientação;
  PATCH para esclarecimentos e correções sem impacto semântico.
- Conformidade: toda revisão de código DEVE verificar aderência aos cinco
  princípios e aos portões de qualidade; complexidade sem justificativa é
  rejeitada.
- Orientação de runtime para desenvolvimento (como configurar e executar o
  projeto) fica nos documentos do projeto; esta constituição é a fonte de
  verdade das regras.

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
