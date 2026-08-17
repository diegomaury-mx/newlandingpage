import assert from "node:assert/strict";
import { test } from "node:test";
import type { BlockObjectResponse, PageObjectResponse } from "@notionhq/client";
import { blocksToMarkdown, mapImageSlot, translateFields } from "./notionLoaders.ts";

function fakeLogger() {
  const warnings: string[] = [];
  return { warn: (msg: string) => warnings.push(msg), warnings };
}

function fakeBlock(type: string, richText: { plain_text: string }[]): BlockObjectResponse {
  return { type, [type]: { rich_text: richText } } as unknown as BlockObjectResponse;
}

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

test("blocksToMarkdown fusiona items consecutivos de una misma lista en un solo bloque", () => {
  const blocks = [
    fakeBlock("bulleted_list_item", [{ plain_text: "Primero" }]),
    fakeBlock("bulleted_list_item", [{ plain_text: "Segundo" }]),
    fakeBlock("bulleted_list_item", [{ plain_text: "Tercero" }]),
  ];

  const markdown = blocksToMarkdown(blocks);

  assert.equal(markdown, "- Primero\n- Segundo\n- Tercero");
});

test("blocksToMarkdown no fusiona una lista con la siguiente si hay un heading entre medio", () => {
  const blocks = [
    fakeBlock("bulleted_list_item", [{ plain_text: "Antes" }]),
    fakeBlock("heading_2", [{ plain_text: "Siguiente sección" }]),
    fakeBlock("bulleted_list_item", [{ plain_text: "Después" }]),
  ];

  const markdown = blocksToMarkdown(blocks);

  assert.equal(markdown, "- Antes\n\n## Siguiente sección\n\n- Después");
});

test("translateFields solo traduce los campos pedidos que son string no vacio", async () => {
  const logger = fakeLogger();
  const raw = { title: "Hola", organization: "", year: undefined, layer: 42 };

  const en = await translateFields(raw, ["title", "organization", "year", "layer"], logger);

  assert.deepEqual(Object.keys(en), ["title"]);
});

test("translateFields ignora campos ausentes en el objeto fuente", async () => {
  const logger = fakeLogger();
  const raw = { title: "Hola" };

  const en = await translateFields(raw, ["title", "noExiste"], logger);

  assert.deepEqual(Object.keys(en), ["title"]);
});

test("translateFields devuelve objeto vacio si la lista de campos esta vacia", async () => {
  const logger = fakeLogger();
  const raw = { title: "Hola" };

  const en = await translateFields(raw, [], logger);

  assert.deepEqual(en, {});
});
