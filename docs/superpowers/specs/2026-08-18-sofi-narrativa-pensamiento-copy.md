# SOFI — copy de narrativa de pensamiento (2026-08-18)

Fuente: respuestas literales de Diego en sesión de Claude Code 2026-08-18. Preparado para pegar manualmente en la ficha SOFI del SSOT (`https://app.notion.com/p/325c2572f46a4e17bbcfe27dde28a94f`), NO vía `notion-update-page update_content` (la página tiene tablas/callouts, riesgo de reordenar bloques hermanos).

Cambia 2 cosas sobre el body actual: (1) agrega una sección nueva "¿Qué es SOFI?" antes de "El problema", (2) reescribe la apertura de "El problema" con la observación real, (3) reescribe "La decisión que cambió el sistema" con la hipótesis, la iteración y la evidencia concretas. El resto del body (La transformación, La intervención, La arquitectura, Resultados, Evidencia, Scope, Cierre) no cambia.

---

## 1. Sección nueva — insertar después de los bullets de apertura, antes de `## El problema`

```markdown
## ¿Qué es SOFI?
SOFI es el agente de IA que diseñé y construí dentro del sistema RevOps: el "recepcionista automático" que recibe cada lead que llega por WhatsApp, lo atiende y lo califica usando tres modelos de IA trabajando juntos (conversación, razonamiento y transcripción), y lo deja organizado en HubSpot listo para que el equipo comercial lo trabaje.
```

## 2. Reescribir la apertura de `## El problema` (antes de "Leads entrando por varios frentes...")

Agregar este párrafo como primera línea de la sección, antes del párrafo existente:

```markdown
Cuando las campañas de captación en Meta y Make empezaron a funcionar, noté algo que no cuadraba: entraban más leads, pero no entraban más ingresos. No había quién los viera. Tenía que existir una manera de procesar esos leads, porque no estaban entrando de forma eficiente.
```

(El resto de la sección "El problema" sigue igual: "Leads entrando por varios frentes, Meta Lead Ads entre ellos..." hasta el callout "Eso no se arregla contratando a alguien que conteste más rápido...")

## 3. Reescribir `## La decisión que cambió el sistema` completa

Reemplaza el bloque actual:

```markdown
## La decisión que cambió el sistema
### La tecnología tuvo que ceder ante el comportamiento.
SOFI nació como agente de voz. La tecnología funcionaba. Pero descubrimos algo más importante: los prospectos no contestaban llamadas de números desconocidos, pero sí usaban WhatsApp.
Cambié el canal principal y rehice la parte necesaria del sistema para adaptarlo. La lógica de IA se mantuvo.
> El canal es una hipótesis de negocio. No una decisión de arquitectura.
```

Por esta versión:

```markdown
## La decisión que cambió el sistema
### La tecnología tuvo que ceder ante el comportamiento.
Mi propuesta original fue WhatsApp. El cliente insistió en voz, así que construimos el agente de voz y lo pusimos a prueba durante casi tres meses de iteración activa: probé varias plataformas de voces sintéticas y ajusté el prompt una y otra vez para que sonara natural.
La señal fue clara e inmediata: la gente colgaba justo después de escuchar que era una voz. No importaba qué tan natural sonara, no terminaban de confiar en que hablaban con una máquina.
Volví a proponer WhatsApp, ahora con la evidencia en mano. El cliente aceptó el cambio. Adapté la parte necesaria del sistema y mantuve la misma lógica de IA.
> El canal es una hipótesis de negocio. No una decisión de arquitectura.
```

(El learning de cierre ya vive en la propiedad `Reflexión` y no cambia: *"El canal es una hipótesis de negocio. No una decisión de arquitectura. Si lo volviera a hacer, lo validaría antes de construir todo alrededor de él."*)

---

## Pendiente de tu revisión
- Confirmar tono y literalidad de los 3 bloques.
- Una vez aprobado, pegar manualmente en Notion (ficha SOFI, body).
- Después de publicar, evaluar si aplicar el mismo tratamiento (definición del sistema + hipótesis+evidencia explícitas) a HEINEKEN, HackSureste y REDUX — decisión aparte, no incluida en este documento.
