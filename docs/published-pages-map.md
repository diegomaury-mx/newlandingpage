# Mapeo: Página publicada → Documento en el repositorio

Este archivo relaciona las páginas publicadas del sitio con el archivo fuente correspondiente en el repositorio.

Notas:
- Las rutas publicadas listadas provienen de la carpeta `public/` (archivos estáticos) y de las páginas generadas por Astro en `src/pages/`.
- Los archivos en `public/portfolio/` y `public/cases/` son páginas legacy estáticas que se sirven tal cual.

--

## Mapas principales

- `/` : `src/pages/index.astro`
- `/portfolio` : `src/pages/portfolio.astro`
- `/llms.txt` : `src/pages/llms.txt.ts`

## Páginas estáticas en `public/`
- `/404.html` : `public/404.html`
- `/politicas-privacidad.html` : `public/politicas-privacidad.html`
- `/terminos-y-condiciones.html` : `public/terminos-y-condiciones.html`
- `/robots.txt` : `public/robots.txt`

## Páginas legacy (servidas desde `public/portfolio/`)
- `/portfolio/heineken.html` : `public/portfolio/heineken.html` (legacy)
- `/portfolio/sofi.html` : `public/portfolio/sofi.html` (legacy)
- `/portfolio/redux-incmty.html` : `public/portfolio/redux-incmty.html` (legacy)
- `/portfolio/innovation-systems.html` : `public/portfolio/innovation-systems.html` (legacy)

## Páginas legacy de casos (servidas desde `public/cases/`)
- `/cases/fliphouse.html` : `public/cases/fliphouse.html`
- `/cases/heineken.html` : `public/cases/heineken.html`
- `/cases/innovation-systems.html` : `public/cases/innovation-systems.html`
- `/cases/redux-incmty.html` : `public/cases/redux-incmty.html`
- `/cases/sofi.html` : `public/cases/sofi.html`

## Plantillas / páginas dinámicas en `src/pages/portfolio/`
- `/portfolio/[slug]` : `src/pages/portfolio/[slug].astro` (plantilla / página dinámica de caso)

## Recursos estáticos importantes
- `/assets/css/styles.css` : `public/assets/css/styles.css` (archivo fuente en `assets/css/styles.css`)
- `/assets/js/gtm.js` : `public/js/gtm.js` (generado/copied to public)

--

Si quieres, puedo:

- (A) Escanear el repo y generar automáticamente un CSV/JSON completo con todas las rutas encontradas.
- (B) Añadir un script que valide que cada archivo publicado tiene su fuente señalada.
- (C) Actualizar el `README.md` o el `CHANGELOG.md` con este mapeo.

Indica qué prefieres y lo implemento.
