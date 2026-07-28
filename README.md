# Diego Maury — Portafolio Profesional

Sitio en **[diegomaury.mx](https://diegomaury.mx)** · LIVE desde 2026-05-13 · construido con Astro y desplegado vía GitHub Actions desde 2026-07-25

---

## Stack

- Astro `^5.18.2` (Content Layer API), CSS y JS vanilla — sin framework de UI
- Contenido (casos, métricas, copy del home) leído en build time desde Notion vía `src/services/notionLoaders.ts`
- Deploy: **GitHub Pages con Source = GitHub Actions** (`build_type: workflow`, no branch/raíz) — `.github/workflows/deploy.yml` corre `astro build` en cada push a `master` y publica `dist/`
- Dominio: `diegomaury.mx` con HTTPS activo
- Analítica: Google Tag Manager (`GTM-NHT5827J`) + Microsoft Clarity (`x7ns7c22xi`) en todas las páginas

## Estructura

```
/
├── src/                         # Astro real: esto define el sitio LIVE (pages, content collections, notionLoaders)
│   ├── pages/index.astro        # Home (S1-S8, lee el singleton siteCopy)
│   ├── pages/portfolio.astro    # Listado de casos (colección `cases`)
│   └── pages/portfolio/[slug].astro  # Caso individual
├── public/                      # Se copia 1:1 a dist/: 404.html, legal, portfolio/*.html legacy, cases/*.html, assets/, cv/
├── index.html · portfolio/index.html · 404.html (raíz)  # MUERTOS para LIVE, se conservan en el repo sin servirse (ver CLAUDE.md)
├── index-canonico.html · prototipo-portafolio.html      # Previews aislados, noindex, no enlazados
├── robots.txt / sitemap.xml
├── CNAME                        # diegomaury.mx
├── llms.txt / llms-full.txt     # Contexto para LLMs
├── assets/                      # Servido vía public/ — CSS (DS "Ember on Ink"), fuentes, JS, data (metrics.json, sofi/*)
├── cases/                       # Solo stubs de redirect → portfolio/*.html
├── docs/platform/                # cms-notion.md · conventions.md · seo-model.md · notion-astro-contract.md · manual-cms.md
├── docs/superpowers/             # Specs y planes de diseño
└── tools/ · scripts/ · tests/    # Verificador de métricas, QA visual/a11y (Playwright)
```

## Desarrollo local

```bash
# Servidor de HTML legacy (no toca el build de Astro)
python -m http.server 8080

# Build/preview real de Astro (esto es lo que corre en CI y define el sitio LIVE)
npx astro build
```

## Deploy

Push a `master` dispara `.github/workflows/deploy.yml` (GitHub Actions): `astro build` (requiere el secret `NOTION_TOKEN`) → sube `dist/` → `actions/deploy-pages`. No hay pasos manuales.

```bash
git add -A && git commit -m "..." && git push origin master
```

## Design System

El index.html usa tokens DS v2 inline (paleta "Ember on Ink", bg `#0A0612`, acento único `--ember: #FF5C39`, tipografía Plus Jakarta Sans + DM Mono). Casos de estudio y portfolio usan el DS v3 "Violeta Protagonista" definido en `assets/css/styles.css`. Detalle completo en `CLAUDE.md`.

## Registro de cambios

El registro canónico de cambios del sitio es la base **Changelog — Portafolio D** en Notion, no este repositorio. `CHANGELOG.md` es un espejo técnico: puede quedarse atrás, la entrada en Notion no.

Toda cifra publicada declara su grado de evidencia (documentada o estimada). **Los claims sin respaldo documental no se publican.** El protocolo completo está en `CLAUDE.md`.

## Estado del proyecto

- Sitio construido con Astro y desplegado vía GitHub Actions — LIVE desde 2026-07-25
- Home (`/`) y `/portfolio` leen contenido real de Notion en build time (sin datos hardcodeados)
- Los 4 casos del CMS (`/portfolio`): Heineken, REDUX, SOFI, HackSureste
- Cifras del sitio y de los `llms.txt` alineadas a la evidencia verificada, con gate bloqueante (`tools/verify-metrics.cjs`)

## Actividades recientes (resumen)

- 2026-07-28: Generada relación de páginas publicadas → archivos fuente en `docs/published-pages-map.*` (MD/JSON/CSV).
- 2026-07-28: Escaneo de assets públicos y creado `docs/published-assets-report.json` y `docs/published-assets-report.csv` (lista de HTML, JS, CSS, fonts, imágenes y datos bajo `public/`).
- CHANGELOG actualizado con entradas sobre los artefactos anteriores.

Los archivos en `docs/` sirven para auditoría, validación y para construir checks CI que verifiquen que cada recurso publicado tenga su origen en el repo.

## Contacto

Diego Maury · [diegomaury.mx](https://diegomaury.mx) · hola@diegomaury.mx
