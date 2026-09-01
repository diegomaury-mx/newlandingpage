#!/usr/bin/env node
// Regenera el mirror documental `diegomaury-mx/notion-cms` desde ESTE repo.
//
// `notion-cms/reference-code/*` son copias VERBATIM de archivos que viven de
// verdad aqui. Este script es el unico procedimiento valido para actualizarlos:
// nunca editar esos archivos a mano en notion-cms.
//
// Uso:
//   node tools/sync-notion-cms.mjs [--repo ../notion-cms] [--ref HEAD] [--check]
//
//   --repo   Ruta al clon local de notion-cms (default: ../notion-cms)
//   --ref    Commit-ish fuente; se lee con `git show <ref>:<path>` (default: HEAD)
//   --check  No escribe nada. Sale 1 solo si el CONTENIDO de reference-code/*
//            divergio de la fuente. El bump de SHA/fecha en prosa y el MANIFEST
//            son cosmeticos: los reporta pero sale 0.
//
// El Worker `notion-deploy-relay.worker.js` NO se toca: no vive en git, es un
// snapshot de Cloudflare (`workers_get_worker_code`). Se refresca aparte.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// destino en notion-cms/reference-code/  ->  fuente (ruta relativa en este repo)
const FILE_MAP = {
  'notionClient.ts': 'src/services/notionClient.ts',
  'notionLoaders.ts': 'src/services/notionLoaders.ts',
  'content.config.ts': 'src/content.config.ts',
  'notionImageCache.ts': 'src/services/notionImageCache.ts',
  'deeplTranslationCache.ts': 'src/services/deeplTranslationCache.ts',
  'env.ts': 'src/utils/env.ts',
  'verify-metrics.cjs': 'tools/verify-metrics.cjs',
}

const WORKER_FILE = 'notion-deploy-relay.worker.js'

// Valores de arranque para la primera corrida (no hay MANIFEST previo todavia).
const BOOTSTRAP_SHA = 'fc8345e'
const BOOTSTRAP_DATE = '2026-08-23'

function parseArgs(argv) {
  const args = { repo: '../notion-cms', ref: 'HEAD', check: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--check') args.check = true
    else if (a === '--repo') args.repo = argv[++i]
    else if (a === '--ref') args.ref = argv[++i]
    else {
      console.error(`Argumento no reconocido: ${a}`)
      process.exit(2)
    }
  }
  return args
}

function git(cwd, ...gitArgs) {
  return execFileSync('git', gitArgs, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
}

function sha256(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const mirrorRoot = resolve(REPO_ROOT, args.repo)
  const refDir = join(mirrorRoot, 'reference-code')

  if (!existsSync(refDir)) {
    console.error(`No existe ${refDir}. Pasa --repo con la ruta al clon de notion-cms.`)
    process.exit(2)
  }

  // Resolver commit fuente y su fecha (formato YYYY-MM-DD).
  const sourceCommitFull = git(REPO_ROOT, 'rev-parse', args.ref).trim()
  const sourceCommit = sourceCommitFull.slice(0, 7)
  const sourceCommitDate = git(REPO_ROOT, 'show', '-s', '--format=%cs', sourceCommitFull).trim()
  const generatedAt = new Date().toISOString().slice(0, 10)

  // SHA/fecha previos: del MANIFEST si existe, si no los de arranque.
  const manifestPath = join(refDir, 'MANIFEST.json')
  let prevSha = BOOTSTRAP_SHA
  let prevDate = BOOTSTRAP_DATE
  if (existsSync(manifestPath)) {
    try {
      const prev = JSON.parse(readFileSync(manifestPath, 'utf8'))
      if (prev.sourceCommit) prevSha = prev.sourceCommit
      if (prev.sourceCommitDate) prevDate = prev.sourceCommitDate
    } catch {
      /* manifest ilegible: usar valores de arranque */
    }
  }

  const planned = [] // { path, before, after }
  const manifestFiles = []

  // 1. Archivos de reference-code (verbatim desde git).
  for (const [dst, src] of Object.entries(FILE_MAP)) {
    let content
    try {
      content = git(REPO_ROOT, 'show', `${sourceCommitFull}:${src}`)
    } catch {
      console.error(`No pude leer ${src}@${sourceCommit}. Abortando.`)
      process.exit(2)
    }
    const dstPath = join(refDir, dst)
    const before = existsSync(dstPath) ? readFileSync(dstPath, 'utf8') : null
    if (before !== content) planned.push({ path: dstPath, before, after: content, kind: 'code' })
    manifestFiles.push({ dst: `reference-code/${dst}`, src, sha256: sha256(content) })
  }

  // 2. Refs al commit ancla en los .md del mirror (prevSha -> sourceCommit, prevDate -> sourceCommitDate).
  if (prevSha !== sourceCommit || prevDate !== sourceCommitDate) {
    const mdFiles = git(mirrorRoot, 'ls-files', '*.md')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    for (const rel of mdFiles) {
      const p = join(mirrorRoot, rel)
      const before = readFileSync(p, 'utf8')
      let after = before
      if (prevSha !== sourceCommit) after = after.split(prevSha).join(sourceCommit)
      if (prevDate !== sourceCommitDate) after = after.split(prevDate).join(sourceCommitDate)
      if (after !== before) planned.push({ path: p, before, after, kind: 'cosmetic' })
    }
  }

  // 3. MANIFEST.json
  const workerPath = join(refDir, WORKER_FILE)
  const manifest = {
    _comment:
      'GENERADO por newlandingpage/tools/sync-notion-cms.mjs. No editar reference-code/* a mano.',
    sourceRepo: 'diegomaury-mx/newlandingpage',
    sourceCommit,
    sourceCommitFull,
    sourceCommitDate,
    generatedAt,
    files: manifestFiles,
    worker: {
      file: `reference-code/${WORKER_FILE}`,
      note: 'Snapshot de Cloudflare (workers_get_worker_code). No vive en git; se refresca a mano, fuera de este script.',
      sha256: existsSync(workerPath) ? sha256(readFileSync(workerPath, 'utf8')) : null,
    },
    automation: {
      githubAction: 'pendiente / opcional — no implementado en esta iteracion',
    },
  }
  const manifestStr = JSON.stringify(manifest, null, 2) + '\n'
  const manifestBefore = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : null
  // Comparar ignorando generatedAt para que --check no marque drift solo por la fecha de hoy.
  const stripDate = (s) => (s ? s.replace(/"generatedAt": "[^"]*"/, '"generatedAt": "-"') : s)
  if (stripDate(manifestBefore) !== stripDate(manifestStr)) {
    planned.push({ path: manifestPath, before: manifestBefore, after: manifestStr, kind: 'cosmetic' })
  }

  // --- Salida ---
  const codeDrift = planned.filter((p) => p.kind === 'code')

  if (planned.length === 0) {
    console.log(`notion-cms en sync con newlandingpage@${sourceCommit}. Nada que hacer.`)
    return
  }

  if (args.check) {
    // --check falla SOLO si divergió el contenido de reference-code/*; el bump de
    // SHA/fecha en prosa y el MANIFEST son cosméticos y no cuentan como drift.
    if (codeDrift.length === 0) {
      console.log(
        `Sin drift de código. ${planned.length} archivo(s) con metadata desactualizada ` +
          `(SHA/fecha) — corre el sync para refrescarla, no es urgente.`,
      )
      return
    }
    console.error(`DRIFT: ${codeDrift.length} archivo(s) de reference-code/ divergieron de la fuente:`)
    for (const p of codeDrift) console.error(`  modif ${p.path}`)
    console.error(`\nCorre: node tools/sync-notion-cms.mjs --repo ${args.repo}`)
    process.exit(1)
  }

  for (const p of planned) {
    writeFileSync(p.path, p.after)
    console.log(`${p.before === null ? 'creado ' : 'escrito'} ${p.path}`)
  }

  console.log(`\nSnapshot: newlandingpage@${sourceCommit} (${sourceCommitDate})`)
  console.log('Recordatorio: notion-deploy-relay.worker.js NO se regenera aqui; refrescalo')
  console.log('a mano con el snapshot de Cloudflare si el Worker cambio.\n')
  try {
    const status = git(mirrorRoot, 'status', '--porcelain')
    console.log(status ? `Cambios en ${args.repo}:\n${status}` : `Sin cambios netos en ${args.repo}.`)
  } catch {
    /* mirror puede no ser repo git en algun entorno raro */
  }
}

main()
