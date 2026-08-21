/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Token de la integracion privada de Notion (solo lectura, build-time). */
  readonly NOTION_TOKEN?: string;
  /** API key de DeepL para traduccion de contenido dinamico (build-time). */
  readonly DEEPL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
