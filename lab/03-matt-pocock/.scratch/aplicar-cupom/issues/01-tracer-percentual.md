# 01: Tracer — scaffold + Aplicar cupom percentual com resultado explícito

**What to build:** O caminho vertical completo do estudo, do zero: projeto TypeScript strict com vitest (zero dependências de runtime) e a função **Aplicar cupom** ponta a ponta para cupom **percentual**. O Carrinho contém apenas itens — o Subtotal é derivado deles (única fonte de verdade). O Desconto percentual é arredondado para o centavo mais próximo e sempre limitado ao Subtotal (vale até acima de 100%): o Total nunca fica negativo, nunca gera crédito. O resultado é explícito — ou o Carrinho com desconto (Cupom, Desconto e Total registrados, entrada intacta) ou o erro de domínio "código inválido", quando o Código de cupom não existe no Catálogo. Sem exceções. Segue a spec da feature: `.scratch/aplicar-cupom/spec.md`.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] Projeto compila em TypeScript strict e a suíte roda com vitest, sem dependências de runtime
- [x] Aplicar um cupom percentual a um carrinho devolve o Carrinho com desconto, com Subtotal, Desconto e Total corretos
- [x] Desconto percentual é arredondado para o centavo mais próximo (ex.: 10% de 1999 centavos → 200)
- [x] Percentual acima de 100% é limitado ao Subtotal — Total 0, nunca negativo
- [x] Código de cupom ausente no Catálogo devolve o erro de domínio "código inválido" via resultado explícito, sem lançar exceção
- [x] Módulo único e legível, usando o vocabulário do glossário
