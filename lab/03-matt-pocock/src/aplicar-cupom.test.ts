import { describe, expect, it } from "vitest";
import { aplicarCupom, type Catalogo } from "./aplicar-cupom.js";

describe("aplicarCupom", () => {
  it("aplica um cupom percentual ao subtotal do carrinho", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 2 }] };
    const catalogo: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };

    const resultado = aplicarCupom(carrinho, "MENOS10", catalogo);

    // subtotal 4000; 10% = 400; total 3600
    expect(resultado).toEqual({
      ok: true,
      valor: {
        itens: [{ precoUnitario: 2000, quantidade: 2 }],
        codigoCupom: "MENOS10",
        desconto: 400,
        total: 3600,
      },
    });
  });

  it("arredonda o desconto percentual para o centavo mais próximo", () => {
    const carrinho = { itens: [{ precoUnitario: 1999, quantidade: 1 }] };
    const catalogo: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };

    const resultado = aplicarCupom(carrinho, "MENOS10", catalogo);

    // subtotal 1999; 10% = 199.9 → 200; total 1799
    expect(resultado).toEqual({
      ok: true,
      valor: {
        itens: [{ precoUnitario: 1999, quantidade: 1 }],
        codigoCupom: "MENOS10",
        desconto: 200,
        total: 1799,
      },
    });
  });

  it("limita o desconto ao subtotal quando o percentual passa de 100%", () => {
    const carrinho = { itens: [{ precoUnitario: 3000, quantidade: 1 }] };
    const catalogo: Catalogo = { RELAMPAGO: { tipo: "percentual", porcentagem: 150 } };

    const resultado = aplicarCupom(carrinho, "RELAMPAGO", catalogo);

    // subtotal 3000; 150% seria 4500, mas o desconto limita ao subtotal; total 0
    expect(resultado).toEqual({
      ok: true,
      valor: {
        itens: [{ precoUnitario: 3000, quantidade: 1 }],
        codigoCupom: "RELAMPAGO",
        desconto: 3000,
        total: 0,
      },
    });
  });

  it("aplica um cupom de valor fixo ao subtotal do carrinho", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 2 }] };
    const catalogo: Catalogo = { BEMVINDO: { tipo: "valorFixo", valor: 500 } };

    const resultado = aplicarCupom(carrinho, "BEMVINDO", catalogo);

    // subtotal 4000; valor fixo 500; total 3500
    expect(resultado).toEqual({
      ok: true,
      valor: {
        itens: [{ precoUnitario: 2000, quantidade: 2 }],
        codigoCupom: "BEMVINDO",
        desconto: 500,
        total: 3500,
      },
    });
  });

  it("limita o desconto ao subtotal quando o valor fixo excede o subtotal", () => {
    const carrinho = { itens: [{ precoUnitario: 3000, quantidade: 1 }] };
    const catalogo: Catalogo = { GENEROSO: { tipo: "valorFixo", valor: 5000 } };

    const resultado = aplicarCupom(carrinho, "GENEROSO", catalogo);

    // subtotal 3000; valor fixo 5000 limitado ao subtotal; total 0
    expect(resultado).toEqual({
      ok: true,
      valor: {
        itens: [{ precoUnitario: 3000, quantidade: 1 }],
        codigoCupom: "GENEROSO",
        desconto: 3000,
        total: 0,
      },
    });
  });

  it("trata códigos herdados de protótipo como ausentes no catálogo", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 1 }] };
    const catalogo: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };

    const resultado = aplicarCupom(carrinho, "toString", catalogo);

    expect(resultado).toEqual({ ok: false, erro: "codigo-invalido" });
  });

  it("resulta total 0 para um carrinho vazio, sem caso especial", () => {
    const carrinho = { itens: [] };
    const catalogo: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };

    const resultado = aplicarCupom(carrinho, "MENOS10", catalogo);

    expect(resultado).toEqual({
      ok: true,
      valor: { itens: [], codigoCupom: "MENOS10", desconto: 0, total: 0 },
    });
  });

  it("recalcula o desconto a partir do subtotal ao aplicar outro cupom", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 2 }] };
    const catalogo: Catalogo = {
      MENOS10: { tipo: "percentual", porcentagem: 10 },
      QUINZE: { tipo: "percentual", porcentagem: 15 },
    };

    const primeiro = aplicarCupom(carrinho, "MENOS10", catalogo);
    if (!primeiro.ok) throw new Error("inesperado: cupom deveria existir");
    const segundo = aplicarCupom(primeiro.valor, "QUINZE", catalogo);

    // subtotal 4000; o desconto do segundo cupom é 15% do SUBTOTAL (600), não do total já descontado
    expect(segundo).toEqual({
      ok: true,
      valor: {
        itens: [{ precoUnitario: 2000, quantidade: 2 }],
        codigoCupom: "QUINZE",
        desconto: 600,
        total: 3400,
      },
    });
  });

  it("exige correspondência exata do código de cupom em ambas as direções", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 1 }] };
    const catalogoCaixaAlta: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };
    const catalogoCaixaBaixa: Catalogo = { menos10: { tipo: "percentual", porcentagem: 10 } };

    expect(aplicarCupom(carrinho, "menos10", catalogoCaixaAlta)).toEqual({
      ok: false,
      erro: "codigo-invalido",
    });
    expect(aplicarCupom(carrinho, "MENOS10", catalogoCaixaBaixa)).toEqual({
      ok: false,
      erro: "codigo-invalido",
    });
  });

  it("não muta o carrinho de entrada", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 2 }] };
    const catalogo: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };

    aplicarCupom(carrinho, "MENOS10", catalogo);

    expect(carrinho).toEqual({ itens: [{ precoUnitario: 2000, quantidade: 2 }] });
  });

  it("devolve erro de domínio para um código de cupom ausente no catálogo", () => {
    const carrinho = { itens: [{ precoUnitario: 2000, quantidade: 1 }] };
    const catalogo: Catalogo = { MENOS10: { tipo: "percentual", porcentagem: 10 } };

    const resultado = aplicarCupom(carrinho, "FOO", catalogo);

    expect(resultado).toEqual({ ok: false, erro: "codigo-invalido" });
  });
});
