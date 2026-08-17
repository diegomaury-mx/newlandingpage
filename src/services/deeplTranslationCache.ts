/**
 * Traduce texto en build time via la API de DeepL y cachea el resultado en
 * disco por hash de contenido (mismo patron que notionImageCache.ts para
 * imagenes): un texto ya traducido no vuelve a pegarle a la API en el
 * siguiente build. Sin DEEPL_API_KEY configurado, degrada devolviendo el
 * texto original (la version EN del sitio no se rompe, se queda en espanol
 * hasta que la key exista).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import type { LoaderContext } from "astro/loaders";

type Logger = LoaderContext["logger"] | { warn: (message: string) => void };

const DEFAULT_CACHE_DIR = path.join(process.cwd(), "public", "cms-media", "notion", "translations");
const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";

export type DeeplTargetLang = "EN-US";

export interface TranslateCachedOptions {
  cacheDir?: string;
  fetchImpl?: typeof fetch;
  apiKey?: string;
}

function cacheKeyFor(text: string, targetLang: string): string {
  return createHash("sha256").update(`${targetLang}:${text}`).digest("hex");
}

export async function translateCached(
  text: string,
  targetLang: DeeplTargetLang,
  logger: Logger,
  options: TranslateCachedOptions = {},
): Promise<string> {
  if (!text.trim()) return text;

  const cacheDir = options.cacheDir ?? DEFAULT_CACHE_DIR;
  const cachePath = path.join(cacheDir, `${cacheKeyFor(text, targetLang)}.txt`);

  try {
    return await readFile(cachePath, "utf-8");
  } catch {
    // cache miss, sigue al fetch
  }

  const apiKey = options.apiKey ?? process.env.DEEPL_API_KEY;
  if (!apiKey) {
    logger.warn(
      "[deepl-translation-cache] DEEPL_API_KEY no configurado, se omite traduccion (el texto se queda en espanol).",
    );
    return text;
  }

  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(DEEPL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        tag_handling: "xml",
        preserve_formatting: true,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as { translations?: { text: string }[] };
    const translated = data.translations?.[0]?.text;
    if (!translated) throw new Error("Respuesta de DeepL sin traducciones");

    await mkdir(cacheDir, { recursive: true });
    await writeFile(cachePath, translated, "utf-8");
    return translated;
  } catch (error) {
    logger.warn(`[deepl-translation-cache] No se pudo traducir texto: ${(error as Error).message}`);
    return text;
  }
}
