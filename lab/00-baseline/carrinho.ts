export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export interface Cart {
  itens: CartItem[];
}

export interface Coupon {
  codigo: string;
  tipo: "percentual" | "valor_fixo";
  valor: number; // 10 = 10% (percentual) ou 10 = R$10 (valor_fixo)
  minimo?: number; // valor mínimo do carrinho para o cupom ser válido
}

export const CUPONS: Coupon[] = [
  { codigo: "BEMVINDO10", tipo: "percentual", valor: 10 },
  { codigo: "MENOS50", tipo: "valor_fixo", valor: 50, minimo: 200 },
];

export function buscarCupom(codigo: string): Coupon | undefined {
  return CUPONS.find(
    (c) => c.codigo.toLowerCase() === codigo.trim().toLowerCase(),
  );
}

export function calcularTotal(carrinho: Cart): number {
  return carrinho.itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0,
  );
}

export function aplicarCupom(
  carrinho: Cart,
  codigoCupom: string,
): { total: number; desconto: number } {
  if (carrinho.itens.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  const cupom = buscarCupom(codigoCupom);
  if (!cupom) {
    throw new Error(`Cupom "${codigoCupom}" inválido.`);
  }

  const total = calcularTotal(carrinho);

  if (cupom.minimo !== undefined && total < cupom.minimo) {
    throw new Error(
      `Cupom exige pedido mínimo de R$ ${cupom.minimo.toFixed(2)}. Total atual: R$ ${total.toFixed(2)}.`,
    );
  }

  let desconto: number;
  if (cupom.tipo === "percentual") {
    desconto = (total * cupom.valor) / 100;
  } else {
    desconto = cupom.valor;
  }

  // o desconto nunca pode ser maior que o total
  desconto = Math.min(desconto, total);

  return {
    total: Number((total - desconto).toFixed(2)),
    desconto: Number(desconto.toFixed(2)),
  };
}
