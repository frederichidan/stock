// Communiqué A4 : aperçu PNG (1240 px de large), PDF vectoriel et PNG 8K
const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  const w = Math.round(210 * 96 / 25.4), h = Math.round(297 * 96 / 25.4);
  let p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1240 / w });
  await p.goto('file://' + process.cwd() + '/communique.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'communique.png' });
  await p.pdf({ path: 'communique.pdf', width: '210mm', height: '297mm', printBackground: true, pageRanges: '1' });
  await b.close();
})();
