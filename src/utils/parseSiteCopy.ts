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

/** Bloques anteriores al primer heading (cualquier nivel) cuyo texto empiece con alguno de `headingPrefixes`. */
export function blocksBeforeHeading(blocks: string[], headingPrefixes: string[]): string[] {
  const result: string[] = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (headingPrefixes.some((prefix) => trimmed.startsWith(prefix))) break;
    result.push(block);
  }
  return result;
}

export interface CaseCardCopy {
  title: string;
  situation: string;
  action: string;
  results: string[];
  autopsy: string;
}

/**
 * Tarjetas de caso de S4 · Evidencia: cada heading_3 ("### <emoji> <titulo>")
 * abre una tarjeta; los campos Situacion/Accion/Autopsia llegan como texto
 * plano (sin "**", que es solo anotacion de negritas perdida por
 * blocksToMarkdown) prefijado por su nombre y dos puntos.
 */
export function caseCards(blocks: string[]): CaseCardCopy[] {
  const cards: CaseCardCopy[] = [];
  let current: CaseCardCopy | null = null;
  for (const raw of blocks) {
    const block = raw.trim();
    if (block.startsWith('### ')) {
      if (current) cards.push(current);
      current = { title: block.slice(4).trim(), situation: '', action: '', results: [], autopsy: '' };
      continue;
    }
    if (!current) continue;
    const situation = block.match(/^Situaci[oó]n:\s*(.+)$/i);
    if (situation) { current.situation = situation[1].trim(); continue; }
    const action = block.match(/^Acci[oó]n:\s*(.+)$/i);
    if (action) { current.action = action[1].trim(); continue; }
    if (block.startsWith('- ')) { current.results.push(block.slice(2).trim()); continue; }
    const autopsy = block.match(/^Autopsia:\s*(.+)$/i);
    if (autopsy) { current.autopsy = autopsy[1].trim(); continue; }
  }
  if (current) cards.push(current);
  return cards;
}

export interface MarkdownTable {
  header: string[];
  rows: string[][];
}

/** Primera tabla markdown (bloque "| ... |\n| --- |\n..." generado por blocksToMarkdown para bloques `table`). */
export function firstTable(blocks: string[]): MarkdownTable | null {
  const block = blocks.find((b) => b.trim().startsWith('|'));
  if (!block) return null;
  const parseRow = (line: string): string[] =>
    line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
  const [headerLine, , ...rowLines] = block.trim().split('\n').filter(Boolean);
  if (!headerLine) return null;
  return { header: parseRow(headerLine), rows: rowLines.map(parseRow) };
}

/**
 * Contenido del primer bloque de codigo (entre las dos entradas "```" que
 * blocksToMarkdown genera por separado). Si el texto del codigo trae lineas
 * en blanco propias (ej. el diagrama ASCII de S3), esas lineas en blanco se
 * interpretan como separadores "\n\n" al aplanar la pagina entera a
 * markdown, partiendo el contenido en varios bloques: se reconstruyen
 * uniendo todo lo que hay entre el "```" de apertura y el de cierre.
 */
export function firstCodeBlock(blocks: string[]): string {
  const start = blocks.findIndex((b) => b.trim() === '```');
  if (start === -1) return '';
  const end = blocks.findIndex((b, i) => i > start && b.trim() === '```');
  if (end === -1) return blocks[start + 1]?.trim() ?? '';
  return blocks.slice(start + 1, end).join('\n\n').trim();
}

/** Bloques desde (sin incluir) el primer heading cuyo texto empiece con `headingPrefix`. Vacio si no aparece. */
export function blocksAfterHeading(blocks: string[], headingPrefix: string): string[] {
  const index = blocks.findIndex((b) => b.trim().startsWith(headingPrefix));
  if (index === -1) return [];
  return blocks.slice(index + 1);
}

/** Items de lista con vinetas ("- texto"), sin la vineta. */
export function bulletItems(blocks: string[]): string[] {
  return blocks.filter((b) => b.trim().startsWith('- ')).map((b) => b.trim().slice(2).trim());
}

export interface HeadingCard {
  title: string;
  paragraphs: string[];
}

/**
 * Agrupa bloques en tarjetas: cada heading con `headingPrefix` ("### " o
 * "## ") abre una tarjeta; los parrafos siguientes (no divisores ni otros
 * headings) se acumulan como su contenido, hasta la proxima tarjeta.
 */
export function headingCards(blocks: string[], headingPrefix: string): HeadingCard[] {
  const cards: HeadingCard[] = [];
  let current: HeadingCard | null = null;
  for (const raw of blocks) {
    const block = raw.trim();
    if (block.startsWith(headingPrefix)) {
      if (current) cards.push(current);
      current = { title: block.slice(headingPrefix.length).trim(), paragraphs: [] };
      continue;
    }
    if (!current) continue;
    if (block === '' || block === '---' || block.startsWith('#')) continue;
    current.paragraphs.push(block);
  }
  if (current) cards.push(current);
  return cards;
}

export interface FlowDiagram {
  fromLabel: string;
  fromItems: string[];
  connectorLabel: string;
  connectorItems: string[];
  toLabel: string;
  toItems: string[];
}

/**
 * Parsea el diagrama ASCII de "Asi trabajo" (S3, bloque de codigo con cajas
 * de texto dibujadas con caracteres de caja) en 3 grupos: origen, conector y
 * destino. Devuelve null si no reconoce al menos 3 encabezados.
 */
export function parseFlowDiagram(raw: string): FlowDiagram | null {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const labels: string[] = [];
  const itemGroups: string[][] = [];
  let currentItems: string[] | null = null;
  for (const line of lines) {
    const boxHeader = line.match(/^│\s*([A-ZÁÉÍÓÚÑ ]+?)\s*│$/);
    if (boxHeader) {
      labels.push(boxHeader[1].trim());
      currentItems = [];
      itemGroups.push(currentItems);
      continue;
    }
    const bullet = line.match(/^│?\s*•\s*(.+)$/);
    if (bullet) {
      if (!currentItems) {
        currentItems = [];
        itemGroups.push(currentItems);
      }
      currentItems.push(bullet[1].replace(/│\s*$/, '').trim());
      continue;
    }
    if (/^[A-ZÁÉÍÓÚÑ ]+$/.test(line) && !line.includes('│') && line.length > 2) {
      labels.push(line);
      currentItems = [];
      itemGroups.push(currentItems);
    }
  }
  if (labels.length < 3) return null;
  return {
    fromLabel: labels[0],
    fromItems: itemGroups[0] ?? [],
    connectorLabel: labels[1],
    connectorItems: itemGroups[1] ?? [],
    toLabel: labels[2],
    toItems: itemGroups[2] ?? [],
  };
}

export interface TestimonialCopy {
  quote: string;
  name: string;
  roleLines: string[];
}

/** Testimonios S6b: bloque de cita ("> ...") abre cada uno; el primer parrafo posterior es el nombre, el resto son lineas de rol/empresa. */
export function testimonials(blocks: string[]): TestimonialCopy[] {
  const items: TestimonialCopy[] = [];
  let current: TestimonialCopy | null = null;
  for (const raw of blocks) {
    const block = raw.trim();
    if (block.startsWith('>')) {
      if (current) items.push(current);
      current = { quote: block.slice(1).trim(), name: '', roleLines: [] };
      continue;
    }
    if (!current) continue;
    // "[" cubre el placeholder "[Widget de Senja]": blocksToMarkdown pierde
    // la anotacion de cursiva que lo envolvia en Notion, asi que sin este
    // chequeo ese texto se anida como si fuera una linea de rol/empresa del
    // ultimo testimonio leido.
    if (block === '' || block === '---' || block.startsWith('#') || block.startsWith('*') || block.startsWith('[')) continue;
    if (!current.name) {
      current.name = block;
      continue;
    }
    current.roleLines.push(block);
  }
  if (current) items.push(current);
  return items;
}
