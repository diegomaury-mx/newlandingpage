# Diego Maury — Portafolio Profesional

Sitio estático desplegado en **[diegomaury.mx](https://diegomaury.mx)** · LIVE desde 2026-05-13

---

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks, sin build system)
- Deploy: **GitHub Pages sirviendo desde `master` / raíz** — cada push a `master` redespliega automáticamente
- Dominio: `diegomaury.mx` con HTTPS activo
- Analítica: Google Tag Manager (`GTM-NHT5827J`) + Microsoft Clarity (`x7ns7c22xi`) en todas las páginas

## Estructura

```
/                               # raíz de master = sitio (deploy source)
├── index.html                  # Página principal — LIVE
├── robots.txt / sitemap.xml
├── CNAME                       # diegomaury.mx
├── .nojekyll                   # deshabilita el pipeline Jekyll de GitHub Pages
├── llms.txt / llms-full.txt    # Contexto para LLMs
├── assets/
│   ├── css/styles.css          # Design tokens v3 + componentes (cases/portfolio)
│   ├── fonts/ · fonts-v2/       # Tipografía local
│   ├── js/main.js              # Nav activa + scroll reveal
│   └── img/                    # Isotipo, logos, patrones
├── cases/                      # Casos de estudio (Heineken, Innovation Systems, REDUX, FlipHouse)
├── portfolio/                  # Galería por eras
├── cv/                         # CV en PDF
├── backups/                    # Respaldos de versiones anteriores del index
├── src/                        # Content collections (Astro, en preparación — ver CHANGELOG.md)
└── docs/                       # Specs y planes de diseño
```

## Desarrollo local

```bash
python -m http.server 8080
# o: npx serve .
```

## Deploy

No requiere pasos manuales: cualquier push a `master` dispara el rebuild de GitHub Pages.

```bash
git add -A && git commit -m "..." && git push origin master
```

## Design System

El index.html usa tokens DS v2 inline (paleta "Ember on Ink", bg `#0A0612`, acento único `--ember: #FF5C39`, tipografía Plus Jakarta Sans + DM Mono). Casos de estudio y portfolio usan el DS v3 "Violeta Protagonista" definido en `assets/css/styles.css`. Detalle completo en `CLAUDE.md`.

## Estado del proyecto

- Sitio v3 "Ember on Ink" (Variante F canónica) — LIVE desde 2026-06-22
- Casos de estudio y portfolio por eras — LIVE
- Sprint 0.5 (arquitectura de contenido, Astro) — en preparación, ver `CHANGELOG.md`

## Contacto

Diego Maury · [diegomaury.mx](https://diegomaury.mx) · hola@diegomaury.mx
