import { describe, it, expect } from "vitest";
import { computeTotals } from "./pricing";

describe("frete", () => {
  it("Alagoas (CEP 57) não cobra frete", () => {
    expect(computeTotals(6299, "credit_card", "57000-000").shipping).toBe(0);
  });
  it("demais estados não cobram frete fixo no checkout (cotado pela transportadora)", () => {
    const t = computeTotals(6299, "credit_card", "01310-100");
    expect(t.shipping).toBe(0);
    expect(t.total).toBe(6299);
  });
});
