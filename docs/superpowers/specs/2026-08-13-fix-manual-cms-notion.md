# Fix manual CMS en Notion — texto corregido para pegar

Página: "Fuentes CMS" (`3a80fe3c51c580e2a14ee6268458b1da`), dentro del toggle
"Instrucciones" → `synced_block_reference`. Pegar manualmente (no vía API:
gotcha de toggles/synced blocks, ver memoria `notion-update-content-gotcha`).

---

## 1 · Reemplazo en "## 2 · Editar un caso de portafolio", paso 2

**Texto actual (obsoleto):**

> 2. Edita las propiedades que quieras (Organización, Tipo, Métrica ancla, Evidencia, Objetivo con métrica y timeframe, etc.) y/o el cuerpo de la página (contexto, problema, acciones, resultados, evidencia, aprendizajes — sigue la plantilla v2).

**Texto corregido:**

> 2. Edita las propiedades que quieras (Organización, Tipo, Métrica ancla, Evidencia, Objetivo con métrica y timeframe, etc.) y/o el cuerpo de la página. Desde el 2026-08-11 (código LIVE 2026-08-13) la plantilla vigente es **CAR — Contexto → Acción → Resultado** (reemplaza a la plantilla vieja de 8 secciones). La sección `## Resultado` reconoce una tabla con encabezados exactos `Métrica | Antes | Después` y la renderiza como tarjetas; cualquier otro encabezado cae a tabla normal sin romper el build. El cierre de la ficha **ya no va en el cuerpo**: es la propiedad independiente **"Reflexión"** (texto, opcional) — solo se muestra en el sitio si no está vacía. **Claude Code no redacta la narrativa CAR de una ficha**: Diego la redacta o dicta, Claude solo transcribe/estructura lo que él dé literalmente.

---

## 2 · Reemplazo en "## 3b · Editar fotos y logos que hoy viven fijos en el código"

**Texto actual (obsoleto):**

> Seis slots dados de alta hasta ahora: `foto-diego` (usada 3 veces: Hero, About, Colaboremos) y los 5 logos de la barra de confianza (`logo-heineken`, `logo-tec-de-monterrey`, `logo-incmty`, `logo-ebc`, `logo-fliphouse`).

**Texto corregido:**

> Cinco slots dados de alta hasta ahora: `foto-diego` (usada 3 veces: Hero, About, Colaboremos) y los 4 logos de la barra de confianza (`logo-heineken`, `logo-tec-de-monterrey`, `logo-incmty`, `logo-ebc`). **`logo-fliphouse` no se usa**: FlipHouse es el cliente real y confidencial detrás del caso SOFI/PropTech, y mostrar su logo en la barra de confianza del home desanonimiza el caso al instante (incidente detectado y corregido 2026-08-11). No dar de alta ni subir un logo a ese slot esperando que aparezca en el sitio — el código lo excluye a propósito.

---

## Nota aparte (no requiere edición del manual, solo verificación)

Si la base "🖼️ CMS Imágenes — Portafolio D" todavía tiene una fila `logo-fliphouse`
con `Estado = Listo` o con archivo subido, es inofensiva (el código nunca la
lee), pero puede confundir a futuro. Si Diego quiere, se puede archivar/borrar
esa fila para que la base refleje exactamente los 4 logos activos.
