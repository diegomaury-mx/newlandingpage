# Contrato de datos Notion → Astro (Fase A1 / Diego CMS)

**Estado:** implementado en `src/content/config.ts` desde 2026-07-23 (`cases`/`metrics`/`siteCopy` con `loader:` real, validado con `astro build` contra Notion real). El sitio LIVE sigue siendo HTML editado a mano — este pipeline corre solo en el scaffold Astro (`dist/`, no desplegado). `organization` y `type` de `cases` quedaron **opcionales** pese a decir "requerido" abajo: 12/27 y 11/27 fichas reales aún no tienen esos campos llenos (contenido Draft/Archivo sin curar) y bloquear el build entero por eso no tenía sentido — solo la regla de Insignia+publicado (métrica ancla + evidencia) bloquea de verdad.

**Actualización 2026-07-23 (Fase 2 · Home/casos desde CMS):** `cases` ganó 4 campos que no estaban en la propuesta original de este documento: `body` (Markdown plano del cuerpo de la ficha, vía `blocksToMarkdown` extendido con soporte de tablas), `resultHeadline` (primer H1 del cuerpo — el resultado narrado como afirmación, usado como título de tarjeta y de página de caso), `hasVerifiedEvidence` (boolean derivado de la tabla bajo `## Evidencia`: true si al menos una fila tiene ✔) y `cardContext` (mapea a la propiedad Notion nueva **"Contexto tarjeta"**, texto libre de ~160 caracteres pensado para verse solo en tarjeta). Esto NO contradice la regla de la sección "Tratamiento de evidencia (cases)" de abajo (el bloque ✔/✖ sigue viviendo como narrativa en el `body`, no se estructuró en Zod fila por fila) — `hasVerifiedEvidence` es un derivado de un solo bit (¿hay al menos un ✔?), no una estructuración del contenido de cada fila.

**Fuentes cubiertas (las 3 confirmadas en Diego CMS, 2026-07-19):**

| # | Fuente Notion | Tipo | Alimenta |
|---|---|---|---|
| 1 | `SSOT - Portafolio Proyectos` (`collection://88257bc9-e575-45e8-90df-f851f96e92f2`) | Database, 27 fichas | Colección `cases` |
| 2 | `Copy Oficial · diegomaury.mx (SSOT)` (página única `d9ab8508-660a-43e8-ac45-9386dd7903d9`) | Página, no database | Colección singleton `siteCopy` (no existe hoy en `config.ts`) |
| 3 | `Métricas oficiales — Portafolio D` (`collection://213ea2d0-bffc-41b9-9877-92132551461c`) | Database, 11 métricas | Colección `metrics` (no existe hoy en `config.ts`) |

---

## 1. `SSOT - Portafolio Proyectos` → `cases`

**Corrección necesaria:** el schema `cases` que ya existe en `src/content/config.ts` (campos `context`, `challenge`, `objectives[]`, `actions[]`, `results[]`) es aspiracional y **no coincide con las propiedades reales de la base**. No se toca `config.ts` en esta tarea (eso es de la tarea "CMS: validar contenido con Zod"), pero el mapeo correcto contra el schema real, verificado 2026-07-19, es:

| Propiedad Notion | Tipo Notion | Campo Zod propuesto | Default | Nota |
|---|---|---|---|---|
| `title` | title | `title` | — | requerido |
| `Organización` | select (5 opciones) | `organization` | — | requerido |
| `Tipo` | select (6 opciones) | `type` | — | requerido |
| `Rol de Diego` | text | `role` | — | requerido |
| `Objetivo con métrica y timeframe ` *(espacio final real)* | text | `objective` | — | referenciar la propiedad con el espacio al final |
| `Resultados y acciones clave realizadas` | text | `resultsAndActions` | — | texto libre, no array — corrige la forma `actions[]`/`results[]` de la propuesta anterior |
| `Datos cuantitativos` | text | `quantData` | — | texto libre, no estructurado |
| `Métrica ancla` | text | `anchorMetric` | — | la cifra destacada del caso |
| `Estado publicación` | select: Draft / En revisión / Publicado / Archivado | `publicationStatus` | `"Draft"` | ver regla de publicación abajo |
| `Publicable` | checkbox | `publishable` | `false` | ver regla de publicación abajo |
| `Capa` | select: Insignia / Soporte / Archivo | `layer` | — | Insignia = máx. 3, exige evidencia; Archivo nunca se publica |
| `Canales` | multi: Sitio / LinkedIn / CV / llms.txt | `channels` | `[]` | filtra en qué superficie aparece |
| `Capacidades` | multi (9 opciones canónicas) | `capabilities` | `[]` | máx. 3-4 por caso, lista cerrada en Taxonomía |
| `Evidencia` | url | `evidenceUrl` | `undefined` | opcional — puede no existir (capa Soporte) |
| `Caso maestro` / `Ediciones` | relation (auto-relación) | `masterCase` / `editions` | `undefined` | agrupa ediciones bajo el maestro; capa Archivo solo se referencia desde aquí |
| `year` | select | `year` | — | usar `year`, no `[DEPRECADO] Año` |
| `banner`, `logo` | file | `banner`, `logo` | `undefined` | assets |
| `Contexto tarjeta` | text | `cardContext` | `''` | agregada 2026-07-23, no estaba en la propuesta original; frase corta (~160 car.) para tarjeta, separada de `Rol de Diego` para no truncar texto pensado para la página completa |
| Cuerpo de la página (contenido de la ficha) | rich text | `body` (Markdown, no MDX real) | `''` | fuente narrativa única: contexto, problema, sistema, autopsia y bloque de evidencia ✔/✖ viven aquí, no en propiedades. Implementado 2026-07-23 vía `blocksToMarkdown`; también alimenta `resultHeadline` (primer H1) y `hasVerifiedEvidence` (¿al menos un ✔ en la tabla de Evidencia?) |

**No migrar:** las 5 propiedades `[DEPRECADO] *` (se eliminan al cerrar Fase B1, no se mapean a Zod).

### Regla de publicación (cases)

```
draft = NOT (Estado publicación == "Publicado" AND Publicable == true)
```

Ya documentada en `docs/platform/cms-notion.md`. Astro nunca debe exponer una ficha con `draft = true` en rutas públicas, sitemap ni `llms.txt`.

### Tratamiento de evidencia (cases)

La evidencia **no** es un campo estructurado único: vive en dos lugares.
1. `Evidencia` (url) — enlace único al respaldo principal, cuando existe.
2. El bloque ✔/✖ dentro del cuerpo de la ficha (rich text) — tabla de afirmaciones cuantitativas con su grado (`institucional` / `propio` / `sin artefacto`), definida en la Plantilla v2. Astro debe parsear esto como parte del MDX del `body`, no intentar estructurarlo en Zod en el Sprint 1 (sobre-ingeniería prematura — YAGNI). Solo capa **Insignia** exige que este bloque no tenga filas ✖ sin justificar; Soporte puede declarar "sin cifras registradas".

---

## 2. `Copy Oficial · diegomaury.mx (SSOT)` → `siteCopy` (singleton, no existe en `config.ts` hoy)

Esta fuente **no es una base de datos**: es una página única con contenido consolidado en secciones `S1`–`S8` (Hero, Quién soy, Problema, Evidencia, Cómo trabajo, Sistemas propios, Formas de trabajar, Siguiente paso) más un bloque de metadatos SEO. No tiene propiedades tipadas de Notion — es texto libre estructurado por encabezados Markdown.

**Propuesta de colección Astro:** `type: 'data'`, una sola entrada (`site.json` o `site.yaml`), no MDX de contenido narrativo por caso. Ejemplo de forma (no definitivo, a validar en la tarea de Zod):

```ts
const siteCopy = defineCollection({
  type: 'data',
  schema: z.object({
    hero: z.object({
      label: z.string(),
      h1: z.string(),
      subheadline: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
      anchorMetricSlugs: z.array(z.string()).length(3), // referencia a `metrics`, no valores literales
    }),
    about: z.object({ tagline: z.string(), bio: z.string(), roles: z.array(z.string()) }),
    problem: z.object({ title: z.string(), body: z.string() }),
    howIWork: z.array(z.object({ step: z.string(), title: z.string(), body: z.string() })),
    seo: z.object({ title: z.string(), description: z.string().max(160), ogTitle: z.string(), ogDescription: z.string() }),
  }),
});
```

**Regla clave — no duplicar cifras:** el copy nunca lleva un valor numérico literal para una métrica ancla; referencia el `slug` de `Métricas oficiales` y el build resuelve el valor + calificador obligatorio en tiempo de build (mismo principio que el placeholder `{{metrica:slug}}` que ya usa la Maqueta Sitio v2 en Notion). Esto es el motivo real por el que Copy Oficial y el sitio se desincronizaron el 2026-07-17–19 (hallazgo de la tarea anterior de este chain): sin esa indirección, cada cambio de copy puede pisar una cifra ya corregida en Métricas oficiales.

**Regla de publicación (copy):** no existe estado `Draft`/`Publicado` en esta página — es un documento vivo de una sola versión vigente. La "publicación" es el acto de sincronizar manualmente contra el HTML live (ver callout de la página, actualizado 2026-07-19). En Astro, todo el contenido de `siteCopy` se considera siempre publicable; no aplica el filtro `draft`.

**Tratamiento de evidencia (copy):** no aplica directamente — el copy no lleva su propio bloque de evidencia. Cualquier cifra citada hereda el grado de evidencia de `Métricas oficiales` vía el slug referenciado.

---

## 3. `Métricas oficiales — Portafolio D` → `metrics`

Ya tiene un espejo funcional fuera de Astro: `assets/data/metrics.json` + `tools/verify-metrics.js` (ver `docs/superpowers/specs/2026-07-15-ssot-metricas-design.md`). El contrato Astro solo formaliza lo que ese verificador ya impone.

| Propiedad Notion | Tipo Notion | Campo Zod propuesto | Default | Nota |
|---|---|---|---|---|
| `Métrica` | title | `metric` | — | requerido |
| `Slug` | text | `slug` | — | identificador estable, kebab-case, nunca cambia — llave primaria de facto |
| `Valor` | text | `value` | — | valor publicable con formato exacto |
| `Claim canónico` | text | `canonicalClaim` | — | frase publicable completa |
| `Calificador obligatorio` | text | `mandatoryQualifier` | — | debe acompañar siempre al valor publicado |
| `Timeframe` | text | `timeframe` | — | — |
| `Entidad/Programa` | select (6 opciones) | `entity` | — | — |
| `Superficies permitidas` | multi (7 opciones) | `allowedSurfaces` | `[]` | Hero / Caso de estudio / llms.txt / CV / Pitch deck / LinkedIn / Sitio web |
| `Estado` | select: Vigente / Condicionada / Retirada / En revisión | `status` | — | ver regla de publicación |
| `Publicabilidad` | select: Pública / Interna / A solicitud / No publicable | `publicability` | — | ver regla de publicación |
| `Grado de evidencia` | select: published / own | `evidenceGrade` | — | published = tercero lo publica; own = registro/estimación propia |
| `Riesgo reputacional` | select: Bajo / Medio / Alto | `reputationalRisk` | — | — |
| `URL / Evidencia` | url | `evidenceUrl` | `undefined` | — |
| `Fuente` | text | `source` | `undefined` | respaldo cuando no hay URL |
| `Nota de uso` | text | `usageNote` | `undefined` | restricciones de publicación |
| `Ficha relacionada` | relation → `SSOT - Portafolio Proyectos` | `relatedCase` | `undefined` | — |

### Regla de publicación (metrics)

```
buildable = (Estado == "Vigente") AND (Publicabilidad IN ["Pública", "A solicitud"])
```

Una métrica `Retirada` o `En revisión` nunca debe resolver un placeholder `{{metrica:slug}}` en build — el build debe fallar (no renderizar con valor stale) si algo la referencia. Esto es exactamente lo que ya hace `tools/verify-metrics.js` sobre HTML estático; en Astro se vuelve una validación de build en tiempo de `getCollection('metrics')` + resolución de placeholders antes de `astro build`.

### Tratamiento de evidencia (metrics)

Es la única de las 3 fuentes con evidencia ya completamente estructurada por diseño: `Grado de evidencia` + `URL / Evidencia` + `Fuente` + `Riesgo reputacional` viven como propiedades tipadas, no como texto libre. Astro debe renderizar el `Calificador obligatorio` siempre pegado al `Valor` en cualquier superficie — nunca el valor solo.

---

## Regla transversal (las 3 fuentes)

Ninguna fuente permite valores no verificados en contenido publicable. El build de Astro debe fallar en frío (sitio LIVE anterior permanece activo) si:
- una ficha con `draft = false` no tiene `Métrica ancla` + `Evidencia` cuando `Capa == "Insignia"`,
- `siteCopy` referencia un slug de métrica que no existe en `metrics` o cuyo `buildable` es `false`,
- una fila de `metrics` con `Estado != "Vigente"` es referenciada por cualquier fuente.

Nota histórica: hasta 2026-07-23 este documento marcaba `src/content/config.ts` como fuera de alcance ("eso es la tarea de validar con Zod"). ​Esa tarea y la Fase 2 completa (Home/casos/SEO) ya están implementadas — ver la actualización al inicio de este documento y CLAUDE.md sección 1.
