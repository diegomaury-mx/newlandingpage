# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Portafolio profesional de Diego Maury — sitio estático desplegado en GitHub Pages.

URL objetivo: `diegomaury.mx` (GitHub Pages con dominio personalizado)

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- Sin build system; si se añade uno, usar Vite
- Despliegue: GitHub Pages (rama `gh-pages` o carpeta `/docs` en `main`)

## Estructura del repositorio

La implementación real vive en el worktree `.worktrees/build/`. El directorio raíz contiene solo docs, specs y configuración.

```
.worktrees/build/          # ← AQUÍ vive el código
├── index.html             # Página principal (6 secciones)
├── assets/
│   ├── css/styles.css     # Tokens + todos los componentes
│   ├── js/main.js         # Nav activa + scroll reveal (IntersectionObserver)
│   └── img/isotipodm.svg  # Usado como bg-pattern vía CSS background-image
├── cases/
│   ├── heineken.html      # Caso completo — contenido disponible
│   ├── innovation-systems.html  # Estructura lista, contenido pendiente
│   └── redux-incmty.html        # Estructura lista, contenido pendiente
├── portfolio/
│   └── index.html         # Galería filtrable por año
└── cv/
    └── diego-maury-cv.pdf

docs/superpowers/specs/    # Spec completa con diseño, copy y casos
docs/superpowers/plans/    # Plan de implementación task-by-task
```

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

## Design system

### Paleta de color (tokens CSS en `:root`)

| Token | Hex | Uso |
|-------|-----|-----|
| `--purple` | `#2E1547` | Hero, Contacto, Footer |
| `--ink` | `#0F0A1A` | Todas las secciones interiores |
| `--blaze` | `#EA580C` | CTAs primarios, tagline, accents |
| `--spark` | `#E6B800` | Números de caso, tags, énfasis puntual |

Regla 60·30·10: Purple/Ink dominan · Blaze solo en CTAs y tagline · Spark solo en métricas y tags.

### Tipografía

| Familia | Peso | Uso |
|---------|------|-----|
| Satoshi (Fontshare) | 800/700 | Headlines, sección títulos, números |
| Inter (Google Fonts) | 400/500 | Body, descripciones |
| JetBrains Mono (Google Fonts) | 400 | Labels, tags, métricas, nav links |

### Isotipo bg-pattern

El SVG `isotipodm.svg` se usa como fondo decorativo en todas las secciones via `.bg-pattern::before` con `background-image` CSS. Opacidad 0.06 en Ink, 0.05 en Purple. No modificar este patrón — es parte de la identidad visual.

## Secciones (orden en index.html)

1. **Hero** (fondo Purple) — tag Blaze, headline Satoshi 800, sub, 2 CTAs, banda de 3 métricas
2. **Selected Work** (Ink) — 3 filas editoriales con número Spark, nombre, meta, métrica Blaze
3. **Servicios** (Ink) — 3 tarjetas en grid con tag Spark, nombre, entregables, tiempo
4. **About** (Ink) — 2 cols: bio texto izquierda, herramientas/chips + cómo trabajo derecha
5. **Experiencia** (Ink) — 4 roles en lista vertical: meta izquierda 220px, contenido derecha
6. **Contacto** (Purple) — 3 canales: calendario, email, LinkedIn

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

- **Heineken Green Challenge**: contenido completo disponible en transcripción de Notion
- **Innovation Systems Builder**: estructura lista, contenido pendiente (entrevista en Notion sin transcribir)
- **REDUX + INCmty**: estructura lista, contenido pendiente (respuestas pendientes en Notion)
- **Copy de About, Experiencia y Servicios**: redactado e implementado

## Idioma de respuestas

Responder siempre en español.
