# HEINEKEN — corrección de cifras en el draft (2026-08-18)

Página: `🍺 CASE 1 — HEINEKEN Green Challenge (ES)` (`https://app.notion.com/p/33b0fe3c51c5818b929ffc2b18be5904`).

Fuente canónica verificada (no cambia, ya está en `metrics.json`/`llms.txt`/`portfolio/heineken.html`): *"+600% de crecimiento regional en registros (ed. 1 a ed. 3, 2019-2021); línea base de 35 propuestas documentada en prensa (La Jornada Maya, 06/08/2019), cifra final estimada."* Sin cifra final absoluta — solo el porcentaje, porque el número final no está reconstruido con detalle.

Diego confirmó (2026-08-18): corregir el draft a estas cifras y quitar el 9,905 por completo.

---

## 1. Sección "El problema que nadie había nombrado"

Reemplazar:

```markdown
Los números lo confirmaban: la edición anterior había logrado **36 registros en 6 estados**. Unos 6 por estado. En algunos, menos.
```

Por:

```markdown
Los números lo confirmaban: la edición anterior había logrado apenas **35 propuestas en 6 estados** (línea base documentada por La Jornada Maya, 06/08/2019). Menos de 6 por estado en promedio.
```

## 2. Tabla "Los resultados"

Reemplazar la fila:

```markdown
<tr>
<td>Crecimiento en registros (sureste)</td>
<td>**+600%** — de 36 a casi 300</td>
</tr>
```

Por:

```markdown
<tr>
<td>Crecimiento en registros (sureste)</td>
<td>**+600%** — línea base de 35 propuestas documentada en prensa, cifra final estimada</td>
</tr>
```

Eliminar por completo la fila:

```markdown
<tr>
<td>Emprendedores inscritos (agregado INCmty, HGC incluido)</td>
<td>**9,905**, estimado operativo</td>
</tr>
```

(El 9,905 es un agregado de todos los programas INCmty, no un dato propio de HEINEKEN — atribuirlo solo a este caso sobreestima el alcance.)

## 3. Cierre — "¿Por qué importa este caso?"

Reemplazar:

```markdown
Un programa que tenía 36 registros en una región llegó a casi 300. No con más presupuesto. Con mejor diseño.
```

Por:

```markdown
Un programa que apenas registraba 35 propuestas en la región creció más del 600%. No con más presupuesto. Con mejor diseño.
```

---

## Pendiente
- Revisar y pegar manualmente en Notion (la página no usa toggles, pero se sigue el mismo criterio de precaución que con SOFI).
- Una vez corregido HEINEKEN, evaluar si el resto del draft (secciones "El experto tuve que ser yo", "La decisión que lo cambió todo", "Cuando llegó la pandemia", "REDUX") tiene otras cifras que verificar contra `metrics.json` antes de considerarlo listo para migrar al SSOT de casos.
