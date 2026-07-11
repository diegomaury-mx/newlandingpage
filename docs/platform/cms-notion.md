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

3 Insignia (SOFI, HEINEKEN Green Challenge 2019, HackSureste), 12 Soporte y 12 Archivo. Las 27 fichas están en `Estado publicación = Draft` y `Publicable = No`.

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

## Runbook: crear el template de la base (manual, ~5 min)

La API de Notion no permite crear templates de base de datos, así que este paso lo hace Diego a mano una sola vez:

1. Abrir la base `🗂️ SSOT - Portafolio Proyectos`.
2. En el botón azul `Nuevo`, desplegar el menú y elegir `Nueva plantilla`.
3. Nombrar la plantilla **`Caso maestro (Plantilla v2)`**.
4. Copiar la estructura de secciones desde la página Notion `Plantilla v2 — Especificación de caso maestro` (`b50c60baaf7443da90bc09d31cf9d4c4`) al cuerpo de la plantilla.
5. Dejar preseteados en la plantilla: `Estado publicación = Draft`, `Publicable = No`, `Capa = Insignia`.
6. Guardar.

A partir de ahí, cada caso maestro nuevo se crea desde esa plantilla y nace con el contrato de contenido completo.

## Mapeo a Astro (diseño TO-BE, sin implementar)

El mapeo Notion → Zod (`src/content/config.ts`) está documentado en el spec. Es diseño para el Sprint 1 de Astro; **hoy no existe sincronización de ningún tipo**. Regla derivada clave: `draft = NOT (Estado publicación = Publicado AND Publicable = Sí)`.
