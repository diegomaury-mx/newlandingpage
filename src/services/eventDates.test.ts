import assert from "node:assert/strict";
import { test } from "node:test";
import { eventViewFlags, partitionEvents } from "./eventDates.ts";

const TODAY = "2026-09-10";

// --- eventViewFlags ------------------------------------------------------

test("eventViewFlags: evento de esta semana marca week/next30/next60", () => {
  assert.deepEqual(
    eventViewFlags({ start: "2026-09-13", end: null }, TODAY),
    ["week", "next30", "next60"],
  );
});

test("eventViewFlags: evento a 45 días solo marca next60", () => {
  assert.deepEqual(
    eventViewFlags({ start: "2026-10-25", end: null }, TODAY),
    ["next60"],
  );
});

test("eventViewFlags: evento ya sucedido no marca ninguna vista", () => {
  assert.deepEqual(eventViewFlags({ start: "2026-09-01", end: null }, TODAY), []);
});

// --- partitionEvents ---------------------------------------------------

test("partitionEvents: separa vigentes de pasados", () => {
  const events = [
    { start: "2026-09-05", end: null, id: "pasado" },
    { start: "2026-09-20", end: null, id: "futuro" },
    { start: "2026-09-10", end: null, id: "hoy" },
  ];
  const { upcoming, past } = partitionEvents(events, TODAY);
  assert.deepEqual(
    upcoming.map((e) => e.id),
    ["hoy", "futuro"],
  );
  assert.deepEqual(
    past.map((e) => e.id),
    ["pasado"],
  );
});

test("partitionEvents: ordena los vigentes por proximidad de inicio", () => {
  const events = [
    { start: "2026-11-01", end: null, id: "c" },
    { start: "2026-09-15", end: null, id: "a" },
    { start: "2026-10-01", end: null, id: "b" },
  ];
  const { upcoming } = partitionEvents(events, TODAY);
  assert.deepEqual(
    upcoming.map((e) => e.id),
    ["a", "b", "c"],
  );
});

test("partitionEvents: rango que empezó ayer pero termina mañana sigue vigente", () => {
  const events = [{ start: "2026-09-09", end: "2026-09-11", id: "en-curso" }];
  const { upcoming, past } = partitionEvents(events, TODAY);
  assert.deepEqual(upcoming.map((e) => e.id), ["en-curso"]);
  assert.equal(past.length, 0);
});

test("partitionEvents: lista vacía devuelve dos arreglos vacíos", () => {
  const { upcoming, past } = partitionEvents([], TODAY);
  assert.deepEqual(upcoming, []);
  assert.deepEqual(past, []);
});

test("partitionEvents: no muta el arreglo de entrada", () => {
  const events = [
    { start: "2026-11-01", end: null },
    { start: "2026-09-15", end: null },
  ];
  const snapshot = events.map((e) => e.start);
  partitionEvents(events, TODAY);
  assert.deepEqual(
    events.map((e) => e.start),
    snapshot,
  );
});
