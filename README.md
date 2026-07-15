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
│   ├── js/sofi-case.js         # Simulador y panel del FSM del caso SOFI
│   ├── data/sofi/              # Data files del caso SOFI — generados, no editar a mano
│   └── img/                    # Isotipo, logos, patrones
├── cases/                      # Casos de estudio (Heineken, Innovation Systems, REDUX, SOFI; fliphouse.html es stub de transición a SOFI)
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

## Registro de cambios

El registro canónico de cambios del sitio es la base **Changelog — Portafolio D** en Notion, no este repositorio. `CHANGELOG.md` es un espejo técnico: puede quedarse atrás, la entrada en Notion no.

Toda cifra publicada declara su grado de evidencia (documentada o estimada). **Los claims sin respaldo documental no se publican.** El protocolo completo está en `CLAUDE.md`.

## Estado del proyecto

- Sitio v3 "Ember on Ink" (Variante F canónica) — LIVE desde 2026-06-22
- Casos de estudio y portfolio por eras — LIVE
- Caso SOFI (`cases/sofi.html`) — LIVE y público desde 2026-07-12: indexable, enlazado desde el index y en el sitemap
- Cifras del index y de los `llms.txt` alineadas a la evidencia verificada (2026-07-12)
- Sprint 0.5 (arquitectura de contenido, Astro) — en preparación, ver `CHANGELOG.md`

## Contacto

Diego Maury · [diegomaury.mx](https://diegomaury.mx) · hola@diegomaury.mx
