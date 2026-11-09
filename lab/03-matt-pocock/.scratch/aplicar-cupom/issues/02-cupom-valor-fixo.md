# 02: Cupom de valor fixo

**What to build:** Estender a união discriminada de **Cupom** com o segundo ramo: cupom de **valor fixo**, em centavos. O comportamento ponta a ponta: aplicar um cupom de valor fixo desconta o valor exato do Subtotal; quando o valor fixo excede o Subtotal, o Desconto é limitado ao Subtotal — Total 0, sem crédito (o limite é universal e já se aplica ao novo ramo). A extensão acontece pela união, sem alterar o contrato de resultado estabelecido pelo tracer: continua devolvendo o Carrinho com desconto ou o erro "código inválido".

**Blocked by:** 01 — Tracer (precisa da união de Cupom e do contrato de resultado existentes).

**Status:** ready-for-agent

- [x] Aplicar um cupom de valor fixo desconta o valor exato do Subtotal
- [x] Valor fixo maior que o Subtotal é limitado — Total 0, nunca negativo
- [x] A união discriminada permite tratamento exaustivo dos dois tipos de cupom em TypeScript strict
- [x] Suíte verde com os novos cenários, passando exclusivamente pelo seam público
