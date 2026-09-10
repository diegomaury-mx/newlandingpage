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
import { isUpcoming } from "./eventDates.ts";

// --- Fechas ---------------------------------------------------------------
// La lógica pura de fechas vive en `eventDates.ts` (client-safe, la comparte
// el script de cliente de EventsAgenda). Se re-exporta aquí por back-compat.
export {
  toCalendarDay,
  todayInMexicoCity,
  relevanceDay,
  isUpcoming,
  daysFromToday,
  isThisWeek,
  isWithinDays,
  eventViewFlags,
  partitionEvents,
} from "./eventDates.ts";
export type { EventDates, EventViewFlag } from "./eventDates.ts";

// --- Status de ticket (whitelist "Parcial") --------------------------------

export const TICKET_FREE_VALUE = "Gratuito";

/**
 * Contrato 8.2: se muestra "Gratuito" solo si ese es el valor exacto;
 * cualquier otro valor o vacío se renderiza como "Consultar en el enlace".
 */
export function ticketLabel(raw: string | undefined): string {
  return raw === TICKET_FREE_VALUE ? TICKET_FREE_VALUE : "Consultar en el enlace";
}

// --- Resumen --------------------------------------------------------------

/**
 * Contrato 8.2: `Resumen` es texto plano de máx. 2 frases. La curaduría a
 * veces deja viñetas markdown (`- `) o saltos de línea; aquí se aplana a una
 * sola línea sin marcadores para renderizarlo limpio en la tarjeta.
 */
export function cleanSummary(raw: string): string {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*•]\s+/, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// --- Schema (whitelist 8.2, estricto) --------------------------------------

/** Campos de prosa que se traducen a inglés (DeepL, cacheado) para `/en/events`. */
export const EVENT_TRANSLATABLE_FIELDS = ["summary"] as const;

/**
 * Whitelist de publicación (Data Contract v2, sección 8.2), como factory
 * parametrizada por la instancia de Zod. `.strict()`: una propiedad fuera de
 * la lista rompe el build a propósito.
 *
 * Es factory (no una constante) porque `content.config.ts` debe pasar el `z`
 * de `astro:content` — Astro genera el JSON schema del editor con su propia
 * copia de Zod y falla ("Cannot read properties of undefined") si recibe un
 * schema construido con otra instancia. Los tests (que no pueden importar
 * `astro:content`) pasan el `zod` del paquete directo.
 */
type ZodLike = typeof z;

export function makeEventDataSchema(zod: ZodLike) {
  const httpUrl = zod
    .string()
    .url()
    .refine((v: string) => /^https?:\/\//i.test(v), {
      message: "La URL debe usar esquema http:// o https://",
    });
  return zod
    .object({
      name: zod.string().min(1),
      // Fecha del evento (inicio y fin). ISO date o datetime; `end` null si es
      // de un solo día.
      start: zod.string().min(1),
      end: zod.string().nullable().default(null),
      city: zod.string().optional(),
      modality: zod.string().optional(),
      type: zod.string().optional(),
      categories: zod.array(zod.string()).default([]),
      organizer: zod.string().default(""),
      summary: zod.string().default(""),
      officialUrl: httpUrl,
      // "Evento principal": solo el nombre del evento padre, nunca la relación
      // completa ni un link a Notion.
      parentName: zod.string().default(""),
      // "Status de Ticket": valor crudo; ticketLabel() aplica la regla parcial.
      ticketStatus: zod.string().optional(),
      en: zod
        .object(
          Object.fromEntries(
            EVENT_TRANSLATABLE_FIELDS.map((f) => [f, zod.string().optional()]),
          ),
        )
        .default({}),
    })
    .strict();
}

/** Schema construido con el Zod del paquete directo — para tests y para el
 * tipo `EventData`. `content.config.ts` construye el suyo con el `z` de Astro. */
export const eventDataSchema = makeEventDataSchema(z);

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
    summary: cleanSummary(getRichText(page, "Resumen")),
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
