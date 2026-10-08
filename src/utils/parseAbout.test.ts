import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAbout, splitRole } from "./parseAbout.ts";

// Bloques tal como los entrega `blocksToMarkdown` para S2: sin negritas
// (el loader usa plain_text), headings con prefijo "## " / "### ".
const S2_BLOCKS = [
  "## No me interesa sumar proyectos. Me interesa resolver el mismo problema desde distintos frentes.",
  "A lo largo de mi carrera he construido comunidades y sistemas.",
  "30+ proyectos liderados • 15+ años de trayectoria • 9,905 participantes en programas",
  "### Esa forma de trabajar me ha llevado a desempeñar distintos roles",
  "Emprendedor: Fundé HackSureste para construir un ecosistema regional.",
  "Líder de programas: Diseñé y operé iniciativas de innovación.",
  "Arquitecto de sistemas: Hoy diseño la forma en que estrategia y tecnología trabajan como un solo sistema: la infraestructura.",
  "### Cómo entro",
  "Entro a operaciones que dependen de la memoria de una persona.",
];

test("parseAbout lee cada slot por tipo de bloque, no por posicion", () => {
  const about = parseAbout(S2_BLOCKS);
  assert.equal(
    about.headline,
    "No me interesa sumar proyectos. Me interesa resolver el mismo problema desde distintos frentes.",
  );
  assert.deepEqual(about.intro, ["A lo largo de mi carrera he construido comunidades y sistemas."]);
  assert.deepEqual(about.statsRaw, [
    "30+ proyectos liderados",
    "15+ años de trayectoria",
    "9,905 participantes en programas",
  ]);
  assert.equal(about.rolesLabel, "Esa forma de trabajar me ha llevado a desempeñar distintos roles");
  assert.equal(about.roles.length, 3);
  assert.equal(about.methodLabel, "Cómo entro");
  assert.deepEqual(about.method, ["Entro a operaciones que dependen de la memoria de una persona."]);
});

test("parseAbout no depende de cuantos parrafos de intro haya", () => {
  const blocks = [S2_BLOCKS[0], "Intro uno.", "Intro dos.", ...S2_BLOCKS.slice(2)];
  const about = parseAbout(blocks);
  assert.deepEqual(about.intro, ["Intro uno.", "Intro dos."]);
  assert.equal(about.statsRaw.length, 3);
});

test("parseAbout deja un parrafo suelto antes de las cifras en la intro", () => {
  // Si alguien reintroduce un parrafo suelto, aparece en la intro (visible, no se pierde en silencio).
  const about = parseAbout(["## Tesis", "Parrafo suelto.", "1 cifra • 2 cifra", "### A", "### B"]);
  assert.deepEqual(about.intro, ["Parrafo suelto."]);
});

test("parseAbout devuelve vacios si falta el contenido", () => {
  const about = parseAbout([]);
  assert.equal(about.headline, "");
  assert.deepEqual(about.intro, []);
  assert.deepEqual(about.statsRaw, []);
  assert.deepEqual(about.roles, []);
  assert.deepEqual(about.method, []);
  assert.equal(about.rolesLabel, "");
  assert.equal(about.methodLabel, "");
});

test("splitRole separa titulo y descripcion en el primer ': '", () => {
  assert.deepEqual(splitRole("Emprendedor: Fundé HackSureste."), {
    title: "Emprendedor",
    text: "Fundé HackSureste.",
  });
  // Los ':' posteriores pertenecen a la descripcion.
  assert.deepEqual(splitRole("Arquitecto de sistemas: hoy diseño: la infraestructura."), {
    title: "Arquitecto de sistemas",
    text: "hoy diseño: la infraestructura.",
  });
});

test("splitRole no inventa un titulo cuando el prefijo es largo o no existe", () => {
  const sinDosPuntos = "Un parrafo sin titulo.";
  assert.deepEqual(splitRole(sinDosPuntos), { title: "", text: sinDosPuntos });
  const largo = "Esto es una frase demasiado larga para ser el titulo de un rol de la seccion: y sigue.";
  assert.deepEqual(splitRole(largo), { title: "", text: largo });
});
