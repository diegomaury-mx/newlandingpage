# Content: Insights

## Propósito

Publicar reflexiones, análisis y puntos de vista de Diego Maury sobre temas de estrategia, ejecución, organizaciones, liderazgo y tecnología.

A diferencia de los Playbooks (que son guías de ejecución), los Insights son perspectivas: observaciones informadas, patrones identificados, y lecturas de situaciones complejas.

Los Insights construyen autoridad intelectual y voz. Son el contenido más editorial de la plataforma.

---

## Tipo de contenido

Archivos `.mdx` con frontmatter estructurado + artículo editorial completo.

---

## Convención de nombres

```
YYYY-MM-DD-kebab-case-del-titulo.mdx
```

La fecha en el nombre facilita la organización cronológica y previene colisiones de slug.

Ejemplos:
```
2024-09-15-por-que-los-programas-fracasan.mdx
2025-02-03-ia-como-sistema-no-como-herramienta.mdx
2025-11-20-el-costo-oculto-de-la-velocidad.mdx
```

---

## Reglas editoriales

1. Un Insight por archivo.
2. Cada Insight tiene una tesis central clara. No publicar reflexiones sin conclusión.
3. El campo `readingTime` debe estimarse honestamente (aproximadamente 200 palabras por minuto).
4. El campo `category` debe usar una categoría existente del sistema. No inventar categorías nuevas por Insight.
5. Los `tags` son descriptores secundarios, no categorías. Usar términos concretos.
6. `draft: true` por defecto. Solo Diego aprueba la publicación.

---

## Campos obligatorios

- `title`
- `category`
- `date`
- `readingTime`
- `summary`
- `tags` (mínimo 1)
- `publishedAt`

---

## Categorías válidas

Las categorías se definen a nivel de producto (ChatGPT / Diego), no a nivel de contenido. Claude Code no define ni modifica categorías. Cuando se apruebe el PRD del Sprint 0, las categorías se registrarán aquí.

---

## Relaciones con otros contenidos

- `relatedTopics`: strings descriptivos, no slugs. Son etiquetas contextuales para navegación.

Los Insights no tienen relaciones directas con casos o playbooks por slug — esas conexiones se construyen editorialmente dentro del cuerpo del artículo.
