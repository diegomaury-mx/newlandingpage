# Spec: Portafolio Profesional — Diego Maury
**Fecha:** 2026-04-24  
**Estado:** Aprobado  
**URL objetivo:** diegomaury.mx (GitHub Pages)

---

## 1. Stack técnico

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- Sin build system (Vite opcional si se necesita en el futuro)
- Despliegue: GitHub Pages (rama `gh-pages` o carpeta `/docs`)
- Servidor de desarrollo: `python -m http.server 8080` o `npx serve .`

---

## 2. Arquitectura de archivos

```
/
├── index.html
├── portfolio/
│   └── index.html              # Galería completa filtrable por año
├── cases/
│   ├── heineken.html           # CASE 1
│   ├── innovation-systems.html # CASE 2
│   └── redux-incmty.html       # CASE 3
├── cv/
│   └── diego-maury-cv.pdf
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── main.js
    └── img/
        ├── isotipodm.svg       # https://diegomaury.mx/assets/img/isotipodm.svg
        └── logo.png
```

---

## 3. Sistema de diseño

### 3.1 Paleta de color

| Token | Hex | Uso |
|-------|-----|-----|
| `--purple` | `#2E1547` | Hero, Contacto, Footer, headers de casos |
| `--ink` | `#0F0A1A` | Todas las secciones interiores |
| `--blaze` | `#EA580C` | CTAs primarios, tagline, accents |
| `--spark` | `#E6B800` | Números de caso, tags, énfasis puntual |
| `--white` | `#FFFFFF` | Texto principal sobre oscuro |
| `--white-60` | `rgba(255,255,255,0.6)` | Texto secundario |
| `--white-10` | `rgba(255,255,255,0.1)` | Bordes sutiles, separadores |

**Regla 60·30·10:** Purple/Ink dominan · Blaze solo en CTAs y tagline · Spark solo en métricas y tags.

### 3.2 Tipografía

| Familia | Peso | Uso |
|---------|------|-----|
| Satoshi | 800 | Headlines, nombre de secciones, números grandes |
| Inter | 400/500 | Body, descripciones, copy largo |
| JetBrains Mono | 400 | Labels, tags, métricas, etiquetas de rol, fechas |

Fuentes vía CDN (Fontshare para Satoshi, Google Fonts para Inter/JetBrains Mono).

### 3.3 Textura de fondo — Isotipo pattern

El isotipo SVG (`isotipodm.svg`) se usa como fondo decorativo en **todas las secciones** (tanto Purple como Ink):

- Grupos de 6 en disposición de panal (honeycomb)
- Opacidad: `0.06` sobre Ink · `0.05` sobre Purple
- Color: blanco (`fill="white"`, `stroke="white"`)
- Tamaño por isotipo: `80–100px`
- Implementación: `div.bg-pattern` con `position: absolute; inset: 0; pointer-events: none; overflow: hidden`. El SVG se embebe como `background-image: url("data:image/svg+xml,...")` en un grid CSS de ~100px, o se repite como elemento inline dentro del div. Ambos enfoques son válidos; preferir CSS background-image para menor peso en el DOM.

### 3.4 Breakpoints

| Nombre | Ancho |
|--------|-------|
| mobile | 375px |
| tablet | 768px |
| desktop | 1280px |

### 3.5 Animaciones

Solo propiedades compositor-safe: `transform` y `opacity`.  
`will-change` solo cuando sea necesario, removido después del trigger.  
Respetar `prefers-reduced-motion`.

---

## 4. Secciones — index.html

### 4.1 Nav (sticky)

- Fondo: `rgba(15, 10, 26, 0.92)` con `backdrop-filter: blur(12px)`
- Izquierda: isotipo pequeño + "Diego Maury" en Satoshi
- Derecha: links Work / Servicios / About / Contacto en JetBrains Mono
- Activo: subrayado en Blaze

### 4.2 Hero (Purple `#2E1547`)

Estructura vertical centrada con máximo ancho de 800px:

1. **Etiqueta** — JetBrains Mono, color Blaze: `STRATEGIC PROGRAM & INNOVATION MANAGER`
2. **Headline** — Satoshi 800, blanco, ~clamp(2.5rem, 5vw, 4.5rem): *"Programas y sistemas que convierten innovación en resultados medibles."*
3. **Sub** — Inter 400, blanco 60%, 1–2 líneas en español
4. **CTAs** — fila horizontal: `Descargar CV` (fondo Blaze) + `Agendar llamada` (outline blanco)
6. **Banda de métricas** — separada del bloque anterior por línea `rgba(white, 0.1)`, 3 columnas con separadores verticales:
   - `30+` Programas implementados
   - `900+` Proyectos evaluados  
   - `3,000+` Emprendedores impactados
   - Números en Satoshi 800, labels en JetBrains Mono tiny

### 4.3 Selected Work (Ink `#0F0A1A`)

Título de sección: `Selected Work` en Satoshi + subtítulo pequeño en mono.

**3 filas editoriales**, cada una es un bloque horizontal cliqueable:

```
[01]  HEINEKEN Green Challenge          +600%
      ECOSISTEMAS · PROGRAM OPS · 2019–2022   →
```

- Número: Satoshi 800 grande, color Spark
- Nombre: Satoshi 700 blanco
- Meta: JetBrains Mono tiny, blanco 50%
- Métrica: JetBrains Mono, color Blaze, alineada a la derecha
- Hover: fondo `rgba(white, 0.04)`, flecha animada
- Cada fila enlaza a `/cases/*.html`

Al final: botón `Ver todos los proyectos →` (outline blanco) → `/portfolio/index.html`

### 4.4 Servicios (Ink `#0F0A1A`)

3 tarjetas en grid (3 col desktop, 1 col mobile), borde `rgba(white, 0.1)`, radio 8px:

| Servicio | Tag |
|----------|-----|
| Program Sprint | ESTRATEGIA |
| Digital Ops Setup | OPERACIÓN |
| Ecosystem Playbook | ECOSISTEMAS |

Cada tarjeta: tag en JetBrains Mono Spark · nombre en Satoshi · entregables en Inter · rango de tiempo en mono.

### 4.5 About (Ink `#0F0A1A`)

Dos columnas en desktop (texto izquierda, datos derecha), una columna en mobile.

- **Bio** — párrafo en Inter en español, en clave PM operativo (scope, stakeholders, herramientas, forma de trabajo)
- **Datos:** herramientas en chips con fondo `rgba(white,0.07)`, cadencia de trabajo, stack

### 4.6 Experiencia (Ink `#0F0A1A`)

4 roles en lista vertical. Cada rol:

- Empresa + período: JetBrains Mono, blanco 50%
- Título del rol: Satoshi 700 blanco
- 2 logros: Inter con bullet en Blaze, formato: verbo + qué + impacto + timeframe

### 4.7 Contacto (Purple `#2E1547`)

3 bloques horizontales (o grid 3 col):

- **Calendario** — "Para proyectos y consultoría" + CTA Blaze
- **Email** — dirección en JetBrains Mono + CTA outline
- **LinkedIn** — handle + CTA outline

**Footer:** línea tricolor Purple→Ink→Blaze de 3px · tagline `HAGAMOS QUE LAS COSAS PASEN.` en JetBrains Mono Blaze · copyright Inter tiny blanco 40%.

---

## 5. Páginas de casos — /cases/*.html

Misma nav que index. Estructura fija para los 3 casos:

1. **Header del caso** — fondo Purple, etiqueta de industria, título del caso, 1 métrica destacada
2. **Contexto** — 2–3 párrafos sobre el programa/empresa
3. **Problema** — qué estaba roto o faltando
4. **Objetivo** — métrica + definición + timeframe
5. **Mi rol** — alcance, stakeholders, equipo
6. **Acciones** — 3–5 bullets con verbo activo
7. **Resultados** — 3–6 métricas normalizadas (número + unidad + baseline + timeframe + significado)
8. **Evidencia** — links, imágenes, documentos (si disponibles)
9. **Aprendizajes** — 2–4 bullets
10. **Nav de casos** — `← Caso anterior` / `Siguiente caso →` + `Ver todos los proyectos`

---

## 6. Página de portafolio — /portfolio/index.html

- Header Purple (mismo isotipo pattern)
- Filtros por año: `Todos | 2015 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023` — JetBrains Mono, activo en Blaze
- Grid de proyectos: 3–4 col desktop, 2 col tablet, 1 col mobile
- Cada tarjeta: logo/banner del proyecto (desde Notion assets), nombre, año, tags
- Animación de filtrado: `opacity` + `transform` en `200ms`
- Botón al final: `← Volver al inicio`

---

## 7. Performance

| Métrica | Target |
|---------|--------|
| JS (gzipped) | < 80 KB |
| CSS (gzipped) | < 15 KB |
| LCP | < 2.5s |
| CLS | < 0.1 |

- Imágenes en WebP con fallback PNG
- `loading="lazy"` en todo excepto hero
- Fonts con `font-display: swap`
- Isotipo pattern en SVG inline (no request adicional)

---

## 8. SEO básico

- `<title>`: "Diego Maury — Strategic Program & Innovation Manager"
- Meta description: frase núcleo ES
- `<h1>` único por página
- `lang="es"`
- `robots.txt` y `sitemap.xml` básicos

---

## 9. Copy oficial confirmado

### Hero — headline + sub
Usar opción 1 (oficial):
- **Headline:** "Strategic Program & Innovation Manager"
- **Sub:** "Programas y sistemas que convierten innovación en resultados medibles."

### About corto
> Soy Strategic Program & Innovation Manager. Diseño y opero programas de innovación, emprendimiento y transformación digital en LATAM. Convierto objetivos ambiciosos en sistemas ejecutables con cadencia, stakeholders claros y métricas.

### CTAs
El sitio sirve tanto para búsqueda de empleo como para clientes. Usar ambos en el hero:
- **Primario (Blaze):** "Descargar CV"
- **Secundario (outline):** "Agendar llamada"

En la sección Contacto, segmentar por intención:
- Empleo: "Agendar entrevista"
- Clientes: "Agendar diagnóstico" / "Ver servicios"

### Plantilla de caso de estudio (formato canónico)
1. Contexto
2. Objetivo (métrica + definición + timeframe)
3. Mi rol (alcance, stakeholders)
4. Acciones (3–5 bullets)
5. Resultados (métrica + definición + timeframe)
6. Evidencia (links, PDFs, screenshots)
7. Aprendizajes

**Formato de cada logro:** Verbo + qué + cómo + impacto + timeframe.

---

## 10. Contenido — estado por sección

Todo el contenido es en español únicamente. No hay toggle de idioma.

### Disponible para implementar de inmediato
- [x] Posicionamiento, headline y tagline — definido en Brand Hub
- [x] 3 métricas del hero (30+ / 900+ / 3,000+) — confirmadas
- [x] **CASE 1 — HEINEKEN Green Challenge:** transcripción de entrevista completa disponible en Notion (`3380fe3c51c581c89884f5d6e606b9a8`). Incluye: situación inicial (36 registros), diagnóstico, acciones (CJM, virtualización, Redux), resultados (+600%, referente nacional), aprendizajes y anécdotas.

### Pendiente — requiere completar entrevistas en Notion
- [ ] **CASE 2 — Innovation Systems Builder** (FlipHouse / HackSureste / CAVA Soft): notas de reunión existen pero transcripción omitida. Métricas clave confirmadas (+500% leads FlipHouse).
- [ ] **CASE 3 — REDUX + INCmty:** preguntas listas en Notion, respuestas pendientes. Métricas clave confirmadas (1,000+ estudiantes, 32 estados, 900+ proyectos evaluados).

### Pendiente — redacción
- [ ] Copy de About en clave PM operativo
- [ ] 4 roles de Experiencia con 2 logros medibles c/u
- [ ] 3 descripciones de Servicios (Program Sprint / Digital Ops Setup / Ecosystem Playbook) con entregables y tiempos
- [ ] CV PDF actualizado
