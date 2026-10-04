# Plan de limpieza — Proyecto de assets de marca "Ember on Ink"
**Fecha:** 2026-09-10 · Deriva de H16 y H17 de `design-system-audit-report.md` (Corrección de alcance)
**Alcance:** el proyecto de assets de marca (`019dd0ff…`). **No** el repo Astro de `diegomaury.mx`.

---

## Por qué esto va primero

La auditoría de esta sesión dedicó cinco de sus quince hallazgos a dos sitios web que ya no existen en producción. No fue un error de lectura — cada línea citada está donde dije — sino de alcance: **ningún archivo del proyecto declara si es canónico, copia de trabajo o artefacto retirado.** Mientras eso siga así, cualquier auditoría, cualquier handoff y cualquier IA que lea este repo va a gastar su esfuerzo en código muerto.

Limpiar no es higiene cosmética aquí. Es la precondición para que el resto del plan signifique algo.

---

## La regla que hace que no vuelva a pasar

Primera línea obligatoria de cada archivo del proyecto, junto al sello de valores que ya existe:

```
/* estado: canónico | vigente | copia-de-trabajo | retirado — AAAA-MM-DD */
/* snapshot v2.3 — 2026-09-10 */
```

| Estado | Significado | Quién lo puede tocar |
|---|---|---|
| **canónico** | Es la fuente de verdad de algo. Si dos archivos dicen lo mismo, solo uno es canónico. | Cambios con entrada en el changelog |
| **vigente** | Pieza que se usa y se produce hoy. Consume lo canónico. | Libre, respetando reglas |
| **copia-de-trabajo** | Export, render, preview, borrador. Se puede borrar sin pérdida. | Desechable |
| **retirado** | Ya no se usa. Se conserva como registro de decisiones. Vive en `archive/`. | Nadie. Solo lectura |

Y una línea en el README que diga **qué NO es este proyecto**: no es el repo del sitio. `diegomaury.mx` es un build de Astro que Cloudflare Pages despliega desde `master`; los estáticos de raíz se eliminaron el 2026-08-13 y **no se recrean**.

---

## Triage por archivo

Clasificación basada en lo leído en esta sesión. Las filas marcadas ⚠️ necesitan tu confirmación antes de mover nada.

### Canónico — se queda en raíz, con `estado: canónico`

| Archivo | Es la fuente de verdad de |
|---|---|
| `v2-tokens.css` | Color y tipografía. Confirmado por ti como versión vigente |
| `styles.css` | Entry point de consumo |
| `README.md` | Reglas, changelog, tabla de excepciones, inventario |
| `CLAUDE.md` | Regla del logotipo |
| `_ds_manifest.json` | Qué piezas publica el sistema |
| `assets/isotipo-dark.svg` · `assets/isotipo-light.svg` | Isotipo, dos modos |
| `assets/logos/` (6 lockups) | Lockups horizontales y verticales |

### Vigente — se queda, con `estado: vigente` y sello de snapshot

| Archivo | Nota |
|---|---|
| `Deck.html` · `poster.html` · `Quote Cards.html` · `Footer.html` | Ya sellados ✅ |
| `Tarjeta de Presentación.html` · `Portada LinkedIn.html` · `Portada Facebook.html` | Valores correctos, **falta sello** |
| `Firma Substack.html` · `Substack Banners.html` · `Social Banners.html` | ⬜ no verificados en esta corrida |
| `Foto de Perfil.html` · `Fondos Perfil.html` | ⬜ no verificados |
| `Manual de Marca.html` | Vigente, pero incumple el contrato: tokens dimensionales en `:27`, alias deprecados en `:21-24`, DM Mono 300 e itálica en `:10` |
| `Sistema Tipográfico.html` · `Logo Specs.html` · `Isotipo Dark Light.html` | Documentación de marca |
| `Guía de Uso.html` · `Inventario de Assets.html` | Requieren actualización de cifras (25 tokens, solo color y tipografía) |
| `preview/v2-*.html` (6 archivos) | Cards de preview del design system |
| `assets/logo-pack/` | Pack distribuible |
| `assets/backgrounds/` · `assets/substack/` | ⬜ no verificados |
| `Logo Animation.html` | El README lo marca ⏳ pendiente. Vigente-incompleto, no retirado |

### Retirado — a `archive/` con `estado: retirado`, **nunca borrar**

| Archivo / carpeta | Evidencia de que está muerto | Por qué se conserva |
|---|---|---|
| `uploads/index.html` (1087 líneas) | No existe en el repo del sitio; su equivalente se borró el 2026-08-13 como código muerto | Registro de la arquitectura de secciones S1-S9 y de la copia real |
| `ui_kits/version2/` (1448 líneas + assets) | Ídem. `canonical=/version2` no se sirve | **Contiene la decisión del 2026-07-09** que retiró el azul: es el único registro de por qué |
| `design_handoff_azul_medianoche/` | El Azul Medianoche se elimina del sistema (decisión 2026-09-10). Su `v2-tokens.css` está congelado en pre-v2.3 | Registro del handoff que sí se hizo |
| `assets/isotipo-ember-mrxkgyto-gb40.svg` · `assets/isotipo-light-mrxkqd6f-sc52.svg` | Sufijos de hash de máquina, no documentados, duplican los isotipos canónicos | Por si alguna pieza externa los enlaza |
| `assets/exports/` | Replica los 6 isotipos de raíz con otro nombre | Ídem |
| `archive/Firma de Correo v1.html` | Ya está en `archive/` ✅ | Solo falta la línea de estado y corregir el manifest, que la publica como si fuera vigente |

### Copia de trabajo — se puede borrar sin pérdida

| Archivo / carpeta | Qué es |
|---|---|
| `.bundles/` (10 HTML con nombre UUID) | Bundles generados |
| `screenshots/` (6 PNG) · `_workspace/` | Capturas y trabajo interno. El README ya los declara excluibles |
| `uploads/` (resto: manual y README con fecha, brief, PNG de draw) | Versiones subidas de documentos que ya existen en raíz |
| `preview/portada-propuesta.html` · `preview/portada-propuesta-print-1ulmmna.html` | Preview y copia de impresión con hash |
| `_export_c.html` · `_export_logos.html` | Andamios de export |
| `assets_b64_logos.js` · `assets_b64_rest.js` | Assets embebidos en base64 para esos exports |
| `thumbnail.html` · `.thumbnail` | Miniatura del proyecto |
| `design-canvas.jsx` · `doc-page.js` · `tweaks-panel.jsx` · `fb/` · `fondos/` | Componentes de andamiaje de herramienta, no del sistema |
| `Lockups con Tagline · Render.html` | Render; la fuente de verdad son los SVG de `assets/logos/` |

### ⚠️ Necesitan tu confirmación

| Archivo / carpeta | La duda | Si dices… |
|---|---|---|
| `ui_kits/portfolio/` (React: `index.html`, `app.jsx`, `styles.css`) | Es el **único consumidor correcto** del token store (`styles.css:4` hace `@import`). ¿Sigue vivo como superficie, o lo reemplazó Astro igual que a los estáticos? | **Vivo:** se queda como vigente y es la referencia de consumo. **Muerto:** a `archive/`, y entonces el proyecto se queda sin ningún consumidor real de los tokens — y el linter de React pierde su último objetivo |
| `Fondo Perfil.html` · `Fondo Perfil V2.html` · `Fondos Perfil.html` | Tres piezas de fondo de perfil. El manifest publica `Fondo Perfil` y `Fondos Perfil`; `V2` no aparece | Probablemente: `V2` es la vigente y las otras dos se retiran. Confírmalo antes de mover |
| `Portada Propuesta - Diego Maury.html` | No está en el manifest ni en el README. ¿Pieza vigente o entrega puntual de un cliente? | Si fue puntual: `archive/` |
| `ofl/pjs-regular.ttf` · `ofl/pjs-italic.ttf` · `ofl/plusjakartasans/` | Las fuentes se cargan desde Google Fonts en todas las piezas leídas. ¿Estos TTF los usa algo? | Si nada los referencia: copia-de-trabajo. El changelog v2.2 ya eliminó 8 fuentes V1 |
| `SKILL.md` · `_ds_bundle.js` · `_adherence.oxlintrc.json` | Infraestructura de la plataforma, no del sistema de marca | Se quedan, con `estado: canónico` de infraestructura |
| `design_handoff_quote_cards/` | Solo tiene `README.md`. ¿Handoff cerrado? | Si cerró: `archive/` |

---

## Cifras del triage

| Categoría | Archivos | % del proyecto |
|---|---|---|
| Canónico | ~10 | 13% |
| Vigente | ~28 | 36% |
| Retirado (a `archive/`) | ~12 + 2 carpetas de sitio completas (2535 líneas de HTML muerto) | 16% |
| Copia de trabajo (borrable) | ~24 | 31% |
| Pendiente de confirmación | 8 | 4% |

Dos terceras partes del proyecto no son el sistema. **Una tercera parte se puede borrar hoy sin pérdida de información.**

---

## Orden de ejecución

**Paso 0.1 — Marcar antes de mover.** Añadir la línea `estado:` a todos los archivos, en su ubicación actual. Sin mover nada. Es reversible y ya resuelve H16: a partir de aquí, cualquiera que lea el repo sabe qué está leyendo.

**Paso 0.2 — Archivar lo retirado.** Mover a `archive/` las 6 entradas confirmadas de la tabla de retirados. Nunca borrar: dos de ellas son el único registro de decisiones que se tomaron.

**Paso 0.3 — Borrar copias de trabajo.** Las 24 entradas de la tabla correspondiente. Confirmar antes que `.bundles/` y `thumbnail.html` no los necesite la plataforma.

**Paso 0.4 — Resolver las 8 dudas.** Con tus respuestas, cerrar el triage.

**Paso 0.5 — Reescribir el inventario.** `README.md`, `Inventario de Assets.html` y `_ds_manifest.json` deben describir el proyecto **después** de la limpieza, en el mismo commit. Incluye corregir la card de `Firma de Correo` (hoy publica la v1 archivada como vigente) y añadir la línea de alcance sobre el repo Astro.

**Paso 0.6 — Recién entonces, la fase 1 de remediación.** Cifra de contraste, eliminación del azul, sellos, regeneración de `_ds/`. Sobre un proyecto donde ya se sabe qué es cada archivo.

---

## Riesgos

| Movimiento | Riesgo | Mitigación |
|---|---|---|
| Borrar `.bundles/`, `thumbnail.html`, `.thumbnail` | Puede ser infraestructura de la plataforma, no basura | Mover a `archive/` en vez de borrar, y verificar que el proyecto siga abriendo |
| Archivar `ui_kits/portfolio/` | Es el único ejemplo funcionando de consumo correcto de tokens | No archivar hasta responder la duda; si se archiva, extraer antes su patrón de `@import` y de `:focus-visible` a un ejemplo mínimo en la documentación |
| Borrar `assets_b64_*.js` | Los exports dejarían de funcionar | Verificar que `_export_*.html` no se necesite antes de tocarlos |
| Archivar los dos sitios | Se pierde de vista la arquitectura S1-S9 y la copia real | Ya está capturada en `Prueba Filete.dc.html` (1a y 2a) con la copia literal de S1-S4 |

---

## Lo que la limpieza cambia en el DSMS

Nada, y hay que decirlo: el DSMS mide el sistema, no el orden del directorio. **Higiene del repo** vale 1 punto de 100 y pasaría de 0 a 1.

Lo que sí cambia es el **Confidence Score**: hoy es 66% en buena parte porque no se puede distinguir sistema de artefacto. Con el triage aplicado, la siguiente auditoría empieza sabiendo qué mirar — y el 34% que hoy es "no evaluable" pasa a depender solo de conectar el repo Astro, que es la superficie que nunca se ha auditado.

---

*Plan de limpieza · design-system-auditor · 2026-09-10*
