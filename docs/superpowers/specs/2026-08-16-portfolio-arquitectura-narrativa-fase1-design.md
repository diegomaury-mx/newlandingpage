# Arquitectura narrativa de /portfolio — Fase 1

Fecha: 2026-08-16
Origen: "Propuesta actualizada de arquitectura narrativa para el Portafolio · Diego Maury" (documento externo de Diego)
Alcance: solo Fase 1. Fase 2 (nuevas secciones) queda explícitamente fuera y sin fecha.

## 1. Contexto y por qué esta versión difiere de la propuesta original

La propuesta original de Diego describe una arquitectura narrativa objetivo de 10 bloques
conceptuales y una implementación de Fase 1 sobre "los 5 espacios existentes" (P1 Hero, P2
Insignia, P3 Soporte, P4 Archivo, P5 Siguiente paso). Al contrastarla contra el estado real
del repo el mismo día se encontraron tres premisas ya no vigentes:

1. **P4 · Archivo no existe como sección visible.** Se retiró de `/portfolio` el mismo
   2026-08-16 (commit `1ea801a`), decisión explícita documentada en `CLAUDE.md`
   ("no reintroducir ese filtro sin decisión explícita"). La propuesta lo trata como uno de
   los 5 espacios editables de Fase 1; ya no lo es.
2. **La franja "Por los números" y el CTA de cierre (P5) ya están en producción**, incluido
   el mecanismo de copy P1-P3+P5 vía Notion — la propuesta los describe como si fueran a
   crearse.
3. **"Contexto/Organizaciones" es el mismo tipo de contenido que se retiró el 2026-08-14**
   (memoria `optimizacion-portfolio-2026-08-14`, hallazgo PORT-003: "competía por atención
   con la evidencia real", commit `e7621de`). La propuesta lo reintroduce como bloque 08 sin
   mencionar ese precedente.

Además, durante el brainstorming se identificó un riesgo no resuelto por la propuesta: una
sección "Patrones" en `/portfolio` puede duplicar S5 "Cómo trabajo" del Home
(`index.astro`), que ya contiene "Mi modelo de intervención" (pasos + diagrama). La
propuesta lo señala como riesgo en su punto 13 pero no lo resuelve.

Decisión conjunta (Diego + esta sesión): la Fase 1 se resuelve **dentro de la estructura
actual**, sin crear ninguna sección nueva. La lectura narrativa de "una sola historia en
capas" (ver sección 4) reemplaza el enfoque de la propuesta original de tratar
Capacidades/Contexto/Patrones como bloques independientes.

## 2. Qué NO se implementa en esta fase (y por qué)

| Elemento de la propuesta | Decisión | Razón |
|---|---|---|
| P4 · Archivo | No se reintroduce | Decisión explícita del mismo día (commit `1ea801a`) |
| 08 · Contexto / Organizaciones | No se implementa | Precedente 2026-08-14 (PORT-003): competía con la evidencia real |
| 03 · Capacidades (sección propia) | No se crea | Ya se demuestra vía los chips de `capabilities` que cada tarjeta de caso muestra; una sección aparte sería redundante |
| 07 · Patrones | Pendiente, sin fecha | Riesgo real de duplicar el método canónico de S5 del Home. Solo se retoma si existe una definición inequívoca de cómo un "patrón observable de los casos" difiere del método de S5 — nunca como una segunda metodología |
| 04 · "Cómo leer los casos" (como bloque `P<n>` propio) | No se crea un bloque nuevo | Se resuelve como párrafo adicional dentro de P2 (ver sección 5) |

Ninguno de estos puntos se descarta conceptualmente — quedan documentados como decisión
editorial pendiente, no como pendiente técnico.

## 3. Qué SÍ se implementa

1. Copy nuevo en P1 (Hero).
2. Copy nuevo en P2 (headline + un párrafo nuevo — ver nota de renderizado en sección 5).
3. P3 sin cambios de copy.
4. Copy nuevo en P5 (solo headline; la lede ya coincide).
5. Cambio de qué 2 métricas de las 6 actuales funcionan como "ancla" (visual grande) vs.
   "soporte" (visual chico) en la franja "Por los números" — cambio de código en
   `portfolio.astro`, sin tocar `parseSiteCopy.ts`.

## 4. Modelo narrativo de Fase 1 (una historia, no cinco bloques independientes)

| Capa | Pregunta | Espacio real | Cambia |
|---|---|---|---|
| Tesis | ¿Qué haces? | P1 · Hero | Copy |
| Evidencia | ¿Puedo creerte? | Franja "Por los números" (código) | Qué 2 métricas son ancla |
| Casos | ¿Cómo lo haces? | P2 · Insignia + P3 · Soporte | Copy P2 (headline + contrato de lectura) |
| Confianza | ¿Puedo confiar en el registro? | Implícito en P2 ("los que puedo defender de principio a fin") + gobernanza de métricas ya existente (`tools/verify-metrics.cjs`) | Sin cambio nuevo |
| Transferencia | ¿Puedes hacer esto con mi problema? | P5 · Siguiente paso | Copy (headline) |

Patrón ("¿es reproducible?") queda deliberadamente fuera: no se responde con una sección
nueva mientras no exista esa definición inequívoca frente a S5.

## 5. Copy exacto para pegar en Notion ("Copy Oficial · diegomaury.mx SSOT")

**P1 · Hero**

```
## Convierto problemas complejos de ejecución en sistemas que funcionan y el equipo puede sostener.

Programas de innovación, operaciones y ecosistemas en LATAM. Cada caso muestra qué problema encontré, qué cambié y qué resultado puedo demostrar.
```

**P2 · Insignia**

```
## Casos donde la complejidad tuvo que convertirse en ejecución.

No encontrarás una colección de proyectos. Encontrarás problemas que tuvieron que resolverse bajo restricciones reales. Cada caso muestra el contexto, la decisión que cambió la operación, el sistema construido y la evidencia disponible del resultado.
```

**P3 · Soporte** — sin cambios. El bloque actual en Notion se conserva tal cual.

**P5 · Siguiente paso** (solo cambia el `##`; el párrafo se conserva igual)

```
## ¿Tienes un problema que necesita convertirse en ejecución?

Hablemos de tu caso. Agenda una llamada o escríbeme directo.
```

### Nota de renderizado — P2 no es solo un cambio de copy

Hoy `portfolio.astro` solo renderiza el `##` (heading2) de P2 como `<h2>`; el segundo
párrafo del bloque de Notion no tiene ningún lugar donde mostrarse. Pegar el párrafo nuevo
en Notion sin tocar código lo dejaría invisible en producción. El plan de implementación
debe incluir agregar un `<p>` bajo el `<h2>` de la sección `.gallery` en `portfolio.astro`,
leyendo `paragraphs(p2)[0]` (mismo patrón ya usado para `heroLede` en P1), con fallback
hardcodeado igual al resto del mecanismo P1-P3+P5 (nunca deja la sección vacía si Notion
aún no tiene el bloque).

## 6. Cambio de código: métricas ancla vs. soporte

En `src/pages/portfolio.astro`:

```
// Antes
const IMPACT_ANCHOR_SLUGS = ['incmty-participantes-inscritos', 'rodi-sofi'];
const IMPACT_SUPPORT_SLUGS = [
  'heineken-proyectos-evaluados',
  'hacksureste-participantes',
  'heineken-crecimiento-regional',
  'fliphouse-leads-crm',
  'sofi-cobertura-automatica',
  'fliphouse-speed-to-lead',
];

// Después
const IMPACT_ANCHOR_SLUGS = ['heineken-crecimiento-regional', 'fliphouse-speed-to-lead'];
const IMPACT_SUPPORT_SLUGS = [
  'heineken-proyectos-evaluados',
  'hacksureste-participantes',
  'fliphouse-leads-crm',
  'sofi-cobertura-automatica',
  'incmty-participantes-inscritos',
  'rodi-sofi',
];
```

Sigue habiendo 6 métricas de soporte (mismo grid, mismo CSS, sin cambios de layout) y 2
métricas ancla (mismo componente `.stat-anchor`). Verificado contra `metrics.json`: las dos
métricas promovidas a ancla (`heineken-crecimiento-regional` = "+600%",
`fliphouse-speed-to-lead` = "menos de 5 minutos") tienen `"Sitio web"` en su array
`superficies` y `estado: "Vigente"`. El componente ya renderiza `mandatoryQualifier` en
ambos niveles (ancla y soporte, `m.data.mandatoryQualifier`), así que degradar
`incmty-participantes-inscritos` (9,905) de ancla a soporte no le quita su framing
canónico — solo cambia su tamaño tipográfico.

No se requiere ningún cambio en `metrics.json`, en el schema de `content/config.ts`, ni en
`tools/verify-metrics.cjs`: el gate de métricas sigue corriendo igual, sobre el mismo
conjunto de 6 slugs, solo reordenados entre dos arrays que ya existían.

## 7. Impacto en el contrato Notion → Astro (CMS)

Cero. No se agrega ningún heading `P<n>` nuevo, no se modifica `parseSiteCopySections`
(`src/utils/parseSiteCopy.ts`), no se toca `src/content/config.ts` ni
`src/services/notionLoaders.ts`. El único archivo de código que cambia es
`src/pages/portfolio.astro` (dos arrays de strings + un `<p>` nuevo en el template).

## 8. Fuera de alcance / decisiones pendientes documentadas

- **Patrones**: pendiente de una definición inequívoca de diferenciación frente a S5 del
  Home antes de poder retomarse. No tiene tarea de seguimiento con fecha.
- **Contexto/Organizaciones**: no se reintroduce salvo decisión explícita futura de Diego
  que revierta el precedente de 2026-08-14.
- **P4 · Archivo**: no se reintroduce salvo decisión explícita futura de Diego que revierta
  el commit `1ea801a`.
- **Arquitectura conceptual completa de la propuesta (10 bloques)**: queda como referencia
  narrativa de largo plazo, no como backlog de implementación. Cualquier bloque nuevo futuro
  debe superar los 3 filtros que la propia propuesta define en su sección 18 (¿aporta
  función narrativa distinta? ¿tiene fuente de verdad clara? ¿justifica modificar el
  contrato técnico?).
