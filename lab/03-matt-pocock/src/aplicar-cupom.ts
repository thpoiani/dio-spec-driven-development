export type Resultado<Ok, Erro> =
  | { readonly ok: true; readonly valor: Ok }
  | { readonly ok: false; readonly erro: Erro };

export type Item = { readonly precoUnitario: number; readonly quantidade: number };

export type Carrinho = { readonly itens: readonly Item[] };

export type CarrinhoComDesconto = Carrinho & {
  readonly codigoCupom: string;
  readonly desconto: number;
  readonly total: number;
};

export type Cupom =
  | { readonly tipo: "percentual"; readonly porcentagem: number }
  | { readonly tipo: "valorFixo"; readonly valor: number };

export type Catalogo = Readonly<Record<string, Cupom>>;

export type ErroAplicarCupom = "codigo-invalido";

export function aplicarCupom(
  carrinho: Carrinho,
  codigo: string,
  catalogo: Catalogo,
): Resultado<CarrinhoComDesconto, ErroAplicarCupom> {
  if (!Object.hasOwn(catalogo, codigo)) return { ok: false, erro: "codigo-invalido" };
  const cupom = catalogo[codigo];
  const subtotal = carrinho.itens.reduce(
    (s, item) => s + item.precoUnitario * item.quantidade,
    0,
  );
  const desconto = Math.min(
    cupom.tipo === "percentual"
      ? Math.round((subtotal * cupom.porcentagem) / 100)
      : cupom.valor,
    subtotal,
  );
  return {
    ok: true,
    valor: { ...carrinho, codigoCupom: codigo, desconto, total: subtotal - desconto },
  };
}
