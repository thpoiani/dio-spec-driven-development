import { calcularSubtotal } from './subtotal'
import type { Carrinho, Cupom } from './types'

export type TotalComDesconto = {
  readonly descontoCentavos: number
  readonly totalCentavos: number
}

export function calcularTotal(
  carrinho: Carrinho,
  cupom: Cupom,
): TotalComDesconto {
  const subtotalCentavos = calcularSubtotal(carrinho)
  const descontoCentavos = descontoDoCupom(subtotalCentavos, cupom)

  return {
    descontoCentavos,
    totalCentavos: Math.max(0, subtotalCentavos - descontoCentavos),
  }
}

function descontoDoCupom(subtotalCentavos: number, cupom: Cupom): number {
  switch (cupom.tipo) {
    case 'percentual':
      return Math.round((subtotalCentavos * cupom.percentual) / 100)
    case 'valorFixo':
      return cupom.valorCentavos
  }
}
