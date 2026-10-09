# Manual de Diego CMS y Estado del sistema: desactualizaciones (2026-10-09)

Corte: 2026-10-09. Verificado contra Notion (SQL sobre SSOT), Cloudflare (deploys), el build local y el código. Nada de esto se editó en Notion: son instrucciones para SILVIA (o Diego) a registrar en el Inbox al cerrar la sesión.

Páginas revisadas:
- Manual de Diego CMS: `3a80fe3c51c5803e9b78d9faeb1c98f7` (última edición 2026-09-26, dice "Última revisión: 2026-09-01").
- Diego CMS · Estado del sistema: `74d773c83a7f4cec9c80e8c63a4ac2d7` (última edición 2026-10-08, corte 08 oct).
- Espejo en repo: `docs/platform/manual-cms.md` (su propio encabezado ya admite que la sección 4 está desactualizada).

## A. Manual de Diego CMS

| # | Sección | Qué dice hoy | Realidad |
|---|---|---|---|
| A1 | 1 · "Las cuatro fuentes" | Cuatro fuentes | `content.config.ts` tiene 7 colecciones: `cases`, `metrics`, `siteCopy`, `imageSlots`, `events`, `testimonials` y `reservaCopy` (esta última inerte desde el archivado de /reserva). Faltan documentar `events` (base 📆 Meetups y Eventos, /eventos y /en/events) y `testimonials` (alimenta la marquesina de la home) |
| A2 | 5.3 | `Ediciones` (relación) → bloque "Archivo de este caso" | Ese bloque se eliminó el 2026-10-09 (duplicaba "Casos relacionados"). `Ediciones` ya no se muestra |
| A3 | 5.3 / 5.1 | `Reflexión` → "sección al final, solo si tiene texto" | Ahora se parte en párrafos por línea en blanco. Agregar: separar párrafos con línea en blanco; la propiedad es la única fuente, el cuerpo no se usa |
| A4 | 6 · Copy del Home | Solo reglas de prefijo `# S<n> ·` | Falta la estructura exigida por S2 (`## titular`, `### label de roles`, `Rol: descripción`, `### label del método`) y el gotcha de niveles de encabezado: un titular en `###` y labels en `####` desarma el layout |
| A5 | 6 | Sin mención de S2 cifras | Hasta el 2026-10-09 la 3.ª cifra de S2 estaba atada por posición a la métrica de INCmty (9,905) y publicó un claim mezclado ("9,905 sectores transformados"). Cambio de código del 2026-10-09: S2 muestra exactamente las cifras de la línea de Notion (hoy 3: `30+ proyectos liderados`, `15+ años de trayectoria`, `6 sectores transformados`); las notas fijas van por tipo de cifra (proyectos, años) y una cifra nueva sale sin nota; ya no hay número animado ni vínculo con la métrica de INCmty en S2. Documentar: la línea de cifras es `**N** etiqueta • **N** etiqueta`, y la etiqueta decide si lleva nota fija. La cifra de participantes inscritos (9,905) se retiró de S2. Respaldo: dar de alta "6 sectores transformados" en la base de Métricas (Diego lo hace aparte) |
| A6 | 6 | Sin mención de S4 | S4 es un diagrama radial con estructura obligatoria (`# título`, intro, `**Centro**` + valor, bloque de código con un campo por línea, cierre). Si Notion no la respeta, el diagrama se oculta sin error |
| A7 | 6 | Sin mención de S8 | S8 ya no usa pasos 01-03; label, titular e intro vienen de Notion y los textos fijos viven en `src/i18n/contact.ts`. No puede prometer tiempo de respuesta |
| A8 | 4 · Qué NO se edita | Lista corta | Agregar: textos fijos de Contacto, imágenes Open Graph (`public/og/`, estáticas), formulario `/api/contact` |
| A9 | 6b | Sección /reserva con el texto histórico mezclado con el aviso de archivado | Reordenar: dejar solo el aviso y mover lo histórico, o eliminar la sección |
| A10 | 10 · Auto-publish | Solo describe el webhook directo | Falta: los eventos no disparan build directo (filtro de propiedades públicas + marca `events_rebuild_pending` + cron `*/5`) y el cron diario 13:00 UTC |
| A11 | 11 · Cambios de diseño | Último ítem 2026-09-01 | Faltan: Contacto S8, S2 layout 1B, OG por ruta, /eventos Taxonomía v2, marquesina de testimonios, retiro de "Archivo de este caso" |
| A12 | 12 · Errores | Sin el caso de reestructura de Copy | Agregar síntoma "secciones sin contenido tras reestructurar Copy Oficial": causa los parsers por estructura (S2, S4, S5, S6); restaurar versión desde el historial de página |
| A13 | Encabezado | "Última revisión: 2026-09-01" | Actualizar fecha al editar |

## B. Diego CMS · Estado del sistema

| # | Sección | Qué dice hoy | Realidad |
|---|---|---|---|
| B1 | Estado actual · Páginas por build | 65 | 67 (sitemap y build local del 2026-10-09) |
| B2 | Estado actual · Fichas | 31 publicadas, 29 con gate completo (5 Insignia + 24 Soporte) | El gate completo sí coincide (SQL 2026-10-09: 5 Insignia + 24 Soporte = 29). El "31" no se pudo reverificar con el mismo SQL; confirmar o quitar |
| B3 | Cómo funciona · "Las 4 fuentes" | Cuatro | Ver A1 |
| B4 | Línea de tiempo | Termina el 16 a 21 ago | Faltan: bilingüe ES/EN y DeepL (17 ago), sprint de deuda técnica (20 ago), regla de evidencia `belief`, marquesina de testimonios (9 sep), DS v2.5 y tokens (sep), /reserva lanzada y archivada (26 sep), /eventos Taxonomía v2 y relay con debounce (3 a 5 oct), OG por ruta, Contacto S8 y S2 1B (8 oct), incidente de reestructura de Copy y restauración (9 oct) |
| B5 | Corte | 08 oct 2026 | Actualizar al 2026-10-09 |
| B6 | Pendientes | "CLAUDE.md espejo STALE desde 19 ago" | `CLAUDE.md` y el contrato se alinearon con el estado real el 2026-10-08 (commit `1f4db4c`). Marcar como cerrado o reverificar |
| B7 | Pendientes | `{{metrica:slug}}` sin resolver | Sigue abierto; decidir si se retira la mención |

## C. Espejo en repo

`docs/platform/manual-cms.md`: reemplazar el encabezado de advertencia por el contenido real de la sección 4 (Cloudflare Pages + Worker `notion-deploy-relay`) y reflejar A1 a A3.

## Instrucción para SILVIA (a registrar en el Inbox al cierre)

Actualizar el Manual de Diego CMS (A1 a A13) y el Estado del sistema (B1 a B7) con esta lista. No usar `update_content` sobre bloques anidados con toggles (riesgo de borrar contenido hermano); edición manual o por bloque. Cualquier cifra nueva se da de alta primero en la base de Métricas.
