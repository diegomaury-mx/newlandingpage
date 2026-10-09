/**
 * Cifras de S2 · Quién soy. Cada cifra sale de la línea de cifras de Notion
 * (`30+ proyectos liderados • 15+ años de trayectoria • ...`) y su nota fija se
 * decide por el TIPO de cifra (leído de la etiqueta en español), no por su
 * posición: antes la 3.ª cifra heredaba por posición el número y la nota de la
 * métrica de INCmty, y cualquier otra cifra puesta ahí salía mezclada
 * ("9,905 sectores transformados").
 */

export type StatKind = 'projects' | 'years' | 'other';

export interface AboutStat {
  n: string;
  l: string;
  s: string;
}

/** Notas fijas por tipo de cifra; un tipo sin nota ('other') no lleva ninguna. */
export interface StatSublabels {
  projects: string;
  years: string;
}

const STAT_PATTERN = /^([\d.,]+\+?)\s*(.+)$/;

export function classifyStat(raw: string): StatKind {
  if (/proyecto/i.test(raw)) return 'projects';
  if (/a[ñn]os/i.test(raw)) return 'years';
  return 'other';
}

/**
 * @param rawsEs      líneas de cifras en español (deciden el tipo)
 * @param rawsDisplay las mismas líneas ya traducidas, o las propias en ES
 *                    (decide el texto visible); mismo largo y orden que rawsEs
 */
export function buildAboutStats(
  rawsEs: string[],
  rawsDisplay: string[],
  sublabels: StatSublabels,
): AboutStat[] {
  return rawsDisplay.map((raw, index) => {
    const match = raw.match(STAT_PATTERN);
    const kind = classifyStat(rawsEs[index] ?? raw);
    return {
      n: match ? match[1] : raw,
      l: match ? match[2] : '',
      s: kind === 'other' ? '' : sublabels[kind],
    };
  });
}
