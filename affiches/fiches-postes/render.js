// Fiches postes : PDF A4 (8 pages, vectoriel) + PNG 600 dpi par fiche (4961 x 7016), une page à la fois (pas de décalage sous-pixel)
const { chromium } = require(process.env.PW);
const NOMS = ['0-les-7-postes', '1-pilier-gauche', '2-talonneur', '3-pilier-droit', '4-demi-de-melee', '5-demi-d-ouverture', '6-centre', '7-ailier'];
const W = 210 * 96 / 25.4, H = 297 * 96 / 25.4, DPI = 600;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Math.ceil(W), height: Math.ceil(H) }, deviceScaleFactor: DPI / 96 });
  await p.goto('file://' + process.cwd() + '/fiches.html');
  await p.evaluate(() => window.ready());
  await p.pdf({ path: 'fiches-postes-rugby-a-7.pdf', width: '210mm', height: '297mm', printBackground: true });
  const n = await p.$$eval('.page', ps => ps.length);
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => document.querySelectorAll('.page').forEach((el, j) => { el.style.display = j === i ? 'flex' : 'none'; }), i);
    await p.screenshot({ path: `fiche-${NOMS[i]}.png`, clip: { x: 0, y: 0, width: W, height: H } });
  }
  await b.close();
})();
