/**
 * Helper compartido por las rutas `*.md.ts` (versiones Markdown limpias de
 * las paginas clave, ver CHANGELOG "Reescritura de /llms.txt + paginas .md").
 * Todas sirven `text/markdown` — nunca HTML — para que un agente que siga un
 * enlace desde /llms.txt reciba contenido plano, sin navegacion ni markup.
 */
export function mdResponse(body: string): Response {
  return new Response(body.trim() + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
