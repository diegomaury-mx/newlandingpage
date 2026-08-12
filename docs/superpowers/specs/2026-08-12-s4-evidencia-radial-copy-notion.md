# Texto para pegar en Notion — S4 · Evidencia (Copy Oficial SSOT)

## Dónde

Página **"Copy Oficial · diegomaury.mx (SSOT)"** (`https://app.notion.com/p/d9ab8508660a43e8ac459386dd7903d9`), columna **"Versión Actual"**, toggle **`# S4 · Evidencia`**.

**No editar con `notion-update-page` / `update_content`** — la página tiene toggles + columns anidados y ese comando ya borró contenido hermano antes (ver memoria `notion-update-content-gotcha`). Pegar manualmente.

## Qué hacer

Borrar TODO el contenido actual dentro del toggle `S4 · Evidencia` (desde `# Dónde lo he aplicado` hasta el botón `→ Explorar portafolio completo`) y pegar exactamente esto en su lugar:

```
# Un mismo oficio. Distintos campos de aplicación.

He convertido estrategia en sistemas ejecutables en seis contextos.

---

**Centro**

PROGRAMAS, PROCESOS Y SISTEMAS

```
Innovación corporativa
Emprendimiento y aceleración
Tecnología, IA y automatización
Operaciones, RevOps y PropTech
Educación y desarrollo de talento
Sostenibilidad y ecosistemas
```

---

Una trayectoria construida entre corporativos, startups, universidades y ecosistemas.
```

**Notas de formato al pegar en Notion:**
- `**Centro**` va en negrita (como los demás labels tipo `**Título**` del bloque SEO) — Notion lo debe convertir en texto en bold, no en heading.
- El bloque entre los dos ` ``` ` debe quedar como un bloque de código real de Notion (tipo "Code"), igual que el diagrama ASCII de S3 — 6 líneas, una por campo, sin líneas en blanco entre ellas.
- Los `---` son separadores normales (divider blocks).
- No usar heading para "Centro" ni para los 6 campos — son texto plano / código, no headings.

## Por qué esta estructura exacta

El parser (`src/utils/parseSiteCopy.ts` + `src/pages/index.astro`) lee S4 así:

| Dato en el sitio | Se extrae de |
|---|---|
| Título (`h2`) | Primer heading `# ...` del bloque |
| Texto introductorio | Primer párrafo antes del bloque "Centro" |
| Nodo central del diagrama | Bloque de texto inmediatamente después de `**Centro**` |
| Los 6 campos del diagrama radial | El bloque de código, una línea = un campo |
| Cierre (debajo del diagrama) | Primer párrafo después del bloque de código |

Mientras este formato no esté en Notion, el sitio sigue mostrando el título/subtítulo viejos ("Dónde lo he aplicado...") y el diagrama radial completo no se renderiza (el código tiene un guard que lo oculta si no encuentra el nodo central) — no se rompe, pero tampoco se ve el diseño nuevo.

## Después de pegar

1. Verificar que el toggle `S4 · Evidencia` en Notion solo tenga: el heading, el intro, el divider, "Centro" + su valor, el bloque de código con los 6 campos, otro divider, y el párrafo de cierre. Nada de la tabla vieja, ni de "Casos destacados".
2. Avisar para correr `npx astro build` local y confirmar que el diagrama radial aparece con el contenido real de Notion.
3. Deploy normal: push a `master` → Cloudflare Pages reconstruye con el Notion actualizado.
