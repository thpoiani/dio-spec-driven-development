# 03: Endurecer as bordas do domínio

**What to build:** Comprovar por testes — e corrigir, se algo não tiver emergido do tracer — as propriedades de borda do **Aplicar cupom**: carrinho vazio funciona sem caso especial (Subtotal 0 → Total 0); reaplicar outro cupom sobre um Carrinho com desconto **substitui** o desconto anterior ("o último ganha", sempre recalculado do Subtotal dos itens); a correspondência do Código de cupom é **exata** — um código com caixa diferente do cadastrado devolve "código inválido", sem normalização escondida; e a entrada **nunca é mutada** — o carrinho original permanece utilizável após a chamada. Todos os cenários cabem com cupom percentual; este ticket pode avançar em paralelo com o cupom de valor fixo.

**Blocked by:** 01 — Tracer (precisa da função e do contrato existentes).

**Status:** ready-for-agent

- [x] Carrinho vazio com cupom válido resulta Total 0, sem caso especial no código
- [x] Aplicar outro cupom sobre um Carrinho com desconto substitui o desconto (recalculado do Subtotal)
- [x] Código com caixa diferente do cadastrado devolve "código inválido"
- [x] Aplicar cupom não muta o carrinho de entrada
- [x] Suíte verde cobrindo todos os cenários de borda da spec, exclusivamente pelo seam público
