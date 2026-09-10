/**
 * Lógica pura de fechas de la agenda `/eventos` — sin dependencias de Notion
 * ni de Astro, para poder importarse tanto en el loader (build) como en el
 * script de cliente de `EventsAgenda.astro` (recálculo "según pasan los días").
 *
 * `notionEvents.ts` re-exporta todo esto para no romper a sus consumidores.
 */

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

/** Época UTC (ms) de la medianoche de un día YYYY-MM-DD. */
function dayEpoch(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Diferencia en días naturales entre `day` (YYYY-MM-DD) y `todayMx`. */
export function daysFromToday(day: string, todayMx: string): number {
  return Math.round((dayEpoch(day) - dayEpoch(todayMx)) / 86_400_000);
}

/** "Esta semana": empieza entre hoy y hoy+6 (inclusive), y sigue vigente. */
export function isThisWeek(dates: EventDates, todayMx: string): boolean {
  if (!isUpcoming(dates, todayMx)) return false;
  const startDelta = daysFromToday(toCalendarDay(dates.start), todayMx);
  return startDelta <= 6;
}

/** "Próximos N días": empieza (o ya empezó y sigue) dentro de hoy..hoy+N. */
export function isWithinDays(
  dates: EventDates,
  todayMx: string,
  days: number,
): boolean {
  if (!isUpcoming(dates, todayMx)) return false;
  return daysFromToday(toCalendarDay(dates.start), todayMx) <= days;
}

// --- Vistas y partición ----------------------------------------------------

/** Nombres de vista horneados en `data-views` de cada tarjeta. */
export type EventViewFlag = "week" | "next30" | "next60";

/** Flags de vista vigentes para un evento contra un `todayMx` dado. */
export function eventViewFlags(
  dates: EventDates,
  todayMx: string,
): EventViewFlag[] {
  const flags: EventViewFlag[] = [];
  if (isThisWeek(dates, todayMx)) flags.push("week");
  if (isWithinDays(dates, todayMx, 30)) flags.push("next30");
  if (isWithinDays(dates, todayMx, 60)) flags.push("next60");
  return flags;
}

/**
 * Separa los eventos en los que siguen vigentes (ordenados por proximidad de
 * fecha de inicio, ascendente) y los que ya sucedieron. Es la unidad que el
 * loader usa en build y el script de cliente vuelve a correr en cada carga
 * con el `todayMx` real del visitante.
 */
export function partitionEvents<T extends EventDates>(
  events: readonly T[],
  todayMx: string,
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = [];
  const past: T[] = [];
  for (const ev of events) {
    if (isUpcoming(ev, todayMx)) upcoming.push(ev);
    else past.push(ev);
  }
  upcoming.sort((a, b) =>
    toCalendarDay(a.start).localeCompare(toCalendarDay(b.start)),
  );
  return { upcoming, past };
}
