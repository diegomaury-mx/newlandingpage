// index.html, portfolio/index.html, portfolio/sofi.html y el 404.html de raiz
// se eliminaron 2026-08-13 (codigo muerto, sin copia en public/, reemplazados
// por Astro: home/listado/SOFI ya son 100% src/pages/*.astro). Esta suite
// legacy (test:a11y / verify:visual) solo cubre lo que sigue siendo HTML
// estatico real. La cobertura Astro real vive en tests/qa/pages.astro.ts.
export const QA_PAGES = [
  { name: 'caso-heineken', path: '/portfolio/heineken.html' },
  { name: 'caso-redux-incmty', path: '/portfolio/redux-incmty.html' },
  { name: 'caso-innovation-systems', path: '/portfolio/innovation-systems.html' },
  { name: '404', path: '/public/404.html' },
];
