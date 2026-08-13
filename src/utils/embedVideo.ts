/**
 * Convierte una URL de video (YouTube/Drive, guardada en "Videos de evidencia")
 * a su forma embebible en un <iframe>. `null` significa "proveedor no
 * reconocido": la plantilla debe caer al link de texto, nunca romper el build.
 */

const YOUTUBE_WATCH = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{6,})/;
const YOUTUBE_SHORT = /^https?:\/\/youtu\.be\/([\w-]{6,})/;
const YOUTUBE_EMBED = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([\w-]{6,})/;
const DRIVE_FILE = /^https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/(?:view|preview)/;

export function toEmbeddableVideoUrl(url: string): string | null {
  const trimmed = url.trim();

  const watch = trimmed.match(YOUTUBE_WATCH);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;

  const short = trimmed.match(YOUTUBE_SHORT);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;

  if (YOUTUBE_EMBED.test(trimmed)) return trimmed;

  const drive = trimmed.match(DRIVE_FILE);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;

  return null;
}
