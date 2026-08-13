import { test } from "node:test";
import assert from "node:assert/strict";
import { toEmbeddableVideoUrl } from "./embedVideo.ts";

test("convierte un link de YouTube watch a su forma embed", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

test("convierte un link corto youtu.be a su forma embed", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://youtu.be/dQw4w9WgXcQ"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

test("deja pasar un link que ya es embed de YouTube", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

test("convierte un link de Google Drive (view) a su forma preview", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing"),
    "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/preview",
  );
});

test("devuelve null para un proveedor no reconocido (fallback a link)", () => {
  assert.equal(toEmbeddableVideoUrl("https://vimeo.com/12345678"), null);
});

test("devuelve null para un link vacío o mal formado", () => {
  assert.equal(toEmbeddableVideoUrl(""), null);
  assert.equal(toEmbeddableVideoUrl("no-es-una-url"), null);
});
