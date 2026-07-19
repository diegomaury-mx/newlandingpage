/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Token de la integracion privada de Notion (solo lectura, build-time). */
  readonly NOTION_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
