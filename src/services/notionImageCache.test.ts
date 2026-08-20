import assert from "node:assert/strict";
import { test } from "node:test";
import { extensionFromUrl, sanitizeCacheKey } from "./notionImageCache.ts";

test("extensionFromUrl lee la extension del pathname en minusculas", () => {
  assert.equal(extensionFromUrl("https://s3.example.com/foto.JPG"), "jpg");
  assert.equal(extensionFromUrl("https://s3.example.com/logo.png"), "png");
});

test("extensionFromUrl ignora la query string firmada de S3", () => {
  assert.equal(
    extensionFromUrl("https://s3.example.com/foto.webp?X-Amz-Expires=3600&X-Amz-Signature=abc"),
    "webp",
  );
});

test("extensionFromUrl devuelve undefined si el pathname no tiene extension", () => {
  assert.equal(extensionFromUrl("https://s3.example.com/sin-extension"), undefined);
});

test("sanitizeCacheKey reemplaza cualquier caracter fuera de [a-zA-Z0-9._-] por guion", () => {
  assert.equal(sanitizeCacheKey("logo hacksureste (blanco)"), "logo-hacksureste--blanco-");
});

test("sanitizeCacheKey deja intactas letras, numeros, punto, guion bajo y guion", () => {
  assert.equal(sanitizeCacheKey("banner_HGC-2026.v2"), "banner_HGC-2026.v2");
});
