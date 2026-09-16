# Unificación de breakpoints — tarea diferida (no ejecutada)

**Estado:** pendiente, fuera de la remediación DS v2.5 del 2026-09-16.
**Por qué está diferida:** el contrato dimensional (`v2-dimensions.css`) no dice nada sobre breakpoints — no es un hallazgo de la auditoría del design system, es refactor de ingeniería que se coló en el mismo paquete. El riesgo (textos superpuestos, grids que no colapsan a tiempo) es funcional en un sitio en vivo, a cambio de cero beneficio de marca. Nueve breakpoints inconsistentes es deuda real, pero deuda que no le hace daño a nadie hoy. Decisión de Diego: se ejecuta en una rama propia, revertible sin arrastrar nada más, cuando no compita con correcciones de contrato.

## Estado actual (9 valores, 6 hojas)

| Breakpoint | Hoja(s) | Selector(es) |
|---|---|---|
| 560px | home.css | `.problem-flow-row` (apila en móvil) |
| 600/601px | home.css | par min/max alrededor de `.evidence-field` |
| 640px | events.css | `.events-card`, `.events-cal-cell`, `.events-cal-event` |
| 680px | home.css | `.cta-steps` |
| 720px | footer.css, home.css | `.footer-grid`; `.metrics`, `.metric` |
| 760px | home.css | `.accordion-wrap`, `.acc-panel` |
| 768px | navbar.css | `.nav__links` (menú móvil) |
| 800px | home.css | `.problema-grid` |
| 900px | home.css, portfolio.css | `.hero-grid`, `.ip-grid`; grid de portfolio |
| 960px | home.css | `.about-body`, `.about-intro-full`, `.about-role`, `.about-photo`, `.about-right`, `.evidence-grid`, `.evidence-radial` (6 usos) |
| 1080/901px | portfolio.css | par min/max de la grid de showcase |

## Propuesta (aprobada en principio, sin ejecutar)

Dos clusters naturales en los valores actuales:

- **Cluster móvil (~560–720) → unificar a `640px`**
- **Cluster tablet/desktop (~760–1080) → unificar a `960px`**

Mapeo propuesto, breakpoint actual → nuevo:

| Actual | Nuevo | Nota |
|---|---|---|
| 560 | 640 | |
| 600/601 | 640 | revisar el par min/max junto — puede colapsar a un solo `@media (max-width: 640px)` |
| 640 | 640 | ya coincide |
| 680 | 640 | |
| 720 | 640 | |
| 760 | 960 | |
| 768 | 960 | — **el menú móvil del navbar es el de mayor riesgo**: 768→960 amplía la ventana en la que el menú hamburguesa reemplaza los links, verificar que no quede un rango donde ninguno de los dos quepa |
| 800 | 960 | |
| 900 | 960 | |
| 960 | 960 | ya coincide |
| 1080/901 | 960 | revisar la grid de showcase (`repeat(2,1fr)` en ese rango) a la nueva frontera |

## Matriz de verificación obligatoria antes de cerrar

Capturar cada página afectada (`/`, `/portfolio`, `/eventos`, `/en/*` equivalentes) en:

**320px** · **640px** · **768px** · **960px** · **1440px**

Secciones con mayor riesgo de romperse (colapsan grid o cambian de layout):
- `.hero-grid`, `.about-body`, `.about-intro-full`, `.metrics`, `.problema-grid`, `.evidence-grid`/`.evidence-radial` (home)
- `.ip-grid`, `.accordion-wrap`/`.acc-panel` (home, "Cómo trabajo")
- Grid de showcase de `/portfolio` (2 vs 3 columnas)
- Menú del navbar (hamburguesa vs links inline) — el más sensible al remapeo de 768
- `.events-card`, `.events-cal-grid`/`.events-cal-cell` (eventos)
- `.footer-grid` (3 columnas vs 1)

## Criterio de salida

- Una sola escala (640/960) consumida por las 6 hojas, sin breakpoints sueltos fuera de esas dos.
- Las 5 capturas por página no muestran texto superpuesto, contenido cortado, ni una grid que colapsa tarde/temprano de forma visible.
- Rama separada y revertible; no se mezcla con ningún otro cambio de contrato.
