# SEO Model — Diego Maury Platform

**Sprint:** 0.5 — Definición técnica. Sin implementación.
**Implementación:** Sprint 5.

---

## Principios SEO

1. Cada página responde una única intención de búsqueda.
2. Los metadatos son consecuencia de una estrategia de contenido aprobada, no decisiones técnicas.
3. La autoridad se construye desde el contenido y los enlaces, no desde el markup.
4. Claude Code implementa el modelo SEO técnico. Las keywords y el ángulo de cada página lo define ChatGPT.

---

## 1. Metadata

### Patrón por tipo de página

| Página | `<title>` | `<meta name="description">` |
|--------|-----------|------------------------------|
| Home | `Diego Maury — [Tagline]` | [Definir en Sprint 3] |
| Case Study | `[Título del caso] — Diego Maury` | Máx. 160 caracteres. Incluye organización + resultado clave. |
| Project | `[Nombre] — Diego Maury` | Máx. 160 caracteres. Propósito + impacto. |
| Playbook | `[Título] — Playbook por Diego Maury` | Máx. 160 caracteres. Problema que resuelve. |
| Insight | `[Título] — Diego Maury` | Máx. 160 caracteres. Tesis central del artículo. |
| About | `Sobre Diego Maury` | Máx. 160 caracteres. |
| Contact | `Contacto — Diego Maury` | Máx. 160 caracteres. |

### Reglas técnicas

- `<title>` máximo 60 caracteres.
- `<meta name="description">` máximo 160 caracteres.
- No repetir el título exacto en la description.
- El campo `seoTitle` en frontmatter sobreescribe el patrón automático cuando existe.
- El campo `seoDescription` en frontmatter sobreescribe la description automática.

---

## 2. Open Graph

Implementar en todas las páginas:

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

### Schema por tipo de página

#### Home — `Person`
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Diego Maury",
  "url": "https://diegomaury.mx",
  "sameAs": [
    "https://linkedin.com/in/diegomaury",
    "https://x.com/diegomaurymx"
  ],
  "jobTitle": "[Definir en PRD]",
  "knowsAbout": ["[Definir en PRD]"]
}
```

#### Case Study — `Article`
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "author": {
    "@type": "Person",
    "name": "Diego Maury",
    "url": "https://diegomaury.mx"
  },
  "datePublished": "{publishedAt}",
  "description": "{seoDescription}",
  "url": "{canonicalUrl}"
}
```

#### Insight — `BlogPosting`
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{title}",
  "author": {
    "@type": "Person",
    "name": "Diego Maury"
  },
  "datePublished": "{publishedAt}",
  "dateModified": "{updatedAt}",
  "description": "{seoDescription}",
  "url": "{canonicalUrl}",
  "timeRequired": "PT{readingTime}M"
}
```

#### Playbook — `HowTo`
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{title}",
  "description": "{summary}",
  "author": {
    "@type": "Person",
    "name": "Diego Maury"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": "{step.order}",
      "name": "{step.title}",
      "text": "{step.description}"
    }
  ]
}
```

---

## 6. Robots

### `robots.txt` (actual, en raíz)

```
User-agent: *
Allow: /

Sitemap: https://diegomaury.mx/sitemap.xml
```

No bloquear ninguna sección durante Sprint 1. Revisar si se necesitan exclusiones al agregar contenido en draft.

---

## 7. Sitemap

### Estructura

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://diegomaury.mx/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://diegomaury.mx/cases/{slug}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.9</priority>
    <lastmod>{publishedAt}</lastmod>
  </url>
  <!-- projects, playbooks, insights, about, contact -->
</urlset>
```

### Implementación en Astro

Astro genera el sitemap automáticamente mediante `@astrojs/sitemap`. Se configura en `astro.config.ts` durante Sprint 1. Solo incluye páginas con `draft: false`.

---

## 8. llms.txt

El archivo `llms.txt` (ya existe en la raíz) sigue el estándar emergente para comunicar contexto a LLMs que visitan el sitio.

En Sprint 1, migrar y actualizar su contenido para reflejar la nueva arquitectura de la plataforma. El `llms-full.txt` se mantiene para contexto completo.

---

## Dependencias de producto (no implementables hasta Sprint 0 aprobado)

Los siguientes campos del modelo SEO dependen de decisiones de ChatGPT + Diego:

- `jobTitle` en JSON-LD Person
- `knowsAbout` en JSON-LD Person
- Keywords primarias y secundarias por página
- Categorías de Insights
- Ángulo SEO de cada Case Study y Playbook
