# Revisión 3 — Análisis de layout frame por frame (2026-08-31)

Análisis **solo lectura** de los 8 HTML actuales (`compositions/frames/*.html`) contra el
feedback de Revisión 3 y el benchmark espacial `frame-04-at-31s.png`.
**Ningún HTML fue modificado.** Este documento alimenta el pase de edición P0 → P1.

Fuentes revisadas: los 7 archivos de `compositions/frames/`, `STORYBOARD.md`, `frame.md`,
`REVISION3-NOTES.md`, y los 11 fotogramas renderizados en `renders/qa-rev3-final/*.jpg`.

---

## 0. Mapa de numeración (inconsistencia estructural #1 — leer primero)

El feedback numera **10 frames (0–9)**. El proyecto tiene **8 beats en 7 archivos**.
Toda referencia del feedback debe traducirse así:

| Feedback | Archivo del proyecto | Beat | Texto |
|---|---|---|---|
| Frame 0 — Hook | `01-protagonista.html` | único | "DIEGOMAURY.MX no es una página. Es Notion." |
| Frame 1 — Antes/Ahora | `02-contraste.html` | beat 1 (0.0–2.8s local) | "Antes / Código → Deploy / Ahora / Notion → Publicar" |
| Frame 2 — Editar → aparece | `02-contraste.html` | beat 2 (3.1–7.5s local) | "Lo que edito aquí, aparece aquí." |
| Frame 3 — CMS personalizado | `04-cms-editorial.html` | único | "No es una página común. Es mi CMS personalizado." |
| Frame 4 — Publicar tiene reglas | `05-reglas-accion.html` | único | "Publicar tiene reglas." |
| Frame 5 — Solo edito | `06-se-publica-solo.html` | beats 1–2 | "Solo edito. Guardo. Y listo." |
| Frame 6 — Sitio actualizado | `06-se-publica-solo.html` | beat 3 | "El sitio se actualiza automáticamente." |
| Frame 7 — Insight | `07-cristalizacion.html` | beat 1 (tesis) | "Notion no documenta mi sitio. Lo administra." |
| Frame 8 — Payoff | `07-cristalizacion.html` | beat 2 (cierre) | "Notion es mi CMS." |
| Frame 9 — Brand close | `08-cierre-marca.html` | único | logo vertical (PNG horneado) |

**Consecuencia práctica:** los feedbacks de Frame 1/2 se resuelven **dentro de un solo
archivo** (`02-contraste.html`), y los de Frame 5/6 **dentro de otro** (`06-se-publica-solo.html`).
No hay archivos nuevos que crear.

**Copy:** el texto de los 10 frames del feedback coincide 1:1 con lo que ya está en los HTML.
**Este pase no toca una sola palabra de copy** — es 100 % layout / composición / motion.

---

## 1. Benchmark: qué establece `frame-04-at-31s.png`

Medido sobre el PNG de 1080×1920:

| Zona | Rango vertical | % | Contenido |
|---|---|---|---|
| Aire superior | 0 – ~555px | 0–29 % | vacío (sin lockup visible en ese still) |
| Headline | ~555 – ~700px | 29–37 % | 2 líneas, eje izquierdo, peso 300–700 |
| Gap | ~700 – ~740px | 37–39 % | respiro corto headline→cluster |
| Cluster | ~740 – ~1260px | 39–66 % | 3 tarjetas apiladas, misma anchura/eje/gap |
| Respiración | ~1260 – 1920px | 66–100 % | **un solo** pozo de vacío, intencional |

Reglas que se leen del benchmark:
1. **Un solo pozo de espacio negativo**, abajo. No dos.
2. Headline y cluster **pegados** (gap ~40px), como una sola unidad.
3. El headline **no** vive a 11 % de altura: baja a ~29–38 %.
4. El cluster ocupa el tercio central-bajo, no "flota" en la mitad superior.
5. Anchura, eje y gap del cluster: idénticos entre piezas.

El feedback traduce esto a: **0–15 % header · 20–38 % headline · 38–70 % contenido · 70–100 % respiración.**

---

## 2. Diagnóstico transversal (afecta a varios frames)

| # | Hallazgo | Frames | Severidad |
|---|---|---|---|
| T1 | **Headline clavado a `top: 220px` (~11 %)**, muy por encima de la zona 20–38 % del benchmark. Deja un hueco muerto entre headline y contenido. | F1, F4, F5, F6 (04/05/06 + 01) | Alta |
| T2 | **Dos pozos de vacío** por frame (headline↔cluster y bajo-cluster) en vez de uno solo abajo. | F4, F5, F6 | Alta |
| T3 | **Mitad inferior del lienzo vacía** (>600px de negro sin función) mientras la superior está saturada. "Amontonado arriba / vacío abajo". | F5, F6 (peor), F2-beat2, F4 | Alta |
| T4 | **Sobrecarga de elementos** frente a la "una idea dominante" del feedback: F5 lleva 7 elementos temporizados, F6 lleva ~11. El feedback pide 3 zonas por frame. | F5, F6 | Media |
| T5 | Lockup (isotipo + regla hairline) a `top: 100px` en F1–F7: correcto y "ligero", pero es **otro elemento compitiendo** en el borde superior justo cuando el headline también sube. Al reordenar por zonas, el lockup se queda donde está (0–15 %); el headline es el que baja. | todos salvo F8 | Nota |
| T6 | Eje de alineación: headlines a `4.2cqw` de forma consistente ✓. Excepción: **F2 beat 1 está centrado** (`align-items: center`), rompe el eje editorial del resto. | F2 | Baja |
| T7 | **Tipografía sentence case**: correctamente aplicada en todo salvo `DIEGOMAURY.MX` ✓. No hay violaciones. Las mayúsculas dentro de screenshots (HEINEKEN, ABRIR) son UI real, aceptable. | — | OK |
| T8 | Motion: `06` define `setActiveStation()` y **nunca la llama** (código muerto); las transiciones del ember-bar están inline. Limpiar al re-animar. | F6 | Baja |

---

## 3. Frame por frame

### F1 · `01-protagonista.html` — Hook (feedback Frame 0)

**Estado (render f-2.7s):**
- Lockup `top:100px` · headline `top:220px` (2 líneas, termina ~380px) · panel `top:560px`, alto 860px (termina ~1420px) · badge Notion dentro del panel · chip "diegomaury.mx" `bottom:200px` (~1640px).

| Elemento | Diagnóstico |
|---|---|
| Layout | Aire arriba casi nulo (headline a 11 %). Gap headline→panel = 180px (aceptable pero justo). El panel + badge + chip + el texto fantasma "…o Maury" del screenshot llenan la mitad inferior; el chip queda aislado a 1640px con ~80px de aire debajo. Distribución: **header–headline pegados / cluster grande / chip suelto**. Falta separar headline del panel (feedback: "no pegar la captura al titular"). |
| Posición | **Bug real:** `object-position: top` sobre un screenshot 16:9 dentro de un panel casi cuadrado (860px alto) → el borde izquierdo del sitio se recorta y aparece bleedeando fuera de foco a la izquierda; el nav "…RY / Sobre mí / Portafolio" arranca cortado. Se ve amateur. |
| Densidad | Mitad superior: 2 elementos. Mitad inferior: panel + badge + chip + fantasma de texto. Desbalance moderado. |
| Alineación | Headline y lockup a `4.2cqw` ✓. Panel a `5cqw` (rompe eje a propósito — OK, es screenshot). Chip centrado. |
| Jerarquía | Domina el headline (bien). El panel es demostración secundaria (bien). El badge de Notion compite poco. |
| Tipografía | `DIEGOMAURY.MX` uppercase vía `.f01-headline-unit` ✓. Resto sentence case ✓. **Caret de tecleo (`|`) queda visible pegado a "…MX"** en el still — el yoyo de opacidad no garantiza que termine en 0. |
| Contenido | Conservar: headline, panel con video real, badge Notion, chip. Reubicar: bajar el headline / abrir aire headline↔panel; recomponer el crop del screenshot para que no sangre; asegurar caret→0. |
| Motion readiness | Tecleo de `DIEGOMAURY.MX` → per-word "no es una página. Es Notion." → asienta panel → badge → chip + pulso del anillo ember. El feedback lo valida ("DIEGOMAURY.MX → no es una página. → Es Notion. → entra el sitio"). **Falta:** garantizar `set(caret, {opacity:0})` al cierre; considerar que el panel entre **después** de un beat de respiro, no encimado al último word. |
| vs benchmark | Lejos en el eje del headline (11 % vs 29–37 %). El panel puede quedarse grande pero necesita margen real arriba. |

---

### F2 · `02-contraste.html` — Antes/Ahora + El espejo (feedback Frames 1 y 2)

Dos beats en un archivo. Se analizan por separado.

#### Beat 1 — Antes/Ahora (feedback Frame 1)

**Estado:** `.f02-contrast` a `top:720px`, columna centrada, dos filas (`Antes` + bloque / `Ahora` + bloque) con `gap:56px`. Se desvanece a los 2.8s.

| Elemento | Diagnóstico |
|---|---|
| Layout | Ambos estados apilados y **centrados horizontalmente** — el feedback los acepta apilados pero pide "cada estado su propia zona" con espacio entre ellos (gap 56px es escaso para "zonas"). Vertical: arranca a 720px (~37 %), sin headline propio (el frame no tiene título, solo las etiquetas Antes/Ahora). |
| Posición | Centrado rompe el eje editorial `4.2cqw` del resto del reel (T6). |
| Densidad | Compacto, casi lista comprimida — es justo lo que el feedback marca ("evitar que parezca una lista comprimida"). |
| Jerarquía | El bloque de código (`Código → Deploy` / `Notion → Publicar`) domina, bien. "Notion" en ember, bien (único acento). |
| Contenido | Conservar la comparación. Reubicar: dar a cada fila su banda; considerar alinear a la izquierda al eje común; la transición a "Ahora" debe **sentirse más rápida** (ya lo hace: `ease power3.out` 0.3s vs 0.45s — reforzar). |
| Motion readiness | `Antes` entra (0.45s) → `Ahora` entra más firme (0.3s) → todo hace fade-out a 2.8s → handoff a beat 2. El feedback pide percepción de "menos fricción" en el salto a Ahora — subir el contraste de velocidad/ease. |

#### Beat 2 — El espejo (feedback Frame 2)

**Estado (render f-11s):** texto "Lo que edito aquí," `top:210px` · C2 (ficha HEINEKEN) `top:320px` 840×441 · línea coral · C3 (ficha publicada) `top:811px` 840×441 · "aparece aquí." `top:1276px`. Todo termina ~1400px → **~520px de negro abajo (27 %)**.

| Elemento | Diagnóstico |
|---|---|
| Layout | Mejor que F5/F6 pero aún con un pozo inferior de 27 %. La estructura **headline → captura → captura → texto** es correcta en concepto; falta ritmo vertical (los dos screenshots quedan con solo ~50px de separación real, muy juntos para leerse como "fuente" vs "resultado"). |
| Posición | Frames a `left:120px`, 840px de ancho — no llegan al eje `4.2cqw` ni son full-bleed; quedan en tierra de nadie. El feedback pide capturas "reconocibles, no legibles" → conviene recorte/escala más agresivo y ancho consistente. |
| Densidad | Dos fichas Notion densísimas, ninguna legible, ambas compitiendo. El ojo no sabe qué mirar. |
| Alineación | Texto a `4.2cqw`, frames a 120px — **desalineados entre sí** (inconsistencia #2). |
| Jerarquía | Los `.f02-highlight` (`edito` / `aparece` en caja `bg-2` + hairline) **parecen selección de texto accidental**, no un recurso de diseño. Restarles peso o rediseñarlos. |
| Contenido | Conservar: las dos capturas + la línea de correspondencia (único acento ember del beat). Reubicar: repartir verticalmente headline → C2 → (aire) → C3 → texto en las 4 zonas; subir contenido para cerrar el pozo inferior. |
| Motion readiness | C2 entra → cursor barre C2 (`f02-edit-cue`, steps(9)) → C3 entra → texto → línea se autodibuja. Cadena causal editar→aparecer→conectar **ya implementada y correcta** (es lo que pidió Revisión 3). Mantener; solo recomponer posiciones. |
| vs benchmark | El pozo inferior contradice "un solo pozo, arriba y abajo balanceados". |

---

### F3 · `04-cms-editorial.html` — CMS personalizado (feedback Frame 3)

**Estado (render f-15.5s):** header 2 líneas `top:220px` (termina ~410px) · grid 2×2: celdas 460×421 en `(60,520) (560,520) (60,1051) (560,1051)`, cada una con su tag+flecha debajo · grid termina ~1470px → **~450px de negro abajo (23 %)**.

| Elemento | Diagnóstico |
|---|---|
| Layout | **El más cercano al benchmark.** Header con aire, grid como unidad, respiración abajo. Fallos: (a) header a 11 % (T1) en vez de ~25 %; (b) gap header→grid = 110px, demasiado (el `REVISION3-NOTES` ya anota "eje header ~45px vs celdas 60px, 15px de desfase" — inconsistencia #3, real); (c) pozo inferior de 23 %. |
| Posición | Celdas a `left:60px` / `560px`; header a `4.2cqw` (~45px). Desfase de 15px entre el eje del header y el de la columna izquierda del grid. Alinear ambos al mismo valor. |
| Densidad | 4 screenshots + 4 tags. Denso pero organizado — el feedback lo aprueba como "frame de más información". Correcto que sea así. |
| Alineación | Grid 2×2 con gutter ~40px H, ~130px V — el gutter vertical es casi 3× el horizontal; igualar para que lea como retícula. |
| Jerarquía | "CMS" en ember (único acento) ✓. Los 4 tags (`Casos`/`Copy`/`Métricas`/`Imágenes`) en caja `bg-2` leen bien como etiqueta. |
| Contenido | Conservar las 4 fuentes tal cual. Reubicar: bajar header ~120px, subir grid ~60px, cerrar el gap header→grid a ~40–60px, igualar gutters del grid, alinear eje header = eje columna izquierda. |
| Motion readiness | Header per-word → 4 celdas en cascada 0.3s (`back.out(1.4)`). El feedback pide "cascada" ✓. Al recomponer, mantener el stagger; el jitter sutil del hold está bien. |
| vs benchmark | A un ajuste de ~120px (bajar header) + cierre de gaps de cumplir el benchmark casi exacto. **Es el patrón a replicar en los demás.** |

---

### F4 · `05-reglas-accion.html` — Publicar tiene reglas (feedback Frame 4)

**Estado (render f-21s):** headline `top:220px` · chips `Publicado ✓` / `Publicable ✓` `top:352px` · panel-video del checkbox `left:190 top:440` 700×394 · anillo ember · chip-consecuencia `sin evidencia → no compila` `top:852px` · evidencia C9 `left:160 top:924` 760×428 · línea de código `top:1370px`. **Todo en el 72 % superior; ~530px de negro abajo, más un mid-void visible en el still (~840→920px vacío).**

| Elemento | Diagnóstico |
|---|---|
| Layout | Segundo peor. Headline a 11 % (T1). El bloque headline+chips+checkbox ocupa 220→834px, luego respiro, luego consecuencia+C9 924→1352, luego código a 1370, luego 550px de negro. **Dos pozos** (T2) + inferior grande (T3). |
| Posición | El panel-video (`left:190`) y C9 (`left:160`) y el código (`4.2cqw`) tienen **tres ejes distintos**. Inconsistencia #4. |
| Densidad | **7 elementos temporizados** para "una idea dominante" (T4). El feedback Frame 4 pide conservar solo: headline + `Publicado ✓ Publicable ✓` + la captura, con jerarquía **headline → condiciones → screenshot**. El chip `sin evidencia → no compila` y la evidencia C9 (build failure) son material extra al brief del feedback → decidir si se conservan como cuarta zona comprimida o se recortan. |
| Alineación | Chips a `4.2cqw` ✓; resto disperso. Unificar a 2 ejes máximo (texto/UI a `4.2cqw`, screenshots full-width consistente). |
| Jerarquía | El anillo ember sobre el checkbox = único acento ✓. Pero el ojo rebota entre checkbox-video, C9 y el código — no hay un "mira esto primero" claro tras el headline. |
| Contenido | Conservar: headline, 2 chips de estado, video del checkbox marcándose, línea `draft = NOT (...)`. A decidir con Diego: chip-consecuencia + C9. Reubicar todo a 4 zonas (header / headline / chips / screenshot-evidencia) cerrando ambos pozos. |
| Motion readiness | headline per-word → chips aterrizan → panel se revela al arrancar el gesto → gesto termina, still + pulso de anillo → consecuencia + C9 → código se teclea con caret. El feedback valida la secuencia `Publicado → Publicable → ambas válidas → publicación/build`. Mantener; recomponer posiciones y comprimir la sección evidencia. **El caret del código debe terminar en opacity 0** (mismo riesgo que F1). |
| vs benchmark | Lejos. Necesita el tratamiento de F3. |

---

### F5 · `06-se-publica-solo.html` — Solo edito (feedback Frame 5) + Sitio actualizado (feedback Frame 6)

**Estado (renders f-27s y f-31s):** headline `top:220px` · 4 filas de estación en `top: 410 / 555 / 700 / 905` (alto 130px → **gap real de solo 15px entre filas**, la 4ª salta 205px por los chips) · línea conectora vertical · chips `3 de 4 fuentes / Astro / Cloudflare` `top:840px` (se **enciman con la fila 4** a 905px) · closing headline "El sitio se actualiza automáticamente." `top:1050px` (**pegado al cluster, sin aire**) · evidence-row (`~2 min` + C10) `top:1205px`. **Todo termina ~1290px → 630px de negro (33 %).**

| Elemento | Diagnóstico |
|---|---|
| Layout | **El peor del reel.** Pipeline de 4 estaciones comprimido en 625px (410→1035) cuando el feedback pide explícitamente "usar la verticalidad del frame". Closing headline sin separación del sistema (feedback Frame 6: "la conclusión debe quedar claramente separada del sistema"). Pozo inferior de 33 %. |
| Posición | Chips a `top:840` chocando con fila 4 a `top:905` — **solapamiento real** (inconsistencia #5, bug). |
| Densidad | ~11 elementos: 4 filas + línea + 3 chips + headline + closing + chip-tiempo + C10. Contra "una idea dominante". Los chips `3 de 4 fuentes / Astro / Cloudflare` y C10 son extras al brief del feedback. |
| Alineación | Filas y headline a `4.2cqw` ✓. La línea conectora a `x=540` (centro) mientras las filas son full-width con el lockup a la izquierda — la línea no "sale" de ningún nodo visible, cuelga en el aire (feedback: "la línea vertical conecta el sistema" → debe nacer y morir en los nodos). |
| Jerarquía | ember-bar en la estación activa, una a la vez ✓ (buen recurso). Pero con 4 filas idénticas apiladas a 15px, el ojo las lee como un bloque, no como pasos. |
| Contenido | Conservar: las 4 estaciones (Notion → Webhook firmado → Build → Sitio actualizado), la línea, el headline de apertura y el de cierre. A decidir: chips de alcance + C10. Reubicar: **espaciar las 4 estaciones a lo largo de 38–70 %** con gap real (≥40px), separar el closing headline con un bloque de aire claro (feedback Frame 6), un solo pozo abajo. |
| Motion readiness | 3 beats: (1) headline + Notion + Webhook, ember-bar en Webhook; (2) Build entra, ember-bar salta a Build, chips; (3) Sitio actualizado, ember-bar salta, closing per-word, C10. El feedback pide `Notion ↓ Webhook ↓ Build ↓ Sitio actualizado ↓ [conclusión separada]`. La secuencia ya es esa; el problema es puramente espacial. **Limpiar `setActiveStation()` muerta (T8).** La línea debe autodibujarse de nodo a nodo, no sobre un eje central fantasma. |
| vs benchmark | Muy lejos. Es el que más trabajo de recomposición necesita. |

---

### F7 · `07-cristalizacion.html` — Insight (feedback Frame 7) + Payoff (feedback Frame 8)

#### Beat 1 — Tesis (feedback Frame 7)

**Estado (render f-35s):** tesis "Notion no documenta mi sitio. Lo administra." `top:700px` (2 líneas, ~700–870px, ~37–45 %). Lockup arriba. **Todo lo demás vacío.**

| Elemento | Diagnóstico |
|---|---|
| Layout | **Ya es casi exactamente lo que pide el feedback**: "header ↓ mucho aire ↓ headline ↓ mucho aire. Sin capturas ni elementos secundarios. Pausa conceptual." Cumple. |
| Posición | Tesis ligeramente por encima del centro. El feedback lo permite. Se podría centrar verticalmente de forma más deliberada (bajar ~120px a ~48 %). |
| Densidad | Mínima, correcta. |
| Jerarquía | Una sola frase, peso 700, sin acento ember (bien — el ember se reserva para el payoff). |
| Contenido | Conservar tal cual. Único ajuste opcional: centrar la tesis con más intención y alargar el hold antes del handoff (Revisión 3 ya subió el hold a ~1.7s). |
| Motion readiness | per-word reveal → hold ~1.7s → scale-swap a payoff. Correcto. |
| vs benchmark | Cumple el espíritu ("respiración") — este frame **no** debe parecerse a `frame-04` (ese es para frames de contenido). |

#### Beat 2 — Payoff (feedback Frame 8)

**Estado (render f-37s):** "Notion es mi CMS." `top:760px` ("CMS." en ember) · sub "Contenido, reglas y publicación desde un solo lugar." `top:900px` · CTA `comenta CMS` `top:1230px` · fondo del sitio real atenuado.

| Elemento | Diagnóstico |
|---|---|
| Layout | Headline → sub → (aire) → CTA. Estructura correcta según feedback Frame 8 ("headline ↓ espacio ↓ subheadline"). Pozo inferior grande pero aceptable para un frame de cierre. |
| Posición | Headline a ~40 %, sub a ~47 %, CTA a ~64 %. Razonable. |
| Densidad | Baja, correcta ("no debe introducir información nueva"). |
| Jerarquía | `CMS.` en ember = único acento ✓. |
| Contenido | Conservar. **Revisar el fondo:** en f-37 el screenshot atenuado deja ver logos (techstars, Platzi) y texto fantasma que "ensucia" — el feedback pide "background muy sutil". Subir la atenuación (el `f07-site-dim` arranca en 0.9 pero baja a 0.32 en `Scene 4`; a 0.32 se ve demasiado). Llevar a ~0.15–0.20 de imagen visible, o difuminar más. |
| Motion readiness | site-img sube a 0.32 → title fade → sub fade → CTA. Movimiento mínimo, correcto. Ajustar solo la opacidad final del fondo. |

---

### F8 · `08-cierre-marca.html` — Brand close (feedback Frame 9)

**Estado (render f-40.5s):** logo vertical PNG (isotipo + "DIEGO MAURY" + "Strategic Program Director" + "HAGAMOS QUE LAS COSAS PASEN"), 760px de ancho, centrado (`top:50%` translate).

| Elemento | Diagnóstico |
|---|---|
| Layout | Centrado — el feedback **aprueba** composición centrada para el brand close ("aquí sí funciona mejor la composición centrada"). |
| Posición | El `translate(-50%,-50%)` sobre `.f08-logo-wrap` centra la **caja**, pero el peso visual del PNG (isotipo arriba, tagline abajo) queda ~2–3 % por debajo del centro óptico. Nudge opcional de ~40–60px hacia arriba. |
| Densidad | Mínima, correcta. |
| Tipografía | Todo el texto va horneado en el PNG. `DIEGO MAURY` y `HAGAMOS QUE LAS COSAS PASEN` en mayúsculas dentro del logo — es **el logo oficial**, no texto tipografiado por HyperFrames, así que la regla "sentence case salvo DIEGOMAURY.MX" no aplica (es un asset de marca, precedente equivalente al glifo de Notion). No tocar. |
| Contenido | Conservar. |
| Motion readiness | scale+fade in (0.6s) → hold → fade out (0.5s). El feedback pide "payoff → pausa → logo → nombre → cargo → tagline → fade out". Como el logo es un PNG único, no se puede escalonar nombre/cargo/tagline por separado sin sustituirlo por texto en vivo. **Decisión para Diego:** (a) dejar el PNG con su fade simple (más seguro, respeta el asset), o (b) reconstruir el lockup con texto en vivo + isotipo SVG para poder escalonar la revelación como pide el feedback. Recomendado (a) salvo que Diego quiera el escalonado. |

---

## 4. Inconsistencias encontradas (consolidado)

| # | Inconsistencia | Dónde | Acción |
|---|---|---|---|
| 1 | Numeración feedback (0–9) ≠ archivos (7) | global | Usar el mapa de §0 en todo el pase |
| 2 | Texto a `4.2cqw` vs frames a `left:120px` sin alinear | `02` beat 2 | Unificar eje |
| 3 | Eje header (~45px) vs celdas grid (60px), 15px de desfase | `04` | Igualar (ya anotado en REVISION3-NOTES) |
| 4 | Tres ejes distintos: video `left:190`, C9 `left:160`, código `4.2cqw` | `05` | Reducir a 2 ejes |
| 5 | Chips `top:840` se solapan con fila 4 `top:905` | `06` | Bug de posición — reordenar |
| 6 | `setActiveStation()` definida y nunca llamada | `06` | Borrar código muerto |
| 7 | Línea conectora en eje central `x=540` sin nodo de origen/destino visible | `06` | Redibujar de nodo a nodo |
| 8 | Caret de tecleo puede quedar visible (opacity no forzada a 0) | `01`, `05` | `set(caret,{opacity:0})` al cierre |
| 9 | `object-position:top` recorta y sangra el screenshot del sitio | `01` | Recomponer crop/tamaño del panel |
| 10 | Fondo del sitio a 0.32 de opacidad deja ver logos/texto ("no sutil") | `07` beat 2 | Bajar a ~0.15–0.20 |

Ninguna inconsistencia de **copy** — el texto coincide 1:1 con el feedback.

---

## 5. Orden de implementación P0 → P1

### P0 — Recomposición espacial (obligatorio, define el pase)

1. **`04-cms-editorial.html` primero** — es el más cercano al benchmark; se convierte en la
   plantilla de zonas (header 0–15 % / headline 20–38 % / cluster 38–70 % / respiración 70–100 %).
   Ajustes: bajar header ~120px, subir grid ~60px, cerrar gap header→grid a ~40–60px,
   igualar gutters del grid, alinear eje header = columna izquierda del grid.
2. **`05-reglas-accion.html`** — aplicar las 4 zonas. Bajar headline. Agrupar
   headline→chips→screenshot como un cluster continuo. Colapsar la sección evidencia
   (C9 + código + chip-consecuencia) en una sola banda comprimida **o** recortarla
   (decisión Diego, ver §3-F4). Un solo pozo abajo. Unificar a 2 ejes.
3. **`06-se-publica-solo.html`** — el de más trabajo. Repartir las 4 estaciones a lo largo
   de 38–70 % con gap real ≥40px. Separar el closing headline del sistema con una banda
   de aire explícita. Resolver el solapamiento chips↔fila 4. Redibujar la línea de nodo a
   nodo. Borrar `setActiveStation()`. Decidir chips de alcance + C10.
4. **`01-protagonista.html`** — abrir aire headline↔panel (bajar headline o subir el margen).
   Corregir el crop del screenshot para que no sangre a la izquierda. Forzar caret→0.
5. **`02-contraste.html`** — beat 1: alinear al eje izquierdo, reforzar el contraste de
   velocidad Antes→Ahora. beat 2: repartir headline→C2→(aire)→C3→texto en 4 zonas, subir
   contenido para cerrar el pozo inferior, unificar anchura/eje de los dos frames,
   rediseñar los `.f02-highlight` para que no parezcan selección accidental.
6. **`07-cristalizacion.html`** — beat 1 (tesis): opcionalmente centrar con más intención;
   ya cumple. beat 2 (payoff): bajar la opacidad del fondo a ~0.15–0.20.
7. **`08-cierre-marca.html`** — nudge del logo ~40–60px hacia arriba. Motion escalonado
   solo si Diego lo pide (requiere reconstruir el lockup con texto en vivo).
8. **Verificar** sentence case intacto (solo `DIEGOMAURY.MX` en mayúsculas) tras mover todo.
9. **Pipeline causal legible** — confirmar que en `02` beat 2, `05` y `06` la cadena
   editar → validar → transformar → publicar se lee en el orden espacial además del temporal.

### P1 — Refinamiento

10. Igualar gutters, radios y ritmos de spacing entre `04`, `05`, `06` para que lean como
    un sistema (mismo gap de cluster, misma anchura de card, mismo eje).
11. Separación headline/condiciones/screenshot en `05` con jerarquía tipográfica clara
    (tamaño/peso/posición, no caja).
12. `06`: la línea vertical como conector real autodibujado entre nodos.
13. **Sound design funcional** (`hyperframes-audio`): el sistema de SFX ya existe pero son
    tonos sintetizados sin loudness-match (REVISION3-NOTES: transiente a −0.8 dB). Mapear
    click=editar · confirm=validar · trigger=webhook · pulse=build · success=resultado ·
    fade=cierre, con niveles emparejados. No estética "hacker".
14. Micro-timing: garantizar el respiro headline→cluster (~0.2–0.3s) antes de que entre
    el contenido en cada frame de contenido.

### P2 — No hacer (del feedback)

- No añadir texto, screenshots, módulos, diagramas ni labels nuevos.
- No añadir elementos para llenar huecos.
- No seguir iterando el concepto ni el copy.

---

## 6. Criterio de aprobación por frame (checklist para el post-render)

Cada frame debe pasar las 5 preguntas del feedback:

| Frame | ¿1 idea dominante? | ¿Headline con aire propio? | ¿Contenido agrupado? | ¿Espacio negativo intencional (uno solo)? | ¿El ojo sabe qué mirar primero? |
|---|---|---|---|---|---|
| F1 | ⚠ (panel+badge+chip) | ✖ pegado | ⚠ | ✖ dos pozos | ✓ headline |
| F2 b1 | ✓ | n/a | ⚠ compacto | ⚠ | ✓ |
| F2 b2 | ✖ dos capturas compiten | ⚠ | ⚠ ritmo pobre | ✖ pozo inferior | ✖ |
| F3 | ✓ | ⚠ muy arriba | ✓ | ⚠ pozo 23 % | ✓ CMS |
| F4 | ✖ 7 elementos | ✖ | ✖ | ✖ dos pozos | ✖ |
| F5 | ✖ ~11 elementos | ✖ | ✖ comprimido | ✖ pozo 33 % | ✖ |
| F6 | ✖ | ✖ pegado al sistema | ✖ | ✖ | ⚠ |
| F7 | ✓ | ✓ | n/a | ✓ | ✓ |
| F8 | ✓ | ✓ | n/a | ⚠ | ✓ |
| F9 | ✓ | n/a | n/a | ✓ | ✓ |

**F7, F8 (tesis/payoff) y F9 (brand) están esencialmente aprobados.**
**F1, F2-b2, F4, F5, F6 requieren recomposición P0.**
**F3 requiere solo ajuste fino.**

---

## 7. Pase de recomposición ejecutado (2026-08-31, revisión 4)

Render: `renders/video-cms-notion-revision4.mp4` (4.9 MB · 41.5s · h264+aac).
`npm run check`: 0 errores (lint/runtime/motion), layout 0 issues, contraste 42/42 AA.
QA: `renders/qa-rev4/` (frames + `contact-sheet.jpg`).

### Cambios aplicados por archivo

| Archivo | Cambios |
|---|---|
| `04-cms-editorial.html` (F3) | header `220→360`; celdas `460×421 → 440×400`, grid simétrico en `(80,580)/(560,580)/(80,1074)/(560,1074)`. |
| `05-reglas-accion.html` (F4) | headline `220→400`; chips `352→590`; captura checkbox `440→700`; **eliminados** el chip `sin evidencia → no compila` + la captura C9 (build fallido) + sus tweens; línea de código `1370→1200`; `tl.set(caret, opacity:0)` al cierre. |
| `06-se-publica-solo.html` (F5+F6) | headline `220→360`; 4 estaciones a `540/700/860/1020` (gap real 30px, antes 15px); conector redibujado `M 93 670 L 93 1020` (nace/muere en los nodos, antes eje central fantasma); chips `840→1180` (fin del solapamiento con la fila 4); conclusión `1050→1300` (separada del sistema); evidencia `1205→1520`; **eliminada** `setActiveStation()` (código muerto). |
| `01-protagonista.html` (F1) | headline `220→400`; panel `560→660`, alto `860→720`; video `object-position: top → center top`; badge `bottom 540→560`; chip `bottom 200→460`; `tl.set(caret, opacity:0)` tras el blink (el yoyo terminaba en 1 — caret residual visible). |
| `02-contraste.html` (F2) | beat 1: `align-items center→flex-start`, eje `4.2cqw`, gap `56→88`, "Ahora" entra más firme (`0.3s power3 → 0.24s power4`). beat 2: texto-top `210→380`, texto-bottom `1276→1440`, frames `left 120→90 / w 840→900 / h 441→400`, frame-top `320→560`, frame-bottom `811→1010`, línea `M 300 960 L 300 1010`, edit-cue reposicionado; `.f02-highlight` sin borde (ya no parece selección). |
| `07-cristalizacion.html` (F7) | tesis `700→820`; payoff title `760→820`, sub `900→980`, CTA `1230→1160`; fondo del sitio `opacity 0.32 → 0.10` (ya no se colaban logos/texto fantasma). |
| `08-cierre-marca.html` (F9) | lockup `top 50% → 47%` (centro óptico). |

**Copy:** sin cambios (coincidía 1:1 con el feedback).

### Ajustes finales (2026-09-01, tras revisión de Diego)

Render final: `renders/video-cms-notion-revision4.mp4` (5.0 MB · 41.5s). QA: `renders/qa-rev4/`.

| Archivo | Ajuste |
|---|---|
| `01-protagonista.html` | video del sitio `object-position: center top → left top` — el video es 1886×1178 en un panel de 972px; con `left top` el borde izquierdo del sitio alinea con el panel y el recorte cae solo en el contenido final (derecha), nunca a media palabra. Nav completo legible. |
| `02-contraste.html` | `.f02-edit-cue` (cursor de edición) de `rgba(26,17,40,0.55)` (oscuro, se perdía sobre la captura) → `rgba(250,248,252,0.12)` + I-beam blanco 3px + radius: lee como selección de texto activa y guía el ojo. C3 ("aparece aquí") entra +0.15s más tarde (4.4→4.55) para que el gesto del cursor se complete antes del resultado — causalidad más limpia. |

### Verificado en el render final

- **F1 crop:** nav del sitio completo y legible; recorte solo en el borde derecho (cinturón de logos) — lee como sitio real, no como clip accidental.
- **Conector del pipeline (F5):** la línea coral aparece en los espacios entre estaciones, alineada a la columna de íconos (x≈93); se lee saliendo del pie de cada nodo y entrando al siguiente. Entre Build→Sitio actualizado el ember-bar de la estación activa toma el relevo.
- **Cursor/highlights (F2 espejo):** el barrido claro sobre la ficha HEINEKEN es visible y dirige la atención al campo editado; el highlight de "edito"/"aparece" lee como recurso gráfico.

### Pendientes que quedaron abiertos (no bloquean, decisión de Diego)

1. **F4/reglas** — respiración inferior ~43% (benchmark ~34%), resultado deliberado del recorte de C9. Diego lo consideró aprobable tal cual; se puede equilibrar en un pase futuro agrandando la captura o bajando el cluster.
2. **F2-b1** — el bloque Antes/Ahora flota algo centrado (beat de 2.8s sin headline propio). Aprobado tal cual.

### P1 pendiente (siguiente fase, no ejecutado)

- Sound design con loudness-match (SFX actuales son tonos sintetizados sin emparejar, transiente a −0.8 dB) — `/hyperframes-audio`.
- Igualar gutters/radios entre `04`/`05`/`06` como sistema.
- CLI pin `hyperframes@0.8.8` está 14 parches atrás de `0.8.22` — bump opcional; se dejó en 0.8.8 para que la QA reflejara solo los cambios de layout.

### Registro pendiente (tras aprobación de Diego)

- STORYBOARD.md: nota de que C9 (build fallido) se retiró de F5 en revisión 4 (D-04 lo mencionaba).
- Notion: Inbox → Changelog → Tarea (Portafolio D) por el pase de recomposición espacial.

### P1 pendiente (no ejecutado en este pase)

- Sound design con loudness-match (los SFX actuales son tonos sin emparejar, transiente a −0.8 dB) — `/hyperframes-audio`.
- Igualar gutters/radios entre `04`/`05`/`06` como sistema.
- CLI pin `hyperframes@0.8.8` está 14 parches atrás de `0.8.22` — bump opcional, se dejó en 0.8.8 para que la QA refleje solo los cambios de layout.
