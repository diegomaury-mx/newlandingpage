# Ampliar cinturón de logos del home (S1) vía CMS

Fecha: 2026-08-13

## Qué cambió en código (ya hecho, LIVE tras deploy)

`src/pages/index.astro`: `LOGO_MAP` (objeto hardcodeado, 4 entradas fijas) se
reemplazó por un sistema dinámico (`resolveLogo`). Ahora, cualquier nombre
listado en la línea "Logos sugeridos:" de S1 se busca automáticamente en la
base **CMS Imágenes** bajo el slot `logo-<nombre-slugificado>` — agregar un
logo nuevo ya no requiere tocar este archivo.

Excepción de nomenclatura conservada por compatibilidad: "Tecnológico de
Monterrey" sigue mapeando al slot ya existente `logo-tec-de-monterrey` (no al
slug literal `logo-tecnologico-de-monterrey`).

Guardrail conservado: "FlipHouse" sigue bloqueado explícitamente (cliente
confidencial detrás del caso SOFI/PropTech) — nunca se renderiza aunque
aparezca en la línea de Notion.

## Qué se hizo en Notion (ya hecho)

Se revisó la base **"Empresas con las que he trabajado"**
(`collection://ecef7299-41ee-4b04-bd60-8ebb2ce65c63`) — tiene 17 empresas con
logo cargado, 4 ya viven en el trust bar (HEINEKEN, Tec de Monterrey, INCmty,
EBC). Se dieron de alta las **14 filas nuevas** en **CMS Imágenes**
(`collection://8dda9726-a42d-407d-ba84-334b4a1ef7a1`) con el `Slot` correcto
ya calculado, `Estado = "Sin empezar"` y sin archivo (Notion no permite copiar
archivos entre bases vía API sin URL firmada — Claude Code no pudo automatizar
esa parte):

| Empresa | Slot |
|---|---|
| Federación Iberoamericana de Jóvenes Empresarios | `logo-federacion-iberoamericana-de-jovenes-empresarios` |
| Global Shapers | `logo-global-shapers` |
| Gobierno de Campeche | `logo-gobierno-de-campeche` |
| Gobierno de Yucatán | `logo-gobierno-de-yucatan` |
| COPARMEX Mérida | `logo-coparmex-merida` |
| Techstars | `logo-techstars` |
| Platzi | `logo-platzi` |
| Gobierno de Coahuila | `logo-gobierno-de-coahuila` |
| Gobierno de Quintana Roo | `logo-gobierno-de-quintana-roo` |
| Talent Land | `logo-talent-land` |
| CETIEM | `logo-cetiem` |
| CodersLink | `logo-coderslink` |
| UNAM | `logo-unam` |
| Comisión de Empresarios Jóvenes de COPARMEX | `logo-comision-de-empresarios-jovenes-de-coparmex` |

## Lo que falta — 2 pasos manuales de Diego

### 1 · Subir los 14 archivos de logo en CMS Imágenes

Para cada fila de la tabla de arriba (buscar por `Slot` en la base CMS
Imágenes): arrastrar el archivo de logo correspondiente (ya existe descargado
en la base "Empresas con las que he trabajado", propiedad `Logo`) al campo
`Imagen`, y cambiar `Estado` a **"Listo"**. Un slot sin archivo o sin
`Estado = "Listo"` simplemente no aparece en el sitio — no rompe nada, así que
se puede hacer de a poco.

### 2 · Actualizar la línea "Logos sugeridos" en Copy Oficial (S1)

**No lo hizo Claude Code directamente** — la página "Copy Oficial ·
diegomaury.mx (SSOT)" tiene el copy dentro de un `synced_block` con toggles
anidados, y `notion-update-page update_content` ya ha borrado contenido
hermano en páginas con esta estructura (ver memoria
`notion-update-content-gotcha`). Edición manual.

Ubicación: página "Copy Oficial · diegomaury.mx (SSOT)" → toggle "Versión
Actual" → sección `# S1 · Hero` → última línea.

**Texto actual:**
```
**Logos sugeridos:** HEINEKEN · Tecnológico de Monterrey · INCmty · EBC
```

**Reemplazar por:**
```
**Logos sugeridos:** HEINEKEN · Tecnológico de Monterrey · INCmty · EBC · Federación Iberoamericana de Jóvenes Empresarios · Global Shapers · Gobierno de Campeche · Gobierno de Yucatán · COPARMEX Mérida · Techstars · Platzi · Gobierno de Coahuila · Gobierno de Quintana Roo · Talent Land · CETIEM · CodersLink · UNAM · Comisión de Empresarios Jóvenes de COPARMEX
```

Los nombres deben coincidir EXACTO con la columna "Empresa" de la tabla de
arriba (el slug se deriva de ese texto en build time) — no usar variantes
como "Tec de Monterrey" ni agregar/quitar puntos.

Nota: 18 logos es bastante para un solo cinturón (hoy son 4). Si al verlo en
el sitio se ve saturado, se puede recortar la línea de Notion a un
subconjunto sin tocar código — el sistema ya soporta cualquier cantidad.

Después de este paso + de subir al menos algunos logos con Estado "Listo",
el próximo push a `master` (o el auto-publish de Notion) los muestra en
producción.
