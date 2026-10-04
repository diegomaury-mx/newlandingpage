// Version Markdown limpia de /portfolio: lista curada de casos con link a su
// propio .md, no el listado narrativo completo de la version HTML (ver
// src/pages/portfolio.astro).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '../../utils/slug.ts';
import { caseDisplayTitle } from '../../utils/caseTitle.ts';
import { sortInsignia } from '../../utils/portfolioData.ts';
import { mdResponse } from '../../utils/markdownDocs.ts';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const published = (await getCollection('cases')).filter((c) => !c.data.draft);
  const insignia = sortInsignia(published.filter((c) => c.data.layer === 'Insignia'), 'es');
  const soporte = published.filter((c) => c.data.layer === 'Soporte');

  const lines: string[] = ['# Portafolio · Diego Maury', ''];

  function listCase(c: (typeof published)[number]): string {
    const url = new URL(`/portfolio/${slugify(c.data.title)}.md`, site).toString();
    const meta = [c.data.organization, c.data.year].filter(Boolean).join(' · ');
    return `- [${caseDisplayTitle(c.data)}](${url})${meta ? `: ${meta}` : ''}`;
  }

  if (insignia.length > 0) {
    lines.push('## Casos insignia', '', ...insignia.map(listCase), '');
  }
  if (soporte.length > 0) {
    lines.push('## Otros proyectos', '', ...soporte.map(listCase), '');
  }

  return mdResponse(lines.join('\n'));
};
