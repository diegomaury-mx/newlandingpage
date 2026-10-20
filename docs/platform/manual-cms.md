# Manual de uso — Diego CMS (cómo editar el sitio sin tocar código)

> Espejo en el repo del "Manual de Diego CMS" de la Diego Maury WIKI (Notion), que es la versión vigente y más completa. Si difieren, gana Notion.

Desde el 2026-07-25 `diegomaury.mx` se construye a partir de fuentes en Notion: cuatro editables (sección 1) más dos de solo lectura (eventos y testimonios). Este documento es la guía práctica de "edito esto en Notion → así aparece en el sitio → así se publica". Para el diseño técnico del schema ver `docs/platform/cms-notion.md` y `docs/platform/notion-astro-contract.md`.

## 1 · Las fuentes de contenido

| Qué editas | Dónde vive en Notion | Qué controla en el sitio | ¿Publica solo? |
|---|---|---|---|
| Un caso de portafolio (Heineken, SOFI, REDUX, HackSureste, etc.) | Base `🗂️ SSOT - Portafolio Proyectos` | La tarjeta en `/portfolio` y la página completa del caso en `/portfolio/<slug>` | Sí (webhook) |
| El copy del Home (S1-S8) y de `/portfolio` (P1-P5) | Página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna **Versión Actual** | Todo el texto de `/` y el copy narrativo de `/portfolio` | Sí (webhook) |
| Una foto o logo fijo (foto de Diego, cinturón de logos del Hero) | Base "🖼️ CMS Imágenes — Portafolio D" | El sitio usa la imagen de Notion solo si el slot tiene `Estado = Listo`; si no, muestra la imagen fija actual | Sí (webhook) |
| Una cifra pública (métrica ancla, cifras de impacto) | Base "📊 Métricas oficiales — Portafolio D" | La franja "Impacto documentado" de `/portfolio` | No (ver sección 4) |

Además, el sitio lee dos fuentes que NO se operan desde este manual:

- **Eventos** (colección `events`): la base de eventos alimenta `/eventos` y `/en/events`. Su registro y curaduría están delegados a LUNA; Diego CMS la consume en modo lectura.
- **Testimonios** (colección `testimonials`): alimenta la marquesina de la home y la prueba social de `/portfolio` (reemplazó el embed de Senja el 2026-09-09).

**Regla de oro:** si el texto o la imagen que quieres cambiar no está en una de las cuatro fuentes editables, no se puede editar desde Notion — hay que tocar código (pide ayuda en una sesión de Claude Code).

## 2 · Editar un caso de portafolio

1. Abre la ficha del caso en `🗂️ SSOT - Portafolio Proyectos`.
2. Edita las propiedades que quieras (Organización, Tipo, Métrica ancla, Evidencia, Objetivo con métrica y timeframe, etc.) y/o el cuerpo de la página. La plantilla vigente del cuerpo es **CAR: Contexto → Acción → Resultado**.
   - El cierre del caso NO va en el cuerpo: es la propiedad `Reflexión` (texto, opcional). Solo se muestra si tiene contenido y se parte en párrafos por línea en blanco (separa cada párrafo con una línea vacía).
   - La relación `Ediciones` ya no se muestra en la página del caso: el bloque "Archivo de este caso" se retiró el 2026-10-09 porque duplicaba "Casos relacionados".
3. **Reglas de publicación** (no las puedes saltar):
   - La ficha aparece en el sitio solo si `Estado publicación = Publicado` **Y** `Publicable = Sí`. Falta cualquiera de los dos → la ficha no existe en el sitio. Aplica a toda capa.
   - Si la ficha es `Capa = Insignia`, además exige `Métrica ancla` + `Evidencia` verificadas — si falta cualquiera, el build de Astro **falla a propósito** (guardrail `superRefine`) y el sitio no se actualiza hasta que lo corrijas.
   - Si la ficha es `Capa = Soporte`, puede publicarse sin métrica ancla (no es un bloqueo).
4. Nunca inventes una cifra para pasar el guardrail. Si no tienes evidencia, dejas la fila en `✖` — eso es correcto, no un error a esconder.

## 3 · Editar el copy del Home

1. Abre la página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna **Versión Actual**.
2. El documento está dividido por encabezados `# S1 · <nombre>` … `# S8 · <nombre>` (y `# SEO · Metadatos`). El parser (`src/utils/parseSiteCopy.ts`) corta el contenido por esos encabezados exactos — **no borres ni renombres el patrón `# S<n> · `**, o esa sección deja de reconocerse y el build la ignora en silencio.
3. Puedes renombrar libremente lo que va DESPUÉS del `·` (el nombre visible de la sección) — el código usa el número (`S1`...`S8`), no el nombre, como ancla interna.
4. El bloque `## Footer` vive dentro de la sección `SEO` y se extrae aparte (marca, tagline, nav "Explora", "Contacto", copyright).
5. **No edites las páginas archivadas** "Obsoleto · Secciones reemplazadas…" pensando que actualizan el sitio: el parser descarta cualquier sección `S<n>` duplicada y se queda con la primera que encuentra (la de Versión Actual). Si necesitas retirar contenido viejo de Notion, archívalo o bórralo, no lo edites esperando que se vea.

## 4 · Publicar los cambios

**El deploy real es Cloudflare Pages** (Git integration con este repo, rama `master`). No hay botón "Run workflow" en GitHub: GitHub Actions / GitHub Pages se retiraron el 2026-08-02.

- **Cambio en código:** cualquier `git push` a `master` dispara un build de Astro (~90-115 s, trayendo lo último de Notion) más el deploy de Cloudflare, y lo publica en `diegomaury.mx`.
- **Cambio SOLO en Notion:** se publica solo. El Cloudflare Worker `notion-deploy-relay` recibe la suscripción de webhooks de Notion sobre las fuentes editables (SSOT de casos, CMS Imágenes, Copy Oficial), valida la firma y dispara el Deploy Hook de Cloudflare Pages. Mismo tiempo de rebuild.
- **La base de Métricas queda fuera** de la suscripción: sus cambios entran al sitio en el siguiente rebuild disparado por otra causa (un push o un cambio en otra fuente). Si la cifra tiene que salir ya, pídelo en una sesión de Claude Code.
- **Eventos:** no disparan build directo. Un filtro de propiedades públicas decide si el cambio es relevante; si lo es, el Worker deja una marca pendiente y un cron cada 5 minutos la publica en un solo build.
- **Rebuild diario:** un cron a las 13:00 UTC reconstruye el sitio para mantener `/eventos` al día.

**Confirmar que un cambio ya se publicó:** espera ~90-115 s del build + el deploy y revisa el deployment en el dashboard de Cloudflare Pages del proyecto `newlandingpage` (o pídele a Claude Code que lo confirme contra la API de Cloudflare). Si en ~3 minutos no cambió, revisa que lo editado esté en una fuente con webhook y que el build no haya fallado (sección 6).

Detalle técnico: `docs/platform/cms-architecture.md` y el repo `github.com/diegomaury-mx/notion-cms` (`06-auto-publish.md`).

## 5 · Qué NO se edita desde Notion

- Diseño visual, tokens del design system, layout de las secciones — eso es código (`src/pages/*.astro`, `assets/css/styles.css`).
- Las páginas legacy servidas desde `public/` (casos viejos en HTML plano, política de privacidad, términos, 404) — esas no leen de Notion, son archivos estáticos.
- Estructura de navegación, textos de botones/CTA que no vengan de una sección `S<n>` del copy — están hardcodeados en los archivos `.astro`.

## 6 · Si algo sale mal

- **El build falla:** lee el log del deployment en el dashboard de Cloudflare Pages del proyecto `newlandingpage`. Si menciona evidencia/métrica ancla faltante, corrígelo en la ficha Insignia correspondiente. Si menciona `NOTION_TOKEN`, el secret del proyecto en Cloudflare expiró — pide que lo regeneren. Si menciona `Block type ai_block is not supported via the API`, hay un bloque de IA de Notion sin convertir en el cuerpo de alguna ficha: clic derecho → "Convertir en" → Texto. Un timeout de la API de Notion es transitorio: reintentar el deploy suele bastar.
- **El sitio no cambió después de un deploy exitoso:** espera 1-2 minutos (propagación de CDN) y refresca sin caché (Ctrl+Shift+R).
- **Duda de si algo se puede editar desde Notion o necesita código:** pregunta antes de intentarlo directo en Notion — evita ediciones que no tienen efecto o rompen el guardrail sin avisar hasta el build.
