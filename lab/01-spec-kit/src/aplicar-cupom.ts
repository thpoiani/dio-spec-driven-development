import type { Carrinho } from "./carrinho";
import { CATALOGO_CUPONS, type Cupom } from "./cupom";

/**
 * Resultado da aplicação de um cupom: apenas o novo total em caso de
 * sucesso (o valor do desconto é derivável), ou rejeição inequívoca.
 */
export type ResultadoAplicacao =
  | { ok: true; novoTotalCents: number }
  | { ok: false; motivo: "codigo-desconhecido" };

/**
 * Aplica ao carrinho o desconto do cupom informado. Função pura: nunca
 * muta a entrada, sem I/O — mesmas entradas produzem sempre o mesmo
 * resultado.
 */
export function aplicarCupom(
  carrinho: Carrinho,
  codigoCupom: string,
): ResultadoAplicacao {
  const cupom = CATALOGO_CUPONS[codigoCupom];
  if (cupom === undefined) {
    return { ok: false, motivo: "codigo-desconhecido" };
  }
  return { ok: true, novoTotalCents: novoTotal(carrinho.totalCents, cupom) };
}

function novoTotal(totalCents: number, cupom: Cupom): number {
  if (cupom.tipo === "percentual") {
    const desconto = Math.round((totalCents * cupom.magnitudeCents) / 100);
    return totalCents - desconto;
  }
  return Math.max(0, totalCents - cupom.magnitudeCents);
}
