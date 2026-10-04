# Registro de decisiones extraído — antes de la limpieza
**Fecha de extracción:** 2026-09-10 · **Origen:** `ui_kits/version2/index.html` y `uploads/index.html` del proyecto de assets (`019dd0ff…`)
**Por qué existe este archivo:** esos dos archivos son el único registro de dos cosas que el sistema no documenta en ningún otro lado. Se archivan (no se borran), pero su contenido decisional se extrae aquí para que no dependa de que alguien abra 2,535 líneas de HTML muerto.

---

## D-V1 · Retiro de la excepción del Azul Medianoche (review 2026-07-09)

**Evidencia literal** — `ui_kits/version2/index.html:63-67`:

```css
--ember:  #FF5C39;
--ember-cta: #BF452B; /* ember oscurecido: cumple AA 4.5:1 con texto blanco en botones */
/* Re-alias a ember (review 2026-07-09) — la excepción azul del 2026-07-02 queda retirada */
--accent-secondary:      var(--ember);
--accent-secondary-text: var(--ember);
```

Qué dice la decisión:

1. La excepción del 2026-07-02 que introdujo el Azul Medianoche (`#2F6FE0` / `#457FE3`) **se retiró el 2026-07-09**. `--accent-secondary` y `--accent-secondary-text` quedaron re-aliasados a `var(--ember)`: un solo acento.
2. Para resolver el contraste del texto sobre el acento se introdujo un **segundo naranja** `--ember-cta: #BF452B`, justificado como "ember oscurecido: cumple AA 4.5:1 con texto blanco en botones".

**Estado actual del contrato (contradicción abierta, H1 de la auditoría):** el README v2.3 (2026-09-10) declara el Azul Medianoche **vigente** en su tabla de excepciones (scope `index.html` + S2–S7) y declara que **no existe un segundo naranja** — la regla D-P3 resuelve el contraste con tinta `#0A0612` sobre Ember (12.2:1), no con un ember oscurecido. Las dos decisiones están fechadas y firmadas y ninguna cita a la otra.

### Resolución — D-V1 cerrada (Diego · 2026-09-10)

**El Azul Medianoche se elimina del sistema.** Razón dada: nunca se usó y nunca fue importante. No es una excepción a revisar en v3.0 ni un scope a acotar — sale del contrato.

Qué implica, concretamente:

1. `--accent-secondary` (`#2F6FE0`) y `--accent-secondary-text` (`#457FE3`) se borran de `v2-tokens.css:18-27`, junto con su bloque de comentario de scope.
2. La fila del Azul Medianoche sale de la tabla de excepciones del README y pasa al changelog v2.4 como token retirado.
3. Las dos entradas salen de la lista de tokens públicos de `_adherence.oxlintrc.json` (`:59-60` y `:93-94`), lo que además cierra el hallazgo del metadato mal clasificado (`--accent-secondary-text` estaba como `font` siendo un color).
4. `design_handoff_azul_medianoche/` se archiva como registro del handoff que sí se hizo.
5. `--ember-cta: #BF452B` se retira igual: D-P3 resuelve el contraste con tinta `#0A0612` sobre Ember (12.2:1), sin añadir color.

**El sistema queda con un solo acento.** Donde el sitio usaba azul para diferenciar las secciones de método, la separación la hacen los neutros que ya existen (`--border`, `--t3`, `--t1`) más la regla D-A, que saca Ember de esas secciones y lo reserva al eyebrow y al CTA. No entra ningún color nuevo en su lugar.

**Por qué seguía siendo un problema aunque no lo usaras:** el contrato lo declaraba vigente en tres lugares (README, `v2-tokens.css`, linter) y un paquete de handoff congelaba una copia. Una auditoría mide lo que el contrato dice, no lo que se usa — y el linter marcaba como válido un token que nadie consumía. Al borrarlo de esos cuatro lugares deja de existir el problema.

---

## D-V2 · Arquitectura de secciones S1–S9 del sitio

Extraída de `uploads/index.html` (la copia con `canonical=https://diegomaury.mx/`). Es la estructura narrativa del sitio, independiente de qué build lo sirva hoy.

| # | `id` | Label de sección | Función narrativa | Contenido estructural |
|---|---|---|---|---|
| **S1** | `hero` | *(eyebrow: Strategic Program Director)* | Posicionamiento | H1 + subtítulo + 2 CTA (Calendly, CV) + 4 métricas (9,905 · 3,231 · +600% · 10+) + cinturón de respaldo institucional (7 logos) |
| **S2** | `tesis` | Propuesta de valor | El traductor entre dos idiomas | Dos columnas contrapuestas (Idioma C-level ⇄ Idioma trinchera) con puente central |
| **S3** | `patron` | El patrón | El método es repetible | Espina de 5 pasos: Caos → Diagnóstico → Diseño de sistema → Implementación → Escala |
| **S4** | `trabajo` | Selected work | Prueba, balanceada por horizonte | 3 casos (FlipHouse H1 · HEINEKEN Green Challenge H2 · HackSureste+REDUX H3), cada uno con Situación / Acción / Resultado / tags |
| **S5** | `ip` | Biblioteca de sistemas / IP propia | Metodología registrada, no consultoría | 2 fichas (REDUX Framework · HackSureste Ops Framework) con badge y 3 cifras cada una |
| **S6** | `forense` | Evidencia forense / Autopsias clínicas | Vulnerabilidad controlada como confianza B2B | 3 autopsias (HEINEKEN · Pandemia 2020 · Filtrado a escala), cada una con hipótesis errónea / diagnóstico real / resultado |
| **S7** | `servicios` | Oferta de liderazgo | Tres formas de trabajar | 3 modelos (Retainer fraccional · Proyecto acotado · Advisory) con lista y plazo |
| **S8** | `ainative` | Operación AI-Native | El sitio como evidencia operativa | Chips de stack (llms.txt · RAG-ready, MCP, …) |
| **S9** | — | CTA final | Cierre | Label centrado + H + 3 pasos del proceso + botones + línea de confianza |

**Nav:** Propuesta (`#tesis`) · Trabajo (`#trabajo`) · Sistemas (`#ip`) · Evidencia (`#forense`) · Servicios (`#servicios`) + CTA "Agendar diagnóstico". El nav no expone S3, S8 ni S9.

**Nota de deriva (no es parte de la decisión, es contexto):** esta copia corre con la paleta pre-v2.2 (`#2A1F3D`, `#9A8CB0`, `#8B7C9E` en `:58-70`), carga el peso 800 (`:54`, prohibido por D-C) y usa Ember en cifras, bullets `→`, tags y puntos de rol — ocho roles que D-A retiró. Si la estructura S1–S9 se reconstruye en el build de Astro, se reconstruye contra el contrato v2.3, no contra este archivo.

---

## D-V3 · Patrón de consumo correcto de tokens (rescatado de `ui_kits/portfolio/`)

El portfolio React se archiva (muerto: lo reemplazó Astro). Era el **único archivo del repo que consumía los tokens con un `@import` real** en vez de copiarlos en un `:root` local, y el único con foco visible. Ese patrón es lo que hay que preservar:

```css
/* ui_kits/portfolio/styles.css:4 — el patrón a conservar */
@import url('../../v2-tokens.css');
```

```css
/* ui_kits/portfolio/styles.css:145-151 — foco visible, 5 selectores */
a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--ember);
  outline-offset: 3px;
}
```

Con el portfolio archivado, `v2-tokens.css` se queda con **cero consumidores** y el linter de adherencia sin objetivo. El runbook crea `consumer-example.html` para que el patrón siga vivo y verificable en el repo (Paso 0.6).

---

*Extraído por design-system-auditor · 2026-09-10 · precondición del Paso 0.2 de `cleanup-runbook.md`*
