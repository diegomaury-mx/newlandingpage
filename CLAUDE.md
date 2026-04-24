# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Portafolio profesional de Diego Maury — sitio estático desplegado en GitHub Pages.

URL objetivo: `https://diegomaury.github.io` (o subdominio personalizado `diegomaury.mx`)

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks — para máxima velocidad y portabilidad)
- Sin build system obligatorio; si se añade uno, usar Vite
- Despliegue: GitHub Pages (rama `gh-pages` o carpeta `/docs` en `main`)

## Comandos de desarrollo

```bash
# Servidor de desarrollo local (Python, siempre disponible)
python -m http.server 8080

# Alternativa con Node
npx serve .

# Despliegue a GitHub Pages (si se usa gh-pages CLI)
npx gh-pages -d .
```

## Arquitectura del sitio

Single-page application con scroll por secciones. Todo en `index.html` salvo casos de estudio que son páginas separadas.

```
/
├── index.html          # Página principal (todas las secciones)
├── assets/
│   ├── css/
│   │   └── styles.css  # Estilos principales + tokens CSS
│   ├── js/
│   │   └── main.js     # Scroll animations, nav activa, otros
│   └── img/            # Imágenes optimizadas (WebP preferido)
├── cases/
│   └── heineken.html   # Caso de estudio individual
└── cv/
    └── diego-maury-cv.pdf
```

## Secciones (orden en index.html)

1. **Hero** — Título de rol + subtítulo de outcomes + 2 CTAs (Descargar CV, Agendar llamada)
2. **Selected Work** — Grid de 4–6 casos con tarjeta: industria + rol + 1 métrica + tags
3. **Servicios** — 3 ofertas producto con entregables y rango de tiempo
4. **About** — En clave PM operativo: scope, stakeholders, herramientas, forma de trabajo
5. **Selected Experience** — 4 roles, 2 logros medibles c/u
6. **Contacto** — 3 vías: calendario, email, LinkedIn

## Posicionamiento y copy

**Frase núcleo (ES):** Strategic Program & Innovation Manager que diseña y opera programas y sistemas (innovación, transformación digital, ecosistemas) para convertir estrategia en resultados medibles: adopción, eficiencia y crecimiento.

**Headline oficial:** "Strategic Program & Innovation Manager"
**Sub:** "Programas y sistemas que convierten innovación en resultados medibles."

## Reglas de diseño

- **Bilingüe:** ES primero, EN debajo en Hero y About solamente (o switch de idioma)
- **Escaneabilidad:** cada sección comprensible en 5–10 segundos
- **Métricas normalizadas:** número + unidad + baseline + timeframe + qué significa
- **Mobile-first:** breakpoints 375px, 768px, 1280px
- **Performance:** JS Budget < 80 KB gzipped, CSS < 15 KB (es microsite)
- Animaciones solo en propiedades compositor-safe: `transform`, `opacity`

## Plantilla de caso de estudio

Cada caso sigue: Contexto → Problema → Objetivo (métrica) → Mi rol → Acciones (3–5) → Resultados (métricas) → Evidencia → Aprendizajes

## Idioma

Responder siempre en español.
