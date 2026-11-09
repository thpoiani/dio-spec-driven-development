/** Item do carrinho — apenas informativo para o cálculo de desconto. */
export type Item = {
  nome: string;
  precoCents: number;
};

/**
 * Carrinho de compra. `totalCents` (inteiro ≥ 0, em centavos) é a base
 * autoritativa do desconto; `itens` é apenas informativa e nunca recalculada.
 */
export type Carrinho = {
  totalCents: number;
  itens?: Item[];
};
