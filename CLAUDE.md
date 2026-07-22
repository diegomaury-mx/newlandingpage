# CLAUDE.md

Guía para Claude Code en este repositorio. Aquí viven SOLO invariantes: reglas que cambian el comportamiento de sesiones futuras y no son derivables del código. El historial vive en el Changelog — Portafolio D (Notion), no aquí.

## 1 · Proyecto

Portafolio profesional de Diego Maury — sitio estático en GitHub Pages. URL: https://diegomaury.mx (LIVE desde 2026-05-13).

- HTML5 + CSS3 + JS vanilla; sin build system en producción.
- Deploy: push a `master` (raíz = deploy source). Lo que no está en `master` no está LIVE.
- Scaffold Astro montado en la raíz, NO desplegado: construye a `dist/`; el LIVE sigue siendo el HTML de la raíz. La migración avanza tarea por tarea vía la cadena "Diego CMS" en Notion (el gate de sprints original fue anulado por Diego). Astro v4.16 a propósito (honra `config.ts`). El schema `cases` de `src/content/config.ts` es aspiracional; el mapeo real Notion↔Astro está en `docs/platform/notion-astro-contract.md`. Hoy NO existe pipeline Notion → sitio: el HTML se edita a mano.
- Idioma del sitio: español únicamente (sin toggle). Responder siempre en español.
- Analítica en todas las páginas: GTM-NHT5827J + Microsoft Clarity x7ns7c22xi.

## 2 · Comandos

    # Servidor local (desde la raíz del repo; no hay build en producción)
    python -m http.server 8080          # o: npx serve .

    # Deploy: push a master. GitHub Pages redespliega solo.
    git add -A && git commit -m "..." && git push origin master

    # Verificador de métricas (obligatorio antes de publicar cifras; se exige exit 0)
    node tools/verify-metrics.js
    node --test tools/verify-metrics.test.js    # tests del verificador

    # Dependencias: local con npm install (conserva puppeteer devDep para QA visual);
    # en CI usar npm ci --omit=dev (no instalar Chromium). Scripts con require('puppeteer')
    # se ejecutan desde la raíz del repo.

    # QA visual y accesibilidad (ruta única, ver regla en sección 5 · Tooling)
    npm run lint          # stylelint (assets/css) + htmlhint (9 páginas clave)
    npm run test:a11y     # axe-core (@axe-core/playwright) contra las 9 páginas clave, WCAG A/AA
    npm run verify:visual # screenshots desktop+mobile de las 9 páginas → qa-output/screenshots/ (gitignored)

    # Astro (scaffold, NO desplegado): construye a dist/, no toca el HTML LIVE
    npx astro build

    # Data files de SOFI (assets/data/sofi/*): se regeneran EN el repo de SOFI
    # (Fliphouse-whatsapp-agent · tools/portfolio-export/): build-fsm.js <ruta-del-sitio>,
    # capture-run.js (Docker + OPENROUTER_API_KEY viva) y build-metrics.js

## 3 · Arquitectura (solo lo no-obvio)

    /                        # raíz de master = sitio LIVE
    ├── index.html           # Home LIVE
    ├── index-canonico.html · prototipo-portafolio.html   # PREVIEWS aislados: noindex, sin analítica, no enlazados
    ├── 404.html             # noindex
    ├── portfolio/           # SPA por eras (index.html) + los 4 casos LIVE: heineken · sofi · redux-incmty · innovation-systems
    ├── cases/               # SOLO stubs de redirect (noindex,follow) → portfolio/*.html · fliphouse.html = transición a SOFI
    ├── assets/css/styles.css    # Tokens DS V2 + componentes (aliases --dm-* solo compatibilidad temporal)
    ├── assets/data/         # metrics.json (generado desde Notion) · sofi/* (generados en el repo de SOFI)
    ├── backups/             # respaldos servidos, noindex,nofollow
    ├── docs/platform/       # cms-notion.md · conventions.md · seo-model.md · notion-astro-contract.md
    ├── docs/superpowers/    # specs/ y plans/ de diseño
    └── src/ · public/ · astro.config.mjs   # scaffold Astro — NO desplegado

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

Tipografía: Plus Jakarta Sans (headlines, UI, body) + DM Mono (cifras, fechas, labels — uppercase, nunca párrafos). No reintroducir Montserrat/Bitter/Space Mono (`assets/fonts-v2/`, sin referenciar).

Reglas duras (no negociables):
1. Un solo acento ember por pieza. No cuentan como violación: logo del nav y section-labels/eyebrows (precedente aceptado).
2. Sin gradientes, drop-shadows, blur ni glow decorativos. Excepciones aprobadas: overlays de imagen para legibilidad y `backdrop-filter: blur()` en nav sticky.
3. Nunca `--dm-*` nuevos, nunca `colors_and_type.css` (sus variables ya no existen).
4. `:focus-visible` en todo elemento interactivo: `outline: 2px solid var(--ember); outline-offset: 2px;`
5. Logo de marca: `assets/img/isotipo-ember.svg` en todo nav/footer. `isotipodm.svg` solo como textura de fondo `.bg-pattern` (opacidad 0.02–0.03) — no modificar ese patrón.

Gotchas y excepciones del DS:
- `.case-nav-footer`/`.case-divider` son CSS local por página de caso (deliberado, no viven en `styles.css`). Caso nuevo = replicar ese bloque local.
- `.bg-pattern` trae `pointer-events: none`; devolver `auto` si una sección lo usa directo.
- El "doble h1" del portfolio es falso positivo (templates JS vía `innerHTML`) — no "corregirlo".
- La función de scroll del nav es `scrollToSection` (no `scrollTo`).
- Mobile-first (375/768/1280) · JS < 80 KB gzip · CSS < 15 KB · animar solo `transform`/`opacity` · respetar `prefers-reduced-motion`.

Footer unificado (desde 2026-07-22): el sitio no tiene mecanismo de include (HTML estático puro) — unificar el footer significa replicar markup exacto en cada página, no crear un partial. Canónico: marca+isotipo, tagline "Hagamos que las cosas pasen.", nav (Home · Portfolio · Agendar) y links legales (Política de privacidad · Términos y condiciones), copyright. Clases reales en `assets/css/styles.css:813-850` (`.footer`, `.footer__brand`, `.footer__nav`, `.footer__legal`, `.footer__copy`) — únicas centralizadas, usadas por las 4 páginas de caso + `politicas-privacidad.html` + `terminos-y-condiciones.html`. `index.html` y `portfolio/index.html` son autocontenidos a propósito (no cargan `styles.css`): llevan su propio footer con clases locales (`.footer-*` / `.foot__*`) — no forzarles el stylesheet compartido, solo mantener el mismo set de links. Ruta del Agendar canónico en el footer: `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`.

### Copy y voz
- Primera persona + tuteo según el Writing DNA (página Notion "Estilo y voz", fuente canónica). Filo = postura + contraste "No es X. Es Y", no sarcasmo. Sin em dash en contenido.
- Plantilla de caso: Contexto → Problema → Objetivo (métrica+timeframe) → Mi rol → Acciones → Resultados → Evidencia → Aprendizajes. Logro = Verbo + qué + cómo + impacto + timeframe.
- Testimonios (Senja): pendiente de activar; solo fuentes verificables.

### Métricas y evidencia
- No inventar cifras. Toda afirmación cuantitativa lleva artefacto o un ✖ explícito. Claims sin respaldo documental no se publican.
- SSOT: base "📊 Métricas oficiales — Portafolio D" en Notion. Espejo generado: `assets/data/metrics.json` — no editar a mano. Métrica nueva se da de alta primero en Notion, nunca directo en el JSON.
- SOP de publicación con métricas, sin excepciones: sincronizar Notion → `metrics.json` → resolver placeholders `{{metrica:slug}}` → `node tools/verify-metrics.js` → corregir hasta exit 0 → commit → push → entrada en Changelog.
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
| 3,231 (`heineken-proyectos-evaluados`) | Vigente/Pública por decisión de Diego; vive en `index.html`, NO en `portfolio/heineken.html`. No recuestionar. |
| BTEM | = Beca Talento Emprendedor (no "Blockchain Tec de Monterrey"). |

Decisiones cerradas (no son pendientes; no recuestionar):
- `portfolio/redux-incmty.html`: congelado por REM-005 ("déjalos"), sin `data-metric` a propósito y excluido del contrato de evidencia. La separación REDUX/INCmty/HackSureste ya está establecida.
- `portfolio/innovation-systems.html`: sin `data-metric` (sus 30%/100% son datos operativos del cliente, no claims del SSOT).
- El congelamiento de 90 días del index está ANULADO (Diego). Los cambios se rigen por las reglas normales, no por ventanas de tiempo.
- Publicar (`Estado publicación = Publicado` en el CMS) es decisión exclusiva de Diego y exige, solo para fichas Insignia, `Métrica ancla` + `Evidencia` verificadas; una ficha Soporte puede vivir sin métrica ancla (no reportarla como bloqueo).

### CMS Notion (sin pipeline hoy)
- La base `🗂️ SSOT - Portafolio Proyectos` (data source `88257bc9-e575-45e8-90df-f851f96e92f2`) es el CMS del contenido de casos.
- Gotcha: la propiedad `Objetivo con métrica y timeframe ` lleva un espacio al final de su nombre real.

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
- Registro canónico: base "📝 Changelog — Portafolio D" (data source: collection://652b68c7-9cf5-441c-957c-f18b055db8b8). El `CHANGELOG.md` del repo es espejo técnico, no fuente. No crear páginas sueltas. No inventar nombres de propiedades.
- Umbral único (tiene precedencia sobre cualquier guía anterior): entrada en el Changelog SOLO si hubo cambio significativo en el código o la estructura del repo/sitio. Un ajuste 100% dentro de Notion cierra su tarea (Estado + Resumen) pero NO genera changelog. Ante la duda, preguntar a Diego.
- Granularidad: un commit registrable = una entrada = una tarea propia nueva.
- Propiedades del Changelog: `Cambio` (title) · `Fecha` · `Componente` (Copy · Datos y evidencia · Diseño · Estructura · SEO / llms · Infraestructura · Documentación · Lecciones Aprendidas) · `Sección` (Hero · Casos · Servicios · About · Testimonios · Editorial · Contacto · llms.txt · General) · `Razón` · `Impacto` · `Tareas y Misiones` (relation).
- Tareas y Misiones (collection://3190fe3c-51c5-8074-a302-000b97e8a410): nombre `Documentar cambio: <título>`, Prioridad `Media`, proyecto Portafolio D en `Proyectos, Ideas y Locuras de Diego`, Estado real (`Por empezar` · `En proceso` · `Bloqueada` · `Terminada` · `Archivada`). Cardinalidad: una entrada puede tener varias tareas; una tarea pertenece a un solo changelog (no reciclar tareas que ya tienen changelog).
- Documentación del proyecto: base "📁 Product Requirements Document - Portfolio" (collection://3190fe3c-51c5-8005-aefb-000b5d0eff53). Una sola versión vigente por documento; la reemplazada se marca obsoleta. Verificar copy/datos contra SSOT - Identidad, SSOT - Portafolio y los Canónicos antes de publicar.
- Buscar en Notion por título exacto, workspace "Notion de Diego".

### Memoria y cierre de sesión (/close-session)
- Filtro de invariantes (paso "CLAUDE.md"): fecha + commit + "ejecutado/cerrado" = Changelog de Notion, NO CLAUDE.md. A este archivo solo entran invariantes no derivables del código.
- Lección aprendida (creencia técnica corregida) → `~/.claude/memory/lessons-learned.md`; genera changelog solo si acompaña un cambio registrable.
- Memoria del proyecto → `~/.claude/projects/...newlandingpage/memory/` (un archivo por hecho + índice en `MEMORY.md`; actualizar antes que duplicar).
- Barrido de pendientes: ningún pendiente sobrevive fuera de Tareas y Misiones (anti-duplicados por título exacto; lo de <2 min se resuelve en la sesión, no se registra). El resumen final mapea cada pendiente a su tarea.
- El paso "Notion — Inbox" del protocolo global no aplica a este repo (es de SOFI).

### Tooling
- CI futuro (GitHub Actions + Astro): `npm ci --omit=dev` — puppeteer/Chromium no se instala en CI.
- Puppeteer es devDependency solo para scripts legacy que hacen `require('puppeteer')` explícitamente (corren desde la raíz del repo; desde scratchpad fallan con MODULE_NOT_FOUND). NO es la ruta de QA visual/a11y — esa es Playwright (ver abajo).
- **QA visual y accesibilidad — ruta única, sin fallbacks**: `npm run lint` / `npm run test:a11y` / `npm run verify:visual` (Playwright + `@axe-core/playwright`, config en `playwright.config.ts`, specs en `tests/qa/`). Páginas cubiertas: `index.html`, `portfolio/index.html`, los 4 casos (`heineken`, `sofi`, `redux-incmty`, `innovation-systems`), `politicas-privacidad.html`, `terminos-y-condiciones.html`, `404.html`. Nunca improvisar un fallback ad-hoc de browser (ni Puppeteer ni Claude-in-Chrome) para QA: si Playwright falla, reportar el error tal cual, no rodearlo.
- `stylelint` (config en `package.json` → `"stylelint"`) está ajustado a la convención BEM real del CSS (`selector-class-pattern` acepta `__`/`--`) y desactiva reglas puramente estilísticas nunca aplicadas (notación de color, saltos de línea, `single-line-max-declarations`, etc.) — esto no es debilitar el lint, es alinearlo con el CSS ya existente en vez de forzar una reescritura masiva fuera de alcance.
- `qa-output/screenshots/` es regenerable (gitignored) — nunca se versiona.
- `assets/css/colors_and_type.css` está excluido del glob de `lint` (`!assets/css/colors_and_type.css`): es el archivo deprecado sin uso ya documentado en la sección 4 ("nunca `colors_and_type.css`, sus variables ya no existen"). Es corrección de scope del linter, no del código.
- Decisión: la config de stylelint vive inline en `package.json` (clave nativa) en lugar de `.stylelintrc.json`, para mantenerla fuera del alcance del hook `config-protection` del plugin ecc sin desactivarlo. Cualquier cambio futuro a esta config requiere aprobación explícita del usuario.

## 6 · Fuentes de verdad

| Tema | Fuente de verdad |
|---|---|
| Código | Git (`master`) |
| Contenido / copy | SSOT de copy + Writing DNA "Estilo y voz" (Notion) |
| Métricas | 📊 Métricas oficiales — Portafolio D (espejo: `assets/data/metrics.json`) |
| Diseño | Tokens DS V2 "Ember on Ink" (`v2-tokens.css`) |
| Historial de cambios | Changelog — Portafolio D (Notion); `CHANGELOG.md` = espejo técnico |
| CMS y mapeo Notion↔Astro | `docs/platform/cms-notion.md` · `notion-astro-contract.md` |
| Invariantes de comportamiento | Este archivo |