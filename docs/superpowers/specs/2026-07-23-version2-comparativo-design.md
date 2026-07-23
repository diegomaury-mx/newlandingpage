# Version2 comparativo — diseño

**Fecha:** 2026-07-23
**Fuente de copy:** Notion "Version nueva" (`3a60fe3c51c5807eb0fccebfab883d17`), bloque sincronizado S1-S8 + SEO + Footer.
**Objetivo:** publicar una segunda versión completa del home, en paralelo a `index.html`, para que Diego pueda comparar ambas con visitantes reales. No reemplaza el LIVE actual.

## Alcance

- Página nueva: `version2/index.html`, URL final `diegomaury.mx/version2` (folder-index, mismo patrón que `portfolio/`).
- Indexable (sin `noindex`). Sin enlace cruzado entre `index.html` y `version2/`: cada URL vive independiente; Diego comparte ambos links manualmente para pedir feedback.
- No se modifica `index.html`, ni ningún otro archivo LIVE, ni el CMS de Notion, ni `assets/data/metrics.json`.
- Fuera de alcance explícito: `sitemap.xml` (decisión de si se agrega `version2/` queda para el plan de implementación, no bloquea este diseño).

## Diseño visual

Mismo Design System V2 "Ember on Ink" que el resto del sitio (`assets/css/styles.css`, tokens `v2-tokens.css`, tipografía Plus Jakarta Sans + DM Mono). Sin exploración visual nueva. La maqueta S1-S8 trae una estructura de secciones distinta a la actual (diagrama de traducción estrategia→sistema, modelo de intervención en 5 pasos, sistemas propios), por lo que esas secciones se maquetan como componentes nuevos dentro del DS existente — no como un tema visual alterno.

## Estructura de secciones (fiel a S1-S8, sin sección de servicios/pricing)

| Maqueta | ID de sección | Contenido / notas de implementación |
|---|---|---|
| Nav | `<nav>` | Mismo patrón visual y CTA "Agendar diagnóstico" (Notion Calendar); links de ancla apuntan a los IDs nuevos de abajo. |
| S1 Hero | `#hero` | H1 "Diego Maury" + label "Strategic Program Director". Métricas: RODI (`data-metric="rodi-sofi"`), "+30 programas e iniciativas lideradas" (cifra propia, confirmada por Diego, sin alta en SSOT — ver sección Métricas), "9,905 participantes" (`data-metric="incmty-participantes-inscritos"`, calificador completo visible). |
| S2 Quién soy | `#quien-soy` | Bio en prosa; reutiliza el patrón visual de `.about-section`. |
| S3 El problema que resuelvo | `#problema` | Diagrama ASCII (Estrategia → Traduzco en → Operación) como bloque `<pre>` en DM Mono; cita destacada en blockquote. Cifra +600% ya vigente (`data-metric="heineken-crecimiento-regional"`). |
| S4 Evidencia | `#evidencia` | Tabla de capacidades + 3 casos destacados: FlipHouse → `portfolio/sofi.html`, HEINEKEN Green Challenge → `portfolio/heineken.html`, HackSureste + REDUX → `portfolio/redux-incmty.html`. Métricas ya vigentes: 89.5%, 74.9%, speed-to-lead < 5 min, +600%, 3,231, 3,000+. Link "Explorar portafolio completo" → `portfolio/index.html`. |
| S5 Cómo trabajo | `#modelo` | Lista numerada 01-05 (definir destino, encontrar el mecanismo, diseñar el sistema, diseñar la adopción, transferir la capacidad). |
| S6 Sistemas propios | `#sistemas-propios` | 3 bloques: REDUX, HackSureste Ops, SOFI. Incluye "400+ emprendedores formados" (cifra propia agregada, distinta del dato 2020 del Informe Anual Tec — ver Métricas). Sin otras métricas nuevas. |
| S6b Prueba social | `#prueba-social` | Reutiliza tal cual el componente ya existente en `index.html`: 3 `testimonial-card` + `#senjaGridMount` (carga diferida vía IntersectionObserver, mismo JS). |
| S7 Formas de trabajar conmigo | `#conversemos` | Lista de temas de conversación + CTA "Agendar una llamada" (Notion Calendar). Sin modelos de servicio/pricing (decisión: se sigue la maqueta tal cual, sin la sección de Retainer/Proyecto/Advisory que sí existe en `index.html`). |
| S7b Confianza directa | `#respaldo` | Reutiliza tal cual el `#senjaSingleMount` ya existente. |
| S8 Siguiente paso | `#siguiente-paso` | CTA final; reutiliza la estructura visual de `.cta-section`. |
| Footer | `<footer>` | Mismo footer autocontenido que `index.html` (marca, tagline, nav Home/Portfolio completo/Agendar/Políticas de privacidad/Términos y condiciones, copyright). Se corrigen "Newsletter" y "Calendly" del borrador de Notion: no se reintroduce Calendly (invariante de CLAUDE.md), se usa el link real de Notion Calendar. |

## Métricas

- **Cifras ya vigentes en `assets/data/metrics.json`** (RODI +1,291%, 9,905, 89.5%, 74.9%, speed-to-lead, +600%, 3,231, 3,000+): se muestran con su `data-metric` correspondiente para mantener trazabilidad con el SSOT, igual que en `index.html`.
- **Cifras nuevas de esta versión** ("+30 programas e iniciativas lideradas", "400+ emprendedores formados" como agregado multianual): confirmadas directamente por Diego el 2026-07-23. **No se dan de alta en `metrics.json` ni pasan por `verify-metrics.js`** — decisión explícita: `version2` es una página comparativa fuera del alcance del gate oficial de métricas, no el índice oficial del sitio. Se escriben directo en el HTML como texto plano, sin atributo `data-metric`.

## Testing

- `npm run lint` y `npm run test:a11y` no cubren `version2/index.html` hoy (la lista de páginas está hardcodeada en `tests/qa/` a las 9 páginas clave); no se agrega a esa suite en este alcance a menos que se pida explícitamente en el plan.
- Verificación manual en navegador real (Claude-in-Chrome) con scroll físico para confirmar que `[data-reveal]` dispara correctamente, mismo gotcha ya documentado para `index.html`.
- Confirmar visualmente en 375/768/1440 antes de dar por terminado.
