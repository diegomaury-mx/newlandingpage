# Landing Canónica (Bento + Violeta) — Diseño

**Fecha:** 2026-06-16
**Archivo objetivo:** `index-canonico.html` (raíz del repo) — versión PREVIEW
**Estado:** En revisión
**Fuente de verdad de contenido:** Notion "MAQUETA Canónica - diegomaury.mx (Landing congruente)" (id `e5f9bb1b96224857a648b0212c3e9822`)

---

## Contexto

El `index.html` LIVE (v2 "Deep Tech & Friction") diverge de la maqueta canónica de Notion en
contenido (título, email, etiquetado de métricas, lenguaje). Se quiere una **versión nueva de
prueba** que siga la maqueta canónica al pie, con un **rediseño visual nuevo**, para revisar y
comparar visualmente ANTES de decidir si reemplaza al live.

- NO es un A/B test de tráfico real.
- NO edita el `index.html` LIVE.
- Es un archivo independiente `index-canonico.html` en la raíz, servible en local
  (`python -m http.server 8080` → `localhost:8080/index-canonico.html`).
- El reemplazo del live solo ocurre con aprobación explícita posterior.

---

## Decisiones de diseño (brainstorming)

| Decisión | Elección |
|----------|----------|
| Dirección visual | **D · Bento / Dashboard** |
| Intensidad bento | **C · Puntual** (hero lineal fuerte; bento solo en la banda de métricas del Hero y en Proyectos. S7 Experience queda como tabla, fiel al SSOT) |
| Paleta + tipografía | **B · Violeta Protagonista** (continuidad de marca DS v3) |

### Hipótesis del experimento

Bento puntual aumenta la percepción de "sistemas operativos medibles" (el posicionamiento del SSOT)
sin convertir la página en un dashboard ruidoso; Violeta protagonista refuerza la continuidad con el
DS v3 actual. **A refutar:** que el bento no aporte claridad sobre el `index.html` LIVE actual, o que
sature la jerarquía narrativa de Trinchera/About.

---

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla. Sin frameworks, sin build system.
- CSS inline `<style>` o `assets/css/` local; tokens del DS v3 en `:root`.
- Reutiliza fuentes locales ya en el repo: Satoshi Variable (`assets/fonts/`), JetBrains Mono.
- **Analítica DESACTIVADA por default en el PREVIEW.** GTM `GTM-NHT5827J` y Clarity `x7ns7c22xi`
  NO se inyectan mientras sea preview, para no ensuciar la analítica de producción si alguien lo abre.
  Se dejan los snippets comentados o tras un flag (`data-preview="true"`) listo para activar al promover a LIVE.
- **SEO:** `<meta name="robots" content="noindex,nofollow">` en el `<head>` del PREVIEW para evitar
  indexación y contenido duplicado frente a `index.html`. Se retira al promover a LIVE.

---

## Sistema visual

### Tokens de color (`:root`)

| Token | Hex | Uso |
|-------|-----|-----|
| `--dm-catalyst-900` | `#120D1A` | Fondo base oscuro |
| `--dm-bento` | `#1D1430` | Fondo de celdas bento (borde `#2E1547`) |
| `--dm-amethyst` | `#7C3FBE` | **Solo fill**: CTA, badges, hero. NUNCA color de texto sobre oscuro |
| `--dm-amethyst-text` | `#B07FE8` | **Token nuevo** — enlaces y acentos textuales sobre oscuro (~6:1) |
| `--dm-spark` | `#E6B800` | Solo números de impacto / KPIs (9–10:1, holgado) |
| `--dm-bone` | `#F5F5F7` | Texto sobre oscuro (17.5:1) |
| `--dm-border-interactive` | `#5A2C87` | Borde de celdas bento interactivas (`:hover`/`:focus-visible`, ~3:1) |

### Reglas de accesibilidad (auditoría WCAG 2.1 — verificada por cálculo de luminancia)

- **Amethyst = fill, nunca text-color sobre oscuro.** Sobre `#120D1A` solo pasa texto grande
  (3.02:1); sobre bento `#1D1430` no pasa (2.77:1). Para texto/enlaces usar `--dm-amethyst-text`.
- **CTA seguro:** bone sobre amethyst = 5.82:1 (AA normal). No subir saturación del violeta.
- **KPIs spark:** 9.39–10.22:1, AAA. Legibles incluso para hipovisión.
- **Bordes bento decorativos** (`#2E1547`, 1.10:1): solo separación sutil + apoyo en hover.
  Las celdas **interactivas** suben el borde a `--dm-border-interactive` `#5A2C87` (~3:1).
- **Foco:** `:focus-visible` → `outline: 2px solid #7C3FBE; outline-offset: 2px` sobre fondo oscuro
  (cumple WCAG 2.4.11 Focus Appearance).
- Combinaciones verificadas AA/AAA: bone/catalyst-900 17.56:1, bone/bento 16.14:1,
  spark/catalyst-900 10.22:1, spark/bento 9.39:1.

### Tipografía

| Familia | Carga | Uso |
|---------|-------|-----|
| Satoshi Variable | Local `assets/fonts/` | Headlines, títulos de sección, números |
| Inter | Google Fonts | Body, descripciones |
| JetBrains Mono | Google Fonts + local italic | Labels, tags, métricas, nav |

---

## Estructura de la página (10 secciones del SSOT; S8 y S9 ocultas en PREVIEW)

> El SSOT define **10 secciones (S1–S10)**. En esta versión PREVIEW **S8 (Testimonios) y
> S9 (Insights/Newsletter) se OCULTAN** porque su contenido está pendiente en el propio SSOT
> (S8 "pendiente de recolección"; S9 con campos `[PENDING]`: nombre del Substack, posts, cadencia).
> Se documentan aquí como "pendientes de activar" para no perderlas al promover a LIVE.

```
[NAV]
  → Nav fija; enlaces ancla a secciones. Función scrollToSection (no scrollTo).

[S1 · HERO]  — lineal fuerte (fondo catalyst-900)
  → Tag mono (amethyst-text sobre oscuro)
  → H1 Satoshi 800: "Diego Maury"
  → Rol: "Strategic Program & Operations Director"
  → Tagline: "Tomo operaciones ambiguas y las dejo funcionando como sistemas medibles."
  → 2 CTAs: [ Agenda un diagnóstico ] (amethyst fill) · [ Ver proyectos ] (secundario)
  → BENTO de métricas (Quick impact, spark): 10+ años (7+ innovación) · 9,905 · 3,231 · +600% · +500%

[S2 · QUÉ HAGO]  — lineal, 3 cards
  → Diseño y operación de programas · Sistemas y automatización (RevOps) · Ecosistemas y partnerships

[S3 · PROYECTOS]  → BENTO (grilla de 4 celdas, acento de color por caso sobre base violeta)
  → CASE 1 HEINEKEN Green Challenge (verde): +600%, 9,905, 3,231, 100+ mentores/edición
  → CASE 2 SOFI / FlipHouse (azul): speed-to-lead <5 min, +500% leads, RODI "disponible a solicitud" + cost-avoidance modelado
  → CASE 3 HackSureste (morado): 3,000+ participantes, 200+ capacitados en REDUX
  → CASE 4 REDUX (naranja): autor de la metodología, directorio Tec
  → Celdas interactivas: borde #5A2C87 en hover/focus, eleva en hover (transform/opacity)

[S4 · LA TRINCHERA]  — lineal (post-mortem narrativo)
  → Post-mortem 01 HEINEKEN: 3 fallos documentados (filtrado, fricción multisectorial, brecha virtual)

[S5 · LIDERAZGO FRACCIONAL]  — lineal, 3 modelos SIN rangos de precio
  → Retainer mensual · Proyecto acotado · Asesoría estratégica
  → CTAs: [ Cuéntame tu contexto ] · [ Agenda una llamada ]

[S6 · ABOUT]  — lineal, 2 cols (Para quién trabajo / Para quién no)

[S7 · SELECTED EXPERIENCE]  → TABLA (fiel al SSOT, no bento)
  → Organización / Rol / Resultado clave
  → FlipHouse · INCmty-HEINEKEN · HackSureste · Tec de Monterrey y EBC

[S8 · TESTIMONIOS]  — OCULTA en PREVIEW (pendiente de recolección; solo fuentes verificables)

[S9 · INSIGHTS / NEWSLETTER]  — OCULTA en PREVIEW (campos [PENDING] en el SSOT)

[S10 · CONTACTO]  — lineal (fondo catalyst-700), 3 cols
  → Para proyectos (agendar diagnóstico) · Para empleo (entrevista / CV) · Contacto directo
  → dm@diegomaury.mx en TODOS los puntos de contacto · LinkedIn · diegomaury.mx

[FOOTER]
  → © Diego Maury · Strategic Program & Operations Director · dm@diegomaury.mx · diegomaury.mx
```

### Mapeo SSOT → sección en `index-canonico.html` (regresión de contenido)

| Bloque SSOT | ID/ancla destino | Estado en PREVIEW |
|-------------|------------------|-------------------|
| S1 Hero | `#hero` | Visible |
| S2 Qué hago | `#que-hago` | Visible |
| S3 Proyectos | `#proyectos` (bento) | Visible |
| S4 La Trinchera | `#trinchera` | Visible |
| S5 Liderazgo Fraccional | `#fraccional` | Visible |
| S6 About | `#about` | Visible |
| S7 Selected Experience | `#experiencia` (tabla) | Visible |
| S8 Testimonios | `#testimonios` | **Oculta** (pendiente) |
| S9 Insights/Newsletter | `#insights` | **Oculta** (pendiente) |
| S10 Contacto | `#contacto` | Visible |

> Regla de gobernanza: cualquier edición posterior al SSOT debe propagarse a la sección mapeada.

---

## Correcciones de contenido vs. `index.html` LIVE (la maqueta SSOT gana)

1. **Título / rol** → "Strategic Program & Operations Director" (live decía "Strategic Program & Innovation Manager").
2. **Email** → `dm@diegomaury.mx` en todo el sitio (live tenía `hola@diegomaury.mx` en `contacto-meta`).
3. **Métricas etiquetadas con su alcance real** (sin inflar):
   - 9,905 = agregado de 4 ediciones.
   - 3,231 = evaluados, 900+ por edición.
   - 3,000+ = HackSureste.
4. **RODI** → "disponible a solicitud" + nota de cost-avoidance (no cifras crudas infladas).
5. Sin lenguaje de gurú. Sin "DSL Innovation".

---

## Restricciones (de CLAUDE.md y reglas web)

- **Idioma: español únicamente** (sin toggle).
- **Mobile-first:** breakpoints 375 / 768 / 1280.
- Animaciones solo en propiedades compositor-safe: `transform`, `opacity`.
- Respetar `prefers-reduced-motion` (el scroll reveal se omite si está activo).
- Presupuesto: JS < 80 KB gzipped, CSS < 15 KB.
- Sin em dash. Sin analogías corporativas.

---

## Criterios de éxito

- [ ] `index-canonico.html` carga en local sin tocar `index.html`.
- [ ] Las 10 secciones de la maqueta presentes y en orden (S8 y S9 ocultas en PREVIEW).
- [ ] Contenido coincide con la maqueta canónica (título, email, métricas etiquetadas, RODI, sin gurú).
- [ ] Bento aplicado solo en métricas del Hero + Proyectos; S7 Experience como tabla; resto lineal.
- [ ] Tokens de color cumplen las reglas WCAG documentadas (amethyst nunca como texto; foco visible; bordes interactivos 3:1).
- [ ] Responsive sin overflow en 375 / 768 / 1280.
- [ ] Respeta `prefers-reduced-motion`.
- [ ] GTM/Clarity desactivados por default + `<meta name="robots" content="noindex,nofollow">` presente.

---

## Criterios de comparación (PREVIEW vs. LIVE)

Evaluación objetiva al comparar `index-canonico.html` contra el `index.html` LIVE:

1. **Legibilidad mobile (375px):** jerarquía y contraste sin overflow ni texto comprimido.
2. **Jerarquía del hero:** ¿el rol, el tagline y la métrica principal se leen en orden y sin competir?
3. **Claridad del CTA:** ¿la acción primaria (Agenda un diagnóstico) es inequívoca y distinguible de la secundaria?
4. **Densidad informativa:** ¿el bento aporta escaneo más rápido sin saturar?
5. **Tiempo a comprensión de la propuesta:** ¿qué hace Diego se entiende en los primeros 5 segundos?

---

## Definition of Done (revisión humana)

- **Owner de la decisión:** Diego Maury.
- **Fecha objetivo de veredicto:** dentro de la sesión de revisión (sin compromiso de calendario externo).
- **Formato del veredicto:** uno de tres —
  - **Aprobar** → procede a planear el reemplazo del LIVE (sesión aparte, con aprobación explícita).
  - **Iterar** → lista de ajustes concretos sobre el PREVIEW.
  - **Archivar** → se conserva el spec; no se promueve a LIVE.
- El PREVIEW se considera "hecho" cuando cumple todos los Criterios de éxito y queda listo para emitir veredicto, no cuando reemplaza al LIVE.

---

## Fuera de alcance

- Reemplazar el `index.html` LIVE (decisión posterior, con aprobación explícita).
- Backend / chatbot RAG (Phase 2).
- S8 Testimonios y S9 Insights/Newsletter quedan ocultas en el PREVIEW (contenido pendiente de recolección en la maqueta SSOT).
