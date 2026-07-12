# Artefactos de evidencia de SOFI — diseño

**Fecha:** 2026-07-11
**Estado:** aprobado en brainstorming, pendiente de plan de implementación
**Ficha en Notion:** SOFI (`325c2572-f46a-4e17-bbcf-e27dde28a94f`), Capa Insignia, `Draft` / `Publicable = No`
**Repo del sistema:** `~/Documents/Claude/Projects/Claude_Code/Fliphouse-whatsapp-agent`

## Problema

La ficha SOFI es un caso Insignia con las **cuatro filas de su bloque de evidencia en ✖**. Los dashboards de HubSpot que sostienen sus cifras están bajo NDA de FlipHouse. El pendiente literal de la fase B1 dice: "definir con Diego qué artefacto es publicable (diagrama de arquitectura o demo)".

Sin artefacto, SOFI no pasa el gate de publicación, y es el caso más fuerte del portafolio: es el único sistema de producción que Diego construyó él mismo.

## Restricción que define el diseño

**Ningún artefacto que se construya aquí cierra las tres afirmaciones de negocio.** El speed-to-lead menor a 5 minutos y el paso de 5 a 30 leads por semana (+500%) se midieron en el CRM de FlipHouse, y ese dashboard está bajo NDA.

El RODI de +1,291% es un caso distinto, y conviene no confundirlo (corregido el 2026-07-11 contra la ficha de Notion): **no está bloqueado por NDA, es un modelo propio.** Cost-avoidance modelado, no ahorro realizado, sin auditoría externa; los ingresos sí son confidenciales y la metodología está disponible a solicitud. Presentarlo como "bajo NDA" lo haría sonar más sólido de lo que es.

Los tres se quedan en ✖, cada uno con su razón exacta.

Lo que sí se cierra, y de forma contundente, es la cuarta fila: **"SOFI en producción"**. El sistema existe, lo construyó Diego, corrió en producción y se comporta como el caso afirma. Y se añaden métricas nuevas y publicables que hoy no están en la ficha (latencia real, cobertura de tests, volumen de commits, estados del FSM).

**El sistema es de Diego; FlipHouse es el cliente.** Código, arquitectura y diagramas son publicables. Lo vedado son los datos de negocio.

## Los cinco artefactos

Todos se derivan del sistema real. Ninguno se ilustra.

| Artefacto | Fuente | Derivación |
|---|---|---|
| Diagrama de arquitectura | El repo de SOFI | Cada caja mapea a un archivo o servicio real: `webhookController`, `fsm.service`, S1 en Make, Railway, Postgres, Redis, OpenRouter, HubSpot. SVG inline, sin librerías. |
| Diagrama del FSM | `src/services/fsm.service.js` | Los 12 estados y sus transiciones válidas se **extraen del código con un script**. Si el código cambia, el diagrama se regenera. No se dibuja a mano. |
| Simulador de conversación | Corrida contra el sistema real | Una conversación completa contra el SOFI real en el banco de pruebas: firma HMAC válida, webhook real, modelo real, FSM real. El lead es ficticio. **No usa datos de producción.** Ver la corrección de abajo. |
| Ficha técnica | Repo + Postgres | Commits y tests desde `git` y el runner. Latencia real calculada de los timestamps de los mensajes. |
| Video de presentación | `/brag` sobre el repo de SOFI | **Pieza de presentación, no de evidencia.** Ver la regla de abajo. |

### Regla del video

`/brag` genera un video a partir del código, no de una ejecución. Es una representación, no una prueba. **No entra a la tabla de evidencia.** Va en el hero, etiquetado explícitamente como pieza de presentación.

Si una representación se presenta como prueba, no pierde credibilidad el video: la pierde toda la tabla de evidencia, en todos los casos del portafolio. La fila "SOFI en producción" se cierra con el simulador, la arquitectura, el FSM y la ficha técnica.

El video **no bloquea la implementación**. La página se construye con un hueco reservado para él; si el video no existe todavía, el hueco no se renderiza y la página funciona igual.

### Datos verificados del sistema (2026-07-11)

- 504 commits, del 3 de mayo al 23 de junio de 2026
- 390 tests
- FSM de 12 estados: `GREETING`, `INTENTION`, `URGENCY`, `CP`, `COLONIA`, `PROPERTY_TYPE`, `ESCRITURAS`, `VALUE`, `COMPLETED`, `HUMAN_TRANSFER`, `DISQUALIFIED`, `OFF_TOPIC`
- 5 escenarios de Make en producción (S1, S3, S4, S5, S6; S8 inactivo)
- Contrato de salida del modelo (`ai.service.js`, validado con Zod): `reply`, `intent` (enum cerrado de 8 valores), `confidence` (0 a 1) y `extracted_data`. **No devuelve un estado.**
- Stack: Node 24, Express, PostgreSQL, Redis, OpenRouter, HubSpot, WhatsApp Cloud API, Make, Railway

Estas cifras se recalculan al implementar, no se copian de aquí.

## La página

`cases/sofi.html`. HTML, CSS y JavaScript vanilla; DS v3 de `assets/css/styles.css`, como los demás casos. Sin build, sin dependencias externas.

Estructura, en orden:

1. **Hero.** Métrica ancla y la promesa del caso. Debajo, el video de `/brag` etiquetado como pieza de presentación.
2. **El caso, en corto.** Contexto, problema, sistema, trade-off de voz a WhatsApp. Copy tomado de la ficha de Notion, en la voz de Diego. Sin inventar nada.
3. **Cambio de registro.** Una línea que parte la página: hasta aquí te lo conté, de aquí en adelante te lo demuestro.
4. **Simulador.** Dos columnas. Izquierda: el hilo de WhatsApp avanzando mensaje a mensaje. Derecha, sincronizado: estado del FSM, transición disparada, modelo invocado, propiedad escrita en HubSpot. Controles de reproducir, pausar y paso a paso. Declarado arriba sin letra chica: reproducción de una conversación real de producción, sanitizada, con fecha, duración y liga al procedimiento de sanitización.
5. **Arquitectura.** El recorrido del lead. Cada caja nombra su archivo o su servicio.
6. **FSM.** Los 12 estados generados desde el código. El argumento técnico del caso, verificado contra `fsm.service.js` y `ai.service.js`:

   > El modelo no decide el estado. Clasifica la intención y extrae datos; una tabla de transiciones decide, valida contra el grafo y rechaza lo imposible. Si el modelo duda, el lead no avanza.

   La sección desarrolla los tres candados de `resolveNextState`: umbral de confianza (si el modelo va por debajo, el FSM no se mueve), tabla de transiciones (`TRANSITION_TABLE[estado][intent]`, y si la combinación no existe se queda donde está) y validación contra el grafo (`STATE_MAP` rechaza y loguea las transiciones inválidas; los estados terminales son absorbentes). La consecuencia es lo que hay que decir en voz alta: **el peor caso de una alucinación del modelo es que el lead no avance, nunca que aterrice en un estado imposible.**
7. **Ficha técnica.** Los números publicables, cada uno con su método de cálculo al lado.
8. **Lo que no puedo probar.** Las tres afirmaciones de negocio, con su ✖ y su razón exacta: NDA para las dos del CRM, modelo propio sin auditoría para el RODI.

La sección 8 es la que hace creíbles a las otras siete. Cualquiera publica lo que le conviene; la señal de que el resto no está inflado es que se enseña la parte que no se puede sostener.

## De dónde sale la conversación — corregido el 2026-07-11

El plan original extraía una conversación de la Postgres de producción, la sanitizaba y la pasaba por un gate. **Nada de eso hace falta, y además no era viable.**

**No era viable:** la base no guarda transiciones de estado. Tiene siete tablas y ninguna es un log del FSM. `messages` guarda texto y timestamps; `conversations`, solo el estado final. El estado por turno vivía en la sesión de Redis, que es efímera y ya expiró. El panel del simulador no se podía derivar de la base.

**No hace falta:** el banco de pruebas `tools/demo-harness` ya existe, y no es una simulación del sistema, **es el sistema**. Firma el payload con HMAC igual que Meta y lo mete por el `/webhook` real; el modelo es el real y el FSM es el real. Diego corrió una conversación completa contra él, haciéndola él de lead, y llega hasta `COMPLETED`.

Entonces el simulador se construye con una corrida del harness. Consecuencias:

- Se cae el pipeline entero: sin extracción de producción, sin sanitización, sin gate de PII, sin `.gitignore` defensivo.
- Se cae el riesgo de NDA y se cae el aviso a FlipHouse. **No se publica ningún dato de FlipHouse.**
- El argumento técnico no se debilita: que el FSM decide y el modelo no se ve igual de bien con un lead inventado.

**Lo que la página tiene que decir, y sin adornos:** esto demuestra que el sistema existe y funciona. **No** demuestra que atendió a un cliente real. Esa afirmación se sostiene con los commits, los tests y la palabra de Diego, no con el simulador. Si la página insinúa lo contrario, pierde exactamente la credibilidad que la sección "Lo que no puedo probar" está diseñada para ganar. Por eso esa sección lleva un cuarto punto: el simulador prueba la máquina, no el cliente.

## Fuera de alcance, a propósito

- **No se toca `index.html` ni el sitio LIVE.** La página existe, no se enlaza, no entra al sitemap hasta que Diego lo decida.
- **No se publica la ficha de Notion.** Sigue en `Draft` / `Publicable = No`. Cambiar `Estado publicación` o apuntar `Evidencia` a la URL es decisión de Diego, después de aprobar la página.
- **No se inventa ninguna cifra.** Las tres métricas de negocio se quedan en ✖.
- **No se publica ninguna conversación de producción.** Descartado por innecesario, no solo por riesgoso.
- **No se abre el repo de SOFI.** Un repo público sanitizado sería la prueba definitiva, pero es un proyecto propio. Queda anotado como opción futura.
- **No se levanta un sandbox vivo de SOFI.** Descartado: costo, mantenimiento y superficie de abuso, sin ganancia de evidencia frente al simulador.
- **No entra el dashboard (`app.html`).** Es un artefacto publicable que esta spec no contempla, y hoy tiene un bug conocido de mensajes duplicados. Candidato para una segunda vuelta.

## Criterio de éxito

- La página `cases/sofi.html` abre sin build y sin red externa, y se ve coherente con los demás casos.
- El simulador reproduce una conversación completa capturada contra el sistema real, con el estado del FSM sincronizado, y declara su naturaleza sin letra chica: sistema real, lead ficticio.
- Los diagramas de arquitectura y FSM se generan desde el código, no a mano.
- La ficha técnica solo contiene números recalculados en el momento de implementar, cada uno con su método.
- La sección "Lo que no puedo probar" lista las tres afirmaciones de negocio en ✖ con su razón exacta, más el límite del propio simulador: prueba la máquina, no el cliente.
- Ningún dato de FlipHouse entra al repo. Ninguno, porque ya no se extrae ninguno.
- El sitio LIVE queda intacto.
