export type ItemCarrinho = {
  id: string
  nome: string
  precoCentavos: number
  quantidade: number
}

export type Carrinho = {
  itens: readonly ItemCarrinho[]
}

export type Cupom =
  | { tipo: 'percentual'; percentual: number }
  | { tipo: 'valorFixo'; valorCentavos: number }

export type Resultado =
  | { readonly ok: true; readonly valorCentavos: number }
  | { readonly ok: false; readonly erro: 'cupomDesconhecido' }
