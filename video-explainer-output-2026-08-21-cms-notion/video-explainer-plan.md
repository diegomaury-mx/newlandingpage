# Plan: CMS con Notion · diegomaury.mx

## Setup

| Parámetro | Valor |
|---|---|
| Objetivo | Explicar qué es el CMS con Notion del sitio y cómo funciona el flujo de edición → build → publicación |
| Audiencia | Notion Community (técnica): gente que conoce Notion a fondo y valora ver un uso real en producción, no una intro |
| Duración | 40s |
| Formato | Vertical 9:16 |
| Tono | `technical` |
| Voiceover | No, solo texto en pantalla (sin captions sincronizados a audio de voz) |
| Música | Sí, fondo sutil |
| SFX | Sí, mínimos (transiciones) |
| Título | CMS con Notion · diegomaury.mx |

## Fuente de verdad (código inspeccionado)

- `docs/platform/notion-astro-contract.md`: contrato de 4 fuentes Notion → Astro.
- `src/services/notionLoaders.ts`: loaders reales que corren en build time.
- `CLAUDE.md` §1: auto-publish vía Cloudflare Worker `notion-deploy-relay`.
- SQL directo contra `SSOT - Portafolio Proyectos` (`collection://88257bc9-e575-45e8-90df-f851f96e92f2`), corrido en esta sesión (21 ago 2026): confirma 30 filas totales, las 30 con `Estado publicación = Publicado`, y 27 de esas 30 con `Publicable` también marcado. La cifra 27/30 reemplaza el conteo de 14 publicadas que traía CLAUDE.md (snapshot del 2026-08-13) — el estado real gana sobre la doc estática.

Hechos clave usados en el guion (verificados contra el workspace el 21 ago 2026):

1. El sitio es Astro; el contenido no vive en el código sino en 4 fuentes Notion: **SSOT de casos** (27 fichas publicadas de 30 filas totales, verificado por SQL), **Copy Oficial** (página singleton S1-S8, no es una base), **Métricas oficiales**, **CMS Imágenes**.
2. Publicar una ficha exige dos gates: `Estado publicación = Publicado` **y** el checkbox `Publicable` marcado; ninguno solo basta. Si la ficha es Insignia, `Publicable` exige métrica ancla + evidencia, y si falta cualquiera el build falla a propósito.
3. En cada build, el loader (`notionLoaders.ts`) lee Notion, valida con Zod, y cachea/comprime cada imagen localmente (las URLs de Notion son firmas S3 que expiran en ~1h).
4. Un Cloudflare Worker (`notion-deploy-relay`) escucha los webhooks nativos de Notion sobre 3 de las 4 fuentes (SSOT casos, Copy Oficial, CMS Imágenes), valida la firma HMAC y dispara el Deploy Hook de Cloudflare Pages. La base de Métricas oficiales queda fuera de la suscripción: sus cambios entran en el siguiente rebuild por push o Deploy Hook.

## Rubric (resuelto internamente)

- **Qué es:** un CMS donde el contenido de un sitio Astro vive fuera del código, en Notion.
- **Por qué importa:** editar contenido no requiere tocar código ni hacer deploy manual.
- **Qué se muestra:** las 4 fuentes reales, el gate de publicación, la validación con Zod + cacheo de imágenes, y el disparo automático del build.
- **Qué NO se explica:** DeepL, tokens de diseño, el schema Zod campo por campo: fuera de alcance para 40s.
- **Regla de audiencia:** para Notion Community la jerga correcta (Zod, HMAC, Deploy Hook) suma credibilidad. No simplificar conceptos que esta audiencia reconoce; sí simplificar los que no ve en pantalla.

## Storyboard (vertical 9:16, 40s, sin voiceover)

**Escena 1 · Contexto (0-5s)**
Texto: "diegomaury.mx está construido con Astro."
Visual: logo/nombre del sitio, silueta de código Astro de fondo (sutil).
Nota: para esta audiencia, abrir con Astro es contexto válido, no jerga.

**Escena 2 · El giro (5-11s)**
Texto: "Pero el contenido no vive en el código.\nVive en Notion."
Visual: transición código → interfaz Notion (representación simplificada).
Nota: este es el momento protagonista: Notion entra como revelación, no como escenario.

**Escena 3 · Las 4 fuentes (11-19s)**
Texto: "4 fuentes de Notion alimentan el sitio:"
Luego 4 líneas cortas, una por una:
- "Casos de estudio (27 fichas publicadas)"
- "Copy del sitio (una página, no una base)"
- "Métricas oficiales"
- "Imágenes"
Visual: 4 tarjetas/íconos apareciendo en secuencia.
Nota: "fuentes", no "bases": el Copy Oficial es una página singleton. El paréntesis es un guiño deliberado para quienes conocen Notion.

**Escena 4 · El gate de publicación (19-27s)**
Texto: "Publicar exige dos marcas:\n\"Publicado\" y \"Publicable\"."
Segunda línea en mono: `draft = NOT (Publicado AND Publicable)`
Visual: un checkbox doble marcándose (representación simple del gate real del código); la regla aparece en tipografía mono como dato técnico.

**Escena 5 · El build automático (27-35s)**
Texto: "Editas en Notion.\nEl sitio se reconstruye solo."
Visual: flujo Notion → Worker (webhook firmado) → Cloudflare Pages, flecha de reconstrucción.
Nota: precisión de hechos: el webhook cubre 3 de las 4 fuentes (casos, copy, imágenes); las métricas entran en el siguiente rebuild. Evitar la frase "cada vez que algo cambia en Notion", es falsa para la base de Métricas.

**Escena 6 · Recap (35-40s)**
Texto: "Notion es el CMS.\nAstro es el motor."
Visual: los dos logos/nombres juntos, cierre limpio.
Nota: cierre técnico conservado a propósito: para Notion Community esta línea resume la arquitectura con precisión y sin venta.

## Música

Fondo sutil, sin cues de beat-sync específicos (se detectan en composición si el track lo soporta). Prioridad: legibilidad del texto por encima del ritmo musical.

## Changelog

### v2 (21 ago 2026, revisión del usuario)
1. Audiencia cambiada de "sin contexto técnico" a Notion Community; tono de `clear` a `technical`.
2. "4 bases" corregido a "4 fuentes": el Copy Oficial es una página singleton, no una base.
3. Escena 5 corregida: el auto-publish cubre 3 de las 4 fuentes; se elimina la generalización "cada vez que algo cambia en Notion".
4. Hechos enriquecidos para la audiencia: firma HMAC del webhook, validación con Zod, conteo verificado 27/30, regla del gate en tipografía mono.
5. Apertura y cierre conservados a propósito: la jerga (Astro, CMS, motor) funciona para esta audiencia.

### v3 (21 ago 2026, verificación en vivo)
6. Cifra 27/30 re-verificada por SQL directo contra el SSOT en esta sesión (no solo aceptada del plan v2): 30 filas totales, 30 con `Estado publicación = Publicado`, 27 con `Publicable` también marcado. Confirma el número exacto y reemplaza el conteo desactualizado de CLAUDE.md (14, snapshot 2026-08-13).

### v4 (31 ago 2026, construcción de la composición)
7. Design system canónico aplicado: leído de Claude Design (`019dd0ff-…`) vía DesignSync — `v2-tokens.css`, `Manual de Marca.html`, logo-pack. Tokens exactos, regla cardinal (1 ember por escena), escala tipográfica literal, assets del logo maestro staged en `composition/assets/logos/`. Detalle en `composition-brief.md § Visual Identity` (reescrito).
8. Composición Hyperframes construida (`composition/index.html`, monolítica, 1 timeline GSAP, 6 escenas, 1080x1920, 40s). `npx hyperframes check` limpio.
9. Audio: sin bed musical (decisión del usuario). SFX mínimos de la librería local de media-use: 4× click-soft en S3, 1× ping en S4.
10. Render: `video-explainer.mp4` (1.6 MB, 40.0s, con audio).
