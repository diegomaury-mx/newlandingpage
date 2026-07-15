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
