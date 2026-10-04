// Version /en/portfolio/index.md — ver src/pages/portfolio/index.md.ts.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '../../../utils/slug.ts';
import { caseDisplayTitleEn } from '../../../utils/caseTitle.ts';
import { sortInsignia } from '../../../utils/portfolioData.ts';
import { mdResponse } from '../../../utils/markdownDocs.ts';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const published = (await getCollection('cases')).filter((c) => !c.data.draft);
  const insignia = sortInsignia(published.filter((c) => c.data.layer === 'Insignia'), 'en');
  const soporte = published.filter((c) => c.data.layer === 'Soporte');

  const lines: string[] = ['# Portfolio · Diego Maury', ''];

  function listCase(c: (typeof published)[number]): string {
    const url = new URL(`/en/portfolio/${slugify(c.data.title)}.md`, site).toString();
    const meta = [c.data.organization, c.data.year].filter(Boolean).join(' · ');
    return `- [${caseDisplayTitleEn(c.data, c.data.en)}](${url})${meta ? `: ${meta}` : ''}`;
  }

  if (insignia.length > 0) {
    lines.push('## Flagship case studies', '', ...insignia.map(listCase), '');
  }
  if (soporte.length > 0) {
    lines.push('## Other projects', '', ...soporte.map(listCase), '');
  }

  return mdResponse(lines.join('\n'));
};
