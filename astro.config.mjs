import { defineConfig } from 'astro/config';

// Scaffold de migracion (subproyecto Diego CMS).
//
// El sitio LIVE se sigue sirviendo del HTML estatico en la raiz del repo
// (index.html, portfolio/, cases/, assets/, cv/) mediante GitHub Pages desde
// master. Este proyecto Astro construye a dist/ y NO se despliega todavia:
// GitHub Actions se conecta en la tarea "CMS: configurar GitHub Actions y
// deploy automatico". No hay paridad todavia; el Home y los casos se
// construyen desde el CMS de Notion en tareas posteriores.
//
// La integracion @astrojs/sitemap y demas SEO se agregan en la tarea
// "CMS: generar SEO y archivos derivados desde Notion", no aqui.
export default defineConfig({
  site: 'https://diegomaury.mx',
  output: 'static',
});
