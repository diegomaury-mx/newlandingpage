# Rediseño narrativo de /portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar `/portfolio` para que se sienta como un portafolio curado y narrativo en vez de una tabla de datos: sacar el indicador de evidencia ✔/✖ del listado, dar tratamiento uniforme a los 4 casos Insignia, agregar una franja de cifras de impacto antes de los casos, y conectar las secciones con copy narrativo editable desde Notion.

**Architecture:** Todo el trabajo vive en `src/pages/portfolio.astro` (rediseño de markup y lógica) y `src/styles/portfolio.css` (estilos nuevos, retiro de estilos de evidencia/featured). Dos piezas de infraestructura chicas lo soportan: (1) un campo numérico nuevo (`insigniaOrder`) en el schema/loader de `cases` para el orden manual de Insignia, y (2) una extensión de una línea al parser de copy (`parseSiteCopy.ts`) para reconocer bloques `P<n>` además de `S<n>`, reusando el mismo mecanismo que ya alimenta `index.astro`. Las cifras de impacto se leen de la colección `metrics` por `slug` (nunca hardcodeadas), igual que ya hace `index.astro` con `incmtyMetric`.

**Tech Stack:** Astro 5 (Content Layer API), TypeScript, Notion API (`@notionhq/client`), CSS con custom properties del DS V2 "Ember on Ink". Sin framework de test unitario instalado (`tsx` disponible como runner de scripts sueltos); verificación vía `astro build`/`astro dev` + suite Playwright existente (`test:a11y:astro`, `verify:visual:astro`).

**Spec de referencia:** `docs/superpowers/specs/2026-08-16-portfolio-rediseno-narrativo-design.md` (con las 2 correcciones bloqueantes de la revisión: caveat de RODI siempre visible, label correcto de "7+ años en innovación y ecosistemas").

---

### Task 1: Helper `getNumber` en notionClient.ts

**Files:**
- Modify: `src/services/notionClient.ts:139-144` (junto a `getCheckbox`, mismo patrón)

- [ ] **Step 1: Agregar el helper**

Justo después de la función `getCheckbox` (línea 144), agregar:

```ts
/** number -> valor numerico o `undefined` (celda vacia o de otro tipo). */
export function getNumber(page: PageObjectResponse, name: string): number | undefined {
  const prop = getProp(page, name);
  if (prop?.type !== "number") return undefined;
  return prop.number ?? undefined;
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx astro check`
Expected: sin nuevos errores de TypeScript relacionados a `notionClient.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/services/notionClient.ts
git commit -m "feat: agrega helper getNumber para propiedades numéricas de Notion"
```

---

### Task 2: Campo `insigniaOrder` en el schema y el loader

**Files:**
- Modify: `src/content/config.ts:69-70` (colección `cases`, junto a `year`)
- Modify: `src/services/notionLoaders.ts:23-40` (import), `src/services/notionLoaders.ts:242` (mapCase)

- [ ] **Step 1: Agregar el campo al schema Zod**

En `src/content/config.ts`, dentro del objeto de `cases` (después de la línea `year: z.string().optional(),`, antes de `banner: z.string().optional(),`):

```ts
      year: z.string().optional(),
      // Orden manual de los casos Insignia en /portfolio (agregado 2026-08-16,
      // rediseño narrativo): los 4 casos Insignia usan el mismo tratamiento
      // visual (sin "featured"), asi que el orden ya no lo decide el codigo
      // (antes: "primero con evidencia verificada") sino Diego, via esta
      // propiedad numerica en Notion. Sin valor = va al final (ver fallback
      // determinista en portfolio.astro: year desc, luego title).
      insigniaOrder: z.number().optional(),
      banner: z.string().optional(),
```

- [ ] **Step 2: Importar `getNumber` en notionLoaders.ts**

En `src/services/notionLoaders.ts`, en el bloque de import de `./notionClient.ts` (líneas 23-39), agregar `getNumber` a la lista (orden alfabético, junto a `getMultiSelect`):

```ts
import {
  fetchBlockChildren,
  fetchCases,
  fetchImageSlots,
  fetchMetrics,
  fetchSiteCopy,
  getCheckbox,
  getFileUrls,
  getMultiSelect,
  getNumber,
  getRelationIds,
  getRichText,
  getSelect,
  getStatus,
  getTitle,
  getUrl,
  hasNotionToken,
} from "./notionClient.ts";
```

- [ ] **Step 3: Mapear la propiedad en `mapCase`**

En `src/services/notionLoaders.ts`, dentro de `mapCase` (alrededor de la línea 242, junto a `year: getSelect(page, "year"),`):

```ts
    year: getSelect(page, "year"),
    insigniaOrder: getNumber(page, "Orden Insignia"),
    banner: getFileUrls(page, "banner")[0],
```

- [ ] **Step 4: Verificar que compila**

Run: `npx astro check`
Expected: sin errores nuevos.

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts src/services/notionLoaders.ts
git commit -m "feat: agrega campo insigniaOrder para orden manual de casos Insignia"
```

---

### Task 3: Extender `parseSiteCopy.ts` para bloques `P<n>`

**Files:**
- Modify: `src/utils/parseSiteCopy.ts:11`
- Create (temporal, se borra al final del task): `scripts/verify-parse-site-copy.ts`

- [ ] **Step 1: Escribir el script de verificación (falla con el regex actual)**

Crear `scripts/verify-parse-site-copy.ts`:

```ts
import { parseSiteCopySections, heading2 } from "../src/utils/parseSiteCopy.ts";

const sample = [
  "# S1 · Hero",
  "## Headline del home",
  "# P2 · Casos insignia",
  "## No son los casos más grandes. Son los que puedo defender de principio a fin.",
].join("\n\n");

const sections = parseSiteCopySections(sample);
const p2 = sections.get("P2");

if (!p2) {
  console.error("FALLA: la seccion P2 no se detecto (regex no reconoce prefijo P)");
  process.exit(1);
}
if (heading2(p2.blocks) !== "No son los casos más grandes. Son los que puedo defender de principio a fin.") {
  console.error("FALLA: heading2 de P2 no coincide con el contenido esperado");
  process.exit(1);
}
console.log("OK: bloques P<n> se parsean correctamente");
```

- [ ] **Step 2: Correr el script y confirmar que falla**

Run: `npx tsx scripts/verify-parse-site-copy.ts`
Expected: `FALLA: la seccion P2 no se detecto (regex no reconoce prefijo P)` y exit code 1.

- [ ] **Step 3: Extender el regex**

En `src/utils/parseSiteCopy.ts:11`, cambiar:

```ts
const SECTION_HEADING = /^# (S\d+b?|SEO) · (.+)$/;
```

por:

```ts
const SECTION_HEADING = /^# (S\d+b?|P\d+|SEO) · (.+)$/;
```

- [ ] **Step 4: Correr el script y confirmar que pasa**

Run: `npx tsx scripts/verify-parse-site-copy.ts`
Expected: `OK: bloques P<n> se parsean correctamente`, exit code 0.

- [ ] **Step 5: Borrar el script temporal**

```bash
rm scripts/verify-parse-site-copy.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/parseSiteCopy.ts
git commit -m "feat: parseSiteCopy reconoce bloques P<n> además de S<n>"
```

---

### Task 4: Documentar el contrato Notion↔Astro

**Files:**
- Modify: `docs/platform/notion-astro-contract.md` (sección 1, tabla de `cases`; sección 2, `siteCopy`)

- [ ] **Step 1: Documentar la propiedad nueva en la tabla de `cases`**

En `docs/platform/notion-astro-contract.md`, después de la fila de `year` en la tabla de la sección 1 (línea 40):

```
| `year` | select | `year` | — | usar `year`, no `[DEPRECADO] Año` |
| `Orden Insignia` | number | `insigniaOrder` | `undefined` | agregada 2026-08-16 (rediseño narrativo de /portfolio); orden manual de los 4 casos Insignia, sin valor va al final (fallback: year desc, luego title) |
```

- [ ] **Step 2: Documentar los bloques `P1-P4` en la sección de `siteCopy`**

En `docs/platform/notion-astro-contract.md`, al final de la sección 2 (después de la línea 94, antes del `---` que cierra la sección), agregar:

```markdown
**Bloques `P1`-`P4` (agregados 2026-08-16, rediseño narrativo de `/portfolio`):** mismo mecanismo que `S1`-`S8`, mismo parser (`SECTION_HEADING` en `parseSiteCopy.ts` ahora acepta también el prefijo `P`). Viven en la misma página, columna Versión Actual.

| Bloque | Contenido | Se lee con |
|---|---|---|
| `P1 · Hero portfolio` | `## <H1>` + primer párrafo (lede) | `heading2(p1)`, `paragraphs(p1)[0]` |
| `P2 · Casos insignia` | el label del heading (`· <label>`) es el eyebrow; `## <H2>` es la transición narrativa | `.label` de la sección, `heading2(p2)` |
| `P3 · Soporte` | igual patrón que P2 | `.label`, `heading2(p3)` |
| `P4 · Archivo` | un solo párrafo (nota del acordeón) | `paragraphs(p4)[0]` |

Si un bloque falta o está vacío, `portfolio.astro` cae a un copy por defecto (mismo texto que el borrador del spec) — nunca rompe el build ni deja una sección vacía.
```

- [ ] **Step 3: Commit**

```bash
git add docs/platform/notion-astro-contract.md
git commit -m "docs: documenta propiedad Orden Insignia y bloques P1-P4 en el contrato Notion↔Astro"
```

---

### Task 5: Reescribir `src/pages/portfolio.astro`

**Files:**
- Modify: `src/pages/portfolio.astro` (reescritura completa del frontmatter y el template)

- [ ] **Step 1: Reemplazar el archivo completo**

Reemplazar TODO el contenido de `src/pages/portfolio.astro` con:

```astro
---
// Home del portafolio (rediseño narrativo 2026-08-16, ver
// docs/superpowers/specs/2026-08-16-portfolio-rediseno-narrativo-design.md):
// sin indicador de evidencia en el listado (vive solo en cada caso), los 4
// casos Insignia con el mismo tratamiento visual (sin "featured"), franja de
// cifras de impacto antes de Insignia, y copy narrativo entre secciones
// editable desde Notion (bloques P1-P4 en "Copy Oficial · diegomaury.mx
// SSOT", mismo mecanismo que S1-S8 de index.astro).
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { slugify } from '../utils/slug.ts';
import BaseLayout from '../layouts/BaseLayout.astro';
import { parseSiteCopySections, heading2, paragraphs } from '../utils/parseSiteCopy.ts';
import '../styles/portfolio.css';

type CaseEntry = CollectionEntry<'cases'>;
type MetricEntry = CollectionEntry<'metrics'>;

// Titulo de tarjeta = resultado como afirmacion (H1 del caso), nunca el rol.
// Cae al `title` de Notion solo si la ficha aun no tiene esa narrativa escrita.
function cardTitle(entry: CaseEntry): string {
  return entry.data.resultHeadline || entry.data.title;
}

const CONTEXT_LINE_MAX = 160;

// Descripcion de tarjeta Soporte: prioriza `Contexto tarjeta`, cae a
// Objetivo y despues a Resultados y acciones — mismo orden que usaba la
// fila de tabla que esta tarjeta reemplazo originalmente.
function supportDescription(entry: CaseEntry): string {
  const text = entry.data.cardContext || entry.data.objective || entry.data.resultsAndActions;
  if (!text) return '';
  return text.length > CONTEXT_LINE_MAX
    ? `${text.slice(0, CONTEXT_LINE_MAX)}…`
    : text;
}

const allCases = await getCollection('cases');
const idToTitle = new Map(allCases.map((c) => [c.id, c.data.title]));

const published = allCases.filter((c) => !c.data.draft);

// Orden manual via `insigniaOrder` (propiedad Notion "Orden Insignia"); sin
// featured, los 4 casos Insignia pesan igual, asi que el orden ya no lo
// decide "quien tiene mas evidencia verificada" sino Diego. Fallback
// determinista si falta el campo en algun caso: year desc, luego title
// (la API de Notion no garantiza orden estable de llegada).
const insignia = [...published.filter((c) => c.data.layer === 'Insignia')].sort((a, b) => {
  const orderA = a.data.insigniaOrder ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.data.insigniaOrder ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  const yearA = Number(a.data.year) || 0;
  const yearB = Number(b.data.year) || 0;
  if (yearA !== yearB) return yearB - yearA;
  return a.data.title.localeCompare(b.data.title, 'es');
});
const soporte = published.filter((c) => c.data.layer === 'Soporte');
const archivo = allCases.filter((c) => c.data.layer === 'Archivo');

// --- Copy narrativo (Copy Oficial SSOT, bloques P1-P4) ------------------------
// Mismo mecanismo que S1-S8 de index.astro. Si un bloque falta o esta vacio
// (Diego aun no lo llena en Notion), cae al borrador del spec — nunca deja
// una seccion vacia ni rompe el build.
const siteCopyEntries = await getCollection('siteCopy');
const siteCopyEntry = siteCopyEntries.find((entry) => entry.id === 'site');
const copySections = siteCopyEntry
  ? parseSiteCopySections(siteCopyEntry.data.markdown)
  : new Map();

const p1 = copySections.get('P1')?.blocks ?? [];
const p2 = copySections.get('P2')?.blocks ?? [];
const p3 = copySections.get('P3')?.blocks ?? [];
const p4 = copySections.get('P4')?.blocks ?? [];

const heroEyebrow = 'Strategic Program Director';
const heroH1 =
  heading2(p1) ||
  'Encuentro el mecanismo que frena la ejecución de operaciones complejas, y lo convierto en sistemas medibles que el equipo sostiene.';
const heroLede =
  paragraphs(p1)[0] ||
  'Programas de innovación, arquitecturas RevOps y ecosistemas de emprendimiento en LATAM. Este portafolio no publica lo que no puede probar, y lo dice en cada cifra.';

const insigniaEyebrow = copySections.get('P2')?.label ?? 'Casos insignia';
const insigniaHeadline =
  heading2(p2) || 'No son los casos más grandes. Son los que puedo defender de principio a fin.';

const soporteHeadline =
  heading2(p3) || 'El resto del registro. Menos protagonismo, la misma disciplina.';

const archiveNote =
  paragraphs(p4)[0] ||
  'Existen. No se exhiben. Ediciones y variantes de los casos anteriores, conservadas para trazabilidad.';

// --- Franja "Por los números" --------------------------------------------------
// Fila de catalogo: se calcula sola del contenido publicado, nunca se edita a
// mano — si Diego publica un caso nuevo, estas cifras se recalculan solas.
const totalPublicadas = insignia.length + soporte.length;
const organizacionesUnicas = new Set(
  [...insignia, ...soporte]
    .map((c) => c.data.organization)
    .filter((org): org is string => Boolean(org))
).size;
const camposUnicos = new Set(
  [...insignia, ...soporte].flatMap((c) => c.data.capabilities)
).size;
// Reusa el mismo numero+calificacion que index.astro S2 (STAT_SUBLABELS[1]):
// 7+ es especifico a innovacion/ecosistemas, no la trayectoria total (esa es
// 10+, Copy LinkedIn SSOT) — ver correccion 2026-08-16 del spec tras revision.
const ANOS_EXPERIENCIA = '7+';
const ANOS_EXPERIENCIA_LABEL = 'años en innovación y ecosistemas';

// Fila de impacto: SIEMPRE leida de la coleccion `metrics` por slug, nunca
// tipeada a mano — si una metrica cambia de estado en Notion (ej. se retira),
// se refleja sola. Cada cifra renderiza su `mandatoryQualifier` sin
// excepcion (regla dura de la revision del spec: el caveat de RODI
// "cost-avoidance modelado" no puede faltar en ningun tamano tipografico).
const metricsEntries = await getCollection('metrics');
function metricBySlug(slug: string): MetricEntry | undefined {
  return metricsEntries.find((entry) => entry.data.slug === slug);
}
const IMPACT_ANCHOR_SLUGS = ['incmty-participantes-inscritos', 'rodi-sofi'];
const IMPACT_SUPPORT_SLUGS = [
  'heineken-proyectos-evaluados',
  'hacksureste-participantes',
  'heineken-crecimiento-regional',
  'fliphouse-leads-crm',
  'sofi-cobertura-automatica',
  'fliphouse-speed-to-lead',
];
const impactAnchors = IMPACT_ANCHOR_SLUGS.map(metricBySlug).filter(
  (m): m is MetricEntry => Boolean(m)
);
const impactSupport = IMPACT_SUPPORT_SLUGS.map(metricBySlug).filter(
  (m): m is MetricEntry => Boolean(m)
);

const pageTitle = 'Portafolio · Diego Maury';
const pageDescription =
  'Portafolio con evidencia verificable, caso por caso. Programas de innovación, arquitecturas RevOps y ecosistemas de emprendimiento en LATAM.';
const canonicalUrl = new URL('/portfolio', Astro.site).toString();
const ogImage = new URL('/assets/img/diego-maury.png', Astro.site).toString();

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [...insignia, ...soporte].map((c, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: new URL(`/portfolio/${slugify(c.data.title)}`, Astro.site).toString(),
    name: cardTitle(c),
  })),
};
---

<BaseLayout
  title={pageTitle}
  description={pageDescription}
  canonicalUrl={canonicalUrl}
  jsonLd={itemListJsonLd}
  ogImage={ogImage}
  enableGtm
>
  <div class="portfolio-page">
<section class="section hero">
  <div class="wrap">
    <div class="eyebrow">{heroEyebrow}</div>
    <h1>{heroH1}</h1>
    <p>{heroLede}</p>
  </div>
</section>

<section class="section stats">
  <div class="wrap">
    <div class="eyebrow eyebrow--plain">Por los números</div>

    <div class="stats__catalog">
      <div class="stat-cat">
        <div class="stat-cat__n">{totalPublicadas}</div>
        <div class="stat-cat__l">proyectos publicados</div>
      </div>
      <div class="stat-cat">
        <div class="stat-cat__n">{organizacionesUnicas}</div>
        <div class="stat-cat__l">organizaciones distintas</div>
      </div>
      <div class="stat-cat">
        <div class="stat-cat__n">{camposUnicos}</div>
        <div class="stat-cat__l">campos de expertise</div>
      </div>
      <div class="stat-cat">
        <div class="stat-cat__n">{ANOS_EXPERIENCIA}</div>
        <div class="stat-cat__l">{ANOS_EXPERIENCIA_LABEL}</div>
      </div>
    </div>

    {impactAnchors.length > 0 && (
      <div class="label stats__impact-label">Impacto documentado</div>
    )}

    {impactAnchors.length > 0 && (
      <div class="stats__anchors">
        {impactAnchors.map((m) => (
          <div class="stat-anchor">
            <div class="stat-anchor__n">{m.data.value}</div>
            <div class="stat-anchor__l">{m.data.metric}</div>
            <div class="stat-anchor__q">{m.data.mandatoryQualifier}</div>
          </div>
        ))}
      </div>
    )}

    {impactSupport.length > 0 && (
      <div class="stats__support">
        {impactSupport.map((m) => (
          <div class="stat-support">
            <div class="stat-support__n">{m.data.value}</div>
            <div class="stat-support__l">{m.data.metric}</div>
            <div class="stat-support__q">{m.data.mandatoryQualifier}</div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

<section class="section gallery">
  <div class="wrap">
    <div class="eyebrow">{insigniaEyebrow}</div>
    <h2>{insigniaHeadline}</h2>
    {insignia.length === 0 && (
      <p class="empty-note">Sin fichas Insignia publicadas todavía.</p>
    )}
    {insignia.length > 0 && (
      <div class="gallery__grid">
        {insignia.map((c) => (
          <a class="card card--insignia" href={`/portfolio/${slugify(c.data.title)}`}>
            {c.data.banner ? (
              <div class="card__media">
                <img src={c.data.banner} alt={c.data.title} loading="lazy" width="800" height="500" />
                {c.data.logo && <img class="card__logo" src={c.data.logo} alt="" aria-hidden="true" loading="lazy" width="40" height="40" />}
              </div>
            ) : (
              <div class="media-void"><span>Sin imagen publicable</span></div>
            )}
            <div class="card__body">
              <span class="meta">{c.data.organization ?? '—'} · {c.data.year ?? '—'}</span>
              <h3 class="card__title">{cardTitle(c)}</h3>
            </div>
          </a>
        ))}
      </div>
    )}
  </div>
</section>

<section class="section support">
  <div class="wrap">
    <div class="eyebrow eyebrow--plain">Soporte · {soporte.length} proyectos</div>
    <h2>{soporteHeadline}</h2>
    {soporte.length === 0 ? (
      <p class="empty-note">Sin fichas Soporte publicadas todavía.</p>
    ) : (
      <div class="support-grid">
        {soporte.map((c) => (
          <a class="card card--support" href={`/portfolio/${slugify(c.data.title)}`}>
            <div class="support-card__head">
              {c.data.logo ? (
                <img class="support-card__logo" src={c.data.logo} alt="" aria-hidden="true" loading="lazy" width="44" height="44" />
              ) : (
                <div class="support-card__logo support-card__logo--fallback" aria-hidden="true">
                  {(c.data.organization ?? c.data.title).slice(0, 1)}
                </div>
              )}
              <div class="support-card__meta">
                <span class="meta">{c.data.organization ?? '—'} · {c.data.year ?? '—'}</span>
                <h3 class="card__title">{c.data.title}</h3>
              </div>
            </div>
            {supportDescription(c) && (
              <p class="support-card__desc">{supportDescription(c)}</p>
            )}
            {c.data.capabilities.length > 0 && (
              <div class="card__caps">
                {c.data.capabilities.slice(0, 3).map((cap) => <span class="cap">{cap}</span>)}
              </div>
            )}
          </a>
        ))}
      </div>
    )}
  </div>
</section>

<section class="section archive">
  <div class="wrap">
    <button class="archive__toggle" id="archiveToggle" aria-expanded="false" aria-controls="archiveGrid">
      <span>Archivo · {archivo.length} fichas</span>
      <span class="archive__glyph" id="archiveGlyph">+</span>
    </button>
    <p class="archive__note">{archiveNote}</p>
    {archivo.length > 0 && (
      <div class="archive__grid" id="archiveGrid" hidden>
        {archivo.map((c) => (
          <div class="archive__cell">
            <strong>{c.data.title}</strong>
            <span>{c.data.masterCase[0] ? (idToTitle.get(c.data.masterCase[0]) ?? '—') : '—'}</span>
          </div>
        ))}
      </div>
    )}
  </div>
</section>
  </div>

<script>
  const btn = document.getElementById('archiveToggle');
  const grid = document.getElementById('archiveGrid');
  const glyph = document.getElementById('archiveGlyph');
  if (btn && grid && glyph) {
    btn.addEventListener('click', () => {
      const open = grid.hasAttribute('hidden');
      grid.toggleAttribute('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      glyph.textContent = open ? '−' : '+';
    });
  }
</script>
</BaseLayout>
```

- [ ] **Step 2: Verificar tipos**

Run: `npx astro check`
Expected: sin errores de TypeScript en `portfolio.astro` (puede haber warnings preexistentes de otros archivos, no relacionados a este cambio — solo verificar que no aparecen nuevos en este archivo).

- [ ] **Step 3: Commit**

```bash
git add src/pages/portfolio.astro
git commit -m "feat: rediseña /portfolio con franja de impacto, Insignia uniforme y copy narrativo"
```

---

### Task 6: Reescribir `src/styles/portfolio.css`

**Files:**
- Modify: `src/styles/portfolio.css` (reescritura completa)

- [ ] **Step 1: Reemplazar el archivo completo**

Reemplazar TODO el contenido de `src/styles/portfolio.css` con:

```css
:root {
  --wrap: 1160px;
  --wrap-narrow: 900px;
}

.portfolio-page {
  line-height: 1.5;
  min-height: 100vh;
  padding-top: 64px;
}

.wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 32px; }
.wrap-narrow { max-width: var(--wrap-narrow); margin: 0 auto; padding: 0 32px; }

.eyebrow {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ember);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.eyebrow::before { content: ''; width: 18px; height: 1px; background: var(--ember); }
.eyebrow--plain { color: var(--t3); letter-spacing: 0.16em; font-size: 9px; }
.eyebrow--plain::before { display: none; }
.label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ember);
}
.meta {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--t3);
}
.section {
  padding: clamp(72px, 7vw, 112px) 0;
  border-bottom: 1px solid var(--border);
}
.section:first-of-type { padding-top: calc(clamp(72px, 7vw, 112px) + 64px); }

.hero h1 {
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
  font-weight: 300;
  letter-spacing: -0.032em;
  line-height: 1.05;
  max-width: 20ch;
  margin-top: 8px;
}
.hero p {
  margin-top: 24px;
  font-size: clamp(1rem, 1.3vw, 1.13rem);
  color: var(--t2);
  max-width: 58ch;
  line-height: 1.7;
}

/* --- Franja "Por los números" ------------------------------------------- */
.stats { padding-top: clamp(48px, 5vw, 72px); padding-bottom: clamp(48px, 5vw, 72px); }
.stats__catalog {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 28px;
}
.stat-cat__n {
  font-family: var(--mono);
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 500;
  color: var(--t1);
  line-height: 1;
}
.stat-cat__l { font-size: 11.5px; color: var(--t3); margin-top: 6px; }

.stats__impact-label { margin-bottom: 18px; display: block; }

.stats__anchors {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-bottom: 28px;
}
.stat-anchor__n {
  font-family: var(--mono);
  font-size: clamp(2.4rem, 4.6vw, 3.4rem);
  font-weight: 500;
  color: var(--t1);
  line-height: 1;
}
.stat-anchor__l { font-size: 13.5px; color: var(--t2); margin-top: 10px; }
.stat-anchor__q { font-family: var(--mono); font-size: 10px; color: var(--t3); margin-top: 5px; letter-spacing: 0.03em; }

.stats__support {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px 16px;
}
.stat-support { border-left: 1px solid var(--border); padding-left: 14px; }
.stat-support__n { font-family: var(--mono); font-size: 1.2rem; font-weight: 500; color: var(--t2); line-height: 1; }
.stat-support__l { font-size: 11px; color: var(--t3); margin-top: 5px; line-height: 1.35; }
.stat-support__q { font-family: var(--mono); font-size: 8.5px; color: var(--t3); margin-top: 3px; opacity: 0.75; }

.gallery h2, .support h2 {
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 40px;
  max-width: 44ch;
}
.empty-note { font-size: 13px; color: var(--t3); margin-top: 8px; }
.card {
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-2);
  transition: border-color 200ms var(--ease), transform 250ms var(--ease);
}
.card:hover, .card:focus-visible {
  border-color: var(--t3);
  transform: translateY(-3px);
}

.card__body { padding: 22px 24px; }
.card__title {
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--t1);
  margin: 6px 0 0;
}
.card__caps { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.cap {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--t3);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 4px 8px;
}

/* --- Insignia: grid uniforme, sin featured -------------------------------- */
.gallery__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.card--insignia .card__media { height: 260px; }

.card__media {
  position: relative;
  overflow: hidden;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.card__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05) brightness(0.62);
  transition: filter 320ms var(--ease), transform 320ms var(--ease);
}
.card:hover .card__media img, .card:focus-visible .card__media img {
  filter: grayscale(0.35) contrast(1) brightness(0.8);
  transform: scale(1.02);
}
.card__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 6, 18, 0.1) 0%, rgba(10, 6, 18, 0.72) 100%);
  pointer-events: none;
}
.card__media img.card__logo {
  position: absolute;
  left: 20px;
  bottom: 16px;
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  object-fit: contain;
  background: rgba(10, 6, 18, 0.82);
  border: 1px solid var(--border);
  padding: 4px;
  filter: none;
  transform: none;
}
.card:hover .card__media img.card__logo, .card:focus-visible .card__media img.card__logo { filter: none; transform: none; }

.media-void {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: repeating-linear-gradient(135deg, transparent 0 8px, rgba(139, 124, 158, 0.05) 8px 9px);
  border-bottom: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--t3);
  padding: 16px;
}
.card--insignia .media-void { height: 260px; }

/* --- Soporte --------------------------------------------------------------- */
.support-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.card--support { display: flex; flex-direction: column; padding: 24px 22px; border-radius: 10px; }
.support-card__head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
.support-card__logo {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  object-fit: contain;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 6px;
  flex-shrink: 0;
}
.support-card__logo--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--t2);
  text-transform: uppercase;
}
.support-card__meta { min-width: 0; }
.card--support .card__title { font-size: 15px; font-weight: 700; line-height: 1.35; margin: 5px 0 0; letter-spacing: -0.01em; }
.support-card__desc { font-size: 12.5px; color: var(--t2); line-height: 1.55; margin: 0 0 16px; flex: 1; }
.card--support .card__caps { margin-bottom: 0; }

/* --- Archivo ----------------------------------------------------------------- */
.archive { padding: 56px 0 100px; }
.archive__toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 14px 20px;
  color: var(--t1);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: border-color 200ms var(--ease);
}
.archive__toggle:hover { border-color: var(--ember); }
.archive__glyph { color: var(--t3); }
.archive__note { margin-top: 12px; font-size: 12px; color: var(--t3); max-width: 60ch; }
.archive__grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.archive__cell { background: var(--bg); padding: 16px 18px; }
.archive__cell strong { display: block; font-size: 12.5px; font-weight: 500; color: var(--t2); }
.archive__cell span { font-family: var(--mono); font-size: 9px; color: var(--t3); letter-spacing: 0.04em; display: block; margin-top: 5px; }
[hidden] { display: none !important; }

@media (max-width: 900px) {
  .wrap, .wrap-narrow { padding: 0 20px; }
  .stats__catalog { grid-template-columns: repeat(2, 1fr); }
  .stats__anchors { grid-template-columns: 1fr; gap: 20px; }
  .stats__support { grid-template-columns: repeat(2, 1fr); }
  .gallery__grid { grid-template-columns: 1fr; }
  .support-grid { grid-template-columns: 1fr; }
  .archive__grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { transition: none !important; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/portfolio.css
git commit -m "feat: estilos de la franja de impacto y grid uniforme de Insignia en /portfolio"
```

---

### Task 7: Verificación completa

**Files:** ninguno (solo comandos)

- [ ] **Step 1: Build de producción**

Run: `npx astro build`
Expected: exit 0, sin errores de Zod ni de tipos. Nota: sin `NOTION_TOKEN` local el build falla a propósito (ver CLAUDE.md §5 Tooling) — correr con el token configurado, o usar `astro dev` si el token no está disponible en esta sesión.

- [ ] **Step 2: Revisión visual real en navegador**

Run: `npm run dev` (o `npx astro preview` tras el build)

Abrir `/portfolio` en un navegador real (Claude-in-Chrome o el navegador del usuario) y verificar con scroll físico (no el screenshot automático de `verify:visual`, que no dispara `[data-reveal]` — ver gotcha documentado en CLAUDE.md §5 Tooling):
- La franja "Por los números" muestra las 4 cifras de catálogo + las 2 cifras ancla (con su calificador visible, especialmente el "cost-avoidance modelado" de RODI) + las 6 de apoyo.
- Los 4 casos Insignia se ven con el mismo tratamiento (ningún "featured").
- Ningún ✔/✖ visible en todo `/portfolio`.
- Los 4 casos Insignia tienen banner cargado (si alguno muestra "Sin imagen publicable", avisar a Diego antes de considerar el rediseño listo para publicar).

- [ ] **Step 3: QA de accesibilidad y visual (suite Astro)**

Run: `npx astro build && npm run test:a11y:astro`
Expected: exit 0, sin violaciones nuevas de WCAG A/AA en `/portfolio`.

Run: `npm run verify:visual:astro`
Expected: exit 0 (genera screenshots en `qa-output/screenshots/`, gitignored — recordar el gotcha del punto anterior, confirmar visualmente en navegador real además de este screenshot).

- [ ] **Step 4: Lint de CSS**

Run: `npx stylelint "src/styles/portfolio.css"`
Expected: exit 0, sin errores (usa la config inline de `package.json`, ver CLAUDE.md §5 Tooling).

- [ ] **Step 5: Reportar pendientes fuera de código a Diego**

Estos dos puntos son responsabilidad de Diego en Notion, no de este plan (ya los está ejecutando en paralelo, según la conversación de brainstorming):
1. Propiedad `Orden Insignia` (número) en la base SSOT de casos, llenada para los 4 casos Insignia.
2. Bloques `P1`-`P4` en "Copy Oficial · diegomaury.mx (SSOT)" con el borrador de copy del spec.

Sin estos dos, el sitio sigue funcionando (fallbacks activos: orden por year/title, copy por defecto) pero no refleja aún las decisiones finales de Diego sobre el copy y el orden.

---

## Self-Review

**Cobertura del spec:**
- ✅ Evidencia fuera del listado → Task 5 (sin `hasEvidence`/`tally`/`.counter` en el nuevo archivo).
- ✅ Insignia uniforme sin featured, orden manual → Task 2 (campo) + Task 5 (sort + markup).
- ✅ Franja "Por los números" (catálogo + impacto, caveat obligatorio, sin suma implícita) → Task 5.
- ✅ Soporte sin cambios de datos, sin evidencia → Task 5.
- ✅ Archivo sin cambios → Task 5 (markup idéntico al original).
- ✅ Copy narrativo P1-P4 vía Notion, con fallback → Task 3 (parser) + Task 5 (consumo) + Task 4 (doc).
- ✅ Regla de un solo acento ember → Task 6 (números en `--t1`/`--t2`, ember solo en eyebrows).
- ✅ Fallback de orden determinista (year desc, luego title) → Task 5.
- ✅ Pre-flight de banners → Task 7 Step 2.
- ✅ Actualizar `notion-astro-contract.md` → Task 4.

**Placeholders:** ninguno — cada step trae código completo o comando exacto con output esperado.

**Consistencia de tipos:** `insigniaOrder` se llama igual en `config.ts` (Task 2), `notionLoaders.ts` (Task 2) y `portfolio.astro` (Task 5). `metricBySlug`/`IMPACT_ANCHOR_SLUGS`/`IMPACT_SUPPORT_SLUGS` solo se usan dentro de Task 5, sin referencias cruzadas a otros archivos.
