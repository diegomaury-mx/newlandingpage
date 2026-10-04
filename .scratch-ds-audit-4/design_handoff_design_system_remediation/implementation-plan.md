# Implementation Plan — Ember on Ink
## Runbook de ejecución · v2 · 2026-09-10

Deriva de `design-system-audit-report.md` (segunda corrida). Orden, dependencias, riesgo y rollback en un solo lugar.
Regla general: **un cambio por commit**, y el commit que toca código toca también la documentación que lo describe.

---

## Fase 0 — Limpieza del proyecto (antes que todo lo demás)

Añadida el 2026-09-10 por decisión de Diego, y con razón: la auditoría gastó cinco de quince hallazgos en artefactos muertos. El triage completo, archivo por archivo, está en `cleanup-plan.md`.

| # | Cambio | Depende de | Riesgo | Rollback |
|---|---|---|---|---|
| 0.1 | Línea `estado: canónico\|vigente\|copia-de-trabajo\|retirado — fecha` en todos los archivos, sin moverlos | — | 🟢 solo comentarios | revertir commit |
| 0.2 | Mover a `archive/` las 6 entradas retiradas confirmadas | 0.1 | 🟡 puede haber enlaces externos a esos nombres | están en `archive/`, se restauran moviéndolas de vuelta |
| 0.3 | Borrar las ~24 copias de trabajo | 0.1 | 🟡 `.bundles/` y `thumbnail.html` podrían ser infraestructura | mover a `archive/` en vez de borrar y verificar que el proyecto abra |
| 0.4 | Resolver las 8 dudas del triage (portfolio React, fondos de perfil, portada propuesta, TTF, handoff quote cards) | respuesta de Diego | 🟢 | — |
| 0.5 | Reescribir `README.md`, `Inventario de Assets.html` y `_ds_manifest.json` para el proyecto post-limpieza, en el mismo commit. Incluir la línea de alcance: este proyecto no es el repo del sitio | 0.2, 0.3, 0.4 | 🟡 el manifest publica cards; un path mal escrito rompe una card | revertir el JSON |

**Criterio de salida de la fase 0:** cualquiera que abra el proyecto sabe, en la primera línea de cada archivo, qué está leyendo. Ninguna auditoría futura puede volver a confundir artefacto con producción.

---

## Puerta de entrada — respuestas registradas

| # | Respuesta (2026-09-10) | Efecto |
|---|---|---|
| B1 | **Ninguno de los dos.** Producción es el build de Astro (`src/pages/index.astro`), desplegado por Cloudflare Pages desde `master`. Los estáticos de raíz se eliminaron el 2026-08-13 y no se recrean | Los pasos 2, 3, 4 y 11 quedan **anulados**: apuntaban a artefactos muertos. Se reemplazan por la fase 0 y por auditar el repo Astro |
| B2 | **El Azul Medianoche se elimina** del sistema | El paso 12 pasa a ser eliminación, no documentación de excepción. El paso 6 se reduce a borrar `--ember-cta` junto con su archivo |
| B3 | No aplica: `uploads/` no existe en el repo del sitio | — |

**Nueva puerta de entrada:** las 8 dudas del triage (`cleanup-plan.md`), y conectar el repo Astro para poder auditar la única superficie viva del sistema.

---

## Fase 1 — Compatibilidad (semana 1)

| # | Cambio | Archivos | Depende de | Riesgo | Rollback |
|---|---|---|---|---|---|
| 1 | Corregir cifras de contraste: 12.2:1 → 6.53:1 (tres apariciones) y 2.78 → 2.91 | `README.md` | — | 🟢 ninguno | revertir commit |
| 2 | Mover el sitio de producción fuera de `uploads/` | el archivo declarado en B1 | B1, B3 | 🟠 rutas relativas de assets y favicon se rompen | mover de vuelta; verificar consola sin 404 antes de cerrar |
| 3 | `#fff` → `var(--bg)` sobre Ember (nav CTA y botón primario) | `uploads/index.html:131, :180` | — | 🟢 cambia el color del texto del CTA, decisión ya tomada | revertir dos líneas |
| 4 | Tres valores de paleta a v2.3 | `uploads/index.html:60-66` | — | 🟡 afecta bordes y texto terciario de las 9 secciones | revertir tres líneas; revisar sección por sección antes de cerrar |
| 5 | Sello de snapshot en las piezas sin sellar | `Tarjeta de Presentación.html`, `Portada LinkedIn.html`, `Manual de Marca.html` + 11 piezas | — | 🟢 solo comentarios | revertir commit |
| 6 | Registrar o eliminar `--ember-cta` | `_adherence.oxlintrc.json`, `ui_kits/version2/index.html:65` | B2 | 🟡 si `version2` es producción, cambia el color de todos sus botones | revertir; el paso 3 cubre el caso alterno |
| 7 | Regenerar la copia distribuida y sellar la del handoff | `_ds/…/v2-tokens.css`, `design_handoff_azul_medianoche/v2-tokens.css` | — | 🟢 aditivo, ningún token desaparece | restaurar la copia anterior |
| 8 | Favicon a un asset existente | las 2 superficies web | — | 🟢 | revertir |
| 9 | Duplicados de assets a `archive/` | `assets/isotipo-*-hash.svg`, `assets/exports/` | — | 🟡 puede haber piezas externas enlazando esos nombres | están en `archive/`, no borrados: se restauran moviéndolos de vuelta |

**Criterio de salida de la fase 1:** cero fallos AA duros, cero valores pre-v2.2 en el sitio, toda pieza con procedencia declarada, y B1/B2/B3 respondidas.

---

## Fase 2 — Adopción (semanas 2-6)

| # | Cambio | Archivos | Depende de | Riesgo | Rollback |
|---|---|---|---|---|---|
| 10 | Archivar el sitio no elegido, con sello de fecha | `archive/` | 1-9, B1 | 🟢 | mover de vuelta |
| 11 | Aplicar la regla del Ember: cifras a `--t1`, tags y pasos a `--t3`, barras a `--border`, quitar `.accent` del titular | sitio de producción | 10 | 🟡 alto en percepción, bajo en técnica | revertir por selector; comparación visual sección por sección |
| 12 | Retirar de la tabla de excepciones lo que quede sin consumidor (Azul Medianoche, según B2) | `README.md`, `v2-tokens.css` | B2, 11 | 🟡 si el azul se conserva, hay que anotar **qué archivo** lo consume | revertir; los tokens son aditivos |
| 13 | `:focus-visible`, `prefers-reduced-motion` y estados que no dependan solo de color | sitio de producción | 10 | 🟢 solo agrega | revertir commit |
| 14 | `components.css` mínimo, importado desde `styles.css`, adoptado en una sola superficie | nuevo archivo + `styles.css` | 11 | 🟡 colisión de nombres con clases ya escritas en 3 superficies | no importarlo; el archivo queda inerte hasta que se adopte |
| 14b | **D-I** — contenedores a filete: fuera radios, fondos de caja y bordes por bloque; más aire vertical | sitio de producción | 11 | 🟡 el contenido denso pierde su agrupador visual: si el espacio no crece, se lee como muro | revertir por selector; probar primero en dos secciones (una densa, una ligera) antes de propagar |
| 14c | **D-F** — Ember a bloque: eyebrows a `--t3`, CTA como campo con tinta encima, se conserva la barra de 3-4px | sitio de producción + piezas fijas | 14b | 🟡 desaparece el recurso más repetido del sistema; las piezas se ven más secas | revertir; es CSS, no assets |
| 14d | **D-E** — superficies de lectura a modo claro, escenario en Deep Ink | sitio, manual, propuestas, footer | 14b, 14c | 🟠 la paleta clara existe y está verificada, pero ninguna pieza de lectura está construida sobre ella | migrar una superficie completa primero (el manual, que no es producción) y revisarla impresa antes de tocar el sitio |
| 14e | Reescribir en el manual las reglas 3, 1 y 11, y añadir la regla de filete | `README.md`, `Manual de Marca.html` | 14b, 14c, 14d | 🟢 documental | revertir |

**Criterio de salida de la fase 2:** una sola superficie web gobernada, con la regla 1 cumplida, accesible al teclado, con una capa de componentes que otra superficie pueda adoptar sin copiar CSS, y con el vocabulario de filete y el modo por canal aplicados y documentados.

---

## Fase 3 — Deprecación (semanas 7-8)

| # | Cambio | Archivos | Depende de | Riesgo | Rollback |
|---|---|---|---|---|---|
| 15 | Sustituir el linter de React por verificación de CSS/HTML | `_adherence.oxlintrc.json` o su reemplazo | 14 | 🟡 puede bloquear merges legítimos al principio | correrlo en modo aviso una semana antes de bloquear |
| 16 | Alinear el manual al contrato de tokens (o ampliar el contrato y tokenizar radios y duración) | `Manual de Marca.html`, `v2-tokens.css` | decisión de alcance (P5 de la auditoría) | 🟡 el manual es la pieza que enseña el contrato: un error aquí se propaga | revertir; el manual no es dependencia de ninguna otra pieza |
| 17 | Marcar los alias `--*-light` como retirados en v3.0 | `README.md`, `v2-tokens.css` | 16 | 🟢 solo anuncio | revertir |
| 18 | Separar "decidido" de "ejecutado" en el changelog, con las dos fechas | `README.md` | 1-17 | 🟢 | revertir |

**Criterio de salida de la fase 3:** el changelog describe estado y no intención; las reglas que existen se pueden verificar; y no queda ningún token documentado sin consumidor.

---

## Dependencias en una línea

```
B1,B3 → 2 → 10 → 11 → 12,14 → 15,16 → 17,18
B2 → 6, 12
11 → 14b → 14c → 14d → 14e
1,3,4,5,7,8,9 → sin dependencias (ejecutables hoy)
13 → 10
```

## Qué NO está en este plan

Las tres propuestas de dirección de arte que siguen abiertas — **saturación del acento, display serif, isotipo** — no entran aquí: no tienen decisión tomada. Viven en `brand-art-direction-critique.md`. Si se aprueban después, generan su propio plan; el orden importa, porque D-I y D-E cambian la evidencia sobre la que se decidirían (un sitio de filete en modo claro puede volver innecesario el serif).

Las tres decisiones confirmadas el 2026-09-10 (D-E, D-F, D-I) sí están: pasos 14b a 14e. Van **después** de la remediación técnica a propósito — cambiar el vocabulario visual sobre un sitio que todavía corre con la paleta vieja haría imposible saber qué cambió por qué.

## Verificación al cierre de cada fase

Correr el checklist de QA de la sección 14 del reporte de auditoría sobre las piezas tocadas. Al cerrar la fase 3, volver a correr la auditoría completa: el DSMS solo se mueve con cambios ejecutados, no con decisiones tomadas.
