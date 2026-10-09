import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAboutStats, classifyStat } from "./aboutStats.ts";

const SUBLABELS = {
  projects: "Trayectoria acumulada, cifra propia",
  years: "7+ en innovación y ecosistemas",
};

test("classifyStat decide el tipo por la etiqueta, no por la posicion", () => {
  assert.equal(classifyStat("30+ proyectos liderados"), "projects");
  assert.equal(classifyStat("15+ años de trayectoria"), "years");
  assert.equal(classifyStat("6 sectores transformados"), "other");
});

test("cada nota fija va con su tipo de cifra y una cifra nueva no hereda ninguna", () => {
  const raws = ["30+ proyectos liderados", "15+ años de trayectoria", "6 sectores transformados"];
  assert.deepEqual(buildAboutStats(raws, raws, SUBLABELS), [
    { n: "30+", l: "proyectos liderados", s: SUBLABELS.projects },
    { n: "15+", l: "años de trayectoria", s: SUBLABELS.years },
    { n: "6", l: "sectores transformados", s: "" },
  ]);
});

test("el orden de las cifras en Notion no cambia a quien pertenece cada nota", () => {
  const raws = ["6 sectores transformados", "15+ años de trayectoria"];
  const stats = buildAboutStats(raws, raws, SUBLABELS);
  assert.equal(stats[0].s, "");
  assert.equal(stats[1].s, SUBLABELS.years);
});

test("una cifra de participantes escrita en Notion se muestra tal cual, sin numero forzado ni nota", () => {
  const raws = ["9,905 participantes en programas"];
  assert.deepEqual(buildAboutStats(raws, raws, SUBLABELS), [
    { n: "9,905", l: "participantes en programas", s: "" },
  ]);
});

test("en la version traducida el tipo sale del texto ES y el texto visible del traducido", () => {
  const es = ["15+ años de trayectoria", "6 sectores transformados"];
  const en = ["15+ years of experience", "6 sectors transformed"];
  const stats = buildAboutStats(es, en, { projects: "x", years: "7+ in innovation and ecosystems" });
  assert.deepEqual(stats, [
    { n: "15+", l: "years of experience", s: "7+ in innovation and ecosystems" },
    { n: "6", l: "sectors transformed", s: "" },
  ]);
});

test("una linea sin numero no rompe", () => {
  const raws = ["sectores"];
  assert.deepEqual(buildAboutStats(raws, raws, SUBLABELS), [{ n: "sectores", l: "", s: "" }]);
});

test("sin cifras devuelve lista vacia", () => {
  assert.deepEqual(buildAboutStats([], [], SUBLABELS), []);
});
