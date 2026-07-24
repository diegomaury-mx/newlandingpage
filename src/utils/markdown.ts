/**
 * Renderer minimo de Markdown -> HTML para el `body` de un caso (generado por
 * `blocksToMarkdown` en notionLoaders.ts). No es un parser de Markdown de
 * proposito general: cubre exactamente lo que ese generador produce
 * (encabezados, listas, tablas, citas, separador, negritas, links, parrafos).
 * Evita una dependencia (remark/marked) para una superficie de entrada
 * acotada y conocida.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Aplica **negritas** y [links](url) sobre texto ya escapado. */
function renderInline(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderTable(lines: string[]): string {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const [header, separator, ...body] = rows;
  const isSeparator = separator?.every((cell) => /^-+$/.test(cell));
  const bodyRows = isSeparator ? body : rows.slice(1);
  const headHtml = header.map((cell) => `<th>${renderInline(cell)}</th>`).join("");
  const bodyHtml = bodyRows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="prose-table"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

/** Convierte el Markdown plano de un caso a HTML listo para `set:html`. */
export function renderMarkdown(markdown: string): string {
  if (!markdown.trim()) return "";
  const blocks = markdown.split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n");

    if (trimmed === "---") {
      html.push("<hr />");
    } else if (lines.every((line) => line.trim().startsWith("|"))) {
      html.push(renderTable(lines));
    } else if (trimmed.startsWith("### ")) {
      html.push(`<h3>${renderInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      html.push(`<h2>${renderInline(trimmed.slice(3))}</h2>`);
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
