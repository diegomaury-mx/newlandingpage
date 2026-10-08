import type { ContactInput } from "./validateContact.ts";

export const CONTACT_TO = "dm@diegomaury.mx";
export const CONTACT_FROM = "contacto@diegomaury.mx";
const FROM_NAME = "diegomaury.mx";

export interface ComposedEmail {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function composeEmail(input: ContactInput): ComposedEmail {
  const { name, email, message } = input;
  const text = `Nombre: ${name}\nCorreo: ${email}\n\n${message}`;
  const html =
    `<p><strong>Nombre:</strong> ${escapeHtml(name)}<br>` +
    `<strong>Correo:</strong> ${escapeHtml(email)}</p>` +
    `<p>${escapeHtml(message).replace(/\r?\n/g, "<br>")}</p>`;

  return {
    from: `${FROM_NAME} <${CONTACT_FROM}>`,
    to: [CONTACT_TO],
    reply_to: email,
    subject: `Contacto desde diegomaury.mx: ${name}`,
    text,
    html,
  };
}
