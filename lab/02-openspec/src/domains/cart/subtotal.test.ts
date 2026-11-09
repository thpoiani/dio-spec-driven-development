import { expect, it } from 'vitest'
import { calcularSubtotal } from './subtotal'
import type { Carrinho } from './types'

const carrinho = {
  itens: [
    { id: 'a', nome: 'Caneta', precoCentavos: 1000, quantidade: 2 },
    { id: 'b', nome: 'Lápis', precoCentavos: 550, quantidade: 1 },
  ],
} satisfies Carrinho

it('soma preco × quantidade de todos os itens', () => {
  expect(calcularSubtotal(carrinho)).toBe(2550)
})

it('subtotal de carrinho vazio é 0', () => {
  expect(calcularSubtotal({ itens: [] })).toBe(0)
})

it('trabalha em centavos inteiros: R$ 19,87 × 3', () => {
  const carrinho = {
    itens: [{ id: 'c', nome: 'Caderno', precoCentavos: 1987, quantidade: 3 }],
  } satisfies Carrinho

  expect(calcularSubtotal(carrinho)).toBe(5961)
})
