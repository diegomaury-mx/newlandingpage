# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANTE:** Toda implementación, documentación o contribución debe seguir el esquema definido en `.claude/esquema` ubicado en la raíz del repositorio. Consulta este archivo antes de crear o modificar cualquier sección, archivo o estructura.

## Proyecto

Portafolio profesional de Diego Maury — sitio estático desplegado en GitHub Pages.

URL: `https://diegomaury.mx` — **LIVE desde 2026-05-13**

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks) — **así es el sitio LIVE hoy**
- Sin build system en producción. **Ojo:** hay una decisión de arquitectura registrada en `CHANGELOG.md` (v0.1.0, 2026-06-27) de migrar a **Astro** en sprints futuros — ver "Arquitectura futura — Sprint 0.5" más abajo. Mientras Sprint 1 no se apruebe e implemente, esta decisión NO afecta al sitio LIVE.
- Despliegue: GitHub Pages sirviendo desde **`master` / raíz** (CNAME `diegomaury.mx`). Cada push a `master` redespliega automáticamente. No hay rama `gh-pages` ni worktree (consolidado el 2026-06-15).

## Estructura del repositorio

El sitio vive en la **raíz de `master`** (fuente única de verdad y deploy source). No hay worktree.

```
/                               # ← raíz de master = sitio (deploy source)
├── index.html                  # Página principal v2 — LIVE
├── index-canonico.html         # PREVIEW aislado — NO live, ver nota abajo
├── prototipo-portafolio.html   # PREVIEW Fase A2 (Claude Design) — noindex, sin analítica, no enlazado; fuente del patrón de galería de evidencia
├── robots.txt / sitemap.xml    # SEO — LIVE
├── CNAME                       # diegomaury.mx
├── .nojekyll                   # deshabilita el pipeline Jekyll de GitHub Pages
├── llms.txt / llms-full.txt    # Contexto para LLMs — LIVE
├── README.md                   # Resumen público del repo (stack, estructura, deploy)
├── CHANGELOG.md                # Historial de decisiones de arquitectura y sprints
├── GOVERNANCE.md               # Reglas de contribución y decisión del proyecto
├── assets/
│   ├── css/styles.css          # Tokens DS v3 + todos los componentes
│   ├── css/colors_and_type.css # Token file del DS
│   ├── fonts/                  # Satoshi Variable + JetBrains Mono (local)
│   ├── fonts-v2/                # Montserrat + Bitter + Space Mono (v2)
│   ├── js/main.js              # Nav activa + scroll reveal (IntersectionObserver)
│   └── img/                    # isotipodm.svg (bg-pattern), isotipo, logos, hexagon patterns
├── render_card.html            # Tarjeta social 1080×1080 para exportar (10 variantes)
├── export_cards.js             # Script Puppeteer: `node export_cards.js` → exported_cards/
├── exported_cards/             # PNGs generados card-01..10
├── cases/
│   ├── heineken.html           # Caso +600% — LIVE
│   ├── innovation-systems.html # 3 subcasos FlipHouse/HackSureste/CAVA — LIVE
│   ├── redux-incmty.html       # REDUX + INCmty Challenges — LIVE
│   └── fliphouse.html          # Página de transición → SOFI, noindex (ex-caso legacy, retirado 2026-07-12)
├── portfolio/                  # Galería por eras — LIVE
│   ├── index.html
│   ├── portfolio.css
│   └── portfolio.js
├── cv/
│   ├── diego-maury-cv.pdf      # CV 2026 — LIVE
│   ├── diego-maury-pmo.html    # Variante CV enfocada en PMO (fuente HTML)
│   ├── diego-maury-pmo.pdf     # PDF generado desde diego-maury-pmo.html
│   └── gen-pdf.js              # Script que genera el PDF desde el HTML
├── backups/                    # index-v1-backup.html, index-v2.html (respaldos)
├── docs/
│   ├── superpowers/            # specs/ y plans/ de diseño (incluye plan de index-canonico.html)
│   └── platform/                # conventions.md, seo-model.md — spec de la futura plataforma Astro (ver sección abajo)
└── src/
    ├── content/                 # Astro Content Collections — Sprint 0.5, SIN implementar aún
    │   ├── config.ts             # Schemas Zod: cases, projects, playbooks, insights, services
    │   └── cases|projects|playbooks|insights|services/README.md
    └── services/pgPool.js       # Backend Phase 2 (chatbot RAG, pendiente)
```

> **Carpetas locales fuera de git (ver `.gitignore`):** `_ds_import/` (bundle de handoff de Claude Design) y `.claude-design/lab/` (variantes de diseño exploradas, `variant-a..f.html`) existen en el filesystem local pero **no están versionadas ni se despliegan**. `.playwright-mcp/` y `.superpowers/` tampoco. No tratarlas como fuente de verdad del sitio LIVE.

> **Analítica:** todas las páginas del sitio llevan Google Tag Manager (`GTM-NHT5827J`) y Microsoft Clarity (`x7ns7c22xi`) en el `<head>`.

## Comandos de desarrollo

```bash
# Servidor local (desde la raíz del repo)
python -m http.server 8080
# o: npx serve .
```

```bash
# Despliegue: simplemente push a master. GitHub Pages reconstruye solo.
git add -A && git commit -m "..." && git push origin master
```

```bash
# Exportar tarjetas sociales (desde la raíz)
node export_cards.js   # requiere puppeteer; genera exported_cards/card-01..10.png
```

## index-canonico.html — PREVIEW aislado (no confundir con index.html LIVE)

`index-canonico.html` es un archivo autocontenido (HTML+CSS+JS inline) en la raíz, creado según el plan `docs/superpowers/plans/2026-06-16-landing-canonica-bento.md` para probar un rediseño visual "Bento + Violeta" fiel a la maqueta canónica de Notion (SSOT: id `e5f9bb1b96224857a648b0212c3e9822`).

- **No es LIVE:** lleva `noindex,nofollow` y analítica desactivada en el `<head>`.
- **No está enlazado** desde ninguna página del sitio ni desde el sitemap.
- **Aislamiento total:** no modifica `assets/css/styles.css` ni `assets/js/main.js`; solo reutiliza fuentes locales vía `@font-face` e `isotipodm.svg`.
- Se sirve y compara localmente: `python -m http.server 8080` → `localhost:8080/index-canonico.html`.
- Regla del plan: **no inventar datos** — métricas y hechos deben venir del SSOT en Notion; si el SSOT no cubre algo, se marca y se confirma con Diego.

## Design system — v3 "Violeta Protagonista"

Tokens implementados en `assets/css/styles.css` (`:root`) y `assets/css/colors_and_type.css`. El folder externo del Design System fue eliminado el 2026-06-15; se migrará a otra herramienta (por definir).

### Paleta de color (tokens CSS en `:root`)

| Token | Hex | Uso |
|-------|-----|-----|
| `--dm-amethyst` | `#7C3FBE` | CTA primario, isotipo, identidad |
| `--dm-amethyst-600` | `#5E2A95` | Hover, depth |
| `--dm-catalyst` | `#4B2672` | Gradientes, bg bloques |
| `--dm-catalyst-700` | `#2E1547` | Hero bg, Contacto, Footer |
| `--dm-catalyst-900` | `#120D1A` | Hero backdrop, fondos oscuros |
| `--dm-ember` | `#FF5C39` | Highlights, tagline, accent border (NO CTA primario) |
| `--dm-spark` | `#E6B800` | Solo en KPIs y métricas de impacto |
| `--dm-quantum` | `#246BFD` | Links funcionales, status |
| `--dm-ink` | `#0F0A1A` | Secciones interiores, body bg |
| `--dm-bone` | `#F5F5F7` | Texto sobre oscuro |

Gradiente tricolor (firma): `--dm-tricolor` = Amethyst → Catalyst → Ember

### Tipografía

| Familia | Carga | Uso |
|---------|-------|-----|
| Satoshi Variable | Local `assets/fonts/` | Headlines, sección títulos, números |
| Inter | Google Fonts | Body, descripciones |
| JetBrains Mono | Google Fonts (upright) + Local italic | Labels, tags, métricas, nav links |

### Isotipo bg-pattern

El SVG `isotipodm.svg` se usa como fondo decorativo en todas las secciones via `.bg-pattern::before` con `background-image` CSS. Opacidad 0.022 en Ink, 0.03 en Catalyst. No modificar este patrón — es parte de la identidad visual.

## Secciones (orden en index.html)

1. **Hero** (fondo Catalyst-700) — tag Ember, headline Satoshi 800, sub, 2 CTAs, banda de 3 métricas
2. **Selected Work** (Ink) — 3 filas editoriales con número Spark, nombre, meta, métrica
3. **Trust Strip** (Ink) — logos de marcas: HEINEKEN, Tec, INCmty, FEMSA, HackSureste
4. **Testimonials** (Ink) — embed de Senja (pendiente de activar)
5. **Servicios** (Ink) — 3 tarjetas en grid con tag, nombre, entregables, tiempo
6. **About** (Ink) — 2 cols: bio texto izquierda, herramientas/chips + cómo trabajo derecha
7. **Experiencia** (Ink) — 4 roles en lista vertical: meta izquierda 220px, contenido derecha
8. **Contacto** (Catalyst-700) — 3 canales: calendario, email, LinkedIn

## Reglas de diseño

- **Idioma: español únicamente** — no hay toggle de idioma
- **Mobile-first:** breakpoints 375px, 768px, 1280px
- **Performance:** JS < 80 KB gzipped, CSS < 15 KB
- Animaciones solo en propiedades compositor-safe: `transform`, `opacity`
- Respetar `prefers-reduced-motion` (el JS de scroll reveal lo omite si está activo)

## Plantilla de caso de estudio

Estructura fija: Contexto → Problema → Objetivo (métrica+timeframe) → Mi rol → Acciones (3–5 bullets) → Resultados (métricas normalizadas) → Evidencia → Aprendizajes

Formato de cada logro: **Verbo + qué + cómo + impacto + timeframe**

## Estado del contenido

### Implementado (LIVE)
- `index.html` — **v3 "Ember on Ink" (Variante F canónica)** activo desde 2026-06-22
  - DS v2: Plus Jakarta Sans + DM Mono, bg `#0A0612`, acento único `--ember: #FF5C39`
  - Secciones S1-S9: Hero, Tesis/Traductor, Patrón Spine, Selected Work (H1/H2/H3 S-T-A-R), IP Propia, Evidencia Forense, Servicios, AI-Native, CTA Final
  - JS inline: scroll reveal (`data-reveal`/`is-visible`), contadores animados, nav activa, burger mobile
  - GTM-NHT5827J + Clarity x7ns7c22xi preservados
  - **Invariante DS:** el index.html usa tokens DS v2 inline; los casos y portfolio usan DS v3 de `assets/css/styles.css`
  - **Copy en voz de Diego (2026-07-10):** todo el copy narrativo del index está reescrito en primera persona + tuteo siguiendo el Writing DNA (Notion `7b7c6991078b407f9ae1031796cb7f0d`, fuente canónica de voz; corrige a "Estilo y voz"). Filo = postura + contraste "No es X. Es Y", NO sarcasmo. Sin em dash en contenido. Spec: `docs/superpowers/specs/2026-07-10-copy-voz-diego-index-design.md`.
  - **Etiquetas de métricas alineadas al SSOT en index:** 9,905 = "Participantes inscritos", agregado de programas INCmty (HGC incluido), estimado (NO cifra de HGC; retirado de la tarjeta HEINEKEN). +600% = ed. 1 a ed. 3 (2019-2021). HackSureste 3,000+ = estimado, no acumulable con INCmty, sin "5 ediciones".
  - **Los tres archivos publicables están alineados con la evidencia (2026-07-12, commit `005641d`, rama `feat/caso-sofi`).** `index.html`, `llms.txt` y `llms-full.txt` declaran ahora el grado de evidencia de cada cifra. Los dos `llms` abren con la leyenda de dos grados: **published** (tercero nombrado) y **own** (registros, CRM o estimación propia). Desaparecieron los encabezados "audit-ready": ninguna cifra está auditada. **OJO: el deploy sale de `master`. Mientras esto no se mergee, el sitio LIVE sigue publicando las cifras viejas.**
  - `backups/index-v2.html` — respaldo del diseño anterior "Deep Tech & Friction"
- `llms.txt` — live en raíz, visible en `diegomaury.mx/llms.txt`
- GTM-NHT5827J — instalado en `<head>` y `<body>` de index.html
- `cases/heineken.html`, `cases/innovation-systems.html`, `cases/redux-incmty.html` — LIVE (navegación desde v1; no enlazados desde v2 aún)
- `portfolio/index.html` — galería por eras — LIVE
- `cv/diego-maury-cv.pdf` — CV 2026
- Dominio `diegomaury.mx` con HTTPS activo

### Portfolio Upgrade v2 — Phase 1 COMPLETA (LIVE 2026-06-14)
Plan completo en Notion: "Plan de Acción — Portfolio Upgrade v2 (2026-06-13)"

Phase 1 (LIVE):
- Sección "Trinchera" — post-mortem HEINEKEN Green Challenge (3 fallos documentados); 2do caso "en preparación"
- Sección "Fraccional" — 3 modelos (Retainer mensual, Proyecto acotado, Asesoría estratégica) **sin rangos de precio**
- Tarjetas RODI — formato financiero en tarjetas de proyectos
- `llms.txt` y `llms-full.txt` publicados en raíz

Pendiente Phase 1:
- 2do post-mortem en Trinchera (por definir)

Pendiente Phase 2 (semana siguiente):
- Railway backend + Supabase pgvector + Claude API → chatbot RAG
- Widget chatbot en index.html

## Arquitectura futura — Sprint 0.5 (Astro, en definición, SIN implementar)

Fuente: `CHANGELOG.md` [v0.1.0] — 2026-06-27. Estas son decisiones de producto ya aprobadas y documentadas, pero **ningún código de Astro está activo todavía**. No confundir con el estado LIVE descrito arriba.

- **Framework decidido:** Astro (Islands Architecture, output HTML estático, MDX, compatible con GitHub Pages, zero-JS por defecto).
- **Content strategy:** Astro Content Collections — el contenido vivirá en `src/content/`, nunca dentro de los archivos de página. Los schemas Zod ya existen en `src/content/config.ts` (colecciones: `cases`, `projects`, `playbooks`, `insights`, `services`), cada una con su `README.md`.
- **Deploy futuro:** GitHub Pages seguirá sirviendo desde `master`, pero GitHub Actions correrá `astro build` → `/dist` (pendiente, Sprint 1).
- **Design System:** DS v2 (`_ds_import/`, no versionado) + DS v3 (`assets/css/`) se consolidarán en un único sistema de tokens canónico en Sprint 2.
- **Documentación de convenciones ya escrita** (vinculante desde Sprint 1, sin efecto hoy): `docs/platform/conventions.md` (naming, estructura de carpetas Astro, convención MDX/frontmatter, convención de assets) y `docs/platform/seo-model.md` (metadata, Open Graph, JSON-LD, sitemap vía `@astrojs/sitemap`).
- **Roles del proceso:** Diego Maury (Product Owner), ChatGPT (Product Strategist & UX Director), Silvia/Notion (Product Manager), Claude Code (Lead Software Engineer).
- **Roadmap (según CHANGELOG):** Sprint 0 (Product Foundation, pendiente de PRD) → Sprint 0.5 (Domain & Content Architecture, **en progreso** — deliverables ya completados: CHANGELOG.md, schemas, docs de convenciones y SEO) → Sprint 1 (Astro Setup, bloqueado hasta aprobar Sprint 0) → Sprint 2 (Design System) → Sprint 3 (Home) → Sprint 4 (Páginas internas) → Sprint 5 (Optimización, incluye implementación real del modelo SEO).
- **Regla operativa:** cualquier trabajo de implementación Astro requiere que Sprint 0 (PRD, IA, sitemap definitivo, wireframes) esté aprobado por Diego primero. No adelantar Sprint 1 sin esa aprobación.

## CMS Notion del portafolio — Fases A0+A1+B1 CERRADAS (2026-07-11)

Documentación completa: `docs/platform/cms-notion.md`. Resumen:

- **A0:** no existe pipeline Notion → sitio. Las propiedades `TD:*` eran residuo de un intento viejo (vacías en las 27 fichas) y se borraron. El sitio LIVE sigue siendo HTML editado a mano.
- **A1:** la base Notion `🗂️ SSOT - Portafolio Proyectos` (data source `88257bc9-e575-45e8-90df-f851f96e92f2`, 27 fichas) es ahora el CMS: 10 propiedades nuevas (`Estado publicación`, `Publicable`, `Capa`, `Canales`, `Capacidades`, `Métrica ancla`, `Organización`, `Tipo`, `Evidencia`, `Caso maestro`), 5 propiedades legacy deprecadas con prefijo `[DEPRECADO]` y 5 vistas.
- **B1:** los 15 casos publicables están escritos con la plantilla v2 en el cuerpo de su ficha, con bloque de evidencia ✔/✖ por afirmación. **Clasificación: 4 Insignia (SOFI, HEINEKEN Green Challenge, HackSureste, REDUX) / 11 Soporte / 12 Archivo.** Todas en `Draft` y `Publicable = No`.
- **A2 (front end):** el prototipo lo construye Diego en Claude Design. Brief de handoff en Notion `39a0fe3c51c581ba821ff977fb5946a4`.
- **Regla operativa:** nada pasa a `Estado publicación = Publicado` desde este proyecto. Publicar es decisión de Diego, y exige `Evidencia` + `Métrica ancla` verificadas. **No inventar cifras:** toda afirmación cuantitativa lleva artefacto o un ✖ explícito.
- **Cifras muertas, no resucitar:** el 9,905 NO es de HEINEKEN y no aparece en ninguna fuente documental. Las bolsas de premio de $80,000 (B-Challenge) y $120,000 (INC Prototype) no tienen respaldo. REDUX no son "200+ capacitados" sino 400+ solo en 2020 (Informe Anual 2020 del Tec). Tampoco resucitar las "5 ediciones" ni los "32 estados" de REDUX, ni el "36 registros" del sureste (la línea base documentada son **35 propuestas** el año previo a 2019, La Jornada Maya). BTEM es **Beca Talento Emprendedor**, no "Blockchain Tec de Monterrey".
- **La capa decide si falta evidencia bloquea:** solo las fichas **Insignia** necesitan `Métrica ancla` + `Evidencia` verificadas para publicarse. Una ficha **Soporte** puede vivir sin métrica ancla (FreeLand declara "Sin cifras registradas" y eso es correcto: el problema sería fingir que la tiene). No reportar una ficha de Soporte como pendiente que bloquea el gate. El gate hoy son dos insumos: la cifra final del sureste y la captura del directorio de metodologías del Tec.
- **Gotcha:** la propiedad `Objetivo con métrica y timeframe ` lleva un espacio al final de su nombre real.
- El mapeo Notion → Zod (`src/content/config.ts`) es **diseño TO-BE del Sprint 1**. Hoy no hay sincronización.

### Nota de diseño: nav scrollToSection
La función de scroll se llama `scrollToSection` (no `scrollTo` — conflicto con `window.scrollTo`).

## Auditoría integral del portafolio — remediación en curso (iniciada 2026-07-12)

Corpus fuente: `C:\Users\DiegoLocal\Downloads\auditoria\` (5 partes de auditoría + Evidence Register + matriz de remediación REM-001–020, no versionado en este repo). Rol de Claude: Strategic Evidence & Portfolio Remediation Partner — evalúa cada REM con criterio propio, no las ejecuta "tal como fueron redactadas". Autorización explícita de Diego requerida por cambio, uno a la vez.

**Regla operativa aprendida en esta sesión:** que dos superficies coincidan (p. ej. `index.html` y `llms-full.txt`) NO prueba que un claim sea correcto — ambas pueden compartir la misma estimación propia sin reconstruir. El estándar por claim público es: entidad, programa/edición, población, unidad, fuente o grado de evidencia. Si no se cumple, el claim se **retira sin nota que reconozca la inconsistencia** (una nota tipo "cifra agregada, desglose no reconstruido" expone el problema sin resolverlo — no se publica).

**Estado por REM (2026-07-12):**
- **REM-003 (HEINEKEN/INCmty):** hecho. `cases/heineken.html` — retirados 9,905, 900+/3,231 y #1 nacional (sin fuente reconciliable); +600% revisado con unidad/periodo/baseline/grado explícitos; nueva sección "Mecanismos de intervención" separa mecanismo de resultado.
- **REM-004 (FlipHouse → SOFI):** hecho. `cases/fliphouse.html` retirado como case study vigente → stub `noindex,follow` hacia SOFI. Limpieza en cascada: `sitemap.xml`, `portfolio/index.html` (bloque ERA 04 completo + ítem de índice lateral), footer de `cases/heineken.html`.
- **REM-005 (REDUX/INCmty/HackSureste):** **cerrado sin cambios por decisión explícita de Diego** ("déjalos"). `cases/redux-incmty.html` conserva 3,000+ (atribuido a INCmty aunque `llms-full.txt` lo asigna a HackSureste), &gt;$4M, 12 convocatorias, 200+/1,000+ sin reconciliar. **No volver a cuestionar esta decisión ni la separación de las tres entidades — ya está establecida.**
- **REM-007 (absolutos no demostrados):** hecho. `index.html` (2), `cases/sofi.html` (1), `cases/innovation-systems.html` (2) — "funciona sin mí" → "diseñado para que el equipo lo opere"; alucinación FSM ya no implica content-safety; "en producción" y "cualquier vertical" retirados sin artefacto.
- **REM-013 (reencuadrar RODI +1,291%): cerrado 2026-07-17.** Ya cumplido en `cases/sofi.html` desde su build original (modelado, cost-avoidance no ahorro realizado, sin auditoría externa, metodología a solicitud). Diego autorizó agregar el calificador en `index.html`: la mención en Selected Work (línea ~900) ahora lleva `data-metric="rodi-sofi"` y el texto "modelado (cost avoidance)" junto al valor. `node tools/verify-metrics.js` confirma 0 advertencias para `rodi-sofi` en `index.html`.
- **REM-009 (retirar/reconvertir "Innovation Systems Builder"):** hecho, 2026-07-13. `cases/innovation-systems.html` reescrito de agregador de métricas de 3 entidades no relacionadas a ensayo de patrón transversal. Retirados: KPI grid del hero, las 3 tarjetas de métricas por subcaso, la sección "Resultados consolidados", la mención de VAPI/voice AI (podía leerse como arquitectura vigente), el enlace de footer a `redux-incmty.html` (era navegación preexistente pero seguía dirigiendo tráfico a un caso congelado) y `card-01.png` en og:image/twitter:image (posible tarjeta social con cifras retiradas, pendiente de revisión aparte). Único enlace de evidencia canónica en la página: SOFI, desde el subcaso FlipHouse. Anchor `../#trabajo` (no `#work`, legacy).
- **REM-008 (contrato de evidencia por caso):** aprobado como **principio adaptado**, no el schema rígido de 10 bloques de SOFI. Regla mínima por tipo de claim (cuantitativo observado / estimación propia / modelo económico / cualitativo / post-handoff) — se aplica como criterio de validación en cambios futuros de cada caso, sin ejecución independiente. `redux-incmty.html` y `cases/fliphouse.html` quedan excluidos (congelado / ya no es caso vigente).
- **Pendientes:** REM-001/002/006 (infraestructura semántica y role chronology), REM-010/011/012 (Bloque D, seniority — gate por evidencia real, no por trabajo), REM-014–020 (enforcement técnico). Fuera de REM: `llms-full.txt` "flagship" (DIFF-002, diferido por Diego); revisión del asset `card-01.png`.

**Estado de git: remediación commiteada y desplegada.** Los commits `7f0b8d6` (REM-003/004/007) y `9d142fb` (REM-009) están en `master` y pushados a `origin/master` — el sitio LIVE ya publica la remediación. Registro en Notion: REM-003/004/007 con entradas del 2026-07-12; REM-009 con entrada del 2026-07-13 (creada el 2026-07-15).

## Caso SOFI — `cases/sofi.html` (LIVE desde 2026-07-12, mergeado a `master`)

Página de caso construida sobre el plan `docs/superpowers/plans/2026-07-11-artefactos-evidencia-sofi.md` y su spec. **LIVE y pública desde 2026-07-12:** `index, follow`, enlazada desde el work-item de FlipHouse en el index (`.work-case-link`) y dada de alta en el sitemap. Fue noindex y sin enlaces hasta que Diego aprobó publicarla.

- **Los data files son generados, no se editan a mano.** `assets/data/sofi/sofi-fsm.js`, `sofi-conversation.js` y `sofi-metrics.js` se producen con `tools/portfolio-export/` **en el repo de SOFI** (`Fliphouse-whatsapp-agent`, rama `feat/portfolio-export`), no en este repo. Cada uno asigna a `window.SOFI_*` y se carga con `<script src>`: por eso la página abre igual con `file://` que en Pages, sin `fetch` ni CORS. Para regenerar: `node tools/portfolio-export/build-fsm.js <ruta-del-sitio>`, `capture-run.js` (necesita Docker + `OPENROUTER_API_KEY` viva) y `build-metrics.js`.
- **El FSM no se dibuja.** Los 12 estados, los 3 terminales y el umbral 0.75 se extraen de `src/services/fsm.service.js` con un script. Si el código de SOFI cambia, se regenera el data file; no se toca el HTML.
- **La conversación del simulador es una corrida real contra el sistema** (webhook con firma HMAC válida, modelo real, FSM real), con lead ficticio. **No hay ningún dato de FlipHouse en el repo, y no debe haberlo.** No se extrae nada de la Postgres de producción: se descartó por innecesario, no solo por riesgoso.
- **Métrica de tests: 392, no la suite completa.** El conteo debe excluir `tests/portfolio-export/` (son tests del tooling de este portafolio, no del sistema SOFI). Con `npx jest` a secas saldrían 420 e inflaría la cobertura.
- **La sección "Lo que no puedo probar" es estructural, no decorativa.** Las tres métricas de negocio siguen en ✖. El RODI de +1,291% **no está bajo NDA**: es un modelo propio (cost-avoidance modelado, sin auditoría externa). Presentarlo como bloqueado por NDA lo haría sonar más sólido de lo que es.
- El video de `/brag` es **pieza de presentación, no evidencia**. El hueco existe en el hero y solo se renderiza si el archivo aparece.
- Pendiente/candidato: el dashboard `app.html` de SOFI es un artefacto publicable que la spec dejó fuera a propósito (tiene un bug conocido de mensajes duplicados).

## Registro en Notion — Portafolio D (SSOT de cambios del sitio)

Fuente: página Notion `Instrucciones para Claude Code — Portafolio D (Notion MCP)` (`8b47026a4a8243ba90431c0424338d14`). Schemas verificados contra Notion el 2026-07-12.

### Regla de oro

- El registro canónico de cambios del sitio es la base **📝 Changelog — Portafolio D** (tab "Registro de versiones" del hub Portafolio D).
- El `CHANGELOG.md` del repo es **espejo técnico, no fuente**. Si actualizas el repo, la entrada en Notion es obligatoria; el archivo es opcional.
- **No crear páginas sueltas** de changelog ni de documentación fuera de las bases listadas abajo.
- No inventar nombres de propiedades, opciones ni relaciones. Usar exactamente los que están aquí.

### Qué se registra

| Situación | ¿Entrada en Changelog? |
|-----------|------------------------|
| Cambio publicado en producción (copy, datos, diseño, estructura, SEO/llms, infraestructura) | Sí |
| Corrección de datos o evidencia (cifras, métricas, claims) | Sí, indicando el respaldo documental usado |
| Cambio de documentación del proyecto | Sí, con Componente `Documentación` |
| **Lección aprendida** (creencia técnica de Claude corregida por Diego o por evidencia) | Sí, con Componente `Lecciones Aprendidas`, Sección `General` |
| Trabajo menor sin publicar (borradores, experimentos locales) | No; se refleja en su tarea de Tareas y Misiones |

Las lecciones aprendidas se registran **doble**: en `~/.claude/memory/lessons-learned.md` (local, para Claude) y en el Changelog de Notion (canónico, para Diego). La entrada de Notion usa `Razón` = la creencia incorrecta y `Impacto` = la corrección y su fuente.

**Granularidad: un commit registrable = una entrada = una tarea.** No agrupar varios commits en una sola entrada, por pequeños que sean, ni "aprovechar" una entrada existente porque el cambio es parecido o del mismo día. Si el commit cae en la tabla de arriba, tiene su propia entrada y su propia tarea. Los commits que no caen en la tabla (refactors internos, experimentos, WIP) no generan nada.

### Base 📝 Changelog — Portafolio D

- Database: `b998e8e4664a45ae89f0f349876cec4b` · data source: `collection://652b68c7-9cf5-441c-957c-f18b055db8b8`
- Propiedades (nombres reales):
  - **Cambio** (title) — título corto tipo commit, ej. `Fix: cifras del hero alineadas a evidencia`
  - **Fecha** (date) — fecha de publicación, `YYYY-MM-DD`
  - **Componente** (select, una): `Copy` · `Datos y evidencia` · `Diseño` · `Estructura` · `SEO / llms` · `Infraestructura` · `Documentación` · `Lecciones Aprendidas`
  - **Sección** (multi-select, una o varias): `Hero` · `Casos` · `Servicios` · `About` · `Testimonios` · `Editorial` · `Contacto` · `llms.txt` · `General`
  - **Razón** (text) — por qué se hizo, 1-2 líneas
  - **Impacto** (text) — efecto en el sitio o el posicionamiento, 1-2 líneas
  - **Tareas y Misiones** (relation) — tarea que originó o dará seguimiento al cambio
- En el cuerpo de la fila (opcional): archivos tocados, antes/después del copy, fuentes de evidencia, enlaces a commits.

### Seguimiento en Tareas y Misiones

**TODA ENTRADA DE CHANGELOG AMERITA CREAR UNA TAREA, pero no toda tarea creada amerita un Changelog.** La relación es unidireccional:

- Changelog → tarea: **siempre**. No hay entrada sin su tarea propia en **Tareas y Misiones** (`3190fe3c51c58002a2f5da54caac485a` · `collection://3190fe3c-51c5-8074-a302-000b97e8a410`). Sin excepciones, aunque el cambio ya esté hecho y aunque exista una tarea parecida.
- Tarea → changelog: **solo si el trabajo cae en la tabla de arriba**. Una tarea de exploración, de borrador o de decisión pendiente vive sola, sin entrada en el changelog. No inflar el changelog con trabajo que no se publicó.

Crear la tarea con:

- **Nombre de tarea**: `Documentar cambio: <título del cambio>`
- **Estado**: `Por empezar`, o el que refleje la realidad (ver abajo)
- **Prioridad**: `Media` por defecto
- **Proyectos, Ideas y Locuras de Diego**: vincular a la página `Portafolio D` (`2db0fe3c51c5805dabc7d220b38ce405`)
- **Resumen**: qué falta documentar o verificar del cambio

Luego vincularla desde la propiedad `Tareas y Misiones` de la entrada del changelog.

**Cardinalidad: una entrada puede tener varias tareas, pero una tarea no puede tener varios changelogs.**

- Una entrada del changelog puede vincular **varias** tareas relacionadas, además de la suya propia.
- Una tarea pertenece a **una sola** entrada del changelog. Antes de vincular una tarea preexistente, verificar que su propiedad `Changelog — Portafolio D` esté vacía. **Si ya tiene una entrada, no reutilizarla:** dejarla donde está y crear la tarea nueva de esta entrada.
- Regla práctica: la tarea propia siempre es nueva. Las tareas preexistentes solo se enganchan si están huérfanas de changelog.

**Cerrar la tarea es parte del trabajo, no un extra.** El `Estado` refleja la realidad, no la intención:

- Si el trabajo de la tarea quedó terminado en la misma sesión → `Estado = Terminada`. No dejar tareas en `Por empezar` cuando ya están hechas.
- Si quedó a medias → `En proceso`, con el `Resumen` diciendo qué falta.
- Si depende de una decisión de Diego o de un tercero → `Bloqueada`, diciendo de qué depende.
- Estados válidos: `Por empezar` · `En proceso` · `Bloqueada` · `Terminada` · `Archivada`.

### Documentación del proyecto

- Vive en la base **📁 Product Requirements Document - Portfolio** (tab "Documentación" del hub, `3190fe3c51c580f4a46bf9786c3b79f9` · `collection://3190fe3c-51c5-8005-aefb-000b5d0eff53`). Nunca como páginas sueltas de nivel superior ni como subpáginas de tareas.
- Propiedades: **Nombre** (title) · **Tipo** (`Volumen`, `Proyecto`, `Caso de estudio`, `Página`, `Recurso`) · **Fase** (`Diagnóstico`, `Copy`, `Ejecución`, `Optimización`, `Referencia`) · **Estado** (`To do`, `En progreso`, `Hecho`) · **Fecha** · **Resumen** · **Link** · **Prioridad** (número).
- Antes de publicar copy o datos, verificar contra los SSOT: SSOT - Identidad, SSOT - Portafolio, y los Canónicos (Canónico - CV Maestro, Canónico - Copy LinkedIn, en la Diego Maury WIKI). **Los claims sin respaldo documental no se publican.**
- Si una versión nueva reemplaza un documento, la anterior se archiva o se marca obsoleta. Nunca deben coexistir dos versiones vigentes.

### Registro de aprendizajes (memoria)

Cada vez que se aprende algo nuevo que no es derivable del código ni del historial de git, se registra **en el momento**, no al final:

- **Memoria del proyecto** — `~/.claude/projects/C--Users-DiegoLocal-Documents-Claude-Projects-Claude-Code-newlandingpage/memory/`: un archivo por hecho, con frontmatter (`name`, `description`, `metadata.type` = `user` | `feedback` | `project` | `reference`), más una línea de índice en `MEMORY.md` (`- [Título](archivo.md) — gancho`). Antes de crear, revisar si ya existe un archivo que cubra el hecho y actualizarlo en vez de duplicar. Si un aprendizaje resulta falso, borrar el archivo.
- **Invariante del proyecto** (comportamiento del sistema, restricción técnica, convención) → va al `CLAUDE.md` de este repo, no a memoria.
- **Creencia técnica corregida** (Claude asumió algo, Diego o la evidencia lo desmintió) → entrada en `~/.claude/memory/lessons-learned.md` con el formato del protocolo de cierre (creencia incorrecta / corrección / fuente / contexto) **y** entrada en el Changelog de Notion con Componente `Lecciones Aprendidas` y Sección `General`.
- **Cifras y claims** — todo aprendizaje sobre datos del portafolio se valida contra los SSOT antes de guardarse. Las cifras muertas listadas arriba (9,905 como HEINEKEN, bolsas de $80,000 y $120,000, "200+ capacitados" de REDUX) no se resucitan en memoria ni en el sitio.

### Al cerrar sesión (`/close-session`)

El paso 5 del protocolo (`~/.claude/commands/close-session.md`) es "Notion — Inbox", que **no aplica a este proyecto** (ese flujo es de SOFI). En este repo, el cierre corre así:

1. **Lecciones aprendidas** → `~/.claude/memory/lessons-learned.md` si hubo una creencia técnica corregida.
2. **CLAUDE.md** → agregar los invariantes nuevos descubiertos en la sesión.
3. **Memoria del proyecto** → crear o actualizar los archivos en `memory/` + su línea en `MEMORY.md`.
4. **Notion** → para cada uno de estos casos de la sesión (cambio publicado en producción, corrección de datos/evidencia, cambio de documentación, **o lección aprendida del paso 1**): crear su **tarea propia nueva** en Tareas y Misiones, crear la entrada en el **Changelog — Portafolio D** con las propiedades exactas de arriba, y vincularlas. Nunca reciclar una tarea existente como la tarea de la entrada. Si no hubo ninguno de esos casos, omitir y decirlo en el resumen.
5. **Barrido de pendientes** → ningún pendiente sobrevive fuera del sistema, aunque no amerite entrada de changelog. Listar todos los pendientes y pasos a seguir identificados en la sesión; clasificar cada uno: si ya existe tarea relacionada, actualizar su `Estado` y `Resumen` (nunca dejarla desactualizada); si no existe, crear una nueva en **Tareas y Misiones** con nombre accionable, `Estado` real (`Por empezar` o `Bloqueada`), `Prioridad` `Media` por defecto, **Portafolio D** asignado como proyecto en **Proyectos, Ideas y Locuras de Diego**, y `Resumen` con contexto suficiente para retomar sin releer la sesión. Buscar por título exacto antes de crear (anti-duplicados). Umbral: solo pendientes que requieren acción futura real; lo que se resuelve en menos de 2 minutos se resuelve en la sesión y no se registra. El resumen final debe mapear cada pendiente a su tarea (con link) — si un pendiente no tiene tarea, la sesión no está cerrada.
6. **Estado de las tareas** → actualizar el `Estado` de toda tarea que se haya trabajado en la sesión. Terminada es `Terminada`, no `Por empezar`.
7. **Resumen al usuario** → qué se registró en cada uno de los destinos.

Buscar en Notion por **título exacto**, workspace **Notion de Diego**.

## SSOT de Métricas — SOP de publicación (desde 2026-07-16)

Spec: `docs/superpowers/specs/2026-07-15-ssot-metricas-design.md`. Base maestra: **📊 Métricas oficiales — Portafolio D** en Notion (data source `collection://213ea2d0-bffc-41b9-9877-92132551461c`, bajo el hub Portafolio D). Espejo: `assets/data/metrics.json` (generado desde la base, no editar a mano sin sincronizar con Notion).

Toda publicación que toque métricas o copy con métricas sigue este orden, sin excepciones:

1. Sincronizar Notion → `assets/data/metrics.json`
2. Resolver placeholders `{{metrica:slug}}` si se ejecuta una maqueta
3. `node tools/verify-metrics.js`
4. Corregir discrepancias hasta exit 0
5. Commit
6. Push
7. Entrada en el Changelog — Portafolio D

Reglas: una métrica nueva se da de alta primero en la base Notion (nunca directo en el JSON); las cifras muertas viven en la base como `Retirada` y el verificador las acusa; los borradores pueden llevar cifras literales, lo publicable no. **Sesión 2 cerrada (2026-07-17):** 11 métricas en la base (10 seed + `sofi-leads-campana`); `index.html`, `cases/heineken.html` y `cases/sofi.html` marcados con `data-metric` (`cases/redux-incmty.html` e `innovation-systems.html` quedan sin marcar a propósito, ver más abajo); `llms.txt`/`llms-full.txt` ya no solo escanean la lista negra de Retiradas — `verifyText` valida match completo contra `metrics.json` vía `huerfanasEnTexto`. La Maqueta Sitio v2 en Notion (`2e0bbf20-7ead-49e8-812c-34032cfda454`) ya usa placeholders `{{metrica:slug}}`. Tests del verificador: `node --test tools/verify-metrics.test.js` (23 tests).

**`cases/redux-incmty.html` no se marca con `data-metric` — es intencional, no un pendiente.** La página está congelada por REM-005 (ver sección de auditoría abajo): sus cifras de "3,000+" atribuidas a INCmty no reconcilian con el slug `hacksureste-participantes` del SSOT (misma cifra, entidad distinta). Marcarla forzaría una atribución incorrecta. `cases/innovation-systems.html` tampoco se marca — sus "30%"/"100%" son datos operativos del cliente (crédito puente, calificación manual), no claims del SSOT de Diego.

**`calificadorClaves` debe usar la raíz de la palabra, no la forma flexionada.** El chequeo de calificador es un substring (`ventana.includes(clave)`), no coincidencia de palabra completa. `"estimado"` como clave no matchea `"estimada"` (concordancia de género con el sustantivo, ej. "cifra final estimada") y el verificador bloquea con un error de calificador faltante aunque el calificador esté presente. Usar la raíz sin terminación (`"estimad"`) para que cubra ambos géneros y el plural.

**`heineken-proyectos-evaluados` (3,231) — confirmada como dato real por decisión explícita de Diego (2026-07-17), no como hallazgo pendiente.** Estado `Vigente`/`Pública` en el SSOT, marcada con `data-metric` en `index.html` (métrica del hero + mención en Selected Work). REM-003 la retiró solo de `cases/heineken.html` por fuente no reconciliable; esa página no se toca. No volver a marcarla como hallazgo ni a cuestionar la decisión.

## Multimedia y evidencia visual (desde 2026-07-17, commit `6017a60`)

- Los assets viven en `assets/img/cases/` (banners+logos de HGC/REDUX/HackSureste), `assets/img/evidencia/` (11 capturas: informes del Tec, La Jornada Maya, playlists, Talent Land) y `assets/img/logos/`.
- **Integrado en LIVE:** galería "Evidencia" en `cases/heineken.html` (5 artefactos con grado declarado: fuente publicada / registro propio) + banner en su hero; banners fotográficos en Selected Work del `index.html` (HEINEKEN y HackSureste; FlipHouse conserva logo, no tiene banner publicable); banner+logo por era y galería de artefactos en `portfolio/` (BTEM y Talent Land excluidos por regla de coincidencia de entidad; nada de FlipHouse por REM-004); logo FlipHouse y hover states en `cases/sofi.html`; solo CSS decorativo en `innovation-systems.html` (REM-009).
- **Regla de las tarjetas de evidencia: cero cifras nuevas en captions/alt.** Las cifras de los artefactos (3,975, 562, 2,400...) NO están en el SSOT de métricas; describir el artefacto sin números. Darlas de alta en Notion primero si algún día se quieren en texto.
- Gotcha de DS: `.bg-pattern` de styles.css trae `pointer-events: none`; si una sección lo usa directo (como en sofi.html), hay que devolverle `pointer-events: auto`.
- `cases/heineken.html` ya no usa `card-01.png` como og:image (usa su banner). `index.html`, `portfolio/index.html` y `redux-incmty.html` todavía lo referencian — pendiente con tarea propia.

## Maqueta Sitio v2 — parcialmente ejecutada (verificado 2026-07-17)

La página Notion "🧱 Maqueta Sitio v2 · Copy final" (`2e0bbf20-7ead-49e8-812c-34032cfda454`) es la spec de copy TO-BE con checklist de ejecución. **Estado real del sitio contra su checklist:** ya ejecutado: "10+ años (7+ en innovación)" propagado, nav sin etiquetas internas, bloque "¿Estás contratando full time?" (índex ~línea 1233). Pendiente: H1 del hero ("Transformo ambición..." vs. el actual "Tomo operaciones ambiguas..."), regla de exactamente 3 métricas ancla en el hero (hoy hay 5), autopsias con titular-lección (aún dicen "Autopsia"), mover "El patrón" después de la evidencia, SOFI en Sistemas propios. Sus checkboxes NO se sincronizan solos: verificar contra el HTML antes de afirmar estado. El as-built completo vive en la página Notion "Sitemap as-built — diegomaury.mx (2026-07-17)" (base Documentación del hub).

## Idioma de respuestas

Responder siempre en español.
