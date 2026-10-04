# Handoff: Diego Maury Design System — remediación v2.3 → v2.4

**Generado:** 2026-09-11 · **Rev. 2** — reescrito tras cerrar D-V1 y la decisión de limpieza
**Para:** Claude Code, con permiso de escritura sobre los repos

---

## Qué es esto

**No es un handoff de UI.** No hay pantallas nuevas que construir. Es un **runbook de remediación** sobre un design system que ya existe: el sistema personal de Diego Maury, "Ember on Ink" (v2.3).

Una auditoría del 2026-09-10 encontró 13 hallazgos con evidencia archivo:línea. El diagnóstico: **el sistema está bien diseñado y mal propagado.** Solo 1 de 21 piezas leía el archivo de tokens; las otras 20 copiaron los valores a mano. Después de la auditoría, Diego decidió no reparar las 20 piezas sino **retirarlas y rehacer solo las que usa**.

Tu tarea es aplicar cambios ya decididos, en orden, sin rediseñar nada.

## Fidelidad

**No aplica en el sentido habitual.** No hay mocks que recrear. Cada cambio está especificado como archivo, línea, valor viejo → valor nuevo. Los valores vienen del archivo canónico de tokens, confirmado como fuente de verdad vigente el 2026-09-10.

Donde un cambio tiene margen de criterio visual (peso tipográfico, retirar el Ember de ciertos elementos), la decisión ya está tomada y registrada. **No la revisites:** aplícala y deja que Diego apruebe el resultado.

---

## ⚠️ Lee esto antes de abrir cualquier otro archivo

Este paquete contiene documentos de dos momentos distintos. **Cuando se contradigan, gana el más nuevo.** Orden de autoridad, de mayor a menor:

| # | Documento | Fecha | Autoridad |
|---|---|---|---|
| 1 | Este `README.md` | 2026-09-11 | **Canónico.** Resuelve toda contradicción |
| 2 | `decisions.md` | 2026-09-10 | Canónico. Decisiones firmadas por Diego (D-V1, D-V2, D-V3) |
| 3 | `cleanup-runbook.md` rev.2 | 2026-09-10 | Canónico para la Fase 0 |
| 4 | `implementation-plan.md` | 2026-09-10 | Vigente **salvo** lo que la Fase 0 archiva |
| 5 | `design-system-audit-report.md` | 2026-09-10 | Evidencia. El *por qué*, no el *qué* |
| 6 | `brand-art-direction-critique.md` | 2026-09-10 | Juicio profesional, **no especificación** |
| 7 | `cleanup-plan.md` | 2026-09-10 | **Superado** por el runbook rev.2. Solo triage histórico |

### Tres contradicciones concretas que vas a encontrar

1. **El Azul Medianoche.** El plan de implementación y la crítica de arte lo tratan como excepción acotada a documentar. **D-V1 lo cerró: se elimina del contrato.** `--accent-secondary`, `--accent-secondary-text` y `--ember-cta` se borran de `v2-tokens.css`, del linter y del README. No entra ningún color en su lugar. Ver `cleanup-runbook.md` Paso 0.6.
2. **Las 20 piezas portables.** El plan de implementación las manda a "sello de snapshot". **La decisión posterior es archivarlas**, no sellarlas. Solo 4 piezas sobreviven: `Deck.html`, `Footer.html`, `Quote Cards.html`, `poster.html`.
3. **`index.html` y `ui_kits/*`.** El plan los manda a `@import`. **Ya no viven en este repo** — se archivan como registro. Sus correcciones (Ember decorativo, peso 800, marquee, focus visible) se reubican al repo de Astro. Ver Fase 2.

---

## Los cambios viven en dos repos

Esto es lo primero que hay que entender y no estaba en la revisión anterior del paquete.

| Repo | Qué es | Qué le toca |
|---|---|---|
| **Repo del design system** (`019dd0ff…`) | Contrato de marca: tokens, isotipos, lockups, 4 piezas vivas | Fase 0 completa + Fase 1 |
| **Repo Astro de `diegomaury.mx`** | Build de Astro (`src/pages/index.astro`), Cloudflare Pages despliega desde `master` | Fase 2 |

**Nunca se auditaron juntos.** El repo de Astro era el 34% "no evaluable" del Confidence; un barrido dirigido del 2026-09-11 cubrió tokens y efectos (ver 2.9–2.10), no el resto. Los estáticos de raíz (`index.html`, `version2/`) se eliminaron de ese repo el **2026-08-13** como código muerto: **no se recrean.** Toda referencia a `index.html` en los documentos de apoyo de este paquete apunta a un archivo que ya no está vivo — la corrección equivalente va contra `index.astro`.

---

## Tokens canónicos

Fuente de verdad: `v2-tokens.css`. Confirmado vigente por Diego el 2026-09-10.

| Token | Hex | Nombre | Rol | Contraste sobre `#0A0612` |
|---|---|---|---|---|
| `--bg` | `#0A0612` | Deep Ink | Fondo principal | — |
| `--bg-2` | `#1A1128` | Surface | Cards, paneles, hover | — |
| `--bg-stage` | `#06030F` | Deep Ink -2 | Escenario fuera del lienzo | — |
| `--border` | `#6A291B` | Ember Dark | Bordes y separadores | — |
| `--t1` | `#FAF8FC` | Off White | Headlines, nombre | 18.7:1 |
| `--t2` | `#DDDBE0` | Near White | Role, URL, metadata | 13.6:1 |
| `--t3` | `#A8A6AC` | Neutral Mid | Supporting copy | 8.3:1 |
| `--ember` | `#FF5C39` | Electric Ember | Acento único | 6.5:1 |

### Modo claro (Modo Documento, D2)

| Token | Hex |
|---|---|
| `--light-bg` | `#FAF8FC` |
| `--light-text-1` | `#0A0612` |
| `--light-text-2` | `#3D2A52` |
| `--light-border` | `#E4DAEE` |

`--light-*` es la **nomenclatura canónica**. Los alias `--bg-light` / `--t1-light` / `--t2-light` / `--border-light` existen solo por compatibilidad y **se retiran en v3.0**. Cualquier quinta nomenclatura (`--color-bg-light`) es deriva a corregir.

### Tipografía

- **Plus Jakarta Sans** — titulares, UI, cuerpo. Pesos cargados: **300, 400, 500, 700** (+ itálicas 400/700).
- **DM Mono** — cifras, fechas, labels, tagline. Pesos 400/500. Siempre uppercase, `letter-spacing` 0.06–0.18em. **Nunca párrafos.**

```css
--sans: 'Plus Jakarta Sans', system-ui, sans-serif;
--mono: 'DM Mono', ui-monospace, monospace;
```

**Crítico:** la URL de Google Fonts del sistema **no carga el peso 800**. Todo `font-weight: 800` que encuentres es faux bold sintetizado por el navegador.

### Valores prohibidos

| Hex | Qué era | Reemplazo |
|---|---|---|
| `#2A1F3D` | `--border` de v2.1 | `#6A291B` — **excepto** en `assets/isotipo-light.svg`, excepción confirmada |
| `#9A8CB0` | `--t2` de v2.1 | `#DDDBE0` |
| `#8B7C9E` | `--t3` de v2.1 | `#A8A6AC` — el viejo da 4.37:1, no pasa AA |
| `#2F6FE0` / `#457FE3` | Azul Medianoche | **Ninguno.** Token retirado (D-V1) |
| `#BF452B` | `--ember-cta` | **Ninguno.** D-P3 resuelve el contraste con tinta sobre Ember |
| `#fff` sobre Ember | — | `var(--bg)` — 3.07:1 vs 12.2:1 |

---

## FASE 0 — Limpieza del repo del design system

**Ejecuta:** `cleanup-runbook.md`, pasos 0.1 → 0.9, en orden, sin squash. Ocho commits separados.

El repo baja de ~75 archivos vivos a un núcleo de tokens + marca + 4 piezas. Resumen:

| Paso | Qué hace |
|---|---|
| 0.1 | **Commitear `decisions.md` en el repo.** Precondición bloqueante |
| 0.2 | Sello de estado (`canónico`/`vigente`/`copia-de-trabajo`/`retirado`) en cada archivo |
| 0.3 · 0.3b · 0.3c | Archivar 11 piezas descargables, 7 documentos HTML, 2 sitios, portfolio React, 2 handoffs cerrados |
| 0.4 | Borrar duplicados de asset, andamios de export, copias de trabajo (0 referencias, verificado) |
| 0.5 | Reescribir `README.md` y `_ds_manifest.json` (4 cards) |
| 0.6 | **Retirar el Azul Medianoche y `--ember-cta` del contrato** (D-V1) |
| 0.7 | Crear `consumer-example.html` — el único consumidor real del token store |
| 0.8 | Checklist de verificación antes de merge |
| 0.9 | `Manual de Marca.html` mínimo, escrito de cero contra v2.3 |

### ⛔ Precondición bloqueante

`decisions.md` debe estar **commiteado en el repo del design system antes** de los pasos 0.3 y 0.4. Es el único registro de D-V1, D-V2 y D-V3 una vez que `ui_kits/version2/index.html` y `uploads/index.html` se archiven. Sin ese commit, la limpieza destruye el rastro de por qué se hizo.

### Regla de archivado

**Archivar ≠ borrar.** Lo que se mueve a `archive/` queda como registro con `/* estado: retirado — 2026-09-10 */` y una línea en `archive/README.md`. Solo se borra lo que el runbook verificó con 0 referencias en todo el repo. Ante la duda: `git mv`, no `git rm`.

---

## FASE 1 — Contrato (repo del design system)

Lo que sigue vivo después de la limpieza y necesita corrección. Los números de Cambio son los de `implementation-plan.md`, para que puedas cruzarlos.

### 1.1 · El archivo de tokens se contradice a sí mismo *(Cambio 2)*
`v2-tokens.css`, regla `.lockup-role` (≈línea 99):
```css
color: #9A8CB0;   →   color: var(--t2);
```
`#9A8CB0` es el `--t2` de la v2.1. Sobrevivió a la poda dentro del propio archivo canónico.

### 1.2 · Hex literal en modo claro *(Cambio 5)*
`Quote Cards.html`, regla `.stage.s-light` (≈línea 50):
```css
background: #FAF8FC;   →   var(--light-bg);
```

### 1.3 · Unificar el modo claro del footer *(Cambio 10)*
`Footer.html` (≈línea 17) usa nombres **y valores** propios:
```
--t1-light:     #2A1F3D  →  #0A0612   (var(--light-text-1))
--t2-light:     #4B3D6B  →  #3D2A52   (var(--light-text-2))
--border-light: #D9D2E8  →  #E4DAEE   (var(--light-border))
```
Efecto visual: el footer claro cambia de aspecto. Es intencional.

### 1.4 · Contraste del CTA *(Cambio 11)*
`Footer.html` `.tb-btn.active` (≈38): sobre fondo `var(--ember)`, `color: #fff` → `color: var(--bg)`.
Blanco sobre `#FF5C39` da **3.07:1** y el control es de 9.5–10px, así que WCAG 2.2 SC 1.4.3 exige 4.5:1. Tinta da **12.2:1**. **No introduzcas un segundo naranja** — se evaluó y se descartó (D-V1 punto 5).

### 1.5 · Focus visible en las piezas que quedan
`Quote Cards.html`: faltan en `#prevBtn`, `#nextBtn`, `.s-btn`, `.size-card`. Patrón de referencia, rescatado del portfolio antes de archivarlo (D-V3):
```css
a:focus-visible, button:focus-visible, [tabindex]:focus-visible {
  outline: 2px solid var(--ember);
  outline-offset: 3px;
}
```

### 1.6 · Definición contradictoria del lockup *(Cambio 15)*
`v2-tokens.css` (≈88-101) y el snippet "Lockup base" del `README.md` describen el mismo lockup con valores distintos:

| | CSS | README |
|---|---|---|
| `gap` | 2.4px | 14px |
| divisor | `var(--t1)` | `#6A291B` |
| rol | sans itálica 8.5px `#9A8CB0` | DM Mono 10px `#DDDBE0` |

**El CSS gana** (es ejecutable y trae nota de proporciones). Actualiza el snippet del README para que coincida.
⚠️ Pregunta abierta P7: no se sabe cuál definición se usó en los lockups SVG de `assets/logos/`. **Corrige el README y repórtalo; no toques los SVG.**

### 1.7 · Linter de adherencia *(Cambio 18)*
`_adherence.oxlintrc.json` está configurado para un sistema de componentes React que **no existe** en este repo: `"components": {}`, overrides sobre `index.js`, reglas que solo aplican a literales en JS. Ningún archivo del sistema es JS, así que hoy no detecta nada de lo que encontró la auditoría.

Reescríbelo contra lo que el sistema realmente es (CSS + HTML), apuntando a `consumer-example.html` como objetivo. **No lo dejes como está:** da una falsa sensación de cobertura. Si lo reescribes, elimina de paso las entradas del Azul Medianoche (`:59-60`, `:93-94`) y el metadato mal clasificado.

### 1.8 · Sincronizar la copia distribuida — **bloqueante**
El bundle que los proyectos consumidores montan en `_ds/` se regenera desde el canónico, y hasta que eso pase sirve contrato muerto. El 2026-09-11 se encontró desactualizado en **tres superficies**, no una:

| Superficie | Qué servía |
|---|---|
| `v2-tokens.css` | `--accent-secondary: #2F6FE0` y `--accent-secondary-text: #457FE3` vivos, con el bloque de excepción de scope `index.html` fechado 2026-07-02 — anterior a D-V1 |
| `_ds_manifest.json` → `tokens[]` | las mismas dos entradas declaradas como tokens del sistema, con `definedIn: v2-tokens.css` |
| `_ds_manifest.json` → `cards[]` | 29 cards, de las cuales **24 apuntan a rutas que ya no existen** (se movieron a `archive/` en la Fase 0) |

Esto importa más que un snapshot cualquiera: es lo que carga cada Design Component, viaja a cualquier proyecto que monte el sistema, y trae la justificación de contraste del Azul Medianoche intacta — quien lo lea sin conocer D-V1 concluye razonablemente que es contrato vigente.

Parchear el espejo a mano **no cierra el punto**: la regeneración lo pisa. El fix durable es republicar el bundle desde el proyecto del design system.

---

**Criterio de salida:** cambiar un valor en `v2-tokens.css` se refleja en `consumer-example.html` sin editar ningún otro archivo. Las 4 piezas vivas abren con doble clic y tienen sello.

Y el grep de tokens retirados en cero — pero corrido bien, que es donde el criterio anterior fallaba:

```bash
grep -rn -- "--accent-secondary\|--ember-cta\|2F6FE0\|457FE3\|BF452B" . --exclude-dir=archive
```

Dos precisiones que el criterio original no traía y costaron una falsa alarma:

1. **Corre sobre el canónico Y sobre toda copia distribuida** (`_ds/`, bundles publicados, snapshots en proyectos consumidores). Verificar solo la fuente deja pasar exactamente el fallo de propagación que la auditoría diagnosticó.
2. **Cero no es el resultado esperado si dejaste lápidas.** Un comentario que documenta el retiro nombra los hexes y hace match. Lee cada resultado: definición viva = fallo; comentario de retiro o entrada de changelog = correcto. El criterio es *ninguna definición ni referencia activa*, no *ninguna aparición de la cadena*.

---

## FASE 2 — Sitio (repo Astro de `diegomaury.mx`)

**Auditada el 2026-09-11** con un barrido dirigido sobre tokens, efectos y alias muertos — no el informe completo. Cierra buena parte del 34% que la auditoría original no pudo ver, pero **no lo cierra entero**: siguen sin revisar accesibilidad de teclado, jerarquía semántica, estados de formulario y responsive.

Las correcciones de abajo se describieron contra el viejo `index.html` estático, que ya no existe. **Localiza el equivalente en `src/pages/index.astro` y en los componentes que use — por selector y por valor, nunca por número de línea.** Si la estructura del sitio necesita reconstruirse, `decisions.md` D-V2 documenta la arquitectura narrativa S1–S9, pero se reconstruye **contra el contrato v2.3, no contra el HTML viejo**.

### 2.1 · Paleta pre-v2.2 *(Cambio 3 — Critical)*
```
--border: #2A1F3D  →  #6A291B
--t2:     #9A8CB0  →  #DDDBE0
--t3:     #8B7C9E  →  #A8A6AC
```
Es el sitio público. El changelog de la v2.2 declara esta migración como hecha; nunca llegó. `#8B7C9E` da 4.37:1 y **falla WCAG AA**; el reemplazo da 8.3:1. Los bordes pasan de morado a ember quemado y el texto de apoyo se aclara: es el cambio correcto, no un efecto secundario.

Mejor aún: el sitio debería hacer `@import` de `v2-tokens.css` (o consumirlo como dependencia del build) y **borrar su bloque `:root` local**. Patrón de referencia en `decisions.md` D-V3.

### 2.2 · Contraste del CTA *(Cambio 11)*
`.nav-cta` y `.btn-primary`: sobre `var(--ember)`, `color: #fff` → `var(--bg)`.

### 2.3 · Ember fuera de lo decorativo *(Cambio 12 — regla D-A)*

| Selector | Cambio |
|---|---|
| `.hero-h1 .accent` | quitar Ember — el titular va en un solo color |
| `.metric-n` | → `var(--t1)` |
| `.about-role-dot` | → `var(--t3)` |
| `.about-stat-n em` | → `var(--t1)` |
| `.svc-item::before` | → `var(--t3)` |

Ember **se queda** en los eyebrows/labels de sección y en los CTA. El naranja pasa de aparecer una docena de veces a marcar solo estructura y acción. **Diego aprueba el resultado visual.** Aplícalo y muéstralo.

### 2.4 · Peso tipográfico *(Cambio 13 — regla D-C/D4)*
**A 300** — display sobre 48px: `.hero-h1` (hasta 4rem) y `.cta-h` (hasta 3.1rem).
**A 700** — todo lo demás que hoy es 800 (≈9 ocurrencias en el sitio viejo).
**No amplíes el contrato de fuentes a 800.** El objetivo es eliminar el faux bold. Diego aprueba el resultado visual.

### 2.5 · Marquee → rejilla estática *(Cambio 14 — D-D)*
En `.trust-track-wrap`: elimina `animation: marquee 24s linear infinite` y las dos declaraciones `mask-image` / `-webkit-mask-image`. Los logos pasan a `display: grid` sin desplazamiento. Elimina el `@keyframes marquee` si queda huérfano.

**Se conservan** como excepciones funcionales registradas: la máscara de la foto de perfil, el `backdrop-filter: blur()` del nav y el modal, y el hover `translateY(-2/-3px)` de las tarjetas.

### 2.6 · Azul Medianoche en las secciones de método
Con D-V1 el token sale del contrato. En las secciones S2–S7 que lo usaban, la separación la hacen **los neutros que ya existen** (`--border`, `--t3`, `--t1`) más D-A, que saca Ember de esas secciones. **No entra ningún color nuevo.**

### 2.7 · Estado activo de los filtros de `/eventos` — *riesgo, no incumplimiento confirmado*
`src/styles/events.css:71-104`. `.events-view-btn[aria-selected='true']` y `.events-cat-chip[aria-pressed='true']` cambian `color`, `border-color` y `background` a la vez — tres canales, así que muy probablemente ya pasa WCAG SC 1.4.1. Pero ninguno es explícitamente no-cromático. Agrega peso de fuente, subrayado o marca para cerrarlo sin ambigüedad.

### 2.8 · Assets referenciados que no existen *(Cambio 7)*
Favicon y apple-touch-icon apuntaban a `assets/img/isotipo-gradient.png`, que no existe. Apunta a un isotipo real. **Nota:** el nombre "gradient" contradice la regla 2 del sistema ("sin gradientes") — repórtalo, **no inventes un asset con gradiente**.

### 2.9 · Alias muertos del Azul Medianoche *(Low)*
`src/styles/variables.css:11-12`. `--accent-secondary` y `--accent-secondary-text` existen como alias de `var(--ember)`, con **0 consumidores** en todo `src/` (verificado por grep). Es el espejo exacto del D-V1 que ya se cerró en el repo del design system: la eliminación nunca se propagó aquí. Borra las dos líneas.

### 2.10 · Hex de paleta retirada dentro de un gradiente *(Medium)*
`src/styles/portfolio.css:211`, regla `.media-void` — el placeholder de las fichas de caso sin evidencia visual:
```css
background: repeating-linear-gradient(135deg, transparent 0 8px, rgba(139,124,158,.05) 8px 9px);
```
`rgb(139,124,158)` es `#8B7C9E`, el `--t3` de la paleta **pre-v2.2**. Doble problema: hex crudo de una paleta retirada, y textura decorativa que roza la regla 2 sin estar en la tabla de excepciones.

Reemplazo: `rgba(168,166,172,.05)` — el `--t3` vigente. **No inventes un tono nuevo.** Si prefieres tokenizarlo, agrega `--t3-rgb` al contrato antes de usarlo.

### Verificado en cumplimiento — no tocar
`.card__media::after` (`portfolio.css:183`) usa `linear-gradient` como overlay de legibilidad bajo el logo superpuesto. Cae dentro de la excepción de overlays funcionales. **No es hallazgo.**

**Criterio de salida:** el sitio consume `v2-tokens.css` sin `:root` local, pasa AA en todo el texto, y el Ember aparece solo en eyebrows y CTA.

---

## FASE 3 — Piezas nuevas (repo del design system)

Después de la Fase 0 no hay assets de canal publicados. Se rehacen desde cero contra v2.3, en este orden — por uso real, no por facilidad.

| # | Pieza | Canal | Formato |
|---|---|---|---|
| 1 | Portada + foto de perfil de LinkedIn | Mayor tráfico entrante, hoy sin assets | 1584×396 · 800×800 |
| 2 | Cabecera y cards de Substack | *Haz que Pase*, una pieza por entrega | 1344×256 · 1080×1080 |
| 3 | Firma de correo v2 | Nunca tuvo v2; solo existe la v1 archivada | Tabla HTML, Gmail/Outlook |
| 4 | One-pager de servicios | Retainer · Proyecto · Advisory | Letter, imprimible + PDF |
| 5 | CV en plantilla del sistema | `/cv/diego-maury-cv.pdf`, ruta que el sitio ya enlaza | Letter · 2 cuartillas |
| 6 | Tarjeta digital | Enlace corto, no papel | 480×310 o vCard web |

Fuera de la lista a propósito: portadas de Facebook, fondos de perfil, banners multiformato, animación del logo. Ninguna corresponde a una superficie en uso.

**La firma de correo es la única excepción vigente a "sin hex crudos":** los clientes de email no soportan variables CSS. Los *valores* sí se actualizan a v2.3.

---

## Reglas permanentes para código nuevo

### Siempre
- Todo texto sobre `--ember` usa `var(--bg)`. Nunca blanco, nunca `--t1`.
- Contraste de texto ≥4.5:1 (≥3:1 solo si es ≥24px). Verifícalo, no lo asumas.
- Todo control interactivo lleva `:focus-visible { outline: 2px solid var(--ember); outline-offset: 3px; }`.
- Todo estado activo/seleccionado lleva un indicador que no sea solo color (WCAG SC 1.4.1).
- Display >48px: peso 300. Todo lo demás: 700 máximo.
- Toda pieza sin `@import` lleva sello de snapshot con versión y fecha en la primera línea del `:root`.
- Toda pieza portable con animación declara su propio bloque `prefers-reduced-motion` — no lo hereda.
- Todo cambio de token se acompaña, **en el mismo commit**, de la actualización de `README.md` y `_ds_manifest.json`. La desalineación documental que encontró la auditoría nació exactamente de no hacer esto.
- Todo documento del sistema declara su estado en la primera línea: canónico / vigente / copia-de-trabajo / retirado.

### Nunca
- Hardcodear un hex que ya existe como token — ni siquiera dentro de `v2-tokens.css`.
- Un segundo valor de naranja en el sistema.
- Un quinto nombre para el modo claro. El canónico es `--light-*`.
- `--border` como `background` de un elemento: el nombre deja de describir el rol. Si hace falta esa superficie, pide un token con nombre de superficie.
- `font-weight` fuera de {300, 400, 500, 700}.
- Movimiento perpetuo (marquees, loops infinitos) en piezas de marca. Una marquesina con función de contenido es excepción a registrar, no prohibición absoluta.
- Ember en cifras, bullets, puntos de rol o palabras sueltas de titular.
- Gradientes, drop shadows, glow o efectos decorativos.
- Recrear los estáticos de raíz del repo Astro. Se eliminaron el 2026-08-13 como código muerto.

---

## Excepciones vigentes — no las revientes

| Archivo | Regla | Excepción | Aprobado |
|---|---|---|---|
| `assets/isotipo-light.svg` | token `--border` | `stroke:#2A1F3D` fijo en el path del hexágono — **no** sincronizar con `--border` | Diego |
| Firma de correo | sin hex crudos | los clientes de email no soportan variables CSS; los *valores* sí se actualizan | Diego |
| Foto de perfil · nav · modal | sin efectos | `mask-image` y `backdrop-filter` — funcionales (legibilidad), no decorativos | Diego · 2026-09-10 |
| Tarjetas | sin efectos | hover `translateY(-2/-3px)` — funcional | Diego · 2026-09-10 |

**Retiradas el 2026-09-10:** las dos excepciones de `ui_kits/portfolio/styles.css` (el archivo se archivó) y la del Azul Medianoche en `index.html` (el token se eliminó).

---

## Preguntas abiertas

No bloquean la Fase 0 ni la Fase 1. Repórtalas si llegas a un punto donde importen.

| # | Pregunta | Impacto |
|---|---|---|
| P7 | ¿Los lockups SVG de `assets/logos/` siguen el CSS (gap 2.4px, rol itálico) o el README (gap 14px, rol mono)? | Paso 1.6 |
| P9 | ¿Hay un Figma con variables sincronizadas, o el CSS es el único origen? | Alcance real de la migración |
| P10 | ¿El linter se ejecuta en algún momento, o es solo metadata? | Paso 1.7 |
| P11 | ¿El repo Astro tiene su propio bloque de tokens, o los importa? | Toda la Fase 2 |

---

## Contexto que necesitas y no está en el código

El sistema tiene **11 reglas no negociables** en su `README.md`. Tres cambiaron en la v2.3 y son el motor de la mitad de este trabajo:

- **D-A (regla 1, reescrita).** Decía: "Ember aparece exactamente una vez por pieza". La realidad: el sitio lo usaba en más de doce lugares. Ahora dice: *Ember es color de señalización estructural — eyebrow/label de sección y llamada a la acción. Nunca en cifras, bullets, puntos, iconos decorativos ni palabras sueltas de un titular.*
- **D-P3 (regla 11, nueva).** Texto sobre Ember = tinta `#0A0612`, 12.2:1. Nunca blanco. No existe un segundo naranja.
- **D-C (regla 10).** Peso 300 arriba de 48px, 700 en el resto. El 800 no existe en el contrato de fuentes.

Hay también una **regla de vigencia documental**: existe un borrador de un futuro "Brand System 3.0" en Notion. **No es canónico y no se usa como fuente para nada de este trabajo.** Todo se produce contra v2.3. Si encuentras referencias a la tesis de la fractura, al marco de antifragilidad o a taglines alternativos, ignóralas: el tagline vigente es **"Hagamos que las cosas pasen."**

---

## Orden mínimo si solo hay una sesión

`cleanup-runbook.md` Paso 0.1 → Paso 0.6 → Paso 1.1 → Paso 1.4.

Commitea el registro de decisiones, saca el color muerto del contrato, arregla la contradicción interna del token store y cierra el único fallo AA de una pieza viva.

---

## Estado real al 2026-09-11

| Fase | Estado |
|---|---|
| Fase 0 | **Completa**, verificada contra el canónico: quedan las 4 piezas vivas, el Manual y los archivos de contrato |
| Fase 1 · 1.1–1.6 | **Ya estaban aplicados.** Confirmado valor por valor, no por impresión. El plan los listaba como pendientes por desfase del documento |
| Fase 1 · 1.7 | Linter reescrito sin React, apuntando a `consumer-example.html`. Sin confirmar que corra en ningún pipeline (P10 sigue abierta) |
| Fase 1 · 1.8 | **Bloqueante, abierto.** Requiere republicar el bundle desde el proyecto del design system |
| Fase 2 | Barrido dirigido hecho (2.9, 2.10 nuevos). Falta teclado, semántica, formularios, responsive |
| Fase 3 | No iniciada |

**Pendiente de la Fase 0:** `ui_kits/` sigue en su ubicación original en el canónico.

**Pérdida registrada:** el Manual de Marca v2.0 se sobrescribió sin archivar y se recuperó de una copia descargada local, no del repo. Sello interno "Versión 2.0 · Junio 2026" contra nombre de archivo "2026-07-02" — discrepancia sin resolver.

### La lección que este paquete no traía

En cuatro puntos distintos de la ejecución, el documento y el disco no coincidieron — dos veces el documento adelantaba trabajo no hecho, una vez lo atrasaba, y una vez un espejo servía contrato ya retirado. Incluidos documentos de este handoff.

**Ninguna afirmación de estado de este proyecto es confiable sin verificación directa contra el archivo.** Eso vale para el runbook, para los checklists marcados, y para este README.

---

## Archivos de este paquete

| Archivo | Qué es | Autoridad |
|---|---|---|
| `README.md` | Este documento. Autosuficiente: alcanza para ejecutar sin el resto | Canónico |
| `decisions.md` | D-V1 (retiro del azul), D-V2 (arquitectura S1–S9), D-V3 (patrón de consumo de tokens). **Commitear en el repo antes de archivar nada** | Canónico |
| `cleanup-runbook.md` | Fase 0 paso a paso, con bloques `bash` y checklist de verificación | Canónico |
| `implementation-plan.md` | Runbook original por fases con dependencias, riesgo y rollback | Vigente salvo lo archivado |
| `design-system-audit-report.md` | Auditoría completa: DSMS 50/100, 13 hallazgos con evidencia archivo:línea, matrices de deuda y riesgo, antipatrones, checklist de QA | Evidencia |
| `design-evolution-brief.ai.md` | Brief imperativo — reemplazar / agregar / eliminar. Útil como checklist | Vigente salvo lo archivado |
| `brand-art-direction-critique.md` | El razonamiento detrás de D-A, D-C y D-D | Juicio, no especificación |
| `cleanup-plan.md` | Triage previo al runbook | **Superado.** Solo histórico |

---

## Nota final

El diagnóstico cabe en una frase: **este sistema no tiene un problema de identidad, tiene un problema de obediencia a su propia identidad.** Las piezas donde las reglas se cumplen — poster, quote cards, deck — son visiblemente mejores que la pieza donde no se cumplen, que es el sitio.

Tu trabajo no es mejorar el sistema. Es hacer que el sistema haga lo que ya dice que hace.

*Paquete rev. 2 · 2026-09-11 · design-system-auditor + brand-art-direction*
