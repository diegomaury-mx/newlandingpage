import assert from "node:assert/strict";
import { test } from "node:test";
import { composeEmail, escapeHtml, CONTACT_TO, CONTACT_FROM } from "./composeEmail.ts";

const INPUT = {
  name: "Ana Pérez",
  email: "ana@example.com",
  message: "Hola.\nQuiero hablar de un programa.",
};

test("escapeHtml: escapa los cinco caracteres peligrosos", () => {
  assert.equal(escapeHtml(`<a href="x">&'</a>`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
});

test("composeEmail: destino y remitente son los fijos del sitio", () => {
  const email = composeEmail(INPUT);
  assert.deepEqual(email.to, [CONTACT_TO]);
  assert.deepEqual(email.to, ["dm@diegomaury.mx"]);
  assert.equal(email.from, `diegomaury.mx <${CONTACT_FROM}>`);
  assert.equal(email.from, "diegomaury.mx <contacto@diegomaury.mx>");
});

test("composeEmail: Reply-To apunta al visitante", () => {
  const email = composeEmail(INPUT);
  assert.equal(email.reply_to, "ana@example.com");
});

test("composeEmail: el asunto incluye el nombre", () => {
  assert.equal(composeEmail(INPUT).subject, "Contacto desde diegomaury.mx: Ana Pérez");
});

test("composeEmail: el texto plano conserva nombre, correo y mensaje", () => {
  const { text } = composeEmail(INPUT);
  assert.match(text, /Nombre: Ana Pérez/);
  assert.match(text, /Correo: ana@example\.com/);
  assert.match(text, /Quiero hablar de un programa\./);
});

test("composeEmail: el html escapa contenido del visitante y convierte saltos de línea", () => {
  const { html } = composeEmail({
    name: "<b>Ana</b>",
    email: "ana@example.com",
    message: "Línea 1\nLínea 2 <script>alert(1)</script>",
  });
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<b>Ana<\/b>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Línea 1<br>Línea 2/);
});
