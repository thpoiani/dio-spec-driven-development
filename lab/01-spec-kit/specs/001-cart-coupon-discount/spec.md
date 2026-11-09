# Feature Specification: Desconto de Cupom no Carrinho

**Feature Branch**: `001-cart-coupon-discount`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "crie uma funcao que receba um carrinho e um codigo de cupom e aplique o desconto no valor total"

## Clarifications

### Session 2026-11-06

- Q: Quando o carrinho traz a lista de itens além do valor total, qual valor
  deve ser usado como base do desconto? → A: Option A — o total fornecido no
  carrinho é a base do desconto; a lista de itens é apenas informativa e
  nunca é recalculada.
- Q: Além do novo total, o resultado deve informar também o valor do desconto
  aplicado? → A: Option A — o resultado contém apenas o novo total (mais a
  indicação de sucesso/rejeição); o valor economizado é derivável pelo
  consumidor (total fornecido − novo total).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Aplicar cupom percentual (Priority: P1)

Quem consome a operação fornece um carrinho com um valor total conhecido e um
código de cupom percentual válido (ex.: `PROMO10`, que reduz 10% do total). O
resultado é o novo valor total já reduzido pelo percentual do cupom.

**Why this priority**: é o caso de uso central do pedido — aplicar um desconto
real no total do carrinho. Sem ele, a funcionalidade não existe.

**Independent Test**: Pode ser testada fornecendo um carrinho com total
conhecido e um cupom percentual válido, verificando o total retornado. Entrega
valor sozinha: descontos percentuais funcionam de ponta a ponta.

**Acceptance Scenarios**:

1. **Given** um carrinho com total de 200,00, **When** o cupom `PROMO10`
   (10% de desconto) é aplicado, **Then** o total resultante é 180,00.
2. **Given** um carrinho com total de 99,90, **When** o cupom `PROMO10` é
   aplicado, **Then** o total resultante é 89,91 (10% de 99,90 = 9,99 de
   desconto, com arredondamento para duas casas decimais).

---

### User Story 2 - Aplicar cupom de valor fixo (Priority: P2)

Quem consome a operação fornece um carrinho e um código de cupom de valor fixo
(ex.: `MENOS15`, que subtrai 15,00 do total). O resultado é o total reduzido
pelo valor fixo do cupom.

**Why this priority**: segunda forma de desconto mais comum no comércio;
complementa o percentual e amplia o valor da funcionalidade, mas o caso
percentual (P1) já entrega o núcleo sozinho.

**Independent Test**: Pode ser testada fornecendo um carrinho com total
conhecido e um cupom de valor fixo válido, verificando o total retornado.

**Acceptance Scenarios**:

1. **Given** um carrinho com total de 100,00, **When** o cupom `MENOS15`
   (desconto fixo de 15,00) é aplicado, **Then** o total resultante é 85,00.
2. **Given** um carrinho com total de 12,00, **When** o cupom `MENOS15` é
   aplicado, **Then** o total resultante é 0,00 (o desconto nunca torna o
   total negativo).

---

### User Story 3 - Rejeitar cupom inválido (Priority: P3)

Quem consome a operação fornece um código que não corresponde a nenhum cupom
conhecido (ex.: `INEXISTENTE`). Nenhum desconto é aplicado e a rejeição é
informada de forma inequívoca — o total permanece o mesmo e o chamador sabe
que a operação não teve sucesso.

**Why this priority**: protege a confiança na operação (evita falha silenciosa
que engana o chamador), mas o produto já é útil sem esse tratamento
formalizado.

**Independent Test**: Pode ser testada fornecendo um código desconhecido e
verificando que o total não muda e que a rejeição é sinalizada de forma
distinta de um sucesso.

**Acceptance Scenarios**:

1. **Given** um carrinho com total de 100,00, **When** o código `INEXISTENTE`
   é aplicado, **Then** nenhum desconto é aplicado, o total permanece 100,00
   e a rejeição é sinalizada de forma inequívoca.
2. **Given** um carrinho com total de 100,00, **When** um código válido é
   escrito com grafia diferente da registrada (ex.: `promo10` em vez de
   `PROMO10`), **Then** o código é tratado como desconhecido e rejeitado.

---

### Edge Cases

- O que acontece quando o desconto fixo excede o total do carrinho? O total
  resultante é limitado a 0,00 — nunca é negativo (ver FR-005).
- O que acontece quando o total do carrinho é zero (carrinho vazio)? O
  resultado é 0,00, independentemente do cupom válido aplicado.
- O que acontece quando o mesmo cupom é aplicado novamente sobre um total já
  descontado? Cada aplicação é independente: o desconto é recalculado sobre o
  total fornecido, sem controle de uso único (ver Assumptions).
- O que acontece quando o código contém espaços extras nas bordas? O código é
  comparado de forma exata; a operação não normaliza a entrada (ver
  Assumptions).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A operação MUST aceitar um carrinho e um código de cupom e
  produzir o valor total do carrinho com o desconto do cupom aplicado,
  tomando como base o total fornecido no carrinho.
- **FR-002**: A operação MUST suportar descontos percentuais, calculados sobre
  o total do carrinho fornecido.
- **FR-003**: A operação MUST suportar descontos de valor fixo, subtraídos do
  total do carrinho fornecido.
- **FR-004**: A operação MUST rejeitar de forma inequívoca códigos que não
  correspondem a um cupom conhecido, sem aplicar desconto algum.
- **FR-005**: O total resultante MUST nunca ser negativo; descontos que
  excedam o total MUST limitá-lo a 0,00.
- **FR-006**: O carrinho fornecido MUST permanecer inalterado após a operação.
- **FR-007**: A operação MUST ser determinística: para as mesmas entradas
  (carrinho e código), o resultado é sempre o mesmo.
- **FR-008**: Valores monetários MUST ser calculados com precisão de duas
  casas decimais, com arredondamento comercial (half-up) aplicado ao desconto
  percentual.

### Key Entities *(include if feature involves data)*

- **Carrinho**: representa uma compra em andamento; atributo central e
  autoritativo é o valor total fornecido (dois decimais), base do desconto;
  a lista de itens, quando presente, é apenas informativa e nunca é
  recalculada.
- **Cupom**: representa um desconto disponível; atributos: código
  (identificador único, comparação exata), tipo (percentual ou valor fixo) e
  magnitude do desconto. Os cupons conhecidos fazem parte do domínio
  (catálogo fixo — ver Assumptions).
- **Resultado da aplicação**: exclusivamente o novo valor total do carrinho e
  a indicação inequívoca de sucesso ou rejeição do cupom; o valor do desconto
  não é retornado — é derivável pelo consumidor (total fornecido − novo
  total).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos cenários de aceitação (percentual, valor fixo e
  rejeição) produzem o total exato esperado.
- **SC-002**: Zero ocorrências de total negativo em qualquer cenário testado,
  incluindo descontos que excedem o total.
- **SC-003**: 100% dos códigos desconhecidos ou grafados de forma diferente
  resultam em rejeição inequívoca, sem alteração do total.
- **SC-004**: O carrinho de entrada permanece inalterado em 100% das
  execuções.
- **SC-005**: Cada aplicação de desconto é percebida como instantânea por
  quem consome a operação (menos de 1 segundo).

## Assumptions

- **Catálogo fixo de cupons**: a operação recebe apenas o carrinho e o código;
  os cupons válidos fazem parte do domínio como um catálogo fixo e
  pré-definido (ex.: `PROMO10` = 10% de desconto; `MENOS15` = 15,00 de
  desconto). Não há cadastro dinâmico de cupons nesta versão.
- **Precisão monetária**: dois decimais, arredondamento comercial (half-up)
  aplicado ao resultado do desconto percentual.
- **Comparação exata de código**: sem ignorar maiúsculas/minúsculas e sem
  normalização de espaços (apenas a grafia exata registrada é aceita).
- **Sem regras comerciais adicionais**: expiração de cupom, valor mínimo de
  compra, limite de uso, cupons de uso único e acumulação de cupons estão
  fora do escopo desta versão.
- **Moeda única e implícita**: os valores não carregam moeda nem requerem
  conversão cambial.
- **Conformidade com a constituição**: os requisitos FR-006 (entrada
  inalterada) e FR-007 (determinismo) refletem os princípios de pureza e
  previsibilidade definidos na constituição do projeto.
