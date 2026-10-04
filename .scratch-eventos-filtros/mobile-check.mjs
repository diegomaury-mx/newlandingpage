import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['Pixel 5'] });
const page = await context.newPage();
await page.goto('http://localhost:4322/eventos/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '.scratch-eventos-filtros/mobile-closed.png', fullPage: false });

// Open category dropdown
await page.click('[data-dropdown="category"] [data-dropdown-trigger]');
await page.waitForTimeout(200);
await page.screenshot({ path: '.scratch-eventos-filtros/mobile-open.png', fullPage: false });

// Check panel doesn't overflow viewport horizontally
const panel = await page.$('[data-dropdown="category"] [data-dropdown-panel]');
const box = await panel.boundingBox();
console.log('Panel box:', box);
console.log('Viewport width:', page.viewportSize().width);
console.log('Overflow right:', box.x + box.width - page.viewportSize().width);

await browser.close();
