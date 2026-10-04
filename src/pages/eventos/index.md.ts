// Version Markdown de /eventos: el detalle evento por evento vive aqui, no
// en /llms.txt (que solo enlaza esta agenda una vez, ver llms.txt.ts).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { EventData } from '../../services/notionEvents.ts';
import { mdResponse } from '../../utils/markdownDocs.ts';

export const prerender = true;

export const GET: APIRoute = async () => {
  const events = [...(await getCollection('events'))]
    .map((entry) => entry.data as EventData)
    .sort((a, b) => a.start.localeCompare(b.start));

  const lines: string[] = ['# Agenda de eventos · Diego Maury', ''];

  if (events.length === 0) {
    lines.push('No hay eventos publicados en este momento.');
  } else {
    for (const e of events) {
      const range =
        e.end && e.end.slice(0, 10) !== e.start.slice(0, 10)
          ? `${e.start.slice(0, 10)} a ${e.end.slice(0, 10)}`
          : e.start.slice(0, 10);
      lines.push(`## ${e.name}`, '');
      lines.push(`- Fecha: ${range}`);
      lines.push(`- Dónde: ${[e.city, e.modality].filter(Boolean).join(' · ') || '—'}`);
      if (e.organizer) lines.push(`- Organiza: ${e.organizer}`);
      if (e.summary) lines.push(`- Resumen: ${e.summary}`);
      lines.push(`- Enlace oficial: ${e.officialUrl}`, '');
    }
  }

  return mdResponse(lines.join('\n'));
};
