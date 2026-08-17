export type Locale = "es" | "en";

const EN_PREFIX = "/en";

function stripEnPrefix(pathname: string): string {
  if (pathname === EN_PREFIX) return "/";
  if (pathname.startsWith(`${EN_PREFIX}/`)) return pathname.slice(EN_PREFIX.length);
  return pathname;
}

/** El path base (sin locale ni query/hash) determina el locale: /en/* es ingles, todo lo demas es espanol (default). */
export function getLocaleFromPath(pathname: string): Locale {
  const [path] = pathname.split(/[?#]/);
  return path === EN_PREFIX || path.startsWith(`${EN_PREFIX}/`) ? "en" : "es";
}

/** Reescribe un path (con query/hash opcionales) al prefijo del locale destino, sin duplicar /en. */
export function toLocalePath(pathname: string, targetLocale: Locale): string {
  const splitIndex = pathname.search(/[?#]/);
  const path = splitIndex === -1 ? pathname : pathname.slice(0, splitIndex);
  const rest = splitIndex === -1 ? "" : pathname.slice(splitIndex);

  const basePath = stripEnPrefix(path);

  if (targetLocale === "es") return `${basePath}${rest}`;

  const enPath = basePath === "/" ? EN_PREFIX : `${EN_PREFIX}${basePath}`;
  return `${enPath}${rest}`;
}
