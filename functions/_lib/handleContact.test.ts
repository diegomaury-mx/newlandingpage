import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { handleContact, type FetchLike } from "./handleContact.ts";

// Los caminos de error del handler llaman console.error a proposito.
mock.method(console, "error", () => {});

const ENV = {
  TURNSTILE_SECRET: "secret",
  RESEND_API_KEY: "re_key",
};

const VALID = {
  name: "Ana Pérez",
  email: "ana@example.com",
  message: "Quiero hablar de un programa de innovación.",
  website: "",
  turnstileToken: "t-ok",
};

function post(body: unknown): Request {
  return new Request("https://diegomaury.mx/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

interface Call {
  url: string;
  init?: RequestInit;
}

function fakeFetch(options: { turnstile?: boolean | "throw"; email?: number | "throw" } = {}) {
  const calls: Call[] = [];
  const fn: FetchLike = async (url, init) => {
    calls.push({ url, init });
    if (url.includes("turnstile")) {
      if (options.turnstile === "throw") throw new Error("red");
      return Response.json({ success: options.turnstile !== false });
    }
    if (options.email === "throw") throw new Error("red");
    const status = typeof options.email === "number" ? options.email : 200;
    return Response.json(status === 200 ? { id: "em_1" } : { message: "x" }, { status });
  };
  return { fn, calls };
}

async function bodyOf(res: Response): Promise<Record<string, unknown>> {
  return (await res.json()) as Record<string, unknown>;
}

test("handleContact: método distinto de POST responde 405", async () => {
  const { fn } = fakeFetch();
  const res = await handleContact(new Request("https://diegomaury.mx/api/contact"), ENV, fn);
  assert.equal(res.status, 405);
  assert.equal(res.headers.get("Allow"), "POST");
});

test("handleContact: sin configuración responde 500 not_configured", async () => {
  const { fn, calls } = fakeFetch();
  const res = await handleContact(post(VALID), { ...ENV, TURNSTILE_SECRET: undefined }, fn);
  assert.equal(res.status, 500);
  assert.equal((await bodyOf(res)).error, "not_configured");
  assert.equal(calls.length, 0);
});

test("handleContact: JSON inválido responde 400 invalid_json", async () => {
  const { fn } = fakeFetch();
  const res = await handleContact(post("{no es json"), ENV, fn);
  assert.equal(res.status, 400);
  assert.equal((await bodyOf(res)).error, "invalid_json");
});

test("handleContact: cuerpo demasiado grande responde 413", async () => {
  const { fn } = fakeFetch();
  const res = await handleContact(post({ ...VALID, message: "a".repeat(20_000) }), ENV, fn);
  assert.equal(res.status, 413);
});

test("handleContact: honeypot lleno responde éxito falso sin llamar a nadie", async () => {
  const { fn, calls } = fakeFetch();
  const res = await handleContact(post({ ...VALID, website: "http://spam.example" }), ENV, fn);
  assert.equal(res.status, 200);
  assert.equal((await bodyOf(res)).ok, true);
  assert.equal(calls.length, 0);
});

test("handleContact: validación fallida responde 422 con los campos y sin llamadas", async () => {
  const { fn, calls } = fakeFetch();
  const res = await handleContact(post({ ...VALID, email: "mal" }), ENV, fn);
  assert.equal(res.status, 422);
  assert.deepEqual((await bodyOf(res)).fields, { email: "invalid" });
  assert.equal(calls.length, 0);
});

test("handleContact: sin token de Turnstile responde 400 captcha y no envía correo", async () => {
  const { fn, calls } = fakeFetch();
  const res = await handleContact(post({ ...VALID, turnstileToken: "" }), ENV, fn);
  assert.equal(res.status, 400);
  assert.equal((await bodyOf(res)).error, "captcha");
  assert.equal(calls.length, 0);
});

test("handleContact: Turnstile rechazado responde 400 captcha y no envía correo", async () => {
  const { fn, calls } = fakeFetch({ turnstile: false });
  const res = await handleContact(post(VALID), ENV, fn);
  assert.equal(res.status, 400);
  assert.equal((await bodyOf(res)).error, "captcha");
  assert.equal(calls.length, 1);
});

test("handleContact: Turnstile inalcanzable responde 502 captcha_unavailable", async () => {
  const { fn } = fakeFetch({ turnstile: "throw" });
  const res = await handleContact(post(VALID), ENV, fn);
  assert.equal(res.status, 502);
  assert.equal((await bodyOf(res)).error, "captcha_unavailable");
});

test("handleContact: éxito verifica Turnstile y luego envía el correo correcto", async () => {
  const { fn, calls } = fakeFetch();
  const res = await handleContact(post(VALID), ENV, fn);
  assert.equal(res.status, 200);
  assert.deepEqual(await bodyOf(res), { ok: true });
  assert.equal(calls.length, 2);

  assert.match(calls[0].url, /turnstile\/v0\/siteverify$/);
  assert.match(String(calls[0].init?.body), /secret=secret/);
  assert.match(String(calls[0].init?.body), /response=t-ok/);

  assert.equal(calls[1].url, "https://api.resend.com/emails");
  const headers = calls[1].init?.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer re_key");
  const sent = JSON.parse(String(calls[1].init?.body)) as Record<string, unknown>;
  assert.deepEqual(sent.to, ["dm@diegomaury.mx"]);
  assert.equal(sent.reply_to, "ana@example.com");
});

test("handleContact: la API de correo con error responde 502 send_failed", async () => {
  const { fn } = fakeFetch({ email: 403 });
  const res = await handleContact(post(VALID), ENV, fn);
  assert.equal(res.status, 502);
  assert.equal((await bodyOf(res)).error, "send_failed");
});

test("handleContact: la API de correo inalcanzable responde 502 send_failed", async () => {
  const { fn } = fakeFetch({ email: "throw" });
  const res = await handleContact(post(VALID), ENV, fn);
  assert.equal(res.status, 502);
  assert.equal((await bodyOf(res)).error, "send_failed");
});
