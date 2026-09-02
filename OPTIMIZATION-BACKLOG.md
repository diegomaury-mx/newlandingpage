# OPTIMIZATION-BACKLOG · diegomaury.mx

Deriva de `AUDIT-AS-IS.md` (rev. 2) y `AUDIT-TO-BE.md`. **Ningún ítem se ha implementado.**

## Modelo de priorización

`Score = Impacto × Confianza ÷ Esfuerzo`

- **Impacto** 1–5 (usuario + negocio combinados).
- **Confianza** 0.5–1.0 (qué tan seguro es que el cambio produce el efecto esperado).
- **Esfuerzo** S = 1 · M = 3 · L = 6.

La estética no es criterio único: F-07 (fuentes) y F-21 (tarjeta OG) tienen score bajo por esfuerzo M pero impacto alto — se promueven de ola manualmente y se marcan `[impacto alto]`.

Banderas:
- `[Diego]` — requiere decisión de Diego o cambio de copy (el copy vive en el SSOT de Notion).
- `[Diego · dashboard]` — ajuste de seguridad/cuenta en el dashboard de Cloudflare; lo aplica Diego, no Claude Code.
- `[asset]` — requiere un asset nuevo que Diego debe proveer.
- `[→ Fn]` — depende de otro ítem.

---

## Tabla

| Prioridad | ID | Problema | Impacto (I·C) | Esfuerzo | Score | Acción |
|---|---|---|---|---|---:|---|
| **P0** | F-01 | Hero + imagen LCP con `opacity:0` hasta que corre un módulo JS diferido; anula el `fetchpriority="high"` de la imagen | 4 · 0.9 | S | **3.60** | Quitar `data-reveal` de los elementos del hero en `index.astro` (label, h1, sub, ctas, media, trust). El reveal se conserva de S2 en adelante. |
| **P0** (paso 0) | F-04.1 | Cloudflare Web Analytics (`beacon.min.js`) bloqueado por la CSP propia → error de consola, Best Practices 73 | 3 · 0.9 | S | **2.70** `[Diego · dashboard]` | Desactivar Cloudflare Web Analytics en el dashboard (redundante con GA4). No ampliar la whitelist de la CSP. Ajuste de cuenta — lo aplica Diego. |
| **P0** | F-22 | Cero `<link rel="preload">`: la imagen LCP y la fuente crítica se descubren tarde | 3 · 0.85 | S | **2.55** | `<link rel="preload" as="image" fetchpriority="high">` de la foto del hero (solo `index.astro`) + `preload` de la fuente crítica (con F-07). |
| **P0** (paso 0) | F-06.1 | `challenge-platform` de Cloudflare corre en cada visita (≈250 ms + 3 APIs deprecadas) | 3 · 0.85 | S | **2.55** `[Diego · dashboard]` | Bot Fight Mode → Off en Cloudflare (o Super Bot Fight Mode con challenge solo a bots definidos). Revisar Email Obfuscation. Ajuste de seguridad — lo aplica Diego, no Claude Code. |
| **P0** | F-07 | Fuentes render-blocking por `<link>` a Google Fonts, sin `preload` → FCP móvil ~3 s en todas las páginas | 4 · 0.85 | M | 1.13 `[impacto alto]` | Self-hostear Plus Jakarta Sans + DM Mono (subset latino), `@font-face` + `font-display: swap`, `preload` del peso 400/500. Borrar `public/assets/fonts/` (V1). CSP `font-src 'self'`. |
| **P1** | F-13 | En móvil la foto del hero (`order:-1`) se apila encima del H1 | 3 · 0.8 | S | **2.40** | Quitar `order:-1` de `.hero-media` en `home.css:5`; el H1 encabeza el viewport móvil. |
| **P1** | F-05 | Widget Senja: isla modo-claro + `<video>` sin estilar + badge de tercero + 377 ms/1121 ms de main-thread + único fallo de contraste | 3 · 0.8 | S | **2.40** | Quitar el embed de Senja; dejar solo las `.testimonial-card` propias (render de Astro). Versión completa `[→ F-05b]`: importar los testimonios a una base de Notion y renderizarlos con `.testimonial-card`. |
| **P1** | F-14 | Sin skip-link, sin `color-scheme: dark`, sin `theme-color` | 2.5 · 0.9 | S | **2.25** | En `BaseLayout.astro`: skip-link visible en `:focus` + `<main id="main">`; `:root { color-scheme: dark }`; `<meta name="theme-color" content="#0A0612">`. |
| **P1** | F-24 | `/portfolio`: la chip-filtro activa del Capability Showcase Grid (`.chip.is-active`) usa `--ember` puro de fondo con texto `--t1` → **contraste 2.9:1, falla WCAG AA** (serious). En producción hoy. Descubierto por `test:a11y:astro` (4 fallos: portfolio ES/EN × desktop/mobile). Regresión del commit del showcase grid (`547d576`, 2026-09-01), no del audit. | 3 · 1.0 | S | **3.00** | `portfolio.css:274-278`: `.chip.is-active { background: var(--ember-cta); border-color: var(--ember-cta); }` (`--ember-cta` `#BF452B` es la única forma válida de ember sólido con texto blanco, per DS). Se puede hacer solo o dentro del Commit 3 (a11y). |
| **P1** | F-09 | Sin `scroll-margin-top` en secciones ancladas del home → el navbar `fixed` tapa el encabezado destino | 2 · 0.9 | S | **1.80** | `scroll-margin-top: 80px` en `.section[id]` / `.about-section[id]` (o en `:target`). |
| **P1** | F-17 | Menú burger no cierra con `Escape` ni click-fuera; no devuelve el foco | 2 · 0.85 | S | **1.70** | En el `is:inline` de `Navbar.astro`: `Escape` + click-fuera → cerrar; devolver foco al `.nav__burger`. Patrón *disclosure* de ARIA APG, **sin** focus trap. |
| **P1** | F-21 | Tarjeta social = retrato cuadrado 700×700, 574 KB, sin diseñar; es la 1ª impresión en LinkedIn/WhatsApp/Substack | 4 · 0.7 | M | 0.93 `[impacto alto]` `[asset]` | Tarjeta OG 1200×630 diseñada en el DS (nombre + rol + una línea + isotipo), webp/png < 200 KB, con `og:image:alt/width/height`. Home y `/portfolio` dejan de usar `diego-maury.png`. Puede ser slot de `imageSlots`. |
| **P2** | F-23 | La única ruta a "agendar" es el botón del navbar; el hero no ofrece reserva | 3 · 0.55 | S | 1.65 `[Diego]` | Evaluar con Diego: CTA de reserva en el hero (secundario, o intercambiar primario/secundario). Hipótesis CRO, no defecto. |
| **P2** | F-20 | Sub del hero ~40 palabras / 4 líneas; CTA de navbar es lema ("Hagamos que las cosas pasen") | 2.5 · 0.6 | S | 1.50 `[Diego]` | Recortar la sub a ~20 palabras en el SSOT de Notion; CTA de navbar → etiqueta de acción ("Agendar una llamada"). Cambio de copy = decisión de Diego + spec. |
| **P2** | F-19 | 8 stubs de redirect con `meta http-equiv="refresh" content="0"` fuera de `_redirects` | 1.5 · 0.85 | S | 1.28 | Mover `public/{cases,portfolio}/*.html` a `_redirects` como `301`; borrar los HTML stub. |
| **P2** | F-11 | LH `cache-insight` 50; sin `Cache-Control` para `/_astro/*` y `/cms-media/*` | 1.5 · 0.8 | S | 1.20 | Regla en `_headers`: `Cache-Control: public, max-age=31536000, immutable` para esos paths. |
| **P2** | F-12 | Imágenes del cinturón de logos sin `width`/`height` | 1.5 · 0.8 | S | 1.20 | Añadir dimensiones intrínsecas vía el loader de `imageSlots` (`notionLoaders.ts`). |
| **P2** | F-15 | `scroll-behavior: smooth` global sin condicionar a `prefers-reduced-motion` | 1 · 0.9 | S | 0.90 | `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }` en `globals.css`. |
| **P2** | F-18 | Doble punto de carga potencial de GTM (`BaseLayout` `enableGtm` + `<script>` literal en `index.astro`) | 1 · 0.9 | S | 0.90 | Una sola vía: `enableGtm` en `BaseLayout` para todas las páginas; quitar el `<script src="/js/gtm.js">` literal de `index.astro`. |
| **P2** | F-06.2 | GTM+GA4 (≈360 KB, ≈129 KB sin usar) en la ruta crítica → TTI ~9 s | 3 · 0.75 | M | 0.75 | Cargar GTM tras `requestIdleCallback` / primer input; evaluar migrar a `gtag` GA4 directo si el contenedor no gestiona nada más (auditar el contenedor primero). |
| **P2** | F-16 | Galería de evidencia de caso en miniaturas ~140px sin ampliación | 2.5 · 0.7 | M | 0.58 | Código puro en `CaseArticle.astro`: lightbox accesible (`dialog` nativo, `Escape`, foco gestionado) o `<a>` a la imagen completa; alt descriptivo por imagen. No requiere asset ni decisión de Diego. |
| **P2** | F-08b | Las 4 tarjetas Insignia de `/portfolio` tienen tratamientos heterogéneos + rectángulo verde fuera de paleta en la de HEINEKEN | 3 · 0.7 | S | **2.10** `[Diego]` | Tratamiento unificado por CSS **sobre las imágenes existentes** (no requiere assets nuevos): `grayscale(1)` + overlay ember + `mix-blend-mode`, o crop consistente, en `.showcase-*` / tarjetas Insignia de `portfolio.css`. Incluye localizar y corregir el rectángulo verde de HEINEKEN. Diego aprueba el tratamiento. |
| **P3** | F-08a | El still del hero lee "creador de contenido", no "director de programa" | 3 · 0.55 | M | 0.55 `[asset]` `[Diego]` | Retrato editorial del hero con el grado de color del DS. **Bloqueado** hasta que Diego provea el asset. Entra vía `imageSlots` (slot `foto-diego-hero`), sin cambio de código más allá del alt. |
| **P3** | F-05b | Versión completa de F-05: eliminar toda dependencia de Senja | 4 · 0.85 | M | 1.13 `[→ F-05]` | Importar los testimonios de Senja a una base de Notion; renderizar con `.testimonial-card`. Resuelve también el `webfont.js` bloqueado (F-04). |
| **P3** | F-04.3 | La CSP es cosmética (`'unsafe-inline'` anula su protección principal) | 2 · 0.7 | M | 0.47 `[Diego]` | Decisión de rumbo: (a) CSP estricta con hashes en build (Astro `experimental.csp`) + `strict-dynamic`, o (b) aceptar la actual como higiene menor y documentarlo. No dejar la "whitelist que crece". |
| **P3** | F-25 | `portfolioData.ts:66` — `ShowcaseProject.year: number \| null` pero la línea 100 asigna `c.data.year ?? null` (que es `string \| null`). `tsc --noEmit -p .` lo marca (TS2322). `astro build` y `npm test` no fallan (no está en el path de sus checks). Pre-existente del commit del showcase grid (`547d576`), no del audit. | 1 · 0.9 | S | 0.90 | Alinear el tipo (`year: string \| null`) o convertir en el `.map` (`year: c.data.year != null ? Number(c.data.year) : null`). El resto de `ShowcaseProject` no consume `year` como número, así que `string \| null` es el fix mínimo. |
| **P3** | F-10 | Cuerpo 13–13.5px, calificadores de métrica a 9px `--t3`, eyebrows en 5/7 secciones, cajas de logo | 2 · 0.45 | M | 0.30 `[Diego]` | **Preferencia de estilo, no defecto.** Si Diego quiere subir el listón: cuerpo ~15px, calificadores ~10–11px o `--t2`, revisar eyebrows, aligerar cajas de logo. |

---

## Secuenciación (evita choques de archivo y atribución sucia)

Varios ítems tocan los mismos archivos (`BaseLayout.astro`, `public/_headers`, `index.astro`, `home.css`). Agrupación:

### Paso 0 — Dashboard de Cloudflare (SIN commit de repo) · F-04.1 + F-06.1
Va **primero**, antes de cualquier commit de código, para que el ruido de `challenge-platform` y del beacon bloqueado no contamine la atribución de los commits 1 y 2.
- Desactivar **Cloudflare Web Analytics** (redundante con GA4).
- **Bot Fight Mode → Off** (Security → Bots).
- Estos toggles son ajustes de seguridad/cuenta del dashboard: **los aplica Diego**, no Claude Code (regla dura: no modificar security settings).
- Después: **3 corridas de Lighthouse móvil** (home + portfolio) → este resultado es el **nuevo baseline** contra el que se validan los commits 1–5. Medianas a `CHANGELOG-AUDIT.md` + flujo Notion.
- Efecto esperado: Best Practices 73 → ~90+; TTI −2 a −3 s; cero errores de consola por CSP.

### Commit 1 — "perf: hero above-the-fold sin gate de JS + preloads"
`index.astro` (+`/en`), `home.css` · F-01 + F-22 (parte imagen) + F-13
F-01 y F-22 se espejan en `src/pages/en/index.astro` (hero idéntico, mismo hallazgo, misma atribución). F-13 cubre `/en` vía el `home.css` compartido.
Validar contra el **baseline post-paso-0**. Efecto esperado: LCP móvil home −0.9 a −1.2 s.

### Commit 2 — "perf: self-host de fuentes Plus Jakarta + DM Mono"
`BaseLayout.astro`, `src/styles/`, `public/assets/fonts*`, `public/_headers` (`font-src`) · F-07 + F-22 (parte fuente)
Efecto esperado: FCP −0.5 a −1 s en todas las páginas; LCP portfolio (texto) −0.5 s.

### Commit 3 — "a11y: skip-link, color-scheme, theme-color, scroll-margin, burger"
`BaseLayout.astro`, `globals.css`, `Navbar.astro` · F-14 + F-09 + F-15 + F-17
Efecto esperado: a11y 96 → 100; navegación por ancla y teclado correctas.

### Commit 4 — "feat: testimonios propios, retirar embed de Senja"
`index.astro`, `portfolio.astro` (y `/en`) · F-05
**Condición previa:** verificar cobertura de las `.testimonial-card` propias vs. lo que renderiza Senja hoy (ver § "Condición previa al retiro de Senja" abajo). Si no cubren, F-05b va antes o fusionado.
Efecto esperado: −377 ms/−1121 ms de main-thread; tema único; cero branding de tercero.

### Commit 5 — "chore: redirects 301, cache headers, carga única de GTM, dims de logos"
`public/_redirects`, `public/_headers`, `index.astro`, `notionLoaders.ts` · F-19 + F-11 + F-18 + F-12

### Fuera de la secuencia de commits (no bloquean lo anterior)

Clasificados por **por qué** están fuera, no todos por la misma razón:

- **Código puro, fuera solo por score bajo** (se pueden hacer en cualquier momento, sin dependencias): F-16 (lightbox de evidencia, `CaseArticle.astro`), F-06.2 (defer GTM), F-04.3 (rumbo de la CSP — aunque este además necesita una decisión de rumbo de Diego).
- **Código puro, pero Diego aprueba primero la dirección visual/copy**: F-08b (tratamiento unificado de tarjetas Insignia + fix del rectángulo verde — CSS, sin assets), F-20 (recorte de copy + etiqueta de CTA — el copy vive en el SSOT de Notion), F-23 (CTA de reserva en el hero — hipótesis CRO), F-10 (pulido tipográfico — preferencia).
- **Bloqueados en un asset que Diego debe proveer**: F-21 (tarjeta OG diseñada 1200×630), F-08a (retrato editorial del hero).
- **Seguimiento mayor**: F-05b (importar los testimonios de Senja a una base de Notion) — solo necesario si la condición previa al Commit 4 (§ abajo) revela que las `.testimonial-card` propias no cubren todo lo que Senja renderiza hoy.

### Condición previa al retiro de Senja (Commit 4)

Antes de ejecutar el Commit 4, **verificar cobertura**: ¿las `.testimonial-card` propias (render de Astro desde el SSOT de Notion) ya cubren todos los testimonios que hoy muestra el widget Senja, **incluido el testimonio en video**? La sección de prueba social no puede quedar más débil después del commit.

- Si **sí** cubren: Commit 4 procede tal cual (quitar el embed).
- Si **no**: F-05b (importar los testimonios de Senja — texto y video — a una base de Notion y renderizarlos con el componente propio) se ejecuta **antes** del Commit 4 o se fusiona con él.

Esta verificación se hace al llegar al Commit 4, comparando el contenido renderizado por cada widget Senja (`93ff9581…` en home, `43006bd7…` en `/portfolio`) contra los testimonios ya presentes en el SSOT.

---

## Meta de salida (recordatorio de `AUDIT-TO-BE.md` §6)

| Métrica (móvil, p75) | AS-IS | Meta | Nota |
|---|---:|---:|---|
| Performance | 75 / 80 | ≥ 88 | score compuesto |
| LCP | ~4.0 s / ~3.4 s | < 2.5 s | **objetivo de negocio** (CWV) |
| INP | — | campo (CrUX/RUM) | **objetivo de negocio** (CWV); TBT es su proxy en lab |
| FCP | ~3.0 s / ~3.4 s | < 1.8 s | |
| TBT | ~254 / ~242 ms | < 200 ms | proxy de INP |
| TTI | ~9 s | < 5 s | **informativa**: no puntúa en Performance desde Lighthouse v10; la auditoría `interactive` sigue en el reporte y permite validarla. Salud del main-thread, no meta de score. |
| Best Practices | 73 | ≥ 95 | |
| Accessibility | 96 | 100 | |

Cada commit se valida con: `astro build` + `verify-metrics.cjs` + `npm test` + Chrome real 1440/390px + Lighthouse móvil 3 corridas vs. baseline + `test:a11y:astro`. Registro en `CHANGELOG-AUDIT.md` y flujo Notion (Inbox → Changelog → Tarea) por cambio lógico.
