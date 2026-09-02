# AUDIT-TO-BE · diegomaury.mx

Estado objetivo tras la optimización. Deriva de `AUDIT-AS-IS.md` (rev. 2).
**No es un rediseño.** Es la definición de a dónde debe llegar cada eje conservando la identidad, la arquitectura y el contenido actuales.

Principio rector: **el sitio ya tiene un buen esqueleto** (DS V2 coherente, Astro SSG, contenido 100% desde Notion, ficha SOFI ejemplar). El trabajo es quitar lo que lo frena, no reconstruirlo. Toda propuesta de este documento cabe dentro del CSS y la arquitectura Astro existentes.

---

## 0 · Qué se preserva (no se toca sin decisión explícita de Diego)

- El design system V2 "Ember on Ink" y sus tokens (`variables.css`).
- La arquitectura Notion → Astro en build (`notionLoaders.ts`, cache de imágenes/traducción).
- El copy visible (vive en el SSOT "Copy Oficial" de Notion; cualquier cambio de texto pasa por Diego y por el doc de spec correspondiente).
- La plantilla CAR de casos y el layout de rail sticky de `[slug].astro`.
- El sistema i18n nativo (ES sin prefijo, `/en/*`).
- El ritmo de secciones del home (acordeón, diagrama radial, grids) — es variado y funciona.
- El gate de métricas (`verify-metrics.cjs`, `superRefine` de Insignia).

---

## 1 · Principios visuales (TO-BE)

El diseño actual es competente pero pierde intención en dos puntos: la **primera impresión** (hero que no pinta a tiempo, imagen que lee "creator", tarjeta social sin diseñar) y la **densidad de las secciones interiores**. El objetivo no es más minimalismo — es más intención.

| Principio | AS-IS | TO-BE |
|---|---|---|
| **La primera pantalla se ve sin JS** | Hero con `opacity:0` hasta que corre un módulo diferido | Hero, imagen LCP y trust belt visibles en el primer paint. El reveal se conserva solo bajo el fold. |
| **Un solo grado de imagen** | Hero = still de podcast; tarjetas de caso = capturas heterogéneas + verde fuera de paleta | Retrato editorial del hero con el mismo grado de color del DS. Tarjetas de caso con un tratamiento unificado (duotono ember/ink o crop consistente). Cero color fuera de la paleta de tokens. |
| **La tarjeta social es una superficie de diseño** | `diego-maury.png` 700×700, 574 KB, sin diseñar | Tarjeta OG 1200×630 diseñada en el DS (nombre + rol + una línea + isotipo), < 200 KB, con `og:image:alt/width/height`. |
| **Jerarquía por escala, no por saturación de labels** | `section-label` (eyebrow) en 5 de ~7 secciones | Decisión de Diego (F-10): mantener el precedente del DS, o reducir eyebrows a los puntos de inflexión reales. No es bloqueante. |
| **Legibilidad del cuerpo** | Cuerpo 13–13.5px, calificadores de métrica a 9px `--t3` | Cuerpo base ~15px con `line-height` acorde; calificadores obligatorios a ~10–11px o `--t2` (siguen siendo obligatorios por regla del SSOT, pero legibles). |
| **Una isla de tema, no dos** | Widget Senja = modo claro dentro de sitio oscuro | Testimonios renderizados con el componente propio `.testimonial-card`, tema único. |

Lo que **no** cambia: paleta, tipografías (Plus Jakarta Sans + DM Mono), escala de radios, la regla de "un ember por pieza", el patrón de fondo `bg-pattern`.

---

## 2 · Principios UX

| Principio | TO-BE |
|---|---|
| **El hero comunica y ofrece acción en el primer viewport** | En móvil, orden = H1 → sub (≤ ~20 palabras) → CTAs; la imagen va después o se reduce. Evaluar con Diego un CTA de reserva en el hero (hoy solo está en el navbar y en S8). |
| **Navegar por el menú nunca deja una sección rota** | `scroll-margin-top` en todas las secciones ancladas; contenido above-the-fold sin gate de JS. |
| **Una etiqueta por intención** | El CTA de conversión usa la misma etiqueta de acción en navbar, hero y S8 (p. ej. "Agendar una llamada"), no un lema. |
| **La evidencia se puede examinar** | La galería de evidencia de cada caso tiene lightbox accesible o enlace a tamaño completo + alt descriptivo. |
| **El teclado sale de donde entra** | El menú burger cierra con `Escape` y click-fuera, y devuelve el foco al botón. Patrón *disclosure* de ARIA APG, sin focus trap. |

IA de navegación: **no cambia**. 4 ítems + CTA es correcto. Los destinos de CTA se siguen resolviendo por etiqueta (`ctaTarget`), no por posición.

---

## 3 · Jerarquía y estructura de página

**Home (`index.astro`):** el orden de secciones S1–S8 no cambia. Ajustes puntuales:
- S1: hero sin `data-reveal`; imagen LCP con `<link rel="preload">`; en móvil, texto antes que foto.
- S2–S8: `scroll-margin-top`; reveal se conserva.
- S6b: sustituir el embed de Senja por render propio.

**Portfolio (`portfolio.astro`):** estructura actual correcta (franja "Por los números" → Insignia → Capability Showcase Grid → cierre). Ajuste: tratamiento unificado de las imágenes de las 4 tarjetas Insignia; investigar el rectángulo verde de HEINEKEN.

**Ficha de caso (`[slug].astro`):** **no cambia la estructura.** Solo la galería de evidencia (lightbox / enlace a full-size) y contraste de los ítems del rail no activos.

**`BaseLayout.astro`:** añade skip-link, `color-scheme: dark`, `theme-color`, preload de fuente crítica, punto único de carga de GTM.

---

## 4 · Responsive (TO-BE)

Breakpoints actuales (900/960/720/800/560/680/760px) se conservan — son suficientes. Cambios:
- Hero móvil: `.hero-media` sin `order:-1`; el H1 encabeza el viewport.
- Verificación obligatoria en Chrome real a **1440px y 390px** tras cualquier cambio de layout, revisando los dos bugs conocidos del repo (navbar `fixed` sin offset; `container-type` + hijos 100% `position:absolute`).
- Sin scroll horizontal en ningún breakpoint (ya se cumple; mantener).

---

## 5 · Accesibilidad (TO-BE)

Objetivo: **Lighthouse a11y 100** y cero deuda de las guías de Vercel en las superficies propias.

| Item | TO-BE |
|---|---|
| Skip-link | `<a href="#main">` visible en `:focus` como primer hijo de `<body>`; `<main id="main">`. |
| `color-scheme` | `:root { color-scheme: dark }` — arregla scrollbars e inputs nativos. |
| `prefers-reduced-motion` | `scroll-behavior: smooth` condicionado; el resto ya lo respeta. |
| Menú burger | `Escape` + click-fuera + retorno de foco (disclosure APG). |
| Contraste | El único fallo (widget Senja) desaparece al render propio. Calificadores de métrica a tamaño/color legible. |
| Galería de evidencia | Lightbox con `dialog` nativo (`Escape`, foco gestionado) o enlaces `<a>`; alt descriptivo por imagen. |
| `scroll-margin-top` | En todas las secciones/encabezados ancladas. |

No se introduce ARIA donde el HTML semántico basta (ya es la práctica del repo).

---

## 6 · Performance (TO-BE)

**Objetivo (móvil, p75 de 3+ corridas):**

| Métrica | AS-IS (mediana) | TO-BE | Nota |
|---|---:|---:|---|
| Performance | 75 (home) / 80 (portfolio) | **≥ 88** | score compuesto |
| LCP | ~4.0 s / ~3.4 s | **< 2.5 s** | **objetivo de negocio** (Core Web Vital) |
| INP | no medido en lab | monitorear en campo (CrUX / RUM) | **objetivo de negocio** (Core Web Vital); TBT es su proxy en lab |
| FCP | ~3.0 s / ~3.4 s | **< 1.8 s** | |
| TBT | ~254 ms / ~242 ms | **< 200 ms** | proxy de INP |
| TTI | ~9 s (estable) | **< 5 s** | **informativa**: no puntúa en Performance desde Lighthouse v10; la auditoría `interactive` sigue en el reporte y permite validarla. Sirve como medida de salud del main-thread, no como meta de score. |
| CLS | 0 | 0 (mantener) | Core Web Vital (ya en verde) |
| Best Practices | 73 | **≥ 95** | |

**Palancas, en orden de impacto:**
1. **Quitar el gate de JS del hero** (F-01) → recupera ~0.9 s de LCP en móvil y deja que el `fetchpriority="high"` de la imagen funcione.
2. **Self-hostear las fuentes + `preload`** (F-07, F-22) → recupera ~0.5–1 s de FCP en todas las páginas; también baja la LCP de portfolio (que es texto).
3. **Preload de la imagen LCP del hero** (F-22) → ~150–300 ms.
4. **Adelgazar terceros** (F-06): Bot Fight Mode de Cloudflare a Off; cargar GTM diferido / evaluar `gtag` directo, para bajar el TTI de ~9 s y despejar el main-thread (mejora INP de campo).
5. **Testimonios propios en vez de Senja** (F-05) → quita ~377 ms (home) / ~1 121 ms (portfolio) de main-thread.
6. **Cache headers** (F-11) para repeat-view.

**Presupuesto (se mantiene del CLAUDE.md web):** JS < 80 KB gzip, CSS < 15 KB, animar solo `transform`/`opacity`.

---

## 7 · SEO (TO-BE)

Lighthouse SEO ya es 100; el trabajo es lo que Lighthouse no mide.

| Item | TO-BE |
|---|---|
| Tarjeta social (F-21) | OG 1200×630 diseñada, < 200 KB, `og:image:alt/width/height`. Home y `/portfolio` dejan de usar `diego-maury.png` crudo. |
| Redirects (F-19) | Las 8 rutas stub pasan a `_redirects` como `301`; se borran los HTML de `meta refresh`. |
| Sitemap/robots/hreflang/JSON-LD | Sin cambios — está correcto. |
| Experimento "consultor" | Sin cambios — ya tiene revisión a 90 días agendada. |
| CSP y cabeceras | Ver §8. `X-Frame-Options`/`Referrer-Policy`/`Permissions-Policy` ya están bien. |

---

## 8 · Seguridad / plataforma (TO-BE)

- **Cloudflare Web Analytics: desactivado** (redundante con GA4). Elimina el script bloqueado por CSP sin ampliar la whitelist.
- **CSP:** decisión de rumbo de Diego — (a) CSP estricta con hashes en build para los `is:inline` propios + `strict-dynamic`, o (b) aceptar la actual como higiene menor y documentarlo en `_headers`. No dejar la "whitelist que crece".
- **`webfont.js`** (bloqueado): desaparece al aplicar F-05 (render propio de testimonios).
- Cabeceras `Cache-Control` para `/_astro/*` y `/cms-media/*`.
- GTM: un solo punto de carga (`enableGtm` en `BaseLayout`).

---

## 9 · Criterio de "hecho" para la fase de implementación

Cada cambio de la fase 3 se valida contra:
1. `astro build` en verde + `node tools/verify-metrics.cjs` exit 0 + `npm test`.
2. Chrome real a 1440px y 390px (los dos bugs conocidos revisados).
3. Lighthouse móvil **3 corridas**, medianas, comparadas contra el baseline de `qa-output/lighthouse-baseline/`.
4. `test:a11y:astro` sin regresiones.
5. Entrada en `CHANGELOG-AUDIT.md` (qué, por qué, evidencia, impacto esperado, validación posterior) + flujo de registro en Notion (Inbox → Changelog → Tarea) por cambio lógico.

Ningún cambio de copy sin Diego. Ningún cambio que necesite assets nuevos (retrato del hero, tarjeta OG, imágenes de caso) avanza sin que Diego los provea.
