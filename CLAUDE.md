# CLAUDE.md

Guía para Claude Code en este repositorio. Aquí viven SOLO invariantes: reglas que cambian el comportamiento de sesiones futuras y no son derivables del código. El historial vive en el Changelog — Portafolio D (Notion), no aquí.

## 1 · Proyecto

Portafolio profesional de Diego Maury. URL: https://diegomaury.mx. Deploy: Astro build vía Cloudflare Pages (Git integration, no HTML estático servido directo). Crónica completa de la migración (fechas, commits, incidentes): memoria [[historial-migracion-astro-cronica]] y Changelog — Portafolio D (Notion).

- **Deploy: Cloudflare Pages** (Git integration directa con este repo, rama `master`, construye con Astro en cada push) es la única fuente de verdad del build y del hosting — no GitHub Actions. El custom domain `diegomaury.mx` vive en el proyecto de Cloudflare Pages; `NOTION_TOKEN` ya está configurado ahí (tipo Secret). No reactivar `.github/workflows/deploy.yml.disabled` ni recrear el Pages Source de GitHub esperando que sirvan el sitio. Crónica del corte: memoria [[cloudflare-pages-corte-final-2026-08-02]]. `public/` se sigue copiando tal cual dentro de `dist/` en el build de Astro, así que todo lo que vive ahí (los 4 stubs legacy de casos, `cases/*.html`, `politicas-privacidad.html`, `terminos-y-condiciones.html`, `404.html`, `assets/`, `robots.txt`) sigue sirviéndose igual. **Regla dura:** cualquier página Astro nueva necesita el mismo snippet GTM-NHT5827J + Clarity x7ns7c22xi que `index.astro` y NUNCA debe llevar `noindex` salvo que sea explícitamente un preview no enlazado — olvidarlo ya causó un incidente en producción.
- `index.html` y `portfolio/index.html` de la raíz del repo NO se sirven en LIVE (no hay copia de ellos en `public/`, así que `astro build` no los incluye en `dist/`): quedaron reemplazados por `src/pages/index.astro` y `src/pages/portfolio.astro` respectivamente. Siguen en el repo pero son código muerto para producción; no editarlos esperando que el cambio aparezca en el sitio.
- Scaffold Astro instalado: `^5.18.2` (Content Layer API estable). `src/content/config.ts`: `cases`/`metrics`/`siteCopy`/`imageSlots` usan `loader:` (`src/services/notionLoaders.ts`) y schema Zod alineado 1:1 con `docs/platform/notion-astro-contract.md`, con guardrail `superRefine` que bloquea el build si una ficha Insignia se publica sin Métrica ancla + Evidencia. Sin `NOTION_TOKEN` el build de producción (`astro build`/`astro sync`) falla a propósito; `.env` local gitignored, token lo administra Diego (recrear cuando falte); el mismo token vive como secret `NOTION_TOKEN` en el repo de GitHub para CI.
- **CMS Imágenes (`imageSlots`):** base Notion `🖼️ CMS Imágenes — Portafolio D` (`collection://8dda9726-a42d-407d-ba84-334b4a1ef7a1`). Regla dura: **todas las fotos del sitio deben ser editables desde Notion** (instrucción directa de Diego) — cualquier imagen nueva que se agregue al sitio entra como fila en esta base, no como ruta hardcodeada nueva. `slotSrc(slot, fallback)` en `index.astro` solo usa la imagen de Notion si `Estado == "Listo"` y hay archivo subido; si no, cae al path hardcodeado. Contrato completo: `docs/platform/notion-astro-contract.md` sección 4. Los `banner`/`logo` de cada caso NO están en esta base — siguen siendo propiedades Files & media del SSOT de casos. Detalle de alta y gotchas: memoria [[cms-imagenes-imageslots-2026-07-25]].
- `src/pages/portfolio.astro` (listado, ruta `/portfolio`) y `src/pages/portfolio/[slug].astro` (caso individual) leen la colección `cases` real — no hay datos hardcodeados. `notionLoaders.ts` trae el cuerpo (`body`) de cada ficha vía `blocksToMarkdown` (con soporte de tablas Notion, incluida la tabla ✔/✖ de Evidencia) y deriva `resultHeadline` (H1 del cuerpo) y `hasVerifiedEvidence` (heredado de esa tabla, no declarado aparte). SEO (`@astrojs/sitemap`, meta/OG/canonical, JSON-LD `ItemList`/`CreativeWork`) y `src/pages/llms.txt.ts` (filtra por canal `llms.txt`, distinto del `llms.txt` real en la raíz del repo) también están montados. **Gotcha de build:** `astro dev`/`astro build` tardan ~90-115s en el paso `[notion-cases]` porque traen el body completo de todas las fichas; no asumir que el proceso está colgado antes de ~2 min. Los 4 casos LIVE del CMS (`/portfolio`) son Heineken, REDUX, SOFI, HackSureste.
- `src/pages/index.astro` lee el singleton `siteCopy` (parseado por `src/utils/parseSiteCopy.ts`, que divide el markdown plano por headings `S<n> · <nombre>`/`SEO`) y renderiza S1-S6b + S8 + Footer con el copy canónico. **S7 "Colaboremos" no existe en el código**: `SECTION_IDS` no tiene entrada `S7`; el nav "Contacto" apunta a `#s8-siguiente-paso`. No reintroducir una sección S7 esperando que exista ese ancla — su contenido vive fusionado en S6b (testimonios + widget de Senja) y S8 (CTA final).
- `src/pages/portfolio/[slug].astro` usa `BaseLayout` (Navbar + Footer compartidos, igual que `index.astro`/`portfolio.astro`), con layout de rail sticky (meta + evidencia + métrica ancla + nav de secciones con scrollspy a la izquierda, prosa a la derecha) y prop `ogImage` para `og:image`/`twitter:card` dinámico por caso.
- Idioma del sitio: español únicamente (sin toggle). Responder siempre en español.
- Analítica en todas las páginas: GTM-NHT5827J + Microsoft Clarity x7ns7c22xi.

## 2 · Comandos

    # Servidor local (desde la raíz del repo; no hay build en producción)
    python -m http.server 8080          # o: npx serve .

    # Deploy: push a master → Cloudflare Pages (Git integration) construye y despliega
    # automáticamente (astro build). GitHub Actions/GitHub Pages retirados 2026-08-02.
    git add -A && git commit -m "..." && git push origin master

    # Verificador de métricas (obligatorio antes de publicar cifras; se exige exit 0)
    node tools/verify-metrics.cjs
    node --test tools/verify-metrics.test.cjs    # tests del verificador

    # Dependencias: local con npm install (conserva puppeteer devDep para QA visual);
    # en CI usar npm ci --omit=dev (no instalar Chromium). Scripts con require('puppeteer')
    # se ejecutan desde la raíz del repo.

    # QA visual y accesibilidad (ruta única, ver regla en sección 5 · Tooling)
    npm run lint          # stylelint (assets/css) + htmlhint (9 páginas clave)
    npm run test:a11y     # axe-core (@axe-core/playwright) contra las 9 páginas clave, WCAG A/AA
    npm run verify:visual # screenshots desktop+mobile de las 9 páginas → qa-output/screenshots/ (gitignored)

    # Astro: esto es lo que corre en CI y define el sitio LIVE. Correrlo local
    # NO toca diegomaury.mx (eso requiere push a master); sirve para QA antes de subir.
    npx astro build

    # Data files de SOFI (assets/data/sofi/*): se regeneran EN el repo de SOFI
    # (Fliphouse-whatsapp-agent · tools/portfolio-export/): build-fsm.js <ruta-del-sitio>,
    # capture-run.js (Docker + OPENROUTER_API_KEY viva) y build-metrics.js

## 3 · Arquitectura (solo lo no-obvio)

    /                        # raíz del repo — YA NO es el deploy source directo (ver Fase 3 arriba)
    ├── index.html           # MUERTO para LIVE desde 2026-07-25 (no hay copia en public/): reemplazado por src/pages/index.astro. Se conserva en el repo, no se sirve.
    ├── index-canonico.html · prototipo-portafolio.html   # PREVIEWS aislados: noindex, sin analítica, no enlazados, no forman parte del build de Astro (fuera de public/)
    ├── 404.html             # MUERTO para LIVE en la raíz; el 404 real servido es public/404.html (mismo contenido, copiado a dist/ por Astro)
    ├── portfolio/           # index.html (SPA por eras) MUERTO para LIVE desde 2026-07-25, reemplazado por src/pages/portfolio.astro. Los 4 HTML de casos legacy (heineken · sofi · redux-incmty · innovation-systems) SÍ siguen LIVE vía public/portfolio/*.html
    ├── version2/            # stub de redirect (noindex,follow) hacia /, servido vía public/ igual que antes
    ├── cases/               # SOLO stubs de redirect (noindex,follow) → portfolio/*.html · fliphouse.html = transición a SOFI, servidos vía public/cases/
    ├── assets/css/styles.css    # Tokens DS V2 + componentes (aliases --dm-* solo compatibilidad temporal); servido vía public/assets/
    ├── assets/data/         # metrics.json (generado desde Notion) · sofi/* (generados en el repo de SOFI)
    ├── docs/platform/       # cms-notion.md · conventions.md · seo-model.md · notion-astro-contract.md
    ├── docs/superpowers/    # specs/ y plans/ de diseño
    ├── public/              # espejo de todo lo que Astro debe servir tal cual (copiado 1:1 a dist/ en cada build): 404.html, politicas-privacidad.html, terminos-y-condiciones.html, portfolio/*.html legacy, cases/*.html, robots.txt, assets/, cms-media/, cv/. Página nueva que deba vivir fuera de src/pages/ va aquí, o `astro build` no la incluye.
    └── src/ · astro.config.mjs   # Astro real — esto es lo que define el sitio LIVE desde 2026-07-25 (ver Fase 3 arriba)

Carpetas locales no versionadas (`_ds_import/`, `.claude-design/lab/`, `.playwright-mcp/`, `.superpowers/`) no son fuente de verdad del sitio.

## 4 · Reglas críticas

### Design system — V2 "Ember on Ink" (único nombre vigente; no usar numeraciones v2/v3 cruzadas)

Regla irrompible: todo el sitio comparte un solo design system. Fuente de verdad: proyecto Claude Design "Diego Maury Design System V 2" (`019dd0ff-c961-76e9-9815-68e47ca79ab8`, vía DesignSync), archivo `v2-tokens.css`.

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#0A0612` | Fondo principal (Deep Ink) |
| `--bg-2` | `#1A1128` | Superficie: cards, paneles, hover |
| `--border` | `#6A291B` | Bordes y separadores |
| `--t1` / `--t2` / `--t3` | `#FAF8FC` / `#DDDBE0` / `#A8A6AC` | Texto primario / secundario / terciario |
| `--ember` | `#FF5C39` | Acento único — una vez por pieza, en el elemento más importante |
| `--ember-cta` | `#BF452B` | Única forma válida de ember como fondo sólido con texto blanco (el puro da 3.07:1, falla AA) |

Tipografía: Plus Jakarta Sans (headlines, UI, body) + DM Mono (cifras, fechas, labels — uppercase, nunca párrafos). Montserrat/Bitter/Space Mono (V1) y `colors_and_type.css` fueron eliminados del repo el 2026-07-25 (cero referencias activas) — no reintroducirlos ni recrear `assets/fonts-v2/`.

Reglas duras (no negociables):
1. Un solo acento ember por pieza. No cuentan como violación: logo del nav y section-labels/eyebrows (precedente aceptado).
2. Sin gradientes, drop-shadows, blur ni glow decorativos. Excepciones aprobadas: overlays de imagen para legibilidad y `backdrop-filter: blur()` en nav sticky.
3. Nunca `--dm-*` nuevos. Los `--dm-*` existentes en `assets/css/styles.css` son alias de compatibilidad que ya resuelven a los tokens V2 (`--dm-ink: var(--bg)`, etc.) — usados por las 4 páginas de caso legacy LIVE, no se retiran sin decisión aparte.
4. `:focus-visible` en todo elemento interactivo: `outline: 2px solid var(--ember); outline-offset: 2px;`
5. Logo de marca: `assets/img/isotipo-ember.svg` en todo nav/footer. `isotipodm.svg` solo como textura de fondo `.bg-pattern` (opacidad 0.02–0.03) — no modificar ese patrón.
6. Pesos tipográficos: solo {300, 400, 500, 700} (800 no existe en la escala del DS). Titulares con tamaño >48px (en su punto máximo del `clamp`) usan peso 300 (regla D4 del Manual de Marca); el resto de headlines usa máximo 700.
7. Radios de borde en la escala {0, 3(XS, badges/tags), 6(SM, botones/inputs), 10(MD, cards/paneles), 16(LG, modales/hero cards)}px. Pills (chips totalmente redondeados) son la única excepción válida fuera de escala, con `border-radius: 999px`.

Gotchas y excepciones del DS:
- `assets/img/logos/*.png`: nombres en minúsculas sin espacios (ej. `hacksureste-blanco.png`), consistente con el resto de la carpeta — no subir archivos con nombre "Logo Bonito Final.png".
- `assets/img/logos/sofi.png` (versión a color, agregada 2026-07-24) NO tiene canal alpha — fondo blanco sólido horneado en el PNG, no transparente. Si se necesita sobre fondo oscuro/de color, usar `sofi-blanco.png` o regenerar con transparencia real.
- `.case-nav-footer`/`.case-divider` son CSS local por página de caso (deliberado, no viven en `styles.css`). Caso nuevo = replicar ese bloque local.
- `.bg-pattern` trae `pointer-events: none`; devolver `auto` si una sección lo usa directo.
- El "doble h1" del portfolio es falso positivo (templates JS vía `innerHTML`) — no "corregirlo".
- La función de scroll del nav es `scrollToSection` (no `scrollTo`).
- **Gotcha `<script is:inline>` (2026-08-02):** es un script clásico de navegador, no un módulo ni un body de función — un `return` a nivel raíz es `SyntaxError: Illegal return statement` y mata el script completo en silencio (pasó en `Navbar.astro`: rompía el burger móvil, el scroll del nav y el highlight de sección activa en todo el sitio, sin error visible en build). Cualquier guard-clause con `return` temprano en un `is:inline` va envuelto en un IIFE `(function () { ... })();`.
- Mobile-first (375/768/1280) · JS < 80 KB gzip · CSS < 15 KB · animar solo `transform`/`opacity` · respetar `prefers-reduced-motion`.

Footer unificado (desde 2026-07-22): el sitio no tiene mecanismo de include (HTML estático puro) — unificar el footer significa replicar markup exacto en cada página, no crear un partial. Canónico: marca+isotipo, tagline "Hagamos que las cosas pasen.", nav (Home · Portfolio · Agendar) y links legales (Política de privacidad · Términos y condiciones), copyright. Clases reales en `assets/css/styles.css:813-850` (`.footer`, `.footer__brand`, `.footer__nav`, `.footer__legal`, `.footer__copy`) — únicas centralizadas, usadas por las 4 páginas de caso + `politicas-privacidad.html` + `terminos-y-condiciones.html`. `index.html` y `portfolio/index.html` son autocontenidos a propósito (no cargan `styles.css`): llevan su propio footer con clases locales (`.footer-*` / `.foot__*`) — no forzarles el stylesheet compartido, solo mantener el mismo set de links. Ruta del Agendar canónico en el footer: `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`. Excepción explícita (2026-07-23): el footer de `index.html` diverge del patrón unificado de una sola línea — usa 3 columnas (marca+tagline / Explora / Contacto) + copyright "© 2026 Diego Maury. Todos los derechos reservados.", por alinearse al SSOT "Copy Oficial · diegomaury.mx" (columna Versión Actual) en vez del footer compartido de casos/legales. No replicar esta estructura en otras páginas sin decisión explícita.

### Copy y voz
- Primera persona + tuteo según el Writing DNA (página Notion "Estilo y voz", fuente canónica). Filo = postura + contraste "No es X. Es Y", no sarcasmo. Sin em dash en contenido.
- Plantilla de caso: Contexto → Problema → Objetivo (métrica+timeframe) → Mi rol → Acciones → Resultados → Evidencia → Aprendizajes. Logro = Verbo + qué + cómo + impacto + timeframe.
- Testimonios (Senja): activado (2026-07-31) vía script inline en `index.astro` que inyecta `widget.senja.io` sobre `.senja-embed[data-id]`; solo fuentes verificables.

### Métricas y evidencia
- No inventar cifras. Toda afirmación cuantitativa lleva artefacto o un ✖ explícito. Claims sin respaldo documental no se publican.
- SSOT: base "📊 Métricas oficiales — Portafolio D" en Notion. Espejo generado: `assets/data/metrics.json` — no editar a mano. Métrica nueva se da de alta primero en Notion, nunca directo en el JSON.
- SOP de publicación con métricas, sin excepciones: sincronizar Notion → `metrics.json` → resolver placeholders `{{metrica:slug}}` → `node tools/verify-metrics.cjs` → corregir hasta exit 0 → commit → push → entrada en Changelog.
- Estándar por claim público: entidad + programa/edición + población + unidad + fuente o grado de evidencia (published = tercero nombrado / own = registros o estimación propia; nada está auditado). Si no se cumple, el claim se retira sin nota que reconozca la inconsistencia.
- Que dos superficies coincidan NO prueba un claim: pueden compartir la misma estimación sin reconstruir.
- `calificadorClaves` usa raíz de palabra (ej. "estimad"): el chequeo es substring, no palabra completa.
- Cero cifras nuevas en captions/alt de evidencia visual: si no está en el SSOT, no va en texto.
- Los borradores pueden llevar cifras literales; lo publicable no.

Cifras — entrada canónica única (no resucitar):

| Cifra | Estado canónico |
|---|---|
| 9,905 | Viva SOLO como "participantes inscritos, agregado de programas INCmty (HGC incluido), estimado" — métrica ancla del hero. Muerta como cifra de HEINEKEN. |
| Bolsas $80,000 (B-Challenge) y $120,000 (INC Prototype) | Muertas, sin respaldo. |
| "200+ capacitados" REDUX | Muerta: son 400+ solo en 2020 (Informe Anual Tec). |
| "5 ediciones" y "32 estados" de REDUX · "36 registros" del sureste | Muertas (línea base documentada: 35 propuestas, La Jornada Maya). |
| 3,231 (`heineken-proyectos-evaluados`) | Vigente. Vive en `index.html`, tarjeta HEINEKEN de la sección Evidencia (bloque "Resultados"), sincronizado con el SSOT "Copy Oficial · diegomaury.mx" (columna Versión Actual). |
| BTEM | = Beca Talento Emprendedor (no "Blockchain Tec de Monterrey"). |

Decisiones cerradas (no son pendientes; no recuestionar):
- `portfolio/redux-incmty.html`: congelado por REM-005 ("déjalos"), sin `data-metric` a propósito y excluido del contrato de evidencia. La separación REDUX/INCmty/HackSureste ya está establecida.
- `portfolio/innovation-systems.html`: sin `data-metric` (sus 30%/100% son datos operativos del cliente, no claims del SSOT).
- El congelamiento de 90 días del index está ANULADO (Diego). Los cambios se rigen por las reglas normales, no por ventanas de tiempo.
- Publicar (`Estado publicación = Publicado` en el CMS) es decisión exclusiva de Diego y exige, solo para fichas Insignia, `Métrica ancla` + `Evidencia` verificadas; una ficha Soporte puede vivir sin métrica ancla (no reportarla como bloqueo).

### CMS Notion (sin pipeline hoy)
- La base `🗂️ SSOT - Portafolio Proyectos` (data source `88257bc9-e575-45e8-90df-f851f96e92f2`) es el CMS del contenido de casos.
- Gotcha: la propiedad `Objetivo con métrica y timeframe ` lleva un espacio al final de su nombre real.
- **Nombres internos, nunca títulos visibles (regla de Diego, 2026-07-24).** Ids, anclas e identificadores de código usan el CÓDIGO INTERNO del SSOT (`SECTION_IDS` en `src/pages/index.astro`: `s1-hero` … `s8-siguiente-paso`), no el título de la sección. Diego renombra secciones en Notion ("Hablemos" → "Colaboremos" en el pivote) y un ancla derivada del título se rompe en cada renombre. El nav se genera desde el copy: ancla fija + etiqueta viva. Los destinos de CTA se resuelven por la ETIQUETA del botón (`ctaTarget()`), nunca por su posición — el mapeo posicional mandaba "Ver casos de estudio" a Calendly. Los sub-bloques de una sección se localizan por nivel de heading y posición, no por texto literal.
- **Gotcha del loader (corregido 2026-07-24, no reintroducir):** `fetchBlockChildren` NO desciende a `child_page` ni `child_database`. La página singleton `siteCopy` tiene páginas hermanas archivadas ("Obsoleto · Secciones reemplazadas…") que reusan los mismos códigos S1..S8; al descender, su copy obsoleto pisaba al vigente. Defensa adicional en `parseSiteCopySections`: ante clave duplicada gana la PRIMERA aparición (en el SSOT "Versión Actual" va antes que las obsoletas).

### Caso SOFI (`portfolio/sofi.html`)
- Data files `assets/data/sofi/*.js` generados con `tools/portfolio-export/` EN el repo de SOFI — no editar a mano. Si SOFI cambia, se regenera el data file; no se toca el HTML.
- El data file publica 12 estados, 3 terminales conversacionales y umbral 0.75; `ALL_TERMINAL_STATES` del repo SOFI exporta 5 (incluye `COMPLETE_YES`/`COMPLETE_NO` de flow completions). Son alcances distintos: no "corregir" uno con el otro.
- Métrica de tests: 392 (excluye `tests/portfolio-export/`; `npx jest` a secas da 420 e infla la cobertura).
- RODI +1,291% = modelo propio (cost-avoidance modelado, sin auditoría externa, NO está bajo NDA). La sección "Lo que no puedo probar" es estructural: no rellenarla.
- Cero datos de FlipHouse en el repo, y no debe haberlos.
- El video de `/brag` es pieza de presentación, no evidencia.

### Navegación
- CTA de agendar canónico: Notion Calendar (https://calendar.notion.so/meet/diegomaurymx/5aad3vun`). No reintroducir Calendly.
- Los 4 casos se enlazan en grafo completo vía `case-nav-footer`; retorno a `../#trabajo` (el id real es `trabajo`, no `work`).
- Enlaces internos nuevos apuntan a `portfolio/*.html`; `cases/*.html` son solo stubs. La constante `CASE_PAGES` de la SPA documentaba rutas `../cases/*.html` (funcionan solo vía redirect): al tocar ese archivo, verificar y apuntar directo a `portfolio/`.
- Patrón de redirect para renames (GitHub Pages no soporta 301): `noindex,follow` + `canonical` + `meta refresh` + `location.replace`.

## 5 · Workflow y registro

### Scoping de tareas Notion de este proyecto
Filtrar SIEMPRE por relación a proyecto "Portafolio D" (`Proyectos, Ideas y Locuras de Diego`), nunca por palabra clave o tema. Bases relevantes: Changelog — Portafolio D, Tareas y Misiones, PRD - Portfolio (ver abajo).

### Registro en Notion — Portafolio D (SSOT de cambios)
El flujo de registro sigue estrictamente la guía canónica en Notion: **"🤖 Instrucciones para agentes de código (Claude Code · Codex) — Portafolio D (Notion MCP)"** (`8b47026a-4a82-43ba-9043-1c0424338d14`). Ante cualquier conflicto entre esa página y este resumen, manda la guía. No duplicar su contenido aquí — solo el mínimo para no tener que abrirla cada sesión:

- **El Inbox es obligatorio, no se puede saltar.** Orden: (1) Inbox (`Portafolio D — Claude Inbox`, collection://4b69a236-ede8-48a8-9354-7b5b6dd699ca) con `Estado de procesamiento = Pendiente` → (2) Changelog (collection://652b68c7-9cf5-441c-957c-f18b055db8b8), vinculado desde `Changelog creado` del Inbox, Inbox pasa a `Procesado` → (3) Tarea en Tareas y Misiones (collection://3190fe3c-51c5-8074-a302-000b97e8a410), vinculada desde el Changelog.
- Qué amerita Changelog: cambios publicados (copy, datos, diseño, estructura, SEO/llms, infraestructura), correcciones de datos/evidencia, **cambios de documentación** (`Componente: Documentación`) y **lecciones aprendidas del agente** (`Componente: Lecciones Aprendidas`, `Sección: General`). Solo el trabajo menor sin publicación (borradores, experimentos locales) no genera entrada — pero sí debe reflejarse en su tarea.
- Granularidad: 1 cambio lógico (misma `Razón` + mismo `Impacto`) = 1 entrada de Changelog = 1 tarea propia nueva. Toda entrada de Changelog necesita su tarea; no toda tarea necesita Changelog.
- `CHANGELOG.md` del repo es espejo técnico, no fuente. No crear páginas sueltas ni inventar nombres de propiedades.
- Documentación del proyecto vive en la Diego Maury WIKI (collection://20d0fe3c-51c5-805b-8134-000b3f7d5fac), vinculada a Portafolio D vía `Proyecto` — nunca como página suelta.
- Buscar en Notion por título exacto, workspace "Notion de Diego".

### Ciclo de vida de memoria y CLAUDE.md (regla derivada de la auditoría de memoria 2026-07-24)
- Toda entrada narrativa con fecha/commit ("Fase X completa (fecha)...") que se agregue a este archivo durante el trabajo de una fase es TEMPORAL: al cerrar la fase (o en el `/close-session`), esa narrativa migra al Changelog — Portafolio D (Notion) o a una memoria `historial-*`, dejando aquí solo la regla vigente resultante. Este archivo no acumula crónica.
- Cuando una memoria de `memory/` queda superada por un hecho posterior, no se deja una sección marcada "SUPERADO" dentro del mismo archivo: se elimina esa sección y, si el contenido tiene valor de referencia histórica, se mueve a un archivo nuevo con prefijo `historial-*` (con aviso explícito en su `description` de que no es la fuente vigente).
- Un archivo de memoria completamente reemplazado por otro se elimina (actualizando `MEMORY.md`), no se conserva "por si acaso" — git (código) y Notion (Changelog/tareas) ya preservan el historial real.

### Memoria y cierre de sesión (/close-session)
- Lección aprendida (creencia técnica corregida) → `~/.claude/memory/lessons-learned.md`; genera changelog solo si acompaña un cambio registrable.
- Memoria del proyecto → `~/.claude/projects/...newlandingpage/memory/` (un archivo por hecho + índice en `MEMORY.md`; actualizar antes que duplicar).
- Barrido de pendientes: ningún pendiente sobrevive fuera de Tareas y Misiones (anti-duplicados por título exacto; lo de <2 min se resuelve en la sesión, no se registra). El resumen final mapea cada pendiente a su tarea.
- El paso "Notion — Inbox" del protocolo global no aplica a este repo (es de SOFI).

### Tooling
- CI/deploy real desde 2026-08-02: Cloudflare Pages (Git integration, build de Astro en su propio entorno). `.github/workflows/deploy.yml.disabled` es el pipeline anterior (GitHub Actions → GitHub Pages), retirado y conservado solo como referencia; no corre. `npm ci --omit=dev` (puppeteer/Chromium no se instala en CI) sigue aplicando como convención de instalación en entornos de build sin necesidad de devDependencies.
- **El verificador de métricas es `.cjs`, no `.js` (2026-07-24).** `package.json` tiene `"type": "module"` desde el scaffold Astro, así que un `.js` con `require()` revienta con `ReferenceError` antes de validar nada — el gate estuvo muerto en silencio hasta que se detectó. Se renombró a `tools/verify-metrics.cjs` + `tools/verify-metrics.test.cjs` (fix mínimo, sin reescribir a ESM). Regla derivada: cualquier script nuevo del repo que use CommonJS va en `.cjs`, y un gate documentado no cuenta como gate hasta verificar que corre.
- Puppeteer es devDependency solo para scripts legacy que hacen `require('puppeteer')` explícitamente (corren desde la raíz del repo; desde scratchpad fallan con MODULE_NOT_FOUND). NO es la ruta de QA visual/a11y — esa es Playwright (ver abajo).
- **QA visual y accesibilidad — ruta única, sin fallbacks**: `npm run lint` / `npm run test:a11y` / `npm run verify:visual` (Playwright + `@axe-core/playwright`, config en `playwright.config.ts`, specs en `tests/qa/`). Páginas cubiertas: `index.html`, `portfolio/index.html`, los 4 casos (`heineken`, `sofi`, `redux-incmty`, `innovation-systems`), `politicas-privacidad.html`, `terminos-y-condiciones.html`, `404.html`. Nunca improvisar un fallback ad-hoc de browser (ni Puppeteer ni Claude-in-Chrome) para QA: si Playwright falla, reportar el error tal cual, no rodearlo.
- `stylelint` (config en `package.json` → `"stylelint"`) está ajustado a la convención BEM real del CSS (`selector-class-pattern` acepta `__`/`--`) y desactiva reglas puramente estilísticas nunca aplicadas (notación de color, saltos de línea, `single-line-max-declarations`, etc.) — esto no es debilitar el lint, es alinearlo con el CSS ya existente en vez de forzar una reescritura masiva fuera de alcance.
- `qa-output/screenshots/` es regenerable (gitignored) — nunca se versiona.
- `verify:visual` (Playwright `fullPage` screenshot) captura la mayoría de las secciones en negro/vacío por debajo del hero: es el efecto esperado de `[data-reveal]` (`opacity:0` hasta que el `IntersectionObserver` del sitio dispara `.is-visible` por scroll real, no por el auto-scroll interno de Playwright al hacer stitching). Ya ocurre igual en `master` sin cambios — no es una regresión de una feature nueva. Para verificar visualmente contenido nuevo, usar el navegador real (Claude-in-Chrome) con scroll físico, no confiar en el PNG de `verify:visual` para secciones bajo el fold.
- Decisión: la config de stylelint vive inline en `package.json` (clave nativa) en lugar de `.stylelintrc.json`, para mantenerla fuera del alcance del hook `config-protection` del plugin ecc sin desactivarlo. Cualquier cambio futuro a esta config requiere aprobación explícita del usuario.

## 6 · Fuentes de verdad

| Tema | Fuente de verdad |
|---|---|
| Código | Git (`master`) |
| Contenido / copy | Bloque "Copy Activo" (S1-S8, synced block) dentro de la página "Portafolio D" en Notion + Writing DNA "Estilo y voz". Regla propia: si el sitio cambia, este bloque se actualiza en la misma sesión — pero **nunca vía `notion-update-page update_content`** (bloque anidado con toggles/columns/callouts; ese comando ya ha borrado contenido hermano, ver `notion-update-content-gotcha` en memoria). Edición manual por Diego, con el texto preparado en un doc de `docs/superpowers/specs/`. |
| Métricas | 📊 Métricas oficiales — Portafolio D (espejo: `assets/data/metrics.json`) |
| Diseño | Tokens DS V2 "Ember on Ink" (`v2-tokens.css`) |
| Historial de cambios | Changelog — Portafolio D (Notion); `CHANGELOG.md` = espejo técnico |
| CMS y mapeo Notion↔Astro | `docs/platform/cms-notion.md` · `notion-astro-contract.md` |
| Imágenes hardcodeadas del sitio (foto Diego, logos) | 🖼️ CMS Imágenes — Portafolio D (Notion) |
| Invariantes de comportamiento | Este archivo |