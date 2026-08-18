import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ASTRO_QA_PAGES } from './pages.astro';

for (const page of ASTRO_QA_PAGES) {
  test(`a11y (astro): ${page.name}`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: 'networkidle' });

    // .senja-embed (widget de testimonios) y los iframes de YouTube en
    // evidencia visual son contenido de terceros: Playwright/Axe sí logra
    // inspeccionar su DOM interno (cross-origin), pero su contraste no es
    // CSS nuestro y no podemos corregirlo. Se excluyen del gate de a11y.
    const results = await new AxeBuilder({ page: browserPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.senja-embed')
      .exclude('.evidence-video-embed iframe')
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
