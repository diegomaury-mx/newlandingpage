import assert from "node:assert/strict";
import { test } from "node:test";
import { buildWhatsappHref } from "./contactLinks.ts";

test("buildWhatsappHref: arma el enlace wa.me con el mensaje codificado", () => {
  assert.equal(
    buildWhatsappHref("5215512345678", "Hola Diego, ¿platicamos?"),
    "https://wa.me/5215512345678?text=Hola%20Diego%2C%20%C2%BFplaticamos%3F",
  );
});

test("buildWhatsappHref: rechaza números que no son solo dígitos", () => {
  assert.throws(() => buildWhatsappHref("+52 55 1234 5678", "Hola"), /solo digitos/);
  assert.throws(() => buildWhatsappHref("", "Hola"), /solo digitos/);
});
