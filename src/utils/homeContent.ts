/**
 * Logica pura compartida entre src/pages/index.astro y src/pages/en/index.astro.
 * Antes de este modulo, en/index.astro era una copia verbatim de ~870 lineas
 * de index.astro (incluido el guardrail anti-desanonimizacion de SOFI,
 * BLOCKED_LOGO_NAMES, duplicado en dos archivos sin fuente unica). Todo lo
 * que vive aqui es identico en ambos locales salvo un parametro explicito
 * (base de /portfolio vs /en/portfolio) — el parseo del copy ES en si sigue
 * viviendo en cada pagina (parseSiteCopy.ts), eso NO se toca aqui.
 */
import type { CollectionEntry } from 'astro:content';

export const SECTION_IDS = {
  S1: 's1-hero',
  S2: 's2-quien-soy',
  S3: 's3-problema',
  S4: 's4-evidencia',
  S5: 's5-como-trabajo',
  S6: 's6-sistemas-propios',
  S6b: 's6b-prueba-social',
  S8: 's8-siguiente-paso',
} as const;

// FlipHouse deliberadamente bloqueado (2026-08-11): es el cliente real y
// confidencial detras del caso SOFI/PropTech. Mostrar su logo en el trust bar
// del home desanonimiza el caso al instante. No quitar este guardrail.
export const BLOCKED_LOGO_NAMES = new Set(['fliphouse']);

type ImageSlotEntry = CollectionEntry<'imageSlots'>;

export function slotSrc(imageSlotEntries: ImageSlotEntry[], slotId: string, fallback: string): string {
  const entry = imageSlotEntries.find((e) => e.id === slotId);
  return entry?.data.status === 'Listo' && entry.data.imageUrl ? entry.data.imageUrl : fallback;
}

// Cinturon de logos 100% dinamico desde CMS Imagenes (2026-08-14): un logo
// nuevo solo requiere una fila en CMS Imagenes con slot `logo-<algo>`, Estado
// "Listo", imagen subida y el campo "Nombre" (alt text) lleno. `logo-*-evidencia`
// queda excluido a proposito: son slots huerfanos del viejo diseno de S4.
export function heroLogosFrom(imageSlotEntries: ImageSlotEntry[]): { src: string; alt: string }[] {
  return imageSlotEntries
    .filter((e) => e.id.startsWith('logo-') && !e.id.endsWith('-evidencia'))
    .filter((e) => e.data.status === 'Listo' && e.data.imageUrl && e.data.nombre)
    .filter((e) => !BLOCKED_LOGO_NAMES.has(e.data.nombre.toLowerCase()))
    .sort((a, b) => a.data.nombre.localeCompare(b.data.nombre, 'es'))
    .map((e) => ({ src: e.data.imageUrl as string, alt: e.data.nombre }));
}

export function systemsLogo(
  imageSlotEntries: ImageSlotEntry[],
  title: string,
): { src: string; alt: string } | null {
  const key = title.toLowerCase();
  if (key.includes('redux')) return { src: slotSrc(imageSlotEntries, 'ip-logo-redux', '/assets/img/logos/redux.svg'), alt: 'REDUX' };
  if (key.includes('hacksureste')) return { src: slotSrc(imageSlotEntries, 'ip-logo-hacksureste', '/assets/img/logos/hacksureste.svg'), alt: 'HackSureste' };
  if (key.includes('sofi')) return { src: slotSrc(imageSlotEntries, 'ip-logo-sofi', '/assets/img/logos/sofi.svg'), alt: 'SOFI' };
  return null;
}

// Geometria del diagrama radial de S4 (solo desktop, >960px): nodos
// distribuidos a partes iguales alrededor de 360°, empezando arriba (-90°),
// en un sistema de coordenadas 0-100 que mapea 1:1 a porcentajes CSS sobre un
// contenedor cuadrado (aspect-ratio:1). Hibrido D+C (decision 2026-08-12): los
// campos son texto puro sin caja ni fondo opaco, asi que hace falta un gap
// real entre el final de la linea y el texto — por eso el radio de la
// linea/punto terminal (EVIDENCE_DOT_RADIUS) queda mas corto que el radio del
// texto (EVIDENCE_NODE_RADIUS).
export const EVIDENCE_NODE_RADIUS = 40;
export const EVIDENCE_DOT_RADIUS = 31;
// Medio ancho/alto (mismo sistema 0-100) de la caja del nodo central: el
// punto de arranque de cada linea se recorta al borde de esa caja en vez de
// partir del centro exacto (50,50), para que ninguna linea atraviese el texto
// del nodo central.
export const EVIDENCE_CENTER_HALF_WIDTH = 21;
export const EVIDENCE_CENTER_HALF_HEIGHT = 11;

export function evidencePoint(index: number, total: number, radius: number): { x: number; y: number } {
  const angle = ((-90 + index * (360 / total)) * Math.PI) / 180;
  return {
    x: Math.round((50 + radius * Math.cos(angle)) * 100) / 100,
    y: Math.round((50 + radius * Math.sin(angle)) * 100) / 100,
  };
}

export function evidenceLineStart(index: number, total: number): { x: number; y: number } {
  const angle = ((-90 + index * (360 / total)) * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = Math.min(
    Math.abs(c) > 1e-6 ? EVIDENCE_CENTER_HALF_WIDTH / Math.abs(c) : Infinity,
    Math.abs(s) > 1e-6 ? EVIDENCE_CENTER_HALF_HEIGHT / Math.abs(s) : Infinity,
  );
  return {
    x: Math.round((50 + t * c) * 100) / 100,
    y: Math.round((50 + t * s) * 100) / 100,
  };
}

export interface EvidenceField {
  key: string;
  label: string;
}

export function evidenceNodesFrom(fields: EvidenceField[]) {
  return fields.map((field, i) => ({
    ...field,
    node: evidencePoint(i, fields.length, EVIDENCE_NODE_RADIUS),
    dot: evidencePoint(i, fields.length, EVIDENCE_DOT_RADIUS),
    lineStart: evidenceLineStart(i, fields.length),
  }));
}

// Los 3 sistemas propios (REDUX, HackSureste Ops, SOFI) enlazan a la pagina
// de caso real del CMS (/portfolio/{slug} o /en/portfolio/{slug}). REDUX ya
// tiene ficha propia publicada (/portfolio/redux) desde el Sprint 1 de deuda
// tecnica 2026-08-19; deja de apuntar a la legacy estatica
// public/portfolio/redux-incmty.html.
export function systemsCaseLink(title: string, portfolioBase: '/portfolio' | '/en/portfolio'): string | null {
  const key = title.toLowerCase();
  if (key.includes('sofi')) return `${portfolioBase}/sofi`;
  if (key.includes('hacksureste')) return `${portfolioBase}/hacksureste`;
  if (key.includes('redux')) return `${portfolioBase}/redux`;
  return null;
}

// --- Destinos de CTA (resueltos por la etiqueta ORIGINAL en espanol) ---------
export const CV_HREF = '/cv/diego-maury-cv.pdf';
export const LINKEDIN_HREF = 'https://www.linkedin.com/in/diegomaury';
export const MAIL_HREF = 'mailto:dm@diegomaury.mx';
export const CALENDAR_HREF = 'https://calendar.notion.so/meet/diegomaurymx/5aad3vun';

export interface CtaTarget {
  href: string;
  download?: boolean;
  external?: boolean;
}

// El mapeo se resuelve por la ETIQUETA del boton en espanol (nunca por su
// posicion) — ver CLAUDE.md, AUD-001: un mapeo posicional mandaba "Ver casos
// de estudio" a Calendly. La version EN pasa la etiqueta ORIGINAL sin
// traducir (previo a `t()`), asi que el mismo matching en espanol aplica
// identico en ambos locales.
export function ctaTarget(label: string, portfolioBase: '/portfolio' | '/en/portfolio'): CtaTarget {
  const l = label.toLowerCase();
  if (l.includes('caso') || l.includes('portafolio')) return { href: portfolioBase };
  if (l.includes('cv')) return { href: CV_HREF, download: true };
  if (l.includes('linkedin')) return { href: LINKEDIN_HREF, external: true };
  if (l.includes('correo')) return { href: MAIL_HREF };
  return { href: CALENDAR_HREF, external: true };
}
