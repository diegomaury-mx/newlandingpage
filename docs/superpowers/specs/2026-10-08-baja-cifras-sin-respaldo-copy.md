# Baja de cifras sin respaldo en el Copy Oficial (2026-10-08)

Decisión de Diego: dar de baja tres claims del sitio que no tienen fila Vigente y Pública en la base Métricas ni aparecen en la sección 8 de SSOT - Identidad.

**Quién lo aplica:** Diego, a mano en Notion. `CLAUDE.md` §6 prohíbe editar "Copy Oficial" con `notion-update-page update_content` (bloque anidado con toggles; ya borró contenido hermano). Claude no redacta ni reemplaza copy.

## Cambios en Notion · Copy Oficial · diegomaury.mx (SSOT) · Versión Actual

| Dónde | Hoy | Quitar |
|---|---|---|
| S2 · Quién soy, línea de cifras | `**30+** proyectos liderados • **15+** años de trayectoria • **9,905** participantes en programas` | El primer segmento (`**30+** proyectos liderados •`). Queda `**15+** años de trayectoria • **9,905** participantes en programas` |
| S6 · Sistemas propios · HackSureste Ops | `3,000+ participantes (estimado) • 30+ programas • #1 en el sureste de México` | `• 30+ programas • #1 en el sureste de México`. Queda `3,000+ participantes (estimado)` |

Notas:
- `parseAbout` separa las cifras por `•` y acepta cualquier cantidad; con 2 cifras la banda sigue renderizando (verificar a 1440px y 390px después del rebuild).
- La línea `7+ en innovación y ecosistemas` que se ve en el sitio no sale de este texto de Notion; no se toca.
- "30+ programas" sigue permitido en `llms.txt` y `llms-full.txt` (la fila `hacksureste-programas-desarrollados` es Interna con superficie `llms.txt`). No se quita de ahí.

## Fuera del Copy, para decidir aparte

1. **Imagen OG de `/portfolio`:** el `ogImageAlt` de `src/pages/portfolio.astro:126` y `src/pages/en/portfolio.astro:135` dice "30+ programas, 900+ proyectos, 3,000+ emprendedores". Si `public/og/og-portfolio.png` muestra esas cifras, el alt es solo un reflejo y hay que rediseñar la imagen; cambiar el alt sin la imagen las desalinea.
2. **"400+ emprendedores formados" (REDUX, S6):** el SSOT dice "400+ universitarios formados en REDUX 2020", una sola edición, no total. La redacción nueva la decide Diego.
3. **"evaluados" vs "alcanzados":** SSOT - Identidad §8 (decisión del 14 ago 2026) prohíbe "proyectos evaluados" para HEINEKEN y exige "alcanzados o impactados". `llms.txt`, `llms-full.txt` y el slug/valor de la métrica `heineken-proyectos-evaluados` siguen usando "evaluated". No se verificó el texto exacto del claim canónico de esa fila.
