# Resumen de actividades — 2026-07-28

Objetivo: producir artefactos trazables que relacionen lo publicado en `public/` con los orígenes en el repositorio y generar un inventario de assets públicos para auditoría y validación.

Acciones realizadas:

- Generada la relación páginas publicadas ↔ archivos fuente:
  - `docs/published-pages-map.md` (mapeo legible)
  - `docs/published-pages-map.json` (machine-readable)
  - `docs/published-pages-map.csv` (spreadsheet)

- Escaneo completo de `public/` y creado inventario de assets:
  - `docs/published-assets-report.json`
  - `docs/published-assets-report.csv`
  - El inventario agrupa por tipo: `html`, `js`, `css`, `font`, `image`, `data`, `text`.

- Actualizado `CHANGELOG.md` con las entradas correspondientes.
- Actualizado `README.md` con un bloque **Actividades recientes** que referencia los nuevos artefactos.

Estado actual de la lista de tareas (TODO):

- `docs/published-pages-map.*` — completado
- `docs/published-assets-report.*` — completado
- `README.md` — resumen añadido (completado)
- `docs/activity-summary.md` — este archivo (completado)
- Validación CI para asegurar cobertura del mapa público — pendiente (opcional)

Siguientes pasos recomendados:

1. Añadir un script de validación (por ejemplo `tools/validate-published-map.cjs`) que verifique que cada archivo en `public/` esté representado en `docs/published-assets-report.json` y falle con non-zero exit en CI si hay discrepancias.
2. Integrar `npm run validate:published-map` en el pipeline de CI o en un job de GitHub Actions pre-deploy.
3. Automatizar la generación del inventario como paso de build si el flujo de producción cambia frecuentemente.

Si quieres, implemento el script de validación y lo integro en `package.json` ahora.

---
Generado por el asistente el 2026-07-28.
