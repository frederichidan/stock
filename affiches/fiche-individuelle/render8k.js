// usage: node render8k.js <html> <out.png> <largeur_mm> <hauteur_mm>  -> grand côté = 7680 px
const { chromium } = require(process.env.PW);
(async () => {
  const [html, out, wmm, hmm] = process.argv.slice(2);
  const w = Math.round(+wmm * 96 / 25.4), h = Math.round(+hmm * 96 / 25.4);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 7680 / h });
  await p.goto('file://' + process.cwd() + '/' + html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out });
  await b.close();
})();
