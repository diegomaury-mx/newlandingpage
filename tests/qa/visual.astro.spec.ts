import { test } from '@playwright/test';
import { ASTRO_QA_PAGES } from './pages.astro';

for (const page of ASTRO_QA_PAGES) {
  test(`screenshot (astro): ${page.name}`, async ({ page: browserPage }, testInfo) => {
    await browserPage.goto(page.path, { waitUntil: 'networkidle' });
    await browserPage.screenshot({
      path: `qa-output/screenshots-astro/${testInfo.project.name}/${page.name}.png`,
      fullPage: true,
    });
  });
}
