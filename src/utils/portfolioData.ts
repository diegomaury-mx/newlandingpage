import type { CollectionEntry } from 'astro:content';

type CaseEntry = CollectionEntry<'cases'>;
type MetricEntry = CollectionEntry<'metrics'>;

/**
 * Reglas de negocio de /portfolio compartidas entre la version ES
 * (portfolio.astro) y EN (en/portfolio.astro) — antes reimplementadas 2 veces
 * sin fuente unica (orden Insignia, listas de slugs de impacto, conteo de
 * catalogo, metricBySlug).
 */

export const CONTEXT_LINE_MAX = 160;

/** Recorta a `max` caracteres con elipsis; string vacio si `text` es vacio/undefined. */
export function truncate(text: string, max: number = CONTEXT_LINE_MAX): string {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/**
 * Orden manual via `insigniaOrder` (propiedad Notion "Orden Insignia"); sin
 * featured, los casos Insignia pesan igual. Fallback determinista si falta
 * el campo: year desc, luego title (la API de Notion no garantiza orden
 * estable de llegada). `locale` afecta solo el desempate por title.
 */
export function sortInsignia(cases: CaseEntry[], locale: string): CaseEntry[] {
  return [...cases].sort((a, b) => {
    const orderA = a.data.insigniaOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.insigniaOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    const yearA = Number(a.data.year) || 0;
    const yearB = Number(b.data.year) || 0;
    if (yearA !== yearB) return yearB - yearA;
    return a.data.title.localeCompare(b.data.title, locale);
  });
}

/** Cifras de la franja "Por los números": se calculan solas del contenido publicado. */
export function catalogCounts(
  cases: CaseEntry[],
): { total: number; organizations: number; capabilities: number } {
  const organizations = new Set(
    cases.map((c) => c.data.organization).filter((org): org is string => Boolean(org)),
  ).size;
  const capabilities = new Set(cases.flatMap((c) => c.data.capabilities)).size;
  return { total: cases.length, organizations, capabilities };
}

export const IMPACT_ANCHOR_SLUGS = ['incmty-participantes-inscritos', 'rodi-sofi'];
export const IMPACT_SUPPORT_SLUGS = [
  'heineken-proyectos-evaluados',
  'hacksureste-participantes',
  'heineken-crecimiento-regional',
  'fliphouse-leads-crm',
  'sofi-cobertura-automatica',
  'fliphouse-speed-to-lead',
];

/** Metrica `buildable` por slug, o undefined si esta retirada/no existe. */
export function metricBySlug(metrics: MetricEntry[], slug: string): MetricEntry | undefined {
  return metrics.find((entry) => entry.data.slug === slug && entry.data.buildable);
}

/** Resuelve las cifras ancla y de apoyo de la franja de impacto, siempre leidas de `metrics`. */
export function impactMetrics(
  metrics: MetricEntry[],
): { anchors: MetricEntry[]; support: MetricEntry[] } {
  const resolve = (slugs: string[]) =>
    slugs.map((slug) => metricBySlug(metrics, slug)).filter((m): m is MetricEntry => Boolean(m));
  return { anchors: resolve(IMPACT_ANCHOR_SLUGS), support: resolve(IMPACT_SUPPORT_SLUGS) };
}
