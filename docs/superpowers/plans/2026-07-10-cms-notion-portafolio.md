# CMS Notion del Portafolio (A0+A1) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Este plan opera sobre Notion vía MCP, no sobre archivos del repo.** Cada paso de mutación tiene su verificación por query SQL. Los checkpoints con Diego son gates bloqueantes: no avanzar sin aprobación explícita.

**Goal:** Convertir la base "SSOT - Portafolio Proyectos" en un CMS operativo con propiedades de control editorial, 27 fichas clasificadas, 5 vistas y taxonomía aprobada.

**Architecture:** CMS plano sobre la base existente (sin bases nuevas) + una auto-relación `Caso maestro`. Doc de taxonomía como contrato bloqueante entre Track A y Track B. Ejecución por lotes con checkpoint de Diego entre cada uno.

**Tech Stack:** Notion MCP (`notion-fetch`, `notion-update-data-source`, `notion-update-page`, `notion-create-pages`, `notion-create-view`, `notion-query-data-sources`).

**Spec:** `docs/superpowers/specs/2026-07-10-cms-notion-portafolio-design.md`

**Referencias Notion:**
- Data source: `collection://88257bc9-e575-45e8-90df-f851f96e92f2`
- Database: `6c3706b517d14cc9843a5b97dd554327`
- Página Scope (padre del doc de taxonomía): `057b1997-7630-4b78-a231-f360ca876a67`
- Plantilla v2: `b50c60baaf7443da90bc09d31cf9d4c4`
- SSOT Identidad (fuente de Capacidades): `acccffe2f2ab4a0a9150445a6acf6fb1`

**Regla transversal:** la propiedad `Objetivo con métrica y timeframe ` tiene un espacio al final en su nombre real. Referenciarla siempre con el espacio.

---

### Task 0: Doc de taxonomía (Lote 0 — gate bloqueante)

**Crea:** página Notion "Taxonomía y jerarquía narrativa · Portafolio" hija del Scope (`057b1997-7630-4b78-a231-f360ca876a67`).

- [ ] **Step 0.1: Validar la lista de Capacidades contra el SSOT de identidad**

Ejecutar `notion-fetch` con `id: acccffe2f2ab4a0a9150445a6acf6fb1`. Contrastar la lista candidata del Step 0.2 contra las capacidades reales del SSOT. Ajustar nombres o sustituir entradas si el SSOT usa otra terminología. Regla del proyecto: no inventar datos; la lista final debe ser defendible desde el SSOT.

- [ ] **Step 0.2: Crear la página de taxonomía**

Ejecutar `notion-create-pages` con `parent: {page_id: "057b1997-7630-4b78-a231-f360ca876a67"}` y este contenido (ajustado por Step 0.1):

```markdown
# Taxonomía y jerarquía narrativa · Portafolio

> **Contrato compartido** entre Track A (Forma) y Track B (Fondo).
> Cualquier cambio aquí impacta al CMS y a la consolidación editorial.
> Estado: Propuesta para aprobación de Diego.

## Capas

| Capa | Criterio | Plantilla |
|---|---|---|
| Insignia | Caso con métrica ancla verificable + evidencia externa + demuestra capacidad ejecutiva de nivel director. Máximo 3. | Versión completa (10 secciones) |
| Soporte | Caso real con resultado, sin el peso de evidencia de Insignia. | Versión corta (4 bloques) |
| Archivo | Fichas de edición fusionadas en un maestro. Historial, no lectura principal. | No se publica; enlazada desde la sección Archivo del maestro |

## Capacidades (lista canónica — máximo 3-4 por caso)

1. Diseño de programas de innovación
2. Dirección de programas y PMO
3. RevOps y automatización
4. Sistemas con AI
5. Innovación abierta y ecosistemas
6. Alianzas estratégicas
7. Capacitación y facilitación ejecutiva
8. Gobernanza y procesos
9. Escalamiento regional

*(Lista validada contra SSOT Identidad el [fecha de ejecución]. No agregar capacidades por caso; si un caso no cabe, se discute aquí.)*

## Opciones canónicas de selects

- **Organización:** HEINEKEN/FEMSA · Tec de Monterrey/INCmty · HackSureste · FlipHouse · Independiente
- **Tipo:** Programa de innovación · Hackathon · Aceleradora · Capacitación · Sistema RevOps/AI · Contenido
- **Canales:** Sitio · LinkedIn · CV · llms.txt

## Jerarquía de lectura

- **10 segundos:** título + métrica ancla + rol + capacidades.
- **2 minutos:** contexto, problema, responsabilidad, sistema, resultados, evidencia.
- **Profundidad:** autopsia y archivo.
(Detalle completo: Plantilla v2.)

## Mapeo Notion → Zod (colección `cases` de Astro)

| Propiedad Notion | Campo Zod | Nota |
|---|---|---|
| title | title | — |
| Organización | organization | — |
| Tipo | industry | Mapeo forzado: Tipo = formato de programa, no sector. Evaluar renombrar a `category` en Sprint 1 |
| Rol de Diego | role | — |
| year | period | — |
| Métrica ancla | metrics[0] | Formato: valor · timeframe · caveat |
| Estado publicación + Publicable | draft | Regla: draft = NOT (Estado = Publicado AND Publicable = Sí) |
| Capa = Insignia | featured | — |
| Evidencia | gallery / links | — |
| Cuerpo de página | body MDX | Fuente narrativa única |

## Mapa de dependencias (cierre de Fase A0)

**Verificado 2026-07-10 contra la base real:**
- Los 4 campos TD:* están vacíos en las 27 fichas. Ninguna herramienta los consume.
- El sitio diegomaury.mx es HTML estático editado a mano; deploy por push a master. No existe sync Notion → sitio.
- **Propiedades intocables: ninguna.** Los TD:* se eliminan.
- Detalles técnicos: (1) `Objetivo con métrica y timeframe ` lleva espacio final en el nombre real; (2) el select Año tiene opción 2025 que year no tiene — migrar antes de deprecar; (3) el checkbox HackSureste está marcado en 6 fichas — verificar su clasificación antes de ocultarlo.

**Conclusión A0:** no hay pipeline activo. El rediseño puede tocar cualquier propiedad. CERRADA.
```

- [ ] **Step 0.3: Verificar creación**

`notion-fetch` de la página creada. Esperado: contenido completo, hija del Scope, hermana de Plantilla v2.

- [ ] **Step 0.4: CHECKPOINT — aprobación de Diego (gate bloqueante)**

Presentar a Diego: link a la página + resumen de la lista de Capacidades. Esperar aprobación explícita. **No ejecutar Task 1 sin ella.** Si Diego pide cambios, aplicarlos en la página y re-presentar.

---

### Task 1: Schema de la base (Lote 1)

**Modifica:** schema del data source `collection://88257bc9-e575-45e8-90df-f851f96e92f2`.

- [ ] **Step 1.1: Crear las 10 propiedades nuevas**

Ejecutar `notion-update-data-source` (o llamadas sucesivas si la herramienta lo requiere) agregando:

| Nombre | Tipo | Opciones |
|---|---|---|
| `Estado publicación` | select | Draft (gray) · En revisión (yellow) · Publicado (green) · Archivado (brown) |
| `Publicable` | checkbox | — |
| `Capa` | select | Insignia (purple) · Soporte (blue) · Archivo (gray) |
| `Canales` | multi_select | Sitio · LinkedIn · CV · llms.txt |
| `Capacidades` | multi_select | Las 9 opciones aprobadas en Task 0 |
| `Métrica ancla` | rich_text | — |
| `Organización` | select | HEINEKEN/FEMSA · Tec de Monterrey/INCmty · HackSureste · FlipHouse · Independiente |
| `Tipo` | select | Programa de innovación · Hackathon · Aceleradora · Capacitación · Sistema RevOps/AI · Contenido |
| `Evidencia` | url | — |
| `Caso maestro` | relation (a la misma base, `collection://88257bc9-...`) | Inversa: `Ediciones` |

**Contingencia:** si `notion-update-data-source` no soporta crear la relación a la misma base, agregar ese paso al runbook manual de Diego (Task 4) y continuar.

- [ ] **Step 1.2: Verificar schema**

`notion-fetch` con `id: collection://88257bc9-e575-45e8-90df-f851f96e92f2`. Esperado: las 10 propiedades presentes con sus tipos y opciones.

- [ ] **Step 1.3: Migrar `Año` → `year`**

1. Query: `SELECT url, title, "Año", "year" FROM "collection://88257bc9-e575-45e8-90df-f851f96e92f2" WHERE "Año" IS NOT NULL`
2. Estado conocido (2026-07-10): 1 ficha (SOFI, Año=2026, year=2026 ya coincide). Si coinciden, no hay nada que migrar. Si aparece un valor 2025: agregar opción `2025` a `year` vía `notion-update-data-source` y luego `notion-update-page` sobre la ficha.
3. Re-query. Esperado: ninguna ficha donde `Año` tenga un valor que `year` no refleje.

- [ ] **Step 1.4: Borrar los 4 campos `TD:*`**

Pre-verificación obligatoria: `SELECT COUNT(*) FROM "collection://88257bc9-..." WHERE "TD:metadata" IS NOT NULL OR "TD:slug" IS NOT NULL OR "TD:page_content" IS NOT NULL OR "TD:page_content_published" IS NOT NULL` → esperado `0`. Solo entonces eliminar las 4 propiedades vía `notion-update-data-source`.

- [ ] **Step 1.5: Renombrar campos deprecados**

Vía `notion-update-data-source`:
- `descripcion` → `[DEPRECADO] descripcion`
- `Descripción` → `[DEPRECADO] Descripción`
- `Descripción del proyecto` → `[DEPRECADO] Descripción del proyecto`
- `Año` → `[DEPRECADO] Año`

(El checkbox `HackSureste` NO se renombra aquí — se hace en Task 2 tras verificar las 6 fichas.)

- [ ] **Step 1.6: Verificar estado final del schema**

`notion-fetch` del data source. Esperado: 10 propiedades nuevas + 4 renombradas `[DEPRECADO]` + `TD:*` ausentes + intactos: `Rol de Diego`, `year`, `logo`, `banner`, `Fondo`, `Objetivo con métrica y timeframe ` (con espacio), `Resultados y acciones clave realizadas`, `Datos cuantitativos`, checkbox `HackSureste`.

- [ ] **Step 1.7: CHECKPOINT — reportar a Diego**

Resumen de cambios de schema. Aprobación antes de Task 2.

---

### Task 2: Clasificación de las 27 fichas (Lote 2)

**Modifica:** valores de propiedades en las 27 páginas de la base.

- [ ] **Step 2.1: Preguntar a Diego por las 4 fichas sueltas**

`AskUserQuestion` (multiSelect por ficha o pregunta única): BRAiN México, FreeLand, G20 YEA Model, Haz que pase - Substack → ¿`Capa = Soporte` o `Capa = Archivo`? (Si Archivo: quedan sin `Caso maestro`, son casos independientes descartados de la lectura principal.)

- [ ] **Step 2.2: Clasificar las 27 fichas**

`notion-update-page` por ficha. Todas: `Estado publicación = Draft`, `Publicable = sin marcar`. Capa y relación según tabla:

| Ficha | Capa | Caso maestro → |
|---|---|---|
| SOFI | Insignia | — |
| HEINEKEN Green Challenge 2019 | Insignia | — |
| HackSureste | Insignia | — |
| REDUX | Soporte | — |
| BTEM 2021 | Soporte | — |
| INCmty B-Challenge 2021 | Soporte | — |
| HEINEKEN Green Challenge 2020 | Archivo | HEINEKEN Green Challenge 2019 |
| HEINEKEN Green Challenge 2021 | Archivo | HEINEKEN Green Challenge 2019 |
| HEINEKEN Green Challenge 2022 | Archivo | HEINEKEN Green Challenge 2019 |
| HackSureste 2019 | Archivo | HackSureste |
| HackSureste Ciudad del Carmen 2019 | Archivo | HackSureste |
| HackSureste Industria 4.0 | Archivo | HackSureste |
| HackSureste WIRE | Archivo | HackSureste |
| ideaLab by HackSureste | Archivo | HackSureste |
| REDUX Agro | Archivo | REDUX |
| REDUX Energy | Archivo | REDUX |
| BTEM 2022 | Archivo | BTEM 2021 |
| BTEM Training 2023 | Archivo | BTEM 2021 |
| StartUp Training | Archivo | BTEM 2021 |
| B-Challenge 2020 - INC Challenges | Archivo | INCmty B-Challenge 2021 |
| INC Prototype 2021 | Archivo | INCmty B-Challenge 2021 |
| INCmty Accelerator 2021 | Archivo | INCmty B-Challenge 2021 |
| INCmty DisruptAir Challenge 2022 | Archivo | INCmty B-Challenge 2021 |
| BRAiN México | según Step 2.1 | — |
| FreeLand | según Step 2.1 | — |
| G20 YEA Model | según Step 2.1 | — |
| Haz que pase - Substack | según Step 2.1 | — |

- [ ] **Step 2.3: Verificar clasificación completa**

Query: `SELECT COUNT(*) FROM "collection://88257bc9-..." WHERE "Capa" IS NULL OR "Estado publicación" IS NULL` → esperado `0`.
Query: `SELECT title FROM "collection://88257bc9-..." WHERE "Capa" = 'Archivo' AND "Caso maestro" IS NULL` → esperado: solo las sueltas que Diego mandó a Archivo (si alguna).

- [ ] **Step 2.4: Verificar y deprecar el checkbox `HackSureste`**

1. Query: `SELECT title, "Capa" FROM "collection://88257bc9-..." WHERE "HackSureste" = '__YES__'` → esperado: 6 fichas, todas de la familia HackSureste con Capa correcta (Insignia el maestro, Archivo las ediciones).
2. Si correcto: renombrar checkbox → `[DEPRECADO] HackSureste` vía `notion-update-data-source`.
3. Si aparece una ficha fuera de la familia: reportar a Diego antes de deprecar.

- [ ] **Step 2.5: CHECKPOINT — reportar a Diego**

Tabla final de clasificación. Aprobación antes de Task 3.

---

### Task 3: Vistas (Lote 3)

**Crea:** 5 vistas en la database `6c3706b517d14cc9843a5b97dd554327`.

- [ ] **Step 3.1: Crear las 5 vistas**

`notion-create-view` por vista:

| Vista | Tipo | Config |
|---|---|---|
| Tablero editorial | board | Agrupar por `Estado publicación` |
| Insignia | gallery | Filtro `Capa = Insignia` |
| Soporte | list | Filtro `Capa = Soporte` |
| Deuda de verificación | table | Filtro `Publicable = No` AND `Estado publicación ≠ Archivado`; columnas visibles: title, Capa, Métrica ancla, Evidencia, Estado publicación |
| Ediciones por maestro | table | Filtro `Capa = Archivo`; agrupar por `Caso maestro` |

En todas: ocultar las propiedades `[DEPRECADO]*`.

**Contingencia:** si `notion-create-view` no soporta agrupación o algún filtro, crear la vista con lo soportado y agregar el ajuste al runbook manual (Task 4).

- [ ] **Step 3.2: Verificar**

`notion-fetch` de la database → las 5 vistas existen. Revisión visual de Diego en Notion (los filtros se validan mejor a ojo).

- [ ] **Step 3.3: CHECKPOINT — reportar a Diego**

Links a las vistas. Aprobación antes de Task 4.

---

### Task 4: Template manual + cierre (Lote 4)

- [ ] **Step 4.1: Entregar runbook a Diego**

Mensaje en chat (no otro documento) con los pasos manuales:

```
Runbook — Template Plantilla v2 (~5 min):
1. Abrir la base SSOT - Portafolio Proyectos → botón "New" → ▾ → "+ New template".
2. Nombrar el template: "Caso maestro (Plantilla v2)".
3. Copiar la estructura de secciones desde la página Plantilla v2
   (notion.so → b50c60baaf7443da90bc09d31cf9d4c4): encabezado, contexto,
   problema, mi responsabilidad, sistema construido, trade-offs, resultados,
   bloque de evidencia ✔/✖ (tabla de 3 columnas: afirmación, estado, artefacto),
   autopsia, archivo.
4. En las propiedades del template, dejar preseleccionado:
   Estado publicación = Draft.
5. Guardar.
[+ pasos de contingencia de Tasks 1/3 si los hubo]
```

- [ ] **Step 4.2: Verificar done de A1**

Cuando Diego confirme el template, correr el checklist del spec:
- Mapa de dependencias aprobado (Task 0) ✓
- Doc de taxonomía aprobado (Task 0) ✓
- 10 propiedades + `TD:*` eliminados + legacy `[DEPRECADO]` (Task 1) ✓
- 27 fichas clasificadas, ediciones enlazadas, checkbox verificado (Task 2) ✓
- 5 vistas (Task 3) ✓
- Template aplicado (Task 4) ✓

- [ ] **Step 4.3: Actualizar CLAUDE.md y commit**

Agregar al CLAUDE.md del repo (sección "Estado del contenido") una línea: CMS Notion A0+A1 completado con fecha, y referencia al spec/plan. Commit:

```bash
git add CLAUDE.md docs/superpowers/plans/2026-07-10-cms-notion-portafolio.md
git commit -m "docs: cierre de fases A0+A1 del CMS Notion del portafolio"
```

- [ ] **Step 4.4: Reportar cierre a Diego**

Resumen final: qué quedó operativo, qué quedó pendiente para B1 (deprecar campos narrativos post-fusión, borrar `[DEPRECADO]*`) y los insumos que B1 espera de Diego (discrepancia SOFI, evidencia por caso Insignia, narrativa 2024-2025).
