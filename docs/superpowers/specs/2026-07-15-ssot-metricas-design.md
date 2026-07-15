# Spec: SSOT de Métricas — Portafolio D

**Fecha:** 2026-07-15
**Estado:** Diseño aprobado por Diego (pendiente plan de implementación)
**Problema:** las métricas del portafolio viven copiadas a mano en index.html, 4 casos, llms.txt/llms-full.txt, las maquetas de Notion y las fichas del CMS. Cada corrección de cifra obliga a editar N superficies, y cada borrador nuevo de copy nace con cifras congeladas que se desactualizan. Además, las cifras muertas (documentadas en CLAUDE.md) solo se detectan si alguien recuerda la lista.

**Solución:** una base maestra de métricas en Notion; los borradores referencian métricas por slug (placeholder), nunca por valor literal; el sitio publicado declara sus métricas con `data-metric` y un script bloqueante las verifica contra un espejo generado en el repo antes de cada publicación.

## Decisiones tomadas (2026-07-15, con Diego)

1. **Fuente maestra:** base nueva de Notion + espejo generado en el repo.
2. **Alcance:** todas las superficies (maquetas Notion con placeholders + verificación del sitio y llms).
3. **Enforcement:** script bloqueante que se corre antes del push (no hook automático, no verificación solo-manual).
4. **Modelo Notion:** base dedicada nueva, no extensión del SSOT - Portafolio Proyectos.

## 1. Base Notion "📊 Métricas oficiales — Portafolio D" (maestra)

Base nueva en el hub Portafolio D (`2db0fe3c51c5805dabc7d220b38ce405`). Una fila = una métrica.

| Propiedad | Tipo | Descripción | Ejemplo (RODI) |
|-----------|------|-------------|----------------|
| Métrica | title | Nombre legible | RODI SOFI |
| Slug | text | Identificador estable, kebab-case, **nunca cambia** una vez creado | `rodi-sofi` |
| Valor | text | El valor publicable, con su formato exacto (+, %, ~, comas) | `+1,291%` |
| Calificador obligatorio | text | Lo que SIEMPRE debe acompañar al valor al publicarse | cost-avoidance modelado, 2025-2026 |
| Entidad/Programa | select | SOFI/FlipHouse · HEINEKEN GC · INCmty · HackSureste · REDUX · Transversal | SOFI / FlipHouse |
| Timeframe | text | Periodo que cubre la cifra | 2025-2026 |
| Grado de evidencia | select | `published` (tercero nombrado) · `own` (registros propios o estimación) | own |
| Fuente | text | Artefacto, documento o "metodología a solicitud" | metodología a solicitud |
| Estado | select | `Vigente` · `Retirada` · `Condicionada` | Vigente |
| Nota de uso | text | Restricciones de publicación | nunca presentar como ahorro realizado |
| Ficha relacionada | relation | → SSOT - Portafolio Proyectos (`88257bc9-e575-45e8-90df-f851f96e92f2`) | ficha SOFI |

Reglas del modelo:

- **Las cifras muertas viven en la base como `Retirada`**: 9,905 atribuido a HEINEKEN, bolsas de $80,000 y $120,000, "200+ capacitados" de REDUX, "5 ediciones", "32 estados", "36 registros" como baseline (la baseline documentada son 35 propuestas, La Jornada Maya). Su presencia en la base es lo que permite acusarlas mecánicamente.
- **`Condicionada`** cubre cifras que solo pueden publicarse con su condición cumplida (ej. 9,905 solo como "Participantes inscritos, programas INCmty agregados, estimado"). La condición vive en Nota de uso.
- El seed inicial son ~15 métricas: las vigentes del sitio actual (banda del hero, Selected Work, casos) + las retiradas del CLAUDE.md.

## 2. Espejo en el repo: `assets/data/metrics.json`

- Generado desde la base Notion por Claude (vía MCP) en cada sesión de publicación. Incluye `generatedAt` y todas las filas con todos sus campos.
- **No alimenta el HTML en runtime.** El sitio sigue siendo estático, con las cifras visibles en el HTML (SEO, LLMs, no-JS). El espejo existe para verificación y para resolver placeholders.
- Precedente del patrón: `assets/data/sofi/sofi-metrics.js` (data file generado, valor + método, no se edita a mano).
- Si el espejo está desactualizado respecto a Notion, la sesión de publicación lo re-sincroniza antes de verificar. El archivo se versiona en git como cualquier asset.

## 3. Marcado del sitio: atributo `data-metric`

Cada cifra publicada en HTML se envuelve una sola vez:

```html
<span data-metric="rodi-sofi">+1,291%</span>
```

- Sin cambio visual ni de estilos; solo declara qué métrica es.
- Aplica a `index.html` y `cases/*.html`.
- `llms.txt` y `llms-full.txt` son texto plano sin markup: ahí la verificación es por lista (ver §5).

## 4. Placeholders en maquetas y borradores de Notion

Convención:

- `{{metrica:rodi-sofi}}` → resuelve solo el Valor.
- `{{metrica:rodi-sofi|completo}}` → resuelve Valor + Calificador obligatorio.

Reglas editoriales:

- **Ninguna maqueta o borrador nuevo escribe cifras literales.** Escribe placeholders.
- Al ejecutar una maqueta, Claude resuelve cada placeholder contra la base Notion (o el espejo sincronizado) y **rechaza** los que apunten a métricas `Retirada`, a slugs inexistentes, o que violen la Nota de uso de una `Condicionada`.
- La Maqueta Sitio v2 (`2e0bbf20-7ead-49e8-812c-34032cfda454`) se convierte a placeholders como parte de su reconciliación pendiente contra la remediación de auditoría.

## 5. Verificador bloqueante: `tools/verify-metrics.js`

Script Node sin dependencias externas. Se corre `node tools/verify-metrics.js` desde la raíz antes de cada commit que toque contenido publicable. Claude lo corre siempre en el flujo de publicación; Diego puede correrlo cuando quiera.

Comportamiento:

1. **Match de `data-metric` (bloqueante):** todo elemento `data-metric` en `index.html` y `cases/*.html` debe (a) existir en `metrics.json`, (b) tener su texto igual al Valor del espejo, y (c) estar `Vigente` (o `Condicionada`; en ese caso emite el recordatorio de su Nota de uso). Discrepancia o slug huérfano → exit code 1.
2. **Lista negra (bloqueante):** ninguna cifra con Estado `Retirada` puede aparecer como texto en HTML ni en `llms*.txt`. Aparición → exit code 1 con archivo y línea.
3. **Huérfanas (warning):** números con formato de métrica (porcentajes, cifras con miles, montos) sin `data-metric` en HTML → se listan como advertencia, sin bloquear, para evitar falsos positivos (años, horas, versiones).

Errores del propio script (metrics.json ausente o malformado, HTML ilegible) → exit code 2 con mensaje claro. Nunca pasa en silencio.

## 6. Flujo de publicación resultante

1. Diego edita la métrica **una sola vez** en la base Notion.
2. En la sesión de publicación, Claude sincroniza `assets/data/metrics.json` desde Notion.
3. Si se ejecuta una maqueta: Claude resuelve los placeholders → HTML con `data-metric`.
4. `node tools/verify-metrics.js` → acusa cada lugar del sitio donde quedó la cifra vieja → el diff de actualización es mecánico.
5. Verde → commit + push → entrada en el Changelog de Notion (protocolo existente, sin cambios).

## 7. Testing

`tools/verify-metrics.test.js` con `node:test` (sin instalar nada):

- data-metric coincide con espejo → pasa.
- data-metric con valor distinto al espejo → falla con exit 1.
- data-metric con slug inexistente → falla con exit 1.
- cifra Retirada presente en un fixture HTML y en un fixture llms.txt → falla con exit 1.
- número sin data-metric → warning, exit 0.
- metrics.json ausente → exit 2.

Los fixtures son archivos mínimos en `tools/fixtures/`, no el sitio real.

## 8. Plan de migración (2 sesiones)

**Sesión 1:** crear la base Notion + seed (~15 métricas vigentes y retiradas, validadas contra los SSOT y el CLAUDE.md) + generar el primer `metrics.json` + marcar `index.html` con `data-metric` + escribir `verify-metrics.js` con sus tests + correrlo en verde.

**Sesión 2:** marcar `cases/*.html` + cubrir `llms.txt`/`llms-full.txt` + convertir la Maqueta Sitio v2 a placeholders (junto con su reconciliación contra la remediación REM).

## Fuera de alcance (deliberado)

- Pipeline automático Notion → HTML. El sitio sigue editándose con Claude; el SSOT elimina la copia manual de datos, no la edición de copy.
- Integración con Astro. Cuando llegue Sprint 1, `metrics.json` puede convertirse en Content Collection sin rediseñar este sistema.
- Hook de git automático. Si el script bloqueante resulta insuficiente en la práctica, promoverlo a pre-commit hook es un cambio de una línea, no de diseño.

## Invariantes que este diseño respeta

- No inventar cifras: el seed sale solo de superficies ya remediadas y de los SSOT.
- Las cifras muertas del CLAUDE.md no se resucitan: pasan a la base como `Retirada` (es su forma ejecutable).
- El registro de cambios sigue el protocolo del Changelog — Portafolio D.
