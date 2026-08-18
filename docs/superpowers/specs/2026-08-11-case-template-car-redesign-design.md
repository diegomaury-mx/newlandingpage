# Rediseño de la plantilla de caso: formato CAR

**Fecha:** 2026-08-11
**Estado:** Aprobado por Diego (validado con mockups en Artifact) y reconciliado con el contrato de contenido (Plantilla v2 actualizada en Notion, `b50c60ba-af74-43da-90bc-09d31cf9d4c4`, "Estado: Vigente · Base: CAR"), pendiente de plan de implementación.

## Problema

Diego siente que las páginas de caso (`/portfolio/[slug]`, ej. SOFI) se leen como datos arrojados al azar en vez de una historia. Puntos concretos señalados en la sesión de brainstorming:

- El orden de 8 secciones (Contexto → Problema → Mi Responsabilidad → Sistema → Trade-offs → Resultados → Evidencia → Aprendizajes) se siente como un checklist, no como una historia que avanza.
- La tabla de Resultados es fría y desconectada del relato.
- No hay sensación de progresión/historial.
- El cierre no aterriza el logro — se disuelve en Evidencia/Aprendizajes.
- La evidencia visual (fotos/video) no destaca.

## Alcance

Afecta la plantilla completa (`src/pages/portfolio/[slug].astro` + `src/styles/case.css`), usada por los 15 casos publicados. No es un rediseño visual desde cero: se mantiene el layout real de producción (rail sticky a la izquierda con meta/métrica ancla/nav de secciones, prosa a la derecha) — elegido en Design Lab 2026-08-02 y validado de nuevo en esta sesión tras descartar una dirección editorial más audaz (demasiado riesgo en mobile, se sentía "too much").

**Decisión que revierte la respuesta inicial de la sesión** ("solo tocar la capa visual, no el contenido en Notion"): al validar los mockups, Diego aprobó reestructurar el contenido narrativo también, no solo el CSS. Esto es una revisión consciente de esa decisión temprana — la profundidad del cambio subió de "solo presentación" a "presentación + estructura narrativa".

**Reconciliación con el contrato de contenido:** Plantilla v2 · Especificación de caso maestro (Notion) se actualizó para fijar CAR como única estructura narrativa vigente, evitando que ese contrato quede desalineado con este rediseño. Verificado vía búsqueda en Notion el mismo día: el estado de la página ya dice "Vigente · Base: CAR (Contexto → Acción → Resultado), alineado con el rediseño de plantilla de caso".

**Compatibilidad con el commit `7a1e29d`** (feat: sección de evidencia visual, ya en producción antes de esta sesión): confirmado — `[slug].astro` y `case.css` fueron leídos en esta sesión ya en su estado post-`7a1e29d` (verificado con `git log` sobre ambos archivos). El diseño de Evidencia visual descrito en este spec (grid de fotos + video embebido) construye directamente sobre esa base, no la contradice ni la duplica.

## Diseño

### 1. Estructura narrativa: CAR (Contexto → Acción → Resultado)

El body de cada ficha en Notion pasa de 8 secciones (`## Contexto`, `## Problema`, `## Mi Responsabilidad`, `## Sistema Construido`, `## Trade-offs`, `## Resultados`, `## Evidencia`, `## Lo que Haría Distinto`) a 3 actos:

- **`## Contexto`** — fusiona la situación de partida y el problema real. Cierra con un `blockquote` que condensa el insight central (recurso que ya existe en `case.css`, se sigue usando).
- **`## Acción`** — fusiona responsabilidad (sí/no responsable), el sistema construido (lista numerada, porque ahí sí hay una secuencia real) y las decisiones de trade-off.
- **`## Resultado`** — fusiona métricas, evidencia y el cierre. Ya no lleva el "Aprendizaje" (ver punto 4).

**Adenda 2026-08-17 — bloque de trade-offs explícito, no solo fusionado en prosa.** Diagnóstico tras comparar con portafolios de terceros (ver memoria de sesión): el problema de las fichas no migradas no es solo el orden de 8 secciones, es que el trade-off queda disuelto dentro de la narrativa en vez de nombrarse. Un lector no distingue "esto pasó" de "esto decidí entre varias opciones". Regla nueva para `## Acción` en toda ficha que se migre a CAR de aquí en adelante: debe incluir, dentro del acto, un párrafo o `blockquote` que responda explícitamente **qué alternativa se descartó y por qué** — no basta con narrar la decisión tomada. No es una sección H3 nueva ni un campo Zod nuevo (no se toca `[slug].astro` ni el schema): es un requisito de contenido dentro del H2 `## Acción` ya existente, verificable a simple lectura, no por código. Aplica a las 13 fichas pendientes de migrar; SOFI (ya migrada) se revisa contra este criterio la próxima vez que se edite, no de forma retroactiva forzada.

El rail-nav (`extractSections`) no necesita cambios de código: ya deriva sus links de los H2 del body, así que listar 3 en vez de 8 es solo cuestión de cómo se escribe el body en Notion.

**Mapeo con Plantilla v2:** los 3 actos del body (Contexto, Acción, Resultado) son las únicas secciones narrativas del cuerpo. Encabezado, Evidencia visual y Reflexión no son H2 del body: viven como metadata o secciones independientes, tal como quedó fijado en Plantilla v2 · Especificación de caso maestro. Archivo se mantiene fuera de la lectura principal y sin impacto en `[slug].astro`.

**Costo real de este punto:** las 15 fichas publicadas necesitan reescribirse a este formato. Es trabajo de contenido, no de código — Claude Code no debe inventar el contenido narrativo de los otros 14 casos (viola la regla de "no inventar datos" y el tono/voz es de Diego). El plan de implementación debe tratar esto como una tarea separada de la migración técnica, con SOFI como caso ya resuelto (contenido ya validado en el mockup) y el resto pendiente de que Diego los reescriba o los dicte. **Seguimiento:** tarea creada en Tareas y Misiones (ver nota al final de este documento) para que este frente no quede sin dueño ni fecha.

### 2. Resultados como tarjetas, no tabla

La sección Resultado se autorea en Notion igual que hoy (tabla Markdown `Métrica | Antes | Después`), pero el render la detecta y la convierte en un grid de tarjetas (2×2 desktop, 1 columna mobile) en vez de `.prose-table`: valor grande en DM Mono, el "antes" tachado en chico, y el delta (`+500%`) en ember cuando aplica.

Mecanismo: una función de transformación en el pipeline de renderizado (`renderMarkdown` o un util nuevo) que reconoce la tabla bajo el H2 "Resultado" por sus encabezados exactos (`Métrica`, `Antes`, `Después`) y emite el markup de tarjetas.

**Fallback (mismo estándar de robustez que el punto 5):** si la tabla bajo "Resultado" no tiene exactamente esos tres encabezados (typo, mayúscula distinta, columna extra), el render no debe fallar ni bloquear el build — degrada a `.prose-table` normal, igual que cualquier otra tabla del body. La detección de tarjetas es una mejora visual condicional, nunca un requisito de publicación. Cualquier otra tabla del body (ej. la de Evidencia) sigue usando `.prose-table` sin cambios.

### 3. Logo en el rail, no en el hero

El logo del caso (`entry.data.logo`) se mueve del hero banner (`.case-hero__logo`, centrado abajo del banner) al rail, arriba del meta line y el H1. Se elimina `.case-hero__logo` — un solo lugar para el logo, no dos.

### 4. Reflexión: nueva propiedad editable en Notion

El cierre ("aprendizaje"/reflexión) deja de vivir dentro del body narrativo y se vuelve una propiedad independiente:

- Nueva propiedad **`Reflexión`** (rich text, opcional) en `SSOT - Portafolio Proyectos`.
- Nuevo campo `reflection` (Zod, opcional) en `src/content/config.ts`, mapeado en `notionLoaders.ts`.
- Se documenta en `docs/platform/notion-astro-contract.md` (tabla de la sección 1).
- En `[slug].astro`: si `entry.data.reflection` existe, se renderiza como sección final de la página (después de Evidencia visual, antes del footer), con su propio eyebrow "Reflexión" y tipografía grande (`font-weight: 300`, ~1.2–1.55rem) para que aterrice como cierre real. Si no existe (fichas sin llenar todavía), la sección no aparece — no bloquea el build ni es requisito de publicación.

Razón de sacarlo del body: Diego quiere poder editar/actualizar esta reflexión sin tocar el resto de la narrativa (que es más larga y estructurada).

### 5. Evidencia: badge fuera del rail, video embebido

- Se elimina el `rail-block` "Evidencia" (el badge ✔/✖ que vivía en el sidebar). El campo `hasVerifiedEvidence` se mantiene en el schema (sigue siendo parte del guardrail de publicación para fichas Insignia), solo deja de mostrarse como badge visual en el rail.
- Los videos de evidencia (`entry.data.evidenceVideos`) pasan de link de texto a un `<iframe>` embebido 16:9 (lazy-loaded), cuando la URL es de un proveedor embebible (YouTube/Drive). Requiere una función pequeña que convierta la URL guardada (ej. `youtube.com/watch?v=...`) a su forma embebible (`youtube.com/embed/...`); si la URL no es reconocible como embebible, se conserva el link de texto actual como fallback — nunca rompe el build por una URL rara.

**Riesgo señalado y cerrado:** al quitar el badge del rail, ninguna superficie deja ver, sin abrir cada página en vivo, qué fichas Insignia siguen sin evidencia verificada. Se investigó una vista filtrada en Notion por `hasVerifiedEvidence = false` + `Capa = Insignia`, pero **no es viable**: `hasVerifiedEvidence` no existe como propiedad en `SSOT - Portafolio Proyectos` (verificado contra el schema real vía Notion MCP) — es un valor derivado en build time por el loader de Astro a partir de la tabla ✔/✖ dentro del `body`, nunca se guarda como columna filtrable. Decisión de Diego: no crear infraestructura nueva (ni vista ni checkbox manual, que además arriesgaría desincronizarse del valor real derivado — mismo patrón de riesgo que ya afectó la cifra de REDUX). La capa Insignia son solo 4 fichas (HEINEKEN, REDUX, SOFI, HackSureste); revisar sus páginas en vivo directamente es suficiente.

## Fuera de alcance

- No se toca el listado `/portfolio` (`portfolio.astro`) ni el home.
- No se rediseña la sección de evidencia visual (fotos) más allá de lo que ya existe — se mantiene el grid actual.
- No se introduce un sistema de progreso/espina numerada (descartado explícitamente por Diego, "too much").
- No se reescribe el contenido de los 14 casos restantes como parte de este trabajo técnico — es una tarea de contenido aparte (ver seguimiento en punto 1).

## Mockups de referencia

Validados en Artifact durante la sesión de brainstorming (no persistidos como archivo del repo, solo como referencia de la conversación):
- Primer intento (editorial/revista) — descartado por sentirse "horrible" / demasiado alejado del layout real.
- Segundo intento (layout real + CAR) — aprobado, con iteraciones: quitar badge de evidencia del rail, resultados como tarjetas, logo en el rail, video embebido, sección Reflexión.
