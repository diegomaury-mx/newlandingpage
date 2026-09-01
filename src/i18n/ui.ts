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
    // Traduccion por href (no por label) del arreglo `site.navigation` — el
    // href de Notion/config.ts es la llave estable, el label puede cambiar.
    items: {
      "/#s2-quien-soy": "About me",
      "/portfolio": "Portfolio",
      "/#s5-como-trabajo": "How I work",
      "/#s8-siguiente-paso": "Contact",
    } as Record<string, string>,
  },
  case: {
    anchorMetricLabel: "Anchor metric",
    anchorMetricEmpty: "No anchor metric on record",
    sectionsAriaLabel: "Case sections",
    visualEvidence: "Visual evidence",
    videoEvidence: "Video evidence",
    evidencePhotoAlt: (index: number) => `View evidence photo ${index}`,
    reflection: "Reflection",
    caseArchive: "Archive for this case",
    emptyBody:
      "This case doesn't have its narrative body (Context, Action, Result) written yet.",
  },
  footer: {
    tagline: "Let's make things happen.",
    exploreTitle: 'Explore',
    contactTitle: 'Contact',
    legalAriaLabel: 'Legal information',
    location: 'Mexico City, Mexico',
    copyright: `© ${new Date().getFullYear()} Diego Maury. All rights reserved.`,
    // hrefs: /en para lo que SI tiene version EN real (home, portfolio);
    // el resto (docencia, legales) apunta a la unica version que existe
    // (espanol) — el label si va en ingles, la pagina destino no.
    explore: [
      { label: 'Portfolio', href: '/en/portfolio' },
      { label: 'Teaching', href: '/docencia' },
      { label: 'About me', href: '/en#s2-quien-soy' },
      { label: 'Newsletter', href: 'https://diegomaury.substack.com' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/diegomaury/' },
      { label: 'Instagram', href: 'https://www.instagram.com/diegomaury.mx' },
    ],
    contact: [
      { label: 'Email', href: 'mailto:dm@diegomaury.mx' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/diegomaury/' },
      { label: 'Schedule a call', href: 'https://calendar.notion.so/meet/diegomaurymx/5aad3vun' },
      { label: 'Download CV', href: '/cv/diego-maury-cv.pdf', download: true },
    ],
    legal: [
      { label: 'Privacy policy', href: '/politicas-privacidad' },
      { label: 'Terms and conditions', href: '/terminos-y-condiciones' },
    ],
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
    showcaseEyebrow: "Capabilities in operation",
    showcaseHeading: "What I know how to do, and where I did it.",
    showcaseProjectsWord: "projects",
    showcaseCapabilityWord: "capability",
    showcaseCapabilitiesWord: "capabilities",
    showcaseFilterAria: "Filter by capability",
    showcaseAll: "All",
    showcaseReadMore: "Read more +",
    showcaseClose: "Close",
    showcaseViewCase: "View case →",
    showcaseLoadMorePrefix: "Show the ",
    showcaseLoadMoreSuffix: " remaining",
    emptyInsignia: "No flagship cases published yet.",
    emptySupport: "No support cases published yet.",
    noPublishableImage: "No publishable image",
    scheduleCall: "Schedule a call",
    writeMe: "Write to me",
  },
} as const;
