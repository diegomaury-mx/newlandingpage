const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TOTAL = 10;
const OUT_DIR = path.join(__dirname, 'exported_cards');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  const file = 'file:///' + path.resolve(__dirname, 'render_card.html').replace(/\\/g, '/');
  await page.goto(file, { waitUntil: 'networkidle0' });

  // Hide navigation controls before capturing
  await page.addStyleTag({ content: '#controls { display: none !important; }' });

  for (let i = 0; i < TOTAL; i++) {
    await page.evaluate(i => window.setCard(i), i);
    await new Promise(r => setTimeout(r, 300));
    const out = path.join(OUT_DIR, `card-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: out, type: 'png' });
    console.log(`✓ ${path.basename(out)}`);
  }

  await browser.close();
  console.log(`\nListo — ${TOTAL} tarjetas en ${OUT_DIR}`);
})();
