# Simplificación de copy — S2, S3, S5, S6, S8

Fecha: 2026-08-13
Fuente a editar: página Notion "Copy Oficial · diegomaury.mx (SSOT)" (`d9ab8508-660a-43e8-ac45-9386dd7903d9`), bloque `synced_block` → toggle "Versión Actual".

**Protocolo de edición:** Diego pega este texto a mano dentro de cada toggle de sección. No usar `notion-update-page update_content` (rompe el anidamiento de toggles/columns — ver memoria `notion-update-content-gotcha`).

**Objetivo:** eliminar repetición de ideas entre secciones y reducir el peso de la página, sin cambiar narrativa, storytelling ni el orden de las 8 secciones. Cero cambios de código — `parseSiteCopy.ts` sigue leyendo por nivel de heading, no por texto literal.

---

## S2 · Quién soy

Cambios:
- Se elimina la línea `## Construyo lo que hace falta para que las cosas pasen.` completa (repetía el headline de S1 y el remate de S6).
- Se recorta la bio final: se quita la última cláusula ("...preparo a tu equipo para operarlo por su cuenta y dejo una forma de operar que tu equipo entiende, usa y sostiene"), que duplicaba el remate del paso 05 de S5.
- Todo lo demás (tagline, los 2 párrafos de intro, la transición a roles, los 3 roles, las cifras) queda igual.

**Texto final para pegar (reemplaza todo el contenido de S2):**

```
*Hagamos que las cosas pasen.*

A lo largo de mi carrera he construido comunidades, programas, metodologías y sistemas para ayudar a las organizaciones a convertir su visión en resultados tangibles.

No me interesa sumar proyectos. Me interesa resolver el mismo problema desde distintos frentes: construir la capacidad que una organización necesita para ejecutar mejor.

Esa forma de trabajar me ha llevado a desempeñar distintos roles. **Como emprendedor**, fundé HackSureste para construir un ecosistema regional de innovación desde cero.

**Como líder de programas**, diseñé y operé iniciativas de innovación y emprendimiento para corporativos, universidades y ecosistemas en LATAM, incluyendo HEINEKEN Green Challenge.

**Como arquitecto de sistemas**, hoy diseño la forma en que estrategia, operaciones y tecnología trabajan como un solo sistema: la infraestructura que permite ejecutar una estrategia.

Entro a operaciones que dependen de la memoria de una persona, de un Excel o de la buena voluntad del equipo. Mapeo el proceso real y diseño el sistema que lo reemplaza. No entrego un reporte y me voy: lo pongo en marcha con tu equipo.

**30+** proyectos liderados • **10+** años de trayectoria • **9,905** participantes en programas
```

---

## S3 · El problema que resuelvo

Cambios:
- Se fusionan las 2 últimas oraciones del primer párrafo (decían lo mismo con distintas palabras).
- Párrafo 2, párrafo 3, diagrama y quote quedan igual.

**Texto final para pegar (reemplaza solo el primer párrafo; el resto de S3 no cambia):**

```
Una organización puede tener talento, recursos y una visión clara. Lo que suele faltar es una interpretación compartida: mientras dirección habla de crecimiento, prioridades y riesgo, cada área la interpreta desde su propia realidad, y todos terminan trabajando con compromiso, pero no en la misma dirección.
```

---

## S5 · Cómo trabajo

Cambios:
- Se recorta la intro de 3 oraciones a 1: las 2 primeras re-argumentaban el diagnóstico que S3 ya cubrió a fondo tres secciones antes.
- Los 5 pasos del modelo de intervención (01-05) y "Lo que entrego" quedan igual — el paso 05 sigue siendo el lugar donde vive el remate de "capacidad instalada".

**Texto final para pegar (reemplaza solo la intro, antes de "## Mi modelo de intervención"):**

```
Mi trabajo es identificar qué está frenando la ejecución, diseñar el sistema correcto y transferir la capacidad para que el equipo lo sostenga.
```

---

## S6 · Sistemas propios

Cambios:
- Se fusionan las 2 últimas oraciones de la intro en una sola línea (mismo contenido, menos saltos de párrafo).
- Las 3 tarjetas (REDUX, HackSureste Ops, SOFI) quedan igual.
- El cierre "El verdadero entregable" se recorta de 5 oraciones a 2 — las 4 que se quitan repetían el paso 05 de S5 y la propia intro de esta sección.

**Texto final para pegar — intro (reemplaza los 5 párrafos antes de "## REDUX"):**

```
Cada organización es diferente.

Lo que no cambia es que cada intervención deja aprendizajes, herramientas y modelos que fortalecen la siguiente.

Con el tiempo, esos aprendizajes dejaron de ser experiencias aisladas y se convirtieron en activos reutilizables: no empiezo cada proyecto desde cero, empiezo con años de conocimiento acumulado.
```

**Texto final para pegar — cierre (reemplaza el contenido bajo "## El verdadero entregable"):**

```
Los proyectos terminan. La capacidad permanece. Eso significa menos tiempo descubriendo el problema y más tiempo construyendo la solución adecuada.
```

*(Revisión 2026-08-13: se restauró la oración de eficiencia — es un beneficio concreto que no aparece en ninguna otra parte del copy. Solo se cortan las 2 oraciones que sí eran redundancia pura con S5/paso 05 y con la propia intro de S6.)*

---

## S8 · Siguiente paso

Cambios (el único punto con una decisión de formato, no solo de texto):
- El bloque **"### En qué puedo aportar"** hoy es un heading `###`, al mismo nivel que "### Paso 01/02/03" — por eso `parseSiteCopy.ts` lo está leyendo como una 4ª tarjeta del grid de 3 pasos (bug confirmado en el sitio hoy: la tarjeta sale con el guión de la viñeta pegado en el texto, sin cerrar bien).
- **Acción en Notion:** ese heading debe dejar de ser un heading `###` — convertirlo en texto normal (bloque de párrafo), con "En qué puedo aportar" en negritas al inicio, como una oración más. Colocarlo justo después de la intro de S8 y antes de "### Paso 01 · Revisa la evidencia".
- Las 5 viñetas + el párrafo "¿Estás contratando?" se comprimen a una sola oración.
- Las 3 tarjetas de pasos (01/02/03) y el CTA final quedan igual.

**Texto final para pegar (reemplaza el bloque completo "### En qué puedo aportar" + sus 5 viñetas + el párrafo "¿Estás contratando?"; recordar que este bloque va como párrafo normal, NO como heading):**

```
**En qué puedo aportar:** transformación organizacional, diseño de programas, operaciones y escalamiento, innovación y automatización con IA. ¿Buscas cubrir un rol o un proyecto? Considero dirección de programas y operaciones, por proyecto o de forma fraccional.
```

*(Revisión 2026-08-13: se restauraron "escalamiento" e "innovación" — la compresión original las cortaba, y eso es recorte de contenido/posicionamiento, no de redundancia. Las 5 áreas originales quedan intactas, solo cambia el formato de lista a oración.)*

---

## Bonus fix — typo en H1 de S5 (no relacionado a la simplificación)

`# Cómo trabajo?` está publicado hoy sin el signo de apertura. Corregir en la misma sesión de edición:

```
# ¿Cómo trabajo?
```

## Nota sobre "S2 sin headline propio"

Al quitar el H2 de S2 (`## Construyo lo que hace falta...`), la sección deja de tener un heading propio en el markdown de Notion. Esto **no es un riesgo de render**: `aboutHeadline` es el único valor de S2 que depende de un heading en `parseSiteCopy.ts`, y su uso en `index.astro` es `{aboutHeadline && <p>...}` — puramente condicional. El nombre/rol visibles en S2 ("Diego Maury" / "Strategic Program Director") vienen de S1 (`heroName`/`heroRole`), no de este H2, así que el encabezado visual de la sección no depende de él. Confirmado por lectura de código, no solo por el build.

## Checklist de publicación

- [ ] Pegar los 6 bloques de arriba en Notion (S2, S3, S5, S6 intro, S6 cierre, S8 — 6 ediciones en total)
- [ ] Confirmar que "En qué puedo aportar" en S8 quedó como párrafo, no como heading `###`
- [ ] Corregir el typo `# Cómo trabajo?` → `# ¿Cómo trabajo?` en S5
- [ ] `astro build` local para verificar que las 8 secciones renderizan bien y que S8 ya solo muestra 3 tarjetas de pasos
- [ ] Revisión visual rápida (scroll completo S1→S8) antes de dar por cerrado
- [ ] Entrada en Changelog — Portafolio D (cambio de copy publicado)
