# AUDIT-AS-IS · diegomaury.mx

Auditoría de estado actual. **No se ha modificado código** (salvo una línea en `.gitignore` para no versionar los reportes crudos de Lighthouse).
Rol: Senior Web Design Engineer + UX/UI Auditor + Frontend Engineer.

- **Revisión 1** (2026-09-01): primera pasada.
- **Revisión 2** (2026-09-01): correcciones tras revisión adversarial. Cambios materiales: F-01 (mecanismo re-diagnosticado; síntoma "hero en blanco" era un artefacto de tab oculto, no un bug de plataforma), F-02 (números pasan de corrida única peor-caso a medianas de 3 corridas; **no quedan hallazgos P0**), F-03 (marcado NO CONFIRMADO), F-04/F-05/F-17 (recomendación concreta en vez de menú de opciones), rúbrica de severidad definida, hallazgos nuevos F-21/F-22/F-23.

Herramientas usadas:
- **Lighthouse 13.4.1**, Chrome headless local contra producción. **3 corridas** por página en móvil (medianas reportadas), 1 en desktop. Reportes: `qa-output/lighthouse-baseline/` (gitignoreado, regenerable).
- **taste-skill / image-to-code-skill** (`github.com/Leonxlnx/taste-skill`, clon temporal, no instalado como dependencia) como lente de calidad visual — tratada como **heurística de un repo externo no validado**, no como fuente de hallazgos.
- **Vercel Web Interface Guidelines** (`vercel-labs/web-interface-guidelines`) para el eje técnico/accesibilidad.
- **Chrome real** (Claude-in-Chrome) a 1440px + inspección de DOM/CSS/consola/`performance`/`IntersectionObserver` en vivo.
- `curl` para HTML servido, cabeceras, tamaños y aspectos de imagen.
- Lectura del repo: `index.astro`, `BaseLayout.astro`, `Navbar.astro`, `variables.css`, `globals.css`, `home.css`, `site.ts`, `_headers`, `_redirects`, `.gitignore`, `package.json`, `astro.config.mjs`.

---

## Rúbrica de severidad

| Nivel | Criterio | 
|---|---|
| **P0** | Rompe una tarea central para una proporción grande de usuarios. Confirmado. Sin workaround. (sitio inutilizable, ruta de conversión muerta, pérdida de datos) |
| **P1** | Degrada de forma material la experiencia o el resultado de negocio para muchos usuarios, **o** incumple un umbral externo duro (Core Web Vitals, WCAG A). Confirmado. |
| **P2** | Degradación perceptible pero de audiencia más estrecha o impacto más suave; **o** alto impacto potencial con confianza media. |
| **P3** | Pulido, casos borde, o deuda de coste diferido con bajo impacto presente. |

Priorización del backlog (fase 2): `Impacto × Confianza ÷ Esfuerzo`. La severidad aquí es solo el eje Impacto×Confianza; el Esfuerzo entra en `OPTIMIZATION-BACKLOG.md`.

**Resultado de la revisión 2: no quedan hallazgos P0.** Cuatro P1.

---

## Stack (verificado)

| Capa | Realidad |
|---|---|
| Framework | Astro `^7.2.4`, `output: 'static'` (SSG puro, sin SSR) |
| Build/Deploy | Cloudflare Pages (Git integration, `astro build` en cada push a `master`). No GitHub Actions. |
| Contenido | 100% desde Notion en build time (`src/services/notionLoaders.ts`): `siteCopy`, `cases`, `metrics`, `imageSlots`. Imágenes y traducciones DeepL cacheadas y recomprimidas (webp q82, máx 1600px) en `public/cms-media/notion/` (versionadas). |
| i18n | Nativo de Astro. ES sin prefijo, EN bajo `/en/*`. Traducción DeepL en build. |
| Estilos | CSS plano por superficie en `src/styles/*.css` + tokens DS v2 "Ember on Ink" en `variables.css`. Sin Tailwind, sin framework de componentes. |
| JS de cliente | Mínimo. `<script is:inline>` (navbar, loader GTM, init Senja) + **un `<script type="module">` inline** en `index.astro` (Astro lo inlinea, no genera `/_astro/*.js`) para scroll-reveal, acordeón, contadores y diagrama radial. |
| Analítica | GTM `GTM-NHT5827J` → GA4 `G-DQ66HR59N9` (config tag dentro del contenedor). |
| Terceros en runtime | GTM/GA4, widget Senja, Cloudflare (`challenge-platform/jsd/main.js` + `email-decode.min.js` + intento de `beacon.min.js` **bloqueado por CSP propia**). |
| Fuente de verdad del diseño | Proyecto Claude Design "Diego Maury Design System V 2" → `variables.css`. Plus Jakarta Sans + DM Mono. |
| Componentes reutilizables | `BaseLayout.astro`, `Navbar.astro`, `Footer.astro`, `CaseArticle.astro`. Utilidades en `src/utils/`. |
| Páginas reales | `index.astro` (+`/en`), `portfolio.astro` (+`/en`), `portfolio/[slug].astro` (14 casos, +`/en`), `docencia.astro`, 2 legales, `llms.txt.ts`. |

**Partes que deben preservarse:** el DS V2 y sus tokens, la arquitectura Notion→Astro (incl. cache de imágenes/traducción), el copy (viene del SSOT de Notion — no tocar sin Diego), la plantilla CAR de casos, la ficha SOFI (la superficie mejor resuelta), el sistema i18n.

**No hace falta arquitectura nueva.** Todos los hallazgos se resuelven dentro de Astro SSG + el CSS actual.

---

## Executive Summary (10 hallazgos principales)

1. **[P1] La performance móvil incumple Core Web Vitals, con alta varianza de cola.** Home móvil: Performance mediana **75** (3 corridas: 75, 76, 60), LCP mediana **~4.0 s** (3.9 / 3.9 / 8.9 s), FCP **~3.0 s**, TBT **~254 ms**, **TTI ~9 s (estable en las 3)**, CLS 0. Portfolio móvil: Performance mediana **80**, LCP **~3.4 s**, TBT **~242 ms**. Desktop home: **83**, LCP 2.0 s. La cola (corridas que se van a 8–9 s de LCP) la producen los terceros (Senja, GTM). *Corrección de rev. 1: los números "54 / LCP 9.4 s / TBT 2 120 ms" eran corridas únicas peor-caso, no medianas.* (Hecho.)

2. **[P1] El contenido above-the-fold, incluida la imagen LCP, está gated por un reveal en JS que anula su propia optimización.** El hero completo lleva `data-reveal` → `opacity: 0` en `globals.css:15-24`, y solo se limpia cuando un `<script type="module">` inline (diferido) ejecuta su `IntersectionObserver` (`index.astro:632-644`) **más** una transición CSS de 0.6 s. La foto del hero ya viene bien optimizada (`webp 1601×831, 71 KB, loading="eager", fetchpriority="high", width/height`), pero **el wrapper `opacity:0` impide pintarla**: Lighthouse móvil mide `elementRenderDelay ≈ 900 ms` sobre `div.hero-media > img`. En desktop rápido el impacto es ~0. *Corrección de rev. 1: mi observación en navegador de "hero en blanco 12 s sin scroll" fue un **artefacto de tab oculto** — `document.visibilityState:"hidden"`, `requestAnimationFrame` e `IntersectionObserver` están pausados por Chrome en pestañas no visibles; un `IntersectionObserver` nuevo con config por defecto tampoco disparaba. Para un usuario real con la pestaña visible, el reveal dispara ~1 frame tras ejecutarse el script.* (Hecho, mecanismo confirmado con el código.)

3. **[P1] La CSP de producción bloquea scripts y es cosmética.** `public/_headers` usa `script-src 'self' 'unsafe-inline' …` — `'unsafe-inline'` ya anula la protección principal de una CSP. Además la whitelist no incluye `static.cloudflareinsights.com` (beacon de Cloudflare Web Analytics, auto-inyectado → bloqueado, error de consola) ni `ajax.googleapis.com` (un tercero carga `webfont.js` → bloqueado). Best Practices = **73** en las 3 páginas, arrastrado por esto + APIs deprecadas de Cloudflare. (Hecho.)

4. **[P1] Terceros pesados mantienen el main-thread ocupado ~9 s (TTI).** GTM+GA4 (≈360 KB, ≈129 KB sin usar), Senja (**377 ms en home, 1 121 ms en `/portfolio`** — es la causa del diferencial que la rev. 1 no explicó), y el **`challenge-platform` de Cloudflare corre en cada visita** (≈250 ms + 3 APIs deprecadas: Shared Storage, `StorageType.persistent`, Protected Audience) — impropio de un sitio de marketing. El TBT mediano (~250 ms) no lo refleja, pero TTI ~9 s (estable) sí: el hilo no queda quieto hasta entonces. (Hecho.)

5. **[P1→P2] El widget Senja es una isla de "modo claro" con marca de terceros visible.** Tarjetas blancas sobre `#0A0612`, estrellas doradas fuera de paleta, `<video>` con controles nativos sin estilar, badge "💜 Collect testimonials with Senja" visible al visitante, y el único fallo `color-contrast` de Lighthouse vive en su shadow DOM. *Baja a P2 en rev. 2: audiencia estrecha (quien llega a esa sección), y hay una salida limpia clara (ver F-05).* (Hecho + Inferencia.)

6. **[P2] Las tipografías se cargan render-blocking por `<link>` a Google Fonts, sin `preload`, y no hay `<link rel="preload">` de nada.** La imagen LCP tampoco se precarga. FCP móvil ~3.0 s está dominado por esto. El repo trae fuentes self-hosted (`public/assets/fonts/`) pero son de la V1 y no se usan. (Hecho.)

7. **[P2] La tarjeta social (OG/Twitter) es un retrato cuadrado sin diseñar.** `og:image` = `/assets/img/diego-maury.png`, **700×700, 574 KB PNG**, con `twitter:card=summary_large_image` (que espera ~1200×630). Sin `og:image:alt`, `og:image:width/height`. Para una marca personal cuyo tráfico llega por LinkedIn / Substack / WhatsApp, la tarjeta social **es** la primera impresión y Lighthouse SEO 100 no la valida. (Hecho.)

8. **[P2] Las imágenes del hero y de los "casos destacados" restan seniority.** Hero: still tipo set de podcast (micrófono, lona HackSureste). `/portfolio`: las 4 tarjetas Insignia usan capturas de web y fotos de evento granuladas con tratamientos inconsistentes, más un rectángulo verde brillante fuera de paleta sobre la tarjeta de HEINEKEN (¿badge? ¿imagen rota?). El público objetivo declarado es nivel dirección. (Inferencia.)

9. **[P2] Faltan fundamentos de plataforma + accesibilidad.** Sin skip-link a `<main>`; sin `color-scheme: dark` en `<html>` (scrollbars/inputs claros); sin `<meta name="theme-color">`; `scroll-behavior: smooth` global no condicionado a `prefers-reduced-motion`; sin `scroll-margin-top` en las secciones ancladas del home (el navbar `fixed` de 64px tapa el encabezado destino); el menú burger no cierra con `Escape` ni click-fuera. (Hecho.)

10. **[P2] La única ruta a "agendar" es el botón persistente del navbar.** Los CTA del hero van a `/portfolio` y al CV; el CTA de conversión ("Hagamos que las cosas pasen" → Notion Calendar, verificado 200) solo vive en el navbar y en S8 al final de la página. El home no ofrece un camino directo a la reserva en el momento de mayor intención (el hero). (Hecho + Inferencia.)

---

## Scorecard

Scores 0–10, con evidencia observada. Métricas móviles = mediana de 3 corridas de Lighthouse.

| Área | Score /10 | Severidad global | Evidencia |
|---|---:|---|---|
| Positioning / Narrative | 7 | P2 | Copy claro y con filo (S1–S8 desde SSOT), formato CAR sólido, métricas con calificador. Lastres: hero LCP retrasada (F-02), imágenes que leen "creator" (F-08), sub del hero ~40 palabras, sin CTA de reserva en el hero (F-23). |
| UX / Information Architecture | 6.5 | P2 | Nav de 4 ítems + CTA, limpio; ficha SOFI ejemplar. Lastres: sin `scroll-margin-top` (F-09), sin skip-link (F-14), en móvil la foto del hero se apila **encima** del H1 (`order:-1`, F-13), galería de evidencia de caso en miniaturas ~140px sin ampliación (F-16), ruta a reserva indirecta (F-23). |
| Visual Design | 6.5 | P2 | DS V2 coherente y con carácter; ritmo de secciones variado (acordeón, diagrama radial, grids) — no es card-spam. Lastres: isla modo-claro de Senja (F-05), imágenes de caso de baja fidelidad + verde fuera de paleta (F-08), OG sin diseñar (F-21), micro-tipografía (F-10, preferencia). |
| Accessibility | 6.5 | P2 | Lighthouse a11y **96** (móvil y desktop) en las 3 corridas; único fallo de contraste está dentro del widget Senja, no en código propio. Restan: sin skip-link (F-14), `scroll-behavior` no condicionado (F-15), burger sin `Esc`/click-fuera (F-17), `<video>` de Senja sin transcripción (F-05), `scroll-margin-top` ausente (F-09). |
| Performance | 6 | P1 | Móvil mediana: home Perf **75** / LCP ~4.0 s / TBT ~254 ms / FCP ~3.0 s / **TTI ~9 s** / CLS 0; portfolio Perf **80** / LCP ~3.4 s / TBT ~242 ms. Desktop home **83** / LCP 2.0 s. LCP móvil > 2.5 s → incumple CWV. Causas: F-02, F-04, F-06, F-22. Alta varianza de cola por terceros. |
| SEO | 8.5 | P2 | LH SEO **100** en todas las corridas. `@astrojs/sitemap`, `robots.txt` correcto, canonical + hreflang ES/EN, JSON-LD `Person`/`ItemList`/`CreativeWork`, `llms.txt`. Lastres: tarjeta social sin diseñar (F-21, baja el score real), stubs con `meta refresh` (F-19), experimento "consultor" en meta description (revisión a 90 días ya agendada). |
| Technical Quality | 6 | P1 | Astro SSG bien estructurado, CSS por superficie, contenido 100% CMS, tests de utilidades, i18n nativo. Lastres: CSP cosmética/rota (F-04), challenge-platform de Cloudflare en marketing (F-06), sin `color-scheme`/`theme-color` (F-14), reveal que anula su propia optimización (F-02), imágenes del cinturón sin `width`/`height` (F-12), doble punto de carga de GTM (F-18). |

---

## Findings

Severidad según la rúbrica de arriba. Cada hallazgo marca **Hecho** / **Inferencia** / **Recomendación**.

---

### F-01 · Arquitectura de scroll-reveal: mecanismo y límite de la evidencia
- **Área:** Performance / Visual / método
- **Severidad:** P1 (el impacto medible está en F-02; este finding documenta el mecanismo)
- **Tipo:** Hecho (código) + corrección de método
- **Mecanismo (confirmado con el código):**
  - `globals.css:15-24`: `[data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity .6s, transform .6s }` y `[data-reveal].is-visible { opacity: 1; transform: none }`.
  - `index.astro` marca con `data-reveal` **todo el hero** (`.hero-label`, `.hero-h1`, `.hero-sub`, `.hero-ctas`, `.hero-media`, `.trust`) con `--delay` escalonado.
  - `index.astro:627-644`: un `<script type="module">` inline (Astro lo inlinea; no hay `/_astro/*.js`). El observer es estándar y correcto: `new IntersectionObserver(cb, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 })`, `cb` añade `.is-visible` y hace `unobserve`. Con `prefers-reduced-motion` se saltan el reveal (bien).
  - Los módulos inline son diferidos: el script corre al terminar el parse. En móvil el parse se retrasa por el `<script src="/js/gtm.js">` clásico (bloqueante) a mitad de `<body>`. Tras ejecutarse, el IO dispara al frame siguiente y arranca la transición de 0.6 s.
- **Por qué esto importa:** la foto del hero tiene `fetchpriority="high"` + `loading="eager"` + `width`/`height` — **el wrapper `opacity:0` neutraliza esa prioridad**: el navegador la descarga pronto pero no la pinta hasta que corre el JS. Es el candidato LCP en móvil (ver F-02).
- **Evidencia y su límite:**
  - Lighthouse móvil (pestaña visible, throttling 4×): `lcp-breakdown-insight` → `Element render delay ≈ 900 ms` sobre `div.hero-media > img`.
  - **Retracción de rev. 1:** observé en Chrome real un hero persistentemente en blanco (`opacity:0` 12 s sin scroll) y lo atribuí a "el IO no dispara para elementos ya visibles". **Eso fue un artefacto de pestaña oculta:** `document.visibilityState === "hidden"`, `document.hidden === true`, `requestAnimationFrame` no dispara en 500 ms, y un `IntersectionObserver` **nuevo con config por defecto** tampoco dispara en 2 s. Chrome pausa el pipeline de render (rAF + IO) en pestañas no visibles / ocluidas; el scroll programático lo "despierta". Para un usuario real con la pestaña al frente, el reveal dispara ~1 frame después de ejecutarse el script. **No hay bug de `IntersectionObserver`.**
- **Impacto real:** ~0 en desktop; ~0.9 s de retraso de LCP en móvil, sobre una imagen que ya está descargada.
- **Recomendación (única, independiente del mecanismo):** quitar `data-reveal` del bloque hero (y del primer bloque bajo el fold) para que el hero + la imagen LCP pinten con FCP. El reveal se conserva tal cual para el resto de la página. No hace falta reescribir el sistema de reveal ni "marcar is-visible en primer frame" (rev. 1 proponía alternativas innecesarias).
- **Esfuerzo:** S.

---

### F-02 · Performance móvil incumple Core Web Vitals (medianas de 3 corridas)
- **Área:** Performance
- **Severidad:** P1
- **Tipo:** Hecho
- **Datos (Lighthouse 13.4.1, móvil, 3 corridas):**

  | | Perf | FCP | LCP | TBT | TTI | CLS |
  |---|---:|---:|---:|---:|---:|---:|
  | Home móvil (mediana) | **75** | ~3.0 s | **~4.0 s** | ~254 ms | **~9.0 s** | 0 |
  | Home móvil (rango) | 60–76 | 2.4–3.1 s | 3.9–8.9 s | 252–310 ms | 8.1–9.2 s | 0 |
  | Portfolio móvil (mediana) | **80** | ~3.4 s | **~3.4 s** | ~242 ms | ~8.7 s | 0 |
  | Portfolio móvil (rango) | 60–80 | 3.0–3.8 s | 3.1–7.9 s | 217–351 ms | 8.5–9.3 s | 0 |
  | Desktop home (1 corrida) | 83 | 1.0 s | 2.0 s | 180 ms | 2.5 s | 0.003 |

- **Descomposición de LCP (móvil, corrida representativa):**
  - Home: TTFB 1 664 ms · resource load delay 162 ms · resource load duration 756 ms · **element render delay 906 ms** → LCP ~3.5–4.0 s. Elemento: `div.hero-media > img`.
  - Portfolio: TTFB 427 ms · element render delay 338 ms → LCP ~3.4 s. Elemento: `h1` (texto). **La LCP de portfolio es esencialmente FCP** — no hay reveal de por medio; es fuentes render-blocking + TTFB.
  - El "TTFB 1 664 ms" es el valor **simulado** de Lighthouse bajo Lantern/slow-4G (RTT ~150 ms + throttling), no un problema del origen: `server-response-time` real = 46–192 ms. *Corrección de rev. 1: el "hueco de 6 s sin atribuir" era (a) varianza de corrida única, (b) setup de conexión throttled simulado, (c) FCP ~3 s por fuentes. No es TTFB de servidor.*
- **Impacto:** LCP móvil > 2.5 s de forma consistente → incumple CWV en el ~60–70% del tráfico. TTI ~9 s (estable) = la página no termina de asentarse en 9 s por los terceros. La cola de LCP (8–9 s) aparece cuando Senja/GTM tienen un mal timing.
- **Recomendación:** F-01 (~0.9 s), F-07 (fuentes, ~0.5–1 s de FCP), F-22 (preload LCP), F-04/F-06 (terceros → TTI). Objetivo TO-BE: LCP móvil p75 < 2.5 s, Perf ≥ 88, TTI < 5 s (informativa).
- **Esfuerzo:** M (suma).

---

### F-03 · [NO CONFIRMADO] Navegación por ancla y contenido diferido
- **Área:** UX
- **Severidad:** sin asignar (no verificado)
- **Tipo:** Observación no confirmada
- **Qué observé:** al hacer clic en un ítem de nav-ancla en Chrome automatizado, la sección destino aparecía sin su contenido `data-reveal` con `--delay`, hasta hacer scroll manual.
- **Por qué NO es confiable:** misma causa que la retracción de F-01 — el pipeline de render (IO) estaba pausado por pestaña oculta. No pude reproducirlo con una pestaña visible desde este entorno.
- **Qué sí es real e independiente:** falta `scroll-margin-top` en las secciones ancladas (F-09) — eso sí deja el encabezado destino bajo el navbar `fixed`.
- **Recomendación:** al aplicar F-01 (quitar `data-reveal` above-the-fold) + F-09 (`scroll-margin-top`), este riesgo queda cubierto sin necesidad de confirmarlo. Si se quiere certeza, verificar el salto por ancla en un navegador de escritorio real antes del TO-BE.
- **Esfuerzo:** — (cae con F-01 + F-09).

---

### F-04 · CSP cosmética y con orígenes legítimos bloqueados
- **Área:** Technical / Performance / Security
- **Severidad:** P1
- **Tipo:** Hecho
- **Problema:**
  - `public/_headers` → `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://widget.senja.io`. **`'unsafe-inline'` anula la protección principal de una CSP** (cualquier `<script>` inyectado en el DOM se ejecuta). Añadir más orígenes a la whitelist mantiene la ilusión de seguridad sin cerrar el vector real. El comentario del propio `_headers` reconoce que sin SSR no se pueden generar nonces por request — pero Astro sí soporta **CSP con hashes** en build (`experimental.csp` / integración) para scripts estáticos.
  - La whitelist **no** incluye `static.cloudflareinsights.com` (beacon de Cloudflare Web Analytics, que Cloudflare inyecta automáticamente) → bloqueado, error de consola, violación en el panel *Issues*.
  - Algo (probablemente el embed de Senja) carga `https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js` → bloqueado.
- **Evidencia:** `public/_headers:8`. LH `errors-in-console` + `inspector-issues` ("Content security policy"). Best Practices **73** en las 3 páginas.
- **Impacto:** Cloudflare Web Analytics no registra nada; errores de consola visibles en cualquier auditoría de cliente/tercero; Best Practices bajo; la CSP no protege de XSS.
- **Recomendación (concreta):**
  1. **Desactivar Cloudflare Web Analytics** en el dashboard. Es redundante con GA4/GTM: una fuente de analítica, no dos. Elimina el script bloqueado sin tocar la CSP.
  2. Investigar y **eliminar** el cargador de `webfont.js` (revisar la config del embed de Senja; se resuelve solo si se aplica F-05 opción C).
  3. Decisión de rumbo para el TO-BE: (a) CSP estricta con hashes en build para los `is:inline` propios + `strict-dynamic`, o (b) aceptar la CSP actual como higiene menor y documentarlo. No dejar el estado intermedio "whitelist que crece".
- **Esfuerzo:** S (pasos 1–2) / M (paso 3a).

---

### F-05 · Widget Senja: isla modo-claro + marca de terceros + coste de main-thread
- **Área:** Visual / Accessibility / Performance
- **Severidad:** P2
- **Tipo:** Hecho + Inferencia
- **Problema:** El embed de Senja (S6b del home; sección "Testimonios" de `/portfolio`) renderiza tarjetas blancas sobre `#0A0612`, estrellas doradas fuera del DS, un `<video>` con controles nativos sin estilar, y el badge "💜 Collect testimonials with Senja" visible al visitante. Coste: **377 ms** de scripting en home, **1 121 ms en `/portfolio`** (widget distinto, id `43006bd7…`) — es el mayor script de esa página y explica el diferencial de TTI/TBT que la rev. 1 no atribuyó. El único fallo `color-contrast` de Lighthouse vive en su shadow DOM (`p.opacity-70` en `#document-fragment`).
- **Evidencia:** screenshots de `/portfolio`; LH `bootup-time` (Senja home 377 ms, portfolio 1 121 ms); LH `color-contrast` node path con `#document-fragment`. Los testimonios propios (`.testimonial-card`, render de Astro) sí están bien resueltos.
- **Impacto:** rompe el "page theme lock" (el visitante siente que cambió de sitio), expone el uso de un plan gratuito, y es el mayor coste de main-thread en `/portfolio`.
- **Recomendación (concreta — opción C):** **importar los testimonios de Senja a una base de Notion y renderizarlos con el componente `.testimonial-card` propio.** Elimina de una vez el coste de main-thread, el fallo de contraste, el `webfont.js` bloqueado (F-04) y el branding de tercero, y es la única opción coherente con la arquitectura Notion-first que este mismo documento manda preservar. Las opciones "tema oscuro de Senja de pago" o "quitar el embed y dejar solo las 2-3 tarjetas propias" son alternativas de menor esfuerzo si la importación no es viable ahora.
- **Esfuerzo:** M (opción C) / S (quitar el embed).

---

### F-06 · Terceros mantienen el main-thread ocupado ~9 s + challenge-platform en marketing
- **Área:** Performance / Technical
- **Severidad:** P1
- **Tipo:** Hecho
- **Problema:**
  - GTM (`gtm.js` GTM-NHT5827J) carga el contenedor + el tag GA4 (`gtag/js`): ≈360 KB sin comprimir, ≈129 KB de JS sin usar. Bootup: gtag ~227–273 ms + gtm ~128–210 ms.
  - `cdn-cgi/challenge-platform/scripts/jsd/main.js` se ejecuta en **cada** carga (≈224–295 ms) y dispara 3 warnings de API deprecada (Shared Storage, `StorageType.persistent`, Protected Audience). Indica Bot Fight Mode / Managed Challenge activo en un sitio de marketing que no lo necesita.
  - `email-decode.min.js` (Scrape Shield) también en cada carga.
  - Senja: ver F-05.
  - Resultado: **TTI ~9 s estable en las 3 corridas de ambas páginas** (aunque TBT mediano sea ~250 ms — el hilo trabaja en ráfagas, no en un bloque).
- **Evidencia:** LH `unused-javascript`, `bootup-time`, `deprecations`, `network-requests`, `interactive` (score 25–37 en todas las corridas).
- **Impacto:** INP en riesgo; TTI ~9 s; Best Practices 73 (con F-04).
- **Recomendación (concreta):**
  1. **Cloudflare:** Bot Fight Mode → Off (o Super Bot Fight Mode con challenge solo a bots definidos). Revisar si Email Obfuscation aporta algo real.
  2. **GTM:** cargar tras `requestIdleCallback` / primer input, o `<script>` con `type="module"` diferido; evaluar migrar a `gtag` GA4 directo si GTM no gestiona nada más (verificar el contenedor primero).
  3. Senja: F-05.
- **Esfuerzo:** S (1) / M (2, 3).

---

### F-07 · Fuentes render-blocking por `<link>` a Google Fonts
- **Área:** Performance
- **Severidad:** P2
- **Tipo:** Hecho
- **Problema:** `BaseLayout.astro:177-180` carga `Plus Jakarta Sans` + `DM Mono` con `<link rel="stylesheet" href="fonts.googleapis.com/css2?…&display=swap">` — render-blocking, sin `preload`. El repo tiene fuentes self-hosted en `public/assets/fonts/` pero son de la V1 (Satoshi, JetBrains Mono) y no se usan.
- **Evidencia:** `BaseLayout.astro:177-180`. LH `render-blocking-insight` score 0. FCP móvil ~3.0 s. `network-requests`: el CSS de fuentes se pide a ~253 ms y encadena las woff2 a ~576–650 ms.
- **Impacto:** FCP y, en portfolio, LCP (que es texto) retrasados; dependencia de un tercero para el render de texto.
- **Recomendación:** self-hostear Plus Jakarta Sans + DM Mono (subset latino), `@font-face` con `font-display: swap`, `<link rel="preload" as="font" crossorigin>` solo del peso crítico (400/500). Borrar `public/assets/fonts/` (V1). CSP `font-src 'self'`.
- **Esfuerzo:** S–M.

---

### F-08 · Imágenes que no comunican seniority
- **Área:** Positioning / Visual
- **Severidad:** P2
- **Tipo:** Inferencia
- **Problema:** Hero: still tipo set de creador de contenido (micrófono en primer plano, lona "HackSureste"). `/portfolio` "casos destacados": las 4 tarjetas Insignia usan captura de sitio web (HackSureste), foto de panel granulada (HEINEKEN), slide "Know the team" (REDUX) y el logo SOFI sobre negro — tratamientos inconsistentes, resolución baja. Rectángulo verde brillante fuera de paleta sobre la tarjeta de HEINEKEN.
- **Evidencia:** screenshots de home y `/portfolio` a 1440px.
- **Impacto:** El público objetivo declarado (nivel dirección) recibe señales de "creador de contenido / hackathon" en vez de "director de programa estratégico".
- **Recomendación (TO-BE):** retrato editorial consistente para el hero (mismo grado de color que el DS). Tarjetas de caso: tratamiento unificado (duotono ember/ink, o crop consistente, o mock en frame fijo) reusando el pipeline `imageSlots`/`notionImageCache`. Investigar el rectángulo verde.
- **Esfuerzo:** M (requiere assets de Diego; el código de tratamiento es S).
- **En el backlog se divide en dos:** **F-08a** (retrato del hero — bloqueado en asset de Diego) y **F-08b** (tratamiento unificado de las 4 tarjetas Insignia por CSS sobre las imágenes existentes + fix del rectángulo verde — sin assets nuevos, esfuerzo S, Diego solo aprueba la dirección).

---

### F-09 · Sin `scroll-margin-top` en secciones ancladas del home
- **Área:** UX / Accessibility
- **Severidad:** P2
- **Tipo:** Hecho
- **Problema:** Navbar `position: fixed` de 64px. `scroll-margin-top` solo existe en `.case-prose h2` (`case.css:29`, 100px). Las secciones del home (`#s2-quien-soy` … `#s8-siguiente-paso`) no lo tienen: al llegar por ancla, el encabezado queda bajo el navbar.
- **Evidencia:** `grep scroll-margin src/styles/` → solo `case.css:29`.
- **Impacto:** desorientación al navegar por menú.
- **Recomendación:** `scroll-margin-top: 80px` en `.section[id]`, `.about-section[id]` (o en `:target`).
- **Esfuerzo:** S.

---

### F-10 · [PREFERENCIA DE ESTILO, no defecto] Densidad tipográfica y tratamiento de cajas
- **Área:** Visual Design
- **Severidad:** P3 (a decidir en TO-BE, no un hallazgo objetivo)
- **Tipo:** Preferencia / Inferencia
- **Observación:** cuerpo a 13–13.5px en varias superficies (`.about-intro-p`, `.ip-desc`, `.testimonial-quote`, `.acc-d` 12.5px); `.metric-s` a 9px en `--t3`; `section-label` (eyebrow) en 5 de ~7 secciones; cada logo del cinturón en su caja con borde + radio.
- **Por qué es preferencia:** el criterio "5 eyebrows = tell de IA" viene de la heurística de un repo externo no validado (taste-skill), y **CLAUDE.md acepta explícitamente los section-labels como precedente del DS**. Los tamaños cumplen el DS. Esto no es un bug de build.
- **Recomendación (si Diego quiere subir el listón visual en el TO-BE):** cuerpo base ~15px; `.metric-s` a ~10–11px o `--t2`; considerar reducir eyebrows a inflexiones reales; aligerar la caja de los logos. **Decisión de diseño, no corrección.**
- **Esfuerzo:** M.

---

### F-11 · Cache TTL subóptimo en assets
- **Área:** Performance
- **Severidad:** P3
- **Tipo:** Hecho
- **Problema:** LH `cache-insight` score 50 en las 3 páginas. `public/_headers` no define `Cache-Control` para `/cms-media/*`, `/assets/*`, `/_astro/*`.
- **Impacto:** repeat-view más lenta. Bajo (Cloudflare Pages ya cachea los `/_astro/*` con hash).
- **Recomendación:** regla en `_headers`: `/_astro/*` y `/cms-media/*` → `Cache-Control: public, max-age=31536000, immutable`.
- **Esfuerzo:** S.

---

### F-12 · Imágenes del cinturón de logos sin `width`/`height`
- **Área:** Performance / Technical
- **Severidad:** P3
- **Tipo:** Hecho
- **Problema:** `index.astro:290-291` renderiza `<img src alt loading="lazy">` sin dimensiones (×2 por el marquee duplicado). Alt text correcto (real en la primera copia, `alt=""` + `aria-hidden` en la segunda).
- **Evidencia:** LH `unsized-images` score 50 lista `div.trust-logo > img`. CLS actual 0 porque `.trust-logo` fija `180×72px`.
- **Impacto:** bajo hoy; deuda si se refactoriza el cinturón.
- **Recomendación:** añadir `width`/`height` intrínsecos vía el loader de `imageSlots`.
- **Esfuerzo:** S.

---

### F-13 · En móvil la foto del hero se apila encima del H1
- **Área:** UX
- **Severidad:** P2
- **Tipo:** Hecho
- **Problema:** `home.css:5` — `@media (max-width: 900px) { .hero-media { order: -1 } }`. En móvil una imagen de 240px queda **antes** del H1, empujando la propuesta de valor y los CTAs fuera del primer viewport.
- **Evidencia:** `home.css:5`.
- **Impacto:** en móvil (mayoría del tráfico) el visitante ve primero una foto.
- **Recomendación:** en móvil, H1 + sub + CTA primero; imagen después (quitar `order:-1`) o reducir su altura si va arriba.
- **Esfuerzo:** S.

---

### F-14 · Faltan fundamentos de plataforma (skip-link, color-scheme, theme-color)
- **Área:** Accessibility / Technical
- **Severidad:** P2
- **Tipo:** Hecho
- **Problema:** sin skip-link a `<main>` en `BaseLayout.astro`; `<html>` sin `color-scheme: dark` (scrollbar clara confirmada en screenshots; inputs nativos se renderizarían en tema claro en Windows); sin `<meta name="theme-color">` (la barra del navegador móvil no matchea `#0A0612`).
- **Evidencia:** `BaseLayout.astro:53-93` (head completo). `grep skip src/` → nada.
- **Recomendación:** skip-link visible en `:focus` como primer hijo de `<body>`; `:root { color-scheme: dark }`; `<meta name="theme-color" content="#0A0612">`.
- **Esfuerzo:** S.

---

### F-15 · `scroll-behavior: smooth` global sin condicionar a reduced-motion
- **Área:** Accessibility
- **Severidad:** P3
- **Tipo:** Hecho
- **Problema:** `globals.css:2`. El resto del sitio sí respeta `prefers-reduced-motion`.
- **Recomendación:** `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }`.
- **Esfuerzo:** S.

---

### F-16 · Galería de evidencia de caso en miniaturas sin ampliación
- **Área:** UX
- **Severidad:** P2
- **Tipo:** Hecho + Inferencia
- **Problema:** en `/portfolio/sofi`, "EVIDENCIA VISUAL" son 6 imágenes en grid de 2 columnas a ~140px, con dashboards donde el detalle importa. Sin lightbox ni enlace a tamaño completo.
- **Evidencia:** screenshots de `/portfolio/sofi`.
- **Impacto:** la evidencia (central a la propuesta "resultado que puedo demostrar") es difícil de examinar.
- **Recomendación (TO-BE):** lightbox accesible (dialog nativo, `Esc`, foco gestionado) o al menos `<a>` a la imagen completa + alt descriptivo.
- **Esfuerzo:** M.

---

### F-17 · Menú burger sin cierre por `Escape` / click-fuera
- **Área:** Accessibility
- **Severidad:** P3
- **Tipo:** Hecho
- **Problema:** `Navbar.astro:179-197` — el burger togglea `.is-open`, actualiza `aria-expanded`/`aria-label` (bien) y cierra al clicar un link (bien), pero no cierra con `Escape` ni al clicar fuera, y no devuelve el foco al botón disparador.
- **Evidencia:** `Navbar.astro:135-199`.
- **Recomendación (patrón disclosure de ARIA APG — NO focus trap):** añadir `Escape` para cerrar + devolver el foco al `.nav__burger`; cerrar al clicar fuera. **No** atrapar el foco: eso corresponde solo a un diálogo modal con fondo inerte; atraparlo en un menú de navegación no modal degrada la experiencia de teclado. *Corrección de rev. 1, que recomendaba "foco atrapado".*
- **Esfuerzo:** S.

---

### F-18 · Doble punto de carga de GTM
- **Área:** Technical
- **Severidad:** P3
- **Tipo:** Hecho
- **Problema:** `BaseLayout.astro:186` renderiza `<script is:inline src="/js/gtm.js">` si `enableGtm`; `index.astro:251` lo renderiza otra vez, literal, siempre. Hoy `index.astro` no pasa `enableGtm`, así que solo dispara una vez, pero el patrón es ambiguo.
- **Recomendación:** una sola vía — `enableGtm` en `BaseLayout` para todas las páginas, quitar el `<script>` literal de `index.astro`.
- **Esfuerzo:** S.

---

### F-19 · Stubs de redirect por `meta http-equiv="refresh" content="0"`
- **Área:** SEO / Technical
- **Severidad:** P3
- **Tipo:** Hecho
- **Problema:** `public/cases/*.html` (5) y `public/portfolio/*.html` (3) redirigen con `<meta http-equiv="refresh" content="0; url=…">` + `noindex`. `_redirects` solo cubre las 2 páginas legales + `/hacksureste` + `/portfolio/idealab-by-hacksureste`.
- **Impacto:** bajo (Google trata `refresh` 0 como redirect; los stubs son `noindex`).
- **Recomendación:** mover las 8 rutas a `_redirects` como `301` y borrar los HTML stub.
- **Esfuerzo:** S.

---

### F-20 · Sub del hero larga; CTA de navbar es lema
- **Área:** Positioning / Content
- **Severidad:** P3
- **Tipo:** Inferencia + Hecho
- **Problema:** sub del hero ~40 palabras / 4 líneas. CTA de navbar "Hagamos que las cosas pasen" no dice qué pasa al hacer clic (va a Notion Calendar — verificado 200). Los CTA del hero: primario `/portfolio`, ghost `/cv/diego-maury-cv.pdf` (verificado 200, 291 KB) — ver F-23.
- **Evidencia:** DOM del hero; `site.ts:26`.
- **Recomendación (TO-BE, con Diego — el copy vive en el SSOT de Notion, no tocar sin él):** recortar la sub a ~20 palabras; CTA de navbar → etiqueta de acción ("Agendar una llamada").
- **Esfuerzo:** S (código) + decisión de Diego (copy).

---

### F-21 · Tarjeta social (OG/Twitter) sin diseñar
- **Área:** SEO / Positioning
- **Severidad:** P2
- **Tipo:** Hecho
- **Problema:** `og:image` = `https://diegomaury.mx/assets/img/diego-maury.png` — **700×700, 574 KB PNG** (verificado con `curl`), con `twitter:card=summary_large_image` que espera ~1200×630. LinkedIn / WhatsApp / Substack recortan una imagen cuadrada a letterbox y 574 KB es pesado. Sin `og:image:alt`, `og:image:width`, `og:image:height`. Las 14 fichas de caso pasan `ogImage` dinámico por caso (mejor), pero el home y `/portfolio` usan este PNG.
- **Evidencia:** `curl` del HTML servido + de la imagen. `BaseLayout.astro:137-147`.
- **Impacto:** para una marca personal cuyo tráfico llega por LinkedIn / Substack / WhatsApp, la tarjeta social es la primera impresión real y Lighthouse SEO 100 no la valida.
- **Recomendación (TO-BE):** una tarjeta OG diseñada 1200×630 (nombre + rol + una línea + isotipo, en el DS), servida como webp/png optimizado < 200 KB, con `og:image:alt`/`width`/`height`. Puede vivir como slot de `imageSlots` (editable desde Notion) o generarse en build.
- **Esfuerzo:** M (requiere el asset).

---

### F-22 · Sin `<link rel="preload">` para la imagen LCP ni la fuente crítica
- **Área:** Performance
- **Severidad:** P2
- **Tipo:** Hecho
- **Problema:** el HTML servido **no tiene ningún `<link rel="preload">`** (verificado con `curl`). La foto del hero (candidato LCP en móvil) se descubre cuando el parser llega al `<img>`, después del CSS de fuentes. La fuente crítica tampoco se precarga.
- **Evidencia:** `grep '<link rel="preload"' dm-home.html` → nada.
- **Impacto:** ~150–300 ms recuperables de LCP en móvil.
- **Recomendación:** en `<head>` de `index.astro`: `<link rel="preload" as="image" href="…foto-diego-hero…webp" fetchpriority="high">` (solo home) + `<link rel="preload" as="font" crossorigin>` del peso crítico (con F-07). Combinar con F-01 (quitar el `opacity:0` del wrapper) para que el preload sirva.
- **Esfuerzo:** S.

---

### F-23 · La ruta a "agendar" solo existe en el navbar
- **Área:** UX / Conversión
- **Severidad:** P2
- **Tipo:** Hecho + Inferencia
- **Problema:** el CTA de conversión (`https://calendar.notion.so/meet/diegomaurymx/5aad3vun`, Notion Calendar — **verificado HTTP 200**) aparece en el botón persistente del navbar y en S8 al final de la página. Los CTA del hero van a `/portfolio` (primario) y al CV (ghost). El home no ofrece un camino directo a la reserva en el punto de mayor intención.
- **Evidencia:** `curl` del HTML (`href` de `.nav-cta`, `.btn-primary`, `.btn-ghost`). Todos los destinos resuelven 200.
- **Impacto:** fricción en la conversión: el visitante que decide en el hero tiene que buscar el botón del navbar o llegar hasta S8.
- **Recomendación (TO-BE, con Diego):** evaluar un CTA secundario de reserva en el hero, o que el CTA primario del hero sea la reserva y el de "ver casos" el secundario. Es una hipótesis de CRO, no un defecto — validar con Diego qué acción quiere priorizar en el hero.
- **Esfuerzo:** S (código) + decisión de Diego.

---

## Hechos vs. Inferencias vs. Recomendaciones — resumen

- **Hechos (medibles/verificados):** F-01 (mecanismo + retracción), F-02 (medianas LH), F-04, F-05 (coste), F-06, F-07, F-09, F-11, F-12, F-13, F-14, F-15, F-17, F-18, F-19, F-21, F-22, F-23 (destinos).
- **Inferencias:** F-02 tail-variance ← terceros; F-05/F-08 restan seniority percibida; F-23 fricción de conversión (hipótesis CRO).
- **No confirmado:** F-03 (posible artefacto de pestaña oculta, no reproducido con pestaña visible).
- **Preferencia de estilo, no defecto:** F-10.
- **Recomendaciones:** las líneas "Recomendación" de cada finding. Se priorizan en `OPTIMIZATION-BACKLOG.md` (fase 2).

---

## Notas de método

- Lighthouse: 3 corridas por página en móvil, medianas reportadas; 1 corrida en desktop. Varianza observada de Perf ±8–15 puntos y de LCP hasta 5 s entre corridas — dominada por el timing de terceros (Senja, GTM). Los hallazgos **estructurales** (CSP, reveal gate, fuentes render-blocking, TTI ~9 s, ausencia de preloads, tarjeta OG) son estables entre corridas.
- **Retracción documentada:** la observación de rev. 1 "el hero queda invisible sin scroll durante segundos por un bug de `IntersectionObserver`" era un artefacto del entorno de automatización (pestaña oculta → `rAF`/IO pausados por Chrome). Verificado: `document.visibilityState:"hidden"`, `rAF` sin disparar en 500 ms, IO nuevo con config por defecto sin disparar en 2 s. El impacto real de la arquitectura de reveal es el `elementRenderDelay ≈ 900 ms` de Lighthouse en móvil (pestaña visible), no una pantalla en blanco.
- No se auditaron a fondo `/docencia`, las 2 páginas legales, 13 de las 14 fichas de caso, ni el árbol `/en/*`. Comparten `BaseLayout` (heredan F-04, F-06, F-07, F-14, F-22) y la ficha `[slug].astro` (F-16). Ampliar en fase 2.
- Reportes crudos: `qa-output/lighthouse-baseline/` (`home-{mobile,desktop}`, `portfolio-mobile`, y `multi/{home,portfolio}-m-{1,2,3}.json`).
