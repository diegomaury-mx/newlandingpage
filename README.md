# Diego Maury — Portafolio Profesional

Sitio en **[diegomaury.mx](https://diegomaury.mx)** · construido con Astro y desplegado vía **Cloudflare Pages** (Git integration, rama `master`) desde 2026-08-02.

---

## Stack

- Astro `^5.18.2` (Content Layer API), CSS y JS vanilla — sin framework de UI
- Contenido (casos, métricas, copy del home) leído en build time desde Notion vía `src/services/notionLoaders.ts`
- Deploy: **Cloudflare Pages** (Git integration directa con este repo, rama `master`) — cualquier `git push` a `master` dispara `astro build` y publica `dist/`. No hay GitHub Actions ni workflow manual.
- **Auto-publish desde Notion:** un Cloudflare Worker (`notion-deploy-relay`) recibe webhooks nativos de Notion sobre las fuentes editables del CMS (casos, imágenes, copy del home) y dispara el mismo rebuild — editar solo en Notion también republica el sitio solo, sin necesidad de un push a git.
- Dominio: `diegomaury.mx` con HTTPS activo
- Analítica: Google Tag Manager (`GTM-NHT5827J`). Microsoft Clarity fue retirado (2026-08-02).

## Estructura

```
/
├── src/                         # Astro real: esto define el sitio LIVE (pages, content collections, notionLoaders)
│   ├── pages/index.astro        # Home (S1-S8, lee el singleton siteCopy)
│   ├── pages/portfolio.astro    # Listado de casos (colección `cases`)
│   └── pages/portfolio/[slug].astro  # Caso individual (plantilla CAR)
├── public/                      # Se copia 1:1 a dist/: 404.html, 3 casos legacy en portfolio/*.html, cases/*.html (stubs de redirect), assets/, cv/
├── portfolio/                   # Quedan 3 casos legacy en HTML puro (heineken, redux-incmty, innovation-systems), servidos vía public/portfolio/
├── robots.txt / _redirects
├── llms.txt / llms-full.txt     # Contexto para LLMs
├── assets/                      # Servido vía public/ — CSS legacy (DS "Ember on Ink"), fuentes, JS, data (metrics.json, sofi/*)
├── cases/                       # Solo stubs de redirect → portfolio/*.html
├── docs/platform/                # cms-notion.md · conventions.md · seo-model.md · notion-astro-contract.md
├── docs/superpowers/             # Specs y planes de diseño
└── tools/ · scripts/ · tests/    # Verificador de métricas, QA visual/a11y (Playwright)
```

Nota: `index.html`, `404.html`, `portfolio/index.html`, `portfolio/sofi.html`, `politicas-privacidad.html`, `terminos-y-condiciones.html` y `version2/` de la raíz **fueron eliminados** (2026-08-13) — eran código muerto sin copia en `public/`, reemplazados por sus equivalentes en `src/pages/*.astro`.

## Desarrollo local

```bash
# Servidor de HTML legacy (no toca el build de Astro)
python -m http.server 8080

# Build/preview real de Astro (esto es lo que corre en producción y define el sitio LIVE)
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

Design system único "Ember on Ink" (`assets/css/styles.css` para el legacy, tokens replicados en `src/styles/` para Astro): bg `#0A0612`, acento único `--ember: #FF5C39`, tipografía Plus Jakarta Sans + DM Mono. Detalle completo en `CLAUDE.md`.

## Registro de cambios

El registro canónico de cambios del sitio es la base **Changelog — Portafolio D** en Notion, no este repositorio.

Toda cifra publicada declara su grado de evidencia (documentada o estimada). **Los claims sin respaldo documental no se publican.** El protocolo completo está en `CLAUDE.md`.

## Estado del proyecto

- Sitio construido con Astro, desplegado vía Cloudflare Pages, con auto-publish desde Notion
- Home (`/`) y `/portfolio` leen contenido real de Notion en build time (sin datos hardcodeados)
- 14 casos publicados en el CMS (`/portfolio`): HEINEKEN Green Challenge, REDUX, SOFI, HackSureste, BTEM, INCmty B-Challenge, INCmty Accelerator, INCmty DisruptAir Challenge 2022, INC Prototype, FreeLand, BRAiN México, G20 YEA Model, HackSureste Ciudad del Carmen 2019, Haz que pase - Substack
- Cifras del sitio alineadas a la evidencia verificada, con gate bloqueante (`tools/verify-metrics.cjs`)
- Plantilla de caso: formato CAR (Contexto → Acción → Resultado). SOFI es el primer caso migrado; el resto sigue el formato anterior mientras se reescribe su contenido

## Contacto

Diego Maury · [diegomaury.mx](https://diegomaury.mx)
