# Faculty Profile / Docencia — Diseño

**Fecha:** 2026-08-11
**Estado:** Aprobado por Diego, pendiente de ejecución (Fase 0 + implementación)

## 1 · Problema y contexto

Diego necesita un Faculty Profile / Teaching Portfolio orientado a coordinación académica (caso concreto que dispara esto: INFORSA), que permita identificar rápido qué puede enseñar, en qué programas encaja, con qué metodología y qué experiencia lo respalda. No debe funcionar como CV tradicional ni como el portafolio comercial general del sitio.

El sitio diegomaury.mx pivoteó en julio 2026 a "carátula de portafolio": dejó de vender consultoría activamente, sin funnels, con CTA principal "Ver casos" (ver CLAUDE.md §1, memoria `pivote-caratula-portafolio`). Una oferta docente pública reintroduce una oferta específica, así que su integración debe respetar ese pivote: vive aparte, no compite por protagonismo con el home.

## 2 · Decisión de integración

Dos SSOT distintos, cada uno con un propósito:

1. **Documento completo en Notion** — el Faculty Profile real (todas las tablas: mapa de asignaturas, matriz de aplicación académica, metodología docente, ficha de asignación docente, gaps). Vive como página de Notion compartible por link directo con INFORSA o cualquier institución futura. Es el documento que puede "sustituir temporalmente un CV en una conversación con coordinación académica" (criterio del brief original).
2. **Página condensada en el sitio** (`/docencia`) — versión pública, indexable, resumida, pensada para cualquier visitante del portafolio que quiera entender rápido el perfil docente de Diego. Enlaza al documento completo de Notion para quien quiera profundidad.

No son el mismo contenido ni se sincronizan automáticamente: la página del sitio es un resumen editorial derivado del documento de Notion una vez validado, no un espejo.

## 3 · Arquitectura del sitio

- **Ruta:** `src/pages/docencia.astro`
- **Layout:** `BaseLayout` (mismo patrón que `index.astro`/`portfolio.astro`) — Navbar + Footer compartidos, `enableGtm` activo (regla dura: todo página nueva lleva GTM-NHT5827J).
- **Indexabilidad:** pública, **sin** `noindex`. `canonical` → `https://diegomaury.mx/docencia`. Meta description propia. Se incluye automáticamente en `sitemap-index.xml` por vivir en `src/pages/` (vía `@astrojs/sitemap`), sin configuración adicional.
- **Fuente del contenido:** estática, copy fijo directo en el `.astro` — mismo patrón que `politicas-privacidad.astro`/`terminos-y-condiciones.astro`. No se crea loader nuevo, no se toca `src/content/config.ts`, no depende del build de Notion (`[notion-cases]`) que ya es el paso lento del build (~90-115s).
- **Enlace de entrada:** se agrega "Docencia" a la columna de navegación del `Footer.astro`, junto a Home · Portfolio · Agendar. No aparece en el nav superior del home ni altera el CTA principal de S1 ("Ver casos") — respeta el pivote.
- **Design System:** V2 "Ember on Ink" sin excepciones (un solo acento ember, tipografía Plus Jakarta Sans + DM Mono, radios y pesos según la escala documentada en CLAUDE.md §4). No se inventan componentes nuevos de DS; se reutilizan patrones existentes (cards de evidencia visual, tablas, botones CTA).

## 4 · Estructura de contenido de la página

Orden de secciones:

1. **Hero** — título + propuesta de valor docente en 2-3 frases (sin lenguaje genérico tipo "apasionado por enseñar"; concreta, basada en evidencia real de Notion).
2. **Áreas que imparto** — tabla condensada: Área · Temas · Nivel · Tipo de sesión. Máximo 4-6 filas, solo temas con evidencia documentada en Notion. No se listan categorías especulativas.
3. **Casos destacados** — 3-4 cards, mezcla de dos tipos:
   - **Ponencias/talleres ya impartidos** (ej. candidatos ya identificados en la página de Notion "Ponencias que ya imparto": "Dominando el Business Pitch y Storytelling", "México y la Cuarta Revolución Industrial", "Liderazgo basado en metas", "Comunicación y Management Efectivo", "Fortalecimiento de Comunidades de Innovación") — prueba de que ya enseña.
   - **Proyectos profesionales reconvertidos en caso de enseñanza** (ej. HackSureste, INCmty, SOFI si aplica) — prueba de profundidad de experiencia real utilizable como material didáctico.

   Cada caso sigue el arco narrativo completo (no bullets sueltos): Contexto → Problema → Qué hice → Resultado → Qué puede aprender un alumno de este caso.

   **Evidencia visual real y verificable por caso** (foto del evento/programa o link a video existente — mismo estándar que la sección de evidencia visual ya shippeada en `/portfolio`, commit `7a1e29d`). Nunca imagen de stock genérica. Criterio de selección de los 3-4 casos finales: narrativa fuerte **y** evidencia visual disponible — si un caso candidato es fuerte en narrativa pero no tiene evidencia visual real, se documenta como gap en Fase 0 en vez de rellenarse con una imagen decorativa.

4. **Diferenciadores** — 3-5 bullets concretos, sin clichés, derivados de combinación real de trayectoria/sectores/metodología (no genéricos).
5. **CTA final** — dos botones: "Ver perfil docente completo" (abre la página de Notion en pestaña nueva) + "Agendar conversación" (Notion Calendar canónico: `https://calendar.notion.so/meet/diegomaurymx/5aad3vun`).

## 5 · Reglas de contenido (heredadas del proyecto)

- Afirmación + evidencia siempre. Ninguna cifra o materia impartida sin respaldo documental en Notion (mismo estándar que CLAUDE.md §4 "Métricas y evidencia").
- No inventar cargos, certificaciones, materias, audiencias o resultados. Fuente exclusiva: workspace de Notion de Diego (SSOT Identidad, CV Maestro, Copy LinkedIn, AVM, Voluntariado SSOT, Wiki Profesional — prioridad en ese orden — más cualquier página relevante encontrada, ej. "Ponencias que ya imparto").
- Ante contradicción entre fuentes, gana la más reciente y/o marcada como canónica/SSOT.
- Separar explícitamente hechos de inferencias (si se infiere una metodología pedagógica sin evidencia formal documentada, se marca como inferencia).
- Primera persona + tuteo, Writing DNA de Diego (memoria `writing-dna-voz-diego`), sin em dash, sin frases prohibidas (memoria `frase-prohibida-el-sistema-quedo`).

## 6 · Secuencia de ejecución

**Fase 0 — Investigación y redacción (previa a tocar código):**
Búsqueda amplia en el workspace de Notion de Diego siguiendo las fuentes y categorías del brief original (experiencia profesional, docente, facilitación/mentoring/speaking, expertise temática) más evidencia visual disponible por caso candidato. Construcción del documento Faculty Profile completo (14 secciones del brief original) como página de Notion. Control de calidad: cada afirmación contra Notion, sin contradicciones, gaps identificados explícitamente. Diego revisa y aprueba este documento antes de que se escriba una sola línea de `/docencia`.

Fase 0 parte del inventario preliminar y los 5 riesgos ya identificados en la sección 9 — no repite la búsqueda desde cero. En particular, resuelve primero el riesgo 2 (partir del análisis de inconsistencias ya existente) antes de redactar cualquier afirmación sobre experiencia docente o años de trayectoria.

**Fase 1 — Implementación del sitio:**
Una vez aprobado el documento de Notion, se deriva el resumen editorial para `/docencia.astro`, se construye la página siguiendo la estructura de la sección 4, se agrega el link en Footer, se agrega a la suite de QA (`tests/qa/pages.astro.ts`), se verifica lint/a11y/visual, se commitea y se registra en Changelog — Portafolio D (Notion), con su tarea correspondiente en Tareas y Misiones.

Cada fase es su propio ciclo (spec ya cubre ambas a nivel de diseño; el plan de implementación via `writing-plans` debe reflejar este orden como pasos secuenciales, no simultáneos).

## 7 · Testing

- `/docencia` se agrega a `tests/qa/pages.astro.ts`, cubierta por la ruta única de QA del proyecto: `npm run lint` (stylelint + htmlhint) / `npm run test:a11y` (axe-core, WCAG A/AA) / `npm run verify:visual` (Playwright screenshots desktop+mobile).
- Sin datos dinámicos ni build de Notion adicional para el sitio (contenido estático) → no hay manejo de errores especial más allá del build estándar de Astro (`astro build` debe incluir la página en `dist/` y en el sitemap sin configuración extra).
- Verificación manual: `enableGtm` presente, sin `noindex`, canonical correcto, link del footer funciona, botones CTA apuntan a las URLs correctas (Notion doc + Notion Calendar).

## 8 · Fuera de alcance (explícito)

- No se crea loader dinámico de Notion para esta página (decisión: contenido estático).
- No se modifica el CTA principal del home ni la narrativa S1-S8 existente.
- No se reintroduce ningún elemento de funnel de ventas de consultoría (el pivote de julio 2026 se mantiene intacto).
- No se sincroniza automáticamente el documento de Notion con la página del sitio — actualizaciones futuras del documento completo no se reflejan en `/docencia` salvo edición manual explícita.

## 9 · Inventario preliminar de evidencia (pre-Fase 0) y riesgos a resolver

Búsqueda exploratoria (2026-08-11) sobre el workspace de Diego para las cuatro categorías de docencia (experiencia docente dentro de la trayectoria profesional, certificaciones y cursos tomados, ponencias impartidas, talleres impartidos y tomados). Resultado: hay más material del esperado, pero disperso y con riesgos de vigencia que Fase 0 debe resolver antes de dar por completo el documento.

### Evidencia encontrada por categoría

- **Docencia dentro de la experiencia profesional:** facilitación en el Diplomado en Alta Dirección Empresarial (nivel MBA, módulos de Transformación Digital y Gestión del Talento) en "Canónico - CV Maestro"; 16 horas de facilitación en el Diplomado de Recursos Humanos en "Canónico - Copy LinkedIn"; diplomados ejecutivos en CIDE, UNAM e ITAM en "Skill — module-designer (v3, Diplomados Edition)".
- **Certificaciones y cursos tomados:** base dedicada "Capacitaciones y Cursos - Diego Maury" (Gestión de Equipos Ágiles, Fundamentos de Gestión de Proyectos, PMBOK, Inteligencia Emocional, Liderazgo, Negociación, Escuela de Habilidades Blandas); "Notion Certification Info"; sección "Educación y Certificaciones" dentro de "Reporte Profesional Completo sobre Diego Maury".
- **Ponencias impartidas:** página dedicada "Ponencias que ya imparto" (ya referenciada en la sección 4); cifra de "+50 workshops y conferencias facilitadas" en una página archivada.
- **Talleres impartidos y tomados:** impartidos en "Dominando el Business Pitch y Storytelling", BTEM Training 2022/2023 y StartUp Training (Tec de Monterrey), REDUX. Tomados: no existe una lista separada; la base de Capacitaciones y Cursos mezcla cursos y capacitaciones sin distinguir impartido de tomado.

### Riesgos a resolver antes de cerrar Fase 0

1. Evidencia docente relevante (profesor de Emprendimiento e Innovación en Tec de Monterrey y Escuela Bancaria y Comercial, mentor y coach en Platzi y FIJE) vive solo en una página archivada y no aparece en el CV Maestro vigente. Verificar vigencia antes de usarla.
2. Ya existe una página "📊 Análisis de Inconsistencias — Perfil Profesional Diego Maury" que documenta contradicciones entre CVs (años de experiencia, ubicación). Fase 0 debe partir de ahí para no heredar errores ya identificados.
3. Existen dos páginas "Master CV - Diego Maury (English)" con el mismo título, una archivada y otra vigente. Confirmar cuál es la fuente válida antes de citar experiencia docente en inglés.
4. La certificación PMP solo aparece como requisito deseable en una vacante a la que Diego aplicó, no como certificación propia confirmada. No incluir como logro sin verificar primero.
5. No hay lista propia de talleres tomados como aprendiz. Decidir si Fase 0 la reconstruye o si no aplica.
