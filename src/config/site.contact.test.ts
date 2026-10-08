import assert from "node:assert/strict";
import { test } from "node:test";
import { site } from "./site.ts";

test("site.contactChannels: WhatsApp es solo dígitos con lada internacional", () => {
  assert.match(site.contactChannels.whatsappNumber, /^\d{10,15}$/);
});

test("site.contactChannels: la clave pública de Turnstile tiene la forma de una clave real", () => {
  assert.match(site.contactChannels.turnstileSiteKey, /^0x[A-Za-z0-9_-]{10,}$/);
});

test("site.contactChannels: el correo es el canónico del sitio", () => {
  assert.equal(site.contactChannels.email, "dm@diegomaury.mx");
});
