# Plan de acción · Tareas abiertas de Claude Code (Portafolio D)

Fecha: 2026-10-20. Fuente: Tareas y Misiones (Notion), relación Portafolio D, `Responsable = Claude Code`.

Regla de cierre para todas: criterio de éxito declarado antes de ejecutar; cambios de CSS/layout verificados en Chrome real a 1440 y 390 px; `npm test` verde antes de commit; registro Inbox → Changelog → tarea Terminada.

## Triage del 2026-10-20 (hecho)

De 19 tareas, contrastadas contra repo, producción, DeepL y `notion-cms`:

- **Terminadas (ya resueltas):** CSP de `_headers` (fix `c5427f5` en producción), matching de logos (`systemsLogo` centralizado), hallazgos menores de DS (`.acc-pip` 3px, `.media-void` sin gradiente), propagación de título/"reached" a `llms*.txt`.
- **Archivadas:** migrar contenido de `docencia.astro` (contradice el Manual §4), verificación 390px post-optimización (absorbida por la de móvil), sello v2.3 en ~14 piezas (sin objetivo).
- **Reasignadas a Diego:** limpieza Senja (solo falta borrar IDs en S6b de Notion), decisión del gate de métricas.

## Fase 1 · Correcciones rápidas en código

1. **CTA del navbar a 393 px** (se parte en 4 líneas en `/docencia` y `/eventos`). Barrido de anchos 320-1180 px.
2. **Mirror `notion-cms`**: `--check` confirma drift en 3 archivos. Sync + commit aparte en `notion-cms` **con tu visto bueno** (repo público).

## Fase 2 · Seguridad (requiere tu OK antes de aplicar)

3. **Rate Limiting de `POST /api/contact`**: propuesta 5 req / 10 min por IP. Confirmar también que el token de Resend solo tenga permiso de envío.

## Fase 3 · QA en navegador (una pasada consolidada)

4. Consistencia visual entre todas las páginas contra el DS (Alta).
5. Móvil real 320/375/390: desborde de 16px en `/portfolio/hacksureste` (rail), `.result-grid` a 320px, Showcase Grid de `/portfolio`, home ES/EN a 390px.
6. Contraste WCAG, focus states, LCP y errores de consola.

Salida: reporte único en `docs/audits/` con hallazgos por severidad; CRITICAL/HIGH se corrigen en la misma fase.

## Fase 4 · Refactor

7. **Unificar breakpoints**: hoy hay 15 valores distintos de `@media`. Después de la Fase 3 (línea base visual).

## Fase 5 · Design System vía DesignSync

8. **Piso tipográfico 12 px mono / 15 px sans** al proyecto canónico (verificar primero si ya se reflejó).

## Bloqueadas (no ejecutables hoy)

- **Traducción EN de S2**: DeepL en 500,000/500,000 (2026-10-20).
- **Reel "CMS con Notion" P1**: arranca cuando Diego lo indique.

## Orden

Fase 1 → 2 → 3 → 4. La Fase 5 es independiente.
