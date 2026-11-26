# Contrato de datos Notion → Astro (Diego CMS)

**Vigente al 2026-11-25.** Verificado contra `src/services/notionClient.ts` (`NOTION_SOURCES`), `src/services/notionLoaders.ts`, `src/services/notionEvents.ts`, `src/content.config.ts` y el schema real de cada base en Notion. Si este documento y el código difieren, gana el código y se corrige este archivo.

Versión pública y guía de réplica: repo `github.com/diegomaury-mx/notion-cms` (`docs/02-notion-data-contract.md`, `docs/09-replicate.md`).

## Cómo leer este contrato

- Los helpers `get*` de `notionClient.ts` devuelven un valor neutro (`''`, `[]`, `undefined`) **sin error** si la propiedad no existe o cambió de tipo. Un renombre en Notion vacía el campo en silencio. Ante un campo vacío en el sitio, comparar nombre y tipo contra `GET /v1/data_sources/{id}`.
- Zod (`content.config.ts`) es la validación estricta: un dato inválido aborta el build y el sitio anterior sigue vivo.
- Todas las imágenes pasan por `notionImageCache.ts` (WebP ≤1600px, cache versionado en `public/cms-media/notion/`). Nunca se publica la URL S3 de Notion.
- Los campos listados en `*_TRANSLATABLE_FIELDS` se traducen con DeepL a `data.en.*` (cache versionado en `public/cms-media/notion/translations/`). Sin cuota o sin llave, `/en/*` cae al español.

## Fuentes

| Colección | Fuente Notion | ID | Forma | id de entrada | Alimenta |
|---|---|---|---|---|---|
| `cases` | 🗂️ SSOT - Portafolio Proyectos | `88257bc9-e575-45e8-90df-f851f96e92f2` | data source | `page.id` | `/portfolio`, `/portfolio/[slug]`, `llms`, EN |
| `metrics` | 📊 Métricas oficiales — Portafolio D | `213ea2d0-bffc-41b9-9877-92132551461c` | data source | `Slug` | franja "Por los números", cifras del hero |
| `siteCopy` | Copy Oficial · diegomaury.mx (SSOT) | `d9ab8508-660a-43e8-ac45-9386dd7903d9` | página singleton | `site` | home S1-S8, `/portfolio` P1-P3 + P5 |
| `imageSlots` | 🖼️ CMS Imágenes — Portafolio D | `8dda9726-a42d-407d-ba84-334b4a1ef7a1` | data source | `Slot` | foto de Diego, cinturón de logos |
| `testimonials` | ⭐ Testimonios Diego - Typedream | `d2f2943f-9a0e-445b-bbad-16134ab2c977` | data source | `page.id` | `TestimonialMarquee` (home ES/EN, `/portfolio`) |
| `events` | 📆 Meetups y Eventos: Ecosistema Tech & Innovation | `7c2e4e81-be2f-428c-ad64-73c05beea6b5` | data source | `page.id` | `/eventos`, `/en/events` |
| `reservaCopy` | Reserva conmigo · diegomaury.mx (SSOT) | `3e70fe3c-51c5-815a-9517-df6e6806a4ef` | página singleton | `reserva` | **sin consumidor**: `/reserva` es un redirect 301 desde 2026-09-26. Se sigue cargando en cada build |

La integración de Notion `Diego CMS` (solo lectura) debe tener acceso a las 7 fuentes.

---

## 1. `cases`

**Publicación:** `draft = !(Estado publicación === "Publicado" && Publicable === true)`. Ambos gates son obligatorios en toda capa. Una ficha con `draft = true` no sale en rutas, sitemap ni llms.

**Guardrail (`superRefine`):** `Capa = Insignia` y `draft = false` exige `Métrica ancla` no vacía **y** `Evidencia` (url). Si falta, el build falla.

**URL de la ficha:** `slugify(title)`. La propiedad `Slug` existe en Notion pero el código no la lee: renombrar el título cambia la URL.

| Propiedad Notion | Tipo | Campo | Notas |
|---|---|---|---|
| `title` | title | `title` | requerido |
| `Titular de tarjeta` | text | `cardHeadline` | override del título. Cadena: `cardHeadline` → `resultHeadline` → `title` |
| `Organización` | select | `organization` | opcional |
| `Tipo` | **multi_select** | `type` | opciones unidas con ` · ` (ej. `No-Code · Sistema RevOps/AI`); línea meta de la ficha |
| `Rol de Diego` | text | `role` | fallback de la meta description |
| `Contexto tarjeta` | text | `cardContext` | ~160 car. para tarjeta; fallback de la meta description |
| `Objetivo con métrica y timeframe` | text | `objective` | **no se lee hoy**: el código busca el nombre con un espacio final que ya no existe. No activarlo sin decisión de Diego: alimentaría la meta description y el `.md` de cada ficha, y varias fichas guardan ahí cifras sin respaldo |
| `Resultados y acciones clave realizadas` | text | `resultsAndActions` | texto libre |
| `Datos cuantitativos` | text | `quantData` | texto libre, no se renderiza |
| `Métrica ancla` | text | `anchorMetric` | obligatorio en Insignia publicada; se muestra en el rail |
| `Estado publicación` | select | `publicationStatus` | `Draft` / `En revisión` / `Publicado` / `Archivado` |
| `Publicable` | checkbox | `publishable` | segundo gate |
| `Capa` | select | `layer` | `Insignia` / `Soporte` / `Archivo` (requerido) |
| `Canales` | multi_select | `channels` | `Sitio` / `LinkedIn` / `CV` / `llms.txt` |
| `Capacidades` | multi_select | `capabilities` | 9 opciones; alimentan los chips del grid de capacidades |
| `Evidencia` | url | `evidenceUrl` | `http(s)://` obligatorio por schema |
| `Evidencia visual` | files | `evidenceMedia` | solo fotos, cacheadas; >20MB se descarta con warning |
| `Videos de evidencia` | text | `evidenceVideos` | una URL por línea, `Etiqueta \| URL` opcional; YouTube/Drive se embeben. Nunca archivos de video |
| `Caso maestro` / `Ediciones` | relation (self) | `masterCase` / `editions` | `Ediciones` no se renderiza |
| `year` | select | `year` | |
| `Orden Insignia` | number | `insigniaOrder` | orden de Insignia; sin valor: `year` desc, luego `title` |
| `banner`, `logo` | files | `banner`, `logo` | primer archivo, cacheado. No se reemplazan por API (subida manual) |
| `Reflexión` | text | `reflection` | cierre; un `<p>` por párrafo; solo si no está vacía |
| `Fondo`, `Slug` | file / text | — | existen en Notion, no se leen |
| *(cuerpo)* | bloques | `body` | `blocksToMarkdown` (tablas incluidas). `fetchBlockChildren` no desciende a `child_page`/`child_database`. Un `ai_block` rompe todos los builds |

**Derivados:** `resultHeadline` (primer H1 del cuerpo), `hasVerifiedEvidence` (alguna fila ✔ bajo `## Evidencia`), `draft`, `en` (`CASE_TRANSLATABLE_FIELDS`: title, resultHeadline, cardHeadline, cardContext, objective, resultsAndActions, anchorMetric, body, reflection).

**Render del cuerpo:** `## Resultado` con tabla `Métrica | Antes | Después` se pinta como tarjetas; cualquier otro encabezado cae a `.prose-table`. Plantilla canónica: "Plantilla v2 · Especificación de caso maestro" (Notion).

---

## 2. `metrics`

**Publicación:** `buildable = Estado === "Vigente" && Publicabilidad ∈ {"Pública", "A solicitud"}`. `metricBySlug` filtra por `buildable`; cada cifra renderiza su `mandatoryQualifier` sin excepción.

| Propiedad Notion | Tipo | Campo |
|---|---|---|
| `Métrica` | title | `metric` |
| `Slug` | text | `slug` (kebab-case, llave estable) |
| `Valor` | text | `value` |
| `Claim canónico` | text | `canonicalClaim` |
| `Calificador obligatorio` | text | `mandatoryQualifier` |
| `Timeframe` | text | `timeframe` |
| `Entidad/Programa` | select | `entity` |
| `Superficies permitidas` | multi_select | `allowedSurfaces` |
| `Estado` | select | `status` (`Vigente` / `Condicionada` / `Retirada` / `En revisión`) |
| `Publicabilidad` | select | `publicability` (`Pública` / `Interna` / `A solicitud` / `No publicable`) |
| `Grado de evidencia` | select | `evidenceGrade` (`published` / `own` / `belief`) |
| `Riesgo reputacional` | select | `reputationalRisk` |
| `URL / Evidencia` | url | `evidenceUrl` |
| `Fuente` | text | `source` |
| `Nota de uso` | text | `usageNote` |
| `Ficha relacionada` | relation | `relatedCase` |

Espejo aparte: `assets/data/metrics.json` + `node tools/verify-metrics.cjs` (gate manual pre-commit, exige exit 0; no valida EN, riesgo aceptado). `en`: `METRIC_TRANSLATABLE_FIELDS` (metric, canonicalClaim, mandatoryQualifier, usageNote).

---

## 3. `siteCopy` (y `reservaCopy`)

Página, no base. Schema `{ title, markdown }`; la estructura la impone `src/utils/parseSiteCopy.ts` en las páginas, partiendo por `# S<n> · …` / `# P<n> · …`. El código usa el **código** (`S1`, `P5`), nunca el nombre después del `·`. Clave duplicada: gana la primera.

| Bloque | Consumidor | Estructura obligatoria |
|---|---|---|
| `S1` Hero | `index.astro` | ver página Notion |
| `S2` Quién soy | `AboutSection.astro` vía `parseAbout` | `##` titular, intro, cifras `N etiqueta • N etiqueta`, `###` roles, párrafos `Rol: descripción`, `###` método, párrafo |
| `S3` | `index.astro` | |
| `S4` Evidencia | `index.astro` (radial) | `#` título, intro, `**Centro**` + párrafo, bloque de código (un campo por línea), cierre. Plantilla: `docs/superpowers/specs/2026-08-12-s4-evidencia-radial-copy-notion.md` |
| `S5`, `S6`, `S6b` | `index.astro` | por estructura |
| `S7` | **no existe** en código | |
| `S8` Contacto | `ContactSection.astro` vía `parseContactCopy` | label, titular, intro. Las fichas `###` se ignoran |
| `P1`-`P3`, `P5` | `portfolio.astro` | P1 `##` + lede; P2/P3 label + `##`; P5 CTA de cierre. `P4` retirado |
| `SEO` | layout/footer | |

La home EN corre el mismo parseo ES y traduce cada string ya extraído (`t()`/`tAll()`); nunca se traduce el markdown crudo. Reestructurar el copy en Notion rompe secciones sin avisar: adaptar el parser antes.

`reservaCopy` usa el mismo loader de singleton; hoy no tiene consumidor.

---

## 4. `imageSlots`

| Propiedad Notion | Tipo | Campo | Notas |
|---|---|---|---|
| `Slot` | title | `slot` | llave técnica (`slotSrc('<slot>', fallback)`); no renombrar sin tocar código |
| `Imagen` | files | `imageUrl` | cacheada |
| `Tamaño requerido` | text | `sizeRequired` | |
| `Formato requerido` | select | `formatRequired` | |
| `Estado` | status | `status` | solo `Listo` + imagen activa el slot |
| `Descripcion` | text | `description` | |
| `Nombre` | text | `nombre` | alt text; obligatorio para logos |

**Cinturón de logos:** filas con `slot` que empieza en `logo-`, no termina en `-evidencia`, `Listo`, con imagen y `Nombre`; orden alfabético por `Nombre`; `BLOCKED_LOGO_NAMES` las excluye por `Nombre`. Regla dura: toda foto nueva del sitio entra como fila aquí.

---

## 5. `testimonials`

**Gate:** la fila entra si `Review` tiene texto, `Role` ≠ `Miembro de Wella México` y la cita no es un stub de video (`/testimonio en video|video testimonial/i`). `Texto` (versión expandida por IA) nunca se usa.

| Propiedad Notion | Tipo | Campo | Notas |
|---|---|---|---|
| `Name` | title | `name` | requerido |
| `Role` | text | `role` | traducido |
| `company` | text | `company` | opcional |
| `Review` | text | `quote` | cita publicada; se limpian `<mark>` y `Â¡`/`Â¿` |
| `Photo` | files | `photo` | cacheada; sin foto, iniciales |
| `url` | url | `link` | `http(s)://` obligatorio: una url inválida rompe el build |

`en`: `TESTIMONIAL_TRANSLATABLE_FIELDS` (quote, role).

---

## 6. `events`

Loader propio (`eventsLoader`): pre-filtra y resuelve `Evento principal` contra todas las filas. No lee el body. Schema `makeEventDataSchema` es `.strict()`.

**Gate (`isPublishableEvent`):** `Publicación === "Publicado"` **y** `Scope === "Dentro"` (fórmula, comparación exacta) **y** `Enlace Oficial` con `http(s)://` (sin esquema se descarta a propósito) **y** fin (o inicio) ≥ hoy en `America/Mexico_City`. El cliente vuelve a ocultar eventos pasados en cada carga (`eventDates.ts`).

| Propiedad Notion | Tipo | Campo | Render |
|---|---|---|---|
| `Nombre` | title | `name` | título |
| `Fecha del evento` | date | `start` / `end` | agrupa por mes y alimenta el calendario |
| `Ciudad` | select | `city` | meta |
| `Modalidad` | select | `modality` | filtro |
| `Tipo` | select | `type` | filtro (1 valor) |
| `Categorías` | multi_select | `categories` | Temas (máx. 3), filtro |
| `Conceptos` | multi_select | `concepts` | puede venir vacío |
| `Organizador` | text | `organizer` | meta |
| `Resumen` | text | `summary` | `cleanSummary`; único campo traducido |
| `Enlace Oficial` | url | `officialUrl` | CTA |
| `Evento principal` | relation (self) | `parentName` | el código la busca, pero la relación ya no existe en la base: "Parte de …" no se muestra |
| `Status de Ticket` | select | `ticketStatus` | "Gratuito" solo con ese valor exacto |

No se leen: `Áreas`, `Sede` (place, inestable en la API) ni las propiedades internas de venta/IA. Las opciones de filtro siempre se derivan de los eventos publicados. Temas/Conceptos/Tipo se muestran en español también en EN.

---

## Publicación automática

Worker `notion-deploy-relay` (`docs/platform/relay/worker.next.js`): valida HMAC del webhook de Notion y dispara el Deploy Hook. Cambios en `cases`, `imageSlots`, `siteCopy`, `testimonials` disparan build directo (testimonios comprobado 2026-11-25). Eventos de `events` pasan por un filtro de propiedades públicas (`EVENTS_PUBLIC_PROPERTY_IDS`) y marcan `events_rebuild_pending` en KV; el cron `*/5` hace un solo build. Cron diario `0 13 * * *` UTC. `metrics` no publica sola: requiere sincronizar `metrics.json` y push.

## Regla transversal

El build falla en frío si: una Insignia publicada no tiene `Métrica ancla` + `Evidencia`; cualquier dato viola su schema Zod; o falta `NOTION_TOKEN` en producción. Todo lo demás (imagen que no baja, traducción sin cuota, sección de copy sin estructura) degrada sin romper.
