# Quitar "FlipHouse" de la línea de logos del hero (S1)

**Por qué:** el nombre "FlipHouse" en esta línea es lo único que hoy activa el logo real de FlipHouse en el trust bar del home — código ya corregido (2026-08-11, `LOGO_MAP` en `src/pages/index.astro` ya no tiene esa entrada, así que el logo no vuelve a aparecer aunque esta línea siga diciendo "FlipHouse"), pero el texto de Notion debe quedar consistente con la decisión de anonimizar al cliente del caso SOFI/PropTech.

**Dónde:** página "⚓ Copy Oficial · diegomaury.mx (SSOT)" (`d9ab8508660a43e8ac459386dd7903d9`), columna/toggle **"Versión Actual"** → sección **S1 · Hero**, última línea antes del toggle S2.

**Editar manualmente en Notion** (NO vía `notion-update-page update_content`, ver CLAUDE.md §6 y memoria `notion-update-content-gotcha`):

Texto actual:
```
**Logos sugeridos:** HEINEKEN · Tecnológico de Monterrey · INCmty · EBC · FlipHouse
```

Texto nuevo:
```
**Logos sugeridos:** HEINEKEN · Tecnológico de Monterrey · INCmty · EBC
```

Solo se quita " · FlipHouse" al final de la línea. Nada más en S1 cambia.

**Opcional (no bloqueante):** la base "🖼️ CMS Imágenes — Portafolio D" tiene un slot `logo-fliphouse` dado de alta desde 2026-07-25, `Estado = Sin empezar`. Ya no lo usa ningún código (la entrada se quitó de `LOGO_MAP`), así que puedes archivar o borrar esa fila si quieres limpiar la base — no es necesario para cerrar este fix.
