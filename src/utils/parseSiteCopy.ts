/**
 * Parser del markdown plano de la coleccion `siteCopy` (singleton "Copy
 * Oficial · diegomaury.mx (SSOT)"). El body llega aplanado por
 * `blocksToMarkdown` (ver notionLoaders.ts): cada bloque original de Notion
 * es una entrada separada por "\n\n". Las secciones del documento estan
 * demarcadas por headings heading_1 con el patron "S<n> · <Nombre>" (mas
 * "SEO · Metadatos"), definido en la estructura S1-S8 del SSOT — ver memoria
 * notion-copy-activo-ssot.
 */

const SECTION_HEADING = /^# (S\d+b?|SEO) · (.+)$/;

export interface SiteCopySection {
  key: string;
  label: string;
  blocks: string[];
}

/** Divide el markdown en secciones S1-S8/SEO, heading de seccion excluido. */
export function parseSiteCopySections(markdown: string): Map<string, SiteCopySection> {
  const blocks = markdown.split('\n\n');
  const sections = new Map<string, SiteCopySection>();
  let current: SiteCopySection | null = null;
  for (const block of blocks) {
    const match = block.match(SECTION_HEADING);
    if (match) {
      current = { key: match[1], label: match[2], blocks: [] };
      sections.set(current.key, current);
      continue;
    }
    if (current) current.blocks.push(block);
  }
  return sections;
}

export function heading1(blocks: string[]): string {
  return blocks.find((b) => b.startsWith('# '))?.slice(2).trim() ?? '';
}

export function heading2(blocks: string[]): string {
  return blocks.find((b) => b.startsWith('## '))?.slice(3).trim() ?? '';
}

/** Bloques de texto corrido: excluye headings, divisores, citas, codigo, listas y placeholders entre corchetes. */
export function paragraphs(blocks: string[]): string[] {
  return blocks
    .map((b) => b.trim())
    .filter(
      (b) =>
        b !== '' &&
        b !== '---' &&
        !b.startsWith('#') &&
        !b.startsWith('>') &&
        !b.startsWith('```') &&
        !b.startsWith('[') &&
        !b.startsWith('- ') &&
        !b.startsWith('1. '),
    );
}

/** Extrae las etiquetas de CTA de un bloque tipo "[ Label uno ]  [ Label dos ]". */
export function ctaLabels(blocks: string[]): string[] {
  const line = blocks.find((b) => /\[[^\]]+\]/.test(b));
  if (!line) return [];
  return [...line.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1].trim());
}

/** Valor del bloque inmediatamente posterior a un bloque de texto exacto (patron "Label" / "Valor" del bloque SEO). */
export function valueAfter(blocks: string[], label: string): string {
  const index = blocks.findIndex((b) => b.trim() === label);
  if (index === -1 || index + 1 >= blocks.length) return '';
  return blocks[index + 1].trim();
}
