// Endpoint estatico: genera dist/llms.txt desde la coleccion `cases` real de
// Notion (Fase 2 · Diego CMS, punto 4). Distinto del `llms.txt` que hoy sirve
// el sitio LIVE en la raiz del repo (mantenido a mano vía metrics.json) — este
// vive solo en el scaffold Astro hasta que Fase 3 conecte el deploy real.
// Solo entran fichas publicadas (draft=false) con "llms.txt" en `Canales`.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '../utils/slug.ts';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const allCases = await getCollection('cases');
  const eligible = allCases.filter((c) => !c.data.draft && c.data.channels.includes('llms.txt'));

  const lines: string[] = [
    '# Diego Maury — Portafolio',
    '',
    `Portfolio: ${new URL('/portfolio', site).toString()}`,
    '',
    '---',
    '',
    '## Casos',
    '',
  ];

  if (eligible.length === 0) {
    lines.push('Ninguna ficha publicada tiene el canal "llms.txt" habilitado todavia.');
  } else {
    for (const c of eligible) {
      const title = c.data.resultHeadline || c.data.title;
      const url = new URL(`/portfolio/${slugify(c.data.title)}`, site).toString();
      lines.push(`### ${title}`);
      lines.push(`- Organización: ${c.data.organization ?? '—'} · ${c.data.year ?? '—'}`);
      if (c.data.objective) lines.push(`- Objetivo: ${c.data.objective}`);
      if (c.data.anchorMetric) lines.push(`- Métrica ancla: ${c.data.anchorMetric}`);
      lines.push(`- Evidencia verificada: ${c.data.hasVerifiedEvidence ? 'sí' : 'no'}`);
      lines.push(`- URL: ${url}`);
      lines.push('');
    }
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
