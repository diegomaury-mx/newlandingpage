import {
  blocksAfterHeading,
  blocksBeforeHeading,
  ctaLabels,
  headingCards,
  paragraphs,
} from "./parseSiteCopy.ts";

export interface ContactNotionCopy {
  intro: string[];
  trustParts: string[];
}

const CARD_HEADING = "### ";

/**
 * Extrae la intro y la linea de confianza del bloque S8 de Notion. S8 ya no
 * renderiza los pasos 01-03, pero las fichas `###` pueden seguir en Notion:
 * con fichas, la linea de confianza se busca despues de la ultima (mismo
 * comportamiento que tenia index.astro); sin fichas, se busca en todo el bloque.
 */
export function parseContactCopy(blocks: string[]): ContactNotionCopy {
  const cards = headingCards(blocks, CARD_HEADING);
  const searchable =
    cards.length > 0
      ? blocksAfterHeading(blocks, `${CARD_HEADING}${cards[cards.length - 1].title}`)
      : blocks;

  const trustLine =
    searchable
      .map((block) => block.trim())
      .find((block) => !block.startsWith("#") && block.includes("·") && ctaLabels([block]).length === 0) ?? "";

  const intro = paragraphs(blocksBeforeHeading(blocks, [CARD_HEADING])).filter(
    (paragraph) => paragraph !== trustLine,
  );
  const trustParts = trustLine
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  return { intro, trustParts };
}
