# CLAUDE.md

# CLAUDE.md

> **IMPORTANTE:** Toda implementación, documentación o contribución debe seguir el esquema definido en `.claude/esquema` ubicado en la raíz del repositorio (`C:\Users\DiegoLocal\ClaudeCode\Projects\products\newlandingpage\.claude\esquema`). Consulta este archivo antes de crear o modificar cualquier sección, archivo o estructura.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
│   ├── fonts/                  # Satoshi Variable + JetBrains Mono (local)
│   ├── js/main.js              # Nav activa + scroll reveal (IntersectionObserver)
│   └── img/isotipodm.svg       # Usado como bg-pattern vía CSS background-image
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
`C:\Users\DiegoLocal\ClaudeCode\Projects\products\newlandingpage\Diego Maury Design System (1)\`
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
- `index.html` con 8 secciones: Hero, Work, Trust Strip, Testimonios, Servicios, About, Experiencia, Contacto — desde 2026-05-13
- Design System v3 "Violeta Protagonista" — tokens completos en CSS
- Fuentes locales: Satoshi Variable + JetBrains Mono
- SEO básico (meta tags, OG, robots.txt)
- `cases/heineken.html` — caso +600% con contenido completo
- `cases/innovation-systems.html` — 3 subcasos: FlipHouse, HackSureste, CAVA Soft
- `cases/redux-incmty.html` — REDUX + INCmty Challenges
- `cv/diego-maury-cv.pdf` — CV 2026 subido
- Senja embed activo (`93ff9581-ba54-4ba8-a053-f7d0889cd4d0`)
- `portfolio/index.html` — galería por eras con timeline vertical — desde 2026-05-18
- Deploy en GitHub Pages → rama `gh-pages`
- Dominio `diegomaury.mx` con HTTPS activo
- Email `hola@diegomaury.mx` en sección Contacto

### Pendiente
- **Foto real**: reemplazar placeholder `DM` en hero
- **Testimonios Senja**: recolectar testimonios reales (embed activo)

## Idioma de respuestas

Responder siempre en español.
