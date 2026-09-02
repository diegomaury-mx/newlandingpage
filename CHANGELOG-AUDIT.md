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

## F-24 — fix de contraste de la chip-filtro activa de `/portfolio` (commit mínimo previo al Commit 1)

- **Qué:** `src/styles/portfolio.css` — `.chip.is-active` pasa de `background: var(--ember)` (`#FF5C39`) a `background: var(--ember-cta)` (`#BF452B`); `border-color` idem.
- **Por qué:** `--ember` puro sobre texto `--t1` (`#FAF8FC`) da **2.9:1** — falla WCAG AA (serious). `--ember-cta` da ~4.85:1 (pasa AA), y es la única forma válida de ember sólido con texto blanco per el DS V2.
- **Evidencia:** `test:a11y:astro` fallaba 4/72 tras el build de Commit 1 — todos `/portfolio` (ES/EN × desktop/mobile), regla `color-contrast` sobre `<button class="chip is-active">`. Verificado presente en producción (`curl` + inspección del CSS servido). Regresión del commit del Capability Showcase Grid (`547d576`, 2026-09-01), **no** del audit ni del Commit 1.
- **Alcance:** 1 línea de CSS. No toca `.chip` inactiva, `:hover` ni `:focus-visible`.
- **Validación:** `test:a11y:astro` → **72/72 verde** (ver Commit 1).
- **Impacto esperado:** elimina el único fallo `serious` de a11y de `/portfolio`; Lighthouse a11y de `/portfolio` se mantiene o sube de 96.
- **Flujo Notion:** entrada propia (Inbox → Changelog → Tarea).

---

## Commit 1 — hero above-the-fold sin gate de JS + preloads (F-01 + F-22 imagen + F-13) · PENDIENTE

**Alcance:** `src/pages/index.astro` + `src/pages/en/index.astro` (F-01 + F-22 imagen, hero idéntico en ambas) + `src/styles/home.css` (F-13, compartido ES/EN).

- **F-01:** quitado `data-reveal` (+ `style="--delay"`) de los 6 elementos del hero (`hero-label`, `hero-h1`, `hero-sub`, `hero-ctas`, `hero-media`, `trust`) en ambas páginas. El resto de la página conserva el reveal (41 elementos aún gated en `/`).
- **F-22 (imagen):** `<link slot="head" rel="preload" as="image" href={heroImgSrc} fetchpriority="high">` en el `<head>` de `/` y `/en`; const `heroImgSrc` resuelve la URL una sola vez, compartida por el `<link>` y el `<img>`.
- **F-13:** `order: -1` quitado de `.hero-media` en el `@media (max-width: 900px)` de `home.css` → en móvil el H1 encabeza el viewport, la imagen va después.

Objetivo: `elementRenderDelay` del hero ~0–300 ms · LCP móvil home mediana claramente < 8.9 s (meta final < 2.5 s) · sin regresiones (FCP ≥, CLS 0, a11y 96, BP ≥ 92, SEO 100).

_(medianas de producción se llenan tras el deploy)_

---

## Commit 2 — self-host de fuentes (F-07 + F-22 fuente) · PENDIENTE

## Commit 3 — a11y: skip-link, color-scheme, theme-color, scroll-margin, burger (F-14 + F-09 + F-15 + F-17) · PENDIENTE

## Commit 4 — testimonios propios, retirar embed de Senja (F-05) · PENDIENTE (condición previa: cobertura vs. Senja)

## Commit 5 — redirects 301, cache headers, carga única de GTM, dims de logos (F-19 + F-11 + F-18 + F-12) · PENDIENTE
