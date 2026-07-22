import { test } from '@playwright/test';
import { QA_PAGES } from './pages';

for (const page of QA_PAGES) {
  test(`screenshot: ${page.name}`, async ({ page: browserPage }, testInfo) => {
    await browserPage.goto(page.path, { waitUntil: 'networkidle' });
    await browserPage.screenshot({
      path: `qa-output/screenshots/${testInfo.project.name}/${page.name}.png`,
      fullPage: true,
    });
  });
}
