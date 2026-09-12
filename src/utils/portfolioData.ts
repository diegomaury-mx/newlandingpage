import type { CollectionEntry } from 'astro:content';
import { slugify } from './slug.ts';

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

/** Iniciales de placeholder para el logo de una organizacion (3-4 chars). */
export function orgInitials(org: string): string {
  const words = org.split(/[\s/]+/).filter(Boolean);
  if (words.length === 0) return '—';
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export interface ShowcaseProject {
  id: string;
  org: string;
  /** El schema `cases` guarda `year` como string (`z.string().optional()`); aquí solo se muestra. */
  year: string | null;
  title: string;
  desc: string;
  logo: string | null;
  initials: string;
  tags: string[];
}

export interface CapabilityShowcase {
  projects: ShowcaseProject[];
  tags: string[];
  total: number;
  capabilityCount: number;
}

/**
 * Arma el "Capability Showcase Grid" de la seccion Soporte: proyectos
 * ordenados por año desc, encabezados por capacidad. `tags` son las
 * capacidades unicas en orden de primera aparicion — alimentan los
 * chips-filtro y el conteo del header, nunca se escriben a mano.
 */
export function capabilityShowcase(
  soporte: CaseEntry[],
  descOf: (c: CaseEntry) => string,
  titleOf: (c: CaseEntry) => string,
): CapabilityShowcase {
  const sorted = [...soporte].sort(
    (a, b) => (Number(b.data.year) || 0) - (Number(a.data.year) || 0),
  );
  const projects: ShowcaseProject[] = sorted.map((c) => {
    const org = c.data.organization ?? '—';
    return {
      id: slugify(c.data.title),
      org,
      year: c.data.year ?? null,
      title: titleOf(c),
      desc: descOf(c),
      logo: c.data.logo ?? null,
      initials: orgInitials(org),
      tags: c.data.capabilities,
    };
  });
  const tags: string[] = [];
  for (const project of projects) {
    for (const tag of project.tags) {
      if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return { projects, tags, total: projects.length, capabilityCount: tags.length };
}

export interface RelatedCase {
  slug: string;
  title: string;
  organization: string | null;
  year: string | null;
  logo: string | null;
}

/**
 * Navegacion cruzada entre fichas de caso (2026-09-12): sin curaduria manual
 * en Notion, se infiere de datos ya publicados. Misma `organization` pesa mas
 * que cualquier cantidad de `capabilities` compartidas (dos ediciones del
 * mismo cliente son mas relevantes entre si que dos clientes distintos con
 * la misma capacidad); a igualdad de score, gana el mas reciente y luego
 * orden alfabetico (desempate determinista, la API de Notion no garantiza
 * orden estable). Score 0 (nada en comun) no se muestra.
 */
export function relatedCases(
  current: CaseEntry,
  allCases: CaseEntry[],
  titleOf: (c: CaseEntry) => string,
): RelatedCase[] {
  const SAME_ORG_WEIGHT = 1000;
  const currentCapabilities = new Set(current.data.capabilities);

  const scored = allCases
    .filter((c) => c.id !== current.id && !c.data.draft)
    .map((c) => {
      const sameOrg = Boolean(current.data.organization) && c.data.organization === current.data.organization;
      const sharedCapabilities = c.data.capabilities.filter((cap) => currentCapabilities.has(cap)).length;
      const score = (sameOrg ? SAME_ORG_WEIGHT : 0) + sharedCapabilities;
      return { entry: c, score };
    })
    .filter(({ score }) => score > 0);

  scored.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    const yearA = Number(a.entry.data.year) || 0;
    const yearB = Number(b.entry.data.year) || 0;
    if (yearA !== yearB) return yearB - yearA;
    return a.entry.data.title.localeCompare(b.entry.data.title);
  });

  return scored.slice(0, 3).map(({ entry: c }) => ({
    slug: slugify(c.data.title),
    title: titleOf(c),
    organization: c.data.organization ?? null,
    year: c.data.year ?? null,
    logo: c.data.logo ?? null,
  }));
}

export const IMPACT_ANCHOR_SLUGS =['incmty-participantes-inscritos', 'rodi-sofi'];
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
