/**
 * Guardia de deriva de tokens: falla si un token de color que existe en AMBOS
 * `variables.css` (fuente del sitio) y `vendor/ds-v2-tokens.css` (copia
 * vendoreada del canónico, ver ese archivo) tiene un valor distinto. No exige
 * simetría — el sitio puede declarar tokens propios (--ease, --ease-in-out) y
 * el DS puede declarar tokens que el sitio no usa hoy (--light-*, --bg-stage):
 * solo lo COMPARTIDO no puede discrepar en silencio.
 *
 * No compara tipografía a propósito: el sitio autohospeda Plus Jakarta Sans /
 * DM Mono con fuentes de fallback propias (ver fonts.css), así que --sans/
 * --mono divergen del vendoreado por diseño, no por deriva.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_TOKENS_PATH = resolve(__dirname, "variables.css");
const VENDORED_TOKENS_PATH = resolve(__dirname, "vendor/ds-v2-tokens.css");

/** Los únicos tokens que este guardia compara: los 7 valores de color del
 * contrato de marca (ver tabla "Tokens canónicos" del runbook v2.3/v2.4). */
const SHARED_COLOR_TOKENS = ["bg", "bg-2", "border", "t1", "t2", "t3", "ember"];

function extractRootBlock(css: string): string {
  const match = css.match(/:root\s*\{([\s\S]*?)\n\s*\}/);
  if (!match) {
    throw new Error("No se encontró un bloque :root en el archivo de tokens.");
  }
  return match[1];
}

function parseTokens(rootBlock: string): Map<string, string> {
  const tokens = new Map<string, string>();
  const declaration = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = declaration.exec(rootBlock)) !== null) {
    const name = match[1];
    const value = match[2].replace(/\/\*[\s\S]*?\*\//g, "").trim();
    tokens.set(name, value);
  }
  return tokens;
}

/** Resuelve `var(--otro-token)` hasta un valor literal (máx. 5 saltos, evita ciclos infinitos). */
function resolveValue(name: string, tokens: Map<string, string>, depth = 0): string {
  const value = tokens.get(name);
  if (value === undefined) {
    throw new Error(`Token --${name} referenciado pero no declarado en su :root.`);
  }
  const varRef = value.match(/^var\(--([\w-]+)\)$/);
  if (varRef && depth < 5) {
    return resolveValue(varRef[1], tokens, depth + 1);
  }
  return value.toLowerCase();
}

test("ningún token de color compartido entre variables.css y el DS vendoreado diverge en valor", () => {
  const siteTokens = parseTokens(extractRootBlock(readFileSync(SITE_TOKENS_PATH, "utf8")));
  const vendoredTokens = parseTokens(extractRootBlock(readFileSync(VENDORED_TOKENS_PATH, "utf8")));

  const mismatches: string[] = [];
  for (const name of SHARED_COLOR_TOKENS) {
    if (!siteTokens.has(name) || !vendoredTokens.has(name)) continue;
    const siteValue = resolveValue(name, siteTokens);
    const vendoredValue = resolveValue(name, vendoredTokens);
    if (siteValue !== vendoredValue) {
      mismatches.push(`--${name}: variables.css=${siteValue} · DS vendoreado=${vendoredValue}`);
    }
  }

  assert.equal(
    mismatches.length,
    0,
    "Deriva detectada contra el Design System canónico. Si es intencional, " +
      "re-vendorea src/styles/vendor/ds-v2-tokens.css (DesignSync get_file) y " +
      "confirma con Diego; si no, corrige variables.css:\n" +
      mismatches.join("\n"),
  );
});
