/**
 * Smoke test del cliente de lectura de Notion (Diego CMS).
 *
 * Prueba la lectura autenticada VIVA contra las 3 fuentes CMS. Requiere un token
 * de integracion valido en `NOTION_TOKEN` (archivo `.env` en la raiz o variable
 * de entorno). No modifica nada en Notion — solo lee.
 *
 * Uso:
 *   1. Copia `.env.example` a `.env` y pega el token en NOTION_TOKEN.
 *   2. npm run cms:smoke
 *
 * Sale con codigo 0 si las 3 fuentes responden; 1 en cualquier fallo.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  fetchCases,
  fetchMetrics,
  fetchSiteCopy,
  getTitle,
} from "../src/services/notionClient.ts";

/** Carga `.env` de la raiz a process.env si existe (parser minimo, sin deps). */
function loadDotEnv(): void {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env opcional: si no existe, se asume que NOTION_TOKEN ya esta en el entorno.
  }
}

async function main(): Promise<void> {
  loadDotEnv();

  process.stdout.write("Probando lectura de las 3 fuentes CMS...\n");

  const cases = await fetchCases();
  process.stdout.write(`  cases:    ${cases.length} fichas\n`);
  if (cases.length > 0) {
    process.stdout.write(`            ej. "${getTitle(cases[0], "title")}"\n`);
  }

  const metrics = await fetchMetrics();
  process.stdout.write(`  metrics:  ${metrics.length} filas\n`);
  if (metrics.length > 0) {
    process.stdout.write(
      `            ej. "${getTitle(metrics[0], "Métrica")}"\n`,
    );
  }

  const siteCopy = await fetchSiteCopy();
  process.stdout.write(
    `  siteCopy: pagina OK, ${siteCopy.blocks.length} bloques\n`,
  );

  if (cases.length === 0 || metrics.length === 0) {
    throw new Error(
      "Una fuente devolvio 0 registros. Revisa que la integracion tenga acceso a las 3 fuentes.",
    );
  }

  process.stdout.write("\nOK: las 3 fuentes respondieron.\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`\nFALLO: ${message}\n`);
  process.exit(1);
});
