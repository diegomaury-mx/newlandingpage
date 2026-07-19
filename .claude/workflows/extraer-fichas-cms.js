export const meta = {
  name: 'extraer-fichas-cms',
  description: 'Fan-out: 15 agentes extraen y estructuran el contenido plantilla v2 de las fichas publicables del CMS Notion',
  phases: [{ title: 'Fichas', detail: 'un agente por ficha publicable del CMS' }],
}

const FICHA_SCHEMA = {
  type: 'object',
  required: ['title', 'capa', 'resumen', 'secciones', 'cifras'],
  properties: {
    title: { type: 'string' },
    capa: { type: 'string' },
    year: { type: 'string' },
    org: { type: 'string' },
    resumen: { type: 'string', description: 'Resumen de 1-2 frases del caso, en voz de Diego (primera persona), fiel al cuerpo de la ficha' },
    secciones: {
      type: 'object',
      properties: {
        contexto: { type: 'string' },
        problema: { type: 'string' },
        objetivo: { type: 'string' },
        rol: { type: 'string' },
        acciones: { type: 'array', items: { type: 'string' } },
        resultados: { type: 'array', items: { type: 'string' } },
        aprendizajes: { type: 'array', items: { type: 'string' } }
      }
    },
    evidencias: {
      type: 'array',
      description: 'Bloque de evidencia de la ficha: cada afirmación con su check',
      items: {
        type: 'object',
        required: ['afirmacion', 'verificada'],
        properties: {
          afirmacion: { type: 'string' },
          verificada: { type: 'boolean', description: 'true si la ficha la marca ✔, false si ✖' },
          artefacto: { type: 'string', description: 'URL o descripción del artefacto que la respalda, si existe' }
        }
      }
    },
    cifras: {
      type: 'array',
      description: 'TODAS las cifras cuantitativas que aparecen en el cuerpo de la ficha, textuales',
      items: {
        type: 'object',
        required: ['valor', 'contexto'],
        properties: {
          valor: { type: 'string', description: 'La cifra tal cual aparece, ej. "516", "+600%", "~250"' },
          contexto: { type: 'string', description: 'Qué mide y en qué periodo, textual de la ficha' },
          grado: { type: 'string', description: 'published (tercero nombrado) u own (registro/estimación propia), según lo declare la ficha' },
          fuente: { type: 'string', description: 'Fuente citada en la ficha, ej. "Informe Anual 2021 del Tec, p.415"' }
        }
      }
    }
  }
}

phase('Fichas')
const items = typeof args === 'string' ? JSON.parse(args) : args
const resultados = await parallel(items.map(f => () =>
  agent(
    `Extrae el contenido completo de una ficha del CMS de portafolio en Notion.\n\n` +
    `1. Usa ToolSearch con query "select:mcp__claude_ai_Notion__notion-fetch" para cargar la herramienta.\n` +
    `2. Haz notion-fetch del page id: ${f.id} (ficha "${f.title}", capa ${f.capa}).\n` +
    `3. El cuerpo de la ficha sigue la plantilla v2: Contexto, Problema, Objetivo, Mi rol, Acciones, Resultados, Evidencia (bloque con ✔/✖ por afirmación), Aprendizajes. Extrae cada sección FIELMENTE, sin inventar ni embellecer nada.\n` +
    `4. Lista TODAS las cifras cuantitativas del cuerpo (números, porcentajes, montos) con su contexto textual, grado de evidencia (published = tercero nombrado como el Informe Anual del Tec o prensa; own = registro o estimación propia) y fuente citada.\n` +
    `5. En el bloque de evidencia, captura cada afirmación con su check: ✔ = verificada true, ✖ = false.\n\n` +
    `REGLAS: no inventes datos que no estén en la ficha; si una sección no existe, devuélvela vacía. No parafrasees cifras (copia el valor textual). El resumen debe salir del propio cuerpo, en primera persona.`,
    { label: `ficha:${f.title}`, phase: 'Fichas', schema: FICHA_SCHEMA }
  )
))

const ok = resultados.filter(Boolean)
log(`${ok.length}/${items.length} fichas extraídas`)
return { fichas: ok, faltantes: items.filter((f, i) => !resultados[i]).map(f => f.title) }