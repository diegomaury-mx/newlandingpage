# Spec · CMS Notion del Portafolio (Fases A0 + A1)

**Fecha:** 2026-07-10
**Proyecto padre:** Sistema de Portafolio Profesional (Scope en Notion: `057b1997-7630-4b78-a231-f360ca876a67`)
**Alcance de este spec:** Track A, Fases A0 (verificación del pipeline) y A1 (CMS en Notion). Las fases A2 (front end) y B1 (consolidación editorial) tendrán specs propios.
**Base objetivo:** SSOT - Portafolio Proyectos (data source `collection://88257bc9-e575-45e8-90df-f851f96e92f2`, 27 fichas). No se crean bases nuevas.

## Contexto verificado (2026-07-10)

- Los 4 campos `TD:*` (`TD:metadata`, `TD:slug`, `TD:page_content`, `TD:page_content_published`) están vacíos en las 27 fichas. Diego confirma que son residuo de un intento viejo; nada los consume.
- El sitio LIVE (diegomaury.mx) es HTML estático editado a mano en este repo; deploy por push a `master`. No existe sync Notion → sitio.
- La base tiene triple campo de descripción (`descripcion`, `Descripción`, `Descripción del proyecto`), doble campo de año (`year` poblado en las 27; `Año` solo en 1 ficha), un checkbox suelto `HackSureste` (marcado en 6 fichas), y cero propiedades de control editorial.
- La Plantilla v2 ya existe y está aprobada como contrato compartido: Notion `b50c60baaf7443da90bc09d31cf9d4c4`.
- Existe un schema Zod aprobado para Astro (`src/content/config.ts`, colecciones `cases`, `projects`, `playbooks`, `insights`, `services`) que el CMS debe poder alimentar mecánicamente en el futuro.

### Detalles técnicos verificados (para el mapa de dependencias)

- La propiedad `Objetivo con métrica y timeframe ` tiene **un espacio al final en su nombre real**. Cualquier script o llamada MCP que la referencie debe incluirlo.
- El select `Año` tiene opciones 2025 y 2026; a `year` le falta la opción 2025. Antes de deprecar `Año`: migrar su único valor a `year`, agregando la opción 2025 a `year` si alguna ficha la usa.
- El checkbox `HackSureste` está marcado en 6 fichas. Antes de ocultarlo (Lote 2), verificar que esas 6 queden correctamente clasificadas vía `Organización` y `Caso maestro`.

## Decisiones tomadas en brainstorming

1. **Primer sub-proyecto:** A0 + A1 (base de todo lo demás).
2. **Relación Notion ↔ Astro:** mapeo documentado. Propiedades en español para edición; tabla de mapeo explícita propiedad Notion → campo Zod en el doc de taxonomía.
3. **Campos legacy:** deprecar ahora, borrar tras B1. `TD:*` se borran ya (vacíos, recuperables desde "deleted properties" de Notion).
4. **Ejecución:** Claude vía MCP con checkpoints por lote; el template de la base es paso manual de Diego (limitación del MCP).
5. **Enfoque de modelado:** CMS plano + una auto-relación `Caso maestro` (enfoque B). Sin rollups, sin relaciones a otras bases.

## A0 · Cierre del pipeline

- **Entregable:** sección "Mapa de dependencias" dentro del doc de taxonomía (no un documento aparte, para no alimentar la dispersión documental).
- **Contenido:** qué se verificó (campos `TD:*` vacíos, sitio hand-coded), conclusión (no hay pipeline activo), lista explícita de propiedades intocables = ninguna, los `TD:*` se eliminan, y los detalles técnicos verificados de la sección anterior (espacio final en nombre de propiedad, gap de opciones `year`/`Año`, checkbox `HackSureste`).
- **Done:** la sección existe y Diego la aprueba junto con el doc de taxonomía (Lote 0).

## A1 · Schema: 10 propiedades nuevas

| Propiedad | Tipo | Opciones / formato |
|---|---|---|
| `Estado publicación` | Select | Draft · En revisión · Publicado · Archivado |
| `Publicable` | Checkbox | Guardián: solo se marca cuando el Definition of Done de la Plantilla v2 está en verde |
| `Capa` | Select | Insignia · Soporte · Archivo |
| `Canales` | Multi-select | Sitio · LinkedIn · CV · llms.txt (lista ajustable en el doc de taxonomía) |
| `Capacidades` | Multi-select | Lista canónica del doc de taxonomía (8-10 opciones, máximo 3-4 por caso) |
| `Métrica ancla` | Texto | Formato fijo: `valor · timeframe · caveat` (ej. "+600% registros sureste · ed.1→ed.3 · 2019-2021") |
| `Organización` | Select | HEINEKEN/FEMSA · Tec de Monterrey/INCmty · HackSureste · FlipHouse · Independiente (lista ajustable) |
| `Tipo` | Select | Programa de innovación · Hackathon · Aceleradora · Capacitación · Sistema RevOps/AI · Contenido |
| `Evidencia` | URL | Artefacto principal del bloque ✔/✖ |
| `Caso maestro` | Relación (misma base) | Ediciones → su maestro; inversa automática `Ediciones` |

## A1 · Depuración de campos existentes

| Campo | Acción | Cuándo |
|---|---|---|
| `TD:metadata`, `TD:slug`, `TD:page_content`, `TD:page_content_published` | Borrar (vacíos) | A1, Lote 1 |
| `descripcion`, `Descripción`, `Descripción del proyecto` | Renombrar con prefijo `[DEPRECADO]` y ocultar de vistas. La fuente narrativa única es el cuerpo de página (regla de Plantilla v2) | Deprecar en A1 · borrar tras B1 |
| `Año` | Migrar su valor a `year` (agregando opción 2025 a `year` si hace falta), luego renombrar `[DEPRECADO]` y ocultar | Deprecar en A1 · borrar tras B1 |
| Checkbox `HackSureste` | Renombrar `[DEPRECADO]` y ocultar, solo tras verificar en Lote 2 que las 6 fichas marcadas quedaron bien clasificadas | Deprecar en A1 (Lote 2) · borrar tras B1 |
| `Objetivo con métrica y timeframe ` (con espacio final), `Resultados y acciones clave realizadas`, `Datos cuantitativos` | Quedan visibles durante B1 (insumo de la fusión); se deprecan al cerrar B1 | Post-B1 |
| `Rol de Diego`, `year`, `logo`, `banner`, `Fondo` | Se quedan | — |

## Mapeo Notion → Zod (va como tabla en el doc de taxonomía)

> **Diseño TO-BE (Sprint 1 Astro, sin implementar).** Define cómo el CMS alimentará las Content Collections cuando Astro se active. Hoy no existe ningún sync; no leer como estado actual.

| Propiedad Notion | Campo Zod (`cases`) | Nota |
|---|---|---|
| `title` | `title` | — |
| `Organización` | `organization` | — |
| `Tipo` | `industry` | **Mapeo semánticamente forzado:** `Tipo` clasifica formato de programa, no sector. En A2/Sprint 1 no asumir que `industry` significa sector económico; evaluar renombrar el campo Zod a `category` |
| `Rol de Diego` | `role` | — |
| `year` | `period` | — |
| `Métrica ancla` | `metrics[0]` | — |
| `Estado publicación` + `Publicable` | `draft` | **Regla explícita:** `draft = NOT (Estado publicación = Publicado AND Publicable = Sí)`. Cualquier otra combinación produce `draft: true` |
| `Capa = Insignia` | `featured` | — |
| `Evidencia` | `gallery` / links | — |
| Cuerpo de página | body MDX | — |

## A1 · Clasificación inicial de las 27 fichas

En A1 no se fusiona nada (eso es B1). Solo se etiqueta cada ficha con `Estado publicación` + `Capa` según su destino y las ediciones se enlazan a su futura ficha maestra vía `Caso maestro`.

| Familia | Ficha que se promoverá a maestro (en B1) | Capa propuesta | Ediciones → Archivo |
|---|---|---|---|
| SOFI | SOFI (ya es única) | Insignia | — |
| HEINEKEN GC | HGC 2019 (o nueva en B1) | Insignia | HGC 2020, 2021, 2022 |
| HackSureste | "HackSureste" (2018, la base) | Insignia | HS 2019, Cd. del Carmen, Industria 4.0, WIRE, ideaLab |
| REDUX | "REDUX" | Soporte | REDUX Agro, REDUX Energy |
| BTEM/StartUp | BTEM 2021 | Soporte | BTEM 2022, BTEM Training 2023, StartUp Training |
| INCmty Challenges | INCmty B-Challenge 2021 | Soporte | B-Challenge 2020, INC Prototype 2021, INCmty Accelerator 2021, DisruptAir 2022 |
| Sueltas | BRAiN México, FreeLand, G20 YEA Model, Haz que pase - Substack | Decisión editorial de Diego en checkpoint 2 (Soporte o Archivo) | — |

Reglas:
- Todas las fichas arrancan con `Estado publicación = Draft` y `Publicable = No`.
- Nada se marca Publicado en este proyecto: publicar es decisión de Diego en la fase de Convergencia.
- Las fichas destinadas a Archivo se marcan `Capa = Archivo` desde A1; su `Estado publicación` pasa a Archivado solo cuando exista su caso maestro (B1).

## A1 · Vistas (5)

1. **Tablero editorial** — board agrupado por `Estado publicación`
2. **Insignia** — galería, filtro `Capa = Insignia`
3. **Soporte** — lista, filtro `Capa = Soporte`
4. **Deuda de verificación** — tabla, filtro `Publicable = No` **y** `Estado publicación ≠ Archivado`
5. **Ediciones por maestro** — tabla agrupada por `Caso maestro`, filtro `Capa = Archivo` (verifica el gate de B1 con un filtro)

## A1 · Doc de taxonomía (contrato compartido A/B)

Página Notion hija del Scope, hermana de la Plantilla v2. Contiene:
- Definición y criterio de cada Capa (Insignia / Soporte / Archivo).
- Lista canónica de Capacidades (8-10, propuestas por Claude desde el SSOT de identidad `acccffe2f2ab4a0a9150445a6acf6fb1`, aprobadas por Diego).
- Opciones canónicas de `Organización`, `Tipo` y `Canales`.
- Jerarquía de lectura 10 segundos / 2 minutos / profundidad (referencia a Plantilla v2).
- Tabla de mapeo Notion → Zod, incluyendo la regla de `draft` y la nota sobre `Tipo → industry`.
- Sección "Mapa de dependencias" que cierra A0 (incluye los detalles técnicos verificados).

## A1 · Template de la base

El MCP de Notion no puede crear templates de página de una base. Paso manual de Diego (~5 min) con mini-runbook: crear el template en la base y copiar la estructura desde la página de especificación de Plantilla v2 (`b50c60baaf7443da90bc09d31cf9d4c4`).

## Ejecución con checkpoints

| Lote | Contenido | Gate |
|---|---|---|
| 0 | Doc de taxonomía (incluye cierre A0) | Aprobación de Diego (contrato con B1) |
| 1 | Schema: crear 10 propiedades, borrar `TD:*`, migrar `Año` → `year`, renombrar deprecados | Checkpoint |
| 2 | Clasificación: Estado/Capa/relaciones en 27 fichas + decisión sobre las 4 sueltas + verificación de las 6 fichas con checkbox `HackSureste` antes de ocultarlo | Checkpoint |
| 3 | Vistas (5) | Checkpoint |
| 4 | Template manual (Diego, con runbook) | Done de A1 |

## Definition of Done (A0 + A1)

- [ ] Sección "Mapa de dependencias" aprobada (cierra A0).
- [ ] Doc de taxonomía aprobado por Diego.
- [ ] Las 10 propiedades de control existen; `TD:*` eliminados; `Año` migrado a `year`; legacy renombrado `[DEPRECADO]`.
- [ ] Ninguna ficha sin `Capa` ni `Estado publicación`; ediciones enlazadas a su maestro; las 6 fichas del checkbox `HackSureste` verificadas.
- [ ] Las 5 vistas funcionan.
- [ ] Template de Plantilla v2 aplicado en la base.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Borrado accidental de datos al depurar campos | Solo se borran los `TD:*` (vacíos); todo lo demás se renombra. Propiedades borradas son recuperables desde "deleted properties" |
| Pérdida del valor único de `Año` | Migración explícita a `year` antes de deprecar (Lote 1) |
| Sobre-ingeniería del CMS | Enfoque B limitado: una sola relación, sin rollups ni fórmulas |
| Taxonomía cambia después de arrancar B1 | El doc de taxonomía es gate bloqueante (Lote 0); cambios posteriores requieren aprobación explícita en ambos tracks |
| Scripts MCP fallan por el espacio final en `Objetivo con métrica y timeframe ` | Documentado en el mapa de dependencias; referenciar siempre con el espacio |
| MCP no puede crear templates | Paso manual documentado con runbook |

## Fuera de alcance de este spec

- Fase A2 (front end): spec propio posterior.
- Fase B1 (fusión editorial de fichas): spec propio; depende de insumos de Diego (discrepancia SOFI, evidencia por caso Insignia, narrativa 2024-2025).
- Publicación: fase de Convergencia, decisión editorial de Diego.
