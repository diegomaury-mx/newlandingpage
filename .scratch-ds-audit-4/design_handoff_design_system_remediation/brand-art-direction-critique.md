# Crítica de Dirección de Arte — Diego Maury "Ember on Ink"
## Ronda 2: propuestas radicales
**Fecha:** 2026-09-10 · Entregable separado de `design-system-audit-report.md`. No se fusionan.

> Este skill emite juicio profesional fundamentado. Las conclusiones representan recomendaciones de diseño respaldadas por principios, referencias y comparaciones — pero no constituyen hechos verificables ni sustituyen pruebas con usuarios.

## Base del análisis

**Identidad completa** — tokens canónicos, 11 reglas escritas, ~25 piezas aplicadas y 3 superficies web, leídas como código. **Confianza alta** en paleta, tipografía y sistema de reglas. **Confianza media en composición**: leí el CSS, no vi las piezas renderizadas. **Confianza baja** en cómo se percibe el conjunto en el contexto real de venta (una reunión, un LinkedIn, un correo frío) — eso solo lo sabes tú.

## Supuestos

- **Supuesto:** el posicionamiento buscado sigue siendo *operador senior de programas complejos* — autoridad de ejecución, no agencia creativa. Lo infiero del título, del tagline imperativo y de que las métricas son el elemento más repetido del sistema. Corrígeme si cambió.
- **Supuesto:** pides radical en el sentido de *cambiar decisiones de fondo*, no en el de *subir el volumen*. Todo lo que sigue mueve la raíz del sistema, no su intensidad.

## Nota de verificación de benchmarks

Corrí una búsqueda sobre tendencias de color de marca 2026 y prácticas de dark mode. **Encontré material de categoría utilizable pero ningún dato verificable de marcas individuales** (hex, tipografías específicas) que pueda citar con confianza. Así que hablo de tendencia de categoría, no de marcas nombradas. Lo relevante de esa búsqueda:

- El color saturado puro sobre negro puro produce **halación** — un efecto de vibración que se describe como visualmente molesto; la práctica recomendada en dark mode es **bajar la saturación** del color de marca, no subirla.
- La lectura de 2026 sobre acentos: destacan **por contraste, no por intensidad**. La saturación alta ya no es la señal de energía; es la señal de 2021.
- El consenso de paleta sigue siendo **un primario, un secundario, un acento**, y "si un color se describe en una sola palabra, suele funcionar peor que uno difícil de nombrar".

Ese último punto es el que más pega aquí: **`#FF5C39` se describe en una palabra. "Naranja."**

---

## El diagnóstico de esta ronda, en una frase

La ronda anterior concluyó que el sistema no tenía un problema de identidad sino de obediencia. Eso se resolvió en las reglas y a medias en el código. Lo que queda expuesto ahora es lo de fondo: **las tres decisiones que definen el sistema — fondo near-black, acento naranja saturado, Plus Jakarta Sans — son, cada una por separado, la opción más frecuente de su casilla.** Juntas producen un sistema bien construido y de origen reconocible. Ninguna auditoría técnica va a mover eso, porque no es un defecto: es una elección.

Abajo, seis movimientos radicales. Ninguno es obligatorio. Cada uno tiene su costo declarado.

---

## P1 — Invertir el modo: claro institucional como primario

**Observación.** El sistema es dark-first por regla (regla 3) y tiene el modo claro relegado a "Modo Documento". Pero lo que Diego vende — programas, gobernanza, operación — se compra en documentos, propuestas, decks impresos y reuniones, no en interfaces. El modo que soporta el negocio está tratado como el modo secundario.

**Referencias.** *(conceptual)* La tradición institucional-editorial: papel, tinta, retícula, jerarquía por tamaño y espacio. *(categoría, verificado en términos generales)* El dark-first saturado es hoy el default de producto digital; la propia literatura de 2026 recomienda **planear la variante, no elegir un solo modo** y advierte de halación con saturados sobre negro.

**Consecuencia.** Invertir haría que el sistema se lea como *institución* y no como *producto*. Es el cambio que más diferencia produce por unidad de esfuerzo, porque cambia la primera impresión completa sin tocar un solo hex: la paleta clara ya existe y ya está verificada (`#FAF8FC` / `#0A0612` / `#3D2A52` / `#E4DAEE`).

**Trade-off.** Ganas distinción inmediata frente a todo el espacio dark-mode y ganas coherencia con el canal donde se cierra el trabajo. Pierdes el activo más emocional del sistema (el Deep Ink es lo que hace que las piezas se vean "bien" de un golpe) y obligas a rehacer las ~20 piezas fijas, que están construidas sobre fondo oscuro. Alternativa intermedia honesta: **dark para escenario (poster, quote cards, deck, redes), claro para todo lo que se lee** (sitio, propuestas, manual, correo).
**Nivel: reposicionamiento visual.**

## P2 — Ember deja de ser color de texto y pasa a ser bloque de tinta

**Observación.** Hoy Ember se usa mayormente como *color de tipografía y de línea* (eyebrows, labels, tagline, cifras en el sitio). Es su uso más débil: a 9-10px, un naranja saturado sobre near-black vibra y, en modo claro, ni siquiera pasa AA (2.9:1 — por eso ya existe la regla 8 prohibiéndolo).

**Referencias.** *(conceptual)* La lógica del sello y de la tinta directa: el color no colorea la letra, ocupa un campo y la letra se abre en negativo. Es la operación gráfica del cartel y del formulario oficial. *(categoría)* Coincide con "destacar por contraste, no por intensidad": un bloque de Ember con tinta encima da 6.53:1 real; el mismo Ember como texto pequeño no llega a 4.5:1 sobre claro.

**Consecuencia.** Ember pasa de teñir a delimitar. Se usa menos veces y pesa más. Además unifica dark y claro: el bloque funciona igual en los dos modos, el texto naranja no.

**Trade-off.** Ganas contundencia, consistencia entre modos y accesibilidad gratis. Pierdes el recurso más usado del sistema (el eyebrow naranja aparece en casi todas las piezas) y el sistema se vuelve más seco: menos calidez distribuida, más impacto puntual.
**Nivel: ajuste importante.**

## P3 — Bajar la saturación del acento (o irse al óxido)

**Observación.** `#FF5C39` es un naranja de saturación máxima. Sobre `#0A0612` produce exactamente la condición que la literatura de dark mode señala como problemática.

**Referencias.** *(categoría, verificado en términos generales)* la práctica de 2026 es desaturar el color de marca en dark mode; el acento se lee por contraste, no por intensidad. *(conceptual)* el territorio óxido/rust lee industrial y material; el naranja saturado lee digital y reciente.

**Consecuencia.** Un acento más apagado envejece mejor, deja de vibrar en tamaños pequeños y se despega del naranja de producto digital. Pero cambia qué texto puede ir encima: en un óxido profundo, el que pasa AA es el blanco, no la tinta — es decir, invalida la regla 11 recién escrita.

**Trade-off.** Ganas materialidad y longevidad. Pierdes reconocimiento acumulado en ~25 piezas y tienes que reabrir la decisión de texto sobre acento. **Sigo recomendando no moverlo si el objetivo es coherencia**; muévelo solo si el objetivo declarado es diferenciación, y entonces muévelo de verdad (no un 5%).
**Nivel: ajuste importante (desaturar) / reposicionamiento visual (irse al óxido).**

### Muestrario de revisión — acento

| Token propuesto | Hex | Contraste con tinta `#0A0612` | Contraste con blanco | Lectura |
|---|---|---|---|---|
| **Actual — Electric Ember** | `#FF5C39` | **6.53:1** ✅ | 3.07:1 ❌ | digital, urgente, saturado |
| Ember desaturado | `#D8543A` | 5.01:1 ✅ | 4.00:1 ❌ | mismo hue, menos vibración |
| Óxido / rust | `#B5441F` | 3.64:1 ❌ (✅ como no-texto) | **5.50:1** ✅ | industrial, material, más raro |
| Tierra quemada | `#8C3A1C` | 2.53:1 ❌ | 7.4:1 ✅ | casi marrón; deja de leerse como acento |

*(Muestrario de revisión para decidir, no asset de producción. Los cálculos son WCAG 2.x sobre las luminancias relativas; si eliges uno, el número entra al manual verificado — el manual hoy publica 12.2:1 donde el valor real es 6.53:1, ver H5 de la auditoría.)*

## P4 — Retirar Plus Jakarta Sans del display

**Observación.** Plus Jakarta Sans es una geométrica humanista gratuita, muy adoptada. Es la decisión menos distintiva del sistema y, al mismo tiempo, la que más superficie ocupa: todos los titulares de todas las piezas.

**Referencias.** *(conceptual)* La autoridad institucional se ha comunicado históricamente con serif (informe, memorándum, cabecera de periódico); la ejecución técnica, con grotesca industrial. El sistema actual está en el punto medio amable, que es también el punto medio de la categoría.

**Consecuencia.** Cambiar solo el display —serif editorial para titulares, DM Mono intacto para cifras y labels, y una neutra para cuerpo— reposicionaría el sistema de "producto digital" a "documento con autor". Es el cambio con mayor rendimiento de diferenciación por archivo tocado: son los titulares, no el sistema entero.

**Trade-off.** Ganas una voz propia y un contraste tipográfico real (serif + mono es un par mucho más singular que geométrica + mono). Pierdes la unidad de "una sola familia para todo", que es parte de por qué el sistema se ve limpio, y añades una dependencia de fuente. Ojo con la regla 10: si el display se va a serif, el peso 300 en >48px probablemente deja de funcionar y esa regla hay que reescribirla.
**Nivel: reposicionamiento visual.**

## P5 — Eliminar el vocabulario de tarjeta

**Observación.** Las tres superficies web están construidas con el kit universal de landing: tarjeta con fondo `--bg-2`, borde de 1px, radio 10-14px, hover con `translateY`, rejilla de tres columnas. Es el 80% de la superficie visible del sitio y no está en el manual — el manual solo habla de color, tipografía y espacio.

**Referencias.** *(conceptual)* Suizo/editorial: la información se separa con filetes y columnas, no con contenedores. El contenedor es el gesto del dashboard; el filete es el gesto del documento.

**Consecuencia.** Quitar radios y fondos de tarjeta y dejar solo hairlines cambiaría la lectura del sitio más que cualquier cambio de color, y a costo casi nulo: es CSS, no identidad. Además haría que el sistema web y las piezas fijas (que ya son de filete y bloque) por fin se parezcan entre sí.

**Trade-off.** Ganas coherencia interna y un aire menos SaaS. Pierdes la separación visual que hace legible el contenido denso — con nueve secciones cargadas de contadores, chips y pasos, el filete exige más disciplina de espacio (regla 6) para no volverse muro de texto. **Este es el que yo ejecutaría primero**: máximo cambio percibido, mínimo costo de identidad.
**Nivel: ajuste importante.**

## P6 — Revisar el hexágono

**Observación.** El isotipo es un hexágono con facetas. En 2026 el hexágono es una de las formas más asociadas a cripto, blockchain y plataformas tech; su uso está tan extendido que aporta poca información sobre quién es Diego.

**Referencias.** *(conceptual)* Una marca de operador de programas tiene un vocabulario propio disponible que casi nadie usa: la barra de fase, la línea de tiempo, la dependencia, el hito. El sistema ya tiene ese gesto y no lo explota: la **barra Ember** de 3-4px es, de hecho, la marca más propia que existe aquí.

**Consecuencia.** Promover la barra a marca —y bajar el hexágono a contenedor de avatar— daría un identificador imposible de confundir y coherente con lo que Diego hace. La barra ya está en el poster, el deck, las quote cards y los tokens (`.ember-bar-top`, `.ember-bar-left`).

**Trade-off.** Ganas un símbolo que significa algo. Pierdes todo el reconocimiento del isotipo, los 6 lockups, el logo-pack, los avatares y las plantillas — es el cambio más caro de esta lista y el único que requiere rehacer assets, no CSS. Y el hexágono está bien dibujado; el problema es de categoría, no de ejecución.
**Nivel: reposicionamiento visual. Coste alto. No lo haría antes de P5 y P1.**

---

## Si tuviera que elegir por ti, en este orden

1. **P5** (fuera las tarjetas) — mayor cambio percibido, costo de identidad casi nulo.
2. **P2** (Ember como bloque, no como texto) — resuelve accesibilidad, unifica modos, hace obedecer la regla 1 por construcción.
3. **P1 intermedio** (claro para lo que se lee, oscuro para escenario) — diferenciación real sin tirar el Deep Ink.
4. **P4** (serif en display) — si quieres voz propia y estás dispuesto a un cambio de fuente.
5. **P3** (desaturar) — solo si el objetivo declarado es diferenciación de acento.
6. **P6** (hexágono) — no todavía.

## Decisiones que necesito de ti

| # | Decisión | Opciones |
|---|---|---|
| **D-E** | Modo primario | dark-first (como hoy) · claro para lectura + dark para escenario · claro institucional primario |
| **D-F** | Rol del Ember | color de texto y línea (como hoy) · bloque de tinta con texto en negativo · las dos cosas, con regla explícita |
| **D-G** | Saturación del acento | mantener `#FF5C39` · desaturar a `#D8543A` · óxido `#B5441F` (y reescribir la regla 11) |
| **D-H** | Display | Plus Jakarta Sans (como hoy) · serif editorial + DM Mono · grotesca industrial |
| **D-I** | Vocabulario de contenedor | tarjetas (como hoy) · filetes y columnas, sin radio ni fondo |
| **D-J** | Isotipo | hexágono como hoy · hexágono solo como contenedor y la barra Ember como marca · explorar marca nueva |

Nada de esto entra al brief imperativo hasta que respondas. Lo que no decidas queda en "Pendiente de decisión".

---

## Decisiones confirmadas · 2026-09-10 (ronda 2)

Diego autorizó **sacrificar algo de identidad** y delegó el resto. Decidido por dirección de arte, con el criterio de gastar reconocimiento solo donde el rendimiento es alto:

- **D-I — Fuera el vocabulario de tarjeta.** Filetes y columnas: sin radio, sin fondo `--bg-2` como contenedor, sin borde de 1px alrededor de cada bloque. El fondo `--bg-2` se conserva solo como cambio de superficie a ancho completo de sección, no como caja. Es el cambio con más efecto percibido y el que menos identidad cuesta: el sistema web por fin se parece a las piezas fijas, que ya son de filete y bloque. **Contrapartida asumida:** con nueve secciones densas, el filete exige más aire — la regla 6 (espacio generoso) deja de ser consejo y pasa a ser requisito.
- **D-F — Ember pasa a bloque de tinta.** Deja de ser color de tipografía y de línea. Ember ocupa un campo y la letra va en negativo (tinta `#0A0612`, 6.53:1). Se conserva un solo uso lineal: la barra estructural de 3-4px, que es la marca más propia del sistema. **Efecto secundario deliberado:** la regla 1 se cumple por construcción, porque un bloque no se puede repetir doce veces en una página sin que se vea absurdo. También unifica dark y claro: el bloque funciona en los dos modos, el texto naranja no.
- **D-E — Modo por canal, no por defecto.** Claro institucional para lo que se lee (sitio, propuestas, manual, correo); Deep Ink reservado para escenario (poster, quote cards, deck, redes). No se toca el hex de nada: la paleta clara ya existe y ya está verificada. La regla 3 ("dark mode primario") se reescribe como "dark para escenario, claro para lectura".

- **D-K — Escala de cifras.** Las cifras salen de DM Mono y pasan a Plus Jakarta Sans 700, tabulares, en tinta. Dos niveles: hero metric / dato primario ≈52px, uno o dos por vista; cifra normal 19–22px. **El 52px no se convierte en "todos los números"**: si dos cifras del mismo bloque compiten al mismo tamaño, ninguna es primaria. DM Mono conserva eyebrows, fechas, labels y metadata — que es su rol en el contrato.

**Se mantienen abiertas, y recomiendo no ejecutarlas todavía:**

- **D-G — saturación del acento.** Un óxido diferencia de verdad, pero invalida la regla 11 recién escrita (en óxido pasa AA el blanco, no la tinta) y gasta el reconocimiento de ~25 piezas. Con D-F aplicado, Ember aparece menos veces y la vibración deja de ser un problema práctico: el argumento para desaturar se debilita solo.
- **D-H — display serif.** Es el cambio de voz más interesante que le queda al sistema, pero llega después de D-I: primero hay que ver el sitio sin tarjetas. Si con filetes ya se lee institucional, el serif puede ser innecesario.
- **D-J — isotipo.** Sigue siendo el más caro y el único que exige rehacer assets. No antes de que D-E y D-I estén en producción.

**Consecuencia de gobernanza:** D-E y D-F obligan a reabrir dos reglas del manual (la 3 y la 1/11) y a extender la paleta clara a piezas que hoy solo existen en oscuro. Eso es trabajo de sistema, no de CSS, y va a la fase 2 del plan.

---

*Crítica generada por el skill brand-art-direction · ronda 2 (propuestas radicales) · 2026-09-10*
