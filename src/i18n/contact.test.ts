import assert from "node:assert/strict";
import { test } from "node:test";
import { contactCopy } from "./contact.ts";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

test("contactCopy: ES y EN tienen exactamente las mismas claves", () => {
  assert.deepEqual(keyPaths(contactCopy.es).sort(), keyPaths(contactCopy.en).sort());
});

test("contactCopy: ningún texto está vacío", () => {
  for (const locale of ["es", "en"] as const) {
    for (const text of strings(contactCopy[locale])) {
      assert.notEqual(text.trim(), "", `${locale} tiene un texto vacío`);
    }
  }
});

test("contactCopy: sin em dash en ningún texto", () => {
  for (const locale of ["es", "en"] as const) {
    for (const text of strings(contactCopy[locale])) {
      assert.doesNotMatch(text, /—/, `${locale}: "${text}"`);
    }
  }
});

test("contactCopy: ningún texto promete un tiempo de respuesta", () => {
  const promise = /\b\d+\s*(h|hrs?|horas?|hours?|d[ií]as?|days?|min|minutos?|minutes?)\b/i;
  const phrases = /(menos de|dentro de|en un plazo|within|less than|same day|mismo d[ií]a)/i;
  for (const locale of ["es", "en"] as const) {
    for (const text of strings(contactCopy[locale])) {
      assert.doesNotMatch(text, promise, `${locale}: "${text}"`);
      assert.doesNotMatch(text, phrases, `${locale}: "${text}"`);
    }
  }
});
