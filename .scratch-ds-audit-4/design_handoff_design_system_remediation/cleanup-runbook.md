# Runbook de limpieza — proyecto de assets "Ember on Ink"
**Fecha:** 2026-09-10 · **Rev. 2** — reescrito tras la decisión de empezar de 0 en las piezas descargables
**Ejecuta:** Diego o Claude Code, **en el repo del design system** (`019dd0ff…`), no aquí
**Deriva de:** `cleanup-plan.md` (triage) + H16/H17 de `design-system-audit-report.md`
**Alcance:** este repo. **No** el repo Astro de `diegomaury.mx`.

> Este proyecto es de solo lectura desde donde se escribió el runbook. Nada de abajo se ejecutó: son los movimientos exactos, en orden, con su verificación.

---

## Qué cambió en esta revisión

Las piezas descargables no se conservan. Siete grupos de assets y toda la documentación HTML se van a `archive/` (no se borran: quedan como registro). El repo baja de ~75 archivos vivos a **un núcleo de tokens + marca + 4 piezas**.

| Se queda vivo | |
|---|---|
| Contrato | `v2-tokens.css` · `styles.css` · `README.md` · `CLAUDE.md` · `decisions.md` · `_ds_manifest.json` |
| Marca | `assets/isotipo-*.svg` (8) · `assets/logos/` (6 lockups) · `assets/logo-pack/` |
| Piezas | `Deck.html` · `Footer.html` · `Quote Cards.html` · `poster.html` |
| Infra | `SKILL.md` · `_ds_bundle.js` · `_adherence.oxlintrc.json` · `preview/v2-*.html` → **no**, ver 0.3b |
| Nuevo | `consumer-example.html` (0.6) · `Manual de Marca.html` reescrito (0.8) |

---

## Triage cerrado

| Duda | Respuesta |
|---|---|
| Piezas descargables (7 grupos) | **Fuera → `archive/piezas/`** |
| `Fondo Perfil` / `V2` / `Fondos Perfil` | **Resuelto: las tres fuera.** Ya no hay pendiente de triage |
| Isotipo y lockups | **Se quedan** — son la marca, no un asset descargable. `logo-pack/` incluido |
| Documentación HTML | **Fuera → `archive/docs/`**, se reescribe después (0.8) |
| `_ds_manifest.json` | Publica solo las 4 piezas que quedan |
| Azul Medianoche | **Eliminado del contrato** (ver Paso 0.6) |
| Reglas mientras no haya docs | `README.md` + un `Manual de Marca.html` nuevo y mínimo contra v2.3 |
| `ui_kits/portfolio/` | Muerto → `archive/` |
| `Portada Propuesta`, `.bundles/`, `screenshots/`, `ofl/`, `assets_b64_*`, SVG con hash, `assets/exports/` | **Borrar** (0 referencias, verificado) |
| Registro de decisiones | ✅ extraído en `decisions.md` |

---

## Paso 0.1 — Copiar el registro de decisiones al repo

```bash
cd <repo-design-system>
cp <ruta-a-este-proyecto>/decisions.md ./decisions.md
git add decisions.md && git commit -m "docs: extraer D-V1 (retiro del azul) y D-V2 (arquitectura S1-S9) antes de archivar"
```

**Precondición bloqueante de 0.3 y 0.4.**

---

## Paso 0.2 — Marcar el estado de cada archivo (reversible, no mueve nada)

Primera línea de cada archivo, junto al sello de snapshot:

```
/* estado: canónico | vigente | copia-de-trabajo | retirado — 2026-09-10 */
/* snapshot v2.3 — 2026-09-10 */
```

- **`canónico`** — `v2-tokens.css` · `styles.css` · `README.md` · `CLAUDE.md` · `decisions.md` · `_ds_manifest.json` · `assets/isotipo-dark.svg` · `assets/isotipo-light.svg` · los 6 SVG de `assets/logos/` · `SKILL.md` · `_ds_bundle.js` · `_adherence.oxlintrc.json`.
- **`vigente`** — `Deck.html` · `Footer.html` · `Quote Cards.html` · `poster.html` (los cuatro ya tienen sello ✅) · `assets/logo-pack/`.
- **`retirado`** — todo lo que se mueve en 0.3.

```bash
git commit -am "chore: declarar estado y sello en el núcleo que se queda (H16)"
```

---

## Paso 0.3 — Archivar las piezas descargables

```bash
mkdir -p archive/piezas

git mv "Fondo Perfil.html"              "archive/piezas/"
git mv "Fondo Perfil V2.html"           "archive/piezas/"
git mv "Fondos Perfil.html"             "archive/piezas/"
git mv "Foto de Perfil.html"            "archive/piezas/"
git mv "Portada LinkedIn.html"          "archive/piezas/"
git mv "Portada Facebook.html"          "archive/piezas/"
git mv "Firma Substack.html"            "archive/piezas/"
git mv "Substack Banners.html"          "archive/piezas/"
git mv "Social Banners.html"            "archive/piezas/"
git mv "Tarjeta de Presentación.html"   "archive/piezas/"
git mv "Logo Animation.html"            "archive/piezas/"

git commit -m "chore: archivar las piezas descargables — se rehacen desde cero"
```

## Paso 0.3b — Archivar la documentación HTML

```bash
mkdir -p archive/docs

git mv "Manual de Marca.html"      "archive/docs/Manual de Marca v2.0.html"
git mv "Logo Specs.html"           "archive/docs/"
git mv "Sistema Tipográfico.html"  "archive/docs/"
git mv "Guía de Uso.html"          "archive/docs/"
git mv "Inventario de Assets.html" "archive/docs/"
git mv "Isotipo Dark Light.html"   "archive/docs/"
git mv "preview"                   "archive/docs/preview-v2"

git commit -m "chore: archivar documentación HTML — se reescribe contra v2.3"
```

Mientras esto esté archivado, **las reglas viven en `README.md` y `CLAUDE.md`**, que ya contienen las 11 reglas, la tabla de excepciones y el changelog. El Paso 0.8 devuelve un manual mínimo.

## Paso 0.3c — Archivar sitios, portfolio y handoffs

```bash
mkdir -p archive/sitios archive/handoffs archive/ui-kits

git mv "uploads/index.html"  "archive/sitios/sitio-produccion-v1.html"
git mv "ui_kits/version2"    "archive/sitios/sitio-version2"
git mv "ui_kits/portfolio"   "archive/ui-kits/portfolio-react"
git mv "design_handoff_azul_medianoche" "archive/handoffs/azul-medianoche"
git mv "design_handoff_quote_cards"     "archive/handoffs/quote-cards"
rmdir ui_kits

git commit -m "chore: archivar sitios retirados, portfolio React y handoffs cerrados"
```

A cada entrada, `/* estado: retirado — 2026-09-10 */` y una línea en `archive/README.md` diciendo qué registra. `archive/Firma de Correo v1.html` ya está ahí: solo le falta la línea de estado.

**Advertencia:** `archive/sitios/sitio-version2/index.html` referencia `./image-slot.js` y `../assets/img/`; al borrar el andamiaje esas rutas quedan rotas. Es un registro, no una pieza servible — anótalo en `archive/README.md`.

---

## Paso 0.4 — Borrar (duplicados y copias de trabajo)

```bash
# Duplicados de asset — 0 referencias, verificado
git rm -r "assets/exports"
git rm "assets/isotipo-ember-mrxkgyto-gb40.svg" "assets/isotipo-light-mrxkqd6f-sc52.svg"

# Fuentes locales — 0 referencias; todo carga de Google Fonts
git rm -r "ofl"

# Andamios de export y assets embebidos — 0 referencias
git rm "_export_c.html" "_export_logos.html" "assets_b64_logos.js" "assets_b64_rest.js"

# uploads/ — copias de documentos que ya viven en raíz (index.html ya se archivó)
git rm -r "uploads"

# Bundles, capturas, trabajo interno, miniatura — se regeneran
git rm -r ".bundles" "screenshots" "_workspace"
git rm "thumbnail.html" ".thumbnail"

# Render sustituible por los SVG de assets/logos/ y borrador confirmado
git rm "Lockups con Tagline · Render.html" "Portada Propuesta - Diego Maury.html"

# Andamiaje de herramienta, no del sistema de marca
git rm "design-canvas.jsx" "doc-page.js" "tweaks-panel.jsx"
git rm -r "fb" "fondos"

git commit -m "chore: borrar duplicados de asset, andamios de export y copias de trabajo"
```

**No se toca:** `.design-canvas.state.json` · `.image-slots.state.json` (estado de la plataforma). Los dos `preview/portada-propuesta*.html` ya se fueron con `preview/` en 0.3b — si prefieres borrarlos, `git rm` dentro de `archive/docs/preview-v2/` después del move.

---

## Paso 0.5 — Reescribir el inventario (mismo commit)

1. **`README.md`**
   - Línea de alcance arriba: *"Este proyecto es el contrato de marca y sus fuentes. **No** es el repo del sitio: `diegomaury.mx` es un build de Astro que Cloudflare Pages despliega desde `master`; los estáticos de raíz se eliminaron el 2026-08-13 y no se recrean."*
   - Bloque **"Estados de archivo"** con los 4 estados y quién puede tocar cada uno.
   - La tabla de "Archivos del sistema" se reduce a las 4 piezas vivas + el núcleo. Todo lo demás pasa a una sección **`archive/`** con una línea por entrada.
   - Nota explícita: *"Las piezas descargables de v2.0–v2.1 se retiraron el 2026-09-10. Se rehacen desde cero contra v2.3; hasta entonces no hay assets de canal publicados."*
   - `decisions.md` entra como canónico. Las dos excepciones de `ui_kits/portfolio/styles.css` pasan a histórico con fecha de retiro 2026-09-10.
   - Changelog **v2.4**.
2. **`_ds_manifest.json`** — `cards` queda en **4**: Deck, Footer, Quote Cards, poster. Quitar las ~16 restantes, incluida la de `Firma de Correo` (apunta a `archive/` y se publicaba como vigente).
3. Nada más que actualizar: `Inventario de Assets.html` y `Guía de Uso.html` ya no existen en raíz.

```bash
git commit -am "docs: reescribir README y manifest tras la limpieza (H17)"
```

---

## Paso 0.6 — Eliminar el Azul Medianoche del contrato

Decisión de Diego (2026-09-10): nunca se usó, sale del sistema. No es una excepción acotada — es un token retirado. Cuatro archivos:

```bash
# v2-tokens.css — borrar :18-27 completo (el bloque de comentario de scope y los dos tokens)
#   --accent-secondary:      #2F6FE0;
#   --accent-secondary-text: #457FE3;

# _adherence.oxlintrc.json — quitar de "tokens" (:59-60) y de tokenKinds (:93-94)
#   "--accent-secondary", "--accent-secondary-text"

# README.md — la fila del Azul Medianoche sale de "Excepciones confirmadas"
#   y entra al changelog v2.4 como token retirado

git commit -am "feat!: retirar --accent-secondary y --accent-secondary-text del contrato (D-V1)"
```

Un solo acento. Donde el sitio usaba azul para las secciones de método, la separación la hacen los neutros que ya existen (`--border`, `--t3`, `--t1`) más D-A, que saca Ember de esas secciones. **No entra ningún color nuevo en su lugar.** `--ember-cta: #BF452B` se retira por la misma razón: D-P3 resuelve el contraste con tinta sobre Ember.

Es un breaking change nominal, no real: el token tenía cero consumidores vivos una vez archivados los dos sitios.

## Paso 0.7 — Devolverle un consumidor al token store

`consumer-example.html` nuevo en raíz, `estado: canónico`: hace `@import url('./v2-tokens.css')` (sin `:root` local) y demuestra un botón, un link y un chip con hover, `:focus-visible` a 2px Ember con offset 3px, y texto tinta `#0A0612` sobre Ember (D-P3). Con el portfolio archivado es el único archivo que prueba el consumo correcto y el objetivo natural del linter.

## Paso 0.8 — Verificación antes de merge

- [ ] `decisions.md` commiteado **antes** de 0.3 y 0.4
- [ ] `git log --stat` muestra 8 commits separados, sin squash
- [ ] `grep -rn "accent-secondary\|2F6FE0\|457FE3\|BF452B" . --exclude-dir=archive` → 0 resultados
- [ ] `_ds_manifest.json` tiene 4 cards y las 4 rutas existen
- [ ] Las 4 piezas vivas abren con doble clic y renderizan
- [ ] `grep -r "assets/exports\|ofl/\|assets_b64\|mrxkgyto\|mrxkqd6f" .` → 0 resultados
- [ ] `archive/README.md` explica cada entrada y advierte de las rutas rotas de `sitio-version2`
- [ ] Raíz: solo el núcleo de la tabla de arriba. Nada suelto

## Paso 0.9 — Manual de Marca mínimo, escrito de cero

Un solo HTML, `estado: canónico`, contra v2.3 y **sin `:root` local** (`@import` al token store). Cinco secciones, nada más: paleta con los 8 tokens y sus contrastes · escala tipográfica (PJS 300/400/500/700 + DM Mono, con la regla de 300 arriba de 48px) · isotipo, modos y lockups · las 11 reglas no negociables · la tabla de excepciones. Sin inventario de piezas: no hay piezas que inventariar hasta que se rehagan.

---

## Qué piezas sí necesitas — y en qué orden

Lista corta, ordenada por uso real, no por facilidad. Cada una se construye contra v2.3 desde cero.

| # | Pieza | Canal / para qué | Formato | Por qué va en este lugar |
|---|---|---|---|---|
| 1 | **Portada + foto de perfil de LinkedIn** | LinkedIn — es tu superficie de mayor tráfico entrante y hoy queda sin assets | 1584×396 · 800×800 | Es lo primero que ve alguien que te busca por nombre |
| 2 | **Cabecera y cards de Substack** | *Haz que Pase* — publicas ahí con cadencia | 1344×256 · 1080×1080 | Frecuencia: una pieza por entrega, no una vez |
| 3 | **Firma de correo v2** | Correo — la única v1 archivada del sistema, nunca tuvo v2 | tabla HTML, Gmail/Outlook | Toca cada conversación de negocio |
| 4 | **One-pager de servicios** | Propuesta — los 3 modelos (Retainer, Proyecto, Advisory) en una hoja | Letter, imprimible + PDF | Complemento del `Deck.html` que ya vive; hoy no existe |
| 5 | **CV en plantilla del sistema** | `/cv/diego-maury-cv.pdf`, ruta que el sitio ya enlaza | Letter · 2 cuartillas | El sitio la enlaza; que salga del sistema y no de un Word |
| 6 | **Tarjeta digital** | Enlace corto, no papel | 480×310 o vCard web | Sustituye a la tarjeta impresa archivada |

Fuera de la lista a propósito: portadas de Facebook, fondos de perfil, banners multiformato y la animación del logo. Ninguna correspondía a una superficie que uses hoy — eran assets producidos porque se podían producir.

---

## Qué queda pendiente al cerrar

| Pendiente | Por qué no lo resuelve la limpieza |
|---|---|
| ~~D-V1 — el azul~~ | ✅ **Cerrado el 2026-09-10:** se elimina del contrato. Ejecutable en el Paso 0.6 |
| **Conectar el repo Astro** | Es la superficie que nunca se ha auditado. Hasta que entre, el 34% "no evaluable" del Confidence sigue ahí |
| **`_ds/…/v2-tokens.css` atrasado** | La copia distribuida en el proyecto consumidor se regenera en la fase 1 |

Efecto en el score: el DSMS sube **1 punto** (higiene, 0 → 1) y la cobertura de piezas documentadas se reinicia junto con las piezas. Lo que cambia de verdad es que la próxima auditoría mide un contrato, no un archivero.

---

*Runbook rev. 2 · design-system-auditor · 2026-09-10*
