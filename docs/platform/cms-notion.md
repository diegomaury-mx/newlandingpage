# CMS Notion del portafolio — estado y operación

Fases **A0 (verificación de pipeline)** y **A1 (CMS)** cerradas el 2026-07-11.

- **Spec:** `docs/superpowers/specs/2026-07-10-cms-notion-portafolio-design.md`
- **Plan de implementación:** `docs/superpowers/plans/2026-07-10-cms-notion-portafolio.md`
- **Base:** `🗂️ SSOT - Portafolio Proyectos` (database `6c3706b517d14cc9843a5b97dd554327`, data source `88257bc9-e575-45e8-90df-f851f96e92f2`) — 27 fichas
- **Contrato de taxonomía:** página Notion `c7f586fbcb894f118b64a53846e99020`

## A0 — resultado

No existe ningún pipeline activo entre Notion y el sitio. Las 4 propiedades `TD:*` estaban vacías en las 27 fichas (residuo de un intento viejo) y el sitio LIVE es HTML editado a mano. Se borraron. No hay campos intocables.

## Schema (10 propiedades nuevas)

| Propiedad | Tipo | Para qué |
|---|---|---|
| `Estado publicación` | select: Draft / En revisión / Publicado / Archivado | ciclo editorial |
| `Publicable` | checkbox | ¿la ficha tiene evidencia suficiente para publicarse? |
| `Capa` | select: Insignia / Soporte / Archivo | jerarquía narrativa |
| `Canales` | multi: Sitio / LinkedIn / CV / llms.txt | dónde se usa la ficha |
| `Capacidades` | multi (9 opciones) | qué capacidad de Diego demuestra |
| `Métrica ancla` | texto | la cifra que sostiene el caso |
| `Organización` | select | HEINEKEN/FEMSA, Tec de Monterrey/INCmty, HackSureste, FlipHouse, Independiente |
| `Tipo` | select | Programa de innovación, Hackathon, Aceleradora, Capacitación, Sistema RevOps/AI, Contenido |
| `Evidencia` | url | liga al respaldo verificable |
| `Caso maestro` | relación consigo misma (inversa: `Ediciones`) | agrupa ediciones bajo su caso maestro |

Propiedades deprecadas (renombradas con prefijo `[DEPRECADO]`, se borran después de la fase B1): `descripcion`, `Descripción`, `Descripción del proyecto`, `Año`, `HackSureste`. La propiedad `Objetivo con métrica y timeframe ` **lleva un espacio final en su nombre real** — hay que referenciarla con el espacio.

## Clasificación actual

4 Insignia (SOFI, HEINEKEN Green Challenge, HackSureste, REDUX), 11 Soporte y 12 Archivo. Las 27 fichas están en `Estado publicación = Draft`.

**Inconsistencia conocida, sin corregir:** `BTEM Training 2023` es capa Archivo, no tiene métrica ancla ni evidencia, y aun así está en `Publicable = Sí`. Las otras 26 están en `No`. Es un dato suelto que ensucia la vista "Deuda de verificación". Pendiente de que Diego confirme si se baja a `No`.

**Regla operativa:** nada pasa a `Publicado` desde este proyecto. Publicar es decisión de Diego en Convergencia, y exige `Evidencia` + `Métrica ancla` verificadas.

## Vistas

| Vista | Tipo | Filtro |
|---|---|---|
| Tablero editorial | board | agrupada por `Estado publicación` |
| Insignia | gallery | `Capa = Insignia` |
| Soporte | list | `Capa = Soporte` |
| Deuda de verificación | table | `Publicable = No` y `Estado ≠ Archivado` |
| Ediciones por maestro | table | `Caso maestro` no vacío, agrupada por `Caso maestro` |

Ninguna vista muestra las propiedades `[DEPRECADO] *`.

## Template de la base (hecho)

El template **`Caso maestro (Plantilla v2)`** ya existe en la base (verificado en el schema el 2026-07-12). Cada caso maestro nuevo se crea desde ahí y nace con el contrato de contenido completo. La API de Notion no permite crear templates, así que lo hizo Diego a mano.

## Fase B1 — Consolidación de contenido (cerrada 2026-07-11)

Los 15 casos publicables (4 Insignia + 11 Soporte) están escritos con la plantilla v2 en el cuerpo de su ficha: encabezado con métrica ancla, contexto, problema, las dos listas de responsabilidad (era / no era), sistema construido, trade-offs, resultados con timeframe y caveat, bloque de evidencia ✔/✖ y autopsia con línea de transferibilidad. Las 12 fichas de Archivo conservan su contenido original.

### Sistema de evidencia (tres grados)

Cada afirmación cuantitativa lleva una fila en el bloque de evidencia. Los artefactos no valen lo mismo:

1. **Institucional** — un tercero lo publica. Informes Anuales 2020 y 2021 del Tecnológico de Monterrey, La Jornada Maya (06/08/2019), página de speakers de Talent Land 2023.
2. **Propio** (`✔ (propio)`) — playlists de YouTube de Diego. Prueban que el evento ocurrió y que él produjo el material, no que la cifra sea correcta.
3. **Sin artefacto** (`✖`) — la fila se muestra igual, nunca se omite.

Estado hoy: 23 afirmaciones en los casos Insignia, 13 con artefacto y 10 sin.

### Correcciones de datos aplicadas contra fuente documental

| Ficha | Decía | Corregido a |
|---|---|---|
| HEINEKEN Green Challenge | 9,905 emprendedores; "5 años"; ~3,000 emprendedores | Cifras por edición del Informe Anual del Tec. El 9,905 no aparece en ninguna fuente y salió del caso |
| REDUX | 200+ personas capacitadas | 400+ universitarios, 111 ideas, 4 regiones (solo edición 2020, Informe 2020 p.176) |
| B-Challenge 2020 | 312 participantes [por verificar] | 383 solicitantes (Informe 2020 p.180) |
| INC Prototype / Accelerator | sin datos; bolsas de premio sin respaldo | 156 y 197 / 152 y 205 (Informes 2020 p.180 y 2021 p.415). Bolsas de $80,000 y $120,000 retiradas |

REDUX se promovió de Soporte a Insignia: es el caso con mejor evidencia del portafolio.

### Pendientes de Diego (bloquean el gate de Convergencia)

Solo las fichas **Insignia** necesitan métrica ancla y evidencia verificadas. Una ficha de **Soporte** puede vivir sin métrica ancla: FreeLand declara "Sin cifras registradas" en la suya y eso es correcto, porque el problema sería fingir que la tiene, no admitir que no.

- **El +600% del sureste** tiene línea base documentada (35 propuestas antes de 2019, La Jornada Maya) pero falta la cifra final.
- **REDUX**: falta la captura del directorio de metodologías del Tec.

**SOFI no está en esta lista.** No tiene artefacto (los dashboards están bajo NDA), pero el plan `docs/superpowers/plans/2026-07-11-artefactos-evidencia-sofi.md` existe justamente para generarlo desde el sistema real. Es trabajo en curso, no un insumo que Diego deba entregar.

## Fase A2 — Diseño front end (en manos de Diego)

El prototipo lo construye Diego en Claude Design. El brief de handoff vive en Notion (`39a0fe3c51c581ba821ff977fb5946a4`, hijo de la página de Scope) e incluye los tokens del DS v2 "Ember on Ink", la estructura de las 3 vistas, el contenido real, el sistema de evidencia de tres grados y el checklist de QA visual.

Tesis de diseño: el estado de evidencia viaja pegado a cada cifra, y el home publica el contador honesto de afirmaciones con y sin artefacto.

## Mapeo a Astro (diseño TO-BE, sin implementar)

El mapeo Notion → Zod (`src/content/config.ts`) está documentado en el spec. Es diseño para el Sprint 1 de Astro; **hoy no existe sincronización de ningún tipo**. Regla derivada clave: `draft = NOT (Estado publicación = Publicado AND Publicable = Sí)`.

**Contrato completo (2026-07-19):** el mapeo de arriba solo cubre `cases`. El contrato de datos que incluye las 3 fuentes confirmadas de Diego CMS (`SSOT - Portafolio Proyectos`, `Copy Oficial · diegomaury.mx (SSOT)`, `Métricas oficiales — Portafolio D`) — con tipos, defaults, regla de publicación y tratamiento de evidencia por fuente — vive en `docs/platform/notion-astro-contract.md`. Ese documento también corrige el schema `cases` propuesto originalmente en `src/content/config.ts` (los campos `context`/`challenge`/`objectives[]` no existen como tales en la base real).
