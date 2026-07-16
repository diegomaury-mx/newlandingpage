const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { loadMetrics } = require('./verify-metrics.js');

const FIX = (f) => path.join(__dirname, 'fixtures', f);

test('loadMetrics carga un espejo valido', () => {
  const data = loadMetrics(FIX('metrics-ok.json'));
  assert.strictEqual(data.metrics.length, 4);
  assert.strictEqual(data.metrics[0].slug, 'demo-vigente');
});

test('loadMetrics lanza NO_METRICS si el archivo no existe', () => {
  assert.throws(() => loadMetrics(FIX('no-existe.json')), (e) => e.code === 'NO_METRICS');
});

test('loadMetrics lanza BAD_METRICS si el JSON esta malformado', () => {
  assert.throws(() => loadMetrics(FIX('metrics-malformado.json')), (e) => e.code === 'BAD_METRICS');
});

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

test('verifyHtml emite recordatorio de nota de uso para metricas Condicionadas', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<span data-metric="demo-condicionada">1,500</span> unidades estimado, 2026';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.deepStrictEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => /Condicionada/.test(w) && /Solo con etiqueta/.test(w)));
});

test('verifyHtml no acusa huerfanas dentro de style o script', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<style>.x { color: rgba(255,255,255,.5); }</style><script>var y = "1,234";</script><p>crecimos 87% este periodo</p>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.ok(r.warnings.some((w) => /87%/.test(w)));
  assert.strictEqual(r.warnings.length, 1, 'solo el 87% del body debe generar warning');
});

test('verifyHtml acusa error si data-metric apunta a una metrica Retirada', () => {
  const { metrics } = loadMetrics(FIX('metrics-ok.json'));
  const html = '<span data-metric="demo-retirada">99 unicornios</span>';
  const r = verifyHtml(html, 'index.html', metrics);
  assert.ok(r.errors.some((e) => /estado "Retirada"/.test(e)));
  assert.ok(r.errors.some((e) => /publicabilidad/.test(e)));
  assert.ok(r.errors.some((e) => /superficie/i.test(e)));
});

const { run } = require('./verify-metrics.js');

test('run devuelve 2 si index.html no existe en la raiz', () => {
  // tools/fixtures como raiz: tiene el espejo pero no index.html
  const code = run(['--metrics', FIX('metrics-ok.json')], path.join(__dirname, 'fixtures'));
  assert.strictEqual(code, 2);
});

test('CLI: exit 2 si --metrics viene sin ruta', () => {
  try {
    execFileSync('node', ['tools/verify-metrics.js', '--metrics'], { encoding: 'utf8' });
    assert.fail('debio salir con codigo distinto de 0');
  } catch (err) {
    assert.strictEqual(err.status, 2);
  }
});
