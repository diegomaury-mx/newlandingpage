# Prueba social · Testimonios en index.html

**Fecha:** 2026-07-22
**Estado:** Aprobado, pendiente de implementación

## Contexto

El sitio no tiene ninguna forma de prueba social externa (testimonios, validación de terceros). Diego tiene el verbatim completo en Notion (página "💬 Prueba Social · Testimonios y Validación Externa") y una cuenta de Senja (`senja.io/p/diegomaury`) con un widget ya creado.

Restricción de partida: el sitio es HTML estático puro, sin pipeline Notion→sitio (ver `CLAUDE.md` sección 1 y `docs/platform/notion-astro-contract.md`). El scaffold de Astro/Diego CMS existe pero no está desplegado y su cadena de tareas no cubre testimonios todavía. Construir un CMS propio de testimonios ahora duplicaría lo que Senja ya resuelve (panel de edición, layouts, curaduría) — se descarta explícitamente.

## Decisión de arquitectura de datos

- **SSOT del verbatim:** la página de Notion "Prueba Social · Testimonios y Validación Externa" sigue siendo la fuente canónica del texto exacto de cada testimonio.
- **Capa de gestión/display:** Senja. Un testimonio nuevo entra primero a Notion, luego se sube a Senja. Diego edita/agrega testimonios desde el panel de Senja sin tocar código ni hacer deploy.
- **Diego CMS (Astro) queda fuera de alcance** para testimonios. No se crea colección `testimonials` en `src/content/config.ts` en esta tarea.

## Diseño

### Ubicación en index.html

Dos puntos de inserción, elegidos porque los testimonios actuales son endorsements generales de carácter/profesionalismo (no validaciones de resultados por caso con métricas) — no hay base real para distribuirlos caso por caso:

1. **Sección `prueba-social`** — nueva `<section>` entre `id="ip"` (Sistemas propios) y `id="servicios"`. Es el cierre natural del arco de propuesta de valor ("entrego sistemas, no tareas") antes de pasar a precios.
2. **Bloque de tarjeta individual** — inmediatamente antes de `id="contacto"` (CTA final). Un solo testimonio contundente (candidato: Shaili Zappa) como último empujón de confianza.

### Contenido de la sección `prueba-social`

- 3 fragmentos de testimonios en **HTML estático** (indexables por Google, el widget de Senja carga vía JS de tercero y se indexa mal):
  - **Shaili Zappa** (Technical Recruiter, Platzi — fue su supervisora, LinkedIn: linkedin.com/in/shailizappa): *"Diego is a truly extraordinary person to work with. He is constantly and consistently offering new ideas... The results Diego brings to his work are always above what is expected of him."*
  - **Jorge Acevedo Pallares** (Director de Carbono y Sustentabilidad, Agencia Mexicana de Estudios Antárticos): *"Su ambición de hacerlo diferente... el pensamiento lateral en la resolución de problemas... la capacidad colaborativa de conocer y reunir a los mejores."*
  - **Victor Calzadillas** (Community Builder, Startup Chihuahua): *"En mi tiempo de conocer a Diego, el ha liderado iniciativas de las mas grandes que jamás haya visto México... Hackathon Nacional Redux, en el cual el fue mi proveedor."*
  - Excerpts, no el párrafo completo. Texto verbatim de Notion, sin parafrasear (recortes marcados con "..." donde se trunca).
  - Cada card incluye: cita, nombre, rol/organización, link a LinkedIn si existe.
- Debajo de los 3 fragmentos, el **widget grid/carousel de Senja** (`93ff9581-ba54-4ba8-a053-f7d0889cd4d0`) con el resto de testimonios curados desde el panel de Senja.

### Contenido del bloque antes de `contacto`

- Widget de Senja de **tarjeta individual**, curado en Senja con un solo testimonio (candidato: Shaili Zappa).
- **Pendiente:** este widget no existe todavía en Senja. Se deja el markup comentado con un placeholder claro (`<!-- TODO: pegar embed Senja widget individual -->`) hasta que Diego lo cree y pase el embed.

### Markup y estilo

- `.testimonial-card`: reutiliza tokens del design system existente (`--bg-2` superficie, `--border`, `--t1`/`--t2`/`--t3` para jerarquía de texto). Mismo patrón visual que `.ip`/`.svc` (superficie + borde, sin gradientes ni sombras).
- Nombre/rol en DM Mono, uppercase — mismo tratamiento que labels/eyebrows existentes en el sitio.
- Cero acento ember nuevo: la regla de "un ember por pieza" ya se cubre con el `section-label` existente en la página (precedente aceptado).
- `:focus-visible` estándar del DS en cualquier link (LinkedIn) dentro de las cards.

### Carga diferida de los widgets Senja

El embed que da Senja (`data-lazyload="false"`) carga el script en cuanto el navegador lo parsea, sin importar el scroll del usuario. Esto choca con el budget de performance del sitio (JS de terceros diferido, LCP < 2.5s) — ambos widgets están a mitad/final de página, no above-the-fold.

**Solución:** reutilizar el mismo patrón de `IntersectionObserver` que ya usa el sitio para las animaciones `data-reveal`. Un módulo JS nuevo observa los contenedores `#senja-grid-mount` y `#senja-single-mount`; cuando entran al viewport (rootMargin ~200px), inyecta dinámicamente el `<script src="https://widget.senja.io/widget/<id>/platform.js">` + el `<div class="senja-embed" data-id="...">` correspondiente. El script de Senja nunca se carga en el critical path inicial.

### Embed conocido (widget grid)

```html
<script src="https://widget.senja.io/widget/93ff9581-ba54-4ba8-a053-f7d0889cd4d0/platform.js" type="text/javascript" async></script>
<div class="senja-embed" data-id="93ff9581-ba54-4ba8-a053-f7d0889cd4d0" data-mode="shadow" data-lazyload="false" style="display: block; width: 100%;"></div>
```

Este HTML se inyecta vía JS (no vive estático en el DOM) para respetar la carga diferida descrita arriba.

## Fuera de alcance

- Colección `testimonials` en Astro/Diego CMS.
- Distribución de testimonios por caso de estudio (no hay contenido verbatim que lo respalde hoy; se revisita cuando existan testimonios caso-específicos).
- Creación del segundo widget de Senja (tarjeta individual) — la crea Diego en su panel; esta tarea deja el punto de integración listo con placeholder.
- Feedback de taller Wella y semblanza de terceros (quedan en Notion, no entran a esta iteración).

## Testing

- Verificar que el widget grid y el widget individual (cuando exista) cargan solo al hacer scroll cerca de su sección (Network tab, no debe haber requests a `widget.senja.io` en la carga inicial).
- `npm run lint` / `npm run test:a11y` / `npm run verify:visual` deben seguir pasando con las 2 secciones nuevas incluidas en el barrido de QA (agregar `index.html` ya está cubierto; verificar que las nuevas cards no rompan contraste AA ni estructura semántica).
- Verificar visualmente en 375/768/1440 que las 3 cards estáticas y el widget no rompen el ritmo del layout existente.
