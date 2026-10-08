/**
 * Parser de S2 · Quién soy para el layout 1B. Lee por TIPO de bloque, no por
 * posición: el parseo posicional anterior (`paragraphs(s2)[0..8]`) dejó la
 * banda de cifras sin renderizar en cuanto Notion tuvo un párrafo menos.
 *
 * Estructura esperada en Copy Oficial (S2):
 *   ## titular (tesis)
 *   intro (1+ párrafos)
 *   línea de cifras "30+ proyectos • 15+ años • ..."
 *   ### label de roles
 *   "Rol: descripción" x N
 *   ### label del método
 *   método (1+ párrafos)
 *
 * `blocksToMarkdown` usa `plain_text`, así que las negritas de Notion
 * (`**Rol**:`) llegan sin asteriscos: el título del rol es el texto antes del
 * primer ": ".
 */
import { blocksBeforeHeading, headingCards, heading2, paragraphs } from './parseSiteCopy.ts';

export interface AboutRole {
  title: string;
  text: string;
}

export interface AboutCopy {
  headline: string;
  intro: string[];
  statsRaw: string[];
  rolesLabel: string;
  roles: AboutRole[];
  methodLabel: string;
  method: string[];
}

const STATS_SEPARATOR = '•';
const ROLE_TITLE_SEPARATOR = ': ';
// Un título de rol es corto ("Arquitecto de sistemas"); un prefijo más largo
// es una frase con ":" a mitad, no un título.
const MAX_ROLE_TITLE_LENGTH = 40;

export function splitRole(paragraph: string): AboutRole {
  const index = paragraph.indexOf(ROLE_TITLE_SEPARATOR);
  if (index <= 0 || index > MAX_ROLE_TITLE_LENGTH) return { title: '', text: paragraph };
  return {
    title: paragraph.slice(0, index).trim(),
    text: paragraph.slice(index + ROLE_TITLE_SEPARATOR.length).trim(),
  };
}

export function parseAbout(blocks: string[]): AboutCopy {
  const lead = paragraphs(blocksBeforeHeading(blocks, ['### ']));
  const statsLine = lead.find((p) => p.includes(STATS_SEPARATOR)) ?? '';
  const [rolesCard, methodCard] = headingCards(blocks, '### ');

  return {
    headline: heading2(blocks),
    intro: lead.filter((p) => p !== statsLine),
    statsRaw: statsLine
      .split(STATS_SEPARATOR)
      .map((s) => s.trim())
      .filter(Boolean),
    rolesLabel: rolesCard?.title ?? '',
    roles: (rolesCard?.paragraphs ?? []).map(splitRole),
    methodLabel: methodCard?.title ?? '',
    method: methodCard?.paragraphs ?? [],
  };
}
