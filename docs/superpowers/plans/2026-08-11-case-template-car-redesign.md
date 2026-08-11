# Rediseño de plantilla de caso a formato CAR — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestructurar la plantilla de caso (`/portfolio/[slug]`) a formato CAR (Contexto → Acción → Resultado), mover el logo al rail, convertir la tabla de Resultados en tarjetas, embeber el video de evidencia y agregar una propiedad `Reflexión` editable en Notion como cierre de la página.

**Architecture:** El body de cada ficha sigue siendo Markdown plano parseado por `renderMarkdown` (`src/utils/markdown.ts`) — no se introduce un parser nuevo, se extiende el existente para detectar la tabla de Resultados bajo el H2 "Resultado" y emitir tarjetas en vez de una tabla HTML genérica, con fallback seguro a tabla normal si los encabezados no matchean exacto. El campo `reflection` es una propiedad Notion nueva, independiente del body, mapeada igual que el resto de los campos de texto de `cases`. El video embebido usa una función pura (`src/utils/embedVideo.ts`) que traduce URLs de YouTube/Drive a su forma embebible, con `null` como señal de "no reconocido" para que la plantilla decida el fallback.

**Tech Stack:** Astro 5 (Content Layer API), TypeScript, Zod, Notion API vía `@notionhq/client`. Sin framework de test para TS en el repo hoy — se usa `node:test` + `node:assert` ejecutado con `npx tsx --test` (ya validado que funciona en este entorno), siguiendo el mismo espíritu que `tools/verify-metrics.test.cjs` mueve para `.cjs`.

**Spec de referencia:** `docs/superpowers/specs/2026-08-11-case-template-car-redesign-design.md`

---

## Task 1: Notion — agregar la propiedad `Reflexión`

**Alcance:** cambio de schema en Notion, no en el repo. No hay commit de git en esta tarea.

- [ ] **Step 1: Agregar la columna vía Notion MCP**

Ejecutar (herramienta `mcp__claude_ai_Notion__notion-update-data-source`):

```json
{
  "data_source_id": "88257bc9-e575-45e8-90df-f851f96e92f2",
  "statements": "ADD COLUMN \"Reflexión\" RICH_TEXT"
}
```

- [ ] **Step 2: Verificar que quedó creada**

Ejecutar `mcp__claude_ai_Notion__notion-fetch` con `id: "collection://88257bc9-e575-45e8-90df-f851f96e92f2"` y confirmar que `"Reflexión"` aparece en el `schema` con `"type":"rich_text"`.

No se llena el valor todavía — eso es el Task 7, después de que el código sepa leerlo.

---

## Task 2: `src/utils/embedVideo.ts` — convertir URL de video a forma embebible

**Files:**
- Create: `src/utils/embedVideo.ts`
- Test: `src/utils/embedVideo.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Crear `src/utils/embedVideo.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert/strict";
import { toEmbeddableVideoUrl } from "./embedVideo.ts";

test("convierte un link de YouTube watch a su forma embed", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

test("convierte un link corto youtu.be a su forma embed", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://youtu.be/dQw4w9WgXcQ"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

test("deja pasar un link que ya es embed de YouTube", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

test("convierte un link de Google Drive (view) a su forma preview", () => {
  assert.equal(
    toEmbeddableVideoUrl("https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing"),
    "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/preview",
  );
});

test("devuelve null para un proveedor no reconocido (fallback a link)", () => {
  assert.equal(toEmbeddableVideoUrl("https://vimeo.com/12345678"), null);
});

test("devuelve null para un link vacío o mal formado", () => {
  assert.equal(toEmbeddableVideoUrl(""), null);
  assert.equal(toEmbeddableVideoUrl("no-es-una-url"), null);
});
```

- [ ] **Step 2: Correr el test y confirmar que falla**

Run: `npx tsx --test src/utils/embedVideo.test.ts`
Expected: FAIL — `Cannot find module './embedVideo.ts'` (el archivo aún no existe).

- [ ] **Step 3: Implementar `embedVideo.ts`**

Crear `src/utils/embedVideo.ts`:

```typescript
/**
 * Convierte una URL de video (YouTube/Drive, guardada en "Videos de evidencia")
 * a su forma embebible en un <iframe>. `null` significa "proveedor no
 * reconocido": la plantilla debe caer al link de texto, nunca romper el build.
 */

const YOUTUBE_WATCH = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{6,})/;
const YOUTUBE_SHORT = /^https?:\/\/youtu\.be\/([\w-]{6,})/;
const YOUTUBE_EMBED = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([\w-]{6,})/;
const DRIVE_FILE = /^https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/(?:view|preview)/;

export function toEmbeddableVideoUrl(url: string): string | null {
  const trimmed = url.trim();

  const watch = trimmed.match(YOUTUBE_WATCH);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;

  const short = trimmed.match(YOUTUBE_SHORT);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;

  if (YOUTUBE_EMBED.test(trimmed)) return trimmed;

  const drive = trimmed.match(DRIVE_FILE);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;

  return null;
}
```

- [ ] **Step 4: Correr el test y confirmar que pasa**

Run: `npx tsx --test src/utils/embedVideo.test.ts`
Expected: `ℹ pass 6`, `ℹ fail 0`

- [ ] **Step 5: Commit**

```bash
git add src/utils/embedVideo.ts src/utils/embedVideo.test.ts
git commit -m "feat: agrega util para convertir URLs de video a forma embebible"
```

---

## Task 3: `src/utils/markdown.ts` — Resultados como tarjetas, con fallback

**Files:**
- Modify: `src/utils/markdown.ts`
- Test: `src/utils/markdown.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/utils/markdown.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "./markdown.ts";

test("una tabla normal (fuera de Resultado) se renderiza como prose-table", () => {
  const md = [
    "## Evidencia",
    "",
    "| Afirmación | Grado |",
    "| --- | --- |",
    "| Registros HubSpot | ✖ pendiente |",
  ].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<div class="prose-table">/);
  assert.doesNotMatch(html, /result-grid/);
});

test("la tabla Métrica|Antes|Después bajo ## Resultado se renderiza como tarjetas", () => {
  const md = [
    "## Resultado",
    "",
    "| Métrica | Antes | Después |",
    "| --- | --- | --- |",
    "| Speed-to-lead | 1–3 días | <5 minutos |",
    "| Leads semanales | 5 | 30 (+500%) |",
    "| Modelos orquestados | — | 3 |",
  ].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<div class="result-grid">/);
  assert.doesNotMatch(html, /prose-table/);
  // valor principal sin el delta
  assert.match(html, /<div class="rc-value">30<\/div>/);
  // delta extraído a su propio bloque
  assert.match(html, /<div class="rc-delta">\+500%<\/div>/);
  // "antes" tachado cuando existe
  assert.match(html, /Antes: <s>1–3 días<\/s>/);
  // "antes" omitido cuando la celda es "—"
  assert.doesNotMatch(html, /Antes: <s>—<\/s>/);
});

test("una tabla bajo ## Resultado con encabezados distintos degrada a prose-table (fallback)", () => {
  const md = [
    "## Resultado",
    "",
    "| Metrica | Valor |",
    "| --- | --- |",
    "| Leads semanales | 30 |",
  ].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<div class="prose-table">/);
  assert.doesNotMatch(html, /result-grid/);
});

test("el rail-nav (extractSections) sigue derivando 3 secciones de un body CAR", () => {
  const md = ["## Contexto", "", "texto", "", "## Acción", "", "texto", "", "## Resultado", "", "texto"].join("\n");
  const html = renderMarkdown(md);
  assert.match(html, /<h2 id="contexto">Contexto<\/h2>/);
  assert.match(html, /<h2 id="accion">Acción<\/h2>/);
  assert.match(html, /<h2 id="resultado">Resultado<\/h2>/);
});
```

- [ ] **Step 2: Correr los tests y confirmar que fallan**

Run: `npx tsx --test src/utils/markdown.test.ts`
Expected: FAIL en los tests 2 y 3 (no existe todavía `result-grid`; el código actual renderiza toda tabla como `prose-table`).

- [ ] **Step 3: Refactorizar `renderTable` para separar el parseo de filas**

En `src/utils/markdown.ts`, reemplazar la función `renderTable` actual (líneas 28-44) por:

```typescript
function parseTableRows(lines: string[]): { header: string[]; body: string[][] } {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const [header, separator, ...rest] = rows;
  const isSeparator = separator?.every((cell) => /^-+$/.test(cell));
  const body = isSeparator ? rest : rows.slice(1);
  return { header, body };
}

function renderTable(lines: string[]): string {
  const { header, body } = parseTableRows(lines);
  const headHtml = header.map((cell) => `<th>${renderInline(cell)}</th>`).join("");
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="prose-table"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}
```

- [ ] **Step 4: Agregar la detección y el render de tarjetas de Resultado**

Justo debajo de `renderTable` (todavía en `src/utils/markdown.ts`), agregar:

```typescript
const RESULT_SECTION_ID = "resultado";
const RESULT_TABLE_HEADERS = ["Métrica", "Antes", "Después"];

/** true solo si los encabezados coinciden exacto, en orden — el fallback (renderTable) cubre cualquier otro caso. */
function isResultTableHeader(header: string[]): boolean {
  if (header.length !== RESULT_TABLE_HEADERS.length) return false;
  return header.every((cell, i) => cell === RESULT_TABLE_HEADERS[i]);
}

/** Separa "30 (+500%)" en { value: "30", delta: "+500%" }; sin paréntesis, delta es null. */
function splitDelta(cell: string): { value: string; delta: string | null } {
  const match = cell.trim().match(/^(.*?)\s*\(([+-][^)]+)\)$/);
  if (!match) return { value: cell.trim(), delta: null };
  return { value: match[1].trim(), delta: match[2].trim() };
}

function renderResultCards(bodyRows: string[][]): string {
  const cards = bodyRows
    .map(([metric = "", before = "", afterRaw = ""]) => {
      const { value, delta } = splitDelta(afterRaw);
      const beforeTrimmed = before.trim();
      const showBefore = beforeTrimmed !== "" && beforeTrimmed !== "—" && beforeTrimmed !== "-";
      const beforeHtml = showBefore
        ? `<div class="rc-before">Antes: <s>${renderInline(beforeTrimmed)}</s></div>`
        : "";
      const deltaHtml = delta ? `<div class="rc-delta">${renderInline(delta)}</div>` : "";
      return (
        `<div class="result-card"><div class="rc-label">${renderInline(metric)}</div>` +
        `<div class="rc-value">${renderInline(value)}</div>${beforeHtml}${deltaHtml}</div>`
      );
    })
    .join("");
  return `<div class="result-grid">${cards}</div>`;
}
```

- [ ] **Step 5: Enganchar la detección en `renderMarkdown`**

Dentro de `renderMarkdown` (misma archivo), agregar una variable de sección actual y usarla en la rama de tablas. El bloque de la función queda así (reemplazar desde `for (const block of blocks) {` hasta el cierre del `if/else if` de tabla):

```typescript
export function renderMarkdown(markdown: string): string {
  if (!markdown.trim()) return "";
  const blocks = markdown.split(/\n{2,}/);
  const html: string[] = [];
  let currentSectionId = "";

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n");

    if (trimmed === "---") {
      html.push("<hr />");
    } else if (lines.every((line) => line.trim().startsWith("|"))) {
      const { header, body } = parseTableRows(lines);
      if (currentSectionId === RESULT_SECTION_ID && isResultTableHeader(header)) {
        html.push(renderResultCards(body));
      } else {
        html.push(renderTable(lines));
      }
    } else if (trimmed.startsWith("### ")) {
      html.push(`<h3>${renderInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      const heading = trimmed.slice(3);
      currentSectionId = slugify(heading);
      html.push(`<h2 id="${currentSectionId}">${renderInline(heading)}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      html.push(`<h1>${renderInline(trimmed.slice(2))}</h1>`);
    } else if (lines.every((line) => line.trim().startsWith("- "))) {
      const items = lines.map((line) => `<li>${renderInline(line.trim().slice(2))}</li>`).join("");
      html.push(`<ul>${items}</ul>`);
    } else if (lines.every((line) => /^\d+\.\s/.test(line.trim()))) {
      const items = lines
        .map((line) => `<li>${renderInline(line.trim().replace(/^\d+\.\s/, ""))}</li>`)
        .join("");
      html.push(`<ol>${items}</ol>`);
    } else if (lines.every((line) => line.trim().startsWith("> "))) {
      const quote = lines.map((line) => renderInline(line.trim().slice(2))).join("<br />");
      html.push(`<blockquote>${quote}</blockquote>`);
    } else {
      html.push(`<p>${lines.map(renderInline).join("<br />")}</p>`);
    }
  }

  return html.join("\n");
}
```

Nota: `id="${currentSectionId}"` en el `<h2>` reemplaza el `id="${slugify(heading)}"` anterior — mismo valor, solo reutiliza la variable ya calculada. `extractSections` (más abajo en el archivo) no cambia, sigue derivando del mismo patrón `## `.

- [ ] **Step 6: Correr los tests y confirmar que pasan**

Run: `npx tsx --test src/utils/markdown.test.ts`
Expected: `ℹ pass 4`, `ℹ fail 0`

- [ ] **Step 7: Commit**

```bash
git add src/utils/markdown.ts src/utils/markdown.test.ts
git commit -m "feat: renderiza la tabla de Resultados como tarjetas, con fallback a tabla"
```

---

## Task 4: Schema, loader y contrato — campo `reflection`

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/services/notionLoaders.ts`
- Modify: `docs/platform/notion-astro-contract.md`

- [ ] **Step 1: Agregar el campo al schema Zod**

En `src/content/config.ts`, dentro del `z.object({...})` de `cases`, justo después del campo `body` (línea 74):

```typescript
      body: z.string().default(''),
      // Reflexion de cierre, propiedad independiente del body (Notion:
      // "Reflexión") para poder editarla sin tocar el resto de la narrativa.
      // Vacia hasta que se llena; la seccion final de la pagina de caso no
      // se renderiza si esta vacia (ver [slug].astro).
      reflection: z.string().default(''),
      // draft = NOT (Estado publicación == "Publicado" AND Publicable == true)
      draft: z.boolean().default(true),
```

- [ ] **Step 2: Mapear la propiedad en el loader**

En `src/services/notionLoaders.ts`, dentro de `mapCase` (alrededor de la línea 245), agregar la línea `reflection` justo después de `body`:

```typescript
    body: blocksToMarkdown(blocks),
    reflection: getRichText(page, "Reflexión"),
    // draft = NOT (Publicado AND Publicable) — contrato, regla de publicacion.
    draft: !(publicationStatus === "Publicado" && publishable),
```

- [ ] **Step 3: Documentar el campo en el contrato**

En `docs/platform/notion-astro-contract.md`, en la tabla de la sección 1 (mapeo de `SSOT - Portafolio Proyectos` → `cases`), agregar una fila después de la de `Contexto tarjeta`:

```markdown
| `Reflexión` | text | `reflection` | `''` | agregada 2026-08-11 (rediseño CAR, ver `docs/superpowers/specs/2026-08-11-case-template-car-redesign-design.md`); cierre editable sin tocar el `body`. Se renderiza como sección final de la página de caso solo si no está vacía |
```

- [ ] **Step 4: Verificar que el tipo compila**

Run: `npx astro sync`
Expected: termina sin error (regenera `.astro/types.d.ts` con el campo `reflection` incluido en el tipo `CollectionEntry<'cases'>`).

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts src/services/notionLoaders.ts docs/platform/notion-astro-contract.md
git commit -m "feat: agrega el campo reflection (propiedad Reflexion de Notion) a la coleccion cases"
```

---

## Task 5: `src/styles/case.css` — estilos nuevos y limpieza

**Files:**
- Modify: `src/styles/case.css`

- [ ] **Step 1: Logo en el rail, quitar el logo del hero**

Reemplazar (líneas 15-19):

```css
.case-hero__logo {
  position: absolute; z-index: 2; left: 50%; transform: translateX(-50%); bottom: 22px;
  width: 60px; height: 60px; object-fit: contain; border-radius: 6px;
  background: rgba(10, 6, 18, 0.85); border: 1px solid var(--border); padding: 6px;
}
```

por (elimina el bloque, no se sustituye por nada en `case-hero`):

```css
```

(dejar el archivo sin ese bloque — el logo ya no vive en el hero.)

Luego, justo antes de `.case-rail .meta` (línea 23), agregar:

```css
.case-rail__logo { height: 28px; width: auto; margin-bottom: 18px; opacity: 0.92; }
```

- [ ] **Step 2: Quitar el badge de Evidencia del rail (ya no se usa)**

Eliminar estas dos líneas (28-30 del archivo actual):

```css
.badge--ok { color: var(--t1); font-weight: 600; font-family: var(--mono); font-size: 11px; }
.badge--no { color: var(--t3); font-family: var(--mono); font-size: 11px; }
```

- [ ] **Step 3: Tarjetas de Resultado**

Justo antes de la regla `.case-evidence-media { padding: 40px 0; ... }`, agregar:

```css
.result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 0 0 20px; }
.result-card { background: var(--bg-2); padding: 20px 22px; }
.result-card .rc-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--t3); margin-bottom: 10px; }
.result-card .rc-value { font-family: var(--mono); font-weight: 500; font-size: clamp(1.3rem, 1.1rem + 1vw, 1.75rem); color: var(--t1); line-height: 1.15; }
.result-card .rc-before { font-size: 12px; color: var(--t3); margin-top: 6px; }
.result-card .rc-before s { text-decoration-color: var(--border); }
.result-card .rc-delta { font-family: var(--mono); font-size: 12px; color: var(--ember); margin-top: 6px; font-weight: 500; }
```

Y en el media query `@media (max-width: 640px)` ya existente al final del archivo, agregar una línea:

```css
  .result-grid { grid-template-columns: 1fr; }
```

- [ ] **Step 4: Video embebido**

Reemplazar las dos reglas actuales:

```css
.evidence-video-list { display: flex; flex-direction: column; gap: 6px; margin-top: 18px; }
.evidence-video-link { display: inline-flex; align-items: center; gap: 8px; width: fit-content; font-size: 13px; color: var(--t2); text-decoration: none; border-bottom: 1px solid rgba(255, 92, 57, 0.4); }
.evidence-video-link::before { content: '▶'; color: var(--ember); font-size: 9px; }
```

por:

```css
.evidence-video-list { display: flex; flex-direction: column; gap: 14px; margin-top: 18px; }
.evidence-video-link { display: inline-flex; align-items: center; gap: 8px; width: fit-content; font-size: 13px; color: var(--t2); text-decoration: none; border-bottom: 1px solid rgba(255, 92, 57, 0.4); }
.evidence-video-link::before { content: '▶'; color: var(--ember); font-size: 9px; }
.evidence-video-embed { position: relative; aspect-ratio: 16 / 9; max-width: 480px; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: var(--bg-2); }
.evidence-video-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
```

- [ ] **Step 5: Sección Reflexión**

Justo antes de la regla `@media (max-width: 860px)` al final del archivo, agregar:

```css
.case-reflection { padding: 48px 0 56px; border-top: 1px solid var(--border); max-width: 68ch; }
.case-reflection .eyebrow { font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ember); display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.case-reflection .eyebrow::before { content: ''; width: 18px; height: 1px; background: var(--ember); }
.case-reflection p { font-family: var(--sans, var(--font-display)); font-weight: 300; font-size: clamp(1.2rem, 1rem + 1vw, 1.55rem); line-height: 1.45; color: var(--t1); margin: 0; }
```

- [ ] **Step 6: Verificar que el lint de CSS pasa**

Run: `npx stylelint src/styles/case.css`
Expected: sin errores (0 problems).

- [ ] **Step 7: Commit**

```bash
git add src/styles/case.css
git commit -m "feat: estilos para logo en rail, tarjetas de resultado, video embebido y reflexion"
```

---

## Task 6: `src/pages/portfolio/[slug].astro` — conectar todo

**Files:**
- Modify: `src/pages/portfolio/[slug].astro`

- [ ] **Step 1: Importar el nuevo util**

Al inicio del frontmatter (junto a los otros imports de `utils/`, línea 12), agregar:

```typescript
import { toEmbeddableVideoUrl } from '../../utils/embedVideo.ts';
```

- [ ] **Step 2: Quitar el logo del hero banner**

Reemplazar:

```astro
  {entry.data.banner && (
    <div class="case-hero">
      <img src={entry.data.banner} alt={entry.data.title} width="1600" height="320" />
      {entry.data.logo && <img class="case-hero__logo" src={entry.data.logo} alt="" aria-hidden="true" width="56" height="56" />}
    </div>
  )}
```

por:

```astro
  {entry.data.banner && (
    <div class="case-hero">
      <img src={entry.data.banner} alt={entry.data.title} width="1600" height="320" />
    </div>
  )}
```

- [ ] **Step 3: Agregar el logo en el rail y quitar el rail-block de Evidencia**

Reemplazar:

```astro
      <aside class="case-rail">
        <div class="meta">{entry.data.organization ?? '—'} · {entry.data.year ?? '—'} · {entry.data.type ?? '—'}</div>
        <h1>{displayTitle}</h1>

        <div class="rail-block">
          <div class="label">Evidencia</div>
          {entry.data.hasVerifiedEvidence ? (
            <span class="badge--ok">✔ Verificada en este caso</span>
          ) : (
            <span class="badge--no">✖ Pendiente de verificar</span>
          )}
        </div>

        <div class="rail-block">
          <div class="label">Métrica ancla</div>
          <p>{entry.data.anchorMetric || 'Sin métrica ancla registrada'}</p>
        </div>
```

por:

```astro
      <aside class="case-rail">
        {entry.data.logo && (
          <img class="case-rail__logo" src={entry.data.logo} alt={entry.data.organization ?? entry.data.title} width="120" height="28" />
        )}
        <div class="meta">{entry.data.organization ?? '—'} · {entry.data.year ?? '—'} · {entry.data.type ?? '—'}</div>
        <h1>{displayTitle}</h1>

        <div class="rail-block">
          <div class="label">Métrica ancla</div>
          <p>{entry.data.anchorMetric || 'Sin métrica ancla registrada'}</p>
        </div>
```

`entry.data.hasVerifiedEvidence` deja de leerse en este archivo, pero el campo se queda en el schema (`config.ts`) — el guardrail de publicación de fichas Insignia (`superRefine`) sigue usándolo indirectamente vía `evidenceUrl`/`anchorMetric`, sin cambios ahí.

- [ ] **Step 4: Video embebido con fallback, y sección Reflexión después de Evidencia visual**

Reemplazar el bloque completo, desde `{(entry.data.evidenceMedia.length > 0 ...` hasta justo antes de `{editionTitles.length > 0 && (`:

```astro
    {(entry.data.evidenceMedia.length > 0 || entry.data.evidenceVideos.length > 0) && (
      <section class="case-evidence-media">
        <div class="eyebrow">Evidencia visual</div>
        {entry.data.evidenceMedia.length > 0 && (
          <div class="evidence-photo-grid">
            {entry.data.evidenceMedia.map((src) => (
              <a class="evidence-photo" href={src} target="_blank" rel="noopener">
                <img src={src} alt="" loading="lazy" width="400" height="300" />
              </a>
            ))}
          </div>
        )}
        {entry.data.evidenceVideos.length > 0 && (
          <div class="evidence-video-list">
            {entry.data.evidenceVideos.map((video) => {
              const embedSrc = toEmbeddableVideoUrl(video.url);
              return embedSrc ? (
                <div class="evidence-video-embed">
                  <iframe src={embedSrc} title={video.label} loading="lazy" allowfullscreen></iframe>
                </div>
              ) : (
                <a class="evidence-video-link" href={video.url} target="_blank" rel="noopener">{video.label}</a>
              );
            })}
          </div>
        )}
      </section>
    )}

    {entry.data.reflection.trim() && (
      <section class="case-reflection">
        <div class="eyebrow">Reflexión</div>
        <p>{entry.data.reflection}</p>
      </section>
    )}

    {editionTitles.length > 0 && (
```

El único cambio real dentro de `case-evidence-media` es el `.map()` de `evidenceVideos` (ahora decide entre `<iframe>` embebido y el link de texto de fallback, según `toEmbeddableVideoUrl`); el resto del bloque (fotos, eyebrow) queda idéntico al original. La sección `case-reflection` es enteramente nueva, insertada entre `case-evidence-media` y `editionTitles`.

- [ ] **Step 5: Type-check completo**

Run: `npx astro check`
Expected: `0 errors, 0 warnings` (o los mismos warnings preexistentes que ya había antes de este cambio, ninguno nuevo).

- [ ] **Step 6: Commit**

```bash
git add src/pages/portfolio/[slug].astro
git commit -m "feat: conecta logo en rail, resultados en tarjetas, video embebido y reflexion en la pagina de caso"
```

---

## Task 7: Contenido de SOFI + build de verificación

**Files:** ninguno del repo — trabajo en Notion + verificación de build.

- [ ] **Step 1: Reescribir el body de SOFI a formato CAR en Notion**

Editar la ficha SOFI en `SSOT - Portafolio Proyectos` para que el `body` tenga exactamente 3 encabezados `##`: `Contexto`, `Acción`, `Resultado`, con el contenido validado en el mockup de esta sesión (ver spec, sección "Mockups de referencia" y el historial de esta conversación para el texto exacto aprobado). La tabla de Resultado debe usar encabezados exactos `Métrica | Antes | Después` para activar las tarjetas.

- [ ] **Step 2: Llenar la propiedad `Reflexión` de SOFI**

Usando `mcp__claude_ai_Notion__notion-update-page` con `command: "update_properties"` sobre la página de SOFI, propiedad `"Reflexión"`:

```
El canal es una hipótesis de negocio. No una decisión de arquitectura. Si lo volviera a hacer, lo validaría antes de construir todo alrededor de él.
```

(Texto ya aprobado por Diego en el mockup de esta sesión — no es contenido nuevo inventado.)

- [ ] **Step 3: Build local de verificación**

Run: `npx astro build`
Expected: build termina sin error (`npm run build` internamente llama a esto). Tarda ~90-115s en el paso `[notion-cases]` — no es que esté colgado.

- [ ] **Step 4: Verificar visualmente la página de SOFI**

Con `npx astro preview` corriendo, abrir `/portfolio/sofi` en un navegador real (Claude-in-Chrome o manual) y confirmar:
- El logo aparece en el rail, no en el hero.
- El rail-nav muestra solo 3 links: Contexto, Acción, Resultado.
- No hay badge de "Evidencia" en el rail.
- La sección Resultado muestra tarjetas, no una tabla.
- El video de evidencia se ve embebido (si la URL es de YouTube/Drive) o como link (si no lo es).
- La sección "Reflexión" aparece al final, después de Evidencia visual.

- [ ] **Step 5: Registro en Notion (Changelog — Portafolio D)**

Seguir el protocolo de CLAUDE.md sección 5 (Inbox → Changelog → Tarea): crear entrada en el Inbox con `Estado de procesamiento = Pendiente`, describiendo el cambio publicado (rediseño CAR de la plantilla de caso + caso SOFI reescrito), vincularla a una entrada nueva de Changelog, y esa entrada a la tarea de seguimiento ya creada (`3b90fe3c-51c5-814f-8db0-d551e3414752`) o a una tarea nueva si el scope del Changelog es distinto al de esa tarea (esa tarea es solo para las 14 fichas restantes, no para el trabajo técnico de este plan).

No hay commit de git en este step (es registro en Notion).
