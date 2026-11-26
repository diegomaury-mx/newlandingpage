# Auditoría de ciberseguridad · diegomaury.mx · 2026-11-25

Modo: solo hallazgos (opción A). No se modificó código ni configuración.
Alcance: `functions/` (contacto), Worker `notion-deploy-relay`, `public/_headers` y `_redirects`, render de contenido de Notion y scripts de cliente, dependencias, secretos en repo e historial, configuración real de la zona y del proyecto Pages en Cloudflare.
Fuera de alcance: pruebas activas contra producción, cuentas de Notion/Google/Zoho, repo `notion-cms`.

## Resumen

| Severidad | Cantidad |
|---|---|
| Crítica | 0 |
| Alta | 0 |
| Media | 1 |
| Baja | 6 |
| Info | 7 |

No hay nada explotable de forma grave hoy. El único hallazgo medio es un abuso posible del Worker relay sin firma.

## Lo que está bien (verificado)

- Cabeceras LIVE iguales a `public/_headers`: CSP única, HSTS, nosniff, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, Referrer y Permissions-Policy. Transform Rules de headers: 0 reglas.
- TLS mínimo 1.2, TLS 1.3 activo, HTTP → HTTPS con 301 en raíz y `www`.
- `/api/contact`: solo POST, límite de tamaño, honeypot, validación compartida con control de caracteres, Turnstile verificado en servidor, HTML del correo escapado, errores sin detalles internos. Rate limiting de zona activo (2 req / 10 s por IP).
- Secretos: los 4 de Pages son `secret_text` en preview y production; los 2 del Worker también. Ningún token, API key ni Deploy Hook en el repo ni en el historial de git. `.env*` y `.dev.vars` ignorados. La clave de Turnstile en `site.ts` es la pública (correcto).
- Dependencias: `npm audit --omit=dev` = 0 vulnerabilidades. Las 3 moderadas son de `htmlhint` (devDependency, no llega al sitio).
- Render: `renderMarkdown` escapa todo antes de aplicar reglas, bloquea `javascript:`/`data:`; JSON-LD escapa `<`; no hay `innerHTML`, `postMessage` ni `localStorage` en `src/`; todos los `target="_blank"` llevan `noopener`; URLs de colecciones validadas con `^https?://`; `sanitizeCacheKey` impide path traversal.
- Correo: SPF `-all`, DMARC `p=quarantine`, DKIM de Zoho y Resend publicados.

## Hallazgos

### M-1 · Worker relay acepta escrituras en KV sin firma
**Archivo:** `docs/platform/relay/worker.next.js:17-25`
```js
if (parsed && parsed.verification_token) {
  await env.RELAY_KV.put("verification_token", parsed.verification_token);
  return new Response("OK", { status: 200 });
```
**Problema:** este bloque corre antes de validar la firma HMAC. Cualquiera que conozca la URL pública del Worker puede mandar `{"verification_token":"x"}` en bucle. Cada petición es una escritura en KV. El plan Free de KV admite 1,000 escrituras al día; al agotarlas, el `put`/`delete` de `events_rebuild_pending` falla y la agenda de `/eventos` deja de reconstruirse por webhook hasta el día siguiente (el cron diario sigue disparando el build, pero no puede limpiar la marca). No da acceso a secretos ni dispara builds.
**Arreglo:** aceptar el payload de verificación solo mientras `NOTION_WEBHOOK_SECRET` no exista (`if (parsed?.verification_token && !env.NOTION_WEBHOOK_SECRET)`); con el secreto ya configurado, responder 200 sin escribir. Opcional: rechazar cuerpos mayores a ~100 KB.
**Esfuerzo:** pequeño (2 líneas + re-deploy del Worker preservando bindings y ambos crons, ver CLAUDE.md §1).

### B-1 · Comparación de firma no constante
**Archivo:** `docs/platform/relay/worker.next.js:37`
```js
if (("sha256=" + expected) !== signature) {
```
**Problema:** `!==` sobre strings puede filtrar tiempo. Por red es casi impracticable, pero es la práctica estándar evitarlo.
**Arreglo:** usar `crypto.subtle.verify("HMAC", key, firmaBytes, body)` en vez de firmar y comparar texto. **Esfuerzo:** pequeño. Se puede hacer junto con M-1.

### B-2 · Sin protección contra repetición en el relay
**Archivo:** `docs/platform/relay/worker.next.js:36-58`
**Problema:** un payload firmado válido, si alguien lo capturara, podría repetirse para disparar builds (cuota de builds de Pages). Requiere interceptar tráfico TLS de Notion: riesgo muy bajo.
**Arreglo:** guardar en KV el `id` del evento con TTL corto y descartar duplicados, o rechazar eventos con `timestamp` viejo. **Esfuerzo:** pequeño. Solo si se decide endurecer el relay.

### B-3 · Links protocol-relative pasan el filtro de markdown
**Archivo:** `src/utils/markdown.ts:28`
```ts
SAFE_LINK_SCHEME.test(url) || url.startsWith("/") || url.startsWith("#")
```
**Problema:** `//evil.com` empieza con `/` y se renderiza como link externo con apariencia de interno. Solo quien edita Notion puede escribirlo.
**Arreglo:** `(url.startsWith("/") && !url.startsWith("//"))`. **Esfuerzo:** 1 línea + test.

### B-4 · Cache de imágenes: extensión y hosts demasiado abiertos
**Archivo:** `src/services/notionImageCache.ts:41` y `:95`
```ts
const ALLOWED_IMAGE_HOST_SUFFIXES = [".amazonaws.com", ".notion-static.com", ".notion.so"];
let extension = EXTENSION_BY_CONTENT_TYPE[contentType] ?? extensionFromUrl(url) ?? "jpg";
```
**Problema:** la extensión de respaldo sale de la URL y puede ser `html` o `js`, y el archivo se sirve desde el mismo origen. Un SVG con script abierto directo también ejecutaría (la CSP permite `'unsafe-inline'`). `.amazonaws.com` acepta cualquier bucket S3. Solo explotable si el contenido de Notion está comprometido.
**Arreglo:** allowlist de extensiones (`jpg|jpeg|png|webp|gif|svg`; lo demás se descarta) y acotar el sufijo S3 a los buckets de Notion. **Esfuerzo:** pequeño.

### B-5 · iframes de video sin `referrerpolicy` ni `sandbox`
**Archivo:** `src/components/case/CaseArticle.astro:152`
**Problema:** el `src` ya está limitado a YouTube/Drive (código y CSP); falta solo endurecimiento.
**Arreglo:** `referrerpolicy="strict-origin-when-cross-origin"` y `sandbox="allow-scripts allow-same-origin allow-presentation"` (probar que YouTube y Drive sigan reproduciendo). **Esfuerzo:** 1 línea + QA visual.

### B-6 · Turnstile no valida `hostname`
**Archivo:** `functions/_lib/handleContact.ts:42-43`
**Problema:** solo se revisa `success`. La sitekey ya está restringida a los hostnames configurados, así que el riesgo es mínimo.
**Arreglo:** comprobar también `data.hostname` contra `diegomaury.mx`, el dominio de Pages y `localhost`. **Esfuerzo:** pequeño + test.

### Info (sin acción necesaria salvo decisión)

- **I-1** `script-src 'unsafe-inline'` anula la CSP ante un XSS futuro. Hoy no hay sink. Quitarlo exige hashes por script en el build (esfuerzo medio). Decisión documentada en `_headers`.
- **I-2** `img-src https:` permite imágenes de cualquier origen (pixel tracking si se inyectara un `<img>`).
- **I-3** CSP sin `form-action 'self'` ni `upgrade-insecure-requests`. Agregarlos es barato.
- **I-4** Sin `Cross-Origin-Opener-Policy: same-origin`. Barato de agregar; probar que Turnstile y los embeds sigan funcionando.
- **I-5** `Access-Control-Allow-Origin: *` en HTML: valor por defecto de Pages para un sitio público estático, sin impacto.
- **I-6** SSL de la zona en `full` (no `strict`). Para Pages el origen es Cloudflare mismo; cambiar a `strict` es inocuo y recomendable.
- **I-7** DNS con restos aparentes: `asuid` (verificación de Azure), `MS=ms...` y `selector1/selector2._domainkey` (Microsoft 365), y `zmail2026._domainkey._domainkey` (selector de Zoho duplicado por error de nombre). Si Azure y Microsoft 365 ya no se usan, borrarlos reduce superficie. No tocar MX, SPF ni DMARC (Zoho).

## Estado de remediación (2026-11-25, misma sesión)

| ID | Estado | Detalle |
|---|---|---|
| M-1 | Corregido y desplegado | Worker ignora `verification_token` si el secreto existe; límite de 100 KB. Verificado en vivo: el payload sin firma ya no escribe en KV. |
| B-1 | Corregido y desplegado | `crypto.subtle.verify` en vez de `!==`. Harness local: 9/9 casos. |
| B-2 | Pendiente (tarea Notion) | Requiere decidir ventana de repetición sin romper los reintentos de Notion. |
| B-3 | Corregido | `//host` ya no se renderiza como link. Test agregado. |
| B-4 | Corregido parcial | Allowlist de extensiones de imagen. Acotar `.amazonaws.com` a buckets de Notion queda como tarea (requiere confirmar hosts reales). |
| B-5 | Corregido parcial | `referrerpolicy` agregado. `sandbox` queda como tarea (requiere QA de reproducción). |
| B-6 | Corregido | Turnstile valida `hostname`. Tests agregados. |
| I-1, I-2 | Pendiente (tarea Notion) | Decisión de arquitectura de CSP. |
| I-3 | Corregido | `form-action 'self'` y `upgrade-insecure-requests`. |
| I-4 | Corregido | `Cross-Origin-Opener-Policy: same-origin`. |
| I-6 | Revertido, sin cambio | `strict` rompió `go.diegomaury.mx` (Short.io sin certificado de origen, error 526 ~1 min). Zona de vuelta en `full`. |
| I-7 | Corregido | Borrados `selector1`/`selector2._domainkey` (Microsoft 365), `asuid` (Azure), `MS=ms80091617` y el duplicado `zmail2026._domainkey._domainkey`. Zoho MX/SPF/DMARC/DKIM intactos. |

Hallazgo nuevo durante la remediación: `astro check` reporta 1 error previo (`@ts-expect-error` sin uso en `src/content.config.ts:271`), presente en `HEAD` antes de estos cambios.

## Prioridad sugerida

1. M-1 + B-1 juntos (un solo re-deploy del Worker).
2. B-3, B-4, B-6 (código del sitio, con tests).
3. I-3, I-6 y limpieza DNS de I-7 (tras confirmar con Diego qué servicios siguen activos).
4. B-5, I-4 (requieren QA visual).
5. B-2, I-1: solo con decisión explícita.
