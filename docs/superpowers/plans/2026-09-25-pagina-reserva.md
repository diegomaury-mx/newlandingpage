# Página /reserva Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `/reserva` (ES) y `/en/reserva` (EN) en diegomaury.mx: la superficie pública del relanzamiento "Reserva conmigo" (mentorías Notion y Programas), con todo el copy y las 2 imágenes servidos desde Notion, sin precios públicos y con una sola puerta de entrada (llamada de diagnóstico de 25 min).

**Architecture:** Nuevo singleton de Notion (`reservaCopy`) clonado 1:1 del patrón ya probado de `siteCopy` (page singleton → `fetchReservaCopy()` en `notionClient.ts` → `reservaCopyLoader` en `notionLoaders.ts` → `defineCollection` en `content.config.ts`). Dos páginas Astro nuevas (`reserva.astro`/`en/reserva.astro`) siguen el patrón exacto de `portfolio.astro`/`en/portfolio.astro`: `BaseLayout` + `parseSiteCopySections()` + helpers de `parseSiteCopy.ts` (2 nuevos: `numberedItems`, `quoteLine`) + traducción a nivel de hoja con `translateCached()` en la versión EN. CSS: `portfolio.css` (compartido) + `reserva.css` nuevo y pequeño (grid de 2 tarjetas, blockquote, iframe de newsletter).

**Tech Stack:** Astro 7 (Content Layer API), TypeScript, Notion API (`@notionhq/client`), DeepL API (traducción cacheada en build), Zod (schema trivial `{title, markdown}`), Playwright (a11y/visual QA).

**Spec:** `docs/superpowers/specs/2026-09-25-pagina-reserva-design.md`

## Global Constraints

- Un solo texto de CTA en toda la página, un solo destino: `https://calendar.notion.so/meet/diegomaurymx/5aad3vun` (mismo link canónico del navbar y de `/portfolio`, ya usado como `CALENDAR_HREF`), `target="_blank" rel="noopener"`.
- Cero precios públicos y cero guion largo (`—`) en el HTML renderizado, ES y EN.
- `--radius: 0` en todo CSS nuevo (regla dura del design system) — nada de `border-radius` distinto de `0` salvo pills/círculos funcionales (no aplica aquí).
- Ninguna `font-size` nueva por debajo de 12px (labels/mono) ni 15px (texto de lectura en `--sans`).
- Ningún párrafo de copy hardcodeado en los `.astro`: todo el contenido editorial viene de la colección `reservaCopy` (Notion), con fallback solo donde el spec lo indica explícitamente.
- Toda página nueva lleva `enableGtm enableClarity` en `<BaseLayout>` y `robots: index,follow` (nunca `noindex`).
- F-23 (CTA del navbar/S8 del home apuntando a `/reserva`) está **fuera de alcance**: no tocar `Navbar.astro`, `index.astro`, ni el CTA de S8.

---

## Prerrequisitos ya resueltos (2026-09-26, sesión de planeación)

Estos 3 puntos del spec (sección "Notion, fuera del repo") ya se ejecutaron vía MCP de Notion durante la redacción de este plan — no hace falta repetirlos, solo verificarlos si algo falla:

1. **Página singleton `reservaCopy` creada.** Título "Reserva conmigo · diegomaury.mx (SSOT)", como página dentro de la base "📚 Diego Maury WIKI" (mismo padre físico que "Copy Oficial · diegomaury.mx (SSOT)"). **Page ID real: `3e70fe3c-51c5-815a-9517-df6e6806a4ef`.** Contenido verificado con `fetch`: 7 secciones `R1`…`R7` + `SEO · Metadatos`, headings `heading_1` en formato `# R<n> · <nombre>`, exactamente el copy aprobado por Diego (spec sección 4).
2. **2 filas nuevas en CMS Imágenes** (`8dda9726-a42d-407d-ba84-334b4a1ef7a1`): `Slot = "reserva-hero"` y `Slot = "reserva-quien-atiende"`, `Estado = "Sin empezar"`, con `Descripcion` explicando qué va en cada una. Diego las completa cuando tenga las fotos; mientras tanto el fallback (`slotSrc()`) cubre.
3. **Las 2 métricas de R4/R5 son texto narrativo dentro del copy de Notion, no lecturas de la colección `metrics`** (a diferencia de la franja "Impacto documentado" de `/portfolio`) — no se creó ninguna fila nueva en "📊 Métricas oficiales". Verificado que `3,231` (HEINEKEN) ya existe como `heineken-proyectos-evaluados` en esa base (sin usarse aquí vía colección, solo como referencia de que el dato no es inventado); no existe una fila para "15+ años de trayectoria" — es intencional, es prosa de R5, no una métrica estructurada.

## Task 1: Extender `parseSiteCopy.ts` — regex de secciones + 2 helpers nuevos + fix de `paragraphs()`

**Files:**
- Modify: `src/utils/parseSiteCopy.ts:11` (regex `SECTION_HEADING`), `src/utils/parseSiteCopy.ts:57-71` (función `paragraphs`), final del archivo (2 funciones nuevas).
- Test: `src/utils/parseSiteCopy.test.ts` (agregar al final).

**Interfaces:**
- Consumes: nada nuevo (funciones puras de string).
- Produces: `numberedItems(blocks: string[]): string[]`, `quoteLine(blocks: string[]): string`, y `parseSiteCopySections()` ahora reconoce también claves `R\d+`. `paragraphs()` mantiene su firma pero ya no incluye ítems de lista numerada `2. `/`3. ` (bug corregido).

- [ ] **Step 1: Escribir los tests que fallan (regex ampliado, `numberedItems`, `quoteLine`, fix de `paragraphs`)**

Añadir al final de `src/utils/parseSiteCopy.test.ts`:

```typescript
test("parseSiteCopySections reconoce tambien claves R<n>", () => {
  const markdown = ["# R1 · Hero", "Contenido R1", "# R2 · Como funciona", "Contenido R2"].join("\n\n");

  const sections = parseSiteCopySections(markdown);

  assert.deepEqual([...sections.keys()], ["R1", "R2"]);
  assert.equal(sections.get("R1")?.label, "Hero");
});

test("paragraphs excluye TODOS los items de lista numerada, no solo '1. '", () => {
  const blocks = ["1. Primer paso", "2. Segundo paso", "3. Tercer paso", "Nota final en texto corrido"];

  assert.deepEqual(paragraphs(blocks), ["Nota final en texto corrido"]);
});

test("numberedItems extrae los textos de una lista numerada, sin el prefijo", () => {
  const blocks = ["1. Primer paso", "Parrafo suelto", "2. Segundo paso", "3. Tercer paso"];

  assert.deepEqual(numberedItems(blocks), ["Primer paso", "Segundo paso", "Tercer paso"]);
});

test("numberedItems devuelve arreglo vacio si no hay items numerados", () => {
  assert.deepEqual(numberedItems(["Solo texto", "# Un heading"]), []);
});

test("quoteLine devuelve el primer bloque de cita sin el prefijo '> '", () => {
  const blocks = ["# Heading", "> Una cita literal.", "Parrafo despues de la cita"];

  assert.equal(quoteLine(blocks), "Una cita literal.");
});

test("quoteLine devuelve string vacio si no hay ninguna cita", () => {
  assert.equal(quoteLine(["Solo texto", "# Un heading"]), "");
});
```

Y agregar `numberedItems` y `quoteLine` al import del `require`/`import` en la cabecera del archivo de test:

```typescript
import {
  bulletItems,
  blocksAfterHeading,
  blocksBeforeHeading,
  ctaLabels,
  firstCodeBlock,
  heading1,
  heading2,
  headingCards,
  numberedItems,
  paragraphs,
  parseFlowDiagram,
  parseSiteCopySections,
  quoteLine,
  valueAfter,
} from "./parseSiteCopy.ts";
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `node --test src/utils/parseSiteCopy.test.ts`
Expected: FAIL — `numberedItems`/`quoteLine` no existen (`TypeError: numberedItems is not a function`), y el test de `paragraphs` con `'2. '`/`'3. '` falla porque hoy esos bloques SÍ se cuelan como párrafos.

- [ ] **Step 3: Ampliar el regex, arreglar `paragraphs()` y agregar los 2 helpers**

En `src/utils/parseSiteCopy.ts:11`, reemplazar:

```typescript
const SECTION_HEADING = /^# (S\d+b?|P\d+|SEO) · (.+)$/;
```

por:

```typescript
const SECTION_HEADING = /^# (S\d+b?|P\d+|R\d+|SEO) · (.+)$/;
```

En `src/utils/parseSiteCopy.ts:57-71`, reemplazar la función `paragraphs` completa:

```typescript
/** Bloques de texto corrido: excluye headings, divisores, citas, codigo, listas y placeholders entre corchetes. */
export function paragraphs(blocks: string[]): string[] {
  return blocks
    .map((b) => b.trim())
    .filter(
      (b) =>
        b !== '' &&
        b !== '---' &&
        !b.startsWith('#') &&
        !b.startsWith('>') &&
        !b.startsWith('```') &&
        !b.startsWith('[') &&
        !b.startsWith('- ') &&
        !/^\d+\.\s/.test(b),
    );
}
```

Al final del archivo (después de `parseFlowDiagram`), agregar:

```typescript
/** Items de una lista numerada ("1. texto", "2. texto", ...), sin el prefijo. */
export function numberedItems(blocks: string[]): string[] {
  return blocks
    .map((b) => b.trim())
    .filter((b) => /^\d+\.\s/.test(b))
    .map((b) => b.replace(/^\d+\.\s+/, ''));
}

/** Primer bloque de cita ("> texto"), sin el prefijo. Vacio si no hay ninguna. */
export function quoteLine(blocks: string[]): string {
  const line = blocks.find((b) => b.trim().startsWith('> '));
  if (!line) return '';
  return line.trim().slice(2).trim();
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `node --test src/utils/parseSiteCopy.test.ts`
Expected: PASS (todos los tests existentes siguen en verde — el fix de `paragraphs()` no rompe ningún test previo, ya que ninguno usaba `'2. '`/`'3. '` en sus fixtures).

- [ ] **Step 5: Commit**

```bash
git add src/utils/parseSiteCopy.ts src/utils/parseSiteCopy.test.ts
git commit -m "feat(reserva): amplia parseSiteCopy con seccion R<n>, numberedItems y quoteLine, corrige bug de paragraphs con listas numeradas"
```

## Task 2: `notionClient.ts` — `NOTION_SOURCES.reservaCopy` + `fetchReservaCopy()`

**Files:**
- Modify: `src/services/notionClient.ts:29-44` (`NOTION_SOURCES`), después de `fetchSiteCopy()` (línea ~315).

**Interfaces:**
- Consumes: `NOTION_SOURCES` existente, `fetchBlockChildren`, `isFullPage`, tipo `SiteCopy` ya declarado (se reutiliza, no se duplica).
- Produces: `NOTION_SOURCES.reservaCopy: string`, `fetchReservaCopy(): Promise<SiteCopy>` (Task 3 lo importa).

- [ ] **Step 1: Agregar el ID de la página a `NOTION_SOURCES`**

En `src/services/notionClient.ts:29-44`, agregar una entrada nueva dentro del objeto:

```typescript
export const NOTION_SOURCES = {
  cases: "88257bc9-e575-45e8-90df-f851f96e92f2",
  siteCopy: "d9ab8508-660a-43e8-ac45-9386dd7903d9",
  // Pagina singleton "Reserva conmigo · diegomaury.mx (SSOT)" (2026-09-26):
  // relanzamiento de la oferta de mentorias, mismo patron que siteCopy.
  reservaCopy: "3e70fe3c-51c5-815a-9517-df6e6806a4ef",
  metrics: "213ea2d0-bffc-41b9-9877-92132551461c",
  imageSlots: "8dda9726-a42d-407d-ba84-334b4a1ef7a1",
  testimonials: "d2f2943f-9a0e-445b-bbad-16134ab2c977",
  events: "7c2e4e81-be2f-428c-ad64-73c05beea6b5",
} as const;
```

- [ ] **Step 2: Agregar `fetchReservaCopy()`, clon de `fetchSiteCopy()`**

Después de la función `fetchSiteCopy()` (justo después de la línea que cierra `return { page, blocks };` de esa función), agregar:

```typescript
/** Pagina singleton `Reserva conmigo · diegomaury.mx (SSOT)` + su arbol de bloques. */
export async function fetchReservaCopy(): Promise<SiteCopy> {
  const notion = getNotionClient();
  const page = await notion.pages.retrieve({ page_id: NOTION_SOURCES.reservaCopy });
  if (!isFullPage(page)) {
    throw new Error(
      "[notionClient] La pagina reservaCopy no devolvio un objeto completo. " +
        "Verifica que la integracion tenga acceso a 'Reserva conmigo · diegomaury.mx (SSOT)'.",
    );
  }
  const blocks = await fetchBlockChildren(NOTION_SOURCES.reservaCopy);
  return { page, blocks };
}
```

- [ ] **Step 3: Verificar que el archivo sigue compilando**

Run: `npx tsc --noEmit --pretty false`
Expected: Sin errores nuevos relacionados a `notionClient.ts` (puede haber ruido preexistente del `@ts-expect-error` de `events`, ya documentado — no es de esta tarea).

- [ ] **Step 4: Commit**

```bash
git add src/services/notionClient.ts
git commit -m "feat(reserva): agrega NOTION_SOURCES.reservaCopy y fetchReservaCopy()"
```

## Task 3: `notionLoaders.ts` — `reservaCopyLoader`

**Files:**
- Modify: `src/services/notionLoaders.ts:23-42` (import de `notionClient.ts`), después de `siteCopyLoader` (línea ~593).

**Interfaces:**
- Consumes: `fetchReservaCopy` (Task 2), `getTitle`, `blocksToMarkdown`, `hasNotionToken` (ya importados en el archivo).
- Produces: `reservaCopyLoader: Loader` (Task 4 lo importa en `content.config.ts`).

- [ ] **Step 1: Agregar `fetchReservaCopy` al import existente de `notionClient.ts`**

En `src/services/notionLoaders.ts:23-42`, el bloque de import queda:

```typescript
import {
  fetchBlockChildren,
  fetchCases,
  fetchEvents,
  fetchImageSlots,
  fetchMetrics,
  fetchReservaCopy,
  fetchSiteCopy,
  fetchTestimonials,
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

- [ ] **Step 2: Agregar `reservaCopyLoader`, clon de `siteCopyLoader`**

Justo después del cierre de `siteCopyLoader` (después de la línea `};` que cierra ese objeto, alrededor de la línea 593), agregar:

```typescript
/** Singleton `reservaCopy`: id fijo `reserva`; cuerpo aplanado a Markdown. */
export const reservaCopyLoader: Loader = {
  name: "notion-reserva-copy",
  load: async ({ store, logger, parseData }: LoaderContext) => {
    store.clear();
    if (!hasNotionToken()) {
      if (import.meta.env.PROD) {
        throw new Error(
          "[notion-reserva-copy] NOTION_TOKEN requerido para el build de produccion.",
        );
      }
      logger.warn(
        "[notion-reserva-copy] NOTION_TOKEN ausente: reservaCopy vacio (scaffolding en dev).",
      );
      return;
    }
    const { page, blocks } = await fetchReservaCopy();
    const raw = {
      title: getTitle(page, "title"),
      markdown: blocksToMarkdown(blocks),
    };
    const data = await parseData({ id: "reserva", data: raw });
    store.set({ id: "reserva", data });
  },
};
```

- [ ] **Step 3: Verificar que el archivo sigue compilando**

Run: `npx tsc --noEmit --pretty false`
Expected: Sin errores nuevos relacionados a `notionLoaders.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/services/notionLoaders.ts
git commit -m "feat(reserva): agrega reservaCopyLoader (singleton Reserva conmigo)"
```

## Task 4: `content.config.ts` — colección `reservaCopy`

**Files:**
- Modify: `src/content.config.ts:17-27` (import de `notionLoaders.ts`), después de la colección `siteCopy` (línea ~199), `src/content.config.ts:266-273` (`export const collections`).

**Interfaces:**
- Consumes: `reservaCopyLoader` (Task 3).
- Produces: colección Astro `reservaCopy`, consumible vía `getCollection('reservaCopy')` en `entry.data.title` / `entry.data.markdown` (Tasks 6 y 7 la consumen, `entry.id === 'reserva'`).

- [ ] **Step 1: Agregar `reservaCopyLoader` al import existente**

En `src/content.config.ts:17-27`, el bloque de import queda:

```typescript
import {
  CASE_TRANSLATABLE_FIELDS,
  METRIC_TRANSLATABLE_FIELDS,
  TESTIMONIAL_TRANSLATABLE_FIELDS,
  casesLoader,
  eventsLoader,
  imageSlotsLoader,
  metricsLoader,
  reservaCopyLoader,
  siteCopyLoader,
  testimonialsLoader,
} from './services/notionLoaders.ts';
```

- [ ] **Step 2: Declarar la colección, clon exacto de `siteCopy`**

Justo después del bloque `siteCopy` (después de la línea 199, `});`), agregar:

```typescript
// ─── Reserva conmigo (fuente: Reserva conmigo · diegomaury.mx, singleton) ─────

const reservaCopy = defineCollection({
  loader: reservaCopyLoader,
  schema: z.object({
    title: z.string(),
    markdown: z.string(),
  }),
});
```

- [ ] **Step 3: Exportar la colección**

En `src/content.config.ts:266-273`, el bloque queda:

```typescript
export const collections = {
  cases,
  metrics,
  siteCopy,
  reservaCopy,
  imageSlots,
  testimonials,
  events,
};
```

- [ ] **Step 4: Verificar que Astro sincroniza el schema sin errores**

Run: `npx astro sync`
Expected: Termina sin error (puede tardar por el fetch de Notion en `siteCopy`/`cases`; si falla por timeout, reintentar máx. 2 veces antes de escalar).

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(reserva): declara la coleccion reservaCopy en content.config.ts"
```

## Task 5: `public/_headers` — CSP `frame-src` para el embed de Substack

**Files:**
- Modify: `public/_headers:8`.

**Interfaces:**
- Consumes: nada (archivo de configuración estático).
- Produces: origen `https://diegomaury.substack.com` permitido en `frame-src` (Task 8 lo necesita para el `<iframe>` del newsletter).

- [ ] **Step 1: Ampliar `frame-src` en la línea de CSP**

En `public/_headers:8`, la línea actual es:

```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://widget.senja.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.clarity.ms https://*.clarity.ms https://widget.senja.io; frame-src https://www.youtube.com https://drive.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

Reemplazar solo el segmento `frame-src` por:

```
frame-src https://www.youtube.com https://drive.google.com https://diegomaury.substack.com;
```

de modo que la línea completa quede:

```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://widget.senja.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.clarity.ms https://*.clarity.ms https://widget.senja.io; frame-src https://www.youtube.com https://drive.google.com https://diegomaury.substack.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

- [ ] **Step 2: Verificar que el archivo sigue siendo una sola línea de CSP válida**

Run: `grep -c "^  Content-Security-Policy" public/_headers` (o en PowerShell: `(Select-String -Path public/_headers -Pattern '^  Content-Security-Policy').Count`)
Expected: `1` (una sola línea de CSP, sin duplicados ni saltos de línea accidentales).

- [ ] **Step 3: Commit**

```bash
git add public/_headers
git commit -m "feat(reserva): permite el embed de Substack en la CSP (frame-src)"
```

## Task 6: `reserva.css` — estilos nuevos y pequeños (tarjetas de oferta, cita, newsletter)

**Files:**
- Create: `src/styles/reserva.css`.

**Interfaces:**
- Consumes: tokens del design system (`--ember`, `--ember-fill`, `--bg-2`, `--border`, `--t1`, `--t2`, `--t3`, `--mono`) ya definidos en `src/styles/variables.css` (importado globalmente por `BaseLayout.astro`).
- Produces: clases `.offers`, `.offer-card`, `.attend-grid`, `.attend-photo`, `.attend-quote`, `.newsletter`, `.newsletter-embed`, más 3 reglas clonadas de `.cta-steps`/`.cta-step`/`.cta-step-n` (Task 7 y 8 las consumen).

- [ ] **Step 1: Crear el archivo con los estilos**

```css
/* Estilos propios de /reserva y /en/reserva. Reusa .wrap/.wrap-narrow/.eyebrow/
   .section/.hero/.closing/.btn-primary/.btn-ghost de portfolio.css/globals.css
   (importados por separado en cada pagina) — este archivo SOLO cubre lo que
   no existe en ningun otro lado: la rejilla de 2 ofertas (R3/R4), la cita de
   "Quien te atiende" (R5) y el contenedor del iframe de newsletter.
   Nota: .cta-steps/.cta-step/.cta-step-n de home.css se clonan aqui (3 reglas)
   en vez de importar el archivo completo de home.css, que trae ~600 lineas de
   estilos de secciones que esta pagina no usa (presupuesto de CSS por pagina). */

.reserva-steps {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 0; overflow: hidden; margin-bottom: 32px; text-align: left;
}
@media (max-width: 680px) { .reserva-steps { grid-template-columns: 1fr; } }
.reserva-step { background: var(--bg-2); padding: 28px 26px 32px; position: relative; }
.reserva-step::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: transparent; transition: background 200ms; }
.reserva-step:hover::before { background: var(--ember); }
.reserva-step-n { font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ember); margin-bottom: 18px; }
.reserva-step-d { font-size: 15px; color: var(--t2); line-height: 1.6; }

.reserva-price-note { color: var(--t3); font-size: 15px; line-height: 1.7; max-width: 62ch; }

.offers {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 0; overflow: hidden;
}
@media (max-width: 780px) { .offers { grid-template-columns: 1fr; } }
.offer-card { background: var(--bg-2); padding: 36px 32px; }
.offer-card h3 { font-size: clamp(1.15rem, 1.8vw, 1.4rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin: 0 0 18px; color: var(--t1); }
.offer-card p { color: var(--t2); font-size: 15px; line-height: 1.7; margin: 0 0 14px; }
.offer-card p:last-child { margin-bottom: 0; }

.attend-grid { display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: start; }
@media (max-width: 780px) { .attend-grid { grid-template-columns: 1fr; } }
.attend-photo { width: 100%; height: auto; border: 1px solid var(--border); border-radius: 0; display: block; }
.attend-quote {
  margin: 0 0 20px; padding: 16px 20px; border-left: 2px solid var(--ember); border-radius: 0;
  background: var(--ember-fill); color: var(--t1); font-size: 1.15rem; font-weight: 500; line-height: 1.5;
}
.attend-body p { color: var(--t2); font-size: 15px; line-height: 1.7; margin: 0 0 14px; }
.attend-body p:last-child { margin-bottom: 0; }

.newsletter-section { text-align: center; }
.newsletter-section p { color: var(--t2); font-size: 15px; max-width: 52ch; margin: 0 auto 28px; }
.newsletter-embed { max-width: 480px; margin: 0 auto; border: 1px solid var(--border); border-radius: 0; overflow: hidden; }
.newsletter-embed iframe { display: block; width: 100%; border: none; }
```

- [ ] **Step 2: Verificar que no hay `border-radius` distinto de `0`**

Run: `grep -n "border-radius" src/styles/reserva.css`
Expected: Todas las ocurrencias muestran `border-radius: 0;` (ninguna con otro valor).

- [ ] **Step 3: Commit**

```bash
git add src/styles/reserva.css
git commit -m "feat(reserva): agrega reserva.css (tarjetas de oferta, cita, newsletter)"
```

## Task 7: `src/pages/reserva.astro` — página ES

**Files:**
- Create: `src/pages/reserva.astro`.

**Interfaces:**
- Consumes: colección `reservaCopy` (Task 4, `entry.id === 'reserva'`), colección `imageSlots` (ya existente), `parseSiteCopySections`/`heading1`/`heading2`/`paragraphs`/`ctaLabels`/`numberedItems`/`quoteLine`/`valueAfter` de `parseSiteCopy.ts` (Task 1), `toLocalePath` de `locale.ts`, `BaseLayout` de `layouts/BaseLayout.astro`, `portfolio.css` + `reserva.css` (Task 6).
- Produces: ruta `/reserva` navegable; `otherLocaleHref` apunta a `/en/reserva` (Task 8 la crea).

- [ ] **Step 1: Crear el archivo completo**

```astro
---
// Pagina /reserva: relanzamiento "Reserva conmigo" (mentorias Notion y
// Programas). Mismo patron que portfolio.astro: BaseLayout + parseSiteCopy
// sobre un singleton propio de Notion (reservaCopy, ver content.config.ts).
// F-23 (CTA navbar/S8 del home apuntando aqui) queda fuera de alcance: esta
// pagina no se enlaza todavia desde ningun otro lado del sitio.
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import {
  parseSiteCopySections,
  heading1,
  heading2,
  paragraphs,
  ctaLabels,
  numberedItems,
  quoteLine,
  valueAfter,
} from '../utils/parseSiteCopy.ts';
import { toLocalePath } from '../utils/locale.ts';
import '../styles/portfolio.css';
import '../styles/reserva.css';

const reservaCopyEntries = await getCollection('reservaCopy');
const reservaCopyEntry = reservaCopyEntries.find((entry) => entry.id === 'reserva');
const sections = reservaCopyEntry
  ? parseSiteCopySections(reservaCopyEntry.data.markdown)
  : new Map();

const heroEyebrow = 'Reserva conmigo';
const CALENDAR_HREF = 'https://calendar.notion.so/meet/diegomaurymx/5aad3vun';
const SENJA_HREF = 'https://senja.io/p/diegomaury/9awUK8';

// --- R1 · Hero ---------------------------------------------------------------
const r1 = sections.get('R1')?.blocks ?? [];
const heroH1 = heading1(r1);
const heroParas = paragraphs(r1);
const heroLede = heroParas[0] ?? '';
const heroSupport = heroParas[1] ?? '';
const heroCta = ctaLabels(r1)[0] ?? 'Agenda tu llamada de diagnóstico';

// --- R2 · Como funciona --------------------------------------------------------
const r2 = sections.get('R2')?.blocks ?? [];
const howHeadline = sections.get('R2')?.label ?? 'Cómo funciona';
const howSteps = numberedItems(r2);
const priceNote = paragraphs(r2)[0] ?? '';

// --- R3/R4 · Ofertas -----------------------------------------------------------
const r3 = sections.get('R3')?.blocks ?? [];
const r4 = sections.get('R4')?.blocks ?? [];
const notionOfferTitle = heading2(r3);
const notionOfferParas = paragraphs(r3);
const programsOfferTitle = heading2(r4);
const programsOfferParas = paragraphs(r4);

// --- R5 · Quien te atiende -------------------------------------------------------
const r5 = sections.get('R5')?.blocks ?? [];
const attendQuote = quoteLine(r5);
const attendParas = paragraphs(r5);

const imageSlotEntries = await getCollection('imageSlots');
function slotSrc(slotId: string, fallback: string): string {
  const entry = imageSlotEntries.find((e) => e.id === slotId);
  return entry?.data.status === 'Listo' && entry.data.imageUrl ? entry.data.imageUrl : fallback;
}
const attendPhoto = slotSrc('reserva-quien-atiende', '/cms-media/diego/diegomaurypng.png');

// --- R6 · Testimonios --------------------------------------------------------
const r6 = sections.get('R6')?.blocks ?? [];
const testimonialsHeadline = heading2(r6);
const testimonialsLinkText = paragraphs(r6)[0] ?? 'Leer testimonios completos';

// --- Newsletter (fijo, no editorial) -------------------------------------------
const newsletterText = 'Suscríbete a mi newsletter para más reflexiones sobre sistemas, programas y ejecución.';

// --- R7 · CTA final ------------------------------------------------------------
const r7 = sections.get('R7')?.blocks ?? [];
const closingHeadline = heading2(r7);
const closingCta = ctaLabels(r7)[0] ?? 'Agenda tu llamada de diagnóstico';
const closingParas = paragraphs(r7);
const closingLine = closingParas[1] ?? closingParas[0] ?? '';

// --- SEO -----------------------------------------------------------------------
const seo = sections.get('SEO')?.blocks ?? [];
const pageTitle = valueAfter(seo, 'title') || 'Reserva conmigo · Diego Maury';
const pageDescription =
  valueAfter(seo, 'description') ||
  'Agenda una llamada de diagnóstico de 25 minutos con Diego Maury: mentoría en sistemas con Notion o en diseño y operación de programas. Sin costo, sin pitch.';
const canonicalUrl = new URL('/reserva', Astro.site).toString();
const enUrl = new URL('/en/reserva', Astro.site).toString();
const ogImage = new URL('/assets/img/diego-maury.jpg', Astro.site).toString();
---

<BaseLayout
  title={pageTitle}
  description={pageDescription}
  canonicalUrl={canonicalUrl}
  ogImage={ogImage}
  alternateUrls={[{ lang: 'es', url: canonicalUrl }, { lang: 'en', url: enUrl }]}
  otherLocaleHref={toLocalePath(Astro.url.pathname, 'en')}
  enableGtm
  enableClarity
>
  <div class="portfolio-page">
<section class="section hero">
  <div class="wrap">
    <div class="eyebrow">{heroEyebrow}</div>
    <h1>{heroH1}</h1>
    {heroLede && <p>{heroLede}</p>}
    {heroSupport && <p>{heroSupport}</p>}
    <div class="closing__ctas" style="justify-content:flex-start; margin-top:28px;">
      <a class="btn-primary" href={CALENDAR_HREF} target="_blank" rel="noopener">{heroCta}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="eyebrow eyebrow--plain">{howHeadline}</div>
    {howSteps.length > 0 && (
      <div class="reserva-steps">
        {howSteps.map((step, i) => (
          <div class="reserva-step">
            <div class="reserva-step-n">Paso {i + 1}</div>
            <div class="reserva-step-d">{step}</div>
          </div>
        ))}
      </div>
    )}
    {priceNote && <p class="reserva-price-note">{priceNote}</p>}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="offers">
      <div class="offer-card">
        {notionOfferTitle && <h3>{notionOfferTitle}</h3>}
        {notionOfferParas.map((p) => <p>{p}</p>)}
      </div>
      <div class="offer-card">
        {programsOfferTitle && <h3>{programsOfferTitle}</h3>}
        {programsOfferParas.map((p) => <p>{p}</p>)}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap-narrow">
    <div class="attend-grid">
      <img class="attend-photo" src={attendPhoto} width="520" height="650" alt="Diego Maury" loading="lazy" />
      <div class="attend-body">
        {attendQuote && <blockquote class="attend-quote">{attendQuote}</blockquote>}
        {attendParas.map((p) => <p>{p}</p>)}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap-narrow" style="text-align:center;">
    {testimonialsHeadline && <h2>{testimonialsHeadline}</h2>}
    <p><a class="btn-ghost" href={SENJA_HREF} target="_blank" rel="noopener">{testimonialsLinkText}</a></p>
  </div>
</section>

<section class="section newsletter-section">
  <div class="wrap-narrow">
    <p>{newsletterText}</p>
    <div class="newsletter-embed">
      <iframe src="https://diegomaury.substack.com/embed" width="100%" height="320" frameborder="0" scrolling="no" title="Newsletter de Diego Maury"></iframe>
    </div>
  </div>
</section>

<section class="section closing">
  <div class="wrap-narrow">
    {closingHeadline && <h2>{closingHeadline}</h2>}
    {closingLine && <p>{closingLine}</p>}
    <div class="closing__ctas">
      <a class="btn-primary" href={CALENDAR_HREF} target="_blank" rel="noopener">{closingCta}</a>
    </div>
  </div>
</section>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build local y verificación de reglas duras**

Run: `npx astro build`
Expected: `[build] Complete!` sin errores, incluye `dist/reserva/index.html`.

Run: `grep -n "—" dist/reserva/index.html` (o PowerShell: `Select-String -Path dist/reserva/index.html -Pattern "—"`)
Expected: sin resultados (cero guion largo).

Run: `grep -o "Agenda tu llamada de diagnóstico" dist/reserva/index.html | wc -l` (o contar apariciones del mismo texto de CTA)
Expected: exactamente 2 apariciones (hero + cierre), ambas apuntando a `CALENDAR_HREF` — verificar con `grep -n "calendar.notion.so" dist/reserva/index.html` que solo aparece ese destino de CTA (más allá del que ya trae `Navbar.astro` por defecto).

- [ ] **Step 3: Commit**

```bash
git add src/pages/reserva.astro
git commit -m "feat(reserva): crea la pagina /reserva (ES)"
```

## Task 8: `src/pages/en/reserva.astro` — página EN

**Files:**
- Create: `src/pages/en/reserva.astro`.

**Interfaces:**
- Consumes: mismos helpers que Task 7, más `translateCached` de `services/deeplTranslationCache.ts` para traducir cada string a nivel de hoja (mismo patrón que `en/portfolio.astro`).
- Produces: ruta `/en/reserva` navegable; `otherLocaleHref` apunta a `/reserva`.

- [ ] **Step 1: Crear el archivo completo**

```astro
---
// Version /en/reserva de src/pages/reserva.astro. Misma coleccion
// reservaCopy; el parseo (parseSiteCopySections/heading1/heading2/paragraphs/
// ctaLabels/numberedItems/quoteLine/valueAfter) corre igual sobre el markdown
// en espanol y CADA STRING extraido se traduce a nivel de hoja con
// translateCached() — mismo patron que en/portfolio.astro. Sin cuota de DeepL
// disponible, translateCached devuelve el texto en espanol sin romper el build.
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import {
  parseSiteCopySections,
  heading1,
  heading2,
  paragraphs,
  ctaLabels,
  numberedItems,
  quoteLine,
  valueAfter,
} from '../../utils/parseSiteCopy.ts';
import { translateCached } from '../../services/deeplTranslationCache.ts';
import { toLocalePath } from '../../utils/locale.ts';
import { uiEn } from '../../i18n/ui.ts';
import '../../styles/portfolio.css';
import '../../styles/reserva.css';

const reservaCopyEntries = await getCollection('reservaCopy');
const reservaCopyEntry = reservaCopyEntries.find((entry) => entry.id === 'reserva');
const sections = reservaCopyEntry
  ? parseSiteCopySections(reservaCopyEntry.data.markdown)
  : new Map();

const heroEyebrow = await translateCached('Reserva conmigo', 'EN-US', console);
const CALENDAR_HREF = 'https://calendar.notion.so/meet/diegomaurymx/5aad3vun';
const SENJA_HREF = 'https://senja.io/p/diegomaury/9awUK8';

// --- R1 · Hero ---------------------------------------------------------------
const r1 = sections.get('R1')?.blocks ?? [];
const heroH1 = await translateCached(heading1(r1), 'EN-US', console);
const heroParasEs = paragraphs(r1);
const heroLede = await translateCached(heroParasEs[0] ?? '', 'EN-US', console);
const heroSupport = await translateCached(heroParasEs[1] ?? '', 'EN-US', console);
const heroCta = await translateCached(
  ctaLabels(r1)[0] ?? 'Agenda tu llamada de diagnóstico',
  'EN-US',
  console,
);

// --- R2 · Como funciona --------------------------------------------------------
const r2 = sections.get('R2')?.blocks ?? [];
const howHeadline = await translateCached(sections.get('R2')?.label ?? 'Cómo funciona', 'EN-US', console);
const howStepsEs = numberedItems(r2);
const howSteps = await Promise.all(howStepsEs.map((step) => translateCached(step, 'EN-US', console)));
const priceNote = await translateCached(paragraphs(r2)[0] ?? '', 'EN-US', console);

// --- R3/R4 · Ofertas -----------------------------------------------------------
const r3 = sections.get('R3')?.blocks ?? [];
const r4 = sections.get('R4')?.blocks ?? [];
const notionOfferTitle = await translateCached(heading2(r3), 'EN-US', console);
const notionOfferParas = await Promise.all(paragraphs(r3).map((p) => translateCached(p, 'EN-US', console)));
const programsOfferTitle = await translateCached(heading2(r4), 'EN-US', console);
const programsOfferParas = await Promise.all(paragraphs(r4).map((p) => translateCached(p, 'EN-US', console)));

// --- R5 · Quien te atiende -------------------------------------------------------
const r5 = sections.get('R5')?.blocks ?? [];
const attendQuote = await translateCached(quoteLine(r5), 'EN-US', console);
const attendParas = await Promise.all(paragraphs(r5).map((p) => translateCached(p, 'EN-US', console)));

const imageSlotEntries = await getCollection('imageSlots');
function slotSrc(slotId: string, fallback: string): string {
  const entry = imageSlotEntries.find((e) => e.id === slotId);
  return entry?.data.status === 'Listo' && entry.data.imageUrl ? entry.data.imageUrl : fallback;
}
const attendPhoto = slotSrc('reserva-quien-atiende', '/cms-media/diego/diegomaurypng.png');

// --- R6 · Testimonios --------------------------------------------------------
const r6 = sections.get('R6')?.blocks ?? [];
const testimonialsHeadline = await translateCached(heading2(r6), 'EN-US', console);
const testimonialsLinkText = await translateCached(
  paragraphs(r6)[0] ?? 'Leer testimonios completos',
  'EN-US',
  console,
);

// --- Newsletter (fijo, no editorial) -------------------------------------------
const newsletterText = await translateCached(
  'Suscríbete a mi newsletter para más reflexiones sobre sistemas, programas y ejecución.',
  'EN-US',
  console,
);

// --- R7 · CTA final ------------------------------------------------------------
const r7 = sections.get('R7')?.blocks ?? [];
const closingHeadline = await translateCached(heading2(r7), 'EN-US', console);
const closingCta = await translateCached(
  ctaLabels(r7)[0] ?? 'Agenda tu llamada de diagnóstico',
  'EN-US',
  console,
);
const closingParasEs = paragraphs(r7);
const closingLineEs = closingParasEs[1] ?? closingParasEs[0] ?? '';
const closingLine = await translateCached(closingLineEs, 'EN-US', console);

// --- SEO -----------------------------------------------------------------------
const pageTitle = 'Book a call · Diego Maury';
const pageDescription = await translateCached(
  'Agenda una llamada de diagnóstico de 25 minutos con Diego Maury: mentoría en sistemas con Notion o en diseño y operación de programas. Sin costo, sin pitch.',
  'EN-US',
  console,
);
const canonicalUrl = new URL('/en/reserva', Astro.site).toString();
const esUrl = new URL('/reserva', Astro.site).toString();
const ogImage = new URL('/assets/img/diego-maury.jpg', Astro.site).toString();
---

<BaseLayout
  title={pageTitle}
  description={pageDescription}
  canonicalUrl={canonicalUrl}
  ogImage={ogImage}
  alternateUrls={[{ lang: 'es', url: esUrl }, { lang: 'en', url: canonicalUrl }]}
  otherLocaleHref={toLocalePath(Astro.url.pathname, 'es')}
  ctaLabel={uiEn.nav.ctaLabel}
  enableGtm
  enableClarity
>
  <div class="portfolio-page">
<section class="section hero">
  <div class="wrap">
    <div class="eyebrow">{heroEyebrow}</div>
    <h1>{heroH1}</h1>
    {heroLede && <p>{heroLede}</p>}
    {heroSupport && <p>{heroSupport}</p>}
    <div class="closing__ctas" style="justify-content:flex-start; margin-top:28px;">
      <a class="btn-primary" href={CALENDAR_HREF} target="_blank" rel="noopener">{heroCta}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="eyebrow eyebrow--plain">{howHeadline}</div>
    {howSteps.length > 0 && (
      <div class="reserva-steps">
        {howSteps.map((step, i) => (
          <div class="reserva-step">
            <div class="reserva-step-n">Step {i + 1}</div>
            <div class="reserva-step-d">{step}</div>
          </div>
        ))}
      </div>
    )}
    {priceNote && <p class="reserva-price-note">{priceNote}</p>}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="offers">
      <div class="offer-card">
        {notionOfferTitle && <h3>{notionOfferTitle}</h3>}
        {notionOfferParas.map((p) => <p>{p}</p>)}
      </div>
      <div class="offer-card">
        {programsOfferTitle && <h3>{programsOfferTitle}</h3>}
        {programsOfferParas.map((p) => <p>{p}</p>)}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap-narrow">
    <div class="attend-grid">
      <img class="attend-photo" src={attendPhoto} width="520" height="650" alt="Diego Maury" loading="lazy" />
      <div class="attend-body">
        {attendQuote && <blockquote class="attend-quote">{attendQuote}</blockquote>}
        {attendParas.map((p) => <p>{p}</p>)}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap-narrow" style="text-align:center;">
    {testimonialsHeadline && <h2>{testimonialsHeadline}</h2>}
    <p><a class="btn-ghost" href={SENJA_HREF} target="_blank" rel="noopener">{testimonialsLinkText}</a></p>
  </div>
</section>

<section class="section newsletter-section">
  <div class="wrap-narrow">
    <p>{newsletterText}</p>
    <div class="newsletter-embed">
      <iframe src="https://diegomaury.substack.com/embed" width="100%" height="320" frameborder="0" scrolling="no" title="Diego Maury's newsletter"></iframe>
    </div>
  </div>
</section>

<section class="section closing">
  <div class="wrap-narrow">
    {closingHeadline && <h2>{closingHeadline}</h2>}
    {closingLine && <p>{closingLine}</p>}
    <div class="closing__ctas">
      <a class="btn-primary" href={CALENDAR_HREF} target="_blank" rel="noopener">{closingCta}</a>
    </div>
  </div>
</section>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build local y verificación**

Run: `npx astro build`
Expected: `[build] Complete!`, incluye `dist/en/reserva/index.html`.

Run: `grep -n "—" dist/en/reserva/index.html`
Expected: sin resultados.

Si `DEEPL_API_KEY` no está configurado o sin cuota: el texto se sirve en español (comportamiento esperado, documentado en `CLAUDE.md` — no es un bug de esta tarea).

- [ ] **Step 3: Commit**

```bash
git add src/pages/en/reserva.astro
git commit -m "feat(reserva): crea la pagina /en/reserva (EN, traduccion a nivel de hoja)"
```

## Task 9: `tests/qa/pages.astro.ts` — registrar `/reserva` en la suite de QA

**Files:**
- Modify: `tests/qa/pages.astro.ts:24-41` (`BILINGUAL_PAGES`).

**Interfaces:**
- Consumes: `enVariant()` ya existente en el archivo.
- Produces: `ASTRO_QA_PAGES` incluye `reserva`/`reserva-en` (a11y + visual).

- [ ] **Step 1: Agregar la entrada**

En `tests/qa/pages.astro.ts:24-41`, agregar una línea al arreglo `BILINGUAL_PAGES` (después de `portfolio-index`, antes de los casos, para mantener el orden temático):

```typescript
const BILINGUAL_PAGES = [
  { name: 'home', path: '/' },
  { name: 'portfolio-index', path: '/portfolio/' },
  { name: 'reserva', path: '/reserva/' },
  { name: 'caso-sofi', path: '/portfolio/sofi/' },
  // ... (resto de la lista sin cambios)
];
```

- [ ] **Step 2: Verificar que `ASTRO_QA_PAGES` incluye ambas rutas**

Run: `node -e "const {ASTRO_QA_PAGES} = require('./tests/qa/pages.astro.ts'); console.log(ASTRO_QA_PAGES.filter(p => p.name.startsWith('reserva')))"` (si el `require` de un `.ts` falla por ESM, verificar en su lugar leyendo el archivo o corriendo la suite completa en el Step 3 — no bloquea la tarea).

- [ ] **Step 3: Commit**

```bash
git add tests/qa/pages.astro.ts
git commit -m "test(reserva): agrega /reserva y /en/reserva a la suite de QA (a11y + visual)"
```

## Task 10: Verificación final end-to-end

**Files:** ninguno (solo verificación).

**Interfaces:** ninguna nueva.

- [ ] **Step 1: Build completo desde cero**

Run: `npx astro build`
Expected: `[build] Complete!`, sin errores. Confirmar que el log realmente dice `N page(s) built` (no basta el exit code 0 — ver gotcha de build engañoso documentado en `CLAUDE.md`).

- [ ] **Step 2: Verificar `dist/sitemap-index.xml` incluye las 2 rutas nuevas**

Run: `grep -o "reserva" dist/sitemap-index.xml dist/sitemap-*.xml` (o revisar manualmente el/los archivo(s) `sitemap-N.xml` que referencia `sitemap-index.xml`)
Expected: al menos 2 coincidencias (`/reserva/` y `/en/reserva/`).

- [ ] **Step 3: Arrancar `astro preview` y correr a11y + visual**

Run: `npx astro preview --port 4322` (en background), verificar con `curl -s -o /dev/null -w "%{http_code}" http://localhost:4322/reserva/` que responde `200`.

Run: `npm run test:a11y:astro`
Expected: sin violaciones nuevas en `reserva`/`reserva-en` (WCAG A/AA).

Run: `npm run verify:visual:astro`
Expected: genera capturas en `qa-output/screenshots-astro/` para `reserva`/`reserva-en` en desktop y mobile, sin errores de Playwright.

Al terminar: `npx astro preview stop` (liberar el puerto 4322).

- [ ] **Step 4: Verificación visual real en Chrome (obligatoria por regla del repo, no sustituible por HTTP 200)**

Si Claude-in-Chrome está disponible: navegar a `http://localhost:4322/reserva/` (y `/en/reserva/`) a 1440px y 390px, confirmar:
- El iframe de Substack carga (no queda en blanco) y la consola no muestra errores de `Content-Security-Policy`.
- Un solo CTA visible en todo el DOM con el mismo destino en las 2 apariciones (hero + cierre).
- Las imágenes de `slotSrc()` muestran el fallback (`diegomaurypng.png`) sin verse rotas.
- Sin overflow horizontal en 390px (rejilla de 2 ofertas y `.attend-grid` colapsan a 1 columna).

Si Claude-in-Chrome NO está disponible: declarar este paso BLOQUEADO explícitamente en el reporte final — no sustituir por el chequeo HTTP 200 del Step 3 (regla dura del `CLAUDE.md`).

- [ ] **Step 5: Grep final de reglas de contenido**

Run (desde la raíz, sobre el HTML generado):
```bash
grep -rn "—" dist/reserva/index.html dist/en/reserva/index.html
grep -n "calendly" dist/reserva/index.html dist/en/reserva/index.html
grep -n "docs.google.com/forms\|calendar.google.com" dist/reserva/index.html dist/en/reserva/index.html
```
Expected: las 3 búsquedas sin resultados (cero guion largo, cero Calendly, cero Google Calendar/Forms).

- [ ] **Step 6: Confirmar que F-23 no se tocó**

Run: `git diff --stat` (contra el estado antes de este plan) o `git log --oneline` de los commits de este plan.
Expected: ningún archivo modificado es `src/components/Navbar.astro`, `src/pages/index.astro`, ni ninguna línea de S8/CTA del home.

---

## Self-Review (registro de la verificación hecha al cerrar este plan)

**Cobertura del spec:** las 11 secciones del spec (objetivo, decisiones, hallazgos técnicos, contenido fuente, reglas de contenido, archivos, estructura de 7 secciones, SEO, criterios de aceptación, fuera de alcance) están cubiertas por las Tasks 1-10: Task 1 cubre el hallazgo técnico #2 (regex + bug de `paragraphs`), Task 5 cubre el hallazgo #3 (CSP), Task 9 cubre el hallazgo #4 (QA), Tasks 7-8 cubren la estructura de 7 secciones completa (tabla del spec sección 7) y el SEO (sección 8), Task 10 cubre los 11 criterios de aceptación (sección 9) uno por uno.

**Placeholders:** ninguno — cada paso trae el código completo, sin "TBD"/"similar a" ni referencias a tipos no definidos en una tarea anterior.

**Consistencia de tipos/nombres:** `numberedItems`/`quoteLine` (Task 1) se usan con la misma firma en Tasks 7 y 8; `NOTION_SOURCES.reservaCopy`/`fetchReservaCopy` (Task 2) alimentan `reservaCopyLoader` (Task 3) que alimenta la colección `reservaCopy` (Task 4) que consumen Tasks 7-8 vía `getCollection('reservaCopy')` + `entry.id === 'reserva'` — cadena verificada de punta a punta contra el patrón real y ya probado de `siteCopy`/`fetchSiteCopy`/`siteCopyLoader`.
