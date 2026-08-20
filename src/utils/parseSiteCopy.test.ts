import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bulletItems,
  blocksAfterHeading,
  blocksBeforeHeading,
  caseCards,
  ctaLabels,
  firstCodeBlock,
  firstTable,
  heading1,
  heading2,
  headingCards,
  paragraphs,
  parseFlowDiagram,
  parseSiteCopySections,
  testimonials,
  valueAfter,
} from "./parseSiteCopy.ts";

test("parseSiteCopySections divide el markdown en secciones por heading S<n>/P<n>/SEO", () => {
  const markdown = ["# S1 · Hero", "Parrafo del hero", "# S2 · Evidencia", "Parrafo de evidencia"].join("\n\n");

  const sections = parseSiteCopySections(markdown);

  assert.deepEqual([...sections.keys()], ["S1", "S2"]);
  assert.equal(sections.get("S1")?.label, "Hero");
  assert.deepEqual(sections.get("S1")?.blocks, ["Parrafo del hero"]);
  assert.deepEqual(sections.get("S2")?.blocks, ["Parrafo de evidencia"]);
});

test("parseSiteCopySections conserva la primera aparicion de una clave duplicada, descarta la version obsoleta completa", () => {
  const markdown = [
    "# S1 · Hero",
    "Version vigente",
    "# S1 · Hero (obsoleto)",
    "Version obsoleta que no debe publicarse",
    "# S2 · Evidencia",
    "Otra seccion",
  ].join("\n\n");

  const sections = parseSiteCopySections(markdown);

  assert.deepEqual([...sections.keys()], ["S1", "S2"]);
  assert.deepEqual(sections.get("S1")?.blocks, ["Version vigente"]);
});

test("parseSiteCopySections ignora bloques sueltos antes de cualquier heading de seccion", () => {
  const markdown = ["Bloque huerfano", "# S1 · Hero", "Contenido real"].join("\n\n");

  const sections = parseSiteCopySections(markdown);

  assert.deepEqual([...sections.keys()], ["S1"]);
  assert.deepEqual(sections.get("S1")?.blocks, ["Contenido real"]);
});

test("heading1 encuentra el primer heading de nivel 1 e ignora el resto", () => {
  const blocks = ["## No es H1", "# Titular real", "# Segundo H1 ignorado"];

  assert.equal(heading1(blocks), "Titular real");
});

test("heading1 devuelve string vacio si no hay heading de nivel 1", () => {
  assert.equal(heading1(["## Solo H2", "parrafo"]), "");
});

test("heading2 encuentra el primer heading de nivel 2", () => {
  assert.equal(heading2(["# H1", "## Subtitulo", "parrafo"]), "Subtitulo");
});

test("paragraphs filtra headings, divisores, citas, codigo, listas y placeholders", () => {
  const blocks = [
    "# Heading",
    "> Cita",
    "```",
    "---",
    "- item de lista",
    "1. item numerado",
    "[Placeholder]",
    "",
    "Parrafo real uno",
    "Parrafo real dos",
  ];

  assert.deepEqual(paragraphs(blocks), ["Parrafo real uno", "Parrafo real dos"]);
});

test("ctaLabels extrae etiquetas de un bloque con formato [ Label ]", () => {
  const blocks = ["parrafo previo", "[ Ver casos ]  [ Agendar llamada ]", "parrafo posterior"];

  assert.deepEqual(ctaLabels(blocks), ["Ver casos", "Agendar llamada"]);
});

test("ctaLabels devuelve arreglo vacio si ningun bloque trae corchetes", () => {
  assert.deepEqual(ctaLabels(["sin corchetes aqui"]), []);
});

test("valueAfter devuelve el bloque siguiente a un label exacto", () => {
  const blocks = ["Titulo SEO", "diegomaury.mx — Portafolio", "Descripcion SEO", "Meta description real"];

  assert.equal(valueAfter(blocks, "Titulo SEO"), "diegomaury.mx — Portafolio");
});

test("valueAfter devuelve string vacio si el label no existe o es el ultimo bloque", () => {
  assert.equal(valueAfter(["a", "b"], "no existe"), "");
  assert.equal(valueAfter(["a", "b"], "b"), "");
});

test("blocksBeforeHeading corta en el primer heading que matchea alguno de los prefijos", () => {
  const blocks = ["Intro uno", "Intro dos", "## Siguiente seccion", "No debe incluirse"];

  assert.deepEqual(blocksBeforeHeading(blocks, ["## ", "### "]), ["Intro uno", "Intro dos"]);
});

test("caseCards agrupa heading_3 con Situacion/Accion/resultados/Autopsia", () => {
  const blocks = [
    "### 🔥 Caso uno",
    "Situación: contexto del caso",
    "Acción: lo que se hizo",
    "- Resultado uno",
    "- Resultado dos",
    "Autopsia: leccion aprendida",
    "### 🚀 Caso dos",
    "Situación: otro contexto",
  ];

  const cards = caseCards(blocks);

  assert.equal(cards.length, 2);
  assert.deepEqual(cards[0], {
    title: "🔥 Caso uno",
    situation: "contexto del caso",
    action: "lo que se hizo",
    results: ["Resultado uno", "Resultado dos"],
    autopsy: "leccion aprendida",
  });
  assert.equal(cards[1].title, "🚀 Caso dos");
  assert.equal(cards[1].situation, "otro contexto");
});

test("caseCards ignora bloques antes del primer heading_3", () => {
  const blocks = ["Situación: huerfana, sin tarjeta abierta", "### Unica tarjeta", "Situación: real"];

  const cards = caseCards(blocks);

  assert.equal(cards.length, 1);
  assert.equal(cards[0].situation, "real");
});

test("firstTable parsea header y filas de una tabla markdown", () => {
  const blocks = ["| Metrica | Antes | Después |\n| --- | --- | --- |\n| Alcance | 100 | 400 |"];

  const table = firstTable(blocks);

  assert.deepEqual(table?.header, ["Metrica", "Antes", "Después"]);
  assert.deepEqual(table?.rows, [["Alcance", "100", "400"]]);
});

test("firstTable devuelve null si ningun bloque empieza con |", () => {
  assert.equal(firstTable(["sin tabla aqui"]), null);
});

test("firstCodeBlock reconstruye el contenido entre los dos marcadores ``` uniendo bloques partidos por lineas en blanco", () => {
  const blocks = ["```", "linea uno", "linea dos", "```", "parrafo despues"];

  assert.equal(firstCodeBlock(blocks), "linea uno\n\nlinea dos");
});

test("firstCodeBlock devuelve string vacio si no hay bloque de codigo", () => {
  assert.equal(firstCodeBlock(["sin codigo"]), "");
});

test("blocksAfterHeading devuelve los bloques posteriores al heading que matchea el prefijo, sin incluirlo", () => {
  const blocks = ["antes", "## Mi modelo", "despues uno", "despues dos"];

  assert.deepEqual(blocksAfterHeading(blocks, "## Mi modelo"), ["despues uno", "despues dos"]);
});

test("blocksAfterHeading devuelve arreglo vacio si el heading no aparece", () => {
  assert.deepEqual(blocksAfterHeading(["a", "b"], "## No existe"), []);
});

test("bulletItems extrae items de lista con vineta sin el marcador", () => {
  const blocks = ["- Primero", "no es lista", "- Segundo"];

  assert.deepEqual(bulletItems(blocks), ["Primero", "Segundo"]);
});

test("headingCards agrupa parrafos bajo cada heading hasta la siguiente tarjeta", () => {
  const blocks = ["### Campo uno", "parrafo a", "parrafo b", "---", "### Campo dos", "parrafo c"];

  const cards = headingCards(blocks, "### ");

  assert.deepEqual(cards, [
    { title: "Campo uno", paragraphs: ["parrafo a", "parrafo b"] },
    { title: "Campo dos", paragraphs: ["parrafo c"] },
  ]);
});

test("parseFlowDiagram reconoce al menos 3 encabezados de caja y agrupa sus items", () => {
  const raw = [
    "│ ORIGEN │",
    "• item origen",
    "CONECTOR",
    "• item conector",
    "│ DESTINO │",
    "• item destino",
  ].join("\n");

  const diagram = parseFlowDiagram(raw);

  assert.equal(diagram?.fromLabel, "ORIGEN");
  assert.deepEqual(diagram?.fromItems, ["item origen"]);
  assert.equal(diagram?.connectorLabel, "CONECTOR");
  assert.equal(diagram?.toLabel, "DESTINO");
  assert.deepEqual(diagram?.toItems, ["item destino"]);
});

test("parseFlowDiagram devuelve null si reconoce menos de 3 encabezados", () => {
  const raw = ["│ SOLO UNO │", "• item"].join("\n");

  assert.equal(parseFlowDiagram(raw), null);
});

test("testimonials agrupa cita, nombre y lineas de rol, filtrando placeholders y UUIDs sueltos", () => {
  const blocks = [
    "> Cita del primer testimonio",
    "Nombre Apellido",
    "Rol · Empresa",
    "[Widget de Senja]",
    "550e8400-e29b-41d4-a716-446655440000",
    "> Segunda cita",
    "Otro Nombre",
  ];

  const items = testimonials(blocks);

  assert.equal(items.length, 2);
  assert.deepEqual(items[0], {
    quote: "Cita del primer testimonio",
    name: "Nombre Apellido",
    roleLines: ["Rol · Empresa"],
  });
  assert.equal(items[1].name, "Otro Nombre");
});
