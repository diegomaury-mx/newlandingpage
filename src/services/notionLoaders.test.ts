import assert from "node:assert/strict";
import { test } from "node:test";
import type { PageObjectResponse } from "@notionhq/client";
import { mapImageSlot } from "./notionLoaders.ts";

function fakePage(properties: PageObjectResponse["properties"]): PageObjectResponse {
  return { id: "page-id", properties } as PageObjectResponse;
}

test("mapImageSlot lee un slot con imagen publicada", () => {
  const page = fakePage({
    Slot: { type: "title", title: [{ plain_text: "foto-diego" }] },
    Imagen: {
      type: "files",
      files: [{ type: "external", name: "foto.jpg", external: { url: "https://example.com/foto.jpg" } }],
    },
    "Tamaño requerido": { type: "rich_text", rich_text: [{ plain_text: "700x875px" }] },
    "Formato requerido": { type: "select", select: { name: "JPG" } },
    Estado: { type: "status", status: { name: "Listo" } },
    Descripcion: { type: "rich_text", rich_text: [{ plain_text: "Foto de Hero" }] },
  } as unknown as PageObjectResponse["properties"]);

  const data = mapImageSlot(page);

  assert.equal(data.slot, "foto-diego");
  assert.equal(data.imageUrl, "https://example.com/foto.jpg");
  assert.equal(data.sizeRequired, "700x875px");
  assert.equal(data.formatRequired, "JPG");
  assert.equal(data.status, "Listo");
  assert.equal(data.description, "Foto de Hero");
});

test("mapImageSlot deja imageUrl undefined cuando el slot no tiene archivo subido", () => {
  const page = fakePage({
    Slot: { type: "title", title: [{ plain_text: "logo-ebc" }] },
    Imagen: { type: "files", files: [] },
    "Tamaño requerido": { type: "rich_text", rich_text: [] },
    "Formato requerido": { type: "select", select: null },
    Estado: { type: "status", status: { name: "Sin empezar" } },
    Descripcion: { type: "rich_text", rich_text: [] },
  } as unknown as PageObjectResponse["properties"]);

  const data = mapImageSlot(page);

  assert.equal(data.slot, "logo-ebc");
  assert.equal(data.imageUrl, undefined);
  assert.equal(data.status, "Sin empezar");
});
