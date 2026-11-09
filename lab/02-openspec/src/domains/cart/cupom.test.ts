import { expect, it } from 'vitest'
import { aplicarCupomPorCodigo, encontraCupom } from './cupom'
import type { Carrinho, Cupom, Resultado } from './types'

const carrinho = {
  itens: [{ id: 'a', nome: 'Caneta', precoCentavos: 1000, quantidade: 2 }],
} satisfies Carrinho

const indice: Readonly<Record<string, Cupom>> = Object.freeze({
  'MENOS10': { tipo: 'percentual', percentual: 10 },
})

it('encontra cupom cadastrado pelo código', () => {
  expect(encontraCupom('MENOS10', indice)).toEqual({
    tipo: 'percentual',
    percentual: 10,
  })
})

it('retorna undefined para código não cadastrado', () => {
  expect(encontraCupom('INEXISTENTE', indice)).toBeUndefined()
})

it('aplica cupom por código cadastrado descontando o total', () => {
  expect(aplicarCupomPorCodigo(carrinho, 'MENOS10', indice)).toEqual({
    ok: true,
    valorCentavos: 1800,
  })
})

it('reporta cupom desconhecido no tipo, sem exceção nem nulo', () => {
  const resultado = aplicarCupomPorCodigo(carrinho, 'INEXISTENTE', indice)

  expect(resultado).toEqual({ ok: false, erro: 'cupomDesconhecido' })
  expect(resultado.ok).toBe(false)
})

function descreverResultado(resultado: Resultado): string {
  const total = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(resultado.ok ? resultado.valorCentavos / 100 : 0)

  return resultado.ok
    ? `Total com desconto: ${total}`
    : `Cupom inválido (${resultado.erro})`
}

it('força o consumidor a tratar os dois caminhos do Resultado', () => {
  expect(descreverResultado(aplicarCupomPorCodigo(carrinho, 'MENOS10', indice))).toBe(
    'Total com desconto: R$\u00a018,00',
  )
  expect(descreverResultado(aplicarCupomPorCodigo(carrinho, 'X', indice))).toBe(
    'Cupom inválido (cupomDesconhecido)',
  )
})
