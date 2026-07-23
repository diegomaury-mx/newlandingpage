# Prueba Social · Testimonios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una sección de prueba social a `index.html` con 3 testimonios estáticos indexables + un widget grid de Senja, y un bloque de testimonio único de Senja justo antes del CTA final — ambos widgets con carga diferida vía IntersectionObserver.

**Architecture:** `index.html` es autocontenido (CSS inline en `<style>`, JS inline en `<script>` al final del `<body>`, sin cargar `styles.css` ni `assets/js/main.js`). Todo el trabajo vive dentro de ese único archivo: nuevas reglas CSS en el bloque `<style>` existente, nuevo markup HTML entre las secciones `ip` y `servicios`, y antes de `contacto`, y nueva lógica JS añadida al `<script>` inline que ya maneja el `IntersectionObserver` de `data-reveal`.

**Tech Stack:** HTML5 + CSS3 + JS vanilla (sin build, sin frameworks). QA: Playwright + `@axe-core/playwright` (`tests/qa/`).

---

## Contexto de archivo único

Todo el trabajo de este plan modifica `index.html`. Puntos de referencia exactos en el archivo (antes de cualquier edición):

- Línea 572: comentario `/* ── SERVICES (S7) ── */` — el bloque de estilos IP termina justo antes.
- Línea 1172: `</section>` que cierra `id="ip"`.
- Línea 1174: `<!-- S7 SERVICIOS -->` — apertura de la sección de servicios.
- Línea 1242: `<!-- S9 CTA FINAL -->` — comentario justo antes de `<section ... id="contacto">`.
- Línea 1413: `</script>` que cierra el bloque de JS inline, justo antes de `</body>`.

Cada task indica la edición exacta con `old_string`/`new_string` conceptual (bloques `Modify:` con contenido completo a insertar).

---

### Task 1: CSS de las tarjetas de testimonios y de los contenedores de widgets

**Files:**
- Modify: `index.html` (bloque `<style>`, insertar antes de la línea 572 `/* ── SERVICES (S7) ── */`)

- [ ] **Step 1: Insertar el bloque de estilos `PRUEBA SOCIAL`**

Insertar el siguiente bloque completo inmediatamente antes de la línea `/* ── SERVICES (S7) ── */` (que hoy es la línea 572):

```css
    /* ── PRUEBA SOCIAL (S6) ── */
    .testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    @media (max-width: 900px) { .testimonial-grid { grid-template-columns: 1fr; } }
    .testimonial-card {
      background: var(--bg-2); border: 1px solid var(--border);
      border-radius: 13px; padding: 26px 26px 24px;
      display: flex; flex-direction: column; gap: 18px;
      transition: border-color 200ms, transform 250ms var(--ease);
    }
    .testimonial-card:hover { border-color: var(--t3); transform: translateY(-3px); }
    .testimonial-quote { font-size: 13.5px; line-height: 1.65; color: var(--t2); flex-grow: 1; }
    .testimonial-cite { display: flex; flex-direction: column; gap: 2px; padding-top: 14px; border-top: 1px solid var(--border); }
    .testimonial-name { font-size: 13px; font-weight: 700; color: var(--t1); }
    .testimonial-role {
      font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--t3);
    }
    .testimonial-mount { min-height: 200px; }
    .testimonial-mount--single { min-height: 260px; max-width: 640px; margin: 0 auto; }
```

- [ ] **Step 2: Verificar visualmente que no rompe el CSS existente**

Abrir `index.html` directamente en el navegador (o `python -m http.server 8080` desde la raíz y visitar `http://localhost:8080`) y confirmar que el sitio sigue renderizando igual que antes (todavía no hay markup nuevo que use estas clases).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(css): agrega estilos de tarjetas de testimonios y contenedores de widget Senja"
```

---

### Task 2: Sección de prueba social (3 fragmentos estáticos + mount del widget grid)

**Files:**
- Modify: `index.html:1172-1174` (insertar nueva `<section>` entre el cierre de `id="ip"` y la apertura de `id="servicios"`)

- [ ] **Step 1: Insertar la sección `prueba-social`**

Insertar el siguiente bloque completo inmediatamente después de la línea `</section>` que cierra `id="ip"` (hoy línea 1172) y antes del comentario `<!-- S7 SERVICIOS -->` (hoy línea 1174):

```html
<!-- S6 PRUEBA SOCIAL -->
<section class="section" id="prueba-social">
  <div class="section-inner">
    <div class="section-label" data-reveal>Prueba social</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">No es autopromoción. Es lo que dicen quienes ya trabajaron conmigo.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Colegas, supervisores y clientes con los que he trabajado directamente en programas, hackathons y operaciones.</p>
    <div class="testimonial-grid" data-reveal style="--delay:.18s">
      <div class="testimonial-card">
        <p class="testimonial-quote">"Diego is a truly extraordinary person to work with. He is constantly and consistently offering new ideas... The results Diego brings to his work are always above what is expected of him."</p>
        <div class="testimonial-cite">
          <span class="testimonial-name">Shaili Zappa</span>
          <span class="testimonial-role">Technical Recruiter, Platzi (fue su supervisora)</span>
          <a class="inline-link" href="https://linkedin.com/in/shailizappa" target="_blank" rel="noopener" style="font-size:11px; margin-top:4px;">LinkedIn ↗</a>
        </div>
      </div>
      <div class="testimonial-card">
        <p class="testimonial-quote">"Su ambición de hacerlo diferente... el pensamiento lateral en la resolución de problemas... la capacidad colaborativa de conocer y reunir a los mejores."</p>
        <div class="testimonial-cite">
          <span class="testimonial-name">Jorge Acevedo Pallares</span>
          <span class="testimonial-role">Director de Carbono y Sustentabilidad, Agencia Mexicana de Estudios Antárticos</span>
        </div>
      </div>
      <div class="testimonial-card">
        <p class="testimonial-quote">"En mi tiempo de conocer a Diego, el ha liderado iniciativas de las mas grandes que jamás haya visto México... Hackathon Nacional Redux, en el cual el fue mi proveedor."</p>
        <div class="testimonial-cite">
          <span class="testimonial-name">Victor Calzadillas</span>
          <span class="testimonial-role">Community Builder, Startup Chihuahua</span>
        </div>
      </div>
    </div>
    <div class="testimonial-mount" id="senjaGridMount" data-reveal style="--delay:.24s"></div>
  </div>
</section>

```

- [ ] **Step 2: Verificar en navegador**

Recargar `index.html` en el navegador y confirmar: la nueva sección aparece entre "Sistemas propios" y "Formas de trabajar conmigo", las 3 cards se ven con el estilo de `.testimonial-card` (superficie `--bg-2`, borde, hover con elevación), y el contenedor `#senjaGridMount` está vacío (todavía sin JS que lo llene — eso es Task 4).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(content): agrega seccion de prueba social con 3 testimonios estaticos"
```

---

### Task 3: Bloque de testimonio único antes del CTA final

**Files:**
- Modify: `index.html:1242` (insertar nueva `<section>` inmediatamente antes de `<!-- S9 CTA FINAL -->`)

- [ ] **Step 1: Insertar el bloque `respaldo`**

Insertar el siguiente bloque completo inmediatamente antes del comentario `<!-- S9 CTA FINAL -->` (hoy línea 1242):

```html
<!-- S8 RESPALDO (testimonio único, pre-CTA) -->
<section class="section" id="respaldo">
  <div class="section-inner">
    <div class="section-label" data-reveal>Confianza directa</div>
    <div class="testimonial-mount testimonial-mount--single" id="senjaSingleMount" data-reveal style="--delay:.06s"></div>
  </div>
</section>

```

- [ ] **Step 2: Verificar en navegador**

Recargar `index.html` y confirmar que el bloque "Confianza directa" aparece entre "Formas de trabajar conmigo" (servicios) y "Siguiente paso" (CTA final), con el contenedor `#senjaSingleMount` vacío.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(content): agrega bloque de testimonio unico antes del CTA final"
```

---

### Task 4: Carga diferida de los widgets de Senja vía IntersectionObserver

**Files:**
- Modify: `index.html` (bloque `<script>` inline, insertar antes de la línea final `</script>` — hoy línea 1413, justo después del bloque "Metric counters")

- [ ] **Step 1: Insertar el módulo de carga diferida de Senja**

Insertar el siguiente bloque completo inmediatamente antes de la etiqueta de cierre `</script>` (hoy línea 1413), después del bloque `// ── Metric counters ──`:

```javascript

  // ── Senja: carga diferida de widgets (grid + single) ──
  function mountSenjaWidget(mountEl, widgetId) {
    if (!mountEl || mountEl.dataset.senjaLoaded) return;
    mountEl.dataset.senjaLoaded = 'true';

    const embed = document.createElement('div');
    embed.className = 'senja-embed';
    embed.dataset.id = widgetId;
    embed.dataset.mode = 'shadow';
    embed.dataset.lazyload = 'false';
    embed.style.display = 'block';
    embed.style.width = '100%';
    mountEl.appendChild(embed);

    const script = document.createElement('script');
    script.src = `https://widget.senja.io/widget/${widgetId}/platform.js`;
    script.async = true;
    document.body.appendChild(script);
  }

  const senjaWidgets = [
    { id: 'senjaGridMount', widgetId: '93ff9581-ba54-4ba8-a053-f7d0889cd4d0' },
    { id: 'senjaSingleMount', widgetId: 'd5b4c965-596d-4cb7-81d0-ef2a0b60ab6c' },
  ];

  const senjaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = senjaWidgets.find(w => w.id === entry.target.id);
        if (match) mountSenjaWidget(entry.target, match.widgetId);
        senjaObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' });

  senjaWidgets.forEach(w => {
    const el = document.getElementById(w.id);
    if (el) senjaObserver.observe(el);
  });
```

- [ ] **Step 2: Verificar la carga diferida en el navegador**

1. Abrir `index.html` con `python -m http.server 8080` desde la raíz del repo y navegar a `http://localhost:8080`.
2. Abrir DevTools → Network, filtrar por `senja`.
3. Cargar la página: no debe haber ninguna petición a `widget.senja.io` todavía.
4. Hacer scroll hasta la sección "Prueba social": debe dispararse la petición a `.../93ff9581-.../platform.js` y el widget grid debe renderizar.
5. Seguir scrolleando hasta "Confianza directa": debe dispararse la petición a `.../d5b4c965-.../platform.js` y el widget de tarjeta individual debe renderizar.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(perf): carga diferida de widgets Senja via IntersectionObserver"
```

---

### Task 5: QA completo y verificación final

**Files:**
- No modifica archivos (solo ejecuta la suite de QA existente)

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: exit 0, sin errores de stylelint/htmlhint sobre `index.html`.

- [ ] **Step 2: Accesibilidad**

Run: `npm run test:a11y`
Expected: exit 0, sin violaciones `serious`/`critical` de axe-core en `home` (índice `index.html`). Si aparece alguna violación en las tarjetas nuevas (ej. contraste de `.testimonial-role` sobre `--bg-2`), ajustar el color en el CSS de Task 1 hasta que pase.

- [ ] **Step 3: Visual**

Run: `npm run verify:visual`
Expected: exit 0, se generan capturas nuevas en `qa-output/screenshots/` (desktop + mobile) para `home` incluyendo las dos secciones nuevas. Revisar manualmente `qa-output/screenshots/*/home.png` en 375/768/1440 para confirmar que el ritmo visual no se rompe (spacing, alineación de las 3 cards, bloque single centrado).

- [ ] **Step 4: Verificar metadatos**

Run: `node tools/verify-metrics.js`
Expected: exit 0 (esta tarea no toca ninguna cifra del SSOT, pero es el gate obligatorio antes de cualquier commit que toque `index.html` según `CLAUDE.md`).

- [ ] **Step 5: Commit final si hubo ajustes de QA**

Si algún paso anterior requirió cambios en `index.html`:

```bash
git add index.html
git commit -m "fix(qa): ajustes de contraste/layout tras verificacion a11y y visual"
```

Si no hubo cambios, no hay nada que commitear en este paso.

---

## Fuera de alcance (recordatorio, ver spec)

- No se crea colección `testimonials` en Astro/Diego CMS.
- No se agregan los otros 7 testimonios verbatim al HTML estático (viven en Notion + se curan en Senja).
- No se agrega entrada de navegación para las secciones `prueba-social`/`respaldo` en `#navLinks` (no fue parte del diseño aprobado; el `navObserver` ya tolera secciones sin link correspondiente).
