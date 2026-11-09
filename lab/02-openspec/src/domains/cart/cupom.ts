import { calcularTotal } from './total'
import type { Carrinho, Cupom, Resultado } from './types'

export function encontraCupom(
  codigo: string,
  indice: Readonly<Record<string, Cupom>>,
): Cupom | undefined {
  return indice[codigo]
}

export function aplicarCupomPorCodigo(
  carrinho: Carrinho,
  codigo: string,
  indice: Readonly<Record<string, Cupom>>,
): Resultado {
  const cupom = encontraCupom(codigo, indice)

  if (cupom === undefined) {
    return { ok: false, erro: 'cupomDesconhecido' }
  }

  return { ok: true, valorCentavos: calcularTotal(carrinho, cupom).totalCentavos }
}
