import { expect, it } from 'vitest'
import { calcularTotal } from './total'
import { calcularSubtotal } from './subtotal'
import type { Carrinho, Cupom } from './types'

const carrinho = {
  itens: [
    { id: 'a', nome: 'Caneta', precoCentavos: 1000, quantidade: 2 },
    { id: 'b', nome: 'Lápis', precoCentavos: 550, quantidade: 1 },
  ],
} satisfies Carrinho

const congela = <T>(valor: T): T =>
  structuredClone(valor) as T // ver teste de imutabilidade abaixo

const cupomPercentual = (percentual: number) => ({
  tipo: 'percentual',
  percentual,
} as const satisfies Cupom)
const cupomValorFixo = (valorCentavos: number) => ({
  tipo: 'valorFixo',
  valorCentavos,
} as const satisfies Cupom)

it('aplica 10% sobre subtotal de 9990: desconto 999, total 8991', () => {
  const carrinho = { itens: [{ id: 'x', nome: 'X', precoCentavos: 9990, quantidade: 1 }] }
  expect(calcularTotal(carrinho, cupomPercentual(10))).toEqual({
    descontoCentavos: 999,
    totalCentavos: 8991,
  })
})

it('cupom de 0% deixa o total igual ao subtotal', () => {
  const resultado = calcularTotal(carrinho, cupomPercentual(0))
  expect(resultado).toEqual({ descontoCentavos: 0, totalCentavos: 2550 })
})

it('arredonda resultado fracionário para o centavo mais próximo (uma vez)', () => {
  // 10% de 995 = 99,5 → 100 (Math.round) ; total 895
  const carrinho = { itens: [{ id: 'x', nome: 'X', precoCentavos: 995, quantidade: 1 }] }
  expect(calcularTotal(carrinho, cupomPercentual(10)).descontoCentavos).toBe(100)
  expect(calcularTotal(carrinho, cupomPercentual(10)).totalCentavos).toBe(895)
})

it('exerce o case valorFixo do switch (exaustividade)', () => {
  const resultado = calcularTotal(carrinho, cupomValorFixo(500))
  expect(resultado).toEqual({ descontoCentavos: 500, totalCentavos: 2050 })
})

it('valor fixo maior que o subtotal limita o total a 0', () => {
  const resultado = calcularTotal(carrinho, cupomValorFixo(5000))
  expect(resultado).toEqual({ descontoCentavos: 5000, totalCentavos: 0 })
})

it('percentual maior que 100% também limita o total a 0', () => {
  const resultado = calcularTotal(carrinho, cupomPercentual(150))
  expect(resultado.descontoCentavos).toBe(
    Math.round((calcularSubtotal(carrinho) * 150) / 100),
  )
  expect(resultado.totalCentavos).toBe(0)
})

it('não muta carrinho e cupom congelados (imutabilidade do domínio)', () => {
  const carrinhoCongelado = Object.freeze({
    itens: carrinho.itens.map((item) => Object.freeze({ ...item })),
  })
  const cupom = Object.freeze(cupomPercentual(10))

  const subtotal = calcularSubtotal(carrinhoCongelado)
  const total = calcularTotal(carrinhoCongelado, cupom)

  expect(subtotal).toBe(2550) // não lançou e calculou
  expect(total.totalCentavos).toBe(2295)
  expect(carrinhoCongelado).toEqual(congela(carrinho)) // entradas intactas
  expect(calcularSubtotal(carrinhoCongelado)).toBe(subtotal)
})
