---
format: 1080x1920
duration: 41.5s
message: "Notion no documenta mi sitio. Lo administra."
arc: protagonista → contraste/espejo (fusionado) → cms editorial → reglas → automatización → cristalización → cierre de marca
audience: Notion Community (técnica)
mode: autonomous
music: none, pero SFX sí — D-01 revocada 2026-08-31: sistema sonoro mínimo (click / confirm / trigger / build-pulse / success / fade), sin BGM ni voz
---

## Estado vigente (2026-09-01, revisión 4 — recomposición espacial)

Este documento describe el video final tal como existe en `index.html` y `compositions/frames/`, y tal como quedó renderizado en `renders/video-cms-notion-revision4.mp4` (layout aprobado por el usuario 2026-09-01). Es **8 frames en 7 archivos** — `02-contraste.html` contiene dos beats (contraste + espejo) en un solo archivo; no existe `03-el-espejo.html` como archivo separado.

**Pase de recomposición espacial (revisión 4, 2026-09-01):** informe de dirección de producción de Diego contra el benchmark `video-explainer-output-2026-08-21-cms-notion/composition/snapshots/frame-04-at-31s.png`. Se rebajaron todos los headlines de contenido de `top:220px` (~11%) a `top:360–400px` (zona 20–38%), se agruparon los clusters bajo el headline y se consolidó el espacio negativo en un solo pozo al final de cada frame. Detalle campo por campo: `renders/REVISION3-LAYOUT-ANALYSIS.md` §7. **Ningún cambio de copy ni de timing narrativo**, salvo el recorte de C9 en F5 (ver D-04 y sección F5). El siguiente pase (P1) es motion / timing / sound design, no layout.

### Historial de revisiones previas

Cambios acumulados sobre la primera versión (`faceless-explainer`, 6 escenas invented/faceless con datos parcialmente inventados), todos confirmados por el usuario:

- **F1 rediseñado con video real:** `assets/video/c1-site-scroll.mp4` (grabación de pantalla del sitio diegomaury.mx en vivo, 5.37s fuente) reemplaza la grabación de edición del checkbox — panel más grande (860px alto vs 580px) mostrando el sitio real, no Notion. Copy: "diegomaury.mx" (tecleo) → "no es una página. Es Notion." ("Notion." como acento ember). Logo oficial de Notion (glifo 3D + wordmark, recoloreado a blanco) como badge sobre la esquina del panel. Duración: 5.5s.
- **F2 (Contraste) + F3 (El espejo) fusionados en `02-contraste.html`**, a pedido del usuario, para eliminar el espacio muerto que dejaba el contraste ANTES/AHORA solo. El archivo `03-el-espejo.html` fue eliminado del proyecto; `index.html` nunca lo referencia. Beat 1 (0.0–2.8s local): ANTES/AHORA compacto y centrado, con handoff a fade-out. Beat 2 (3.1–7.5s local): el espejo (split C2/C3 + línea coral autodibujada) reemplaza al contraste en el mismo frame, sin escena aparte. Duración combinada: 7.5s.
- **F4 texto principal:** "No es una página común. Es mi CMS personalizado." (acento ember en "CMS").
- **F6 headline:** "Solo edito. Guardo. Y listo." (peso 700).
- **F8 — Cierre de marca** (`08-cierre-marca.html`, nueva): el logo vertical completo del usuario (`public/brand/logo-vertical-tagline-dark.png` — isotipo + "DIEGO MAURY" + "Strategic Program Director" + "HAGAMOS QUE LAS COSAS PASEN") entra centrado como cierre final del video, después de F7. Duración: 3.0s. Sin texto adicional, sin acento ember propio (la marca es el remate).
- **Barra de cadena eliminada de los 7 frames** (ver sección dedicada abajo) — ningún frame la lleva en la versión final.
- **Timing global final:** F1 0.0–5.5 · F2(fusión, contraste+espejo) 5.5–13.0 · F4 13.0–18.0 · F5 18.0–24.0 · F6 24.0–32.0 · F7 32.0–38.5 · F8 38.5–41.5. Total: **41.5s**.

## Video direction

Fuente canónica original: minuta "🎬 Guion y storyboard · Reel 'CMS con Notion'" (Notion, `3bbcfa1602fd41a692a82dc9dfab277f`), verificada con el usuario el 2026-08-22 y luego revisada escena por escena + fusionada el 2026-08-23 (ver sección "Estado vigente" arriba, que tiene prioridad sobre la minuta donde difieran). Decisiones cerradas con el usuario:

- **D-01 audio**: ~~silencio total~~ **REVOCADA 2026-08-31** (revisión de producción de Diego, §14). Ahora: sistema sonoro mínimo de SFX — `key-tick` (edición), `confirm-soft` (validación), `lock-in` (trigger/webhook), `build-pulse` (proceso), `success-soft` (sitio actualizado), `close-fade` (cierre). Sin BGM, sin voz. `assets/music/bgm.mp3` sigue sin usar. SFX embebidos como `<audio>` por frame en `compositions/frames/*.html`.
- **Regla tipográfica 2026-08-31 (Diego)**: sin ALL CAPS salvo `DIEGOMAURY.MX`. Headlines y labels en sentence case, peso 700 para display, jerarquía por tamaño/peso/tracking/posición. Grid editorial: headlines de frame al mismo eje izquierdo (`4.2cqw`, ~220px). Detalle en `frame.md`.
- **D-02 tesis en F7**: "Notion no documenta mi sitio. Lo administra." va también escrita en pantalla (no solo implícita).
- **D-03 cifra de inventario**: queda fuera de pantalla en F2/espejo y en todo el video.
- **D-04 shot list**: las 10 capturas (C1-C10) las generó el usuario y viven en `assets/Screenshots_Video_CMS/`, copiadas a `assets/video/` (C1, C8) y `assets/img/cms-video/` (C2-C7, C9, C10) para esta autoría. C1 fue reemplazado en la revisión del 2026-08-23 por `c1-site-scroll.mp4` (ver F1 arriba). **C9 (build fallido de Cloudflare Pages) se RETIRÓ de F5 en la revisión 4 (2026-09-01):** introducía una segunda narrativa (manejo de errores del pipeline) innecesaria para la tesis del frame ("existen reglas"). El archivo `assets/img/cms-video/c9-build-failure.png` sigue en el repo pero ya no se referencia en ninguna composición. Las demás capturas no cambiaron.

**Palette / type / motifs**: se conserva el mismo DS real "Ember on Ink" documentado en `frame.md` — Deep Ink `#0A0612` como ground, `#1A1128` como única superficie elevada (hairline `#6A291B`; en este video específico se admite además `box-shadow: elevated` + `radius-lg` como excepción v2-parity documentada en `frame.md`, ver esa nota), texto `t1/t2/t3`, `#FF5C39` como el único acento ember por frame (F8 es la excepción: cierre de marca sin acento ember propio). Plus Jakarta Sans para todo texto de lectura, DM Mono uppercase 0.16em para labels/kickers/chips, DM Mono no-upper para el literal de código.

**Regla de oro del guion** (de la minuta): una idea por frame, un solo verbo de la cadena por frame, Notion en pantalla y legible desde el fotograma 1.

**Ajuste de fidelidad al DS (Adapt deliberado)**: la minuta pedía un "Kicker mono: ✱ NOTION CMS" en F1. El DS real de este proyecto prohíbe explícitamente marcas ✱ inventadas (`frame.md`, negative list). Se omitió el glifo ✱; el kicker semántico quedó cubierto por el glifo real de Notion en pantalla.

**Barra de cadena — ELIMINADA del video completo (2026-08-23, a pedido explícito del usuario vía revisión escena por escena).** La barra de cinco verbos fijos (`edito · marco · guardo · valida · publica`) que en la minuta original acompañaba F3-F7 se retiró de los 7 frames en la versión final. F4 absorbió parte de esa función en su headline reescrito ("Es mi CMS personalizado."); F2(espejo), F5, F6 y F7 no llevan ningún sustituto — el frame respira sin ese chrome inferior. **No reintroducir la barra de cadena en ningún frame sin decisión explícita nueva** — confirmado en el código: ningún archivo de `compositions/frames/*.html` contiene las clases o el texto de esa barra.

**Lockup de marca en todos los frames:** el isotipo real (`isotipo-ember.svg`, inline SVG) + una regla hairline horizontal — el mismo tratamiento construido primero en F1 — se replica en F2, F4, F5, F6 y F7, siempre en la misma posición (top:100px, esquina superior izquierda, ancho completo hasta el margen derecho). F8 no lo lleva (el cierre de marca es solo el logo vertical completo). El isotipo no cuenta contra el acento ember único de cada frame (mismo precedente que el logo del nav/footer del sitio real).

**Mapa de acento ember único por frame:**

| Frame | Archivo | Acento ember |
|---|---|---|
| F1 | `01-protagonista.html` | anillo hairline ember que pulsa una vez alrededor del panel del sitio real, sincronizado con el freeze-hold del video C1 |
| F2 (beat 1, contraste) | `02-contraste.html` | la palabra "Notion" dentro del bloque AHORA (`Notion → Publicar`) |
| F2 (beat 2, espejo) | `02-contraste.html` | la línea de correspondencia (SVG self-draw) entre C2 (arriba) y C3 (abajo) |
| F4 | `04-cms-editorial.html` | la palabra "CMS" en el header |
| F5 | `05-reglas-accion.html` | anillo hairline ember que pulsa una vez sobre el checkbox en el instante del gesto de marcado (C8) |
| F6 | `06-se-publica-solo.html` | el ember-bar-top de la estación activa — nunca dos estaciones lo llevan a la vez |
| F7 | `07-cristalizacion.html` | la palabra "CMS" en "Notion es mi CMS." |
| F8 | `08-cierre-marca.html` | ninguno — cierre de marca puro, sin acento adicional sobre el logo |

**Timing exacto** (suma 41.5s, coincide con `index.html`):

| Frame | Archivo | Inicio | Fin | Duración |
|---|---|---|---|---|
| F1 — Protagonista | `01-protagonista.html` | 0.0 | 5.5 | 5.5s |
| F2 — Contraste + El espejo (fusionado) | `02-contraste.html` | 5.5 | 13.0 | 7.5s |
| F4 — CMS editorial | `04-cms-editorial.html` | 13.0 | 18.0 | 5.0s |
| F5 — Reglas y acción | `05-reglas-accion.html` | 18.0 | 24.0 | 6.0s |
| F6 — Se publica solo | `06-se-publica-solo.html` | 24.0 | 32.0 | 8.0s |
| F7 — Cristalización | `07-cristalizacion.html` | 32.0 | 38.5 | 6.5s |
| F8 — Cierre de marca | `08-cierre-marca.html` | 38.5 | 41.5 | 3.0s |

No existe "F3" como número de frame independiente en la versión final — el contenido de "El espejo" vive como el beat 2 de F2. Se conserva el nombre "El espejo" únicamente como referencia narrativa al beat, no como archivo o número de escena propio.

## Frame 1 — Protagonista

- scene: Lockup de marca (isotipo real + regla hairline) → wordmark "diegomaury.mx" (tecleo) → "no es una página. Es Notion." (per-word, "Notion." en ember) → panel card-hairline con el video real del sitio (C1, `c1-site-scroll.mp4`) → badge del logo oficial de Notion sobre la esquina del panel → chip de búsqueda "diegomaury.mx".
- voiceover: ""
- duration: 5.5s
- transition_in: cut
- status: final
- src: compositions/frames/01-protagonista.html
- verbatim: "diegomaury.mx" (wordmark) / "no es una página. Es Notion." / "Notion" (glifo + wordmark del logo oficial, no solo la palabra)
- chips: chip mono "diegomaury.mx" con ícono de búsqueda
- asset: assets/video/c1-site-scroll.mp4 (grabación de pantalla en vivo del sitio, 5.37s fuente) + freeze-hold del último fotograma para el resto del frame

narrativeRole: Es la prueba de apertura — no una afirmación, una grabación real del sitio diegomaury.mx corriendo dentro del panel. Establece que el protagonista es el sistema funcionando, no una animación ilustrativa; el panel es un card-hairline real del DS, nunca un mockup de hardware inventado.

Scene 1 (0.05–0.40s): lockup de marca (isotipo-ember.svg real + regla hairline) entra por la izquierda.
Scene 2 (0.30–0.78s): titular "diegomaury.mx" (wordmark, peso 500, centrado) entra con animación de tecleo — caracter por caracter con caret parpadeante, no fade.
Scene 3 (~0.85–1.9s): "no es una página. Es Notion." entra con per-word staggered reveal — "Notion." lleva el acento ember.
Scene 4 (1.9–2.35s): el panel (card-hairline real: bg-2, hairline border, radius-lg, elevated v2-parity) se asienta.
Scene 5 (2.0–5.5s): el video del sitio real corre dentro del panel; el runtime cede al still de freeze/hold para el resto del frame — el still ES el último fotograma capturado, sin crossfade manual.
Scene 6 (2.2–2.55s): badge del logo real de Notion (glifo + wordmark) entra sobre la esquina del panel.
Scene 7 (2.35–2.70s): chip "diegomaury.mx" con ícono de búsqueda se asienta; el anillo hairline ember pulsa una vez alrededor del panel, sincronizado con la ventana de freeze — el único acento ember del frame (el isotipo de marca no cuenta contra el presupuesto, precedente del sitio real).

## Frame 2 — Contraste + El espejo (fusionado)

- scene: Dos beats en un solo archivo (`02-contraste.html`), sin espacio muerto entre ellos. Beat 1: ANTES/AHORA compacto y centrado (dos filas apiladas). Beat 2: el mismo frame se reutiliza para el split C2 (Notion, ficha HEINEKEN) arriba / C3 (esa misma tarjeta publicada en el sitio) abajo, unidas por una línea coral que se autodibuja del campo editado al texto publicado.
- voiceover: ""
- duration: 7.5s
- transition_in: crossfade
- status: final
- src: compositions/frames/02-contraste.html
- verbatim beat 1, fila ANTES (0.1–2.8s local): etiqueta "ANTES" · bloque "Código → Deploy"
- verbatim beat 1, fila AHORA (1.0–2.8s local): etiqueta "AHORA" · bloque "Notion → Publicar" ("Notion" en ember)
- verbatim beat 2 (3.1–7.5s local): "Lo que edito aquí," (arriba, con "edito" resaltado en `bg-2`+hairline, no ember) / "aparece aquí." (abajo, con "aparece" resaltado igual)
- asset: assets/img/cms-video/c2-notion-heineken.png (arriba) · assets/img/cms-video/c3-sitio-heineken.png (abajo)

narrativeRole: Explica el cambio de flujo sin criticar el desarrollo tradicional, y de inmediato prueba que Notion controla el sitio — el mismo string, no un parecido. El antes se apaga por fade, nunca se tacha. La fusión elimina el hueco visual que dejaba el contraste solo antes de la revisión del 2026-08-23; ambos beats comparten lockup de marca y frame, sin transición dura entre ellos.

Scene 0 (0.05–0.40s): lockup de marca (isotipo real + regla hairline) entra por la izquierda.
Scene 1 — beat 1 (0.1–1.0s): fila ANTES entra — etiqueta mono "ANTES" + bloque `card-hairline` "Código → Deploy".
Scene 2 — beat 1 (1.0–2.8s): fila AHORA entra debajo — etiqueta "AHORA" + bloque "Notion → Publicar", "Notion" con el acento ember del beat; ambas filas se sostienen juntas brevemente.
Scene 3 — handoff (2.8–3.1s): el bloque de contraste completo se desvanece (fade-out), sin escena de transición aparte.
Scene 4 — beat 2 (3.1–3.85s): la mitad superior revela C2 (recorte a ancho de canvas), con "Lo que edito aquí," entrando encima.
Scene 5 — beat 2 (3.9–4.7s): la mitad inferior revela C3, mismo ancho exacto, con "aparece aquí." aterrizando debajo.
Scene 6 — beat 2 (4.7–5.3s): la línea de correspondencia se autodibuja (SVG self-draw) del campo editado en C2 al texto publicado en C3 — el único acento ember de este beat.
Scene 7 — beat 2 (5.3–7.5s hold): se sostiene el split completo con la línea trazada.

## Frame 4 — CMS editorial

- scene: Grilla 2x2, cuatro pares de fuente-en-Notion → parte-del-sitio sobre las capturas reales (C4-C7), entrando en cascada.
- voiceover: ""
- duration: 5s
- transition_in: cut
- status: final
- src: compositions/frames/04-cms-editorial.html
- verbatim header: "No es una página común. Es mi CMS personalizado." (acento ember en "CMS") · Par 1: "Casos → Portfolio" · Par 2: "Copy → Home" · Par 3: "Métricas → cifras" · Par 4: "Imágenes → assets" — el nombre de cada base de datos (Casos, Copy, Métricas, Imágenes) va dentro de un tag/chip propio, no como texto mono plano
- asset: assets/img/cms-video/c4-ssot-rows.png · c5-copy-oficial.png · c6-metricas.png · c7-cms-imagenes.png

narrativeRole: Explica el alcance del CMS sin inventario técnico — cada par dice qué parte del sitio controla cada fuente, sin nombrar las bases de Notion por su nombre interno. Sin barra de cadena.

Scene 0 (0.05–0.40s): lockup de marca (isotipo real + regla hairline) entra, igual que F1.
Scene 1 (0.05–1.15s): el header entra con per-word staggered reveal — "CMS" lleva el único acento ember del frame.
Scenes 2–5 (1.5–3.2s): los 4 pares se ensamblan sobre C4/C5/C6/C7 en cascada de 0.3s (Casos→Portfolio, Copy→Home, Métricas→cifras, Imágenes→assets), completando la grilla.
Scene 6 (3.2–5.0s hold): la grilla completa se sostiene quieta; subtle jitter como único movimiento.

## Frame 5 — Reglas y acción

- scene: "Publicar tiene reglas." + chips reales de Notion (Publicado ✓ · Publicable ✓) + el checkbox pasando de vacío a marcado (C8, grabación real) + el literal booleano como sello de rigor. **Revisión 4 (2026-09-01): se retiraron el chip `sin evidencia → no compila` y la captura C9 (build fallido)** — una sola idea dominante por frame.
- voiceover: ""
- duration: 6s
- transition_in: cut
- status: final
- src: compositions/frames/05-reglas-accion.html
- verbatim: "Publicar tiene reglas." · chips "Publicado ✓" / "Publicable ✓" · pie mono `draft = NOT (Publicado AND Publicable)`
- asset: assets/video/c8-checkbox-toggle.mp4 (freeze-hold en el último fotograma)

narrativeRole: La gobernanza se muestra, no se declama — el clímax es el checkbox grabado marcándose de verdad. La consecuencia del build detenido (C9) se retiró en la revisión 4: era una segunda narrativa (manejo de errores) que competía con "existen reglas". Sin barra de cadena.

Scene 0 (0.05–0.40s): lockup de marca (isotipo real + regla hairline) entra, igual que F1.
Scene 1 (0.0–1.2s): "Publicar tiene reglas." entra con per-word staggered reveal, tercio superior.
Scene 2 (1.2–2.4s): los chips "Publicado ✓" y "Publicable ✓" aterrizan debajo, sobre `card-hairline`.
Scene 3 (2.4s): el panel de video se revela justo cuando arranca el gesto del checkbox (C8).
Scene 4 (~3.6s): el gesto termina y el runtime cede al still de freeze-hold (checkbox marcado); el anillo hairline ember pulsa una vez sobre el checkbox — el único acento ember del frame.
Scene 5 (4.3–5.3s): el pie mono `draft = NOT (Publicado AND Publicable)` se tipea con caret en la franja inferior del safe area — nunca ocupa el centro del frame. (El chip "sin evidencia → no compila" y C9 se retiraron en revisión 4.)
Scene 6 (5.3–6.0s hold): todo el frame se sostiene con subtle jitter.

## Frame 6 — Se publica solo

- scene: Cadena vertical de tres estaciones activas (`NOTION → WEBHOOK FIRMADO → BUILD → SITIO ACTUALIZADO`), revelada en tres beats, terminando en el resultado con evidencia real (C10, lista de deploys de Cloudflare).
- voiceover: ""
- duration: 8s
- transition_in: crossfade
- status: final
- src: compositions/frames/06-se-publica-solo.html
- verbatim beat 1 (0.0–2.5s local): "Solo edito. Guardo. Y listo." — entran NOTION y WEBHOOK FIRMADO
- verbatim beat 2 (2.5–5.5s local): entra BUILD — chips "3 de 4 fuentes" · "Astro" · "Cloudflare"
- verbatim beat 3 (5.5–8.0s local): entra SITIO ACTUALIZADO — "El sitio se actualiza automáticamente." — chip "~2 min"
- asset: assets/img/cms-video/c10-deploys-list.png (beat 3)

narrativeRole: Revela la automatización sin exagerar su alcance — 3 de 4 fuentes, nunca "todo Notion". Astro aparece una sola vez, después del clímax, en tamaño de chrome, sin nodo propio. Headline y cierre en peso 700. Sin barra de cadena.

Scene 0 (0.05–0.40s): lockup de marca (isotipo real + regla hairline) entra, igual que F1.
Beat 1 (0.0–2.5s): "Solo edito. Guardo. Y listo." entra con per-word staggered reveal, tercio superior; estaciones NOTION y WEBHOOK FIRMADO se asientan (NOTION usa `notion-icon.svg` real como su lockup), conectadas por una línea que se autodibuja; el ember-bar-top marca WEBHOOK FIRMADO como la estación activa.
Beat 2 (2.5–5.5s): estación BUILD entra — el ember-bar pasa de WEBHOOK FIRMADO a BUILD (nunca ambas a la vez); los chips "3 de 4 fuentes" · "Astro" · "Cloudflare" aparecen en tamaño de chrome debajo, sin nodo propio para Astro.
Beat 3 (5.5–8.0s): estación SITIO ACTUALIZADO entra (el ember-bar pasa a esta estación); "El sitio se actualiza automáticamente." aterriza debajo; C10 entra como panel de evidencia junto al chip "~2 min"; todo se sostiene con subtle jitter, sin más pan.

## Frame 7 — Cristalización

- scene: La tesis se escribe primero, luego handoff a la card de cierre con el sitio funcionando de fondo.
- voiceover: ""
- duration: 6.5s
- transition_in: crossfade
- status: final
- src: compositions/frames/07-cristalizacion.html
- verbatim tesis: "Notion no documenta mi sitio. Lo administra." (D-02: también escrita en pantalla)
- verbatim cierre línea 1: "Notion es mi CMS." · línea 2: "Contenido, reglas y publicación desde un solo lugar."
- asset: public/site-real-diegomaury-mx.jpg (fondo atenuado a ~10% en revisión 4, "el sitio funcionando al lado" como textura, no como contenido)

narrativeRole: Fija la idea completa en una sola cristalización — la tesis del video, seguida del resumen. La marca real cierra en F8 aparte, no dentro de este frame. Tesis y cierre en peso 700. Sin barra de cadena. **El chip CTA "comenta CMS" se retiró en la revisión 4 (2026-09-01): la pieza se trata como portfolio/case study, no como reel social con call-to-comment.**

Scene 0 (0.05–0.40s): lockup de marca (isotipo real + regla hairline) entra, igual que F1.
Scene 1 (0.0–1.0s): campo bg puro, sin fondo del sitio todavía.
Scene 2 (0.2–2.2s): la tesis "Notion no documenta mi sitio. Lo administra." entra con per-word staggered reveal, centrada.
Scene 3 (2.2–2.8s): la tesis se sostiene brevemente, luego hace handoff (scale-swap) hacia la card de cierre.
Scene 4 (2.8–3.8s): "Notion es mi CMS." entra — "CMS" lleva el único acento ember del frame; el fondo real del sitio (`site-real-diegomaury-mx.jpg`) se asienta atenuado (~30%) detrás.
Scene 5 (3.8–4.8s): "Contenido, reglas y publicación desde un solo lugar." aterriza debajo.
Scene 6 (4.8–6.5s hold): todo se sostiene quieto salvo subtle jitter — handoff hacia F8. (El chip CTA "comenta CMS" se retiró en revisión 4.)

## Frame 8 — Cierre de marca

- scene: El logo vertical completo del usuario entra centrado sobre fondo puro (bg), como remate final del video.
- voiceover: ""
- duration: 3.0s
- transition_in: cut
- status: final
- src: compositions/frames/08-cierre-marca.html
- verbatim: ninguno — solo el logo (`public/brand/logo-vertical-tagline-dark.png`, contiene el texto "DIEGO MAURY" / "Strategic Program Director" / "HAGAMOS QUE LAS COSAS PASEN" horneado en el archivo de imagen, no tipografiado por HyperFrames)
- asset: public/brand/logo-vertical-tagline-dark.png

narrativeRole: Cierre de marca — no es decoración, es lo que convierte un video correcto en un video terminado (regla de `/video-explainer`: "Close on the brand"). Nuevo en la revisión del 2026-08-23; no existía en la versión de 7 frames.

Scene 1 (0.1–0.7s): la marca completa entra centrada (scale + fade), cierre limpio del video.
Scene 2 (0.7–3.0s hold): se sostiene quieta hasta el final.
