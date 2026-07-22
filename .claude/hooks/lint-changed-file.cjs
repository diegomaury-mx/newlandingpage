#!/usr/bin/env node
'use strict';

const path = require('path');
const { execSync } = require('child_process');

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});

process.stdin.on('end', () => {
  let input = {};
  try {
    input = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    input = {};
  }

  const filePath = input?.tool_input?.file_path || input?.tool_input?.file || '';
  const ext = path.extname(filePath).toLowerCase();

  const cmd =
    ext === '.css'
      ? `npx stylelint "${filePath}"`
      : ext === '.html'
        ? `npx htmlhint "${filePath}"`
        : null;

  if (!cmd) {
    process.stdout.write(raw);
    process.exit(0);
  }

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    process.stderr.write(`\n[lint] ${path.basename(filePath)} tiene hallazgos de lint (ver arriba).\n`);
  }

  process.stdout.write(raw);
  process.exit(0);
});
