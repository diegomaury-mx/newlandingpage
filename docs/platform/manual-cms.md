# Manual de uso — Diego CMS (cómo editar el sitio sin tocar código)

Desde el 2026-07-25 `diegomaury.mx` se construye a partir de tres fuentes en Notion. Este documento es la guía práctica de "edito esto en Notion → así aparece en el sitio → así lo publico". Para el diseño técnico del schema ver `docs/platform/cms-notion.md` y `docs/platform/notion-astro-contract.md`.

## 1 · Las tres fuentes

| Qué editas | Dónde vive en Notion | Qué controla en el sitio |
|---|---|---|
| Un caso de portafolio (Heineken, SOFI, REDUX, HackSureste, etc.) | Base `🗂️ SSOT - Portafolio Proyectos` | La tarjeta en `/portfolio` y la página completa del caso en `/portfolio/<slug>` |
| El copy del Home (S1-S8) | Página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna **Versión Actual** | Todo el texto de `/` (hero, about, servicios, casos destacados, cierre, footer) |
| Una cifra pública (métrica ancla, resultados) | Base "📊 Métricas oficiales — Portafolio D" | Cualquier `{{metrica:slug}}` que se resuelva en un caso o en el Home |

**Regla de oro:** si el texto que quieres cambiar no está en una de estas tres fuentes, no se puede editar desde Notion — hay que tocar código (pide ayuda en una sesión de Claude Code).

## 2 · Editar un caso de portafolio

1. Abre la ficha del caso en `🗂️ SSOT - Portafolio Proyectos`.
2. Edita las propiedades que quieras (Organización, Tipo, Métrica ancla, Evidencia, Objetivo con métrica y timeframe, etc.) y/o el cuerpo de la página (contexto, problema, acciones, resultados, evidencia, aprendizajes — sigue la plantilla v2).
3. **Reglas de publicación** (no las puedes saltar):
   - `Estado publicación` debe estar en `Publicado` para que la ficha aparezca en el sitio.
   - Si la ficha es `Capa = Insignia`, además necesita `Publicable = Sí`, lo cual exige `Métrica ancla` + `Evidencia` verificadas — si falta cualquiera, el build de Astro **falla a propósito** (guardrail `superRefine`) y el sitio no se actualiza hasta que lo corrijas.
   - Si la ficha es `Capa = Soporte`, puede publicarse sin métrica ancla (no es un bloqueo).
4. Nunca inventes una cifra para pasar el guardrail. Si no tienes evidencia, dejas la fila en `✖` — eso es correcto, no un error a esconder.

## 3 · Editar el copy del Home

1. Abre la página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna **Versión Actual**.
2. El documento está dividido por encabezados `# S1 · <nombre>` … `# S8 · <nombre>` (y `# SEO · Metadatos`). El parser (`src/utils/parseSiteCopy.ts`) corta el contenido por esos encabezados exactos — **no borres ni renombres el patrón `# S<n> · `**, o esa sección deja de reconocerse y el build la ignora en silencio.
3. Puedes renombrar libremente lo que va DESPUÉS del `·` (el nombre visible de la sección) — el código usa el número (`S1`...`S8`), no el nombre, como ancla interna.
4. El bloque `## Footer` vive dentro de la sección `SEO` y se extrae aparte (marca, tagline, nav "Explora", "Contacto", copyright).
5. **No edites las páginas archivadas** "Obsoleto · Secciones reemplazadas…" pensando que actualizan el sitio: el parser descarta cualquier sección `S<n>` duplicada y se queda con la primera que encuentra (la de Versión Actual). Si necesitas retirar contenido viejo de Notion, archívalo o bórralo, no lo edites esperando que se vea.

## 4 · Publicar los cambios (el paso que la gente olvida)

**Editar Notion no actualiza el sitio solo.** Notion no tiene ningún webhook conectado a este repo — alguien tiene que disparar un rebuild. Dos formas:

**A. Automática (si de todos modos vas a hacer un commit):**
Cualquier `git push` a `master` dispara `.github/workflows/deploy.yml`, que reconstruye el sitio completo (trayendo lo último de Notion) y lo publica.

**B. Manual (cuando SOLO cambiaste algo en Notion, sin tocar código):**
1. Ve a github.com → el repo `newlandingpage` → pestaña **Actions**.
2. En la lista de la izquierda, click en **"Deploy Astro to GitHub Pages"**.
3. Botón **"Run workflow"** (arriba a la derecha) → rama `master` → **Run workflow**.
4. Espera. El build tarda **~90-115 segundos** (trae las 27 fichas completas de Notion) + ~10s de deploy. Puedes ver el progreso en esa misma pantalla.
5. Cuando el run se marca en verde, el cambio ya está en `diegomaury.mx`. Si se marca en rojo, algo falló — revisa el log del paso "Build" (normalmente es el guardrail de evidencia del punto 2, o `NOTION_TOKEN` vencido).

No hay un cron automático corriendo esto en un horario fijo. Si quieres que el sitio se autoactualice cada cierto tiempo sin acordarte de darle "Run workflow", se puede agregar un trigger `schedule` al workflow — pídelo en una sesión de Claude Code si lo quieres.

## 5 · Qué NO se edita desde Notion

- Diseño visual, tokens del design system, layout de las secciones — eso es código (`src/pages/*.astro`, `assets/css/styles.css`).
- Las páginas legacy servidas desde `public/` (casos viejos en HTML plano, política de privacidad, términos, 404) — esas no leen de Notion, son archivos estáticos.
- Estructura de navegación, textos de botones/CTA que no vengan de una sección `S<n>` del copy — están hardcodeados en los archivos `.astro`.

## 6 · Si algo sale mal

- **El build falla en GitHub Actions:** lee el error en el log del paso "Build". Si menciona evidencia/métrica ancla faltante, corrígelo en la ficha Insignia correspondiente y vuelve a correr el workflow. Si menciona `NOTION_TOKEN`, el secret del repo expiró — pide que lo regeneren.
- **El sitio no cambió después de un run verde:** espera 1-2 minutos (el CDN de GitHub Pages tarda en purgar caché) y refresca sin caché (Ctrl+Shift+R).
- **Duda de si algo se puede editar desde Notion o necesita código:** pregunta antes de intentarlo directo en Notion — evita ediciones que no tienen efecto o rompen el guardrail sin avisar hasta el build.
