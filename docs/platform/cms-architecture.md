# Arquitectura técnica del CMS

La descripción completa de cómo está armado el pipeline CMS (Notion → Astro Content Layer → Cloudflare Pages), con extractos de código reales y diagramas, vive en un repo público dedicado:

**→ https://github.com/diegomaury-mx/notion-cms**

Índice de ese repo:

| Doc | Cubre |
|---|---|
| `01-architecture.md` | Flujo de datos, componentes, por qué build-time |
| `02-notion-data-contract.md` | Las 4 fuentes, mapeo propiedad→schema Zod, reglas de publicación |
| `03-image-pipeline.md` | `notionImageCache.ts` — URLs S3 que expiran, recompresión WebP |
| `04-translation-pipeline.md` | `deeplTranslationCache.ts` — DeepL en build, cache, rate-limit |
| `05-build-gates.md` | Guardrail Insignia, gate `Publicable`, `verify-metrics.cjs` |
| `06-auto-publish.md` | Worker `notion-deploy-relay`, webhook de Notion, Deploy Hook |
| `07-runbook.md` | Fallos conocidos y diagnóstico |
| `08-limitations.md` | Deuda técnica (resumen de `TECHNICAL_DEBT.md`) |

## Documentos locales relacionados

- **`notion-astro-contract.md`** — el contrato de datos campo por campo. Sigue vigente como anexo de detalle; el repo `notion-cms` lo resume en `02`.
- **`cms-notion.md`** — histórico (fases A0/A1, pre-implementación 2026-07). Conservado como referencia; el estado vigente está en el repo `notion-cms`.
- **`manual-cms.md`** — manual de *operación* (cómo editar el sitio desde Notion). Su sección 4 (publicación) está **desactualizada**: ya no es GitHub Actions, es auto-publish vía el Worker (ver `06-auto-publish.md`).

## Espejo en Notion

Resumen navegable en la Diego Maury WIKI, vinculado a Portafolio D.
