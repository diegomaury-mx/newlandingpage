# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANTE:** Toda implementación, documentación o contribución debe seguir el esquema definido en `.claude/esquema` ubicado en la raíz del repositorio. Consulta este archivo antes de crear o modificar cualquier sección, archivo o estructura.

## Proyecto

Portafolio profesional de Diego Maury — sitio estático desplegado en GitHub Pages.

URL: `https://diegomaury.mx` — **LIVE desde 2026-05-13**

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks) — **así es el sitio LIVE hoy**
- Sin build system en producción. **Ojo:** hay una decisión de arquitectura registrada en `CHANGELOG.md` (v0.1.0, 2026-06-27) de migrar a **Astro** en sprints futuros — ver "Arquitectura futura — Sprint 0.5" más abajo. Mientras Sprint 1 no se apruebe e implemente, esta decisión NO afecta al sitio LIVE.
- Despliegue: GitHub Pages sirviendo desde **`master` / raíz** (CNAME `diegomaury.mx`). Cada push a `master` redespliega automáticamente. No hay rama `gh-pages` ni worktree (consolidado el 2026-06-15).

## Estructura del repositorio

El sitio vive en la **raíz de `master`** (fuente única de verdad y deploy source). No hay worktree.

```
/                               # ← raíz de master = sitio (deploy source)
├── index.html                  # Página principal v2 — LIVE
├── index-canonico.html         # PREVIEW aislado — NO live, ver nota abajo
├── robots.txt / sitemap.xml    # SEO — LIVE
├── CNAME                       # diegomaury.mx
├── .nojekyll                   # deshabilita el pipeline Jekyll de GitHub Pages
├── llms.txt / llms-full.txt    # Contexto para LLMs — LIVE
├── README.md                   # Resumen público del repo (stack, estructura, deploy)
├── CHANGELOG.md                # Historial de decisiones de arquitectura y sprints
├── GOVERNANCE.md               # Reglas de contribución y decisión del proyecto
├── assets/
│   ├── css/styles.css          # Tokens DS v3 + todos los componentes
│   ├── css/colors_and_type.css # Token file del DS
│   ├── fonts/                  # Satoshi Variable + JetBrains Mono (local)
│   ├── fonts-v2/                # Montserrat + Bitter + Space Mono (v2)
│   ├── js/main.js              # Nav activa + scroll reveal (IntersectionObserver)
│   └── img/                    # isotipodm.svg (bg-pattern), isotipo, logos, hexagon patterns
├── render_card.html            # Tarjeta social 1080×1080 para exportar (10 variantes)
├── export_cards.js             # Script Puppeteer: `node export_cards.js` → exported_cards/
├── exported_cards/             # PNGs generados card-01..10
├── cases/
│   ├── heineken.html           # Caso +600% — LIVE
│   ├── innovation-systems.html # 3 subcasos FlipHouse/HackSureste/CAVA — LIVE
│   ├── redux-incmty.html       # REDUX + INCmty Challenges — LIVE
│   └── fliphouse.html          # FlipHouse RevOps & AI — LIVE
├── portfolio/                  # Galería por eras — LIVE
│   ├── index.html
│   ├── portfolio.css
│   └── portfolio.js
├── cv/
│   ├── diego-maury-cv.pdf      # CV 2026 — LIVE
│   ├── diego-maury-pmo.html    # Variante CV enfocada en PMO (fuente HTML)
│   ├── diego-maury-pmo.pdf     # PDF generado desde diego-maury-pmo.html
│   └── gen-pdf.js              # Script que genera el PDF desde el HTML
├── backups/                    # index-v1-backup.html, index-v2.html (respaldos)
├── docs/
│   ├── superpowers/            # specs/ y plans/ de diseño (incluye plan de index-canonico.html)
│   └── platform/                # conventions.md, seo-model.md — spec de la futura plataforma Astro (ver sección abajo)
└── src/
    ├── content/                 # Astro Content Collections — Sprint 0.5, SIN implementar aún
    │   ├── config.ts             # Schemas Zod: cases, projects, playbooks, insights, services
    │   └── cases|projects|playbooks|insights|services/README.md
    └── services/pgPool.js       # Backend Phase 2 (chatbot RAG, pendiente)
```

> **Carpetas locales fuera de git (ver `.gitignore`):** `_ds_import/` (bundle de handoff de Claude Design) y `.claude-design/lab/` (variantes de diseño exploradas, `variant-a..f.html`) existen en el filesystem local pero **no están versionadas ni se despliegan**. `.playwright-mcp/` y `.superpowers/` tampoco. No tratarlas como fuente de verdad del sitio LIVE.

> **Analítica:** todas las páginas del sitio llevan Google Tag Manager (`GTM-NHT5827J`) y Microsoft Clarity (`x7ns7c22xi`) en el `<head>`.

## Comandos de desarrollo

```bash
# Servidor local (desde la raíz del repo)
python -m http.server 8080
# o: npx serve .
```

```bash
# Despliegue: simplemente push a master. GitHub Pages reconstruye solo.
git add -A && git commit -m "..." && git push origin master
```

```bash
# Exportar tarjetas sociales (desde la raíz)
node export_cards.js   # requiere puppeteer; genera exported_cards/card-01..10.png
```

## index-canonico.html — PREVIEW aislado (no confundir con index.html LIVE)

`index-canonico.html` es un archivo autocontenido (HTML+CSS+JS inline) en la raíz, creado según el plan `docs/superpowers/plans/2026-06-16-landing-canonica-bento.md` para probar un rediseño visual "Bento + Violeta" fiel a la maqueta canónica de Notion (SSOT: id `e5f9bb1b96224857a648b0212c3e9822`).

- **No es LIVE:** lleva `noindex,nofollow` y analítica desactivada en el `<head>`.
- **No está enlazado** desde ninguna página del sitio ni desde el sitemap.
- **Aislamiento total:** no modifica `assets/css/styles.css` ni `assets/js/main.js`; solo reutiliza fuentes locales vía `@font-face` e `isotipodm.svg`.
- Se sirve y compara localmente: `python -m http.server 8080` → `localhost:8080/index-canonico.html`.
- Regla del plan: **no inventar datos** — métricas y hechos deben venir del SSOT en Notion; si el SSOT no cubre algo, se marca y se confirma con Diego.

## Design system — v3 "Violeta Protagonista"

Tokens implementados en `assets/css/styles.css` (`:root`) y `assets/css/colors_and_type.css`. El folder externo del Design System fue eliminado el 2026-06-15; se migrará a otra herramienta (por definir).

### Paleta de color (tokens CSS en `:root`)

| Token | Hex | Uso |
|-------|-----|-----|
| `--dm-amethyst` | `#7C3FBE` | CTA primario, isotipo, identidad |
| `--dm-amethyst-600` | `#5E2A95` | Hover, depth |
| `--dm-catalyst` | `#4B2672` | Gradientes, bg bloques |
| `--dm-catalyst-700` | `#2E1547` | Hero bg, Contacto, Footer |
| `--dm-catalyst-900` | `#120D1A` | Hero backdrop, fondos oscuros |
| `--dm-ember` | `#FF5C39` | Highlights, tagline, accent border (NO CTA primario) |
| `--dm-spark` | `#E6B800` | Solo en KPIs y métricas de impacto |
| `--dm-quantum` | `#246BFD` | Links funcionales, status |
| `--dm-ink` | `#0F0A1A` | Secciones interiores, body bg |
| `--dm-bone` | `#F5F5F7` | Texto sobre oscuro |

Gradiente tricolor (firma): `--dm-tricolor` = Amethyst → Catalyst → Ember

### Tipografía

| Familia | Carga | Uso |
|---------|-------|-----|
| Satoshi Variable | Local `assets/fonts/` | Headlines, sección títulos, números |
| Inter | Google Fonts | Body, descripciones |
| JetBrains Mono | Google Fonts (upright) + Local italic | Labels, tags, métricas, nav links |

### Isotipo bg-pattern

El SVG `isotipodm.svg` se usa como fondo decorativo en todas las secciones via `.bg-pattern::before` con `background-image` CSS. Opacidad 0.022 en Ink, 0.03 en Catalyst. No modificar este patrón — es parte de la identidad visual.

## Secciones (orden en index.html)

1. **Hero** (fondo Catalyst-700) — tag Ember, headline Satoshi 800, sub, 2 CTAs, banda de 3 métricas
2. **Selected Work** (Ink) — 3 filas editoriales con número Spark, nombre, meta, métrica
3. **Trust Strip** (Ink) — logos de marcas: HEINEKEN, Tec, INCmty, FEMSA, HackSureste
4. **Testimonials** (Ink) — embed de Senja (pendiente de activar)
5. **Servicios** (Ink) — 3 tarjetas en grid con tag, nombre, entregables, tiempo
6. **About** (Ink) — 2 cols: bio texto izquierda, herramientas/chips + cómo trabajo derecha
7. **Experiencia** (Ink) — 4 roles en lista vertical: meta izquierda 220px, contenido derecha
8. **Contacto** (Catalyst-700) — 3 canales: calendario, email, LinkedIn

## Reglas de diseño

- **Idioma: español únicamente** — no hay toggle de idioma
- **Mobile-first:** breakpoints 375px, 768px, 1280px
- **Performance:** JS < 80 KB gzipped, CSS < 15 KB
- Animaciones solo en propiedades compositor-safe: `transform`, `opacity`
- Respetar `prefers-reduced-motion` (el JS de scroll reveal lo omite si está activo)

## Plantilla de caso de estudio

Estructura fija: Contexto → Problema → Objetivo (métrica+timeframe) → Mi rol → Acciones (3–5 bullets) → Resultados (métricas normalizadas) → Evidencia → Aprendizajes

Formato de cada logro: **Verbo + qué + cómo + impacto + timeframe**

## Estado del contenido

### Implementado (LIVE)
- `index.html` — **v3 "Ember on Ink" (Variante F canónica)** activo desde 2026-06-22
  - DS v2: Plus Jakarta Sans + DM Mono, bg `#0A0612`, acento único `--ember: #FF5C39`
  - Secciones S1-S9: Hero, Tesis/Traductor, Patrón Spine, Selected Work (H1/H2/H3 S-T-A-R), IP Propia, Evidencia Forense, Servicios, AI-Native, CTA Final
  - JS inline: scroll reveal (`data-reveal`/`is-visible`), contadores animados, nav activa, burger mobile
  - GTM-NHT5827J + Clarity x7ns7c22xi preservados
  - **Invariante DS:** el index.html usa tokens DS v2 inline; los casos y portfolio usan DS v3 de `assets/css/styles.css`
  - `backups/index-v2.html` — respaldo del diseño anterior "Deep Tech & Friction"
- `llms.txt` — live en raíz, visible en `diegomaury.mx/llms.txt`
- GTM-NHT5827J — instalado en `<head>` y `<body>` de index.html
- `cases/heineken.html`, `cases/innovation-systems.html`, `cases/redux-incmty.html` — LIVE (navegación desde v1; no enlazados desde v2 aún)
- `portfolio/index.html` — galería por eras — LIVE
- `cv/diego-maury-cv.pdf` — CV 2026
- Dominio `diegomaury.mx` con HTTPS activo

### Portfolio Upgrade v2 — Phase 1 COMPLETA (LIVE 2026-06-14)
Plan completo en Notion: "Plan de Acción — Portfolio Upgrade v2 (2026-06-13)"

Phase 1 (LIVE):
- Sección "Trinchera" — post-mortem HEINEKEN Green Challenge (3 fallos documentados); 2do caso "en preparación"
- Sección "Fraccional" — 3 modelos (Retainer mensual, Proyecto acotado, Asesoría estratégica) **sin rangos de precio**
- Tarjetas RODI — formato financiero en tarjetas de proyectos
- `llms.txt` y `llms-full.txt` publicados en raíz

Pendiente Phase 1:
- 2do post-mortem en Trinchera (por definir)

Pendiente Phase 2 (semana siguiente):
- Railway backend + Supabase pgvector + Claude API → chatbot RAG
- Widget chatbot en index.html

## Arquitectura futura — Sprint 0.5 (Astro, en definición, SIN implementar)

Fuente: `CHANGELOG.md` [v0.1.0] — 2026-06-27. Estas son decisiones de producto ya aprobadas y documentadas, pero **ningún código de Astro está activo todavía**. No confundir con el estado LIVE descrito arriba.

- **Framework decidido:** Astro (Islands Architecture, output HTML estático, MDX, compatible con GitHub Pages, zero-JS por defecto).
- **Content strategy:** Astro Content Collections — el contenido vivirá en `src/content/`, nunca dentro de los archivos de página. Los schemas Zod ya existen en `src/content/config.ts` (colecciones: `cases`, `projects`, `playbooks`, `insights`, `services`), cada una con su `README.md`.
- **Deploy futuro:** GitHub Pages seguirá sirviendo desde `master`, pero GitHub Actions correrá `astro build` → `/dist` (pendiente, Sprint 1).
- **Design System:** DS v2 (`_ds_import/`, no versionado) + DS v3 (`assets/css/`) se consolidarán en un único sistema de tokens canónico en Sprint 2.
- **Documentación de convenciones ya escrita** (vinculante desde Sprint 1, sin efecto hoy): `docs/platform/conventions.md` (naming, estructura de carpetas Astro, convención MDX/frontmatter, convención de assets) y `docs/platform/seo-model.md` (metadata, Open Graph, JSON-LD, sitemap vía `@astrojs/sitemap`).
- **Roles del proceso:** Diego Maury (Product Owner), ChatGPT (Product Strategist & UX Director), Silvia/Notion (Product Manager), Claude Code (Lead Software Engineer).
- **Roadmap (según CHANGELOG):** Sprint 0 (Product Foundation, pendiente de PRD) → Sprint 0.5 (Domain & Content Architecture, **en progreso** — deliverables ya completados: CHANGELOG.md, schemas, docs de convenciones y SEO) → Sprint 1 (Astro Setup, bloqueado hasta aprobar Sprint 0) → Sprint 2 (Design System) → Sprint 3 (Home) → Sprint 4 (Páginas internas) → Sprint 5 (Optimización, incluye implementación real del modelo SEO).
- **Regla operativa:** cualquier trabajo de implementación Astro requiere que Sprint 0 (PRD, IA, sitemap definitivo, wireframes) esté aprobado por Diego primero. No adelantar Sprint 1 sin esa aprobación.

### Nota de diseño: nav scrollToSection
La función de scroll se llama `scrollToSection` (no `scrollTo` — conflicto con `window.scrollTo`).

## Idioma de respuestas

Responder siempre en español.
