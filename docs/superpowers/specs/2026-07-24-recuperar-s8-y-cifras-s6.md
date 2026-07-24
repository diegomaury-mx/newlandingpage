# Spec: recuperar S8 "Siguiente paso" y cifras por sistema en S6

**Contexto:** auditoría de copy 2026-07-24 (ver Changelog/memoria del proyecto) detectó que el copy nuevo en Notion ("Copy Oficial · diegomaury.mx (SSOT)", página `d9ab8508`, columna "Versión Actual") perdió dos cosas que sí existen en el sitio LIVE (`index.html`):

1. Las cifras por sistema en S6 · Sistemas propios (REDUX / HackSureste Ops / SOFI).
2. La sección completa S8 · Siguiente paso (CTA final de 3 pasos).
3. Los links legales en la línea de copyright del Footer (Política de privacidad · Términos y condiciones).

Diego decidió recuperar ambas sin perder "Lo que entrego" (que sí es contenido nuevo, se queda). Este documento trae el texto exacto listo para pegar — **no editar directo con notion-update-page** (gotcha de toggles/columns documentado en memoria `notion-update-content-gotcha`). Diego pega esto manualmente en la página, respetando la indentación de toggles existente.

---

## 1 · Cifras a insertar en S6 · Sistemas propios

Dentro de la sección `# S6 · Sistemas propios` de la "Versión Actual", agregar una línea de cifras después de los 3 párrafos de cada sistema y antes del divisor `---` que sigue. Cifras tomadas del LIVE (`index.html`, `.ip-stats` de cada tarjeta), ya publicadas y verificadas — no son cifras nuevas.

### Debajo de "## REDUX" (después de "Implementado en programas educativos y de innovación.")

```
400+ emprendedores formados • Framework registrado • Institucionalizado en Tec de Monterrey
```

### Debajo de "## HackSureste Ops" (después de "Construido y refinado durante cinco años de operación continua.")

```
3,000+ participantes (estimado) • 30+ programas • #1 en el sureste de México
```

### Debajo de "## SOFI" (después de "Es un sistema operando en producción.")

```
89.5% de cobertura automática • 74.9% de tasa de respuesta • Speed-to-lead menor a 5 minutos
```

---

## 2 · Nueva sección S8 · Siguiente paso

Agregar como nuevo toggle heading_1, **después de `# S7b · Confianza directa` y antes de `# SEO · Metadatos`**. Texto recuperado tal cual del LIVE (`index.html`, sección `#siguiente-paso`), ya publicado.

```
# S8 · Siguiente paso

## ¿Listo para convertir tu estrategia en un sistema que opera?

Diagnóstico de 30 minutos: gratuito, confidencial y sin pitch. Trabajemos juntos o no, sales con más claridad sobre tu problema de la que traías al entrar.

---

### Paso 01 · Agenda una sesión

Elige el horario que te funcione. Sin formulario ni aprobación previa.

30 min

---

### Paso 02 · Diagnóstico real

Hablamos del problema concreto: programa, stack, equipo, métricas. Sin generalidades.

Sin pitch

---

### Paso 03 · Propuesta

Si hay fit, en 48 horas tienes alcance, métricas y timeline. Sin compromiso.

48h

---

[ Agendar diagnóstico (30 min) ]  [ Descargar CV primero ]

Sin compromiso · Confidencial · Diego atiende directamente
```

---

## 3 · Links legales en el Footer

Dentro de `## Footer` (dentro del toggle `SEO · Metadatos`), la línea de copyright actual es:

```
© 2026 Diego Maury. Todos los derechos reservados.
```

Reemplazarla por (igual al LIVE, `index.html` › `.footer-copy`):

```
© 2026 Diego Maury. Todos los derechos reservados. · Política de privacidad · Términos y condiciones
```

("Política de privacidad" enlaza a `/politicas-privacidad.html`, "Términos y condiciones" a `/terminos-y-condiciones.html` — el enlace en sí Notion no lo preserva en texto plano, así que quien implemente el HTML/Astro debe mapear esas dos etiquetas a esas rutas, igual que ya se hace con Portafolio/LinkedIn/Calendly.)

---

## 4 · Fuera de alcance de este corte (no incluido aquí, por si Diego quiere resolverlo aparte)

- **"111 ideas validadas en una sola edición"** (tabla de Capacidades, fila Innovación, S4): esta cifra no aparece en `assets/data/metrics.json`. Antes de publicarla necesita pasar por el SOP de métricas (alta en Notion → SSOT → `verify-metrics.js`) o quitarse si no tiene respaldo.
- **Anonimización de "FlipHouse" → "una empresa PropTech"** (S3 y S4): parece decisión deliberada de confidencialidad del copy nuevo, no un error. No se toca a menos que Diego indique lo contrario.
- **Inversión de jerarquía nombre/tagline** (S2: "Diego Maury" grande vs "Construyo lo que hace falta..." grande) y **headline/eyebrow** (S4: "Dónde lo he aplicado" como H1 vs eyebrow): también parecen decisiones deliberadas del rediseño de copy, no pérdidas accidentales.
- **Foto junto a temas de conversación en S7** (existe en LIVE, no en el copy nuevo): pendiente de decisión sobre fotografía personal, igual que en el Hero (ver auditoría de feedback 2026-07-24).
