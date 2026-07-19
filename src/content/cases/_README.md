# Content: Case Studies

## Propósito

Documentar intervenciones profesionales donde Diego Maury lideró o contribuyó significativamente a una transformación organizacional medible.

Un caso de estudio no es un resumen de trabajo. Es evidencia estructurada de capacidad ejecutiva: qué problema existía, qué decisiones se tomaron, qué resultados produjeron esas decisiones.

---

## Tipo de contenido

Archivos `.mdx` con frontmatter estructurado + narrativa en formato largo.

El frontmatter define los datos del caso. El cuerpo MDX desarrolla la narrativa editorial.

---

## Convención de nombres

```
kebab-case-del-caso.mdx
```

El nombre del archivo se convierte en el slug de la URL.

Ejemplos:
```
heineken-green-challenge.mdx
fliphouse-revops-ai.mdx
innovation-systems-cava.mdx
redux-incmty-challenges.mdx
```

---

## Reglas editoriales

1. Un archivo por caso de estudio. No combinar múltiples casos en un solo archivo.
2. Todo el contenido debe estar en español, salvo nombres propios de organizaciones o productos.
3. Las métricas deben ser normalizadas y verificables. No incluir datos sin respaldo.
4. El campo `draft: true` es obligatorio hasta que Diego Maury apruebe el caso para publicación.
5. El campo `featured: true` solo puede asignarlo Diego Maury.
6. Ningún caso de estudio se publica sin revisión explícita del Product Owner.
7. El formato de cada logro sigue el patrón: **Verbo + qué + cómo + impacto + timeframe**.

---

## Campos obligatorios

Los siguientes campos del schema deben estar completos para que un caso pueda salir de `draft: true`:

- `title`
- `organization`
- `industry`
- `role`
- `period.start`
- `context`
- `challenge`
- `objectives` (mínimo 1)
- `actions` (mínimo 3)
- `results` (mínimo 1)
- `metrics` (mínimo 1)
- `publishedAt`

---

## Estructura de la narrativa (cuerpo MDX)

El cuerpo del archivo debe seguir esta secuencia:

1. Contexto
2. Problema
3. Objetivo (métrica + timeframe)
4. Mi rol
5. Acciones (3–5 bullets)
6. Resultados (métricas normalizadas)
7. Evidencia
8. Aprendizajes

---

## Relaciones con otros contenidos

- `relatedPlaybooks`: slugs de playbooks que sistematizan el enfoque utilizado en este caso.
- `relatedServices`: slugs de servicios que este caso demuestra.

Estas relaciones alimentan la navegación contextual entre secciones.
