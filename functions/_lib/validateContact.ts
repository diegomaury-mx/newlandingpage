/**
 * Reglas de validacion del formulario de contacto. Modulo puro: lo importan
 * el servidor (functions/_lib/handleContact.ts) y el script del cliente
 * (src/scripts/contactForm.ts), asi las reglas tienen una sola fuente.
 */
export const LIMITS = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

export type ContactField = "name" | "email" | "message";
export type FieldError = "required" | "too_short" | "too_long" | "invalid";

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; fields: Partial<Record<ContactField, FieldError>> };

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
// El mensaje admite saltos de linea (\n), retorno (\r) y tab (\t).
const MESSAGE_FORBIDDEN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function checkName(name: string): FieldError | null {
  if (!name) return "required";
  if (name.length > LIMITS.nameMax) return "too_long";
  if (CONTROL_CHARS.test(name)) return "invalid";
  return null;
}

function checkEmail(email: string): FieldError | null {
  if (!email) return "required";
  if (email.length > LIMITS.emailMax) return "too_long";
  if (!EMAIL_PATTERN.test(email) || CONTROL_CHARS.test(email)) return "invalid";
  return null;
}

function checkMessage(message: string): FieldError | null {
  if (!message) return "required";
  if (message.length < LIMITS.messageMin) return "too_short";
  if (message.length > LIMITS.messageMax) return "too_long";
  if (MESSAGE_FORBIDDEN.test(message)) return "invalid";
  return null;
}

export function validateContact(raw: unknown): ValidationResult {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const value: ContactInput = {
    name: trimmed(input.name),
    email: trimmed(input.email),
    message: trimmed(input.message),
  };

  const fields: Partial<Record<ContactField, FieldError>> = {};
  const nameError = checkName(value.name);
  const emailError = checkEmail(value.email);
  const messageError = checkMessage(value.message);
  if (nameError) fields.name = nameError;
  if (emailError) fields.email = emailError;
  if (messageError) fields.message = messageError;

  return Object.keys(fields).length > 0 ? { ok: false, fields } : { ok: true, value };
}
