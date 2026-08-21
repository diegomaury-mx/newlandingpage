import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "./slug.ts";

test("slugify convierte a minusculas y reemplaza espacios por guiones", () => {
  assert.equal(slugify("HackSureste Ciudad del Carmen 2019"), "hacksureste-ciudad-del-carmen-2019");
});

test("slugify quita acentos y diacriticos", () => {
  assert.equal(slugify("INCmty Accelerator — edición"), "incmty-accelerator-edicion");
});

test("slugify colapsa caracteres no alfanumericos consecutivos en un solo guion", () => {
  assert.equal(slugify("REDUX / INCmty  (2020)"), "redux-incmty-2020");
});

test("slugify recorta guiones al inicio y al final", () => {
  assert.equal(slugify("  --Sofi--  "), "sofi");
});

test("slugify devuelve string vacio si el titulo no tiene caracteres alfanumericos", () => {
  assert.equal(slugify("   ···   "), "");
});
