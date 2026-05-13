# Diego Maury — Design System v3.0

**Brand System v3 · Violeta Protagonista**
*"Hagamos que las cosas pasen."*

Sistema de diseño personal de Diego Maury: Strategic Program & Innovation Manager operando en LATAM. Sirve cualquier superficie — web, documento, deck, prototipo — con identidad consistente.

---

## Esencia de marca

| Atributo | Definición |
|---|---|
| **Posicionamiento** | Strategic Program & Innovation Manager que convierte estrategia en resultados medibles |
| **Sub-línea** | "Programas y sistemas que convierten innovación en resultados medibles." |
| **Tagline** | "HAGAMOS QUE LAS COSAS PASEN" |
| **Fórmula visual** | Innovación + Halloween + Elegancia |
| **Audiencia** | Innovation leaders, corporativos, aceleradoras, hiring managers — LATAM |
| **Métricas clave** | 30+ programas · 900+ proyectos · 3,000+ emprendedores |

---

## Paleta — v3 · Violeta Protagonista

### Colores de Marca

| Token | Hex | Nombre | Rol |
|---|---|---|---|
| `--dm-amethyst` | `#7C3FBE` | Digital Amethyst | **CTA primario · Identidad · Isotipo** |
| `--dm-amethyst-600` | `#5E2A95` | Amethyst mid | Hover, depth |
| `--dm-catalyst` | `#4B2672` | Catalyst Purple | Gradientes, bg bloques |
| `--dm-catalyst-700` | `#2E1547` | Deep Catalyst | Wordmark en claro |
| `--dm-catalyst-900` | `#120D1A` | Midnight Void | Hero bg, fondo oscuro |
| `--dm-quantum` | `#246BFD` | Quantum Blue | Links · Status · Info |
| `--dm-ember` | `#FF5C39` | Electric Ember | **Spark · Highlight · Tagline** |
| `--dm-spark` | `#E6B800` | Spark Gold | KPIs · Métricas de impacto |

### Neutrales

| Token | Hex | Nombre | Rol |
|---|---|---|---|
| `--dm-bone` | `#F5F5F7` | Stellar Bone | Texto sobre oscuro |
| `--dm-grey` | `#B1B5C0` | Ghostly Grey | Texto secundario |
| `--dm-off-white` | `#FAF8FC` | Off-White | Page bg claro |
| `--dm-pale` | `#F0EAF8` | Pale Violet | Section bg, chips |
| `--dm-ink` | `#0F0A1A` | Deep Ink | Texto principal |

### Reglas de uso

- **Amethyst** → CTAs, isotipo, sección activa, botón primario. La identidad.
- **Ember** → Palabra clave en headline, borde outline, tagline, hover spark. El carácter.
- **Quantum** → Links funcionales, indicadores de estado. No como color de marca.
- **Gold** → Solo en cifras de impacto (+600%, 3,000+). Máx 2 usos/pantalla.

---

## Tipografía

| Familia | Archivo | Rol | Pesos |
|---|---|---|---|
| **Satoshi** | `fonts/Satoshi-Variable.ttf` | Display · Headlines | 300–900 |
| **Inter** | Google Fonts | Body text | 300–600 |
| **JetBrains Mono** | Google Fonts + Italic local | Data · Labels · Tagline | 400–800 |

### Escala

| Token | Valor | Uso |
|---|---|---|
| `--t-display` | clamp(2.5rem → 4.5rem) | Nombre, hero headline |
| `--t-h1` | clamp(2rem → 3.75rem) | Títulos de sección |
| `--t-h2` | clamp(1.75rem → 2.5rem) | Sub-secciones |
| `--t-h3` | 1.5rem | Cards, items |
| `--t-body` | 0.875rem | Body principal |
| `--t-mono` | 0.8125rem | KPIs, cifras |
| `--t-mono-tag` | 0.625rem | Labels, chips, tagline |

### Clases semánticas

```css
.dm-display     /* Satoshi 800, -2.5% tracking */
.dm-h1 / .dm-h2 / .dm-h3 / .dm-h4
.dm-body-lg / .dm-body / .dm-body-sm
.dm-mono / .dm-mono-tag / .dm-tagline
.dm-metric      /* KPI numbers — Satoshi 800, amethyst */
.dm-spark       /* span inline — ember highlight */
```

---

## Componentes

### Botones

```css
.dm-btn .dm-btn-primary      /* Amethyst gradient · CTA principal */
.dm-btn .dm-btn-secondary    /* Ember outline · Acción secundaria */
.dm-btn .dm-btn-ghost        /* Bone border · Navegación */
.dm-btn .dm-btn-primary-light /* Amethyst solid · sobre fondos claros */
```

Tipografía: **Satoshi 700 · sentence-case** (no mono, no uppercase).

### Badges / Chips

```css
.dm-badge .dm-badge-amethyst  /* Violeta · categoría */
.dm-badge .dm-badge-ember     /* Naranja · urgente/destaque */
.dm-badge .dm-badge-quantum   /* Azul · status/info */
.dm-badge-status              /* Añade dot de color antes del texto */
```

### Cards

```css
.dm-card          /* Dark · #0F0A1A bg */
.dm-card-light    /* Light · #FFFFFF bg */
.dm-card-feature  /* Dark con tricolor top border */
```

### Links

```css
.dm-link  /* Quantum blue · dashed underline */
```

---

## Gradientes y barras

```css
--dm-tricolor:      linear-gradient(90deg, #7C3FBE → #4B2672 → #FF5C39)
--dm-amethyst-grad: linear-gradient(135deg, #7C3FBE → #5E2A95)

.dm-tricolor-bar   /* 3px bar — firma de pie de página */
```

---

## Espaciado y radii

Base 4px. Tokens: `--space-1` (4px) → `--space-12` (96px).

Radii: `--r-xs` 4px · `--r-sm` 6px · `--r-md` 10px · `--r-lg` 16px · `--r-pill` 999px.

Sombras: `--shadow-1/2/3` · `--shadow-glow-ember` · amethyst glow vía `box-shadow`.

---

## Assets

| Archivo | Descripción |
|---|---|
| `assets/logo-principal.png` | Logo principal — sobre oscuro |
| `assets/logo-horizontal.png` | Logo horizontal — transparente |
| `assets/logo-tagline.png` | Logo con tagline |
| `assets/logo-alt.png` | Logo alternativo — claro |
| `assets/isotipo.svg` | Hexágono DM — SVG vectorial |
| `assets/hexagon-pattern.png` | Patrón hexagonal — dark |
| `assets/hexagon-pattern-light.png` | Patrón hexagonal — light |

---

## UI Kit

`ui_kits/portfolio/` — mock clickable del portfolio completo:
- Navbar fija con indicador activo
- Hero con métricas band
- Work list con cases (Heineken, ITESM, REDUX)
- Services grid
- About + Contact sections

Importar: `<link rel="stylesheet" href="ui_kits/portfolio/styles.css">` + `<script type="text/babel" src="ui_kits/portfolio/app.jsx"></script>`

---

## Fuentes de información

| Fuente | Tipo |
|---|---|
| https://dmbrand.netlify.app/ | Brand System v2 (referencia canónica) |
| `newlandingpage/docs/superpowers/specs/` | Spec del portfolio |
| Logos y assets subidos | `/uploads/` → `/assets/` |
