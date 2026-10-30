// Rendu : PNG (≈ 300 dpi) + PDF pour A4 et 2:3, puis 8K (grand côté 7680 px)
const { chromium } = require(process.env.PW);
const mm = v => Math.round(v * 96 / 25.4);
(async () => {
  const b = await chromium.launch();
  for (const [html, base, w, h] of [['affiche.html', 'affiche', 210, 297], ['affiche-2x3.html', 'affiche-2x3', 200, 300]]) {
    for (const [scale, suffix] of [[3, ''], [7680 / mm(h), '-8k']]) {
      const p = await b.newPage({ viewport: { width: mm(w), height: mm(h) }, deviceScaleFactor: scale });
      await p.goto('file://' + process.cwd() + '/' + html, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: base + suffix + '.png' });
      if (!suffix) await p.pdf({ path: base + '.pdf', preferCSSPageSize: true, printBackground: true });
      await p.close();
    }
  }
  await b.close();
})();
