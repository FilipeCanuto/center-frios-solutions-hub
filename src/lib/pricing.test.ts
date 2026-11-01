import test from "node:test";
import assert from "node:assert/strict";
import { computeTotals } from "./pricing";

test("Alagoas (CEP 57) não cobra frete", () => {
  assert.equal(computeTotals(6299, "credit_card", "57000-000").shipping, 0);
});

test("demais estados não cobram frete fixo no checkout (cotado pela transportadora)", () => {
  const t = computeTotals(6299, "credit_card", "01310-100");
  assert.equal(t.shipping, 0);
  assert.equal(t.total, 6299);
});
