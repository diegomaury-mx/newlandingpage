# Clarity: análisis de grabaciones y bloqueo por CSP

**Fecha:** 2026-10-19
**Fuente:** export de Clarity `Clarity_Diego_Maury_6_Recordings_10-19-2026 15 46.csv` (proyecto `x7ns7c22xi`, intervalo 2026-09-20 a 2026-10-19), cruzado con GA4 (propiedad `541704937`) y verificado en Chrome real contra `https://diegomaury.mx/`.

## 1 · Resumen

- Clarity registró **6 sesiones en 30 días**. Para un periodo casi igual (2026-09-19 a 2026-10-18), GA4 reporta **322 sesiones en producción** (`diegomaury.mx` + `www`). Clarity capturó aprox. el **2%** del tráfico.
- De esas 6, **4 son casi seguro bots** y **2 parecen humanas**. Ninguna tiene clics. Con esta muestra no se puede sacar ninguna conclusión de UX.
- **Causa confirmada del subregistro:** la CSP de `public/_headers` bloquea `https://scripts.clarity.ms`, el host desde donde el tag de Clarity carga su script principal. Clarity se queda en el stub y nunca envía datos.
- **Hallazgo secundario:** Clarity se carga dos veces, una por `public/js/clarity.js` y otra desde GTM (`?ref=gtm`).

## 2 · Las 6 grabaciones

| # | Fecha | Hora | Duración | Página (entrada = salida) | SO | País | Págs. | Clics | Lectura |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 10/09 | 02:32 | 0:14 | `/en/` | Linux | EE. UU. | 1 | 0 | Bot (par con #2) |
| 2 | 10/09 | 02:32 | 0:15 | `/` | Linux | EE. UU. | 1 | 0 | Bot (par con #1) |
| 3 | 09/28 | 19:43 | 11:54 | `/eventos/` | Windows | México | 2 | 0 | Humana probable |
| 4 | 09/27 | 01:37 | 0:22 | `www.diegomaury.mx/` | Windows | España | 1 | 0 | Humana posible, rebote |
| 5 | 09/22 | 05:23 | 0:12 | `/en/` | Linux | EE. UU. | 1 | 0 | Bot (par con #6) |
| 6 | 09/22 | 05:23 | 0:12 | `/` | Linux | EE. UU. | 1 | 0 | Bot (par con #5) |

Todas son Chrome en PC, sin referente y sin clics.

### Patrón de bot (#1, #2, #5, #6)

En dos fechas distintas aparece el mismo par de sesiones: Chrome sobre Linux desde EE. UU., `/` y `/en/` abiertas en el mismo minuto, 12 a 15 s cada una, una sola página y cero clics. Cada sesión trae un ID de usuario distinto, señal de un crawler sin estado (monitor de uptime, preview de enlace o rastreador de SEO o de IA) que visita la versión ES y la EN en paralelo. No es tráfico humano.

### Sesiones humanas (#3, #4)

- **#3 (México, `/eventos/`, 11:54, 2 páginas):** es la única sesión con permanencia real, y llega a `/eventos/`, la segunda página más vista según GA4. Sin clics y con entrada igual a salida, puede ser una pestaña que quedó abierta o una lectura con scroll. Vale la pena ver la grabación para saber cuál de las dos.
- **#4 (España, `www`, 0:22):** rebote corto en la home. Además confirma que `www.diegomaury.mx` sigue recibiendo visitas (GA4 cuenta 5 sesiones en `www` en el mismo periodo).

## 3 · Causa raíz: la CSP bloquea el script principal de Clarity

Cadena de carga real (verificada con `curl` sobre el tag y en Chrome):

1. `BaseLayout.astro` inyecta `/js/clarity.js`, que carga `https://www.clarity.ms/tag/x7ns7c22xi`. Este host **sí** está permitido en `script-src`.
2. El tag carga `https://scripts.clarity.ms/0.8.75-beta/clarity.js`. Este host **no** está en `script-src`.
3. El envío de datos va a `https://o.clarity.ms/collect` y `https://c.clarity.ms/c.gif`. Ambos están cubiertos por `connect-src https://*.clarity.ms` e `img-src https:`, pero nunca llegan a ejecutarse porque el paso 2 falla.

CSP vigente (`public/_headers`, línea 8; también la que sirve producción hoy):

```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://challenges.cloudflare.com
```

Evidencia en Chrome real sobre `https://diegomaury.mx/`:

- El recurso `scripts.clarity.ms/.../clarity.js` termina con `responseStatus: 0` y `transferSize: 0`.
- `window.clarity.q` sigue existiendo después de 8 s y de hacer scroll: Clarity nunca pasó del stub.
- Cero peticiones a `clarity.ms/collect` o `c.gif`.
- Una sonda que inyecta ese mismo script dispara `securitypolicyviolation` con `violatedDirective: "script-src-elem"` y `blockedURI: https://scripts.clarity.ms/...`.

El problema existe desde la reinstalación de Clarity (commit `cbcd518`, 2026-09-16): ese commit agregó `www.clarity.ms` a `script-src` pero no `scripts.clarity.ms`.

**Pendiente de explicar:** cómo se registraron las 6 sesiones si la CSP bloquea el script. No lo pude determinar con la evidencia disponible. Puede ser que algunos clientes no apliquen la CSP, o que haya habido una ventana con otra CSP u otra ruta de carga. Esto no cambia la conclusión: el navegador estándar no graba.

## 4 · Hallazgo secundario: Clarity se carga dos veces

En la misma página aparecen `https://www.clarity.ms/tag/x7ns7c22xi` (desde `clarity.js`) y `https://www.clarity.ms/tag/x7ns7c22xi?ref=gtm` (desde un tag de Clarity en el contenedor GTM-NHT5827J). Hoy no hace daño visible porque ninguno de los dos llega a ejecutarse, pero al corregir la CSP habría dos inicializaciones del mismo proyecto. Hay que dejar una sola fuente. Lo recomendado es conservar `clarity.js` en el repo, que es la que documenta CLAUDE.md §1, y pausar el tag de Clarity en GTM.

## 5 · Recomendaciones

1. **Corregir la CSP** (`public/_headers`): agregar `https://scripts.clarity.ms` a `script-src`. Es un cambio de una línea. Después del deploy, verificar en Chrome real que `window.clarity.q` desaparece y que salen peticiones a `o.clarity.ms/collect`.
2. **Eliminar la doble carga:** pausar o borrar el tag de Clarity en GTM. Es una acción de Diego en la UI de GTM.
3. **Excluir bots en Clarity:** en Settings, revisar que la exclusión de bots esté activa. Considerar un filtro de segmento para Linux + EE. UU. + 0 clics si el patrón sigue.
4. **Esperar 1 a 2 semanas de datos** después del fix antes de sacar conclusiones de UX. Con 2 sesiones humanas no hay base para heatmaps ni para hallazgos de comportamiento.
5. **Ver la grabación #3** (`/eventos/`, 11:54) para distinguir lectura real de pestaña inactiva:
   `https://clarity.microsoft.com/player/x7ns7c22xi/13nhldj/hfjodq/?ss=1790646195000&sd=714`

## 6 · Lo que este export NO permite concluir

- Nada sobre fricción, rage clicks, scroll depth o conversión: ninguna sesión tiene clics.
- Nada sobre mobile: las 6 sesiones son de PC.
- Nada sobre tráfico por canal: ninguna sesión trae referente.
- Tampoco dice si el export venía filtrado. El archivo dice "Total de sesiones: 6", lo que coincide con la causa técnica de arriba, pero conviene confirmarlo en el dashboard de Clarity sin filtros.
