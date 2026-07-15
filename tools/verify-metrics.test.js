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
