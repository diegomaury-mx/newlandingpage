import assert from "node:assert/strict";
import { test } from "node:test";
import type { PageObjectResponse } from "@notionhq/client";
import {
  cleanSummary,
  daysFromToday,
  eventDataSchema,
  isPublishableEvent,
  isThisWeek,
  isUpcoming,
  isWithinDays,
  mapEvent,
  relevanceDay,
  ticketLabel,
  toCalendarDay,
  todayInMexicoCity,
} from "./notionEvents.ts";

function fakePage(properties: Record<string, unknown>): PageObjectResponse {
  return { id: "evt-1", properties } as unknown as PageObjectResponse;
}

// --- Fechas ---------------------------------------------------------------

test("toCalendarDay recorta date y datetime al día natural", () => {
  assert.equal(toCalendarDay("2026-09-23"), "2026-09-23");
  assert.equal(toCalendarDay("2026-10-23T23:30:00.000Z"), "2026-10-23");
});

test("todayInMexicoCity devuelve YYYY-MM-DD en la zona de CDMX", () => {
  // 2026-01-02 05:00Z sigue siendo 2026-01-01 en CDMX (UTC-6).
  assert.equal(todayInMexicoCity(new Date("2026-01-02T05:00:00Z")), "2026-01-01");
});

test("relevanceDay usa el día de fin si el evento dura varios días", () => {
  assert.equal(relevanceDay({ start: "2026-09-21", end: "2026-09-24" }), "2026-09-24");
  assert.equal(relevanceDay({ start: "2026-09-21", end: null }), "2026-09-21");
});

test("isUpcoming: evento pasado excluido, evento de hoy incluido", () => {
  assert.equal(isUpcoming({ start: "2026-09-01", end: null }, "2026-09-10"), false);
  assert.equal(isUpcoming({ start: "2026-09-10", end: null }, "2026-09-10"), true);
});

test("isUpcoming: rango que empezó ayer pero termina mañana sigue vigente", () => {
  assert.equal(isUpcoming({ start: "2026-09-09", end: "2026-09-11" }, "2026-09-10"), true);
});

test("daysFromToday cuenta días naturales con signo, incluso cruzando meses y años", () => {
  assert.equal(daysFromToday("2026-09-15", "2026-09-10"), 5);
  assert.equal(daysFromToday("2026-09-10", "2026-09-10"), 0);
  assert.equal(daysFromToday("2026-09-05", "2026-09-10"), -5);
  assert.equal(daysFromToday("2026-11-08", "2026-09-30"), 39);
  assert.equal(daysFromToday("2027-01-05", "2026-12-31"), 5);
});

test("isWithinDays: ventana de 60 días", () => {
  assert.equal(isWithinDays({ start: "2026-11-05", end: null }, "2026-09-10", 60), true);
  assert.equal(isWithinDays({ start: "2026-11-20", end: null }, "2026-09-10", 60), false);
});

test("isThisWeek: dentro de hoy..hoy+6 y vigente", () => {
  assert.equal(isThisWeek({ start: "2026-09-13", end: null }, "2026-09-10"), true);
  assert.equal(isThisWeek({ start: "2026-09-18", end: null }, "2026-09-10"), false);
});

test("isWithinDays: dentro de los próximos 30 días", () => {
  assert.equal(isWithinDays({ start: "2026-10-05", end: null }, "2026-09-10", 30), true);
  assert.equal(isWithinDays({ start: "2026-10-20", end: null }, "2026-09-10", 30), false);
});

// --- Status de ticket ---------------------------------------------------

test("ticketLabel: solo 'Gratuito' pasa; el resto cae a 'Consultar en el enlace'", () => {
  assert.equal(ticketLabel("Gratuito"), "Gratuito");
  assert.equal(ticketLabel("Por Comprar"), "Consultar en el enlace");
  assert.equal(ticketLabel(undefined), "Consultar en el enlace");
});

test("cleanSummary aplana viñetas markdown y saltos de línea a una sola frase", () => {
  const raw = "- Registro por aprobación para un meetup.\n- Evento en CDMX.\n";
  assert.equal(cleanSummary(raw), "Registro por aprobación para un meetup. Evento en CDMX.");
  assert.equal(cleanSummary("Texto simple."), "Texto simple.");
  assert.equal(cleanSummary(""), "");
});

// --- mapEvent ---------------------------------------------------------------

const validProps = {
  Nombre: { type: "title", title: [{ plain_text: "FINNOSUMMIT" }] },
  "Fecha del evento": {
    type: "date",
    date: { start: "2026-09-23", end: "2026-09-24" },
  },
  Ciudad: { type: "select", select: { name: "CDMX" } },
  Modalidad: { type: "select", select: { name: "Presencial" } },
  Tipo: { type: "select", select: { name: "Summit" } },
  Categorías: {
    type: "multi_select",
    multi_select: [{ name: "Fintech" }, { name: "Startups" }],
  },
  Organizador: { type: "rich_text", rich_text: [{ plain_text: "Finnovista" }] },
  Resumen: { type: "rich_text", rich_text: [{ plain_text: "Punto de encuentro fintech." }] },
  "Enlace Oficial": { type: "url", url: "https://finnosummit.com/2026" },
  "Status de Ticket": { type: "select", select: { name: "Por Comprar" } },
  "Evento principal": { type: "relation", relation: [{ id: "parent-1" }] },
};

test("mapEvent produce exactamente la whitelist 8.2 y resuelve el evento padre", () => {
  const raw = mapEvent(fakePage(validProps), new Map([["parent-1", "FINNOSUMMIT (serie)"]]));
  assert.deepEqual(raw, {
    name: "FINNOSUMMIT",
    start: "2026-09-23",
    end: "2026-09-24",
    city: "CDMX",
    modality: "Presencial",
    type: "Summit",
    categories: ["Fintech", "Startups"],
    organizer: "Finnovista",
    summary: "Punto de encuentro fintech.",
    officialUrl: "https://finnosummit.com/2026",
    parentName: "FINNOSUMMIT (serie)",
    ticketStatus: "Por Comprar",
  });
});

test("mapEvent: evento de un solo día deja end en null y parentName vacío sin relación", () => {
  const props = {
    ...validProps,
    "Fecha del evento": { type: "date", date: { start: "2026-09-24", end: null } },
    "Evento principal": { type: "relation", relation: [] },
  };
  const raw = mapEvent(fakePage(props));
  assert.equal(raw.end, null);
  assert.equal(raw.parentName, "");
});

// --- eventDataSchema (whitelist estricta) ---------------------------------

function validData() {
  return {
    name: "FINNOSUMMIT",
    start: "2026-09-23",
    end: "2026-09-24",
    city: "CDMX",
    modality: "Presencial",
    type: "Summit",
    categories: ["Fintech"],
    organizer: "Finnovista",
    summary: "Resumen.",
    officialUrl: "https://finnosummit.com/2026",
    parentName: "",
    ticketStatus: "Por Comprar",
  };
}

test("eventDataSchema acepta una fila publicada válida", () => {
  assert.equal(eventDataSchema.safeParse(validData()).success, true);
});

test("eventDataSchema rompe si aparece una propiedad fuera de la whitelist", () => {
  const result = eventDataSchema.safeParse({ ...validData(), aiScore: 87 });
  assert.equal(result.success, false);
});

test("eventDataSchema: campos vacíos de la whitelist no rompen (caen a default)", () => {
  const parsed = eventDataSchema.parse({
    name: "Evento",
    start: "2026-09-23",
    officialUrl: "https://x.com/e",
  });
  assert.equal(parsed.end, null);
  assert.equal(parsed.summary, "");
  assert.deepEqual(parsed.categories, []);
});

test("eventDataSchema: sin Enlace Oficial válido no parsea", () => {
  assert.equal(
    eventDataSchema.safeParse({ ...validData(), officialUrl: "" }).success,
    false,
  );
  assert.equal(
    eventDataSchema.safeParse({ ...validData(), officialUrl: "javascript:alert(1)" }).success,
    false,
  );
});

// --- isPublishableEvent (gate del loader) --------------------------------

test("isPublishableEvent: exige Publicado + Enlace Oficial + vigencia", () => {
  const base = { officialUrl: "https://x.com/e", start: "2026-09-20", end: null };
  assert.equal(isPublishableEvent(base, "Publicado", "2026-09-10"), true);
  assert.equal(isPublishableEvent(base, "Borrador", "2026-09-10"), false);
  assert.equal(isPublishableEvent({ ...base, officialUrl: "" }, "Publicado", "2026-09-10"), false);
  assert.equal(isPublishableEvent(base, "Publicado", "2026-09-25"), false);
});
