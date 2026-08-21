import assert from "node:assert/strict";
import { test } from "node:test";
import {
  filterBodyBlocks,
  getCheckbox,
  getFileUrls,
  getMultiSelect,
  getNumber,
  getRelationIds,
  getRichText,
  getSelect,
  getStatus,
  getTitle,
  getUrl,
} from "./notionClient.ts";

/** Construye un PageObjectResponse minimo con solo las propiedades que la prueba necesita. */
function page(properties: Record<string, unknown>): any {
  return { properties };
}

/** Construye un BlockObjectResponse minimo con solo el `type` que filterBodyBlocks necesita. */
function block(type: string): any {
  return { type };
}

test("getTitle concatena el plain_text de una propiedad title", () => {
  const p = page({ Nombre: { type: "title", title: [{ plain_text: "SOFI" }, { plain_text: " caso" }] } });
  assert.equal(getTitle(p, "Nombre"), "SOFI caso");
});

test("getTitle devuelve string vacio si la propiedad no existe o no es title", () => {
  assert.equal(getTitle(page({}), "Nombre"), "");
  assert.equal(getTitle(page({ Nombre: { type: "rich_text", rich_text: [] } }), "Nombre"), "");
});

test("getRichText concatena el plain_text de una propiedad rich_text", () => {
  const p = page({ Resumen: { type: "rich_text", rich_text: [{ plain_text: "hola " }, { plain_text: "mundo" }] } });
  assert.equal(getRichText(p, "Resumen"), "hola mundo");
});

test("getSelect devuelve el nombre de la opcion seleccionada", () => {
  const p = page({ Estado: { type: "select", select: { name: "Publicado" } } });
  assert.equal(getSelect(p, "Estado"), "Publicado");
});

test("getSelect devuelve undefined si la celda esta vacia", () => {
  const p = page({ Estado: { type: "select", select: null } });
  assert.equal(getSelect(p, "Estado"), undefined);
});

test("getMultiSelect devuelve arreglo de nombres de opcion", () => {
  const p = page({ Canales: { type: "multi_select", multi_select: [{ name: "Sitio" }, { name: "CV" }] } });
  assert.deepEqual(getMultiSelect(p, "Canales"), ["Sitio", "CV"]);
});

test("getMultiSelect devuelve arreglo vacio si la propiedad no existe", () => {
  assert.deepEqual(getMultiSelect(page({}), "Canales"), []);
});

test("getCheckbox devuelve el booleano de la casilla", () => {
  assert.equal(getCheckbox(page({ Publicable: { type: "checkbox", checkbox: true } }), "Publicable"), true);
});

test("getCheckbox devuelve false si la propiedad no existe o no es checkbox", () => {
  assert.equal(getCheckbox(page({}), "Publicable"), false);
});

test("getNumber devuelve el numero o undefined si la celda esta vacia", () => {
  assert.equal(getNumber(page({ Orden: { type: "number", number: 3 } }), "Orden"), 3);
  assert.equal(getNumber(page({ Orden: { type: "number", number: null } }), "Orden"), undefined);
});

test("getUrl devuelve la URL o undefined", () => {
  assert.equal(getUrl(page({ Link: { type: "url", url: "https://example.com" } }), "Link"), "https://example.com");
  assert.equal(getUrl(page({}), "Link"), undefined);
});

test("getRelationIds devuelve los IDs de paginas relacionadas", () => {
  const p = page({ Proyecto: { type: "relation", relation: [{ id: "a" }, { id: "b" }] } });
  assert.deepEqual(getRelationIds(p, "Proyecto"), ["a", "b"]);
});

test("getStatus devuelve el nombre del estado", () => {
  const p = page({ Estado: { type: "status", status: { name: "En proceso" } } });
  assert.equal(getStatus(p, "Estado"), "En proceso");
});

test("getFileUrls resuelve archivos externos y subidos, filtrando entradas sin URL", () => {
  const p = page({
    Fotos: {
      type: "files",
      files: [
        { type: "external", external: { url: "https://ext.example.com/a.png" } },
        { type: "file", file: { url: "https://s3.example.com/b.png" } },
      ],
    },
  });
  assert.deepEqual(getFileUrls(p, "Fotos"), [
    "https://ext.example.com/a.png",
    "https://s3.example.com/b.png",
  ]);
});

test("getFileUrls devuelve arreglo vacio si la propiedad no es files", () => {
  assert.deepEqual(getFileUrls(page({}), "Fotos"), []);
});

test("filterBodyBlocks descarta child_page y child_database", () => {
  const blocks = [block("paragraph"), block("child_page"), block("heading_1"), block("child_database")];
  const result = filterBodyBlocks(blocks);
  assert.deepEqual(result.map((b) => b.type), ["paragraph", "heading_1"]);
});

test("filterBodyBlocks conserva el orden original de los bloques de cuerpo", () => {
  const blocks = [block("heading_2"), block("paragraph"), block("bulleted_list_item")];
  const result = filterBodyBlocks(blocks);
  assert.deepEqual(result.map((b) => b.type), ["heading_2", "paragraph", "bulleted_list_item"]);
});
