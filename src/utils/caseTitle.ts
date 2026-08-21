interface CaseTitleFields {
  title: string;
  resultHeadline: string;
  cardHeadline: string;
}

/**
 * Precedencia canonica del titulo mostrado de un caso: cardHeadline (override
 * manual de Notion) > resultHeadline (H1 del cuerpo) > title (nombre de la
 * ficha). Reimplementada antes en 5 lugares (portfolio.astro, en/portfolio.astro,
 * [slug].astro, en/[slug].astro, llms.txt.ts) sin fuente unica.
 */
export function caseDisplayTitle(data: CaseTitleFields): string {
  return data.cardHeadline || data.resultHeadline || data.title;
}

/** Igual que caseDisplayTitle pero prefiriendo el override EN (si existe) sobre el ES. */
export function caseDisplayTitleEn(
  data: CaseTitleFields,
  en: Partial<CaseTitleFields> | undefined,
): string {
  const enTitle = caseDisplayTitle({
    title: en?.title ?? '',
    resultHeadline: en?.resultHeadline ?? '',
    cardHeadline: en?.cardHeadline ?? '',
  });
  return enTitle || caseDisplayTitle(data);
}
