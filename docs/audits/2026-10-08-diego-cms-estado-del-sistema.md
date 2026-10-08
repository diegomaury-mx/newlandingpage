# AS-IS Software Assessment — Diego CMS (Notion ↔ código)

**Date:** 2026-10-08 · **Branch:** master · **HEAD:** e343620
**Assessor:** Claude Code (Sonnet 5.5) · **Method:** read-only, evidence-first, grep-first
**Alcance:** la página Notion "🧭 Diego CMS · Estado del sistema" (corte 08 oct 2026) contrastada contra el repo, la base SSOT de casos y la infraestructura de Cloudflare.

## 1. Executive Summary

El sistema funciona y es coherente en lo esencial: el gate de publicación, el guardrail Insignia, el Worker de auto-publish y los conteos de fichas coinciden con lo que dice Notion. Se encontraron 0 hallazgos CRITICAL, 0 HIGH, 5 MEDIUM y 13 LOW (incluye la adenda de las cinco bases), todos de deriva entre documentación y realidad. Lo más importante: la página hub de Notion afirma un resolver de placeholders `{{metrica:slug}}` que no existe en el código, y `CLAUDE.md` sigue diciendo "4 Insignia" cuando Notion tiene 5 publicadas. Ningún hallazgo amenaza la operación hoy.

## 2. Evidence Baseline

| Item | Observed value | How captured |
|---|---|---|
| Git branch / HEAD / working tree | master / e343620 / `CLAUDE.md` modificado (+1 línea, entrada S2 sin commitear), `qa-output/` sin trackear | `git status`, `git diff --stat` |
| Repo structure | Astro `^7.2.4`; servicios de Notion en `src/services/` (≈2.1k LOC incl. tests); docs en `docs/platform/` (11 archivos) | `wc -l`, `ls` |
| Test command + result | `tsx --test` → 191/191 pass; `node --test tools/verify-metrics.test.cjs` → 25/25 pass | `npm test` (Verified) |
| Type check | `astro check` → 116 archivos, 0 errors, 0 warnings, 91 hints | `npx astro check` (Verified) |
| Coverage | No obtenible: el repo no define script de coverage | `package.json` |
| CI | Cloudflare Pages Git integration; no hay workflow de GitHub activo (`deploy.yml.disabled`) | CLAUDE.md §1, `ls` |
| Deploy | Último deploy production: commit e343620, 5/5 stages success (2026-10-08 14:01Z) | Cloudflare API (Verified) |
| Worker relay | Cron `*/5` con 12/12 invocaciones `success` en la última hora | GraphQL `workersInvocationsScheduled` (Verified) |
| Base SSOT casos | 31 Publicado: 5 Insignia + 24 Soporte con Publicable = Sí; 2 Archivo con Publicable = No | SQL sobre `collection://88257bc9…` (Verified) |
| Páginas generadas | `dist/` local: 76 HTML, 67 `<loc>` en sitemap-0; `dist/index.html` es de 07:55 local, anterior al último commit | `find`, `grep -c` (Observed) |

## 3. Dimension A — Architecture & Code

### Findings

**A-1 · Resolver de placeholders `{{metrica:slug}}` no existe en el código**
- Evidence: Notion hub, sección "4 fuentes": "Placeholders {{metrica:slug}} en casos y Home". `grep` de `{{metrica`/`metrica:` en `src/` y `tools/` (excluyendo tests) → 0 coincidencias. Las métricas se consumen solo vía `metricBySlug` (`src/utils/portfolioData.ts:181`) en `/portfolio`.
- Finding: la capacidad documentada no está implementada en `src/`. Puede estar en otro lugar fuera de lo buscado o ser un residuo del SOP viejo.
- Impact: quien edite un caso esperando que `{{metrica:slug}}` se sustituya publicaría el literal. Etiqueta: Documented, no Observed.
- Severity: **MEDIUM (provisional)**. Se resuelve confirmando si algún caso real contiene el literal en su body.

**A-2 · "Superficies permitidas" se lee pero no se aplica en el render**
- Evidence: `allowedSurfaces` solo aparece en `src/content.config.ts:159` y `src/services/notionLoaders.ts:300`; ningún `.astro`/`.ts` de render lo consume. El único filtro efectivo es `buildable` (Vigente + Pública/A solicitud) en `portfolioData.ts:182`.
- Finding: esto responde el pendiente abierto de la página hub ("qué combinación filtra el resolver"): filtra Estado y Publicabilidad, **no** Superficies. La verificación de superficie ocurre solo en `tools/verify-metrics.cjs` sobre HTML.
- Impact: una cifra con superficie no permitida puede renderizarse; el verificador es la única red.
- Severity: **MEDIUM**.

**A-3 · Nombre de propiedad `Objetivo con métrica y timeframe ` con espacio final**
- Evidence: `notionLoaders.ts:257` lee `"Objetivo con métrica y timeframe "`; el schema devuelto por Notion hoy lo muestra sin espacio final (el display puede recortarlo).
- Finding: no se puede confirmar desde el schema si el espacio sigue existiendo. Si Notion lo normalizó, `objective` queda vacío en silencio (el fallback no rompe el build).
- Severity: **LOW (provisional)**. Se resuelve comprobando que `objective` tenga valor en un caso construido.

### Verified healthy
- Gate de publicación: `draft = !(Publicado && Publicable)` en `notionLoaders.ts:284`, igual a lo documentado (Verified por conteos SQL: 29 pasan, 2 Archivo quedan fuera).
- Guardrail Insignia: `superRefine` en `src/content.config.ts:125-139` bloquea sin Métrica ancla o Evidencia. Las 5 Insignia actuales tienen ancla y evidencia (SQL: `sin_ancla=0`, `sin_evid=0`).
- `src/content.config.ts` es la ubicación correcta; el loader de casos y el schema están alineados.

## 4. Dimension B — Infrastructure & Operations

### Findings

**B-1 · Árbol de trabajo con cambio sin commitear en `CLAUDE.md`**
- Evidence: `git diff --stat` → `CLAUDE.md | 1 +` (entrada de S2 "Quién soy").
- Finding: el invariante de S2 existe solo en local; el commit e343620 ya está en producción sin esa regla en el repo.
- Impact: otro agente (Codex) o un clon limpio no verían la regla. Severity: **LOW**.

**B-2 · `dist/` local desactualizado respecto a HEAD**
- Evidence: `dist/index.html` modificado 07:55; el último commit se desplegó a las 14:01Z. 76 HTML en `dist/` contra "65 páginas por build" de Notion.
- Finding: el conteo de Notion no se puede verificar contra `dist/` local (incluye stubs de `public/`). Pendiente de verificación contra el log de build de Cloudflare.
- Severity: **LOW (provisional)**.

### Verified healthy
- Deploy de producción en e343620 con las 5 etapas en success.
- Cron `*/5` del relay disparando cada 5 min (12/12 success). Cierra el "riesgo activo" del `*/5` mudo para esta ventana de una hora.
- Worker `worker.next.js` valida HMAC SHA-256 y tiene `scheduled()` y filtro `EVENTS_PUBLIC_PROPERTY_IDS`, como describe CLAUDE.md.

## 5. Dimension C — Testing & Quality

### Findings

**C-1 · Sin medición de cobertura**
- Evidence: `package.json` no tiene script de coverage; la regla global pide ≥80%.
- Impact: no se puede afirmar el cumplimiento del umbral. Severity: **LOW**.

**C-2 · Las páginas `.astro` y los parsers de copy dependen de QA visual manual**
- Evidence: los 191 tests cubren servicios y utilidades; `test:a11y:astro` y `verify:visual:astro` requieren un `astro preview` manual (gotcha documentado) y no se corrieron en esta auditoría.
- Severity: **LOW**. Etiqueta: Unknown para a11y de las páginas actuales.

### Verified healthy
- 191/191 + 25/25 tests en verde. `astro check` con 0 errores y 0 warnings.

## 6. Dimension D — Product & Scope

### Findings

**D-1 · `CLAUDE.md` dice 4 Insignia; Notion tiene 5**
- Evidence: `CLAUDE.md` §1 y §4 ("HEINEKEN Green Challenge, REDUX, SOFI, HackSureste", "las 4 fichas Insignia"); SQL: 5 Insignia publicadas; la página hub también dice 5 Insignia.
- Finding: falta la quinta ficha Insignia en la lista de `CLAUDE.md`. Gana el estado real.
- Severity: **MEDIUM**.

**D-2 · `CLAUDE.md` y `docs/platform` citan una ruta de config que ya no existe**
- Evidence: `CLAUDE.md` líneas 44 y 160 y `notion-astro-contract.md` cabecera citan `src/content/config.ts`; la real es `src/content.config.ts` (el propio `incident-log.md:27` registra la migración).
- Severity: **LOW**.

**D-3 · La página hub de Notion describe el gate de Publicable solo para Insignia**
- Evidence: hub: "Si es Capa = Insignia, exige además Publicable = Sí". Código: el gate `Publicado AND Publicable` aplica a **todas** las capas (`notionLoaders.ts:284`).
- Impact: quien publique una ficha Soporte esperando que "Publicado" baste no verá la ficha. Es el caso de "publiqué X y no sale". Severity: **MEDIUM**.

**D-4 · El hub no menciona la base de eventos con su relay debounce ni el cron diario**
- Evidence: el hub habla de "3 fuentes editables" en el webhook; CLAUDE.md §1 documenta además eventos con debounce (`events_rebuild_pending`) y el cron diario `0 13 * * *`.
- Severity: **LOW**.

**D-5 · Pendiente abierto del hub: "sección 1 del CLAUDE.md espejo marcada STALE el 19 ago"**
- Evidence: la sección 1 del `CLAUDE.md` real tiene entradas posteriores a esa fecha (Resend, Taxonomía v2, S2) pero conserva D-1 y D-2. Sigue desactualizada en esos puntos.
- Severity: **LOW**.

### Verified healthy
- Conteos del hub (31 Publicado, 29 con gate completo, 5 + 24) coinciden exactamente con la SQL.
- El principio "Notion define el contenido, el código define la presentación" se cumple en los loaders revisados.

## 7. Severity Summary

| Severity | Count | IDs |
|---|---|---|
| CRITICAL | 0 | n/a |
| HIGH | 0 | n/a |
| MEDIUM | 5 | A-1 (prov.), A-2, D-1, D-3, E-1 |
| LOW | 13 | A-3 (prov.), B-1, B-2 (prov.), C-1, C-2, D-2, D-4, D-5, E-2, E-3, E-4, E-5, E-7 |

## 8. Risk Matrix

| ID | Impacto | Probabilidad | Nota |
|---|---|---|---|
| D-3 | Medio | Alta | Es el error editorial más probable (ficha Soporte "Publicado" sin `Publicable`) |
| A-1 | Medio | Media | Depende de si algún body contiene el literal |
| A-2 | Medio | Baja | Solo si se publica una cifra con superficie no permitida |
| D-1 | Bajo | Alta | Un agente trabajará con una lista de Insignia incompleta |

## 9. Verified Healthy

Gate de publicación, guardrail Insignia, conteos de Notion, deploy production, cron `*/5` del relay, 216 tests y `astro check` limpio.

## 10. Immediate Findings

Ninguno CRITICAL/HIGH. Prioridad más alta: **D-3** y **A-1**.

## 11. Recommended Next Actions

No se aplicó ningún cambio (auditoría de solo lectura). Propuesta, sujeta a tu aprobación:
1. **D-3**: corregir en el hub de Notion la frase del gate para que diga que `Publicable` es obligatorio en toda capa.
2. **A-1**: buscar en las 29 fichas el literal `{{metrica:`. Si no aparece, quitar la mención del hub y del SOP de CLAUDE.md; si aparece, implementar el resolver.
3. **D-1/D-2/D-5**: corregir `CLAUDE.md` (5 Insignia, ruta `src/content.config.ts`) y cerrar el pendiente STALE del hub.
4. **B-1**: commitear la entrada de S2 de `CLAUDE.md`.
5. **A-2**: decidir si "Superficies permitidas" debe aplicarse en el render o seguir delegado a `verify-metrics.cjs`.
6. **A-3 / B-2**: verificar `objective` en un caso construido y el conteo de páginas contra el log de Cloudflare.

## 12. Overall AS-IS Statement

Diego CMS opera como se documenta en su mecánica central (verificado con SQL, tests, `astro check`, deploy y cron). La deriva está en la capa de documentación: una capacidad documentada sin implementación (A-1), una regla de publicación descrita de forma incompleta (D-3) y una lista de Insignia desactualizada (D-1). No quedó verificado: a11y/visual de las páginas, el conteo de 65 páginas, el espacio final de `Objetivo con métrica y timeframe` y el filtro `Scope = Dentro` de eventos (fórmula no consultable por SQL). Las cinco bases se consultaron en la adenda.

## Adenda — Consulta de las cinco bases (2026-10-08)

Bases: SSOT Proyectos (`88257bc9…`), CMS Imágenes (`8dda9726…`), Métricas oficiales (`213ea2d0…`), Copy Oficial (página `d9ab8508…`) y Meetups y Eventos (`7c2e4e81…`). Todas leídas por SQL o fetch; el sitio publicado se contrastó con `curl`.

| Base | Filas | Estado |
|---|---|---|
| SSOT Proyectos | 31 Publicado (5 Insignia, 24 Soporte, 2 Archivo sin Publicable) | Coherente con el gate |
| CMS Imágenes | 30 slots: 21 Listo con imagen, 9 Sin empezar | 6 logos pendientes se ocultan por diseño |
| Métricas oficiales | 21 filas: 18 Vigente, 2 Condicionada, 1 Retirada | Todas `own`, ninguna con URL de evidencia |
| Copy Oficial | 1 página con S1-S8, P1-P5, SEO y Footer | Verificación de Notion expirada desde 2026-08-12 |
| Meetups y Eventos | 93 Publicado, 53 Borrador verificado, 48 Borrador sin verificar, 145 Retirado | Los 93 publicados están completos |

**E-1 · Cifras del Copy sin respaldo vigente en Métricas (MEDIUM)**
- Evidence: el sitio publicado muestra "15+ años de trayectoria" (curl a diegomaury.mx); la métrica `voluntariado-anios-trayectoria` dice "10+ años" y es la única con superficie Hero. El Copy S6 usa "30+ programas" de HackSureste Ops, pero `hacksureste-programas-desarrollados` es Publicabilidad Interna y solo permite `llms.txt`. "400+ emprendedores formados" (REDUX) y "#1 en el sureste de México" no tienen fila de métrica; la fila `redux-200-capacitados-retirada` está Retirada. "30+ proyectos liderados" tampoco tiene fila.
- Finding: cuatro claims numéricos del Copy no tienen una métrica Vigente y Pública que los respalde, y uno contradice a la métrica canónica. `verify-metrics.cjs` solo revisa elementos con `data-metric`, así que no los detecta.
- Impact: choca con la regla "una afirmación cuantitativa se publica con artefacto, creencia declarada o ✖". Los calificadores visibles ("cifra propia", "estimado") atenúan el riesgo pero no lo cierran. Falta confirmar que el S6 publicado repita esos textos (Observed en Notion, no en el HTML).
- Severity: **MEDIUM**.
- Cifras que sí cuadran: 9,905 (con calificador visible en el sitio), +600% HEINEKEN, 89.5%, 74.9% y "menos de 5 minutos".

**E-2 · "Grado de evidencia" no tiene la opción `belief` (LOW)**
- Evidence: Notion ofrece solo `published` y `own`; `src/content.config.ts:176` acepta `published | own | belief`; `CLAUDE.md` define tres grados.
- Impact: ninguna métrica puede declararse `belief` desde Notion. Hoy no hay ninguna que lo necesite.

**E-3 · Slots huérfanos y hub desactualizado en CMS Imágenes (LOW)**
- Evidence: `foto-diego-colaboremos`, `reserva-hero` y `reserva-quien-atiende` no aparecen en ningún archivo de `src/`. Son residuos de S7 y de la página `/reserva` archivada. El hub de Notion habla de "10+ slots" y "4 logos de confianza"; la base tiene 30 slots y 11 logos Listo con nombre en el cinturón (14 Listo si se cuentan los 3 `-evidencia`). **Corregido en Notion el 2026-10-08.**
- Impact: ruido editorial. Subir una imagen a esos slots no cambia nada.

**E-4 · Copy Oficial: Footer con Calendly, página con verificación expirada y un bloque con UUID suelto (LOW)**
- Evidence: la sección Footer lista "Calendly" y `CLAUDE.md` prohíbe reintroducirlo; el código lee el Footer de `site.ts`, no de Notion, por lo que no hay efecto visible. En S6b, "Más experiencias" muestra el texto crudo `93ff9581-ba54-4ba8-a053-f7d0889cd4d0`, probablemente un bloque no renderizable. La propiedad de verificación de la página figura `expired`.
- Impact: el hub afirma que Copy controla el Footer, pero el código no lo lee. El UUID es un posible riesgo de renderizado, sin confirmar.

**E-5 · Campos vacíos en fichas publicadas del SSOT (LOW)**
- Evidence: 15 de las 29 fichas publicadas no tienen `Contexto tarjeta` (2 Insignia: HackSureste y REDUX). "Diego CMS" (Insignia #5) no tiene logo. "BTEM 2022" no tiene `Capacidades`, así que no aparece en los chips de filtro. 9 fichas no tienen `Organización`.
- Impact: tarjetas con menos contexto. Los fallbacks evitan que se rompa el build.

**E-6 · Eventos: saludable (sin hallazgo)**
- Evidence: los 93 Publicado están Verificados, con `https`, fecha, `Tipo` y Temas. Hay 53 Borrador ya Verificados en cola y 9 Borrador sin fecha ni verificación. `CLAUDE.md` citaba 103 eventos el 2026-10-05 y hoy hay 93 Publicado (cifra que baja si alguno se retiró o venció). El filtro `Scope = Dentro` no se pudo consultar: queda pendiente.

**E-7 · `CLAUDE.md` dice "14 fichas de caso" para la cobertura EN (LOW)**
- Evidence: hay 29 fichas que pasan el gate. Es la misma deriva de conteos que el hub advierte ("15, 14, 27 y 29").

### Acciones adicionales propuestas
1. **E-1**: decidir si "15+ años" se corrige a "10+" o si se actualiza la métrica, y dar de alta (o retirar del copy) los claims "30+ programas", "400+ emprendedores", "#1 en el sureste" y "30+ proyectos".
2. **E-3**: borrar los 3 slots huérfanos y actualizar el hub.
3. **E-2/E-4/E-5/E-7**: ajustes de documentación y de contenido menores.
