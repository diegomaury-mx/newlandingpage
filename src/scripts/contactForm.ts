/**
 * Comportamiento del formulario de contacto (S8): validacion con las mismas
 * reglas que el servidor, Turnstile cargado de forma diferida, envio a
 * /api/contact, estados (enviando / enviado / error) y boton Copiar.
 * Es un modulo bundleado (no is:inline).
 */
import {
  validateContact,
  type ContactField,
  type FieldError,
} from "../../functions/_lib/validateContact.ts";

interface TurnstileOptions {
  sitekey: string;
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}
interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId?: string): void;
}
interface ContactWindow {
  turnstile?: TurnstileApi;
  dataLayer?: Record<string, unknown>[];
}
interface FormMessages {
  errors: Record<ContactField, Record<FieldError, string>>;
  send: string;
  sending: string;
  copy: string;
  copied: string;
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_TIMEOUT_MS = 10_000;
const COPIED_RESET_MS = 2_000;
const FIELDS: ContactField[] = ["name", "email", "message"];

const win = window as unknown as ContactWindow;
let turnstileLoading: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (win.turnstile) return Promise.resolve();
  turnstileLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
  return turnstileLoading;
}

function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`[contact] falta ${selector}`);
  return element;
}

function initForm(form: HTMLFormElement): void {
  const messages = JSON.parse(form.dataset.messages ?? "{}") as FormMessages;
  const endpoint = form.dataset.endpoint ?? "/api/contact";
  const siteKey = form.dataset.sitekey ?? "";
  const location = form.dataset.location ?? "";
  const panel = form.closest<HTMLElement>(".contact-panel") ?? form;

  const turnstileHost = required<HTMLElement>(form, "[data-contact-turnstile]");
  const submitButton = required<HTMLButtonElement>(form, "[data-contact-submit]");
  const submitLabel = required<HTMLElement>(form, "[data-submit-label]");
  const errorBox = required<HTMLElement>(form, "[data-contact-error]");
  const successBox = required<HTMLElement>(panel, "[data-contact-success]");
  const honeypot = required<HTMLInputElement>(form, 'input[name="website"]');

  let widgetId: string | undefined;
  let token: string | null = null;
  let waiter: ((value: string | null) => void) | null = null;

  async function mountTurnstile(): Promise<void> {
    await loadTurnstile();
    if (widgetId !== undefined || !win.turnstile) return;
    widgetId = win.turnstile.render(turnstileHost, {
      sitekey: siteKey,
      appearance: "interaction-only",
      callback: (value) => {
        token = value;
        waiter?.(value);
        waiter = null;
      },
      "expired-callback": () => { token = null; },
      "error-callback": () => { token = null; },
    });
  }

  function awaitToken(): Promise<string | null> {
    if (token) return Promise.resolve(token);
    return new Promise((resolve) => {
      waiter = resolve;
      window.setTimeout(() => resolve(null), TOKEN_TIMEOUT_MS);
    });
  }

  function field(name: ContactField): HTMLInputElement | HTMLTextAreaElement {
    return required<HTMLInputElement | HTMLTextAreaElement>(form, `[name="${name}"]`);
  }

  function clearFieldErrors(): void {
    for (const name of FIELDS) {
      const input = field(name);
      input.removeAttribute("aria-invalid");
      const slot = required<HTMLElement>(form, `[data-error-for="${name}"]`);
      slot.hidden = true;
      slot.textContent = "";
    }
    errorBox.hidden = true;
  }

  function showFieldErrors(errors: Partial<Record<ContactField, FieldError>>): void {
    let firstInvalid: HTMLElement | null = null;
    for (const name of FIELDS) {
      const code = errors[name];
      if (!code) continue;
      const input = field(name);
      input.setAttribute("aria-invalid", "true");
      const slot = required<HTMLElement>(form, `[data-error-for="${name}"]`);
      slot.textContent = messages.errors[name][code];
      slot.hidden = false;
      firstInvalid ??= input;
    }
    firstInvalid?.focus();
  }

  function setBusy(busy: boolean): void {
    submitButton.disabled = busy;
    submitButton.setAttribute("aria-busy", String(busy));
    submitLabel.textContent = busy ? messages.sending : messages.send;
  }

  function showSuccess(): void {
    form.hidden = true;
    successBox.hidden = false;
    successBox.focus();
    (win.dataLayer ??= []).push({ event: "contact_form_submit", cta_location: location });
  }

  function showSendError(): void {
    errorBox.hidden = false;
    if (widgetId !== undefined) win.turnstile?.reset(widgetId);
    token = null;
  }

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    clearFieldErrors();

    const result = validateContact({
      name: field("name").value,
      email: field("email").value,
      message: field("message").value,
    });
    if (!result.ok) {
      showFieldErrors(result.fields);
      return;
    }

    setBusy(true);
    try {
      await mountTurnstile();
      const turnstileToken = await awaitToken();
      if (!turnstileToken) {
        showSendError();
        return;
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.value, website: honeypot.value, turnstileToken }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; fields?: Partial<Record<ContactField, FieldError>> }
        | null;

      if (response.ok && payload?.ok) {
        showSuccess();
      } else if (response.status === 422 && payload?.fields) {
        showFieldErrors(payload.fields);
      } else {
        showSendError();
      }
    } catch {
      showSendError();
    } finally {
      setBusy(false);
    }
  }

  // Turnstile se carga solo cuando el visitante enfoca el formulario o este
  // entra al viewport: quien no escribe no paga el costo del script.
  const prepare = (): void => { void mountTurnstile().catch(() => {}); };
  form.addEventListener("focusin", prepare, { once: true });
  new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      prepare();
    }
  }, { rootMargin: "200px" }).observe(form);

  form.addEventListener("submit", (event) => { void submit(event); });
}

function initCopy(button: HTMLButtonElement): void {
  const value = button.dataset.copyValue ?? "";
  const label = required<HTMLElement>(button, "[data-copy-label]");
  const status = document.querySelector<HTMLElement>("[data-copy-status]");
  const original = label.textContent ?? "";
  const copiedText = button.closest("section")
    ?.querySelector<HTMLFormElement>("[data-contact-form]")
    ?.dataset.messages;
  const copied = copiedText ? (JSON.parse(copiedText) as FormMessages).copied : original;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    label.textContent = copied;
    if (status) status.textContent = copied;
    window.setTimeout(() => {
      label.textContent = original;
      if (status) status.textContent = "";
    }, COPIED_RESET_MS);
  });
}

document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach(initForm);
document.querySelectorAll<HTMLButtonElement>("[data-copy-email]").forEach(initCopy);
