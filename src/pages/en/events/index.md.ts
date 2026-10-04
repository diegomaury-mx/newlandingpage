// Version /en/events/index.md — ver src/pages/eventos/index.md.ts. Solo el
// resumen pasa por DeepL (entry.data.en.summary), igual que la version HTML
// (src/pages/en/events.astro): nombre/ciudad/organizador no se traducen (v1).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { EventData } from '../../../services/notionEvents.ts';
import { mdResponse } from '../../../utils/markdownDocs.ts';

export const prerender = true;

export const GET: APIRoute = async () => {
  const events = [...(await getCollection('events'))]
    .map((entry) => entry.data as EventData)
    .sort((a, b) => a.start.localeCompare(b.start));

  const lines: string[] = ['# Event agenda · Diego Maury', ''];

  if (events.length === 0) {
    lines.push('No events published at this time.');
  } else {
    for (const e of events) {
      const range =
        e.end && e.end.slice(0, 10) !== e.start.slice(0, 10)
          ? `${e.start.slice(0, 10)} to ${e.end.slice(0, 10)}`
          : e.start.slice(0, 10);
      lines.push(`## ${e.name}`, '');
      lines.push(`- Date: ${range}`);
      lines.push(`- Where: ${[e.city, e.modality].filter(Boolean).join(' · ') || '—'}`);
      if (e.organizer) lines.push(`- Organizer: ${e.organizer}`);
      const summary = e.en?.summary || e.summary;
      if (summary) lines.push(`- Summary: ${summary}`);
      lines.push(`- Official link: ${e.officialUrl}`, '');
    }
  }

  return mdResponse(lines.join('\n'));
};
