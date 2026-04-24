# Portfolio diegomaury.mx — Plan A: Design System + index.html

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete `index.html` landing page with design system, nav, and all 6 sections (Hero, Selected Work, Servicios, About, Experiencia, Contacto), deployable to GitHub Pages.

**Architecture:** Static HTML5 + CSS3 + JS vanilla. `assets/css/styles.css` contiene todos los tokens de diseño y estilos. `assets/js/main.js` maneja animaciones de scroll y estado activo de nav. El isotipo SVG se descarga de `diegomaury.mx` y se usa como patrón de fondo vía CSS `background-image`. No hay build system.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, clamp), JavaScript vanilla (IntersectionObserver, requestAnimationFrame), Python `http.server` para dev local, GitHub Pages para deploy.

---

## Estructura de archivos (Plan A)

```
/
├── index.html                    # Página principal — 6 secciones
└── assets/
    ├── css/
    │   └── styles.css            # Tokens + base + todos los componentes
    ├── js/
    │   └── main.js               # Nav activo + scroll animations + reducedMotion
    └── img/
        └── isotipodm.svg         # Descargado de diegomaury.mx/assets/img/isotipodm.svg
```

---

## Task 1: Bajar el SVG del isotipo y preparar el directorio

**Files:**
- Create: `assets/img/isotipodm.svg`
- Create: `assets/css/styles.css` (vacío por ahora)
- Create: `assets/js/main.js` (vacío por ahora)
- Create: `index.html` (esqueleto)

- [ ] **Step 1: Crear la estructura de directorios**

```bash
mkdir -p assets/css assets/js assets/img cv
```

- [ ] **Step 2: Descargar el isotipo SVG**

```bash
curl -o assets/img/isotipodm.svg https://diegomaury.mx/assets/img/isotipodm.svg
```

Verificar que el archivo existe y no está vacío:
```bash
ls -lh assets/img/isotipodm.svg
```
Esperado: archivo de >1KB.

- [ ] **Step 3: Crear index.html con esqueleto mínimo**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diego Maury — Strategic Program & Innovation Manager</title>
  <meta name="description" content="Strategic Program & Innovation Manager. Diseño y opero programas de innovación, emprendimiento y transformación digital en LATAM.">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <p style="color:white;background:#0F0A1A;padding:2rem">Skeleton OK</p>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Levantar servidor de desarrollo**

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080` — debe mostrar "Skeleton OK" sobre fondo oscuro.

- [ ] **Step 5: Commit inicial**

```bash
git init
git add .
git commit -m "chore: estructura inicial y assets del isotipo"
```

---

## Task 2: Design system — tokens CSS + base + isotipo pattern

**Files:**
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Escribir tokens, reset y base en styles.css**

```css
/* ═══════════════════════════════════════
   TOKENS
═══════════════════════════════════════ */
:root {
  --purple:    #2E1547;
  --ink:       #0F0A1A;
  --blaze:     #EA580C;
  --spark:     #E6B800;
  --white:     #FFFFFF;
  --white-80:  rgba(255, 255, 255, 0.80);
  --white-60:  rgba(255, 255, 255, 0.60);
  --white-40:  rgba(255, 255, 255, 0.40);
  --white-10:  rgba(255, 255, 255, 0.10);
  --white-06:  rgba(255, 255, 255, 0.06);
  --white-04:  rgba(255, 255, 255, 0.04);

  --nav-bg:    rgba(15, 10, 26, 0.92);
  --nav-h:     64px;

  --r-sm:      6px;
  --r-md:      10px;

  --section-pad: clamp(4rem, 8vw, 8rem);
  --content-max: 1100px;
  --text-max:    720px;

  --ease-out:  cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast:  150ms;
  --dur-norm:  300ms;
}

/* ═══════════════════════════════════════
   TIPOGRAFÍA — Google Fonts + Fontshare
═══════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');
/* Satoshi desde Fontshare */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@800,700&display=swap');

/* ═══════════════════════════════════════
   RESET
═══════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--ink);
  color: var(--white);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font: inherit; border: none; background: none; }

/* ═══════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════ */
.container {
  width: 100%;
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2rem);
}
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--spark);
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.15;
  margin-bottom: 1rem;
}

/* ═══════════════════════════════════════
   ISOTIPO PATTERN (fondo decorativo)
═══════════════════════════════════════ */
.bg-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.bg-pattern::before {
  content: '';
  position: absolute;
  inset: -10%;
  background-image: url('../img/isotipodm.svg');
  background-size: 90px 90px;
  background-repeat: repeat;
  opacity: 0.06;
  filter: brightness(0) invert(1);
}

/* Purple sections necesitan el pattern con tinte distinto */
.bg-pattern--purple::before {
  opacity: 0.05;
}

/* Contenido siempre encima del pattern */
.bg-pattern + * { position: relative; z-index: 1; }
section { position: relative; }

/* ═══════════════════════════════════════
   SCROLL REVEAL (base — JS añade clases)
═══════════════════════════════════════ */
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 2: Verificar en navegador**

Abrir `http://localhost:8080`. Debe:
- Fondo negro oscuro (`#0F0A1A`)
- Sin errores en consola (F12 → Console)
- Fuentes cargando (puede tardar en primera carga)

- [ ] **Step 3: Commit**

```bash
git add assets/css/styles.css
git commit -m "feat: design system tokens, reset y isotipo pattern"
```

---

## Task 3: Nav sticky

**Files:**
- Modify: `index.html` — añadir `<nav>`
- Modify: `assets/css/styles.css` — añadir estilos de nav
- Modify: `assets/js/main.js` — añadir lógica de scroll

- [ ] **Step 1: Añadir el HTML del nav dentro de `<body>` antes del párrafo de prueba**

```html
<nav class="nav" id="nav">
  <div class="container nav__inner">
    <a href="/" class="nav__brand">
      <img src="assets/img/isotipodm.svg" alt="Isotipo DM" class="nav__logo">
      <span class="nav__name">Diego Maury</span>
    </a>
    <ul class="nav__links">
      <li><a href="#work"        class="nav__link">Work</a></li>
      <li><a href="#servicios"   class="nav__link">Servicios</a></li>
      <li><a href="#about"       class="nav__link">About</a></li>
      <li><a href="#contacto"    class="nav__link">Contacto</a></li>
    </ul>
    <button class="nav__burger" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

- [ ] **Step 2: Añadir estilos del nav en styles.css**

```css
/* ═══════════════════════════════════════
   NAV
═══════════════════════════════════════ */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-h);
  background: var(--nav-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--white-10);
  z-index: 100;
  transition: background var(--dur-norm);
}
.nav__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}
.nav__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}
.nav__logo {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}
.nav__name {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: var(--white);
  letter-spacing: -0.01em;
}
.nav__links {
  display: flex;
  list-style: none;
  gap: 2rem;
}
.nav__link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--white-60);
  transition: color var(--dur-fast);
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}
.nav__link:hover,
.nav__link.is-active {
  color: var(--white);
  border-bottom-color: var(--blaze);
}

/* Burger — solo mobile */
.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}
.nav__burger span {
  display: block;
  width: 22px; height: 2px;
  background: var(--white);
  transition: transform var(--dur-norm), opacity var(--dur-fast);
}

/* Mobile nav */
@media (max-width: 767px) {
  .nav__links {
    display: none;
    position: fixed;
    inset: var(--nav-h) 0 0 0;
    background: var(--ink);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    z-index: 99;
  }
  .nav__links.is-open { display: flex; }
  .nav__link { font-size: 1rem; }
  .nav__burger { display: flex; }
  .nav[aria-expanded="true"] .nav__burger span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .nav[aria-expanded="true"] .nav__burger span:nth-child(2) {
    opacity: 0;
  }
  .nav[aria-expanded="true"] .nav__burger span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}
```

- [ ] **Step 3: Añadir lógica de nav en main.js**

```js
// ── Nav: burger toggle + active link por scroll ──

const nav       = document.getElementById('nav');
const burger    = nav.querySelector('.nav__burger');
const navLinks  = nav.querySelector('.nav__links');
const links     = nav.querySelectorAll('.nav__link');

// Burger
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
  nav.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Cerrar al hacer clic en un link
links.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Active link por IntersectionObserver
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('is-active'));
      const active = nav.querySelector(`[href="#${entry.target.id}"]`);
      if (active) active.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));
```

- [ ] **Step 4: Verificar en navegador**

- Nav visible y sticky al hacer scroll
- En mobile (375px): burger visible, clic abre menú full-screen
- Links sin href válido por ahora (el active se probará al añadir secciones)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/styles.css assets/js/main.js
git commit -m "feat: nav sticky con burger mobile y active por scroll"
```

---

## Task 4: Sección Hero

**Files:**
- Modify: `index.html` — reemplazar el párrafo de prueba con sección hero real
- Modify: `assets/css/styles.css` — estilos del hero

- [ ] **Step 1: Reemplazar el párrafo de prueba con el hero en index.html**

Eliminar `<p style="...">Skeleton OK</p>` y añadir:

```html
<!-- ── HERO ── -->
<section class="hero" id="hero">
  <div class="bg-pattern bg-pattern--purple"></div>
  <div class="container hero__inner">
    <p class="hero__tag mono">Strategic Program &amp; Innovation Manager</p>
    <h1 class="hero__headline">
      Programas y sistemas que convierten<br>innovación en resultados medibles.
    </h1>
    <p class="hero__sub">
      Diseño y opero programas de innovación, emprendimiento y transformación digital en LATAM.
    </p>
    <div class="hero__ctas">
      <a href="cv/diego-maury-cv.pdf" class="btn btn--blaze" download>Descargar CV</a>
      <a href="#contacto" class="btn btn--outline">Agendar llamada</a>
    </div>
  </div>
  <div class="hero__metrics">
    <div class="container hero__metrics-inner">
      <div class="hero__metric">
        <span class="hero__metric-num">30+</span>
        <span class="hero__metric-label mono">Programas<br>implementados</span>
      </div>
      <div class="hero__metric">
        <span class="hero__metric-num">900+</span>
        <span class="hero__metric-label mono">Proyectos<br>evaluados</span>
      </div>
      <div class="hero__metric">
        <span class="hero__metric-num">3,000+</span>
        <span class="hero__metric-label mono">Emprendedores<br>impactados</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Añadir estilos del hero en styles.css**

```css
/* ═══════════════════════════════════════
   BOTONES (globales)
═══════════════════════════════════════ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--r-sm);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 400;
  transition: opacity var(--dur-fast), transform var(--dur-fast);
}
.btn:hover { opacity: 0.85; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.btn--blaze {
  background: var(--blaze);
  color: var(--white);
}
.btn--outline {
  border: 1px solid var(--white-40);
  color: var(--white-80);
}
.btn--outline:hover {
  border-color: var(--white);
  color: var(--white);
  opacity: 1;
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
.hero {
  background: var(--purple);
  padding-top: calc(var(--nav-h) + var(--section-pad));
  padding-bottom: 0;
  overflow: hidden;
}
.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  padding-bottom: var(--section-pad);
  max-width: var(--text-max);
}
.hero__tag {
  color: var(--blaze);
}
.hero__headline {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 4.5vw, 3.75rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--white);
}
.hero__sub {
  color: var(--white-60);
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  max-width: 540px;
}
.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* Banda de métricas */
.hero__metrics {
  border-top: 1px solid var(--white-10);
  background: rgba(0, 0, 0, 0.2);
}
.hero__metrics-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-block: 1.5rem;
}
.hero__metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
  padding-inline: 1rem;
}
.hero__metric + .hero__metric {
  border-left: 1px solid var(--white-10);
}
.hero__metric-num {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1;
  color: var(--white);
}
.hero__metric-label {
  color: var(--white-40);
  font-size: 0.65rem;
  line-height: 1.4;
}

@media (max-width: 767px) {
  .hero__headline br { display: none; }
  .hero__metrics-inner { grid-template-columns: repeat(3, 1fr); padding-block: 1rem; }
  .hero__metric-num { font-size: 1.5rem; }
}
@media (max-width: 479px) {
  .hero__metrics-inner { grid-template-columns: 1fr; gap: 0; }
  .hero__metric + .hero__metric {
    border-left: none;
    border-top: 1px solid var(--white-10);
  }
}
```

- [ ] **Step 3: Verificar en navegador**

- Fondo Purple con isotipo pattern visible pero sutil
- Headline grande en blanco, tag en Blaze
- 2 CTAs visibles
- Banda de métricas con 3 columnas separadas
- Responsive en 375px (sin overflow horizontal)

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: hero section con headline, CTAs y métricas"
```

---

## Task 5: Sección Selected Work

**Files:**
- Modify: `index.html` — añadir sección work después del hero
- Modify: `assets/css/styles.css` — estilos de work

- [ ] **Step 1: Añadir sección work en index.html**

```html
<!-- ── SELECTED WORK ── -->
<section class="work" id="work">
  <div class="bg-pattern"></div>
  <div class="container">
    <div class="work__header" data-reveal>
      <p class="section-label">Selected Work</p>
      <h2 class="section-title">3 casos, resultados reales.</h2>
    </div>
    <ol class="work__list">

      <li class="work__item" data-reveal>
        <a href="cases/heineken.html" class="work__link">
          <span class="work__num">01</span>
          <div class="work__info">
            <h3 class="work__name">HEINEKEN Green Challenge</h3>
            <p class="work__meta mono">Ecosistemas · Program Ops · 2019–2022</p>
          </div>
          <span class="work__metric">+600%</span>
          <span class="work__arrow" aria-hidden="true">→</span>
        </a>
      </li>

      <li class="work__item" data-reveal>
        <a href="cases/innovation-systems.html" class="work__link">
          <span class="work__num">02</span>
          <div class="work__info">
            <h3 class="work__name">Innovation Systems Builder</h3>
            <p class="work__meta mono">Transformación · Producto · 2020–2022</p>
          </div>
          <span class="work__metric">+500%</span>
          <span class="work__arrow" aria-hidden="true">→</span>
        </a>
      </li>

      <li class="work__item" data-reveal>
        <a href="cases/redux-incmty.html" class="work__link">
          <span class="work__num">03</span>
          <div class="work__info">
            <h3 class="work__name">REDUX + INCmty Challenges</h3>
            <p class="work__meta mono">Metodología · Aceleración · 2020–2023</p>
          </div>
          <span class="work__metric">1,000+</span>
          <span class="work__arrow" aria-hidden="true">→</span>
        </a>
      </li>

    </ol>
    <div class="work__footer" data-reveal>
      <a href="portfolio/index.html" class="btn btn--outline">Ver todos los proyectos →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Añadir estilos en styles.css**

```css
/* ═══════════════════════════════════════
   SELECTED WORK
═══════════════════════════════════════ */
.work {
  padding-block: var(--section-pad);
  background: var(--ink);
}
.work__header {
  margin-bottom: 2.5rem;
}
.work__list {
  list-style: none;
  border-top: 1px solid var(--white-10);
}
.work__item {
  border-bottom: 1px solid var(--white-10);
}
.work__link {
  display: grid;
  grid-template-columns: 3rem 1fr auto auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  transition: background var(--dur-fast);
  border-radius: var(--r-sm);
  padding-inline: 0.5rem;
  margin-inline: -0.5rem;
}
.work__link:hover {
  background: var(--white-04);
}
.work__link:hover .work__arrow {
  transform: translateX(4px);
}
.work__num {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: 1.75rem;
  color: var(--spark);
  line-height: 1;
}
.work__name {
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: var(--white);
  margin-bottom: 0.2rem;
}
.work__meta {
  color: var(--white-40);
}
.work__metric {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--blaze);
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.work__arrow {
  font-size: 1.25rem;
  color: var(--white-40);
  transition: transform var(--dur-norm) var(--ease-out);
}
.work__footer {
  margin-top: 2.5rem;
}

@media (max-width: 599px) {
  .work__link {
    grid-template-columns: 2.5rem 1fr;
    grid-template-rows: auto auto;
    gap: 0.5rem 1rem;
  }
  .work__num { grid-row: 1; font-size: 1.25rem; }
  .work__info { grid-row: 1; }
  .work__metric { grid-column: 2; grid-row: 2; font-size: 0.8rem; }
  .work__arrow { display: none; }
}
```

- [ ] **Step 3: Verificar en navegador**

- 3 filas con número Spark, nombre, meta, métrica Blaze
- Hover: fondo sutil, flecha se desplaza 4px
- Botón "Ver todos los proyectos" visible abajo
- Responsive en 375px: sin overflow

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: sección selected work con 3 casos"
```

---

## Task 6: Sección Servicios

**Files:**
- Modify: `index.html`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Añadir sección servicios en index.html**

```html
<!-- ── SERVICIOS ── -->
<section class="services" id="servicios">
  <div class="bg-pattern"></div>
  <div class="container">
    <div data-reveal>
      <p class="section-label">Servicios</p>
      <h2 class="section-title">Lo que construyo contigo.</h2>
    </div>
    <div class="services__grid">

      <article class="service-card" data-reveal>
        <p class="service-card__tag mono">Estrategia</p>
        <h3 class="service-card__name">Program Sprint</h3>
        <p class="service-card__desc">
          Diagnóstico, diseño y hoja de ruta de un programa de innovación o transformación. Desde cero o como rescate de iniciativas estancadas.
        </p>
        <ul class="service-card__deliverables">
          <li>Diagnóstico y mapa de stakeholders</li>
          <li>Diseño del programa con KPIs</li>
          <li>Playbook operativo y calendario</li>
        </ul>
        <p class="service-card__time mono">4–6 semanas</p>
      </article>

      <article class="service-card" data-reveal>
        <p class="service-card__tag mono">Operación</p>
        <h3 class="service-card__name">Digital Ops Setup</h3>
        <p class="service-card__desc">
          Implementación de sistemas de gestión digital: CRM, automatizaciones, dashboards y flujos de trabajo para equipos de innovación.
        </p>
        <ul class="service-card__deliverables">
          <li>Mapeo de procesos actuales</li>
          <li>Setup de herramientas y automatizaciones</li>
          <li>Capacitación del equipo</li>
        </ul>
        <p class="service-card__time mono">6–8 semanas</p>
      </article>

      <article class="service-card" data-reveal>
        <p class="service-card__tag mono">Ecosistemas</p>
        <h3 class="service-card__name">Ecosystem Playbook</h3>
        <p class="service-card__desc">
          Diseño y operación de programas de aceleración, comunidades de innovación o alianzas estratégicas en LATAM.
        </p>
        <ul class="service-card__deliverables">
          <li>Mapeo de actores del ecosistema</li>
          <li>Modelo de programa y convocatoria</li>
          <li>Sistema de seguimiento y métricas</li>
        </ul>
        <p class="service-card__time mono">8–12 semanas</p>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Añadir estilos en styles.css**

```css
/* ═══════════════════════════════════════
   SERVICIOS
═══════════════════════════════════════ */
.services {
  padding-block: var(--section-pad);
  background: var(--ink);
}
.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2.5rem;
}
.service-card {
  border: 1px solid var(--white-10);
  border-radius: var(--r-md);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color var(--dur-norm);
}
.service-card:hover { border-color: var(--white-40); }
.service-card__tag {
  color: var(--spark);
}
.service-card__name {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--white);
}
.service-card__desc {
  color: var(--white-60);
  font-size: 0.9rem;
  flex: 1;
}
.service-card__deliverables {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.service-card__deliverables li {
  font-size: 0.85rem;
  color: var(--white-60);
  padding-left: 1rem;
  position: relative;
}
.service-card__deliverables li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--blaze);
  font-size: 0.75rem;
}
.service-card__time {
  color: var(--white-40);
  margin-top: auto;
}

@media (max-width: 899px) {
  .services__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 599px) {
  .services__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verificar en navegador**

- 3 tarjetas con borde sutil, hover activa borde más visible
- Tags en Spark, flechas en Blaze, tiempos en mono
- En tablet 768px: 2 columnas. En mobile: 1 columna

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: sección servicios con 3 tarjetas producto"
```

---

## Task 7: Sección About

**Files:**
- Modify: `index.html`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Añadir sección about en index.html**

```html
<!-- ── ABOUT ── -->
<section class="about" id="about">
  <div class="bg-pattern"></div>
  <div class="container about__inner">
    <div class="about__text" data-reveal>
      <p class="section-label">About</p>
      <h2 class="section-title">PM operativo.<br>Sistemas que funcionan.</h2>
      <p class="about__bio">
        Soy Strategic Program &amp; Innovation Manager. Diseño y opero programas de innovación,
        emprendimiento y transformación digital en LATAM. Convierto objetivos ambiciosos en
        sistemas ejecutables con cadencia, stakeholders claros y métricas.
      </p>
      <p class="about__bio">
        Trabajo con playbooks, no con supuestos. Cada programa que opero tiene KPIs definidos,
        cadencia de revisión y un sistema que puede funcionar sin mí cuando termino.
      </p>
    </div>
    <div class="about__data" data-reveal>
      <div class="about__block">
        <p class="section-label">Herramientas</p>
        <div class="about__chips">
          <span class="chip">Notion</span>
          <span class="chip">Airtable</span>
          <span class="chip">HubSpot</span>
          <span class="chip">Make / Zapier</span>
          <span class="chip">Figma</span>
          <span class="chip">Google Workspace</span>
          <span class="chip">Miro</span>
          <span class="chip">Slack</span>
        </div>
      </div>
      <div class="about__block">
        <p class="section-label">Cómo trabajo</p>
        <ul class="about__how">
          <li>Diagnóstico antes de soluciones</li>
          <li>Playbook desde el día 1</li>
          <li>KPIs acordados con stakeholders</li>
          <li>Revisiones semanales de métricas</li>
          <li>Entregables documentados</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Añadir estilos en styles.css**

```css
/* ═══════════════════════════════════════
   ABOUT
═══════════════════════════════════════ */
.about {
  padding-block: var(--section-pad);
  background: var(--ink);
}
.about__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}
.about__bio {
  color: var(--white-60);
  margin-top: 1rem;
  font-size: 1rem;
}
.about__data {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.about__block {}
.about__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
  background: var(--white-06);
  color: var(--white-80);
  border: 1px solid var(--white-10);
}
.about__how {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.about__how li {
  font-size: 0.9rem;
  color: var(--white-60);
  padding-left: 1.25rem;
  position: relative;
}
.about__how li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--blaze);
  font-size: 1.2rem;
  line-height: 1;
}

@media (max-width: 767px) {
  .about__inner { grid-template-columns: 1fr; gap: 2.5rem; }
}
```

- [ ] **Step 3: Verificar en navegador**

- 2 columnas en desktop, 1 en mobile
- Bio en Inter blanco 60%, chips con fondo sutil
- Sección label en Spark en ambas columnas

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: sección about con bio, herramientas y forma de trabajo"
```

---

## Task 8: Sección Experiencia

**Files:**
- Modify: `index.html`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Añadir sección experiencia en index.html**

```html
<!-- ── EXPERIENCIA ── -->
<section class="experience" id="experiencia">
  <div class="bg-pattern"></div>
  <div class="container">
    <div data-reveal>
      <p class="section-label">Selected Experience</p>
      <h2 class="section-title">4 roles, resultados medibles.</h2>
    </div>
    <div class="exp__list">

      <article class="exp__item" data-reveal>
        <div class="exp__meta">
          <p class="exp__org mono">INCmty — Tec de Monterrey</p>
          <p class="exp__period mono">2019 – 2023</p>
        </div>
        <div class="exp__content">
          <h3 class="exp__role">Program Manager, Innovation Challenges</h3>
          <ul class="exp__achievements">
            <li>Escalé el HEINEKEN Green Challenge en el sureste de México de 36 a ~300 participantes en 1 edición, logrando +600% de crecimiento y convirtiéndolo en la zona con mayor adopción a nivel nacional.</li>
            <li>Operé 4 convocatorias simultáneas (Accelerator, B-Challenge, DisruptAir, Prototype) evaluando 900+ proyectos y formando a 3,000+ emprendedores en 32 estados.</li>
          </ul>
        </div>
      </article>

      <article class="exp__item" data-reveal>
        <div class="exp__meta">
          <p class="exp__org mono">HackSureste</p>
          <p class="exp__period mono">2018 – 2022</p>
        </div>
        <div class="exp__content">
          <h3 class="exp__role">Fundador & Director de Operaciones</h3>
          <ul class="exp__achievements">
            <li>Fundé y operé el principal hackathon de innovación del sureste de México, creciendo de 0 a comunidad activa en 6 estados en 2 años.</li>
            <li>Diseñé la metodología REDUX — registrada en el catálogo del Tec de Monterrey — formando a 1,000+ estudiantes en el primer año como el autor más joven en la historia de la institución.</li>
          </ul>
        </div>
      </article>

      <article class="exp__item" data-reveal>
        <div class="exp__meta">
          <p class="exp__org mono">FlipHouse</p>
          <p class="exp__period mono">2020 – 2021</p>
        </div>
        <div class="exp__content">
          <h3 class="exp__role">Head of Operations & Growth</h3>
          <ul class="exp__achievements">
            <li>Rediseñé el sistema operativo de la startup inmobiliaria, convirtiendo procesos manuales en flujos automatizados que incrementaron los leads calificados en +500% en 6 meses.</li>
            <li>Implementé CRM, pipeline de ventas y dashboards de seguimiento que redujeron el tiempo de cierre en 40% y eliminaron pérdida de prospectos por fricción operativa.</li>
          </ul>
        </div>
      </article>

      <article class="exp__item" data-reveal>
        <div class="exp__meta">
          <p class="exp__org mono">CAVA Soft</p>
          <p class="exp__period mono">2021 – 2022</p>
        </div>
        <div class="exp__content">
          <h3 class="exp__role">Co-fundador & Product Manager</h3>
          <ul class="exp__achievements">
            <li>Diseñé y lancé una aplicación de gestión de cavas de vino desde cero, llevando el producto de idea a MVP funcional en 4 meses con un equipo de 3 personas.</li>
            <li>Definí el roadmap de producto, las historias de usuario y los criterios de aceptación que guiaron todo el desarrollo técnico.</li>
          </ul>
        </div>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Añadir estilos en styles.css**

```css
/* ═══════════════════════════════════════
   EXPERIENCIA
═══════════════════════════════════════ */
.experience {
  padding-block: var(--section-pad);
  background: var(--ink);
}
.exp__list {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--white-10);
}
.exp__item {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  padding-block: 2rem;
  border-bottom: 1px solid var(--white-10);
}
.exp__org {
  color: var(--white-60);
  font-size: 0.7rem;
}
.exp__period {
  color: var(--white-40);
  font-size: 0.65rem;
  margin-top: 0.25rem;
}
.exp__role {
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--white);
  margin-bottom: 1rem;
}
.exp__achievements {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.exp__achievements li {
  font-size: 0.9rem;
  color: var(--white-60);
  padding-left: 1.25rem;
  position: relative;
  line-height: 1.55;
}
.exp__achievements li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--blaze);
  font-size: 0.75rem;
  top: 0.1rem;
}

@media (max-width: 767px) {
  .exp__item { grid-template-columns: 1fr; gap: 0.75rem; }
}
```

- [ ] **Step 3: Verificar en navegador**

- 4 roles con estructura consistente: org + período a la izquierda, rol + logros a la derecha
- Flechas Blaze en cada logro
- En mobile: 1 columna, meta arriba

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: sección experiencia con 4 roles y logros medibles"
```

---

## Task 9: Sección Contacto + Footer

**Files:**
- Modify: `index.html`
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Añadir sección contacto y footer en index.html**

```html
<!-- ── CONTACTO ── -->
<section class="contact" id="contacto">
  <div class="bg-pattern bg-pattern--purple"></div>
  <div class="container">
    <div data-reveal>
      <p class="section-label">Contacto</p>
      <h2 class="section-title">Hablemos.</h2>
    </div>
    <div class="contact__grid" data-reveal>

      <div class="contact__channel">
        <p class="contact__channel-label mono">Para proyectos y consultoría</p>
        <h3 class="contact__channel-name">Agenda una llamada</h3>
        <p class="contact__channel-desc">30 min para entender tu contexto y ver si puedo ayudarte.</p>
        <a href="https://calendly.com/diegomaurymx" target="_blank" rel="noopener" class="btn btn--blaze">
          Agendar diagnóstico
        </a>
      </div>

      <div class="contact__channel">
        <p class="contact__channel-label mono">Para oportunidades de empleo</p>
        <h3 class="contact__channel-name">Escríbeme directo</h3>
        <p class="contact__channel-desc mono contact__email">diegomaurymx@gmail.com</p>
        <a href="mailto:diegomaurymx@gmail.com" class="btn btn--outline">Enviar email</a>
      </div>

      <div class="contact__channel">
        <p class="contact__channel-label mono">Conectar profesionalmente</p>
        <h3 class="contact__channel-name">LinkedIn</h3>
        <p class="contact__channel-desc">Revisa mi trayectoria completa y conéctate.</p>
        <a href="https://linkedin.com/in/diegomaury" target="_blank" rel="noopener" class="btn btn--outline">
          Ver perfil
        </a>
      </div>

    </div>
  </div>
</section>

<!-- ── FOOTER ── -->
<footer class="footer">
  <div class="footer__tricolor"></div>
  <div class="container footer__inner">
    <p class="footer__tagline mono">Hagamos que las cosas pasen.</p>
    <p class="footer__copy">© 2026 Diego Maury</p>
  </div>
</footer>
```

- [ ] **Step 2: Añadir estilos en styles.css**

```css
/* ═══════════════════════════════════════
   CONTACTO
═══════════════════════════════════════ */
.contact {
  padding-block: var(--section-pad);
  background: var(--purple);
}
.contact__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2.5rem;
}
.contact__channel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.contact__channel-label {
  color: var(--white-40);
}
.contact__channel-name {
  font-family: 'Satoshi', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--white);
}
.contact__channel-desc {
  color: var(--white-60);
  font-size: 0.9rem;
  flex: 1;
}
.contact__email {
  font-size: 0.8rem !important;
  letter-spacing: 0.04em;
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
.footer {
  background: var(--purple);
  border-top: 1px solid var(--white-10);
}
.footer__tricolor {
  height: 3px;
  background: linear-gradient(to right, var(--purple) 33%, #1a0b2e 33% 66%, var(--blaze) 66%);
}
.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1.5rem;
}
.footer__tagline {
  color: var(--blaze);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
}
.footer__copy {
  font-size: 0.75rem;
  color: var(--white-40);
}

@media (max-width: 899px) {
  .contact__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 599px) {
  .contact__grid { grid-template-columns: 1fr; }
  .footer__inner { flex-direction: column; gap: 0.5rem; text-align: center; }
}
```

- [ ] **Step 3: Verificar en navegador**

- 3 canales de contacto sobre fondo Purple
- Footer con línea tricolor, tagline Blaze, copyright blanco 40%
- En mobile: 1 columna

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: sección contacto y footer con tricolor"
```

---

## Task 10: JS — Scroll reveal animations

**Files:**
- Modify: `assets/js/main.js` — añadir IntersectionObserver para `[data-reveal]`

- [ ] **Step 1: Añadir scroll reveal al final de main.js**

```js
// ── Scroll Reveal ──

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });
}
```

- [ ] **Step 2: Verificar en navegador**

Hacer scroll lento desde el hero hacia abajo. Cada sección con `data-reveal` debe aparecer con fade-in + slide-up suave (0.6s). No debe haber saltos o flashes.

Verificar con `prefers-reduced-motion`:
- En DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce"
- Todos los elementos deben estar visibles sin animación

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: scroll reveal con IntersectionObserver y reduced-motion"
```

---

## Task 11: SEO meta, favicon y verificación final

**Files:**
- Modify: `index.html` — completar `<head>`
- Create: `robots.txt`

- [ ] **Step 1: Completar el `<head>` de index.html**

Reemplazar el `<head>` actual con:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diego Maury — Strategic Program & Innovation Manager</title>
  <meta name="description" content="Strategic Program & Innovation Manager. Diseño y opero programas de innovación, emprendimiento y transformación digital en LATAM. 30+ programas, 3,000+ emprendedores impactados.">
  <meta name="author" content="Diego Maury">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Diego Maury — Strategic Program & Innovation Manager">
  <meta property="og:description" content="Programas y sistemas que convierten innovación en resultados medibles.">
  <meta property="og:url" content="https://diegomaury.mx">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@800,700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="assets/css/styles.css">
</head>
```

- [ ] **Step 2: Crear robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://diegomaury.mx/sitemap.xml
```

- [ ] **Step 3: Verificar HTML válido**

```bash
npx html-validator-cli --file index.html --verbose 2>&1 | head -30
```

Esperado: 0 errores. Warnings son aceptables.

- [ ] **Step 4: Verificar responsive en DevTools**

Abrir DevTools → Toggle Device Toolbar. Probar:
- 375px (iPhone SE): sin overflow horizontal, texto legible
- 768px (iPad): grid de servicios en 2 cols
- 1280px (desktop): layout completo

- [ ] **Step 5: Commit final del Plan A**

```bash
git add .
git commit -m "feat: SEO meta, robots.txt y verificación responsive — Plan A completo"
```

---

## Notas para Plan B (Casos de estudio) y Plan C (Portafolio)

**Plan B — `/cases/*.html`:**
- `cases/heineken.html`: contenido listo desde transcripción en Notion (`3380fe3c51c581c89884f5d6e606b9a8`)
- `cases/innovation-systems.html`: estructura lista, contenido pendiente de entrevista
- `cases/redux-incmty.html`: estructura lista, contenido pendiente de entrevista
- Los 3 comparten el mismo template CSS/HTML — crear un `cases/_template.html` base

**Plan C — `/portfolio/index.html`:**
- Grid filtrable de proyectos 2015–2023
- Datos de proyectos hardcodeados en JS (JSON array) hasta que se defina fuente de datos
- Filter por año: class toggling + CSS `display: none` con transición opacity
