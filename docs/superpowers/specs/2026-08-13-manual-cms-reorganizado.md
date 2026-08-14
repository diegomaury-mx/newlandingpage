# Manual de Diego CMS — reorganizado (Diátaxis)

Fecha: 2026-08-13
Fuente original: página Notion "📃 Manual de Diego CMS" (`3a80fe3c51c5803e9b78d9faeb1c98f7`)

## Qué cambió y qué no

**No se reescribió ningún dato técnico** — reglas de publicación, gotchas,
nombres de slots, rutas, todo el contenido factual es el mismo. Lo único que
cambió es el ORDEN y el AGRUPAMIENTO: las tablas de referencia (lookup) que
hoy interrumpen los pasos numerados se movieron a un bloque "Referencia" al
principio; la explicación de cómo funciona el auto-publish (Worker/webhook)
se separó del paso de verificación. El resultado: cuando abres el manual para
hacer una tarea, lees solo los pasos de esa tarea, sin tropezar con tablas o
explicaciones de fondo que no necesitas en ese momento.

**Cómo aplicar esto:** reemplaza el contenido completo del synced block
"Manual de uso — Diego CMS" en Notion con el markdown de abajo (mismo patrón
que ya usas para Copy Oficial: pegado manual, no vía comando de la API que
podría borrar contenido hermano en esta página con toggles anidados).

---

## Manual de uso — Diego CMS (cómo editar el sitio sin tocar código)

Desde el 2026-07-25 `diegomaury.mx` se construye a partir de cuatro fuentes en Notion. Este documento es la guía práctica de "edito esto en Notion → así aparece en el sitio → así lo publico". Para el diseño técnico del schema ver `docs/platform/cms-notion.md` y `docs/platform/notion-astro-contract.md`.

### 📖 Referencia

*Consulta esta sección cuando necesites ubicar algo — no está pensada para leerse de corrido.*

#### Las cuatro fuentes {toggle="true"}

| Qué editas | Dónde vive en Notion | Qué controla en el sitio |
|---|---|---|
| Un caso de portafolio (Heineken, SOFI, REDUX, HackSureste, etc.) | Base SSOT - Portafolio Proyectos | La tarjeta en `/portfolio` y la página completa del caso en `/portfolio/<slug>` |
| El copy del Home (S1-S8) | Página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna **Versión Actual** | Todo el texto de `/` (hero, about, servicios, casos destacados, cierre, footer) |
| Una cifra pública (métrica ancla, resultados) | Base "📊 Métricas oficiales — Portafolio D" | Cualquier `{{metrica:slug}}` que se resuelva en un caso o en el Home |
| Una foto o logo que hoy vive fijo en el código (foto de Diego, logos de la barra de confianza) | Base "🖼️ CMS Imágenes — Portafolio D" | El sitio usa la imagen de Notion solo cuando el slot tiene `Estado = Listo`; si no, sigue mostrando la imagen fija actual |

**Regla de oro:** si el texto que quieres cambiar no está en una de estas cuatro fuentes, no se puede editar desde Notion — hay que tocar código (pide ayuda en una sesión de Claude Code).

#### Mapa de casos: nombre público ↔ alias internos ↔ URL {toggle="true"}

Si ves un nombre en una conversación, tarea o mensaje que no reconoces (ej. "Sophie", "Haxor"), es casi seguro un alias informal de uno de los casos reales de abajo, no un caso nuevo. Confirmado: **Sophie = SOFI**, **Haxor = HackSureste**.

| Nombre real (título en Notion) | Alias/código interno conocido | URL en el sitio | Capa |
|---|---|---|---|
| SOFI | Sophie | /portfolio/sofi | Insignia |
| HackSureste | Haxor | /portfolio/hacksureste | Insignia |
| HEINEKEN Green Challenge | — | /portfolio/heineken-green-challenge | Insignia |
| REDUX | — | /portfolio/redux | Insignia |
| INCmty B-Challenge | — | /portfolio/incmty-b-challenge | Soporte |
| INCmty Accelerator | — | /portfolio/incmty-accelerator | Soporte |
| INC Prototype | — | /portfolio/inc-prototype | Soporte |
| INCmty DisruptAir Challenge 2022 | — | /portfolio/incmty-disruptair-challenge-2022 | Soporte |
| BTEM | — | /portfolio/btem | Soporte |
| FreeLand | — | /portfolio/freeland | Soporte |
| BRAiN México | — | /portfolio/brain-mexico | Soporte |
| G20 YEA Model | — | /portfolio/g20-yea-model | Soporte |
| HackSureste Ciudad del Carmen 2019 | — | /portfolio/hacksureste-ciudad-del-carmen-2019 | Soporte |
| Haz que pase - Substack | — | /portfolio/haz-que-pase-substack | Soporte |

Todas viven en la misma base SSOT - Portafolio Proyectos — la columna "URL en el sitio" es el título pasado por `slugify()` (minúsculas, espacios y acentos fuera). Esta tabla se desactualiza si se publica/renombra un caso; conteo exacto siempre vía SQL sobre `Estado publicación = 'Publicado' AND Publicable = true` en esa base, no memorices el número.

#### Slots de imagen ya dados de alta {toggle="true"}

Al menos diez slots dados de alta hasta ahora en la base "🖼️ CMS Imágenes — Portafolio D":

- `foto-diego-hero` y `foto-diego-about` — foto de Diego en Hero y en About (son dos slots separados, no uno compartido; la sección "Colaboremos" que usaba una tercera copia ya no existe en el código desde el pivote del 24-jul-2026)
- `logo-heineken`, `logo-tec-de-monterrey`, `logo-incmty`, `logo-ebc` — los 4 logos de la barra de confianza
- `diagrama-problema` — el diagrama de S3 "El problema que resuelvo"; sin archivo publicado, el sitio conserva el SVG dibujado a mano como fallback
- `ip-logo-redux`, `ip-logo-hacksureste`, `ip-logo-sofi` — los 3 logos de sistemas propios en S6

**`logo-fliphouse` no se usa:** FlipHouse es el cliente real y confidencial detrás del caso SOFI/PropTech, y mostrar su logo en la barra de confianza del home desanonimiza el caso al instante (incidente detectado y corregido 2026-08-11). No dar de alta ni subir un logo a ese slot esperando que aparezca en el sitio — el código lo excluye a propósito.

#### Qué NO se edita desde Notion {toggle="true"}

- Diseño visual, tokens del design system, layout de las secciones — eso es código (`src/pages/*.astro`, `assets/css/styles.css`).
- Las páginas legacy servidas desde `public/` (los 4 casos viejos en HTML plano), no leen de Notion, son archivos estáticos.
- Política de privacidad, términos y condiciones, y la página de Docencia, son páginas Astro reales (comparten Navbar/Footer con el resto del sitio), pero su contenido está escrito directo en código, no viene de Notion.
- Estructura de navegación, textos de botones/CTA que no vengan de una sección `S<n>` del copy — están hardcodeados en los archivos `.astro`.

---

### 🔧 Cómo hacer cada cosa

*Pasos numerados, uno por tarea. Sigue el orden.*

#### Editar y publicar un caso de portafolio {toggle="true"}

1. Abre la ficha del caso en la base SSOT - Portafolio Proyectos.
2. Edita las propiedades que quieras (Organización, Tipo, Métrica ancla, Evidencia, Objetivo con métrica y timeframe, etc.) y/o el cuerpo de la página. Desde el 2026-08-11 (código LIVE 2026-08-13) la plantilla vigente es **CAR — Contexto → Acción → Resultado** (reemplaza la plantilla vieja de 8 secciones). La sección `## Resultado` reconoce una tabla con encabezados exactos `Métrica | Antes | Después` y la renderiza como tarjetas; cualquier otro encabezado cae a tabla normal sin romper el build. El cierre de la ficha **ya no va en el cuerpo**: es la propiedad independiente **Reflexión** (texto, opcional) — solo se muestra en el sitio si no está vacía. Claude Code no redacta la narrativa CAR de una ficha: Diego la redacta o dicta, Claude solo transcribe/estructura lo que él dé literalmente.
3. **Reglas de publicación** (no las puedes saltar):
   - `Estado publicación` debe estar en `Publicado` para que la ficha aparezca en el sitio.
   - Si la ficha es `Capa = Insignia`, además necesita `Publicable = Sí`, lo cual exige `Métrica ancla` + `Evidencia` verificadas — si falta cualquiera, el build de Astro **falla a propósito** (guardrail `superRefine`) y el sitio no se actualiza hasta que lo corrijas.
   - Si la ficha es `Capa = Soporte`, puede publicarse sin métrica ancla (no es un bloqueo).
4. Nunca inventes una cifra para pasar el guardrail. Si no tienes evidencia, dejas la fila en `✖` — eso es correcto, no un error a esconder.
5. **El banner y el logo de la tarjeta se suben aquí mismo**, como propiedades `banner` y `logo` (tipo Files & media) de la ficha — no en la base de CMS Imágenes (esa es solo para lo que vive fijo en código). Si la tarjeta muestra "Sin imagen publicable" es porque esa propiedad está vacía en esa ficha; revisa banner y logo caso por caso en cada ficha publicada, no asumas que el problema es solo de fichas antiguas.
6. **Evidencia visual**: la propiedad `Evidencia visual` (Files, multi) acepta solo fotos, se cachean localmente en build igual que banner/logo. Los videos van en la propiedad `Videos de evidencia` como texto libre, una URL por línea (formato opcional `Etiqueta | URL`), **nunca como archivo subido a Notion**, siempre un link externo (YouTube/Drive), para no romper el límite de tamaño de Cloudflare Pages.

*Nombres de casos y sus URLs → sección Referencia arriba.*

#### Editar el copy del Home {toggle="true"}

1. Abre la página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna **Versión Actual**.
2. El documento está dividido por encabezados `# S1 · <nombre>` … `# S8 · <nombre>` (y `# SEO · Metadatos`). El parser (`src/utils/parseSiteCopy.ts`) corta el contenido por esos encabezados exactos — **no borres ni renombres el patrón `# S<n> ·`**, o esa sección deja de reconocerse y el build la ignora en silencio.
3. Puedes renombrar libremente lo que va DESPUÉS del `·` (el nombre visible de la sección) — el código usa el número (`S1`…`S8`), no el nombre, como ancla interna.
4. El bloque `## Footer` vive dentro de la sección `SEO` y se extrae aparte (marca, tagline, nav "Explora", "Contacto", copyright).
5. **No edites las páginas archivadas** "Obsoleto · Secciones reemplazadas…" pensando que actualizan el sitio: el parser descarta cualquier sección `S<n>` duplicada y se queda con la primera que encuentra (la de Versión Actual). Si necesitas retirar contenido viejo de Notion, archívalo o bórralo, no lo edites esperando que se vea.

#### Cambiar una foto o logo fijo {toggle="true"}

1. Abre la base "🖼️ CMS Imágenes — Portafolio D".
2. Abre la fila del slot que quieres cambiar (nombres exactos → sección Referencia arriba) y sube el archivo en la propiedad **Imagen**. Respeta `Tamaño requerido` y `Formato requerido` si están definidos en esa fila.
3. Cambia **Estado** a `Listo`. Mientras el Estado no sea `Listo`, el sitio sigue mostrando la imagen fija actual (no rompe nada, pero tampoco se actualiza).
4. Si necesitas una foto o logo nuevo que HOY no está en ninguna de las 4 fuentes (ni en una ficha de caso, ni en esta base), no hay slot para eso todavía — pídelo en una sesión de Claude Code para que se agregue el código y la fila correspondiente. Regla dura: ninguna imagen nueva del sitio debe quedar hardcodeada en código sin pasar por esta base.

Las 4 páginas de caso legacy servidas desde `public/portfolio/*.html` (Heineken, SOFI, REDUX-INCmty, Innovation Systems) no tienen ninguna imagen (son texto + CSS puro) — no aplica nada de esta sección a ellas.

#### Confirmar que un cambio ya se publicó {toggle="true"}

1. Si SOLO cambiaste algo en Notion (sin tocar código), espera ~90-115 segundos (build) + tiempo de deploy — el sitio se actualiza solo (ver "Cómo funciona el auto-publish" en Explicación abajo).
2. Verifica el estado del deploy en el dashboard de Cloudflare Pages del proyecto `newlandingpage`, o pídele a Claude Code que lo confirme contra la API de Cloudflare.
3. Si editaste y el sitio no cambió en ~3 minutos, revisa:
   - (a) que la página que editaste esté dentro de las 3 fuentes con webhook activo (SSOT casos, CMS Imágenes, Copy Oficial) y conectada a la integración de Notion que lo sostiene.
   - (b) el dashboard de Cloudflare Pages por si el build falló (ver sección Troubleshooting abajo, incluye el gotcha de bloques AI de Notion).
4. Si el sitio no cambió después de un deploy exitoso: espera 1-2 minutos más (el CDN de Cloudflare tarda en propagar) y refresca sin caché (Ctrl+Shift+R).

---

### 💡 Por qué funciona así

*Contexto de fondo — no hace falta leerlo para completar una tarea, pero explica el "por qué" detrás de reglas que podrían parecer arbitrarias.*

#### Cómo funciona el auto-publish {toggle="true"}

**Editar Notion no actualiza el sitio solo por magia.** El deploy real es **Cloudflare Pages** (Git integration con el repo `newlandingpage`, rama `master`): cualquier `git push` a `master` dispara un build automático (dura 90-115 segundos, trayendo lo último de Notion) y lo publica en `diegomaury.mx`. No hay ningún botón "Run workflow" en GitHub, ese mecanismo se retiró.

**Desde el 2026-08-13, si SOLO cambiaste algo en Notion (sin tocar código), el sitio SÍ se actualiza solo.** Un Cloudflare Worker (`notion-deploy-relay`) recibe la suscripción nativa de webhooks de Notion sobre las 3 fuentes editables (SSOT casos, CMS Imágenes, Copy Oficial), valida la firma del evento y dispara el Deploy Hook de Cloudflare Pages automáticamente — no hace falta pedir un push trivial. El rebuild tarda lo mismo (90-115s del paso `[notion-cases]` + deploy).

---

### 🚑 Si algo sale mal

*Síntoma → causa → arreglo.*

- **El build falla en Cloudflare Pages:** abre el dashboard del proyecto `newlandingpage` en Cloudflare Pages y lee el log del deployment.
  - Si menciona evidencia/métrica ancla faltante, corrígelo en la ficha Insignia correspondiente.
  - Si menciona `NOTION_TOKEN`, el secret del proyecto en Cloudflare expiró — pide que lo regeneren.
  - Si menciona `Block type ai_block is not supported via the API`: dejaste un bloque AI de Notion (el de "preguntarle a la IA", sin aceptar/convertir a texto) en el cuerpo de alguna ficha del SSOT de casos — la API de integración no puede leerlo y **rompe todos los rebuilds** (automáticos y por push) hasta que lo conviertas a texto normal (clic derecho sobre el bloque → "Convertir en" → Texto). Esto ya pasó una vez (2026-08-13, ~40 deploys fallidos) mientras se redactaban las 14 fichas CAR con esa herramienta — si vas a usar el bloque AI para redactar varias fichas, conviértelo a texto en cada una antes de pasar a la siguiente, no dejes varias a medias.
- **El sitio no cambió después de un deploy exitoso:** espera 1-2 minutos (el CDN de Cloudflare tarda en propagar) y refresca sin caché (Ctrl+Shift+R).
- **Duda de si algo se puede editar desde Notion o necesita código:** pregunta antes de intentarlo directo en Notion — evita ediciones que no tienen efecto o rompen el guardrail sin avisar hasta el build.
