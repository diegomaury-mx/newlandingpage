# CHANGELOG-AUDIT · diegomaury.mx

Registro técnico de la optimización derivada de `AUDIT-AS-IS.md` (rev. 2) → `AUDIT-TO-BE.md` → `OPTIMIZATION-BACKLOG.md`.
Espejo del flujo Notion (Inbox → Changelog — Portafolio D → Tarea). Cada entrada: qué cambió · por qué · evidencia que lo justificó · impacto esperado · validación posterior.

Baseline de referencia (pre-optimización, `AUDIT-AS-IS.md` rev. 2, Lighthouse 13.4.1 móvil, mediana de 3 corridas):

| | Perf | FCP | LCP | TBT | TTI | CLS | BP | a11y | SEO |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | 75 | ~3.0 s | ~4.0 s | ~254 ms | ~9 s | 0 | 73 | 96 | 100 |
| Portfolio | 80 | ~3.4 s | ~3.4 s | ~242 ms | ~8.7 s | 0 | 73 | 96 | 100 |
| Home desktop | 83 | 1.0 s | 2.0 s | 180 ms | 2.5 s | 0.003 | — | — | — |

Reportes crudos: `qa-output/lighthouse-baseline/` (gitignoreado). Baseline multi-corrida: `qa-output/lighthouse-baseline/multi/`.

---

## Paso 0 — Dashboard de Cloudflare (F-04.1 + F-06.1) · PENDIENTE (lo aplica Diego)

**Estado real verificado por API (2026-09-01), zona `diegomaury.mx` = `a2efd6b0f25ab483841d0968b5a0d64d`, plan Free:**

| Setting | Valor actual | Efecto observable |
|---|---|---|
| Bot Fight Mode (`bot_management.fight_mode`) | **`true`** (`enable_js: true`) | Inyecta `/cdn-cgi/challenge-platform/scripts/jsd/main.js` en cada visita: ≈250 ms de scripting + 3 APIs deprecadas (Shared Storage, `StorageType.persistent`, Protected Audience). |
| Cloudflare Web Analytics / RUM (`site_tag 7de9b348…`) | **activo**, `auto_install: true`, `ruleset.enabled: true` | Auto-inyecta `<script src="https://static.cloudflareinsights.com/beacon.min.js">`, **bloqueado por la CSP propia** (`script-src` no lo permite) → error de consola, y **no registra nada** desde que se puso la CSP. Redundante con GA4. |
| Email Obfuscation (`settings/email_obfuscation`) | `on` | Inyecta `/cdn-cgi/scripts/.../email-decode.min.js`. Menor; revisar si el sitio tiene mailtos que lo justifiquen (los `mailto:` del footer/CTA sí se benefician — se puede dejar). |

### Progreso (2026-09-01)

Flujo Notion registrado: Inbox `3ce0fe3c…ac01` (Procesado) → Changelog `3ce0fe3c…2782` → Tarea `3ce0fe3c…a3fb` (**Terminada** 2026-09-01).


| Acción | Quién | Estado | Verificación |
|---|---|---|---|
| **Bot Fight Mode → Off** (`bot_management.fight_mode`) | Diego (dashboard) | ✅ hecho | API: `fight_mode: false` |
| **Web Analytics → `auto_install: false`** (RUM `7de9b348…`) | Claude Code (API `PUT /accounts/{acc}/rum/site_info/{tag}`, autorizado por Diego, reversible) | ✅ hecho | API: `auto_install: false` (antes `true`); `curl` producción: `beacon.min.js` / `cloudflareinsights` **ausente** en home y `/portfolio` |
| **JavaScript Detections → Off** (`bot_management.enable_js`) | Claude Code (API `PUT /zones/{id}/bot_management {enable_js:false}`, autorizado por Diego, reversible) | ✅ hecho | API: `enable_js: false` (antes `true`). `curl` producción (home + `/portfolio`, cache-bust): `challenge-platform` **ausente**, `cloudflareinsights` **ausente**. `email-decode` se mantiene (Email Obfuscation `on`, intencional). |
| Email Obfuscation | — | se deja `on` | El sitio tiene `mailto:` reales (footer + CTA) que se benefician. |

**Verificación completa del Paso 0 (2026-09-01, todo aplicado):**
- API: `fight_mode === false` ✅ · `enable_js === false` ✅ · RUM `auto_install === false` ✅
- `curl -sL` producción (home + `/portfolio/`, cache-bust): `challenge-platform` → **0** ✅ · `cloudflareinsights`/`beacon.min.js` → **0** ✅ · `email-decode` → 1 (intencional).
- TTFB real de origen: 46–60 ms (LH `server-response-time`) / ~230 ms raw curl. No es palanca.

### Medición interina (beacon fuera · Bot Fight Mode off · `enable_js` TODAVÍA ON), 3 corridas

| interim | Perf | LCP | BP |
|---|---:|---:|---:|
| Home | 79 (60/79/82) | 3.7 s | **73** |
| Portfolio | 75 (75/75/77) | 3.5 s | **73** |

Confirmó que **Best Practices no se movía de 73 sin el toggle `enable_js`** (las 3 APIs deprecadas venían todas de `jsd/main.js`).

---

## BASELINE DEFINITIVO DEL PASO 0 (2026-09-01, `enable_js` OFF)

Lighthouse 13.4.1 móvil (`--screenEmulation.mobile`, throttling 4×). **Home: mediana de 6 corridas** (por la alta varianza que introduce F-01). **Portfolio: 3 corridas.** Reportes: `qa-output/lighthouse-baseline/paso0-final/`.

| baseline | Perf | FCP | LCP | TBT | TTI | CLS | **BP** | a11y | SEO |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **Home** | **53** (41–61) | 3.0 s | **8.9 s** (8.7–9.7) | ~450 ms (335–1632) | 9.0 s | 0 | **92** | 96 | 100 |
| **Portfolio** | **84** (60/84/84) | 2.8 s | **2.8 s** | 300 ms | 8.7 s | 0 | **92** | 96 | 100 |

vs. baseline pre-Paso-0 (AUDIT-AS-IS rev.2): Home 75 / LCP ~4.0 s / BP 73 · Portfolio 80 / LCP ~3.4 s / BP 73.

### Lectura del baseline

- **Lo que el Paso 0 logró (estable, verificado):** Best Practices **73 → 92** en ambas páginas (9/9 corridas), deprecaciones **3 → 0**, `challenge-platform` + `beacon` fuera de producción.
- **Portfolio mejoró en limpio:** Perf 80 → **84**, LCP 3.4 → **2.8 s**. Su LCP es el `<h1>` (texto), no la imagen reveal-gated, así que el retiro de terceros se nota directo.
- **Home NO mejoró en Perf/LCP — y ahora es peor y más consistente (~9 s).** Causa: **F-01**. El elemento LCP sigue siendo `div.hero-media > img` con `element render delay` de **1.8–2.8 s** (el gate `opacity:0` + transición). La "buena" LCP de ~3.7 s que se vio en rev.2 y en la interina era el lado afortunado de esa varianza; con 6 corridas seguidas cae de forma consistente al lado malo. **Commit 1 (quitar `data-reveal` del hero) ataca exactamente esto.**
- **Ruido de máquina local:** TBT de home oscila 335–1632 ms entre corridas — es carga de la máquina que corre Lighthouse, no del sitio. El número de Perf de home (53) lleva algo de ese ruido; el rango real útil es "40s–70s, dominado por F-01".
- **Atribución para los commits 1–5:** BP 92 y a11y 96 son el punto de partida firme. Para Perf/LCP de home, el baseline honesto es "F-01-dominado, ~9 s"; el Commit 1 debe llevarlo a < 2.5 s de LCP y ahí recién se puede atribuir el resto.

Impacto conseguido: **Best Practices +19 puntos**, cero APIs deprecadas, dos scripts de tercero menos en cada visita. El techo de Perf de home queda liberado para el Commit 1.

**Reversibilidad:** cada toggle se revierte poniendo el valor a `true` por la misma API (`rum/site_info` `auto_install`, `bot_management` `fight_mode` / `enable_js`).

---

## F-24 — fix de contraste de la chip-filtro activa de `/portfolio` (commit `238333b`, LIVE)

- **Qué:** `src/styles/portfolio.css` — `.chip.is-active` pasa de `background: var(--ember)` (`#FF5C39`) a `background: var(--ember-cta)` (`#BF452B`); `border-color` idem. 1 línea (2 propiedades).
- **Por qué:** `--ember` puro sobre texto `--t1` (`#FAF8FC`) da **2.9:1** — falla WCAG AA (serious). `--ember-cta` da ~4.85:1 (pasa AA), única forma válida de ember sólido con texto blanco per el DS V2.
- **Evidencia:** `test:a11y:astro` fallaba 4/72 tras el build de Commit 1 — todos `/portfolio` (ES/EN × desktop/mobile), regla `color-contrast` sobre `<button class="chip is-active">`. Verificado en producción (CSS servido). Regresión del commit del Capability Showcase Grid (`547d576`), **no** del audit ni del Commit 1.
- **Validación:** `test:a11y:astro` → **72/72 verde**. Lighthouse a11y de `/portfolio` **96 → 100** (mediana de 3+ corridas producción, post-deploy).
- **Flujo Notion:** Inbox `3cf0fe3c…09b7` (Procesado) → Changelog `3cf0fe3c…d914` → Tarea `3cf0fe3c…27a7` (Terminada).

---

## Commit 1 — hero above-the-fold sin gate de JS + preload de imagen LCP (commit `0ec15d4`, LIVE 2026-09-02 01:50Z)

**Alcance:** `src/pages/index.astro` + `src/pages/en/index.astro` (F-01 + F-22 imagen, hero idéntico) + `src/styles/home.css` (F-13, compartido ES/EN).

- **F-01:** quitado `data-reveal` (+ `style="--delay"`) de los 6 elementos del hero (`hero-label`, `hero-h1`, `hero-sub`, `hero-ctas`, `hero-media`, `trust`) en `/` y `/en`. El resto de la página conserva el reveal (41 elementos aún gated en `/`, verificado en producción).
- **F-22 (imagen):** `<link slot="head" rel="preload" as="image" href={heroImgSrc} fetchpriority="high">` en el `<head>` de `/` y `/en`; const `heroImgSrc` comparte la URL entre `<link>` e `<img>`. Verificado en producción: `preload.href === img.src` en ambas.
- **F-13:** `order: -1` quitado de `.hero-media` en el `@media (max-width: 900px)` de `home.css`. Verificado: `order:-1` ausente del CSS compilado servido.

### Validación local (pre-push)
`astro build` exit 0 · `verify-metrics.cjs` exit 0 (12 warnings pre-existentes) · `npm test` 117/117 · `npm run lint` exit 0 · `test:a11y:astro` **72/72** (con F-24) · Chrome real 1440px (`/` y `/en`): hero renderiza completo con `document.visibilityState:"hidden"` (la condición exacta que lo dejaba en blanco antes) — `heroH1` opacity 1, sin `data-reveal`, imagen LCP pintada.

### Resultado en producción (Lighthouse 13.4.1 móvil)

**Ruido de máquina significativo** (SILVIA lo pidió anotado): la máquina que corre Lighthouse estuvo cargada de forma variable — TBT osciló 356–910 ms entre corridas de la misma URL, y el score de portfolio saltó 42/90/90/86/81/88. Se reporta la mediana de todas las corridas y, aparte, la mediana del subconjunto "máquina libre" (TBT ≤ 450 ms), que es la señal limpia.

| Home móvil | BEFORE (paso 0, n=6) | AFTER todas (n=8) | AFTER máquina libre (n=3) |
|---|---:|---:|---:|
| Performance | 53 | 60 | **74** |
| **`elementRenderDelay` (hero img)** | **2,390 ms** (1,807–2,782) | 1,106 ms | **379 ms** (159 / 338 / 379) |
| **LCP** | **8,917 ms** | 6,542 ms | **3,880 ms** (3.3–3.9 s) |
| FCP | 3,012 ms | 3,009 ms | 2,954 ms |
| CLS | 0 | 0 | 0 |
| BP / a11y / SEO | 92 / 96 / 100 | 92 / 96 / 100 | 92 / 96 / 100 |

| Portfolio móvil | BEFORE (n=3) | AFTER (n=6) |
|---|---:|---:|
| Performance | 84 | **87** |
| LCP (elem = `<h1>` texto) | 2,829 ms | 2,780 ms |
| **a11y** | 96 | **100** (F-24) |
| BP / SEO | 92 / 100 | 92 / 100 |

### Veredicto contra los criterios de SILVIA

- ✅ **`elementRenderDelay` colapsa:** 2,390 → **379 ms** (máquina libre; corridas individuales 159 / 338 / 379). El gate del reveal era el 100% de esos ~2.4 s: sin `data-reveal` la imagen (ya descargada a ~0.5 s, con `fetchpriority=high`) pinta casi de inmediato. Justo en el borde de "~0–300 ms" — una corrida a 159, otra a 338.
- ✅ **LCP home mediana claramente < 8.9 s:** 6.5 s con todas las corridas; **3.9 s** con la máquina libre (−4.9 s).
- ✅ **Sin regresiones:** FCP igual (3.01 s), CLS 0, a11y 96 (portfolio **96 → 100**), BP 92, SEO 100.
- ⚠️ **Meta final LCP < 2.5 s:** todavía no. El techo restante es render-blocking (`fonts.googleapis.com` CSS, ~1.1 s de bloqueo — `render-blocking-insight` score 0) + saturación de main-thread por terceros (TTI ~9 s). Eso es **F-07 = Commit 2** y **F-05/F-06 = Commits 3-4**. Commit 1 hizo lo suyo: `lcp-discovery-insight` pasa (fetchpriority + discoverable + no-lazy, los 3 verdes) y el gate del reveal ya no existe.

### Residual abierto (SILVIA)

Verificación **visual** real a 390 px post-deploy: Claude-in-Chrome no puede fijar un viewport <500 px en este entorno. F-13 verificado mecánicamente (sin `order:-1` en el CSS servido → móvil 1 columna + orden del DOM = H1 primero). Pendiente confirmación visual por Diego/SILVIA en un dispositivo o navegador real.

### Flujo Notion
Inbox `3cf0fe3c…8e…2455` (Procesado) → Changelog `3cf0fe3c…8167…253e` → Tarea `3cf0fe3c…8123…18ac` (Terminada).

Reportes crudos: `qa-output/lighthouse-baseline/commit1/` (home 1–8, portfolio 1–6).

---

## Commit 2 — self-host de fuentes Plus Jakarta Sans + DM Mono (F-07 + F-22 fuente)

**Alcance:** `src/styles/fonts.css` (nuevo) + `public/fonts/` (12 woff2) + `src/layouts/BaseLayout.astro` + `public/_headers` + `src/styles/variables.css`. Borradas las V1 sin uso (`public/assets/fonts/`).

- **F-07:** `@font-face` self-hosted, subset latino (bloques `latin` + `latin-ext`; DM Mono solo `latin`), `font-display: swap`, `unicode-range` por bloque. Se elimina el `<link>` a `fonts.googleapis.com` + los 2 `preconnect`.
- **F-22 (fuente):** `<link rel="preload" as="font" crossorigin>` del peso crítico (Plus Jakarta Sans 400, el workhorse del body).
- `_headers`: `font-src 'self'` (sin `gstatic`), `style-src` sin `fonts.googleapis`, `Cache-Control immutable` para `/fonts/*`.
- **Fallback con métricas ajustadas** (commit `26f29a2`, condición CLS de SILVIA): `@font-face` `'Plus Jakarta Sans Fallback'` → `local('Arial')` y `'DM Mono Fallback'` → `local('Courier New')` con `size-adjust`/`ascent-override`/`descent-override` (calculados con `@capsizecss/metrics` 4.2.0), añadidos a `--sans`/`--mono` antes de `system-ui`.

### Commits
| commit | contenido | estado |
|---|---|---|
| `42801b5` | self-host + preload + `_headers` + borrado V1 | **LIVE** (deploy Cloudflare `42801b5`, todas las etapas success, 02:42:10Z) |
| `26f29a2` | fallback con métricas ajustadas (fix CLS) | **LIVE** (dentro de `8f2e54f`, deploy Cloudflare `730227b6`, todas las etapas success, 03:49:05Z) |
| `_2b_` | `preloadFont300` en `BaseLayout` (default off) + activado en `/portfolio` ES/EN — cierra el CLS 0.0179 residual | ver § Commit 2b abajo |

### Resultado en producción (`42801b5`, Lighthouse 13.4.1 móvil, regla del canario: TBT ≤ 500 ms)

| | Home before → after | Portfolio before → after |
|---|---:|---:|
| FCP | 2,991 → **2,118 ms** (−0.87 s) | 2,599 → **1,763 ms** (−0.84 s) |
| LCP | 6,488 → **3,145 ms** (−3.3 s) | 2,780 → **1,763 ms** (−1.0 s) |
| Performance | 60 → 85 | 89 → 91 |
| CLS | 0 → 0.0000–0.0002 | 0.035 → **0.018** |
| a11y / BP / SEO | 96 / 92 / 100 | 100 / 92 / 100 |
| `fonts.googleapis` en render-blocking | **fuera** ✅ | **fuera** ✅ |

Reportes crudos: `qa-output/lighthouse-baseline/commit2/`.

### Veredicto contra los criterios de SILVIA

- ✅ **`fonts.googleapis.com` fuera del `render-blocking-insight`** — en las 10 corridas válidas.
- ✅ **FCP −0.5 a −1 s:** home −0.87 s, portfolio −0.84 s.
- ✅ **LCP portfolio (h1 texto) hacia < 2.5 s:** **1.76 s** — logrado.
- ✅ **home LCP neutro o mejor:** 6.5 s → 3.1 s (mucho mejor).
- ✅ **Sin regresiones:** a11y 96 / 100, BP 92, SEO 100.
- ⚠️ **CLS 0 en todas las corridas válidas:** home sí (~0.0002, despreciable). Portfolio quedó en **0.018** (bajó de 0.035 con el preload). Culpable confirmado (`cls-culprits-insight`): la sección `.stats` de `/portfolio` reflow-ea al hacer swap Plus Jakarta Sans. **El fix (`26f29a2`, fallback con métricas ajustadas) está hecho y validado localmente, pendiente de push/deploy** — al desplegarse hay que re-correr el canario (5 válidas/página) y confirmar CLS portfolio → 0.

### Validación local (pre-push, `26f29a2` incluido)
`astro build` exit 0 · `verify-metrics` exit 0 · `npm test` 117/117 · `npm run lint` exit 0 · `test:a11y:astro` **parcial** — la suite completa (72 tests) fue **matada 3 veces por agotamiento de recursos de la máquina** (67 procesos node/chrome huérfanos, 0 MB disponibles; limpiados). Corrida **dirigida** de las 4 páginas más afectadas por el cambio de fuente (home + portfolio, ES + EN, desktop + mobile) = **8/8 verde** en 45 s con `--workers=1`. Lighthouse a11y (mismo motor axe): 96 home / 100 portfolio, sin cambio. El delta (fuentes self-hosted + overrides de métrica) no toca color, DOM, ARIA ni semántica → superficie a11y nula. **Pendiente:** re-correr la suite completa cuando la máquina se recupere.
- Chrome real 1440px (local): fuentes renderizan, fallbacks `Plus Jakarta Sans Fallback` / `DM Mono Fallback` registrados, CLS local 0.
- HTML generado `/` y `/en`: sin `<link>` a Google Fonts, sin `preconnect`, con el `preload` propio; `@font-face` en CSS bundleado same-origin.
- `_headers` servido en producción: `font-src 'self'`, woff2 con `Content-Type: font/woff2` + `Cache-Control: public, max-age=31536000, immutable` + `Access-Control-Allow-Origin: *`.

### Re-canario post-deploy (`8f2e54f`, incluye `26f29a2` — Lighthouse 13.4.1 móvil, regla TBT ≤ 500 ms)

Deploy verificado: Cloudflare Pages `730227b6`, todas las etapas `success` (build 03:47→03:49Z). Producción sirve el fallback con métricas ajustadas (`local(Arial)` + `size-adjust:104.979%` en `BaseLayout.*.css`), sin `fonts.googleapis`, con el `preload` de PJS 400.

| | Home (mediana de 4 válidas / 8) | Portfolio (mediana de 5 válidas / 8) |
|---|---:|---:|
| FCP | 1,839 ms | 1,883 ms |
| LCP | 2,392 ms | 1,943 ms |
| TBT | 494 ms | 422 ms |
| CLS | **0** (0 en las 8 corridas) | **0.0179** (7 de 8 corridas; una en 0) |
| Performance | 85 | 85 |
| a11y / BP / SEO | 96 / 92 / 100 | 100 / 92 / 100 |

- ✅ **LCP < 2.5 s en ambas páginas** — home 2.39 s (desde 6.5 s), portfolio 1.94 s.
- ✅ **CLS home = 0** en las 8 corridas.
- ⚠️ **CLS portfolio = 0.0179**, no 0. El fallback con métricas ajustadas bajó de 0.035 (baseline) → 0.018 (preload) → 0.0179 (fix). Neto: mejora, "good" por Web Vitals (5.6× bajo el umbral 0.1), **no cuesta puntos de Lighthouse** (sub-score CLS ≈ 100). Culpable exacto (`layout-shifts` audit): `<section class="stats">` de `/portfolio` se desplaza cuando carga `plus-jakarta-sans-300.woff2` — el único elemento peso 300 arriba de `.stats` es `.hero h1` (titular del hero de `/portfolio`, `clamp(2.2rem, 4.4vw, 3.6rem)`). El override de fallback es único por familia y no cierra la diferencia de wrapping del peso 300 a tamaño display.
- Reportes crudos: `qa-output/lighthouse-baseline/commit2-final/`.

SILVIA decide: cerrar el CLS residual con un commit propio (2b). Ver abajo.

---

## Commit 2b — `preloadFont300` por página, preload de PJS 300 en `/portfolio` ES/EN

**Alcance (exacto, SILVIA):** prop `preloadFont300?: boolean` en `src/layouts/BaseLayout.astro` (default `false`); emite `<link rel="preload" href="/fonts/plus-jakarta-sans-300.woff2" as="font" crossorigin>` solo cuando se activa. Activado en `src/pages/portfolio.astro` y `src/pages/en/portfolio.astro`. **Home NO lo recibe** (su hero es peso 500). Ninguna página de caso lo recibe (fuera de alcance).

- Motivo: el `<h1>` del hero de `/portfolio` es peso 300 y su swap tardío reflow-ea `.stats` (CLS 0.0179 en el re-canario de `8f2e54f`). El override de fallback por familia no cierra esa diferencia de wrapping a tamaño display; el preload elimina el swap.
- `plus-jakarta-sans-300.woff2`: 27 KB, subset base latin (ya existía en `public/fonts/`, no se regeneró). El titular del hero solo usa ASCII + acentos españoles (U+0000–00FF) → no hace falta el bloque `-ext`.

### Validación local
- `astro build` exit 0 (63 páginas; 2º intento — el 1º abortó por timeout de la API de Notion, no por el cambio). HTML generado: `/portfolio` y `/en/portfolio` con ambos preloads (400 + 300); `/` (home) y páginas de caso solo con el 400.
- `node tools/verify-metrics.cjs` exit 0.
- **`test:a11y:astro` completa: 72/72 passed** (3.8 min, `--workers=1`). Cierra el pendiente heredado del bloqueo de recursos del Commit 2. (Gotcha: el `astro preview` de este repo corre como daemon desacoplado → hay que arrancarlo a mano antes de Playwright, que entonces lo reusa; el `webServer` de `playwright.astro.config.ts` no lo puede manejar solo.)

### Commits
| commit | contenido | estado |
|---|---|---|
| `f0b3f59` | `preloadFont300` + activación en `/portfolio` ES/EN | **LIVE** (deploy Cloudflare `57a63c2e`, todas las etapas success, 04:21:55Z) |

### Re-canario post-deploy (`f0b3f59` — Lighthouse 13.4.1 móvil, TBT ≤ 500 ms, 5 válidas/página)

| | Home (mediana 5 válidas / 10) | Portfolio (mediana 5 válidas / 7) |
|---|---:|---:|
| FCP | 2,036 ms | 1,940 ms |
| LCP | 2,487 ms | 2,049 ms |
| TBT | 487 ms | 391 ms |
| CLS | **0** (0 en las 5) | **0.0179** (0 en 2 de 5; 0.0179 en 3) |
| Performance | 83 | 87 |
| a11y | 96 | 100 |

- ✅ **CLS home = 0** en todas las corridas válidas.
- ✅ **FCP/LCP sin regresión real** vs. `8f2e54f` — home 2.04/2.49 s vs. 1.84/2.39 s, portfolio 1.94/2.05 s vs. 1.88/1.94 s: deltas de ~100-150 ms dentro del ruido de la máquina (más cargada en esta corrida; corridas limpias: home-10 FCP 1.72 s / LCP 2.17 s, portfolio-2 FCP 1.94 s / LCP 2.00 s perf 90).
- ⚠️ **CLS portfolio: sigue en 0.0179 de mediana** (0 en 2 de 5 corridas). El preload del 300 **sí removió la causa de font-swap del 300** — el audit `layout-shifts` ya no atribuye ninguna causa (antes señalaba explícitamente `plus-jakarta-sans-300.woff2`). Queda un shift residual de exactamente 0.0179 en `.stats`, sin causa que Lighthouse pueda anclar a un recurso, timing-dependiente (desaparece cuando el paint ocurre tras asentarse todos los pesos). Es "good" por Web Vitals (5.6× bajo 0.1) y **no cuesta puntos de Lighthouse** (sub-score CLS ≈ 100).
- Reportes crudos: `qa-output/lighthouse-baseline/commit2b/`.

**Veredicto:** el preload del 300 es un cierre parcial — mejora el mecanismo (LCP del hero de `/portfolio` pinta en la fuente real sin flash; una causa de CLS eliminada) pero no lleva la métrica agregada a ≤ 0.001. Llegar a 0 garantizado exigiría `font-display: optional` en los pesos de `/portfolio` (el hero mostraría el fallback Arial ya calibrado en conexiones lentas) o preload de los 4 pesos + itálica. **Decisión pendiente de Diego/SILVIA:** aceptar 0.0179 y cerrar, o autorizar un 2c con `font-display: optional`.

### Cierre Commit 2 (los 4 puntos de SILVIA)
1. Push + deploy verificado — ✅ **hecho** (`f0b3f59` → deploy `57a63c2e`, scoping verificado en prod: home 0, portfolio 1, en/portfolio 1)
2. Re-canario 5 válidas/página, CLS home = 0 ✅ / CLS portfolio ≤ 0.001 ⚠️ **no alcanzado** (0.0179, decisión pendiente arriba) / FCP/LCP sin empeorar ✅
3. `test:a11y:astro` 72/72 — ✅ **hecho** (local, pre-push, 3.8 min)
4. CHANGELOG-AUDIT § Commit 2 cerrado + flujo Notion + tarea a Terminada — _pendiente de la decisión del punto 2_

### Residual abierto (post Commit 2b)
- Verificación visual real a 390 px (residual heredado del Commit 1).

### Flujo Notion
Inbox `_pendiente_` → Changelog `_pendiente_` → Tarea `_pendiente_`.

---

## Commit 3 — a11y: skip-link, color-scheme, theme-color, scroll-margin, burger (F-14 + F-09 + F-15 + F-17) · PENDIENTE

## Commit 4 — testimonios propios, retirar embed de Senja (F-05) · PENDIENTE (condición previa: cobertura vs. Senja)

## Commit 5 — redirects 301, cache headers, carga única de GTM, dims de logos (F-19 + F-11 + F-18 + F-12) · PENDIENTE
