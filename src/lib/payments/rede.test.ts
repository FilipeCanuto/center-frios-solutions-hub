import test from "node:test";
import assert from "node:assert/strict";
import { buildPixTransactionPayload } from "./rede";

test("buildPixTransactionPayload emits strict PascalCase e-Rede PIX body", () => {
  const payload = buildPixTransactionPayload("order-123", 598405, 1770000000000);

  assert.deepEqual(payload, {
    Capture: true,
    Amount: 598405,
    Reference: "order-123-1770000000000",
    QrCode: true,
  });
  assert.equal(
    JSON.stringify(payload),
    '{"Capture":true,"Amount":598405,"Reference":"order-123-1770000000000","QrCode":true}',
  );
  assert.deepEqual(
    Object.keys(payload).filter((key) => /^[a-z]/.test(key)),
    [],
  );
});

test("buildPixTransactionPayload rejects non-integer cent amounts", () => {
  assert.throws(
    () => buildPixTransactionPayload("order-123", 10.5, 1770000000000),
    /Valor PIX inválido/,
  );
});
