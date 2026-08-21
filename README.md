# Diego Maury — Portafolio Profesional

Sitio en **[diegomaury.mx](https://diegomaury.mx)** · construido con Astro y desplegado vía **Cloudflare Pages** (Git integration, rama `master`) desde 2026-08-02.

---

## Stack

- Astro `^5.18.2` (Content Layer API), CSS y JS vanilla — sin framework de UI
- Contenido (casos, métricas, copy del home, imágenes) leído en build time desde Notion vía `src/services/notionLoaders.ts` — ver sección **CMS** abajo
- Sitio **bilingüe ES/EN**: ES es el locale default (`/`, `/portfolio`), EN vive bajo `/en/*`, traducido automáticamente vía DeepL API en build time
- Deploy: **Cloudflare Pages** (Git integration directa con este repo, rama `master`) — cualquier `git push` a `master` dispara `astro build` y publica `dist/`. No hay GitHub Actions ni workflow manual.
- **Auto-publish desde Notion:** un Cloudflare Worker (`notion-deploy-relay`) recibe webhooks nativos de Notion sobre las fuentes editables del CMS (casos, imágenes, copy del home) y dispara el mismo rebuild — editar solo en Notion también republica el sitio solo, sin necesidad de un push a git.
- Dominio: `diegomaury.mx` con HTTPS activo
- Analítica: Google Tag Manager (`GTM-NHT5827J`). Microsoft Clarity fue retirado (2026-08-02).

## CMS (Notion como fuente de contenido)

Cuatro bases de Notion alimentan el sitio en build time, sin dato hardcodeado en el código:

| Base Notion | Colección Astro | Qué controla |
|---|---|---|
| 🗂️ SSOT - Portafolio Proyectos | `cases` | Fichas de caso (`/portfolio/{slug}`), formato CAR (Contexto → Acción → Resultado) |
| 📊 Métricas oficiales — Portafolio D | `metrics` | Cifras públicas del sitio, cada una con grado de evidencia declarado (`published`/`own`/`belief`) |
| 🖼️ CMS Imágenes — Portafolio D | `imageSlots` | Fotos hardcodeadas del sitio (hero, logos del trust bar, evidencia) |
| Copy Oficial · diegomaury.mx (SSOT) | `siteCopy` | Copy del home (secciones S1–S8) y del listado de portfolio (P1–P5) |

Publicar (`Estado publicación = Publicado`) es decisión exclusiva de Diego. Un caso `Insignia` exige métrica ancla + evidencia verificada (gate en `src/content/config.ts`); un caso `Soporte` puede publicarse sin métrica ancla.

**Cache en build, versionado en git:** las imágenes de Notion (URLs S3 firmadas que expiran en ~1h) se descargan, recomprimen a WebP y cachean en `public/cms-media/notion/`; las traducciones DeepL se cachean por hash de contenido en `public/cms-media/notion/translations/`. Ambos caches se versionan en git (excepción al patrón `.gitignore` habitual) porque Cloudflare Pages clona el repo limpio en cada build — sin esto, cada deploy recomprimiría/re-traduciría todo el sitio desde cero.

## Estructura

```
/
├── src/                         # Astro real: esto define el sitio LIVE
│   ├── pages/index.astro        # Home ES (S1-S8, lee el singleton siteCopy)
│   ├── pages/en/index.astro     # Home EN (mismo parseo ES + traduccion a nivel de hoja)
│   ├── pages/portfolio.astro    # Listado de casos ES (colección `cases`)
│   ├── pages/portfolio/[slug].astro     # Caso individual ES (plantilla CAR)
│   ├── pages/en/portfolio/[slug].astro  # Caso individual EN (mismo componente CaseArticle)
│   ├── components/case/CaseArticle.astro # Markup compartido ES/EN de la ficha de caso
│   ├── utils/homeContent.ts     # Logica pura compartida ES/EN del home (guardrails, geometria S4, CTAs)
│   ├── services/notionLoaders.ts     # Loaders de Astro Content Layer (fetch + mapeo Notion → Zod)
│   ├── services/notionImageCache.ts  # Cache de imagenes Notion (cache-hit + recompresion WebP)
│   └── services/deeplTranslationCache.ts # Cache de traducciones DeepL
├── public/                      # Se copia 1:1 a dist/: 404.html, portfolio/*.html y cases/*.html (stubs de redirect al CMS), assets/, cv/, cms-media/
├── robots.txt / _redirects
├── llms.txt / llms-full.txt     # Contexto para LLMs
├── docs/platform/                # cms-notion.md · conventions.md · seo-model.md · notion-astro-contract.md
├── docs/superpowers/             # Specs y planes de diseño
└── tools/ · scripts/ · tests/    # Verificador de métricas, QA visual/a11y (Playwright, suite Astro)
```

Nota: `index.html`, `404.html` (de raíz), `portfolio/index.html`, `portfolio/sofi.html`, `politicas-privacidad.html`, `terminos-y-condiciones.html`, `version2/` y los 3 HTML completos de `portfolio/*.html`/`cases/*.html` **fueron eliminados** (2026-08-13 y 2026-08-20) — eran código muerto sin copia en `public/`, reemplazados por sus equivalentes en `src/pages/*.astro` o por stubs de redirect de 18 líneas. `assets/css/styles.css` (DS legacy) también se eliminó (2026-08-20): sin consumidor real desde que esos HTML pasaron a ser puros redirects.

## Desarrollo local

```bash
npx astro build
npx astro dev
```

## Deploy

Push a `master` dispara el build en Cloudflare Pages (`astro build`, requiere el secret `NOTION_TOKEN` configurado en el proyecto de Cloudflare Pages) → publica `dist/` en `diegomaury.mx`. Un cambio hecho solo en Notion (sin tocar código) también republica solo, vía el Worker `notion-deploy-relay`.

```bash
git add -A && git commit -m "..." && git push origin master
```

Verificar el estado de un deploy: dashboard de Cloudflare Pages del proyecto `newlandingpage`, o la API de Cloudflare Pages.

## Design System

Design system único "Ember on Ink" (`src/styles/*.css`, tokens en `src/styles/variables.css`): bg `#0A0612`, acento único `--ember: #FF5C39`, tipografía Plus Jakarta Sans + DM Mono. Detalle completo en `CLAUDE.md`.

## Registro de cambios

El registro canónico de cambios del sitio es la base **Changelog — Portafolio D** en Notion, no este repositorio.

Toda cifra publicada declara su grado de evidencia (documentada o estimada). **Los claims sin respaldo documental no se publican.** El protocolo completo está en `CLAUDE.md`.

## Estado del proyecto

- Sitio construido con Astro, desplegado vía Cloudflare Pages, con auto-publish desde Notion
- Home (`/` y `/en`) y `/portfolio` (`/en/portfolio`) leen contenido real de Notion en build time (sin datos hardcodeados)
- 29 casos publicados en el CMS (`/portfolio`), en ambos locales: 4 Insignia (HEINEKEN Green Challenge, REDUX, SOFI, HackSureste — exigen métrica ancla + evidencia verificada) y 25 Soporte
- Cifras del sitio alineadas a la evidencia verificada, con gate bloqueante (`tools/verify-metrics.cjs`) y 3 grados declarados (`published`/`own`/`belief`)
- Plantilla de caso: formato CAR (Contexto → Acción → Resultado). SOFI es el primer caso migrado; el resto sigue el formato anterior mientras se reescribe su contenido (Diego redacta la narrativa, no se genera con IA)

## Contacto

Diego Maury · [diegomaury.mx](https://diegomaury.mx)
