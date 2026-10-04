# Incident log — newlandingpage

Historial de incidentes ya resueltos, migraciones cerradas y gotchas puntuales cuya causa raíz ya se corrigió. Extraído de `CLAUDE.md` el 2026-09-27 para que ese archivo se quede solo con invariantes vigentes (ver su cabecera). Nada aquí cambia el comportamiento esperado hoy — es contexto de "por qué las cosas son como son", no reglas activas. Fechas y commits preservados para trazabilidad.

## §1 · Deploy y Cloudflare Pages

**Gotcha inverso de estado de deploy (detectado 2026-08-20):** el endpoint `GET .../deployments/{id}` también puede reportar `latest_stage.status: "active"` sostenido por 10-15+ minutos aunque el build real ya haya terminado en <2 min — revisar los timestamps `stages[].started_on`/`ended_on`, no solo el campo `status`, antes de escalar un deploy como trabado. Crónica del corte: memoria `[[cloudflare-pages-corte-final-2026-08-02]]`.

**Gotcha de entornos preview vs. production (detectado 2026-08-21):** el check "Cloudflare Pages" de un PR (deploy al entorno `preview`) puede fallar con `API token is invalid` (Notion) aunque el entorno `production` tenga un `NOTION_TOKEN` sano y build correctamente en paralelo — los secrets de Cloudflare Pages se configuran por separado para `preview`/`production` (`GET .../pages/projects/newlandingpage` → `deployment_configs.preview`/`.production`, ambos redactados en la respuesta pero potencialmente con valores distintos) y el de `preview` puede estar vacío/desactualizado sin que nadie lo haya tocado a propósito. Antes de bloquear un merge por un check de PR en rojo, verificar si `master` está desplegando bien en ese momento (`GET .../deployments?env=production`, mismo commit del HEAD anterior) — si production está sano, el fallo es del entorno preview, no del código del PR, y el merge es seguro.

**Gotcha de tipos de evento de webhook (detectado 2026-08-13, corregido):** los tipos de evento que Notion emite por webhook dependen de la versión de API configurada en la integración (no de un header por-request) — con una versión vieja, cambios en propiedades tipo archivo (reemplazar una imagen) no disparaban ningún evento, así que el auto-publish se quedaba "colgado" en silencio ante ese tipo de edición sin que nada estuviera roto en el Worker. Fijo en `2026-03-11` con todos los eventos habilitados. Detalle: memoria `[[notion-webhook-api-version-fix-2026-08-13]]`.

**Gotcha de deploy hooks duplicados (detectado y corregido 2026-08-13):** el proyecto de Cloudflare Pages tenía DOS deploy hooks creados ("Diego CMS" del 31-jul, huérfano, y "notion-cms-rebuild" del 13-ago) — el Worker solo llama a `env.DEPLOY_HOOK_URL` una vez por request (confirmado leyendo el código fuente del Worker, no hay loop ni doble llamada), así que el segundo hook no causaba builds duplicados por sí mismo. El secret `DEPLOY_HOOK_URL` se re-apuntó explícitamente a "notion-cms-rebuild" para eliminar la ambigüedad. Las ráfagas de 3-4 builds casi simultáneos que sí se observaron ese día vienen de que Notion manda un evento de webhook independiente por cada propiedad/bloque que cambia en una sola edición — no es un bug, es el volumen esperado de eventos habilitados.

**Incidente de producción — `ai_block` (2026-08-13):** un bloque nativo `ai_block` de Notion ("Ask AI") en el body de una ficha del SSOT de casos rompió TODOS los rebuilds con `Block type ai_block is not supported via the API for your bot type`, mientras Diego redactaba las 14 fichas CAR con esa herramienta (~40 deploys fallidos hasta convertir los bloques a texto). (El riesgo sigue vigente hoy — ver la regla activa correspondiente en CLAUDE.md §1.)

**Toggles de Cloudflare apagados en la optimización de rendimiento (2026-09-01, zona `diegomaury.mx` = `a2efd6b0f25ab483841d0968b5a0d64d`):** (1) **Web Analytics / RUM** (`site_tag 7de9b348…`, `auto_install:false` vía `PUT /accounts/{acc}/rum/site_info/{tag}`) — el beacon `static.cloudflareinsights.com` estaba bloqueado por la CSP propia (0 datos, error de consola) y es redundante con GA4. (2) **Bot Fight Mode** (`bot_management.fight_mode:false`). (3) **JavaScript Detections** (`bot_management.enable_js:false`) — inyectaba `/cdn-cgi/challenge-platform/scripts/jsd/main.js` (+3 APIs deprecadas, Best Practices subió de 73 a 92 al apagar los tres). `fight_mode` y `enable_js` son toggles independientes. Email Obfuscation se deja `on`. Los tres son reversibles poniendo el valor a `true` por la misma API. Detalle: `CHANGELOG-AUDIT.md` § Paso 0.

**Limpieza de HTML muerto (2026-08-13):** se eliminaron del repo `index.html`, `404.html`, `politicas-privacidad.html`, `terminos-y-condiciones.html`, `prototipo-portafolio.html`, `portfolio/index.html`, `portfolio/sofi.html` y `version2/` (raíz) — ninguno tenía copia en `public/` ni estaba enlazado desde ningún redirect o página Astro real, así que `astro build` nunca los incluyó en `dist/`. Los reemplazos reales viven en `src/pages/index.astro`, `politicas-privacidad.astro`, `terminos-y-condiciones.astro`, `portfolio.astro` y `portfolio/[slug].astro`.

**`politicas-privacidad.html`/`terminos-y-condiciones.html` migradas (2026-08-03):** dejaron de vivir en `public/`; son ahora `.astro` con `BaseLayout` real; `public/_redirects` hace el 301 de la URL `.html` vieja a la nueva sin extensión.

## §1 · Astro, Zod, eventos

**Historial de versión de Astro:** bump de `^5.18.2` a `^7.2.4` el 2026-08-20 (CVEs de astro/esbuild); `npm audit fix` del 2026-09-10 lo dejó en 7.3.2 y sharp en 0.35.4 dentro del rango, `npm audit` = 0.

**Migración de `content.config.ts`:** movido desde `src/content/config.ts` porque Astro v6 eliminó el "legacy content config" en esa ubicación.

**`npx astro check` en 0 errores (2026-09-10):** antes 21 errores, casi todos por el problema de doble instancia de Zod (ver regla activa en CLAUDE.md §1). No hay gate de CI que lo mantenga así.

**`TECHNICAL_DEBT.md` borrado (2026-08-19):** todos sus ~50 ítems ya estaban resueltos en el sprint 2026-08-20/21.

## §1 · CMS Imágenes (imageSlots)

**Alta y gotchas del CMS Imágenes:** detalle completo en memoria `[[cms-imagenes-imageslots-2026-07-25]]`.

**Incidente de URLs S3 firmadas (causa raíz corregida, 2026-08-03):** las imágenes de Notion (`imageSlots.imageUrl`, `cases.banner`/`logo`) rompían en producción entre un build y la siguiente visita porque se guardaba la URL cruda de la API (firma S3 que expira en ~1h). Detalle: memoria `[[notion-image-cache-2026-08-03]]`.

**Recompresión de imágenes (2026-08-12):** `notionImageCache.ts` bajó el cache completo de Notion de ~38MB a ~4.4MB, causa raíz de que el LCP de producción fuera de 15.6s antes del fix.

**Cinturón de logos del Hero — bug de doble fuente de verdad (detectado y corregido 2026-08-14):** antes existía un `LOGO_MAP` fijo dependiente de una línea de texto "Logos sugeridos" en Notion S1 — esa doble fuente de verdad causó que 14 logos nuevos con fila lista en CMS Imágenes nunca aparecieran en LIVE porque nadie actualizó también el copy. Reemplazado por el mecanismo dinámico vigente (ver regla activa).

## §1 · Rediseño narrativo de /portfolio (2026-08-16)

Spec completo: `docs/superpowers/specs/2026-08-16-portfolio-rediseno-narrativo-design.md`. El listado dejó de mostrar evidencia (✔/✖); los 4 casos Insignia perdieron el concepto de "featured" a favor del campo Notion "Orden Insignia"; se agregó franja "Por los números" y CTA de cierre (commit `1ea801a`); se retiró la sección Archivo (bloque `P4` de Copy Oficial quedó inerte, se puede borrar en Notion sin efecto).

## §1 · Sitemap, build, casos publicados

**Gotcha de sitemap (detectado y corregido 2026-08-10):** `@astrojs/sitemap` genera `dist/sitemap-index.xml`, nunca `sitemap.xml` — `public/robots.txt` apuntaba mal (404 real en producción) y se corrigió.

**Fusión de ideaLab (2026-08-13):** ideaLab by HackSureste se fusionó dentro de HackSureste (Capa=Archivo en Notion; no aportaba dato propio como ficha independiente). Redirect 301 permanente: `/portfolio/idealab-by-hacksureste` → `/portfolio/hacksureste/`.

**Reemplazo del Capability Showcase Grid (2026-09-01):** reemplazó la galería `.support-grid` (2026-08-14) y su fila tabular original. Detalle: memoria `[[seccion-soporte-capability-showcase-grid-2026-09-01]]`.

**`llms.txt`/`llms-full.txt` pasaron a estáticos (2026-09-21):** decisión explícita de Diego, revierte el `src/pages/llms.txt.ts` dinámico que los generaba desde la colección `cases` + agenda de eventos.

**Conteo de casos al 2026-08-13:** 14 fichas publicadas (HEINEKEN Green Challenge, REDUX, SOFI, HackSureste, BTEM, INCmty B-Challenge, INCmty DisruptAir Challenge 2022, HackSureste Ciudad del Carmen 2019, G20 YEA Model, INC Prototype, FreeLand, Haz que pase - Substack, INCmty Accelerator, BRAiN México). Insignia: HEINEKEN Green Challenge, REDUX, SOFI, HackSureste; el resto Soporte. Conteo exacto siempre vigente vía SQL sobre `collection://88257bc9-e575-45e8-90df-f851f96e92f2` — no hardcodear en futuras revisiones.

## §1 · Bilingüe ES/EN — incidentes de DeepL

**Incidente de cuota DeepL agotada (2026-08-17, causa raíz corregida):** el cache de `deeplTranslationCache.ts` vivía gitignored en `public/cms-media/notion/translations/` — pero Cloudflare Pages clona el repo limpio en cada build, así que el cache NO persistía entre deploys: cada push que tocara contenido `/en/*` volvía a traducir el sitio COMPLETO desde cero (29 cuerpos de caso + home + portfolio, ~300+ llamadas a DeepL). Una sola tarde de pruebas agotó la cuota mensual gratuita de DeepL (500,000 caracteres) por completo, confirmado con `GET https://api-free.deepl.com/v2/usage` → `500000/500000`.

**Fix aplicado:** `public/cms-media/notion/translations/*.txt` ahora SÍ se versiona en git (regla activa, ver CLAUDE.md §1) — el cache sobrevive entre deploys.

**Actualización 2026-08-20 (commit `d4ba4d3`):** la excepción de gitignore se extendió a TODO `public/cms-media/notion/`, no solo `translations/` (banners/logos/evidencia recomprimidos también se versionan). Verificado 2026-08-21: un `astro build` local puede dejar archivos `.webp`/`.gif` nuevos ahí como `??` en `git status` — decidir con Diego si se commitean o descartan antes de cerrar una sesión que corrió un build local.

**Gotcha de la API de DeepL (incidente 2026-08-17, corregido):** el request a DeepL nunca debe llevar `tag_handling: "xml"` — el texto es prosa/markdown plano, no XML válido, y ese parámetro le pide a DeepL parsearlo como XML: cualquier `<`, `>` o `&` suelto devolvía HTTP 400 sin reintento posible (se perdió toda la traducción de S6/S6b/S8 del home en el primer build real). `deeplTranslationCache.ts` también reintenta con backoff en HTTP 429 y serializa las llamadas por una cola módulo-level (`DEFAULT_MIN_GAP_MS`) porque el plan Free de DeepL rechaza en ráfaga las ~300 llamadas simultáneas de un build completo.

## §1 · GTM / Clarity / GA4

**Fix de inyección de GTM (2026-09-17):** hasta ese commit, GTM se cargaba con `<script is:inline src="/js/gtm.js">` dentro de `<body>` (archivo local, sin snippet oficial ni `<noscript>`), lo que hacía que herramientas de diagnóstico marcaran el sitio como "Sin etiquetar". Se consolidó a `enableGtm`/`enableClarity` centralizados en `BaseLayout.astro` (11 páginas hoy, ninguna inyecta el script por su cuenta). `public/js/gtm.js` se eliminó.

**Historial de Clarity:** retirado 2026-08-02, reinstalado 2026-09-16 (decisión directa de Diego). Detalle: memoria `[[clarity-reinstalado-2026-09-16]]`. Auditoría inicial GA4 2026-09-10: memoria `[[auditoria-ga4-2026-09-10]]`.

**Gotcha de calidad de datos GA4 (detectado 2026-09-16):** las corridas locales de `test:a11y:astro`/`verify:visual:astro` disparan el GTM igual que producción — sin un filtro de datos en GA4 Admin que excluya `hostName=localhost` y `tagassistant.google.com`, los reportes de tráfico sobreestiman sesiones reales severamente (llegó a ser 68.7% del tráfico de 30 días). El filtro de IP interna activado el 2026-09-10 no cubre estos dos vectores — esto sigue siendo un riesgo activo al leer reportes de GA4, no un incidente cerrado. Detalle: memoria `[[auditoria-trafico-ga4-2026-09-16]]`.

## §4 · Design System

**Auditoría v2.3 y decisiones de arte (2026-09-10):** memoria `[[ds-audit-v2.3-decisiones-arte-2026-09-10]]`.

**Cierre de Fase 3 del DS (2026-09-11):** el proyecto canónico incorporó `ds-adherence-check.mjs` + `_adherence-exceptions.json` (reglas R0–R7). Estado en esa fecha: 0 hallazgos, 1 excepción activa (`--light-accent`). Pendiente para Fase 4 (no implementado a la fecha de este log): el bundle `_ds/` que consumen los Design Components de este proyecto no está cubierto por el chequeo y sigue sirviendo `--accent-secondary` con snapshot anterior a D-V1. Detalle: memoria `[[ds-fase3-adherence-check-cierre-2026-09-11]]`.

**Retiro de fuentes V1 (2026-07-25):** Montserrat/Bitter/Space Mono y `colors_and_type.css` eliminados (cero referencias activas).

**Self-hosting de fuentes (2026-09-01, F-07, commit `42801b5`):** migración desde Google Fonts a `@font-face` self-hosted. `public/assets/fonts/` (Satoshi + JetBrains, V1) se borró.

**Retiro de `data-reveal` del hero (F-01, commit `0ec15d4`):** el hero de `/` y `/en` ya no lleva `data-reveal`; el resto de la página sí lo conserva.

**Retiro del token `--ember-cta`:** el valor `#BF452B` (naranja oscurecido) fue retirado el 2026-09-10.

**Remediación de border-radius (PR 5b, 2026-09-16):** ~40 `border-radius` aplanados a 0 en `events.css`, `globals.css`, `home.css`, `navbar.css`, `portfolio.css`. La escala documentada hasta 2026-09-15 (`{0, 3, 6, 10, 16}px`) nunca existió en el contrato real — era documentación local inventada. `case.css`, `docencia.css` y `legal.css` quedaron fuera de este barrido (no auditados).

**Excepción aprobada de peso tipográfico (2026-08-13):** el `<h1>` del hero de `index.astro` usa peso 500 (excepción a la regla de peso 300 para titulares >48px) — decisión explícita de Diego al revisar el mockup en Claude Design.

**Marquesina de logos del hero — reversión (2026-09-10, decisión directa de Diego 2026-09-16):** el cinturón de logos volvió a ser marquesina animada, revirtiendo la decisión D-D que la había quitado.

**Botón CTA de la navbar conectado (2026-08-13):** el botón `.nav-cta` ya existía en CSS pero nunca se renderizaba porque `<Navbar />` se invocaba sin props; `BaseLayout.astro` ahora pasa `ctaHref`/`ctaLabel`.

**Footer unificado (vigente desde 2026-08-20):** revierte la nota histórica de 2026-07-22 sobre `.footer__*` en `styles.css` (ya eliminado).

## §4 · Copy y voz

**Migración de plantilla de caso a CAR (vigente desde 2026-08-11, código 2026-08-13):** reemplaza el esquema anterior de 8 secciones (Contexto/Problema/Mi rol/Sistema/Trade-offs/Resultados/Evidencia/Aprendizajes). Fuente canónica: "Plantilla v2 · Especificación de caso maestro" en Notion (`b50c60ba-af74-43da-90bc-09d31cf9d4c4`). SOFI es el único caso migrado al formato CAR a la fecha (body reescrito 2026-08-13 desde un mockup que Diego construyó directo en Notion, transcrito verbatim). Las otras 13 fichas siguen con la estructura vieja.

**Testimonios Senja activados (2026-07-31):** vía script inline en `index.astro`.

**Rediseño de S4 "Evidencia" a diagrama radial (vigente desde 2026-08-12):** reemplazó la tabla de capacidades/casos anterior. Plantilla exacta para pegar en Notion: `docs/superpowers/specs/2026-08-12-s4-evidencia-radial-copy-notion.md`. Layout de 2 columnas desde 2026-08-13 (antes apilado en 1 columna).

**Bug crítico corregido (2026-08-14) — campos del diagrama radial encimados:** `.evidence-radial` tenía `container-type: inline-size` pero ningún hijo en flujo normal (SVG, centro y `<li>` de campos son `position:absolute`) — un bloque con size containment y solo hijos absolutos colapsa a `width/height: 0`, así que los 6 campos se renderizaban apilados en el mismo punto. Fix: `width: 100%` explícito en `.evidence-radial` (`src/styles/home.css`).

## §4 · Métricas y evidencia

**Regla aligerada (2026-08-17):** revierte la regla anterior "toda cifra lleva artefacto" — ya no se exige registro/estimación formal en todos los casos, sustituida por la regla activa de 3 grados (ver CLAUDE.md §4).

**Corrección de propiedades vs. cuerpo (detectado 2026-08-03):** la "Nota de consolidación" del 2026-07-11 en REDUX corrigió el cuerpo (200+ → 400+) pero dejó la propiedad `Objetivo...` (fuente de la meta description del sitio) con la cifra vieja — confirma por qué la regla activa exige revisar ambos campos.

**Cifras muertas (histórico, no resucitar):** bolsas $80,000 (B-Challenge) y $120,000 (INC Prototype), "200+ capacitados" REDUX (correcto: 400+ en 2020, Informe Anual Tec), "5 ediciones"/"32 estados" de REDUX y "36 registros" del sureste (línea base real: 35 propuestas, La Jornada Maya).

**3,231 (`heineken-proyectos-evaluados`):** vigente en el SSOT y en `metrics.json` pero sin renderizarse en ningún lugar del sitio desde 2026-08-13 (el `index.html` de raíz que la mostraba se eliminó por muerto, y S4 se rediseñó sin cifras el 2026-08-12).

**Corrección UX/CRO AUD-002 (2026-08-13):** el freeze REM-005 cubre solo a REDUX. HackSureste Ops ya no comparte ese destino desde que su caso se publicó en el CMS (cutover 2026-07-25); ahora enlaza a `/portfolio/hacksureste`.

**Gotcha confirmado (2026-08-21) — `Publicable` como segundo gate:** `Estado publicación = Publicado` no basta por sí solo para que una ficha aparezca en el sitio — el loader calcula `draft = !(Estado publicación === "Publicado" && Publicable === true)`. Causó una confusión real con la ficha "CAVA Soft" (publicada pero sin `Publicable` marcado). Ante "publiqué X y no sale", verificar `Publicable` antes que cualquier otra cosa. (Riesgo activo — puede repetirse con cualquier ficha nueva.)

## §4 · CMS Notion — gotchas de arquitectura

**Corrección UX/CRO AUD-001 (2026-08-13):** cualquier etiqueta con "caso"/"portafolio" en `ctaTarget()` apuntaba al ancla `#s4-evidencia`, destino sin sentido tras el rediseño de S4 a diagrama radial (2026-08-12) — ahora apunta directo a `/portfolio`.

**Gotcha del loader corregido (2026-07-24, no reintroducir):** `fetchBlockChildren` no desciende a `child_page`/`child_database` porque páginas hermanas archivadas de `siteCopy` reusaban los mismos códigos S1-S8 y su copy obsoleto pisaba al vigente. Defensa adicional: ante clave duplicada gana la PRIMERA aparición.

**Gotcha del Notion MCP — Files & media (detectado 2026-08-18, sin fix API disponible):** las propiedades Files & media no se pueden reemplazar vía API (`400 File not found` con `file-upload://`, URLs S3 firmadas expiran en minutos). No hay ruta API para escribir una referencia estable — reemplazar `banner`/`logo`/`Evidencia visual` sigue siendo subida manual de Diego en la UI. Detalle y workaround parcial: memoria global `lessons-learned.md`, entrada 2026-08-18.

## §4 · Caso SOFI

**Incidente de anonimización (2026-08-11, corregido):** el `LOGO_MAP` de `index.astro` tenía una entrada `FlipHouse` con el logo real, renderizándose en el trust bar del home en producción — desanonimizaba el caso SOFI al instante. Se quitó la entrada y se borraron los 4 archivos del logo trackeados en git. El cinturón de logos se reescribió el 2026-08-13 (`LOGO_MAP` fijo → `resolveLogo()`/`slugifyLogoName()` dinámico), y el guardrail vive ahora en `BLOCKED_LOGO_NAMES` (regla activa, ver CLAUDE.md §4).

## §4 · Página /reserva

**Relanzamiento y archivo el mismo día (2026-09-26):** se implementó "Reserva conmigo" (copy Notion `R1`-`R7`, slots CMS Imágenes, embed Substack) y se archivó horas después por generar fricción de conversión frente a ir directo al Calendar. Código conservado en `docs/archive/reserva-page-2026-09-26/` (recuperable).

## §5 · Tooling y QA — incidentes resueltos

**Fix del verificador de métricas (2026-07-24):** `package.json` tiene `"type": "module"`, así que un `.js` con `require()` reventaba con `ReferenceError` antes de validar nada — el gate estuvo muerto en silencio hasta que se detectó. Renombrado a `.cjs`.

**Guardia de deriva de tokens del DS (2026-09-11, ampliada 2026-09-16/17):** `ds-tokens-drift.test.ts` compara por valor literal 9 colores compartidos + `--border-control` (D-B), y solo la familia primaria de `--display/--sans/--mono` contra `variables.css`. **Gotcha del parser del propio test (corregido 2026-09-17):** `parseTokens` debe despojar comentarios `/* ... */` antes de buscar declaraciones `--token: valor;`, o un comentario de prosa que mencione un token puede matchear como si fuera la declaración real.

**D-J (2026-09-16/17):** `--ember-fill`/`--ember-fill-strong` — decisión de qué token usa cada superficie en `case.css` (blockquote vs. subrayado de enlaces). PR canónico: `dm_designsystem` #3 (mergeado a `main`). Commit del sitio: `21754bf`.

**Retiro de la suite QA legacy (2026-08-20, commit `1cf9fc5`):** la suite vieja (`playwright.config.ts` raíz, `tests/qa/{a11y,visual}.spec.ts`) testeaba HTML de la raíz que nunca se sirvió en producción. Su única cobertura real (`public/404.html`) ya estaba duplicada en la suite nueva, así que se eliminó sin perder cobertura.

**Gotcha del `webServer` de Playwright (detectado 2026-09-02):** `astro preview` (Astro 7) se demoniza, así que el `webServer` que spawnea Playwright "muere" y la suite aborta sin correr un test. Workaround vigente: lanzar `astro preview` a mano en background, luego correr el test aparte.

**Gotcha de `astro build` exit 0 engañoso (detectado 2026-09-02):** un timeout del loader de Notion puede abortar el build dejando exit 0 y `dist/` sin regenerar. Verificación activa sigue siendo necesaria (ver regla en CLAUDE.md §5).

**Verificación en navegador real cuando Claude-in-Chrome no está (2026-09-02):** ruta válida es un script de Playwright local (`playwright` 1.61.1), no un chequeo HTTP. Se usó así para verificar CLS del Commit 2 y la a11y del Commit 3.

**Gotcha de `resize_window` de Claude-in-Chrome (2026-09-10):** no reduce el viewport real del documento — no hay device emulation. Workaround para 390px sin Playwright: forzar ancho vía JS y medir con `getBoundingClientRect`.

**Gotcha de panel flotante desbordado (2026-09-21):** el dropdown de "Categoría" en `/eventos` desbordaba el viewport en mobile (24px de overflow a 393px de ancho). Fix: medir `getBoundingClientRect()` contra `window.innerWidth` al abrir y flipear el ancla a `right:0` si hay overflow, más `max-width: min(<ancho fijo>, calc(100vw - 32px))` como tope duro.

**Checklist de gotchas genéricos de Astro/Notion (2026-08-19):** consolidado en su momento — ver reglas activas equivalentes en CLAUDE.md §5.
