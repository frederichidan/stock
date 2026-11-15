// Tenue officielle (mannequins + casquettes) : planche 8K + PDF + aperçu 1080p
const { chromium } = require(process.env.PW);
const F = 'tenue-mannequin.html';
(async () => {
  const b = await chromium.launch();
  let p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 4 });
  await p.goto('file://' + process.cwd() + '/' + F, { waitUntil: 'networkidle' }); await p.evaluate(() => window.ready());
  await p.screenshot({ path: 'tenue-polo-casquette-8k.png' });
  await p.pdf({ path: 'tenue-polo-casquette.pdf', width: '1920px', height: '1080px', printBackground: true, pageRanges: '1' });
  await p.close();
  p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + process.cwd() + '/' + F, { waitUntil: 'networkidle' }); await p.evaluate(() => window.ready());
  await p.screenshot({ path: 'tenue-polo-casquette-apercu.png' }); await p.close();
  await b.close();
})();
