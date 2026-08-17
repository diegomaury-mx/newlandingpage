// Lista verificada contra el build real (astro build) el 2026-08-13. Los
// slugs vienen de slugify(title) en Notion (SSOT - Portafolio Proyectos) —
// si Diego renombra un caso, el slug cambia y esta lista se desincroniza en
// silencio (Playwright solo lo revela como 404 al correr la suite).
// idealab-by-hacksureste se retiro: la ficha se archivo y se fusiono dentro
// de HackSureste el 2026-08-13 (ya no genera pagina propia).
const ES_ONLY_PAGES = [
  { name: 'docencia', path: '/docencia/' },
  { name: 'politicas-privacidad', path: '/politicas-privacidad/' },
  { name: 'terminos-y-condiciones', path: '/terminos-y-condiciones/' },
  { name: '404', path: '/404.html' },
];

// Paginas con version /en/* real (home, portfolio, casos del CMS — ver
// sesion 2026-08-17, traduccion via DeepL con fallback a espanol). Docencia
// y legales quedan fuera a proposito: no tienen contraparte EN todavia.
const BILINGUAL_PAGES = [
  { name: 'home', path: '/' },
  { name: 'portfolio-index', path: '/portfolio/' },
  { name: 'caso-sofi', path: '/portfolio/sofi/' },
  { name: 'caso-heineken-green-challenge', path: '/portfolio/heineken-green-challenge/' },
  { name: 'caso-redux', path: '/portfolio/redux/' },
  { name: 'caso-hacksureste', path: '/portfolio/hacksureste/' },
  { name: 'caso-brain-mexico', path: '/portfolio/brain-mexico/' },
  { name: 'caso-btem', path: '/portfolio/btem/' },
  { name: 'caso-freeland', path: '/portfolio/freeland/' },
  { name: 'caso-g20-yea-model', path: '/portfolio/g20-yea-model/' },
  { name: 'caso-hacksureste-carmen-2019', path: '/portfolio/hacksureste-ciudad-del-carmen-2019/' },
  { name: 'caso-haz-que-pase-substack', path: '/portfolio/haz-que-pase-substack/' },
  { name: 'caso-inc-prototype', path: '/portfolio/inc-prototype/' },
  { name: 'caso-incmty-accelerator', path: '/portfolio/incmty-accelerator/' },
  { name: 'caso-incmty-b-challenge', path: '/portfolio/incmty-b-challenge/' },
  { name: 'caso-incmty-disruptair-2022', path: '/portfolio/incmty-disruptair-challenge-2022/' },
];

function enVariant(page: { name: string; path: string }): { name: string; path: string } {
  return {
    name: `${page.name}-en`,
    path: page.path === '/' ? '/en/' : `/en${page.path}`,
  };
}

export const ASTRO_QA_PAGES = [
  ...BILINGUAL_PAGES,
  ...BILINGUAL_PAGES.map(enVariant),
  ...ES_ONLY_PAGES,
];
