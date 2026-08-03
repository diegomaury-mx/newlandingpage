# Baseline Search Console — pre-deploy 2026-08-03

**Capturado:** 2026-08-03, antes del push de los cambios SEO (canonical + Person JSON-LD en home, `<title>` corto en los 4 casos insignia, experimento "consultor" en meta description/knowsAbout).
**Rango:** Últimos 28 días (2026-07-05 a 2026-08-03), tipo de búsqueda Web. Exportado desde Search Console, propiedad `diegomaury.mx`.
**Propósito:** punto de comparación a 90 días (≈2026-11-01) para medir el efecto real de estos cambios y decidir si el experimento "consultor" (punto 3 del plan aprobado) se queda o se retira.

---

## Totales del periodo

| Métrica | Valor |
|---|---|
| Clics | 9 |
| Impresiones | 36 |
| CTR agregado | ≈25% |
| Posición promedio | Móviles 2.55 · Ordenador 5.76 |

Volumen muy bajo (sitio con tráfico orgánico incipiente) — cualquier comparación a 90 días debe leerse en términos relativos (¿aparecieron nuevas queries de rol/consultor?, ¿subió el volumen de páginas de caso?), no en términos de significancia estadística.

## Queries capturadas (`consultas.csv`)

Solo 2 queries con impresión en el periodo:

| Query | Clics | Impresiones | Posición |
|---|---|---|---|
| christian maury | 0 | 1 | 28 |
| heineken | 0 | 1 | 40 |

**Ninguna query contiene "consultor" ni "director de programas" todavía** — el experimento del punto 3 arranca desde cero, no hay ruido previo que limpiar. A 90 días, lo que buscamos es si aparecen impresiones para variantes de rol/consultor y cuál gana CTR.

## Páginas (`paginas.csv`)

| Página | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| `https://diegomaury.mx/` | 8 | 30 | 26.67% | 3.7 |
| `https://diegomaury.mx/portfolio/` | 1 | 6 | 16.67% | 3.67 |
| `http://www.diegomaury.mx/hacksureste` | 1 | 3 | 33.33% | 4.67 |
| `https://notion.diegomaury.mx/` | 0 | 5 | 0% | 3.6 |
| `https://diegomaury.mx/terminos-y-condiciones.html` | 0 | 5 | 0% | 8 |
| `https://diegomaury.mx/portfolio/redux-incmty.html` | 0 | 3 | 0% | 17 |
| `https://diegomaury.mx/portfolio/sofi.html` | 0 | 1 | 0% | 3 |
| `https://diegomaury.mx/portfolio/innovation-systems.html` | 0 | 1 | 0% | 6 |
| `https://diegomaury.mx/cv/diego-maury-cv.pdf` | 0 | 1 | 0% | 7 |

Notas relevantes para la comparación a 90 días:

- **`/portfolio/redux` (la página real Astro) no aparece todavía** en el baseline — solo su predecesora legacy `portfolio/redux-incmty.html` tiene impresiones (0 clics, posición 17). Es la comparación más directa para medir si el `<title>` corto ayuda: hoy la versión legacy prácticamente no compite; ver si la versión Astro empieza a aparecer y en qué posición.
- `http://www.diegomaury.mx/hacksureste` aparece **sin HTTPS y sin el segmento `/portfolio/`** — indexado desde una URL vieja/incorrecta (probablemente pre-migración a Astro). No es parte de este batch de cambios, pero es una señal de indexación a revisar por separado (posible redirect faltante o URL histórica sin actualizar en Search Console).
- `https://notion.diegomaury.mx/` no es una página del sitio real — probablemente el subdominio del calendario/Notion de Diego apareciendo en el mismo Search Console o una propiedad mal segmentada. Verificar si es ruido de otra propiedad.

## Dispositivos (`dispositivos.csv`)

| Dispositivo | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| Móviles | 6 | 11 | 54.55% | 2.55 |
| Ordenador | 3 | 25 | 12% | 5.76 |

## Países (`paises.csv`)

| País | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| México | 8 | 28 | 28.57% | 4.25 |
| Estados Unidos | 1 | 7 | 14.29% | 6.86 |
| China | 0 | 1 | 0% | 5 |

---

## Archivos crudos

`consultas.csv` · `paginas.csv` · `grafico-diario.csv` (serie diaria del periodo) · `dispositivos.csv` · `paises.csv` · `filtros.csv` (filtros aplicados en la exportación). Exportados tal cual desde Search Console, sin editar.

## Próxima revisión

**2026-11-01 (±90 días):** repetir la misma exportación (últimos 28 días, tipo Web) y comparar contra este baseline. Preguntas a responder:
1. ¿Aparecen queries con "consultor" o "director de programas"? ¿Cuál tiene mejor CTR? → decide si el experimento del punto 3 se queda o se retira.
2. ¿`/portfolio/redux` (Astro) gana impresiones/posición frente al legacy `redux-incmty.html`?
3. ¿Sube el CTR de home tras el `Person` JSON-LD y el canonical?
