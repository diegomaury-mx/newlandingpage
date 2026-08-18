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
import sharp from "sharp";
import type { LoaderContext } from "astro/loaders";

const CACHE_DIR = path.join(process.cwd(), "public", "cms-media", "notion");

// Cloudflare Pages rechaza assets estaticos de mas de 25MB. Un margen de
// 20MB evita que una foto de evidencia subida sin comprimir tumbe el deploy
// completo; se descarta con warning en vez de romper el build.
const MAX_FILE_BYTES = 20 * 1024 * 1024;

// Ninguna imagen del sitio se renderiza a mas de 1600px de lado (el hero mas
// grande es el banner de caso). Subir una foto de 4000px desde Notion sin
// redimensionar infla el LCP sin ninguna ganancia visual.
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 82;
const RASTER_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const RASTER_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

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
    let extension = EXTENSION_BY_CONTENT_TYPE[contentType] ?? extensionFromUrl(url) ?? "jpg";
    let buffer: Buffer = Buffer.from(await response.arrayBuffer());

    if (RASTER_CONTENT_TYPES.has(contentType) || RASTER_EXTENSIONS.has(extension)) {
      try {
        buffer = await sharp(buffer, { failOn: "none" })
          .resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        extension = "webp";
      } catch (error) {
        logger.warn(
          `[notion-image-cache] No se pudo recomprimir "${cacheKey}", se usa el archivo original: ${(error as Error).message}`,
        );
      }
    }

    const fileName = `${sanitizeCacheKey(cacheKey)}.${extension}`;
    if (buffer.byteLength > MAX_FILE_BYTES) {
      logger.warn(
        `[notion-image-cache] "${cacheKey}" pesa ${Math.round(buffer.byteLength / 1024 / 1024)}MB ` +
          `(limite ${MAX_FILE_BYTES / 1024 / 1024}MB) — se omite para no romper el deploy. Comprime el archivo en Notion.`,
      );
      return undefined;
    }
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
