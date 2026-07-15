# SSOT de Métricas — Sesión 1 (Piloto) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la base Notion "📊 Métricas oficiales", sembrar 10 métricas piloto, generar el espejo `assets/data/metrics.json`, marcar `index.html` con `data-metric` y dejar corriendo en verde el verificador bloqueante `tools/verify-metrics.js`.

**Architecture:** Notion es la fuente maestra (edición humana); `assets/data/metrics.json` es un espejo versionado que el verificador usa para validar el HTML publicado. El sitio sigue siendo estático: `data-metric` solo declara qué cifra es cada número, sin JS en runtime. Spec: `docs/superpowers/specs/2026-07-15-ssot-metricas-design.md`.

**Tech Stack:** Notion MCP (crear base y filas), Node.js sin dependencias externas, `node:test` para tests. Sitio HTML estático.

**Reglas transversales de esta sesión:**
- **No inventar cifras.** Todo Valor sale del sitio ya remediado (verificado con grep) o del CLAUDE.md. Si un valor del sitio difiere de lo esperado, DETENERSE y confirmar con Diego antes de sembrar.
- El registro final en el Changelog de Notion es parte del trabajo (Task 12), no un extra.
- Commits frecuentes; mensajes en formato `<type>: <descripción>` sin atribución.

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `assets/data/metrics.json` (crear) | Espejo del SSOT: array de métricas con todos los campos |
| `tools/verify-metrics.js` (crear) | Módulo verificador + CLI. Exporta funciones puras; `require.main` ejecuta el CLI |
| `tools/verify-metrics.test.js` (crear) | Tests con `node:test`; importan el módulo directamente |
| `tools/fixtures/metrics-ok.json` (crear) | Fixture de espejo válido para tests |
| `tools/fixtures/metrics-malformado.json` (crear) | Fixture de JSON roto |
| `index.html` (modificar) | Envolver las cifras del seed presentes con `data-metric` |
| `CLAUDE.md` (modificar) | Sección SOP de publicación de métricas |

---

### Task 1: Inventario de valores exactos en el sitio

Antes de sembrar nada, capturar el string EXACTO con el que cada métrica del seed aparece hoy en `index.html` (el sitio ya está remediado; es la referencia de formato).

**Files:** ninguno (solo lectura).

- [ ] **Step 1: Localizar cada cifra del seed en index.html**

Correr estos grep desde la raíz y anotar línea y texto exacto:

```bash
grep -n "1,291" index.html
grep -n "89.5" index.html
grep -n "74.9" index.html
grep -n "5 minutos\|<5 min" index.html
grep -n "+500%" index.html
grep -n "+600%" index.html
grep -n "3,231" index.html
grep -n "9,905" index.html
grep -n "3,000" index.html
grep -n "200+" index.html
```

- [ ] **Step 2: Interpretar resultados contra lo esperado**

Esperado según la remediación (2026-07-12/13):
- `+1,291%`, `89.5%`, `74.9%`, `+500%`, `+600%`, `9,905`, `3,000+`: presentes.
- `3,231`: si aparece en index.html es un HALLAZGO (REM-003 lo retiró de cases/heineken.html por fuente no reconciliable) → reportar a Diego, NO marcarlo con data-metric.
- `200+` capacitados: NO debe aparecer (cifra muerta). Si aparece → reportar a Diego de inmediato.

Registrar en una tabla local (slug → texto exacto → línea) que usan las Tasks 3, 4 y 11. Si algún valor difiere del esperado, DETENERSE y confirmar con Diego.

---

### Task 2: Crear la base Notion "📊 Métricas oficiales — Portafolio D"

**Files:** ninguno (Notion vía MCP).

- [ ] **Step 1: Crear la database**

Con `mcp__claude_ai_Notion__notion-create-database` (cargar vía ToolSearch si está deferred), parent = página `Portafolio D` (`2db0fe3c51c5805dabc7d220b38ce405`). Título: `📊 Métricas oficiales — Portafolio D`. Propiedades exactas:

| Propiedad | Tipo | Opciones |
|-----------|------|----------|
| `Métrica` | title | — |
| `Slug` | rich_text | — |
| `Valor` | rich_text | — |
| `Calificador obligatorio` | rich_text | — |
| `Claim canónico` | rich_text | — |
| `Entidad/Programa` | select | `SOFI / FlipHouse`, `HEINEKEN GC`, `INCmty`, `HackSureste`, `REDUX`, `Transversal` |
| `Timeframe` | rich_text | — |
| `Grado de evidencia` | select | `published`, `own` |
| `URL / Evidencia` | url | — |
| `Fuente` | rich_text | — |
| `Estado` | select | `Vigente`, `Condicionada`, `Retirada`, `En revisión` |
| `Publicabilidad` | select | `Pública`, `Interna`, `A solicitud`, `No publicable` |
| `Superficies permitidas` | multi_select | `Hero`, `Caso de estudio`, `llms.txt`, `CV`, `Pitch deck`, `LinkedIn`, `Sitio web` |
| `Riesgo reputacional` | select | `Bajo`, `Medio`, `Alto` |
| `Nota de uso` | rich_text | — |
| `Ficha relacionada` | relation → data source `88257bc9-e575-45e8-90df-f851f96e92f2` (SSOT - Portafolio Proyectos) | — |

- [ ] **Step 2: Verificar el schema creado**

`notion-fetch` de la database recién creada. Confirmar que las 16 propiedades existen con los nombres EXACTOS de la tabla (incluidos espacios y mayúsculas). Anotar el `collection://<data_source_id>` para las Tasks 3 y 12.

---

### Task 3: Seed de las 10 métricas piloto

**Files:** ninguno (Notion vía MCP).

- [ ] **Step 1: Crear las 10 filas con `notion-create-pages`** (parent = data_source_id de Task 2)

Valores canónicos (los `Valor` se ajustan al texto exacto capturado en Task 1; lo de abajo es lo esperado):

| Slug | Valor | Estado | Publicabilidad | Calificador obligatorio | Grado | Riesgo | Superficies |
|------|-------|--------|----------------|--------------------------|-------|--------|-------------|
| `rodi-sofi` | `+1,291%` | Vigente | Pública | cost-avoidance modelado, 2025-2026 | own | Medio | Hero, Caso de estudio, Sitio web, llms.txt |
| `sofi-cobertura-automatica` | `89.5%` | Vigente | Pública | sobre 191 leads, 2025-2026 | own | Bajo | Hero, Caso de estudio, Sitio web, llms.txt |
| `sofi-respuesta-sin-asesor` | `74.9%` | Vigente | Pública | sin intervención del asesor, 2025-2026 | own | Bajo | Caso de estudio, Sitio web, llms.txt |
| `fliphouse-speed-to-lead` | `menos de 5 minutos` | Vigente | Pública | de días a minutos, 2025-2026 | own | Bajo | Caso de estudio, Sitio web, llms.txt |
| `fliphouse-leads-crm` | `+500%` | Vigente | Pública | leads al CRM, 2025-2026 | own | Bajo | Caso de estudio, Sitio web, llms.txt |
| `heineken-crecimiento-regional` | `+600%` | Vigente | Pública | registros ed. 1 a ed. 3, 2019-2021 | own | Medio | Hero, Caso de estudio, Sitio web, llms.txt |
| `heineken-proyectos-evaluados` | `3,231` | **En revisión** | No publicable | — | own | Alto | (ninguna) |
| `incmty-participantes-inscritos` | `9,905` | **Condicionada** | Pública | Participantes inscritos, programas INCmty agregados, estimado | own | Alto | Hero, Sitio web, llms.txt |
| `hacksureste-participantes` | `3,000+` | Vigente | Pública | estimado, no acumulable con INCmty | own | Medio | Caso de estudio, Sitio web, llms.txt |
| `redux-200-capacitados-retirada` | `200+ capacitados` | **Retirada** | No publicable | — | — | Alto | (ninguna) |

Campos comunes: `Claim canónico` = frase publicable completa (redactarla desde el copy vigente del sitio, Task 1); `Timeframe` y `Entidad/Programa` según tabla del spec; `Fuente` con el respaldo conocido (ej. redux: "La cifra real documentada es 400+ solo en 2020, Informe Anual Tec"); `URL / Evidencia` vacío si no hay artefacto con URL (no inventar); `Nota de uso` con las restricciones del CLAUDE.md (ej. rodi-sofi: "nunca presentar como ahorro realizado ni como bloqueado por NDA"; incmty: "NUNCA atribuir a HEINEKEN ni a HGC").

- [ ] **Step 2: Verificación cruzada**

Query SQL a la base (`notion-query-data-sources`): `SELECT Slug, Valor, Estado, Publicabilidad FROM <collection> ORDER BY Slug`. Confirmar 10 filas, slugs únicos, estados correctos. Corregir con `notion-update-page` si algo salió mal.

---

### Task 4: Espejo `assets/data/metrics.json`

**Files:**
- Create: `assets/data/metrics.json`

- [ ] **Step 1: Escribir el espejo desde la base**

Estructura exacta (el array completo lleva las 10 métricas; se muestran dos de ejemplo — los valores reales salen de la base de Task 3):

```json
{
  "generatedAt": "2026-07-15",
  "source": "collection://<data_source_id de Task 2>",
  "metrics": [
    {
      "slug": "rodi-sofi",
      "nombre": "RODI SOFI",
      "valor": "+1,291%",
      "calificador": "cost-avoidance modelado, 2025-2026",
      "calificadorClaves": ["modelado"],
      "claim": "RODI +1,291% mediante un modelo de cost avoidance (payback menor a 1 mes, 2025-2026).",
      "entidad": "SOFI / FlipHouse",
      "timeframe": "2025-2026",
      "grado": "own",
      "estado": "Vigente",
      "publicabilidad": "Pública",
      "superficies": ["Hero", "Caso de estudio", "Sitio web", "llms.txt"],
      "riesgo": "Medio",
      "notaUso": "Nunca presentar como ahorro realizado ni como bloqueado por NDA.",
      "patronProhibido": null
    },
    {
      "slug": "redux-200-capacitados-retirada",
      "nombre": "REDUX 200+ capacitados (retirada)",
      "valor": "200+ capacitados",
      "calificador": "",
      "calificadorClaves": [],
      "claim": "",
      "entidad": "REDUX",
      "timeframe": "",
      "grado": "own",
      "estado": "Retirada",
      "publicabilidad": "No publicable",
      "superficies": [],
      "riesgo": "Alto",
      "notaUso": "La cifra documentada es 400+ solo en 2020 (Informe Anual Tec). No resucitar.",
      "patronProhibido": "200\\+\\s*(capacitados|personas capacitadas)"
    }
  ]
}
```

Notas de campo:
- `calificadorClaves`: lista de substrings (minúsculas) que DEBEN aparecer cerca del valor en el HTML. Derivar 1-2 términos distintivos del calificador (ej. `rodi-sofi` → `["modelado"]`; `incmty-participantes-inscritos` → `["inscritos", "estimado"]`). Métricas sin calificador → `[]`.
- `patronProhibido`: solo para `Retirada`. Regex string que evita falsos positivos; si es `null` se usa el `valor` literal escapado.

- [ ] **Step 2: Validar el JSON**

Run: `node -e "const m=require('./assets/data/metrics.json'); console.log(m.metrics.length)"`
Expected: `10`

- [ ] **Step 3: Commit**

```bash
git add assets/data/metrics.json
git commit -m "feat(ssot): espejo inicial metrics.json con seed piloto de 10 metricas"
```

---

### Task 5: Verificador — carga del espejo (TDD)

**Files:**
- Create: `tools/verify-metrics.js`
- Create: `tools/verify-metrics.test.js`
- Create: `tools/fixtures/metrics-ok.json`
- Create: `tools/fixtures/metrics-malformado.json`

- [ ] **Step 1: Crear fixtures**

`tools/fixtures/metrics-ok.json` (espejo mínimo válido para tests; independiente del real):

```json
{
  "generatedAt": "2026-07-15",
  "source": "fixture",
  "metrics": [
    {
      "slug": "demo-vigente",
      "nombre": "Demo vigente",
      "valor": "+42%",
      "calificador": "estimado, 2026",
      "calificadorClaves": ["estimado"],
      "claim": "Crecimiento de +42% (estimado, 2026).",
      "entidad": "Transversal",
      "timeframe": "2026",
      "grado": "own",
      "estado": "Vigente",
      "publicabilidad": "Pública",
      "superficies": ["Hero", "Sitio web"],
      "riesgo": "Bajo",
      "notaUso": "",
      "patronProhibido": null
    },
    {
      "slug": "demo-retirada",
      "nombre": "Demo retirada",
      "valor": "99 unicornios",
      "calificador": "",
      "calificadorClaves": [],
      "claim": "",
      "entidad": "Transversal",
      "timeframe": "",
      "grado": "own",
      "estado": "Retirada",
      "publicabilidad": "No publicable",
      "superficies": [],
      "riesgo": "Alto",
      "notaUso": "",
      "patronProhibido": null
    },
    {
      "slug": "demo-en-revision",
      "nombre": "Demo en revisión",
      "valor": "77",
      "calificador": "",
      "calificadorClaves": [],
      "claim": "",
      "entidad": "Transversal",
      "timeframe": "",
      "grado": "own",
      "estado": "En revisión",
      "publicabilidad": "No publicable",
      "superficies": [],
      "riesgo": "Medio",
      "notaUso": "",
      "patronProhibido": null
    }
  ]
}
```

`tools/fixtures/metrics-malformado.json`:

```json
{ "metrics": [ esto no es json valido
```

- [ ] **Step 2: Escribir tests de carga (fallan)**

`tools/verify-metrics.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { loadMetrics } = require('./verify-metrics.js');

const FIX = (f) => path.join(__dirname, 'fixtures', f);

test('loadMetrics carga un espejo valido', () => {
  const data = loadMetrics(FIX('metrics-ok.json'));
  assert.strictEqual(data.metrics.length, 3);
  assert.strictEqual(data.metrics[0].slug, 'demo-vigente');
});

test('loadMetrics lanza NO_METRICS si el archivo no existe', () => {
  assert.throws(() => loadMetrics(FIX('no-existe.json')), (e) => e.code === 'NO_METRICS');
});

test('loadMetrics lanza BAD_METRICS si el JSON esta malformado', () => {
  assert.throws(() => loadMetrics(FIX('metrics-malformado.json')), (e) => e.code === 'BAD_METRICS');
});
```

- [ ] **Step 3: Correr y ver que fallan**

Run: `node --test tools/verify-metrics.test.js`
Expected: FAIL (`Cannot find module './verify-metrics.js'`)

- [ ] **Step 4: Implementación mínima**

`tools/verify-metrics.js`:

```js
// Verificador bloqueante del SSOT de metricas.
// Spec: docs/superpowers/specs/2026-07-15-ssot-metricas-design.md
'use strict';
const fs = require('node:fs');
const path = require('node:path');

function loadMetrics(metricsPath) {
  if (!fs.existsSync(metricsPath)) {
    const e = new Error(`No existe el espejo: ${metricsPath}. Sincroniza Notion -> metrics.json primero.`);
    e.code = 'NO_METRICS';
    throw e;
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  } catch (err) {
    const e = new Error(`JSON malformado en ${metricsPath}: ${err.message}`);
    e.code = 'BAD_METRICS';
    throw e;
  }
  if (!Array.isArray(parsed.metrics)) {
    const e = new Error(`${metricsPath} no tiene el arreglo "metrics".`);
    e.code = 'BAD_METRICS';
    throw e;
  }
  return parsed;
}

module.exports = { loadMetrics };
```

- [ ] **Step 5: Correr tests en verde**

Run: `node --test tools/verify-metrics.test.js`
Expected: 3 pass

- [ ] **Step 6: Commit**

```bash
git add tools/verify-metrics.js tools/verify-metrics.test.js tools/fixtures/
git commit -m "feat(ssot): carga validada del espejo metrics.json"
```

---

### Task 6: Verificador — extracción de `data-metric` y match de valor (TDD)

**Files:**
- Modify: `tools/verify-metrics.js`
- Modify: `tools/verify-metrics.test.js`

Restricción documentada: cada métrica se envuelve en un elemento HOJA (sin tags anidados dentro), p. ej. `<span data-metric="x">+42%</span>`.

- [ ] **Step 1: Tests (fallan)** — añadir a `tools/verify-metrics.test.js`:

```js
const { findDataMetrics, verifyHtml } = require('./verify-metrics.js');

test('findDataMetrics extrae slug, texto y posicion', () => {
  const html = '<p>hola <span class="n" data-metric="demo-vigente">+42%</span> estimado, 2026</p>';
  const els = findDataMetrics(html);
  assert.strictEqual(els.length, 1);
  assert.strictEqual(els[0].slug, 'demo-vigente');
  assert.strictEqual(els[0].texto, '+42%');
  assert.ok(els[0].index > 0);
});

test('verifyHtml pasa cuando el valor coincide y el estado es publicable', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<span data-metric="demo-vigente">+42%</span> crecimiento estimado, 2026';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.deepStrictEqual(r.errors, []);
});

test('verifyHtml falla cuando el valor difiere del espejo', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<span data-metric="demo-vigente">+43%</span> estimado, 2026';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.strictEqual(r.errors.length, 1);
  assert.match(r.errors[0], /\+43%.*\+42%/);
});

test('verifyHtml falla con slug inexistente en el espejo', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<span data-metric="fantasma">1</span>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.strictEqual(r.errors.length, 1);
  assert.match(r.errors[0], /fantasma/);
});
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `node --test tools/verify-metrics.test.js`
Expected: FAIL (`findDataMetrics is not a function`)

- [ ] **Step 3: Implementar** — añadir a `tools/verify-metrics.js` (antes de `module.exports`) y exportar:

```js
function findDataMetrics(html) {
  const out = [];
  const re = /<(\w+)[^>]*\bdata-metric="([^"]+)"[^>]*>([^<]*)<\/\1>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ slug: m[2], texto: m[3].trim(), index: m.index });
  }
  return out;
}

function verifyHtml(html, fileRel, metrics) {
  const errors = [];
  const warnings = [];
  const porSlug = new Map(metrics.map((x) => [x.slug, x]));
  for (const el of findDataMetrics(html)) {
    const met = porSlug.get(el.slug);
    if (!met) {
      errors.push(`${fileRel}: data-metric "${el.slug}" no existe en metrics.json`);
      continue;
    }
    if (el.texto !== met.valor) {
      errors.push(`${fileRel}: "${el.slug}" publica "${el.texto}" pero el SSOT dice "${met.valor}"`);
    }
  }
  return { errors, warnings };
}

module.exports = { loadMetrics, findDataMetrics, verifyHtml };
```

- [ ] **Step 4: Verde**

Run: `node --test tools/verify-metrics.test.js`
Expected: 7 pass

- [ ] **Step 5: Commit**

```bash
git add tools/verify-metrics.js tools/verify-metrics.test.js
git commit -m "feat(ssot): match de data-metric contra el espejo"
```

---

### Task 7: Verificador — estado, publicabilidad y superficies (TDD)

**Files:**
- Modify: `tools/verify-metrics.js`
- Modify: `tools/verify-metrics.test.js`

- [ ] **Step 1: Tests (fallan)** — añadir:

```js
test('verifyHtml falla si la metrica esta Retirada o En revision', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<span data-metric="demo-en-revision">77</span>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.ok(r.errors.some((e) => /En revisi/u.test(e)));
});

test('verifyHtml falla si la superficie no esta permitida', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  // demo-vigente permite Hero y Sitio web, pero NO Caso de estudio
  const html = '<span data-metric="demo-vigente">+42%</span> estimado, 2026';
  const r = verifyHtml(html, 'cases/demo.html', metrics);
  assert.ok(r.errors.some((e) => /superficie/i.test(e)));
});
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `node --test tools/verify-metrics.test.js`
Expected: 2 FAIL nuevos

- [ ] **Step 3: Implementar** — añadir la función de superficies y extender el loop de `verifyHtml`:

```js
// Simplificacion piloto (ajuste 19 del spec): superficie a nivel archivo.
function superficiesDe(fileRel) {
  const rel = fileRel.replace(/\\/g, '/');
  if (rel === 'index.html') return ['Hero', 'Sitio web'];
  if (rel.startsWith('cases/')) return ['Caso de estudio', 'Sitio web'];
  return ['Sitio web'];
}
```

Dentro del loop de `verifyHtml`, después del match de valor:

```js
    if (met.estado !== 'Vigente' && met.estado !== 'Condicionada') {
      errors.push(`${fileRel}: "${el.slug}" tiene estado "${met.estado}", no publicable`);
    }
    if (met.publicabilidad !== 'Pública') {
      errors.push(`${fileRel}: "${el.slug}" tiene publicabilidad "${met.publicabilidad}", no publicable`);
    }
    const permitidas = superficiesDe(fileRel);
    if (!met.superficies.some((s) => permitidas.includes(s))) {
      errors.push(`${fileRel}: "${el.slug}" no permite esta superficie (permitidas: ${met.superficies.join(', ') || 'ninguna'})`);
    }
```

Nota: `demo-en-revision` dispara TRES errores (estado, publicabilidad y superficie); el test usa `some`, no cuenta exacta. Exportar también `superficiesDe`.

- [ ] **Step 4: Verde**

Run: `node --test tools/verify-metrics.test.js`
Expected: 9 pass

- [ ] **Step 5: Commit**

```bash
git add tools/verify-metrics.js tools/verify-metrics.test.js
git commit -m "feat(ssot): valida estado, publicabilidad y superficies permitidas"
```

---

### Task 8: Verificador — calificador obligatorio por proximidad (TDD)

**Files:**
- Modify: `tools/verify-metrics.js`
- Modify: `tools/verify-metrics.test.js`

- [ ] **Step 1: Tests (fallan)** — añadir:

```js
test('verifyHtml falla si falta el calificador cerca del valor', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  // demo-vigente exige la clave "estimado" en +-400 caracteres
  const html = '<span data-metric="demo-vigente">+42%</span> de crecimiento sin contexto alguno';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.ok(r.errors.some((e) => /calificador/i.test(e)));
});

test('verifyHtml acepta el calificador dentro de la ventana', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<div><span data-metric="demo-vigente">+42%</span><small>estimado, 2026</small></div>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.deepStrictEqual(r.errors, []);
});
```

- [ ] **Step 2: Correr y ver que falla el primero**

Run: `node --test tools/verify-metrics.test.js`
Expected: 1 FAIL nuevo (el segundo ya pasa por Task 6, se conserva como regresión)

- [ ] **Step 3: Implementar** — dentro del loop de `verifyHtml`:

```js
    const claves = met.calificadorClaves || [];
    if (claves.length) {
      const ventana = html
        .slice(Math.max(0, el.index - 400), el.index + 400)
        .toLowerCase();
      for (const clave of claves) {
        if (!ventana.includes(clave.toLowerCase())) {
          errors.push(`${fileRel}: "${el.slug}" aparece sin su calificador obligatorio ("${clave}") a menos de 400 caracteres`);
        }
      }
    }
```

- [ ] **Step 4: Verde**

Run: `node --test tools/verify-metrics.test.js`
Expected: 11 pass

- [ ] **Step 5: Commit**

```bash
git add tools/verify-metrics.js tools/verify-metrics.test.js
git commit -m "feat(ssot): calificador obligatorio verificado por proximidad"
```

---

### Task 9: Verificador — lista negra en HTML y llms (TDD)

**Files:**
- Modify: `tools/verify-metrics.js`
- Modify: `tools/verify-metrics.test.js`

- [ ] **Step 1: Tests (fallan)** — añadir:

```js
const { verifyText } = require('./verify-metrics.js');

test('verifyHtml acusa cifras Retiradas presentes en el HTML', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<p>logramos 99 unicornios en un mes</p>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.ok(r.errors.some((e) => /retirada/i.test(e) && /demo-retirada/.test(e)));
});

test('verifyText acusa cifras Retiradas en archivos de texto plano', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const txt = 'linea uno\nimpactamos 99 unicornios\nlinea tres';
  const r = verifyText(txt, 'llms.txt', metrics);
  assert.strictEqual(r.errors.length, 1);
  assert.match(r.errors[0], /linea 2/i);
});
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `node --test tools/verify-metrics.test.js`
Expected: FAIL (`verifyText is not a function`)

- [ ] **Step 3: Implementar** — añadir y exportar:

```js
function escaparRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function lineaDe(texto, index) {
  return texto.slice(0, index).split('\n').length;
}

function buscarRetiradas(contenido, fileRel, metrics) {
  const errors = [];
  for (const met of metrics.filter((x) => x.estado === 'Retirada')) {
    const patron = new RegExp(met.patronProhibido || escaparRegex(met.valor), 'gi');
    let m;
    while ((m = patron.exec(contenido)) !== null) {
      errors.push(`${fileRel}: cifra retirada "${met.slug}" presente ("${m[0]}", linea ${lineaDe(contenido, m.index)})`);
    }
  }
  return errors;
}

function verifyText(texto, fileRel, metrics) {
  return { errors: buscarRetiradas(texto, fileRel, metrics), warnings: [] };
}
```

Y al final de `verifyHtml`, antes del `return`:

```js
  errors.push(...buscarRetiradas(html, fileRel, metrics));
```

- [ ] **Step 4: Verde**

Run: `node --test tools/verify-metrics.test.js`
Expected: 13 pass

- [ ] **Step 5: Commit**

```bash
git add tools/verify-metrics.js tools/verify-metrics.test.js
git commit -m "feat(ssot): lista negra de cifras retiradas en HTML y llms"
```

---

### Task 10: Verificador — warnings de huérfanas y CLI con exit codes (TDD)

**Files:**
- Modify: `tools/verify-metrics.js`
- Modify: `tools/verify-metrics.test.js`

- [ ] **Step 1: Tests (fallan)** — añadir:

```js
const { execFileSync } = require('node:child_process');

test('verifyHtml emite warning por numeros con pinta de metrica sin data-metric', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<p>crecimos 87% este periodo y en 2026 seguimos</p>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.deepStrictEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => /87%/.test(w)));
  assert.ok(!r.warnings.some((w) => /2026/.test(w)), 'los anios no son metricas');
});

test('CLI: exit 2 si el espejo no existe', () => {
  try {
    execFileSync('node', ['tools/verify-metrics.js', '--metrics', 'tools/fixtures/no-existe.json'], { encoding: 'utf8' });
    assert.fail('debio salir con codigo distinto de 0');
  } catch (err) {
    assert.strictEqual(err.status, 2);
  }
});
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `node --test tools/verify-metrics.test.js`
Expected: 2 FAIL nuevos

- [ ] **Step 3: Implementar warnings** — al final de `verifyHtml`, antes del `return`:

```js
  const sinMarcadas = html.replace(/<(\w+)[^>]*\bdata-metric="[^"]+"[^>]*>[^<]*<\/\1>/g, ' ');
  const soloTexto = sinMarcadas.replace(/<[^>]+>/g, ' ');
  const numRe = /(\+?\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?%?|\+?\d+(?:\.\d+)?%)/g;
  let num;
  while ((num = numRe.exec(soloTexto)) !== null) {
    const soloDigitos = num[1].replace(/\D/g, '');
    if (/^(19|20)\d{2}$/.test(soloDigitos)) continue; // anios
    warnings.push(`${fileRel}: posible metrica sin data-metric: "${num[1]}"`);
  }
```

- [ ] **Step 4: Implementar CLI** — al final de `tools/verify-metrics.js`:

```js
function run(argv) {
  const flagIdx = argv.indexOf('--metrics');
  const metricsPath = flagIdx !== -1
    ? path.resolve(argv[flagIdx + 1])
    : path.join(__dirname, '..', 'assets', 'data', 'metrics.json');
  const raiz = path.join(__dirname, '..');

  let data;
  try {
    data = loadMetrics(metricsPath);
  } catch (e) {
    console.error(`[verify-metrics] ERROR: ${e.message}`);
    return 2;
  }

  const htmlFiles = ['index.html'];
  const casesDir = path.join(raiz, 'cases');
  if (fs.existsSync(casesDir)) {
    for (const f of fs.readdirSync(casesDir).filter((x) => x.endsWith('.html'))) {
      htmlFiles.push(`cases/${f}`);
    }
  }
  const textFiles = ['llms.txt', 'llms-full.txt'].filter((f) => fs.existsSync(path.join(raiz, f)));

  const errors = [];
  const warnings = [];
  for (const rel of htmlFiles) {
    const abs = path.join(raiz, rel);
    if (!fs.existsSync(abs)) continue;
    const r = verifyHtml(fs.readFileSync(abs, 'utf8'), rel, data.metrics);
    errors.push(...r.errors);
    warnings.push(...r.warnings);
  }
  for (const rel of textFiles) {
    const r = verifyText(fs.readFileSync(path.join(raiz, rel), 'utf8'), rel, data.metrics);
    errors.push(...r.errors);
  }

  for (const w of warnings) console.warn(`[verify-metrics] WARN: ${w}`);
  for (const e of errors) console.error(`[verify-metrics] ERROR: ${e}`);
  console.log(`[verify-metrics] ${errors.length} errores, ${warnings.length} advertencias (espejo del ${data.generatedAt})`);
  return errors.length ? 1 : 0;
}

if (require.main === module) {
  process.exit(run(process.argv.slice(2)));
}

module.exports = { loadMetrics, findDataMetrics, superficiesDe, verifyHtml, verifyText, run };
```

- [ ] **Step 5: Verde**

Run: `node --test tools/verify-metrics.test.js`
Expected: 15 pass

- [ ] **Step 6: Commit**

```bash
git add tools/verify-metrics.js tools/verify-metrics.test.js
git commit -m "feat(ssot): warnings de huerfanas y CLI con exit codes 0/1/2"
```

---

### Task 11: Marcar `index.html` y correr el verificador real en verde

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Envolver las cifras del seed presentes en index.html**

Con la tabla de Task 1, envolver cada aparición de las métricas Vigentes/Condicionadas del seed. Ejemplos con la estructura real del sitio (banda de métricas del hero, ~línea 854, y Selected Work, ~líneas 900 y 920):

```html
<!-- antes -->
<div class="as-n">+1,291%</div>
<!-- despues -->
<div class="as-n"><span data-metric="rodi-sofi">+1,291%</span></div>
```

Reglas:
- Solo se envuelve el número, dentro del elemento hoja, sin tags anidados en el span.
- `heineken-proyectos-evaluados` (En revisión) y `redux-200-capacitados-retirada` (Retirada) NO se marcan; si sus cifras aparecen en index.html es un hallazgo para Diego.
- Si un valor del sitio difiere del espejo (ej. el sitio dice "menos de 5 minutos" y el espejo "\<5 min"), **el espejo se corrige para reflejar el claim vigente del sitio remediado** (y la fila de Notion con `notion-update-page`), no al revés — el sitio ya pasó auditoría.

- [ ] **Step 2: Correr el verificador real**

Run: `node tools/verify-metrics.js`
Expected: exit 0. Se aceptan warnings de huérfanas (cifras aún no migradas: 173 leads, 10+ años, métricas de casos); NINGÚN error.

Si hay errores: corregir espejo/Notion/marcado según la regla del Step 1 y repetir hasta verde.

- [ ] **Step 3: Verificación visual**

Run: `python -m http.server 8080` → abrir `localhost:8080` y confirmar que el hero y Selected Work se ven idénticos (el span no cambia estilos).

- [ ] **Step 4: Commit**

```bash
git add index.html assets/data/metrics.json
git commit -m "feat(ssot): index.html marcado con data-metric, verificador en verde"
```

---

### Task 12: SOP en CLAUDE.md, push y registro en Notion

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Añadir la sección SOP a CLAUDE.md** (después de la sección "Registro en Notion — Portafolio D"):

```markdown
## SSOT de Métricas — SOP de publicación (desde 2026-07-15)

Spec: `docs/superpowers/specs/2026-07-15-ssot-metricas-design.md`. Base maestra: **📊 Métricas oficiales — Portafolio D** en Notion. Espejo: `assets/data/metrics.json` (generado, no editar a mano sin sincronizar con Notion).

Toda publicación que toque métricas o copy con métricas sigue este orden, sin excepciones:

1. Sincronizar Notion → `assets/data/metrics.json`
2. Resolver placeholders `{{metrica:slug}}` si se ejecuta una maqueta
3. `node tools/verify-metrics.js`
4. Corregir discrepancias hasta exit 0
5. Commit
6. Push
7. Entrada en el Changelog — Portafolio D

Reglas: una métrica nueva se da de alta primero en la base Notion (nunca directo en el JSON); las cifras muertas viven en la base como `Retirada` y el verificador las acusa; los borradores pueden llevar cifras literales, lo publicable no.
```

- [ ] **Step 2: Correr los tests completos una última vez**

Run: `node --test tools/verify-metrics.test.js && node tools/verify-metrics.js`
Expected: 15 pass + exit 0

- [ ] **Step 3: Commit y push**

```bash
git add CLAUDE.md
git commit -m "docs(ssot): SOP de publicacion de metricas en CLAUDE.md"
git push origin master
```

- [ ] **Step 4: Registrar en Notion (protocolo del Changelog)**

Por cada commit registrable de esta sesión, crear su tarea propia (estado `Terminada`) en Tareas y Misiones y su entrada en el Changelog — Portafolio D, vinculadas. Como mínimo:
- Entrada Componente `Infraestructura`, Sección `General`: sistema SSOT de métricas operativo (base Notion + espejo + verificador + index marcado).
- Si hubo hallazgos (3,231 presente, valores distintos a lo esperado), reportarlos a Diego en el resumen final, no silenciarlos.

---

## Self-review del plan (hecho al escribirlo)

- **Cobertura del spec:** base Notion (Task 2), seed con estados y una-métrica-por-cifra (Task 3), espejo no-runtime (Task 4), data-metric (Task 11), verificador con match/estado/publicabilidad/superficies/calificador/lista negra/huérfanas/exit codes (Tasks 5-10), SOP (Task 12), seed piloto y no-migración-total (alcance completo). Los placeholders en maquetas (§5 del spec) NO tienen task: correcto, el ajuste 20 los difiere a cuando una maqueta entre a flujo de publicación.
- **Sin placeholders:** cada step de código muestra el código; los pasos Notion muestran schema y valores exactos.
- **Consistencia de tipos:** `loadMetrics`, `findDataMetrics`, `superficiesDe`, `verifyHtml`, `verifyText`, `run` — nombres idénticos en tests e implementación; `{errors, warnings}` como retorno uniforme.
