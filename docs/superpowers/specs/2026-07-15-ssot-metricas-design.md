# Spec: SSOT de Métricas — Portafolio D

**Fecha:** 2026-07-15 (v2, incorpora los 20 ajustes de Diego del mismo día)
**Estado:** Diseño aprobado por Diego como arquitectura base, con modelo ajustado (pendiente plan de implementación)
**Problema:** las métricas del portafolio viven copiadas a mano en index.html, 4 casos, llms.txt/llms-full.txt, las maquetas de Notion y las fichas del CMS. Cada corrección de cifra obliga a editar N superficies, y cada borrador nuevo de copy nace con cifras congeladas que se desactualizan. Además, las cifras muertas (documentadas en CLAUDE.md) solo se detectan si alguien recuerda la lista.

**Solución:** una base maestra de métricas en Notion; los borradores referencian métricas por slug (placeholder), nunca por valor literal; el sitio publicado declara sus métricas con `data-metric` y un script bloqueante las verifica contra un espejo generado en el repo antes de cada publicación.

**Principio rector (ajuste 19):** priorizar la verificación bloqueante sobre la perfección del modelo. El objetivo inicial es que ninguna cifra incorrecta llegue publicada; el modelo se refina después con uso real.

## Decisiones tomadas (2026-07-15, con Diego)

1. **Fuente maestra:** base nueva dedicada de Notion + espejo generado en el repo. No extender el SSOT de proyectos.
2. **Alcance:** todas las superficies (maquetas Notion con placeholders + verificación del sitio y llms).
3. **Enforcement:** script bloqueante que se corre antes del push (no hook automático, no verificación solo-manual).
4. **Migración:** seed piloto primero (10 métricas), no migrar todo de golpe.
5. **Sin automatización Notion → HTML** hasta que el sistema pruebe estabilidad; edición manual asistida por Claude.

## 1. Base Notion "📊 Métricas oficiales — Portafolio D" (maestra)

Base nueva en el hub Portafolio D (`2db0fe3c51c5805dabc7d220b38ce405`). **Una fila = una cifra** (ajuste 11: nada de claims compuestos como unidad canónica; un claim con dos números son dos filas).

| Propiedad | Tipo | Descripción | Ejemplo (RODI) |
|-----------|------|-------------|----------------|
| Métrica | title | Nombre legible | RODI SOFI |
| Slug | text | Identificador estable, kebab-case, **nunca cambia** una vez creado | `rodi-sofi` |
| Valor | text | El valor publicable, con su formato exacto (+, %, ~, comas) | `+1,291%` |
| Calificador obligatorio | text | Lo que SIEMPRE debe acompañar al valor al publicarse | cost-avoidance modelado, 2025-2026 |
| Claim canónico | text | La frase publicable completa de la métrica, lista para usarse | RODI modelado de +1,291% mediante cost avoidance (payback menor a 1 mes, 2025-2026) |
| Entidad/Programa | select | SOFI/FlipHouse · HEINEKEN GC · INCmty · HackSureste · REDUX · Transversal | SOFI / FlipHouse |
| Timeframe | text | Periodo que cubre la cifra | 2025-2026 |
| Grado de evidencia | select | `published` (tercero nombrado) · `own` (registros propios o estimación) | own |
| URL / Evidencia | url | Enlace al artefacto o documento de respaldo (la fuente no queda solo como texto libre) | — |
| Fuente | text | Descripción del respaldo cuando no hay URL, o "metodología a solicitud" | metodología a solicitud |
| Estado | select | `Vigente` · `Condicionada` · `Retirada` · `En revisión` | Vigente |
| Publicabilidad | select | `Pública` · `Interna` · `A solicitud` · `No publicable` | Pública |
| Superficies permitidas | multi-select | Hero · Caso de estudio · llms.txt · CV · Pitch deck · LinkedIn · Sitio web | Hero, Caso de estudio, llms.txt, Sitio web |
| Riesgo reputacional | select | `Bajo` · `Medio` · `Alto` | Medio |
| Nota de uso | text | Restricciones de publicación | nunca presentar como ahorro realizado |
| Ficha relacionada | relation | → SSOT - Portafolio Proyectos (`88257bc9-e575-45e8-90df-f851f96e92f2`) | ficha SOFI |

Reglas del modelo:

- **Las cifras retiradas viven en la base como `Retirada`, no se borran** (ajuste 10). Son la lista negra verificable: 9,905 atribuido a HEINEKEN, bolsas de $80,000 y $120,000, "200+ capacitados" de REDUX, "5 ediciones", "32 estados", "36 registros" como baseline (la baseline documentada son 35 propuestas, La Jornada Maya).
- **`Condicionada`** cubre cifras que solo pueden publicarse con su condición cumplida (ej. 9,905 solo como "Participantes inscritos, programas INCmty agregados, estimado"). La condición vive en Nota de uso.
- **`En revisión`** cubre cifras cuya evidencia está en proceso de reconstrucción: no se publican mientras estén ahí, pero tampoco son muertas.
- **Publicable = solo `Vigente` o `Condicionada` (con condición cumplida), con `Publicabilidad = Pública`, y solo en sus Superficies permitidas.** Todo lo demás bloquea.

## 2. Modo borrador vs. modo publicable (ajuste 9)

- **Borrador** (maquetas, exploraciones, copys en trabajo): puede contener cifras literales temporalmente. Nadie lo verifica ni bloquea.
- **Publicable** (lo que va a entrar al sitio, llms, o cualquier superficie pública): exige placeholder resuelto desde el SSOT, `data-metric` en HTML, y pasar el verificador.
- La frontera se cruza en el flujo de publicación (§7). **Una maqueta se convierte a placeholders solo cuando entra a flujo de publicación** (ajuste 20), no antes; no hay deuda de convertir borradores históricos que quizá nunca se publiquen.

## 3. Espejo en el repo: `assets/data/metrics.json`

- Generado desde la base Notion por Claude (vía MCP) en cada sesión de publicación. Incluye `generatedAt` y todas las filas con todos sus campos.
- **No es dependencia runtime del sitio** (ajuste 12). El sitio sigue siendo estático, con las cifras visibles en el HTML (SEO, LLMs, no-JS). El espejo existe para verificación y para resolver placeholders.
- Precedente del patrón: `assets/data/sofi/sofi-metrics.js` (data file generado, no se edita a mano).
- Se versiona en git como cualquier asset. Si está desactualizado respecto a Notion, la sesión de publicación lo re-sincroniza antes de verificar.

## 4. Marcado del sitio: atributo `data-metric` (ajuste 13)

Cada cifra publicada en HTML se envuelve una sola vez:

```html
<span data-metric="rodi-sofi">+1,291%</span>
```

- Sin cambio visual ni de estilos; solo declara qué métrica es.
- Aplica a `index.html` y `cases/*.html`.
- `llms.txt` y `llms-full.txt` son texto plano sin markup: ahí la verificación es por lista (§6).

## 5. Placeholders en maquetas de Notion

Convención:

- `{{metrica:rodi-sofi}}` → resuelve solo el Valor.
- `{{metrica:rodi-sofi|completo}}` → resuelve el Claim canónico completo.

Al resolver, Claude rechaza placeholders que apunten a métricas `Retirada`, `En revisión`, `No publicable`/`Interna` para superficie pública, a slugs inexistentes, o cuya superficie destino no esté en Superficies permitidas.

## 6. Verificador bloqueante: `tools/verify-metrics.js`

Script Node sin dependencias externas. Se corre `node tools/verify-metrics.js` desde la raíz antes de cada commit que toque contenido publicable. Claude lo corre siempre en el flujo de publicación; Diego puede correrlo cuando quiera.

Comportamiento:

1. **Match de `data-metric` (bloqueante):** todo elemento `data-metric` en `index.html` y `cases/*.html` debe (a) existir en `metrics.json`, (b) tener su texto igual al Valor del espejo, (c) estar `Vigente` o `Condicionada` con `Publicabilidad = Pública`, y (d) que la superficie donde aparece esté dentro de Superficies permitidas (mapa archivo→superficie: `index.html` hero = Hero, resto de index y casos = Sitio web / Caso de estudio). Discrepancia, slug huérfano, estado no publicable o superficie no permitida → exit code 1.
2. **Calificador cerca del valor (bloqueante, ajuste 14):** si la métrica tiene Calificador obligatorio, el verificador revisa que el texto del calificador (o sus términos clave) aparezca en una ventana de proximidad alrededor del elemento `data-metric` (mismo bloque/contenedor o ±N caracteres en el texto plano). Valor sin su calificador → exit code 1.
3. **Lista negra (bloqueante):** ninguna cifra con Estado `Retirada` puede aparecer como texto en HTML ni en `llms*.txt`. Aparición → exit code 1 con archivo y línea.
4. **Huérfanas (warning):** números con formato de métrica (porcentajes, cifras con miles, montos) sin `data-metric` en HTML → se listan como advertencia, sin bloquear, para evitar falsos positivos (años, horas, versiones).

Errores del propio script (metrics.json ausente o malformado, HTML ilegible) → exit code 2 con mensaje claro. Nunca pasa en silencio.

## 7. SOP de publicación (ajuste 15)

Checklist mínimo, en orden, para toda publicación que toque métricas o copy con métricas:

1. Sincronizar Notion → `assets/data/metrics.json`
2. Resolver placeholders (si se ejecuta una maqueta)
3. Ejecutar `node tools/verify-metrics.js`
4. Corregir discrepancias hasta verde
5. Commit
6. Push
7. Registrar entrada en el Changelog — Portafolio D (protocolo existente)

Este SOP vive también como sección operativa en CLAUDE.md cuando el sistema esté implementado.

## 8. Testing

`tools/verify-metrics.test.js` con `node:test` (sin instalar nada):

- data-metric coincide con espejo y estado publicable → pasa.
- data-metric con valor distinto al espejo → exit 1.
- data-metric con slug inexistente → exit 1.
- data-metric de métrica `Retirada` / `En revisión` / `No publicable` → exit 1.
- data-metric en superficie no permitida → exit 1.
- valor presente sin su calificador obligatorio en proximidad → exit 1.
- cifra Retirada presente en un fixture HTML y en un fixture llms.txt → exit 1.
- número sin data-metric → warning, exit 0.
- metrics.json ausente → exit 2.

Los fixtures son archivos mínimos en `tools/fixtures/`, no el sitio real.

## 9. Migración: seed piloto (ajustes 16-17)

**No se migra todo de golpe.** Sesión 1 = piloto con 10 métricas:

| Slug | Cifra | Estado esperado |
|------|-------|-----------------|
| `rodi-sofi` | +1,291% | Vigente |
| `sofi-cobertura-automatica` | 89.5% | Vigente |
| `sofi-respuesta-sin-asesor` | 74.9% | Vigente |
| `fliphouse-speed-to-lead` | <5 min | Vigente |
| `fliphouse-leads-crm` | +500% | Vigente |
| `heineken-crecimiento-regional` | +600% | Vigente |
| `heineken-proyectos-evaluados` | 3,231 | **A confirmar en el seed**: REM-003 retiró 900+/3,231 de cases/heineken.html por fuente no reconciliable; entra como `En revisión` salvo que la evidencia diga otra cosa |
| `incmty-participantes-inscritos` | 9,905 | Condicionada (solo como "Participantes inscritos, programas INCmty agregados, estimado") |
| `hacksureste-participantes` | 3,000+ | Vigente (estimado, grado own) |
| `redux-200-capacitados-retirada` | 200+ | Retirada (la cifra real documentada es 400+ solo en 2020, Informe Anual Tec) |

Cada valor y estado del seed se valida contra los SSOT y el CLAUDE.md al crearlo; nada se inventa.

**Sesión 1 (piloto):** crear la base + seed de 10 + primer `metrics.json` + marcar `index.html` con `data-metric` + `verify-metrics.js` con tests + correr en verde + SOP documentado.
**Después del piloto (cuando pruebe estabilidad):** resto de métricas, `cases/*.html`, cobertura de `llms*.txt`, y conversión de maquetas conforme entren a flujo de publicación.

## Fuera de alcance (deliberado)

- Pipeline automático Notion → HTML (ajuste 18). El sitio sigue editándose con Claude; el SSOT elimina la copia manual de datos, no la edición de copy.
- Conversión preventiva de maquetas históricas a placeholders (ajuste 20). Solo al entrar a flujo de publicación.
- Integración con Astro. Cuando llegue Sprint 1, `metrics.json` puede convertirse en Content Collection sin rediseñar este sistema.
- Hook de git automático. Si el script bloqueante resulta insuficiente en la práctica, promoverlo a pre-commit hook es un cambio de una línea, no de diseño.

## Invariantes que este diseño respeta

- No inventar cifras: el seed sale solo de superficies ya remediadas y de los SSOT.
- Las cifras muertas del CLAUDE.md no se resucitan: pasan a la base como `Retirada` (es su forma ejecutable).
- El registro de cambios sigue el protocolo del Changelog — Portafolio D.
