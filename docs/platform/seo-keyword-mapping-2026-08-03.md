# Investigación y mapeo de keywords — diegomaury.mx

**Fecha:** 2026-08-03
**Alcance:** las 6 páginas Astro reales del sitio (`/`, `/portfolio`, 4 casos). Verificado contra código (`src/pages/*.astro`, `src/layouts/BaseLayout.astro`, `src/config/site.ts`) y contra el sitio LIVE (`diegomaury.mx/portfolio`, vía fetch). No incluye páginas legacy (`portfolio/*.html` en `public/`, `cases/*.html`) porque son stubs de redirect sin contenido indexable propio.
**Posicionamiento vigente:** portafolio de casos, no venta de consultoría (pivote 2026-07-24). El copy no vende un servicio, publica evidencia.

---

## 1 · Estado real por página (verificado en código)

| URL | `<title>` actual | Meta description actual | Canonical | JSON-LD | OG image |
|---|---|---|---|---|---|
| `/` | Definido en Notion (bloque SEO de `siteCopy`); fallback: `Diego Maury · Strategic Program Director` | Fallback: *"Strategic Program Director: diseño programas, procesos y sistemas que convierten la estrategia en ejecución y capacidad organizacional."* | **No se pasa** (`BaseLayout` en `index.astro:342-345` solo recibe `title`/`description`) | **No se pasa** | **No se pasa** → Twitter cae a `summary`, no `summary_large_image` |
| `/portfolio` | `Portafolio · Diego Maury` | *"Programas de innovación, arquitecturas RevOps y ecosistemas de emprendimiento en LATAM. Cada caso publica su estado de evidencia."* | Sí | `ItemList` | No se pasa (mismo efecto: Twitter cae a `summary`) |
| `/portfolio/heineken-green-challenge` | `{resultHeadline} · Diego Maury` | `objective`/`cardContext`/`role` de Notion, truncado a 155 car. | Sí | `CreativeWork` | Sí (`banner` del caso) |
| `/portfolio/redux` | ídem | ídem | Sí | `CreativeWork` | Sí |
| `/portfolio/hacksureste` | ídem | ídem | Sí | `CreativeWork` | Sí |
| `/portfolio/sofi` | ídem | ídem | Sí | `CreativeWork` | Sí |

### Hallazgo técnico 1 — Home sin canonical ni structured data
`src/pages/index.astro:342-345` construye `<BaseLayout title={pageTitle} description={pageDescription}>` sin `canonicalUrl` ni `jsonLd`. Es la única página del sitio sin `<link rel="canonical">` y sin JSON-LD. `docs/platform/seo-model.md` (Sprint 0.5, sin implementar) ya definía un schema `Person` para home — nunca se montó. Impacto: Google puede indexar `/` y `/index.html` (o variantes con parámetros) como URLs distintas sin señal de cuál es la canónica, y se pierde la oportunidad de un Knowledge Panel básico (`Person` + `sameAs` a LinkedIn).

### Hallazgo técnico 2 — Títulos de caso exceden por mucho los 50-60 caracteres recomendados
`portfolio/[slug].astro:62` usa `${displayTitle} · Diego Maury}` donde `displayTitle` es el H1 narrativo completo del caso (`resultHeadline`), no un título corto. Ejemplo real (verificado en LIVE, `/portfolio/redux`):

> `Diseñé el bootcamp de economía circular más grande de Latinoamérica, y publiqué su metodología completa · Diego Maury`

≈118 caracteres — casi el doble del límite. Google trunca el `<title>` en SERP (~60 car.) y probablemente reescribe el snippet visible, lo que le quita a Diego el control de qué keyword aparece primero en el resultado de búsqueda. Los 4 casos comparten este patrón.

### Hallazgo técnico 3 — Riesgo leve de canibalización interna
S4 ("Casos destacados") y S6 ("Sistemas propios") de la home (`index.astro`) reutilizan el mismo `resultHeadline`/copy de cada caso en tarjetas dentro de `/`. No es contenido duplicado indexable como página aparte, pero sí diluye la unicidad del H1/título del caso frente a Google si el fragmento de home rankea antes que la página de caso para esa frase específica. No requiere fix estructural, sí vigilancia si algún caso empieza a perder posición frente a su propia mención en home.

---

## 2 · Intención de búsqueda por página

| URL | ¿Quién llega y qué busca? |
|---|---|
| `/` | (a) Búsqueda de marca: "Diego Maury". (b) Búsqueda de rol: alguien evaluando contratar/referenciar a un "director de programas" o similar para innovación/RevOps en LATAM. |
| `/portfolio` | Alguien que ya conoce a Diego (o llegó por un caso) y quiere ver el catálogo completo de trabajo verificable. |
| `/portfolio/heineken-green-challenge` | Búsqueda de marca del programa ("HEINEKEN Green Challenge") o de la categoría ("programa de sustentabilidad corporativa LATAM"). |
| `/portfolio/redux` | Búsqueda del programa ("REDUX Tec de Monterrey") o de la categoría ("bootcamp de economía circular"). |
| `/portfolio/hacksureste` | Búsqueda del evento ("HackSureste hackathon") o de la categoría ("cómo fundar un hackathon universitario"). |
| `/portfolio/sofi` | El cliente está anonimizado ("PropTech confidencial"), así que no hay búsqueda de marca del cliente disponible. Intención realista: la categoría/sistema ("agente de WhatsApp para ventas inmobiliarias", "automatizar captación con IA"). |

---

## 3 · Mapeo: 1 keyword primario por URL

| URL | Keyword primario | Keywords secundarios | Notas |
|---|---|---|---|
| `/` | **Diego Maury** (marca) | director de programas de innovación LATAM · consultor ecosistemas de emprendimiento · Strategic Program Director México | "Strategic Program Director" en inglés dentro de un sitio en español (`site.language: es-MX`) es una etiqueta de marca personal, no un término de búsqueda real en español — no compite por volumen, solo refuerza marca. No cambiar sin decisión de Diego (es su título elegido). |
| `/portfolio` | **portafolio de casos de innovación y emprendimiento LATAM** | casos de éxito RevOps · portafolio director de programas | Página agregadora — no debe competir con los casos individuales por sus keywords específicos (hoy no lo hace: su description es genérica). |
| `/portfolio/heineken-green-challenge` | **HEINEKEN Green Challenge** | programa de sustentabilidad corporativa · innovación sureste México · HEINEKEN FEMSA sustentabilidad | Único caso con marca de cliente pública y buscable directamente. |
| `/portfolio/redux` | **REDUX bootcamp economía circular** | bootcamp economía circular Latinoamérica · Tec de Monterrey INCmty economía circular | "el más grande de Latinoamérica" (claim propio, no cifra SSOT nueva) es diferenciador de intención — vale la pena que aparezca literal en el `<title>` corto, no solo en el H1 largo. |
| `/portfolio/hacksureste` | **HackSureste hackathon** | fundar hackathon universitario desde cero · hackathon innovación sureste mexicano | Caso de "fundación desde cero": buena intención informacional además de la de marca. |
| `/portfolio/sofi` | **agente de WhatsApp para ventas inmobiliarias con IA** | automatización de captación comercial · SOFI WhatsApp sales agent | Sin marca de cliente disponible (anonimizado a propósito, ver CLAUDE.md — no revertir). El ángulo de keyword tiene que ser el sistema (SOFI), no el cliente. |

No se detectó canibalización real entre páginas: cada caso tiene un keyword de marca/programa único y no se repiten entre sí.

---

## 4 · Recomendaciones priorizadas (solo diagnóstico — no se tocó código en esta sesión)

1. **[Alto]** Agregar `canonicalUrl` y un JSON-LD `Person` a `/` en `index.astro` (patrón ya definido y sin usar en `docs/platform/seo-model.md` sección 5). Requiere decidir `jobTitle`/`knowsAbout` — dependencia de producto marcada ahí desde Sprint 0.5, sigue sin resolver.
2. **[Alto]** Dar a cada caso un `<title>` corto y controlado (ej. `REDUX · Bootcamp de economía circular · Diego Maury`, ≤60 car.) en vez de usar el H1 narrativo completo como título de pestaña/SERP. El H1 en la página puede seguir siendo la frase larga — son campos distintos.
3. **[Medio]** Definir `ogImage` para `/` y `/portfolio` (hoy caen a Twitter Card `summary` en vez de `summary_large_image`, perdiendo superficie visual al compartir el link).
4. **[Bajo]** Actualizar `docs/platform/seo-model.md`: describe tipos de página que no existen (Playbook, Insight, Project) y no refleja el modelo real de 6 páginas ni que sitemap/robots.txt/JSON-LD de caso YA están implementados. Es la referencia de "SEO Model" del proyecto pero quedó congelada en Sprint 0.5.

---

## 5 · Fuentes verificadas

- Código: `src/pages/index.astro`, `src/pages/portfolio.astro`, `src/pages/portfolio/[slug].astro`, `src/layouts/BaseLayout.astro`, `src/config/site.ts`.
- Sitio LIVE: `https://diegomaury.mx/portfolio` (fetch 2026-08-03, confirma slugs reales: `sofi`, `hacksureste`, `heineken-green-challenge`, `redux`) y `https://diegomaury.mx/portfolio/redux` (confirma H1/título real).
- `robots.txt` y `astro.config.mjs` (sitemap vía `@astrojs/sitemap`, confirmado activo).
