/**
 * Textos fijos de la seccion de contacto (S8). Label, titular e intro NO viven
 * aqui: vienen de Notion (bloque S8 de "Copy Oficial") y en EN se traducen via
 * DeepL. Este diccionario es solo para lo que el codigo escribe literal; la
 * version EN esta traducida a mano, nunca via DeepL (ver CLAUDE.md).
 * Sin promesas de tiempo de respuesta (decision de Diego, 2026-10-08).
 */
import type { ContactField, FieldError } from "../../functions/_lib/validateContact.ts";

export type ContactLocale = "es" | "en";

export interface ContactCopy {
  directTitle: string;
  emailLabel: string;
  copy: string;
  copied: string;
  whatsappLabel: string;
  whatsappValue: string;
  whatsappAction: string;
  whatsappPrefill: string;
  linkedinLabel: string;
  linkedinValue: string;
  linkedinAction: string;
  scheduleCta: string;
  scheduleHint: string;
  separator: string;
  nameLabel: string;
  namePlaceholder: string;
  emailFieldLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  successTitle: string;
  successBody: string;
  error: string;
  fieldErrors: Record<ContactField, Record<FieldError, string>>;
}

const es: ContactCopy = {
  directTitle: "Escríbeme directo",
  emailLabel: "Correo",
  copy: "Copiar",
  copied: "Copiado",
  whatsappLabel: "WhatsApp",
  whatsappValue: "Chatea conmigo",
  whatsappAction: "Abrir chat",
  whatsappPrefill: "Hola Diego, vi tu sitio y me gustaría platicar.",
  linkedinLabel: "LinkedIn",
  linkedinValue: "Diego Maury",
  linkedinAction: "Ver perfil",
  scheduleCta: "Agendar una llamada",
  scheduleHint: "Eliges la hora en mi calendario.",
  separator: "¿Prefieres escribir?",
  nameLabel: "Nombre",
  namePlaceholder: "Tu nombre",
  emailFieldLabel: "Correo",
  emailPlaceholder: "tu@correo.com",
  messageLabel: "Mensaje",
  messagePlaceholder: "¿Qué quieres lograr?",
  send: "Enviar mensaje",
  sending: "Enviando",
  successTitle: "Mensaje enviado",
  successBody: "Gracias por escribirme. Leeré tu mensaje y te responderé por correo.",
  error: "No pude enviar tu mensaje. Escríbeme directo a",
  fieldErrors: {
    name: {
      required: "Escribe tu nombre.",
      too_short: "Escribe tu nombre.",
      too_long: "El nombre es demasiado largo.",
      invalid: "El nombre tiene caracteres no válidos.",
    },
    email: {
      required: "Escribe tu correo.",
      too_short: "Escribe tu correo.",
      too_long: "El correo es demasiado largo.",
      invalid: "Revisa el formato del correo.",
    },
    message: {
      required: "Cuéntame qué necesitas.",
      too_short: "Cuéntame un poco más (mínimo 10 caracteres).",
      too_long: "El mensaje es demasiado largo (máximo 2000 caracteres).",
      invalid: "El mensaje tiene caracteres no válidos.",
    },
  },
};

const en: ContactCopy = {
  directTitle: "Write to me directly",
  emailLabel: "Email",
  copy: "Copy",
  copied: "Copied",
  whatsappLabel: "WhatsApp",
  whatsappValue: "Chat with me",
  whatsappAction: "Open chat",
  whatsappPrefill: "Hi Diego, I saw your site and I'd like to talk.",
  linkedinLabel: "LinkedIn",
  linkedinValue: "Diego Maury",
  linkedinAction: "View profile",
  scheduleCta: "Book a call",
  scheduleHint: "You pick the time in my calendar.",
  separator: "Prefer to write?",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  emailFieldLabel: "Email",
  emailPlaceholder: "you@email.com",
  messageLabel: "Message",
  messagePlaceholder: "What do you want to achieve?",
  send: "Send message",
  sending: "Sending",
  successTitle: "Message sent",
  successBody: "Thanks for writing. I will read your message and reply by email.",
  error: "I couldn't send your message. Write to me directly at",
  fieldErrors: {
    name: {
      required: "Enter your name.",
      too_short: "Enter your name.",
      too_long: "The name is too long.",
      invalid: "The name has invalid characters.",
    },
    email: {
      required: "Enter your email.",
      too_short: "Enter your email.",
      too_long: "The email is too long.",
      invalid: "Check the email format.",
    },
    message: {
      required: "Tell me what you need.",
      too_short: "Tell me a bit more (minimum 10 characters).",
      too_long: "The message is too long (maximum 2000 characters).",
      invalid: "The message has invalid characters.",
    },
  },
};

export const contactCopy: Record<ContactLocale, ContactCopy> = { es, en };
