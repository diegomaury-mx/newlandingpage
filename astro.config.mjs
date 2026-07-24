import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Scaffold de migracion (subproyecto Diego CMS).
//
// El sitio LIVE se sigue sirviendo del HTML estatico en la raiz del repo
// (index.html, portfolio/, cases/, assets/, cv/) mediante GitHub Pages desde
// master. Este proyecto Astro construye a dist/ y NO se despliega todavia:
// GitHub Actions se conecta en la tarea "CMS: configurar GitHub Actions y
// deploy automatico".
//
// @astrojs/sitemap genera sitemap-index.xml en dist/ (no toca el sitemap del
// sitio LIVE en la raiz del repo, que sigue siendo estatico). Se excluye la
// ruta raiz (placeholder de scaffold, no contenido real del CMS).
export default defineConfig({
  site: 'https://diegomaury.mx',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://diegomaury.mx/',
    }),
  ],
});
