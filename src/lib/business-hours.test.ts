import { test } from "node:test";
import assert from "node:assert/strict";
import { isSpecialistOnline } from "./business-hours";

// Horários em UTC; Maceió = UTC-3.
test("segunda 10h Maceió: online", () => {
  assert.equal(isSpecialistOnline(new Date("2026-11-02T13:00:00Z")), true);
});
test("segunda 18h Maceió: offline", () => {
  assert.equal(isSpecialistOnline(new Date("2026-11-02T21:00:00Z")), false);
});
test("sábado 11h Maceió: online", () => {
  assert.equal(isSpecialistOnline(new Date("2026-11-07T14:00:00Z")), true);
});
test("sábado 13h Maceió: offline", () => {
  assert.equal(isSpecialistOnline(new Date("2026-11-07T16:00:00Z")), false);
});
test("domingo 10h Maceió: offline", () => {
  assert.equal(isSpecialistOnline(new Date("2026-11-01T13:00:00Z")), false);
});
