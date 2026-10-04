/**
 * Version Markdown limpia de una ficha de caso (`/portfolio/{slug}.md`,
 * `/en/portfolio/{slug}.md`). El `body` de la coleccion `cases` YA es
 * Markdown (blocksToMarkdown en notionLoaders.ts) — esta funcion no
 * reconstruye nada, solo antepone metadata y reusa el body tal cual, igual
 * fuente que renderMarkdown() usa para la version HTML.
 */
import type { CollectionEntry } from 'astro:content';
import { caseDisplayTitle, caseDisplayTitleEn } from './caseTitle.ts';

type CaseData = CollectionEntry<'cases'>['data'];
type Locale = 'es' | 'en';

const LABELS = {
  es: { org: 'Organización', year: 'Año', metric: 'Métrica ancla', reflection: 'Reflexión' },
  en: { org: 'Organization', year: 'Year', metric: 'Anchor metric', reflection: 'Reflection' },
} as const;

export function caseMarkdown(data: CaseData, locale: Locale): string {
  const labels = LABELS[locale];
  const title = locale === 'en' ? caseDisplayTitleEn(data, data.en) : caseDisplayTitle(data);
  const objective = locale === 'en' ? data.en.objective || data.objective : data.objective;
  const anchorMetric = locale === 'en' ? data.en.anchorMetric || data.anchorMetric : data.anchorMetric;
  const body = locale === 'en' ? data.en.body || data.body : data.body;
  const reflection = locale === 'en' ? data.en.reflection || data.reflection : data.reflection;

  const lines: string[] = [`# ${title}`, ''];

  const meta = [
    data.organization ? `${labels.org}: ${data.organization}` : '',
    data.year ? `${labels.year}: ${data.year}` : '',
  ].filter(Boolean);
  if (meta.length > 0) lines.push(`_${meta.join(' · ')}_`, '');

  if (objective) lines.push(`> ${objective}`, '');
  if (anchorMetric) lines.push(`**${labels.metric}:** ${anchorMetric}`, '');

  if (body.trim()) lines.push(body.trim(), '');
  if (reflection.trim()) lines.push(`## ${labels.reflection}`, '', reflection.trim(), '');

  return lines.join('\n');
}
