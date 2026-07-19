export const meta = {
  name: 'auditoria-consistencia-sitio',
  description: 'Auditoria de consistencia de diegomaury.mx en 7 dimensiones con verificacion adversarial',
  phases: [
    { title: 'Auditar', detail: '7 dimensiones en paralelo' },
    { title: 'Verificar', detail: 'refutacion de hallazgos mayores/bloqueantes' },
  ],
}

const ROOT = 'C:/Users/DiegoLocal/Documents/Claude/Projects/Claude_Code/newlandingpage'

const CONTEXTO = `
Eres auditor tecnico READ-ONLY del sitio estatico diegomaury.mx. Repo: ${ROOT}.
PROHIBIDO modificar cualquier archivo. Solo lees y reportas.
Paginas LIVE (unicas auditables): index.html, portfolio/index.html, cases/sofi.html, cases/heineken.html, cases/redux-incmty.html, cases/innovation-systems.html.
Previews/respaldos (NO son live, solo verifica noindex/no-enlazado si tu dimension lo pide): prototipo-portafolio.html, index-canonico.html, backups/*.html, cases/fliphouse.html (stub de redireccion a sofi).
Ignora por completo: _ds_import/, .claude-design/, .superpowers/, .worktrees/, node_modules/, src/, docs/.

INVARIANTES INTENCIONALES — NO son hallazgos, no los reportes:
1. index.html usa tokens DS v2 INLINE (sin styles.css) — invariante documentado.
2. portfolio/index.html es AUTOCONTENIDO (CSS/JS inline, no usa styles.css ni main.js) — documentado en su propio head.
3. Los casos usan DS v3 via assets/css/styles.css + un bloque <style> local por pagina; .case-nav-footer y .case-divider se definen localmente POR PAGINA a proposito. No reportar como duplicacion.
4. cases/redux-incmty.html esta CONGELADO por decision explicita (REM-005): sus cifras (3,000+, >$4M, 12 convocatorias, 32 estados, bolsas, 200+/1,000+) NO se cuestionan ni se reportan.
5. El anchor ../#trabajo es el correcto (el bug #work ya fue corregido); solo reporta si encuentras "#work" de nuevo.
6. cases/heineken.html NO menciona 3,231 a proposito (REM-003); no reportar su ausencia ahi.
7. innovation-systems.html y redux-incmty.html no llevan data-metric a proposito.
Cifras muertas que NUNCA deben aparecer como claim de Diego: 9,905 atribuido a HEINEKEN (solo es valido como agregado INCmty), "200+ capacitados" REDUX, "5 ediciones", "36 registros".

Formato de cada hallazgo: pagina afectada, descripcion concreta, severidad (bloqueante = rompe funcionalidad/SEO critico/riesgo de datos; mayor = inconsistencia visible al usuario o gap del spec; menor = estilo/detalle), archivo con ruta relativa, numero de linea, y fix propuesto de 1-2 lineas. Se preciso con lineas: verifica con Read/Grep antes de reportar. Cero especulacion: si no lo viste en el archivo, no existe.
Tu texto final NO se muestra al usuario: devuelve solo el JSON estructurado.`

const DIMENSIONS = [
  {
    key: 'design-system',
    prompt: `${CONTEXTO}
DIMENSION: Design system y componentes.
Dado el invariante de 3 sistemas (index inline v2 / portfolio autocontenido / casos styles.css v3), audita CONSISTENCIA INTERNA:
- Entre las 4 paginas de caso: mismos tokens, misma estructura de secciones (contexto/problema/rol/acciones/resultados/evidencia/aprendizajes o equivalente), mismo markup de header/nav, hero, result-cards, badges, case-nav-footer. Reporta divergencias de markup para el mismo proposito.
- Estilos inline style="..." en las paginas live que dupliquen un token o rompan la hoja (cuenta y ubica los relevantes; ya sabemos que redux tiene ~14 y heineken 5).
- Reglas duras: max 3 cards por fila, max 2 CTAs por seccion, metricas con mayor peso visual que el texto de soporte. Verifica en CSS/markup.
- Divergencias que hagan que una pagina se vea "de otro sitio": tipografias distintas, paletas fuera de token, escala de headings inconsistente.`,
  },
  {
    key: 'enlaces',
    prompt: `${CONTEXTO}
DIMENSION: Enlaces y anclas.
- Extrae TODOS los href internos de las 6 paginas live + cases/fliphouse.html. Valida que cada archivo destino existe en el repo y que cada ancla (#id) existe en el HTML destino (para portfolio, es SPA hash-routed: #/ y #/caso/slug son rutas JS validas, verifica que los slugs de CASE_PAGES coinciden con los slugs de los datos).
- Verifica el stub cases/fliphouse.html: su enlace/redireccion a sofi.html funciona.
- Verifica que ninguna pagina live enlaza a previews/respaldos (prototipo-portafolio, index-canonico, backups/).
- Construye la matriz origen x destino entre {home, portfolio, sofi, heineken, redux, innovation} marcando enlaza/no-enlaza, y reporta caminos faltantes segun este spec: home->portfolio y ->4 casos; portfolio->4 casos y ->home; cada caso->home, ->portfolio y ->otros 3 casos.
- Grep de regresion: "#work" no debe existir en ninguna pagina live.
- Referencias a archivos huerfanos: src/href hacia archivos que no existen (ojo: portfolio/portfolio.css y portfolio.js estan borrados localmente; verifica que nada los referencia).
Devuelve la matriz en el campo extra ademas de los hallazgos.`,
  },
  {
    key: 'seo-llms',
    prompt: `${CONTEXTO}
DIMENSION: SEO y llms.txt.
- Por cada pagina live: title unico, meta description unica y no duplicada entre paginas, og:title/og:description/og:image presentes, twitter card, canonical correcto (https://diegomaury.mx/...), JSON-LD si existe (validar que no tenga cifras muertas).
- Verifica que cada og:image apunta a un archivo que existe en el repo.
- sitemap.xml: exactamente las 6 URLs live (ya verificado que si, confirma nada mas).
- robots/noindex: prototipo-portafolio.html, index-canonico.html y cases/fliphouse.html llevan noindex (verificado). CRITICO: revisa backups/index-v1-backup.html y backups/index-v2.html — se sirven publicos en Pages; reporta si NO llevan noindex.
- llms.txt y llms-full.txt: verifica que las paginas que listan coinciden con las 6 live (no fliphouse como caso vigente, no paginas retiradas) y que sus claims/cifras coinciden con lo publicado en el sitio.`,
  },
  {
    key: 'copy-metricas',
    prompt: `${CONTEXTO}
DIMENSION: Copy y metricas.
- Metricas ancla y su consistencia ENTRE paginas (excepto redux congelado): 3,231 proyectos evaluados, +600% regional, 9,905 participantes (solo como agregado INCmty), 89.5% cobertura SOFI, +500% leads, RODI +1,291% (siempre con calificador "modelado"/"cost avoidance"). Reporta toda cifra que difiera entre paginas o aparezca sin su calificador.
- NOTA ya detectada: 89.5% aparece en index.html pero NO en el HTML estatico de cases/sofi.html — revisa assets/data/sofi/sofi-metrics.js y el JS de sofi.html para determinar si se renderiza dinamicamente; si no se renderiza en ninguna parte de la pagina SOFI, es hallazgo mayor.
- Guiones largos (em dash —) en TEXTO VISIBLE al usuario de las 6 paginas live: lista cada uno con linea (los que estan en comentarios HTML/CSS/JS no visibles son menores; los de <title>/meta description cuentan como visibles en SERP/tab). Ya sabemos que hay ~24 en total.
- Frase de marca "Hagamos que las cosas pasen": presente en index y 4 casos, FALTA en portfolio/index.html (confirmalo y localiza donde estaria el lugar natural, ej. footer).
- Voz: deteccion de cifras muertas (lista en contexto) en cualquier pagina live.`,
  },
  {
    key: 'accesibilidad',
    prompt: `${CONTEXTO}
DIMENSION: Accesibilidad.
- Imagenes sin alt o con alt="" que NO sean decorativas: ya sabemos que cases/heineken.html linea ~371 tiene el banner hero con alt="" (es imagen significativa) y que index.html duplica la fila de logos con alt="" (marquee duplicado: si el segundo set lleva aria-hidden esta bien, verifica). Revisa todas.
- Un solo h1 por pagina: portfolio/index.html tiene 2 <h1> — localizalos y determina si es el patron SPA (uno por vista) o duplicado real en el DOM.
- Jerarquia de headings sin saltos (h1->h2->h3) por pagina.
- Estados focus visibles: busca :focus / :focus-visible en los CSS de las 3 familias (index inline, portfolio inline, styles.css). Reporta si los enlaces/botones no tienen focus visible.
- prefers-reduced-motion respetado en los tres sistemas JS/CSS.
- Contraste: revisa pares de tokens texto/fondo declarados (ej. --t2 #9A8CB0 sobre #0A0612, --t3, .work-n-l, metas grises sobre Ink) y calcula ratio WCAG aproximado; reporta los que bajen de 4.5:1 en texto normal.
- aria-label en navs, skip links si existen.`,
  },
  {
    key: 'performance-responsive',
    prompt: `${CONTEXTO}
DIMENSION: Performance y responsive (analisis estatico, sin browser).
- Pesa los assets: usa Bash (ls -l o du) sobre assets/img/ (cases/, evidencia/, logos/) y reporta imagenes >300KB usadas en paginas live, con la pagina que las usa. El hero banner de heineken (fetchpriority=high) es LCP candidato: reporta su peso.
- Verifica width/height explicitos en <img> (ya vimos que los logos del index no llevan) — layout shift.
- Fuentes: preconnect/display=swap presentes; numero de familias por pagina (max 2 razonable).
- Scripts: inventario por pagina (GTM, Clarity, data files sofi); reporta cualquier script o embed que no deberia estar (ej. embeds muertos, Senja placeholder).
- Responsive: en cada CSS (index inline, portfolio inline, styles.css) verifica media queries para 375/768/1280, cards a 1 columna en movil, grids con minmax que no generen scroll lateral, banda de metricas del hero sin overflow-x en 375px, CTA visible en primer fold (hero) en movil.
- loading=lazy en imagenes bajo el fold y eager/fetchpriority solo en hero.`,
  },
  {
    key: 'higiene',
    prompt: `${CONTEXTO}
DIMENSION: Higiene tecnica.
- Favicon: index.html lo declara (assets/img/isotipo-gradient.png — verifica que el archivo existe). Las 4 paginas de caso y portfolio NO declaran <link rel="icon"> — confirma y reporta (los navegadores pediran /favicon.ico; verifica si existe favicon.ico en la raiz).
- Pagina 404: GitHub Pages usa 404.html en la raiz. Verifica si existe; si no, hallazgo (sin 404 personalizada ni navegacion de regreso).
- Archivos huerfanos servidos en LIVE: portfolio/portfolio.css y portfolio/portfolio.js siguen en git (borrados solo localmente, sin commit) y ya nadie los referencia — confirma con git ls-files y grep. Igual revisa assets/ por archivos no referenciados desde ninguna pagina live (solo lista los evidentes, no exhaustivo).
- .nojekyll y CNAME presentes.
- Consola: revisa el JS inline de las 6 paginas por console.log/console.error residuales y por referencias a elementos que no existen (getElementById de ids inexistentes).
- Verifica que assets/data/sofi/*.js existen (sofi.html los carga con <script src>).`,
  },
]

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['pagina', 'hallazgo', 'severidad', 'archivo', 'fix'],
        properties: {
          pagina: { type: 'string' },
          hallazgo: { type: 'string' },
          severidad: { type: 'string', enum: ['bloqueante', 'mayor', 'menor'] },
          archivo: { type: 'string' },
          linea: { type: 'number' },
          fix: { type: 'string' },
        },
      },
    },
    extra: { type: 'string', description: 'Matriz de enlaces u observaciones adicionales en texto plano' },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['esReal', 'nota'],
  properties: {
    esReal: { type: 'boolean' },
    nota: { type: 'string' },
    lineaCorregida: { type: 'number' },
  },
}

const results = await pipeline(
  DIMENSIONS,
  (d) => agent(d.prompt, { label: `audit:${d.key}`, phase: 'Auditar', schema: FINDINGS_SCHEMA }),
  (review, d) => {
    if (!review) return null
    const importantes = review.findings.filter((f) => f.severidad !== 'menor')
    return parallel(
      importantes.map((f) => () =>
        agent(
          `${CONTEXTO}
Eres verificador ADVERSARIAL. Intenta REFUTAR este hallazgo de auditoria leyendo el archivo real. Si el archivo/linea no respalda el hallazgo, o si contradice un invariante intencional de la lista, esReal=false. Si la linea esta mal pero el hallazgo es real, esReal=true y devuelve lineaCorregida. Ante duda genuina, esReal=false.
HALLAZGO: [${f.severidad}] ${f.pagina} — ${f.hallazgo} (${f.archivo}${f.linea ? ':' + f.linea : ''}). Fix propuesto: ${f.fix}`,
          { label: `verify:${d.key}`, phase: 'Verificar', schema: VERDICT_SCHEMA, effort: 'low' }
        ).then((v) => ({ ...f, verdict: v }))
      )
    ).then((verified) => ({
      dimension: d.key,
      extra: review.extra || '',
      menores: review.findings.filter((f) => f.severidad === 'menor'),
      verificados: verified.filter(Boolean),
    }))
  }
)

const out = results.filter(Boolean)
log(`Dimensiones completadas: ${out.length}/7`)
return out