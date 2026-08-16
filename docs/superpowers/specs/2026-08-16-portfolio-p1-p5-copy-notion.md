# Plantilla Notion — copy narrativo P1-P5 de /portfolio

**Nota (2026-08-16, mismo día):** la sección Archivo se retiró de `/portfolio`
después de que esta plantilla se pegara en Notion. `P4` (abajo) ya no se lee
en código — queda como registro histórico de lo que se pegó, no hace falta
borrarlo de Notion ni de aquí. Para una ficha nueva, pega solo P1, P2, P3 y P5.

Pegar dentro de la página singleton "Copy Oficial · diegomaury.mx (SSOT)", columna
**Versión Actual**, después de la sección `# S8 · Siguiente paso` (o después de
`# SEO · Metadatos` / `## Footer`, el orden respecto a S1-S8 no importa — el
parser (`src/utils/parseSiteCopy.ts`) solo lee el código `P<n>` del heading, no
su posición).

Regla dura, igual que con S1-S8: no borrar ni renombrar el patrón `# P<n> ·`
(el código usa el número como ancla interna, `parseSiteCopySections` en
`src/utils/parseSiteCopy.ts:11`) — se puede renombrar libremente lo que va
DESPUÉS del `·`. En **P2** y **P5** ese texto sí se ve en el sitio (es el
"eyebrow" — la etiqueta pequeña arriba del título); en P1, P3 y P4 es solo
organizativo, no se renderiza.

Cada bloque de código de abajo es un heading `###` con toggle (mismo estilo
que S1-S8) seguido del contenido tal cual debe quedar en Notion. El texto ya
puesto es el copy que hoy vive hardcodeado como fallback en
`src/pages/portfolio.astro` — pegar esto tal cual no cambia nada en el sitio
hasta que Diego lo edite.

---

## P1 · Hero

```
# P1 · Hero {toggle="true"}

## Encuentro el mecanismo que frena la ejecución de operaciones complejas, y lo convierto en sistemas medibles que el equipo sostiene.

Programas de innovación, arquitecturas RevOps y ecosistemas de emprendimiento en LATAM. Este portafolio no publica lo que no puede probar, y lo dice en cada cifra.
```

Qué controla: `## ` → `<h1>` del hero de `/portfolio`. El párrafo siguiente →
la línea debajo del h1 (`<p>`). El eyebrow ("Strategic Program Director") está
hardcodeado en código, no viene de aquí.

---

## P2 · Insignia

```
# P2 · Insignia {toggle="true"}

## No son los casos más grandes. Son los que puedo defender de principio a fin.
```

Qué controla: el texto después de `P2 ·` (por defecto "Insignia") es el
eyebrow que aparece arriba del título de la sección de casos Insignia — hoy en
el sitio dice "Casos insignia" por el fallback de código, así que si quieres
que el eyebrow diga exactamente eso, escribe `# P2 · Casos insignia`. El `## `
es el título de la sección.

---

## P3 · Soporte

```
# P3 · Soporte {toggle="true"}

## El resto del registro. Menos protagonismo, la misma disciplina.
```

Qué controla: solo el `## ` (título de la sección de casos Soporte). Esta
sección no tiene eyebrow en el sitio.

---

## P4 · Archivo

```
# P4 · Archivo {toggle="true"}

Existen. No se exhiben. Ediciones y variantes de los casos anteriores, conservadas para trazabilidad.
```

Qué controla: el párrafo (sin heading `## `) es la nota que aparece junto al
listado de Archivo. Esta sección no usa ningún `## `.

---

## P5 · Siguiente paso

```
# P5 · Siguiente paso {toggle="true"}

## ¿Este registro resuelve lo que tienes enfrente?

Hablemos de tu caso. Agenda una llamada o escríbeme directo.
```

Qué controla: el texto después de `P5 ·` (por defecto "Siguiente paso") es el
eyebrow del CTA de cierre al final de `/portfolio`. `## ` es el headline del
CTA. El párrafo siguiente es la línea de apoyo. Los botones (Agendar / Escribir
un correo) están hardcodeados en código, no vienen de Notion.

---

## Verificación después de pegar

1. `notion-fetch` de la página y confirmar que aparecen los 5 headings
   `# P1 · ... ` a `# P5 · ...` dentro de "Versión Actual", cada uno con su
   contenido.
2. El sitio se auto-publica solo (Copy Oficial está en la suscripción de
   webhooks) — esperar ~90-115s del build + deploy y refrescar `/portfolio`
   sin caché.
3. Si algún bloque no aparece en el sitio, revisar que el heading sea
   exactamente `# P<n> · <lo que sea>` (nivel 1, con el punto medio `·`, no un
   guion ni dos puntos) — es lo único que el parser matchea.
