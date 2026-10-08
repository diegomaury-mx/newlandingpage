import { composeEmail } from "./composeEmail.ts";
import { validateContact } from "./validateContact.ts";

export interface ContactEnv {
  TURNSTILE_SECRET?: string;
  CF_ACCOUNT_ID?: string;
  CF_EMAIL_API_TOKEN?: string;
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const MAX_BODY_CHARS = 10_000;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_API_BASE = "https://api.cloudflare.com/client/v4/accounts";

function json(status: number, body: Record<string, unknown>, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extraHeaders },
  });
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
  fetchFn: FetchLike,
): Promise<boolean> {
  const form = new URLSearchParams({ secret, response: token });
  if (remoteIp) form.set("remoteip", remoteIp);
  const res = await fetchFn(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  return data?.success === true;
}

async function sendEmail(
  payload: ReturnType<typeof composeEmail>,
  env: Required<ContactEnv>,
  fetchFn: FetchLike,
): Promise<boolean> {
  const res = await fetchFn(`${EMAIL_API_BASE}/${env.CF_ACCOUNT_ID}/email/sending/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_EMAIL_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!res.ok || data?.success === false) {
    console.error("[contact] el envio de correo fallo", res.status);
    return false;
  }
  return true;
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  fetchFn: FetchLike = fetch,
): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" }, { Allow: "POST" });
  }
  if (!env.TURNSTILE_SECRET || !env.CF_ACCOUNT_ID || !env.CF_EMAIL_API_TOKEN) {
    console.error("[contact] falta configuracion (secrets o variables)");
    return json(500, { ok: false, error: "not_configured" });
  }
  const config = env as Required<ContactEnv>;

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json(413, { ok: false, error: "too_large" });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  // Honeypot: los bots llenan el campo oculto. Se responde exito para no darles senal.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json(200, { ok: true });
  }

  const validation = validateContact(body);
  if (!validation.ok) return json(422, { ok: false, error: "validation", fields: validation.fields });

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!token) return json(400, { ok: false, error: "captcha" });

  try {
    const verified = await verifyTurnstile(
      token,
      config.TURNSTILE_SECRET,
      request.headers.get("CF-Connecting-IP"),
      fetchFn,
    );
    if (!verified) return json(400, { ok: false, error: "captcha" });
  } catch {
    console.error("[contact] Turnstile inalcanzable");
    return json(502, { ok: false, error: "captcha_unavailable" });
  }

  try {
    const sent = await sendEmail(composeEmail(validation.value), config, fetchFn);
    if (!sent) return json(502, { ok: false, error: "send_failed" });
  } catch {
    console.error("[contact] la API de correo es inalcanzable");
    return json(502, { ok: false, error: "send_failed" });
  }

  return json(200, { ok: true });
}
