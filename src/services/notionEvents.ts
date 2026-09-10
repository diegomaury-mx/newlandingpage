/**
 * Quinta fuente de Diego CMS: agenda pública `/eventos` (+ `/en/events`).
 *
 * Fuente: base "📆 Meetups y Eventos: Ecosistema Tech & Innovation"
 * (data source 7c2e4e81…). Contrato: "📆 Pipeline de Eventos · Data Contract v2",
 * sección 8 (espejo técnico en docs/platform/notion-astro-contract.md).
 *
 * Reglas duras del contrato aplicadas aquí:
 * - Solo se lee la whitelist 8.2. `eventDataSchema` es `.strict()`: una
 *   propiedad fuera de la lista rompe el build a propósito (igual que el
 *   guardrail de las fichas Insignia).
 * - Filtro: `Publicación == "Publicado"` Y fecha de fin (o inicio si no hay
 *   fin) >= hoy en America/Mexico_City. Todo lo demás se descarta antes de
 *   renderizar. Sin `Enlace Oficial` no hay tarjeta.
 * - El loader NO lee el body de las páginas de evento, solo propiedades: los
 *   bloques `ai_block` de Notion no aplican.
 * - `Sede` (tipo `place`) se OMITE en v1: la API de Notion no la expone de
 *   forma estable (`notAvailableInQuerySql`) y el contrato 8.3 autoriza
 *   omitirla si no está disponible.
 */
import { z } from "zod";
import type { PageObjectResponse } from "@notionhq/client";
import {
  getDateRange,
  getMultiSelect,
  getRichText,
  getSelect,
  getTitle,
  getUrl,
  getRelationIds,
} from "./notionClient.ts";

// --- Fechas -----------------------------------------------------------------

/** Día natural (YYYY-MM-DD) de un valor de fecha de Notion, que puede ser
 * date (`2026-09-23`) o datetime (`2026-10-23T23:30:00.000Z`). */
export function toCalendarDay(value: string): string {
  return value.slice(0, 10);
}

/** Hoy en America/Mexico_City como YYYY-MM-DD. `now` inyectable para tests. */
export function todayInMexicoCity(now: Date = new Date()): string {
  // en-CA da el formato ISO YYYY-MM-DD directo.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export interface EventDates {
  start: string;
  end: string | null;
}

/**
 * Día contra el que se decide si el evento sigue vigente: el de fin si el
 * evento dura varios días, el de inicio si es de un solo día. Un evento cuyo
 * primer día ya pasó pero termina hoy o después sigue en cartelera.
 */
export function relevanceDay(dates: EventDates): string {
  return toCalendarDay(dates.end ?? dates.start);
}

/** True si el evento no ha terminado (fin, o inicio) antes de hoy en CDMX. */
export function isUpcoming(dates: EventDates, todayMx: string): boolean {
  return relevanceDay(dates) >= todayMx;
}

/** Diferencia en días naturales entre `day` (YYYY-MM-DD) y `todayMx`. */
export function daysFromToday(day: string, todayMx: string): number {
  const a = Date.UTC(...(day.split("-").map(Number) as [number, number, number]));
  const b = Date.UTC(
    ...(todayMx.split("-").map(Number) as [number, number, number]),
  );
  // Number("2026") etc; el mes viene 1-based, Date.UTC lo espera 0-based, pero
  // como se aplica igual a ambos lados la diferencia se conserva.
  return Math.round((a - b) / 86_400_000);
}

/** "Esta semana": empieza entre hoy y hoy+6 (inclusive), y sigue vigente. */
export function isThisWeek(dates: EventDates, todayMx: string): boolean {
  if (!isUpcoming(dates, todayMx)) return false;
  const startDelta = daysFromToday(toCalendarDay(dates.start), todayMx);
  return startDelta <= 6;
}

/** "Próximos 30 días": empieza (o ya empezó y sigue) dentro de hoy..hoy+30. */
export function isWithinDays(
  dates: EventDates,
  todayMx: string,
  days: number,
): boolean {
  if (!isUpcoming(dates, todayMx)) return false;
  return daysFromToday(toCalendarDay(dates.start), todayMx) <= days;
}

// --- Status de ticket (whitelist "Parcial") --------------------------------

export const TICKET_FREE_VALUE = "Gratuito";

/**
 * Contrato 8.2: se muestra "Gratuito" solo si ese es el valor exacto;
 * cualquier otro valor o vacío se renderiza como "Consultar en el enlace".
 */
export function ticketLabel(raw: string | undefined): string {
  return raw === TICKET_FREE_VALUE ? TICKET_FREE_VALUE : "Consultar en el enlace";
}

// --- Schema (whitelist 8.2, estricto) --------------------------------------

/** Campos de prosa que se traducen a inglés (DeepL, cacheado) para `/en/events`. */
export const EVENT_TRANSLATABLE_FIELDS = ["summary"] as const;

const httpUrl = z
  .string()
  .url()
  .refine((v) => /^https?:\/\//i.test(v), {
    message: "La URL debe usar esquema http:// o https://",
  });

/**
 * Whitelist de publicación (Data Contract v2, sección 8.2). `.strict()`: si
 * el mapper deja pasar una propiedad que no está aquí, el build rompe.
 */
export const eventDataSchema = z
  .object({
    name: z.string().min(1),
    // Fecha del evento (inicio y fin). ISO date o datetime; `end` null si es
    // de un solo día.
    start: z.string().min(1),
    end: z.string().nullable().default(null),
    city: z.string().optional(),
    modality: z.string().optional(),
    type: z.string().optional(),
    categories: z.array(z.string()).default([]),
    organizer: z.string().default(""),
    summary: z.string().default(""),
    officialUrl: httpUrl,
    // "Evento principal": solo el nombre del evento padre, nunca la relación
    // completa ni un link a Notion.
    parentName: z.string().default(""),
    // "Status de Ticket": se guarda el valor crudo; ticketLabel() aplica la
    // regla parcial al renderizar.
    ticketStatus: z.string().optional(),
    en: z
      .object(
        Object.fromEntries(
          EVENT_TRANSLATABLE_FIELDS.map((f) => [f, z.string().optional()]),
        ),
      )
      .default({}),
  })
  .strict();

export type EventData = z.infer<typeof eventDataSchema>;

// --- Mapper propiedad Notion -> shape del schema --------------------------

/**
 * Fila de la base de eventos -> data de la colección `events`.
 * `parentNameById` resuelve la relación "Evento principal" al título del
 * evento padre (se construye en el loader con TODAS las filas, publicadas o
 * no, porque el padre puede no estar publicado).
 */
export function mapEvent(
  page: PageObjectResponse,
  parentNameById: ReadonlyMap<string, string> = new Map(),
): Record<string, unknown> {
  const dates = getDateRange(page, "Fecha del evento");
  const [parentId] = getRelationIds(page, "Evento principal");
  return {
    name: getTitle(page, "Nombre"),
    start: dates?.start ?? "",
    end: dates?.end ?? null,
    city: getSelect(page, "Ciudad"),
    modality: getSelect(page, "Modalidad"),
    type: getSelect(page, "Tipo"),
    categories: getMultiSelect(page, "Categorías"),
    organizer: getRichText(page, "Organizador"),
    summary: getRichText(page, "Resumen"),
    officialUrl: getUrl(page, "Enlace Oficial"),
    parentName: (parentId && parentNameById.get(parentId)) || "",
    ticketStatus: getSelect(page, "Status de Ticket"),
  };
}

/** True si la fila cumple el gate mínimo del loader (contrato 8.3):
 * `Publicación == Publicado`, tiene Enlace Oficial y sigue vigente. */
export function isPublishableEvent(
  raw: { officialUrl?: unknown; start?: unknown; end?: unknown },
  publicationValue: string | undefined,
  todayMx: string,
): boolean {
  if (publicationValue !== "Publicado") return false;
  if (typeof raw.officialUrl !== "string" || !/^https?:\/\//i.test(raw.officialUrl)) {
    return false;
  }
  if (typeof raw.start !== "string" || !raw.start) return false;
  const end = typeof raw.end === "string" && raw.end ? raw.end : null;
  return isUpcoming({ start: raw.start, end }, todayMx);
}
