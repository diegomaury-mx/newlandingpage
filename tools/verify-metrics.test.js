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
