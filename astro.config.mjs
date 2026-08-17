import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// El sitio LIVE se construye con Astro (astro build) y se despliega via
// Cloudflare Pages (Git integration, build automatico en cada push a
// master). GitHub Actions/GitHub Pages fueron retirados el 2026-08-02.
//
// @astrojs/sitemap genera sitemap-index.xml (+ sitemap-0.xml) en dist/;
// robots.txt apunta ahi (no a sitemap.xml, que no existe). Sin filtro: todas
// las paginas Astro son contenido real del CMS, incluida la home.
// i18n: ES es el locale por defecto sin prefijo (diegomaury.mx/portfolio);
// EN vive bajo /en/* (diegomaury.mx/en/portfolio). Ver src/utils/locale.ts
// para la logica de reescritura de paths entre locales (toggle del navbar).
export default defineConfig({
  site: 'https://diegomaury.mx',
  output: 'static',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
