/**
 * Strings de UI fijos para la version /en/* del sitio (nav, botones, labels
 * estructurales). El contenido dinamico del CMS (casos, metricas, home
 * S1-S8) NO vive aqui — se traduce via DeepL (ver notionLoaders.ts /
 * deeplTranslationCache.ts) o, en el caso del home, a nivel de hoja en
 * index.astro. Este diccionario es solo para texto que el codigo ya escribe
 * literal en espanol (no viene de Notion).
 */
export const uiEn = {
  nav: {
    ariaLabel: "Main navigation",
    ctaLabel: "Let's make things happen",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleToLabel: "ES",
  },
  case: {
    anchorMetricLabel: "Anchor metric",
    anchorMetricEmpty: "No anchor metric on record",
    sectionsAriaLabel: "Case sections",
    visualEvidence: "Visual evidence",
    evidencePhotoAlt: (index: number) => `View evidence photo ${index}`,
    reflection: "Reflection",
    caseArchive: "Archive for this case",
    emptyBody:
      "This case doesn't have its narrative body (Context, Action, Result) written yet.",
  },
  home: {
    trustLabel: "I've worked with",
    deliverHeading: "What I deliver",
    viewFullCase: 'View full case →',
    statAccumulatedTrajectory: 'Accumulated trajectory, own figure',
    statInnovationEcosystems: '7+ in innovation and ecosystems',
    fallbackTitle: 'Diego Maury · Strategic Program Director',
    fallbackDescription:
      'Strategic Program Director and innovation consultant: I design programs and systems that turn strategy into execution.',
    knowsAbout: [
      'Innovation program leadership',
      'RevOps',
      'Entrepreneurship ecosystems in LATAM',
      'Innovation consulting',
    ],
    problemDiagramAlt: 'Diagram: strategy and operations connected by a system',
  },
  portfolio: {
    byTheNumbers: "By the numbers",
    projectsPublished: "projects published",
    distinctOrganizations: "distinct organizations",
    expertiseFields: "fields of expertise",
    yearsExperienceLabel: "years in innovation and ecosystems",
    impactDocumented: "Documented impact",
    supportPrefix: "Support",
    supportSuffix: "projects",
    emptyInsignia: "No flagship cases published yet.",
    emptySupport: "No support cases published yet.",
    noPublishableImage: "No publishable image",
    scheduleCall: "Schedule a call",
    writeMe: "Write to me",
  },
} as const;
