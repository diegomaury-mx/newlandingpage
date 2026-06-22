# Landing Canónica (Bento + Violeta) — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `index-canonico.html` (PREVIEW en la raíz del repo), fiel a la maqueta canónica de Notion, con rediseño visual Bento + Violeta, sin tocar el `index.html` LIVE.

**Architecture:** Un único archivo autocontenido `index-canonico.html` con `<style>` y `<script>` inline. Reutiliza las fuentes locales del repo vía `@font-face`. Aislamiento total del LIVE: nada de modificar `assets/css/styles.css` ni `assets/js/main.js`. Analítica desactivada y `noindex,nofollow` en el `<head>`. Esto hace el PREVIEW trivial de servir, comparar, borrar o promover.

**Tech Stack:** HTML5 + CSS3 + JavaScript vanilla. Sin frameworks, sin build. Fuentes: Satoshi Variable (local), JetBrains Mono (local italic + Google upright), Inter (Google). Verificación: `python -m http.server 8080` + revisión visual en breakpoints 375/768/1280.

**Fuente de verdad (SSOT):** Notion "MAQUETA Canónica - diegomaury.mx" (id `e5f9bb1b96224857a648b0212c3e9822`). El spec asociado vive en `docs/superpowers/specs/2026-06-16-landing-canonica-bento-design.md`.

---

## Nota sobre verificación (sitio estático, sin test runner)

Este repo no tiene framework de pruebas. El ciclo "RED/GREEN" se sustituye por:

1. **Servir en local:** `python -m http.server 8080` desde la raíz.
2. **Abrir** `http://localhost:8080/index-canonico.html`.
3. **Verificar** contra el criterio explícito de cada tarea (contenido SSOT, layout, breakpoint).

Cada tarea cierra con un commit. Los anchors de sección, las métricas y los hechos provienen del SSOT documentado en el spec; **no inventar datos**.

> **Caveat de copy (regla "no inventar datos"):** las métricas, nombres de caso, los 3 fallos del post-mortem y las correcciones de contenido son verbatim del SSOT. En cambio, parte del **copy descriptivo de cuerpo** (textos de las cards de S2/S5, listas de S6 About, framing de párrafos) es redacción tentativa sobre hechos documentados. Durante la ejecución, ese copy de cuerpo debe reconciliarse contra el SSOT de Notion antes de dar por buena cada sección; si el SSOT no lo cubre, marcarlo y confirmarlo con Diego, no inventarlo.

---

## Estructura de archivos

- **Crear:** `index-canonico.html` (raíz) — único archivo del PREVIEW, autocontenido.
- **Reutilizar (solo lectura, NO modificar):**
  - `assets/fonts/Satoshi-Variable.ttf`
  - `assets/fonts/Satoshi-VariableItalic.ttf`
  - `assets/fonts/JetBrainsMono-Italic-VariableFont_wght.ttf`
  - `assets/img/isotipodm.svg` (patrón de fondo decorativo)
- **No tocar:** `index.html`, `assets/css/styles.css`, `assets/js/main.js`, `sitemap.xml`, `robots.txt`.

---

## Task 1: Scaffold del documento (head, tokens, reset, analítica desactivada)

**Files:**
- Create: `index-canonico.html`

- [ ] **Step 1: Crear el esqueleto del documento con `<head>` completo**

Crear `index-canonico.html` con este contenido inicial:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diego Maury — Strategic Program & Operations Director</title>
  <meta name="description" content="Tomo operaciones ambiguas y las dejo funcionando como sistemas medibles. Programas, RevOps y ecosistemas.">

  <!-- PREVIEW: no indexar. Se retira al promover a LIVE. -->
  <meta name="robots" content="noindex,nofollow">

  <!-- ANALÍTICA DESACTIVADA EN PREVIEW.
       GTM-NHT5827J y Clarity x7ns7c22xi NO se inyectan mientras sea preview.
       Activar (descomentar) solo al promover a LIVE. -->

  <style>
    /* ── FONTS (locales, reutilizadas del repo) ── */
    @font-face {
      font-family: 'Satoshi';
      src: url('assets/fonts/Satoshi-Variable.ttf') format('truetype-variations');
      font-weight: 300 900; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'Satoshi';
      src: url('assets/fonts/Satoshi-VariableItalic.ttf') format('truetype-variations');
      font-weight: 300 900; font-style: italic; font-display: swap;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('assets/fonts/JetBrainsMono-Italic-VariableFont_wght.ttf') format('truetype-variations');
      font-weight: 100 800; font-style: italic; font-display: swap;
    }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    /* ── TOKENS — DS v3 Violeta Protagonista (auditados WCAG) ── */
    :root {
      --dm-catalyst-900: #120D1A;   /* fondo base oscuro */
      --dm-catalyst-700: #2E1547;   /* hero/contacto bg */
      --dm-bento: #1D1430;          /* celdas bento */
      --dm-bento-border: #2E1547;   /* borde decorativo sutil (1.10:1) */
      --dm-border-interactive: #5A2C87; /* borde celda interactiva (~3:1) */
      --dm-amethyst: #7C3FBE;       /* SOLO fill: CTA, badges, hero */
      --dm-amethyst-text: #B07FE8;  /* texto/enlaces sobre oscuro (~6:1) */
      --dm-spark: #E6B800;          /* SOLO números de impacto / KPIs */
      --dm-bone: #F5F5F7;           /* texto sobre oscuro (17.5:1) */
      --dm-bone-60: rgba(245,245,247,0.62);
      --dm-bone-40: rgba(245,245,247,0.42);

      --font-display: 'Satoshi', system-ui, sans-serif;
      --font-body: 'Inter', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, monospace;

      --space-section: clamp(4rem, 3rem + 5vw, 8rem);
      --maxw: 1180px;
      --radius: 16px;
      --dur: 300ms;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ── RESET ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-body);
      background: var(--dm-catalyst-900);
      color: var(--dm-bone);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; display: block; }
    a { color: var(--dm-amethyst-text); text-decoration: none; }
    .container { max-width: var(--maxw); margin-inline: auto; padding-inline: clamp(1.25rem, 1rem + 2vw, 2.5rem); }
    section { padding-block: var(--space-section); }

    /* Foco visible — WCAG 2.4.11 */
    :focus-visible { outline: 2px solid var(--dm-amethyst); outline-offset: 2px; }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation: none !important; transition: none !important; }
    }
  </style>
</head>
<body>
  <!-- secciones se añaden en tareas siguientes -->

  <script>
    // JS se añade en Task 12
  </script>
</body>
</html>
```

- [ ] **Step 2: Servir y verificar que carga sin errores**

Run: `python -m http.server 8080` (desde la raíz), luego abrir `http://localhost:8080/index-canonico.html`.
Expected: página oscura en blanco, sin errores en consola, fuentes cargadas (revisar Network: Satoshi-Variable.ttf 200).

- [ ] **Step 3: Confirmar que `index.html` LIVE no fue tocado**

Run: `git status --short`
Expected: solo `?? index-canonico.html` (untracked). `index.html` NO aparece.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat: scaffold index-canonico PREVIEW (head, tokens DS v3, noindex)"
```

---

## Task 2: NAV fija

**Files:**
- Modify: `index-canonico.html` (insertar tras `<body>`)

- [ ] **Step 1: Insertar el header de navegación**

Insertar justo después de `<body>`:

```html
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a href="#hero" class="nav__brand" data-scroll>Diego Maury</a>
      <nav class="nav__links" aria-label="Navegación principal">
        <a href="#proyectos" data-scroll>Proyectos</a>
        <a href="#trinchera" data-scroll>La Trinchera</a>
        <a href="#fraccional" data-scroll>Fraccional</a>
        <a href="#contacto" data-scroll>Contacto</a>
      </nav>
      <a href="#contacto" class="nav__cta btn btn--primary" data-scroll>Agenda un diagnóstico</a>
    </div>
  </header>
```

- [ ] **Step 2: Añadir el CSS de la nav y los botones (dentro de `<style>`, antes de `</style>`)**

```css
    /* ── NAV ── */
    .nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(18,13,26,0.82);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--dm-bento-border);
    }
    .nav__inner { display: flex; align-items: center; gap: 1.5rem; padding-block: 0.9rem; }
    .nav__brand { font-family: var(--font-display); font-weight: 700; color: var(--dm-bone); font-size: 1.05rem; }
    .nav__links { display: flex; gap: 1.4rem; margin-left: auto; }
    .nav__links a { font-family: var(--font-mono); font-size: 0.8rem; color: var(--dm-bone-60); transition: color var(--dur) var(--ease); }
    .nav__links a:hover, .nav__links a.is-active { color: var(--dm-bone); }
    .nav__cta { white-space: nowrap; }

    /* ── BOTONES ── */
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0.7rem 1.3rem; border-radius: 999px;
      font-family: var(--font-mono); font-size: 0.82rem; font-weight: 500;
      border: 1px solid transparent; cursor: pointer;
      transition: transform var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease);
    }
    .btn--primary { background: var(--dm-amethyst); color: var(--dm-bone); }
    .btn--primary:hover { transform: translateY(-2px); background: #8B4FCF; }
    .btn--ghost { background: transparent; color: var(--dm-bone); border-color: var(--dm-border-interactive); }
    .btn--ghost:hover { transform: translateY(-2px); border-color: var(--dm-amethyst-text); }

    @media (max-width: 768px) {
      .nav__links { display: none; }
    }
```

- [ ] **Step 3: Verificar en navegador**

Recargar `http://localhost:8080/index-canonico.html`.
Expected: nav fija arriba, marca a la izquierda, links a la derecha (ocultos < 768px), CTA violeta. Hover del CTA eleva 2px.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): nav fija + sistema de botones"
```

---

## Task 3: S1 Hero (lineal fuerte + banda bento de métricas)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección Hero (tras `</header>`)**

```html
  <section id="hero" class="hero">
    <div class="container">
      <p class="hero__tag">// Strategic Program &amp; Operations Director</p>
      <h1 class="hero__title">Diego Maury</h1>
      <p class="hero__role">Strategic Program &amp; Operations Director</p>
      <p class="hero__tagline">Tomo operaciones ambiguas y las dejo funcionando como sistemas medibles.</p>
      <div class="hero__ctas">
        <a href="#contacto" class="btn btn--primary" data-scroll>Agenda un diagnóstico</a>
        <a href="#proyectos" class="btn btn--ghost" data-scroll>Ver proyectos</a>
      </div>

      <ul class="metrics" aria-label="Impacto rápido">
        <li class="metric"><span class="metric__num">10+</span><span class="metric__label">años (7+ en innovación)</span></li>
        <li class="metric"><span class="metric__num">9,905</span><span class="metric__label">participantes (4 ediciones)</span></li>
        <li class="metric"><span class="metric__num">3,231</span><span class="metric__label">evaluados (900+/edición)</span></li>
        <li class="metric"><span class="metric__num">+600%</span><span class="metric__label">crecimiento programa</span></li>
        <li class="metric"><span class="metric__num">+500%</span><span class="metric__label">leads en CRM</span></li>
      </ul>
    </div>
  </section>
```

- [ ] **Step 2: Añadir CSS del Hero + grilla bento de métricas**

```css
    /* ── HERO ── */
    .hero { background: var(--dm-catalyst-700); padding-block: clamp(4rem, 3rem + 8vw, 9rem); }
    .hero__tag { font-family: var(--font-mono); color: var(--dm-amethyst-text); font-size: 0.85rem; letter-spacing: 0.04em; margin-bottom: 1.2rem; }
    .hero__title { font-family: var(--font-display); font-weight: 800; font-size: clamp(2.6rem, 1.5rem + 6vw, 5.5rem); line-height: 1.02; }
    .hero__role { font-family: var(--font-mono); color: var(--dm-bone-60); font-size: clamp(0.95rem, 0.9rem + 0.4vw, 1.15rem); margin-top: 0.6rem; }
    .hero__tagline { font-size: clamp(1.15rem, 1rem + 0.8vw, 1.6rem); max-width: 38ch; margin-top: 1.5rem; color: var(--dm-bone); }
    .hero__ctas { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 2rem; }

    /* ── BENTO de métricas ── */
    .metrics {
      list-style: none; margin-top: 3.5rem;
      display: grid; gap: 1px;
      grid-template-columns: repeat(5, 1fr);
      background: var(--dm-bento-border);
      border: 1px solid var(--dm-bento-border);
      border-radius: var(--radius); overflow: hidden;
    }
    .metric { background: var(--dm-bento); padding: 1.4rem 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .metric__num { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.6rem, 1.2rem + 1.5vw, 2.4rem); color: var(--dm-spark); }
    .metric__label { font-family: var(--font-mono); font-size: 0.72rem; color: var(--dm-bone-60); line-height: 1.35; }

    @media (max-width: 768px) {
      .metrics { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 375px) {
      .metrics { grid-template-columns: 1fr; }
    }
```

- [ ] **Step 3: Verificar en navegador a 1280, 768 y 375px**

Recargar y usar DevTools responsive. Expected:
- 1280px: 5 métricas en fila, números en spark (dorado), título Satoshi grande.
- 768px: métricas en 2 columnas, sin overflow.
- 375px: métricas apiladas 1 columna, sin overflow horizontal.
- Números en color spark; tag y nada de texto usa amethyst puro como color de texto.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S1 hero + banda bento de métricas"
```

---

## Task 4: S2 Qué hago (3 cards lineales)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección (tras `</section>` del hero)**

```html
  <section id="que-hago" class="reveal">
    <div class="container">
      <p class="sec__kicker">// Qué hago</p>
      <h2 class="sec__title">Tres frentes, un sistema</h2>
      <div class="cards-3">
        <article class="card">
          <h3 class="card__title">Diseño y operación de programas</h3>
          <p class="card__body">Programas de innovación y aceleración end-to-end: convocatoria, filtrado, mentoría y medición.</p>
        </article>
        <article class="card">
          <h3 class="card__title">Sistemas y automatización (RevOps)</h3>
          <p class="card__body">CRM, speed-to-lead y automatización de procesos comerciales para que la operación deje de depender de heroísmos.</p>
        </article>
        <article class="card">
          <h3 class="card__title">Ecosistemas y partnerships</h3>
          <p class="card__body">Articulación de aliados, academia, gobierno e industria alrededor de un objetivo medible.</p>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Añadir CSS de kicker/título de sección + cards**

```css
    /* ── ENCABEZADOS DE SECCIÓN ── */
    .sec__kicker { font-family: var(--font-mono); color: var(--dm-amethyst-text); font-size: 0.8rem; letter-spacing: 0.05em; margin-bottom: 0.6rem; }
    .sec__title { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.8rem, 1.3rem + 2.5vw, 3rem); margin-bottom: 2.5rem; line-height: 1.1; }

    /* ── CARDS 3 ── */
    .cards-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
    .card { background: var(--dm-bento); border: 1px solid var(--dm-bento-border); border-radius: var(--radius); padding: 1.8rem; }
    .card__title { font-family: var(--font-display); font-weight: 600; font-size: 1.2rem; margin-bottom: 0.8rem; }
    .card__body { color: var(--dm-bone-60); font-size: 0.95rem; }

    @media (max-width: 768px) {
      .cards-3 { grid-template-columns: 1fr; }
    }
```

- [ ] **Step 3: Verificar**

Recargar. Expected: kicker en amethyst-text, 3 tarjetas en fila a 1280, apiladas a < 768px. Sin overflow.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S2 que-hago (3 cards)"
```

---

## Task 5: S3 Proyectos (BENTO de 4 celdas con acento por caso)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección Proyectos**

```html
  <section id="proyectos" class="reveal">
    <div class="container">
      <p class="sec__kicker">// Proyectos</p>
      <h2 class="sec__title">Resultados, no narrativas</h2>
      <div class="bento">
        <article class="bento__cell" style="--accent:#16A34A" tabindex="0">
          <p class="bento__name">HEINEKEN Green Challenge</p>
          <ul class="bento__metrics">
            <li><b>+600%</b> crecimiento</li>
            <li><b>9,905</b> participantes</li>
            <li><b>3,231</b> evaluados</li>
            <li><b>100+</b> mentores/edición</li>
          </ul>
        </article>
        <article class="bento__cell" style="--accent:#246BFD" tabindex="0">
          <p class="bento__name">SOFI / FlipHouse</p>
          <ul class="bento__metrics">
            <li><b>&lt;5 min</b> speed-to-lead</li>
            <li><b>+500%</b> leads</li>
            <li>RODI disponible a solicitud</li>
            <li>cost-avoidance modelado</li>
          </ul>
        </article>
        <article class="bento__cell" style="--accent:#7C3FBE" tabindex="0">
          <p class="bento__name">HackSureste</p>
          <ul class="bento__metrics">
            <li><b>3,000+</b> participantes</li>
            <li><b>200+</b> capacitados en REDUX</li>
          </ul>
        </article>
        <article class="bento__cell" style="--accent:#FF5C39" tabindex="0">
          <p class="bento__name">REDUX</p>
          <ul class="bento__metrics">
            <li>Autor de la metodología</li>
            <li>Directorio Tec de Monterrey</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Añadir CSS del bento de proyectos**

```css
    /* ── BENTO PROYECTOS ── */
    .bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
    .bento__cell {
      position: relative; background: var(--dm-bento);
      border: 1px solid var(--dm-bento-border); border-radius: var(--radius);
      padding: 1.8rem; overflow: hidden;
      transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease);
    }
    .bento__cell::before {
      content: ""; position: absolute; inset: 0 auto 0 0; width: 4px; background: var(--accent);
    }
    .bento__cell:hover, .bento__cell:focus-visible {
      transform: translateY(-4px); border-color: var(--dm-border-interactive);
    }
    .bento__name { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem; padding-left: 0.6rem; }
    .bento__metrics { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; padding-left: 0.6rem; }
    .bento__metrics li { font-family: var(--font-mono); font-size: 0.85rem; color: var(--dm-bone-60); }
    .bento__metrics b { color: var(--dm-spark); font-weight: 700; }

    @media (max-width: 768px) {
      .bento { grid-template-columns: 1fr; }
    }
```

- [ ] **Step 3: Verificar layout + interacción**

Recargar. Expected:
- 4 celdas en grilla 2×2 (1280), apiladas a < 768px.
- Barra de acento de color por caso (verde/azul/morado/naranja) a la izquierda.
- Hover y foco por teclado (Tab) elevan la celda y suben el borde a `#5A2C87`.
- Métricas con números en spark.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S3 proyectos (bento 4 celdas, acento por caso)"
```

---

## Task 6: S4 La Trinchera (post-mortem lineal)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección**

```html
  <section id="trinchera" class="reveal">
    <div class="container">
      <p class="sec__kicker">// La Trinchera</p>
      <h2 class="sec__title">Lo que no salió, y qué aprendí</h2>
      <article class="postmortem">
        <p class="postmortem__label">Post-mortem 01 · HEINEKEN Green Challenge</p>
        <ol class="postmortem__list">
          <li>
            <h3>Filtrado insuficiente al inicio</h3>
            <p>El primer corte dejaba pasar ~200 proyectos sin viabilidad. Rediseñé el rúbrica de evaluación hasta sostener 900+ proyectos evaluados con criterio por edición.</p>
          </li>
          <li>
            <h3>Fricción en la coordinación multisectorial</h3>
            <p>Alinear academia, industria y gobierno tomaba ~2 semanas por decisión. Monté un protocolo que bajó ese ciclo a 48 horas.</p>
          </li>
          <li>
            <h3>Brecha en la experiencia virtual</h3>
            <p>La edición remota perdía participantes en la mentoría. Documenté la brecha y ajusté el formato para edición siguiente.</p>
          </li>
        </ol>
      </article>
    </div>
  </section>
```

- [ ] **Step 2: Añadir CSS del post-mortem**

```css
    /* ── TRINCHERA ── */
    .postmortem { background: var(--dm-bento); border: 1px solid var(--dm-bento-border); border-left: 4px solid var(--dm-amethyst); border-radius: var(--radius); padding: 2rem; }
    .postmortem__label { font-family: var(--font-mono); color: var(--dm-amethyst-text); font-size: 0.8rem; margin-bottom: 1.5rem; }
    .postmortem__list { list-style: none; counter-reset: pm; display: flex; flex-direction: column; gap: 1.6rem; }
    .postmortem__list li { counter-increment: pm; }
    .postmortem__list h3 { font-family: var(--font-display); font-weight: 600; font-size: 1.1rem; margin-bottom: 0.4rem; }
    .postmortem__list h3::before { content: counter(pm, decimal-leading-zero) "  "; color: var(--dm-spark); font-family: var(--font-mono); }
    .postmortem__list p { color: var(--dm-bone-60); font-size: 0.95rem; }
```

- [ ] **Step 3: Verificar**

Recargar. Expected: tarjeta con borde izquierdo amethyst, 3 fallos numerados (01/02/03 en spark), texto legible. Sin overflow a 375px.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S4 la trinchera (post-mortem HEINEKEN)"
```

---

## Task 7: S5 Liderazgo Fraccional (3 modelos sin precio)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección**

```html
  <section id="fraccional" class="reveal">
    <div class="container">
      <p class="sec__kicker">// Liderazgo Fraccional</p>
      <h2 class="sec__title">Cómo trabajar conmigo</h2>
      <div class="cards-3">
        <article class="card">
          <h3 class="card__title">Retainer mensual</h3>
          <p class="card__body">~20 h/mes. Dirección continua de operaciones y programas, con cadencia y métricas fijas.</p>
        </article>
        <article class="card">
          <h3 class="card__title">Proyecto acotado</h3>
          <p class="card__body">4–8 semanas. Diagnóstico y montaje de un sistema concreto, con entregables definidos.</p>
        </article>
        <article class="card">
          <h3 class="card__title">Asesoría estratégica</h3>
          <p class="card__body">Sesiones puntuales para destrabar decisiones de operación, programa o RevOps.</p>
        </article>
      </div>
      <div class="hero__ctas" style="margin-top:2.2rem">
        <a href="#contacto" class="btn btn--primary" data-scroll>Cuéntame tu contexto</a>
        <a href="#contacto" class="btn btn--ghost" data-scroll>Agenda una llamada</a>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verificar (reutiliza estilos `.cards-3` y `.btn` ya definidos)**

Recargar. Expected: 3 modelos SIN rangos de precio, 2 CTAs debajo. Apilado a < 768px.

- [ ] **Step 3: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S5 liderazgo fraccional (3 modelos sin precio)"
```

---

## Task 8: S6 About (2 columnas: para quién sí / para quién no)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección**

```html
  <section id="about" class="reveal">
    <div class="container">
      <p class="sec__kicker">// About</p>
      <h2 class="sec__title">Para quién trabajo</h2>
      <div class="about-grid">
        <article class="card">
          <h3 class="card__title">Para quién trabajo</h3>
          <ul class="about-list">
            <li>Organizaciones con operaciones ambiguas que necesitan volverse medibles.</li>
            <li>Programas de innovación, aceleración o ecosistema que deben escalar con criterio.</li>
            <li>Equipos comerciales que quieren dejar de depender de heroísmos individuales.</li>
          </ul>
        </article>
        <article class="card">
          <h3 class="card__title">Para quién no</h3>
          <ul class="about-list">
            <li>Quien busca un ejecutor de tareas sin mandato para cambiar el sistema.</li>
            <li>Proyectos sin disposición a medir resultados.</li>
            <li>Quien quiere humo de innovación sin operación detrás.</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Añadir CSS**

```css
    /* ── ABOUT ── */
    .about-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
    .about-list { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
    .about-list li { color: var(--dm-bone-60); font-size: 0.95rem; padding-left: 1.2rem; position: relative; }
    .about-list li::before { content: "→"; position: absolute; left: 0; color: var(--dm-amethyst-text); }
    @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verificar**

Recargar. Expected: 2 columnas (sí/no), viñetas con flecha en amethyst-text. Apilado a < 768px.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S6 about (para quien si / para quien no)"
```

---

## Task 9: S7 Selected Experience (TABLA, fiel al SSOT)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar la sección como tabla semántica**

```html
  <section id="experiencia" class="reveal">
    <div class="container">
      <p class="sec__kicker">// Selected Experience</p>
      <h2 class="sec__title">Trayectoria</h2>
      <div class="table-wrap">
        <table class="exp-table">
          <thead>
            <tr><th scope="col">Organización</th><th scope="col">Rol</th><th scope="col">Resultado clave</th></tr>
          </thead>
          <tbody>
            <tr><td>FlipHouse</td><td>RevOps &amp; AI</td><td>Speed-to-lead &lt;5 min · +500% leads en CRM</td></tr>
            <tr><td>INCmty · HEINEKEN</td><td>Director nacional / operador regional sureste</td><td>+600% crecimiento · 9,905 participantes</td></tr>
            <tr><td>HackSureste</td><td>Diseño y operación</td><td>3,000+ participantes · 200+ capacitados en REDUX</td></tr>
            <tr><td>Tec de Monterrey y EBC</td><td>Docencia / programa</td><td>Autor de la metodología REDUX (directorio Tec)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Añadir CSS de la tabla**

```css
    /* ── TABLA EXPERIENCIA ── */
    .table-wrap { overflow-x: auto; border: 1px solid var(--dm-bento-border); border-radius: var(--radius); }
    .exp-table { width: 100%; border-collapse: collapse; min-width: 560px; }
    .exp-table th, .exp-table td { text-align: left; padding: 1rem 1.2rem; border-bottom: 1px solid var(--dm-bento-border); }
    .exp-table th { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dm-bone-40); background: var(--dm-bento); }
    .exp-table td { font-size: 0.9rem; color: var(--dm-bone); }
    .exp-table tbody tr:last-child td { border-bottom: none; }
    .exp-table td:first-child { font-family: var(--font-display); font-weight: 600; }
```

- [ ] **Step 3: Verificar**

Recargar. Expected: tabla con 3 columnas, 4 filas. A 375px aparece scroll horizontal interno (no overflow de página). Encabezados en mono mayúsculas.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S7 selected experience (tabla)"
```

---

## Task 10: S8 / S9 ocultas (placeholders documentados)

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar las dos secciones ocultas como comentarios + bloques con `hidden`**

Insertar tras `</section>` de experiencia. Quedan en el DOM pero ocultas, listas para activar al recolectar contenido:

```html
  <!-- S8 TESTIMONIOS — OCULTA en PREVIEW. Pendiente de recolección (solo fuentes verificables). -->
  <section id="testimonios" class="reveal" hidden aria-hidden="true">
    <div class="container">
      <p class="sec__kicker">// Testimonios</p>
      <h2 class="sec__title">Pendiente de recolección</h2>
    </div>
  </section>

  <!-- S9 INSIGHTS / NEWSLETTER — OCULTA en PREVIEW. Campos [PENDING] en el SSOT (Substack, posts, cadencia). -->
  <section id="insights" class="reveal" hidden aria-hidden="true">
    <div class="container">
      <p class="sec__kicker">// Insights</p>
      <h2 class="sec__title">Pendiente</h2>
    </div>
  </section>
```

- [ ] **Step 2: Verificar que NO se renderizan**

Recargar. Expected: ni "Testimonios" ni "Insights" visibles en la página. El atributo `hidden` las suprime; siguen en el DOM para activación futura.

- [ ] **Step 3: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S8/S9 ocultas (placeholders documentados)"
```

---

## Task 11: S10 Contacto + Footer

**Files:**
- Modify: `index-canonico.html`

- [ ] **Step 1: Insertar Contacto y Footer**

```html
  <section id="contacto" class="contacto reveal">
    <div class="container">
      <p class="sec__kicker">// Contacto</p>
      <h2 class="sec__title">Hablemos</h2>
      <div class="cards-3">
        <article class="card">
          <h3 class="card__title">Para proyectos</h3>
          <p class="card__body">Agenda un diagnóstico para revisar tu operación o programa.</p>
          <a href="mailto:dm@diegomaury.mx" class="contacto__link">dm@diegomaury.mx</a>
        </article>
        <article class="card">
          <h3 class="card__title">Para empleo</h3>
          <p class="card__body">Entrevista o revisión de CV para roles de dirección de operaciones / programas.</p>
          <a href="mailto:dm@diegomaury.mx" class="contacto__link">dm@diegomaury.mx</a>
        </article>
        <article class="card">
          <h3 class="card__title">Contacto directo</h3>
          <p class="card__body">Correo y LinkedIn.</p>
          <a href="mailto:dm@diegomaury.mx" class="contacto__link">dm@diegomaury.mx</a>
          <a href="https://www.linkedin.com/in/diegomaury/" class="contacto__link" target="_blank" rel="noopener">LinkedIn</a>
        </article>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>© Diego Maury · Strategic Program &amp; Operations Director · <a href="mailto:dm@diegomaury.mx">dm@diegomaury.mx</a> · diegomaury.mx</p>
    </div>
  </footer>
```

- [ ] **Step 2: Añadir CSS de contacto y footer**

```css
    /* ── CONTACTO + FOOTER ── */
    .contacto { background: var(--dm-catalyst-700); }
    .contacto__link { display: block; font-family: var(--font-mono); font-size: 0.85rem; color: var(--dm-amethyst-text); margin-top: 0.7rem; }
    .footer { background: var(--dm-catalyst-900); border-top: 1px solid var(--dm-bento-border); padding-block: 2.5rem; }
    .footer p { font-family: var(--font-mono); font-size: 0.78rem; color: var(--dm-bone-40); text-align: center; }
```

- [ ] **Step 3: Verificar contenido contra SSOT**

Recargar. Expected: email `dm@diegomaury.mx` en TODOS los canales (no `hola@`), LinkedIn con `rel="noopener"`, footer con título correcto "Strategic Program & Operations Director".

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): S10 contacto + footer (dm@diegomaury.mx)"
```

---

## Task 12: JavaScript (scroll suave + nav activa + reveal con reduced-motion)

**Files:**
- Modify: `index-canonico.html` (dentro del `<script>` al final del body)

- [ ] **Step 1: Insertar el JS**

Reemplazar el comentario `// JS se añade en Task 12` dentro de `<script>` por:

```javascript
    // Scroll suave a secciones. Nombre scrollToSection (no scrollTo: evita choque con window.scrollTo).
    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelectorAll('a[data-scroll]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          scrollToSection(href.slice(1));
        }
      });
    });

    // Nav activa por sección visible.
    const navLinks = document.querySelectorAll('.nav__links a');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

    // Scroll reveal — respeta prefers-reduced-motion.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
```

- [ ] **Step 2: Añadir el CSS de reveal (dentro de `<style>`)**

```css
    /* ── SCROLL REVEAL ── */
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s var(--ease), transform 0.6s var(--ease); }
    .reveal.is-visible { opacity: 1; transform: none; }
    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1; transform: none; transition: none; }
    }
```

- [ ] **Step 3: Verificar comportamiento**

Recargar. Expected:
- Clic en links de nav hace scroll suave a la sección.
- Al hacer scroll, el link activo de la nav cambia.
- Las secciones aparecen con fade-up al entrar en viewport.
- En DevTools → Rendering → "Emulate prefers-reduced-motion: reduce": las secciones se ven de inmediato, sin animación, y el scroll es instantáneo.
- Consola sin errores.

- [ ] **Step 4: Commit**

```bash
git add index-canonico.html
git commit -m "feat(canonico): JS scroll suave + nav activa + reveal (reduced-motion)"
```

---

## Task 13: Verificación final (responsive, a11y, regresión de contenido, presupuesto)

**Files:**
- Modify: `index-canonico.html` (solo si la verificación detecta fallos)

- [ ] **Step 1: Regresión de contenido contra el SSOT**

Revisar manualmente que en `index-canonico.html`:
- [ ] Título/rol = "Strategic Program & Operations Director" (no "...Innovation Manager").
- [ ] Email = `dm@diegomaury.mx` en TODOS los puntos (nav implícita, contacto ×3, footer). Buscar que NO exista `hola@diegomaury.mx`.
- [ ] Métricas etiquetadas con alcance: 9,905 (4 ediciones), 3,231 (900+/edición), 3,000+ (HackSureste).
- [ ] RODI = "disponible a solicitud" + cost-avoidance modelado (sin cifra cruda inflada).
- [ ] Sin lenguaje de gurú, sin "DSL Innovation".
- [ ] 10 secciones presentes en orden; S8 y S9 con `hidden`.

Run (debe devolver vacío):
```bash
grep -n "hola@diegomaury\|Innovation Manager\|DSL Innovation\|autor más joven" index-canonico.html
```
Expected: sin resultados.

- [ ] **Step 2: Responsive sin overflow en 375 / 768 / 1280**

En DevTools, probar 375, 768 y 1280px. Expected: sin scroll horizontal de página en ninguno (la tabla S7 puede tener scroll interno propio).

- [ ] **Step 3: Accesibilidad básica**

- [ ] Navegar con Tab: el foco es visible (outline amethyst 2px) en links, botones y celdas bento.
- [ ] Las celdas bento responden a foco por teclado (elevan + borde interactivo).
- [ ] Contraste: números spark y texto bone legibles sobre fondos oscuros (ya auditado WCAG en el spec).

- [ ] **Step 4: Presupuesto de peso**

Run:
```bash
ls -l index-canonico.html
```
Expected: archivo único, holgadamente por debajo de los presupuestos (CSS+JS inline << 150 KB sin gzip; el JS lógico es < 80 KB gz trivialmente). Las fuentes son las locales ya existentes.

- [ ] **Step 5: Confirmar aislamiento del LIVE**

Run:
```bash
git status --short
```
Expected: cambios solo en `index-canonico.html` (y este plan/spec en `docs/`). `index.html`, `assets/css/styles.css`, `assets/js/main.js` SIN cambios.

- [ ] **Step 6: Commit final (si hubo correcciones)**

```bash
git add index-canonico.html
git commit -m "fix(canonico): correcciones de verificación final (responsive/a11y/contenido)"
```

---

## Cómo revisar el PREVIEW (Definition of Done)

1. Servir: `python -m http.server 8080` desde la raíz.
2. Abrir `http://localhost:8080/index-canonico.html` y compararlo lado a lado con `http://localhost:8080/index.html` (LIVE) usando los **5 criterios de comparación** del spec (legibilidad mobile, jerarquía del hero, claridad del CTA, densidad informativa, tiempo a comprensión).
3. Veredicto del owner (Diego): **Aprobar** (→ planear reemplazo del LIVE en sesión aparte) · **Iterar** (lista de ajustes) · **Archivar**.

> Promover a LIVE (retirar `noindex`, activar GTM/Clarity, renombrar a `index.html`) es una decisión posterior, fuera del alcance de este plan, y requiere aprobación explícita.
