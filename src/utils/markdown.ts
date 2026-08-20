/**
 * Renderer minimo de Markdown -> HTML para el `body` de un caso (generado por
 * `blocksToMarkdown` en notionLoaders.ts). No es un parser de Markdown de
 * proposito general: cubre exactamente lo que ese generador produce
 * (encabezados, listas, tablas, citas, separador, negritas, links, parrafos).
 * Evita una dependencia (remark/marked) para una superficie de entrada
 * acotada y conocida.
 */

import { slugify } from "./slug.ts";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SAFE_LINK_SCHEME = /^(https?:|mailto:|tel:)/i;

/** Aplica **negritas** y [links](url) sobre texto ya escapado. */
function renderInline(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) =>
      SAFE_LINK_SCHEME.test(url) || url.startsWith("/") || url.startsWith("#")
        ? `<a href="${url}" target="_blank" rel="noopener">${label}</a>`
        : label,
    );
}

function parseTableRows(lines: string[]): { header: string[]; body: string[][] } {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const [header, separator, ...rest] = rows;
  const isSeparator = separator?.every((cell) => /^-+$/.test(cell));
  const body = isSeparator ? rest : rows.slice(1);
  return { header, body };
}

function renderTable(lines: string[]): string {
  const { header, body } = parseTableRows(lines);
  const headHtml = header.map((cell) => `<th>${renderInline(cell)}</th>`).join("");
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="prose-table"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

const RESULT_SECTION_ID = "resultado";
const RESULT_TABLE_HEADERS = ["Métrica", "Antes", "Después"];

/** true solo si los encabezados coinciden exacto, en orden — el fallback (renderTable) cubre cualquier otro caso. */
function isResultTableHeader(header: string[]): boolean {
  if (header.length !== RESULT_TABLE_HEADERS.length) return false;
  return header.every((cell, i) => cell === RESULT_TABLE_HEADERS[i]);
}

/** Separa "30 (+500%)" en { value: "30", delta: "+500%" }; sin paréntesis, delta es null. */
function splitDelta(cell: string): { value: string; delta: string | null } {
  const match = cell.trim().match(/^(.*?)\s*\(([+-][^)]+)\)$/);
  if (!match) return { value: cell.trim(), delta: null };
  return { value: match[1].trim(), delta: match[2].trim() };
}

function renderResultCards(bodyRows: string[][]): string {
  const cards = bodyRows
    .map(([metric = "", before = "", afterRaw = ""]) => {
      const { value, delta } = splitDelta(afterRaw);
      const beforeTrimmed = before.trim();
      const showBefore = beforeTrimmed !== "" && beforeTrimmed !== "—" && beforeTrimmed !== "-";
      const beforeHtml = showBefore
        ? `<div class="rc-before">Antes: <s>${renderInline(beforeTrimmed)}</s></div>`
        : "";
      const deltaHtml = delta ? `<div class="rc-delta">${renderInline(delta)}</div>` : "";
      return (
        `<div class="result-card"><div class="rc-label">${renderInline(metric)}</div>` +
        `<div class="rc-value">${renderInline(value)}</div>${beforeHtml}${deltaHtml}</div>`
      );
    })
    .join("");
  return `<div class="result-grid">${cards}</div>`;
}

/** Convierte el Markdown plano de un caso a HTML listo para `set:html`. */
export function renderMarkdown(markdown: string): string {
  if (!markdown.trim()) return "";
  const blocks = markdown.split(/\n{2,}/);
  const html: string[] = [];
  let currentSectionId = "";

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n");

    if (trimmed === "---") {
      html.push("<hr />");
    } else if (lines.every((line) => line.trim().startsWith("|"))) {
      const { header, body } = parseTableRows(lines);
      if (currentSectionId === RESULT_SECTION_ID && isResultTableHeader(header)) {
        html.push(renderResultCards(body));
      } else {
        html.push(renderTable(lines));
      }
    } else if (trimmed.startsWith("### ")) {
      html.push(`<h3>${renderInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      const heading = trimmed.slice(3);
      currentSectionId = slugify(heading);
      html.push(`<h2 id="${currentSectionId}">${renderInline(heading)}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      html.push(`<h1>${renderInline(trimmed.slice(2))}</h1>`);
    } else if (lines.every((line) => line.trim().startsWith("- "))) {
      const items = lines.map((line) => `<li>${renderInline(line.trim().slice(2))}</li>`).join("");
      html.push(`<ul>${items}</ul>`);
    } else if (lines.every((line) => /^\d+\.\s/.test(line.trim()))) {
      const items = lines
        .map((line) => `<li>${renderInline(line.trim().replace(/^\d+\.\s/, ""))}</li>`)
        .join("");
      html.push(`<ol>${items}</ol>`);
    } else if (lines.every((line) => line.trim().startsWith("> "))) {
      const quote = lines.map((line) => renderInline(line.trim().slice(2))).join("<br />");
      html.push(`<blockquote>${quote}</blockquote>`);
    } else {
      html.push(`<p>${lines.map(renderInline).join("<br />")}</p>`);
    }
  }

  return html.join("\n");
}

export interface MarkdownSection {
  title: string;
  id: string;
}

/** Extrae los encabezados `##` de nivel de seccion (Contexto, Problema, etc.) para navegacion. */
export function extractSections(markdown: string): MarkdownSection[] {
  if (!markdown.trim()) return [];
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("## "))
    .map((block) => {
      const title = block.slice(3).trim();
      return { title, id: slugify(title) };
    });
}
