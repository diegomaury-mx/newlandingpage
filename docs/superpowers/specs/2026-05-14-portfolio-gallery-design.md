# Portfolio Gallery — Diseño

**Fecha:** 2026-05-14
**Archivo objetivo:** `.worktrees/build/portfolio/index.html`
**Estado:** Aprobado — listo para implementación

---

## Contexto

El portafolio en `diegomaury.mx` tiene una sección "Selected Work" con 3 casos. La galería `portfolio/index.html` es la página completa de proyectos, accesible desde el botón "Ver todos los proyectos →" del index. Organizada por año/era para mostrar trayectoria de ejecución.

---

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla
- Sin frameworks, sin build system
- Design System: tokens de `dm_design/colors_and_type.css` copiados/importados al CSS local
- Mismo patrón de archivos que `index.html`

---

## Estructura de la página

```
[NAV]
  → Misma nav de index.html
  → Enlace "Work" marcado como activo

[HEADER]
  → Tag mono: "ALL PROJECTS"
  → H1: "Una trayectoria de ejecución."
  → Sub: "30+ programas. Tres eras. Resultados medibles."

[TIMELINE]
  → Layout 2 columnas en desktop (≥1024px)
    - Columna izquierda: índice de eras (240px, sticky)
    - Columna derecha: cards de caso agrupadas por era

  ERA 01 · 2019–2021 · "Ecosistemas corporativos"
  → Micro-frase: "De convocatoria local a referente nacional."
  → HEINEKEN Green Challenge → /cases/heineken.html

  ERA 02 · 2020–2022 · "Sistemas y operaciones"
  → Micro-frase: "Procesos que funcionan sin el operador."
  → Innovation Systems → /cases/innovation-systems.html

  ERA 03 · 2021–2023 · "Metodología y alcance nacional"
  → Micro-frase: "Una metodología clara vale más que un mentor brillante."
  → REDUX + INCmty Challenges → /cases/redux-incmty.html

[CTA FOOTER]
  → "¿Quieres ver cómo aplica esto a tu organización?"
  → Botón: "Agendar diagnóstico →" → https://calendly.com/diegomaurymx

[FOOTER]
  → Mismo footer de index.html con tricolor bar
```

---

## Diseño visual

### Timeline — índice lateral (desktop)

- Línea vertical conecta las eras (`--dm-amethyst` al 20% de opacidad)
- Era activa: dot relleno `--dm-amethyst`, label en `--dm-bone`, peso 700
- Eras inactivas: dot outline, label en `--dm-grey`
- Comportamiento: `IntersectionObserver` actualiza la era activa al hacer scroll

### Cards de caso

Basadas en `.dm-card-feature` del Design System:

```
┌──────────────────────────────────┐
│▓▓▓▓▓▓ tricolor top bar ▓▓▓▓▓▓▓▓▓│  2px — Amethyst→Catalyst→Ember
│                                  │
│  [ERA 01]  [PROGRAMA OPS]        │  badges: dm-badge-amethyst / dm-badge-ember
│                                  │
│  HEINEKEN Green Challenge        │  Satoshi 700, --dm-bone
│                                  │
│  Diseño y operación del          │  Inter 14px, --dm-bone/80%
│  programa nacional de            │
│  innovación en sustentabilidad.  │
│                                  │
│  4 cambios aterrizados           │  label: dm-mono-tag (ember)
│  2019–2022                       │  año: dm-mono (grey)
│                                  │
│  [Ver caso completo →]           │  dm-btn-ghost
└──────────────────────────────────┘
```

**Fondo de la card:** `linear-gradient(180deg, --dm-catalyst-900 → --dm-ink)`
**Borde:** `1px solid rgba(124,63,190,0.20)` (amethyst tenue)
**Radio:** `--r-lg` (16px)
**Padding:** `--space-6` (2rem)

### Mobile (≤768px)

- Índice lateral se convierte en tabs scrollables horizontales
- `overflow-x: auto`, sin JS
- Click en tab → smooth scroll al heading de esa era
- Cards en columna de ancho completo

---

## Animaciones

| Elemento | Animación | Duración |
|----------|-----------|----------|
| Cards al entrar en viewport | `opacity 0→1` + `translateY(16px→0)` | 400ms `--ease-out` |
| Dot del índice al activarse | `background` transition | `--dur-norm` (300ms) |
| Hover en card | `translateY(-2px)` + border glow amethyst | `--dur-fast` (150ms) |

- Solo propiedades compositor-safe: `transform`, `opacity`
- `prefers-reduced-motion`: todas las animaciones desactivadas

---

## Contenido por era

### ERA 01 · 2019–2021 · Ecosistemas corporativos

**HEINEKEN Green Challenge**
- Tags: `Programa de Innovación` · `Sustentabilidad`
- Descripción: Diseño y operación del programa nacional de innovación en sustentabilidad de HEINEKEN México.
- Cambios aterrizados: 4 (convocatoria, evaluación, virtualización, narrativa)
- Enlace: `/cases/heineken.html`

### ERA 02 · 2020–2022 · Sistemas y operaciones

**Innovation Systems**
- Tags: `Digital Ops` · `PropTech · Fintech`
- Descripción: Construcción de sistemas de innovación para FlipHouse, HackSureste y CAVA Soft.
- Cambios aterrizados: 4 (mapeo de procesos, CRM, dashboards, capacitación)
- Enlace: `/cases/innovation-systems.html`

### ERA 03 · 2021–2023 · Metodología y alcance nacional

**REDUX + INCmty Challenges**
- Tags: `Aceleración` · `Educación · Ecosistema`
- Descripción: Framework de aceleración de 8 semanas operado en los 32 estados de México.
- Cambios aterrizados: 4 (framework, convocatoria, evaluación, demo day)
- Enlace: `/cases/redux-incmty.html`

---

## Design System — tokens clave a usar

```css
/* Colores */
--dm-amethyst, --dm-catalyst-900, --dm-ink, --dm-bone, --dm-grey
--dm-ember, --dm-spark, --dm-tricolor

/* Tipografía */
--font-display (Satoshi), --font-body (Inter), --font-mono (JetBrains Mono)
--t-h1, --t-h2, --t-h3, --t-body, --t-mono, --t-mono-tag

/* Espaciado */
--space-4 a --space-12, --section-pad

/* Motion */
--ease-out, --dur-fast, --dur-norm

/* Clases DS */
.dm-card-feature, .dm-badge-amethyst, .dm-badge-ember
.dm-btn.dm-btn-ghost, .dm-mono-tag, .dm-tagline
.dm-tricolor-bar
```

---

## Checklist de calidad

- [ ] LCP < 2.5s (sin imágenes pesadas, solo SVG/CSS)
- [ ] Mobile-first: 375px, 768px, 1280px
- [ ] `prefers-reduced-motion` respetado
- [ ] `aria-current="true"` en era activa del índice
- [ ] Links a casos con `aria-label` descriptivo
- [ ] Misma nav/footer que index.html (sin duplicar lógica — JS compartido en `main.js`)

---

## Fuentes de referencia

- Design System: `https://github.com/diegomaury/dm_design`
- UI Kit de referencia: `dm_design/ui_kits/portfolio/app.jsx`
- Cases existentes: `.worktrees/build/cases/`
- PDFs de investigación: `C:\Users\DiegoLocal\Downloads\Portafolios\`
  - "Manual de Excelencia 2026" → Modelo Tres Horizontes
  - "Guía Avanzada Portafolios Tech" → Patrones de éxito, motion design
  - "Manual de Posicionamiento" → Autopsia clínica, lenguaje de autoridad
