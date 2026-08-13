import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "./markdown.ts";

test("una tabla normal (fuera de Resultado) se renderiza como prose-table", () => {
  const md = [
    "## Evidencia",
    "",
    "| Afirmación | Grado |",
    "| --- | --- |",
    "| Registros HubSpot | ✖ pendiente |",
  ].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<div class="prose-table">/);
  assert.doesNotMatch(html, /result-grid/);
});

test("la tabla Métrica|Antes|Después bajo ## Resultado se renderiza como tarjetas", () => {
  const md = [
    "## Resultado",
    "",
    "| Métrica | Antes | Después |",
    "| --- | --- | --- |",
    "| Speed-to-lead | 1–3 días | <5 minutos |",
    "| Leads semanales | 5 | 30 (+500%) |",
    "| Modelos orquestados | — | 3 |",
  ].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<div class="result-grid">/);
  assert.doesNotMatch(html, /prose-table/);
  // valor principal sin el delta
  assert.match(html, /<div class="rc-value">30<\/div>/);
  // delta extraído a su propio bloque
  assert.match(html, /<div class="rc-delta">\+500%<\/div>/);
  // "antes" tachado cuando existe
  assert.match(html, /Antes: <s>1–3 días<\/s>/);
  // "antes" omitido cuando la celda es "—"
  assert.doesNotMatch(html, /Antes: <s>—<\/s>/);
});

test("una tabla bajo ## Resultado con encabezados distintos degrada a prose-table (fallback)", () => {
  const md = [
    "## Resultado",
    "",
    "| Metrica | Valor |",
    "| --- | --- |",
    "| Leads semanales | 30 |",
  ].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<div class="prose-table">/);
  assert.doesNotMatch(html, /result-grid/);
});

test("el rail-nav (extractSections) sigue derivando 3 secciones de un body CAR", () => {
  const md = ["## Contexto", "", "texto", "", "## Acción", "", "texto", "", "## Resultado", "", "texto"].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<h2 id="contexto">Contexto<\/h2>/);
  assert.match(html, /<h2 id="accion">Acción<\/h2>/);
  assert.match(html, /<h2 id="resultado">Resultado<\/h2>/);
});
