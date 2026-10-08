# Rediseño de la sección de contacto (S8 · Siguiente paso)

Fecha: 2026-10-08
Estado: diseño aprobado por Diego, pendiente de revisión del spec y plan de implementación.

## 1 · Problema

La sección S8 de la home (`/#s8-siguiente-paso`) solo ofrece botones de acción resueltos por etiqueta (`ctaTarget()`). No muestra ningún canal directo de contacto. El correo `dm@diegomaury.mx` y LinkedIn existen en `src/config/site.ts`, pero solo aparecen en el footer.

## 2 · Objetivo y criterio de éxito

Que quien llegue al final de la página pueda contactar a Diego por el canal que prefiera, sin salir de la sección para buscarlo.

Criterios de éxito:

1. La sección muestra, sin scroll adicional dentro de ella: Agendar (Notion Calendar), formulario, correo visible con botón Copiar, botón de WhatsApp y enlace a LinkedIn.
2. Un mensaje enviado desde el formulario llega a `dm@diegomaury.mx` con `Reply-To` igual al correo del visitante.
3. El número de WhatsApp no se muestra como texto en pantalla.
4. Ninguna parte de la sección promete un tiempo de respuesta.
5. Funciona en ES y en `/en`, a 1440px y 390px, con teclado y con `prefers-reduced-motion`.

## 3 · Decisiones cerradas

| Decisión | Resultado |
|---|---|
| Canales | Correo visible, LinkedIn, WhatsApp (solo botón), formulario en el sitio |
| Layout | Opción A: dos columnas. Izquierda: label, titular, intro y canales directos. Derecha: panel con Agendar y formulario |
| CTA primario | Agendar, hacia `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`, leído de `site.links.scheduling` |
| Pasos 01 a 03 | Se eliminan de la sección (Diego los tachó en el mockup) |
| Iconos | SVG de línea en `--t2`, nunca Ember (regla D-A), `aria-hidden` |
| Destino del formulario | Correo, vía Pages Function y REST API de Cloudflare Email Service |
| Hosting del endpoint | Pages Function en este repo, no Worker aparte |
| Tiempo de respuesta | No se promete. Fuera de la sección y del copy nuevo |

Mockup aprobado: `.superpowers/brainstorm/1097-1791450723/content/contacto-opcion-a-v3.html` (local, no versionado).

## 4 · Diseño visual

Respeta el design system V2 "Ember on Ink":

- `--radius: 0` (únicas excepciones: pills y círculos funcionales).
- Ember solo en el label de sección y en el CTA primario. El botón "Enviar mensaje" usa `btn-ghost` para que haya un solo CTA Ember.
- Texto sobre Ember siempre `var(--bg)`.
- Sin gradientes, sombras ni glow.
- Piso tipográfico: labels y botones mono mínimo 12px, texto de lectura mínimo 15px.
- `:focus-visible` con `outline: 2px solid var(--ember); outline-offset: 2px`.
- Reutilizar `.btn-primary` y `.btn-ghost` de `globals.css`. No crear clases de botón nuevas.
- Titulares de más de 48px con peso 300, el resto máximo 700. Pesos permitidos: 300, 400, 500, 700.

### Columna izquierda

- Label, titular e intro: siguen viniendo del bloque S8 de "Copy Oficial · diegomaury.mx (SSOT)" en Notion, sin cambios al contrato.
- Bloque "Escríbeme directo" con tres filas, cada una con icono en recuadro de 44px, etiqueta mono y acción:
  - Correo: `dm@diegomaury.mx` visible, botón Copiar y `mailto`.
  - WhatsApp: botón que abre `wa.me` con mensaje prellenado. El número va solo dentro del enlace.
  - LinkedIn: enlace al perfil.
- La línea de confianza (`finalTrustLine`) se conserva si existe en Notion. Su contenido lo controla Diego en Notion.

### Columna derecha (panel)

- Panel con borde `--border` y fondo `--bg-2`.
- Arriba: botón primario "Agendar una llamada" con icono de calendario.
- Separador "¿Prefieres escribir?".
- Formulario: nombre, correo, mensaje, campo honeypot oculto y widget Turnstile. Botón "Enviar mensaje" (`btn-ghost`, icono de envío).

### Móvil (390px)

Una columna con este orden: label, titular e intro, panel (agendar y formulario), canales directos.

### Estados del formulario

- Enviando: botón deshabilitado y texto cambiado.
- Enviado: el formulario se reemplaza por una confirmación (`role="status"`). Sin promesa de tiempo.
- Error: mensaje claro con el correo directo como salida alternativa. Se conserva lo que el visitante escribió.
- Errores de campo asociados con `aria-describedby`.

## 5 · Backend

### `functions/api/contact.ts`

Pages Function, responde en `diegomaury.mx/api/contact`, mismo origen que el sitio.

Flujo:

1. Rechazar cualquier método distinto de POST.
2. Parsear el cuerpo y validar con `validateContact`.
3. Si el honeypot viene lleno, responder éxito falso sin enviar nada.
4. Verificar el token de Turnstile contra la API de Cloudflare con `TURNSTILE_SECRET`.
5. Enviar el correo con la REST API de Cloudflare Email Service (`POST /accounts/{id}/email/sending/send`): remitente `contacto@diegomaury.mx`, destino `dm@diegomaury.mx`, `Reply-To` con el correo del visitante. Se usa REST y no un binding `send_email` porque la documentación no confirma ese binding en Pages Functions y un `wrangler.jsonc` en Pages pasa a ser fuente de verdad de toda la configuración del proyecto.
6. Responder JSON con estado de éxito o error.

### `functions/_lib/validateContact.ts`

Función pura y testeable:

- Nombre: 1 a 100 caracteres.
- Correo: formato válido.
- Mensaje: 10 a 2000 caracteres.
- Contenido escapado antes de componer el correo.
- Mensajes de error genéricos hacia el cliente. El detalle se registra del lado servidor.

### Requisitos de configuración

- Dominio `diegomaury.mx` incorporado a Email Sending (Email Service) con remitente `contacto@diegomaury.mx`.
- Secret `CF_EMAIL_API_TOKEN` (permiso Email Sending: Edit), secret `TURNSTILE_SECRET` y variable `CF_ACCOUNT_ID`, configurados por separado en `preview` y `production`.
- Sin `wrangler.*` en el repo.

## 6 · Frontend: piezas y archivos

| Archivo | Acción | Notas |
|---|---|---|
| `src/components/.../ContactSection.astro` | Nuevo | Extrae S8 de `index.astro`. Lo usan home ES y `en/index.astro`. Ubicación exacta según la convención de componentes existente. |
| `src/scripts/contactForm.ts` | Nuevo | Script bundleado (no `is:inline`). Envío, estados, botón Copiar, evento `dataLayer`. |
| `src/styles/contact.css` | Nuevo | Incluye `[hidden]{display:none!important}` y `:focus-visible`. |
| `src/pages/index.astro` | Editar | Usar `ContactSection`. Quitar parseo y render de `finalSteps`. |
| `src/pages/en/index.astro` | Editar | Usar `ContactSection` con strings traducidas a nivel de hoja tras el parseo ES. |
| `src/i18n/contact.ts` | Nuevo | Textos fijos ES y EN de la sección (reemplaza el uso de `uiEn`). |
| `src/config/site.ts` | Editar | Enlace de WhatsApp con mensaje prellenado. |
| `public/_headers` | Editar | `challenges.cloudflare.com` en `script-src` y `frame-src`, sin aflojar nada más. |
| `functions/api/contact.ts` | Nuevo | Ver sección 5. |
| `functions/_lib/validateContact.ts` | Nuevo | Ver sección 5. |

Notas:

- Turnstile se carga solo cuando el visitante enfoca el formulario o este entra al viewport, para no penalizar el LCP ni el presupuesto de JS.
- `src/pages/en/index.astro` no puede traducir el markdown crudo de la home: el parser depende de matches literales en español. Se traduce por hoja después del parseo.
- Se retira el CSS de `.cta-steps` que quede sin consumidor.
- La sección conserva el id `s8-siguiente-paso` (`SECTION_IDS.S8`), porque el nav "Contacto" apunta ahí.
- Medición: al enviar con éxito se empuja un evento al `dataLayer` (`contact_form_submit`) con `cta_location`. Dar de alta el Key Event en GA4 lo hace Diego.

## 7 · Pruebas y verificación

### Automáticas

- Tests unitarios de `validateContact`: nombre vacío o largo, correo mal formado, mensaje corto o largo, honeypot lleno, HTML en el contenido. Cobertura mínima del 80% en esa pieza.
- Tests de `contact.ts` con Turnstile y envío simulados: método no POST, token inválido, éxito, fallo de la llamada a Email Service.
- `npm test` completo (incluida la guardia de deriva de tokens) y `astro check` en verde antes de commitear.
- `npm run test:a11y:astro` sobre home ES y EN.

### Manuales y visuales (obligatorias)

- Chrome real a 1440px y 390px, o Playwright con `devices['Pixel 5']` si Claude-in-Chrome no está disponible. Si ninguno funciona se declara bloqueado, nunca se sustituye por un HTTP 200.
- Patrones conocidos a revisar: navbar `fixed` tapando contenido, `[hidden]` en formulario y confirmación, desborde horizontal en móvil.
- Estados a capturar, en ES y `/en`: vacío, con foco, con error, enviando, enviado.
- Barrido de anchos de 320 a 1440.
- Navegación por teclado: orden de tabulación, errores asociados a su campo, confirmación anunciada.

### Envío real

1. Probar en preview con el secret de preview: el mensaje llega con `Reply-To` correcto.
2. Probar fallos: honeypot lleno (no debe llegar nada), campo inválido, token vencido.
3. Pasar a producción y repetir un envío real.
4. Confirmar el despliegue con la API de Cloudflare Pages (`stages[].status` y `commit_hash`).

### Entorno local

- `astro dev` no ejecuta Pages Functions. Para probar el envío: `astro build` y luego `wrangler pages dev dist`, con Turnstile en modo de prueba.
- Confirmar que el log de build termine en `[build] Complete!`. Si DeepL no responde, QA local con `DEEPL_API_KEY=""` (nunca para un build que se despliega).

## 8 · Entrega y registro

- Orden: commit con tests en verde, push a `master`, verificación en preview y producción.
- Registro en Notion en este orden: Inbox, Changelog y tarea. Es un solo cambio lógico, una sola entrada.
- `CLAUDE.md`: solo invariantes nuevas (existencia y CSP de la Pages Function de contacto, y que S8 ya no tiene pasos). Sin historial.
- Documentar en `docs/platform/` el contrato del endpoint si el implementador lo considera necesario.

## 9 · Fuera de alcance

- Respuesta automática al visitante.
- Base de contactos en Notion.
- Cualquier promesa o compromiso de tiempo de respuesta.
- Cambios al CTA de la navbar o a otras páginas.
- Versión EN de páginas que hoy no la tienen.

## 10 · Datos requeridos al implementar

- Número de WhatsApp (entra solo dentro del enlace `wa.me`, nunca como texto visible) y texto del mensaje prellenado.
- Habilitar Email Sending para `diegomaury.mx` y crear el token con permiso Email Sending: Edit.
- Creación del sitio de Turnstile y carga de sus claves como secrets en preview y production.
- Decisión sobre las fichas `###` de los pasos en el bloque S8 de Notion: pueden quedarse (el código las ignora) o borrarse.

## 11 · Riesgos

- El envío real solo es verificable en el entorno desplegado. Los secrets de `preview` y `production` pueden divergir: un fallo solo en preview es del entorno, no del código.
- Turnstile en la CSP: cualquier error de `script-src` o `frame-src` rompe el widget en silencio. Verificar con la consola del navegador tras el despliegue.
- Si la cuenta no tiene derecho a Email Sending (error `10105 not_entitled`) o el remitente es rechazado, el formulario falla al enviar. El mensaje de error debe dejar visible el correo directo como salida.
