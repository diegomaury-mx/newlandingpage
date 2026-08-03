# SEO Model — Diego Maury Platform

**Estado (2026-08-03):** parcialmente implementado. Este documento se escribió en Sprint 0.5 (pre-Astro) para una arquitectura de plataforma más amplia (Case Study/Project/Playbook/Insight/About/Contact) que nunca se construyó así. El sitio real hoy tiene 6 páginas: `/`, `/portfolio`, y 4 casos (`/portfolio/{heineken-green-challenge,redux,hacksureste,sofi}`). Ver `docs/platform/seo-keyword-mapping-2026-08-03.md` para el diagnóstico completo y el mapeo de keywords real por página.

---

## Principios SEO

1. Cada página responde una única intención de búsqueda.
2. Los metadatos son consecuencia de una estrategia de contenido aprobada, no decisiones técnicas.
3. La autoridad se construye desde el contenido y los enlaces, no desde el markup.
4. Claude Code implementa el modelo SEO técnico. Las keywords y el ángulo de cada página se definen junto con Diego (ver mapeo de keywords).

---

## 1. Metadata

### Patrón real implementado (2026-08-03)

| Página | `<title>` | `<meta name="description">` | Fuente |
|--------|-----------|------------------------------|--------|
| Home (`/`) | Bloque SEO de Notion (`siteCopy`); fallback en código: `Diego Maury · Strategic Program Director` | Bloque SEO de Notion; fallback en código incluye el experimento "consultor" (ver mapeo de keywords, punto 3) | `src/pages/index.astro` |
| `/portfolio` | `Portafolio · Diego Maury` | Fija en código, describe el agregador (no compite por keyword de ningún caso) | `src/pages/portfolio.astro` |
| Caso (`/portfolio/[slug]`) | Título corto ≤60 car. por caso (`SEO_SHORT_TITLES` en `[slug].astro`, ej. `REDUX · Bootcamp de economía circular · Diego Maury`) | `objective`/`cardContext`/`role` de Notion, truncado a 155 car. | `src/pages/portfolio/[slug].astro` |

El `<title>` de caso y el `<h1>` visible de la página son campos independientes desde 2026-08-03: el `<h1>` sigue usando el `resultHeadline` narrativo completo (frase larga, sin límite de caracteres); el `<title>` usa una versión corta controlada. No sincronizarlos de nuevo — ver hallazgo técnico 2 del mapeo de keywords.

### Reglas técnicas

- `<title>` máximo 60 caracteres.
- `<meta name="description">` máximo 160 caracteres.
- No repetir el título exacto en la description.
- No hay archivos con frontmatter en este CMS (todo el contenido viene de Notion vía `astro:content` loaders): la fuente que sobreescribe el patrón automático es el bloque SEO de Notion para home, y el mapa `SEO_SHORT_TITLES` en código para los `<title>` de caso (sección 5 de este documento no aplica frontmatter, corrige mención previa).

---

## 2. Open Graph

**Estado real:** implementado en `BaseLayout.astro` (recibe `ogType`/`ogImage` como props). Los 4 casos pasan `ogImage={entry.data.banner}`. Home y `/portfolio` NO pasan `ogImage` — sin imagen propia, `BaseLayout` cae a Twitter Card `summary` en vez de `summary_large_image` (pendiente, recomendación 3 del mapeo de keywords, no implementada en esta sesión).

Patrón por página (vía `BaseLayout`):

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="{canonicalUrl}" />
<meta property="og:title" content="{seoTitle}" />
<meta property="og:description" content="{seoDescription}" />
<meta property="og:image" content="{ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="es_MX" />
<meta property="og:site_name" content="Diego Maury" />
```

### Imágenes OG

- Dimensiones: 1200×630 px
- Formato: `.png` o `.webp`
- Ubicación: `public/og/`
- Convención de nombre: `og-{slug}.png`
- Imagen fallback (home/genérica): `og-default.png`

Para Case Studies y Playbooks: generar imagen OG específica con título + organización/framework.

---

## 3. Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@diegomaurymx" />
<meta name="twitter:creator" content="@diegomaurymx" />
<meta name="twitter:title" content="{seoTitle}" />
<meta name="twitter:description" content="{seoDescription}" />
<meta name="twitter:image" content="{ogImage}" />
```

Nota: Reusar la misma imagen OG para Twitter Card.

---

## 4. Canonical

```html
<link rel="canonical" href="{canonicalUrl}" />
```

- `canonicalUrl` = `https://diegomaury.mx/{path}`
- Todas las páginas deben tener canonical explícito.
- No existen duplicados de contenido en la plataforma (no hay paginación que genere duplicados en esta etapa).

---

## 5. JSON-LD (Structured Data)

### Schema por tipo de página (real, implementado 2026-08-03)

#### Home — `Person` (implementado, `src/pages/index.astro`)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Diego Maury",
  "url": "https://diegomaury.mx",
  "jobTitle": "Strategic Program Director",
  "sameAs": ["https://www.linkedin.com/in/diegomaury/"],
  "knowsAbout": [
    "Dirección de programas de innovación",
    "RevOps",
    "Ecosistemas de emprendimiento en LATAM",
    "Consultoría de innovación"
  ]
}
```
`jobTitle` = decisión vigente del Diagnóstico de Portafolio D (julio 2026). El último ítem de `knowsAbout` ("Consultoría de innovación") es el experimento paralelo descrito en el mapeo de keywords, punto 3 — no toca el copy visible, se evalúa a 90 días con Search Console.

#### `/portfolio` — `ItemList` (implementado, `src/pages/portfolio.astro`)
Lista los casos publicados (Insignia + Soporte) con `url` y `name` (usa `resultHeadline` o `title` de cada ficha).

#### Caso (`/portfolio/[slug]`) — `CreativeWork` (implementado, `src/pages/portfolio/[slug].astro`)
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{resultHeadline o title}",
  "description": "{pageDescription}",
  "url": "{canonicalUrl}",
  "author": { "@type": "Person", "name": "Diego Maury", "url": "https://diegomaury.mx" },
  "image": "{banner, si existe}"
}
```

No existen tipos "Case Study" separados de "Article", ni Playbook/Insight/Project: esos tipos de página del diseño original de Sprint 0.5 no se construyeron. Si se agregan en el futuro, definir su JSON-LD entonces — no mantener aquí specs de páginas que no existen.

---

## 6. Robots

### `robots.txt` (real, `public/robots.txt`, copiado a `dist/` por Astro)

```
User-agent: *
Allow: /

Sitemap: https://diegomaury.mx/sitemap.xml
```

No hay exclusiones activas. Revisar si se necesitan al agregar contenido en draft (hoy las fichas `draft`/`Archivo` ya quedan fuera del sitemap por no generar ruta propia, ver sección 7).

---

## 7. Sitemap

Generado automáticamente por `@astrojs/sitemap` (configurado en `astro.config.mjs`, ya activo). Incluye `/`, `/portfolio` y cada `/portfolio/{slug}` con `draft: false`. No incluye páginas legacy servidas desde `public/` (`portfolio/*.html`, `cases/*.html`) ni las páginas legales `.html`.

---

## 8. llms.txt

`src/pages/llms.txt.ts` (implementado) genera el `llms.txt` real filtrando por canal `llms.txt` del CMS — distinto del `llms.txt`/`llms-full.txt` estático que vive en la raíz del repo (ver CLAUDE.md §1). No confundir ambos al editar.

---

## Historial: dependencias resueltas

Estas dependencias de producto del diseño original (Sprint 0.5) quedaron resueltas o descartadas — no quedan pendientes activos de este modelo:

- `jobTitle`/`knowsAbout` de JSON-LD Person: resuelto 2026-08-03 (ver sección 5).
- Keywords primarias/secundarias por página: resuelto 2026-08-03, ver `docs/platform/seo-keyword-mapping-2026-08-03.md`.
- "Categorías de Insights" y "Ángulo SEO de Case Study y Playbook": descartado — esos tipos de página no existen en el sitio real de 6 páginas.

Pendiente real y abierto: `ogImage` para `/` y `/portfolio` (sección 2).
