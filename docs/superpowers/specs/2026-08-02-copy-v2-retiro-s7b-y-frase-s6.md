# Spec: retiro de S7b y ajuste de frase en S6 (Copy v2)

**Contexto:** propuesta "🧪 Propuesta · Copy v2 (sin S7b y S8) — Borrador para evaluación" (`9201338e`) planteaba 3 cambios sobre "Copy Oficial · diegomaury.mx (SSOT)" (`d9ab8508`). Se evaluó cada uno contra el estado real del sitio (`src/pages/index.astro`):

1. Eliminar S7b · Confianza directa → **aprobado**. El widget de Senja (testimonio único de Shaili Zappa) ya está fusionado dentro de S6b (bloque "Más experiencias", `index.astro:679-691`) desde el pivote del 2026-07-31. S7b es contenido muerto en el SSOT, duplicado real.
2. Eliminar S8 · Siguiente paso → **rechazado**. La premisa de la propuesta era que S7 sobrevive como "cierre único del sitio", pero S7 ya no existe en el código (`SECTION_IDS` en `index.astro:62-71` no tiene entrada S7 desde el retiro del 2026-07-31). S8 es el único CTA final vigente y en vivo (`s8-siguiente-paso`) — no se toca. La propuesta se escribió sobre una versión del SSOT que no reflejaba ese retiro.
3. En S6, reemplazar "cuando yo ya no esté" → **aprobado**.

Diego decidió (2026-08-02): mantener S8 como está, aplicar solo los cambios 1 y 3. **No editar directo con `notion-update-page`** (gotcha de toggles/columns documentado en memoria `notion-update-content-gotcha`: el comando descarta hijos de toggles y bloques hermanos). Diego pega esto manualmente en la página, respetando la indentación de toggles existente.

---

## 1 · Eliminar la sección `# S7b · Confianza directa`

Ubicación: dentro de "Versión Actual", entre `# S7 · Colaboremos` y `# S8 · Siguiente paso`.

Contenido actual a remover (toggle completo, con su encabezado):

```
# S7b · Confianza directa

## Respaldo directo antes del CTA final.

**Widget dinámico:** tarjeta individual de Senja (`d5b4c965-596d-4cb7-81d0-ef2a0b60ab6c`), un solo testimonio (Shaili Zappa). Carga diferida (IntersectionObserver). Sin copy propio en el bloque: el contenido lo resuelve el widget.
```

Mover este bloque completo a la página "Obsoleto · Secciones reemplazadas el 24 jul 2026 (pivote a carátula de portafolio)" (`859a1c63`), con una nota de que se retiró el 2026-08-02 por duplicar el widget ya activo en S6b.

---

## 2 · Ajustar la frase de cierre en S6 · Sistemas propios

Dentro de `# S6 · Sistemas propios`, bloque `## El verdadero entregable`, última línea.

Actual:

```
Porque el objetivo nunca ha sido entregar un proyecto.
Es construir capacidad que siga generando resultados cuando yo ya no esté.
```

Nueva:

```
Porque el objetivo nunca ha sido entregar un proyecto.
Es dejar instalada una capacidad que el equipo sostiene y hace crecer por sí mismo.
```

**Nota de estilo (no bloqueante):** esta frase queda muy cerca en patrón de la línea de cierre de S5 · Cómo trabajo ("Es dejar instalada una forma de operar que aguante el tiempo"), dos secciones antes. Si en una próxima revisión de copy se quiere variar el arranque de una de las dos, aquí queda registrado.

---

## 3 · Fuera de alcance de este corte

- **S7 · Colaboremos** sigue presente en el SSOT tal cual, sin tocar. Es contenido ya muerto en el código (no tiene ancla en `SECTION_IDS` desde el 2026-07-31) pero Diego no pidió purgarlo del documento en esta decisión — queda como estaba.
- La página "Propuesta · Copy v2" (`9201338e`) no se marca resuelta aquí; eso lo hace Diego al aplicar el cambio en la SSOT.
