import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// El sitio LIVE se construye con Astro (astro build) y se despliega via
// Cloudflare Pages (Git integration, build automatico en cada push a
// master). GitHub Actions/GitHub Pages fueron retirados el 2026-08-02.
//
// @astrojs/sitemap genera sitemap-index.xml (+ sitemap-0.xml) en dist/;
// robots.txt apunta ahi (no a sitemap.xml, que no existe). Sin filtro: todas
// las paginas Astro son contenido real del CMS, incluida la home.
export default defineConfig({
  site: 'https://diegomaury.mx',
  output: 'static',
  integrations: [sitemap()],
});
