# Artefactos de evidencia de SOFI — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `cases/sofi.html`, una página de caso cuyos artefactos (FSM, arquitectura, simulador, ficha técnica) se derivan del sistema real de SOFI, sin ilustrar nada y sin publicar un solo dato de FlipHouse.

**Architecture:** Dos repos. El **repo de SOFI** (`~/Documents/Claude/Projects/Claude_Code/Fliphouse-whatsapp-agent`) tiene el tooling: extrae el FSM de su propio código, corre una conversación completa contra el sistema real usando el banco de pruebas `tools/demo-harness`, y emite tres archivos de datos. El **repo del sitio** (`newlandingpage`) solo los renderiza. Ninguna credencial y ningún dato de producción entran a este trabajo.

**Tech Stack:** Node 24, Jest (repo de SOFI, 392 tests verdes de base). HTML/CSS/JS vanilla y DS v3 (repo del sitio, sin build). El banco de pruebas ya existe: Docker Compose con Postgres y Redis efímeros, mock de la Graph API, y `chat.js`, que firma el payload con HMAC igual que Meta y lo mete por el `/webhook` real.

---

## De dónde sale el simulador (decidido el 2026-07-11)

**Dos correcciones a la spec, verificadas contra el sistema.**

**Primera: la Postgres de producción no guarda transiciones de estado.** Tiene siete tablas y ninguna es un log del FSM. `messages` guarda texto y timestamps; `conversations` guarda solo el estado final. El estado por turno vivía en la sesión de Redis, que es efímera y ya expiró. El plan original asumía que ese historial existía. No existe.

**Segunda, y es la que define el trabajo: el simulador no usa datos de producción.** Diego corrió una conversación completa contra el sistema real, haciéndola él de lead, y llega hasta `COMPLETED`: saludo, nombre, intención de venta, urgencia, código postal, colonia, tipo de propiedad, escrituras, valor. El banco de pruebas no es una simulación del sistema: es el sistema. La firma HMAC es válida, el webhook es el de producción, el modelo es el de producción y el FSM es el de producción. Lo único inventado es el lead.

Esto borra el pipeline entero que el plan original necesitaba: sin extracción de producción, sin sanitización, sin gate de PII, sin riesgo de NDA y sin aviso a FlipHouse. Y no debilita el argumento técnico, que era el punto de todo: lo que la página demuestra es que **el FSM decide y el modelo no**, y eso se ve igual de bien con un lead inventado.

**Lo que la página tiene que decir, y hay que decirlo sin adornos:** esto demuestra que el sistema existe y funciona. **No** demuestra que atendió a un cliente real. Esa afirmación se sostiene con los commits, los tests y la palabra de Diego, no con el simulador. Si la página insinúa lo contrario, pierde exactamente la credibilidad que la sección "Lo que no puedo probar" está diseñada para ganar.

## Datos verificados del sistema (2026-07-11)

Leídos del código, no copiados de la spec:

- `fsm.service.js`: 12 estados, `CONFIDENCE_THRESHOLD = 0.75`, 3 terminales (`COMPLETED`, `HUMAN_TRANSFER`, `DISQUALIFIED`). `OFF_TOPIC` puede volver a cualquier estado.
- `fsm.service.js` **no exporta** `STATE_MAP`, `TRANSITION_TABLE` ni `CONFIDENCE_THRESHOLD`. Solo exporta `{ fsmService, STATES, ALL_TERMINAL_STATES }`. El extractor no puede hacer un `require()` simple: ver Task 1.
- `ai.service.js`: enum cerrado de 8 intents (`GREETING`, `AFFIRM`, `REJECT`, `QUESTION`, `HUMAN_REQUEST`, `PROVIDE_DATA`, `OFF_TOPIC`, `PAUSE`), `confidence` entre 0 y 1, validado con Zod. **No devuelve un estado.**
- `PAUSE` es self-transition explícita: el lead pide pausa y el FSM no se mueve.
- Suite de base: **392 tests** en 31 suites, verdes.

Los commits, los tests y la latencia se recalculan en la Task 6. No se hardcodean.

## Bug conocido, anotado a propósito

En el dashboard (`app.html`) cada mensaje aparece **duplicado**; en la terminal, una sola vez. Diego lo conoce y no bloquea este trabajo. Queda anotado aquí porque si la duplicación viniera de la escritura en la tabla `messages`, contaminaría cualquier cálculo hecho sobre ella. **Este plan ya no lee esa tabla**, así que no le afecta. Si algún día se retoma la idea de publicar una conversación de producción, hay que resolver esto primero.

## Estructura de archivos

**Repo de SOFI** — tooling nuevo, el sistema no se toca:

| Archivo | Responsabilidad |
|---|---|
| `tools/portfolio-export/extract-fsm.js` | Lee `fsm.service.js` y `ai.service.js`; devuelve estados, transiciones, umbral e intents. |
| `tools/portfolio-export/emit.js` | Escribe un objeto como archivo `.js` que asigna a `window.SOFI_*`. |
| `tools/portfolio-export/build-fsm.js` | CLI: genera `sofi-fsm.js`. |
| `tools/portfolio-export/trace.js` | Parsea el log del FSM y arma el objeto de la conversación. |
| `tools/portfolio-export/capture-run.js` | CLI: corre la conversación contra el harness y genera `sofi-conversation.js`. |
| `tools/portfolio-export/build-metrics.js` | CLI: commits, tests, estados, latencia. Genera `sofi-metrics.js`. |
| `tests/portfolio-export/*.test.js` | Jest. |

**Repo del sitio** — solo consume:

| Archivo | Responsabilidad |
|---|---|
| `cases/sofi.html` | La página. HTML + `<style>` inline, como los demás casos. |
| `assets/js/sofi-case.js` | Render del FSM, del simulador y de la ficha. |
| `assets/data/sofi/sofi-fsm.js` | `window.SOFI_FSM` — generado. |
| `assets/data/sofi/sofi-conversation.js` | `window.SOFI_CONVERSATION` — generado. |
| `assets/data/sofi/sofi-metrics.js` | `window.SOFI_METRICS` — generado. |

Los data files son `.js` que asignan a `window`, no `.json`: se cargan con `<script src>` y la página abre igual con `file://` que en GitHub Pages, sin `fetch` y sin CORS. El criterio de la spec ("abre sin build y sin red externa") se cumple literalmente.

**Contratos de datos.** Fijos desde aquí. Las tasks posteriores dependen de estos nombres exactos.

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
    system: 'Corrida contra el sistema real: webhook con firma HMAC válida, ai.service.js sobre OpenRouter y fsm.service.js, en el banco de pruebas local.',
    lead: 'El lead es ficticio. Lo hice yo.',
    capturedAt: '2026-07',
    turnCount: 21,
    finalState: 'COMPLETED',
  },
  turns: [
    // tOffsetMs: offset real de la corrida respecto al primer mensaje.
    { i: 0, dir: 'in',  text: 'Hola', tOffsetMs: 0,
      trace: { stateBefore: 'GREETING', intent: 'GREETING', confidence: 0.98,
               stateAfter: 'GREETING', applied: false, reason: null, extracted: {} } },
    { i: 1, dir: 'out', text: '¡Hola! 😊 Soy Sofi...', tOffsetMs: 3800 },
  ],
};

window.SOFI_METRICS = {
  generatedAt: '2026-07-11',
  items: [{ label: 'Commits', value: '504', method: 'git rev-list --count HEAD en el repo de SOFI' }],
};
```

`trace` solo cuelga de los turnos `dir: 'in'`: el FSM corre sobre lo que entra.

---

## Task 1: Extractor del FSM

`fsm.service.js` no exporta las tablas. En vez de parsear con regex (frágil) o dibujarlas a mano (prohibido), se lee el archivo, se le **añade una línea de export** y se evalúa como módulo CommonJS con un `require` stub para su única dependencia (`../lib/logSafe`). Los valores salen del archivo real. Si el archivo cambia de forma, el extractor truena en vez de mentir.

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
 * Las tablas que necesitamos son const de módulo, invisibles desde fuera.
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

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/extract-fsm.js tests/portfolio-export/extract-fsm.test.js
git commit -m "feat(portfolio-export): extrae el FSM desde el codigo, no a mano"
```

---

## Task 2: Emisor de data files

**Files:**
- Create: `tools/portfolio-export/emit.js`
- Test: `tests/portfolio-export/emit.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/emit.test.js
'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');
const { emitDataFile } = require('../../tools/portfolio-export/emit');

describe('emitDataFile', () => {
  test('escribe un .js que asigna a window y se puede volver a leer', () => {
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

  test('crea el directorio destino si no existe', () => {
    const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'emit-')), 'a/b/c.js');
    expect(() => emitDataFile('SOFI_X', { ok: true }, out)).not.toThrow();
    expect(fs.existsSync(out)).toBe(true);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/emit.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar**

```js
// tools/portfolio-export/emit.js
'use strict';

const fs   = require('fs');
const path = require('path');

/** Escribe un objeto como archivo .js que asigna a window.<varName>. */
function emitDataFile(varName, data, outPath) {
  const banner =
    '// Generado por tools/portfolio-export en el repo de SOFI.\n' +
    '// No editar a mano: se regenera desde el sistema.\n';
  const body = `window.${varName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, banner + body, 'utf8');
  return outPath;
}

module.exports = { emitDataFile };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/emit.test.js`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/emit.js tests/portfolio-export/emit.test.js
git commit -m "feat(portfolio-export): emisor de data files"
```

---

## Task 3: Generar sofi-fsm.js

**Files:**
- Create: `tools/portfolio-export/build-fsm.js`

- [ ] **Step 1: Escribir el CLI**

```js
// tools/portfolio-export/build-fsm.js
'use strict';

/**
 * Genera assets/data/sofi/sofi-fsm.js en el repo del portafolio.
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
fsm.generatedAt = process.env.GENERATED_AT || new Date().toISOString().slice(0, 10);

const out = path.join(siteRepo, 'assets/data/sofi/sofi-fsm.js');
emitDataFile('SOFI_FSM', fsm, out);

console.log(`[build-fsm] ${fsm.states.length} estados, ${fsm.intents.length} intents, umbral ${fsm.confidenceThreshold}`);
console.log(`[build-fsm] escrito: ${out}`);
```

- [ ] **Step 2: Correrlo**

Run:
```bash
node tools/portfolio-export/build-fsm.js "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
```
Expected: `[build-fsm] 12 estados, 8 intents, umbral 0.75`

- [ ] **Step 3: Commit en los dos repos**

```bash
git add tools/portfolio-export/build-fsm.js
git commit -m "feat(portfolio-export): CLI que genera el data file del FSM"

cd "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
git add assets/data/sofi/sofi-fsm.js
git commit -m "feat(sofi): data file del FSM generado desde el codigo"
```

---

## Corrección del 2026-07-12: de dónde sale el trace

Este plan asumía que las líneas `[FSM]` daban un trace por cada turno entrante. **Es falso**, verificado contra el código. Ninguna de las dos fuentes de log cubre sola todos los turnos:

- `resolveNextState` (`fsm.service.js`) **no loguea nada** cuando el intent no mueve el estado (`desired === currentState`, línea 123) ni cuando la conversación ya está en un estado terminal (línea 105).
- La línea de `webhookController.js:587`, que sí trae `stateBefore → stateAfter (intent conf=N)` completo, **se salta** en los ocho return tempranos del controlador, que son justo los del camino feliz: `INTENTION → URGENCY`, `PROPERTY_TYPE → ESCRITURAS`, `CP → COLONIA` y el cierre `VALUE → COMPLETED`.
- La línea de transición inválida sale por `console.warn`, o sea stderr. El harness ya redirige `2>&1`, así que queda capturada.

Las dos fuentes **se complementan**: los turnos que mueven el estado siempre dejan línea `[FSM]`; los que no lo mueven y llegan a la 587 dejan línea `[SOFI]`.

**Lo que no cambia:** los return tempranos **no evitan al FSM**. Todos comparan contra `nextState`, que ya decidió `resolveNextState` río arriba, y el estado ya se persistió. Solo cambian el texto de la respuesta, no la decisión. El argumento técnico del caso queda intacto: el FSM decide cada transición.

**La solución:** el trace se arma **turno por turno**. `capture-run.js` manda un mensaje, espera la respuesta y lee solo el pedazo de log que ese turno escribió. Con la rebanada aislada, atribuir la decisión es trivial y la invariante `inboundCount === traces.length` de `buildConversation` se cumple por construcción.

`buildConversation` **no cambia**. Se añade `traceFromTurnLog(turnLog)` a `trace.js`: manda el `[FSM]` para la decisión de estado, y la línea `[SOFI]` solo rellena `intent` y `confidence` cuando el FSM no los logueó (que es lo que pasa en un turno de baja confianza). Si un turno no dejó ninguna decisión, truena: no se publica un trace inventado.

---

## Task 4: Parsear el log del FSM y armar la conversación

La parte pura y testeable. Formato real de las líneas que escribe `resolveNextState`:

```
[FSM] 521****5678: GREETING → INTENTION (PROVIDE_DATA conf=0.92)
[FSM] Baja confianza (0.41) para 521****5678. Permanece en CP
[FSM] 521****5678: PAUSE — permanece en VALUE
[FSM] Transición inválida CP → COMPLETED para 521****5678
```

**Files:**
- Create: `tools/portfolio-export/trace.js`
- Test: `tests/portfolio-export/trace.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/trace.test.js
'use strict';

const { parseFsmLines, buildConversation } = require('../../tools/portfolio-export/trace');

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
      stateBefore: 'VALUE', stateAfter: 'VALUE', intent: 'PAUSE',
      applied: false, reason: 'pause',
    });
  });

  test('lee una transición rechazada por el grafo', () => {
    const [t] = parseFsmLines('[FSM] Transición inválida CP → COMPLETED para 521****5678');
    expect(t).toMatchObject({
      stateBefore: 'CP', stateAfter: 'CP', applied: false,
      reason: 'invalid_transition', rejected: 'COMPLETED',
    });
  });

  test('ignora las líneas que no son del FSM', () => {
    expect(parseFsmLines('[SOFI] mensaje recibido\n[AI] Error OpenRouter')).toEqual([]);
  });
});

describe('buildConversation', () => {
  const turns = [
    { dir: 'in',  text: 'Hola',       at: '2026-07-11T20:00:00.000Z' },
    { dir: 'out', text: '¡Hola! 😊',  at: '2026-07-11T20:00:04.000Z' },
    { dir: 'in',  text: 'Diego',      at: '2026-07-11T20:01:00.000Z' },
    { dir: 'out', text: 'Gusto, Diego', at: '2026-07-11T20:01:03.000Z' },
  ];
  const traces = [
    { stateBefore: 'GREETING', stateAfter: 'GREETING',  intent: 'GREETING',     confidence: 0.98, applied: false, reason: null },
    { stateBefore: 'GREETING', stateAfter: 'INTENTION', intent: 'PROVIDE_DATA', confidence: 0.93, applied: true,  reason: null },
  ];

  test('convierte los timestamps en offsets relativos al primer mensaje', () => {
    const c = buildConversation(turns, traces, { capturedAt: '2026-07' });
    expect(c.turns.map((t) => t.tOffsetMs)).toEqual([0, 4000, 60000, 63000]);
  });

  test('pega un trace a cada turno entrante, y solo a los entrantes', () => {
    const c = buildConversation(turns, traces, { capturedAt: '2026-07' });
    expect(c.turns[0].trace.intent).toBe('GREETING');
    expect(c.turns[2].trace.stateAfter).toBe('INTENTION');
    expect(c.turns[1].trace).toBeUndefined();
    expect(c.turns[3].trace).toBeUndefined();
  });

  test('la procedencia dice que el sistema es real y el lead no', () => {
    const c = buildConversation(turns, traces, { capturedAt: '2026-07' });
    expect(c.provenance.system).toMatch(/sistema real/i);
    expect(c.provenance.lead).toMatch(/ficticio/i);
    expect(c.provenance.turnCount).toBe(4);
    expect(c.provenance.finalState).toBe('INTENTION');
  });

  test('calcula la latencia de respuesta como la mediana de in→out', () => {
    // Deltas: 4000 y 3000. Mediana de dos valores: promedio = 3500.
    expect(buildConversation(turns, traces, { capturedAt: '2026-07' }).replyLatencyMsMedian).toBe(3500);
  });

  test('truena si el número de traces no cuadra con los turnos entrantes', () => {
    expect(() => buildConversation(turns, [traces[0]], { capturedAt: '2026-07' }))
      .toThrow(/2 turnos entrantes.*1 trace/i);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/trace.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar**

```js
// tools/portfolio-export/trace.js
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

/** Mediana de los deltas in→out consecutivos: el tiempo que tarda el agente en contestar. */
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

/** Turnos de la corrida + traces del FSM = el objeto que consume la página. */
function buildConversation(rawTurns, traces, meta) {
  if (rawTurns.length === 0) throw new Error('trace: la corrida vino vacía');

  const inboundCount = rawTurns.filter((t) => t.dir === 'in').length;
  if (inboundCount !== traces.length) {
    throw new Error(
      `trace: hay ${inboundCount} turnos entrantes pero ${traces.length} traces. ` +
      'La corrida no quedó completa; no publiques esto.'
    );
  }

  const t0 = new Date(rawTurns[0].at).getTime();
  let k = 0;

  const turns = rawTurns.map((turn, i) => {
    const base = { i, dir: turn.dir, text: turn.text, tOffsetMs: new Date(turn.at).getTime() - t0 };
    return turn.dir === 'in' ? { ...base, trace: traces[k++] } : base;
  });

  const last = traces[traces.length - 1];

  return {
    provenance: {
      system: 'Corrida contra el sistema real: webhook con firma HMAC válida, ai.service.js sobre OpenRouter y fsm.service.js, en el banco de pruebas local.',
      lead: 'El lead es ficticio. Lo hice yo.',
      capturedAt: meta.capturedAt,
      turnCount: turns.length,
      finalState: last ? last.stateAfter : null,
    },
    turns,
    replyLatencyMsMedian: medianReplyLatency(turns),
  };
}

module.exports = { parseFsmLines, buildConversation, medianReplyLatency };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/trace.test.js`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/portfolio-export/trace.js tests/portfolio-export/trace.test.js
git commit -m "feat(portfolio-export): parser del log del FSM y armado de la conversacion"
```

---

## Task 5: Correr la conversación contra el sistema y generar el data file

El guion de la conversación es el mismo que Diego corrió en el video, escrito como una lista para que la corrida sea **reproducible**. Cada turno entra por el `/webhook` real con firma HMAC válida.

**Files:**
- Create: `tools/portfolio-export/capture-run.js`
- Create (repo del sitio): `assets/data/sofi/sofi-conversation.js`

- [ ] **Step 1: Escribir el CLI de captura**

```js
// tools/portfolio-export/capture-run.js
'use strict';

/**
 * Corre una conversación completa contra el SOFI local y genera el data file
 * del simulador. El sistema es el real: firma HMAC válida, webhook real,
 * modelo real, FSM real. El lead es ficticio.
 *
 * Requisitos: el banco de pruebas levantado (ver tools/demo-harness) y una
 * OPENROUTER_API_KEY viva en .env.local.
 *
 *   ENV_FILE=.env.local SITE_REPO=<ruta> node tools/portfolio-export/capture-run.js
 */
require('dotenv').config({ path: process.env.ENV_FILE || '.env.local' });

const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

const { parseFsmLines, buildConversation } = require('./trace');
const { emitDataFile } = require('./emit');

const SOFI_URL   = process.env.SOFI_URL   || `http://localhost:${process.env.PORT || 8080}`;
const MOCK_URL   = process.env.GRAPH_BASE || 'http://localhost:4001';
const APP_SECRET = process.env.APP_SECRET;
const LEAD_PHONE = process.env.DEMO_LEAD_PHONE || '5218112345678';
const LEAD_NAME  = process.env.DEMO_LEAD_NAME  || 'Demo Lead';
const SOFI_LOG   = path.join(__dirname, '../demo-harness/out/sofi.log');
const SITE_REPO  = process.env.SITE_REPO;

// El guion. Es el recorrido completo de la entrevista hasta COMPLETED.
const GUION = [
  'Hola',
  'Diego',
  'Bien y tú',
  'Sí',
  '1',
  '27250',
  '3',
  'Casa',
  'Sí tengo escrituras',
  '$12000000',
];

function buildPayload(text) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: process.env.WABA_ID || '000000000000000',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: { phone_number_id: process.env.BUSINESS_PHONE },
          contacts: [{ profile: { name: LEAD_NAME }, wa_id: LEAD_PHONE }],
          messages: [{
            from: LEAD_PHONE,
            id: `wamid.CAP${Date.now()}${crypto.randomBytes(3).toString('hex')}`,
            timestamp: String(Math.floor(Date.now() / 1000)),
            type: 'text',
            text: { body: text },
          }],
        },
      }],
    }],
  };
}

async function send(text) {
  const rawBody = Buffer.from(JSON.stringify(buildPayload(text)), 'utf8');
  const sig = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(rawBody).digest('hex');
  const res = await fetch(`${SOFI_URL}/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Hub-Signature-256': sig },
    body: rawBody,
  });
  if (!res.ok) throw new Error(`SOFI respondió ${res.status}: ${await res.text()}`);
}

/** Espera a que el mock reciba las respuestas del turno. Devuelve las nuevas y el cursor. */
async function collectReplies(cursor, timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  const nuevas = [];
  let quietUntil = null;

  while (Date.now() < deadline) {
    const { messages } = await (await fetch(`${MOCK_URL}/_outbound?since=${cursor}`)).json();
    for (const m of messages) {
      nuevas.push({ dir: 'out', text: m.text, at: m.at });
      cursor = m.seq + 1;
      quietUntil = Date.now() + 2_500;   // SOFI a veces manda varios seguidos
    }
    if (quietUntil && Date.now() > quietUntil) return { cursor, nuevas };
    await new Promise((r) => setTimeout(r, 300));
  }
  if (!quietUntil) throw new Error('capture-run: SOFI no contestó. Revisa OPENROUTER_API_KEY y los logs.');
  return { cursor, nuevas };
}

async function main() {
  if (!APP_SECRET) throw new Error('capture-run: falta APP_SECRET. ¿Existe .env.local?');
  if (!SITE_REPO)  throw new Error('capture-run: falta SITE_REPO.');

  const logStart = fs.existsSync(SOFI_LOG) ? fs.statSync(SOFI_LOG).size : 0;
  let cursor = (await (await fetch(`${MOCK_URL}/_health`)).json()).sent;
  const turns = [];

  for (const text of GUION) {
    turns.push({ dir: 'in', text, at: new Date().toISOString() });
    await send(text);
    const { cursor: next, nuevas } = await collectReplies(cursor);
    cursor = next;
    turns.push(...nuevas);
    console.log(`  LEAD  ${text}`);
    for (const r of nuevas) console.log(`  SOFI  ${r.text}`);
  }

  // Solo lo que este run escribió al log.
  const logText = fs.readFileSync(SOFI_LOG, 'utf8').slice(logStart);
  const traces  = parseFsmLines(logText);

  const conv = buildConversation(turns, traces, {
    capturedAt: new Date().toISOString().slice(0, 7),
  });

  emitDataFile('SOFI_CONVERSATION', conv, path.join(SITE_REPO, 'assets/data/sofi/sofi-conversation.js'));

  console.log(`\n[capture] ${conv.turns.length} turnos, estado final ${conv.provenance.finalState}`);
  console.log(`[capture] latencia mediana de respuesta: ${conv.replyLatencyMsMedian} ms`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
```

- [ ] **Step 2: Levantar el banco de pruebas**

```bash
docker compose -f tools/demo-harness/docker-compose.yml up -d
mkdir -p tools/demo-harness/out
node tools/demo-harness/mock-graph.js > tools/demo-harness/out/mock.log 2>&1 &
ENV_FILE=.env.local node server.js > tools/demo-harness/out/sofi.log 2>&1 &
ENV_FILE=.env.local node tools/demo-harness/smoke.js "Hola"
```

Expected: el smoke reporta que el webhook aceptó y que el mock recibió una respuesta **real** de SOFI. Si sale `Lo siento, tuve un problema técnico`, OpenRouter no está respondiendo: revisa `OPENROUTER_API_KEY` en `.env.local` y **no sigas**, porque sin modelo vivo no hay intents ni confidences.

- [ ] **Step 3: Limpiar la sesión y capturar**

La sesión del lead de pruebas puede haber quedado en `COMPLETED` de una corrida anterior; si no se limpia, el FSM no se mueve y el trace sale vacío.

```bash
docker exec sofi-demo-redis redis-cli FLUSHALL
ENV_FILE=.env.local SITE_REPO="$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage" \
  node tools/portfolio-export/capture-run.js
```

Expected: el hilo completo en pantalla y `[capture] N turnos, estado final COMPLETED`.

Si truena con "hay N turnos entrantes pero M traces", la corrida se desincronizó: `FLUSHALL` otra vez y repite. **No publiques un trace incompleto.**

- [ ] **Step 4: Bajar el banco**

```bash
docker compose -f tools/demo-harness/docker-compose.yml down -v
```

- [ ] **Step 5: Commit en los dos repos**

```bash
git add tools/portfolio-export/capture-run.js
git commit -m "feat(portfolio-export): corre la conversacion contra el sistema real y captura el trace"

cd "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
git add assets/data/sofi/sofi-conversation.js
git commit -m "feat(sofi): conversacion capturada contra el sistema real"
```

---

## Task 6: Ficha técnica

Cada número con su método al lado. Se recalculan aquí.

**Files:**
- Create: `tools/portfolio-export/build-metrics.js`
- Test: `tests/portfolio-export/build-metrics.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
// tests/portfolio-export/build-metrics.test.js
'use strict';

const { buildMetrics } = require('../../tools/portfolio-export/build-metrics');

describe('buildMetrics', () => {
  const input = {
    commits: 504,
    tests: 392,
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

  test('la latencia se presenta en segundos y su método aclara que es del banco de pruebas', () => {
    const latencia = buildMetrics(input).items.find((i) => /respuesta/i.test(i.label));
    expect(latencia.value).toBe('4.2 s');
    expect(latencia.method).toMatch(/banco de pruebas/i);
    expect(latencia.method).toMatch(/mediana/i);
  });

  test('no inventa las métricas de negocio que no se pueden probar', () => {
    const labels = buildMetrics(input).items.map((i) => i.label.toLowerCase()).join(' ');
    expect(labels).not.toMatch(/rodi|speed-to-lead|500%/);
  });

  test('truena si falta un dato en vez de rellenarlo con cero', () => {
    expect(() => buildMetrics({ ...input, commits: undefined })).toThrow(/commits/i);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx jest tests/portfolio-export/build-metrics.test.js`
Expected: FAIL — módulo no encontrado.

- [ ] **Step 3: Implementar**

```js
// tools/portfolio-export/build-metrics.js
'use strict';

const REQUIRED = [
  'commits', 'tests', 'states', 'intents',
  'firstCommit', 'lastCommit', 'replyLatencyMsMedian', 'generatedAt',
];

function buildMetrics(input) {
  for (const key of REQUIRED) {
    if (input[key] === undefined || input[key] === null) {
      throw new Error(`build-metrics: falta "${key}". No se rellena con cero: se recalcula o no se publica.`);
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
        label: 'Tiempo de respuesta del agente',
        value: `${(input.replyLatencyMsMedian / 1000).toFixed(1)} s`,
        method: 'Mediana del tiempo entre cada mensaje del lead y la respuesta de SOFI, medida en la corrida del banco de pruebas que reproduce el simulador. No es el speed-to-lead de producción.',
      },
    ],
  };
}

/** CLI: SITE_REPO=<ruta> node tools/portfolio-export/build-metrics.js */
async function main() {
  const { execSync } = require('child_process');
  const path = require('path');
  const { extractFsm }   = require('./extract-fsm');
  const { emitDataFile } = require('./emit');

  const site = process.env.SITE_REPO;
  if (!site) throw new Error('build-metrics: falta SITE_REPO.');

  // La latencia sale del data file de la conversación, que la Task 5 ya generó.
  const convPath = path.join(site, 'assets/data/sofi/sofi-conversation.js');
  const windowStub = {};
  // eslint-disable-next-line no-new-func
  new Function('window', require('fs').readFileSync(convPath, 'utf8'))(windowStub);
  const latency = windowStub.SOFI_CONVERSATION.replyLatencyMsMedian;

  const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();
  const fsm = extractFsm(
    path.join(__dirname, '../../src/services/fsm.service.js'),
    path.join(__dirname, '../../src/services/ai.service.js'),
  );

  const jestSummary = execSync('npx jest --silent 2>&1 || true', { encoding: 'utf8' });
  const testsMatch = jestSummary.match(/Tests:\s+(\d+) passed/);
  if (!testsMatch) throw new Error('build-metrics: no pude leer el total de tests de Jest.');

  const metrics = buildMetrics({
    commits: Number(sh('git rev-list --count HEAD')),
    tests: Number(testsMatch[1]),
    states: fsm.states.length,
    intents: fsm.intents.length,
    firstCommit: sh('git log --reverse --format=%as | head -1'),
    lastCommit: sh('git log -1 --format=%as'),
    replyLatencyMsMedian: latency,
    generatedAt: new Date().toISOString().slice(0, 10),
  });

  emitDataFile('SOFI_METRICS', metrics, path.join(site, 'assets/data/sofi/sofi-metrics.js'));
  for (const item of metrics.items) console.log(`  ${item.label}: ${item.value}`);
}

if (require.main === module) main().catch((e) => { console.error(e.message); process.exit(1); });

module.exports = { buildMetrics };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx jest tests/portfolio-export/build-metrics.test.js`
Expected: PASS, 4 tests.

- [ ] **Step 5: Generar el data file y correr la suite completa**

```bash
SITE_REPO="$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage" \
  node tools/portfolio-export/build-metrics.js
npx jest
```
Expected: las 5 métricas en pantalla, y la suite completa verde (los 392 de base más los nuevos).

- [ ] **Step 6: Commit en los dos repos**

```bash
git add tools/portfolio-export/build-metrics.js tests/portfolio-export/build-metrics.test.js
git commit -m "feat(portfolio-export): ficha tecnica con el metodo de cada metrica"

cd "$HOME/Documents/Claude/Projects/Claude_Code/newlandingpage"
git add assets/data/sofi/sofi-metrics.js
git commit -m "feat(sofi): ficha tecnica generada desde el sistema"
```

---

## Task 7: Esqueleto de la página

De aquí en adelante, todo es el repo del sitio.

**Files:**
- Create: `cases/sofi.html`

- [ ] **Step 1: Escribir el esqueleto**

Copia el `<head>`, la `<nav>` y el `<footer>` de `cases/heineken.html` (mismo DS, mismas clases: `.nav`, `.nav__inner`, `.nav__brand`, `.nav__links`, `.container`, `.section-label`, `.section-title`, `.btn`). Cambia:

```html
  <title>SOFI — Diego Maury</title>
  <meta name="description" content="Un agente de WhatsApp que califica leads: máquina de estados, contrato cerrado con el modelo, y una conversación completa contra el sistema real.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://diegomaury.mx/cases/sofi.html">
```

El `noindex` se queda hasta que Diego apruebe la página. La spec es explícita: no se enlaza, no entra al sitemap.

Antes de `</body>`:

```html
  <script src="../assets/data/sofi/sofi-fsm.js"></script>
  <script src="../assets/data/sofi/sofi-conversation.js"></script>
  <script src="../assets/data/sofi/sofi-metrics.js"></script>
  <script src="../assets/js/main.js"></script>
  <script src="../assets/js/sofi-case.js"></script>
```

Y el cuerpo, con las secciones como contenedores que las tasks siguientes llenan:

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

```html
<div class="container" style="position:relative;">
  <a href="../portfolio/" class="case-hero__back">← Portafolio</a>
  <p class="case-hero__tag">FlipHouse · Oct 2025 - Jun 2026</p>
  <h1 class="case-hero__title">SOFI</h1>
  <p class="case-hero__sub">
    Un agente de WhatsApp que califica leads inmobiliarios sin intervención humana.
    Lo construí yo. Aquí abajo lo puedes ver decidir, mensaje por mensaje.
  </p>

  <!-- Hueco del video de /brag. Si el archivo no existe, el JS lo deja oculto. -->
  <figure class="sofi-video" id="sofi-video" hidden>
    <video src="../assets/video/sofi-brag.mp4" controls playsinline preload="none"></video>
    <figcaption>
      Pieza de presentación, generada a partir del código. No es una grabación del
      sistema corriendo, y por eso no cuenta como evidencia.
    </figcaption>
  </figure>
</div>
```

- [ ] **Step 3: Verificar en el navegador**

Run: `python -m http.server 8080` y abre `localhost:8080/cases/sofi.html`
Expected: nav y footer idénticos a los de heineken, hero con fondo Catalyst, sin errores en consola.

- [ ] **Step 4: Commit**

```bash
git add cases/sofi.html
git commit -m "feat(sofi): esqueleto de la pagina de caso"
```

---

## Task 8: El caso en corto, y el cambio de registro

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

- [ ] **Step 3: Commit**

```bash
git add cases/sofi.html
git commit -m "feat(sofi): el caso en corto y el cambio de registro"
```

---

## Task 9: El simulador

El artefacto central. Dos columnas: el hilo de WhatsApp a la izquierda, el estado del FSM sincronizado a la derecha. Controles de reproducir, pausar y paso a paso. Y la declaración de qué es esto, arriba, sin letra chica.

**Files:**
- Create: `assets/js/sofi-case.js`
- Modify: `cases/sofi.html` (`#simulador`)

- [ ] **Step 1: Markup**

```html
<div class="container">
  <p class="section-label">Evidencia</p>
  <h2 class="section-title">Una conversación completa, paso a paso</h2>

  <!-- La declaración va ARRIBA y en el mismo tamaño que el resto. Si la evidencia
       necesita letra chica, no es evidencia. -->
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

- [ ] **Step 2: Escribir el JS**

La declaración se arma desde `provenance`, no se escribe a mano en el HTML: así no puede desincronizarse del dato.

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

  // Lo que esto es, y lo que no. Sin adornos.
  declara.textContent =
    'Esto no es una animación. Es una conversación real contra el sistema real: el ' +
    'webhook verifica la firma, el modelo clasifica y la máquina de estados decide. ' +
    'El lead soy yo. Lo que demuestra es que el sistema funciona, no que atendió a un ' +
    'cliente. Eso último te lo tengo que pedir de palabra.';

  let cursor = 0;
  let timer  = null;

  function bubble(turn) {
    const el = document.createElement('div');
    el.className = `sofi-msg sofi-msg--${turn.dir}`;
    const p = document.createElement('p');
    p.textContent = turn.text;      // textContent, nunca innerHTML
    const t = document.createElement('span');
    t.className = 'sofi-msg__time';
    t.textContent = `+${(turn.tOffsetMs / 1000).toFixed(1)} s`;
    el.append(p, t);
    return el;
  }

  function renderPanel(turn) {
    if (!turn.trace) return;        // los turnos salientes no mueven el FSM
    const tr = turn.trace;

    const rows = [
      ['Estado', tr.stateBefore],
      ['Intent del modelo', tr.intent || '—'],
      ['Confianza', tr.confidence === null ? '—' : tr.confidence.toFixed(2)],
      ['Umbral', fsm.confidenceThreshold.toFixed(2)],
      ['Decisión del FSM', tr.applied ? `${tr.stateBefore} → ${tr.stateAfter}` : 'No avanza'],
    ];

    const motivos = {
      low_confidence: `El modelo dudó (${tr.confidence} < ${fsm.confidenceThreshold}). El lead se queda donde está.`,
      invalid_transition: `El grafo rechazó ${tr.stateBefore} → ${tr.rejected}. Transición imposible.`,
      pause: 'El lead pidió pausa. El FSM no se mueve y la entrevista retoma donde quedó.',
    };

    panel.innerHTML = '';
    for (const [label, value] of rows) {
      const row = document.createElement('div');
      row.className = 'sofi-panel__row';
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      row.append(dt, dd);
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
    // Ritmo fijo y legible. La latencia real se lee en el sello de cada burbuja,
    // no se reproduce en tiempo real.
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

- [ ] **Step 3: Estilos**

```css
.sofi-declara {
  max-width: 62ch;
  color: var(--dm-bone);
  border-left: 3px solid var(--dm-ember);
  padding-left: 1rem;
  margin-bottom: 2.5rem;
}
.sofi-sim { display: grid; grid-template-columns: 1fr 22rem; gap: 1.5rem; align-items: start; }
.sofi-sim__thread {
  height: 26rem; overflow-y: auto; padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}
.sofi-msg { max-width: 80%; margin-bottom: 0.75rem; padding: 0.6rem 0.85rem; border-radius: 12px; }
.sofi-msg--in  { background: rgba(255, 255, 255, 0.06); }
.sofi-msg--out { background: var(--dm-amethyst); margin-left: auto; }
.sofi-msg__time { display: block; margin-top: 0.35rem; font-family: var(--font-mono); font-size: 0.65rem; color: var(--dm-white-40); }
.sofi-sim__panel {
  position: sticky; top: 6rem; padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;
  border-left: 3px solid var(--dm-spark);
  font-family: var(--font-mono); font-size: 0.8rem;
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

Dale Reproducir. Tres cosas: el hilo avanza, el panel cambia con cada mensaje entrante, y el paso a paso funciona. Si algún turno entrante deja el panel vacío, el trace se desincronizó: vuelve a la Task 5.

- [ ] **Step 5: Commit**

```bash
git add cases/sofi.html assets/js/sofi-case.js
git commit -m "feat(sofi): simulador de la conversacion con el FSM sincronizado"
```

---

## Task 10: Arquitectura y FSM

El diagrama de arquitectura es SVG inline escrito a mano, pero **cada caja nombra su archivo o servicio real**. El del FSM se dibuja desde `window.SOFI_FSM`: si el código cambia y se regenera el data file, el diagrama cambia solo.

**Files:**
- Modify: `cases/sofi.html` (`#arquitectura`, `#fsm`)
- Modify: `assets/js/sofi-case.js`

- [ ] **Step 1: Sección de arquitectura**

```html
<div class="container">
  <p class="section-label">Arquitectura</p>
  <h2 class="section-title">El recorrido de un lead</h2>
  <p class="sofi-prose">Cada caja es un archivo o un servicio que existe. Ninguna es decorativa.</p>

  <svg class="sofi-arch" viewBox="0 0 920 400" role="img"
       aria-label="Diagrama de arquitectura de SOFI. Un mensaje entra por la WhatsApp Cloud API al webhookController, que verifica la firma HMAC. Pasa a ai.service.js, que llama a OpenRouter y valida la respuesta del modelo con Zod. fsm.service.js decide el estado. hubspot.service.js escribe la propiedad en el CRM y Make dispara el escenario S1. Todo corre en Railway sobre PostgreSQL y Redis.">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/>
      </marker>
    </defs>

    <g class="sofi-arch__flow">
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

      <rect x="490" y="160" width="190" height="64" rx="10" class="sofi-arch__box--key"/>
      <text x="585" y="186" class="sofi-arch__name">fsm.service.js</text>
      <text x="585" y="206" class="sofi-arch__note">decide el estado</text>

      <line x1="585" y1="94" x2="585" y2="158" marker-end="url(#arrow)"/>
      <text x="600" y="130" class="sofi-arch__edge">intent + confidence</text>

      <rect x="240" y="290" width="200" height="64" rx="10"/>
      <text x="340" y="316" class="sofi-arch__name">hubspot.service.js</text>
      <text x="340" y="336" class="sofi-arch__note">escribe la propiedad</text>

      <rect x="490" y="290" width="190" height="64" rx="10"/>
      <text x="585" y="316" class="sofi-arch__name">Make · escenario S1</text>
      <text x="585" y="336" class="sofi-arch__note">enrutamiento</text>

      <line x1="585" y1="224" x2="585" y2="288" marker-end="url(#arrow)"/>
      <line x1="488" y1="322" x2="442" y2="322" marker-end="url(#arrow)"/>

      <path d="M 490 192 L 100 192 L 100 96" fill="none" marker-end="url(#arrow)"/>
      <text x="150" y="182" class="sofi-arch__edge">respuesta al lead</text>

      <rect x="730" y="30" width="180" height="194" rx="10" class="sofi-arch__box--infra"/>
      <text x="820" y="60"  class="sofi-arch__name">Railway</text>
      <text x="820" y="90"  class="sofi-arch__note">Node 24 · Express</text>
      <text x="820" y="130" class="sofi-arch__note">PostgreSQL</text>
      <text x="820" y="155" class="sofi-arch__note">Redis (sesión del FSM)</text>
      <text x="820" y="195" class="sofi-arch__note">Jest</text>
    </g>
  </svg>
</div>
```

```css
.sofi-arch { width: 100%; height: auto; color: var(--dm-white-40); }
.sofi-arch rect { fill: rgba(255, 255, 255, 0.03); stroke: rgba(255, 255, 255, 0.12); }
.sofi-arch__box--key   { stroke: var(--dm-spark); fill: rgba(240, 180, 41, 0.06); }
.sofi-arch__box--infra { stroke-dasharray: 4 4; }
.sofi-arch line, .sofi-arch path { stroke: currentColor; stroke-width: 1.5; }
.sofi-arch__name { fill: var(--dm-bone); font-family: var(--font-mono); font-size: 13px; text-anchor: middle; }
.sofi-arch__note { fill: var(--dm-white-40); font-family: var(--font-mono); font-size: 10px; text-anchor: middle; }
.sofi-arch__edge { fill: var(--dm-white-40); font-family: var(--font-mono); font-size: 10px; }
```

- [ ] **Step 2: Sección del FSM, con el argumento**

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
      <p>El destino sale de <code>TRANSITION_TABLE[estado][intent]</code>. Si la combinación no existe, el lead se queda donde está.</p>
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

      const ul = document.createElement('ul');
      for (const [intent, destino] of Object.entries(fsm.transitionTable[state] || {})) {
        const li = document.createElement('li');
        li.textContent = `${intent} → ${destino}`;
        ul.appendChild(li);
      }

      card.append(h, p, ul);
      grid.appendChild(card);
    }
  }
```

- [ ] **Step 4: Verificar que el diagrama sale del código**

En consola: `window.SOFI_FSM.states.length` → `12`. En la página: 12 tarjetas, y `COMPLETED`, `HUMAN_TRANSFER` y `DISQUALIFIED` marcadas como terminales.

- [ ] **Step 5: Commit**

```bash
git add cases/sofi.html assets/js/sofi-case.js
git commit -m "feat(sofi): arquitectura y FSM generado desde el codigo"
```

---

## Task 11: Ficha técnica y "Lo que no puedo probar"

La última sección es la que hace creíbles a las anteriores.

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

Estático, a mano, con la ✖ visible. Las tres afirmaciones son las del bloque de evidencia de la ficha de Notion, **con su razón exacta**.

Ojo con el RODI: **no está bajo NDA.** Es un modelo propio, cost-avoidance modelado, no ahorro realizado, sin auditoría externa. Presentarlo como "bloqueado por NDA" lo haría sonar más sólido de lo que es, que es justo lo contrario del propósito de esta sección.

```html
<div class="container">
  <p class="section-label">Límites</p>
  <h2 class="section-title">Lo que no puedo probar</h2>
  <p class="sofi-prose">
    Estas tres cifras las sostengo, y aun así nada de lo de arriba las demuestra. Dos
    viven en el CRM de FlipHouse, y el CRM no es mío. La tercera es un modelo que hice
    yo. Prefiero enseñarte el hueco a que lo encuentres tú.
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
    Y una más, que es la que suele darse por sentada: el simulador demuestra que el
    sistema funciona, no que atendió a un cliente real. Las conversaciones de
    producción son de FlipHouse. Lo que puedes verificar tú mismo aquí es la máquina.
  </p>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add cases/sofi.html assets/js/sofi-case.js
git commit -m "feat(sofi): ficha tecnica y la seccion de lo que no puedo probar"
```

---

## Task 12: Responsive, accesibilidad y cierre

**Files:**
- Modify: `cases/sofi.html`

- [ ] **Step 1: Probar los breakpoints**

375, 768 y 1280 px. Criterios: el simulador pasa a una columna por debajo de 860 px, no hay scroll horizontal en ningún ancho, y las tarjetas del FSM se apilan sin desbordarse.

- [ ] **Step 2: Verificar reduced-motion y teclado**

Con `prefers-reduced-motion: reduce`, el simulador no debe animar ni autoscrollear de forma brusca. Los tres botones deben ser alcanzables con Tab y accionables con Enter.

- [ ] **Step 3: Verificar que el sitio LIVE quedó intacto**

```bash
git diff --stat master -- index.html assets/css/styles.css assets/js/main.js sitemap.xml
```
Expected: **sin salida**. Si algo aparece, revierte: la spec dice que el sitio LIVE no se toca.

- [ ] **Step 4: Verificación final contra el criterio de éxito**

```bash
grep -c "noindex" cases/sofi.html                       # 1
grep -rn "sofi.html" sitemap.xml index.html || echo "no enlazada, correcto"
```

- [ ] **Step 5: Commit final**

```bash
git add cases/sofi.html
git commit -m "feat(sofi): responsive y accesibilidad"
```

---

## Lo que este plan deja abierto, a propósito

- **La página no se publica.** Queda con `noindex`, sin enlazar y fuera del sitemap. Quitarlo es decisión de Diego.
- **La ficha de Notion no se toca.** Sigue en `Draft` / `Publicable = No`.
- **El video de `/brag`.** No bloquea nada. Si `assets/video/sofi-brag.mp4` no existe, el hueco no se renderiza.
- **El dashboard (`app.html`) no entra.** Es un artefacto publicable que la spec no contempla y que tiene el bug de mensajes duplicados. Queda como candidato para una segunda vuelta.
- **Las tres métricas de negocio siguen en ✖.** Ningún artefacto de este plan las cierra, y ese era el punto.
