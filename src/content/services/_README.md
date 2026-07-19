# Content: Services

## Propósito

Definir las modalidades de colaboración disponibles con Diego Maury: qué ofrece, cómo trabaja, qué entrega y en qué formato de engagement.

A diferencia del resto del contenido (que es editorial), los Services son datos estructurados que alimentan la sección de servicios de la plataforma y el CTA final.

---

## Tipo de contenido

Archivos `.json` o `.yaml` con datos estructurados. No son archivos MDX.

El tipo de colección es `data`, no `content`. No tienen cuerpo narrativo.

---

## Convención de nombres

```
kebab-case-del-servicio.json
```

Ejemplos:
```
retainer-mensual.json
proyecto-acotado.json
asesoria-estrategica.json
```

---

## Reglas editoriales

1. Un archivo por modalidad de servicio.
2. El campo `slug` debe coincidir exactamente con el nombre del archivo (sin extensión).
3. El campo `active: false` oculta el servicio de la interfaz sin eliminarlo.
4. Los `deliverables` deben ser concretos y verificables, no aspiracionales.
5. El campo `timeline` usa rangos aproximados en español (ej: "4–6 semanas", "Mensual").
6. No incluir rangos de precio en ningún campo. Las decisiones de precio son del Product Owner.
7. El campo `order` determina el orden de aparición en la interfaz. Empezar desde 1.

---

## Campos obligatorios

- `name`
- `slug`
- `tagline`
- `description`
- `deliverables` (mínimo 1)
- `timeline`
- `engagement`
- `order`

---

## Modalidades de engagement válidas

| Valor | Descripción |
|-------|-------------|
| `retainer` | Colaboración continua mensual con alcance definido |
| `project` | Proyecto acotado con entregables y timeframe fijos |
| `advisory` | Asesoría estratégica puntual por sesión o bloque |

---

## Relaciones con otros contenidos

Los servicios son referenciados desde Case Studies mediante el campo `relatedServices` (array de slugs). Esta relación construye el vínculo entre evidencia (casos) y oferta (servicios).
