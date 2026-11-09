/** Cupom do catálogo: percentual (ex.: 10 = 10%) ou fixo (em centavos). */
export type Cupom = {
  codigo: string;
  tipo: "percentual" | "fixo";
  magnitudeCents: number;
};

/**
 * Catálogo fixo do domínio. A comparação de código é exata — sem trim e
 * sem case-insensitive (espec e decisão D3 do research.md).
 */
export const CATALOGO_CUPONS: Record<string, Cupom> = {
  PROMO10: { codigo: "PROMO10", tipo: "percentual", magnitudeCents: 10 },
  MENOS15: { codigo: "MENOS15", tipo: "fixo", magnitudeCents: 1500 },
};
