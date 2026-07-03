const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });

  const htmlFile = 'file:///' + path.resolve('cv/diego-maury-pmo.html').split('\\').join('/');
  await page.goto(htmlFile, { waitUntil: 'networkidle0' });

  const contentHeight = await page.evaluate(() => document.body.scrollHeight);
  const a4px = 1123;
  const scale = contentHeight > a4px ? Math.round((a4px / contentHeight) * 1000) / 1000 : 1;
  console.log('Content:', contentHeight + 'px | Scale:', scale);

  await page.pdf({
    path: 'cv/diego-maury-pmo.pdf',
    format: 'A4',
    printBackground: true,
    scale: scale,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  });

  await browser.close();
  console.log('PDF generado: cv/diego-maury-pmo.pdf');
})();
