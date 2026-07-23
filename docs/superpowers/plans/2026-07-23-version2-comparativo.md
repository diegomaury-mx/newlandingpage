# Version2 Comparativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `diegomaury.mx/version2` como una segunda versión completa y pública del home, con el copy de la maqueta Notion "Version nueva" (S1-S8), sin tocar `index.html`.

**Architecture:** Página estática autocontenida (`version2/index.html`), construida copiando `index.html` (mismo `<style>` inline, mismo `<script>` de nav/reveal/acordeón/contadores/Senja) y reemplazando cada sección por el copy nuevo, ajustando rutas relativas (`assets/`, `portfolio/` → `../assets/`, `../portfolio/`) y metadatos SEO. Se agregan 3 clases CSS nuevas para componentes que no existen hoy (diagrama ASCII, tabla de capacidades, link de caso dentro de tarjeta `.ip`). Todo lo demás reutiliza clases ya existentes en el DS V2.

**Tech Stack:** HTML5 + CSS3 (inline) + JS vanilla. Sin build. Verificación manual en navegador (no hay suite Playwright que cubra esta página, por decisión del spec).

---

## Referencia: no placeholders

Todo el copy exacto usado en cada tarea proviene literalmente del bloque S1-S8 de Notion "Version nueva" (`3a60fe3c51c5807eb0fccebfab883d17`) y de decisiones ya aprobadas en `docs/superpowers/specs/2026-07-23-version2-comparativo-design.md`. Las dos cifras propias sin alta en SSOT ("+30 programas e iniciativas lideradas", "400+ emprendedores formados") se escriben tal cual, sin `data-metric`, por decisión explícita de Diego (2026-07-23): `version2` no es el índice oficial y no pasa por `verify-metrics.js`.

---

### Task 1: Crear el archivo base `version2/index.html`

**Files:**
- Create: `version2/index.html` (copiado de `index.html`)

- [ ] **Step 1: Crear la carpeta y copiar el archivo base**

Run:
```bash
mkdir -p version2
cp index.html version2/index.html
```

Expected: `version2/index.html` existe y es idéntico a `index.html` (1517 líneas).

- [ ] **Step 2: Corregir rutas relativas (assets y portfolio) para el nuevo nivel de carpeta**

Run:
```bash
sed -i 's/="assets\//="..\/assets\//g; s/="portfolio\//="..\/portfolio\//g' version2/index.html
```

Expected: ningún `src="assets/` ni `href="assets/` ni `href="portfolio/` sobrevive sin el prefijo `../`. Verificar con:
```bash
grep -n '="assets/\|="portfolio/' version2/index.html
```
Expected: sin resultados (exit code 1 de grep, "no matches").

- [ ] **Step 3: Verificar que las rutas absolutas (con `/` inicial) no se tocaron**

Run:
```bash
grep -n '/cv/diego-maury-cv.pdf\|/politicas-privacidad.html\|/terminos-y-condiciones.html' version2/index.html
```
Expected: 4 líneas encontradas (CV en hero, CV en servicios que se elimina más adelante, CV en cta-section, políticas/términos en footer), todas SIN el prefijo `../` agregado por error.

- [ ] **Step 4: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): copia base de index.html con rutas relativas corregidas"
```

---

### Task 2: Metadatos SEO, `<title>`, canonical y JSON-LD

**Files:**
- Modify: `version2/index.html:22-47`

- [ ] **Step 1: Reemplazar el bloque de metadatos**

Old string (buscar en `version2/index.html`):
```html
  <title>Diego Maury · Strategic Program Director</title>
  <meta name="description" content="Strategic Program Director especializado en convertir estrategia en ejecución. Diseño programas, procesos y sistemas que generan capacidad organizacional mediante innovación, operaciones, IA y automatización.">
```

Wait — this description ya es la de la maqueta S8/SEO; **no existe en el archivo copiado** (el copiado trae la descripción vieja de `index.html`). Old string real a buscar:
```html
  <title>Diego Maury · Strategic Program Director</title>
  <meta name="description" content="Strategic Program Director. Encuentro el mecanismo que frena la ejecución de operaciones complejas y lo convierto en sistemas medibles que el equipo sostiene. Innovación, RevOps e IA en producción en LATAM.">
  <meta property="og:title" content="Diego Maury · Strategic Program Director">
  <meta property="og:description" content="Diseño y opero sistemas que convierten estrategia en ejecución real.">
  <meta property="og:url" content="https://diegomaury.mx/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://diegomaury.mx/assets/img/diego-maury.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Diego Maury · Strategic Program Director">
  <meta name="twitter:description" content="Diseño y opero sistemas que convierten estrategia en ejecución real.">
  <meta name="twitter:image" content="https://diegomaury.mx/assets/img/diego-maury.png">
  <link rel="canonical" href="https://diegomaury.mx/">
```

New string:
```html
  <title>Diego Maury · Strategic Program Director</title>
  <meta name="description" content="Strategic Program Director especializado en convertir estrategia en ejecución. Diseño programas, procesos y sistemas que generan capacidad organizacional mediante innovación, operaciones, IA y automatización.">
  <meta property="og:title" content="Diego Maury · Strategic Program Director">
  <meta property="og:description" content="Diseño programas, procesos y sistemas que convierten la estrategia en ejecución sostenible.">
  <meta property="og:url" content="https://diegomaury.mx/version2">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://diegomaury.mx/assets/img/diego-maury.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Diego Maury · Strategic Program Director">
  <meta name="twitter:description" content="Diseño programas, procesos y sistemas que convierten la estrategia en ejecución sostenible.">
  <meta name="twitter:image" content="https://diegomaury.mx/assets/img/diego-maury.png">
  <link rel="canonical" href="https://diegomaury.mx/version2">
```

- [ ] **Step 2: Actualizar el JSON-LD**

Old string:
```html
    "name": "Diego Maury",
    "url": "https://diegomaury.mx/",
    "image": "https://diegomaury.mx/assets/img/diego-maury.png",
    "jobTitle": "Strategic Program Director",
    "description": "Diseño y opero sistemas que convierten estrategia en ejecución real: programas de innovación, arquitecturas RevOps y ecosistemas de emprendimiento en LATAM.",
```

New string:
```html
    "name": "Diego Maury",
    "url": "https://diegomaury.mx/version2",
    "image": "https://diegomaury.mx/assets/img/diego-maury.png",
    "jobTitle": "Strategic Program Director",
    "description": "Diseño programas, procesos y sistemas que convierten la estrategia en ejecución sostenible.",
```

- [ ] **Step 3: Verificar en navegador que el `<head>` carga sin errores**

Run:
```bash
python -m http.server 8080
```
Abrir `http://localhost:8080/version2/` — Expected: la página carga (aunque el contenido de secciones todavía sea el viejo de `index.html`, eso se corrige en las tareas siguientes). Detener el servidor con Ctrl+C al terminar de verificar.

- [ ] **Step 4: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): actualiza metadatos SEO, canonical y JSON-LD para /version2"
```

---

### Task 3: Nav — nuevos anchors

**Files:**
- Modify: `version2/index.html` (bloque `<nav>`)

- [ ] **Step 1: Reemplazar los links del nav**

Old string:
```html
    <div class="nav__links" id="navLinks">
      <a href="#about" class="nav__link">Sobre mí</a>
      <a href="#tesis" class="nav__link">Propuesta</a>
      <a href="#trabajo" class="nav__link">Evidencia</a>
      <a href="#ip" class="nav__link">Sistemas</a>
      <a href="#patron" class="nav__link">Cómo trabajo</a>
      <a href="#servicios" class="nav__link">Servicios</a>
    </div>
```

New string:
```html
    <div class="nav__links" id="navLinks">
      <a href="#quien-soy" class="nav__link">Quién soy</a>
      <a href="#problema" class="nav__link">El problema</a>
      <a href="#evidencia" class="nav__link">Evidencia</a>
      <a href="#modelo" class="nav__link">Cómo trabajo</a>
      <a href="#sistemas-propios" class="nav__link">Sistemas propios</a>
      <a href="#conversemos" class="nav__link">Conversemos</a>
    </div>
```

- [ ] **Step 2: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): actualiza anchors del nav a la nueva estructura de secciones"
```

---

### Task 4: Sección Hero (S1)

**Files:**
- Modify: `version2/index.html` (sección `id="hero"`)

- [ ] **Step 1: Reemplazar el contenido del hero (label, h1, sub, métricas)**

Old string:
```html
<section class="section" id="hero">
  <div class="section-inner">
    <div class="hero-label" data-reveal>Strategic Program Director</div>
    <h1 class="hero-h1" data-reveal style="--delay:.08s">
      Transformo ambición en <span class="accent">sistemas que funcionan</span>.
    </h1>
    <p class="hero-sub" data-reveal style="--delay:.14s">
      Cuando una organización sabe a dónde quiere llegar pero no cómo convertir esa intención en una operación sostenible, ahí entro yo. Descubro el camino y construyo el sistema que lo hace realidad.
    </p>
    <div class="hero-ctas" data-reveal style="--delay:.2s">
      <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="btn-primary" target="_blank" rel="noopener">
        Agendar diagnóstico (30 min)
      </a>
      <a href="/cv/diego-maury-cv.pdf" class="btn-ghost" download>
        Descargar CV
      </a>
    </div>
    <div class="metrics" data-reveal style="--delay:.26s">
      <div class="metric">
        <div class="metric-n" data-metric="rodi-sofi">+1,291%</div>
        <div class="metric-l">RODI modelado</div>
        <div class="metric-s">Cost-avoidance modelado, 2025-2026</div>
      </div>
      <div class="metric">
        <div class="metric-n">10+</div>
        <div class="metric-l">Años de trayectoria</div>
        <div class="metric-s">7+ en innovación y ecosistemas</div>
      </div>
      <div class="metric">
        <div class="metric-n" data-count="9905" data-suffix="" data-metric="incmty-participantes-inscritos">9,905</div>
        <div class="metric-l">Participantes inscritos</div>
        <div class="metric-s">Agregado de programas INCmty (HGC incluido), estimado</div>
      </div>
    </div>
```

New string:
```html
<section class="section" id="hero">
  <div class="section-inner">
    <div class="hero-label" data-reveal>Diego Maury · Strategic Program Director</div>
    <h1 class="hero-h1" data-reveal style="--delay:.08s">
      Diseño programas, procesos y sistemas para convertir la visión en <span class="accent">resultados tangibles</span>.
    </h1>
    <p class="hero-sub" data-reveal style="--delay:.14s">
      Trabajo con organizaciones que saben lo que quieren lograr, pero necesitan un sistema para hacerlo realidad. Diseño programas, procesos y sistemas que integran estrategia, operaciones y tecnología para convertir objetivos en resultados tangibles y construir capacidades que el equipo pueda sostener por sí mismo.
    </p>
    <div class="hero-ctas" data-reveal style="--delay:.2s">
      <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="btn-primary" target="_blank" rel="noopener">
        Agendar diagnóstico (30 min)
      </a>
      <a href="/cv/diego-maury-cv.pdf" class="btn-ghost" download>
        Descargar CV
      </a>
    </div>
    <div class="metrics" data-reveal style="--delay:.26s">
      <div class="metric">
        <div class="metric-n" data-metric="rodi-sofi">+1,291%</div>
        <div class="metric-l">RODI modelado</div>
        <div class="metric-s">Cost-avoidance modelado, 2025-2026</div>
      </div>
      <div class="metric">
        <div class="metric-n">+30</div>
        <div class="metric-l">Programas e iniciativas lideradas</div>
        <div class="metric-s">Trayectoria acumulada, cifra propia</div>
      </div>
      <div class="metric">
        <div class="metric-n" data-count="9905" data-suffix="" data-metric="incmty-participantes-inscritos">9,905</div>
        <div class="metric-l">Participantes inscritos</div>
        <div class="metric-s">Agregado de programas INCmty (HGC incluido), estimado</div>
      </div>
    </div>
```

(El bloque `.trust` que sigue no se toca — mismo respaldo institucional.)

- [ ] **Step 2: Verificar visualmente**

Run: `python -m http.server 8080` (si no sigue corriendo) y abrir `http://localhost:8080/version2/#hero`.
Expected: headline nueva visible, 3 métricas (RODI, +30, 9,905), sin errores de consola.

- [ ] **Step 3: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): actualiza copy del hero (S1) con la maqueta nueva"
```

---

### Task 5: Sección Quién soy (S2, antes "about")

**Files:**
- Modify: `version2/index.html` (sección `id="about"` → `id="quien-soy"`)

- [ ] **Step 1: Reemplazar el `id` y el copy del bloque izquierdo**

Old string:
```html
<section class="about-section" id="about">
  <div class="about-body">
    <div class="about-left" data-reveal>
      <div>
        <div class="about-name">Diego Maury</div>
        <div class="about-title-txt">Strategic Program Director</div>
      </div>
      <p class="about-tagline">Diseño y opero sistemas que convierten estrategia en ejecución real. Programas de innovación, arquitecturas RevOps y ecosistemas de emprendimiento en LATAM.</p>
      <div class="about-roles">
        <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt"><strong>Emprendedor</strong> · HackSureste, ecosistema regional de innovación construido desde cero</div></div>
        <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt"><strong>National Program Director, Innovation & Entrepreneurship</strong> · HEINEKEN Green Challenge, operador regional del sureste</div></div>
        <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt"><strong>Habilitador</strong> · SOFI, agente de IA en producción aprobado por Meta</div></div>
      </div>
    </div>
```

New string:
```html
<section class="about-section" id="quien-soy">
  <div class="about-body">
    <div class="about-left" data-reveal>
      <div>
        <div class="about-name">Diego Maury</div>
        <div class="about-title-txt">Strategic Program Director</div>
      </div>
      <p class="about-tagline">Construyo lo que hace falta para que las cosas pasen.</p>
      <div class="about-roles">
        <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt"><strong>Como emprendedor</strong>, fundé HackSureste para construir un ecosistema regional de innovación desde cero</div></div>
        <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt"><strong>Como líder de programas</strong>, diseñé y operé iniciativas de innovación y emprendimiento para corporativos, universidades y ecosistemas en LATAM, incluyendo HEINEKEN Green Challenge</div></div>
        <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt"><strong>Como arquitecto de sistemas</strong>, hoy integro estrategia, operaciones y tecnología para diseñar programas, procesos y sistemas que ayudan a las organizaciones a ejecutar mejor</div></div>
      </div>
    </div>
```

(El resto de la sección — foto, `about-bio`, `about-stats-inline`, `about-strip` — no cambia: el bio y las cifras ya coinciden con la maqueta.)

- [ ] **Step 2: Actualizar el `id` en el nav ya apunta a `#quien-soy` (verificado en Task 3); confirmar con grep**

Run:
```bash
grep -n 'id="quien-soy"\|href="#quien-soy"' version2/index.html
```
Expected: 2 coincidencias (la sección y el link del nav).

- [ ] **Step 3: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): actualiza copy de Quién soy (S2) y renombra id a quien-soy"
```

---

### Task 6: Nuevo CSS — diagrama, tabla de capacidades, link de caso

**Files:**
- Modify: `version2/index.html` (antes del cierre `</style>`)

- [ ] **Step 1: Insertar las 3 clases nuevas justo antes de `</style>`**

Old string:
```html
    .footer-copy a { color: var(--t3); text-decoration: none; transition: color 150ms; }
    .footer-copy a:hover { color: var(--t2); }
  </style>
```

New string:
```html
    .footer-copy a { color: var(--t3); text-decoration: none; transition: color 150ms; }
    .footer-copy a:hover { color: var(--t2); }

    /* ── DIAGRAMA ESTRATEGIA→SISTEMA (S3/S4 version2) ── */
    .diagram-block {
      font-family: var(--mono); font-size: 12px; line-height: 1.6;
      color: var(--t2); background: var(--bg-2); border: 1px solid var(--border);
      border-radius: 13px; padding: 24px; overflow-x: auto; white-space: pre;
      margin: 28px 0;
    }

    /* ── TABLA DE CAPACIDADES (S4 version2) ── */
    .cap-table { width: 100%; border-collapse: collapse; margin: 28px 0; }
    .cap-table th, .cap-table td {
      text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border);
      font-size: 13px; color: var(--t2);
    }
    .cap-table th {
      font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--t3); font-weight: 500;
    }
    .cap-table td:first-child { color: var(--t1); font-weight: 600; }

    /* ── LINK DE CASO DENTRO DE .ip (S4 version2) ── */
    .ip-case-link {
      display: inline-block; margin-top: 14px; font-family: var(--mono);
      font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
      color: var(--ember); text-decoration: none;
    }
    .ip-case-link:hover { text-decoration: underline; }
  </style>
```

- [ ] **Step 2: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): agrega CSS para diagrama, tabla de capacidades y link de caso"
```

---

### Task 7: Sección El problema que resuelvo (S3, antes "tesis")

**Files:**
- Modify: `version2/index.html` (sección `id="tesis"` → `id="problema"`)

- [ ] **Step 1: Reemplazar toda la sección**

Old string:
```html
<!-- S2 TESIS / TRANSLATOR -->
<section class="section" id="tesis">
  <div class="section-inner">
    <div class="section-label" data-reveal>El problema que resuelvo</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">El problema que te reportan casi nunca es el problema. Es el síntoma. Encuentro lo que de verdad frena tu ejecución y lo dejo resuelto como un sistema que tu equipo sostiene.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Ese freno casi siempre vive en la brecha entre dos idiomas: el del board y el de la trinchera. Traduzco entre los dos hasta que tu equipo opera el sistema solo. No traduzco para que se entiendan, traduzco para que ejecuten. Es la misma disciplina detrás del <span data-metric="heineken-crecimiento-regional">+600%</span> de crecimiento regional en el sureste (HEINEKEN Green Challenge, registros sureste, edición 3 vs. edición 1, 2019-2021) y del payback modelado menor a un mes en FlipHouse (metodología disponible a solicitud).</p>
    <div class="translator" data-reveal style="--delay:.18s">
      <div class="tr-col tr-col--a">
        <div class="tr-tag">Idioma C-level</div>
        <div class="tr-h">ROI, riesgo, control, escala</div>
        <div class="tr-p">Lo que el board necesita defender: retorno medible, control y previsibilidad.</div>
      </div>
      <div class="tr-bridge"><span>&#x21C4;</span></div>
      <div class="tr-col tr-col--b">
        <div class="tr-tag">Idioma trinchera</div>
        <div class="tr-h">Procesos, stack, fricción, ejecución</div>
        <div class="tr-p">Lo que el equipo opera cada día: herramientas, entregas y cuellos de botella reales.</div>
      </div>
    </div>
  </div>
</section>
```

New string:
```html
<!-- S3 EL PROBLEMA QUE RESUELVO -->
<section class="section" id="problema">
  <div class="section-inner">
    <div class="section-label" data-reveal>El problema que resuelvo</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">La mayoría de las organizaciones no tienen un problema de ejecución. Tienen un problema de traducción.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Cuando la estrategia llega al equipo, rara vez se pierde por falta de talento. Se pierde porque cada área interpreta algo distinto. Dirección habla de crecimiento, riesgo y retorno. Operaciones hablan de procesos, herramientas y urgencias. Entre esos dos mundos aparecen los retrasos, los retrabajos y las decisiones que nadie termina de asumir.</p>
    <p class="section-sub" data-reveal style="--delay:.16s">Mi trabajo consiste en cerrar esa brecha. Traduzco la estrategia en programas, procesos y sistemas que el equipo puede ejecutar sin depender de interpretaciones. No traduzco para que se entiendan. Traduzco para que las cosas pasen. Es la misma disciplina detrás del crecimiento del <span data-metric="heineken-crecimiento-regional">+600%</span> en HEINEKEN Green Challenge y del diseño de un sistema para una empresa PropTech, que redujo el speed-to-lead de días a menos de cinco minutos.</p>
    <pre class="diagram-block" data-reveal style="--delay:.22s">┌──────────────────────────────┐
│          ESTRATEGIA          │
├──────────────────────────────┤
│ • Visión                     │
│ • Objetivos                  │
│ • Prioridades                │
│ • Decisiones                 │
└──────────────────────────────┘
               │
               ▼

        TRADUZCO EN

      • Programas
      • Procesos
      • Sistemas

               │
               ▼

┌──────────────────────────────┐
│          OPERACIÓN           │
├──────────────────────────────┤
│ • Ejecución                  │
│ • Responsables               │
│ • Indicadores                │
│ • Resultados                 │
└──────────────────────────────┘</pre>
    <p class="section-sub" data-reveal style="--delay:.28s"><strong>La estrategia genera dirección. Los sistemas generan resultados. Mi trabajo es conectar ambos mundos.</strong></p>
  </div>
</section>
```

- [ ] **Step 2: Verificar visualmente que el diagrama no rompe el layout en 375px**

Run: abrir `http://localhost:8080/version2/#problema` con DevTools en modo responsive a 375px de ancho.
Expected: el bloque `.diagram-block` hace scroll horizontal propio (`overflow-x: auto`), no desborda la página.

- [ ] **Step 3: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): reemplaza tesis por El problema que resuelvo (S3) con diagrama"
```

---

### Task 8: Sección Evidencia (S4, antes "trabajo")

**Files:**
- Modify: `version2/index.html` (sección `id="trabajo"` → `id="evidencia"`)

- [ ] **Step 1: Reemplazar toda la sección `work-list` por tabla de capacidades + 3 casos destacados**

Old string (bloque completo, líneas 911-1050 del archivo original, incluye los 3 `work-item`):
```html
<!-- S4 SELECTED WORK -->
<section class="section" id="trabajo">
  <div class="section-inner">
    <div class="section-label" data-reveal>Evidencia</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">Tres intervenciones. El mismo patrón.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Tres contextos que no se parecen en nada: una operación comercial, un programa corporativo nacional y un ecosistema construido desde cero. El método es el mismo. Cada caso incluye su autopsia, porque los errores también son evidencia.</p>
    <div class="work-list">
      <div class="work-item" data-reveal style="--delay:.1s">
        <div class="work-n-col">
          <div>
            <div class="work-big-n" data-metric="sofi-cobertura-automatica">89.5%</div>
            <div class="work-big-n-l">Cobertura automática<br>RODI <span data-metric="rodi-sofi">+1,291%</span> modelado (cost avoidance)</div>
          </div>
          <div class="work-img-slot"><img src="../assets/img/logos/fliphouse-square.png" alt="FlipHouse" loading="lazy"></div>
        </div>
        <div class="work-main">
          <div>
            <div class="work-cat">Operación core · RevOps &amp; AI automation</div>
            <div class="work-name">FlipHouse</div>
            <div class="work-role">Fractional Strategic Operations Director · 2025-2026</div>
          </div>
          <div class="star-item">
            <span class="star-k">Situación</span>
            <span class="star-v">Leads de Meta Ads dispersos y speed-to-lead de 1 a 3 dias: las oportunidades se enfriaban antes del primer contacto humano.</span>
          </div>
          <div class="star-item">
            <span class="star-k">Acción</span>
            <span class="star-v">En lugar de contratar más vendedores, construí SOFI: un agente de IA (voz + WhatsApp) que orquesta tres modelos sobre HubSpot, Make, VAPI y Twilio para contactar y calificar cada lead en minutos.</span>
          </div>
          <div class="work-result">
            <div class="work-n" data-metric="sofi-cobertura-automatica">89.5%</div>
            <div class="work-n-l">de cobertura automática sobre 191 leads · <span data-metric="sofi-respuesta-sin-asesor">74.9%</span> de respuesta sin asesor · 173 leads contactados en ~1.5 horas en una sola campaña · <span data-metric="fliphouse-leads-crm">+500%</span> leads al CRM · speed-to-lead a <span data-metric="fliphouse-speed-to-lead">menos de 5 minutos</span> · RODI <span data-metric="rodi-sofi">+1,291%</span> mediante un modelo de cost avoidance (payback menor a 1 mes, 2025-2026).</div>
          </div>
          <div class="work-tags">
            <span class="work-tag">HubSpot</span>
            <span class="work-tag">VAPI</span>
            <span class="work-tag">Make</span>
            <span class="work-tag">WhatsApp API</span>
          </div>
        </div>
        <div class="work-aside">
          <div class="star-item">
            <span class="star-k">Lección</span>
            <span class="lesson-t">La IA sin gobernanza es solo ruido caro.</span>
            <span class="star-v">La primera versión perdía leads en limbos: nadie sabía si un lead seguía vivo o estaba muerto. El arreglo no fue más IA, fue un sistema de control que garantiza que cada lead termina en un estado claro: contactado, calificado o descartado.</span>
          </div>
          <a class="btn-link work-case-link" href="../portfolio/sofi.html">Ver SOFI funcionando</a>
        </div>
      </div>
      <div class="work-item" data-reveal style="--delay:.18s">
        <div class="work-n-col">
          <div>
            <div class="work-big-n" data-metric="heineken-crecimiento-regional">+600%</div>
            <div class="work-big-n-l">Crecimiento regional<br>Sureste → #1 nacional</div>
          </div>
          <div class="work-img-slot work-img-slot--photo"><img src="../assets/img/cases/heineken-banner.jpg" alt="Equipo del HEINEKEN Green Challenge durante una edición del programa" width="1152" height="864" loading="lazy"></div>
        </div>
        <div class="work-main">
          <div>
            <div class="work-cat">Crecimiento adyacente · Innovación abierta corporativa</div>
            <div class="work-name">HEINEKEN Green Challenge</div>
            <div class="work-role">Coordinador General · Process Designer · 2019-2022</div>
          </div>
          <div class="star-item">
            <span class="star-k">Situación</span>
            <span class="star-v">Programa nacional de innovación abierta; el sureste llegaba con 35 propuestas el año previo y la lectura de "no hay demanda".</span>
          </div>
          <div class="star-item">
            <span class="star-k">Acción</span>
            <span class="star-v">Rediseño de la oferta, alianzas regionales y virtualización del programa con Lean durante 2020.</span>
          </div>
          <div class="work-result">
            <div class="work-n" data-metric="heineken-crecimiento-regional">+600%</div>
            <div class="work-n-l">crecimiento regional (ed. 1 a ed. 3, 2019-2021) · línea base de 35 propuestas documentada en prensa, cifra final estimada · sureste a #1 nacional · <span data-metric="heineken-proyectos-evaluados">3,231</span> proyectos evaluados en 4 ediciones.</div>
          </div>
          <div class="work-tags">
            <span class="work-tag">Program Ops</span>
            <span class="work-tag">Virtualización</span>
            <span class="work-tag">Lean</span>
          </div>
        </div>
        <div class="work-aside">
          <div class="star-item">
            <span class="star-k">Lección 01</span>
            <span class="lesson-t">No era falta de demanda, era falta de diseño de oferta.</span>
            <span class="star-v">35 propuestas documentadas en el sureste pasaron a <span data-metric="heineken-crecimiento-regional">+600%</span> de crecimiento en registros tras rediseñar el registro y el journey centrado en el emprendedor, no en el corporativo (edición 3 vs. edición 1, 2019-2021; línea base documentada en prensa, cifra final estimada).</span>
          </div>
          <div class="star-item">
            <span class="star-k">Lección 03</span>
            <span class="lesson-t">El filtro que funciona con 200 proyectos colapsa con 900+.</span>
            <span class="star-v">El arreglo no fue más evaluadores: pre-filtrado go/no-go de 3 criterios binarios y rúbrica ponderada por vertical.</span>
          </div>
          <a class="btn-link work-case-link" href="../portfolio/heineken.html">Ver caso completo →</a>
        </div>
      </div>
      <div class="work-item" data-reveal style="--delay:.26s">
        <div class="work-n-col">
          <div>
            <div class="work-big-n" data-metric="hacksureste-participantes">3,000+</div>
            <div class="work-big-n-l">Participantes<br>2018-2023</div>
          </div>
          <div class="work-img-slot work-img-slot--photo"><img src="../assets/img/cases/hacksureste-banner.jpg" alt="Participantes de una edición de HackSureste" width="1640" height="856" loading="lazy"></div>
        </div>
        <div class="work-main">
          <div>
            <div class="work-cat">Apuesta transformacional · Ecosistema de innovación</div>
            <div class="work-name">HackSureste + REDUX</div>
            <div class="work-role">Founder &amp; Program Architect · 2018-2023</div>
          </div>
          <div class="star-item">
            <span class="star-k">Situación</span>
            <span class="star-v">El sureste sin infraestructura de innovación ni metodología replicable de validación.</span>
          </div>
          <div class="star-item">
            <span class="star-k">Acción</span>
            <span class="star-v">Diseño del hackathon HackSureste y de la metodología REDUX, institucionalizada en el directorio del Tec de Monterrey.</span>
          </div>
          <div class="work-result">
            <div class="work-n" data-metric="hacksureste-participantes">3,000+</div>
            <div class="work-n-l">participantes en HackSureste (2018-2023, estimado) · 400+ universitarios y 111 ideas en REDUX solo en la edición 2020, documentado en el Informe Anual del Tec.</div>
          </div>
          <div class="work-tags">
            <span class="work-tag">Programas</span>
            <span class="work-tag">Metodología</span>
            <span class="work-tag">Comunidad</span>
          </div>
        </div>
        <div class="work-aside">
          <div class="star-item">
            <span class="star-k">Lección 02</span>
            <span class="lesson-t">Sin referentes, la respuesta no se adivina. Se itera.</span>
            <span class="star-v">Virtualizar una operación nacional en 2020, sin referentes: framework Lean de hipótesis, prototipo, prueba e iteración. Retención superior al benchmark del mercado.</span>
          </div>
          <a class="btn-link work-case-link" href="../portfolio/redux-incmty.html">Ver REDUX + INCmty →</a>
          <a class="btn-link work-case-link" href="../portfolio/innovation-systems.html">Ver patrón transversal →</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

New string:
```html
<!-- S4 EVIDENCIA -->
<section class="section" id="evidencia">
  <div class="section-inner">
    <div class="section-label" data-reveal>Donde lo he aplicado</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">La misma metodología. Distintas industrias.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">No diseño soluciones para un sector específico. Diseño programas, procesos y sistemas que convierten estrategia en ejecución. Por eso mi trabajo ha abarcado tecnología inmobiliaria, innovación corporativa, educación, ecosistemas de emprendimiento e inteligencia artificial.</p>
    <table class="cap-table" data-reveal style="--delay:.16s">
      <thead>
        <tr><th>Capacidad</th><th>Algunos proyectos</th></tr>
      </thead>
      <tbody>
        <tr><td>Programas Estratégicos</td><td>HEINEKEN Green Challenge · INCmty Challenges · REDUX</td></tr>
        <tr><td>Operaciones</td><td>FlipHouse · SOFI · RevOps</td></tr>
        <tr><td>IA y Automatización</td><td>SOFI · WhatsApp AI · Automatización CRM</td></tr>
        <tr><td>Innovación</td><td>HEINEKEN Green Challenge · REDUX · Bootcamps</td></tr>
        <tr><td>Ecosistemas</td><td>HackSureste · INCmty · Comunidades</td></tr>
        <tr><td>Educación</td><td>Tecnológico de Monterrey · EBC · Formación Ejecutiva</td></tr>
      </tbody>
    </table>
    <p class="section-sub" data-reveal style="--delay:.2s"><strong>30+ proyectos documentados en múltiples industrias.</strong> <a class="inline-link" href="../portfolio/">Explorar portafolio completo →</a></p>

    <h3 class="section-title" data-reveal style="--delay:.24s; font-size: 1.4rem;">Casos destacados</h3>
    <div class="ip-grid" data-reveal style="--delay:.28s">
      <div class="ip">
        <div class="ip-row">
          <div>
            <div class="ip-label">FlipHouse · PropTech</div>
            <div class="ip-name">Sistema de calificación de leads con IA</div>
          </div>
        </div>
        <div class="ip-desc">Construí un sistema de IA para contactar, calificar y registrar leads automáticamente, reduciendo el speed-to-lead de días a menos de cinco minutos.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="fliphouse-speed-to-lead">&lt;5 min</div><div class="ip-stat-l">Speed-to-lead</div></div>
          <div><div class="ip-stat-n" data-metric="sofi-cobertura-automatica">89.5%</div><div class="ip-stat-l">Cobertura automática</div></div>
          <div><div class="ip-stat-n" data-metric="sofi-respuesta-sin-asesor">74.9%</div><div class="ip-stat-l">Tasa de respuesta</div></div>
        </div>
        <a class="ip-case-link" href="../portfolio/sofi.html">Ver caso completo →</a>
      </div>
      <div class="ip">
        <div class="ip-row">
          <div>
            <div class="ip-label">HEINEKEN Green Challenge · Innovación Corporativa</div>
            <div class="ip-name">Rediseño de la operación regional</div>
          </div>
        </div>
        <div class="ip-desc">Rediseñé la operación regional del programa para escalar sin aumentar la complejidad operativa.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="heineken-crecimiento-regional">+600%</div><div class="ip-stat-l">Crecimiento regional</div></div>
          <div><div class="ip-stat-n">#1</div><div class="ip-stat-l">Sureste nacional</div></div>
          <div><div class="ip-stat-n" data-metric="heineken-proyectos-evaluados">3,231</div><div class="ip-stat-l">Proyectos evaluados</div></div>
        </div>
        <a class="ip-case-link" href="../portfolio/heineken.html">Ver caso completo →</a>
      </div>
      <div class="ip">
        <div class="ip-row">
          <div>
            <div class="ip-label">HackSureste + REDUX · Ecosistema de Innovación</div>
            <div class="ip-name">Ecosistema y metodología propios</div>
          </div>
        </div>
        <div class="ip-desc">Diseñé un ecosistema y una metodología que continúan generando impacto más allá de mi participación directa.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="hacksureste-participantes">3,000+</div><div class="ip-stat-l">Participantes</div></div>
          <div><div class="ip-stat-n">400+</div><div class="ip-stat-l">Emprendedores formados</div></div>
          <div><div class="ip-stat-n">Institucionalizada</div><div class="ip-stat-l">Metodología</div></div>
        </div>
        <a class="ip-case-link" href="../portfolio/redux-incmty.html">Ver caso completo →</a>
      </div>
    </div>

    <p class="section-sub" data-reveal style="--delay:.34s"><strong>Lo que une todos estos proyectos.</strong> No importa si el reto está en ventas, innovación, educación o tecnología. El patrón siempre es el mismo.</p>
    <pre class="diagram-block" data-reveal style="--delay:.4s">Estrategia
     ↓
Diagnóstico
     ↓
Programa
     ↓
Proceso
     ↓
Sistema
     ↓
Resultados</pre>
  </div>
</section>
```

- [ ] **Step 2: Verificar que los 4 links de portafolio apuntan correctamente**

Run:
```bash
grep -n 'href="../portfolio' version2/index.html
```
Expected: 4 coincidencias (`sofi.html`, `heineken.html`, `redux-incmty.html`, y el link genérico `../portfolio/`).

- [ ] **Step 3: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): reemplaza trabajo por Evidencia (S4) con tabla de capacidades y 3 casos"
```

---

### Task 9: Sección Cómo trabajo (S5, antes "patron")

**Files:**
- Modify: `version2/index.html` (sección `id="patron"` → `id="modelo"`)

- [ ] **Step 1: Reemplazar heading, subheading y los 5 items del acordeón**

Old string (heading + subheading, el `accordion-wrap`/`accordion-list` que sigue se reemplaza en el siguiente paso):
```html
<!-- S3 PATRON -->
<section class="section" id="patron">
  <div class="section-inner">
    <div class="section-label" data-reveal>Cómo trabajo</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">El mismo método en cada intervención. 10+ años en programas y operaciones, 7+ en innovación.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">No improviso por cliente. Aplico una secuencia que ya probé a escala, sin colapsar la operación. El método no cambia. Cambia el caos al que se aplica.</p>
    <div class="accordion-wrap" data-reveal style="--delay:.18s">
      <div class="accordion-list" id="accList">
        <div class="acc-item is-active" data-n="01" data-t="Caos" data-deliv="Diagnóstico de entrada">
          <div class="acc-item-head">
            <div class="acc-item-n">01</div>
            <div class="acc-item-t">Caos</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Procesos manuales, decisiones ambiguas, dependencia de personas clave. Nadie tiene claridad de dónde se pierde tiempo o dinero.</div>
            <div class="acc-deliverable">Diagnóstico de entrada</div>
          </div>
        </div>
        <div class="acc-item" data-n="02" data-t="Diagnóstico" data-deliv="Mapa de procesos · Priorización">
          <div class="acc-item-head">
            <div class="acc-item-n">02</div>
            <div class="acc-item-t">Diagnóstico</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Mapeo de procesos reales desde adentro, no desde el organigrama. Identifico el cuello de botella real y le pongo nombre a eso que todos en el equipo perciben pero nadie articula.</div>
            <div class="acc-deliverable">Mapa de procesos · Priorización</div>
          </div>
        </div>
        <div class="acc-item" data-n="03" data-t="Diseño de sistema" data-deliv="Blueprint · Criterios de aceptación">
          <div class="acc-item-head">
            <div class="acc-item-n">03</div>
            <div class="acc-item-t">Diseño de sistema</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Arquitectura operativa en capas: control, datos, automatización y métricas. Cada capa con su criterio de aceptación.</div>
            <div class="acc-deliverable">Blueprint · Criterios de aceptación</div>
          </div>
        </div>
        <div class="acc-item" data-n="04" data-t="Implementación" data-deliv="Sistema operando · Docs transferibles">
          <div class="acc-item-head">
            <div class="acc-item-n">04</div>
            <div class="acc-item-t">Implementación</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Construido en el stack que el equipo ya usa y diseñado para que la gente lo adopte. Un sistema que el equipo no usa no es un sistema. Es un documento.</div>
            <div class="acc-deliverable">Sistema operando · Docs transferibles</div>
          </div>
        </div>
        <div class="acc-item" data-n="05" data-t="Escala" data-deliv="Sistema entregado · Sin dependencia">
          <div class="acc-item-head">
            <div class="acc-item-n">05</div>
            <div class="acc-item-t">Escala</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">El sistema opera por sí solo. No depende de mí, con entrega completa al equipo.</div>
            <div class="acc-deliverable">Sistema entregado · Sin dependencia</div>
          </div>
        </div>
      </div>
      <div class="acc-panel">
        <div class="acc-panel-n" id="accPanelN">01</div>
        <div class="acc-panel-t" id="accPanelT">Caos</div>
        <div class="acc-panel-d" id="accPanelD">Procesos manuales, decisiones ambiguas, dependencia de personas clave. Nadie tiene claridad de dónde se pierde tiempo o dinero.</div>
        <div class="acc-panel-deliv" id="accPanelDeliv">Diagnóstico de entrada</div>
        <div class="acc-pips" id="accPips">
          <div class="acc-pip is-active"></div>
          <div class="acc-pip"></div>
          <div class="acc-pip"></div>
          <div class="acc-pip"></div>
          <div class="acc-pip"></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

New string:
```html
<!-- S5 CÓMO TRABAJO -->
<section class="section" id="modelo">
  <div class="section-inner">
    <div class="section-label" data-reveal>Cómo trabajo</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">Mi modelo de intervención.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Las organizaciones rara vez tienen un problema de talento o de ideas. Lo que suele faltar es una forma consistente de convertir la estrategia en resultados que puedan sostenerse en el tiempo. Ese es mi trabajo: descubrir qué está frenando la ejecución, diseñar el sistema adecuado y dejar instalada la capacidad para que el equipo pueda operar sin depender de mí.</p>
    <div class="accordion-wrap" data-reveal style="--delay:.18s">
      <div class="accordion-list" id="accList">
        <div class="acc-item is-active" data-n="01" data-t="Definir el destino" data-deliv="Qué significa llegar, definido">
          <div class="acc-item-head">
            <div class="acc-item-n">01</div>
            <div class="acc-item-t">Definir el destino</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Antes de hablar de herramientas, definimos qué significa llegar. No empezamos con inteligencia artificial, un CRM o un nuevo proceso. Empezamos definiendo qué debe cambiar, qué debe dejar de ocurrir y cómo sabremos que el proyecto fue un éxito.</div>
            <div class="acc-deliverable">Qué significa llegar, definido</div>
          </div>
        </div>
        <div class="acc-item" data-n="02" data-t="Encontrar el mecanismo" data-deliv="Mecanismo raíz identificado">
          <div class="acc-item-head">
            <div class="acc-item-n">02</div>
            <div class="acc-item-t">Encontrar el mecanismo</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Los síntomas rara vez son el problema. Busco el mecanismo que realmente limita la ejecución: una regla, un proceso, una decisión, un incentivo o una forma de coordinarse. Cuando cambia el mecanismo correcto, varios problemas empiezan a resolverse al mismo tiempo.</div>
            <div class="acc-deliverable">Mecanismo raíz identificado</div>
          </div>
        </div>
        <div class="acc-item" data-n="03" data-t="Diseñar el sistema" data-deliv="Programas · Procesos · Gobernanza">
          <div class="acc-item-head">
            <div class="acc-item-n">03</div>
            <div class="acc-item-t">Diseñar el sistema</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Transformo ese diagnóstico en una forma de operar: programas, procesos, gobernanza, automatización, documentación y herramientas. Todo diseñado para que el comportamiento correcto sea el camino más fácil de seguir.</div>
            <div class="acc-deliverable">Programas · Procesos · Gobernanza</div>
          </div>
        </div>
        <div class="acc-item" data-n="04" data-t="Diseñar la adopción" data-deliv="Comunicación y capacitación">
          <div class="acc-item-head">
            <div class="acc-item-n">04</div>
            <div class="acc-item-t">Diseñar la adopción</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">Un sistema que el equipo no usa no funciona. Por eso la implementación incluye comunicación, capacitación, acompañamiento y transferencia de conocimiento desde el inicio. El objetivo no es entregar documentación, es lograr que el cambio sea parte de la operación diaria.</div>
            <div class="acc-deliverable">Comunicación y capacitación</div>
          </div>
        </div>
        <div class="acc-item" data-n="05" data-t="Transferir la capacidad" data-deliv="Capacidad instalada, sin dependencia">
          <div class="acc-item-head">
            <div class="acc-item-n">05</div>
            <div class="acc-item-t">Transferir la capacidad</div>
          </div>
          <div class="acc-detail">
            <div class="acc-d">El proyecto no termina cuando el sistema funciona bajo mi supervisión. Termina cuando la organización puede sostener el resultado por sí misma. Mi objetivo nunca es volverme indispensable, es dejar una capacidad instalada que permanezca mucho después de que mi trabajo haya terminado.</div>
            <div class="acc-deliverable">Capacidad instalada, sin dependencia</div>
          </div>
        </div>
      </div>
      <div class="acc-panel">
        <div class="acc-panel-n" id="accPanelN">01</div>
        <div class="acc-panel-t" id="accPanelT">Definir el destino</div>
        <div class="acc-panel-d" id="accPanelD">Antes de hablar de herramientas, definimos qué significa llegar. No empezamos con inteligencia artificial, un CRM o un nuevo proceso. Empezamos definiendo qué debe cambiar, qué debe dejar de ocurrir y cómo sabremos que el proyecto fue un éxito.</div>
        <div class="acc-panel-deliv" id="accPanelDeliv">Qué significa llegar, definido</div>
        <div class="acc-pips" id="accPips">
          <div class="acc-pip is-active"></div>
          <div class="acc-pip"></div>
          <div class="acc-pip"></div>
          <div class="acc-pip"></div>
          <div class="acc-pip"></div>
        </div>
      </div>
    </div>
    <p class="section-sub" data-reveal style="--delay:.3s"><strong>Lo que entrego.</strong> No entrego únicamente un proyecto. Entrego una organización con mayor capacidad para ejecutar: objetivos más claros, decisiones más rápidas, procesos más consistentes, menos dependencia de personas, sistemas que evolucionan con el tiempo y equipos capaces de seguir avanzando sin empezar de cero.</p>
  </div>
</section>
```

- [ ] **Step 2: Verificar que el acordeón sigue siendo interactivo**

Abrir `http://localhost:8080/version2/#modelo` y hacer clic en cada uno de los 5 items. Expected: el panel derecho (`acc-panel`) cambia de número/título/descripción/entregable y el pip activo se mueve, igual que en `index.html`.

- [ ] **Step 3: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): reemplaza patron por Cómo trabajo (S5), modelo de 5 pasos"
```

---

### Task 10: Sección Sistemas propios (S6, antes "ip")

**Files:**
- Modify: `version2/index.html` (sección `id="ip"` → `id="sistemas-propios"`)

- [ ] **Step 1: Reemplazar toda la sección, incluyendo el bloque `ainative-chips` que se elimina**

Old string (bloque completo, líneas 1128-1192 del archivo original):
```html
<!-- S5 IP / SISTEMAS -->
<section class="section" id="ip">
  <div class="section-inner">
    <div class="section-label" data-reveal>Sistemas propios</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">Metodología registrada. No consultoría generalista.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">REDUX, HackSureste Ops y SOFI no son proyectos sueltos. Son implementaciones del mismo sistema operativo: una forma documentada de decidir, diseñar y transferir que hace el resultado repetible. Entrego sistemas, no tareas.</p>
    <div class="ip-grid">
      <div class="ip" data-reveal style="--delay:.1s">
        <div class="ip-row">
          <div>
            <div class="ip-label">Metodología registrada</div>
            <div class="ip-name">REDUX Framework</div>
          </div>
          <span class="ip-badge">Directorio Tec de Mty</span>
        </div>
        <div class="ip-desc">Bootcamp de validación de emprendimiento sostenible, institucionalizado en el directorio oficial del Tecnológico de Monterrey. Las cifras son de la edición 2020 y salen del Informe Anual del Tec, no de mis registros.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n">400+</div><div class="ip-stat-l">Universitarios</div></div>
          <div><div class="ip-stat-n">111</div><div class="ip-stat-l">Ideas</div></div>
          <div><div class="ip-stat-n">4</div><div class="ip-stat-l">Regiones</div></div>
        </div>
      </div>
      <div class="ip" data-reveal style="--delay:.18s">
        <div class="ip-row">
          <div>
            <div class="ip-label">Framework de operaciones</div>
            <div class="ip-name">HackSureste Ops Framework</div>
          </div>
          <span class="ip-badge">5 años</span>
        </div>
        <div class="ip-desc">Modelo operativo de HackSureste, ecosistema regional de innovación construido desde cero: convocatoria, selección y mentorías documentadas y transferibles.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="hacksureste-participantes">3,000+</div><div class="ip-stat-l">Participantes (est.)</div></div>
          <div><div class="ip-stat-n">30+</div><div class="ip-stat-l">Programas</div></div>
          <div><div class="ip-stat-n">#1</div><div class="ip-stat-l">Sureste MX</div></div>
        </div>
      </div>
      <div class="ip" data-reveal style="--delay:.26s">
        <div class="ip-row">
          <div>
            <div class="ip-label">Sistema de IA en producción</div>
            <div class="ip-name">SOFI · Agente de calificación de leads</div>
          </div>
          <span class="ip-badge">Aprobado por Meta</span>
        </div>
        <div class="ip-desc">Orquestación de tres modelos de IA (razonamiento, voz y transcripción) con control de estados, Redis y PostgreSQL. Proveedor de tecnología aprobado por Meta para WhatsApp Flows (2025-2026).</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="sofi-cobertura-automatica">89.5%</div><div class="ip-stat-l">Cobertura</div></div>
          <div><div class="ip-stat-n" data-metric="sofi-respuesta-sin-asesor">74.9%</div><div class="ip-stat-l">Respuesta</div></div>
          <div><div class="ip-stat-n">&lt;5 min</div><div class="ip-stat-l">Speed-to-lead</div></div>
        </div>
      </div>
    </div>
    <p class="section-sub" data-reveal style="--delay:.3s">Opero IA a nivel de sistema, no como moda. Este sitio es la prueba: lo construí para humanos y para los agentes de IA que hoy filtran talento antes de que un humano lo lea.</p>
    <div class="ainative-chips" data-reveal style="--delay:.36s">
      <span class="ainative-chip">llms.txt · RAG-ready</span>
      <span class="ainative-chip">MCP · Model Context Protocol</span>
      <span class="ainative-chip">Agent Mode · Claude Code</span>
      <span class="ainative-chip">HTML · CSS · JS vanilla</span>
      <span class="ainative-chip">GitHub Pages · CD automático</span>
      <span class="ainative-chip">LCP menor a 2.5s</span>
      <span class="ainative-chip">Make + HubSpot + Notion</span>
    </div>
  </div>
</section>
```

New string:
```html
<!-- S6 SISTEMAS PROPIOS -->
<section class="section" id="sistemas-propios">
  <div class="section-inner">
    <div class="section-label" data-reveal>Sistemas propios</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">Lo que permanece después de cada proyecto.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Cada organización es diferente. Lo que no cambia es que cada intervención deja aprendizajes, herramientas y modelos que fortalecen la siguiente. Con el tiempo, esos aprendizajes dejaron de ser experiencias aisladas y se convirtieron en activos reutilizables. No empiezo cada proyecto desde cero. Empiezo con años de conocimiento acumulado.</p>
    <div class="ip-grid" data-reveal style="--delay:.18s">
      <div class="ip">
        <div class="ip-row">
          <div>
            <div class="ip-label">Framework registrado</div>
            <div class="ip-name">REDUX</div>
          </div>
          <span class="ip-badge">Directorio Tec de Mty</span>
        </div>
        <div class="ip-desc">Framework para diseñar y validar iniciativas de innovación y emprendimiento mediante un proceso estructurado de experimentación, validación y aprendizaje. Implementado en programas educativos y de innovación.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n">400+</div><div class="ip-stat-l">Emprendedores formados</div></div>
          <div><div class="ip-stat-n">Framework</div><div class="ip-stat-l">Registrado</div></div>
          <div><div class="ip-stat-n">Institucionalizado</div><div class="ip-stat-l">Tec de Monterrey</div></div>
        </div>
      </div>
      <div class="ip">
        <div class="ip-row">
          <div>
            <div class="ip-label">Modelo operativo</div>
            <div class="ip-name">HackSureste Ops Framework</div>
          </div>
          <span class="ip-badge">5 años</span>
        </div>
        <div class="ip-desc">Modelo operativo para diseñar y ejecutar programas de innovación a gran escala. Documenta la operación completa de un programa: convocatoria, evaluación, mentorías, seguimiento, coordinación y gobierno. Construido y refinado durante cinco años de operación continua.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="hacksureste-participantes">3,000+</div><div class="ip-stat-l">Participantes (est.)</div></div>
          <div><div class="ip-stat-n">30+</div><div class="ip-stat-l">Programas</div></div>
          <div><div class="ip-stat-n">#1</div><div class="ip-stat-l">Sureste MX</div></div>
        </div>
      </div>
      <div class="ip">
        <div class="ip-row">
          <div>
            <div class="ip-label">Sistema de IA en producción</div>
            <div class="ip-name">SOFI</div>
          </div>
          <span class="ip-badge">Aprobado por Meta</span>
        </div>
        <div class="ip-desc">Arquitectura de IA para automatizar procesos comerciales y operativos. Integra inteligencia artificial, automatización y reglas de negocio dentro de una operación real. No es un prototipo. Es un sistema operando en producción.</div>
        <div class="ip-stats">
          <div><div class="ip-stat-n" data-metric="sofi-cobertura-automatica">89.5%</div><div class="ip-stat-l">Cobertura</div></div>
          <div><div class="ip-stat-n" data-metric="sofi-respuesta-sin-asesor">74.9%</div><div class="ip-stat-l">Respuesta</div></div>
          <div><div class="ip-stat-n" data-metric="fliphouse-speed-to-lead">&lt;5 min</div><div class="ip-stat-l">Speed-to-lead</div></div>
        </div>
      </div>
    </div>
    <p class="section-sub" data-reveal style="--delay:.3s"><strong>El verdadero entregable.</strong> Los proyectos terminan. La capacidad permanece. Cada intervención deja nuevos modelos, mejores prácticas y conocimiento reutilizable que acelera la siguiente implementación. Eso significa menos tiempo descubriendo el problema y más tiempo construyendo la solución adecuada. Porque el objetivo nunca ha sido entregar un proyecto. Es construir capacidades que puedan seguir generando resultados mucho después de que mi trabajo haya terminado.</p>
  </div>
</section>
```

- [ ] **Step 2: Confirmar que no queda ningún rastro de `ainative-chip` en el archivo**

Run:
```bash
grep -n 'ainative' version2/index.html
```
Expected: sin resultados (el CSS `.ainative-chips`/`.ainative-chip` puede quedarse sin usar en el `<style>`, no rompe nada; si se quiere limpiar, es opcional y fuera de alcance).

- [ ] **Step 3: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): reemplaza ip por Sistemas propios (S6), quita ainative-chips"
```

---

### Task 11: Reemplazar Servicios por Conversemos (S7)

**Files:**
- Modify: `version2/index.html` (sección `id="servicios"` → `id="conversemos"`)

- [ ] **Step 1: Reemplazar toda la sección de 3 modelos de servicio**

Old string (bloque completo, líneas 1228-1294 del archivo original):
```html
<!-- S7 SERVICIOS -->
<section class="section" id="servicios">
  <div class="section-inner">
    <div class="section-label" data-reveal>Formas de trabajar conmigo</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">Tres formas de trabajar conmigo.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Cobro por resultado (RODI), no por horas. Los tres modelos son públicos. Elige por el problema que tienes, no por el nombre del servicio.</p>
    <div class="svc-grid">
      <div class="svc" data-reveal style="--delay:.1s">
        <div class="svc-head">
          <span class="svc-num">01</span>
          <div class="svc-tag">Modelo 01 · Retainer</div>
          <div class="svc-name">Liderazgo fraccional</div>
          <div class="svc-desc">Dirección estratégica de un área o programa sin el costo de una contratación C-Suite.</div>
        </div>
        <div class="svc-list">
          <div class="svc-item">Fractional Director / Program Lead</div>
          <div class="svc-item">Gobierno del área y métricas</div>
          <div class="svc-item">Coordinación entre áreas</div>
        </div>
        <div class="svc-footer">
          <span class="svc-time">Retainer mensual</span>
          <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="svc-cta" target="_blank" rel="noopener">Agendar</a>
        </div>
      </div>
      <div class="svc" data-reveal style="--delay:.18s">
        <div class="svc-head">
          <span class="svc-num">02</span>
          <div class="svc-tag">Modelo 02 · Proyecto</div>
          <div class="svc-name">Proyecto acotado</div>
          <div class="svc-desc">Diseño, ejecución y entrega de un sistema o diagnóstico con fecha de cierre definida.</div>
        </div>
        <div class="svc-list">
          <div class="svc-item">Mapeo de procesos y diagnóstico</div>
          <div class="svc-item">Diseño e implementación del sistema</div>
          <div class="svc-item">Documentación transferible + criterio de salida</div>
        </div>
        <div class="svc-footer">
          <span class="svc-time">4 a 12 semanas</span>
          <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="svc-cta" target="_blank" rel="noopener">Agendar</a>
        </div>
      </div>
      <div class="svc" data-reveal style="--delay:.26s">
        <div class="svc-head">
          <span class="svc-num">03</span>
          <div class="svc-tag">Modelo 03 · Advisory</div>
          <div class="svc-name">Asesoría estratégica</div>
          <div class="svc-desc">Revisión de decisiones, sistemas y bloqueos operativos con cadencia fija.</div>
        </div>
        <div class="svc-list">
          <div class="svc-item">Revisión de decisiones difíciles</div>
          <div class="svc-item">Gobierno de datos y herramientas</div>
          <div class="svc-item">Desbloqueo operativo continuo</div>
        </div>
        <div class="svc-footer">
          <span class="svc-time">Cadencia quincenal</span>
          <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="svc-cta" target="_blank" rel="noopener">Agendar</a>
        </div>
      </div>
    </div>
    <div class="svc-argument" data-reveal style="--delay:.3s">
      <div class="svc-argument-q">¿Por qué fraccional y no una contratación full-time?</div>
      <p>Una búsqueda C-Suite tarda meses solo en reclutamiento. Después, esa persona todavía tiene que aprender tu operación. Diseño y opero programas desde hace 10+ años (7+ en innovación y ecosistemas). Entro sabiendo diagnosticar. En FlipHouse, el sistema opera con payback modelado menor a un mes, metodología disponible a solicitud.</p>
      <p>Pero la razón real no es la velocidad. El entregable no es otra persona de la que dependa el sistema. Es un sistema diseñado para que el equipo pueda operarlo por su cuenta. Contratar full-time para diseñar un sistema es pagar salario permanente por un trabajo con fecha de cierre. Yo diseño, implemento, documento y entrego. Si después necesitas a alguien full-time para operar lo que construí, llega sabiendo exactamente qué hereda.</p>
    </div>
    <p class="section-sub" data-reveal style="--delay:.32s"><strong>¿Estás contratando full time?</strong> Trabajo como director fraccional o por proyecto, y también considero roles full time de dirección de programas y operaciones donde el reto sea construir el sistema, no solo administrarlo. <a class="inline-link" href="/cv/diego-maury-cv.pdf" download>Descargar CV</a> · <a class="inline-link" href="https://www.linkedin.com/in/diegomaury" target="_blank" rel="noopener">LinkedIn</a></p>
  </div>
</section>
```

New string:
```html
<!-- S7 CONVERSEMOS -->
<section class="section" id="conversemos">
  <div class="section-inner">
    <div class="section-label" data-reveal>Formas de trabajar conmigo</div>
    <h2 class="section-title" data-reveal style="--delay:.06s">Hablemos.</h2>
    <p class="section-sub" data-reveal style="--delay:.12s">Si tu organización necesita convertir una estrategia en programas, procesos o sistemas que realmente funcionen, conversemos. La primera llamada no es una presentación comercial. Es una conversación para entender el contexto, identificar el reto y evaluar si soy la persona indicada para ayudarte. Si tiene sentido trabajar juntos, diseñaremos el siguiente paso. Si no, te lo diré con la misma claridad.</p>
    <div class="about-roles" data-reveal style="--delay:.18s">
      <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt">Transformación organizacional.</div></div>
      <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt">Diseño de programas estratégicos.</div></div>
      <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt">Operaciones y escalamiento.</div></div>
      <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt">Inteligencia artificial y automatización.</div></div>
      <div class="about-role"><div class="about-role-dot"></div><div class="about-role-txt">Innovación y nuevos modelos de operación.</div></div>
    </div>
    <p class="section-sub" data-reveal style="--delay:.24s"><strong>Agenda una conversación.</strong> 30 minutos para entender el reto y explorar posibles caminos.</p>
    <div class="hero-ctas" data-reveal style="--delay:.3s">
      <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="btn-primary" target="_blank" rel="noopener">Agendar una llamada</a>
      <a class="inline-link" href="https://www.linkedin.com/in/diegomaury" target="_blank" rel="noopener">Escríbeme por LinkedIn</a>
      <a class="inline-link" href="mailto:dm@diegomaury.mx">Envíame un correo</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): reemplaza Servicios por Conversemos (S7), quita modelos de pricing"
```

---

### Task 12: Simplificar el CTA final (S8, antes "contacto")

**Files:**
- Modify: `version2/index.html` (sección `id="contacto"` → `id="siguiente-paso"`)

- [ ] **Step 1: Reemplazar el CTA final, quitando `cta-steps` y `cta-trust`**

Old string:
```html
<section class="section cta-section" id="contacto">
  <div class="section-inner">
    <div class="cta-inner">
      <div class="cta-label-center" data-reveal>Siguiente paso</div>
      <h2 class="cta-h" data-reveal style="--delay:.08s">¿Listo para convertir tu estrategia en un sistema que opera?</h2>
      <p class="cta-sub" data-reveal style="--delay:.14s">Diagnóstico de 30 minutos: gratuito, confidencial y sin pitch. Trabajemos juntos o no, sales con más claridad sobre tu problema de la que traías al entrar.</p>
      <div class="cta-steps" data-reveal style="--delay:.2s">
        <div class="cta-step">
          <div class="cta-step-n">Paso 01</div>
          <div class="cta-step-t">Agenda una sesión</div>
          <div class="cta-step-d">Elige el horario que te funcione. Sin formulario ni aprobación previa.</div>
          <span class="cta-step-tag">30 min · Notion Calendar</span>
        </div>
        <div class="cta-step">
          <div class="cta-step-n">Paso 02</div>
          <div class="cta-step-t">Diagnóstico real</div>
          <div class="cta-step-d">Hablamos del problema concreto: programa, stack, equipo, métricas. Sin generalidades.</div>
          <span class="cta-step-tag">Sin pitch · Sin venta</span>
        </div>
        <div class="cta-step">
          <div class="cta-step-n">Paso 03</div>
          <div class="cta-step-t">Propuesta</div>
          <div class="cta-step-d">Si hay fit, en 48 horas tienes alcance, métricas y timeline. Sin compromiso.</div>
          <span class="cta-step-tag">48h · Sin compromiso</span>
        </div>
      </div>
      <div class="cta-buttons" data-reveal style="--delay:.26s">
        <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="btn-primary" target="_blank" rel="noopener">
          Agendar diagnóstico (30 min)
        </a>
        <div class="cta-trust">
          <div class="cta-headshot" aria-hidden="true">Foto</div>
          <span>Sin compromiso</span>
          <span class="dot"></span>
          <span>Confidencial</span>
          <span class="dot"></span>
          <span>Diego atiende directamente</span>
        </div>
        <a href="/cv/diego-maury-cv.pdf" class="btn-link" download>Descargar CV primero</a>
      </div>
    </div>
  </div>
</section>
```

New string:
```html
<section class="section cta-section" id="siguiente-paso">
  <div class="section-inner">
    <div class="cta-inner">
      <div class="cta-label-center" data-reveal>Siguiente paso</div>
      <h2 class="cta-h" data-reveal style="--delay:.08s">¿Construyamos algo?</h2>
      <p class="cta-sub" data-reveal style="--delay:.14s">Si crees que puedo aportar valor a tu organización, conversemos. La primera conversación es para entender tu contexto, explorar el reto y evaluar si tiene sentido trabajar juntos. Si la respuesta es sí, definiremos el mejor siguiente paso.</p>
      <div class="cta-buttons" data-reveal style="--delay:.2s">
        <a href="https://calendar.notion.so/meet/diegomaurymx/5aad3vun" class="btn-primary" target="_blank" rel="noopener">
          Agendar una conversación
        </a>
        <div class="cta-trust">
          <a class="inline-link" href="https://www.linkedin.com/in/diegomaury" target="_blank" rel="noopener">LinkedIn</a>
          <span class="dot"></span>
          <a class="inline-link" href="mailto:dm@diegomaury.mx">Correo electrónico</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add version2/index.html
git commit -m "feat(version2): simplifica el CTA final (S8), quita pasos y trust row"
```

---

### Task 13: Confirmar que prueba-social, respaldo y footer quedan intactos

**Files:**
- Verify only (sin cambios): `version2/index.html` (secciones `id="prueba-social"`, `id="respaldo"`, `<footer>`)

- [ ] **Step 1: Confirmar que ambas secciones de testimonios y el footer no fueron tocados por los sed/edits anteriores**

Run:
```bash
grep -n 'id="prueba-social"\|id="respaldo"\|senjaGridMount\|senjaSingleMount\|footer-tagline' version2/index.html
```
Expected: 6+ coincidencias, idénticas en estructura a `index.html` (los `mount` conservan sus IDs porque el `<script>` al final del archivo los referencia por esos IDs literales — no renombrar).

- [ ] **Step 2: Confirmar que el footer no reintroduce Calendly ni Newsletter (invariante del CLAUDE.md)**

Run:
```bash
grep -in 'calendly\|newsletter' version2/index.html
```
Expected: sin resultados.

- [ ] **Step 3: No se requiere commit — este task es de verificación únicamente.**

---

### Task 14: Agregar `version2` a `sitemap.xml`

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Insertar una entrada nueva después del home**

Old string:
```xml
  <url>
    <loc>https://diegomaury.mx/</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
```

New string:
```xml
  <url>
    <loc>https://diegomaury.mx/</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://diegomaury.mx/version2</loc>
    <lastmod>2026-07-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
```

- [ ] **Step 2: Commit**

```bash
git add sitemap.xml
git commit -m "feat(seo): agrega version2 al sitemap.xml"
```

---

### Task 15: QA manual final

**Files:** ninguno (verificación)

- [ ] **Step 1: Levantar el servidor local**

Run:
```bash
python -m http.server 8080
```

- [ ] **Step 2: Recorrer `http://localhost:8080/version2/` con scroll real (no el auto-scroll de un screenshot tool) en tres anchos**

Verificar en DevTools responsive: 375px, 768px, 1440px. Expected en cada uno:
- Las 12 secciones aparecen en orden: hero, quien-soy, problema, evidencia, modelo, sistemas-propios, prueba-social, conversemos, respaldo, siguiente-paso, footer.
- `[data-reveal]` dispara correctamente al hacer scroll real (gotcha ya documentado: NO usar un screenshot automático de página completa para verificar esto, ver `CLAUDE.md` sección 5 · Tooling).
- El acordeón de `#modelo` responde a clics.
- Los widgets de Senja (`#senjaGridMount`, `#senjaSingleMount`) cargan al hacer scroll hasta ellos.
- Ningún link de imagen rompe (revisar consola sin 404 de `assets/`).
- Los 4 links de `portfolio/*.html` navegan correctamente (usar botón "atrás" del navegador para regresar a `/version2/`).

- [ ] **Step 3: Verificar que `index.html` sigue sirviendo el contenido original sin cambios**

Run:
```bash
git diff --stat master -- index.html
```
Expected: sin diferencias (0 archivos modificados) — confirma que `index.html` no fue tocado en ningún task de este plan.

- [ ] **Step 4: Detener el servidor local**

Run: Ctrl+C en la terminal donde corre `python -m http.server`.

- [ ] **Step 5: Commit final de cierre (si hubo ajustes menores durante el QA)**

```bash
git add -A
git status
```
Si `git status` muestra cambios pendientes (ajustes hechos durante el QA visual), hacer commit descriptivo de esos ajustes puntuales. Si no hay cambios, este paso no genera commit.

---

## Registro (fuera de este plan, a cargo de Diego)

Este plan no incluye la entrada en el Changelog — Portafolio D de Notion ni la tarea en Tareas y Misiones: por instrucción del CLAUDE.md del repo, ese registro se hace en la misma sesión donde se ejecuta el plan, después de confirmar que todo quedó bien. Recordar generarla al cerrar la sesión (ver protocolo `/close-session`).
