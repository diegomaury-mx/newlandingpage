# Design Evolution Brief — AI Prompt
## Diego Maury Design System "Ember on Ink" · v2 · 2026-09-10

Markdown plano a propósito. Pégalo en ChatGPT, Cursor, Claude Code, v0 o Lovable.
Solo contiene reglas ya confirmadas y hallazgos con evidencia. Tres decisiones de dirección de arte fueron confirmadas el 2026-09-10 (D-E, D-F, D-I) y están incorporadas abajo. Las tres que siguen abiertas (saturación del acento, display serif, isotipo) **no** están aquí: viven en `brand-art-direction-critique.md`.

---

## Contexto

Sistema de diseño personal, dark-first, un solo acento. Contrato de tokens limitado a color + tipografía (px literales son legales). Fuente de verdad: `v2-tokens.css`, confirmada por el dueño como versión vigente.

## Tokens vigentes (no inventar valores nuevos)

```css
--bg: #0A0612;        /* Deep Ink — fondo principal */
--bg-2: #1A1128;      /* Surface */
--bg-stage: #06030F;  /* fondo de escenario fuera del lienzo */
--border: #6A291B;
--t1: #FAF8FC;  --t2: #DDDBE0;  --t3: #A8A6AC;
--ember: #FF5C39;     /* acento único */

/* RETIRADO 2026-09-10 (D-V1) — no reintroducir. Un solo acento: --ember */

/* Modo claro — nombres canónicos */
--light-bg: #FAF8FC;  --light-text-1: #0A0612;
--light-text-2: #3D2A52;  --light-border: #E4DAEE;  --light-accent: #FF5C39;

/* Deprecados, retirar en v3.0: --bg-light, --t1-light, --t2-light, --border-light */

--sans: 'Plus Jakarta Sans', system-ui, sans-serif;  /* 300 400 500 700 + itálicas */
--mono: 'DM Mono', ui-monospace, monospace;          /* 400 500 */
```

## Reglas imperativas

1. **Ember solo en dos lugares:** eyebrow/label de sección y CTA. Prohibido en cifras, bullets, puntos de rol, tags, numeraciones de paso, barras decorativas y palabras sueltas de titular. El logo del nav no cuenta como violación.
2. **Un solo naranja.** No existe `--ember-cta` ni ningún segundo valor de naranja.
3. **Texto sobre Ember: siempre tinta `#0A0612`** (contraste real 6.53:1). Nunca `#fff` (3.07:1) ni `--t1` (3.32:1).
4. **Ember nunca como color de texto sobre fondo claro** (2.91:1). Sobre claro va acompañado de la tinta.
5. **Peso 300 en display >48px. Máximo 700 en todo lo demás.** El peso 800 no existe: no cargarlo en la URL de Google Fonts.
6. **DM Mono solo para cifras, fechas, labels y tagline**, siempre uppercase, letter-spacing 0.06–0.18em. Nunca párrafos. Solo pesos 400 y 500.
7. **Sin gradientes, drop shadows, blur decorativo, glow ni movimiento perpetuo decorativo.** Excepciones registradas y vigentes: `mask-image` de la foto de perfil, `backdrop-filter` del nav sticky y del modal, hover de elevación `translateY(-2/-3px)`.
8. **Logotipo:** `DIEGO MAURY` / `DIEGOMAURY.MX` en Plus Jakarta Sans 700, uppercase, letter-spacing 0.04em, `#FAF8FC` sobre fondo oscuro. Única excepción: impresión a una tinta sobre papel claro, en `#0A0612`.
8b. **La firma nunca es el nombre solo (2026-09-10).** El nombre escrito como texto no constituye firma de marca. La firma siempre incluye el isotipo, en una de tres formas: isotipo + nombre · isotipo + nombre + título · solo isotipo. El modo del isotipo lo determina el fondo (`isotipo-dark.svg` sobre oscuro, `isotipo-light.svg` sobre claro). Aplica a footers, cierres de documento, firmas de correo y cualquier pie de pieza.
9. **Procedencia obligatoria:** toda pieza o importa `v2-tokens.css`, o declara su `:root` local con `/* snapshot vX.Y — AAAA-MM-DD */` en la primera línea. Aplica también a documentación y a las copias distribuidas (`_ds/`, `design_handoff_*`).
10. **Espacio generoso.** Ante la duda, más espacio. Con el vocabulario de filete (regla 13) esto pasa de consejo a requisito: sin caja que agrupe, el aire es lo único que separa.
11. **Ember es bloque, no letra (D-F · 2026-09-10).** Ember ocupa un campo y el texto va encima en tinta `#0A0612`. Prohibido Ember como color de tipografía o de línea. Única excepción: la barra estructural de 3–4px (`.ember-bar-top`, `.ember-bar-left`). Esto sustituye el patrón de eyebrow naranja: el eyebrow va en `--t3`, y el bloque Ember queda para el CTA y para el label que abre una sección clave.
12. **Modo por canal (D-E · 2026-09-10).** Claro institucional para lo que se lee: sitio, propuestas, manual, correo, documentos. Deep Ink para escenario: poster, quote cards, deck, redes, portadas. No cambia ningún hex — la paleta clara ya existe (`--light-*`). Sustituye la regla "dark mode primario".
13. **Escala de cifras (D-K · 2026-09-10).** Las cifras van en Plus Jakarta Sans 700, tabulares, en tinta — no en DM Mono. Dos niveles y nada más: **hero metric / dato primario ≈ 52px** (uno o dos por vista, nunca una rejilla entera) y **cifra normal 19–22px**. El 52px no se propaga por defecto a todo lo que sea un número: si dos cifras del mismo bloque compiten al mismo tamaño, ninguna es primaria. DM Mono se queda en eyebrows, fechas, labels y metadata.
14. **Sin vocabulario de tarjeta (D-I · 2026-09-10).** Prohibidos `border-radius` en contenedores de contenido, fondos `--bg-2` usados como caja y bordes de 1px alrededor de bloques individuales. La información se separa con filetes de 1px y columnas. `--bg-2` solo como cambio de superficie a ancho completo de sección. El hover de elevación `translateY` desaparece con la tarjeta.

## Acciones ejecutables

### Bloqueantes — requieren decisión del dueño antes de tocar código

- **B1.** Declarar cuál de los dos sitios es producción: `uploads/index.html` (canonical `https://diegomaury.mx/`) o `ui_kits/version2/index.html` (canonical `/version2`). Archivar el otro en `archive/` con sello de fecha.
- **B2.** Resolver la contradicción entre la decisión del 2026-07-09 (`ui_kits/version2/index.html:64-67`: retira el Azul Medianoche, añade `--ember-cta:#BF452B`) y la del 2026-09-10 (manual: azul vigente, sin segundo naranja).
- **B3.** Confirmar si `uploads/` es directorio de despliegue real o espejo de otro repo.

### Quick wins — sin decisión pendiente

- **A1.** Corregir en el README el contraste de tinta sobre Ember: **12.2:1 → 6.53:1**, en sus tres apariciones (tabla de paleta, regla 11, changelog D-P3). Corregir `--light-accent`: 2.78 → **2.91:1**.
- **A2.** `uploads/index.html:131` y `:180` — `color:#fff` → `color:var(--bg)` sobre fondo Ember. Cierra el único fallo AA duro del sistema.
- **A3.** `uploads/index.html:60-66` — actualizar tres valores a la paleta vigente: `--border:#6A291B`, `--t2:#DDDBE0`, `--t3:#A8A6AC`.
- **A4.** Añadir sello de snapshot a las piezas que no lo tienen: `Tarjeta de Presentación.html:12`, `Portada LinkedIn.html:12`, `Manual de Marca.html:13` y las 11 piezas restantes con `:root` local.
- **A5.** Regenerar `_ds/diego-maury-…/v2-tokens.css` desde el canónico: le faltan `--bg-stage`, los cuatro alias de modo claro, y conserva `#9A8CB0` en `.lockup-role` (ya corregido a `var(--t2)` en el canónico). Sellar `design_handoff_azul_medianoche/v2-tokens.css` con su fecha.
- **A6.** Quitar `0,800` de la URL de Google Fonts en `uploads/index.html:54` y `ui_kits/version2/index.html:54`, y bajar a 700 los `font-weight:800` de `:171`, `:211`, `:237`, `:355`, `:395` — salvo el hero `.hero-h1` (`:210-213`), que a 4rem va en 300.
- **A7.** Favicon: `assets/img/isotipo-gradient.png` no existe. Apuntar a un asset real (`assets/isotipo-final-cuadrado.svg`) en las dos superficies.
- **A8.** Mover a `archive/` (no borrar) `assets/isotipo-ember-mrxkgyto-gb40.svg`, `assets/isotipo-light-mrxkqd6f-sc52.svg` y `assets/exports/`.

### Refactor de identidad — decisiones D-E / D-F / D-I confirmadas

- **A17.** Convertir los contenedores del sitio de producción a filete: quitar `border-radius` y `border: 1px solid` de `.work`, `.ip`, `.aut`, `.translator`, `.spine-step`, `.svc-card`, `.contact__card`, `.trust-chip`, `.work-tag`, `.ip-badge`; quitar los fondos `--bg-2` de caja; separar con filetes de 1px y aumentar el espacio vertical entre bloques. Quitar los hover `translateY`.
- **A18.** Convertir Ember a bloque: eyebrows y labels de sección pasan a `var(--t3)`; el CTA queda como campo Ember con texto en tinta `var(--bg)`; se conserva la barra estructural de 3–4px. Ningún texto ni línea en Ember fuera de eso.
- **A19.** Migrar a modo claro las superficies de lectura (sitio, manual, propuestas, footer claro) usando `--light-bg` / `--light-text-1` / `--light-text-2` / `--light-border`. Ember sobre claro solo como bloque con tinta encima, nunca como texto (2.91:1). Mantener en Deep Ink las piezas de escenario.
- **A20.** Reescribir en el manual la regla 3 ("dark mode primario" → "dark para escenario, claro para lectura"), la regla 1/11 (Ember = bloque de tinta) y añadir la regla de filete. Registrar las tres con fecha y firma.

### Refactor técnico — sobre el sitio que quede declarado como producción

- **A9.** Aplicar la regla 1: cifras (`.metric-n`, `.work-n`, `.ip-stat-n`) a `var(--t1)`; tags, numeraciones y `.tr-tag` a `var(--t3)`; barras decorativas (`.tr-col--b::before`, `.work-head::before`, `.ip::before`) a `var(--border)`; quitar `.accent` del titular. Ember queda solo en eyebrow y CTA.
- **A10.** Añadir `:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }` a nav links, burger, CTA, botones y cards clicables. Patrón de referencia: `ui_kits/portfolio/styles.css:145-151`.
- **A11.** Añadir el bloque `prefers-reduced-motion` del token store a las superficies que no lo heredan.
- **A12.** Estados activos con un indicador que no sea solo color (subrayado, borde o marca), en `.nav__link.is-active` y en los hover que hoy solo cambian color.
- **A13.** Crear `components.css` mínimo (`.btn` + variantes, `.chip`, `.label-mono`, `.label-ember`, `.metric`, `.card`, y un estado `disabled` que no dependa solo de opacidad), importado desde `styles.css`. Adoptarlo primero en una sola superficie.
- **A14.** Sustituir `_adherence.oxlintrc.json` (reglas de React, override sobre `**/index.js` inexistente) por verificación de CSS/HTML: hex crudo fuera del bloque de tokens, `font-weight` fuera de {300,400,500,700}, `:root` sin sello. Si no se va a ejecutar en CI, retirarlo y mover las verificaciones al checklist manual.
- **A15.** Alinear `Manual de Marca.html` al contrato: quitar los tokens dimensionales de `:27` (`--r-*`, `--dur`, `--ease`), migrar los alias deprecados de `:21-24` a `--light-*`, y quitar DM Mono 300 e itálica de `:10`. Alternativa: ampliar el contrato y tokenizar radios y duración en el canónico.
- **A16.** Separar en el changelog **decidido** de **ejecutado**, con las dos fechas. v2.3 declara retirado `--ember-cta` (sigue en código) y sellada "toda pieza" (4 de 25).

## Qué NO cambiar

- Deep Ink `#0A0612` como fondo primario.
- Ember `#FF5C39` como acento único (el hex, no su frecuencia de uso).
- Plus Jakarta Sans + DM Mono, con el mono restringido.
- La barra Ember de 3–4px como patrón estructural.
- El isotipo hexagonal y su regla de modo determinada por el fondo.
- El sello de snapshot y la tabla de excepciones fechada y firmada.

## Checklist antes de merge

- [ ] Importa el token store, o declara `:root` con sello en la primera línea
- [ ] Cero hex literales fuera del bloque de tokens
- [ ] Cero `font-weight` fuera de {300,400,500,700}; sin `0,800` en la URL de fuentes
- [ ] Display >48px en peso 300
- [ ] Texto sobre Ember en tinta `#0A0612`
- [ ] Ember solo en eyebrow y CTA, o con excepción fechada y firmada
- [ ] Un solo naranja en el archivo
- [ ] `:focus-visible` en todo control interactivo
- [ ] Estado activo con indicador que no sea solo color
- [ ] Hereda o declara `prefers-reduced-motion`
- [ ] Toda ruta de asset resuelve, incluido el favicon
- [ ] La pieza no vive en `uploads/`, `_workspace/` ni `screenshots/`
- [ ] README, `Inventario de Assets`, `_ds_manifest.json` y la copia `_ds/` actualizados en el mismo commit
