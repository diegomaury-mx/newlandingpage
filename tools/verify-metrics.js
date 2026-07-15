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
