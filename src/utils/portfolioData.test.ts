import assert from "node:assert/strict";
import { test } from "node:test";
import { capabilityShowcase, relatedCases } from "./portfolioData.ts";

type FakeCase = {
  id: string;
  data: {
    title: string;
    draft?: boolean;
    organization?: string;
    capabilities?: string[];
    year?: string;
    logo?: string;
  };
};

function makeCase(overrides: Partial<FakeCase["data"]> & { id: string }): FakeCase {
  const { id, ...data } = overrides;
  return {
    id,
    data: {
      title: id,
      draft: false,
      capabilities: [],
      ...data,
    },
  };
}

const titleOf = (c: FakeCase) => c.data.title;

test("relatedCases prioriza la misma organization sobre capabilities compartidas", () => {
  const current = makeCase({ id: "a", organization: "HEINEKEN", capabilities: ["Facilitación"] });
  const sameOrg = makeCase({ id: "b", organization: "HEINEKEN", capabilities: [], year: "2019" });
  const sharedCapsOnly = makeCase({
    id: "c",
    organization: "Tec de Monterrey",
    capabilities: ["Facilitación"],
    year: "2022",
  });
  const all = [current, sameOrg, sharedCapsOnly] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.deepEqual(
    result.map((r) => r.slug),
    ["b", "c"],
  );
});

test("relatedCases ordena por cantidad de capabilities compartidas cuando no hay match de organization", () => {
  const current = makeCase({ id: "a", organization: "Diego Maury", capabilities: ["Facilitación", "RevOps", "Datos"] });
  const oneShared = makeCase({ id: "b", organization: "Otra org", capabilities: ["Facilitación"] });
  const twoShared = makeCase({ id: "c", organization: "Otra org 2", capabilities: ["Facilitación", "RevOps"] });
  const all = [current, oneShared, twoShared] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.deepEqual(
    result.map((r) => r.slug),
    ["c", "b"],
  );
});

test("relatedCases excluye casos sin organization ni capabilities en comun (score 0)", () => {
  const current = makeCase({ id: "a", organization: "HEINEKEN", capabilities: ["Facilitación"] });
  const unrelated = makeCase({ id: "b", organization: "Otra org", capabilities: ["Datos"] });
  const all = [current, unrelated] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.deepEqual(result, []);
});

test("relatedCases corta en maximo 3 resultados", () => {
  const current = makeCase({ id: "a", organization: "HEINEKEN" });
  const candidates = ["b", "c", "d", "e"].map((id) => makeCase({ id, organization: "HEINEKEN" }));
  const all = [current, ...candidates] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.equal(result.length, 3);
});

test("relatedCases excluye la propia ficha y las fichas draft", () => {
  const current = makeCase({ id: "a", organization: "HEINEKEN" });
  const draftSameOrg = makeCase({ id: "b", organization: "HEINEKEN", draft: true });
  const all = [current, draftSameOrg] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.deepEqual(result, []);
});

test("relatedCases desempata por year desc y luego title asc", () => {
  const current = makeCase({ id: "a", organization: "HEINEKEN" });
  const older = makeCase({ id: "zeta", organization: "HEINEKEN", year: "2018" });
  const newer = makeCase({ id: "beta", organization: "HEINEKEN", year: "2021" });
  const sameYearA = makeCase({ id: "delta", organization: "HEINEKEN", year: "2021" });
  const all = [current, older, newer, sameYearA] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.deepEqual(
    result.map((r) => r.slug),
    ["beta", "delta", "zeta"],
  );
});

test("relatedCases devuelve slug, title, organization, year y logo", () => {
  const current = makeCase({ id: "a", organization: "HEINEKEN" });
  const other = makeCase({
    id: "b",
    organization: "HEINEKEN",
    year: "2020",
    logo: "/logo.png",
  });
  const all = [current, other] as any;

  const result = relatedCases(current as any, all, titleOf as any);

  assert.deepEqual(result, [
    { slug: "b", title: "b", organization: "HEINEKEN", year: "2020", logo: "/logo.png" },
  ]);
});

const descOf = (c: FakeCase) => c.data.title;

test("capabilityShowcase pone primero las Insignia (en el orden recibido) y luego Soporte por year desc", () => {
  const insignia = [
    makeCase({ id: "sofi", capabilities: ["RevOps"], year: "2024" }),
    makeCase({ id: "cms", capabilities: ["AI"], year: "2026" }),
  ];
  const soporte = [
    makeCase({ id: "old", capabilities: ["Gobernanza"], year: "2019" }),
    makeCase({ id: "cava", capabilities: ["RevOps"], year: "2025" }),
  ];

  const result = capabilityShowcase(insignia as any, soporte as any, descOf as any, titleOf as any);

  assert.deepEqual(result.projects.map((p) => p.id), ["sofi", "cms", "cava", "old"]);
  assert.deepEqual(result.projects.map((p) => p.isInsignia), [true, true, false, false]);
});

test("capabilityShowcase cuenta proyectos y capacidades de ambas capas sin duplicar", () => {
  const insignia = [makeCase({ id: "sofi", capabilities: ["RevOps", "AI"] })];
  const soporte = [makeCase({ id: "cava", capabilities: ["RevOps", "Gobernanza"] })];

  const result = capabilityShowcase(insignia as any, soporte as any, descOf as any, titleOf as any);

  assert.equal(result.total, 2);
  assert.deepEqual(result.tags, ["RevOps", "AI", "Gobernanza"]);
  assert.equal(result.capabilityCount, 3);
});

test("capabilityShowcase incluye el chip de una capacidad que solo tiene una Insignia", () => {
  const insignia = [makeCase({ id: "cms", capabilities: ["Sistemas con AI"] })];
  const soporte = [makeCase({ id: "cava", capabilities: ["Gobernanza"] })];

  const result = capabilityShowcase(insignia as any, soporte as any, descOf as any, titleOf as any);

  assert.ok(result.tags.includes("Sistemas con AI"));
});
