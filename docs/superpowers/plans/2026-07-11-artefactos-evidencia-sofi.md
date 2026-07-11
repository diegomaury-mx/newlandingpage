# Artefactos de evidencia de SOFI — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `cases/sofi.html`, una página de caso cuyos artefactos (FSM, arquitectura, simulador, ficha técnica) se derivan del sistema real de SOFI, sin ilustrar nada y sin publicar un solo dato identificable de FlipHouse.

**Architecture:** Dos repos, un candado. El **repo de SOFI** (`~/Documents/Claude/Projects/Claude_Code/Fliphouse-whatsapp-agent`) tiene todo el tooling que toca datos: extrae el FSM de su propio código, saca una conversación real de la Postgres de producción, la sanitiza, la replaya contra el sistema real y emite tres archivos de datos ya limpios. El **repo del sitio** (`newlandingpage`) solo recibe esos tres archivos y los renderiza. Las credenciales de producción nunca entran al repo del sitio, y el JSON crudo nunca se escribe dentro de ningún repo.

**Tech Stack:** Node 24, Jest (repo de SOFI, ya instalado). HTML/CSS/JS vanilla y DS v3 (repo del sitio, sin build). El banco de pruebas `tools/demo-harness` (Docker Compose con Postgres y Redis efímeros + mock de la Graph API) ya existe y se reutiliza.

---

## Corrección a la spec, verificada contra el código

La spec asume que la Postgres de producción guarda "transiciones de estado". **No existen.** El esquema tiene siete tablas y ninguna es un log de transiciones: `messages` guarda texto y timestamps, y `conversations` guarda solo `current_state`, el estado **final**. El estado por turno vivía en la sesión de Redis, que es efímera y ya expiró.

Decisión tomada por Diego el 2026-07-11: el panel de estado del simulador sale de un **replay contra el código real**. Los textos reales de producción, ya sanitizados, se vuelven a meter por el `/webhook` de SOFI usando el harness que ya existe (firma HMAC válida, payload con la forma exacta de Meta, mock de la Graph API). SOFI no puede distinguirlos de mensajes reales. El estado se lee después de cada turno con `memoryService.getOrCreate(phone)`, y el `intent` y el `confidence` salen de las líneas `[FSM]` que `resolveNextState` ya escribe al log.

Consecuencia para el copy de la página, que hay que decir sin letra chica:

> Los mensajes son de producción. El panel de estado es la salida del FSM real ejecutándose sobre esos mismos mensajes.

Y como el replay corre sobre el texto **ya sanitizado**, ningún dato de FlipHouse sale de la máquina hacia OpenRouter.

## Datos verificados del sistema (2026-07-11)

Confirmados leyendo el código, no copiados de la spec:

- `fsm.service.js`: 12 estados, `CONFIDENCE_THRESHOLD = 0.75`, 3 estados terminales (`COMPLETED`, `HUMAN_TRANSFER`, `DISQUALIFIED`), `OFF_TOPIC` puede volver a cualquier estado.
- `fsm.service.js` **no exporta** `STATE_MAP`, `TRANSITION_TABLE` ni `CONFIDENCE_THRESHOLD`. Solo exporta `{ fsmService, STATES, ALL_TERMINAL_STATES }`. Por eso el extractor no puede hacer un `require()` simple: ver Task 1.
- `ai.service.js`: enum cerrado de 8 intents (`GREETING`, `AFFIRM`, `REJECT`, `QUESTION`, `HUMAN_REQUEST`, `PROVIDE_DATA`, `OFF_TOPIC`, `PAUSE`), `confidence` entre 0 y 1, validado con Zod. **No devuelve un estado.**
- `PAUSE` es self-transition explícita en cualquier estado: el lead pide pausa y el FSM no se mueve.
- Postgres: tabla `messages` (`conversation_id`, `phone`, `direction` in/out, `content`, `created_at`) y `conversations` (`phone_number`, `current_state`).

Los commits, los tests y la latencia se **recalculan** en la Task 8. No se hardcodean.

## Estructura de archivos

**Repo de SOFI** — tooling nuevo, nada del sistema se modifica:

| Archivo | Responsabilidad |
|---|---|
| `tools/portfolio-export/extract-fsm.js` | Lee `fsm.service.js` y `ai.service.js`; devuelve estados, transiciones, umbral e intents. |
| `tools/portfolio-export/emit.js` | Escribe un objeto como archivo `.js` que asigna a `window.SOFI_*`. |
| `tools/portfolio-export/safe-path.js` | Candado: se niega a escribir dentro de un repo git. |
| `tools/portfolio-export/extract-conversation.js` | Saca de la Postgres de producción una conversación que llegó a `COMPLETED`. |
| `tools/portfolio-export/sanitize.js` | Sustituye PII de forma consistente y verifica que no quede rastro. |
| `tools/portfolio-export/capture-trace.js` | Replaya los turnos sanitizados contra el harness y arma el trace del FSM. |
| `tools/portfolio-export/extract-metrics.js` | Commits, tests, latencia y estados, cada uno con su método. |
| `tests/portfolio-export/*.test.js` | Jest. |

**Repo del sitio** — solo consume:

| Archivo | Responsabilidad |
|---|---|
| `cases/sofi.html` | La página. HTML + `<style>` inline, como los demás casos. |
| `assets/js/sofi-case.js` | Render del FSM y del simulador. |
| `assets/data/sofi/sofi-fsm.js` | `window.SOFI_FSM` — generado. |
| `assets/data/sofi/sofi-conversation.js` | `window.SOFI_CONVERSATION` — generado. |
| `assets/data/sofi/sofi-metrics.js` | `window.SOFI_METRICS` — generado. |

Los tres archivos de datos son `.js` que asignan a `window`, no `.json`. Motivo: se cargan con `<script src>` y la página abre igual con `file://` que en GitHub Pages, sin `fetch` y sin CORS. El criterio de éxito de la spec ("abre sin build y sin red externa") se cumple literalmente.

**Contratos de datos.** Fijos desde aquí; las tasks posteriores dependen de estos nombres exactos.

```js
window.SOFI_FSM = {
  generatedAt: '2026-07-11',
  source: 'src/services/fsm.service.js',
  confidenceThreshold: 0.75,
  states: ['GREETING', 'INTENTION', /* ...12 */],
  terminalStates: ['COMPLETED', 'HUMAN_TRANSFER', 'DISQUALIFIED'],
  intents: ['GREETING', 'AFFIRM', /* ...8 */],
  stateMap: { GREETING: ['INTENTION', 'HUMAN_TRANSFER', 'OFF_TOPIC', 'DISQUALIFIED'] /* ... */ },
  transitionTable: { GREETING: { PROVIDE_DATA: 'INTENTION' /* ... */ } /* ... */ },
};

window.SOFI_CONVERSATION = {
  provenance: {
    messages: 'Postgres de producción (tabla messages), sanitizada',
    trace: 'Replay de los mensajes sanitizados contra el sistema real (webhook + ai.service + fsm.service)',
    capturedAt: '2026-05',      // mes, nunca el día
    turnCount: 14,
    finalState: 'COMPLETED',
  },
  turns: [
    // tOffsetMs es el offset REAL de producción respecto al primer mensaje. Es la prueba de la latencia.
    { i: 0, dir: 'in',  text: 'Hola', tOffsetMs: 0,
      trace: { stateBefore: 'GREETING', intent: 'PROVIDE_DATA', confidence: 0.92,
               stateAfter: 'INTENTION', applied: true, extracted: { firstname: 'Marcela' } } },
    { i: 1, dir: 'out', text: '¡Hola! 😊 Soy Sofi...', tOffsetMs: 3800 },
  ],
};

window.SOFI_METRICS = {
  generatedAt: '2026-07-11',
  items: [
    { label: 'Commits', value: '504', method: 'git rev-list --count HEAD en el repo de SOFI' },
  ],
};
```

`trace` solo existe en los turnos `dir: 'in'`: el FSM corre sobre lo que entra.

---

## Task 1: Extractor del FSM

`fsm.service.js` no exporta las tablas. En vez de parsear con regex (frágil) o dibujarlas a mano (prohibido por la spec), se lee el archivo, se le **añade una línea de export** y se evalúa como módulo CommonJS con un `require` de mentiras para su única dependencia (`../lib/logSafe`). Los valores salen del archivo real. Si el archivo cambia de forma, el extractor truena en vez de mentir.

**Files:**
- Create: `tools/portfolio-export/extract-fsm.js`
- Test: `tests/portfolio-export/extract-fsm.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/extract-fsm.test.js
'use strict';

const path = require('path');
const { extractFsm } = require('../../tools/portfolio-export/extract-fsm');

const FSM_SRC = path.join(__dirname, '../../src/services/fsm.service.js');
const AI_SRC  = path.join(__dirname, '../../src/services/ai.service.js');

describe('extractFsm', () => {
  const fsm = extractFsm(FSM_SRC, AI_SRC);

  test('extrae los 12 estados del código', () => {
    expect(fsm.states).toHaveLength(12);
    expect(fsm.states).toContain('GREETING');
    expect(fsm.states).toContain('COMPLETED');
  });

  test('extrae el umbral de confianza real', () => {
    expect(fsm.confidenceThreshold).toBe(0.75);
  });

  test('los estados terminales son absorbentes: no tienen transiciones salientes', () => {
    for (const terminal of fsm.terminalStates) {
      expect(fsm.stateMap[terminal]).toEqual([]);
    }
  });

  test('extrae la tabla de transiciones', () => {
    expect(fsm.transitionTable.GREETING.PROVIDE_DATA).toBe('INTENTION');
    expect(fsm.transitionTable.VALUE.AFFIRM).toBe('COMPLETED');
  });

  test('una combinación (estado, intent) inexistente no aparece en la tabla', () => {
    // No hay forma de llegar a COMPLETED desde CP con un solo intent.
    expect(fsm.transitionTable.CP.AFFIRM).toBeUndefined();
  });

  test('extrae los 8 intents del enum de Zod en ai.service.js', () => {
    expect(fsm.intents).toHaveLength(8);
    expect(fsm.intents).toContain('PAUSE');
    expect(fsm.intents).not.toContain('COMPLETED'); // un intent no es un estado
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/extract-fsm.test.js`
Expected: FAIL — `Cannot find module '../../tools/portfolio-export/extract-fsm'`

- [ ] **Step 3: Implementar el extractor**

```js
// tools/portfolio-export/extract-fsm.js
'use strict';

const fs = require('fs');

/**
 * fsm.service.js solo exporta { fsmService, STATES, ALL_TERMINAL_STATES }.
 * Las tablas que necesitamos (STATE_MAP, TRANSITION_TABLE, CONFIDENCE_THRESHOLD,
 * TERMINAL_STATES) son const de módulo, invisibles desde fuera.
 *
 * En vez de parsear el archivo con regex, lo ejecutamos: le añadimos una línea
 * de export y lo corremos en un wrapper CommonJS con un require stub para su
 * única dependencia. Los valores son los del archivo real, no una copia.
 */
function loadModuleInternals(sourcePath) {
  const src = fs.readFileSync(sourcePath, 'utf8');
  const patched = `${src}\nmodule.exports.__internals = { STATES, STATE_MAP, TRANSITION_TABLE, CONFIDENCE_THRESHOLD, TERMINAL_STATES };\n`;

  const module = { exports: {} };
  const stubRequire = (id) => {
    if (id === '../lib/logSafe') return { maskPhone: (p) => p };
    throw new Error(`extract-fsm: dependencia inesperada en ${sourcePath}: ${id}`);
  };

  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', patched);
  fn(module.exports, stubRequire, module, sourcePath, '');

  const internals = module.exports.__internals;
  if (!internals || !internals.STATE_MAP || !internals.TRANSITION_TABLE) {
    throw new Error('extract-fsm: fsm.service.js cambió de forma. Revisa el extractor antes de publicar.');
  }
  return internals;
}

/** Lee el enum de intents del esquema Zod en ai.service.js. */
function extractIntents(aiSourcePath) {
  const src = fs.readFileSync(aiSourcePath, 'utf8');
  const block = src.match(/intent:\s*z\.enum\(\[([\s\S]*?)\]\)/);
  if (!block) throw new Error('extract-fsm: no se encontró el enum de intents en ai.service.js');
  const intents = [...block[1].matchAll(/'([A-Z_]+)'/g)].map((m) => m[1]);
  if (intents.length === 0) throw new Error('extract-fsm: el enum de intents salió vacío');
  return intents;
}

function extractFsm(fsmSourcePath, aiSourcePath) {
  const { STATES, STATE_MAP, TRANSITION_TABLE, CONFIDENCE_THRESHOLD, TERMINAL_STATES } =
    loadModuleInternals(fsmSourcePath);

  return {
    source: 'src/services/fsm.service.js',
    confidenceThreshold: CONFIDENCE_THRESHOLD,
    states: Object.values(STATES),
    terminalStates: [...TERMINAL_STATES],
    intents: extractIntents(aiSourcePath),
    stateMap: STATE_MAP,
    transitionTable: TRANSITION_TABLE,
  };
}

module.exports = { extractFsm };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/extract-fsm.test.js`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit** (en el repo de SOFI)

```bash
git add tools/portfolio-export/extract-fsm.js tests/portfolio-export/extract-fsm.test.js
git commit -m "feat(portfolio-export): extrae el FSM desde el codigo, no a mano"
```

---

## Task 2: Emisor de archivos de datos y candado de rutas

Dos utilidades pequeñas que usan las tasks 3 a 8. `emit.js` escribe los `window.SOFI_*`. `safe-path.js` es el candado de la spec: **el JSON crudo nunca se escribe dentro de un repo git.**

**Files:**
- Create: `tools/portfolio-export/emit.js`
- Create: `tools/portfolio-export/safe-path.js`
- Test: `tests/portfolio-export/emit.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/emit.test.js
'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');

const { emitDataFile } = require('../../tools/portfolio-export/emit');
const { assertOutsideGit } = require('../../tools/portfolio-export/safe-path');

describe('emitDataFile', () => {
  test('escribe un archivo .js que asigna a window y se puede volver a leer', () => {
    const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'emit-')), 'sofi-fsm.js');
    emitDataFile('SOFI_FSM', { states: ['GREETING'], confidenceThreshold: 0.75 }, out);

    const written = fs.readFileSync(out, 'utf8');
    expect(written).toContain('window.SOFI_FSM');

    const window = {};
    // eslint-disable-next-line no-new-func
    new Function('window', written)(window);
    expect(window.SOFI_FSM.states).toEqual(['GREETING']);
    expect(window.SOFI_FSM.confidenceThreshold).toBe(0.75);
  });
});

describe('assertOutsideGit', () => {
  test('acepta una ruta fuera de cualquier repo', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'safe-'));
    expect(() => assertOutsideGit(path.join(dir, 'raw.json'))).not.toThrow();
  });

  test('rechaza escribir dentro de un repo git', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'unsafe-'));
    fs.mkdirSync(path.join(dir, '.git'));
    expect(() => assertOutsideGit(path.join(dir, 'sub', 'raw.json')))
      .toThrow(/repo git/i);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/emit.test.js`
Expected: FAIL — módulos no encontrados.

- [ ] **Step 3: Implementar las dos utilidades**

```js
// tools/portfolio-export/safe-path.js
'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * Candado de la spec: el export crudo, sin sanitizar, nunca se escribe dentro
 * de un repo git. Sube por el árbol de directorios buscando un .git.
 */
function assertOutsideGit(targetPath) {
  let dir = path.resolve(path.dirname(targetPath));
  for (;;) {
    if (fs.existsSync(path.join(dir, '.git'))) {
      throw new Error(
        `safe-path: ${targetPath} cae dentro de un repo git (${dir}). ` +
        'El export crudo no se versiona. Usa SOFI_EXPORT_DIR fuera de cualquier repo.'
      );
    }
    const parent = path.dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
}

module.exports = { assertOutsideGit };
```

```js
// tools/portfolio-export/emit.js
'use strict';

const fs   = require('fs');
const path = require('path');

/** Escribe un objeto como archivo .js que asigna a window.<varName>. */
function emitDataFile(varName, data, outPath) {
  const banner =
    '// Generado por tools/portfolio-export. No editar a mano: se regenera desde el sistema.\n';
  const body = `window.${varName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, banner + body, 'utf8');
  return outPath;
}

module.exports = { emitDataFile };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/emit.test.js`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/emit.js tools/portfolio-export/safe-path.js tests/portfolio-export/emit.test.js
git commit -m "feat(portfolio-export): emisor de data files y candado anti-repo"
```

---

## Task 3: Generar el data file del FSM

Junta la Task 1 con la Task 2 en un CLI.

**Files:**
- Create: `tools/portfolio-export/build-fsm.js`

- [ ] **Step 1: Escribir el CLI**

```js
// tools/portfolio-export/build-fsm.js
'use strict';

/**
 * Genera assets/data/sofi/sofi-fsm.js para el portafolio.
 *
 *   node tools/portfolio-export/build-fsm.js <ruta-del-repo-del-sitio>
 */
const path = require('path');
const { extractFsm }   = require('./extract-fsm');
const { emitDataFile } = require('./emit');

const siteRepo = process.argv[2];
if (!siteRepo) {
  console.error('Uso: node tools/portfolio-export/build-fsm.js <ruta-del-repo-del-sitio>');
  process.exit(1);
}

const fsm = extractFsm(
  path.join(__dirname, '../../src/services/fsm.service.js'),
  path.join(__dirname, '../../src/services/ai.service.js'),
);

// Fecha inyectable para que la salida sea reproducible en pruebas.
fsm.generatedAt = process.env.GENERATED_AT || new Date().toISOString().slice(0, 10);

const out = path.join(siteRepo, 'assets/data/sofi/sofi-fsm.js');
emitDataFile('SOFI_FSM', fsm, out);

console.log(`[build-fsm] ${fsm.states.length} estados, ${fsm.intents.length} intents, umbral ${fsm.confidenceThreshold}`);
console.log(`[build-fsm] escrito: ${out}`);
```

- [ ] **Step 2: Correrlo contra el repo del sitio**

Run:
```bash
node tools/portfolio-export/build-fsm.js "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
```
Expected: `[build-fsm] 12 estados, 8 intents, umbral 0.75`

- [ ] **Step 3: Verificar la salida a ojo**

Run: `head -20 "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage/assets/data/sofi/sofi-fsm.js"`
Expected: `window.SOFI_FSM = {` con `"confidenceThreshold": 0.75`.

- [ ] **Step 4: Commit en los dos repos**

```bash
# repo de SOFI
git add tools/portfolio-export/build-fsm.js
git commit -m "feat(portfolio-export): CLI que genera el data file del FSM"

# repo del sitio
cd "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
git add assets/data/sofi/sofi-fsm.js
git commit -m "feat(sofi): data file del FSM generado desde el codigo"
```

---

## Task 4: Extraer una conversación real de producción

Saca de la Postgres de producción una conversación que haya llegado a `COMPLETED`, porque demuestra el recorrido entero. **Escribe fuera de git, siempre.**

**Files:**
- Create: `tools/portfolio-export/extract-conversation.js`
- Test: `tests/portfolio-export/extract-conversation.test.js`

- [ ] **Step 1: Escribir el test que falla**

La query se prueba contra un cliente `pg` de mentiras. No se toca la base real en los tests.

```js
// tests/portfolio-export/extract-conversation.test.js
'use strict';

const { buildExport } = require('../../tools/portfolio-export/extract-conversation');

const ROWS = [
  { direction: 'in',  content: 'Hola',            created_at: new Date('2026-05-04T17:00:00Z') },
  { direction: 'out', content: '¡Hola! Soy Sofi', created_at: new Date('2026-05-04T17:00:04Z') },
  { direction: 'in',  content: 'Soy Marcela',     created_at: new Date('2026-05-04T17:01:00Z') },
];

describe('buildExport', () => {
  test('convierte los timestamps absolutos en offsets relativos al primer mensaje', () => {
    const out = buildExport(ROWS, 'COMPLETED');
    expect(out.turns[0].tOffsetMs).toBe(0);
    expect(out.turns[1].tOffsetMs).toBe(4000);
    expect(out.turns[2].tOffsetMs).toBe(60000);
  });

  test('conserva dirección y texto, y numera los turnos', () => {
    const out = buildExport(ROWS, 'COMPLETED');
    expect(out.turns.map((t) => t.dir)).toEqual(['in', 'out', 'in']);
    expect(out.turns[2]).toMatchObject({ i: 2, text: 'Soy Marcela' });
  });

  test('la fecha se redondea al mes: nunca se publica el día', () => {
    const out = buildExport(ROWS, 'COMPLETED');
    expect(out.capturedAt).toBe('2026-05');
  });

  test('calcula la latencia de respuesta como la mediana de in→out', () => {
    // Único par in→out: 4000 ms.
    expect(buildExport(ROWS, 'COMPLETED').replyLatencyMsMedian).toBe(4000);
  });

  test('se niega a exportar una conversación que no llegó a COMPLETED', () => {
    expect(() => buildExport(ROWS, 'CP')).toThrow(/COMPLETED/);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/extract-conversation.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar la extracción**

```js
// tools/portfolio-export/extract-conversation.js
'use strict';

const fs   = require('fs');
const path = require('path');
const { assertOutsideGit } = require('./safe-path');

/** Mediana de los deltas in→out consecutivos. Es la latencia de respuesta real. */
function medianReplyLatency(turns) {
  const deltas = [];
  for (let i = 0; i < turns.length - 1; i++) {
    if (turns[i].dir === 'in' && turns[i + 1].dir === 'out') {
      deltas.push(turns[i + 1].tOffsetMs - turns[i].tOffsetMs);
    }
  }
  if (deltas.length === 0) return null;
  deltas.sort((a, b) => a - b);
  const mid = Math.floor(deltas.length / 2);
  return deltas.length % 2 === 0 ? Math.round((deltas[mid - 1] + deltas[mid]) / 2) : deltas[mid];
}

/** Filas crudas de la tabla messages → export con offsets relativos. */
function buildExport(rows, finalState) {
  if (finalState !== 'COMPLETED') {
    throw new Error(`extract-conversation: la conversación terminó en ${finalState}, no en COMPLETED. Elige otra.`);
  }
  if (rows.length === 0) throw new Error('extract-conversation: la conversación vino vacía');

  const t0 = new Date(rows[0].created_at).getTime();
  const turns = rows.map((row, i) => ({
    i,
    dir: row.direction,
    text: row.content,
    tOffsetMs: new Date(row.created_at).getTime() - t0,
  }));

  return {
    capturedAt: new Date(rows[0].created_at).toISOString().slice(0, 7), // YYYY-MM, sin día
    finalState,
    turns,
    replyLatencyMsMedian: medianReplyLatency(turns),
  };
}

/** CLI: node tools/portfolio-export/extract-conversation.js <phone> */
async function main() {
  const phone = process.argv[2];
  const outDir = process.env.SOFI_EXPORT_DIR;
  if (!phone || !outDir) {
    console.error('Uso: SOFI_EXPORT_DIR=<dir fuera de git> node tools/portfolio-export/extract-conversation.js <phone>');
    process.exit(1);
  }

  const outPath = path.join(outDir, 'raw-conversation.json');
  assertOutsideGit(outPath); // truena antes de tocar la base si la ruta cae en un repo

  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows: convRows } = await client.query(
    'SELECT current_state FROM conversations WHERE phone_number = $1', [phone],
  );
  if (convRows.length === 0) throw new Error(`extract-conversation: no existe la conversación ${phone}`);

  const { rows } = await client.query(
    `SELECT direction, content, created_at
       FROM messages
      WHERE phone = $1
      ORDER BY created_at ASC`, [phone],
  );
  await client.end();

  const data = buildExport(rows, convRows[0].current_state);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`[extract] ${data.turns.length} turnos, latencia mediana ${data.replyLatencyMsMedian} ms`);
  console.log(`[extract] CRUDO, con PII, fuera de git: ${outPath}`);
  console.log('[extract] Bórralo cuando termines el pipeline.');
}

if (require.main === module) main().catch((e) => { console.error(e.message); process.exit(1); });

module.exports = { buildExport, medianReplyLatency };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/extract-conversation.test.js`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/extract-conversation.js tests/portfolio-export/extract-conversation.test.js
git commit -m "feat(portfolio-export): extrae una conversacion COMPLETED de produccion"
```

---

## Task 5: Sanitizar

Reemplazos consistentes, no borrados: el hilo tiene que seguir leyéndose como una conversación humana. Y una verificación que truena si queda rastro.

**Files:**
- Create: `tools/portfolio-export/sanitize.js`
- Test: `tests/portfolio-export/sanitize.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/sanitize.test.js
'use strict';

const { sanitizeTurns, assertClean } = require('../../tools/portfolio-export/sanitize');

const MAPPING = {
  'Marcela Gutiérrez': 'Ana Solís',
  'Marcela': 'Ana',
  'Valle Oriente': 'Villa Olímpica',
  '66269': '64000',
  '5218112345678': '5210000000000',
  '2,350,000': '1,900,000',
};

const TURNS = [
  { i: 0, dir: 'in',  text: 'Hola, soy Marcela Gutiérrez', tOffsetMs: 0 },
  { i: 1, dir: 'out', text: 'Mucho gusto Marcela. ¿Tu CP?', tOffsetMs: 4000 },
  { i: 2, dir: 'in',  text: '66269, colonia Valle Oriente', tOffsetMs: 30000 },
  { i: 3, dir: 'in',  text: 'La valúo en 2,350,000', tOffsetMs: 60000 },
];

describe('sanitizeTurns', () => {
  test('sustituye de forma consistente en todos los turnos', () => {
    const out = sanitizeTurns(TURNS, MAPPING);
    expect(out[0].text).toBe('Hola, soy Ana Solís');
    expect(out[1].text).toBe('Mucho gusto Ana. ¿Tu CP?');
    expect(out[2].text).toBe('64000, colonia Villa Olímpica');
    expect(out[3].text).toBe('La valúo en 1,900,000');
  });

  test('aplica primero las claves largas: el nombre completo gana sobre el nombre suelto', () => {
    const out = sanitizeTurns([{ i: 0, dir: 'in', text: 'Marcela Gutiérrez', tOffsetMs: 0 }], MAPPING);
    expect(out[0].text).toBe('Ana Solís');
    expect(out[0].text).not.toContain('Solís Gutiérrez'); // no reemplazo parcial
  });

  test('conserva los offsets: la latencia es evidencia y no se toca', () => {
    const out = sanitizeTurns(TURNS, MAPPING);
    expect(out.map((t) => t.tOffsetMs)).toEqual([0, 4000, 30000, 60000]);
  });
});

describe('assertClean', () => {
  test('pasa cuando no queda ningún valor original', () => {
    expect(() => assertClean(sanitizeTurns(TURNS, MAPPING), MAPPING)).not.toThrow();
  });

  test('truena si sobrevive un valor original', () => {
    const sucio = [{ i: 0, dir: 'in', text: 'Vivo en Valle Oriente', tOffsetMs: 0 }];
    expect(() => assertClean(sucio, MAPPING)).toThrow(/Valle Oriente/);
  });

  test('truena ante cualquier cadena de 7+ dígitos que no esté en el mapping', () => {
    const sucio = [{ i: 0, dir: 'in', text: 'Mi celular es 8117654321', tOffsetMs: 0 }];
    expect(() => assertClean(sucio, MAPPING)).toThrow(/dígitos/);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/sanitize.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar el sanitizador**

```js
// tools/portfolio-export/sanitize.js
'use strict';

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Reemplazos consistentes. Las claves se aplican de la más larga a la más corta
 * para que "Marcela Gutiérrez" gane sobre "Marcela" y no quede un híbrido.
 */
function sanitizeTurns(turns, mapping) {
  const keys = Object.keys(mapping).sort((a, b) => b.length - a.length);
  return turns.map((turn) => {
    let text = turn.text;
    for (const key of keys) {
      text = text.replace(new RegExp(escapeRegExp(key), 'g'), mapping[key]);
    }
    return { ...turn, text };
  });
}

/** Truena si sobrevive PII. Se corre siempre antes de publicar. */
function assertClean(turns, mapping) {
  const allowed = new Set(Object.values(mapping));

  for (const turn of turns) {
    for (const original of Object.keys(mapping)) {
      if (turn.text.includes(original)) {
        throw new Error(`sanitize: sobrevivió un valor original en el turno ${turn.i}: "${original}"`);
      }
    }
    for (const match of turn.text.matchAll(/\d[\d\s-]{6,}/g)) {
      const run = match[0].trim();
      if (!allowed.has(run)) {
        throw new Error(
          `sanitize: cadena de 7+ dígitos sin sanitizar en el turno ${turn.i}: "${run}". ` +
          'Agrégala al mapping o revisa el turno.'
        );
      }
    }
  }
  return turns;
}

module.exports = { sanitizeTurns, assertClean };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/sanitize.test.js`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/sanitize.js tests/portfolio-export/sanitize.test.js
git commit -m "feat(portfolio-export): sanitizador consistente con verificacion que truena"
```

---

## Task 6: Armar el trace del replay

La parte pura y testeable: dados los turnos sanitizados, los estados leídos de la sesión después de cada turno, y las líneas `[FSM]` del log, armar el `window.SOFI_CONVERSATION`.

Formato real de las líneas que escribe `resolveNextState`:

```
[FSM] 521****5678: GREETING → INTENTION (PROVIDE_DATA conf=0.92)
[FSM] Baja confianza (0.41) para 521****5678. Permanece en CP
[FSM] 521****5678: PAUSE — permanece en VALUE
[FSM] Transición inválida CP → COMPLETED para 521****5678
```

**Files:**
- Create: `tools/portfolio-export/capture-trace.js`
- Test: `tests/portfolio-export/capture-trace.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/capture-trace.test.js
'use strict';

const { parseFsmLines, mergeTrace } = require('../../tools/portfolio-export/capture-trace');

describe('parseFsmLines', () => {
  test('lee una transición aplicada', () => {
    const [t] = parseFsmLines('[FSM] 521****5678: GREETING → INTENTION (PROVIDE_DATA conf=0.92)');
    expect(t).toEqual({
      stateBefore: 'GREETING', stateAfter: 'INTENTION',
      intent: 'PROVIDE_DATA', confidence: 0.92, applied: true, reason: null,
    });
  });

  test('lee un rechazo por baja confianza: el lead no avanza', () => {
    const [t] = parseFsmLines('[FSM] Baja confianza (0.41) para 521****5678. Permanece en CP');
    expect(t).toMatchObject({
      stateBefore: 'CP', stateAfter: 'CP', confidence: 0.41,
      applied: false, reason: 'low_confidence',
    });
  });

  test('lee un PAUSE como self-transition', () => {
    const [t] = parseFsmLines('[FSM] 521****5678: PAUSE — permanece en VALUE');
    expect(t).toMatchObject({
      stateBefore: 'VALUE', stateAfter: 'VALUE', intent: 'PAUSE', applied: false, reason: 'pause',
    });
  });

  test('lee una transición inválida rechazada por el grafo', () => {
    const [t] = parseFsmLines('[FSM] Transición inválida CP → COMPLETED para 521****5678');
    expect(t).toMatchObject({
      stateBefore: 'CP', stateAfter: 'CP', applied: false, reason: 'invalid_transition',
    });
  });

  test('ignora las líneas que no son del FSM', () => {
    expect(parseFsmLines('[SOFI] mensaje recibido\n[AI] Error OpenRouter')).toEqual([]);
  });
});

describe('mergeTrace', () => {
  const turns = [
    { i: 0, dir: 'in',  text: 'Hola',       tOffsetMs: 0 },
    { i: 1, dir: 'out', text: '¡Hola! 😊',  tOffsetMs: 4000 },
    { i: 2, dir: 'in',  text: 'Soy Ana',    tOffsetMs: 60000 },
    { i: 3, dir: 'out', text: 'Gusto, Ana', tOffsetMs: 63000 },
  ];
  const traces = [
    { stateBefore: 'GREETING', stateAfter: 'GREETING',  intent: 'GREETING',     confidence: 0.98, applied: false, reason: null },
    { stateBefore: 'GREETING', stateAfter: 'INTENTION', intent: 'PROVIDE_DATA', confidence: 0.93, applied: true,  reason: null },
  ];
  const extracted = [{}, { firstname: 'Ana' }];

  test('pega un trace a cada turno entrante, y solo a los entrantes', () => {
    const out = mergeTrace(turns, traces, extracted, { capturedAt: '2026-05' });
    expect(out.turns[0].trace.intent).toBe('GREETING');
    expect(out.turns[2].trace.stateAfter).toBe('INTENTION');
    expect(out.turns[1].trace).toBeUndefined();
    expect(out.turns[3].trace).toBeUndefined();
  });

  test('adjunta lo que el modelo extrajo en cada turno', () => {
    const out = mergeTrace(turns, traces, extracted, { capturedAt: '2026-05' });
    expect(out.turns[2].trace.extracted).toEqual({ firstname: 'Ana' });
  });

  test('la procedencia declara las dos fuentes y el estado final', () => {
    const out = mergeTrace(turns, traces, extracted, { capturedAt: '2026-05' });
    expect(out.provenance.capturedAt).toBe('2026-05');
    expect(out.provenance.turnCount).toBe(4);
    expect(out.provenance.finalState).toBe('INTENTION');
    expect(out.provenance.messages).toMatch(/producción/i);
    expect(out.provenance.trace).toMatch(/replay/i);
  });

  test('truena si el número de traces no cuadra con el de turnos entrantes', () => {
    expect(() => mergeTrace(turns, [traces[0]], [{}], { capturedAt: '2026-05' }))
      .toThrow(/2 turnos entrantes.*1 trace/i);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/capture-trace.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar el parser y el merge**

```js
// tools/portfolio-export/capture-trace.js
'use strict';

const RE_APPLIED = /^\[FSM\] .+?: ([A-Z_]+) → ([A-Z_]+) \(([A-Z_]+) conf=([\d.]+)\)/;
const RE_LOWCONF = /^\[FSM\] Baja confianza \(([\d.]+)\).*Permanece en ([A-Z_]+)/;
const RE_PAUSE   = /^\[FSM\] .+?: PAUSE — permanece en ([A-Z_]+)/;
const RE_INVALID = /^\[FSM\] Transición inválida ([A-Z_]+) → ([A-Z_]+)/;

/** Lee el log de SOFI y devuelve un trace por cada decisión del FSM, en orden. */
function parseFsmLines(logText) {
  const traces = [];

  for (const line of logText.split('\n')) {
    let m;
    if ((m = line.match(RE_APPLIED))) {
      traces.push({
        stateBefore: m[1], stateAfter: m[2], intent: m[3],
        confidence: Number(m[4]), applied: true, reason: null,
      });
    } else if ((m = line.match(RE_LOWCONF))) {
      traces.push({
        stateBefore: m[2], stateAfter: m[2], intent: null,
        confidence: Number(m[1]), applied: false, reason: 'low_confidence',
      });
    } else if ((m = line.match(RE_PAUSE))) {
      traces.push({
        stateBefore: m[1], stateAfter: m[1], intent: 'PAUSE',
        confidence: null, applied: false, reason: 'pause',
      });
    } else if ((m = line.match(RE_INVALID))) {
      traces.push({
        stateBefore: m[1], stateAfter: m[1], intent: null,
        confidence: null, applied: false, reason: 'invalid_transition',
        rejected: m[2],
      });
    }
  }
  return traces;
}

/**
 * Turnos de producción + traces del replay = el objeto que consume la página.
 * El trace solo cuelga de los turnos entrantes: el FSM corre sobre lo que entra.
 */
function mergeTrace(turns, traces, extractedPerTurn, meta) {
  const inbound = turns.filter((t) => t.dir === 'in');
  if (inbound.length !== traces.length) {
    throw new Error(
      `capture-trace: hay ${inbound.length} turnos entrantes pero ${traces.length} traces. ` +
      'El replay no cubrió toda la conversación; no publiques esto.'
    );
  }

  let k = 0;
  const merged = turns.map((turn) => {
    if (turn.dir !== 'in') return { ...turn };
    const trace = { ...traces[k], extracted: extractedPerTurn[k] || {} };
    k++;
    return { ...turn, trace };
  });

  const lastTrace = traces[traces.length - 1];

  return {
    provenance: {
      messages: 'Postgres de producción (tabla messages), sanitizada',
      trace: 'Replay de los mensajes sanitizados contra el sistema real (webhook + ai.service + fsm.service)',
      capturedAt: meta.capturedAt,
      turnCount: turns.length,
      finalState: lastTrace ? lastTrace.stateAfter : null,
    },
    turns: merged,
  };
}

module.exports = { parseFsmLines, mergeTrace };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/capture-trace.test.js`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/capture-trace.js tests/portfolio-export/capture-trace.test.js
git commit -m "feat(portfolio-export): parser del log del FSM y merge del trace"
```

---

## Task 7: Correr el pipeline y capturar la conversación

Aquí no hay código nuevo que testear: es el runbook que produce el artefacto. **Diego lo corre, y el paso 4 es un gate humano.**

**Files:**
- Create: `tools/portfolio-export/RUNBOOK.md`
- Create (generado, fuera de git): `$SOFI_EXPORT_DIR/raw-conversation.json`, `$SOFI_EXPORT_DIR/mapping.json`
- Create (repo del sitio): `assets/data/sofi/sofi-conversation.js`

- [ ] **Step 1: Extraer la conversación cruda de producción**

```bash
export SOFI_EXPORT_DIR="$HOME/sofi-export-tmp"   # fuera de cualquier repo
mkdir -p "$SOFI_EXPORT_DIR"
export DATABASE_URL="<url publica de la Postgres de produccion>"
node tools/portfolio-export/extract-conversation.js "<phone del lead>"
```
Expected: `[extract] N turnos, latencia mediana M ms`. Si truena con "no terminó en COMPLETED", elige otro teléfono.

- [ ] **Step 2: Escribir el mapping de sanitización**

Crea `$SOFI_EXPORT_DIR/mapping.json` a mano leyendo el crudo. Una entrada por cada dato identificable: nombre completo, nombre suelto, teléfono, colonia, CP, valor de la propiedad, calle si aparece. Los reemplazos deben ser plausibles, no `XXXX`.

```json
{
  "Marcela Gutiérrez": "Ana Solís",
  "Marcela": "Ana",
  "Valle Oriente": "Villa Olímpica",
  "66269": "64000",
  "5218112345678": "5210000000000",
  "2,350,000": "1,900,000"
}
```

- [ ] **Step 3: Sanitizar y verificar**

```bash
node -e "
const fs = require('fs');
const { sanitizeTurns, assertClean } = require('./tools/portfolio-export/sanitize');
const dir = process.env.SOFI_EXPORT_DIR;
const raw = JSON.parse(fs.readFileSync(dir + '/raw-conversation.json', 'utf8'));
const mapping = JSON.parse(fs.readFileSync(dir + '/mapping.json', 'utf8'));
const turns = assertClean(sanitizeTurns(raw.turns, mapping), mapping);
fs.writeFileSync(dir + '/clean-turns.json', JSON.stringify({ ...raw, turns }, null, 2));
console.log('[sanitize] limpio:', turns.length, 'turnos');
"
```
Expected: `[sanitize] limpio: N turnos`. Si truena, agrega la entrada que falta al mapping y repite. **No sigas hasta que pase.**

- [ ] **Step 4: GATE — Diego lee el hilo completo**

```bash
node -e "
const t = require(process.env.SOFI_EXPORT_DIR + '/clean-turns.json').turns;
t.forEach(x => console.log((x.dir === 'in' ? '  LEAD  ' : '  SOFI  ') + x.text));
"
```

Diego lee los N turnos. Si algo incomoda, **no se publica** y se elige otra conversación. Este gate es de la spec y no se salta.

- [ ] **Step 5: Levantar el banco de pruebas**

```bash
docker compose -f tools/demo-harness/docker-compose.yml up -d
node tools/demo-harness/mock-graph.js > tools/demo-harness/out/mock.log 2>&1 &
ENV_FILE=.env.local node server.js > tools/demo-harness/out/sofi.log 2>&1 &
ENV_FILE=.env.local node tools/demo-harness/smoke.js "Hola"
```
Expected: el smoke reporta que el webhook aceptó y el mock recibió una respuesta **real** de SOFI (no `Lo siento, tuve un problema técnico`). Ese texto de fallback significa que OpenRouter no está respondiendo: revisa `OPENROUTER_API_KEY` en `.env.local` antes de seguir. Sin modelo vivo no hay intents ni confidences, y el replay no sirve.

- [ ] **Step 6: Replayar los turnos sanitizados y capturar el trace**

```bash
node -e "
(async () => {
  const fs = require('fs');
  const { parseFsmLines, mergeTrace } = require('./tools/portfolio-export/capture-trace');
  const { emitDataFile } = require('./tools/portfolio-export/emit');
  const memoryService = require('./src/services/memory.service');

  const dir   = process.env.SOFI_EXPORT_DIR;
  const site  = process.env.SITE_REPO;
  const data  = JSON.parse(fs.readFileSync(dir + '/clean-turns.json', 'utf8'));
  const phone = process.env.DEMO_LEAD_PHONE || '5218112345678';
  const LOG   = 'tools/demo-harness/out/sofi.log';

  const logStart = fs.statSync(LOG).size;   // solo leemos lo que este replay escriba
  const extracted = [];

  for (const turn of data.turns.filter(t => t.dir === 'in')) {
    require('child_process').execSync(
      \`ENV_FILE=.env.local node tools/demo-harness/smoke.js \${JSON.stringify(turn.text)}\`,
      { stdio: 'inherit' },
    );
    await new Promise(r => setTimeout(r, 6000));   // deja que el turno termine de procesarse
    const session = await memoryService.getOrCreate(phone);
    extracted.push({
      firstname: session.firstname, cp: session.cp,
      colonia_propiedad: session.colonia_propiedad, tipo_propiedad: session.tipo_propiedad,
    });
  }

  const logText = fs.readFileSync(LOG, 'utf8').slice(logStart);
  const traces  = parseFsmLines(logText);
  const merged  = mergeTrace(data.turns, traces, extracted, { capturedAt: data.capturedAt });

  emitDataFile('SOFI_CONVERSATION', merged, site + '/assets/data/sofi/sofi-conversation.js');
  console.log('[capture] estado final del replay:', merged.provenance.finalState);
  process.exit(0);
})();
"
```

Expected: `[capture] estado final del replay: COMPLETED`.

Si `mergeTrace` truena con "hay N turnos entrantes pero M traces", el replay se desincronizó: sube la espera de 6 s, borra la sesión del Redis del banco (`docker exec sofi-demo-redis redis-cli FLUSHALL`) y vuelve a correr desde el primer turno. **No publiques un trace incompleto.**

Si el estado final del replay **no** es `COMPLETED` aunque en producción sí lo fue, dilo en la página en vez de esconderlo: el modelo es no determinista y el replay puede divergir. Lo honesto es elegir otra conversación o declarar la divergencia.

- [ ] **Step 7: Bajar el banco y borrar el crudo**

```bash
docker compose -f tools/demo-harness/docker-compose.yml down -v
rm -rf "$SOFI_EXPORT_DIR"
```
El crudo con PII deja de existir. Lo único que sobrevive es el `.js` sanitizado en el repo del sitio.

- [ ] **Step 8: Verificar que no quedó PII en el artefacto y commitear**

```bash
cd "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
grep -nE '[0-9]{7,}' assets/data/sofi/sofi-conversation.js || echo "sin cadenas largas de digitos"
git add assets/data/sofi/sofi-conversation.js
git commit -m "feat(sofi): conversacion real sanitizada con el trace del FSM"
```
Expected: solo aparecen los `tOffsetMs`, que son offsets en milisegundos y no identifican a nadie.

- [ ] **Step 9: Escribir el RUNBOOK con estos pasos y commitear** (repo de SOFI)

```bash
git add tools/portfolio-export/RUNBOOK.md
git commit -m "docs(portfolio-export): runbook del pipeline de la conversacion"
```

---

## Task 8: Ficha técnica

Cada número con su método al lado. Se recalculan aquí, no se copian de la spec.

**Files:**
- Create: `tools/portfolio-export/extract-metrics.js`
- Test: `tests/portfolio-export/extract-metrics.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/extract-metrics.test.js
'use strict';

const { buildMetrics } = require('../../tools/portfolio-export/extract-metrics');

describe('buildMetrics', () => {
  const input = {
    commits: 504,
    tests: 390,
    states: 12,
    intents: 8,
    firstCommit: '2026-05-03',
    lastCommit: '2026-06-23',
    replyLatencyMsMedian: 4200,
    generatedAt: '2026-07-11',
  };

  test('cada métrica lleva su método de cálculo', () => {
    for (const item of buildMetrics(input).items) {
      expect(item.method).toBeTruthy();
      expect(item.method.length).toBeGreaterThan(10);
    }
  });

  test('la latencia se presenta en segundos legibles', () => {
    const latencia = buildMetrics(input).items.find((i) => /latencia/i.test(i.label));
    expect(latencia.value).toBe('4.2 s');
    expect(latencia.method).toMatch(/mediana/i);
  });

  test('no inventa métricas que no vengan en el input', () => {
    const labels = buildMetrics(input).items.map((i) => i.label.toLowerCase()).join(' ');
    expect(labels).not.toMatch(/rodi|speed-to-lead|500%/);
  });

  test('truena si falta un dato en vez de rellenarlo con cero', () => {
    expect(() => buildMetrics({ ...input, commits: undefined })).toThrow(/commits/i);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/extract-metrics.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar**

```js
// tools/portfolio-export/extract-metrics.js
'use strict';

const REQUIRED = [
  'commits', 'tests', 'states', 'intents',
  'firstCommit', 'lastCommit', 'replyLatencyMsMedian', 'generatedAt',
];

function buildMetrics(input) {
  for (const key of REQUIRED) {
    if (input[key] === undefined || input[key] === null) {
      throw new Error(`extract-metrics: falta "${key}". No se rellena con cero: se recalcula o no se publica.`);
    }
  }

  return {
    generatedAt: input.generatedAt,
    items: [
      {
        label: 'Commits',
        value: String(input.commits),
        method: `git rev-list --count HEAD en el repo de SOFI, del ${input.firstCommit} al ${input.lastCommit}.`,
      },
      {
        label: 'Tests automatizados',
        value: String(input.tests),
        method: 'Total de tests que reporta Jest al correr la suite completa del repo.',
      },
      {
        label: 'Estados del FSM',
        value: String(input.states),
        method: 'Extraídos de src/services/fsm.service.js con un script. El diagrama de esta página se genera de ahí.',
      },
      {
        label: 'Intents del modelo',
        value: String(input.intents),
        method: 'Enum cerrado, validado con Zod en src/services/ai.service.js. El modelo no puede devolver otra cosa.',
      },
      {
        label: 'Latencia de respuesta',
        value: `${(input.replyLatencyMsMedian / 1000).toFixed(1)} s`,
        method: 'Mediana de los deltas entre cada mensaje entrante y su respuesta, calculada sobre los timestamps reales de la conversación de producción.',
      },
    ],
  };
}

/** CLI: node tools/portfolio-export/extract-metrics.js <ruta-del-sitio> <latencia-ms> */
async function main() {
  const { execSync } = require('child_process');
  const path = require('path');
  const { extractFsm }   = require('./extract-fsm');
  const { emitDataFile } = require('./emit');

  const site       = process.argv[2];
  const latencyMs  = Number(process.argv[3]);
  if (!site || !Number.isFinite(latencyMs)) {
    console.error('Uso: node tools/portfolio-export/extract-metrics.js <ruta-del-sitio> <latencia-mediana-ms>');
    process.exit(1);
  }

  const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

  const fsm  = extractFsm(
    path.join(__dirname, '../../src/services/fsm.service.js'),
    path.join(__dirname, '../../src/services/ai.service.js'),
  );
  // --passWithNoTests evita que un exit code != 0 tumbe el conteo.
  const jestOut = sh('npx jest --listTests 2>/dev/null | wc -l');

  const metrics = buildMetrics({
    commits: Number(sh('git rev-list --count HEAD')),
    tests: Number(sh("npx jest --silent 2>&1 | grep -oE 'Tests:.*[0-9]+ passed' | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+'")),
    states: fsm.states.length,
    intents: fsm.intents.length,
    firstCommit: sh('git log --reverse --format=%as | head -1'),
    lastCommit: sh('git log -1 --format=%as'),
    replyLatencyMsMedian: latencyMs,
    generatedAt: new Date().toISOString().slice(0, 10),
  });

  emitDataFile('SOFI_METRICS', metrics, path.join(site, 'assets/data/sofi/sofi-metrics.js'));
  console.log(`[metrics] ${metrics.items.length} métricas, ${jestOut.trim()} archivos de test`);
}

if (require.main === module) main().catch((e) => { console.error(e.message); process.exit(1); });

module.exports = { buildMetrics };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/extract-metrics.test.js`
Expected: PASS, 4 tests.

- [ ] **Step 5: Generar el data file**

Run (con la latencia mediana que reportó la Task 7, paso 1):
```bash
node tools/portfolio-export/extract-metrics.js "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage" 4200
```
Expected: `[metrics] 5 métricas, N archivos de test`

- [ ] **Step 6: Correr la suite completa y commitear**

```bash
npx jest
git add tools/portfolio-export/extract-metrics.js tests/portfolio-export/extract-metrics.test.js
git commit -m "feat(portfolio-export): ficha tecnica con el metodo de cada metrica"

cd "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
git add assets/data/sofi/sofi-metrics.js
git commit -m "feat(sofi): ficha tecnica generada desde el sistema"
```
Expected: la suite completa pasa (los 390 que ya había + los nuevos).

---

## Task 9: Esqueleto de la página

De aquí en adelante, todo es el repo del sitio.

**Files:**
- Create: `cases/sofi.html`

- [ ] **Step 1: Escribir el esqueleto**

Copia el `<head>`, la `<nav>` y el `<footer>` de `cases/heineken.html` (mismo DS, mismas clases: `.nav`, `.nav__inner`, `.nav__brand`, `.nav__links`, `.container`, `.section-label`, `.section-title`, `.btn`). Cambia lo que sigue:

```html
  <title>SOFI — Diego Maury</title>
  <meta name="description" content="Un agente de WhatsApp en producción: máquina de estados, contrato cerrado con el modelo y una conversación real reproducida paso a paso.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://diegomaury.mx/cases/sofi.html">
```

El `noindex` se queda hasta que Diego apruebe la página. La spec es explícita: no se enlaza, no entra al sitemap.

Antes de `</body>`, los tres data files y el JS de la página:

```html
  <script src="../assets/data/sofi/sofi-fsm.js"></script>
  <script src="../assets/data/sofi/sofi-conversation.js"></script>
  <script src="../assets/data/sofi/sofi-metrics.js"></script>
  <script src="../assets/js/main.js"></script>
  <script src="../assets/js/sofi-case.js"></script>
```

Y el cuerpo, con las ocho secciones de la spec como contenedores vacíos que las tasks siguientes llenan:

```html
<main>
  <section class="case-hero bg-pattern" id="hero"></section>
  <section class="sofi-section" id="caso"></section>
  <section class="sofi-switch" id="switch"></section>
  <section class="sofi-section" id="simulador"></section>
  <section class="sofi-section" id="arquitectura"></section>
  <section class="sofi-section" id="fsm"></section>
  <section class="sofi-section" id="ficha"></section>
  <section class="sofi-section" id="limites"></section>
</main>
```

- [ ] **Step 2: Hero, con el hueco del video**

Dentro de `#hero`, en un `.container`:

```html
<a href="../portfolio/" class="case-hero__back">← Portafolio</a>
<p class="case-hero__tag">FlipHouse · 2026</p>
<h1 class="case-hero__title">SOFI</h1>
<p class="case-hero__sub">
  Un agente de WhatsApp que califica leads inmobiliarios. Lo construí yo, corrió en
  producción, y aquí abajo lo puedes ver funcionar.
</p>

<!-- Hueco del video de /brag. Si el archivo no existe, el JS lo esconde y la
     página funciona igual. Es pieza de presentación, no evidencia. -->
<figure class="sofi-video" id="sofi-video" hidden>
  <video src="../assets/video/sofi-brag.mp4" controls playsinline preload="none"></video>
  <figcaption>
    Pieza de presentación, generada a partir del código. No es una grabación del
    sistema corriendo, y por eso no cuenta como evidencia.
  </figcaption>
</figure>
```

- [ ] **Step 3: Verificar en el navegador**

Run: `python -m http.server 8080` y abre `localhost:8080/cases/sofi.html`
Expected: nav y footer idénticos a los de heineken, hero con fondo Catalyst, sin errores en la consola.

- [ ] **Step 4: Commit**

```bash
git add cases/sofi.html
git commit -m "feat(sofi): esqueleto de la pagina de caso"
```

---

## Task 10: El caso en corto, y el cambio de registro

**Files:**
- Modify: `cases/sofi.html` (`#caso`, `#switch`)

- [ ] **Step 1: Escribir la sección del caso**

Copy tomado de la ficha de Notion (`325c2572-f46a-4e17-bbcf-e27dde28a94f`), condensado a la voz de Diego: primera persona, tuteo, sin em dash, filo por contraste. **Ni una cifra que no esté en la ficha.**

```html
<div class="container">
  <p class="section-label">El caso</p>
  <h2 class="section-title">El lead llegaba y nadie lo tocaba en tres días</h2>
  <div class="sofi-prose">
    <p>
      FlipHouse captaba leads por varios frentes, Meta Lead Ads entre ellos, sin un
      sistema que los recibiera. Entré como director de operaciones fraccional, no como
      consultor de un entregable: el encargo era que la operación comercial funcionara,
      no que existiera un documento que dijera cómo debería funcionar.
    </p>
    <p>
      El problema no era falta de leads. Era que el lead llegaba y nadie lo tocaba en
      uno a tres días. Para cuando alguien respondía, el prospecto ya estaba en otra
      conversación. No había captura estructurada, ni enrutamiento, ni criterio de
      calificación. Cada área tenía su versión de los hechos.
    </p>
    <p>
      Eso no se arregla contratando a alguien que conteste más rápido. Se arregla
      construyendo el sistema. Construí SOFI: un agente con IA que califica al lead de
      punta a punta sin intervención humana, sobre HubSpot como fuente única de verdad,
      con la captura y el enrutamiento rediseñados de Meta Lead Ads a HubSpot vía Make.
    </p>
    <p>
      <strong>El trade-off.</strong> SOFI nació como agente de voz. La voz demuestra
      mejor, pero el prospecto de FlipHouse no contesta llamadas de números
      desconocidos: contesta WhatsApp. Migré el canal principal aunque implicara rehacer
      toda la capa de conversación, porque el objetivo era contactar al lead, no lucir
      la tecnología.
    </p>
    <p>
      Lo haría distinto: construí en voz antes de validar el canal con prospectos
      reales. La lección no es que la voz sea peor que WhatsApp. Es que el canal es una
      hipótesis del negocio, no una decisión de arquitectura, y se valida antes de
      construir encima.
    </p>
  </div>
</div>
```

- [ ] **Step 2: Escribir el cambio de registro**

Es la línea que parte la página en dos. Va sola, grande, sin adornos.

```html
<div class="container">
  <p class="sofi-switch__line">
    Hasta aquí te lo conté. De aquí en adelante te lo demuestro.
  </p>
</div>
```

```css
.sofi-switch {
  padding: clamp(4rem, 8vw, 7rem) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.sofi-switch__line {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.5rem, 1rem + 2.5vw, 2.75rem);
  line-height: 1.15;
  max-width: 18ch;
  color: var(--dm-bone);
}
```

- [ ] **Step 3: Verificar y commitear**

Recarga la página. La línea tiene que leerse como un corte, no como un subtítulo más.

```bash
git add cases/sofi.html
git commit -m "feat(sofi): el caso en corto y el cambio de registro"
```

---

## Task 11: El simulador

El artefacto central. Dos columnas: el hilo de WhatsApp a la izquierda, el estado del FSM sincronizado a la derecha. Controles de reproducir, pausar y paso a paso. Y la declaración de qué es esto, arriba, sin letra chica.

**Files:**
- Create: `assets/js/sofi-case.js`
- Modify: `cases/sofi.html` (`#simulador`)

- [ ] **Step 1: Markup del simulador**

```html
<div class="container">
  <p class="section-label">Evidencia</p>
  <h2 class="section-title">Una conversación real, paso a paso</h2>

  <!-- La declaración va ARRIBA y en el mismo tamaño que el resto. Si la
       evidencia necesita letra chica, no es evidencia. -->
  <p class="sofi-declara" id="sofi-declara"></p>

  <div class="sofi-sim">
    <div class="sofi-sim__thread" id="sofi-thread" aria-live="polite"></div>
    <aside class="sofi-sim__panel" id="sofi-panel"></aside>
  </div>

  <div class="sofi-sim__controls">
    <button class="btn btn--primary" id="sofi-play">Reproducir</button>
    <button class="btn btn--outline" id="sofi-step">Paso siguiente</button>
    <button class="btn btn--outline" id="sofi-reset">Reiniciar</button>
    <span class="sofi-sim__counter" id="sofi-counter"></span>
  </div>
</div>
```

- [ ] **Step 2: Escribir el JS del simulador**

```js
// assets/js/sofi-case.js
(function () {
  'use strict';

  const conv = window.SOFI_CONVERSATION;
  const fsm  = window.SOFI_FSM;
  if (!conv || !fsm) return;

  const thread  = document.getElementById('sofi-thread');
  const panel   = document.getElementById('sofi-panel');
  const counter = document.getElementById('sofi-counter');
  const declara = document.getElementById('sofi-declara');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  declara.textContent =
    `Los mensajes son de una conversación real de producción de ${conv.provenance.capturedAt}, ` +
    `sanitizada. El panel de la derecha no es una recreación: es la salida del FSM real ` +
    `ejecutándose sobre esos mismos mensajes.`;

  let cursor = 0;
  let timer  = null;

  function bubble(turn) {
    const el = document.createElement('div');
    el.className = `sofi-msg sofi-msg--${turn.dir}`;
    const t = document.createElement('span');
    t.className = 'sofi-msg__time';
    t.textContent = `+${(turn.tOffsetMs / 1000).toFixed(1)} s`;
    const p = document.createElement('p');
    p.textContent = turn.text;          // textContent, nunca innerHTML: el texto viene de un lead
    el.append(p, t);
    return el;
  }

  function renderPanel(turn) {
    if (!turn.trace) return;            // los turnos salientes no mueven el FSM
    const tr = turn.trace;

    const rows = [
      ['Estado', tr.stateBefore],
      ['Intent del modelo', tr.intent || '—'],
      ['Confianza', tr.confidence === null ? '—' : tr.confidence.toFixed(2)],
      ['Umbral', fsm.confidenceThreshold.toFixed(2)],
      ['Decisión del FSM', tr.applied ? `${tr.stateBefore} → ${tr.stateAfter}` : 'No avanza'],
    ];

    const extracted = Object.entries(tr.extracted || {}).filter(([, v]) => v);
    if (extracted.length) rows.push(['Escrito en HubSpot', extracted.map(([k, v]) => `${k}: ${v}`).join(', ')]);

    const motivos = {
      low_confidence: `El modelo dudó (${tr.confidence} < ${fsm.confidenceThreshold}). El lead se queda donde está.`,
      invalid_transition: `El grafo rechazó ${tr.stateBefore} → ${tr.rejected}. Transición imposible.`,
      pause: 'El lead pidió pausa. El FSM no se mueve y la entrevista retoma donde quedó.',
    };

    panel.innerHTML = '';
    for (const [label, value] of rows) {
      const row = document.createElement('div');
      row.className = 'sofi-panel__row';
      row.innerHTML = '<dt></dt><dd></dd>';
      row.querySelector('dt').textContent = label;
      row.querySelector('dd').textContent = value;
      panel.appendChild(row);
    }
    if (!tr.applied && motivos[tr.reason]) {
      const why = document.createElement('p');
      why.className = 'sofi-panel__why';
      why.textContent = motivos[tr.reason];
      panel.appendChild(why);
    }
    panel.classList.toggle('is-blocked', !tr.applied);
  }

  function step() {
    if (cursor >= conv.turns.length) { pause(); return; }
    const turn = conv.turns[cursor];
    thread.appendChild(bubble(turn));
    thread.scrollTop = thread.scrollHeight;
    renderPanel(turn);
    cursor++;
    counter.textContent = `${cursor} / ${conv.turns.length}`;
  }

  function play() {
    if (timer) return;
    document.getElementById('sofi-play').textContent = 'Pausar';
    // Ritmo fijo y legible. No se reproduce la latencia real en tiempo real:
    // la latencia se lee en el sello de cada burbuja.
    timer = setInterval(() => {
      if (cursor >= conv.turns.length) pause();
      else step();
    }, reduced ? 1200 : 900);
  }

  function pause() {
    clearInterval(timer);
    timer = null;
    document.getElementById('sofi-play').textContent =
      cursor >= conv.turns.length ? 'Reproducir de nuevo' : 'Reproducir';
  }

  function reset() {
    pause();
    cursor = 0;
    thread.innerHTML = '';
    panel.innerHTML = '';
    panel.classList.remove('is-blocked');
    counter.textContent = `0 / ${conv.turns.length}`;
  }

  document.getElementById('sofi-play').addEventListener('click', () => (timer ? pause() : play()));
  document.getElementById('sofi-step').addEventListener('click', () => { pause(); step(); });
  document.getElementById('sofi-reset').addEventListener('click', reset);

  reset();

  // El video de /brag solo aparece si el archivo existe.
  const fig = document.getElementById('sofi-video');
  if (fig) {
    const video = fig.querySelector('video');
    fetch(video.getAttribute('src'), { method: 'HEAD' })
      .then((r) => { if (r.ok) fig.hidden = false; })
      .catch(() => {});
  }
})();
```

- [ ] **Step 3: Estilos del simulador**

```css
.sofi-declara {
  max-width: 62ch;
  color: var(--dm-bone);
  border-left: 3px solid var(--dm-ember);
  padding-left: 1rem;
  margin-bottom: 2.5rem;
}
.sofi-sim {
  display: grid;
  grid-template-columns: 1fr 22rem;
  gap: 1.5rem;
  align-items: start;
}
.sofi-sim__thread {
  height: 26rem;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}
.sofi-msg { max-width: 80%; margin-bottom: 0.75rem; padding: 0.6rem 0.85rem; border-radius: 12px; }
.sofi-msg--in  { background: rgba(255, 255, 255, 0.06); }
.sofi-msg--out { background: var(--dm-amethyst); margin-left: auto; }
.sofi-msg__time { display: block; margin-top: 0.35rem; font-family: var(--font-mono); font-size: 0.65rem; color: var(--dm-white-40); }
.sofi-sim__panel {
  position: sticky; top: 6rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border-left: 3px solid var(--dm-spark);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
.sofi-sim__panel.is-blocked { border-left-color: var(--dm-ember); }
.sofi-panel__row { display: flex; justify-content: space-between; gap: 1rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.sofi-panel__row dt { color: var(--dm-white-40); }
.sofi-panel__why { margin-top: 0.85rem; color: var(--dm-ember); line-height: 1.5; }
.sofi-sim__controls { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; }
.sofi-sim__counter { font-family: var(--font-mono); font-size: 0.75rem; color: var(--dm-white-40); }

@media (max-width: 860px) {
  .sofi-sim { grid-template-columns: 1fr; }
  .sofi-sim__panel { position: static; }
}
```

- [ ] **Step 4: Verificar en el navegador**

Abre `localhost:8080/cases/sofi.html`, dale Reproducir y comprueba tres cosas: el hilo avanza, el panel cambia de estado con cada mensaje entrante, y el paso a paso funciona. Si algún turno entrante deja el panel vacío, el trace se desincronizó: vuelve a la Task 7.

- [ ] **Step 5: Commit**

```bash
git add cases/sofi.html assets/js/sofi-case.js
git commit -m "feat(sofi): simulador de la conversacion con el FSM sincronizado"
```

---

## Task 12: Arquitectura y FSM

Los dos diagramas. El de arquitectura es SVG inline escrito a mano, pero **cada caja nombra su archivo o servicio real**. El del FSM se dibuja desde `window.SOFI_FSM`: si el código cambia y se regenera el data file, el diagrama cambia solo.

**Files:**
- Modify: `cases/sofi.html` (`#arquitectura`, `#fsm`)
- Modify: `assets/js/sofi-case.js`

- [ ] **Step 1: Sección de arquitectura**

SVG inline, sin librerías. Cada caja lleva el nombre real de su archivo o servicio, verificado contra el repo.

```html
<div class="container">
  <p class="section-label">Arquitectura</p>
  <h2 class="section-title">El recorrido de un lead</h2>
  <p class="sofi-prose">Cada caja es un archivo o un servicio que existe. Ninguna es decorativa.</p>

  <svg class="sofi-arch" viewBox="0 0 920 400" role="img"
       aria-label="Diagrama de arquitectura de SOFI. Un mensaje entra por la WhatsApp Cloud API al webhookController, que verifica la firma HMAC. El mensaje pasa a ai.service.js, que llama a OpenRouter y valida la respuesta del modelo con Zod. fsm.service.js decide el estado. hubspot.service.js escribe la propiedad en el CRM y Make dispara el escenario S1. Todo corre en Railway sobre PostgreSQL y Redis.">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/>
      </marker>
    </defs>

    <g class="sofi-arch__flow">
      <!-- Fila 1: la entrada -->
      <rect x="10"  y="30" width="180" height="64" rx="10"/>
      <text x="100" y="56" class="sofi-arch__name">WhatsApp Cloud API</text>
      <text x="100" y="76" class="sofi-arch__note">mensaje del lead</text>

      <rect x="240" y="30" width="200" height="64" rx="10"/>
      <text x="340" y="56" class="sofi-arch__name">webhookController.js</text>
      <text x="340" y="76" class="sofi-arch__note">verifica la firma HMAC</text>

      <rect x="490" y="30" width="190" height="64" rx="10"/>
      <text x="585" y="56" class="sofi-arch__name">ai.service.js</text>
      <text x="585" y="76" class="sofi-arch__note">OpenRouter · contrato Zod</text>

      <line x1="190" y1="62" x2="238" y2="62" marker-end="url(#arrow)"/>
      <line x1="440" y1="62" x2="488" y2="62" marker-end="url(#arrow)"/>

      <!-- Fila 2: la decisión. El modelo devuelve intent + confidence, no un estado. -->
      <rect x="490" y="160" width="190" height="64" rx="10" class="sofi-arch__box--key"/>
      <text x="585" y="186" class="sofi-arch__name">fsm.service.js</text>
      <text x="585" y="206" class="sofi-arch__note">decide el estado</text>

      <line x1="585" y1="94" x2="585" y2="158" marker-end="url(#arrow)"/>
      <text x="600" y="130" class="sofi-arch__edge">intent + confidence</text>

      <!-- Fila 3: la escritura -->
      <rect x="240" y="290" width="200" height="64" rx="10"/>
      <text x="340" y="316" class="sofi-arch__name">hubspot.service.js</text>
      <text x="340" y="336" class="sofi-arch__note">escribe la propiedad</text>

      <rect x="490" y="290" width="190" height="64" rx="10"/>
      <text x="585" y="316" class="sofi-arch__name">Make · escenario S1</text>
      <text x="585" y="336" class="sofi-arch__note">enrutamiento</text>

      <line x1="585" y1="224" x2="585" y2="288" marker-end="url(#arrow)"/>
      <line x1="488" y1="322" x2="442" y2="322" marker-end="url(#arrow)"/>

      <!-- La respuesta vuelve al lead -->
      <path d="M 490 192 L 100 192 L 100 96" fill="none" marker-end="url(#arrow)"/>
      <text x="150" y="182" class="sofi-arch__edge">respuesta al lead</text>

      <!-- Infraestructura -->
      <rect x="730" y="30" width="180" height="194" rx="10" class="sofi-arch__box--infra"/>
      <text x="820" y="60"  class="sofi-arch__name">Railway</text>
      <text x="820" y="90"  class="sofi-arch__note">Node 24 · Express</text>
      <text x="820" y="130" class="sofi-arch__note">PostgreSQL</text>
      <text x="820" y="155" class="sofi-arch__note">Redis (sesión del FSM)</text>
      <text x="820" y="195" class="sofi-arch__note">390 tests · Jest</text>
    </g>
  </svg>
</div>
```

```css
.sofi-arch { width: 100%; height: auto; color: var(--dm-white-40); }
.sofi-arch rect {
  fill: rgba(255, 255, 255, 0.03);
  stroke: rgba(255, 255, 255, 0.12);
}
.sofi-arch__box--key   { stroke: var(--dm-spark); fill: rgba(240, 180, 41, 0.06); }
.sofi-arch__box--infra { stroke-dasharray: 4 4; }
.sofi-arch line, .sofi-arch path { stroke: currentColor; stroke-width: 1.5; }
.sofi-arch__name {
  fill: var(--dm-bone); font-family: var(--font-mono);
  font-size: 13px; text-anchor: middle;
}
.sofi-arch__note {
  fill: var(--dm-white-40); font-family: var(--font-mono);
  font-size: 10px; text-anchor: middle;
}
.sofi-arch__edge {
  fill: var(--dm-white-40); font-family: var(--font-mono); font-size: 10px;
}
```

El `viewBox` hace que el SVG escale solo. En móvil se lee apretado pero completo; no hay versión alterna.

- [ ] **Step 2: Sección del FSM, con el argumento**

El argumento del caso, verificado contra `fsm.service.js` y `ai.service.js`:

```html
<div class="container">
  <p class="section-label">La máquina de estados</p>
  <h2 class="section-title">El modelo no decide el estado</h2>

  <blockquote class="sofi-quote">
    El modelo clasifica la intención y extrae datos. Una tabla de transiciones decide,
    valida contra el grafo y rechaza lo imposible. Si el modelo duda, el lead no avanza.
  </blockquote>

  <div class="sofi-locks">
    <div class="sofi-lock">
      <h3>Umbral de confianza</h3>
      <p>Si el modelo va por debajo de <strong id="sofi-threshold"></strong>, el FSM no se mueve.</p>
    </div>
    <div class="sofi-lock">
      <h3>Tabla de transiciones</h3>
      <p>El estado destino sale de <code>TRANSITION_TABLE[estado][intent]</code>. Si la combinación no existe, el lead se queda donde está.</p>
    </div>
    <div class="sofi-lock">
      <h3>Validación contra el grafo</h3>
      <p><code>STATE_MAP</code> rechaza y loguea las transiciones inválidas. Los estados terminales son absorbentes: no tienen salida.</p>
    </div>
  </div>

  <p class="sofi-consecuencia">
    El peor caso de una alucinación del modelo es que el lead no avance. Nunca que
    aterrice en un estado imposible.
  </p>

  <div class="sofi-fsm" id="sofi-fsm-grid"></div>
</div>
```

- [ ] **Step 3: Render del FSM desde el data file**

Añade a `assets/js/sofi-case.js`, dentro del mismo IIFE:

```js
  // ---- Diagrama del FSM, dibujado desde el código extraído ----
  const threshold = document.getElementById('sofi-threshold');
  if (threshold) threshold.textContent = fsm.confidenceThreshold.toFixed(2);

  const grid = document.getElementById('sofi-fsm-grid');
  if (grid) {
    for (const state of fsm.states) {
      const salidas = fsm.stateMap[state] || [];
      const esTerminal = fsm.terminalStates.includes(state);

      const card = document.createElement('article');
      card.className = 'sofi-state' + (esTerminal ? ' sofi-state--terminal' : '');

      const h = document.createElement('h4');
      h.textContent = state;

      const p = document.createElement('p');
      p.textContent = esTerminal
        ? 'Terminal. No tiene transiciones de salida.'
        : `Puede pasar a: ${salidas.join(', ')}`;

      const intents = Object.entries(fsm.transitionTable[state] || {})
        .map(([intent, destino]) => `${intent} → ${destino}`);
      const ul = document.createElement('ul');
      for (const linea of intents) {
        const li = document.createElement('li');
        li.textContent = linea;
        ul.appendChild(li);
      }

      card.append(h, p, ul);
      grid.appendChild(card);
    }
  }
```

- [ ] **Step 4: Verificar que el diagrama sale del código**

En la consola del navegador: `window.SOFI_FSM.states.length` → `12`. En la página, cuenta las tarjetas de estado: tienen que ser 12, y `COMPLETED`, `HUMAN_TRANSFER` y `DISQUALIFIED` tienen que decir "Terminal".

- [ ] **Step 5: Commit**

```bash
git add cases/sofi.html assets/js/sofi-case.js
git commit -m "feat(sofi): arquitectura y FSM generado desde el codigo"
```

---

## Task 13: Ficha técnica y "Lo que no puedo probar"

La sección 8 es la que hace creíbles a las otras siete.

**Files:**
- Modify: `cases/sofi.html` (`#ficha`, `#limites`)
- Modify: `assets/js/sofi-case.js`

- [ ] **Step 1: Render de la ficha técnica**

```html
<div class="container">
  <p class="section-label">Ficha técnica</p>
  <h2 class="section-title">Los números, y de dónde salen</h2>
  <dl class="sofi-ficha" id="sofi-ficha"></dl>
</div>
```

```js
  // ---- Ficha técnica: cada número con su método al lado ----
  const ficha = document.getElementById('sofi-ficha');
  if (ficha && window.SOFI_METRICS) {
    for (const item of window.SOFI_METRICS.items) {
      const row = document.createElement('div');
      row.className = 'sofi-ficha__row';

      const dt = document.createElement('dt');
      dt.textContent = item.label;

      const val = document.createElement('strong');
      val.className = 'sofi-ficha__value';
      val.textContent = item.value;

      const dd = document.createElement('dd');
      dd.className = 'sofi-ficha__method';
      dd.textContent = item.method;

      row.append(dt, val, dd);
      ficha.appendChild(row);
    }
  }
```

- [ ] **Step 2: Escribir "Lo que no puedo probar"**

Estático, a mano, y con la ✖ visible. Las tres afirmaciones son las del bloque de evidencia de la ficha de Notion, **con su razón exacta**.

Ojo con el RODI, porque la ficha es tajante y el plan original se equivocaba: **no está bajo NDA.** Es un modelo propio, cost-avoidance modelado, no ahorro realizado, y no hay auditoría externa. Presentarlo como "bloqueado por NDA" lo haría sonar más sólido de lo que es, que es justo lo contrario del propósito de esta sección. La nota es obligatoria según la ficha.

```html
<div class="container">
  <p class="section-label">Límites</p>
  <h2 class="section-title">Lo que no puedo probar</h2>
  <p class="sofi-prose">
    Estas tres cifras las sostengo, y aun así ninguno de los artefactos de arriba las
    demuestra. Dos viven en el CRM de FlipHouse, y el CRM no es mío. La tercera es un
    modelo que hice yo. Prefiero enseñarte el hueco a que lo encuentres tú.
  </p>
  <ul class="sofi-limites">
    <li>
      <span class="sofi-x">✖</span>
      <strong>Speed-to-lead: de 1 a 3 días a menos de 5 minutos.</strong>
      Medido en el CRM. El dashboard de HubSpot está bajo NDA.
    </li>
    <li>
      <span class="sofi-x">✖</span>
      <strong>De 5 a 30 leads procesados por semana (+500%).</strong>
      Medido en el CRM. El dashboard de HubSpot está bajo NDA.
    </li>
    <li>
      <span class="sofi-x">✖</span>
      <strong>RODI modelado de +1,291%, payback menor a un mes.</strong>
      Esta no es cuestión de NDA: es un modelo propio. Cost-avoidance modelado, no
      ahorro realizado, y sin auditoría externa. Los ingresos sí están bajo NDA. La
      metodología está disponible a solicitud.
    </li>
  </ul>
  <p class="sofi-prose">
    Lo que sí queda demostrado arriba: el sistema existe, lo construí yo, corrió en
    producción y se comporta como digo que se comporta.
  </p>
</div>
```

- [ ] **Step 3: Verificar y commitear**

Recarga: la ficha muestra las 5 métricas con su método, y la sección de límites muestra las 3 ✖.

```bash
git add cases/sofi.html assets/js/sofi-case.js
git commit -m "feat(sofi): ficha tecnica y la seccion de lo que no puedo probar"
```

---

## Task 14: Responsive, accesibilidad y cierre

**Files:**
- Modify: `cases/sofi.html`
- Modify: `.gitignore`

- [ ] **Step 1: Probar los breakpoints**

Con la página servida, revisa 375, 768 y 1280 px. Criterios: el simulador pasa a una columna por debajo de 860 px, no hay scroll horizontal en ningún ancho, y las tarjetas del FSM se apilan sin desbordarse.

- [ ] **Step 2: Verificar reduced-motion y teclado**

Con `prefers-reduced-motion: reduce` activo, el simulador no debe autoscrollear de forma brusca ni animar transiciones. Los tres botones deben ser alcanzables con Tab y accionables con Enter.

- [ ] **Step 3: Blindar el repo contra el crudo**

```
# El export crudo de la conversación de SOFI. Nunca se versiona.
sofi-export-tmp/
raw-conversation.json
clean-turns.json
mapping.json
```

- [ ] **Step 4: Verificar que el sitio LIVE quedó intacto**

```bash
git diff --stat master -- index.html assets/css/styles.css assets/js/main.js sitemap.xml
```
Expected: **sin salida**. Si algo aparece ahí, revierte: la spec dice que el sitio LIVE no se toca.

- [ ] **Step 5: Verificación final contra el criterio de éxito**

```bash
grep -c "noindex" cases/sofi.html                      # 1
grep -rn "sofi.html" sitemap.xml index.html || echo "no enlazada, correcto"
grep -nE '[0-9]{7,}' assets/data/sofi/sofi-conversation.js  # solo tOffsetMs
git log --oneline --all -- '*raw-conversation*' '*mapping.json*' || echo "el crudo nunca entro a git"
```

- [ ] **Step 6: Commit final**

```bash
git add .gitignore cases/sofi.html
git commit -m "feat(sofi): responsive, accesibilidad y candado del crudo"
```

---

## Lo que este plan deja abierto, a propósito

- **La página no se publica.** Queda con `noindex`, sin enlazar y fuera del sitemap. Quitar el `noindex` y enlazarla es decisión de Diego.
- **La ficha de Notion no se toca.** Sigue en `Draft` / `Publicable = No`. Apuntar `Evidencia` a la URL es decisión de Diego, después de aprobar la página.
- **El aviso a FlipHouse.** La spec lo marca como riesgo aceptado: aun sanitizada, la página publica la estructura de una conversación comercial de un cliente. Si la relación es delicada, avísales antes de quitar el `noindex`. No es un bloqueo técnico.
- **El video de `/brag`.** No bloquea nada. Si `assets/video/sofi-brag.mp4` no existe, el hueco no se renderiza.
- **Las tres métricas de negocio siguen en ✖.** Ningún artefacto de este plan las cierra, y ese era el punto.
