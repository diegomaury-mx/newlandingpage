# Auditoría de Design System — Diego Maury DS "Ember on Ink"
**Fecha:** 2026-09-10 (segunda corrida, independiente) · **Auditor:** design-system-auditor
**Origen del input:** repositorio del design system leído directamente (`/projects/019dd0ff…`), archivo por archivo. No copy-paste.
**Alcance declarado:** auditoría nueva, desde cero. No reutiliza los hallazgos de la corrida anterior; cuando un hallazgo coincide, se vuelve a probar con evidencia de hoy.
**Versión declarada por la documentación:** v2.3 (README · changelog "v2.3 — Septiembre 2026").

---

## FASE 1 — Ingesta y extracción *(descriptiva, sin juicios)*

Qué recibí y qué cubre:

- `v2-tokens.css` (142 líneas) — declarado fuente de verdad. Color + tipografía. Incluye `--bg-stage` y cuatro alias de modo claro marcados como deprecados.
- `styles.css` (5 líneas) — entry point canónico, solo `@import url('./v2-tokens.css')`.
- `README.md` — manual del sistema: paleta, tipografía, assets, 11 reglas no negociables, tabla de excepciones, changelog v2.0→v2.3, notas de workspace.
- `CLAUDE.md` — regla de logotipo (uppercase, PJS 700, +.04em, `#FAF8FC` sobre oscuro).
- `_ds_manifest.json` — namespace `DiegoMauryDesignSystem_019dd0`, `"components":[]`, `"startingPoints":[]`, ~20 cards de piezas HTML.
- `_adherence.oxlintrc.json` — configuración de linter (plugins `react`, `import`), lista de 30 tokens y sus `tokenKinds`.
- **Cuatro archivos/bloques de tokens adicionales** además del canónico (ver inventario).
- 25 piezas HTML de formato fijo y documentación (deck, poster, quote cards, portadas, papelería, manual, specimen tipográfico, inventario, guía de uso).
- 2 sitios web completos: `uploads/index.html` (1087 líneas, `canonical=https://diegomaury.mx/`) y `ui_kits/version2/index.html` (1448 líneas, `canonical=https://diegomaury.mx/version2`).
- 1 UI kit React: `ui_kits/portfolio/` (`index.html` + `app.jsx` + `styles.css`, con `@import` real al token store).
- 1 paquete de handoff con su propia copia de tokens: `design_handoff_azul_medianoche/`.
- 1 copia distribuida del sistema en el proyecto consumidor: `_ds/diego-maury-…/v2-tokens.css`.
- Assets: 8 SVG de isotipo en `assets/`, `assets/logos/` (6 lockups), `assets/logo-pack/`, `assets/exports/`, `assets/backgrounds/`, `assets/substack/`.
- Carpetas de trabajo: `uploads/`, `_workspace/`, `screenshots/`, `.bundles/`.
- No recibí: variables de Figma, Storybook, capturas de producto renderizado, tests.

### INVENTARIO

| Dimensión | Encontrado |
|---|---|
| **Colores (canónico)** | `#0A0612` bg · `#1A1128` bg-2 · `#06030F` bg-stage · `#6A291B` border · `#FAF8FC` t1 · `#DDDBE0` t2 · `#A8A6AC` t3 · `#FF5C39` ember · `#2F6FE0` accent-secondary · `#457FE3` accent-secondary-text · modo claro `#FAF8FC` / `#0A0612` / `#3D2A52` / `#E4DAEE` / `#FF5C39` |
| **Colores fuera del canónico, presentes en código** | `#BF452B` (`--ember-cta`, `ui_kits/version2/index.html:65`) · `#2A1F3D`, `#9A8CB0`, `#8B7C9E` (paleta pre-v2.2, `uploads/index.html:60-66`) · `#9A8CB0` (`_ds/…/v2-tokens.css:103`) · `#fff` y `rgba(255,255,255,.03/.05)` (`uploads/index.html:131, :180, :127, :196`) · `rgba(10,6,18,0.92/0.98)` (nav y modales) |
| **Fuentes de tokens paralelas** | 5: `v2-tokens.css` · `_ds/…/v2-tokens.css` · `design_handoff_azul_medianoche/v2-tokens.css` · `uploads/index.html:58-70` · `ui_kits/version2/index.html:57-73`. Más ~20 bloques `:root` locales en piezas de formato fijo. |
| **Tipografía** | Plus Jakarta Sans (contrato: 300/400/500/700 + itálicas) y DM Mono (400/500). En código: `0,800` cargado en `uploads/index.html:54` y `ui_kits/version2/index.html:54`; DM Mono `0,300` + itálica cargada en `Manual de Marca.html:10`. |
| **Escala de tamaños** | No existe escala tokenizada. Cada pieza usa px/rem/clamp literales (legal por P4b). |
| **Spacing** | No encontrado en el input como escala tokenizada (podado en v2.2, decisión documentada). |
| **Radius** | No tokenizado en el canónico. Reaparece como tokens locales en `Manual de Marca.html:27` (`--r-xs/sm/md/lg`) y como literales (6px, 7px, 10px, 12px, 13px, 14px, 999px) en las piezas. |
| **Breakpoints** | No tokenizados. Literales recurrentes: 480 / 600 / 720 / 760 / 768 / 800 / 860 / 900 px. |
| **Estados** | hover ✅ · focus-visible ✅ solo en `ui_kits/portfolio/styles.css:145-151` (5 selectores) · active ✅ (solo color) · disabled **no encontrado en el input** |
| **Componentes** | `_ds_manifest.json` → `"components":[]`. No hay capa de componente publicada. Existen clases repetidas de facto: `.btn/.btn--ember/--catalyst/--outline`, `.chip`, `.svc-card`, `.work__link`, `.label-mono`, `.label-ember`, `.lockup*`, `.ember-bar-top/-left`, `.tagline-*`. |
| **Guidelines** | Layout: parcial (proporciones del lockup en `v2-tokens.css:90-93`). Content: no encontrado. Accesibilidad: contrastes anotados en comentarios de tokens; `prefers-reduced-motion` en `v2-tokens.css:129-136`. Motion: regla 2 "sin efectos" + excepciones fechadas. |

---

## FASE 2 — Auditoría

### Applicability Check

Sistema **mixto**: (a) marketing/brand assets estáticos de formato fijo (20 piezas), (b) portfolio/landing interactivo (3 superficies: `uploads/index.html`, `ui_kits/version2/index.html`, `ui_kits/portfolio/`), (c) documentación HTML.

| Sub-criterio | Aplica | Razón |
|---|---|---|
| Estados hover/focus/active | Sí | hay 3 superficies interactivas con nav, botones, cards y modal |
| Estado disabled | Sí, parcial | hay botones y controles de carrusel; no hay formularios con campos deshabilitados en lo leído |
| Motion / reduced-motion | Sí | hay transiciones, scroll-reveal y animación CSS |
| Responsive | Sí en (b) y (c) · **N/A** en (a) | las piezas de 1080×1080 / 1584×396 son de lienzo fijo por definición |
| Keyboard / focus order | Sí | nav, modal de caso, carrusel |
| RTL | **N/A** | sistema personal monolingüe (es-MX); no hay evidencia de intención RTL |
| Touch targets | Sí, parcial | ⬜ no verificable sin render en la mayoría de piezas |

**Búsqueda activa de fuentes paralelas de tokens** (obligatoria): encontré 5 (ver inventario). Ahí vive el hallazgo principal de esta corrida.

---

## 1. Resumen ejecutivo

| Campo | Valor |
|---|---|
| **Madurez** | **50/100 — Emergente (borde alto)** |
| **Principal riesgo** | **Dos decisiones de sistema mutuamente excluyentes conviven en el repo, ambas fechadas y firmadas, sin referencia cruzada.** `ui_kits/version2/index.html:64-67` declara retirada la excepción del Azul Medianoche (2026-07-09) y añade un segundo naranja `--ember-cta:#BF452B`; `v2-tokens.css:18-29` y el README v2.3 (2026-09-10) declaran el azul vigente y el segundo naranja inexistente. Ninguno de los dos documentos sabe del otro. |
| **Mayor fortaleza** | El **sello de snapshot** (`/* snapshot v2.3 — 2026-09-10 */`) ya existe y funciona: `Deck.html:13`, `poster.html:13`, `Quote Cards.html:15`, `Footer.html:13`. Es el primer mecanismo real de trazabilidad del sistema y hace visible la deriva en vez de esconderla. |
| **Mayor impacto esperado** | Resolver *cuál* de los dos sitios es producción y meterlo al sistema. Hoy la pieza con `canonical=https://diegomaury.mx/` vive en `uploads/` — una carpeta que el propio README declara "trabajo interno, excluir del release" — y corre con la paleta pre-v2.2. Eso arrastra 1 fallo AA real, 3 valores de color obsoletos y la mayor parte de las violaciones de la regla 1. |
| **Conteo** | 8 quick wins · 5 refactors · 1 breaking change potencial (`--ember-cta`) |
| **Cambio respecto a la corrida anterior** | El score es el mismo número por razones distintas: **arquitectura de tokens +3 y documentación −1**; **consistencia −3 y gobernanza −1**. El contrato se endureció (D-A, D-P3, D-C) más rápido de lo que se movieron las superficies. |

---

## 2. Design System Maturity Score (DSMS)

> Metodología propia del skill, ponderación explícita y ajustable. No es un estándar externo.

### 2.1 Arquitectura de tokens — **12 / 20**

| Sub-criterio | Peso | Score | Evidencia |
|---|---|---|---|
| Existe archivo único de tokens | 4 | 4 | `v2-tokens.css:1-4` se declara fuente de verdad; `styles.css:4` → `@import url('./v2-tokens.css')` ✅ |
| Nomenclatura semántica coherente | 4 | 3 | `--light-*` canonizado y los cuatro alias viejos declarados deprecados con comentario y fecha de retiro (`v2-tokens.css:54-62`) ✅. Resta: `Manual de Marca.html:21-24` sigue usando los alias deprecados y `:27` reintroduce tokens dimensionales (`--r-xs/sm/md/lg`, `--dur`, `--ease`) que v2.2 sacó del contrato |
| Jerarquía raw → semantic → component (DTCG) | 4 | 2 | Capa semántica + alias, sin capa de componente (`_ds_manifest.json` → `"components":[]`). `--bg-stage:#06030F` (`v2-tokens.css:33`) se declara como literal dentro del bloque de alias, sin su pareja `--color-*`: rompe el patrón de los otros siete colores |
| Consumo real vía `var()` sin duplicación | 5 | 1 | 5 fuentes paralelas de tokens. Solo 2 consumidores hacen `@import` real: `styles.css:4` y `ui_kits/portfolio/styles.css:4`. Las dos superficies web grandes redeclaran su propio `:root` (`uploads/index.html:58-70`, `ui_kits/version2/index.html:57-73`) |
| Metadatos de tokens correctos | 3 | 2 | `_adherence.oxlintrc.json:88` ya clasifica `--accent-secondary-text` como `"color"` ✅ y `--bg-stage` está registrado ✅. Resta: `--ember-cta` existe en código y no está en la lista de 30 tokens; la config declara `plugins:["react","import"]` y un override sobre `**/index.js` que no existe |

### 2.2 Consistencia visual / identidad — **7 / 20**

| Sub-criterio | Peso | Score | Evidencia |
|---|---|---|---|
| Paleta aplicada uniformemente | 6 | 2 | 7 piezas muestreadas con los valores v2.3 correctos ✅ (`Deck.html:14-16`, `poster.html:14-16`, `Quote Cards.html:16-18`, `Footer.html:14-17`, `Tarjeta de Presentación.html:13-15`, `Portada LinkedIn.html:13-15`, `Manual de Marca.html:14-20`). Contra: `uploads/index.html:60-66` sigue en `--border:#2A1F3D`, `--t2:#9A8CB0`, `--t3:#8B7C9E` (pre-v2.2), y `_ds/…/v2-tokens.css:103` conserva `#9A8CB0` en `.lockup-role` |
| Regla 1 (Ember = señalización estructural) | 5 | 1 | `uploads/index.html` pinta Ember en: eyebrow (`:166-171`) ✅ permitido, CTA (`:131`, `:180`) ✅ permitido, **y además** palabra suelta del titular (`:216` `.hero-h1 .accent`), cifras (`:237` `.metric-n`, `:355` `.work-n`, `:395` `.ip-stat-n`), numeración de pasos (`:313` `.spine-n`), tags (`:290` `.tr-col--b .tr-tag`), barras decorativas (`:283`, `:333`, `:375`), hover (`:312`). La regla D-A prohíbe explícitamente cifras y palabras sueltas de titular |
| Ausencia de colores fuera de token | 4 | 2 | `#fff` sobre `--ember` (`uploads/index.html:131`, `:180`) contradice la regla 11 · `--ember-cta:#BF452B` (`ui_kits/version2/index.html:65`) es el segundo naranja que el changelog v2.3 declara retirado · `rgba(255,255,255,.05)` (`:127`) y `.03` (`:196`) como hover. Las piezas de formato fijo muestreadas están limpias ✅ |
| Escala tipográfica dentro del contrato | 3 | 1 | `uploads/index.html:54` y `ui_kits/version2/index.html:54` cargan `0,800`; se usa en `:171` (`.section-title`), `:211` (`.hero-h1`), `:237`, `:355`, `:395`. `Manual de Marca.html:10` carga DM Mono `0,300` + itálica, pesos que no están en el contrato |
| Reglas de display (D4/D10) | 2 | 1 | `uploads/index.html:210-213`: `.hero-h1` `clamp(2.4rem, 4.6vw, 4rem)` con `font-weight:800` — a 4rem (64px) la regla 10 pide 300. Las piezas fijas sí cumplen: `poster.html` y `Deck.html` usan 700 en tamaños compactos ✅ |

> Nota metodológica: esta categoría baja 3 puntos respecto a la corrida anterior **sin que ninguna pieza haya empeorado**. Bajó porque D-A, D-P3 y D-C endurecieron el contrato el 2026-09-10 y las dos superficies web no se actualizaron.

### 2.3 Accesibilidad — **10 / 20**

| Sub-criterio | Peso | Score | Evidencia |
|---|---|---|---|
| Contraste de texto AA (4.5:1 / 3:1 en ≥24px o ≥18.66px bold) | 6 | 2 | ❌ `#fff` sobre `#FF5C39` = **3.07:1** en `uploads/index.html:131` (9.5px) y `:180` (10px) — WCAG 2.2 SC 1.4.3 exige 4.5:1. ⚠️ La cifra documentada para el fix es incorrecta: README (paleta y regla 11) afirma **12.2:1** para tinta `#0A0612` sobre Ember; el valor real es **6.53:1**. Pasa AA, pero el número está inflado ~2× en tres lugares del manual. Verificado también: `#3D2A52` sobre `#FAF8FC` = 12.05:1 ✅ (README dice 12.1) y `#2F6FE0` sobre `#0A0612` = 4.26:1 ✅ (tokens dicen 4.27) |
| Contraste de no-texto (3:1) | 3 | 3 | `v2-tokens.css:23-28` documenta y acierta los contrastes del acento secundario ✅ |
| Foco visible | 4 | 2 | ✅ `ui_kits/portfolio/styles.css:145-151` cubre 5 selectores incluyendo `.case__close` (era hallazgo abierto y está cerrado). ❌ Ninguna regla `:focus-visible` en `uploads/index.html` ni en `ui_kits/version2/index.html` en el rango leído, pese a tener nav, burger, CTA y cards clicables |
| Estados sin depender solo del color | 3 | 1 | `uploads/index.html:128` `.nav__link.is-active { color: var(--t1) }` — solo color. `:312` `.spine-step:hover::before{background:var(--ember)}` — solo color. `ui_kits/portfolio/styles.css:41` `.nav__link.is-active` — solo color. SC 1.4.1 |
| `prefers-reduced-motion` | 2 | 1 | ✅ `v2-tokens.css:129-136` (lo heredan los 2 importadores) y `ui_kits/version2/index.html:96-98` para `[data-reveal]`. ❌ `uploads/index.html` tiene `scroll-behavior:smooth` (`:73`) y transiciones en 20+ selectores sin bloque de reducción en el rango leído |
| Touch targets ≥24×24 (SC 2.5.8) | 2 | 1 | ✅ `uploads/index.html:133` CTA 9px+9px padding sobre texto 9.5px ≈ 28px de alto — al límite. ⬜ El resto no es verificable sin render |

### 2.4 Componentes y patrones — **8 / 15**

| Sub-criterio | Peso | Score | Evidencia |
|---|---|---|---|
| Inventario de componentes | 4 | 1 | `_ds_manifest.json` → `"components":[]`, `"startingPoints":[]`. Lo que se publica son 20 cards de piezas completas. Existe código React real (`ui_kits/portfolio/app.jsx`, montado en `index.html:15` con Babel standalone) que no está publicado como componente |
| Estados definidos | 4 | 2 | hover/active/focus existen; **disabled no aparece** en ningún archivo leído, con botones y controles de carrusel en el sistema |
| Reutilización sin copiar | 4 | 2 | ✅ `ui_kits/portfolio/styles.css:4` es el único consumidor web que importa el token store. Las mismas clases (`.btn`, `.chip`, `.section-label`, `.metric`) están reimplementadas de cero en las 3 superficies |
| Responsive | 3 | 3 | ✅ `ui_kits/portfolio/styles.css:153-159`, `uploads/index.html:142-155, :190, :227-233, :302`. Piezas de formato fijo: N/A justificado |

### 2.5 Documentación — **9 / 15**

| Sub-criterio | Peso | Score | Evidencia |
|---|---|---|---|
| Reglas de uso explícitas | 4 | 4 | README "Reglas de diseño no negociables": 11 reglas con IDs trazables (D-A, D-P3, D3, D4, D5) + tabla de excepciones con dueño y fecha ✅ |
| Inventario fiel a la realidad | 4 | 1 | `_ds_manifest.json` publica `archive/Firma de Correo v1.html` como card llamada **"Firma de Correo"** con subtítulo "Firma HTML en tabla · compatible Gmail/Outlook", sin decir que es v1 archivada — exactamente lo que el README v2.3 dice que quedó declarado. Además el README no menciona `ui_kits/version2/` (1448 líneas, un sitio completo) ni `uploads/index.html` (el sitio con el canonical de producción) ni `design_handoff_azul_medianoche/` |
| Exactitud de las cifras publicadas | 3 | 1 | Contraste tinta/Ember documentado como 12.2:1; real 6.53:1 (tres apariciones: tabla de paleta, regla 11, changelog D-P3). `--light-accent` documentado 2.78:1; real 2.91:1 (misma conclusión, no pasa AA) |
| Changelog y versionado | 4 | 3 | ✅ changelog v2.0→v2.3 detallado y fechado. ❌ declara ejecutados cambios que el código no tiene: "se retira el token `--ember-cta` del sitio" (sigue en `ui_kits/version2/index.html:65`) y la regla de sello "toda pieza … con un sello en la primera línea" (4 piezas de ~25 lo tienen) |

### 2.6 Gobernanza y escalabilidad — **4 / 10**

| Sub-criterio | Peso | Score | Evidencia |
|---|---|---|---|
| Excepciones registradas con dueño y fecha | 3 | 2 | ✅ Tabla de excepciones fechada y firmada, ampliada en v2.3. ❌ La excepción del Azul Medianoche está documentada como vigente con scope "`index.html` + secciones S2–S7" y **no tiene ningún consumidor en el repo**: `uploads/index.html:58-70` no declara `--accent-secondary` ni importa el token store (cualquier `var(--accent-secondary)` ahí resolvería a nada), y `ui_kits/version2/index.html:64-67` la declara retirada |
| Mecanismo de propagación de cambios | 4 | 1 | ✅ El sello de snapshot existe y está aplicado en 4 piezas. ❌ No hay propagación: la copia distribuida `_ds/…/v2-tokens.css` está atrasada respecto al canónico (le faltan `--bg-stage`, los 4 alias de modo claro, y conserva `#9A8CB0` en `.lockup-role:103`), y `design_handoff_azul_medianoche/v2-tokens.css` es una tercera copia congelada sin sello |
| Linter de adherencia | 2 | 1 | ✅ Metadatos de tokens corregidos y completos. ❌ Las reglas siguen siendo de ecosistema React (`Literal[value=/#[0-9a-fA-F]{3,8}/]`, override sobre `**/index.js`): no leen CSS ni HTML, que es donde están el 100% de los hex crudos encontrados hoy |
| Higiene del repo | 1 | 0 | `assets/isotipo-ember-mrxkgyto-gb40.svg` y `assets/isotipo-light-mrxkqd6f-sc52.svg` (sufijos de hash de máquina) siguen en `assets/`; `assets/exports/` sigue replicando isotipos; y la pieza de producción del sistema vive en `uploads/`, carpeta que el README declara "trabajo interno — excluir al generar un release" |

### 2.7 Total

**DSMS = 12 + 7 + 10 + 8 + 9 + 4 = 50 / 100 → Emergente (borde alto)**
Bandas: 0-30 Inicial · 31-50 Emergente · 51-70 Establecido · 71-85 Maduro · 86-100 Optimizado.

**Confidence Score = 40 / 50 criterios auditables = 80%.**

- Leídos completos: `v2-tokens.css`, `styles.css`, `README.md` (guía reproducida), `CLAUDE.md`, `_adherence.oxlintrc.json`, `ui_kits/portfolio/styles.css`, `ui_kits/portfolio/index.html`, `_ds/…/v2-tokens.css`.
- Leídos parcialmente con líneas citadas: `uploads/index.html` (1-410 de 1087), `ui_kits/version2/index.html` (1-110 de 1448), `_ds_manifest.json` (truncado por el lector), `design_handoff_azul_medianoche/v2-tokens.css` (1-35), y los bloques de tokens de `Deck.html`, `poster.html`, `Quote Cards.html`, `Footer.html`, `Tarjeta de Presentación.html`, `Portada LinkedIn.html`, `Manual de Marca.html`.
- ⬜ No evaluable: 14 piezas HTML no abiertas en esta corrida; ningún render o captura; ninguna variable de Figma; ningún Storybook; `app.jsx` no leído; contenido de los SVG no comparado byte a byte.

---

## 3. Cobertura del sistema *(informativo, no altera el DSMS)*

| Métrica | Valor | Cómo se calculó |
|---|---|---|
| Fuentes de tokens paralelas | **5** | 3 archivos `v2-tokens.css` (canónico, `_ds/`, handoff) + 2 bloques `:root` propios en las superficies web |
| Piezas que consumen el token store por referencia | **2 de ~27 (≈7%)** | `styles.css:4` y `ui_kits/portfolio/styles.css:4` |
| Piezas con sello de snapshot | **4 de 7 muestreadas con `:root` local (57%)** · 0 de 2 sitios | sellados: Deck, poster, Quote Cards, Footer · sin sello: Tarjeta, Portada LinkedIn, Manual de Marca |
| Tokens definidos sin consumidor detectado | **3 de 30** | `--accent-secondary`, `--accent-secondary-text` (su único consumidor declarado los retiró), `--light-accent` |
| Piezas documentadas en el README | ~15 de ~27 | faltan los 2 sitios, `ui_kits/*`, `design_handoff_*`, `Inventario de Assets`, `Guía de Uso`, `Portada Propuesta`, `Lockups con Tagline`, `Fondo Perfil V2` |
| Reglas con verificación automatizada | **1 de 11** | solo "sin hex crudo", y la regla no lee CSS/HTML |

---

## 4. Qué identidad NO tocar

1. **Deep Ink `#0A0612`** como fondo primario: aplicado consistentemente en las 7 piezas muestreadas y en las 3 superficies web.
2. **Ember `#FF5C39`** como acento único. Los problemas encontrados son de disciplina y de documentación, no del hex.
3. **Plus Jakarta Sans + DM Mono**, con DM Mono restringido a labels y cifras: cumplido en todas las piezas leídas.
4. **DM Mono uppercase con tracking 0.06–0.18em** — es la firma tipográfica reconocible del sistema.
5. **La barra Ember de 3-4px** (`poster.html:34`, `Quote Cards.html`, `v2-tokens.css:86-87`): patrón estructural que ya funciona como identificador.
6. **El sello de snapshot** (`/* snapshot v2.3 — 2026-09-10 */`). Es el mejor mecanismo que tiene hoy el sistema; hay que extenderlo, no reemplazarlo.
7. **La tabla de excepciones fechada y firmada.** Necesita depuración, no eliminación.

---

## 5. Cumple / Observaciones

### Cumple *(checklist objetivo)*

- ✓ Existe archivo único declarado fuente de verdad, con entry point separado
- ✓ Tokens con nombre semántico, no literal
- ✓ Modo claro con un solo nombre canónico (`--light-*`) y alias viejos marcados deprecados con fecha de retiro
- ✓ `--bg-stage` tokenizado y registrado en el linter
- ✓ `.lockup-role` ya usa `var(--t2)` en el canónico (era hallazgo abierto)
- ✓ `--accent-secondary-text` clasificado como `color` en el linter (era hallazgo abierto)
- ✓ `:focus-visible` cubre los 5 selectores interactivos del kit portfolio, incluido `.case__close` (era hallazgo abierto)
- ✓ Existe bloque `prefers-reduced-motion` en el token store
- ✓ El asset roto `hexagon-pattern-light.png` está neutralizado con comentario trazable (`ui_kits/portfolio/styles.css:24-26`)
- ✓ Peso 800 eliminado del kit portfolio
- ✓ Existe changelog versionado y tabla de excepciones con dueño y fecha
- ✓ 4 piezas de formato fijo llevan sello de snapshot
- ✗ Una sola fuente de tokens en tiempo de ejecución
- ✗ La paleta vigente aplicada en todas las superficies
- ✗ Todo texto sobre Ember pasa AA
- ✗ Las cifras de contraste publicadas coinciden con las reales
- ✗ El changelog describe solo cambios efectivamente ejecutados
- ✗ Toda pieza con `:root` local lleva sello
- ✗ Un solo naranja en el sistema
- ✗ El inventario publicado coincide con los archivos que existen

### Observaciones *(interpretación, no hechos verificados)*

- El sistema tiene **dos hilos de decisión que nunca se cruzaron**: uno vive en las superficies web (`version2`, julio) y otro en la documentación y las piezas fijas (septiembre). El de julio retiró el azul e inventó un naranja de botón; el de septiembre reafirmó el azul y prohibió el segundo naranja. Ninguno de los dos es "el equivocado" por sí solo: falta el mecanismo que los obligue a encontrarse.
- La corrida anterior corrigió con precisión todo lo que era *un archivo, un valor* (lockup, metadato del linter, foco, asset roto, peso 800 del kit). Lo que no se movió es exactamente lo que requiere decidir **qué archivo es el sistema**: los dos sitios.
- Que la única cifra de contraste incorrecta del manual sea justo la de la regla más nueva (regla 11, D-P3) sugiere que se escribió sin recalcular. Las cifras de v2.2 y de la excepción azul sí verifican.
- `uploads/` está funcionando como directorio de producción y como carpeta de descarte al mismo tiempo. Mientras eso siga así, ninguna regla de release puede cumplirse sin romper el sitio.

---

## 6. Top hallazgos *(agrupados por causa raíz)*

### H1 — Dos decisiones de sistema incompatibles, ambas fechadas, sin referencia cruzada **[CAUSA RAÍZ]**
- **Evidencia:** `ui_kits/version2/index.html:64-67` → `/* Re-alias a ember (review 2026-07-09) — la excepción azul del 2026-07-02 queda retirada */` con `--accent-secondary: var(--ember)`, más `:65` → `--ember-cta: #BF452B`. Contra: `v2-tokens.css:18-29` mantiene el azul con scope activo y el README v2.3 lo documenta en la tabla de excepciones; el changelog v2.3 dice "se retira el token `--ember-cta` del sitio; no hay segundo naranja".
- **Estado:** ❌ Incumple · **Severidad:** Critical
- **Recomendación (trade-off real — elegir una):**
  - **(a) La decisión de julio gana.** Se retira el azul del canónico y de la tabla de excepciones; el sistema vuelve a un acento. Consecuencia: hay que resolver el contraste de botón sin `--ember-cta` (usar tinta sobre Ember, que es la decisión D-P3 ya tomada).
  - **(b) La decisión de septiembre gana.** Se borra `--ember-cta` de `version2`, se restaura el azul con scope explícito al sitio que sea producción, y se anota en la tabla de excepciones **qué archivo** lo consume.
  - **(c) Se congela `version2` como archivo histórico** (mover a `archive/` con sello) y solo el sitio de producción queda gobernado. Más barato, y hace innecesario reconciliar dos historias.

### H2 — La pieza de producción no está en el sistema *(derivado de H1)*
- **Evidencia:** `uploads/index.html:1-75` tiene `<link rel="canonical" href="https://diegomaury.mx/">`, GTM y Clarity — es el sitio público. Vive en `uploads/`, que el README declara "carpeta de trabajo interno — excluir al generar un zip o release". No importa el token store y declara su propio `:root` (`:58-70`) sin sello.
- **Estado:** ❌ Incumple · **Severidad:** Critical
- **Recomendación:** mover el archivo de producción fuera de `uploads/` antes de cualquier otro fix. Sin trade-off de diseño; es condición previa para que las demás reglas puedan cumplirse.

### H3 — El sitio corre con la paleta pre-v2.2 *(derivado de H2)*
- **Evidencia:** `uploads/index.html:60-66` → `--border:#2A1F3D`, `--t2:#9A8CB0`, `--t3:#8B7C9E`. Canónico (`v2-tokens.css:11-14`): `#6A291B`, `#DDDBE0`, `#A8A6AC`. El changelog v2.2 declaró esa migración hecha y la corrida anterior la listó como quick win Q1.
- **Estado:** ❌ Incumple · **Severidad:** High
- **Recomendación:** reemplazar los tres valores. Sin trade-off — es una decisión ya tomada dos veces que nunca llegó al archivo.

### H4 — Texto blanco sobre Ember: 3.07:1 *(derivado de H2)*
- **Evidencia:** `uploads/index.html:131` (`.nav-cta`, mono 9.5px) y `:180` (`.btn-primary`, mono 10px) → `background: var(--ember); color: #fff`. WCAG 2.2 SC 1.4.3 exige 4.5:1 para ese tamaño. La regla 11 del README ya prescribe tinta `#0A0612`.
- **Estado:** ❌ Incumple · **Severidad:** High
- **Recomendación:** aplicar la regla 11 (tinta sobre Ember, 6.53:1 real). Fix mecánico, decisión ya tomada.

### H5 — La cifra de contraste de la regla más nueva es incorrecta
- **Evidencia:** README, tabla de paleta: "Texto sobre Ember: siempre tinta `#0A0612`, contraste 12.2:1"; misma cifra en la regla 11 y en el changelog D-P3. Cálculo WCAG 2.x con las luminancias relativas de `#0A0612` (L=0.0024) y `#FF5C39` (L=0.2921): **(0.2921+0.05)/(0.0024+0.05) = 6.53:1**. Verificación cruzada del mismo método contra cifras que el sistema publica y sí aciertan: `#3D2A52`/`#FAF8FC` = 12.05:1 (documentado 12.1) y `#2F6FE0`/`#0A0612` = 4.26:1 (documentado 4.27). Menor: `--light-accent` documentado 2.78:1, real 2.91:1.
- **Estado:** ❌ Incumple · **Severidad:** Medium — la decisión sigue siendo correcta (6.53:1 pasa AA con margen), el número publicado no.
- **Recomendación:** corregir 12.2:1 → 6.53:1 en los tres lugares y 2.78 → 2.91. Fix documental, sin trade-off.

### H6 — Regla 1 (Ember = señalización estructural) incumplida en el sitio *(derivado de H2)*
- **Evidencia:** en `uploads/index.html`, Ember pinta cifras (`:237`, `:355`, `:395`), una palabra del titular (`:216`), numeración de pasos (`:313`), tags (`:290`), barras decorativas (`:283`, `:333`, `:375`) y un hover (`:312`) — además del eyebrow y el CTA, que son los dos usos permitidos por D-A.
- **Estado:** ❌ Incumple · **Severidad:** High (identidad) / Medium (técnico)
- **Recomendación:** aplicar D-A tal como está escrita: cifras a `--t1`, tags y numeraciones a `--t3`, barras decorativas a `--border`. Ember solo en eyebrow y CTA. Es la decisión ya tomada; no la reabro aquí. Si se quiere reabrir, es materia de dirección de arte, no de auditoría.

### H7 — El changelog declara ejecutado lo que no está en código
- **Evidencia:** v2.3 dice "se retira el token `--ember-cta` del sitio" → sigue en `ui_kits/version2/index.html:65`. Dice "toda pieza importa `v2-tokens.css` o declara su bloque `:root` con un sello en la primera línea" → tienen sello `Deck.html:13`, `poster.html:13`, `Quote Cards.html:15`, `Footer.html:13`; no lo tienen `Tarjeta de Presentación.html:12`, `Portada LinkedIn.html:12`, `Manual de Marca.html:13` ni ninguna de las dos superficies web.
- **Estado:** ❌ Incumple · **Severidad:** High (gobernanza: el changelog dejó de ser una fuente confiable de estado)
- **Recomendación:** separar en el changelog "decidido" de "ejecutado", con las dos fechas. Es el mismo principio del sello, aplicado al documento.

### H8 — La copia distribuida del sistema está atrasada
- **Evidencia:** `_ds/diego-maury-…/v2-tokens.css` (131 líneas) contra el canónico (142): le faltan `--bg-stage:#06030F`, los 4 alias `--bg-light/--t1-light/--t2-light/--border-light` y la nota "a revisar en v3.0" de la excepción azul; y conserva `color:#9A8CB0` en `.lockup-role:103`, ya corregido a `var(--t2)` en el canónico. `design_handoff_azul_medianoche/v2-tokens.css` es una tercera copia, congelada en el estado pre-v2.3 y sin sello.
- **Estado:** ❌ Incumple · **Severidad:** High — un consumidor que instale el paquete recibe la versión anterior del sistema.
- **Recomendación:** (a) regenerar la copia distribuida como paso obligatorio del release y sellarla; o (b) declarar explícitamente en el README que las copias en `_ds/` y `design_handoff_*` son snapshots inmutables con fecha, y anotarles el sello.

### H9 — Excepción documentada sin ningún consumidor
- **Evidencia:** la tabla de excepciones del README declara vigente el Azul Medianoche con scope "`index.html` + secciones de método (S2–S7)". `uploads/index.html:58-70` no declara `--accent-secondary` ni importa el token store: cualquier `var(--accent-secondary)` en ese archivo resolvería a vacío. `ui_kits/version2/index.html:64-67` lo aliasea a Ember y declara la excepción retirada. `ui_kits/portfolio/styles.css` no lo usa (la excepción se lo prohíbe explícitamente).
- **Estado:** ❌ Incumple · **Severidad:** High (gobernanza) — el sistema mantiene, documenta y lintéa dos tokens que nadie consume.
- **Recomendación:** ver H1. La decisión que se tome ahí resuelve este hallazgo.

### H10 — Sin capa de componente, con código de componente ya escrito
- **Evidencia:** `_ds_manifest.json` → `"components":[]`, `"startingPoints":[]`. Pero `ui_kits/portfolio/index.html:15` monta `app.jsx` con Babel standalone, y las mismas clases (`.btn`, `.chip`, `.section-label`, `.metric`, `.svc-card`) están reimplementadas de cero en `uploads/index.html`, `ui_kits/version2/index.html` y `ui_kits/portfolio/styles.css`.
- **Estado:** ❌ Incumple · **Severidad:** Medium
- **Recomendación:** empezar por **una** capa mínima: un `components.css` con `.btn`, `.chip`, `.label-mono/-ember`, `.metric`, `.card`, importado desde `styles.css`. Tres selectores compartidos valen más que un Storybook que nadie va a mantener.

### H11 — Estado `disabled` inexistente
- **Evidencia:** ningún archivo leído define `:disabled`, `[aria-disabled]` ni `.is-disabled`, con botones en las 3 superficies y controles de carrusel en `Quote Cards.html`.
- **Estado:** ⚠️ Riesgo · **Severidad:** Medium
- **Recomendación:** definir el estado en el `components.css` de H10, con un indicador que no sea solo opacidad.

### H12 — El linter no puede ver dónde están los problemas
- **Evidencia:** `_adherence.oxlintrc.json:6-45` — `plugins:["react","import"]`, selectores `Literal[value=/…/]` (literales JS) y override sobre `**/index.js`. El 100% de los hex crudos encontrados hoy están en CSS y HTML. `--ember-cta` no está en la lista de 30 tokens (`:57-87`), así que tampoco se detecta como token no declarado.
- **Estado:** ❌ Incumple · **Severidad:** Medium
- **Recomendación:** (a) sustituirlo por un chequeo de CSS/HTML (stylelint con `declaration-property-value-allowed-list`, o un grep en CI: hex crudo, `font-weight` fuera de {300,400,500,700}, `:root` sin sello); o (b) retirarlo y mover esas verificaciones al checklist de QA de la sección 14, asumiendo que son manuales.

### H13 — Tokens dimensionales reintroducidos en documentación
- **Evidencia:** `Manual de Marca.html:27` → `--r-xs:3px; --r-sm:6px; --r-md:10px; --r-lg:16px; --dur:200ms; --ease:cubic-bezier(...)`. v2.2 podó 33 tokens dimensionales y dejó el contrato en color + tipografía. El manual, que es la pieza que enseña el contrato, declara tokens fuera de él. Además `:21-24` usa los alias deprecados y `:10` carga DM Mono 300 + itálica, pesos fuera del contrato.
- **Estado:** ❌ Incumple · **Severidad:** Medium
- **Recomendación:** o el manual se alinea al contrato, o el contrato admite radios y duración (y entonces se tokenizan de verdad, en el canónico). Decisión de alcance, no de estética.

### H14 — Higiene de assets: los mismos duplicados de la corrida anterior
- **Evidencia:** `assets/isotipo-ember-mrxkgyto-gb40.svg` y `assets/isotipo-light-mrxkqd6f-sc52.svg` (sufijos de hash de máquina) siguen junto a `assets/isotipo-final-ember.svg` e `isotipo-light.svg`; `assets/exports/` y `assets/logo-pack/` replican variantes. La decisión P8 de la corrida anterior (mover a `archive/`) no se ejecutó.
- **Estado:** ⚠️ Riesgo · **Severidad:** Low — sin comparar los SVG byte a byte no puedo afirmar que sean idénticos, sí que no hay regla que diga cuál usar.
- **Recomendación:** ejecutar P8 (mover a `archive/`, nunca borrar) y documentar `assets/logos/` como fuente de verdad de lockups, cosa que el README ya hace ✅.

### H15 — Favicon inexistente y con nombre que contradice la regla 2
- **Evidencia:** `uploads/index.html:51-52` → `assets/img/isotipo-gradient.png`; `ui_kits/version2/index.html:50-51` → `../assets/img/isotipo-gradient.png`. No existe `assets/img/` en el repo. El nombre menciona un gradiente, prohibido por la regla 2.
- **Estado:** ❌ Incumple · **Severidad:** Low
- **Recomendación:** apuntar el favicon a un isotipo existente (`assets/isotipo-final-cuadrado.svg`) o publicar el PNG con un nombre que no contradiga el manual.

---

## 7. Antipatrones visuales detectados *(no afecta el DSMS)*

1. **Dos historias de decisión sin reconciliar** — el repo contiene su propio desacuerdo, fechado en ambos lados (`version2:64-67` vs. README v2.3). Es el antipatrón más costoso: cualquier fix puede ser un retroceso según qué hilo se lea.
2. **Directorio de descarte como directorio de producción** — `uploads/index.html` es el sitio; `uploads/` está declarado excluible del release.
3. **Token de borde usado como relleno** — `--border` (#6A291B) como `background` en `ui_kits/portfolio/styles.css:70` (hover de item), `:98` (chips) y `:127` (botón de cierre). El nombre deja de describir el rol.
4. **Cifra publicada sin recalcular** — 12.2:1 donde el valor real es 6.53:1, en la regla más reciente del manual.
5. **Configuración copiada, no escrita** — un linter de React para un sistema cuyos problemas están en CSS y HTML.
6. **Sufijos de máquina en nombres de archivo canónicos** — `isotipo-ember-mrxkgyto-gb40.svg`.
7. **Changelog como declaración de intención** — describe decisiones como si fueran despliegues.
8. **Ember como textura** — en el sitio, 15 apariciones simultáneas convierten el color de máxima señalización en patrón de fondo.

---

## 8. Preguntas de aclaración

| # | Pregunta | Por qué la necesito |
|---|---|---|
| **P1** | ¿Cuál de los dos sitios es producción hoy: `uploads/index.html` (canonical `/`) o `ui_kits/version2/index.html` (canonical `/version2`)? | **Bloqueante.** Define sobre qué archivo se aplican H3, H4, H6 y cuál se archiva. Todo el plan de migración depende de esto. |
| **P2** | La decisión del 2026-07-09 en `version2` (retirar el azul, añadir `--ember-cta`) — ¿está viva, o quedó superada por la del 2026-09-10? | **Bloqueante.** Es H1. Decide si el sistema tiene uno o dos acentos y si existe un segundo naranja. |
| **P3** | ¿`uploads/` es el directorio de despliegue real, o el sitio se publica desde otro repo y esta copia es un espejo? | Bloqueante para H2: si es espejo, el fix es distinto (sincronizar) que si es la fuente (mover). |
| **P4** | El sello de snapshot, ¿aplica también a documentación (`Manual de Marca`, `Guía de Uso`, `Inventario`) y a las copias distribuidas (`_ds/`, `design_handoff_*`)? | Define el alcance de H7 y H8: 4 archivos o ~25. |
| **P5** | ¿El contrato de tokens se queda en color + tipografía, o admite radios y duraciones (que ya reaparecieron en el manual y en las piezas)? | H13. Determina si el manual se corrige o si el canónico crece. |
| **P6** | ¿`ui_kits/portfolio` (React) sigue vivo como superficie, o quedó reemplazado por los sitios en HTML plano? | Decide si vale la pena una capa de componente (H10) y si el linter de React tiene sentido (H12). |
| **P7** | ¿Quién consume `_ds/` y `design_handoff_azul_medianoche/`? ¿Se regeneran en cada release o son entregas puntuales? | H8: define si se sincronizan o se sellan como inmutables. |
| **P8** | ¿Hay Figma con variables, o el CSS es el único origen? | Cambia el alcance real del plan de migración. |
| **P9** | ¿Alguien ejecuta `_adherence.oxlintrc.json` en algún momento? | Si no se corre, la inversión va al checklist manual (H12 opción b). |
| **P10** | ¿La firma de correo v2 existe fuera de este repo? | El manifest sigue publicando la v1 archivada como card vigente (H, doc). |

---

## 9. Quick wins *(1-2 semanas · riesgo bajo)*

| # | Acción | Hallazgo | Coste |
|---|---|---|---|
| Q1 | Corregir 12.2:1 → **6.53:1** en las tres apariciones del README, y 2.78 → 2.91 en `--light-accent` | H5 | 🟢 |
| Q2 | `#fff` → `var(--bg)` en `uploads/index.html:131` y `:180` (cierra el único fallo AA duro) | H4 | 🟢 |
| Q3 | Tres valores de paleta a v2.3 en `uploads/index.html:60-66` | H3 | 🟢 |
| Q4 | Sello de snapshot en `Tarjeta de Presentación.html:12`, `Portada LinkedIn.html:12`, `Manual de Marca.html:13` y las 11 piezas restantes sin sellar | H7 | 🟢 |
| Q5 | Regenerar `_ds/…/v2-tokens.css` desde el canónico y sellar `design_handoff_azul_medianoche/v2-tokens.css` con su fecha | H8 | 🟢 |
| Q6 | Registrar `--ember-cta` en el linter **o** eliminarlo del código (según P2) | H1/H12 | 🟢 |
| Q7 | Favicon a un asset existente en las dos superficies | H15 | 🟢 |
| Q8 | Ejecutar P8 de la corrida anterior: duplicados de `assets/` a `archive/` | H14 | 🟢 |

## 10. Refactor seguro *(4-8 semanas)*

| # | Acción | Hallazgo | Coste |
|---|---|---|---|
| R1 | Resolver P1/P2/P3: declarar el sitio de producción, moverlo fuera de `uploads/`, archivar el otro con sello | H1, H2, H9 | 🟠 |
| R2 | Aplicar D-A en el sitio de producción: Ember solo en eyebrow y CTA; cifras a `--t1`, tags y pasos a `--t3`, barras a `--border` | H6 | 🟡 |
| R3 | `components.css` mínimo (`.btn`, `.chip`, `.label-*`, `.metric`, `.card`, `disabled`), importado desde `styles.css`, adoptado primero por el sitio de producción | H10, H11 | 🟡 |
| R4 | `:focus-visible` y `prefers-reduced-motion` en las superficies web, con el mismo patrón de `ui_kits/portfolio/styles.css:145-151` | H (a11y) | 🟢 |
| R5 | Sustituir el linter de React por chequeo de CSS/HTML (hex crudo · `font-weight` fuera de contrato · `:root` sin sello) o retirarlo y pasar a QA manual documentado | H12 | 🟡 |
| R6 | Alinear el manual al contrato (o ampliar el contrato) y limpiar los alias deprecados de `Manual de Marca.html` | H13 | 🟡 |

## 11. Tokens propuestos *(sujeto a P2 y P5 — nada se renombra ni se elimina)*

```css
/* v2.4 — propuesta. Aditiva: ningún archivo existente deja de resolver. */
:root {
  /* Consistencia de jerarquía: bg-stage tiene alias pero no raw (H, tokens 2.1) */
  --color-bg-stage: #06030F;
  --bg-stage: var(--color-bg-stage);

  /* SOLO si P2 resuelve que el segundo naranja se queda. Si no, este bloque no existe. */
  /* --ember-cta: #BF452B;  ← hoy sin declarar en el contrato y presente en version2:65 */
}
```

**Muestrario de revisión — texto sobre Ember `#FF5C39`** (para decidir P2 con los números reales a la vista):

| Combinación | Contraste real | AA texto <18.66px bold / <24px | Estado en el sistema |
|---|---|---|---|
| `#0A0612` tinta sobre Ember | **6.53:1** | ✅ pasa | Regla 11 vigente. El manual publica 12.2:1 — incorrecto (H5) |
| `#FAF8FC` off-white sobre Ember | 3.32:1 | ❌ no pasa | prohibido por la regla 11 |
| `#fff` blanco sobre Ember | 3.07:1 | ❌ no pasa | en producción en `uploads/index.html:131, :180` (H4) |
| `#fff` sobre `--ember-cta #BF452B` | 5.06:1 | ✅ pasa | existe en `version2:65`; el changelog v2.3 lo declara retirado (H1) |
| Ember sobre `#0A0612` (outline) | 6.53:1 | ✅ pasa | alternativa de botón sin segundo naranja |

*(Muestrario de revisión, no asset de producción. La generación de piezas finales no la hace este skill.)*

## 12. Matrices

### Debt Matrix

| Hallazgo | Prioridad |
|---|---|
| H1 Dos decisiones incompatibles | Alta |
| H2 Producción dentro de `uploads/` | Alta |
| H4 Contraste 3.07:1 en CTA | Alta |
| H3 Paleta pre-v2.2 en el sitio | Alta |
| H8 Copia distribuida atrasada | Alta |
| H9 Excepción sin consumidor | Alta |
| H7 Changelog declarativo | Alta |
| H5 Cifra de contraste incorrecta | Media |
| H6 Regla 1 en el sitio | Media |
| H10 Sin capa de componente | Media |
| H11 `disabled` inexistente | Media |
| H12 Linter fuera de objetivo | Media |
| H13 Tokens dimensionales en el manual | Media |
| H14 Duplicados de assets | Baja |
| H15 Favicon inexistente | Baja |

### Risk Matrix

| Cambio | Impacto | Probabilidad de romper algo | Mitigación |
|---|---|---|---|
| Mover el sitio de producción fuera de `uploads/` | Alto | Media — rutas relativas de assets y del favicon | Inventariar rutas relativas antes de mover; abrir el archivo movido y revisar consola |
| Retirar `--ember-cta` | Medio | Media — si `version2` es producción, cambia el color de todos sus botones | Resolver P1/P2 primero; aplicar tinta sobre Ember en el mismo commit |
| Aplicar D-A en el sitio (Ember sale de 8 roles) | Alto (percepción) | Baja (técnico) | Comparación visual antes/después sección por sección; es la decisión ya tomada, no una nueva |
| Tres valores de paleta en el sitio | Alto | Baja | Revisar los bordes y el texto terciario en las 9 secciones |
| Regenerar `_ds/…/v2-tokens.css` | Medio | Baja | La copia es aditiva respecto a la vieja; ningún token desaparece |
| Introducir `components.css` | Medio | Media — colisión de nombres con las clases ya escritas en 3 superficies | Adoptarlo en una sola superficie primero; prefijo si hay colisión |
| Sustituir el linter | Bajo | Baja | Correrlo en modo aviso una semana antes de bloquear merges |

### Migration Cost

🟢 Q1-Q8, R4 · 🟡 R2, R3, R5, R6 · 🟠 R1 · 🔴 ninguna

## 13. Plan de migración

**Fase 1 — Compatibilidad (semana 1).** Q1-Q8. Ningún cambio de comportamiento salvo el fix AA. Se responde P1/P2/P3 antes de terminar la semana; sin eso, la fase 2 no arranca.
**Fase 2 — Adopción (semanas 2-6).** R1 primero (declarar y mover el sitio de producción, archivar el otro con sello). Luego R2 y R4 sobre esa superficie, y R3 adoptado únicamente ahí. Documentación y código en el mismo commit.
**Fase 3 — Deprecación (semanas 7-8).** R5 y R6. Retirar de la tabla de excepciones lo que quedó sin consumidor. Marcar los alias `--*-light` como retirados en v3.0. Regenerar la copia distribuida como paso del release, con sello.

## 14. Checklist de QA visual antes de merge

- [ ] La pieza importa `v2-tokens.css`, o declara `:root` con `/* snapshot vX.Y — AAAA-MM-DD */` en la primera línea
- [ ] Cero hex literales fuera del bloque de tokens (`grep -nE '#[0-9A-Fa-f]{3,8}'`)
- [ ] Cero `font-weight` fuera de {300, 400, 500, 700}; Plus Jakarta Sans sin `0,800` en la URL de fuentes
- [ ] Display >48px en peso 300 (regla 10)
- [ ] Todo texto sobre `--ember` en tinta `#0A0612` (6.53:1); nunca blanco ni `--t1`
- [ ] Ember solo en eyebrow/label de sección y CTA (regla 1); cualquier otro uso, con entrada en la tabla de excepciones, fechada y firmada
- [ ] Un solo naranja en el archivo
- [ ] Todo control interactivo con `:focus-visible` (outline Ember 2px, offset 2px)
- [ ] Todo estado activo con un indicador que no sea solo color
- [ ] La pieza hereda o declara `prefers-reduced-motion`
- [ ] Toda ruta de asset resuelve (sin 404 en consola), incluido el favicon
- [ ] La pieza no vive en `uploads/`, `_workspace/` ni `screenshots/`
- [ ] README, `Inventario de Assets`, `_ds_manifest.json` y la copia `_ds/` actualizados en el mismo commit
- [ ] El changelog distingue "decidido" de "ejecutado", con las dos fechas

---

*Reporte generado por el skill design-system-auditor · segunda corrida independiente · 2026-09-10*


---

# Corrección de alcance · 2026-09-10 (posterior al reporte)

**Respuestas registradas**

| # | Respuesta de Diego |
|---|---|
| P1 | **Ninguno de los dos.** Producción de `diegomaury.mx` es el build de Astro (`src/pages/index.astro`) que Cloudflare Pages construye y despliega desde `master` en cada push. No hay ningún `index.html` estático servido en producción. |
| P1b | En el repo del sitio **no existen** `uploads/index.html` ni `ui_kits/version2/index.html` ni sus carpetas. Los estáticos de raíz que sí existieron (`index.html`, `version2/`) se eliminaron el **2026-08-13** como código muerto: `astro build` nunca los incluyó en `dist/`. Regla del proyecto: **no recrearlos**. |
| P2 | **El Azul Medianoche se elimina** del sistema. |
| P3 | No aplica: `uploads/` no existe en el repo del sitio. |
| P4 | Ejecución vía handoff para Claude Code. |
| P5 | Antes de ejecutar, muestrarios y prototipos. |

**Qué significa para esta auditoría.** Los archivos que audité como "superficies web" (`uploads/index.html`, `ui_kits/version2/index.html`, `ui_kits/portfolio/*`, `design_handoff_azul_medianoche/*`) viven en el proyecto de **assets de marca** (`019dd0ff…`), no en el repo del sitio. Son copias de trabajo y artefactos muertos, no producción. Los hallazgos H2, H3, H4, H6 y la mitad de H1 describen código que ya no se sirve.

Esto **no** es un error de lectura: cada línea citada existe donde dije que existe. Es un error de **alcance**, y su causa raíz es del sistema, no mía: ningún archivo del proyecto declara si es canónico, copia de trabajo o artefacto retirado. La regla del sello (`snapshot vX.Y — fecha`) resuelve exactamente esto para los valores; falta la equivalente para el **estado** del archivo.

## H16 — Ningún archivo declara su estado ni su alcance **[NUEVA CAUSA RAÍZ]**

- **Evidencia:** el proyecto contiene, sin distinción visible, el sistema canónico (`v2-tokens.css`, `styles.css`, README), piezas vigentes (Deck, poster, Quote Cards, Footer, papelería), dos sitios completos que ya no existen en producción (`uploads/index.html` 1087 líneas, `ui_kits/version2/index.html` 1448 líneas), un kit React (`ui_kits/portfolio/`) y dos copias congeladas de tokens (`_ds/`, `design_handoff_azul_medianoche/`). `_ds_manifest.json` publica 20 cards sin ningún campo de estado. El README no declara qué es este proyecto respecto al repo del sitio.
- **Estado:** ❌ Incumple · **Severidad:** Critical (gobernanza)
- **Recomendación:** primera línea obligatoria en cada archivo, junto al sello de valores: `estado: canónico | vigente | copia de trabajo | retirado — AAAA-MM-DD`. Y una línea en el README que diga qué NO es este proyecto: no es el repo del sitio; el sitio es Astro y se despliega desde `master`.
- **Nota:** el borrador *Brand System 3.0* ya hace esto (`Estado: Borrador` en la primera línea). El documento en construcción tiene mejor higiene de vigencia que el sistema en producción — observación que ya estaba registrada en la corrida anterior y que esta confusión confirma.

## H17 — Artefactos muertos conservados sin marcar

- **Evidencia:** los dos sitios y `design_handoff_azul_medianoche/` (con su propia copia de `v2-tokens.css` congelada en pre-v2.3) siguen en el proyecto ocho meses después de que sus equivalentes se borraran del repo del sitio (2026-08-13).
- **Estado:** ❌ Incumple · **Severidad:** High
- **Recomendación:** mover a `archive/` con `estado: retirado — 2026-08-13`. No borrar: son el registro de decisiones que sí se tomaron (incluida la del azul del 9 de julio).

## Reclasificación de hallazgos

| Hallazgo | Estado anterior | Ahora |
|---|---|---|
| H1 Dos decisiones incompatibles | Critical | **Resuelto por decisión:** el azul se elimina. La contradicción desaparece con el token. Queda como registro histórico en `archive/`. |
| H2 Producción dentro de `uploads/` | Critical | **Anulado.** No era producción. Se reemplaza por H16/H17. |
| H3 Paleta pre-v2.2 en el sitio | High | **Anulado como producción** → Info: artefacto muerto, se archiva sin corregir. |
| H4 Contraste 3.07:1 (`#fff` sobre Ember) | High | **Anulado como producción** → la regla 11 sigue vigente para el sistema; no hay fallo AA vivo detectado en el proyecto de marca. |
| H6 Regla 1 incumplida en el sitio | High | **Anulado como producción** → Info. Las piezas vigentes sí cumplen. |
| H5 Cifra de contraste incorrecta (12.2:1 → 6.53:1) | Medium | **Se mantiene.** Está en el manual canónico. |
| H7 Changelog declarativo | High | **Se mantiene y se agrava:** el changelog v2.3 describe cambios "en el sitio" que no aplican a ningún sitio vivo. |
| H8 Copia distribuida atrasada | High | **Se mantiene.** `_ds/` sigue sirviendo pre-v2.3. |
| H9 Excepción sin consumidor | High | **Resuelto por decisión** (el azul se elimina). |
| H10-H15 | — | Sin cambio, salvo H12: el linter de React sí tiene un objetivo real (`ui_kits/portfolio/app.jsx`), pero ese kit también es artefacto. |

## DSMS recalculado (las 6 categorías)

| Categoría | Antes | Ahora | Por qué se mueve |
|---|---|---|---|
| Arquitectura de tokens | 9+3=12/20 | **14/20** | `--ember-cta` vivía en un archivo muerto: deja de ser deriva del contrato. Las fuentes paralelas reales bajan de 5 a 3 (canónico + 2 copias congeladas). |
| Consistencia visual | 7/20 | **17/20** | Las violaciones de paleta, de la regla 1 y del peso 800 estaban todas en artefactos muertos. Las 7 piezas vigentes muestreadas cumplen. Resta el `#9A8CB0` de `_ds/`. |
| Accesibilidad | 10/20 | **15/20** | El único fallo AA duro (3.07:1) no está en producción. Se mantienen: cifra documentada incorrecta, estados que dependen solo de color, y foco visible verificado en una sola superficie. |
| Componentes y patrones | 8/15 | **8/15** | Sin cambio: sigue sin capa de componente, y el kit que la insinuaba es artefacto. |
| Documentación | 9/15 | **9/15** | Sin cambio numérico, pero cambia el motivo principal: el problema no es solo el inventario desalineado, es que el proyecto no declara su propio alcance (H16). |
| Gobernanza | 4/10 | **4/10** | Se resuelven H1 y H9 por decisión, pero entran H16 (Critical) y H17 (High). Empata. |

**DSMS = 14 + 17 + 15 + 8 + 9 + 4 = 67 / 100 → Establecido** (banda 51-70).

**Confidence Score = 33 / 50 = 66%** (baja desde 82%). El sistema sube y la confianza baja por la misma razón: lo que auditué como superficie viva no lo era, y la superficie viva real — el repo Astro de `diegomaury.mx` — **no es accesible desde aquí**. Todo el bloque de consumo real (cómo se aplican los tokens en `src/pages/index.astro`, si el sitio importa el token store, qué pesos tipográficos carga) queda ⬜ **No evaluable** hasta que ese repo se conecte.

## Lo que procede, corregido

1. **Fase 1 sobre el proyecto de marca** (lo único auditado con evidencia): corregir la cifra 12.2:1 → 6.53:1, eliminar el azul, sellar las piezas sin sello, regenerar `_ds/`, archivar artefactos muertos con `estado: retirado`, y añadir la línea de alcance al README.
2. **Auditar el repo real.** Conectar el repo Astro y auditar `src/pages/index.astro` y sus estilos: es la única superficie viva del sistema y nunca ha sido auditada.
3. **No recrear estáticos.** Regla del proyecto, registrada aquí para que ninguna corrida futura vuelva a proponerlo.

*Corrección de alcance registrada 2026-09-10. El reporte de arriba se conserva sin editar: su evidencia es válida, su alcance no lo era.*
