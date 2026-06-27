# Conventions — Diego Maury Platform

**Sprint:** 0.5 — Definición. Sin implementación.
**Aplica desde:** Sprint 1.

Estas convenciones son vinculantes. Toda implementación de Claude Code debe seguirlas.
Si una decisión de producto requiere una excepción, debe documentarse en CHANGELOG.md.

---

## 1. Naming Convention

### Archivos y carpetas

| Tipo | Convención | Ejemplos |
|------|------------|---------|
| Componentes Astro | PascalCase | `CaseCard.astro`, `HeroSection.astro` |
| Layouts | PascalCase | `BaseLayout.astro`, `CaseLayout.astro` |
| Páginas Astro | kebab-case | `index.astro`, `about.astro` |
| Archivos MDX de contenido | kebab-case | `heineken-green-challenge.mdx` |
| Archivos de datos (services) | kebab-case | `retainer-mensual.json` |
| Archivos CSS | kebab-case | `tokens.css`, `typography.css` |
| Archivos TypeScript | camelCase | `seoUtils.ts`, `contentHelpers.ts` |
| Imágenes | kebab-case | `og-heineken.png`, `hero-bg.webp` |
| Fuentes locales | kebab-case | `satoshi-variable.woff2` |

### Variables y funciones TypeScript

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Variables | camelCase | `caseStudies`, `publishedAt` |
| Funciones | camelCase | `getSortedCases()`, `formatDate()` |
| Constantes globales | UPPER_SNAKE_CASE | `SITE_URL`, `DEFAULT_OG_IMAGE` |
| Tipos e interfaces | PascalCase | `CaseStudy`, `ServiceEngagement` |
| Booleanos | prefijo `is`/`has`/`can`/`should` | `isDraft`, `hasCTA`, `isActive` |
| Props de componentes | camelCase | `featuredOnly`, `showMetrics` |

### CSS

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Custom properties (tokens) | `--dm-{categoría}-{valor}` | `--dm-color-ink`, `--dm-space-section` |
| Clases de componente | kebab-case | `.case-card`, `.hero-section` |
| Clases de utilidad | kebab-case | `.sr-only`, `.text-balance` |
| Variables de animación | camelCase en JS | `heroRevealTl` |

---

## 2. Folder Convention

### Estructura raíz del proyecto Astro

```
/
├── public/
│   ├── fonts/              # Fuentes locales (WOFF2)
│   ├── img/                # Imágenes estáticas
│   │   ├── og/             # Open Graph images (1200×630)
│   │   ├── cases/          # Imágenes de casos de estudio
│   │   ├── projects/       # Imágenes de proyectos
│   │   └── brand/          # Isotipo, logos, marca
│   ├── robots.txt
│   ├── CNAME
│   └── llms.txt
│
├── src/
│   ├── components/
│   │   ├── ui/             # Componentes atómicos reutilizables
│   │   ├── sections/       # Secciones de página (Hero, CTA, etc.)
│   │   └── layout/         # Nav, Footer, Breadcrumb
│   │
│   ├── content/
│   │   ├── cases/          # .mdx files
│   │   ├── projects/       # .mdx files
│   │   ├── playbooks/      # .mdx files
│   │   ├── insights/       # .mdx files
│   │   ├── services/       # .json files
│   │   └── config.ts       # Collection schemas
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── CaseLayout.astro
│   │   ├── PlaybookLayout.astro
│   │   └── InsightLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── cases/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── playbooks/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── insights/
│   │       ├── index.astro
│   │       └── [slug].astro
│   │
│   ├── styles/
│   │   ├── tokens.css      # Design tokens (canónico único)
│   │   ├── typography.css  # Escala tipográfica
│   │   ├── reset.css       # CSS reset mínimo
│   │   └── global.css      # Imports + estilos globales
│   │
│   └── utils/
│       ├── seo.ts          # Helpers para metadata y JSON-LD
│       ├── content.ts      # Helpers para content collections
│       └── date.ts         # Formateo de fechas
│
├── docs/
│   └── platform/           # Documentación de arquitectura
│
├── astro.config.ts
├── tsconfig.json
├── package.json
├── CHANGELOG.md
└── CLAUDE.md
```

### Reglas de organización

1. `public/` solo contiene archivos que se sirven tal cual. Sin transformación.
2. `src/components/ui/` = átomos. Sin lógica de datos, sin `getCollection`.
3. `src/components/sections/` = secciones completas de página que sí pueden recibir datos.
4. `src/layouts/` = estructuras HTML completas. No contienen lógica de contenido.
5. `src/utils/` = funciones puras TypeScript. Sin efectos secundarios, sin imports de Astro.
6. No crear subcarpetas dentro de `components/` más allá de `ui/`, `sections/`, `layout/`.

---

## 3. MDX Convention

### Estructura de un archivo MDX

```mdx
---
# Frontmatter YAML
title: "Título del contenido"
# ... resto de campos según schema
draft: true
---

{/* Cuerpo MDX — narrativa editorial */}

## Sección 1

Contenido...

## Sección 2

Contenido...
```

### Reglas MDX

1. El frontmatter siempre usa comillas dobles para strings.
2. Los arrays de una línea usan sintaxis inline: `tags: ["estrategia", "ejecución"]`.
3. Los arrays largos usan sintaxis multilinea con guión.
4. No usar componentes MDX importados en el Sprint 1. Solo Markdown puro en el cuerpo.
5. Los headings en el cuerpo empiezan desde `##` (el `#` lo genera el layout desde `title`).
6. No incluir el título como `#` en el cuerpo — el layout lo renderiza desde frontmatter.
7. Imágenes en el cuerpo MDX: usar paths relativos desde `public/` (`/img/cases/imagen.webp`).

---

## 4. Frontmatter Convention

### Orden de campos en el frontmatter

Todo frontmatter debe seguir este orden para facilitar la lectura:

```yaml
---
# 1. Identificación
title: ""
# tipo-específico: organization, name, etc.

# 2. Clasificación
industry: ""       # solo Case Studies
category: ""       # solo Insights
status: ""         # solo Projects
engagement: ""     # solo Services

# 3. Temporal
period:
  start: ""
  end: ""
publishedAt: ""
updatedAt: ""      # cuando aplica

# 4. Contenido principal
# (campos específicos por tipo: context, challenge, etc.)

# 5. Relaciones
relatedPlaybooks: []
relatedCaseStudies: []
relatedInsights: []
relatedServices: []

# 6. SEO (opcional — solo si difiere del patrón automático)
seoTitle: ""
seoDescription: ""
ogImage: ""

# 7. Control de publicación
order: 1           # solo Services
featured: false
draft: true
---
```

### Reglas de fechas

- Formato ISO 8601: `"YYYY-MM-DD"` (string, no Date object).
- `publishedAt` = fecha de primera publicación. No se actualiza.
- `updatedAt` = fecha de última modificación significativa. Opcional.
- `period.start` y `period.end` pueden ser `"YYYY-MM"` si no se conoce el día exacto.

---

## 5. Asset Convention

### Imágenes

| Tipo | Carpeta | Formato | Dimensiones |
|------|---------|---------|-------------|
| Open Graph | `public/img/og/` | `.png` | 1200×630 |
| Case Study gallery | `public/img/cases/{slug}/` | `.webp` | Variable |
| Project screenshots | `public/img/projects/{slug}/` | `.webp` | Variable |
| Brand assets | `public/img/brand/` | `.svg` / `.webp` | Variable |
| Hero backgrounds | `public/img/hero/` | `.webp` | ≥ 1920px ancho |

### Reglas de imágenes

1. Nunca incluir imágenes mayores a su tamaño de renderizado más el 2x (@2x).
2. Formato preferido: `.webp` para fotografías y screenshots, `.svg` para iconos y marca.
3. Todos los `<img>` deben tener `width`, `height` y `alt` definidos.
4. Hero y OG images: `fetchpriority="high"` + `loading="eager"`.
5. Todo lo demás: `loading="lazy"`.

### Fuentes

- Ubicación: `public/fonts/`
- Formato: `.woff2` exclusivamente.
- Subsets: latin + latin-ext.
- `font-display: swap` en todas las `@font-face`.
- Máximo 2 familias tipográficas por defecto. Exceptions requieren aprobación del DS.

### Naming de imágenes

```
# Open Graph
og-home.png
og-{slug}.png

# Case Study gallery
{case-slug}-01.webp
{case-slug}-02.webp

# Brand
isotipo-dark.svg
isotipo-light.svg
logo-horizontal.svg
```
