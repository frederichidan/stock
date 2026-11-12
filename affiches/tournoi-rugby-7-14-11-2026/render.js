// Rendu : PNG (≈ 300 dpi) + PDF pour A4 et 2:3, puis 8K (grand côté 7680 px)
const { chromium } = require(process.env.PW);
const mm = v => Math.round(v * 96 / 25.4);
(async () => {
  const b = await chromium.launch();
  for (const [hash, base, w, h] of [['', 'affiche', 210, 297], ['#2x3', 'affiche-2x3', 200, 300]]) {
    for (const [scale, suffix] of [[3, ''], [7680 / mm(h), '-8k']]) {
      const p = await b.newPage({ viewport: { width: mm(w), height: mm(h) }, deviceScaleFactor: scale });
      await p.goto('file://' + process.cwd() + '/affiche.html' + hash, { waitUntil: 'networkidle' });
      await p.waitForSelector('body[data-ready]');
      await p.screenshot({ path: base + suffix + '.png' });
      if (!suffix) await p.pdf({ path: base + '.pdf', width: w + 'mm', height: h + 'mm', printBackground: true, pageRanges: '1' });
      await p.close();
    }
  }
  await b.close();
})();
