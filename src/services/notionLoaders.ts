/**
 * Loaders de Astro Content Layer para las 3 fuentes CMS de Notion (Diego CMS).
 *
 * Cada loader corre en build (server-side): jala las paginas via notionClient,
 * mapea propiedades al shape del schema Zod (definido en src/content/config.ts) y
 * las guarda en el store de Astro. parseData() aplica el schema de la coleccion;
 * un dato invalido lanza y detiene el build (fallo seguro, contrato transversal).
 *
 * Gating de token:
 * - Build de produccion sin NOTION_TOKEN -> lanza (no se publica un sitio vacio).
 * - Dev/sync sin token -> advierte y deja la coleccion vacia, para poder generar
 *   tipos y montar el scaffold sin credenciales.
 *
 * Mapeo verificado campo por campo contra el esquema vivo de Notion (2026-07-19):
 * data sources 88257bc9 (cases) y 213ea2d0 (metrics).
 */
import type { Loader, LoaderContext } from "astro/loaders";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client";
import {
  fetchCases,
  fetchMetrics,
  fetchSiteCopy,
  getCheckbox,
  getFileUrls,
  getMultiSelect,
  getRelationIds,
  getRichText,
  getSelect,
  getTitle,
  getUrl,
  hasNotionToken,
} from "./notionClient.ts";

// --- Conversion de bloques a Markdown (para siteCopy) ------------------------

/** Extrae el arreglo de rich text de cualquier bloque que lo tenga. */
function blockRichText(block: BlockObjectResponse): RichTextItemResponse[] {
  const value = (block as Record<string, unknown>)[block.type];
  if (value && typeof value === "object" && "rich_text" in value) {
    const richText = (value as { rich_text?: unknown }).rich_text;
    if (Array.isArray(richText)) return richText as RichTextItemResponse[];
  }
  return [];
}

function plain(richText: RichTextItemResponse[]): string {
  return richText.map((item) => item.plain_text).join("");
}

/** Convierte el arbol de bloques de una pagina de Notion a Markdown plano. */
export function blocksToMarkdown(blocks: BlockObjectResponse[]): string {
  const lines: string[] = [];
  for (const block of blocks) {
    const text = plain(blockRichText(block));
    switch (block.type) {
      case "heading_1":
        lines.push(`# ${text}`);
        break;
      case "heading_2":
        lines.push(`## ${text}`);
        break;
      case "heading_3":
        lines.push(`### ${text}`);
        break;
      case "bulleted_list_item":
        lines.push(`- ${text}`);
        break;
      case "numbered_list_item":
        lines.push(`1. ${text}`);
        break;
      case "to_do":
        lines.push(`- [ ] ${text}`);
        break;
      case "quote":
      case "callout":
        lines.push(`> ${text}`);
        break;
      case "divider":
        lines.push("---");
        break;
      case "code":
        lines.push("```", text, "```");
        break;
      default:
        if (text) lines.push(text);
        break;
    }
  }
  return lines.join("\n\n");
}

// --- Mappers propiedad -> shape del schema -----------------------------------

/** Ficha de `SSOT - Portafolio Proyectos` -> data de la coleccion `cases`. */
function mapCase(page: PageObjectResponse): Record<string, unknown> {
  const publicationStatus = getSelect(page, "Estado publicación") ?? "Draft";
  const publishable = getCheckbox(page, "Publicable");
  return {
    title: getTitle(page, "title"),
    organization: getSelect(page, "Organización"),
    type: getSelect(page, "Tipo"),
    role: getRichText(page, "Rol de Diego"),
    // Ojo: el nombre real de la propiedad lleva un espacio al final.
    objective: getRichText(page, "Objetivo con métrica y timeframe "),
    resultsAndActions: getRichText(page, "Resultados y acciones clave realizadas"),
    quantData: getRichText(page, "Datos cuantitativos"),
    anchorMetric: getRichText(page, "Métrica ancla"),
    publicationStatus,
    publishable,
    layer: getSelect(page, "Capa"),
    channels: getMultiSelect(page, "Canales"),
    capabilities: getMultiSelect(page, "Capacidades"),
    evidenceUrl: getUrl(page, "Evidencia"),
    masterCase: getRelationIds(page, "Caso maestro"),
    editions: getRelationIds(page, "Ediciones"),
    year: getSelect(page, "year"),
    banner: getFileUrls(page, "banner")[0],
    logo: getFileUrls(page, "logo")[0],
    // draft = NOT (Publicado AND Publicable) — contrato, regla de publicacion.
    draft: !(publicationStatus === "Publicado" && publishable),
  };
}

/** Fila de `Métricas oficiales` -> data de la coleccion `metrics`. */
function mapMetric(page: PageObjectResponse): Record<string, unknown> {
  const status = getSelect(page, "Estado");
  const publicability = getSelect(page, "Publicabilidad");
  return {
    metric: getTitle(page, "Métrica"),
    slug: getRichText(page, "Slug"),
    value: getRichText(page, "Valor"),
    canonicalClaim: getRichText(page, "Claim canónico"),
    mandatoryQualifier: getRichText(page, "Calificador obligatorio"),
    timeframe: getRichText(page, "Timeframe"),
    entity: getSelect(page, "Entidad/Programa"),
    allowedSurfaces: getMultiSelect(page, "Superficies permitidas"),
    status,
    publicability,
    evidenceGrade: getSelect(page, "Grado de evidencia"),
    reputationalRisk: getSelect(page, "Riesgo reputacional"),
    evidenceUrl: getUrl(page, "URL / Evidencia"),
    source: getRichText(page, "Fuente"),
    usageNote: getRichText(page, "Nota de uso"),
    relatedCase: getRelationIds(page, "Ficha relacionada"),
    // buildable = Vigente AND publicabilidad en {Publica, A solicitud} — contrato.
    buildable:
      status === "Vigente" &&
      (publicability === "Pública" || publicability === "A solicitud"),
  };
}

// --- Fabrica de loaders para data sources ------------------------------------

function createDataSourceLoader(
  name: string,
  fetchFn: () => Promise<PageObjectResponse[]>,
  mapFn: (page: PageObjectResponse) => Record<string, unknown>,
  idFn: (page: PageObjectResponse, data: Record<string, unknown>) => string,
): Loader {
  return {
    name,
    load: async ({ store, logger, parseData }: LoaderContext) => {
      store.clear();
      if (!hasNotionToken()) {
        if (import.meta.env.PROD) {
          throw new Error(
            `[${name}] NOTION_TOKEN requerido para el build de produccion. ` +
              "Configura el secret antes de desplegar.",
          );
        }
        logger.warn(
          `[${name}] NOTION_TOKEN ausente: coleccion vacia (scaffolding en dev). ` +
            "Define .env para leer contenido real.",
        );
        return;
      }
      const pages = await fetchFn();
      for (const page of pages) {
        const raw = mapFn(page);
        const id = idFn(page, raw);
        const data = await parseData({ id, data: raw });
        store.set({ id, data });
      }
      logger.info(`[${name}] ${pages.length} entradas cargadas desde Notion.`);
    },
  };
}

/** Coleccion `cases`: id = page.id de Notion (estable, unico). */
export const casesLoader: Loader = createDataSourceLoader(
  "notion-cases",
  fetchCases,
  mapCase,
  (page) => page.id,
);

/** Coleccion `metrics`: id = slug (kebab-case, llave primaria de facto). */
export const metricsLoader: Loader = createDataSourceLoader(
  "notion-metrics",
  fetchMetrics,
  mapMetric,
  (_page, data) => String(data.slug ?? ""),
);

/** Singleton `siteCopy`: id fijo `site`; cuerpo aplanado a Markdown. */
export const siteCopyLoader: Loader = {
  name: "notion-site-copy",
  load: async ({ store, logger, parseData }: LoaderContext) => {
    store.clear();
    if (!hasNotionToken()) {
      if (import.meta.env.PROD) {
        throw new Error(
          "[notion-site-copy] NOTION_TOKEN requerido para el build de produccion.",
        );
      }
      logger.warn(
        "[notion-site-copy] NOTION_TOKEN ausente: siteCopy vacio (scaffolding en dev).",
      );
      return;
    }
    const { page, blocks } = await fetchSiteCopy();
    const raw = {
      title: getTitle(page, "title"),
      markdown: blocksToMarkdown(blocks),
    };
    const data = await parseData({ id: "site", data: raw });
    store.set({ id: "site", data });
  },
};
