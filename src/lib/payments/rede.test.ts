import test from "node:test";
import assert from "node:assert/strict";
import { buildPixTransactionPayload } from "./rede";

test("buildPixTransactionPayload segue contrato oficial e.Rede v1.32 (pág. 136)", () => {
  const payload = buildPixTransactionPayload("order-123", 598405, 1770000000000);

  // camelCase, sem `capture`, `qrCode` como objeto com dateTimeExpiration.
  assert.equal(payload.kind, "pix");
  assert.equal(payload.amount, 598405);
  assert.ok(payload.reference.startsWith("order-123"));
  assert.ok(payload.reference.length <= 16);
  assert.match(
    payload.qrCode.dateTimeExpiration,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
  );

  // Garante que nenhuma chave PascalCase legada vaza no JSON final.
  const serialized = JSON.stringify(payload);
  assert.ok(!serialized.includes('"Capture"'), "não pode ter Capture");
  assert.ok(!serialized.includes('"Amount"'), "não pode ter Amount");
  assert.ok(!serialized.includes('"Reference"'), "não pode ter Reference");
  assert.ok(!/"QrCode":\s*true/.test(serialized), "QrCode não é boolean");
  assert.ok(!("capture" in payload), "PIX não tem capture");
});

test("buildPixTransactionPayload rejeita centavos não-inteiros", () => {
  assert.throws(
    () => buildPixTransactionPayload("order-123", 10.5, 1770000000000),
    /Valor PIX inválido/,
  );
});
