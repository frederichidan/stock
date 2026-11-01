// Bannière Facebook : 1640 x 624 (format recommandé) + version haute définition x2
const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  for (const [q, dsf, out] of [['', 1, 'banniere-facebook-1640x624.png'], ['', 2, 'banniere-facebook-3280x1248.png'],
                               ['?zones=1', 1, process.env.ZONES || '']]) {
    if (!out) continue;
    const p = await b.newPage({ viewport: { width: 1640, height: 624 }, deviceScaleFactor: dsf });
    await p.goto('file://' + process.cwd() + '/banniere.html' + q, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: out });
    await p.close();
  }
  await b.close();
})();
