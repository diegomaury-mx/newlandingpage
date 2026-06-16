# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANTE:** Toda implementación, documentación o contribución debe seguir el esquema definido en `.claude/esquema` ubicado en la raíz del repositorio. Consulta este archivo antes de crear o modificar cualquier sección, archivo o estructura.

## Proyecto

Portafolio profesional de Diego Maury — sitio estático desplegado en GitHub Pages.

URL: `https://diegomaury.mx` — **LIVE desde 2026-05-13**

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- Sin build system; si se añade uno, usar Vite
- Despliegue: GitHub Pages (rama `gh-pages` o carpeta `/docs` en `main`)

## Estructura del repositorio

El código vive en el worktree `.worktrees/build/` (desplegado vía `gh-pages`). La rama `master` contiene el mismo código más docs, specs y configuración.

```
.worktrees/build/               # ← AQUÍ vive el código (deploy source)
├── index.html                  # Página principal (8 secciones) — LIVE
├── robots.txt                  # SEO — LIVE
├── CNAME                       # diegomaury.mx
├── assets/
│   ├── css/styles.css          # Tokens DS v3 + todos los componentes
│   ├── css/colors_and_type.css # Copia del token file del DS (fuente de verdad en DS folder)
│   ├── fonts/                  # Satoshi Variable + JetBrains Mono (local)
│   ├── js/main.js              # Nav activa + scroll reveal (IntersectionObserver)
│   └── img/                    # isotipodm.svg (bg-pattern), isotipo.svg, logos, hexagon patterns
├── render_card.html            # Tarjeta social 1080×1080 para exportar (10 variantes)
├── export_cards.js             # Script Puppeteer: `node export_cards.js` → exported_cards/
├── cases/
│   ├── heineken.html           # Caso +600% — LIVE
│   ├── innovation-systems.html # 3 subcasos FlipHouse/HackSureste/CAVA — LIVE
│   └── redux-incmty.html       # REDUX + INCmty Challenges — LIVE
├── portfolio/                  # Galería por eras — LIVE (2026-05-18)
│   ├── index.html
│   ├── portfolio.css
│   └── portfolio.js
└── cv/
    └── diego-maury-cv.pdf      # CV 2026 — LIVE

docs/superpowers/specs/         # Specs de diseño
docs/superpowers/plans/         # Planes de implementación
```

**Design System de referencia (fuente de verdad):**
`Diego Maury Design System (1)/` en la raíz del repo
Contiene: `README.md`, `colors_and_type.css`, `assets/`, `fonts/`, `ui_kits/`

## Comandos de desarrollo

```bash
# Desde .worktrees/build/
cd .worktrees/build
python -m http.server 8080
# o: npx serve .
```

```bash
# Despliegue (desde raíz del repo)
npx gh-pages -d .worktrees/build
```

```bash
# Exportar tarjetas sociales (desde .worktrees/build/)
node export_cards.js   # requiere puppeteer; genera exported_cards/card-01..10.png
```

## Design system — v3 "Violeta Protagonista"

Fuente de verdad: `Diego Maury Design System (1)/README.md` y `colors_and_type.css`.

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
- `index.html` — **v2 "Deep Tech & Friction"** activo desde 2026-06-13
  - Fuentes: Montserrat Variable + Bitter Variable + Space Mono (`assets/fonts-v2/`)
  - Secciones: NAV, HERO, QUÉ HAGO, PROYECTOS, TRINCHERA, TESTIMONIOS, ABOUT, FRACCIONAL, CONTACTO, FOOTER + MODAL
  - Proyectos como modales JS (6 casos en objeto CASES inline: heineken, fliphouse, hacksureste, redux, incmty, cavasoft)
  - Tarjetas de proyecto con métricas RODI (SOFI/FlipHouse: RODI base +1,291%)
  - `index-v1-backup.html` conservado como respaldo
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

### Nota de diseño: nav scrollToSection
La función de scroll se llama `scrollToSection` (no `scrollTo` — conflicto con `window.scrollTo`).

## Idioma de respuestas

Responder siempre en español.
