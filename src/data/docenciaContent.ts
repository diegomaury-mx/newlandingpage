/**
 * Contenido de /docencia, compartido entre la pagina HTML
 * (src/pages/docencia.astro) y su version Markdown
 * (src/pages/docencia/index.md.ts). Sin fuente Notion propia — texto fijo
 * escrito por Diego, extraido aqui para no duplicarlo entre ambas paginas.
 */
export interface AreaTema {
  area: string;
  temas: string;
  nivel: string;
  tipoSesion: string;
}

export interface CasoDestacado {
  tipo: 'Docencia formal' | 'Proyecto profesional';
  titulo: string;
  contexto: string;
  queHice: string;
  queAprende: string;
  evidenciaLabel: string;
  evidenciaUrl?: string;
}

export const heroEyebrow = 'Docencia y facilitación';
export const heroTitle = 'Doy clase desde la práctica, no desde la teoría sola';
export const heroLede =
  'Diseño e imparto módulos ejecutivos partiendo de programas de innovación y productos que construí yo mismo. Combino docencia formal en INFORSA, Tecnológico de Monterrey y Escuela Bancaria y Comercial con más de una década facilitando comunidades de emprendimiento.';

export const areas: AreaTema[] = [
  {
    area: 'Transformación Digital',
    temas: 'Adopción de tecnología e IA en procesos de negocio, roadmap de transformación',
    nivel: 'Ejecutivo',
    tipoSesion: 'Módulo de diplomado (INFORSA, 24h)',
  },
  {
    area: 'Gestión del Talento y Cultura',
    temas: 'Talento organizacional, gestión del cambio',
    nivel: 'Ejecutivo',
    tipoSesion: 'Módulo de diplomado (INFORSA)',
  },
  {
    area: 'Recursos Humanos',
    temas: 'Prácticas de RH aplicadas a alta dirección',
    nivel: 'Ejecutivo',
    tipoSesion: 'Diplomado (INFORSA, 16h)',
  },
  {
    area: 'Emprendimiento e Innovación',
    temas: 'Diseño de programas de innovación, ecosistemas de emprendimiento, hackathons',
    nivel: 'Intermedio-Avanzado',
    tipoSesion: 'Clase / taller / mentoría (Tec de Monterrey, EBC, HackSureste, REDUX, INCmty)',
  },
  {
    area: 'Diseño de producto e IA aplicada',
    temas: 'Construcción de producto de IA con métrica de negocio',
    nivel: 'Intermedio',
    tipoSesion: 'Estudio de caso propio (SOFI)',
  },
  {
    area: 'Storytelling y Pitch de negocio',
    temas: 'Fundamentos de storytelling, análisis de audiencia, técnicas de presentación',
    nivel: 'Introductorio-Intermedio',
    tipoSesion: 'Taller ("Dominando el Business Pitch y Storytelling")',
  },
  {
    area: 'Liderazgo y comunicación efectiva',
    temas: 'Liderazgo basado en metas, coaching, comunicación de equipos',
    nivel: 'Intermedio',
    tipoSesion: 'Taller ("Liderazgo basado en metas", "Comunicación y Management Efectivo")',
  },
];

export const casos: CasoDestacado[] = [
  {
    tipo: 'Docencia formal',
    titulo: 'INFORSA, Tecnológico de Monterrey y Escuela Bancaria y Comercial',
    contexto:
      'Tres instituciones me contrataron como docente y facilitador formal entre 2019 y 2026, en programas de nivel ejecutivo y de educación superior.',
    queHice:
      'Diseñé el contenido instruccional de los módulos de Transformación Digital y Gestión del Talento, y del Diplomado de Recursos Humanos en INFORSA, apoyándome en IA para el proceso de diseño. Facilité 24h más 16h en vivo. En Tec de Monterrey y EBC impartí Emprendimiento e Innovación como profesor de asignatura.',
    queAprende:
      'Cómo se diseña un módulo ejecutivo desde cero usando IA como herramienta de proceso, sin que sustituya el criterio pedagógico del facilitador.',
    evidenciaLabel: 'Evidencia textual (sin fotografía disponible): reflexión propia publicada + semblanza profesional.',
  },
  {
    tipo: 'Proyecto profesional',
    titulo: 'SOFI',
    contexto: 'Una empresa PropTech necesitaba un agente de IA (voz + WhatsApp) para su operación.',
    queHice:
      'Lideré el diseño y la implementación del agente de IA sobre HubSpot, Make, VAPI y Twilio, orquestando tres modelos: razonamiento, voz y transcripción.',
    queAprende:
      'Cómo construir y defender una métrica de negocio para un producto de IA cuando no existe auditoría externa, siendo explícito sobre qué se puede y qué no se puede probar.',
    evidenciaLabel: 'Ver evidencia completa (3 fotos + 1 video)',
    evidenciaUrl: '/portfolio/sofi',
  },
  {
    tipo: 'Proyecto profesional',
    titulo: 'REDUX',
    contexto:
      'Programa de capacitación para emprendedores con tres sub-programas (REDUX, REDUX Agro, REDUX Energy) entre 2020 y 2022.',
    queHice:
      'Diseñé y facilité el programa a lo largo de 5 ediciones (REDUX x2, REDUX Agro x2, REDUX Energy x1), con metodología publicada en abierto.',
    queAprende:
      'Cómo diseñar un currículum de emprendimiento replicable y documentarlo públicamente como evidencia de metodología, no solo de resultado.',
    evidenciaLabel: 'Ver evidencia completa (foto + playlist de 34 videos)',
    evidenciaUrl: '/portfolio/redux',
  },
  {
    tipo: 'Proyecto profesional',
    titulo: 'HackSureste',
    contexto: 'Hackathon de emprendimiento en la península de Yucatán, activo desde 2018 a la fecha.',
    queHice:
      'Dirigí el diseño y la operación del programa como parte de mi rol en gestión de programas de innovación.',
    queAprende:
      'Cómo sostener un programa de innovación regional en el tiempo, con evidencia operativa acumulada en vez de una sola edición aislada.',
    evidenciaLabel: 'Ver evidencia completa (foto + playlist de 22 videos)',
    evidenciaUrl: '/portfolio/hacksureste',
  },
];

export const diferenciadores: string[] = [
  'Diseño contenido docente desde programas y productos que yo mismo construí y medí, no desde casos de estudio de terceros.',
  'Uso IA de forma declarada y activa en el diseño instruccional, documentado en primera persona.',
  'Combino docencia formal de nivel ejecutivo (INFORSA) con docencia de educación superior (Tecnológico de Monterrey, EBC) y más de una década facilitando comunidades de emprendimiento.',
  'Defiendo mis métricas con honestidad sobre su nivel de evidencia, en vez de presentar cifras sin respaldo.',
  'Tengo experiencia de comunicación pública verificable en foros institucionales y de gobierno.',
];
