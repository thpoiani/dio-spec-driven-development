import type { Carrinho } from './types'

export function calcularSubtotal(carrinho: Carrinho): number {
  return carrinho.itens.reduce(
    (subtotal, item) => subtotal + item.precoCentavos * item.quantidade,
    0,
  )
}
