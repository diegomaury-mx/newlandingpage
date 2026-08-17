import { test } from "node:test";
import assert from "node:assert/strict";
import { getLocaleFromPath, toLocalePath } from "./locale.ts";

test("getLocaleFromPath detecta 'en' cuando el path empieza con /en/", () => {
  assert.equal(getLocaleFromPath("/en/portfolio/sofi"), "en");
});

test("getLocaleFromPath detecta 'es' cuando el path no lleva prefijo", () => {
  assert.equal(getLocaleFromPath("/portfolio/sofi"), "es");
});

test("getLocaleFromPath detecta 'en' para la raiz /en", () => {
  assert.equal(getLocaleFromPath("/en"), "en");
});

test("getLocaleFromPath detecta 'es' para la raiz /", () => {
  assert.equal(getLocaleFromPath("/"), "es");
});

test("toLocalePath agrega el prefijo /en al pasar a ingles", () => {
  assert.equal(toLocalePath("/portfolio/sofi", "en"), "/en/portfolio/sofi");
});

test("toLocalePath quita el prefijo /en al pasar a espanol", () => {
  assert.equal(toLocalePath("/en/portfolio/sofi", "es"), "/portfolio/sofi");
});

test("toLocalePath es idempotente si el path ya esta en el locale destino", () => {
  assert.equal(toLocalePath("/en/portfolio", "en"), "/en/portfolio");
  assert.equal(toLocalePath("/portfolio", "es"), "/portfolio");
});

test("toLocalePath preserva la raiz al cambiar de locale", () => {
  assert.equal(toLocalePath("/", "en"), "/en");
  assert.equal(toLocalePath("/en", "es"), "/");
});

test("toLocalePath preserva query string y hash", () => {
  assert.equal(
    toLocalePath("/portfolio?foo=bar#s2-quien-soy", "en"),
    "/en/portfolio?foo=bar#s2-quien-soy",
  );
});
