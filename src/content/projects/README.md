# Content: Projects

## Propósito

Documentar proyectos de propiedad intelectual, iniciativas propias, o contribuciones significativas a sistemas y herramientas donde Diego Maury tuvo un rol central de diseño o construcción.

A diferencia de los Case Studies (que documentan intervenciones en organizaciones de terceros), los Projects documentan lo que Diego ha construido directamente: frameworks, metodologías, sistemas, plataformas, comunidades.

---

## Tipo de contenido

Archivos `.mdx` con frontmatter estructurado + descripción narrativa del proyecto.

---

## Convención de nombres

```
kebab-case-del-proyecto.mdx
```

Ejemplos:
```
spine-framework.mdx
fliphouse-platform.mdx
hackathon-operating-system.mdx
```

---

## Reglas editoriales

1. Un archivo por proyecto.
2. El campo `status` debe reflejar el estado real y actual del proyecto.
3. No incluir proyectos en los que el rol fue marginal o de soporte.
4. El campo `impact` debe ser concreto y medible, no aspiracional.
5. `draft: true` por defecto. Solo Diego aprueba la publicación.

---

## Campos obligatorios

- `name`
- `purpose`
- `description`
- `status`
- `role`
- `timeline.start`
- `impact`
- `publishedAt`

---

## Estados válidos

| Estado | Significado |
|--------|-------------|
| `active` | El proyecto está en operación o desarrollo activo |
| `completed` | El proyecto cumplió su objetivo y concluyó |
| `paused` | El proyecto está detenido temporalmente |
| `archived` | El proyecto no está activo y no se planea retomarlo |

---

## Relaciones con otros contenidos

- `relatedInsights`: artículos o reflexiones que surgieron de este proyecto.
- `relatedPlaybooks`: metodologías documentadas a partir de la experiencia en este proyecto.
