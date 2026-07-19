# Content: Playbooks

## Propósito

Sistematizar los frameworks y metodologías que Diego Maury ha desarrollado y aplicado en sus intervenciones profesionales.

Un Playbook no es un artículo de opinión. Es una guía de ejecución estructurada: un problema específico, un framework para resolverlo, y pasos accionables con recursos de apoyo.

Los Playbooks son la principal expresión de propiedad intelectual en la plataforma. Demuestran que Diego no solo ejecuta — sino que ha sistematizado cómo ejecutar.

---

## Tipo de contenido

Archivos `.mdx` con frontmatter estructurado + contenido editorial desarrollado.

El frontmatter define el framework. El cuerpo MDX expande cada paso con profundidad.

---

## Convención de nombres

```
kebab-case-del-playbook.mdx
```

Ejemplos:
```
programa-aceleracion-comercial.mdx
diseno-sistemas-organizacionales.mdx
lanzamiento-producto-b2b.mdx
```

---

## Reglas editoriales

1. Cada Playbook resuelve un problema específico y bien definido. No publicar guías genéricas.
2. El campo `framework` debe nombrar el enfoque conceptual utilizado (ej: "SPINE Framework", "OKR Cascade").
3. Los `steps` deben ser accionables, no descriptivos. El lector debe poder ejecutarlos.
4. Los `resources` y `downloads` son opcionales pero aumentan significativamente el valor percibido.
5. `relatedCaseStudies` vincula el Playbook con evidencia real de su aplicación.
6. `draft: true` por defecto. Solo Diego aprueba la publicación.

---

## Campos obligatorios

- `title`
- `summary`
- `problem`
- `framework`
- `steps` (mínimo 1)
- `publishedAt`

---

## Estructura del cuerpo MDX

El cuerpo del archivo puede incluir:

1. Introducción al problema
2. Por qué este framework funciona
3. Desarrollo de cada step con contexto, ejemplos, y advertencias
4. Recursos adicionales
5. CTA contextual

---

## Relaciones con otros contenidos

- `relatedCaseStudies`: prueba de que este framework fue aplicado en situaciones reales.

Un Playbook sin casos relacionados es teoría. Un Playbook con casos es credibilidad.
