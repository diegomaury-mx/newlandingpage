# Actualización del "Manual de Diego CMS" (Notion, página `3a80fe3c51c5803e9b78d9faeb1c98f7`)

Tarea Notion: "Actualizar instrucciones del CMS del portafolio" (vence 2026-08-13).

**Por qué:** la página vive en un `synced_block` con varios `## ... {toggle="true"}`. Editarla vía `notion-update-page update_content` es riesgoso (gotcha documentado: reemplazar un encabezado-toggle borra sus hijos y bloques hermanos). Diego pega esto manualmente.

**Instrucción de pegado:** reemplazar el contenido de cada sección indicada abajo tal cual (conservar los `{toggle="true"}` de los encabezados, no tocarlos).

---

## Sección 4 · Publicar los cambios (el paso que la gente olvida) — REEMPLAZO COMPLETO

Reemplaza el contenido completo de esta sección (obsoleta: describe GitHub Actions, retirado el 2026-08-02) por:

```
**Editar Notion no actualiza el sitio solo.** El deploy real es **Cloudflare Pages** (Git integration con el repo `newlandingpage`, rama `master`): cualquier `git push` a `master` dispara un build automático (~90-115s trayendo lo último de Notion) y lo publica en `diegomaury.mx`. No hay ningún botón "Run workflow" en GitHub — ese mecanismo se retiró.

**Si SOLO cambiaste algo en Notion (sin tocar código), el sitio NO se actualiza solo.** Hoy no existe un disparador automático de Notion → Cloudflare (es la tarea pendiente "CMS: conectar disparador Notion a Deploy Hook de Cloudflare Pages"). Para publicar un cambio hecho solo en Notion, pide en una sesión de Claude Code que se haga un push trivial a `master` (o espera a que se junte con el próximo cambio de código) para forzar el rebuild.

Puedes verificar el estado de un deploy en el dashboard de Cloudflare Pages del proyecto `newlandingpage`, o pedirle a Claude Code que lo confirme contra la API de Cloudflare.
```

---

## Sección 2 · Editar un caso de portafolio — actualizar el punto 5

El texto actual dice "Estado real al 2026-07-25: a SOFI le falta banner y a HackSureste le falta logo (ambos son de los 4 casos LIVE en /portfolio)". Esto ya no es correcto (hoy hay 15 casos LIVE, no 4). Reemplazar esa última frase por:

```
Estado al 2026-08-12: hay 15 fichas publicadas en `/portfolio` (no 4). Verifica banner/logo caso por caso si una tarjeta muestra "Sin imagen publicable".
```

Y agregar un punto nuevo al final de la sección 2 (después del punto 5):

```
6. **Evidencia visual** (agregada 2026-08-11): la propiedad `Evidencia visual` (Files, multi) acepta solo fotos — se cachean localmente en build igual que banner/logo. Los videos van en la propiedad `Videos de evidencia` como texto libre, una URL por línea (formato opcional `Etiqueta | URL`) — **nunca como archivo subido a Notion**, siempre un link externo (YouTube/Drive), para no romper el límite de tamaño de Cloudflare Pages.
```

---

## Sección 5 · Qué NO se edita desde Notion — actualizar primer punto

El texto actual dice "Las páginas legacy servidas desde `public/` (casos viejos en HTML plano, política de privacidad, términos, 404)". Política de privacidad y términos ya NO son HTML legacy en `public/` — son páginas Astro reales desde 2026-08-12, pero tampoco leen de Notion. Reemplazar por:

```
- Las páginas legacy servidas desde `public/` (los 4 casos viejos en HTML plano) — no leen de Notion, son archivos estáticos.
- Política de privacidad, términos y condiciones, y la página de Docencia — son páginas Astro reales (comparten Navbar/Footer con el resto del sitio), pero su contenido está escrito directo en código, no viene de Notion.
```

---

No se tocó nada más de la página (Sección 1, 3, 3b y 6 siguen vigentes tal cual). Fuente de la verificación de cada punto: CLAUDE.md del repo (secciones 1 y 3) y el estado real confirmado en esta sesión (2026-08-12).
