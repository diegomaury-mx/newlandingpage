# Video Pitch Plan: diegomaury.mx — Notion como CMS

## What is this app?
diegomaury.mx es un portafolio construido con Astro cuyo contenido (casos, métricas, imágenes, copy) vive por completo en bases de datos de Notion; el build de Astro las consulta, valida y publica, y un webhook dispara el rebuild automático cuando Diego edita algo en Notion.

## What the video needs to teach
1. **Notion es la base de datos editorial real**, no solo notas: cada caso tiene propiedades tipadas (Estado publicación, Publicable, Capa, Métrica ancla, Evidencia) que determinan si y cómo se publica.
2. **El filtro de publicación es una regla, no un botón**: `draft = NOT (Estado publicación == "Publicado" AND Publicable == true)` — ambas condiciones deben cumplirse, y esa lógica corre en el build, no en Notion.
3. **El build de Astro es el traductor**: consulta la API de Notion, valida cada campo contra un schema, descarga y cachea las imágenes (las URLs de Notion expiran en ~1h) y genera el sitio estático.
4. **La publicación es automática de extremo a extremo**: guardar un cambio en Notion dispara un webhook que reconstruye y despliega el sitio solo — Diego nunca toca código ni hace push para actualizar contenido.

## Opening frame (first 2-4 seconds)
Pantalla en negro (#0A0612) con la línea en DM Mono: "diegomaury.mx: el contenido vive en Notion." Sin logo, sin florituras — declara el tema exacto que se va a explicar.

## Walkthrough beats (the middle)
- **Beat 1 — El esquema real**: una fila de la base "SSOT — Portafolio Proyectos" con sus columnas reales: Título, Estado publicación, Publicable, Capa, Métrica ancla, Evidencia. Caso de ejemplo: SOFI.
- **Beat 2 — La regla de publicación**: la condición exacta `Estado publicación = Publicado` AND `Publicable = true` se muestra como una ecuación simple; si falta cualquiera, el caso no sale.
- **Beat 3 — El build traduce**: Astro consulta la API de Notion, valida los campos, cachea las imágenes localmente (evita URLs firmadas que expiran) y genera las páginas.
- **Beat 4 — Auto-publish**: editar Notion dispara un webhook → Cloudflare Worker → Deploy Hook → el sitio se reconstruye solo, sin push manual.

## Recap / where it lands
Pantalla dividida: la fila de Notion (SOFI, Publicado + Publicable) a la izquierda, la página real `/portfolio/sofi` a la derecha. Línea de cierre: "Notion es el CMS. Astro es el que construye." + "diegomaury.mx"

## User flow worth showing
Entrada → acción clave → resultado:
1. **Entrada**: Diego edita una ficha en Notion — cambia `Estado publicación` a "Publicado" y marca `Publicable`.
2. **Acción clave**: ese guardado dispara el webhook, que llama al Deploy Hook de Cloudflare Pages; Astro corre el build, valida y genera el sitio.
3. **Resultado**: la página del caso aparece publicada en diegomaury.mx/portfolio, sin que Diego haya tocado una línea de código.

## Tone
- Preset: technical
- Creative direction: walkthrough preciso del pipeline Notion→Astro→Cloudflare, para alguien que quiere entender el mecanismo real, no una demo de ventas.
- Interpretation: corte seco entre escenas, tipografía mono para datos/campos/reglas, un hecho concreto por escena, sin narrador emocional — la precisión es el tono.

## Format: landscape — 1920x1080
## Duration: 31s target

## Visual identity (from the project)
- Background: `#0A0612` (Deep Ink)
- Surface/card: `#1A1128`
- Border: `#6A291B`
- Text primary: `#FAF8FC` / secundario `#DDDBE0` / terciario `#A8A6AC`
- Accent (un solo uso por pieza): `#FF5C39` (ember); botón sólido usa `#BF452B`
- Display/UI font: Plus Jakarta Sans
- Data/label font: DM Mono (uppercase para labels y campos)
- Strongest visual element: la fila real de propiedades de Notion (Estado publicación / Publicable / Capa) puesta lado a lado con la página `/portfolio/sofi` que genera

## Video summary (draft)
diegomaury.mx guarda todo su contenido en Notion: cada caso tiene campos como Estado de publicación, Publicable, Capa y Métrica ancla que deciden si aparece en el sitio. En cada build, Astro consulta esos datos, los valida y genera las páginas; al guardar un cambio en Notion, un webhook dispara el rebuild automático en Cloudflare Pages, sin que Diego toque código.

## Audio direction
- Role: near-silent, técnico — silencio informativo con acentos puntuales de datos
- Music: cama muy baja y minimalista (o ninguna) — preferir silencio sobre relleno
- Music treatment: si hay cama, entra suave desde el silencio en Scene 1, se mantiene plana y baja todo el video, sin swell dramático
- Music cue guidance: sin track específico asignado; Hyperframes puede usar `npx hyperframes beats` si elige una pista, restringido a 1-2 acentos suaves en Beat 2 (la regla) y Beat 4 (el webhook disparando)
- Audio-reactive treatment: ninguno
- SFX posture: sparse — un tick discreto cuando aparece cada campo de Notion (Beat 1), un sonido de "confirmación" corto cuando la regla se cumple (Beat 2), un tick de red/webhook en Beat 4
- Audio-coupled moments: campos de Notion apareciendo uno por uno (tick por campo), el checkbox `Publicable` marcándose (confirm tick), el webhook disparando el rebuild (network tick)
- Restraint rule: nunca debe sonar a reel de producto ni a hype — es una explicación de arquitectura, el audio solo puntúa datos concretos

## Storyboard

### Scene 1 — Contexto — 4s
Fondo `#0A0612`. Texto centrado en DM Mono, uppercase, tracking amplio: "DIEGOMAURY.MX" seguido de una línea más chica en Plus Jakarta Sans: "El contenido vive en Notion." Nada más en pantalla.
Sequential/interaction: none
Audio intent: silencio o cama casi imperceptible, sin acento todavía
Audio-coupled idea: none
Music: near-silent bed, si aplica
Transition mood: hard cut → Scene 2

### Scene 2 — El esquema real — 6s
Recreación de una fila de la base Notion "SSOT — Portafolio Proyectos" para el caso SOFI: aparecen las propiedades una por una — Título: "SOFI", Estado publicación: "Publicado", Publicable: ✓, Capa: "Insignia", Métrica ancla: "+1,291% RODI". Tipografía DM Mono para labels uppercase, valores en Plus Jakarta Sans.
Sequential/interaction: yes — cada propiedad (Título → Estado publicación → Publicable → Capa → Métrica ancla) aparece en secuencia, una tras otra, simulando que se está llenando la ficha
Audio intent: un tick suave y discreto por cada campo que aparece, marcando el ritmo de la secuencia sin sonar a juego
Audio-coupled idea: tick por campo
Music: cama baja continúa
Transition mood: hard cut → Scene 3

### Scene 3 — La regla de publicación — 5s
Pantalla con la ecuación literal, en DM Mono: `draft = NOT (Estado publicación = "Publicado" AND Publicable = true)`. Debajo, en texto plano: "Si falta cualquiera de las dos, el caso no se publica." El checkbox `Publicable` de la escena anterior se re-muestra marcándose con un pequeño destello ember, único acento de color de la pieza.
Sequential/interaction: yes — el checkbox se marca (transición de vacío a ✓) mientras la ecuación se resalta
Audio intent: un tick de confirmación corto cuando el checkbox se marca, marcando que la condición se cumple
Audio-coupled idea: confirm tick al marcar Publicable
Music: cama baja
Transition mood: hard cut → Scene 4

### Scene 4 — El build traduce — 7s
Diagrama simple de tres nodos conectados por líneas rectas (no decorativas): "Notion API" → "Astro build (valida + cachea imágenes)" → "Sitio estático". Debajo del nodo central, una nota chica: "Las imágenes de Notion expiran en ~1h — el build las descarga y guarda localmente." El flujo se dibuja de izquierda a derecha.
Sequential/interaction: yes — los tres nodos y sus conectores aparecen en orden izquierda a derecha, como si el proceso avanzara
Audio intent: un tick de "procesamiento" leve en cada nodo que aparece, sin volverse repetitivo
Audio-coupled idea: tick por nodo (3 max)
Music: cama baja
Transition mood: hard cut → Scene 5

### Scene 5 — Auto-publish — 6s
Diagrama de cuatro pasos en línea: "Diego edita en Notion" → "Webhook (firma HMAC)" → "Deploy Hook Cloudflare" → "Sitio reconstruido". El paso del webhook se resalta un instante con el acento ember al disparar.
Sequential/interaction: yes — los cuatro pasos aparecen en secuencia rápida, con el webhook "disparando" (breve pulso) al pasar al siguiente paso
Audio intent: un tick de red/notificación en el momento del webhook, el más marcado de toda la pieza pero aún discreto
Audio-coupled idea: network tick al disparar el webhook
Music: cama baja, posible ligero acento aquí si hay track
Transition mood: soft crossfade → Scene 6

### Scene 6 — Resultado / recap — 5s
Pantalla dividida: a la izquierda la fila de Notion de SOFI (Estado publicación: Publicado, Publicable: ✓), a la derecha la página real `/portfolio/sofi` con su estructura de rail (logo, métrica ancla, secciones Contexto/Acción/Resultado). Línea de cierre centrada abajo en DM Mono: "NOTION ES EL CMS. ASTRO CONSTRUYE EL SITIO." y debajo, más chico: "diegomaury.mx"
Sequential/interaction: none — ambos lados ya están presentes, el corte es el efecto
Audio intent: silencio o cama que se desvanece a cero, cierre limpio sin swell
Audio-coupled idea: none
Music: fade to silence
Transition mood: — (final)

**Music mood for this video:** technical-minimal / near-silent — silencio informativo con acentos puntuales, nunca una cama que compita con el contenido
**Audio summary:** El video se apoya casi enteramente en el silencio; los únicos sonidos son ticks discretos que marcan la llegada de cada campo de Notion, la confirmación de la regla de publicación y el disparo del webhook — sonido como puntuación de datos, no como ambientación.
