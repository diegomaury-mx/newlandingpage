---
format: 1080x1920
duration: 41.5s
message: "Notion no documenta mi sitio. Lo administra."
arc: protagonista → contraste+espejo → cms editorial → reglas → automatización → cristalización → cierre de marca
audience: Notion Community (técnica)
mode: autonomous
music: none — silencio total, decisión D-01 confirmada por el usuario 2026-08-22
---

## Revisión 2026-08-23 (segunda ronda, video real + fusión de escenas)

Cambios aplicados sobre la revisión escena-por-escena anterior, confirmados por el usuario:

- **F1 rediseño completo:** nuevo video real (`assets/video/c1-site-scroll.mp4`, grabación de pantalla del sitio diegomaury.mx en vivo, 5.37s fuente) reemplaza la grabación de edición del checkbox — el panel ahora es más grande (860px alto vs 580px) y muestra el sitio real, no Notion. Copy nuevo: "diegomaury.mx" (tecleo) → "no es una página. Es Notion." (con "Notion." como acento ember, reemplaza al anillo hairline que ya no aplicaba sin el gesto de edición). Se agregó el logo oficial completo de Notion (glifo 3D + wordmark, `public/brand/notion-logo-white.png`, recoloreado a blanco desde el original negro-sobre-transparente del usuario) como badge discreto sobre la esquina del panel. Duración: 5.0s → 5.5s.
- **F2 (Contraste) + F3 (El espejo) fusionados en un solo archivo** (`02-contraste.html`), decisión del usuario para eliminar el espacio muerto que dejaba el contraste ANTES/AHORA solo. El archivo `03-el-espejo.html` se eliminó; index.html ya no lo referencia. Beat 1 (0-2.8s local): ANTES/AHORA compacto y centrado. Beat 2 (3.0-7.5s local): el espejo (split C2/C3 + línea coral autodibujada) reemplaza al contraste en el mismo frame, sin escena aparte. Duración combinada: 7.5s (antes 4.0s + 5.5s = 9.5s con hueco).
- **F4 texto principal cambiado:** "No es una página común. Es un CMS a tu alcance." → "No es una página común. Es mi CMS personalizado." (acento ember se mantiene en "CMS").
- **F6 headline cambiado:** "Guardo. Nadie hace nada más." → "Solo edito. Guardo. Y listo." (mismo peso 700, mismo timing).
- **Nueva Frame 8 — Cierre de marca** (`08-cierre-marca.html`): el logo vertical completo del usuario (`public/brand/logo-vertical-tagline-dark.png` — isotipo + "DIEGO MAURY" + "Strategic Program Director" + "HAGAMOS QUE LAS COSAS PASEN") entra centrado como cierre final del video, después de F7. Duración: 3.0s.
- **Timing global recalculado:** F1 0.0-5.5 · F2(fusión) 5.5-13.0 · F4 13.0-18.0 · F5 18.0-24.0 · F6 24.0-32.0 · F7 32.0-38.5 · F8 38.5-41.5. Total: 41.5s (antes 40.0s).

## Video direction

Fuente canónica: minuta "🎬 Guion y storyboard · Reel 'CMS con Notion'" (Notion, `3bbcfa1602fd41a692a82dc9dfab277f`), verificada y confirmada por el usuario el 2026-08-22. Esta versión reemplaza por completo la iteración anterior (6 frames, `faceless-explainer` con datos parcialmente inventados). Decisiones cerradas con el usuario:

- **D-01 audio**: silencio total. Sin BGM, sin SFX, sin voz. `assets/music/bgm.mp3` y `assets/sfx/*` quedan sin usar en esta versión.
- **D-02 tesis en F7**: "Notion no documenta mi sitio. Lo administra." va también escrita en pantalla (no solo implícita). F7 sube a 6.5s, F3 baja a 5.5s. Suma total se mantiene en 40.0s exactos.
- **D-03 cifra de inventario**: queda fuera de pantalla en F3 y en todo el video, tal como el default de la minuta.
- **D-04 shot list**: las 10 capturas (C1-C10) las generó el usuario y viven en `assets/Screenshots_Video_CMS/`, copiadas a `assets/video/` (C1, C8) y `assets/img/cms-video/` (C2-C7, C9, C10) para esta autoría. C9 se resolvió con la opción "build real fallido" (captura de un deployment de Cloudflare Pages en estado `failure`), no con una ficha Insignia rota en Notion.

**Palette / type / motifs**: se conserva el mismo DS real "Ember on Ink" documentado en `frame.md` — Deep Ink `#0A0612` como ground, `#1A1128` como única superficie elevada (hairline `#6A291B`, nunca sombra/gradiente/glow), texto `t1/t2/t3`, `#FF5C39` como el único acento ember por frame. Plus Jakarta Sans para todo texto de lectura, DM Mono uppercase 0.16em para labels/kickers/chips, DM Mono no-upper para el literal de código.

**Regla de oro del guion** (de la minuta): una idea por frame, un solo verbo de la cadena por frame, Notion en pantalla y legible desde el fotograma 1.

**Ajuste de fidelidad al DS (Adapt deliberado)**: la minuta pide un "Kicker mono: ✱ NOTION CMS" en F1. El DS real de este proyecto prohíbe explícitamente marcas ✱ inventadas (`frame.md`, negative list: "No spike glyphs... any invented mark not listed above"). Se omite el glifo ✱ y el kicker queda como label-mono plano "NOTION CMS", sin símbolo — mismo contenido semántico, conforme al DS real.

**Barra de cadena — ELIMINADA del video completo (2026-08-23, a pedido explícito del usuario vía revisión escena por escena).** La barra de cinco verbos fijos (`edito · marco · guardo · valida · publica`) que acompañaba F3-F7 se retiró de los 7 frames. En su lugar: **F4** lleva el texto principal reescrito directamente ("Controla todo lo que se publica" quedó absorbido en el nuevo headline de F4, ver esa sección); F3, F5, F6 y F7 no llevan ningún sustituto — el frame respira sin ese chrome inferior. No reintroducir la barra de cadena en ningún frame sin decisión explícita nueva.

**Lockup de marca en todos los frames (2026-08-23):** el isotipo real (`isotipo-ember.svg`) + una regla hairline horizontal — el mismo tratamiento construido primero en F1 — se replicó en F2-F7, siempre en la misma posición (top:100px, esquina superior izquierda, ancho completo hasta el margen derecho). El isotipo no cuenta contra el acento ember único de cada frame (mismo precedente que el logo del nav/footer del sitio real).

**Mapa de acento ember único por frame** (ninguno usa la barra de cadena como su acento):

| Frame | Acento ember |
|---|---|
| F1 | anillo hairline ember que pulsa una vez alrededor del panel del sitio, en el instante del gesto de edición (representa "el campo que se edita" sin depender de coordenadas exactas del pixel grabado) |
| F2 | la palabra "Notion" dentro del bloque AHORA (`Notion → Publicar`) |
| F3 | la línea de correspondencia entre C2 (arriba) y C3 (abajo) |
| F4 | la palabra "CMS" en el header |
| F5 | anillo hairline ember que pulsa una vez sobre el checkbox en el instante del gesto de marcado (C8) |
| F6 | el ember-bar-top de la estación activa — nunca dos estaciones lo llevan a la vez |
| F7 | la palabra "CMS" en "Notion es mi CMS." |

**Timing exacto** (suma 40.0s):

| Frame | Inicio | Fin | Duración |
|---|---|---|---|
| F1 | 0.0 | 5.0 | 5.0s |
| F2 | 5.0 | 9.0 | 4.0s |
| F3 | 9.0 | 14.5 | 5.5s |
| F4 | 14.5 | 19.5 | 5.0s |
| F5 | 19.5 | 25.5 | 6.0s |
| F6 | 25.5 | 33.5 | 8.0s |
| F7 | 33.5 | 40.0 | 6.5s |

## Frame 1 — Protagonista

- scene: Lockup de marca (isotipo real + regla hairline) → wordmark "diegomaury.mx" → "se administra desde" → glifo real de Notion como remate → panel card-hairline con la grabación real (C1) del cursor editando la propiedad Publicable de la ficha SOFI en el SSOT de Notion → chip de búsqueda "diegomaury.mx". Rediseñado 2026-08-22 a pedido del usuario, con referencia visual externa (mockup de monitor), recreado 100% en HyperFrames sobre el DS real del proyecto (nunca el mockup importado tal cual).
- voiceover: ""
- duration: 5s
- transition_in: cut
- status: outline
- src: compositions/frames/01-protagonista.html
- verbatim: "diegomaury.mx" (wordmark) / "se administra desde" / "Notion" (glifo real, no la palabra sola)
- chips: chip mono "diegomaury.mx" con ícono de búsqueda (sin kicker "NOTION CMS" — el glifo de Notion en pantalla ya cubre esa función semántica)
- asset: assets/video/c1-edit-checkbox.mp4 (2.45s de los 3.1s originales, recortado dentro del panel) + assets/img/cms-video/c1-last-frame.png (freeze-hold para el resto del frame)

narrativeRole: Es la prueba de apertura — no una afirmación, una grabación real de la edición ocurriendo dentro del panel que representa el sitio. Establece que el protagonista es el sistema funcionando, no una animación ilustrativa; el panel es un card-hairline real del DS, nunca un mockup de hardware inventado.

Scene 1 (0.05–0.40s): lockup de marca (isotipo-ember.svg real + regla hairline) entra por la izquierda.
Scene 2 (0.30–0.85s): titular "diegomaury.mx" (wordmark, peso 500, centrado) entra con animación de tecleo — caracter por caracter con caret parpadeante, no fade (2026-08-23, a pedido del usuario).
Scene 3 (0.75–1.37s): "se administra desde" (centrado) entra con per-word staggered reveal.
Scene 4 (1.45–1.85s): remate — el glifo real de Notion (notion-icon.svg, currentColor t1) + label "Notion" entran como el punch de la escena.
Scene 5 (1.55–2.00s): el panel (card-hairline real: bg-2, hairline border, radius-lg, elevated v2-parity) se asienta con el sitio adentro.
Scene 6 (2.00–4.45s): el video C1 arranca dentro del panel y corre 2.45s; el runtime cede el paso al still de freeze/hold (c1-last-frame.png) para el resto del frame — el still ES el último fotograma (checkbox marcado), sin crossfade manual.
Scene 7 (2.05–2.40s): chip "diegomaury.mx" con ícono de búsqueda se asienta.
Scene 8 (4.50–5.00s hold): el anillo hairline ember pulsa una vez (0.5s) alrededor del panel, sincronizado exactamente con la ventana de freeze — el único acento ember del frame (el isotipo de marca no cuenta contra el presupuesto, precedente del sitio real).

## Frame 2 — Contraste

- scene: Dos beats de 2.0s. El bloque ANTES sigue en pantalla cuando entra AHORA (comparación simultánea, no reemplazo).
- voiceover: ""
- duration: 4s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-contraste.html
- verbatim beat 1 (0.0–2.0s local): etiqueta "ANTES" · bloque "Código → Deploy"
- verbatim beat 2 (2.0–4.0s local): etiqueta "AHORA" · bloque "Notion → Publicar"

narrativeRole: Explica el cambio de flujo sin criticar el desarrollo tradicional — dos estaciones por fila, sin pasos extra. El antes se apaga por bandas (dim), nunca se tacha. **Cambio 2026-08-23:** se retiró el texto narrativo ("Antes: editar código." / "Ahora: editar Notion.") — quedan solo etiqueta+bloque por fila; se agregó el lockup de marca (isotipo+regla) en la esquina superior, mismo tratamiento que F1.

Scene 1 (0.0–1.0s): fila ANTES entra completa — etiqueta mono + bloque `card-hairline` "Código → Deploy" + display, tercio superior.
Scene 2 (1.0–2.0s): la fila ANTES se sostiene, ya empieza a atenuarse levemente (dim por banda, no tachado) anticipando la entrada de AHORA.
Scene 3 (2.0–3.0s): fila AHORA entra debajo, mismo tratamiento visual — la palabra "Notion" dentro de "Notion → Publicar" lleva el único acento ember del frame.
Scene 4 (3.0–4.0s): ambas filas se sostienen juntas, ANTES atenuada (~55% opacidad) y AHORA a opacidad plena — la comparación queda legible de un vistazo.

## Frame 3 — El espejo

- scene: Split 50/50, C2 (Notion, ficha HEINEKEN) arriba y C3 (esa misma tarjeta publicada en el sitio) abajo, mismo ancho, unidas por una línea coral que va del campo al texto publicado. Aquí entra la barra de cadena con "edito" activo.
- voiceover: ""
- duration: 5.5s
- transition_in: push-slide RIGHT
- status: outline
- src: compositions/frames/03-el-espejo.html
- verbatim: "Lo que edito aquí," (arriba) / "aparece aquí." (abajo)
- asset: assets/img/cms-video/c2-notion-heineken.png (arriba) · assets/img/cms-video/c3-sitio-heineken.png (abajo)

narrativeRole: Prueba que Notion controla el sitio — el mismo string, no un parecido. Sin kicker: la línea portante ya enuncia la relación. **Cambio 2026-08-23:** texto centrado; las palabras "edito"/"aparece" llevan un fondo `bg-2` + hairline (resaltado no-ember) para que resalten; se retiró la barra de cadena; se agregó el lockup de marca.

Scene 1 (0.0–1.0s): la mitad superior revela C2 (recorte a ancho de canvas), con "Lo que edito aquí," entrando encima en per-word staggered reveal.
Scene 2 (1.0–2.2s): la mitad inferior revela C3, mismo ancho exacto, con "aparece aquí." aterrizando debajo.
Scene 3 (2.2–3.2s): la línea de correspondencia se autodibuja (SVG self-draw) del campo editado en C2 al texto publicado en C3 — el único acento ember del frame.
Scene 4 (3.2–3.8s): la barra de cadena entra por primera vez en la zona de chrome (safe area, ~78-80% de la altura), con "edito" en t1/700 y el resto en t3/400.
Scene 5 (3.8–5.5s): se sostiene el split completo con la línea y la barra de cadena; subtle jitter como único movimiento.

## Frame 4 — CMS editorial

- scene: Grilla 2x2, cuatro pares de fuente-en-Notion → parte-del-sitio sobre las capturas reales (C4-C7), entrando en cascada.
- voiceover: ""
- duration: 5s
- transition_in: cut
- status: outline
- src: compositions/frames/04-cms-editorial.html
- verbatim header (reescrito 2026-08-23): "No es una página común. Es un CMS a tu alcance." · Par 1: "Casos → Portfolio" · Par 2: "Copy → Home" · Par 3: "Métricas → cifras" · Par 4: "Imágenes → assets" — el nombre de cada base de datos (Casos, Copy, Métricas, Imágenes) va dentro de un tag/chip propio, no como texto mono plano
- asset: assets/img/cms-video/c4-ssot-rows.png · c5-copy-oficial.png · c6-metricas.png · c7-cms-imagenes.png

narrativeRole: Explica el alcance del CMS sin inventario técnico — cada par dice qué parte del sitio controla cada fuente, sin nombrar las bases de Notion por su nombre interno. **Cambio 2026-08-23:** header centrado, nuevo texto principal, nombres de base de datos en tag; se retiró la barra de cadena; se agregó el lockup de marca.

Scene 1 (0.0–1.0s): el header entra con per-word staggered reveal, tercio superior — la palabra "CMS" lleva el único acento ember del frame.
Scene 2 (1.0–1.8s): par 1 "Casos → Portfolio" se ensambla sobre C4, celda superior izquierda.
Scene 3 (1.3–2.1s): par 2 "Copy → Home" se ensambla sobre C5, celda superior derecha (cascada de 0.3s respecto al par 1).
Scene 4 (1.6–2.4s): par 3 "Métricas → cifras" se ensambla sobre C6, celda inferior izquierda.
Scene 5 (1.9–2.7s): par 4 "Imágenes → assets" se ensambla sobre C7, celda inferior derecha — grilla completa.
Scene 6 (2.7–3.2s): la barra de cadena se sostiene en "edito" (sin cambio respecto a F3).
Scene 7 (3.2–5.0s): la grilla completa se sostiene quieta; subtle jitter como único movimiento.

## Frame 5 — Reglas y acción

- scene: "Publicar tiene reglas." + chips reales de Notion (Publicado ✓ · Publicable ✓) + el checkbox pasando de vacío a marcado (C8, grabación real) + la ficha con el build detenido en cuadro (C9, deployment real en `failure`).
- voiceover: ""
- duration: 6s
- transition_in: cut
- status: outline
- src: compositions/frames/05-reglas-accion.html
- verbatim: "Publicar tiene reglas." · chips "Publicado ✓" / "Publicable ✓" · chip "sin evidencia → no compila" · pie mono 34px `draft = NOT (Publicado AND Publicable)`
- asset: assets/video/c8-checkbox-toggle.mp4 (3.1s) + assets/img/cms-video/c8-last-frame.png (freeze-hold) · assets/img/cms-video/c9-build-failure.png

narrativeRole: La gobernanza se muestra, no se declama — el clímax es el checkbox grabado marcándose de verdad, y la consecuencia (build detenido) entra en cuadro como evidencia real, no como texto tipografiado aparte. **Cambio 2026-08-23:** todo el texto y los chips quedaron centrados horizontalmente; se retiró la barra de cadena; se agregó el lockup de marca.

Scene 1 (0.0–1.2s): "Publicar tiene reglas." entra con per-word staggered reveal, tercio superior.
Scene 2 (1.2–2.4s): los chips "Publicado ✓" y "Publicable ✓" aterrizan debajo, t1 sobre `card-hairline`.
Scene 3 (2.4–2.7s): el video C8 arranca (checkbox marcándose) en un panel central, a escala legible del gesto.
Scene 4 (3.1–3.5s): C8 termina y congela en su último fotograma (checkbox marcado); el anillo hairline ember pulsa una vez sobre el checkbox — el único acento ember del frame.
Scene 5 (3.5–4.3s): el chip mono de consecuencia "sin evidencia → no compila" entra, seguido de C9 (build en `failure`) entrando debajo como evidencia real del build detenido.
Scene 6 (4.3–5.3s): el pie mono `draft = NOT (Publicado AND Publicable)` se tipea con caret en la franja inferior del safe area — nunca ocupa el centro del frame.
Scene 7 (5.3–6.0s): la barra de cadena avanza a "marco" (t1/700), el resto en t3/400; se sostiene todo el frame con subtle jitter.

## Frame 6 — Se publica solo

- scene: Cadena vertical de cuatro estaciones (`NOTION → WEBHOOK FIRMADO → BUILD → SITIO ACTUALIZADO`), revelada en tres beats, terminando en el resultado con evidencia real (C10, lista de deploys de Cloudflare).
- voiceover: ""
- duration: 8s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-se-publica-solo.html
- verbatim beat 1 (0.0–2.5s local): "Guardo. Nadie hace nada más." — entran NOTION y WEBHOOK FIRMADO
- verbatim beat 2 (2.5–5.5s local): entra BUILD — chips "3 de 4 fuentes" · "Astro" · "Cloudflare"
- verbatim beat 3 (5.5–8.0s local): entra SITIO ACTUALIZADO — "El sitio se actualiza automáticamente." — chip "~2 min"
- asset: assets/img/cms-video/c10-deploys-list.png (beat 3)

narrativeRole: Revela la automatización sin exagerar su alcance — 3 de 4 fuentes, nunca "todo Notion". Astro aparece una sola vez, después del clímax, en tamaño de chrome, sin nodo propio. **Cambio 2026-08-23:** headline y cierre pasan a peso 700 (texto más grueso); se retiró la barra de cadena; se agregó el lockup de marca.

Scene 1 (0.0–1.3s): "Guardo. Nadie hace nada más." entra con per-word staggered reveal, tercio superior; estación NOTION se asienta (usa `notion-icon.svg` real como su lockup).
Scene 2 (1.3–2.5s): estación WEBHOOK FIRMADO entra conectada por una línea que se autodibuja; el ember-bar-top marca esta estación como la activa — único acento ember del beat.
Scene 3 (2.5–4.3s): estación BUILD entra (el ember-bar-top pasa de WEBHOOK FIRMADO a BUILD, nunca ambas a la vez); los chips "3 de 4 fuentes" · "Astro" · "Cloudflare" aparecen en tamaño de chrome debajo, sin nodo propio para Astro.
Scene 4 (4.3–5.5s): la barra de cadena avanza a "valida" (coincide con el arribo de BUILD).
Scene 5 (5.5–6.8s): estación SITIO ACTUALIZADO entra (el ember-bar-top pasa a esta estación); "El sitio se actualiza automáticamente." aterriza debajo; C10 entra como panel de evidencia junto al chip "~2 min".
Scene 6 (6.8–8.0s): la barra de cadena avanza a "publica"; todo se sostiene con subtle jitter, sin más pan.

## Frame 7 — Cristalización

- scene: La tesis se escribe primero, luego regreso a Notion con el sitio funcionando al lado y la barra de cadena completa, encendida (los 5 verbos en estado activo).
- voiceover: ""
- duration: 6.5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-cristalizacion.html
- verbatim tesis: "Notion no documenta mi sitio. Lo administra." (D-02: también escrita en pantalla)
- verbatim cierre línea 1: "Notion es mi CMS." · línea 2: "Contenido, reglas y publicación desde un solo lugar."
- chip CTA: "comenta CMS"
- asset: public/site-real-diegomaury-mx.jpg (fondo atenuado, "el sitio funcionando al lado")

narrativeRole: Fija la idea completa en una sola cristalización — la tesis del video, seguida del resumen y el CTA, cerrando con la marca real. **Cambio 2026-08-23:** tesis y cierre pasan a peso 700 (texto más grueso); se retiró la barra de cadena; se agregó el lockup de marca.

Scene 1 (0.0–1.0s): campo bg puro, sin fondo del sitio todavía.
Scene 2 (0.2–2.2s): la tesis "Notion no documenta mi sitio. Lo administra." entra con per-word staggered reveal, centrada, t1 sobre bg.
Scene 3 (2.2–2.8s): la tesis se sostiene brevemente, luego hace handoff (scale-swap) hacia la card de cierre.
Scene 4 (2.8–3.8s): "Notion es mi CMS." entra — la palabra "CMS" lleva el único acento ember del frame; el fondo real del sitio (`site-real-diegomaury-mx.jpg`) se asienta atenuado (~30%) detrás.
Scene 5 (3.8–4.8s): "Contenido, reglas y publicación desde un solo lugar." aterriza debajo.
Scene 6 (4.8–5.5s): el chip mono CTA "comenta CMS" se asienta; la barra de cadena completa se enciende (los 5 verbos en t1/700 simultáneamente — cadena completa).
Scene 7 (5.5–6.5s): todo se sostiene quieto salvo subtle jitter — cierre del video, segundo climax sostenido.
