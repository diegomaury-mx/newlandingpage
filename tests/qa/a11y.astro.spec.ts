import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ASTRO_QA_PAGES } from './pages.astro';

for (const page of ASTRO_QA_PAGES) {
  test(`a11y (astro): ${page.name}`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: 'networkidle' });

    // .senja-embed (widget de testimonios) y los iframes de YouTube en
    // evidencia visual son contenido de terceros: Playwright/Axe sí logra
    // inspeccionar su DOM interno (cross-origin), pero su contraste/markup
    // no es nuestro y no podemos corregirlo. Se excluyen del gate de a11y.
    // .newsletter-embed iframe (Substack) ya no tiene pagina viva que lo use
    // (/reserva se archivo 2026-09-26), el exclude se deja inerte por si se
    // reactiva.
    const results = await new AxeBuilder({ page: browserPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.senja-embed')
      .exclude('.evidence-video-embed iframe')
      .exclude('.newsletter-embed iframe')
      .analyze();

    const seriousOrWorse = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (seriousOrWorse.length > 0) {
      const summary = seriousOrWorse
        .map((v) => `- [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodo(s))`)
        .join('\n');
      console.log(`\nViolaciones serias/críticas en ${page.name}:\n${summary}`);
    }

    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });
}
