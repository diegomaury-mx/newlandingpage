import assert from "node:assert/strict";
import { test } from "node:test";
import { validateContact, LIMITS } from "./validateContact.ts";

const VALID = {
  name: "Ana Pérez",
  email: "ana@example.com",
  message: "Quiero hablar de un programa de innovación.",
};

test("validateContact: entrada válida devuelve ok con valores recortados", () => {
  const result = validateContact({ ...VALID, name: "  Ana Pérez  " });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.name, "Ana Pérez");
});

test("validateContact: nombre vacío es required", () => {
  const result = validateContact({ ...VALID, name: "   " });
  assert.deepEqual(result, { ok: false, fields: { name: "required" } });
});

test("validateContact: nombre de más de 100 caracteres es too_long", () => {
  const result = validateContact({ ...VALID, name: "a".repeat(LIMITS.nameMax + 1) });
  assert.deepEqual(result, { ok: false, fields: { name: "too_long" } });
});

test("validateContact: nombre con salto de línea es invalid (inyección de cabeceras)", () => {
  const result = validateContact({ ...VALID, name: "Ana\r\nBcc: x@y.com" });
  assert.deepEqual(result, { ok: false, fields: { name: "invalid" } });
});

test("validateContact: correo vacío es required", () => {
  const result = validateContact({ ...VALID, email: "" });
  assert.deepEqual(result, { ok: false, fields: { email: "required" } });
});

test("validateContact: correo sin arroba o sin dominio es invalid", () => {
  for (const email of ["ana", "ana@", "ana@example", "ana @example.com", "@example.com"]) {
    const result = validateContact({ ...VALID, email });
    assert.deepEqual(result, { ok: false, fields: { email: "invalid" } }, email);
  }
});

test("validateContact: correo de más de 254 caracteres es too_long", () => {
  const email = `${"a".repeat(250)}@example.com`;
  const result = validateContact({ ...VALID, email });
  assert.deepEqual(result, { ok: false, fields: { email: "too_long" } });
});

test("validateContact: mensaje de menos de 10 caracteres es too_short", () => {
  const result = validateContact({ ...VALID, message: "Hola" });
  assert.deepEqual(result, { ok: false, fields: { message: "too_short" } });
});

test("validateContact: mensaje de más de 2000 caracteres es too_long", () => {
  const result = validateContact({ ...VALID, message: "a".repeat(LIMITS.messageMax + 1) });
  assert.deepEqual(result, { ok: false, fields: { message: "too_long" } });
});

test("validateContact: mensaje con saltos de línea y tabs es válido", () => {
  const result = validateContact({ ...VALID, message: "Primera línea.\n\tSegunda línea con sangría." });
  assert.equal(result.ok, true);
});

test("validateContact: mensaje con caracteres de control es invalid", () => {
  const result = validateContact({ ...VALID, message: "Mensaje con nulo\u0000 dentro" });
  assert.deepEqual(result, { ok: false, fields: { message: "invalid" } });
});

test("validateContact: acumula errores de varios campos", () => {
  const result = validateContact({ name: "", email: "x", message: "" });
  assert.deepEqual(result, {
    ok: false,
    fields: { name: "required", email: "invalid", message: "required" },
  });
});

test("validateContact: entrada que no es objeto falla con todos los campos required", () => {
  for (const raw of [null, undefined, "texto", 42]) {
    const result = validateContact(raw);
    assert.deepEqual(result, {
      ok: false,
      fields: { name: "required", email: "required", message: "required" },
    });
  }
});

test("validateContact: valores que no son string cuentan como vacíos", () => {
  const result = validateContact({ name: 5, email: {}, message: [] });
  assert.equal(result.ok, false);
});

test("validateContact: nombre con separador de línea Unicode (U+2028) es invalid", () => {
  const result = validateContact({ ...VALID, name: "Ana\u2028Pérez" });
  assert.deepEqual(result, { ok: false, fields: { name: "invalid" } });
});

test("validateContact: correo con NEL (U+0085) es invalid", () => {
  const result = validateContact({ ...VALID, email: "ana\u0085@example.com" });
  assert.deepEqual(result, { ok: false, fields: { email: "invalid" } });
});
