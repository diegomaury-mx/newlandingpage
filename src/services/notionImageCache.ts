/**
 * Descarga en build time una imagen de Notion (URL firmada de S3, expira en
 * ~1h via X-Amz-Expires) y la copia a public/cms-media/notion/ como archivo
 * estatico propio del sitio. Sin esto, el HTML generado referencia la URL
 * firmada directamente: como Cloudflare Pages solo reconstruye en cada push
 * (no hay rebuild automatico diario), la firma expira antes de la siguiente
 * visita y la imagen se rompe en produccion aunque el sitio siga vivo.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LoaderContext } from "astro/loaders";

const CACHE_DIR = path.join(process.cwd(), "public", "cms-media", "notion");

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function extensionFromUrl(url: string): string | undefined {
  const match = /\.([a-zA-Z0-9]+)$/.exec(new URL(url).pathname);
  return match?.[1]?.toLowerCase();
}

function sanitizeCacheKey(cacheKey: string): string {
  return cacheKey.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function cacheNotionImage(
  url: string,
  cacheKey: string,
  logger: LoaderContext["logger"],
): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    const extension = EXTENSION_BY_CONTENT_TYPE[contentType] ?? extensionFromUrl(url) ?? "jpg";
    const fileName = `${sanitizeCacheKey(cacheKey)}.${extension}`;
    const buffer = Buffer.from(await response.arrayBuffer());
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(path.join(CACHE_DIR, fileName), buffer);
    return `/cms-media/notion/${fileName}`;
  } catch (error) {
    logger.warn(
      `[notion-image-cache] No se pudo cachear "${cacheKey}": ${(error as Error).message}`,
    );
    return undefined;
  }
}
