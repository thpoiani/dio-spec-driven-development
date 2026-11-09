import { describe, expect, it } from "vitest";

import { aplicarCupom } from "../src/aplicar-cupom";
import type { Carrinho } from "../src/carrinho";

describe("aplicarCupom — cupom percentual (US1)", () => {
  it("aplica 10% sobre o total fornecido", () => {
    const resultado = aplicarCupom({ totalCents: 20000 }, "PROMO10");
    expect(resultado).toEqual({ ok: true, novoTotalCents: 18000 });
  });

  it("arredonda o desconto percentual (half-up)", () => {
    const resultado = aplicarCupom({ totalCents: 9990 }, "PROMO10");
    expect(resultado).toEqual({ ok: true, novoTotalCents: 8991 });
  });

  it("retorna zero para carrinho vazio (totalCents 0)", () => {
    const resultado = aplicarCupom({ totalCents: 0 }, "PROMO10");
    expect(resultado).toEqual({ ok: true, novoTotalCents: 0 });
  });

  it("não recalcula o total a partir dos itens (apenas informativos)", () => {
    const carrinho: Carrinho = {
      totalCents: 10000,
      itens: [{ nome: "Livro", precoCents: 5000 }],
    };
    const resultado = aplicarCupom(carrinho, "PROMO10");
    expect(resultado).toEqual({ ok: true, novoTotalCents: 9000 });
    expect(carrinho.itens).toEqual([{ nome: "Livro", precoCents: 5000 }]);
  });
});

describe("aplicarCupom — cupom de valor fixo (US2)", () => {
  it("subtrai o valor fixo do total", () => {
    const resultado = aplicarCupom({ totalCents: 10000 }, "MENOS15");
    expect(resultado).toEqual({ ok: true, novoTotalCents: 8500 });
  });

  it("limita o total a zero quando o desconto excede (FR-005)", () => {
    const resultado = aplicarCupom({ totalCents: 1200 }, "MENOS15");
    expect(resultado).toEqual({ ok: true, novoTotalCents: 0 });
  });
});

describe("aplicarCupom — rejeição de cupom inválido (US3)", () => {
  it("rejeita código desconhecido sem aplicar desconto", () => {
    const resultado = aplicarCupom({ totalCents: 10000 }, "INEXISTENTE");
    expect(resultado).toEqual({ ok: false, motivo: "codigo-desconhecido" });
  });

  it("trata grafia diferente como desconhecida (comparação exata)", () => {
    const resultado = aplicarCupom({ totalCents: 10000 }, "promo10");
    expect(resultado).toEqual({ ok: false, motivo: "codigo-desconhecido" });
  });
});

describe("garantias transversais", () => {
  it("não muta o carrinho de entrada (FR-006)", () => {
    const carrinho: Carrinho = {
      totalCents: 20000,
      itens: [{ nome: "Livro", precoCents: 20000 }],
    };
    aplicarCupom(carrinho, "PROMO10");
    aplicarCupom(carrinho, "INEXISTENTE");
    expect(carrinho).toEqual({
      totalCents: 20000,
      itens: [{ nome: "Livro", precoCents: 20000 }],
    });
  });

  it("é determinística: mesmas entradas, mesmo resultado (FR-007)", () => {
    const primeira = aplicarCupom({ totalCents: 9990 }, "PROMO10");
    const segunda = aplicarCupom({ totalCents: 9990 }, "PROMO10");
    expect(primeira).toEqual(segunda);
  });
});
