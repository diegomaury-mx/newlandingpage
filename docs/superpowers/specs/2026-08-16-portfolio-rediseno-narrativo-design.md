# Rediseño narrativo de /portfolio — Spec

**Fecha:** 2026-08-16
**Alcance:** `src/pages/portfolio.astro`, `src/styles/portfolio.css`, `src/content/config.ts`, `src/services/notionLoaders.ts`, `src/utils/parseSiteCopy.ts`, Notion (SSOT casos + Copy Oficial).

## Problema

`/portfolio` se siente como "un montón de datos e información alineados", no como un portafolio real. Causas identificadas por Diego:

1. Exceso de metadata por tarjeta (capacidades, métrica ancla, ✔/✖, conteo de artefactos compiten entre sí).
2. Falta de impacto visual — el texto y los chips compiten con la imagen en vez de dejarla contar la historia.
3. Todo pesa igual — Insignia (featured + 3 chicos) ya tenía jerarquía interna que Diego no quiere: los 4 casos Insignia son de su mismo nivel.
4. La franja "Estado de evidencia" (✔/✖ agregado) se siente a dashboard de auditoría antes de ver una sola pieza de trabajo.
5. Falta narrativa: el listado categoriza (Insignia/Soporte/Archivo) pero no conecta secciones con una voz, como sí hace `index.astro` con sus bloques S1-S8.

## Decisiones de diseño

### 1. Evidencia ✔/✖ sale del listado por completo

Ni conteo agregado ni marca por tarjeta en `/portfolio`. La evidencia se mantiene en las páginas de caso (`[slug].astro`, sin cambios ahí). El copy del hero ("Este portafolio no publica lo que no puede probar, y lo dice en cada cifra") se mantiene tal cual — ahora conecta literal con la franja de cifras del punto 3.

Se elimina de `portfolio.astro`: la sección `.counter` completa, la función `hasEvidence` y todo uso de `tally`/`card__evidence` en el markup.

### 2. Casos Insignia: mismo tratamiento para los 4, sin "featured"

Se elimina el concepto de caso destacado (`featured`/`restInsignia`, y el criterio "primero con evidencia verificada"). Los 4 casos Insignia usan la misma tarjeta: imagen banner a todo ancho, título, organización · año. Sin chips de capacidades, sin métrica ancla, sin evidencia — esos datos viven en la página del caso.

Grid uniforme de 2 columnas (desktop), 1 columna (mobile).

**Orden:** manual, vía nuevo campo en Notion (ver sección Notion abajo). Fallback si el campo falta en algún caso (revisión 2026-08-16, "orden de llegada de Notion" no es estable vía API): ordenar por `year` descendente y luego por `title` alfabético — determinista, sin depender del orden no garantizado que devuelve la API de Notion.

**Pre-flight de banners (menor, revisión 2026-08-16):** las tarjetas Insignia dependen de `banner` para no quedar vacías (ya existe fallback `media-void` en el código actual, se conserva). Antes de publicar el rediseño, verificar que los 4 casos Insignia tengan banner cargado en Notion.

### 3. Franja "Por los números" antes de Insignia

Nueva sección, inmediatamente después del hero y antes de los casos Insignia. Dos filas:

**Fila de catálogo** (se calcula sola del contenido publicado, nunca se edita a mano):
- Proyectos publicados: `insignia.length + soporte.length`
- Organizaciones distintas: tamaño del set de `organization` únicas entre casos publicados
- Campos de expertise: tamaño del set de `capabilities` únicas entre casos publicados
- "7+ años en innovación y ecosistemas": reutiliza el mismo número y sublabel que `index.astro` (`STAT_SUBLABELS[1]`, "7+ en innovación y ecosistemas"). **Corrección tras revisión (2026-08-16): el label NO puede decir "años de trayectoria" a secas** — esa cifra canónica es 10+ (Copy LinkedIn SSOT); 7+ es específico a innovación/ecosistemas. El label debe incluir esa calificación completa, igual que en el home.

**Fila de impacto** (del SSOT de Métricas — `metrics` collection, nunca tipeadas a mano en el `.astro`):
- 2 cifras ancla, tipografía grande: `incmty-participantes-inscritos` (9,905) y `rodi-sofi` (+1,291%)
- 6 cifras de apoyo, tipografía menor: `heineken-proyectos-evaluados`, `hacksureste-participantes`, `heineken-crecimiento-regional`, `fliphouse-leads-crm`, `sofi-cobertura-automatica`, `fliphouse-speed-to-lead`

Todas las cifras se leen de `getCollection('metrics')` por `slug` (mismo patrón que `incmtyMetric` en `index.astro`), no como strings hardcodeados — si una métrica cambia de estado en Notion, se refleja sola.

**Regla de color:** el acento ember se usa solo en el eyebrow "Por los números" (precedente ya aceptado para eyebrows). Los números van en `--t1`/`--t2`, no en ember — con 8 cifras, ponerlas todas en ember rompería la regla de "un solo acento ember por pieza".

**Regla dura de caveat (bloqueante, revisión 2026-08-16):** cada cifra de la fila de impacto renderiza su `mandatoryQualifier`/calificador (texto pequeño bajo el número), sin excepción — no solo las 2 anclas. Es específicamente no negociable para `rodi-sofi`: el Copy LinkedIn SSOT prohíbe mostrar +1,291% sin la nota "cost-avoidance modelado" junto a la cifra, en cualquier tamaño tipográfico. Los mockups ya incluían esta nota como texto secundario bajo cada número — este párrafo lo deja como requisito explícito del spec, no solo del mockup.

**Riesgo de suma implícita (menor):** 3,000+ (HackSureste) y 9,905 (INCmty) están documentados como no acumulables. Mostrarlas en la misma franja es aceptable siempre que cada una traiga su calificador visible (regla del párrafo anterior) — verificar en QA visual que ningún lector podría sumarlas sin ver el matiz.

### 4. Soporte: mismo criterio de siempre, sin evidencia

Se mantiene el formato actual (logo + nombre + organización/año + descripción breve + tags de capacidades), quitando únicamente el indicador ✔/✖ y el conteo de artefactos (`artifactCount` se elimina del archivo — esa función no se usa en ningún otro lado).

### 5. Archivo: sin cambios

El acordeón plegado se mantiene igual.

### 6. Copy narrativo entre secciones (nuevo, vía Notion)

Nuevos bloques en la misma página Notion "Copy Oficial · diegomaury.mx (SSOT)" (columna Versión Actual) que ya alimenta `index.astro`, usando el mismo patrón de heading `# P<n> · <Nombre>`:

| Bloque | Contenido | Borrador (Diego lo edita después) |
|---|---|---|
| P1 · Hero portfolio | Eyebrow + H1 + lede | Igual al copy actual hardcodeado hoy (sin cambios de fondo) |
| P2 · Casos insignia | Eyebrow + H2 de transición | "Casos insignia" / *"No son los casos más grandes. Son los que puedo defender de principio a fin."* |
| P3 · Soporte | Eyebrow + H2 de transición | "Soporte · N proyectos" / *"El resto del registro. Menos protagonismo, la misma disciplina."* |
| P4 · Archivo | Nota del acordeón | "Existen. No se exhiben. Ediciones y variantes de los casos anteriores, conservadas para trazabilidad." (sin cambio de contenido, solo se mueve la fuente) |

Diego confirmó dejar este copy tal cual por ahora — lo edita directamente en Notion cuando lo piense mejor.

**Nota de alcance:** las etiquetas fijas "Por los números" e "Impacto documentado" de la franja de cifras (punto 3) se quedan hardcodeadas en el `.astro` — no son narrativa, son labels estables de sección.

## Cambios técnicos

### `src/utils/parseSiteCopy.ts`
Ampliar `SECTION_HEADING` de `/^# (S\d+b?|SEO) · (.+)$/` a `/^# (S\d+b?|P\d+|SEO) · (.+)$/` para reconocer también los bloques `P1..P4`. Sin otros cambios — `parseSiteCopySections`, `heading1`, `heading2`, `paragraphs` se reusan tal cual.

### `src/content/config.ts`
Agregar campo opcional a la colección `cases`: `insigniaOrder: z.number().optional()` (nombre a confirmar en implementación — debe distinguir claramente que solo aplica a la capa Insignia).

### `src/services/notionLoaders.ts`
`mapCase` lee la nueva propiedad Notion `Orden Insignia` (número) hacia `insigniaOrder`.

### `docs/platform/notion-astro-contract.md`
Documentar: propiedad nueva `Orden Insignia` en la base SSOT de casos; bloques `P1-P4` nuevos en Copy Oficial.

### `src/pages/portfolio.astro`
- Importa `getCollection('siteCopy')` y `getCollection('metrics')`, mismo patrón que `index.astro`.
- Parsea P1-P4 con `parseSiteCopySections` + helpers existentes (`heading1`, `heading2`, `paragraphs`).
- Elimina: `hasEvidence`, `artifactCount`, `featured`/`restInsignia`, sección `.counter`, todo el markup de `tally`/evidencia.
- Agrega: cálculo de cifras de catálogo (Set de organizaciones, Set de capacidades), lookup de las 8 métricas de impacto por slug desde `metrics`.
- Insignia: `insignia.sort()` por `insigniaOrder` (nullish al final), grid uniforme de 2 columnas, tarjeta simplificada (imagen + título + meta).
- Soporte: sin cambios de datos, se quita el bloque de evidencia del markup.

### `src/styles/portfolio.css`
- Quitar estilos de `.counter`, `.card--featured`, `.tally`, `.card__side`, `.card__metric` (evidence-específicos).
- Agregar estilos de franja de cifras (`.stats-row`, `.stat`, `.stat--anchor`) y grid uniforme de Insignia (2 columnas).

## Notion (a cargo de Diego, documentado para referencia)

1. Base "🗂️ SSOT - Portafolio Proyectos": agregar propiedad número `Orden Insignia`, llenar para los 4 casos Insignia (HEINEKEN Green Challenge, REDUX, SOFI, HackSureste).
2. Página "Copy Oficial · diegomaury.mx (SSOT)", columna Versión Actual: agregar bloques `# P1 · Hero portfolio`, `# P2 · Casos insignia`, `# P3 · Soporte`, `# P4 · Archivo` con el borrador de la tabla de arriba.

## Fuera de alcance

- Páginas de caso individuales (`[slug].astro`) — sin cambios, ahí sigue viviendo la evidencia completa.
- Reordenar Soporte o Archivo — se quedan en el orden actual de Notion.
- Cambiar qué cifras del SSOT de Métricas están marcadas como públicas/vigentes — se usan solo las que ya califican hoy.
