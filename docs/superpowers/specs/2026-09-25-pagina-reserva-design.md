# Spec · Página /reserva (Relanzamiento "Reserva conmigo")

- Fecha: 2026-09-25
- Estado: Diseño validado con Diego en sesión de brainstorming, listo para `writing-plans`
- Repo: diegomaury-mx/newlandingpage (diegomaury.mx)
- Fuentes canónicas: ADR "Relanzamiento de la página Reserva conmigo" (Diego Maury WIKI), SSOT - Identidad (métricas/credenciales), SSOT - Estilo y voz (un solo CTA, eco de marca máx. 3), AUDIT-AS-IS.md hallazgo F-23, CLAUDE.md del repo.

---

## 1. Objetivo

Crear `/reserva` (y `/en/reserva`) en diegomaury.mx: la superficie pública de la oferta de mentorías relanzada. Dos ofertas separadas (sistema operativo en Notion; programas y emprendimiento), sin precios públicos, una sola puerta de entrada (llamada de diagnóstico de 25 min), todo el copy y las 2 imágenes servidos desde el CMS de Notion.

## 2. Decisiones resueltas en brainstorming (2026-09-25)

Estas 4 quedaron abiertas en el spec original y se cerraron con Diego antes de escribir este documento:

1. **Link de agenda:** se reusa el link canónico ya verificado en producción, `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`. No se crea un schedule nuevo.
2. **Imágenes del CMS:** Diego aún no tiene las 2 fotos. La página usa el patrón `slotSrc(slot, fallback)` ya existente en `index.astro`, con fallback a `/cms-media/diego/diegomaurypng.png` (la misma foto que usa el hero del home) mientras Diego sube las fotos reales a CMS Imágenes.
3. **Copy fuente:** Diego lo pegó en esta sesión (texto íntegro en la sección 5). Se ajustaron 2 métricas a su fórmula canónica exacta del SSOT (ver sección 5, R4 y R5) — decisión explícita de Diego, mismo dato, wording corregido.
4. **F-23 (CTA navbar/S8 apuntando a /reserva):** queda **fuera de alcance** de este plan. El navbar y el CTA de S8 del home no se tocan.

## 3. Hallazgos técnicos (verificados contra el código real, no contra el spec original)

Estos 3 puntos corrigen o simplifican lo que decía el spec original tal como llegó:

1. **El schema de `siteCopy` en `content.config.ts` es trivial: `{ title: z.string(), markdown: z.string() }`.** No hay nada que traducir a nivel de schema Zod — la traducción EN de contenido narrativo ocurre a nivel de hoja (`translateCached()` sobre strings ya parseados), exactamente como en `src/pages/en/portfolio.astro`. `reservaCopy` sigue el mismo patrón exacto: **no requiere cambios en `content.config.ts` para el schema en sí**, solo una nueva `defineCollection` idéntica a la de `siteCopy`.
2. **`src/utils/parseSiteCopy.ts` línea 11** (`SECTION_HEADING`) solo acepta claves `S\d+b?`, `P\d+` o `SEO`. Hay que ampliar el regex a `R\d+` para que `parseSiteCopySections()` reconozca los headings `# R1 · Hero` … `# R7 · CTA final` del nuevo singleton. Es la única función que necesita tocarse en ese archivo; se añaden además dos helpers pequeños nuevos (`numberedItems`, `quoteLine`, ver sección 6).
3. **CSP (`public/_headers` línea 8):** `frame-src` hoy solo permite `youtube.com` y `drive.google.com`. Sin agregar `https://diegomaury.substack.com`, el iframe del newsletter se bloquea en silencio (carga en blanco, sin error visible salvo en consola). Se agrega ese origen a `frame-src`. No existe hoy ningún iframe de Substack en el sitio (solo un link de texto en el footer/`site.ts`), así que el embed se construye nuevo, con las dimensiones estándar que Substack documenta para `/embed` (`width="100%" height="320" frameborder="0" scrolling="no"`).
4. **El sitemap no necesita ningún cambio de código.** `astro.config.mjs` usa `sitemap()` sin filtro — cualquier página que Astro construya se incluye sola en `sitemap-index.xml`. Sí hace falta agregar la entrada a `tests/qa/pages.astro.ts` (`BILINGUAL_PAGES`), para que la suite de a11y/visual la cubra.

## 4. Contenido fuente (`reservaCopy`, Notion, singleton nuevo)

Nueva página Notion "Reserva conmigo · diegomaury.mx (SSOT)" (mismo patrón físico que "Copy Oficial · diegomaury.mx (SSOT)"), estructurada con headings `heading_1` en formato `# R<n> · <nombre>` + `# SEO · Metadatos`, para que el `SECTION_HEADING` ampliado (sección 3.2) la reconozca igual que `siteCopy`.

Contenido exacto aprobado por Diego el 2026-09-25 (dos métricas ajustadas a fórmula canónica, marcadas con †):

```
# R1 · Hero

# ¿Tienes meses cargando un problema que no termina de resolverse?

Soy Diego Maury, Strategic Program Director. Diseño programas, procesos y sistemas que convierten esa carga en operaciones medibles. Y sí, también reservo espacios para trabajar contigo uno a uno.

Aquí no hay catálogo de tarifas ni formularios eternos. Hay una sola puerta de entrada: una llamada de diagnóstico de 25 minutos, sin costo.

[ Agenda tu llamada de diagnóstico ]

# R2 · Cómo funciona

1. Agendas la llamada y me cuentas qué traes entre manos.
2. En 25 minutos revisamos tu situación y detectamos si puedo ayudarte de verdad. Si no, te lo digo ahí mismo y te oriento hacia dónde ir.
3. Si hay fit, sales con una propuesta concreta: alcance, formato y precio cotizado para tu caso.

Los precios no están publicados por una razón simple: ningún problema serio cabe en una tabla de tarifas. Se cotizan en la llamada, contra tu situación.

# R3 · Mentoría Notion

## Tu sistema operativo en Notion

Para emprendedores y equipos que tienen la información regada entre seis herramientas y quieren operar desde un solo lugar.

Trabajamos tu workspace de principio a fin: captura, tareas, proyectos, conocimiento y automatización con IA. Nada de teoría de productividad. Tu sistema, funcionando.

Soy Embajador de Notion y mi propia operación corre sobre este sistema. Lo que te propongo es lo que uso todos los días.

# R4 · Mentoría Programas

## Mentoría de programas y emprendimiento

Para founders y líderes que están construyendo un programa, una comunidad o un emprendimiento y les falta estructura: modelo, operación, métricas, alianzas.

Aquí hablo desde la evidencia. Dirigí 4 ediciones del HEINEKEN Green Challenge, con 3,231 proyectos alcanzados, agregado de 4 ediciones (2019 a 2022)†. Creé REDUX desde cero y su metodología de 8 actividades quedó publicada en abierto, en 34 videos. Construí y operé una red de 100+ mentores por edición†.

# R5 · Quién te atiende

> El que no vive para servir no sirve para vivir.

Es una de mis frases favoritas y la razón por la que esta página existe.

Construyo lo que hace falta para que las cosas pasen. Tengo 15+ años de trayectoria, 7+ en innovación y ecosistemas†. Fui profesor de emprendimiento en el Tecnológico de Monterrey y facilitador de MBA, speaker en Talent Land y Campus Party, y hoy trabajo de forma fraccional con organizaciones que tienen estrategia y presupuesto, pero no el sistema que conecta todo para ejecutar.

Lo que comparto en estas sesiones viene de ahí: de operar, no de observar.

# R6 · Testimonios

## ¿Qué se dice de mí?

Leer testimonios completos

# R7 · CTA final

## Si tu problema lleva meses esperando, la llamada de 25 minutos es el paso más chico que puedes dar hoy.

[ Agenda tu llamada de diagnóstico ]

Hagamos que las cosas pasen.

# SEO · Metadatos

title
Reserva conmigo · Diego Maury

description
Agenda una llamada de diagnóstico de 25 minutos con Diego Maury: mentoría en sistemas con Notion o en diseño y operación de programas. Sin costo, sin pitch.
```

**Nota sobre R2:** en Notion, los 3 pasos se escriben como una lista numerada nativa de Notion (no texto suelto con "1."/"2."/"3." a mano) — al aplanarse a markdown vía `blocksToMarkdown`, cada ítem queda en su propia línea `1. texto`, `2. texto`, `3. texto`, que es lo que el nuevo helper `numberedItems()` (sección 6) espera.

**Nota sobre R6:** el link real (`https://senja.io/p/diegomaury/9awUK8`) NO vive en Notion — es una constante de código (`SENJA_HREF`, igual patrón que `CALENDAR_HREF`/`MAIL_HREF` en `portfolio.astro`), porque es un destino externo estable, no copy editorial. El texto del link ("Leer testimonios completos") sí viene de Notion.

**Nota sobre R1:** el eyebrow "Reserva conmigo" es una constante de código (`const heroEyebrow = 'Reserva conmigo'`), no viene de Notion — mismo patrón que `heroEyebrow = 'Strategic Program Director'` en `portfolio.astro`. El bloque R1 en Notion arranca directo con el heading `# ¿Tienes...` (heading_1 real de Notion, extraído con `heading1()`, no `heading2()`); los 2 párrafos siguientes se leen con `paragraphs(blocks)[0]` (lede) y `paragraphs(blocks)[1]` (apoyo); el CTA con `ctaLabels(blocks)[0]`.

**Nota sobre el Newsletter:** no tiene sección `R<n>` propia — es contenido fijo del sitio (mismo texto e iframe en ES/EN salvo la traducción del párrafo de invitación), no editorial por caso. El párrafo "Suscríbete a mi newsletter…" se traduce vía `translateCached()` como constante, igual que otros textos fijos cortos.

## 5. Reglas de contenido verificadas contra este copy (todas cumplen)

- Un solo texto de CTA, un solo destino: "Agenda tu llamada de diagnóstico" (R1 y R7) → `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`, `target="_blank" rel="noopener"`.
- Cero precios públicos.
- Cero guion largo (`—`) en ES ni EN — verificar con `grep -n "—"` sobre `reserva.astro`, `en/reserva.astro` y el contenido de `reservaCopy` antes de dar la tarea por cerrada.
- Métricas con fórmula canónica exacta (ver sección 4, marcadas †).
- Credencial "Embajador de Notion" correcta.
- Eco de marca "que las cosas pasen": 1 aparición (cierre de R7) — dentro del máximo de 3.
- Cita literal preservada: "El que no vive para servir no sirve para vivir." (R5, sin cambios).

## 6. Archivos a crear/modificar

**Crear:**
- `src/pages/reserva.astro` — página ES, patrón `portfolio.astro` (BaseLayout + constantes en frontmatter + secciones).
- `src/pages/en/reserva.astro` — página EN, patrón `en/portfolio.astro` (mismas secciones `parseSiteCopySections`/`heading2`/`paragraphs`, traducidas a nivel de hoja con `translateCached()`).

**Modificar:**
- `src/services/notionClient.ts` — agregar `reservaCopy` a `NOTION_SOURCES` (page ID de la página Notion creada en la Tarea 1 del plan de implementación) + función `fetchReservaCopy()`, clon literal de `fetchSiteCopy()` (líneas ~298-311) apuntando a esa constante.
- `src/services/notionLoaders.ts` — `reservaCopyLoader: Loader`, clon literal de `siteCopyLoader` (líneas 570-593) con `id: "reserva"` en vez de `"site"`, nombre de loader `"notion-reserva-copy"`.
- `src/content.config.ts` — nueva `defineCollection({ loader: reservaCopyLoader, schema: z.object({ title: z.string(), markdown: z.string() }) })` (idéntica a `siteCopy`, línea 193-199), exportada como `reservaCopy` en `collections` (línea 266-273).
- `src/utils/parseSiteCopy.ts` línea 11 — `SECTION_HEADING` pasa de `/^# (S\d+b?|P\d+|SEO) · (.+)$/` a `/^# (S\d+b?|P\d+|R\d+|SEO) · (.+)$/`. Se agregan 2 helpers nuevos al final del archivo:
  - `numberedItems(blocks: string[]): string[]` — extrae líneas `N. texto` (regex `/^\d+\.\s+(.+)$/`), mismo estilo que `bulletItems()`.
  - `quoteLine(blocks: string[]): string` — primer bloque que empieza con `>`, sin el prefijo `> ` (mismo estilo que `heading1`/`heading2`).
- `public/_headers` línea 8 — `frame-src` gana `https://diegomaury.substack.com` (además de `youtube.com`/`drive.google.com` existentes).
- `tests/qa/pages.astro.ts` — agregar `{ name: 'reserva', path: '/reserva/' }` a `BILINGUAL_PAGES` (genera automáticamente la variante `/en/reserva/` vía `enVariant()`).

**Notion (fuera del repo, vía MCP en la Tarea 1 del plan):**
- Crear la página singleton "Reserva conmigo · diegomaury.mx (SSOT)" con el contenido de la sección 4, obtener su page ID.
- Dar de alta 2 filas nuevas en CMS Imágenes: slots `reserva-hero` y `reserva-quien-atiende` (Estado inicial: "Sin empezar" — Diego las completa después; el fallback cubre mientras tanto).
- Dar de alta las 2 métricas de R4/R5 en la base de Métricas oficiales si no existen ya con esa fórmula exacta (probablemente ya existen, dado que son las mismas del home/portfolio — verificar antes de crear duplicados).

**No tocar:** `src/pages/index.astro`, `siteCopy` (S1-S8), loaders de `cases`/`metrics`/`imageSlots`, navbar/CTA de S8 (decisión F-23 fuera de alcance), `astro.config.mjs` (sitemap no necesita cambio).

## 7. Estructura de la página (7 secciones)

| # | Sección | Copy | Notas de render |
|---|---|---|---|
| 1 | Hero | R1 | `slotSrc('reserva-hero', '/cms-media/diego/diegomaurypng.png')` como imagen. H1 único de la página. |
| 2 | Cómo funciona | R2 | 3 pasos vía `numberedItems()` → mapeados a `.cta-step`/`.cta-step-n` (reusa CSS de `home.css`, sin `description`/`tag`). Nota de precios como párrafo simple debajo. |
| 3 | Mentorías (2 cards) | R3 + R4 | Grid 2 columnas desktop / stack mobile. Título = `heading2()`, cuerpo = `paragraphs()`. |
| 4 | Quién te atiende | R5 | Cita vía `quoteLine()` en `<blockquote>`, bio vía `paragraphs()`. Imagen: `slotSrc('reserva-quien-atiende', '/cms-media/diego/diegomaurypng.png')`. |
| 5 | Testimonios | R6 | `heading2()` + link `SENJA_HREF` (constante de código) con texto de `paragraphs()[0]`. |
| 6 | Newsletter | fijo (no Notion) | Párrafo fijo (traducido vía `translateCached()` en EN) + `<iframe src="https://diegomaury.substack.com/embed" width="100%" height="320" frameborder="0" scrolling="no">`. |
| 7 | CTA final | R7 | `heading2()` + CTA (mismo destino que R1) + línea de cierre "Hagamos que las cosas pasen." (párrafo final de `paragraphs()`). Reusa clases `.cta-section`/`.btn-primary` existentes. |

## 8. SEO y metadatos

- `title`/`description` desde `# SEO · Metadatos` de `reservaCopy` (mismo patrón `valueAfter(blocks, 'title')`/`valueAfter(blocks, 'description')` que usa `index.astro` para su bloque SEO).
- EN: `title = "Book a call · Diego Maury"`, `description` traducida vía `translateCached()`.
- Canonical + `alternateUrls` ES/EN + `otherLocaleHref` vía `toLocalePath()`, mismo patrón que `portfolio.astro`.
- `ogImage`: `new URL('/assets/img/diego-maury.jpg', Astro.site).toString()` (mismo fallback que usa `portfolio.astro`, no depende de las 2 imágenes nuevas del CMS).
- `robots: index,follow` (sin `noindex`, regla dura del CLAUDE.md).
- `enableGtm enableClarity` en `<BaseLayout>` (regla dura: toda página nueva lleva el mismo snippet GTM).
- JSON-LD `ContactPage` opcional — se omite en la v1 salvo que Diego lo pida; no bloquea ningún criterio de aceptación.

## 9. Criterios de aceptación

1. `astro build` en verde; `/reserva/` y `/en/reserva/` responden 200; sin regresiones en `/`, `/portfolio`, fichas de caso.
2. Un solo texto de CTA en todo el DOM de ambas páginas, mismo destino en las 2 apariciones.
3. Cero guion largo y cero precios en el HTML renderizado (`grep -n "—"` limpio).
4. Las 2 métricas de R4/R5 usan la fórmula canónica exacta de la sección 4.
5. Ningún párrafo de copy hardcodeado en los `.astro`: cambiar un bloque en `reservaCopy` (Notion) y reconstruir cambia el texto publicado, sin tocar código.
6. Las 2 imágenes usan `slotSrc()` con fallback — la página no se rompe ni se ve vacía mientras Diego no sube las fotos reales.
7. El iframe de Substack carga (no queda en blanco por CSP) — verificar en Chrome real, consola sin errores de `Content-Security-Policy`.
8. `/reserva/` y `/en/reserva/` aparecen en `dist/sitemap-index.xml` tras el build, sin cambios en `astro.config.mjs`.
9. `tests/qa/a11y.astro.spec.ts` y `visual.astro.spec.ts` corren sobre las 2 páginas nuevas sin fallos nuevos.
10. En el diff no aparece ningún iframe de Google Calendar ni link de Calendly.
11. El navbar y el CTA de S8 del home siguen apuntando a donde apuntaban antes (F-23 no se toca).

## 10. Fuera de alcance (explícito)

- Cambiar el destino del CTA del navbar o de S8 del home a `/reserva` (F-23 — decisión pendiente de Diego, otra sesión).
- JSON-LD `ContactPage`.
- Subir las fotos reales a CMS Imágenes (Diego lo hace cuando las tenga; el fallback cubre mientras tanto).
