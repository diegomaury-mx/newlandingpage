# Reescritura de copy del index en la voz de Diego Maury — Design Spec

**Fecha:** 2026-07-10
**Autor:** Claude Code (Lead Software Engineer)
**Estado:** APROBADO 2026-07-10 con tres enmiendas (ver §0).
**Alcance:** copy de `index.html` + corrección de etiquetas de métricas al SSOT + limpieza de em dash en aria-label. No toca estructura de secciones, CSS, JS ni diseño.

---

## 0. Enmiendas de aprobación (2026-07-10)

1. **H1 = opción A (canónico SSOT):** "Tomo operaciones ambiguas y las dejo funcionando como sistemas medibles." Decisión abierta 1 cerrada.
2. **Nuevo lote en alcance: corrección de etiquetas de métricas al SSOT** (ver §6b). Números intactos, etiquetas alineadas: reetiquetar 9,905, unificar fechas del +600%, resolver pending de HackSureste.
3. **Limpiar em dash del aria-label (línea 722)** para cumplir la regla de marca al 100%.

Con esto el spec pasa de "propuesta de voz" a "propuesta de voz + cierre de gaps del SSOT" en una sola implementación.

---

## 1. Problema

El copy del index suena técnico e impersonal. Diego reportó que "no suena a como yo hablo". El diagnóstico confirmó cuatro síntomas: suena sin persona detrás, demasiado vocabulario de sistemas, frases largas y densas, y todo afirmación sin humanidad.

## 2. Objetivo

Reescribir el copy para que suene a Diego sin sacrificar el mensaje ni las cifras. Lector dominante: director o C-level con el mandato pero sin el resultado. Emoción objetivo: **alivio** ("aquí hay alguien que entiende mi problema"), no admiración.

## 3. Restricciones duras (no se rompen)

- **Intocables:** todas las cifras y sus notas al pie (3,231; 89.5%; +600%; 9,905; +1,291%; +500%; 74.9%; etc.) y los títulos de rol y credenciales, verbatim.
- Sin em dash. Sin jerga corporativa hueca. No inventar experiencias que no estén en las fuentes.
- Español únicamente. Un solo correo: dm@diegomaury.mx.
- No sumar los 3,000+ de HackSureste con los 9,905 de INCmty.
- Nunca el RODI solo: siempre con la nota de cost-avoidance modelado.

## 4. Motor de voz aplicado (destilado del Writing DNA, 68 posts)

El Writing DNA es de género ensayo. Adapto el **motor**, descarto los **rituales de ensayo** (apertura con fecha, firma "Nos vemos del otro lado", dato como gancho).

Reglas que sí entran al index:

1. **Primera persona + tutear al lector.** El sujeto siempre hace algo. Se acaba la tercera persona de método.
2. **Contraste "No es X. Es Y"** en las anclas de sección. Es su unidad mínima más reconocible.
3. **Aforismo citable menor a 15 palabras** para cerrar secciones con dirección.
4. **Observación → Problema → Principio → Aplicación** como estructura interna donde el bloque lo permite.
5. **1-2 conceptos ancla repetidos textualmente:** "sistema" y "traductor". Sin sinónimos elegantes.
6. **Legitimar antes de reencuadrar** en las autopsias.
7. **Una metáfora concreta y física**, máximo dos. No analogía corporativa.
8. **Filo = postura + contraste, no sarcasmo.** El corpus desmiente el sarcasmo sistemático (humor raro, <5%). Nada de cinismo.
9. **Cadencia:** frase base 15-25 palabras, golpe de una línea cada 2-3 párrafos, párrafo de 3-5 líneas.

## 5. Detechnificación (glosario de reemplazos)

El lector es C-level, así que el vocabulario **estratégico** se queda (ROI, riesgo, retorno, escala). Se va el vocabulario de **sistemas** que no aporta al director:

| Sale | Entra |
|---|---|
| governance | control / gobierno del área |
| handoff / handoffs | entrega / entregas |
| cross-functional | entre áreas |
| capacidad instalada | un sistema que tu equipo sostiene sin mí |
| speed-to-lead (en prosa) | tiempo de respuesta al lead (se conserva en la línea de resultado por ser dato) |
| buzzword | moda |
| trade-offs | decisiones difíciles |

Nota: en las líneas de **resultado** (cifras) los términos técnicos se conservan verbatim porque son parte del dato bloqueado. La detechnificación aplica a la prosa narrativa, no a las métricas.

---

## 6. Reescritura sección por sección

### S1 — Hero

**H1 actual:** "Transformo ambición en sistemas que funcionan."
**H1 aprobado (opción A, canónico SSOT):** "Tomo operaciones ambiguas y las dejo funcionando como sistemas medibles."
> Enmienda 1. La palabra "sistemas" se conserva como concepto ancla. `<span class="accent">` envuelve "sistemas medibles".

**Sub actual:** "Cuando una organización sabe a dónde quiere llegar pero no cómo convertir esa intención en una operación sostenible, ahí entro yo. Descubro el camino y construyo el sistema que lo hace realidad."
**Sub propuesto:** "Tienes la estrategia, el presupuesto y el equipo. Lo que falta es el sistema que conecta todo y lo pone a ejecutar. Eso construyo yo."
> Tutea, primera persona, más corto. Eco directo de tu About de LinkedIn.

Label, CTAs, métricas, trust strip: sin cambios.

---

### S2 — Tesis / Traductor

**H2 actual:** "El problema casi nunca es el que te reportan. Encuentro el mecanismo que de verdad frena tu ejecución y lo convierto en una capacidad que tu equipo sostiene."
**H2 propuesto:** "El problema que te reportan casi nunca es el problema. Es el síntoma. Encuentro lo que de verdad frena tu ejecución y lo dejo resuelto como un sistema que tu equipo sostiene."
> Añade el contraste "No es X. Es Y". Reemplaza "capacidad" por "sistema" (concepto ancla).

**Sub actual:** dos idiomas, board vs. trinchera, con métricas embebidas en una frase larga.
**Sub propuesto:** "Ese freno casi siempre vive en la brecha entre dos idiomas: el del board y el de la trinchera. Traduzco entre los dos hasta que tu equipo opera el sistema solo. Es la misma disciplina detrás del +600% de crecimiento regional en el sureste (HEINEKEN Green Challenge, edición 3 vs. edición 1, 2019-2021) y del payback modelado menor a un mes en FlipHouse (metodología disponible a solicitud)."
> Frases más cortas, "traduzco" como ancla. Cifras y notas intactas.

**Columnas traductor:**
- "Idioma C-level": "ROI, riesgo, governance, escala" → "ROI, riesgo, control, escala"
- desc board: "retorno medible, control y previsibilidad" (sin cambio)
- "Idioma trinchera": "Procesos, stack, fricción, ejecución" (sin cambio)
- desc trinchera: "herramientas, handoffs y cuellos de botella reales" → "herramientas, entregas y cuellos de botella reales"

**Cierre nuevo (aforismo, opcional):** "No traduzco para que se entiendan. Traduzco para que ejecuten."

---

### S4 — Selected Work

**H2:** "Tres intervenciones. El mismo patrón." Sin cambio (ya es telegráfico y Diego).
**Sub:** sin cambio (ya en voz, "los errores también son evidencia").

Los bloques STAR ya están en primera persona y son concretos ("construí SOFI"). **Cambio mínimo.** Solo se afinan las autopsias para rematar con aforismo y se detechnifica la prosa (no la línea de resultado):

- FlipHouse, Acción: "En lugar de contratar más SDRs, construí SOFI" → "En lugar de contratar más vendedores, construí SOFI". (resto igual)
- FlipHouse, Autopsia actual: "La primera versión perdía leads en estados intermedios. El arreglo no fue más IA: fue un sistema de control que garantiza que cada lead termina en un estado claro." → conservar, ya trae "No fue X: fue Y".
- HEINEKEN, Autopsia: conservar (ya trae el reencuadre "no era demanda, era diseño").
- HackSureste: conservar.

Líneas de resultado (todas las cifras): **intactas.**

---

### S3 — Cómo trabajo (Patrón)

**H2:** "El mismo método en cada intervención. 10+ años en programas y operaciones, 7+ en innovación." Sin cambio.
**Sub actual:** "No improviso por cliente. Aplico una secuencia que ya probo escalar sin colapsar las operaciones." (tiene typo "probo")
**Sub propuesto:** "No improviso por cliente. Aplico una secuencia que ya probé a escala, sin colapsar la operación."
> Corrige typo, primera persona limpia. "No improviso" ya es buen contraste.

**Pasos del acordeón:** conservar títulos (01 Caos → 05 Escala). Ajustes de prosa:
- 03 Diseño de sistema: "governance, datos, automatización y KPIs" → "control, datos, automatización y métricas".
- 04 Implementación: conservar el aforismo "Un sistema que el equipo no usa no es un sistema: es un documento." (es oro, "No es X. Es Y").
- 05 Escala: "Capacidad instalada que no depende de mí, con handoff completo al equipo." → "Un sistema que no depende de mí, con entrega completa al equipo." (deliverable label "Capacidad instalada · Handoff" es UI, decisión abierta 2).

---

### S5 — Sistemas propios (IP) + AI-Native

**H2:** "Metodología registrada. No consultoría generalista." Sin cambio (ya es contraste).
**Sub:** sin cambio.

Tarjetas IP (REDUX, HackSureste Ops, SOFI): prosa ya es sólida. Cambio mínimo:
- SOFI desc: "gobernanza de estados, Redis y PostgreSQL" → "control de estados, Redis y PostgreSQL". (dato técnico del sistema, se conserva el stack)

**Párrafo AI-Native actual:** "Opero IA a nivel de sistema, no como buzzword. El propio sitio es evidencia operativa: construido para humanos y para los agentes de IA que hoy filtran talento via RAG."
**Propuesto:** "Opero IA a nivel de sistema, no como moda. Este sitio es la prueba: lo construí para humanos y para los agentes de IA que hoy filtran talento antes de que un humano lo lea."
> Quita "buzzword" y "via RAG" de la prosa. El detalle RAG se queda en el chip para quien lo busca.

**Chips AI-Native:** conservar (son tags escaneables y parte de la señal para el evaluador técnico y los agentes). Decisión abierta 3.

---

### S7 — Servicios

**H2:** "Tres formas de trabajar conmigo." Sin cambio.
**Sub actual:** "Precios basados en outcome (RODI), no en horas. Los tres modelos son públicos: elige por el problema que tienes, no por el nombre del servicio."
**Sub propuesto:** "Cobro por resultado (RODI), no por horas. Los tres modelos son públicos. Elige por el problema que tienes, no por el nombre del servicio."
> "Cobro por resultado" más directo que "Precios basados en outcome". Contraste final intacto.

Ítems de servicio (detechnificar):
- "Governance + sistema de KPIs" → "Gobierno del área y métricas"
- "Coordinación cross-functional" → "Coordinación entre áreas"
- "Process mapping + diagnóstico" → "Mapeo de procesos y diagnóstico"
- "Revisión de decisiones y trade-offs" → "Revisión de decisiones difíciles"
- "Gobernanza de datos y stack" → "Gobierno de datos y herramientas"

**svc-argument** ("¿Por qué fraccional...?"): conservar. Ya es primera persona con contraste ("la razón real no es la velocidad"). Solo "capacidad instalada" → "un sistema que el equipo opera sin mí" (ya lo dice después, se unifica).

---

### S9 — CTA final

**H2:** "¿Listo para convertir tu estrategia en un sistema que opera?" Sin cambio.
**Sub:** sin cambio (ya es alivio + dirección puro Diego).
Pasos: sin cambio.
Footer tagline: "Hagamos que las cosas pasen." Conservar (es la frase de marca correcta, en nosotros, no la versión gurú "hago que las cosas pasen").

---

## 6b. Corrección de etiquetas de métricas al SSOT (enmienda 2)

Regla: **los números no se tocan.** Solo se corrigen etiquetas, atribuciones y fechas para alinear al SSOT (Copy LinkedIn §3 y checklist §4). Ocurrencias verificadas por grep.

### 9,905 — reetiquetar como agregado INCmty (estimado), no como métrica HGC ni de apertura

SSOT: "participantes inscritos, agregado de programas INCmty (HGC incluido), 2019-2022, estimado. Métrica de alcance, no de apertura."

- **Línea 779 (hero) y 849 (about strip):** "Emprendedores movilizados" → **"Participantes inscritos"**. ("movilizados" implica apertura; el SSOT lo define como alcance.)
- **Línea 780 (hero metric-s):** "Agregado, 4 ediciones INCmty" → **"Agregado de programas INCmty (HGC incluido), estimado"**.
- **Línea 850 (about strip as-s):** "4 ediciones nacionales" → **"Programas INCmty agregados, estimado"**.
- **Línea 959 (work result, tarjeta HEINEKEN):** actual "…9,905 emprendedores y 3,231 proyectos en 4 ediciones." → **quitar "9,905 emprendedores"** de la línea de resultado de HGC. 9,905 es agregado INCmty, no cifra de HGC; 3,231 sí es HGC. Queda: "…sureste a #1 nacional · 3,231 proyectos evaluados en 4 ediciones." Corrige la misatribución que marca el checklist SSOT.

### +600% — unificar fechas (edición 1 a edición 3, 2019-2021)

SSOT: "+600% entre la primera y la tercera edición." El programa completo (4 ediciones) corre 2019-2022; el +600% específico es ed. 1 a ed. 3 = 2019-2021.

- **Línea 775 (hero metric-s):** "Sureste, HEINEKEN Green Challenge 2019-2021" → conservar, ya correcto. Afinar a **"Sureste, HGC, ed. 1 a ed. 3 (2019-2021)"** para dejar explícita la base.
- **Línea 871 (tesis sub):** ya dice "edición 3 vs. edición 1, 2019-2021". Correcto, sin cambio.
- **Línea 959 (work result):** "crecimiento regional (2019-2022)" → **"+600% crecimiento regional (ed. 1 a ed. 3, 2019-2021)"**. El "2019-2022" del run completo se mantiene solo en el rol (línea 947) y en el dato de 4 ediciones.

### HackSureste 3,000+ — marcar estimado y no acumulable

SSOT: "3,000+ a lo largo del programa (estimado operativo, no acumulable con las cifras de INCmty)."

- **Línea 858-860 (about strip):** "3,000+ · Participantes HackSureste · 5 ediciones · 2018-2023" → sub-label a **"Estimado operativo, no acumulable con INCmty"**. ("5 ediciones" no está confirmado en el SSOT: ver decisión abierta 5.)
- **Línea 980 (work-img-slot):** placeholder de dev "Logo / foto HackSureste" visible en producción. No existe asset de logo (`assets/img/` sin archivo hack*). Copy-fix: limpiar a wordmark **"HackSureste"** para que no lea como TODO. Suministrar logo real queda fuera de alcance (gap de asset).

## 7. Cambios globales de vocabulario

Buscar y reemplazar en prosa narrativa (no en métricas ni labels de UI, salvo decisión 2):
governance → control · handoff → entrega · cross-functional → entre áreas · buzzword → moda · trade-offs → decisiones difíciles.

## 8. Decisiones (resueltas 2026-07-10)

1. **H1 del hero:** RESUELTA → opción A canónico SSOT (enmienda 1).
2. **Labels de UI con jerga:** default → se dejan las etiquetas cortas, EXCEPTO "Capacidad instalada · Handoff" del paso 05, que se unifica a "Sistema entregado · Sin dependencia" para no dejar "Handoff" visible tras limpiar la prosa.
3. **Chips AI-Native (RAG, MCP, LCP):** RESUELTA → se quedan. Son tags escaneables y señal técnica para evaluadores y agentes.
4. **Aforismos de cierre:** RESUELTA → sí, con filo. Se integran (folded) en párrafos existentes, sin agregar elementos DOM nuevos: tesis ("No traduzco para que se entiendan, traduzco para que ejecuten"), cómo trabajo ("El método no cambia. Cambia el caos al que se aplica"), sistemas ("Entrego sistemas, no tareas").
5. **HackSureste "5 ediciones":** RESUELTA → se retira (no verificado en SSOT). Queda "3,000+ participantes, estimado, no acumulable con INCmty, 2018-2023".

## 9. Fuera de alcance

Estructura de secciones, orden, CSS, JS, diseño visual, nav labels, otras páginas (casos, portfolio, cv). Este spec es solo copy del index.

## 10. Criterio de éxito

- Todo el copy narrativo en primera persona y tuteo.
- Cero cifras o notas al pie alteradas. Cero títulos de rol alterados.
- Al menos un contraste "No es X. Es Y" por sección clave (tesis, cómo trabajo, sistemas, servicios).
- Cero em dash. Cero jerga de sistemas en prosa (glosario aplicado).
- Un lector C-level entiende cada bloque sin diccionario técnico.
