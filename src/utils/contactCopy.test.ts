import assert from "node:assert/strict";
import { test } from "node:test";
import { parseContactCopy } from "./contactCopy.ts";

const WITH_CARDS = [
  "## Hablemos de lo que quieres que pase.",
  "Cuéntame el reto y te respondo con una propuesta.",
  "### 01",
  "Me escribes o agendas.",
  "Paso uno",
  "### 02",
  "Revisamos el contexto.",
  "Paso dos",
  "[Agendar una llamada](https://calendar.notion.so/x) [Ver casos](/portfolio)",
  "México · Remoto · Español e inglés",
];

const WITHOUT_CARDS = [
  "## Hablemos de lo que quieres que pase.",
  "Cuéntame el reto y te respondo con una propuesta.",
  "[Agendar una llamada](https://calendar.notion.so/x)",
  "México · Remoto · Español e inglés",
];

test("parseContactCopy: con fichas ### toma la intro previa a ellas", () => {
  assert.deepEqual(parseContactCopy(WITH_CARDS).intro, [
    "Cuéntame el reto y te respondo con una propuesta.",
  ]);
});

test("parseContactCopy: con fichas ### toma la línea de confianza posterior", () => {
  assert.deepEqual(parseContactCopy(WITH_CARDS).trustParts, ["México", "Remoto", "Español e inglés"]);
});

test("parseContactCopy: sin fichas la intro excluye CTAs y línea de confianza", () => {
  assert.deepEqual(parseContactCopy(WITHOUT_CARDS).intro, [
    "Cuéntame el reto y te respondo con una propuesta.",
  ]);
});

test("parseContactCopy: sin fichas encuentra igual la línea de confianza", () => {
  assert.deepEqual(parseContactCopy(WITHOUT_CARDS).trustParts, ["México", "Remoto", "Español e inglés"]);
});

test("parseContactCopy: sin línea de confianza devuelve lista vacía", () => {
  assert.deepEqual(parseContactCopy(["## Titular", "Una intro."]).trustParts, []);
});

test("parseContactCopy: bloque vacío no rompe", () => {
  assert.deepEqual(parseContactCopy([]), { intro: [], trustParts: [] });
});
