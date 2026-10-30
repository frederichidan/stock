// Polos bleu et blanc : planche 8K + PDF + aperçu, et 4 vues isolées sur fond transparent
const { chromium } = require(process.env.PW);
const F = 'polos-maillots.html';
(async () => {
  const b = await chromium.launch();
  let p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 4 });
  await p.goto('file://' + process.cwd() + '/' + F, { waitUntil: 'networkidle' }); await p.evaluate(() => window.ready());
  await p.screenshot({ path: 'polos-bleu-blanc-8k.png' });
  await p.pdf({ path: 'polos-bleu-blanc.pdf', width: '1920px', height: '1080px', printBackground: true, pageRanges: '1' });
  await p.close();
  p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + process.cwd() + '/' + F, { waitUntil: 'networkidle' }); await p.evaluate(() => window.ready());
  await p.screenshot({ path: 'polos-bleu-blanc-apercu.png' }); await p.close();
  for (const v of ['bleu-face', 'bleu-dos', 'blanc-face', 'blanc-dos']) {
    p = await b.newPage({ viewport: { width: 1920, height: 1980 }, deviceScaleFactor: 2 });
    await p.goto('file://' + process.cwd() + '/' + F + '?solo=' + v, { waitUntil: 'networkidle' }); await p.evaluate(() => window.ready());
    await p.screenshot({ path: `polo-${v}.png`, omitBackground: true }); await p.close();
  }
  await b.close();
})();
