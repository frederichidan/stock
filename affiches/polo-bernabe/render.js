// Polo RCA x Bernabé : planche 8K (7680 x 4320) + PDF + aperçu 1080p, et vues face / dos isolées (fond transparent)
const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  let p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 4 });
  await p.goto('file://' + process.cwd() + '/polo.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.ready());
  await p.screenshot({ path: 'polo-bernabe-8k.png' });
  await p.pdf({ path: 'polo-bernabe.pdf', width: '1920px', height: '1080px', printBackground: true, pageRanges: '1' });
  await p.close();
  p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + process.cwd() + '/polo.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.ready());
  await p.screenshot({ path: 'polo-bernabe-apercu.png' });
  await p.close();
  for (const v of ['front', 'back']) {
    p = await b.newPage({ viewport: { width: 1920, height: 1984 }, deviceScaleFactor: 2 });
    await p.goto('file://' + process.cwd() + '/polo.html?solo=' + v, { waitUntil: 'networkidle' });
    await p.evaluate(() => window.ready());
    await p.screenshot({ path: `polo-${v === 'front' ? 'face' : 'dos'}.png`, omitBackground: true });
    await p.close();
  }
  await b.close();
})();
