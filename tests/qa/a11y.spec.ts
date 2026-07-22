import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { QA_PAGES } from './pages';

for (const page of QA_PAGES) {
  test(`a11y: ${page.name}`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page: browserPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
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
