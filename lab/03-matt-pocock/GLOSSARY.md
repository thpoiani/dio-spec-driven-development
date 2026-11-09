# Carrinho e Cupons

Projeto de estudo: aplicar cupons de desconto a um carrinho de compras com funções puras.

## Language

**Carrinho**:
A coleção de itens que o cliente pretende comprar. Não guarda nenhum total — todos os valores são derivados dos itens.
_Avoid_: pedido, compra

**Item**:
Uma linha do carrinho: um preço unitário com uma quantidade.
_Avoid_: produto, produto no carrinho

**Subtotal**:
A soma dos itens (preço unitário × quantidade), antes de qualquer desconto.
_Avoid_: valor total, total

**Cupom**:
Um desconto identificado por um código único; é ou percentual ou valor fixo.
_Avoid_: voucher, promoção

**Código de cupom**:
A sequência de caracteres que identifica um Cupom no catálogo. A correspondência é exata.
_Avoid_: cupom (que é o desconto em si, não o seu código)

**Catálogo**:
O conjunto de cupons conhecidos, consultado pelo código de cupom.
_Avoid_: base de dados, repositório

**Desconto**:
A redução do subtotal calculada a partir de um Cupom. Nunca gera crédito: nunca passa do Subtotal.
_Avoid_: bônus, cashback

**Total**:
O valor final depois do desconto: Subtotal − Desconto. Só existe depois que um cupom é aplicado.
_Avoid_: valor total, subtotal

**Carrinho com desconto**:
O resultado de aplicar cupom: o carrinho com o cupom aplicado, o desconto e o total registrados. Continua sendo um Carrinho (pode receber outro cupom).
_Avoid_: carrinho final, pedido

**Aplicar cupom**:
A operação que, dados um Carrinho, um código de cupom e o catálogo, devolve um novo carrinho com o desconto registrado — ou um erro de domínio.
_Avoid_: aplicar desconto, validar cupom
