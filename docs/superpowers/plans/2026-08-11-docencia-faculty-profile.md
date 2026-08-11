# Faculty Profile / Docencia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `/docencia`, una página pública del sitio con el perfil docente condensado de Diego Maury, respaldada por un documento Faculty Profile completo en Notion.

**Architecture:** Dos fases secuenciales con un gate duro entre ellas. Fase 0 (Tasks 1-5) es investigación en Notion y redacción del documento Faculty Profile completo — no toca código. Fase 1 (Tasks 6-12) construye `src/pages/docencia.astro` como página estática (sin loader nuevo), reutilizando `BaseLayout`/`Footer` y las clases de evidencia visual ya existentes en `case.css`. **Ningún Task de Fase 1 puede ejecutarse antes de que el Task 5 (aprobación de Diego) esté completo** — es el mismo gate que fija el spec.

**Tech Stack:** Astro 5.18 (páginas estáticas, sin loader), TypeScript, CSS con tokens del DS V2 "Ember on Ink", Playwright + axe-core (`tests/qa/*.astro.spec.ts`), Notion (MCP `notion-fetch`/`notion-search`/`notion-create-pages`/`notion-update-page`).

**Spec de referencia:** `docs/superpowers/specs/2026-08-11-docencia-faculty-profile-design.md`

---

## Fase 0 — Investigación y documento Notion

Estos tasks no tocan el repo de código. El "test" de cada uno es un criterio de completitud verificable, no un comando de test automatizado — no existe infraestructura de testing para contenido Notion en este proyecto (ver CLAUDE.md §5, la única suite de QA automatizada es Playwright contra páginas del sitio ya construidas).

### Task 1: Resolver el riesgo 2 antes de investigar nada más

**Por qué primero:** el spec (sección 9, riesgo 2) ya identificó que existe una página "📊 Análisis de Inconsistencias — Perfil Profesional Diego Maury" con contradicciones ya documentadas entre CVs (años de experiencia, ubicación). Investigar sin leer esto primero arriesga heredar errores ya conocidos.

- [ ] **Step 1: Buscar y fetch la página de inconsistencias**

Ejecutar:
```
mcp__claude_ai_Notion__notion-search
  query: "Análisis de Inconsistencias Perfil Profesional Diego Maury"
  query_type: "internal"
```
Luego `mcp__claude_ai_Notion__notion-fetch` con el `id`/URL del resultado.

Expected: contenido completo de la página, con la lista de contradicciones detectadas (años de experiencia, ubicación, y cualquier otra que liste).

- [ ] **Step 2: Anotar cada contradicción como regla de exclusión**

Para cada contradicción listada, anotar en un doc de trabajo temporal (no versionado, puede vivir en el scratchpad de la sesión) qué versión es la correcta según el criterio de "más reciente y/o marcada como SSOT/canónica" (regla de CLAUDE.md §1 del `~/.claude/CLAUDE.md`). Esta nota se usa como filtro en los Tasks 2-4: cualquier dato encontrado que choque con una contradicción ya identificada aquí se resuelve con la versión marcada como correcta, sin volver a debatirla.

### Task 2: Fetch de las fuentes canónicas en orden de prioridad

**Files:** Ninguno en el repo — todo el trabajo es contra el workspace de Notion.

- [ ] **Step 1: Fetch de las 6 fuentes canónicas de Diego (orden de prioridad fijo)**

Usar `mcp__claude_ai_Notion__notion-fetch` una vez por cada ID, en este orden (de `~/.claude/CLAUDE.md`, tabla "Fuentes canónicas de Diego Maury"):

| Prioridad | Fuente | ID Notion |
|---|---|---|
| 1 | SSOT Identidad | `acccffe2f2ab4a0a9150445a6acf6fb1` |
| 2 | CV Maestro | `04702063b90a40e99ff9436b978671a0` |
| 3 | Copy LinkedIn | `f0c1f0f6818e4c2eb089991debbde9f2` |
| 4 | AVM (Arquitectura de Valor Multipotencial) | `9dbf095b919f4e5cabc817ce97a188b2` |
| 5 | Voluntariado SSOT | `998b79780cea45c3a28a1873e78eccad` |
| 6 | Wiki Profesional | `b7cf7a78df57441bb555dcb80ea0ef75` |

Expected: 6 fetches exitosos. Si alguno falla (token expirado, página movida), documentarlo como gap explícito — no continuar sin al menos las prioridades 1 y 2.

- [ ] **Step 2: Fetch de las páginas ya identificadas en el spec (sección 9)**

Fetch de:
- `https://app.notion.com/p/diegomaury/Ponencias-que-ya-imparto-9cb80436e58541df80c27d3142ef06f1` (ya fetcheada en la sesión de brainstorming, contenido conocido: 5 ponencias/talleres con descripción + lista de instituciones como keynote/invitado).
- "Canónico - CV Maestro" (facilitación en Diplomado en Alta Dirección Empresarial, nivel MBA).
- "Canónico - Copy LinkedIn" (16 horas de facilitación en Diplomado de Recursos Humanos).
- "Skill — module-designer (v3, Diplomados Edition)" (diplomados ejecutivos CIDE/UNAM/ITAM).
- Base "Capacitaciones y Cursos - Diego Maury".
- "Notion Certification Info".
- "Reporte Profesional Completo sobre Diego Maury" (sección "Educación y Certificaciones").
- La página archivada que menciona "+50 workshops y conferencias facilitadas" y el rol de profesor en Tec de Monterrey / Escuela Bancaria y Comercial / mentor en Platzi y FIJE — usar `notion-search` con esos términos si el ID exacto no está a mano.
- Ambas páginas "Master CV - Diego Maury (English)" (la archivada y la vigente) — confirmar cuál es la fuente válida antes de citar cualquier dato de ellas (riesgo 3 del spec).

- [ ] **Step 3: Resolver los riesgos 1, 3, 4 y 5 del spec explícitamente**

Para cada uno, registrar la resolución (no dejarlo abierto):
- **Riesgo 1** (docencia en Tec/EBC, mentoring en Platzi/FIJE solo en página archivada): confirmar con el CV Maestro vigente o con Diego directamente si sigue siendo verdad antes de incluirlo.
- **Riesgo 3** (dos "Master CV... English"): usar `notion-fetch` en ambas, comparar fecha de última edición y estado (archivada vs. no), citar solo la vigente.
- **Riesgo 4** (PMP): confirmar que aparece solo como requisito deseable de una vacante, no como certificación propia. Si es así, **no incluirla** en el documento Faculty Profile bajo ninguna sección.
- **Riesgo 5** (talleres tomados): decidir explícitamente si aplica reconstruir esa lista o si la sección "Metodología docente" del brief no la necesita (el brief pide metodología de enseñanza, no historial de aprendizaje propio — probable que no aplique).

### Task 3: Inventario de evidencia visual por caso candidato

**Files:** Ninguno en el repo.

- [ ] **Step 1: Listar candidatos a "caso destacado" de los dos tipos definidos en el spec**

Tipo 1 (ponencias/talleres ya impartidos), candidatos ya conocidos: "Dominando el Business Pitch y Storytelling", "México y la Cuarta Revolución Industrial", "Liderazgo basado en metas", "Comunicación y Management Efectivo", "Fortalecimiento de Comunidades de Innovación".

Tipo 2 (proyectos profesionales reconvertidos), candidatos ya conocidos por el CMS de casos del sitio: HackSureste, INCmty, REDUX, SOFI (si aplica reconvertirlo pedagógicamente sin romper el anonimato pactado — ver CLAUDE.md §4 "Caso SOFI").

- [ ] **Step 2: Para cada candidato, buscar evidencia visual real**

Usar `notion-search`/`notion-fetch` sobre la base `🖼️ CMS Imágenes — Portafolio D` (`collection://8dda9726-a42d-407d-ba84-334b4a1ef7a1`) y sobre las fichas del SSOT de casos (`collection://88257bc9-e575-45e8-90df-f851f96e92f2`) para ver si ya existe foto o link de video utilizable para cada candidato.

Expected: una tabla candidato → evidencia visual encontrada (sí/no, y cuál).

- [ ] **Step 3: Aplicar el criterio de selección del spec**

De los candidatos con evidencia visual real disponible, elegir 3-4 finales priorizando narrativa fuerte + evidencia disponible (regla explícita del spec, sección 4). Cualquier candidato fuerte en narrativa pero sin evidencia visual real se documenta como gap, no se rellena con imagen decorativa.

### Task 4: Redactar el documento Faculty Profile completo en Notion

**Files:** Ninguno en el repo — se crea una página nueva de Notion.

- [ ] **Step 1: Crear la página Notion con la estructura de 14 secciones del brief original**

Usar `mcp__claude_ai_Notion__notion-create-pages` para crear una página nueva (título sugerido: "Faculty Profile — Diego Maury (INFORSA)"), ubicada bajo el mismo padre que "Perfil Diego Maury" en Notion (`https://app.notion.com/p/b7cf7a78df57441bb555dcb80ea0ef75`), con las 14 secciones en el orden del brief original (sección 14 del spec): Portada, Perfil docente, Propuesta de valor, Áreas que puedo impartir, Matriz de temas y competencias, Experiencia docente, Metodología, Casos destacados, Experiencia profesional relevante, Formatos de participación, Audiencias, Diferenciadores, Temas prioritarios para INFORSA, Datos de contacto.

- [ ] **Step 2: Redactar cada sección solo con datos de los Tasks 1-3**

Aplicar las reglas de contenido de la sección 5 del spec en cada afirmación: afirmación + evidencia, sin inventar cargos/certificaciones/materias, gana la fuente más reciente/canónica ante contradicción, hechos vs. inferencias separados explícitamente, primera persona + tuteo (Writing DNA, memoria `writing-dna-voz-diego`), sin em dash, sin las frases prohibidas (memoria `frase-prohibida-el-sistema-quedo`).

- [ ] **Step 3: Control de calidad final antes de marcar el documento como listo**

Recorrer el checklist de la sección 16 del brief original: cada afirmación verificada contra Notion, sin contradicciones, información canónica priorizada, vacíos de información identificados explícitamente (no ocultos), hechos separados de inferencias, sin información personal irrelevante, sin materias nunca impartidas presentadas como impartidas, sin experiencia profesional presentada como docente.

### Task 5: Checkpoint de aprobación — gate duro

- [ ] **Step 1: Compartir el link de la página Notion del Task 4 con Diego**

- [ ] **Step 2: Esperar aprobación explícita de Diego antes de continuar**

**No se ejecuta ningún Task de la Fase 1 hasta que este Step esté marcado como completo con la aprobación de Diego.** Si Diego pide cambios, se regresa al Task 4 (o a los Tasks 1-3 si el cambio requiere más investigación), no se avanza en paralelo a la Fase 1.

---

## Fase 1 — Página del sitio (`/docencia`)

Todo el contenido de prosa (hero, filas de la tabla de áreas, narrativa de los 3-4 casos, diferenciadores) se transcribe literalmente del documento Notion aprobado en el Task 5 — no se resume ni se redacta contenido nuevo en esta fase. Los pasos de código de abajo usan como contenido semilla los datos ya verificados en esta sesión (la página "Ponencias que ya imparto", ya citada arriba) precisamente porque ya están confirmados; cualquier valor marcado `// TRANSCRIBIR-FASE-0` se reemplaza con el texto exacto de la sección correspondiente del documento del Task 4 antes de hacer commit del Task 8.

### Task 6: Agregar el link "Docencia" al footer

**Files:**
- Modify: `src/config/site.ts:73-94` (array `footer.explore`)

- [ ] **Step 1: Agregar la entrada al array**

En `src/config/site.ts`, dentro de `footer.explore`, agregar una entrada justo después de "Portafolio":

```typescript
footer: {
    explore: [
        {
            label: "Portafolio",
            href: "/portfolio",
        },
        {
            label: "Docencia",
            href: "/docencia",
        },
        {
            label: "Casos de estudio",
            href: "/portfolio", // TODO: actualizar cuando exista ruta propia
        },
        {
            label: "Sobre mí",
            href: "/#s2-quien-soy",
        },
        {
            label: "Newsletter",
            href: "https://diegomaury.substack.com",
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/diegomaury/",
        },
    ],
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `npx astro check`
Expected: sin errores nuevos relacionados a `site.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "feat: agrega link Docencia al footer"
```

### Task 7: Crear la hoja de estilos de la página

**Files:**
- Create: `src/styles/docencia.css`

- [ ] **Step 1: Escribir el CSS con los tokens del DS V2**

```css
.docencia-hero {
  padding: clamp(64px, 10vw, 120px) 0 48px;
  border-bottom: 1px solid var(--border);
}

.docencia-hero__eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ember);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.docencia-hero__eyebrow::before {
  content: '';
  width: 18px;
  height: 1px;
  background: var(--ember);
}

.docencia-hero__title {
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--t1);
  max-width: 20ch;
  margin-bottom: 24px;
}

.docencia-hero__lede {
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  line-height: 1.7;
  color: var(--t2);
  max-width: 62ch;
}

.docencia-areas {
  padding: 56px 0;
  border-bottom: 1px solid var(--border);
}

.docencia-areas h2,
.docencia-cases h2,
.docencia-diff h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--t1);
  margin-bottom: 24px;
}

.docencia-areas-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.docencia-areas-table th,
.docencia-areas-table td {
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--t2);
}

.docencia-areas-table th {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--t3);
  font-weight: 500;
}

.docencia-areas-table td:first-child {
  color: var(--t1);
  font-weight: 500;
}

.docencia-cases {
  padding: 56px 0;
  border-bottom: 1px solid var(--border);
}

.docencia-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.docencia-case {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.docencia-case__type {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--t3);
}

.docencia-case__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--t1);
}

.docencia-case__body p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--t2);
  margin: 0 0 10px;
}

.docencia-case__body p:last-child {
  margin-bottom: 0;
}

.docencia-diff {
  padding: 56px 0;
  border-bottom: 1px solid var(--border);
}

.docencia-diff ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.docencia-diff li {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--t2);
  padding-left: 22px;
  position: relative;
}

.docencia-diff li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 10px;
  height: 1px;
  background: var(--ember);
}

.docencia-cta {
  padding: 64px 0 96px;
  text-align: center;
}

.docencia-cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 28px;
}

.docencia-cta__button {
  font-size: 14px;
  font-weight: 500;
  padding: 14px 28px;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.docencia-cta__button:hover {
  opacity: 0.85;
}

.docencia-cta__button--primary {
  background: var(--ember-cta);
  color: #fff;
}

.docencia-cta__button--secondary {
  border: 1px solid var(--border);
  color: var(--t1);
}

.docencia-cta__button:focus-visible {
  outline: 2px solid var(--ember);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/docencia.css
git commit -m "feat: agrega hoja de estilos para la pagina docencia"
```

### Task 8: Construir `src/pages/docencia.astro`

**Files:**
- Create: `src/pages/docencia.astro`

**Precondición:** Task 5 completo (documento Notion aprobado). Antes de escribir este archivo, fetch la página Notion del Task 4 con `mcp__claude_ai_Notion__notion-fetch` y ten a la vista las secciones 3 (Propuesta de valor), 4 (Mapa de asignaturas), 8 (Casos destacados) y 11 (Diferenciadores) para transcribir literal.

- [ ] **Step 1: Escribir el archivo completo**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import '../styles/case.css';
import '../styles/docencia.css';

interface AreaTema {
  area: string;
  temas: string;
  nivel: string;
  tipoSesion: string;
}

interface CasoDestacado {
  tipo: 'Ponencia impartida' | 'Proyecto profesional';
  titulo: string;
  contexto: string;
  queHice: string;
  queAprende: string;
  fotos: string[];
  videos: { label: string; href: string }[];
}

const pageTitle = 'Docencia y facilitación · Diego Maury';
const pageDescription =
  'Perfil docente de Diego Maury: áreas que imparte, casos destacados y metodología, con evidencia real de programas y ponencias.';
const canonicalUrl = new URL('/docencia', Astro.site).toString();
const notionFacultyProfileUrl = 'ENLACE-NOTION-TASK-4'; // TRANSCRIBIR-FASE-0: reemplazar con la URL real de la página del Task 4
const schedulingUrl = 'https://calendar.notion.so/meet/diegomaurymx/5aad3vun';

// TRANSCRIBIR-FASE-0: reemplazar los tres valores siguientes con el texto
// literal de la sección "3 · Propuesta de valor" del documento Notion aprobado.
const heroEyebrow = 'Docencia y facilitación';
const heroTitle = 'Enseño con proyectos reales, no con casos de libro';
const heroLede =
  'Diseño y facilito sesiones a partir de programas que he liderado en innovación, transformación digital y estrategia. Esta página resume mi perfil docente; el documento completo (áreas, metodología, ficha de asignación) está en el link de abajo.';

// TRANSCRIBIR-FASE-0: reemplazar con las filas literales de la sección
// "4 · Mapa de asignaturas / temas que puedo impartir" del documento aprobado.
const areas: AreaTema[] = [
  {
    area: 'ÁREA-TRANSCRIBIR-FASE-0',
    temas: 'TEMAS-TRANSCRIBIR-FASE-0',
    nivel: 'NIVEL-TRANSCRIBIR-FASE-0',
    tipoSesion: 'TIPO-SESION-TRANSCRIBIR-FASE-0',
  },
];

// TRANSCRIBIR-FASE-0: reemplazar con los 3-4 casos finales de la sección
// "8 · Casos destacados" del documento aprobado (Task 3 ya define los
// candidatos con evidencia visual verificada).
const casos: CasoDestacado[] = [
  {
    tipo: 'Ponencia impartida',
    titulo: 'CASO-TRANSCRIBIR-FASE-0',
    contexto: 'CONTEXTO-TRANSCRIBIR-FASE-0',
    queHice: 'QUE-HICE-TRANSCRIBIR-FASE-0',
    queAprende: 'QUE-APRENDE-TRANSCRIBIR-FASE-0',
    fotos: [],
    videos: [],
  },
];

// TRANSCRIBIR-FASE-0: reemplazar con los bullets literales de la sección
// "11 · Diferenciadores" del documento aprobado.
const diferenciadores: string[] = ['DIFERENCIADOR-TRANSCRIBIR-FASE-0'];
---
<BaseLayout
  title={pageTitle}
  description={pageDescription}
  canonicalUrl={canonicalUrl}
  enableGtm
>
  <section class="docencia-hero">
    <div class="section-inner">
      <p class="docencia-hero__eyebrow">{heroEyebrow}</p>
      <h1 class="docencia-hero__title">{heroTitle}</h1>
      <p class="docencia-hero__lede">{heroLede}</p>
    </div>
  </section>

  <section class="docencia-areas">
    <div class="section-inner">
      <h2>Áreas que imparto</h2>
      <table class="docencia-areas-table">
        <thead>
          <tr>
            <th scope="col">Área</th>
            <th scope="col">Temas</th>
            <th scope="col">Nivel</th>
            <th scope="col">Tipo de sesión</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((fila) => (
            <tr>
              <td>{fila.area}</td>
              <td>{fila.temas}</td>
              <td>{fila.nivel}</td>
              <td>{fila.tipoSesion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>

  <section class="docencia-cases">
    <div class="section-inner">
      <h2>Casos destacados</h2>
      <div class="docencia-cases-grid">
        {casos.map((caso) => (
          <article class="docencia-case">
            <span class="docencia-case__type">{caso.tipo}</span>
            <h3 class="docencia-case__title">{caso.titulo}</h3>
            <div class="docencia-case__body">
              <p><strong>Contexto:</strong> {caso.contexto}</p>
              <p><strong>Qué hice:</strong> {caso.queHice}</p>
              <p><strong>Qué puede aprender un alumno:</strong> {caso.queAprende}</p>
            </div>
            {caso.fotos.length > 0 && (
              <div class="evidence-photo-grid">
                {caso.fotos.map((foto) => (
                  <span class="evidence-photo">
                    <img src={foto} alt="" loading="lazy" decoding="async" />
                  </span>
                ))}
              </div>
            )}
            {caso.videos.length > 0 && (
              <div class="evidence-video-list">
                {caso.videos.map((video) => (
                  <a
                    class="evidence-video-link"
                    href={video.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  </section>

  <section class="docencia-diff">
    <div class="section-inner">
      <h2>Diferenciadores</h2>
      <ul>
        {diferenciadores.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  </section>

  <section class="docencia-cta">
    <div class="section-inner">
      <div class="docencia-cta__actions">
        <a
          class="docencia-cta__button docencia-cta__button--primary"
          href={notionFacultyProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil docente completo
        </a>
        <a
          class="docencia-cta__button docencia-cta__button--secondary"
          href={schedulingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Agendar conversación
        </a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Reemplazar cada valor `TRANSCRIBIR-FASE-0` con el texto literal del documento del Task 4**

Incluye `notionFacultyProfileUrl` (URL real de la página creada en el Task 4), `heroEyebrow`/`heroTitle`/`heroLede`, el array `areas` completo, el array `casos` completo (con `fotos`/`videos` apuntando a los assets reales identificados en el Task 3 — subir fotos nuevas a `public/assets/img/docencia/` si no existen ya en `public/`) y el array `diferenciadores`. No debe quedar ningún string con el sufijo `TRANSCRIBIR-FASE-0` ni `ENLACE-NOTION-TASK-4` en el archivo final.

- [ ] **Step 3: Verificar que no quedan placeholders**

Run: `grep -n "TRANSCRIBIR-FASE-0\|ENLACE-NOTION-TASK-4" src/pages/docencia.astro`
Expected: sin resultados (exit code 1 de grep).

### Task 9: Registrar `/docencia` en la suite de QA

**Files:**
- Modify: `tests/qa/pages.astro.ts`

- [ ] **Step 1: Agregar la entrada**

```typescript
export const ASTRO_QA_PAGES = [
  { name: 'home', path: '/' },
  { name: 'portfolio-index', path: '/portfolio/' },
  { name: 'caso-sofi', path: '/portfolio/sofi/' },
  { name: 'caso-heineken-green-challenge', path: '/portfolio/heineken-green-challenge/' },
  { name: 'caso-redux', path: '/portfolio/redux/' },
  { name: 'caso-hacksureste', path: '/portfolio/hacksureste/' },
  { name: 'caso-brain-mexico', path: '/portfolio/brain-mexico/' },
  { name: 'caso-btem-2021', path: '/portfolio/btem-2021/' },
  { name: 'caso-freeland', path: '/portfolio/freeland/' },
  { name: 'caso-g20-yea-model', path: '/portfolio/g20-yea-model/' },
  { name: 'caso-hacksureste-carmen-2019', path: '/portfolio/hacksureste-ciudad-del-carmen-2019/' },
  { name: 'caso-haz-que-pase-substack', path: '/portfolio/haz-que-pase-substack/' },
  { name: 'caso-idealab-hacksureste', path: '/portfolio/idealab-by-hacksureste/' },
  { name: 'caso-inc-prototype-2021', path: '/portfolio/inc-prototype-2021/' },
  { name: 'caso-incmty-accelerator-2021', path: '/portfolio/incmty-accelerator-2021/' },
  { name: 'caso-incmty-b-challenge-2021', path: '/portfolio/incmty-b-challenge-2021/' },
  { name: 'caso-incmty-disruptair-2022', path: '/portfolio/incmty-disruptair-challenge-2022/' },
  { name: 'docencia', path: '/docencia/' },
  { name: 'politicas-privacidad', path: '/politicas-privacidad/' },
  { name: 'terminos-y-condiciones', path: '/terminos-y-condiciones/' },
  { name: '404', path: '/404.html' },
];
```

- [ ] **Step 2: Commit**

```bash
git add tests/qa/pages.astro.ts
git commit -m "test: agrega /docencia a la suite de QA astro"
```

### Task 10: Build y QA automatizado

**Files:** Ninguno (solo comandos).

- [ ] **Step 1: Build de producción**

Run: `npx astro build`
Expected: build exitoso (exit code 0), sin errores de Zod ni de TypeScript. Nota: el paso `[notion-cases]` tarda ~90-115s, no es un cuelgue.

- [ ] **Step 2: Confirmar que `/docencia` quedó en el sitemap**

Run: `grep -c "docencia" dist/sitemap-0.xml`
Expected: 1 o más coincidencias.

- [ ] **Step 3: Confirmar el link del footer en el HTML generado**

Run: `grep -o 'href="/docencia"' dist/index.html`
Expected: al menos una coincidencia.

- [ ] **Step 4: Correr accesibilidad**

Run: `npm run test:a11y:astro`
Expected: todos los tests en verde, incluido `a11y (astro): docencia`, sin violaciones `critical`/`serious`.

- [ ] **Step 5: Correr visual**

Run: `npm run verify:visual:astro`
Expected: capturas generadas sin error en `qa-output/screenshots-astro/{desktop,mobile}/docencia.png`.

- [ ] **Step 6: Revisión visual manual**

Abrir `qa-output/screenshots-astro/desktop/docencia.png` y `qa-output/screenshots-astro/mobile/docencia.png`. Confirmar: un solo acento ember visible, sin gradientes/glow, jerarquía tipográfica clara entre hero/tabla/casos, evidencia visual (fotos/video links) presente y no genérica.

### Task 11: Verificaciones finales de cumplimiento y commit

**Files:** Ninguno (solo verificación + commit final si Tasks 6-10 no se commitearon ya de forma atómica).

- [ ] **Step 1: Checklist de cumplimiento**

Confirmar manualmente, marcando cada uno:
- [ ] `enableGtm` presente en `docencia.astro` (revisar Task 8, Step 1).
- [ ] Sin meta `robots noindex` en la página (BaseLayout no agrega ninguno por defecto — confirmar que no se añadió uno en `docencia.astro`).
- [ ] `canonicalUrl` resuelve a `https://diegomaury.mx/docencia`.
- [ ] Botón "Ver perfil docente completo" apunta a la URL real de Notion del Task 4 (no a un placeholder).
- [ ] Botón "Agendar conversación" apunta a `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`.
- [ ] El home (`index.astro`) no fue modificado — el CTA principal S1 sigue siendo "Ver casos".

- [ ] **Step 2: Commit final si queda algo sin commitear**

```bash
git status
git add -A
git commit -m "feat: publica pagina /docencia con perfil docente condensado"
```

### Task 12: Registro en Notion — Portafolio D

Sigue el flujo obligatorio de CLAUDE.md §5 (Inbox → Changelog → Tarea). Esta página nueva es un cambio publicado (estructura + copy + SEO), así que sí amerita entrada de Changelog.

- [ ] **Step 1: Crear entrada en el Inbox**

`Portafolio D — Claude Inbox` (`collection://4b69a236-ede8-48a8-9354-7b5b6dd699ca`), `Estado de procesamiento = Pendiente`, describiendo el cambio: publicación de `/docencia` + documento Faculty Profile en Notion para INFORSA.

- [ ] **Step 2: Crear la entrada de Changelog vinculada**

`Changelog — Portafolio D` (`collection://652b68c7-9cf5-441c-957c-f18b055db8b8`), vinculada desde `Changelog creado` del Inbox. El Inbox pasa a `Procesado`.

- [ ] **Step 3: Crear la tarea vinculada**

`Tareas y Misiones` (`collection://3190fe3c-51c5-8074-a302-000b97e8a410`), vinculada desde el Changelog.

---

## Self-Review (registrado, no repetir en ejecución)

- **Cobertura del spec:** §1-2 → Task 4-5 (documento Notion) + Task 8 (link a Notion); §3 → Tasks 6-8; §4 → Task 8; §5 → Task 4 Step 2; §6 → estructura Fase 0/Fase 1 completa; §7 → Task 10; §8 (fuera de alcance) → verificado en Task 11 Step 1 (home intacto, sin loader nuevo, sin funnel); §9 (riesgos) → Task 1 y Task 2 Step 3.
- **Placeholders:** los únicos strings `TRANSCRIBIR-FASE-0`/`ENLACE-NOTION-TASK-4` en el código del Task 8 son intencionales y tienen un Step de verificación explícito (Task 8 Step 3) que falla el plan si sobreviven — no son placeholders sin resolver, son un gate de contenido con comando de verificación.
- **Consistencia de tipos:** `AreaTema`/`CasoDestacado` se declaran y usan una sola vez, en el mismo archivo (Task 8) — no hay riesgo de drift entre tasks.
