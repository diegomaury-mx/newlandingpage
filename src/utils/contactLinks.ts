const DIGITS_ONLY = /^\d{10,15}$/;

/**
 * Enlace de WhatsApp. El numero solo aparece dentro del href, nunca como texto
 * visible (decision de Diego, 2026-10-08). Falla en build si el numero no es
 * solo digitos en formato internacional: un enlace roto no debe publicarse.
 */
export function buildWhatsappHref(number: string, text: string): string {
  if (!DIGITS_ONLY.test(number)) {
    throw new Error("buildWhatsappHref: el numero debe ser solo digitos con lada internacional");
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
