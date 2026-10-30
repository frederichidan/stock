// Planche maillots : PNG 8K (7680 x 4320) + PDF vectoriel
const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 4 });
  await p.goto('file://' + process.cwd() + '/maillots.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: 'maillots-8k.png' });
  await p.pdf({ path: 'maillots.pdf', width: '1920px', height: '1080px', printBackground: true, pageRanges: '1' });
  await b.close();
})();
