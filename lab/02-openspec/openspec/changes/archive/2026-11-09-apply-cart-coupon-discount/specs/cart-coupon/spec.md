# Spec Delta

## Purpose

Aplicação de cupons de desconto ao cálculo do total de um carrinho de compras: cálculo de subtotal, desconto e total de forma pura e determinística, com dinheiro representado em centavos e erro de cupom desconhecido reportado no tipo de retorno.

## ADDED Requirements

### Requirement: Subtotal derivado do carrinho
O sistema SHALL calcular o subtotal de um carrinho a partir dos seus itens (preço unitário em centavos multiplicado pela quantidade, somado sobre todos os itens). O subtotal SHALL ser sempre um valor derivado, jamais armazenado no carrinho.

#### Scenario: Carrinho com múltiplos itens
- **WHEN** o carrinho contém um item de R$ 10,00 (1000 centavos) com quantidade 2 e outro de R$ 5,50 (550 centavos) com quantidade 1
- **THEN** o subtotal é 2550 centavos (R$ 25,50)

#### Scenario: Carrinho vazio
- **WHEN** o carrinho não contém itens
- **THEN** o subtotal é 0

### Requirement: Desconto percentual
O sistema SHALL aplicar um cupom do tipo percentual calculando o desconto como uma porcentagem do subtotal.

#### Scenario: Desconto de 10% sobre subtotal
- **WHEN** o subtotal é 9990 centavos (R$ 99,90) e o cupom é de 10%
- **THEN** o desconto é 999 centavos (R$ 9,99) e o total é 8991 centavos (R$ 89,91)

#### Scenario: Arredondamento de resultado fracionário
- **WHEN** o cálculo do desconto percentual resulta em um valor com centavos fracionários
- **THEN** o resultado é arredondado para o centavo mais próximo, uma única vez, no final do cálculo

#### Scenario: Percentual zero
- **WHEN** o cupom é de 0%
- **THEN** o desconto é 0 e o total é igual ao subtotal

### Requirement: Desconto de valor fixo
O sistema SHALL aplicar um cupom do tipo valor fixo subtraindo o valor do cupom (em centavos) do subtotal.

#### Scenario: Valor fixo menor que o subtotal
- **WHEN** o subtotal é 3000 centavos e o cupom é de 1500 centavos
- **THEN** o desconto é 1500 centavos e o total é 1500 centavos

### Requirement: Total nunca negativo
O sistema SHALL limitar o total a zero quando o desconto exceder o subtotal.

#### Scenario: Desconto maior que o subtotal
- **WHEN** o subtotal é 3000 centavos e o cupom fixo é de 5000 centavos
- **THEN** o desconto é 5000 centavos e o total é 0

#### Scenario: Desconto percentual com clamp
- **WHEN** o desconto percentual calculado excede o subtotal
- **THEN** o total é 0

### Requirement: Cupom desconhecido reportado no resultado
O sistema SHALL reportar a busca por um código de cupom inexistente como um erro no tipo de resultado (discriminated union), sem lançar exceção nem retornar nulo.

#### Scenario: Código não cadastrado
- **WHEN** o código informado não corresponde a nenhum cupom conhecido
- **THEN** o resultado é um erro do tipo cupom desconhecido e não há total

#### Scenario: Código cadastrado
- **WHEN** o código informado corresponde a um cupom conhecido
- **THEN** o resultado é ok e contém o total com desconto aplicado

### Requirement: Entradas imutáveis
O sistema SHALL produzir novos valores a partir das funções de cálculo sem alterar o carrinho ou o cupom recebidos.

#### Scenario: Carrinho não é mutado
- **WHEN** qualquer função de cálculo é executada sobre um carrinho e um cupom
- **THEN** o carrinho e o cupom de entrada permanecem com os mesmos valores depois da chamada

### Requirement: Tipos de cupom suportados
O sistema SHALL suportar exatamente dois tipos de cupom: desconto percentual (porcentagem aplicada ao subtotal) e desconto de valor fixo (valor absoluto em centavos).

#### Scenario: Cupom percentual
- **WHEN** um cupom do tipo percentual é informado
- **THEN** o desconto é proporcional ao subtotal

#### Scenario: Cupom de valor fixo
- **WHEN** um cupom do tipo valor fixo é informado
- **THEN** o desconto é o valor absoluto do cupom, independente do subtotal

### Requirement: Dinheiro em centavos integrais
O sistema SHALL representar todos os valores monetários (preços, valor de cupom, subtotal, desconto e total) como números inteiros de centavos.

#### Scenario: Valores integrais em centavos
- **WHEN** o carrinho contém um item de R$ 19,87 com quantidade 3
- **THEN** o subtotal é calculado sobre 1987 centavos e resulta em 5961 centavos
