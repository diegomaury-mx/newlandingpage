# Portfolio Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `.worktrees/build/portfolio/index.html` — galería de proyectos organizada por era con índice lateral sticky y timeline vertical.

**Architecture:** Tres archivos nuevos (HTML, CSS, JS portfolio-específico). Reutiliza `../assets/css/styles.css` para los tokens DS y `../assets/js/main.js` para nav burger + scroll reveal (ya implementados). El JS de eras es mínimo: un `IntersectionObserver` que actualiza la clase `is-active` en el índice lateral.

**Tech Stack:** HTML5, CSS3, JavaScript ES6+ vanilla. Design System: tokens de `dm_design` ya presentes en `styles.css` vía `:root`.

---

## Archivos

| Acción | Ruta |
|--------|------|
| Crear | `.worktrees/build/portfolio/index.html` |
| Crear | `.worktrees/build/portfolio/portfolio.css` |
| Crear | `.worktrees/build/portfolio/portfolio.js` |

---

### Task 1: HTML skeleton completo

**Files:**
- Create: `.worktrees/build/portfolio/index.html`

- [ ] **Step 1: Crear el archivo con toda la estructura HTML**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio — Diego Maury</title>
  <meta name="description" content="Todos los proyectos de Diego Maury: programas de innovación, sistemas digitales y aceleración en LATAM.">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="portfolio.css">
</head>
<body class="pf-page">

  <!-- NAV -->
  <nav class="nav" id="nav">
    <div class="container nav__inner">
      <a href="/" class="nav__brand">
        <img src="../assets/img/isotipodm.svg" alt="Isotipo DM" class="nav__logo">
        <span class="nav__name">Diego Maury</span>
      </a>
      <ul class="nav__links">
        <li><a href="/#work"      class="nav__link is-active">Work</a></li>
        <li><a href="/#servicios" class="nav__link">Servicios</a></li>
        <li><a href="/#about"     class="nav__link">About</a></li>
        <li><a href="/#contacto"  class="nav__link">Contacto</a></li>
      </ul>
      <a href="https://calendly.com/diegomaurymx" target="_blank" rel="noopener" class="btn btn--primary nav__cta">Agendar</a>
      <button class="nav__burger" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- HEADER -->
  <header class="pf-header">
    <div class="container pf-header__inner">
      <p class="pf-header__tag">ALL PROJECTS</p>
      <h1 class="pf-header__title">Una trayectoria<br>de ejecución.</h1>
      <p class="pf-header__sub">30+ programas. Tres eras. Resultados medibles.</p>
    </div>
  </header>

  <!-- TIMELINE -->
  <section class="pf-timeline" aria-label="Proyectos por era">
    <div class="container pf-timeline__inner">

      <!-- ÍNDICE LATERAL -->
      <nav class="pf-index" aria-label="Eras de trabajo">
        <div class="pf-index__line" aria-hidden="true"></div>
        <ol class="pf-index__list">
          <li class="pf-index__item is-active" data-era="era-01">
            <button class="pf-index__btn" aria-current="true" data-target="era-01">
              <span class="pf-index__dot" aria-hidden="true"></span>
              <span class="pf-index__label">
                <span class="pf-index__num">ERA 01</span>
                <span class="pf-index__range">2019–2021</span>
                <span class="pf-index__name">Ecosistemas corporativos</span>
              </span>
            </button>
          </li>
          <li class="pf-index__item" data-era="era-02">
            <button class="pf-index__btn" aria-current="false" data-target="era-02">
              <span class="pf-index__dot" aria-hidden="true"></span>
              <span class="pf-index__label">
                <span class="pf-index__num">ERA 02</span>
                <span class="pf-index__range">2020–2022</span>
                <span class="pf-index__name">Sistemas y operaciones</span>
              </span>
            </button>
          </li>
          <li class="pf-index__item" data-era="era-03">
            <button class="pf-index__btn" aria-current="false" data-target="era-03">
              <span class="pf-index__dot" aria-hidden="true"></span>
              <span class="pf-index__label">
                <span class="pf-index__num">ERA 03</span>
                <span class="pf-index__range">2021–2023</span>
                <span class="pf-index__name">Metodología y alcance nacional</span>
              </span>
            </button>
          </li>
        </ol>
      </nav>

      <!-- ERAS + CARDS -->
      <div class="pf-eras">

        <!-- ERA 01 -->
        <div class="pf-era" id="era-01">
          <div class="pf-era__heading">
            <span class="pf-era__num">ERA 01</span>
            <h2 class="pf-era__title">Ecosistemas corporativos</h2>
            <p class="pf-era__tagline">"De convocatoria local a referente nacional."</p>
          </div>
          <div class="pf-era__cards">
            <article class="pf-card" data-reveal>
              <div class="pf-card__topbar" aria-hidden="true"></div>
              <div class="pf-card__inner">
                <div class="pf-card__badges">
                  <span class="pf-badge pf-badge--amethyst">ERA 01</span>
                  <span class="pf-badge pf-badge--ember">Programa de Innovación</span>
                </div>
                <h3 class="pf-card__name">HEINEKEN Green Challenge</h3>
                <p class="pf-card__desc">Diseño y operación del programa nacional de innovación en sustentabilidad de HEINEKEN México.</p>
                <div class="pf-card__meta">
                  <div class="pf-card__cambios">
                    <span class="pf-card__cambios-num">4</span>
                    <span class="pf-card__cambios-label">cambios aterrizados</span>
                  </div>
                  <span class="pf-card__years">2019–2022</span>
                </div>
                <a href="../cases/heineken.html" class="pf-card__cta"
                   aria-label="Ver caso completo: HEINEKEN Green Challenge">
                  Ver caso completo →
                </a>
              </div>
            </article>
          </div>
        </div>

        <!-- ERA 02 -->
        <div class="pf-era" id="era-02">
          <div class="pf-era__heading">
            <span class="pf-era__num">ERA 02</span>
            <h2 class="pf-era__title">Sistemas y operaciones</h2>
            <p class="pf-era__tagline">"Procesos que funcionan sin el operador."</p>
          </div>
          <div class="pf-era__cards">
            <article class="pf-card" data-reveal>
              <div class="pf-card__topbar" aria-hidden="true"></div>
              <div class="pf-card__inner">
                <div class="pf-card__badges">
                  <span class="pf-badge pf-badge--amethyst">ERA 02</span>
                  <span class="pf-badge pf-badge--ember">Digital Ops</span>
                </div>
                <h3 class="pf-card__name">Innovation Systems</h3>
                <p class="pf-card__desc">Construcción de sistemas de innovación para FlipHouse, HackSureste y CAVA Soft.</p>
                <div class="pf-card__meta">
                  <div class="pf-card__cambios">
                    <span class="pf-card__cambios-num">4</span>
                    <span class="pf-card__cambios-label">cambios aterrizados</span>
                  </div>
                  <span class="pf-card__years">2020–2022</span>
                </div>
                <a href="../cases/innovation-systems.html" class="pf-card__cta"
                   aria-label="Ver caso completo: Innovation Systems">
                  Ver caso completo →
                </a>
              </div>
            </article>
          </div>
        </div>

        <!-- ERA 03 -->
        <div class="pf-era" id="era-03">
          <div class="pf-era__heading">
            <span class="pf-era__num">ERA 03</span>
            <h2 class="pf-era__title">Metodología y alcance nacional</h2>
            <p class="pf-era__tagline">"Una metodología clara vale más que un mentor brillante."</p>
          </div>
          <div class="pf-era__cards">
            <article class="pf-card" data-reveal>
              <div class="pf-card__topbar" aria-hidden="true"></div>
              <div class="pf-card__inner">
                <div class="pf-card__badges">
                  <span class="pf-badge pf-badge--amethyst">ERA 03</span>
                  <span class="pf-badge pf-badge--ember">Aceleración</span>
                </div>
                <h3 class="pf-card__name">REDUX + INCmty Challenges</h3>
                <p class="pf-card__desc">Framework de aceleración de 8 semanas operado en los 32 estados de México.</p>
                <div class="pf-card__meta">
                  <div class="pf-card__cambios">
                    <span class="pf-card__cambios-num">4</span>
                    <span class="pf-card__cambios-label">cambios aterrizados</span>
                  </div>
                  <span class="pf-card__years">2021–2023</span>
                </div>
                <a href="../cases/redux-incmty.html" class="pf-card__cta"
                   aria-label="Ver caso completo: REDUX + INCmty Challenges">
                  Ver caso completo →
                </a>
              </div>
            </article>
          </div>
        </div>

      </div><!-- /pf-eras -->
    </div><!-- /container -->
  </section>

  <!-- CTA -->
  <section class="pf-cta">
    <div class="container pf-cta__inner">
      <p class="pf-cta__question">¿Quieres ver cómo aplica esto a tu organización?</p>
      <a href="https://calendly.com/diegomaurymx" target="_blank" rel="noopener" class="btn btn--primary">
        Agendar diagnóstico →
      </a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer__bar"></div>
    <div class="container footer__inner">
      <span class="footer__tagline">Hagamos que las cosas pasen</span>
      <span class="footer__copy">© 2026 Diego Maury · CDMX</span>
    </div>
  </footer>

  <script src="../assets/js/main.js"></script>
  <script src="portfolio.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificar que la página carga sin 404**

```bash
cd .worktrees/build && python -m http.server 8080
```

Abrir `http://localhost:8080/portfolio/index.html`.
Esperado: página carga. Nav y footer visibles (sin estilos portfolio aún). Sin errores 404 en consola.

- [ ] **Step 3: Commit**

```bash
git -C .worktrees/build add portfolio/index.html
git -C .worktrees/build commit -m "feat: portfolio gallery HTML skeleton"
```

---

### Task 2: CSS — base de página y header

**Files:**
- Create: `.worktrees/build/portfolio/portfolio.css`

- [ ] **Step 1: Crear portfolio.css con reset de página y header**

```css
/* ═══════════════════════════════════════
   PORTFOLIO PAGE
   Depende de: ../assets/css/styles.css (tokens DS en :root)
═══════════════════════════════════════ */

/* ── PAGE BASE ── */
.pf-page {
  background: var(--dm-ink);
  color: var(--dm-bone);
}

/* ── HEADER ── */
.pf-header {
  padding: calc(var(--nav-h) + 5rem) 0 4rem;
  background: linear-gradient(180deg, var(--dm-catalyst-900) 0%, var(--dm-ink) 100%);
  position: relative;
  overflow: hidden;
}

.pf-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../assets/img/isotipodm.svg');
  background-repeat: repeat;
  background-size: 120px;
  opacity: 0.022;
  pointer-events: none;
}

.pf-header__inner {
  position: relative;
  z-index: 1;
}

.pf-header__tag {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--dm-ember);
  margin: 0 0 1rem;
}

.pf-header__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--dm-bone);
  margin: 0 0 1.25rem;
}

.pf-header__sub {
  font-family: var(--font-body);
  font-size: 1rem;
  color: rgba(245, 245, 247, 0.60);
  margin: 0;
}

/* ── TIMELINE LAYOUT ── */
.pf-timeline {
  padding: 5rem 0 6rem;
}

.pf-timeline__inner {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 4rem;
  align-items: start;
}

@media (max-width: 1023px) {
  .pf-timeline__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

- [ ] **Step 2: Verificar en browser**

`http://localhost:8080/portfolio/index.html`

Verificar:
- Fondo `#0F0A1A` (dark ink)
- Header con gradiente de `#120D1A` a `#0F0A1A`
- "ALL PROJECTS" en ember (#FF5C39)
- H1 grande y bold en bone
- Sub en bone/60%
- Desktop >1024px: dos columnas visibles

- [ ] **Step 3: Commit**

```bash
git -C .worktrees/build add portfolio/portfolio.css
git -C .worktrees/build commit -m "feat: portfolio base CSS, header, timeline layout"
```

---

### Task 3: CSS — índice lateral de eras

**Files:**
- Modify: `.worktrees/build/portfolio/portfolio.css`

- [ ] **Step 1: Añadir al final de portfolio.css los estilos del índice**

```css
/* ── ÍNDICE LATERAL ── */
.pf-index {
  position: sticky;
  top: calc(var(--nav-h) + 2rem);
  align-self: start;
}

.pf-index__line {
  position: absolute;
  left: 7px;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: rgba(124, 63, 190, 0.20);
}

.pf-index__list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pf-index__btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  width: 100%;
}

.pf-index__dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid var(--dm-grey);
  background: transparent;
  flex-shrink: 0;
  margin-top: 2px;
  transition: border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
              background   300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pf-index__item.is-active .pf-index__dot {
  background: var(--dm-amethyst);
  border-color: var(--dm-amethyst);
}

.pf-index__label {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.pf-index__num,
.pf-index__range {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dm-grey);
  transition: color 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pf-index__name {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--dm-grey);
  line-height: 1.3;
  margin-top: 0.25rem;
  transition: color 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pf-index__item.is-active .pf-index__num,
.pf-index__item.is-active .pf-index__range,
.pf-index__item.is-active .pf-index__name {
  color: var(--dm-bone);
}

/* Mobile: tabs horizontales */
@media (max-width: 1023px) {
  .pf-index {
    position: static;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .pf-index::-webkit-scrollbar { display: none; }
  .pf-index__line { display: none; }

  .pf-index__list {
    flex-direction: row;
    gap: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.10);
    padding-bottom: 0;
  }

  .pf-index__item { flex-shrink: 0; }

  .pf-index__btn {
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1.25rem;
    border-bottom: 2px solid transparent;
    transition: border-color 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .pf-index__item.is-active .pf-index__btn {
    border-bottom-color: var(--dm-amethyst);
  }

  .pf-index__dot  { display: none; }
  .pf-index__name { display: none; }

  .pf-index__label {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
}
```

- [ ] **Step 2: Verificar en browser**

Desktop: índice vertical a la izquierda. ERA 01 tiene dot relleno amethyst (clase `is-active` en HTML). ERAs 02 y 03 en gris.

Mobile DevTools (375px): tres tabs horizontales "ERA 01 / ERA 02 / ERA 03". ERA 01 con border-bottom amethyst.

- [ ] **Step 3: Commit**

```bash
git -C .worktrees/build add portfolio/portfolio.css
git -C .worktrees/build commit -m "feat: portfolio era index sidebar CSS"
```

---

### Task 4: CSS — eras y cards

**Files:**
- Modify: `.worktrees/build/portfolio/portfolio.css`

- [ ] **Step 1: Añadir al final de portfolio.css los estilos de eras y cards**

```css
/* ── ERAS ── */
.pf-eras {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.pf-era {
  scroll-margin-top: calc(var(--nav-h) + 2rem);
}

.pf-era__heading {
  margin-bottom: 2rem;
}

.pf-era__num {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--dm-ember);
  display: block;
  margin-bottom: 0.375rem;
}

.pf-era__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  color: var(--dm-bone);
  margin: 0 0 0.5rem;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.pf-era__tagline {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: rgba(245, 245, 247, 0.60);
  font-style: italic;
  margin: 0;
}

.pf-era__cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── CASE CARD ── */
.pf-card {
  background: linear-gradient(180deg, var(--dm-catalyst-900) 0%, var(--dm-ink) 100%);
  border: 1px solid rgba(124, 63, 190, 0.20);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pf-card:hover {
  transform: translateY(-2px);
  border-color: rgba(124, 63, 190, 0.45);
  box-shadow: 0 8px 32px rgba(124, 63, 190, 0.15);
}

.pf-card__topbar {
  height: 2px;
  background: linear-gradient(90deg, #7C3FBE 0%, #4B2672 55%, #FF5C39 100%);
}

.pf-card__inner {
  padding: 2rem;
}

.pf-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.pf-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.3125rem 0.625rem;
  border-radius: 4px;
}

.pf-badge--amethyst {
  background: rgba(124, 63, 190, 0.18);
  color: var(--dm-amethyst);
}

.pf-badge--ember {
  background: rgba(255, 92, 57, 0.14);
  color: var(--dm-ember);
}

.pf-card__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.375rem;
  color: var(--dm-bone);
  margin: 0 0 0.75rem;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.pf-card__desc {
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.65;
  color: rgba(245, 245, 247, 0.75);
  margin: 0 0 1.5rem;
}

.pf-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.pf-card__cambios {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.pf-card__cambios-num {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.75rem;
  line-height: 1;
  color: var(--dm-spark);
  letter-spacing: -0.02em;
}

.pf-card__cambios-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--dm-grey);
}

.pf-card__years {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--dm-grey);
  letter-spacing: 0.04em;
}

.pf-card__cta {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--dm-bone);
  text-decoration: none;
  border: 1.5px solid rgba(255, 255, 255, 0.20);
  border-radius: 6px;
  padding: 0.625rem 1.125rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: border-color 150ms cubic-bezier(0.16, 1, 0.3, 1),
              background   150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pf-card__cta:hover {
  border-color: rgba(255, 255, 255, 0.40);
  background: rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 2: Verificar en browser**

Las 3 cards se ven así:
- Fondo dark con gradiente (catalyst-900 → ink)
- Barra tricolor 2px arriba (violeta → amethyst → naranja)
- Badges en amethyst y ember
- Nombre en bone, descripción en bone/75%
- "4" en spark gold (#E6B800), "cambios aterrizados" en grey mono debajo
- Año en grey mono a la derecha
- Botón ghost "Ver caso completo →"
- Hover: sube 2px, border amethyst más brillante, shadow

- [ ] **Step 3: Commit**

```bash
git -C .worktrees/build add portfolio/portfolio.css
git -C .worktrees/build commit -m "feat: portfolio era headings and case card CSS"
```

---

### Task 5: CSS — CTA, scroll reveal, footer

**Files:**
- Modify: `.worktrees/build/portfolio/portfolio.css`

- [ ] **Step 1: Añadir al final de portfolio.css**

```css
/* ── CTA ── */
.pf-cta {
  padding: 5rem 0;
  background: linear-gradient(180deg, var(--dm-ink) 0%, var(--dm-catalyst-900) 100%);
  text-align: center;
}

.pf-cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.pf-cta__question {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  color: var(--dm-bone);
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

/* ── SCROLL REVEAL ── */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: Verificar en browser**

- Sección CTA visible con gradiente ink → catalyst-900
- Texto grande en bone
- Botón amethyst (clase `btn btn--primary` heredada de styles.css)
- Las 3 cards empiezan en opacity: 0 (se volverán visibles con JS)

- [ ] **Step 3: Commit**

```bash
git -C .worktrees/build add portfolio/portfolio.css
git -C .worktrees/build commit -m "feat: portfolio CTA and scroll reveal CSS"
```

---

### Task 6: JS — era observer

**Files:**
- Create: `.worktrees/build/portfolio/portfolio.js`

- [ ] **Step 1: Crear portfolio.js**

```javascript
// ── Portfolio: era index activo + scroll-to ──

const eraItems    = document.querySelectorAll('.pf-index__item');
const eraButtons  = document.querySelectorAll('.pf-index__btn');
const eraSections = document.querySelectorAll('.pf-era');

function setActiveEra(eraId) {
  eraItems.forEach(item => {
    const isActive = item.dataset.era === eraId;
    item.classList.toggle('is-active', isActive);
    const btn = item.querySelector('.pf-index__btn');
    if (btn) btn.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

eraButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const eraObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveEra(entry.target.id);
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

eraSections.forEach(section => eraObserver.observe(section));
```

- [ ] **Step 2: Verificar scroll reveal de cards**

El `main.js` ya contiene `IntersectionObserver` para `[data-reveal]`. Verificar que al cargar y hacer scroll las cards aparecen con fade + slide.

Si las cards no aparecen: abrir consola del browser. Si hay error "Cannot read properties of null" en main.js, es porque main.js busca `#nav` que existe en la página — verificar que el `<nav id="nav">` está en el HTML (ya está en Task 1).

- [ ] **Step 3: Verificar era observer**

1. Abrir `http://localhost:8080/portfolio/index.html`
2. Hacer scroll lento hacia abajo
3. Al llegar a ERA 02: el dot y labels del índice lateral cambian de gris a bone/amethyst
4. Al llegar a ERA 03: lo mismo
5. Click en "ERA 02" del índice → smooth scroll a esa sección
6. Mobile: click en tab "ERA 02" → smooth scroll

- [ ] **Step 4: Commit**

```bash
git -C .worktrees/build add portfolio/portfolio.js
git -C .worktrees/build commit -m "feat: portfolio era IntersectionObserver JS"
```

---

### Task 7: QA y checklist final

**Files:**
- Modify: `.worktrees/build/portfolio/index.html` (ajustes puntuales si aplica)

- [ ] **Step 1: Checklist desktop (1280px)**

`http://localhost:8080/portfolio/index.html` a 1280px de ancho.

- [ ] Nav: logo SVG carga, "Work" tiene clase `is-active` (subrayado)
- [ ] Header: "ALL PROJECTS" en ember, H1 grande bone, sub en bone/60%
- [ ] Índice sticky: ERA 01 activa (dot relleno amethyst, texto bone)
- [ ] Scroll hacia abajo: ERA 02 se activa en el índice al llegar a su sección
- [ ] Scroll hacia abajo: ERA 03 se activa al llegar a su sección
- [ ] Cards: topbar tricolor visible, badges, nombre, descripción, "4" en gold, años en grey
- [ ] Hover en card: sube 2px, border amethyst más intenso, shadow
- [ ] Click "Ver caso completo" Heineken → navega a `http://localhost:8080/cases/heineken.html`
- [ ] Click "Ver caso completo" Innovation Systems → navega a `/cases/innovation-systems.html`
- [ ] Click "Ver caso completo" REDUX → navega a `/cases/redux-incmty.html`
- [ ] CTA: texto grande, botón amethyst funciona (abre Calendly)
- [ ] Footer: tricolor bar + tagline "Hagamos que las cosas pasen" + copyright

- [ ] **Step 2: Checklist mobile (375px — DevTools)**

Activar modo mobile en DevTools → 375px.

- [ ] Tabs "ERA 01 / ERA 02 / ERA 03" visibles horizontalmente sin overflow
- [ ] ERA 01 tiene border-bottom amethyst al cargar
- [ ] Click tab ERA 02 → scroll suave a esa sección, tab cambia a activa
- [ ] Cards en columna full-width sin overflow horizontal
- [ ] Texto legible (>14px body)
- [ ] Botón CTA toca los bordes correctamente
- [ ] Nav burger: toca el ícono → menú abre; toca link → menú cierra

- [ ] **Step 3: Checklist accesibilidad**

- [ ] Tab con teclado navega: logo nav → links nav → botón Agendar → botones del índice → links de cards → botón CTA
- [ ] En DevTools → Elements: `.pf-index__item.is-active .pf-index__btn` tiene `aria-current="true"`
- [ ] Links de cards tienen `aria-label` descriptivo visible en DevTools

- [ ] **Step 4: Lighthouse**

DevTools → Lighthouse → Device: Mobile → Categories: Performance + Accessibility → Analyze.

Meta: Performance ≥ 90, Accessibility ≥ 90.

Si Performance < 90: añadir `loading="lazy"` a imágenes que estén below-the-fold (en esta página no hay imágenes pesadas — solo el SVG del bg-pattern).

- [ ] **Step 5: Commit final**

```bash
git -C .worktrees/build add portfolio/
git -C .worktrees/build commit -m "feat: portfolio gallery complete — timeline eras, cards, mobile, a11y"
```

---

## Self-review

**Cobertura del spec:**
- ✅ `portfolio/index.html` — nav, header, timeline, CTA, footer
- ✅ Layout 2 columnas desktop / tabs scrollables mobile
- ✅ Índice lateral sticky con dots y transiciones
- ✅ 3 eras nombradas con micro-frases (Task 1 HTML)
- ✅ Cards dark con tricolor top bar, badges amethyst + ember
- ✅ "Cambios aterrizados" con número en spark gold (#E6B800)
- ✅ Links correctos a `/cases/heineken.html`, `/cases/innovation-systems.html`, `/cases/redux-incmty.html`
- ✅ `IntersectionObserver` para era activa (portfolio.js)
- ✅ Scroll reveal via `[data-reveal]` + `main.js` existente
- ✅ `prefers-reduced-motion` en CSS
- ✅ `aria-current` en era activa, `aria-label` en links de cards
- ✅ Reutiliza `styles.css` tokens y `main.js` burger/nav sin modificarlos

**Consistencia de nombres:**
- `pf-index__item[data-era]` → coincide con `pf-index__btn[data-target]` → coincide con `pf-era[id]` en HTML y `entry.target.id` en JS
- `setActiveEra(eraId)` → `item.dataset.era` → `era-01 / era-02 / era-03` — consistente en los 3 archivos

**Placeholders:** ninguno — todo el código está completo en cada step.
